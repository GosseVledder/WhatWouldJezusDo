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
