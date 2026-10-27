import { searchGoogleFactCheck, type FactCheckMatch } from '../factcheck/googleFactCheck';
import { getGuidelineById, normalizeLang } from '../guidelines/jesus';
import { messages } from '../i18n/messages';
import {
  buildFactcheckReconciliationPrompt,
  buildSystemPrompt,
  buildUserPrompt,
} from './prompt';
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
  type FactcheckVerdict,
  type PresenterEvaluation,
  type ProviderId,
  type ProviderOptions,
  type ScoredGuideline,
  type Transcript,
  type VideoMeta,
  type WebSource,
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

export function isVerdictReversal(
  oldVerdict: FactcheckVerdict,
  newVerdict: FactcheckVerdict,
): boolean {
  if (oldVerdict === newVerdict) return false;
  if (
    (oldVerdict === 'ontkracht' || oldVerdict === 'tegenspraak') &&
    newVerdict === 'bevestigd'
  ) {
    return true;
  }
  if (
    oldVerdict === 'bevestigd' &&
    (newVerdict === 'ontkracht' || newVerdict === 'tegenspraak')
  ) {
    return true;
  }
  return false;
}

function mergeUniqueSources(existing: WebSource[] | undefined, incoming: WebSource[]): WebSource[] {
  const base = existing ?? [];
  const seenUrls = new Set(base.map((s) => s.url));
  const merged = [...base];
  for (const src of incoming) {
    if (src.url && !seenUrls.has(src.url)) {
      seenUrls.add(src.url);
      merged.push(src);
    }
  }
  return merged;
}

export async function evaluateVideo(
  input: EvaluationInput,
  providerId: ProviderId,
  opts: ProviderOptions,
): Promise<WwjdEvaluation> {
  const taal = normalizeLang(opts.taal);
  const t = messages(taal);
  const currentDate = opts.currentDate?.trim() || new Date().toISOString().slice(0, 10);
  const transcriptText = formatTranscriptForPrompt(input.transcript);
  const systemPrompt = buildSystemPrompt(taal, { currentDate });
  const userPrompt = buildUserPrompt(
    transcriptText,
    {
      titel: input.meta?.titel,
      kanaal: input.meta?.kanaal,
      publicatieDatum: input.meta?.publicatieDatum,
    },
    taal,
    { currentDate },
  );

  const chatRequest = {
    system: systemPrompt,
    user: userPrompt,
    schema: wwjdModelOutputJsonSchema(),
    enableWebSearch: opts.enableWebSearch ?? true,
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

  let modelOutput = parseResult.data;

  // Koppel eventuele live websearch grounding-bronnen van het AI-model aan de uitspraken
  if (rawOutput.groundingSources && rawOutput.groundingSources.length > 0) {
    for (const stmt of modelOutput.factcheckDossier.statements) {
      stmt.sources = mergeUniqueSources(stmt.sources, rawOutput.groundingSources);
    }
  }

  // Externe factcheck-laag: Google Fact Check Tools API (met gerichte searchQuery + datum/relevantiefilter)
  const factCheckKey = opts.factCheckApiKey?.trim();
  const statementMatches = new Map<number, { match: FactCheckMatch; oldVerdict: FactcheckVerdict }>();
  const verifiedReversals: {
    index: number;
    quote: string;
    claim: string;
    oldVerdict: FactcheckVerdict;
    newVerdict: FactcheckVerdict;
    publisherName: string;
    textualRating: string;
  }[] = [];

  if (factCheckKey) {
    await Promise.all(
      modelOutput.factcheckDossier.statements.map(async (stmt, index) => {
        const candidateQueries = Array.from(
          new Set(
            [stmt.searchQuery?.trim(), stmt.claim?.trim(), stmt.quote?.trim()].filter(
              (q): q is string => Boolean(q),
            ),
          ),
        );
        if (candidateQueries.length === 0) return;

        let match: FactCheckMatch | null = null;
        for (const q of candidateQueries) {
          match = await searchGoogleFactCheck(q, factCheckKey, {
            fetch: opts.fetch,
            referenceDate: currentDate,
          });
          if (match) break;
        }

        if (match) {
          const oldVerdict = stmt.verdict;
          statementMatches.set(index, { match, oldVerdict });
          if (isVerdictReversal(oldVerdict, match.verdict)) {
            verifiedReversals.push({
              index,
              quote: stmt.quote,
              claim: stmt.claim,
              oldVerdict,
              newVerdict: match.verdict,
              publisherName: match.publisherName,
              textualRating: match.textualRating,
            });
          }
        }
      }),
    );
  }

  // Als een officiële factcheck een eerder waarheids-/onwaarheidsoordeel van de AI omkeert,
  // herberekenen we de ethische WWJD-evaluatie vóórdat de definitieve richtlijnscores worden bepaald.
  if (verifiedReversals.length > 0) {
    const reconcileUserPrompt = buildFactcheckReconciliationPrompt(
      transcriptText,
      modelOutput,
      verifiedReversals,
      taal,
      { currentDate },
    );
    const reconcileReq = {
      system: systemPrompt,
      user: reconcileUserPrompt,
      schema: wwjdModelOutputJsonSchema(),
      enableWebSearch: false,
    };
    const tReconcile = Date.now();
    try {
      const reconcileRaw =
        providerId === 'gemini'
          ? await generateGemini([{ text: reconcileUserPrompt }], reconcileReq, opts)
          : await generateClaude(reconcileReq, opts);
      opts.onCall?.({
        stap: 'herzien-na-factcheck',
        provider: providerId,
        model: reconcileRaw.model,
        invoerTekens: reconcileUserPrompt.length,
        duurMs: Date.now() - tReconcile,
        usage: reconcileRaw.usage,
      });
      const reconcileParsed = WwjdModelOutputSchema.safeParse(extractJson(reconcileRaw.text));
      if (reconcileParsed.success) {
        modelOutput = reconcileParsed.data;
      }
    } catch {
      // Behoud eerste modelOutput met gecorrigeerde statement-verdicts als fallback
    }
  }

  // Pas de gevonden officiële factcheck-matches en bronnen definitief toe op de statements
  for (const [index, { match }] of statementMatches.entries()) {
    const stmt = modelOutput.factcheckDossier.statements[index];
    if (!stmt) continue;
    stmt.verdict = match.verdict;
    const prefix = `${t.view.verifiedVia(match.publisherName, match.textualRating)}: `;
    if (!stmt.historicalAnalysis.startsWith(prefix)) {
      stmt.historicalAnalysis = `${prefix}${stmt.historicalAnalysis}`;
    }
    stmt.sources = mergeUniqueSources(stmt.sources, match.sources);
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
  const enrichedGuidelines = enrichGuidelines(modelOutput.relevantGuidelines, normLang);

  if (enrichedGuidelines.length === 0) {
    throw new EngineError(
      'parse',
      'Geen geldige relevante richtlijnen gevonden in de model-uitvoer.',
    );
  }

  // De presentator krijgt alleen een eigen beoordeling als die niet zelf het onderwerp is
  let presenterEvaluation: PresenterEvaluation | undefined;
  if (!modelOutput.factcheckDossier.presenterIsSubject && modelOutput.presenterEvaluation) {
    const presenterGuidelines = enrichGuidelines(
      modelOutput.presenterEvaluation.relevantGuidelines,
      normLang,
    );
    if (presenterGuidelines.length > 0) {
      presenterEvaluation = {
        finalScore: averageScore(presenterGuidelines),
        verdictSummary: modelOutput.presenterEvaluation.verdictSummary,
        relevantGuidelines: presenterGuidelines,
      };
    }
  }

  return {
    videoId,
    videoTitle: meta?.titel,
    channelName: meta?.kanaal,
    taal: normLang,
    finalScore: averageScore(enrichedGuidelines),
    verdictSummary: modelOutput.verdictSummary,
    factcheckDossier: modelOutput.factcheckDossier,
    relevantGuidelines: enrichedGuidelines,
    ...(presenterEvaluation ? { presenterEvaluation } : {}),
    createdAt: new Date().toISOString(),
    provider,
    model,
  };
}

// Enrich each relevant guideline with real scripture links from our local database in the chosen language
function enrichGuidelines(
  guidelines: WwjdModelOutput['relevantGuidelines'],
  normLang: string,
): ScoredGuideline[] {
  return guidelines
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
}

// Exact average rounded to 1 decimal place (e.g. 4.3 or 7.6)
function averageScore(guidelines: ScoredGuideline[]): number {
  const totalScore = guidelines.reduce((acc, curr) => acc + curr.score, 0);
  return Math.round((totalScore / guidelines.length) * 10) / 10;
}
