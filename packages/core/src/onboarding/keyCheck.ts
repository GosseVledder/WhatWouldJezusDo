// Live key checks for onboarding and settings: one cheap call per service, with the
// failure turned into a plain-language problem the UI can explain (and, when an API is not
// switched on yet, the one-click page that switches it on).
import { DEFAULT_MODELS } from '../engine/config';
import { testClaudeConnection } from '../engine/providers/claude';
import { EngineError } from '../engine/types';
import type { KeyKind } from '../ui/keySteps';

export type KeyProblem =
  | 'empty' // nothing pasted
  | 'wrong_key' // not a valid key (typo, partly copied, deleted key)
  | 'wrong_api' // valid key, but restricted to another API (e.g. the Gemini key in the Fact Check field)
  | 'restricted' // valid key, but limited to other websites or apps
  | 'api_not_enabled' // valid key, but the API is not switched on in the Google project
  | 'quota' // limit reached
  | 'offline' // no internet / no answer
  | 'model' // the chosen model does not exist for this key
  | 'unknown';

export type KeyCheckResult =
  { ok: true } | { ok: false; problem: KeyProblem; activationUrl?: string; details?: string };

export interface KeyCheckOptions {
  fetch?: typeof fetch;
  timeoutMs?: number;
  /** LLM model to check (default: the default model of that provider). */
  model?: string;
  /** Override for tests; default `navigator.onLine`. */
  isOnline?: () => boolean;
}

/** The Google API Library page that switches an API on (pick a project, click Enable). */
export const ENABLE_API_URLS: Record<'gemini' | 'factcheck', string> = {
  gemini: 'https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com',
  factcheck: 'https://console.cloud.google.com/apis/library/factchecktools.googleapis.com',
};

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta';
const FACTCHECK_API = 'https://factchecktools.googleapis.com/v1alpha1/claims:search';

interface GoogleErrorBody {
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: { reason?: string; metadata?: Record<string, string> }[];
  };
}

/**
 * Turns a Google API error (Gemini, Fact Check Tools, any googleapis.com service) into a
 * problem. Google puts the precise cause in `error.details[].reason` (ErrorInfo); older or
 * proxied answers only have the message, so that is matched as well.
 */
export function classifyGoogleError(
  status: number,
  body: unknown,
  text = '',
  kind: 'gemini' | 'factcheck' = 'gemini',
): { problem: KeyProblem; activationUrl?: string } {
  const err = (body as GoogleErrorBody | null)?.error;
  const message = err?.message ?? text;
  const info = err?.details?.find((d) => d?.reason);
  const reason = info?.reason ?? '';

  if (
    reason === 'SERVICE_DISABLED' ||
    /has not been used in project|it is disabled/i.test(message)
  ) {
    const fromMessage = message.match(
      /https:\/\/console\.(?:developers|cloud)\.google\.com\/\S+/,
    )?.[0];
    return {
      problem: 'api_not_enabled',
      activationUrl:
        info?.metadata?.activationUrl ??
        fromMessage?.replace(/[.,)]+$/, '') ??
        ENABLE_API_URLS[kind],
    };
  }
  if (
    reason === 'API_KEY_SERVICE_BLOCKED' ||
    /requests to this api .* are blocked/i.test(message)
  ) {
    return { problem: 'wrong_api' };
  }
  if (/^API_KEY_(HTTP_REFERRER|IP_ADDRESS|ANDROID_APP|IOS_APP)_BLOCKED$/.test(reason)) {
    return { problem: 'restricted' };
  }
  if (
    reason === 'API_KEY_INVALID' ||
    reason === 'API_KEY_EXPIRED' ||
    /API key not valid|API key expired|API_KEY_INVALID/i.test(message) ||
    status === 401
  ) {
    return { problem: 'wrong_key' };
  }
  if (status === 429 || err?.status === 'RESOURCE_EXHAUSTED') return { problem: 'quota' };
  if (status === 404 && kind === 'gemini') return { problem: 'model' };
  if (status === 403 || status === 400) return { problem: 'wrong_key' };
  return { problem: 'unknown' };
}

const defaultOnline = () =>
  typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean' || navigator.onLine;

async function getJson(
  url: string,
  headers: Record<string, string>,
  opts: KeyCheckOptions,
): Promise<{ status: number; body: unknown; text: string } | 'offline'> {
  const doFetch = opts.fetch ?? globalThis.fetch.bind(globalThis);
  try {
    const res = await doFetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(opts.timeoutMs ?? 15_000),
    });
    const text = await res.text().catch(() => '');
    let body: unknown = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = null;
    }
    return { status: res.ok ? 200 : res.status, body, text };
  } catch {
    return 'offline';
  }
}

/** Checks one key with a live call. Never throws. */
export async function checkKey(
  kind: KeyKind,
  apiKey: string,
  opts: KeyCheckOptions = {},
): Promise<KeyCheckResult> {
  const key = apiKey.trim();
  if (!key) return { ok: false, problem: 'empty' };
  if (/\s/.test(key)) return { ok: false, problem: 'wrong_key' };
  const online = opts.isOnline ?? defaultOnline;
  if (!online()) return { ok: false, problem: 'offline' };

  if (kind === 'claude') {
    try {
      await testClaudeConnection({
        apiKey: key,
        model: opts.model || DEFAULT_MODELS.claude,
        timeoutMs: opts.timeoutMs ?? 15_000,
        fetch: opts.fetch,
      });
      return { ok: true };
    } catch (e) {
      const code = e instanceof EngineError ? e.code : 'unknown';
      const problem: KeyProblem =
        code === 'auth'
          ? 'wrong_key'
          : code === 'quota' || code === 'rate_limit'
            ? 'quota'
            : code === 'network' || code === 'timeout'
              ? 'offline'
              : code === 'model_not_found'
                ? 'model'
                : 'unknown';
      return { ok: false, problem, details: e instanceof Error ? e.message : String(e) };
    }
  }

  const res =
    kind === 'gemini'
      ? await getJson(
          `${GEMINI_API}/models/${encodeURIComponent((opts.model || DEFAULT_MODELS.gemini).replace(/^models\//, ''))}`,
          { 'x-goog-api-key': key },
          opts,
        )
      : await getJson(
          `${FACTCHECK_API}?${new URLSearchParams({ query: 'test', pageSize: '1', key })}`,
          {},
          opts,
        );

  if (res === 'offline') return { ok: false, problem: 'offline' };
  if (res.status === 200) return { ok: true };
  const { problem, activationUrl } = classifyGoogleError(res.status, res.body, res.text, kind);
  return {
    ok: false,
    problem,
    ...(activationUrl ? { activationUrl } : {}),
    details: res.text.slice(0, 300),
  };
}
