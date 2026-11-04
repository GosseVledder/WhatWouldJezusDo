// API key storage, the same contract on both platforms: the app keeps every key as its own
// entry in the Android Keystore-backed secure storage (via `createKeyStore`), the extension in
// one IndexedDB record that never leaves the browser. Keys are trimmed; an empty key is removed.
import type { KeyKind } from '../ui/keySteps';

/** Minimal string store; the platform adapters and the tests implement it. */
export interface KeyValue {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface KeyStore {
  get(): Promise<Record<KeyKind, string>>;
  set(kind: KeyKind, value: string): Promise<void>;
}

export const KEY_KINDS: KeyKind[] = ['gemini', 'factcheck', 'claude'];

const keyName = (k: KeyKind) => `apiKey.${k}`;

/** A key store with one entry per key ("apiKey.gemini", …) on top of a KeyValue store. */
export function createKeyStore(kv: KeyValue): KeyStore {
  return {
    async get() {
      const values = await Promise.all(KEY_KINDS.map((k) => kv.get(keyName(k))));
      return Object.fromEntries(KEY_KINDS.map((k, i) => [k, values[i]?.trim() ?? ''])) as Record<
        KeyKind,
        string
      >;
    },
    async set(kind, value) {
      const v = value.trim();
      if (v) await kv.set(keyName(kind), v);
      else await kv.remove(keyName(kind));
    },
  };
}
