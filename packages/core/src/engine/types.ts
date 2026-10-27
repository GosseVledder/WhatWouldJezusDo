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

export type StatementSpeaker =
  | 'presenter' // Verteller / voice-over / presentator van de video
  | 'subject' // Het besproken onderwerp: persoon, partij of gebeurtenis
  | 'other'; // Overige sprekers (bijv. geïnterviewde deskundige)

export interface FactcheckedStatement {
  quote: string;
  speaker?: StatementSpeaker; // Wie doet de uitspraak (ontbreekt in oudere evaluaties)
  startSeconds: number;
  timestampLabel: string;
  claim: string;
  searchQuery?: string; // Korte, gerichte zoekopdracht (bij voorkeur Engels/brontaal) voor Fact Check API
  verdict: FactcheckVerdict;
  historicalAnalysis: string; // Korte historische analyse / feitenverificatie
  sources?: WebSource[];
}

export interface PresenterProfile {
  role: string; // Wie presenteert (bijv. nieuwslezer van kanaal X, voice-over)
  conduct: string; // Wat de presentator doet: verslaan, framen, bespotten, oproepen
  sentimentAndAttitude: string; // Toon en houding van de presentator t.o.v. het onderwerp
  contradictionsDetected: string[]; // Zelf-tegenspraak van de presentator
}

export interface VideoExtractionAndFactcheck {
  coreActivity: string; // Onderwerp: wat gebeurt er daadwerkelijk (bijv. oorlog voeren, liegen, helpen)
  sentimentAndAttitude: string; // Onderwerp: houding t.o.v. de medemens/tegenstander
  contradictionsDetected: string[]; // Onderwerp: gedetecteerde zelf-tegenspraak (belofte vs. daad)
  presenterIsSubject?: boolean; // Presentator spreekt over zichzelf (toespraak, vlog, preek)
  presenter?: PresenterProfile; // Ontbreekt in oudere evaluaties
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

export interface PresenterEvaluation {
  finalScore: number; // Gemiddelde van de relevante presentator-scores (1 decimaal)
  verdictSummary: string;
  relevantGuidelines: ScoredGuideline[];
}

export interface WwjdEvaluation {
  videoId: string;
  videoTitle?: string;
  channelName?: string;
  taal?: string;
  finalScore: number; // Onderwerp: gemiddelde van relevante scores, 0.0 tot 10.0 (1 decimaal)
  verdictSummary: string; // Onderwerp: korte samenvattende conclusie
  factcheckDossier: VideoExtractionAndFactcheck;
  relevantGuidelines: ScoredGuideline[]; // Onderwerp: uitsluitend de relevante richtlijnen
  presenterEvaluation?: PresenterEvaluation; // Alleen als presentator ≠ onderwerp
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
