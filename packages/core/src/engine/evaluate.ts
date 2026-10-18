import { searchGoogleFactCheck } from '../factcheck/googleFactCheck';
import { getGuidelineById, normalizeLang } from '../guidelines/jesus';
import { messages } from '../i18n/messages';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { generateClaude } from './providers/claude';
import { generateGemini } from './providers/gemini';
import {
  extractJson,
  wwjdModelOutputJsonSchema,
  WwjdModelOutputSchema,
  type WwjdModelOutput,
} from './schema';
import {
  EngineError,
  type ProviderId,
  type ProviderOptions,
  type ScoredGuideline,
  type Transcript,
  type VideoMeta,
  type WwjdEvaluation,
} from './types';

export interface EvaluationInput {
  videoId: string;
  transcript: Transcript;
  meta?: VideoMeta;
}

export function formatTranscriptForPrompt(transcript: Transcript): string {
  return transcript.segmenten
    .map((s) => {
      const totalSec = Math.floor(s.start);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      const ts = `[${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}]`;
      return `${ts} ${s.tekst}`;
    })
    .join('\n');
}

export async function evaluateVideo(
  input: EvaluationInput,
  providerId: ProviderId,
  opts: ProviderOptions,
): Promise<WwjdEvaluation> {
  const taal = normalizeLang(opts.taal);
  const t = messages(taal);
  const transcriptText = formatTranscriptForPrompt(input.transcript);
  const systemPrompt = buildSystemPrompt(taal);
  const userPrompt = buildUserPrompt(
    transcriptText,
    {
      titel: input.meta?.titel,
      kanaal: input.meta?.kanaal,
    },
    taal,
  );

  const chatRequest = {
    system: systemPrompt,
    user: userPrompt,
    schema: wwjdModelOutputJsonSchema(),
    enableWebSearch: false,
  };

  let rawOutput;
  const t0 = Date.now();
  try {
    if (providerId === 'gemini') {
      rawOutput = await generateGemini([{ text: userPrompt }], chatRequest, opts);
    } else {
      rawOutput = await generateClaude(chatRequest, opts);
    }
    opts.onCall?.({
      stap: 'evalueren',
      provider: providerId,
      model: rawOutput.model,
      invoerTekens: userPrompt.length,
      duurMs: Date.now() - t0,
      usage: rawOutput.usage,
    });
  } catch (e) {
    opts.onCall?.({
      stap: 'evalueren',
      provider: providerId,
      model: opts.model,
      invoerTekens: userPrompt.length,
      duurMs: Date.now() - t0,
      fout: e instanceof Error ? e.message : String(e),
    });
    throw e;
  }

  let parsedJson: unknown;
  try {
    parsedJson = extractJson(rawOutput.text);
  } catch (e) {
    throw new EngineError('parse', 'Het antwoord van de AI kon niet als JSON worden gelezen.', {
      details: rawOutput.text.slice(0, 500) + ' ' + String(e),
    });
  }

  const parseResult = WwjdModelOutputSchema.safeParse(parsedJson);
  if (!parseResult.success) {
    throw new EngineError('parse', 'Het analyse-resultaat voldeed niet aan het verwachte schema.', {
      details: JSON.stringify(parseResult.error.format()),
    });
  }

  const modelOutput = parseResult.data;

  // Primaire factcheck-laag: Google Fact Check Tools API (snel & gratis)
  // LLM-fallback blijft behouden voor claims zonder bestaande geregistreerde factcheck
  const factCheckKey = opts.factCheckApiKey?.trim();
  if (factCheckKey) {
    await Promise.all(
      modelOutput.factcheckDossier.statements.map(async (stmt) => {
        const query = stmt.claim?.trim() || stmt.quote?.trim();
        if (!query) return;

        const match = await searchGoogleFactCheck(query, factCheckKey, {
          fetch: opts.fetch,
        });

        if (match) {
          // Officiële factcheck match gevonden: neem oordeel en bron direct over
          stmt.verdict = match.verdict;
          stmt.historicalAnalysis = `${t.view.verifiedVia(match.publisherName, match.textualRating)}: ${stmt.historicalAnalysis}`;

          const existingSources = stmt.sources ?? [];
          const seenUrls = new Set(existingSources.map((s) => s.url));
          const mergedSources = [...existingSources];
          for (const src of match.sources) {
            if (!seenUrls.has(src.url)) {
              seenUrls.add(src.url);
              mergedSources.push(src);
            }
          }
          stmt.sources = mergedSources;
        }
      }),
    );
  }

  return assembleEvaluation(
    input.videoId,
    modelOutput,
    providerId,
    rawOutput.model,
    input.meta,
    taal,
  );
}

export function assembleEvaluation(
  videoId: string,
  modelOutput: WwjdModelOutput,
  provider: ProviderId,
  model: string,
  meta?: VideoMeta,
  taal = 'nl',
): WwjdEvaluation {
  const normLang = normalizeLang(taal);
  // Enrich each relevant guideline with real scripture links from our local database in the chosen language
  const enrichedGuidelines: ScoredGuideline[] = modelOutput.relevantGuidelines
    .map((g) => {
      const dbEntry = getGuidelineById(g.guidelineId, normLang);
      if (!dbEntry) return null;

      // Bound score strictly between 0 and 10
      const score = Math.max(0, Math.min(10, Math.round(g.score * 10) / 10));

      return {
        guidelineId: g.guidelineId,
        number: dbEntry.number,
        title: dbEntry.title,
        category: dbEntry.category,
        score,
        reasoning: g.reasoning,
        relatedQuotes: g.relatedQuotes,
        bibleSources: dbEntry.sources,
      };
    })
    .filter((g): g is ScoredGuideline => g !== null);

  if (enrichedGuidelines.length === 0) {
    throw new EngineError(
      'parse',
      'Geen geldige relevante richtlijnen gevonden in de model-uitvoer.',
    );
  }

  // Exact average rounded to 1 decimal place (e.g. 4.3 or 7.6)
  const totalScore = enrichedGuidelines.reduce((acc, curr) => acc + curr.score, 0);
  const finalScore = Math.round((totalScore / enrichedGuidelines.length) * 10) / 10;

  return {
    videoId,
    videoTitle: meta?.titel,
    channelName: meta?.kanaal,
    taal: normLang,
    finalScore,
    verdictSummary: modelOutput.verdictSummary,
    factcheckDossier: modelOutput.factcheckDossier,
    relevantGuidelines: enrichedGuidelines,
    createdAt: new Date().toISOString(),
    provider,
    model,
  };
}
