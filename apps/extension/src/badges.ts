// Thumbnail badges on every YouTube page: the score of videos already analysed in the chosen
// language, from the local score index (no AI calls). Follows YouTube's endless DOM changes.
import {
  applyScoreBadges,
  BADGE_CSS,
  messages,
  removeScoreBadges,
  type BadgeScore,
  type WwjdSettings,
} from '@wwjd/core';
import { getScoresForLanguage, SCORE_INDEX } from './storage/cache';

export function startThumbnailBadges(getSettings: () => WwjdSettings): { stop(): void; refresh(): void } {
  let scores = new Map<string, BadgeScore>();
  let timer: number | undefined;
  let stopped = false;

  const style = document.createElement('style');
  style.id = 'wwjd-badge-style';
  style.textContent = BADGE_CSS;
  (document.head ?? document.documentElement).append(style);

  const apply = () => {
    timer = undefined;
    if (stopped) return;
    const s = getSettings();
    if (!s.actief || scores.size === 0) removeScoreBadges(document);
    else applyScoreBadges(document, scores, messages(s.taal));
  };
  const schedule = () => {
    if (timer === undefined) timer = window.setTimeout(apply, 400);
  };

  const load = async () => {
    scores = await getScoresForLanguage(getSettings().taal).catch(() => new Map());
    schedule();
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const onStorage = (changes: Record<string, unknown>, area: string) => {
    if (area === 'local' && (SCORE_INDEX in changes || 'settings' in changes)) void load();
  };
  browser.storage.onChanged.addListener(onStorage);
  void load();

  return {
    refresh: () => void load(),
    stop() {
      stopped = true;
      observer.disconnect();
      browser.storage.onChanged.removeListener(onStorage);
      window.clearTimeout(timer);
      removeScoreBadges(document);
      style.remove();
    },
  };
}
