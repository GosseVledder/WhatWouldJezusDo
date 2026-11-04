import type { KeyValue } from '@wwjd/core';

/** Minimal string store (shared contract from @wwjd/core). */
export type { KeyValue };

/** In-memory store for tests and the browser dev server. */
export function memoryKV(initial: Record<string, string> = {}): KeyValue & {
  data: Map<string, string>;
} {
  const data = new Map(Object.entries(initial));
  return {
    data,
    get: async (k) => data.get(k) ?? null,
    set: async (k, v) => void data.set(k, v),
    remove: async (k) => void data.delete(k),
  };
}

export function readJson(raw: string | null): unknown {
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
