import { ENGINE_DEFAULTS } from '../config';
import { EngineError, type ChatRequest, type ProviderOptions, type RawModelOutput } from '../types';
import { errorMessageFrom, requestJson } from './http';

const API = 'https://api.anthropic.com/v1';

function headers(apiKey: string): Record<string, string> {
  return {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  };
}

function describeError(status: number, body: unknown, text: string): EngineError {
  const message = errorMessageFrom(body, text);
  const type = (body as { error?: { type?: string } } | null)?.error?.type;
  if (status === 401 || type === 'authentication_error') {
    return new EngineError('auth', 'De Claude-API-sleutel is ongeldig.', {
      status,
      details: message,
    });
  }
  if (status === 403 || type === 'permission_error') {
    return new EngineError('auth', 'Deze Claude-API-sleutel heeft geen toegang tot dit model.', {
      status,
      details: message,
    });
  }
  if (status === 404 || type === 'not_found_error') {
    return new EngineError('model_not_found', 'Het ingestelde Claude-model bestaat niet.', {
      status,
      details: message,
    });
  }
  if (status === 429 || type === 'rate_limit_error') {
    return new EngineError(
      'rate_limit',
      'Claude is tijdelijk overbelast of de limiet is bereikt.',
      {
        status,
        details: message,
      },
    );
  }
  if (status === 402 || /credit balance/i.test(message)) {
    return new EngineError('quota', 'Het tegoed van het Claude-account is op.', {
      status,
      details: message,
    });
  }
  if (status === 400 || status === 413) {
    return new EngineError('bad_request', 'Claude weigerde het verzoek.', {
      status,
      details: message,
    });
  }
  return new EngineError('server', 'De Claude-API gaf een serverfout.', {
    status,
    details: message,
  });
}

interface ClaudeResponse {
  model?: string;
  stop_reason?: string;
  content?: { type: string; text?: string }[];
  usage?: { input_tokens?: number; output_tokens?: number };
}

export async function generateClaude(
  req: ChatRequest,
  opts: ProviderOptions,
): Promise<RawModelOutput> {
  const body: Record<string, unknown> = {
    model: opts.model,
    max_tokens: ENGINE_DEFAULTS.claudeMaxOutputTokens,
    system: req.system,
    messages: [{ role: 'user', content: req.user }],
  };

  if (req.schema) {
    body.output_config = { format: { type: 'json_schema', schema: req.schema } };
  }

  const res = await requestJson(
    `${API}/messages`,
    { headers: headers(opts.apiKey), body },
    opts,
    describeError,
  );
  const data = res.body as ClaudeResponse;
  if (data.stop_reason === 'refusal') {
    throw new EngineError('refusal', 'Claude weigerde deze video te analyseren.');
  }
  const text = (data.content ?? [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('');

  if (data.stop_reason === 'max_tokens') {
    throw new EngineError('truncated', 'Het antwoord van Claude werd afgekapt.', {
      details: text.slice(-300),
    });
  }
  return {
    text,
    model: data.model ?? opts.model,
    usage: { inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens },
  };
}

export async function testClaudeConnection(opts: ProviderOptions): Promise<void> {
  await requestJson(
    `${API}/models/${encodeURIComponent(opts.model)}`,
    { method: 'GET', headers: headers(opts.apiKey) },
    opts,
    describeError,
  );
}
