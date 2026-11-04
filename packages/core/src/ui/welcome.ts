// Welcome page (first start, and "Setup guide"): two numbered cards, one per key, each with
// one big button to the page where the key is made, a "show me where to click" clip or step
// list, and a paste field that is checked live. "Done" unlocks once both keys are green.
// Shared by the extension (welcome page) and the Android app (welcome screen).
import type { KeyCheckResult, KeyProblem } from '../onboarding/keyCheck';
import { ENABLE_API_URLS } from '../onboarding/keyCheck';
import type { Messages, OnboardingKind } from '../i18n/messages';
import { KEY_URLS } from './keySteps';
import { h } from './render';

export const ONBOARDING_KINDS: OnboardingKind[] = ['gemini', 'factcheck'];

/** Check results that mean the key itself is unusable here; such a key is not stored. */
const REJECTED: ReadonlySet<KeyProblem> = new Set<KeyProblem>(['wrong_key', 'wrong_api']);

/** The page each card's big button opens: AI Studio, and the Fact Check Tools API in Google Cloud. */
export const ONBOARDING_URLS: Record<OnboardingKind, string> = {
  gemini: KEY_URLS.gemini,
  factcheck: ENABLE_API_URLS.factcheck,
};

/** Clip files looked for per card, in order (bundled under `onboarding/` in each app). */
export const ONBOARDING_CLIP_FILES: Record<OnboardingKind, string[]> = {
  gemini: ['onboarding/gemini.webm', 'onboarding/gemini.mp4', 'onboarding/gemini.gif'],
  factcheck: ['onboarding/factcheck.webm', 'onboarding/factcheck.mp4', 'onboarding/factcheck.gif'],
};

/** Finds the bundled clips; `resolve` turns a file into a URL of the running app. */
export async function findOnboardingClips(
  resolve: (file: string) => string,
  doFetch: typeof fetch = globalThis.fetch.bind(globalThis),
): Promise<Partial<Record<OnboardingKind, string>>> {
  const found: Partial<Record<OnboardingKind, string>> = {};
  for (const kind of ONBOARDING_KINDS) {
    for (const file of ONBOARDING_CLIP_FILES[kind]) {
      const url = resolve(file);
      const ok = await doFetch(url, { method: 'HEAD' })
        .then((r) => r.ok && !/text\/html/i.test(r.headers.get('content-type') ?? ''))
        .catch(() => false);
      if (ok) {
        found[kind] = url;
        break;
      }
    }
  }
  return found;
}

export interface WelcomeOptions {
  t: Messages;
  /** Keys already stored; they are checked right away. */
  keys: Record<OnboardingKind, string>;
  saveKey(kind: OnboardingKind, value: string): Promise<void>;
  checkKey(kind: OnboardingKind, value: string): Promise<KeyCheckResult>;
  /** Text of the finish button ("open a YouTube video" / "analyse a video"). */
  doneLabel: string;
  onDone(): void;
  /** URL of a short clip (GIF/WebM/MP4) per card, when one is bundled. */
  clipUrl?(kind: OnboardingKind): string | undefined;
  /** Open an external page; default is a normal link in a new tab. */
  openUrl?(url: string): void;
  /** Wait after the last keystroke before checking (ms). */
  debounceMs?: number;
}

export interface WelcomeView {
  /** Current state per key: true when the live check passed. */
  readonly green: Record<OnboardingKind, boolean>;
  dispose(): void;
}

type CardState =
  | { kind: 'empty' }
  | { kind: 'checking' }
  | { kind: 'ok' }
  | { kind: 'error'; result: Extract<KeyCheckResult, { ok: false }> };

export function renderWelcome(
  container: HTMLElement | ShadowRoot,
  opts: WelcomeOptions,
): WelcomeView {
  const { t } = opts;
  const O = t.onboarding;
  const green: Record<OnboardingKind, boolean> = { gemini: false, factcheck: false };
  const timers: number[] = [];
  let disposed = false;

  const link = (url: string, cls: string, text: string) => {
    const a = h('a', { class: cls, href: url, target: '_blank', rel: 'noreferrer' }, text);
    if (opts.openUrl) {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        opts.openUrl!(url);
      });
    }
    return a;
  };

  const done = h(
    'button',
    { type: 'button', class: 'ww-done', disabled: true, onClick: () => opts.onDone() },
    opts.doneLabel,
  );
  const doneHint = h('p', { class: 'ww-done-hint' }, O.doneWaiting);
  const updateDone = () => {
    const all = ONBOARDING_KINDS.every((k) => green[k]);
    done.disabled = !all;
    doneHint.hidden = all;
  };

  const card = (kind: OnboardingKind, index: number) => {
    const title = kind === 'gemini' ? O.geminiTitle : O.factcheckTitle;
    const text = kind === 'gemini' ? O.geminiText : O.factcheckText;
    const button = kind === 'gemini' ? O.geminiButton : O.factcheckButton;
    const inputId = `ww-key-${kind}`;

    const clip = opts.clipUrl?.(kind);
    const media = clip
      ? /\.(webm|mp4)$/i.test(clip)
        ? h('video', {
            class: 'ww-clip',
            src: clip,
            autoplay: true,
            loop: true,
            muted: true,
            playsinline: true,
            'aria-hidden': 'true',
          })
        : h('img', { class: 'ww-clip', src: clip, alt: '' })
      : null;
    const show = h(
      'details',
      { class: 'ww-show' },
      h('summary', {}, O.showMe),
      media,
      h('ol', {}, ...O.steps[kind].map((s) => h('li', {}, s))),
    );

    const input = h('input', {
      id: inputId,
      type: 'text',
      autocomplete: 'off',
      spellcheck: 'false',
      autocapitalize: 'off',
      placeholder: kind === 'gemini' ? 'AIza… / AQ.…' : 'AIza…',
      value: opts.keys[kind] ?? '',
    });
    const status = h('div', { class: 'ww-status', 'aria-live': 'polite' });
    const tick = h('span', { class: 'ww-tick', 'aria-hidden': 'true' }, '✓');
    const el = h(
      'section',
      { class: 'ww-card', 'data-kind': kind, 'aria-labelledby': `ww-title-${kind}` },
      h(
        'div',
        { class: 'ww-card-head' },
        h('span', { class: 'ww-num', 'aria-hidden': 'true' }, String(index + 1)),
        h('h2', { id: `ww-title-${kind}` }, title.replace(/^\d+\.\s*/, '')),
        tick,
      ),
      h('p', { class: 'ww-text' }, text),
      link(ONBOARDING_URLS[kind], 'ww-big', `${button} ↗`),
      show,
      h('label', { class: 'ww-label', for: inputId }, O.pasteLabel),
      input,
      status,
    );

    let run = 0;
    const setState = (s: CardState) => {
      green[kind] = s.kind === 'ok';
      el.dataset.state = s.kind;
      tick.hidden = s.kind !== 'ok';
      if (s.kind === 'empty') status.replaceChildren();
      else if (s.kind === 'checking') {
        status.replaceChildren(
          h('span', { class: 'ww-spinner', 'aria-hidden': 'true' }),
          O.checking,
        );
      } else if (s.kind === 'ok') status.replaceChildren(h('b', {}, `✓ ${O.works}`));
      else {
        const { problem, activationUrl } = s.result;
        status.replaceChildren(
          h('p', { class: 'ww-error', role: 'alert' }, O.problems[problem]),
          h(
            'div',
            { class: 'ww-error-actions' },
            problem === 'api_not_enabled'
              ? link(activationUrl ?? ENABLE_API_URLS[kind], 'ww-enable', `${O.enableButton} ↗`)
              : null,
            h(
              'button',
              { type: 'button', class: 'ww-retry', onClick: () => void check() },
              O.retry,
            ),
          ),
        );
      }
      updateDone();
    };

    const check = async () => {
      const value = input.value.trim();
      const my = ++run;
      if (!value) {
        await opts.saveKey(kind, '');
        setState({ kind: 'empty' });
        return;
      }
      setState({ kind: 'checking' });
      const result = await opts.checkKey(kind, value);
      if (disposed || my !== run) return;
      // A key Google rejects outright is not kept, so "Setup not finished" keeps showing until a
      // working key is pasted. Keys that hit a passing problem (offline, quota, API still off)
      // are kept: the key itself is fine.
      await opts.saveKey(kind, result.ok || !REJECTED.has(result.problem) ? value : '');
      if (disposed || my !== run) return;
      setState(result.ok ? { kind: 'ok' } : { kind: 'error', result });
    };

    let timer: number | undefined;
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void check(), opts.debounceMs ?? 500);
      timers.push(timer);
    });
    // A paste is the normal way in: check right away.
    input.addEventListener('paste', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void check(), 0);
      timers.push(timer);
    });

    setState({ kind: 'empty' });
    if (input.value.trim()) void check();
    return el;
  };

  const style = h('style', {}, WELCOME_CSS);
  const root = h(
    'div',
    { class: 'ww-welcome' },
    h('header', { class: 'ww-head' }, h('h1', {}, O.title), h('p', {}, O.intro)),
    ...ONBOARDING_KINDS.map((k, i) => card(k, i)),
    h('div', { class: 'ww-finish' }, done, doneHint),
    h('p', { class: 'ww-foot' }, O.privacy, ' ', O.otherAi),
  );
  container.replaceChildren(style, root);

  return {
    green,
    dispose() {
      disposed = true;
      timers.forEach((id) => window.clearTimeout(id));
    },
  };
}

export const WELCOME_CSS = `
.ww-welcome {
  --ww-bg: #f4f5f7; --ww-card: #fff; --ww-text: #15181e; --ww-text-2: #5d6470;
  --ww-border: #e3e6eb; --ww-field: #fff; --ww-field-border: #cfd4db;
  --ww-accent: #1a56db; --ww-on-accent: #fff; --ww-accent-soft: #ebf1fd;
  --ww-ok: #137a3a; --ww-ok-soft: #e8f6ed; --ww-error: #c42b1c; --ww-error-soft: #fdeeec;
  box-sizing: border-box; max-width: 640px; margin: 0 auto; padding: 24px 16px 40px;
  color: var(--ww-text); font: 15px/1.5 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  .ww-welcome {
    --ww-bg: #0f1114; --ww-card: #181b20; --ww-text: #e9ecf0; --ww-text-2: #9aa2ad;
    --ww-border: #272b32; --ww-field: #111317; --ww-field-border: #363b44;
    --ww-accent: #6d9cff; --ww-on-accent: #0b1220; --ww-accent-soft: #1c2a45;
    --ww-ok: #4cc77a; --ww-ok-soft: #13291c; --ww-error: #ff7a6b; --ww-error-soft: #34191a;
  }
}
.ww-welcome *, .ww-welcome *::before, .ww-welcome *::after { box-sizing: border-box; }
.ww-welcome [hidden] { display: none !important; }
.ww-head h1 { font-size: 24px; line-height: 1.25; margin: 0 0 6px; }
.ww-head p { margin: 0 0 20px; color: var(--ww-text-2); }
.ww-card {
  background: var(--ww-card); border: 1px solid var(--ww-border); border-radius: 14px;
  padding: 18px; margin-bottom: 16px;
}
.ww-card[data-state='ok'] { border-color: var(--ww-ok); }
.ww-card-head { display: flex; align-items: center; gap: 10px; }
.ww-card-head h2 { flex: 1; font-size: 18px; margin: 0; }
.ww-num {
  display: inline-grid; place-items: center; width: 30px; height: 30px; flex: none;
  border-radius: 50%; background: var(--ww-accent); color: var(--ww-on-accent); font-weight: 700;
}
.ww-card[data-state='ok'] .ww-num { background: var(--ww-ok); }
.ww-tick {
  display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 50%;
  background: var(--ww-ok); color: #fff; font-weight: 700; font-size: 18px;
}
.ww-text { margin: 8px 0 14px; color: var(--ww-text-2); }
.ww-big {
  display: block; text-align: center; padding: 14px 16px; border-radius: 10px;
  background: var(--ww-accent); color: var(--ww-on-accent); font-weight: 600; font-size: 16px;
  text-decoration: none;
}
.ww-big:hover { filter: brightness(1.08); text-decoration: none; }
.ww-show { margin: 12px 0 4px; }
.ww-show summary { cursor: pointer; color: var(--ww-accent); font-weight: 500; }
.ww-show ol { margin: 8px 0 0; padding-left: 22px; }
.ww-show li { margin: 4px 0; }
.ww-clip { display: block; width: 100%; margin-top: 10px; border-radius: 8px; border: 1px solid var(--ww-border); }
.ww-label { display: block; margin: 14px 0 6px; font-weight: 600; }
.ww-card input {
  width: 100%; padding: 12px; font: inherit; font-family: ui-monospace, Consolas, monospace;
  color: var(--ww-text); background: var(--ww-field); border: 1px solid var(--ww-field-border);
  border-radius: 8px;
}
.ww-card[data-state='ok'] input { border-color: var(--ww-ok); background: var(--ww-ok-soft); }
.ww-card[data-state='error'] input { border-color: var(--ww-error); }
.ww-card input:focus-visible { outline: 2px solid var(--ww-accent); outline-offset: 1px; }
.ww-status { min-height: 24px; margin-top: 8px; }
.ww-status b { color: var(--ww-ok); }
.ww-error {
  margin: 0; padding: 10px 12px; border-radius: 8px; background: var(--ww-error-soft); color: var(--ww-error);
}
.ww-error-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.ww-enable, .ww-retry {
  padding: 8px 14px; border-radius: 8px; font: inherit; font-weight: 600; cursor: pointer;
  border: 1px solid var(--ww-accent); text-decoration: none;
}
.ww-enable { background: var(--ww-accent); color: var(--ww-on-accent); }
.ww-retry { background: transparent; color: var(--ww-accent); }
.ww-spinner {
  display: inline-block; width: 14px; height: 14px; margin-right: 8px; vertical-align: -2px;
  border: 2px solid var(--ww-border); border-top-color: var(--ww-accent); border-radius: 50%;
  animation: ww-spin 0.8s linear infinite;
}
@keyframes ww-spin { to { transform: rotate(360deg); } }
.ww-finish { margin-top: 8px; text-align: center; }
.ww-done {
  width: 100%; padding: 16px; border: 0; border-radius: 12px; font: inherit; font-size: 17px;
  font-weight: 700; background: var(--ww-ok); color: #fff; cursor: pointer;
}
.ww-done:disabled { background: var(--ww-border); color: var(--ww-text-2); cursor: not-allowed; }
.ww-done-hint { margin: 8px 0 0; color: var(--ww-text-2); font-size: 14px; }
.ww-foot { margin-top: 24px; color: var(--ww-text-2); font-size: 13px; text-align: center; }
`;
