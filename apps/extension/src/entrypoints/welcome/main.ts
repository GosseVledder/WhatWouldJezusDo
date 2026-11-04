// Welcome page: opens on install and from every "Setup guide" link. Two key cards with a
// live check; "Done" opens YouTube once both keys are green.
import {
  checkKey,
  findOnboardingClips,
  messages,
  renderWelcome,
  UI_LANGUAGE_NAMES,
  UI_LANGUAGES,
  type UiLang,
  type WelcomeView,
} from '@wwjd/core';
import { keyStore } from '../../storage/secrets';
import { getSettings, saveSettings } from '../../storage/settings';

let view: WelcomeView | undefined;

async function render(lang: UiLang): Promise<void> {
  const t = messages(lang);
  document.documentElement.lang = lang;
  document.title = `WWJD – ${t.onboarding.setupGuide}`;
  const [keys, clips] = await Promise.all([keyStore.get(), findOnboardingClips((file) => browser.runtime.getURL(`/${file}` as '/'))]);
  view?.dispose();
  view = renderWelcome(document.getElementById('welcome')!, {
    t,
    keys: { gemini: keys.gemini, factcheck: keys.factcheck },
    saveKey: keyStore.set,
    checkKey: (kind, value) => checkKey(kind, value, { timeoutMs: 15_000 }),
    doneLabel: t.onboarding.doneButton,
    onDone: async () => {
      // Onboarding is Gemini-only: make sure that is the active service and the panel is on.
      await saveSettings({ provider: 'gemini', actief: true });
      window.location.href = 'https://www.youtube.com/';
    },
    clipUrl: (kind) => clips[kind],
  });
}

async function init(): Promise<void> {
  const s = await getSettings();
  const select = document.getElementById('lang') as HTMLSelectElement;
  select.replaceChildren(
    ...UI_LANGUAGES.map((code) =>
      Object.assign(document.createElement('option'), {
        value: code,
        textContent: UI_LANGUAGE_NAMES[code],
      }),
    ),
  );
  select.value = s.taal;
  select.addEventListener('change', async () => {
    const lang = select.value as UiLang;
    await saveSettings({ taal: lang });
    await render(lang);
  });
  await render(s.taal);
}

void init();
