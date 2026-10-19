import { ENGINE_DEFAULTS } from '../config';
import {
  EngineError,
  type ChatRequest,
  type ProviderOptions,
  type RawModelOutput,
  type WebSource,
} from '../types';
import { errorMessageFrom, requestJson } from './http';

const API = 'https://generativelanguage.googleapis.com/v1beta';

function headers(apiKey: string): Record<string, string> {
  return { 'content-type': 'application/json', 'x-goog-api-key': apiKey };
}

function modelPath(model: string): string {
  return `models/${encodeURIComponent(model.replace(/^models\//, ''))}`;
}

function describeError(status: number, body: unknown, text: string): EngineError {
  const message = errorMessageFrom(body, text);
  const reason = (body as { error?: { status?: string } } | null)?.error?.status ?? '';
  if (/API key not valid|API_KEY_INVALID/i.test(message) || status === 401) {
    return new EngineError('auth', 'De Gemini-API-sleutel is ongeldig.', {
      status,
      details: message,
    });
  }
  if (status === 403 || reason === 'PERMISSION_DENIED') {
    return new EngineError('auth', 'Deze Gemini-API-sleutel heeft geen toegang.', {
      status,
      details: message,
    });
  }
  if (status === 404 || reason === 'NOT_FOUND') {
    return new EngineError('model_not_found', 'Het ingestelde Gemini-model bestaat niet.', {
      status,
      details: message,
    });
  }
  if (status === 429 || reason === 'RESOURCE_EXHAUSTED') {
    const quota = /quota/i.test(message);
    return new EngineError(
      quota ? 'quota' : 'rate_limit',
      quota
        ? 'Het Gemini-quotum is op.'
        : 'Gemini is tijdelijk overbelast of de limiet is bereikt.',
      { status, details: message },
    );
  }
  if (status === 400) {
    if (/video|youtube|fileUri|file_uri/i.test(message)) {
      return new EngineError(
        'video_unavailable',
        "Gemini kan deze video niet openen (alleen openbare video's).",
        { status, details: message },
      );
    }
    return new EngineError('bad_request', 'Gemini weigerde het verzoek.', {
      status,
      details: message,
    });
  }
  return new EngineError('server', 'De Gemini-API gaf een serverfout.', {
    status,
    details: message,
  });
}

interface GeminiResponse {
  modelVersion?: string;
  promptFeedback?: { blockReason?: string };
  candidates?: {
    finishReason?: string;
    content?: { parts?: { text?: string; thought?: boolean }[] };
    groundingMetadata?: {
      webSearchQueries?: string[];
      groundingChunks?: { web?: { uri?: string; title?: string } }[];
    };
  }[];
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
  };
}

export async function generateGemini(
  parts: unknown[],
  req: ChatRequest,
  opts: ProviderOptions,
  extraConfig: Record<string, unknown> = {},
): Promise<RawModelOutput> {
  const generationConfig: Record<string, unknown> = {
    temperature: ENGINE_DEFAULTS.geminiTemperature,
    maxOutputTokens: ENGINE_DEFAULTS.maxOutputTokens,
    ...extraConfig,
  };

  // Gemini API rejects simultaneous google_search grounding + controlled JSON mimeType/schema.
  // When enableWebSearch is active, we enable google_search grounding and rely on the system
  // prompt + extractJson() for JSON extraction. Otherwise we enforce responseMimeType/schema.
  if (!req.enableWebSearch) {
    generationConfig.responseMimeType = 'application/json';
    if (req.schema) {
      generationConfig.responseJsonSchema = req.schema;
    }
  }

  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: req.system }] },
    contents: [{ role: 'user', parts }],
    generationConfig,
  };

  if (req.enableWebSearch) {
    body.tools = [{ google_search: {} }];
  }

  let res;
  try {
    res = await requestJson(
      `${API}/${modelPath(opts.model)}:generateContent`,
      { headers: headers(opts.apiKey), body },
      opts,
      describeError,
    );
  } catch (err) {
    if (
      err instanceof EngineError &&
      err.code === 'bad_request' &&
      (body.tools || generationConfig.responseJsonSchema)
    ) {
      delete body.tools;
      delete generationConfig.responseJsonSchema;
      generationConfig.responseMimeType = 'application/json';
      res = await requestJson(
        `${API}/${modelPath(opts.model)}:generateContent`,
        { headers: headers(opts.apiKey), body },
        opts,
        describeError,
      );
    } else {
      throw err;
    }
  }

  const data = res.body as GeminiResponse;
  if (data.promptFeedback?.blockReason) {
    throw new EngineError('refusal', 'Gemini weigerde deze video te analyseren.', {
      details: data.promptFeedback.blockReason,
    });
  }
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? '')
    .join('');

  if (cand?.finishReason === 'MAX_TOKENS') {
    throw new EngineError('truncated', 'Het antwoord van Gemini werd afgekapt.', {
      details: text.slice(-300),
    });
  }
  if (
    cand?.finishReason &&
    ['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT'].includes(cand.finishReason)
  ) {
    throw new EngineError(
      'refusal',
      'Gemini weigerde deze video te analyseren wegens inhoudsbeperkingen.',
      {
        details: cand.finishReason,
      },
    );
  }

  const groundingSources: WebSource[] = [];
  const seenUris = new Set<string>();
  for (const chunk of cand?.groundingMetadata?.groundingChunks ?? []) {
    const uri = chunk.web?.uri?.trim();
    if (!uri || seenUris.has(uri)) continue;
    seenUris.add(uri);
    groundingSources.push({
      title: chunk.web?.title?.trim() || uri,
      url: uri,
    });
  }

  const webSearchQueries = (cand?.groundingMetadata?.webSearchQueries ?? [])
    .map((q) => q.trim())
    .filter(Boolean);

  const u = data.usageMetadata;
  return {
    text,
    model: data.modelVersion ?? opts.model,
    usage: {
      inputTokens: u?.promptTokenCount,
      outputTokens: (u?.candidatesTokenCount ?? 0) + (u?.thoughtsTokenCount ?? 0) || undefined,
    },
    groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
    webSearchQueries: webSearchQueries.length > 0 ? webSearchQueries : undefined,
  };
}

export async function testGeminiConnection(opts: ProviderOptions): Promise<void> {
  await requestJson(
    `${API}/${modelPath(opts.model)}`,
    { method: 'GET', headers: headers(opts.apiKey) },
    opts,
    describeError,
  );
}
