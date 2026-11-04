// Welcome screen: shown at first start while setup is unfinished, and from every "Setup guide"
// link. Same shared view as the extension's welcome page; "Done" goes to the start screen.
import { checkKey, findOnboardingClips, h, renderWelcome, type WelcomeView } from '@wwjd/core';
import type { App, Screen } from '../app';
import { nativeFetch } from '../nativeFetch';

export function welcomeScreen(app: App): Screen {
  const t = app.t;
  const el = h('div', { class: 'screen welcome' });
  // Own Shadow DOM: the app's global button/section styles must not reach the shared view.
  const shadow = el.attachShadow({ mode: 'open' });
  let view: WelcomeView | undefined;
  let disposed = false;

  void (async () => {
    const [keys, clips] = await Promise.all([
      app.keys.get(),
      findOnboardingClips((file) => new URL(file, document.baseURI).href),
    ]);
    if (disposed) return;
    view = renderWelcome(shadow, {
      t,
      keys: { gemini: keys.gemini, factcheck: keys.factcheck },
      saveKey: (kind, value) => app.keys.set(kind, value),
      checkKey: (kind, value) => checkKey(kind, value, { fetch: nativeFetch, timeoutMs: 15_000 }),
      doneLabel: t.onboarding.doneButtonApp,
      onDone: async () => {
        await app.settings.save({ provider: 'gemini' });
        app.go('#/');
      },
      clipUrl: (kind) => clips[kind],
      // Like the other links in the app: the WebView hands external pages to the browser.
      openUrl: (url) => {
        window.location.href = url;
      },
    });
  })();

  return {
    title: t.onboarding.setupGuide,
    el,
    dispose() {
      disposed = true;
      view?.dispose();
    },
  };
}
