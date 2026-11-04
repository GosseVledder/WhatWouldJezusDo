import { badgeScoreOf, normalizeLang, type BadgeScore, type WwjdEvaluation } from '@wwjd/core';

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
  const index = await readScoreIndex();
  index[key] = badgeScoreOf(evaluation);
  await browser.storage.local.set({ [key]: evaluation, [SCORE_INDEX]: index });
}

/**
 * Small index of the scores per cached evaluation (cache key → score), so thumbnail badges can
 * be shown without loading every full evaluation. Built once from the cache when missing.
 */
export const SCORE_INDEX = 'scoreIndex';

async function readScoreIndex(): Promise<Record<string, BadgeScore>> {
  const stored = await browser.storage.local.get(SCORE_INDEX);
  const index = stored[SCORE_INDEX] as Record<string, BadgeScore> | undefined;
  if (index && typeof index === 'object') return index;
  const keys = await cachedEvaluationKeys();
  const rebuilt: Record<string, BadgeScore> = {};
  if (keys.length) {
    const all = await browser.storage.local.get(keys);
    for (const k of keys) {
      const ev = all[k] as WwjdEvaluation | undefined;
      if (ev && typeof ev.finalScore === 'number') rebuilt[k] = badgeScoreOf(ev);
    }
  }
  await browser.storage.local.set({ [SCORE_INDEX]: rebuilt });
  return rebuilt;
}

/** Scores of every video analysed in this language, by video ID. */
export async function getScoresForLanguage(taal = 'nl'): Promise<Map<string, BadgeScore>> {
  const index = await readScoreIndex();
  const out = new Map<string, BadgeScore>();
  const norm = normalizeLang(taal);
  for (const [key, score] of Object.entries(index)) {
    const m = key.match(/^eval_([A-Za-z0-9_-]{11})(?:_([a-z]{2}))?$/);
    if (m?.[1] && (m[2] ?? 'nl') === norm) out.set(m[1], score);
  }
  return out;
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
  await browser.storage.local.remove([...keys, SCORE_INDEX]);
  return keys.length;
}
