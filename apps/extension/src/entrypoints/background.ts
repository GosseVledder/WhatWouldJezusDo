import {
  checkForUpdate,
  errorCodeOf,
  checkKey,
  evaluateVideo,
  getTranscriptById,
  isUiLang,
  messages,
  normalizeLang,
  setupStatus,
  type AnalysisStep,
  type CallLog,
  type KeyKind,
  type WwjdEvaluation,
  type WwjdSettings,
} from '@wwjd/core';
import {
  cachedEvaluationKeys,
  clearCache,
  getCachedEvaluation,
  setCachedEvaluation,
} from '../storage/cache';
import { appendDebugLog, clearDebugLog, getDebugLog } from '../storage/debuglog';
import { getApiKeyForProvider, getApiKeys, getFactCheckApiKey } from '../storage/secrets';
import { getSettings, saveSettings } from '../storage/settings';
import { STORE_BUILD } from '../buildMode';

const RULE_ID = 1;
const REOPEN_OPTIONS_KEY = 'reopenOptions';
let rulesReadyPromise: Promise<unknown> = Promise.resolve();
const inflightEvaluations = new Map<string, Promise<WwjdEvaluation>>();

/**
 * YouTube answers 403 to InnerTube player requests whose Origin is the extension
 * (chrome-extension://…). This session rule rewrites the Origin of the extension's
 * own requests to the player and caption endpoints to https://www.youtube.com.
 */
async function installYoutubeRequestRules(): Promise<void> {
  const dnr = browser.declarativeNetRequest;
  if (!dnr?.updateSessionRules) return;
  await dnr.updateSessionRules({
    removeRuleIds: [RULE_ID],
    addRules: [
      {
        id: RULE_ID,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: [
            { header: 'origin', operation: 'set', value: 'https://www.youtube.com' },
          ],
        },
        condition: {
          regexFilter: '^https://www\\.youtube\\.com/(youtubei/v1/player|api/timedtext)',
          initiatorDomains: [browser.runtime.id],
          resourceTypes: ['xmlhttprequest', 'other'],
        },
      },
    ],
  });
}

async function reopenOptionsAfterReload(): Promise<void> {
  const flag = await browser.storage.local.get(REOPEN_OPTIONS_KEY);
  if (!flag[REOPEN_OPTIONS_KEY]) return;
  await browser.storage.local.remove(REOPEN_OPTIONS_KEY);
  await browser.runtime.openOptionsPage();
}

export default defineBackground(() => {
  rulesReadyPromise = installYoutubeRequestRules().catch((e) =>
    console.warn('[wwjd] request rules', e),
  );
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') void firstInstall();
    else void reopenOptionsAfterReload();
  });

  // Toolbar icon: the welcome page while setup is unfinished, otherwise the settings.
  browser.action.onClicked.addListener(() => {
    void isSetupComplete().then((done) => (done ? browser.runtime.openOptionsPage() : openWelcome()));
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message as { type: string; [key: string]: unknown }, sender.tab?.id)
      .then((res) => sendResponse({ ok: true, data: res }))
      .catch((err) =>
        // The code lets the panel word the error in the user's language.
        sendResponse({ ok: false, error: (err as Error).message, code: errorCodeOf(err) }),
      );
    return true; // async response
  });
});

const WELCOME_PATH = '/welcome.html';

async function openWelcome(): Promise<void> {
  await browser.tabs.create({ url: browser.runtime.getURL(WELCOME_PATH) });
}

async function isSetupComplete(): Promise<boolean> {
  const [keys, settings] = await Promise.all([getApiKeys(), getSettings()]);
  return setupStatus(keys, settings.provider).complete;
}

/** First install: interface language from the browser, panel on, then the welcome page. */
async function firstInstall(): Promise<void> {
  const stored = await browser.storage.local.get('settings');
  if (!stored.settings) {
    const ui = (browser.i18n?.getUILanguage?.() ?? navigator.language ?? 'nl').split('-')[0]!;
    await saveSettings({ taal: isUiLang(ui) ? ui : 'en', actief: true });
  }
  await openWelcome();
}

async function handleMessage(
  msg: { type: string; [key: string]: unknown },
  tabId?: number,
): Promise<unknown> {
  switch (msg.type) {
    case 'getSettings':
      return getSettings();

    case 'saveSettings':
      return saveSettings((msg.settings as Partial<WwjdSettings>) ?? {});

    case 'openOptions':
      await browser.runtime.openOptionsPage();
      return { success: true };

    case 'openWelcome':
      await openWelcome();
      return { success: true };

    case 'setupStatus': {
      const [keys, settings] = await Promise.all([getApiKeys(), getSettings()]);
      return setupStatus(keys, settings.provider);
    }

    case 'getCached': {
      const videoId = String(msg.videoId);
      const taal =
        typeof msg.taal === 'string' ? msg.taal : (await getSettings()).taal;
      return getCachedEvaluation(videoId, taal);
    }

    case 'cacheStats':
      return { aantal: (await cachedEvaluationKeys()).length };

    case 'clearCache':
      return { verwijderd: await clearCache() };

    case 'getDebugLog':
      return getDebugLog();

    case 'clearDebugLog':
      await clearDebugLog();
      return true;

    case 'checkUpdate': {
      if (STORE_BUILD) return { ok: false, error: 'Updates come from the store.' };
      try {
        const current = browser.runtime.getManifest().version;
        const check = await checkForUpdate({ target: 'extension', current });
        return { ok: true, check };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    }

    case 'testConnection': {
      const kind = msg.kind as KeyKind;
      const model = String(msg.model ?? '').trim();
      return checkKey(kind, String(msg.apiKey ?? ''), {
        model: model || undefined,
        timeoutMs: 15_000,
      });
    }

    case 'evaluate': {
      const videoId = String(msg.videoId);
      const settings = await getSettings();
      const taal = normalizeLang(settings.taal);
      const t = messages(taal);
      const jobKey = `${videoId}:${taal}`;

      if (!msg.force) {
        const cached = await getCachedEvaluation(videoId, taal);
        if (cached) return cached;
        const existing = inflightEvaluations.get(jobKey);
        if (existing) return existing;
      }

      const job = (async (): Promise<WwjdEvaluation> => {
        if (!settings.actief) {
          throw new Error(t.extension.disabledError);
        }

        const provider = settings.provider;
        const model = settings.models[provider];
        const apiKey = await getApiKeyForProvider(provider);

        if (!apiKey) {
          throw new Error(
            t.extension.noKeyError(provider === 'claude' ? 'Claude' : 'Gemini'),
          );
        }

        const factCheckApiKey = settings.googleFactCheckActief
          ? await getFactCheckApiKey()
          : undefined;

        // Step list in the panel of the tab that asked
        const progress = (step: AnalysisStep) => {
          if (tabId === undefined) return;
          void browser.tabs
            .sendMessage(tabId, { type: 'progress', videoId, step, factcheck: Boolean(factCheckApiKey) })
            .catch(() => undefined);
        };
        progress('transcript');

        await rulesReadyPromise;

        const transcriptRes = await getTranscriptById(videoId);
        if (!transcriptRes.transcript) {
          throw new Error(
            t.extension.noTranscriptError(transcriptRes.reden ?? 'no captions'),
          );
        }

        const evaluation = await evaluateVideo(
          {
            videoId,
            transcript: transcriptRes.transcript,
            meta: transcriptRes.info.meta,
          },
          provider,
          {
            apiKey,
            model,
            taal,
            factCheckApiKey,
            onProgress: progress,
            onCall: (entry: CallLog) => {
              const line = { ...entry, videoId, tijd: new Date().toISOString() };
              if (settings.debugLog) {
                console.info('[wwjd]', line);
                void appendDebugLog(line);
              }
            },
          },
        );

        await setCachedEvaluation(evaluation);
        return evaluation;
      })();

      inflightEvaluations.set(jobKey, job);
      try {
        return await job;
      } finally {
        if (inflightEvaluations.get(jobKey) === job) {
          inflightEvaluations.delete(jobKey);
        }
      }
    }

    default:
      throw new Error(`Onbekend berichttype: ${msg.type}`);
  }
}
