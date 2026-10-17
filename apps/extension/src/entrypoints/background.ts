import {
  evaluateVideo,
  getTranscriptById,
  type WwjdEvaluation,
  type WwjdSettings,
  DEFAULT_WWJD_SETTINGS,
} from '@wwjd/core';
import { getApiKeyForProvider, getFactCheckApiKey } from '../storage/secrets';

export default defineBackground(() => {
  browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
  });

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message)
      .then((res) => sendResponse({ ok: true, data: res }))
      .catch((err) => sendResponse({ ok: false, error: (err as Error).message }));
    return true; // async response
  });
});

async function getStoredSettings(): Promise<WwjdSettings> {
  const stored = await browser.storage.local.get('settings');
  return (stored.settings as WwjdSettings) || DEFAULT_WWJD_SETTINGS;
}

async function handleMessage(msg: { type: string; [key: string]: unknown }): Promise<unknown> {
  if (msg.type === 'getSettings') {
    return getStoredSettings();
  }

  if (msg.type === 'saveSettings') {
    await browser.storage.local.set({ settings: msg.settings });
    return { success: true };
  }

  if (msg.type === 'openOptions') {
    browser.runtime.openOptionsPage();
    return { success: true };
  }

  if (msg.type === 'getCached') {
    const videoId = String(msg.videoId);
    const key = `eval_${videoId}`;
    const stored = await browser.storage.local.get(key);
    return stored[key] || null;
  }

  if (msg.type === 'evaluate') {
    const videoId = String(msg.videoId);
    const key = `eval_${videoId}`;

    // Cache check
    if (!msg.force) {
      const stored = await browser.storage.local.get(key);
      if (stored[key]) {
        return stored[key] as WwjdEvaluation;
      }
    }

    const settings = await getStoredSettings();
    if (!settings.actief) {
      throw new Error('WWJD analyse is uitgeschakeld in de extensie-instellingen.');
    }

    const provider = settings.provider;
    const model = settings.models[provider];
    const apiKey = await getApiKeyForProvider(provider);

    if (!apiKey) {
      throw new Error(
        `Geen API-sleutel gevonden voor ${provider.toUpperCase()}. Vul je sleutel in via de WWJD-optiespagina.`,
      );
    }

    const factCheckApiKey = settings.googleFactCheckActief ? await getFactCheckApiKey() : undefined;

    // Fetch transcript
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
      },
    );

    // Save in cache
    await browser.storage.local.set({ [key]: evaluation });
    return evaluation;
  }

  throw new Error(`Onbekend berichttype: ${msg.type}`);
}
