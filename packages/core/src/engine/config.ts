import type { ProviderId } from './types';

export const DEFAULT_MODELS: Record<ProviderId, string> = {
  gemini: 'gemini-flash-latest',
  claude: 'claude-haiku-5-5',
};

export const MODEL_SUGGESTIONS: Record<ProviderId, string[]> = {
  gemini: [
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-pro-latest',
    'gemini-flash-lite-latest',
  ],
  claude: ['claude-haiku-5-5', 'claude-sonnet-5-5', 'claude-opus-5-5'],
};

export const ENGINE_DEFAULTS = {
  chunkCharLimit: 400_000,
  maxOutputTokens: 16_000,
  claudeMaxOutputTokens: 64_000,
  timeoutMs: 180_000,
  maxRetryWaitMs: 20_000,
  geminiTemperature: 0.2,
} as const;
