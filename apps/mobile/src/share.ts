// Shared text from the YouTube app or a browser -> video ID. The YouTube app shares
// "title\nhttps://youtu.be/<id>?si=…", browsers share just the URL.
import { parseStartTime, parseVideoId } from '@wwjd/core';

export interface SharedVideo {
  videoId: string;
  /** Start time from a `t` parameter, in seconds. */
  start: number | null;
}

const URL_RE = /https?:\/\/[^\s<>"']+/g;

export function videoFromShare(text: string | null | undefined): SharedVideo | null {
  if (!text) return null;
  const trimmed = text.trim();
  const direct = parseVideoId(trimmed);
  if (direct) return { videoId: direct, start: parseStartTime(trimmed) };
  for (const url of trimmed.match(URL_RE) ?? []) {
    const clean = url.replace(/[).,;!?]+$/, '');
    const videoId = parseVideoId(clean);
    if (videoId) return { videoId, start: parseStartTime(clean) };
  }
  return null;
}
