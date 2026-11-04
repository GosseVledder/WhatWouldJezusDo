// Score badges on YouTube thumbnails, only for videos the user already analysed: the scores come
// from the local cache, so showing them costs no AI calls.
import type { WwjdEvaluation } from '../engine/types';
import type { Messages } from '../i18n/messages';
import { parseVideoId } from '../youtube/videoId';
import { presenterScoreOf } from './render';

export interface BadgeScore {
  /** Story & facts score. */
  s: number;
  /** Presenter score, when scored separately. */
  p?: number;
}

export function badgeScoreOf(evaluation: WwjdEvaluation): BadgeScore {
  const p = presenterScoreOf(evaluation);
  return p === undefined ? { s: evaluation.finalScore } : { s: evaluation.finalScore, p };
}

const BADGE_CLASS = 'wwjd-badge';
const scoreTone = (score: number) => (score >= 7 ? 'high' : score < 4 ? 'low' : 'mid');

/** Thumbnail links on YouTube pages (home, search, sidebar, channel, playlists). */
const THUMB_LINKS = [
  'a#thumbnail[href*="/watch?v="]',
  'a.yt-lockup-view-model__content-image[href*="/watch?v="]',
  'a.yt-lockup-view-model-wiz__content-image[href*="/watch?v="]',
  'a.reel-item-endpoint[href*="/shorts/"]',
  'a#thumbnail[href*="/shorts/"]',
].join(',');

/**
 * Adds, updates or removes the badge on every thumbnail under `root`. Safe to call often (after
 * DOM changes): links YouTube recycles for another video get the right badge or none.
 */
export function applyScoreBadges(
  root: ParentNode,
  scores: ReadonlyMap<string, BadgeScore>,
  t: Messages,
): number {
  let shown = 0;
  root.querySelectorAll<HTMLAnchorElement>(THUMB_LINKS).forEach((a) => {
    const id = parseVideoId(a.getAttribute('href') || a.href || '');
    const score = id ? scores.get(id) : undefined;
    let badge = a.querySelector<HTMLElement>(`:scope > .${BADGE_CLASS}`);
    if (!score) {
      badge?.remove();
      return;
    }
    if (!badge) {
      badge = a.ownerDocument.createElement('span');
      badge.className = BADGE_CLASS;
      a.append(badge);
      if (getComputedStyle(a).position === 'static') a.style.position = 'relative';
    }
    const text =
      score.p === undefined
        ? `WWJD ${score.s.toFixed(1)}`
        : `WWJD ${score.s.toFixed(1)} · ${score.p.toFixed(1)}`;
    if (badge.textContent !== text) badge.textContent = text;
    badge.dataset.tone = scoreTone(score.s);
    badge.title =
      score.p === undefined
        ? `${t.view.jesusAlignment}: ${score.s.toFixed(1)} / 10`
        : `${t.view.subjectScore} ${score.s.toFixed(1)} · ${t.view.presenterScore} ${score.p.toFixed(1)}`;
    shown++;
  });
  return shown;
}

export function removeScoreBadges(root: ParentNode): void {
  root.querySelectorAll(`.${BADGE_CLASS}`).forEach((b) => b.remove());
}

/** Page stylesheet for the badges (they live in YouTube's own DOM, not in a shadow root). */
export const BADGE_CSS = `
.${BADGE_CLASS} {
  position: absolute; top: 6px; left: 6px; z-index: 3; pointer-events: none;
  padding: 2px 6px; border-radius: 4px; font: 600 12px/16px Roboto, Arial, sans-serif;
  color: #fff; background: rgba(0, 0, 0, 0.78); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.${BADGE_CLASS}[data-tone='high'] { background: #137333; }
.${BADGE_CLASS}[data-tone='mid'] { background: #b06000; }
.${BADGE_CLASS}[data-tone='low'] { background: #c5221f; }
`;
