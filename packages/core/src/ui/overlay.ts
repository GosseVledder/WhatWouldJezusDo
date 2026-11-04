// "Overlay on video": a small, unobtrusive subtitle-style card on the player at each checked
// moment of the synced live mode. It never takes clicks (the video stays usable) and hides
// itself after a few seconds.
import type { LiveMoment } from './liveSync';

export interface VideoOverlay {
  /** Show the moment (a new start shows the card again); null hides it. */
  show(moment: LiveMoment | null): void;
  /** Re-attach after the player element was replaced. */
  mount(player: HTMLElement): void;
  destroy(): void;
}

const TONE_ICON: Record<string, string> = {
  bevestigd: '✓',
  ontkracht: '✗',
  tegenspraak: '⚠',
  gemengd_of_context: '◐',
  opinie: '💬',
};

export function createVideoOverlay(
  player: HTMLElement,
  opts: { visibleMs?: number; doc?: Document } = {},
): VideoOverlay {
  const doc = opts.doc ?? document;
  const visibleMs = opts.visibleMs ?? 6000;
  const host = doc.createElement('div');
  host.id = 'wwjd-overlay';
  host.setAttribute('aria-hidden', 'true');
  Object.assign(host.style, {
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    zIndex: '60',
  });
  const shadow = host.attachShadow({ mode: 'open' });
  const style = doc.createElement('style');
  style.textContent = OVERLAY_CSS;
  const card = doc.createElement('div');
  card.className = 'card';
  const mark = doc.createElement('span');
  mark.className = 'mark';
  const label = doc.createElement('span');
  label.className = 'label';
  const text = doc.createElement('span');
  text.className = 'text';
  card.append(mark, label, text);
  shadow.append(style, card);

  let shownStart: number | null = null;
  let timer: number | undefined;

  const hide = () => {
    card.classList.remove('show');
  };

  const mount = (p: HTMLElement) => {
    if (host.parentElement !== p) p.append(host);
  };
  mount(player);

  return {
    show(moment) {
      if (!moment) {
        shownStart = null;
        window.clearTimeout(timer);
        hide();
        return;
      }
      if (moment.start === shownStart) return;
      shownStart = moment.start;
      card.dataset.kind = moment.kind;
      card.dataset.tone = moment.tone;
      mark.textContent = moment.kind === 'teaching' ? '📖' : (TONE_ICON[moment.tone] ?? '•');
      label.textContent = moment.label;
      text.textContent = moment.text;
      card.classList.add('show');
      window.clearTimeout(timer);
      timer = window.setTimeout(hide, visibleMs);
    },
    mount,
    destroy() {
      window.clearTimeout(timer);
      host.remove();
    },
  };
}

const OVERLAY_CSS = `
.card {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 64px;
  margin: 0 auto;
  width: fit-content;
  transform: translateY(8px);
  max-width: min(78%, 640px);
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(8, 8, 8, 0.72);
  color: #fff;
  font: 500 14px/1.35 Roboto, Arial, sans-serif;
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
}
.card.show { opacity: 1; transform: none; }
.mark { flex: none; font-weight: 700; }
.label {
  flex: none;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  background: rgba(255, 255, 255, 0.16);
}
.text {
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card[data-tone='bevestigd'] .label, .card[data-tone='score-high'] .label { background: #1e8e3e; }
.card[data-tone='ontkracht'] .label, .card[data-tone='tegenspraak'] .label, .card[data-tone='score-low'] .label { background: #c5221f; }
.card[data-tone='gemengd_of_context'] .label, .card[data-tone='score-mid'] .label { background: #b06000; }
`;
