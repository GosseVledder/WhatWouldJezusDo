import type { BibleSource } from '../guidelines/types';

export type FactcheckVerdict =
  | 'bevestigd' // Feitelijk / historisch juist bevonden o.b.v. algemene consensus
  | 'ontkracht' // Aantoonbaar feitelijk onjuist / weerlegd
  | 'tegenspraak' // Zichzelf tegenspreken (woord vs. daad) = per definitie liegen
  | 'gemengd_of_context' // Gedeeltelijk waar, maar mist essentiële context of nuance
  | 'opinie'; // Persoonlijke mening of geloofsovertuiging zonder toetsbare feitenclaim

export interface WebSource {
  title: string;
  url: string;
}

export interface FactcheckedStatement {
  quote: string;
  startSeconds: number;
  timestampLabel: string;
  claim: string;
  searchQuery?: string; // Korte, gerichte zoekopdracht (bij voorkeur Engels/brontaal) voor Fact Check API
  verdict: FactcheckVerdict;
  historicalAnalysis: string; // Korte historische analyse / feitenverificatie
  sources?: WebSource[];
}

export interface VideoExtractionAndFactcheck {
  coreActivity: string; // Wat gebeurt er daadwerkelijk (bijv. oorlog voeren, liegen, helpen)
  sentimentAndAttitude: string; // Houding t.o.v. de medemens/tegenstander
  contradictionsDetected: string[]; // Gedetecteerde zelf-tegenspraak (belofte vs. daad)
  statements: FactcheckedStatement[];
}

export interface ScoredGuidelineQuote {
  quote: string;
  startSeconds: number;
  timestampLabel: string;
}

export interface ScoredGuideline {
  guidelineId: string;
  number: number;
  title: string;
  category: "Tien Geboden & Jezus' Verdieping" | 'Kernuitspraken en Richtlijnen van Jezus';
  score: number; // Schaal 0 t/m 10
  reasoning: string; // Uitleg hoe de gefactcheckte video zich hiertoe verhoudt
  relatedQuotes: ScoredGuidelineQuote[];
  bibleSources: BibleSource[]; // Harde bronnen uit de database met links naar debijbel.nl
}

export interface WwjdEvaluation {
  videoId: string;
  videoTitle?: string;
  channelName?: string;
  taal?: string;
  finalScore: number; // Gemiddelde van relevante scores: 0.0 tot 10.0 (1 decimaal)
  verdictSummary: string; // Korte samenvattende conclusie
  factcheckDossier: VideoExtractionAndFactcheck;
  relevantGuidelines: ScoredGuideline[]; // Uitsluitend de relevante richtlijnen
  createdAt: string;
  provider: 'gemini' | 'claude';
  model: string;
}

export interface VideoMeta {
  videoId: string;
  titel: string;
  kanaal: string;
  duurSeconden: number;
  publicatieDatum?: string;
}

export interface TranscriptSegment {
  start: number;
  duur: number;
  tekst: string;
}

export interface Transcript {
  videoId: string;
  taal: string;
  soort: 'handmatig' | 'automatisch';
  segmenten: TranscriptSegment[];
}

export type ProviderId = 'gemini' | 'claude';

export interface CallLog {
  stap: string;
  provider: ProviderId;
  model: string;
  invoerTekens: number;
  duurMs: number;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  fout?: string;
}

export interface ProviderOptions {
  apiKey: string;
  model: string;
  taal?: string;
  factCheckApiKey?: string;
  enableWebSearch?: boolean;
  currentDate?: string;
  signal?: AbortSignal;
  timeoutMs?: number;
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  onCall?: (entry: CallLog) => void;
}

export interface ChatRequest {
  system: string;
  user: string;
  schema?: Record<string, unknown>;
  enableWebSearch?: boolean;
}

export interface RawModelOutput {
  text: string;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  groundingSources?: WebSource[];
  webSearchQueries?: string[];
}

export type EngineErrorCode =
  | 'auth'
  | 'quota'
  | 'rate_limit'
  | 'bad_request'
  | 'model_not_found'
  | 'video_unavailable'
  | 'refusal'
  | 'truncated'
  | 'network'
  | 'timeout'
  | 'aborted'
  | 'parse'
  | 'server'
  | 'unknown';

export class EngineError extends Error {
  readonly code: EngineErrorCode;
  readonly status?: number;
  readonly details?: string;

  constructor(
    code: EngineErrorCode,
    message: string,
    options: { status?: number; details?: string } = {},
  ) {
    super(message);
    this.name = 'EngineError';
    this.code = code;
    this.status = options.status;
    this.details = options.details;
  }
}
