import { normalizeLang, type WwjdEvaluation } from '@wwjd/core';

const PREFIX = 'eval_';

export const cacheKey = (videoId: string, taal = 'nl') => {
  const norm = normalizeLang(taal);
  return norm === 'nl' ? `${PREFIX}${videoId}` : `${PREFIX}${videoId}_${norm}`;
};

export async function getCachedEvaluation(
  videoId: string,
  taal = 'nl',
): Promise<WwjdEvaluation | null> {
  const key = cacheKey(videoId, taal);
  const stored = await browser.storage.local.get(key);
  const val = stored[key] as WwjdEvaluation | undefined;
  return val && typeof val === 'object' && typeof val.finalScore === 'number' ? val : null;
}

export async function setCachedEvaluation(evaluation: WwjdEvaluation): Promise<void> {
  const key = cacheKey(evaluation.videoId, evaluation.taal ?? 'nl');
  await browser.storage.local.set({ [key]: evaluation });
}

async function allKeys(): Promise<string[]> {
  const local = browser.storage.local as typeof browser.storage.local & {
    getKeys?: () => Promise<string[]>;
  };
  if (typeof local.getKeys === 'function') {
    try {
      return await local.getKeys();
    } catch {
      // fallback
    }
  }
  return Object.keys(await browser.storage.local.get(null));
}

export async function cachedEvaluationKeys(): Promise<string[]> {
  return (await allKeys()).filter((k) => k.startsWith(PREFIX));
}

export async function clearCache(): Promise<number> {
  const keys = await cachedEvaluationKeys();
  if (keys.length) await browser.storage.local.remove(keys);
  return keys.length;
}
