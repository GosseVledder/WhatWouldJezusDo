import type { Transcript, TranscriptSegment, VideoMeta } from '../engine/types';

const PLAYER_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';

export const INNERTUBE_CLIENTS = [
  { clientName: 'ANDROID', clientVersion: '20.10.38', androidSdkVersion: 30 },
  { clientName: 'IOS', clientVersion: '20.10.4', deviceModel: 'iPhone16,2' },
] as const;

export interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  kind?: string;
  name?: { simpleText?: string; runs?: { text: string }[] };
}

interface PlayerResponse {
  playabilityStatus?: { status?: string; reason?: string };
  videoDetails?: {
    videoId?: string;
    title?: string;
    author?: string;
    lengthSeconds?: string;
    shortDescription?: string;
    isLiveContent?: boolean;
    isLive?: boolean;
  };
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks?: CaptionTrack[];
      audioTracks?: {
        defaultCaptionTrackIndex?: number;
        captionTrackIndices?: number[];
        audioTrackId?: string;
      }[];
      defaultAudioTrackIndex?: number;
    };
  };
}

export type PlayabilityStatus = 'ok' | 'unavailable' | 'login_required' | 'live' | 'unknown';

export interface TrackHints {
  defaultIndex?: number | null;
  audioLanguage?: string | null;
  text?: string;
}

export interface VideoInfo {
  meta: VideoMeta;
  tracks: CaptionTrack[];
  hints: TrackHints;
  status: PlayabilityStatus;
  reason?: string;
}

export interface FetchDeps {
  fetch?: typeof fetch;
}

export async function fetchVideoInfo(videoId: string, deps: FetchDeps = {}): Promise<VideoInfo> {
  const doFetch = deps.fetch ?? globalThis.fetch.bind(globalThis);
  let lastInfo: VideoInfo | null = null;
  let lastError: unknown = null;
  for (const client of INNERTUBE_CLIENTS) {
    try {
      const res = await doFetch(PLAYER_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ context: { client: { ...client, hl: 'nl', gl: 'NL' } }, videoId }),
        credentials: 'omit',
      });
      if (!res.ok) throw new Error(`player ${res.status}`);
      const info = toVideoInfo(videoId, (await res.json()) as PlayerResponse);
      if (info.tracks.length > 0 || info.status === 'unavailable') return info;
      lastInfo = info;
    } catch (e) {
      lastError = e;
    }
  }
  if (lastInfo) return lastInfo;
  throw lastError instanceof Error ? lastError : new Error('player request failed');
}

export function toVideoInfo(videoId: string, pr: PlayerResponse): VideoInfo {
  const d = pr.videoDetails ?? {};
  const list = pr.captions?.playerCaptionsTracklistRenderer;
  const s = pr.playabilityStatus?.status;
  let status: PlayabilityStatus = 'unknown';
  if (s === 'OK') status = d.isLive ? 'live' : 'ok';
  else if (s === 'LOGIN_REQUIRED') status = 'login_required';
  else if (s === 'ERROR' || s === 'UNPLAYABLE') status = 'unavailable';
  const audio = list?.audioTracks ?? [];
  const original = audio.length > 1 ? audio[list?.defaultAudioTrackIndex ?? 0] : undefined;
  return {
    meta: {
      videoId,
      titel: d.title ?? '',
      kanaal: d.author ?? '',
      duurSeconden: Number(d.lengthSeconds ?? 0) || 0,
    },
    tracks: list?.captionTracks ?? [],
    hints: {
      defaultIndex: audio[0]?.defaultCaptionTrackIndex ?? null,
      audioLanguage: original?.audioTrackId?.split('.')[0] ?? null,
      text: `${d.title ?? ''} ${d.shortDescription ?? ''}`,
    },
    status,
    reason: pr.playabilityStatus?.reason,
  };
}

const baseLang = (code: string) => code.toLowerCase().split('-')[0] ?? code;

export function pickTrack(tracks: CaptionTrack[]): CaptionTrack | null {
  if (tracks.length === 0) return null;
  const preferred = ['nl', 'en'];
  for (const lang of preferred) {
    const manual = tracks.find((t) => t.kind !== 'asr' && baseLang(t.languageCode) === lang);
    if (manual) return manual;
    const auto = tracks.find((t) => baseLang(t.languageCode) === lang);
    if (auto) return auto;
  }
  return tracks.find((t) => t.kind !== 'asr') ?? tracks[0] ?? null;
}

interface Json3 {
  events?: { tStartMs?: number; dDurationMs?: number; segs?: { utf8?: string }[] }[];
}

export function parseJson3(data: Json3): TranscriptSegment[] {
  const out: TranscriptSegment[] = [];
  for (const ev of data.events ?? []) {
    if (!ev.segs) continue;
    const tekst = ev.segs
      .map((s) => s.utf8 ?? '')
      .join('')
      .replace(/[\u200b\u200e\u200f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!tekst) continue;
    out.push({ start: (ev.tStartMs ?? 0) / 1000, duur: (ev.dDurationMs ?? 0) / 1000, tekst });
  }
  return out;
}

export async function fetchTrack(
  track: CaptionTrack,
  deps: FetchDeps = {},
): Promise<TranscriptSegment[]> {
  const doFetch = deps.fetch ?? globalThis.fetch.bind(globalThis);
  const url = new URL(track.baseUrl, 'https://www.youtube.com');
  url.searchParams.set('fmt', 'json3');
  const res = await doFetch(url.toString(), { credentials: 'omit' });
  if (!res.ok) throw new Error(`timedtext ${res.status}`);
  const text = await res.text();
  if (!text.trim()) return [];
  return parseJson3(JSON.parse(text) as Json3);
}

export interface TranscriptResult {
  info: VideoInfo;
  transcript: Transcript | null;
  reden?: string;
}

export async function getTranscriptById(
  videoId: string,
  deps: FetchDeps = {},
): Promise<TranscriptResult> {
  const info = await fetchVideoInfo(videoId, deps);
  if (info.status === 'unavailable') {
    return { info, transcript: null, reden: info.reason ?? 'video niet beschikbaar' };
  }
  const ordered = orderedTracks(info.tracks);
  if (ordered.length === 0) return { info, transcript: null, reden: 'geen ondertitels' };
  for (const track of ordered.slice(0, 3)) {
    try {
      const segmenten = await fetchTrack(track, deps);
      if (segmenten.length > 0) {
        return {
          info,
          transcript: {
            videoId,
            taal: track.languageCode,
            soort: track.kind === 'asr' ? 'automatisch' : 'handmatig',
            segmenten,
          },
        };
      }
    } catch {
      // try next track
    }
  }
  return { info, transcript: null, reden: 'ondertitels leeg of geblokkeerd' };
}

function orderedTracks(tracks: CaptionTrack[]): CaptionTrack[] {
  const first = pickTrack(tracks);
  if (!first) return [];
  return [first, ...tracks.filter((t) => t !== first)];
}
