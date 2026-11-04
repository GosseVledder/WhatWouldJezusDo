// Synced live mode: while the video plays, light up the fact check or teaching note that is
// being said and scroll to it. The rendered view marks every such item with `data-moments`
// (start seconds, comma separated) and, for the items worth scrolling to, `data-scroll` plus
// `data-live-*` texts that the video overlay (M3.6) shows.

export interface LiveMoment {
  start: number;
  kind: 'fact' | 'teaching';
  /** Main text: the checked claim, or the guideline title. */
  text: string;
  /** Short label: the verdict, or the score. */
  label: string;
  /** CSS tone: a verdict (bevestigd, ontkracht, …) or score-high/mid/low. */
  tone: string;
}

export interface LiveSyncOptions {
  /** Scroll so that `el` is in view; default: scroll the nearest `.live-scroll` container. */
  scrollTo?: (el: HTMLElement) => void;
  /** Element whose own scrolling pauses auto-scroll for `pauseMs` (default the container). */
  userScrollTarget?: EventTarget | null;
  pauseMs?: number;
  /** Seconds a moment stays "now" when nothing new follows (default 30). */
  holdSeconds?: number;
  /** Light up and scroll in the view (default true); false only reports the moment (overlay). */
  highlight?: boolean;
}

export interface LiveSync {
  /** Call with the current playback time; returns the active moment (or null). */
  update(seconds: number): LiveMoment | null;
  stop(): void;
}

/** Scrolls `el` into view inside its scroll container only, never the page. */
export function scrollWithinContainer(el: HTMLElement): void {
  const box = el.closest<HTMLElement>('.live-scroll');
  if (!box) return;
  const top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
  box.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
}

export function createLiveSync(root: ParentNode, opts: LiveSyncOptions = {}): LiveSync {
  const byStart = new Map<number, HTMLElement[]>();
  root.querySelectorAll<HTMLElement>('[data-moments]').forEach((el) => {
    for (const part of (el.dataset.moments ?? '').split(',')) {
      const start = Number(part);
      if (!part.trim() || !Number.isFinite(start)) continue;
      const list = byStart.get(start) ?? [];
      list.push(el);
      byStart.set(start, list);
    }
  });
  const starts = [...byStart.keys()].sort((a, b) => a - b);
  const hold = opts.holdSeconds ?? 30;
  const pauseMs = opts.pauseMs ?? 4000;
  const scrollTo = opts.scrollTo ?? scrollWithinContainer;

  let active: number | null = null;
  let pausedUntil = 0;
  let autoScrolling = false;
  const target = opts.userScrollTarget ?? root.querySelector('.live-scroll');
  const onUser = () => {
    if (!autoScrolling) pausedUntil = Date.now() + pauseMs;
  };
  const userEvents = ['wheel', 'touchmove', 'keydown'];
  userEvents.forEach((e) => target?.addEventListener(e, onUser, { passive: true }));

  const momentOf = (start: number): LiveMoment | null => {
    const el = byStart.get(start)?.find((e) => e.dataset.liveKind);
    if (!el) return null;
    return {
      start,
      kind: el.dataset.liveKind === 'teaching' ? 'teaching' : 'fact',
      text: el.dataset.liveText ?? '',
      label: el.dataset.liveLabel ?? '',
      tone: el.dataset.liveTone ?? '',
    };
  };

  return {
    update(seconds) {
      let next: number | null = null;
      for (const s of starts) {
        if (s <= seconds + 0.25) next = s;
        else break;
      }
      if (next !== null && seconds - next > hold) next = null;
      if (next !== active) {
        if (active !== null) byStart.get(active)?.forEach((el) => el.classList.remove('is-now'));
        active = next;
        if (active !== null && opts.highlight !== false) {
          const els = byStart.get(active) ?? [];
          els.forEach((el) => el.classList.add('is-now'));
          const scrollEl = els.find((el) => el.hasAttribute('data-scroll'));
          if (scrollEl && Date.now() >= pausedUntil) {
            autoScrolling = true;
            scrollTo(scrollEl);
            window.setTimeout(() => (autoScrolling = false), 600);
          }
        }
      }
      return active === null ? null : momentOf(active);
    },
    stop() {
      userEvents.forEach((e) => target?.removeEventListener(e, onUser));
      if (active !== null) byStart.get(active)?.forEach((el) => el.classList.remove('is-now'));
      active = null;
    },
  };
}
