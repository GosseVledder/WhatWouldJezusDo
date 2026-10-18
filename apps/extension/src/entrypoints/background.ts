import {
  checkForUpdate,
  evaluateVideo,
  getTranscriptById,
  testClaudeConnection,
  testFactCheckConnection,
  testGeminiConnection,
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
import { getApiKeyForProvider, getFactCheckApiKey } from '../storage/secrets';
import { getSettings, saveSettings } from '../storage/settings';

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
  browser.runtime.onInstalled.addListener(() => void reopenOptionsAfterReload());

  browser.action.onClicked.addListener(() => {
    void browser.runtime.openOptionsPage();
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message as { type: string; [key: string]: unknown })
      .then((res) => sendResponse({ ok: true, data: res }))
      .catch((err) => sendResponse({ ok: false, error: (err as Error).message }));
    return true; // async response
  });
});

async function handleMessage(msg: { type: string; [key: string]: unknown }): Promise<unknown> {
  switch (msg.type) {
    case 'getSettings':
      return getSettings();

    case 'saveSettings':
      return saveSettings((msg.settings as Partial<WwjdSettings>) ?? {});

    case 'openOptions':
      await browser.runtime.openOptionsPage();
      return { success: true };

    case 'getCached': {
      const videoId = String(msg.videoId);
      return getCachedEvaluation(videoId);
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
      const apiKey = String(msg.apiKey ?? '').trim();
      const model = String(msg.model ?? '').trim();
      if (!apiKey) {
        return { ok: false, error: 'Vul eerst een API-sleutel in.' };
      }
      try {
        if (kind === 'factcheck') {
          await testFactCheckConnection(apiKey, { timeoutMs: 15_000 });
        } else if (kind === 'claude') {
          await testClaudeConnection({ apiKey, model, timeoutMs: 15_000 });
        } else {
          await testGeminiConnection({ apiKey, model, timeoutMs: 15_000 });
        }
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    }

    case 'evaluate': {
      const videoId = String(msg.videoId);

      if (!msg.force) {
        const cached = await getCachedEvaluation(videoId);
        if (cached) return cached;
        const existing = inflightEvaluations.get(videoId);
        if (existing) return existing;
      }

      const job = (async (): Promise<WwjdEvaluation> => {
        const settings = await getSettings();
        if (!settings.actief) {
          throw new Error('WWJD analyse is uitgeschakeld in de extensie-instellingen.');
        }

        const provider = settings.provider;
        const model = settings.models[provider];
        const apiKey = await getApiKeyForProvider(provider);

        if (!apiKey) {
          throw new Error(
            `Geen API-sleutel gevonden voor ${provider === 'claude' ? 'Claude' : 'Gemini'}. Vul je sleutel in via de WWJD-instellingen.`,
          );
        }

        const factCheckApiKey = settings.googleFactCheckActief
          ? await getFactCheckApiKey()
          : undefined;

        await rulesReadyPromise;

        const transcriptRes = await getTranscriptById(videoId);
        if (!transcriptRes.transcript) {
          throw new Error(
            `Kon geen transcript ophalen voor deze video (${transcriptRes.reden ?? 'geen ondertitels'}).`,
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
            factCheckApiKey,
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

      inflightEvaluations.set(videoId, job);
      try {
        return await job;
      } finally {
        if (inflightEvaluations.get(videoId) === job) {
          inflightEvaluations.delete(videoId);
        }
      }
    }

    default:
      throw new Error(`Onbekend berichttype: ${msg.type}`);
  }
}
