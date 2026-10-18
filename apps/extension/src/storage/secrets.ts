import type { KeyKind, ProviderId } from '@wwjd/core';

export interface ApiKeys {
  claude: string;
  gemini: string;
  factcheck: string; // Google Fact Check Tools API key
}

const DB_NAME = 'wwjd-secrets';
const STORE = 'keys';
const RECORD = 'apiKeys';
const EMPTY: ApiKeys = { claude: '', gemini: '', factcheck: '' };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

function clean(raw: unknown): ApiKeys {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<string, unknown>>;
  return {
    claude: typeof r.claude === 'string' ? r.claude.trim() : '',
    gemini: typeof r.gemini === 'string' ? r.gemini.trim() : '',
    factcheck: typeof r.factcheck === 'string' ? r.factcheck.trim() : '',
  };
}

export async function readKeys(): Promise<ApiKeys> {
  try {
    const res = await withStore('readonly', (s) => s.get(RECORD));
    return clean(res);
  } catch {
    return { ...EMPTY };
  }
}

export async function writeKeys(keys: ApiKeys): Promise<void> {
  await withStore('readwrite', (s) => s.put(clean(keys), RECORD));
}

export async function getApiKeyForProvider(provider: ProviderId): Promise<string> {
  const keys = await readKeys();
  return provider === 'claude' ? keys.claude : keys.gemini;
}

export async function getFactCheckApiKey(): Promise<string> {
  const keys = await readKeys();
  return keys.factcheck || '';
}

export async function getApiKeys(): Promise<ApiKeys> {
  return { ...EMPTY, ...(await readKeys()) };
}

export async function setApiKey(kind: KeyKind, key: string): Promise<ApiKeys> {
  const next = { ...(await getApiKeys()), [kind]: key.trim() };
  await writeKeys(next);
  return next;
}
