// Settings, API keys and the evaluation cache on top of a KeyValue store.
import {
  normalizeLang,
  parseWwjdSettings,
  type KeyKind,
  type WwjdEvaluation,
  type WwjdSettings,
} from '@wwjd/core';
import { readJson, type KeyValue } from './kv';

const SETTINGS_KEY = 'settings';

export interface SettingsStore {
  get(): Promise<WwjdSettings>;
  save(patch: Partial<WwjdSettings>): Promise<WwjdSettings>;
}

export function createSettingsStore(kv: KeyValue): SettingsStore {
  const get = async () => parseWwjdSettings(readJson(await kv.get(SETTINGS_KEY)));
  return {
    get,
    async save(patch) {
      const next = parseWwjdSettings({ ...(await get()), ...patch });
      await kv.set(SETTINGS_KEY, JSON.stringify(next));
      return next;
    },
  };
}

export interface KeyStore {
  get(): Promise<Record<KeyKind, string>>;
  set(kind: KeyKind, value: string): Promise<void>;
}

const keyName = (k: KeyKind) => `apiKey.${k}`;

export function createKeyStore(kv: KeyValue): KeyStore {
  return {
    async get() {
      const [claude, gemini, factcheck] = await Promise.all([
        kv.get(keyName('claude')),
        kv.get(keyName('gemini')),
        kv.get(keyName('factcheck')),
      ]);
      return {
        claude: claude ?? '',
        gemini: gemini ?? '',
        factcheck: factcheck ?? '',
      };
    },
    async set(kind, value) {
      const v = value.trim();
      if (v) await kv.set(keyName(kind), v);
      else await kv.remove(keyName(kind));
    },
  };
}

export interface RecentEntry {
  videoId: string;
  taal?: string;
  titel: string;
  score: number;
  /** ISO time the evaluation was stored. */
  op: string;
}

export interface EvaluationCache {
  get(videoId: string, taal?: string): Promise<WwjdEvaluation | null>;
  set(evaluation: WwjdEvaluation): Promise<void>;
  /** Newest first. */
  recent(): Promise<RecentEntry[]>;
  clear(): Promise<number>;
}

const INDEX_KEY = 'evaluations';
export const cacheKey = (videoId: string, taal = 'nl') => {
  const norm = normalizeLang(taal);
  return norm === 'nl' ? `evaluation:${videoId}` : `evaluation:${videoId}:${norm}`;
};

export function createEvaluationCache(kv: KeyValue, limit = 100): EvaluationCache {
  const readIndex = async (): Promise<RecentEntry[]> => {
    const raw = readJson(await kv.get(INDEX_KEY));
    return Array.isArray(raw)
      ? raw.filter((e): e is RecentEntry => !!e && typeof e.videoId === 'string')
      : [];
  };
  const same = (a: RecentEntry, videoId: string, taal: string) =>
    a.videoId === videoId && normalizeLang(a.taal ?? 'nl') === normalizeLang(taal);

  return {
    async get(videoId, taal = 'nl') {
      const parsed = readJson(await kv.get(cacheKey(videoId, taal))) as WwjdEvaluation | null;
      return parsed && typeof parsed === 'object' && typeof parsed.finalScore === 'number'
        ? parsed
        : null;
    },
    async set(evaluation) {
      const { videoId } = evaluation;
      const taal = normalizeLang(evaluation.taal ?? 'nl');
      await kv.set(cacheKey(videoId, taal), JSON.stringify(evaluation));
      const entry: RecentEntry = {
        videoId,
        taal,
        titel: evaluation.videoTitle || videoId,
        score: evaluation.finalScore,
        op: new Date().toISOString(),
      };
      const index = [entry, ...(await readIndex()).filter((e) => !same(e, videoId, taal))];
      const dropped = index.splice(limit);
      await Promise.all(dropped.map((e) => kv.remove(cacheKey(e.videoId, e.taal ?? 'nl'))));
      await kv.set(INDEX_KEY, JSON.stringify(index));
    },
    recent: readIndex,
    async clear() {
      const index = await readIndex();
      await Promise.all(index.map((e) => kv.remove(cacheKey(e.videoId, e.taal ?? 'nl'))));
      await kv.remove(INDEX_KEY);
      return index.length;
    },
  };
}
