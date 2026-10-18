import { z } from 'zod';

export const FactcheckVerdictSchema = z.enum([
  'bevestigd',
  'ontkracht',
  'tegenspraak',
  'gemengd_of_context',
  'opinie',
]);

export const FactcheckedStatementSchema = z.object({
  quote: z.string().describe('Letterlijk citaat of kernuitspraak uit de video'),
  startSeconds: z.number().describe('Tijdstip in seconden in de video'),
  timestampLabel: z.string().describe('Geformatteerde tijdcode [mm:ss]'),
  claim: z.string().describe('De feitelijke claim of stelling die gedaan wordt'),
  verdict: FactcheckVerdictSchema,
  historicalAnalysis: z
    .string()
    .describe('Korte historische en feitelijke analyse die de claim bevestigt of ontkracht'),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
});

export const VideoExtractionAndFactcheckSchema = z.object({
  coreActivity: z
    .string()
    .describe('De kern van de activiteit en daadwerkelijke handeling in of rondom de video'),
  sentimentAndAttitude: z
    .string()
    .describe('Boodschap, toon en de houding ten opzichte van de naaste of tegenstander'),
  contradictionsDetected: z
    .array(z.string())
    .describe('Gedetecteerde zelf-tegenspraak tussen woorden en daden of interne tegenspraak'),
  statements: z.array(FactcheckedStatementSchema).min(1),
});

export const ScoredGuidelineInputSchema = z.object({
  guidelineId: z.string().describe('Het exacte ID van de relevante richtlijn uit de database'),
  score: z.number().min(0).max(10).describe('Score van 0 t/m 10 voor deze richtlijn'),
  reasoning: z
    .string()
    .describe(
      "Grondige onderbouwing die de video-uitspraak, de factcheck en Jezus' onderwijs verbindt",
    ),
  relatedQuotes: z.array(
    z.object({
      quote: z.string(),
      startSeconds: z.number(),
      timestampLabel: z.string(),
    }),
  ),
});

export const WwjdModelOutputSchema = z.object({
  verdictSummary: z
    .string()
    .describe('Samenvattende eindconclusie: wat zou Jezus van deze video vinden?'),
  factcheckDossier: VideoExtractionAndFactcheckSchema,
  relevantGuidelines: z.array(ScoredGuidelineInputSchema).min(1),
});

export type WwjdModelOutput = z.infer<typeof WwjdModelOutputSchema>;

type JsonObject = Record<string, unknown>;

export function wwjdModelOutputJsonSchema(): JsonObject {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['verdictSummary', 'factcheckDossier', 'relevantGuidelines'],
    properties: {
      verdictSummary: {
        type: 'string',
        description: 'Samenvattende eindconclusie: wat zou Jezus van deze video vinden?',
      },
      factcheckDossier: {
        type: 'object',
        additionalProperties: false,
        required: ['coreActivity', 'sentimentAndAttitude', 'contradictionsDetected', 'statements'],
        properties: {
          coreActivity: { type: 'string' },
          sentimentAndAttitude: { type: 'string' },
          contradictionsDetected: {
            type: 'array',
            items: { type: 'string' },
          },
          statements: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              required: [
                'quote',
                'startSeconds',
                'timestampLabel',
                'claim',
                'verdict',
                'historicalAnalysis',
              ],
              properties: {
                quote: { type: 'string' },
                startSeconds: { type: 'number' },
                timestampLabel: { type: 'string' },
                claim: { type: 'string' },
                verdict: {
                  type: 'string',
                  enum: ['bevestigd', 'ontkracht', 'tegenspraak', 'gemengd_of_context', 'opinie'],
                },
                historicalAnalysis: { type: 'string' },
              },
            },
          },
        },
      },
      relevantGuidelines: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['guidelineId', 'score', 'reasoning', 'relatedQuotes'],
          properties: {
            guidelineId: { type: 'string' },
            score: { type: 'number' },
            reasoning: { type: 'string' },
            relatedQuotes: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['quote', 'startSeconds', 'timestampLabel'],
                properties: {
                  quote: { type: 'string' },
                  startSeconds: { type: 'number' },
                  timestampLabel: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  };
}

/** Extract and parse JSON from a model answer, tolerating code fences and stray text. */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1]);
    } catch {
      // fall through
    }
  }
  const first = trimmed.indexOf('{');
  const last = trimmed.lastIndexOf('}');
  if (first >= 0 && last > first) {
    return JSON.parse(trimmed.slice(first, last + 1));
  }
  throw new SyntaxError('Geen JSON-object gevonden in het antwoord.');
}
