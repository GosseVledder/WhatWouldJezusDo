// Turns an analysis error into a message in the user's language. The engine throws EngineError
// with a code; the code (not the text) decides what the user sees and whether "Open settings"
// is offered. In the extension the error crosses the message channel as { code, message }.
import type { EngineErrorCode, ProviderId } from '../engine/types';
import type { Messages } from '../i18n/messages';

const CODES: ReadonlySet<string> = new Set<EngineErrorCode>([
  'auth',
  'quota',
  'rate_limit',
  'bad_request',
  'model_not_found',
  'video_unavailable',
  'refusal',
  'truncated',
  'network',
  'timeout',
  'aborted',
  'parse',
  'server',
  'unknown',
]);

/** Codes where the fix is in Settings (key or model). */
const SETTINGS_CODES: ReadonlySet<string> = new Set<EngineErrorCode>(['auth', 'model_not_found']);
const SETTINGS_WORDS = /sleutel|instellingen|key|settings|clé|Schlüssel|clave|chiave|chave/i;

export function providerName(provider: ProviderId): string {
  return provider === 'claude' ? 'Claude' : 'Gemini';
}

/** Error code of an EngineError, or of its { code } copy sent over a message channel. */
export function errorCodeOf(err: unknown): EngineErrorCode | undefined {
  const code = (err as { code?: unknown } | null)?.code;
  return typeof code === 'string' && CODES.has(code) ? (code as EngineErrorCode) : undefined;
}

export interface ErrorView {
  message: string;
  showSettings: boolean;
}

/**
 * Message and "Open settings" choice for an analysis error. Errors without an engine code
 * (for example "no transcript", already worded in the user's language) keep their own text.
 */
export function analysisErrorView(t: Messages, err: unknown, provider: ProviderId): ErrorView {
  const code = errorCodeOf(err);
  if (code) {
    return {
      message: t.errors[code](providerName(provider)),
      showSettings: SETTINGS_CODES.has(code),
    };
  }
  const own = err instanceof Error ? err.message : (err as { message?: unknown } | null)?.message;
  const message = typeof own === 'string' && own ? own : t.extension.unknownError;
  // Texts like "no API key found … enter your key in the settings" (any language).
  return { message, showSettings: SETTINGS_WORDS.test(message) };
}
