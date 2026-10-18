// Settings: language, AI service, keys and models (with "Test connection"), Google Fact Check API,
// display options, cache and updates; an ⓘ explains each setting. Every change is saved
// directly. Same design as the extension's options page: grouped cards with switches and
// stacked fields.
import {
  h,
  ICONS,
  KEY_URLS,
  keySteps,
  MODEL_SUGGESTIONS,
  testClaudeConnection,
  testFactCheckConnection,
  testGeminiConnection,
  tooltips,
  UI_LANGUAGE_NAMES,
  UI_LANGUAGES,
  type Messages,
  type ProviderId,
  type ReleaseAsset,
  type TipKey,
  type UiLang,
  type WwjdSettings,
} from '@wwjd/core';
import type { App, Screen } from '../app';
import { checkAppUpdate, downloadAndInstall, installedVersion, UpdateError } from '../appUpdate';
import { nativeFetch } from '../nativeFetch';

const PROVIDER_IDS: ProviderId[] = ['gemini', 'claude'];
const PROVIDER_INFO: Record<
  ProviderId,
  { name: string; vendor: string; placeholder: string; url: string }
> = {
  claude: {
    name: 'Claude',
    vendor: 'Anthropic',
    placeholder: 'sk-ant-…',
    url: KEY_URLS.claude,
  },
  gemini: {
    name: 'Gemini',
    vendor: 'Google',
    placeholder: 'AIza…',
    url: KEY_URLS.gemini,
  },
};

function debounce<A extends unknown[]>(fn: (...a: A) => void, ms: number): (...a: A) => void {
  let t: number | undefined;
  return (...a) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...a), ms);
  };
}

/** ⓘ that shows the explanation `key` from the tips (tap to open, tap elsewhere to close). */
function tipButton(t: Messages, key: TipKey, topic: string): HTMLButtonElement {
  const button = h('button', {
    class: 'tip',
    html: ICONS.info,
    'aria-label': `${t.settings.tipLabel}: ${topic}`,
  });
  tooltips().bind(button, () => t.tips[key]);
  return button;
}

/** A title, with its ⓘ next to it when given. */
const titleLine = (title: Node | string, tip?: HTMLButtonElement | null) =>
  tip
    ? h('span', { class: 'title-line' }, h('span', { class: 'row-title' }, title), tip)
    : h('span', { class: 'row-title' }, title);

/** A titled group with one card. */
const group = (title: string, tip: HTMLButtonElement | null, ...children: (Node | null)[]) =>
  h(
    'section',
    { class: 'group' },
    h('div', { class: 'group-head' }, h('h2', {}, title), tip),
    h('div', { class: 'card' }, ...children),
  );

/** Label above a full-width control, optional hint below. */
const field = (
  title: Node | string,
  control: Node,
  hint?: Node | string | null,
  tip?: HTMLButtonElement | null,
) =>
  h(
    'label',
    { class: 'field' },
    titleLine(title, tip),
    control,
    hint ? h('span', { class: 'row-hint' }, hint) : null,
  );

/** A whole-row switch: text on the left, the switch on the right. */
const switchRow = (
  title: string,
  hint: string,
  input: HTMLInputElement,
  tip?: HTMLButtonElement | null,
) =>
  h(
    'label',
    { class: 'row' },
    h('span', { class: 'row-text' }, titleLine(title, tip), h('span', { class: 'row-hint' }, hint)),
    input,
  );

export function settingsScreen(app: App): Screen {
  const el = h(
    'div',
    { class: 'screen settings' },
    h('p', { class: 'hint loading' }, app.t.settings.loading),
  );
  void build(app, el);
  return {
    title: app.t.settings.title,
    el,
    dispose: () => tooltips().hide(),
  };
}

async function build(app: App, el: HTMLElement): Promise<void> {
  const t = app.t;
  const T = t.settings;
  let s: WwjdSettings = await app.settings.get();
  const keys = await app.keys.get();
  const save = async (patch: Partial<WwjdSettings>) => {
    s = await app.settings.save(patch);
  };

  // Language selector
  const taalSelect = h(
    'select',
    {
      onChange: async (e: Event) => {
        const lang = (e.target as HTMLSelectElement).value as UiLang;
        await save({ taal: lang });
        app.setLanguage(lang);
      },
    },
    ...UI_LANGUAGES.map((code) =>
      h('option', { value: code, selected: code === s.taal }, UI_LANGUAGE_NAMES[code]),
    ),
  );

  // AI service: the chosen provider's key block.
  const blocks = Object.fromEntries(
    PROVIDER_IDS.map((p) => [p, providerBlock(app, p, keys[p], () => s, save)]),
  ) as Record<ProviderId, HTMLElement>;
  const aiCard = h('div', { class: 'card' });
  const updateBlocks = () => {
    for (const p of PROVIDER_IDS) {
      blocks[p].hidden = p !== s.provider;
    }
  };
  const segments = PROVIDER_IDS.map((p) =>
    h(
      'label',
      { class: 'segment' },
      h('input', {
        type: 'radio',
        name: 'provider',
        value: p,
        checked: s.provider === p,
        onChange: async () => {
          await save({ provider: p });
          updateBlocks();
        },
      }),
      h('span', {}, h('b', {}, PROVIDER_INFO[p].name), h('small', {}, PROVIDER_INFO[p].vendor)),
    ),
  );
  aiCard.append(
    h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': T.aiService }, ...segments),
    h('p', { class: 'card-intro' }, T.providerHint),
    ...PROVIDER_IDS.map((p) => blocks[p]),
  );

  // Google Fact Check Tools API block
  const fcSection = factcheckGroup(app, keys.factcheck, () => s, save);

  // Display options
  const collapsedSwitch = h('input', {
    type: 'checkbox',
    class: 'switch',
    role: 'switch',
    checked: s.paneelIngeklapt,
    onChange: async (e: Event) => {
      await save({ paneelIngeklapt: (e.target as HTMLInputElement).checked });
    },
  });

  // Cache
  const count = h('span', { class: 'row-hint' }, '…');
  const updateCount = async () => {
    const n = (await app.cache.recent()).length;
    count.textContent = T.analysisCount(n);
  };
  const clear = async () => {
    if (!window.confirm(T.confirmClear)) return;
    await app.cache.clear();
    await updateCount();
  };

  const version = installedVersion();
  const versionText = h('span', {});
  el.replaceChildren(
    group(
      T.languageHeading,
      null,
      field(
        T.languageLabel,
        taalSelect,
        T.languageHint,
        tipButton(t, 'language', T.languageLabel),
      ),
    ),
    h(
      'section',
      { class: 'group' },
      h(
        'div',
        { class: 'group-head' },
        h('h2', {}, T.aiService),
        tipButton(t, 'provider', T.aiService),
      ),
      aiCard,
    ),
    fcSection,
    group(
      T.displayHeading,
      null,
      switchRow(
        T.collapsedLabel,
        T.collapsedHint,
        collapsedSwitch,
        tipButton(t, 'collapsed', T.collapsedLabel),
      ),
    ),
    group(
      T.savedAnalyses,
      null,
      h(
        'div',
        { class: 'row' },
        h(
          'span',
          { class: 'row-text' },
          titleLine(T.cacheHeading, tipButton(t, 'cache', T.cacheHeading)),
          count,
        ),
        h('button', { class: 'btn danger', onClick: () => void clear() }, T.clear),
      ),
    ),
    updateGroup(app, version),
    h('footer', { class: 'foot' }, versionText, h('span', {}, T.autoSaved)),
  );
  updateBlocks();
  void updateCount();
  void version.then((v) => v && (versionText.textContent = `WWJD ${v}`));
}

function factcheckGroup(
  app: App,
  initialKey: string,
  current: () => WwjdSettings,
  save: (patch: Partial<WwjdSettings>) => Promise<void>,
): HTMLElement {
  const t = app.t;
  const T = t.settings;
  const keyInput = h('input', {
    type: 'password',
    autocomplete: 'off',
    spellcheck: 'false',
    placeholder: 'AIza…',
    value: initialKey,
    'aria-label': T.factcheckKeyLabel,
  });
  keyInput.addEventListener(
    'input',
    debounce(() => void app.keys.set('factcheck', keyInput.value), 400),
  );
  const toggle: HTMLButtonElement = h(
    'button',
    {
      type: 'button',
      onClick: () => {
        const show = keyInput.type === 'password';
        keyInput.type = show ? 'text' : 'password';
        toggle.textContent = show ? T.hide : T.show;
      },
    },
    T.show,
  );

  const result = h('span', { class: 'test-result', 'aria-live': 'polite' });
  const testBtn: HTMLButtonElement = h(
    'button',
    {
      class: 'btn',
      onClick: async () => {
        const apiKey = keyInput.value.trim();
        if (!apiKey) {
          result.className = 'test-result bad';
          result.textContent = T.fillKeyFirst;
          return;
        }
        result.className = 'test-result';
        result.textContent = T.busy;
        try {
          await app.keys.set('factcheck', apiKey);
          await testFactCheckConnection(apiKey, { fetch: nativeFetch, timeoutMs: 15_000 });
          result.className = 'test-result ok';
          result.textContent = T.testOkShort;
        } catch (e) {
          result.className = 'test-result bad';
          result.textContent = e instanceof Error ? e.message : String(e);
        }
      },
    },
    T.testConnection,
  );

  const keyField = field(
    T.factcheckKeyLabel,
    h('span', { class: 'input-group' }, keyInput, toggle),
    h(
      'span',
      {},
      T.factcheckKeyHintDevice[0],
      h('a', { href: KEY_URLS.factcheck }, 'console.cloud.google.com'),
      T.factcheckKeyHintDevice[1],
    ),
    tipButton(t, 'factcheckKey', T.factcheckKeyLabel),
  );
  const steps = keySteps('factcheck', t);
  const actionsRow = h('div', { class: 'actions' }, testBtn, result);

  const updateDim = () => {
    const on = current().googleFactCheckActief;
    keyInput.disabled = !on;
    testBtn.disabled = !on;
    keyField.classList.toggle('dim', !on);
    steps.classList.toggle('dim', !on);
    actionsRow.classList.toggle('dim', !on);
  };

  const fcSwitch = h('input', {
    type: 'checkbox',
    class: 'switch',
    role: 'switch',
    checked: current().googleFactCheckActief,
    onChange: async (e: Event) => {
      await save({ googleFactCheckActief: (e.target as HTMLInputElement).checked });
      updateDim();
    },
  });

  updateDim();

  return group(
    T.factcheckHeading,
    tipButton(t, 'factcheck', T.factcheckHeading),
    switchRow(
      T.factcheckToggle,
      T.factcheckHint,
      fcSwitch,
      tipButton(t, 'factcheck', T.factcheckToggle),
    ),
    h('div', { class: 'provider' }, keyField, steps, actionsRow),
  );
}

function updateGroup(app: App, version: Promise<string | null>): HTMLElement {
  const U = app.t.update;
  const title = h('span', { class: 'row-title' }, U.installed('…'));
  const status = h('span', { class: 'row-hint update-status', 'aria-live': 'polite' });
  const panel = h('div', { class: 'update-panel', hidden: true });
  let current: string | null = null;
  const setStatus = (text: string, state: string) => {
    status.textContent = text;
    status.dataset.state = state;
  };

  const showAvailable = (asset: ReleaseAsset, page: string) => {
    const progress = h('span', { class: 'row-hint', 'aria-live': 'polite' });
    const install: HTMLButtonElement = h(
      'button',
      {
        class: 'btn primary',
        onClick: async () => {
          install.disabled = true;
          progress.className = 'row-hint';
          progress.textContent = U.downloading;
          try {
            await downloadAndInstall(
              asset,
              (p) => (progress.textContent = `${U.downloading} ${p}%`),
            );
            progress.textContent = U.opening;
          } catch (e) {
            progress.className = 'row-hint bad';
            progress.textContent =
              e instanceof UpdateError && e.code === 'checksum'
                ? U.checksumFailed
                : U.downloadFailed(e instanceof Error ? e.message : String(e));
          }
          install.disabled = false;
        },
      },
      U.downloadInstall,
    );
    panel.replaceChildren(
      h(
        'p',
        { class: 'update-head' },
        h('b', {}, U.available(asset.version)),
        h('a', { href: page }, U.whatsNew),
      ),
      install,
      progress,
      h('span', { class: 'row-hint' }, U.installHint),
    );
    panel.hidden = false;
  };

  const check: HTMLButtonElement = h(
    'button',
    {
      class: 'btn',
      disabled: true,
      onClick: async () => {
        if (!current) return;
        check.disabled = true;
        panel.hidden = true;
        setStatus(U.checking, 'checking');
        try {
          const r = await checkAppUpdate(current);
          if (r.status === 'available') {
            setStatus('', 'available');
            showAvailable(r.asset, r.page);
          } else {
            setStatus(r.status === 'current' ? U.upToDate : U.none, r.status);
          }
        } catch (e) {
          setStatus(U.failed(e instanceof Error ? e.message : String(e)), 'error');
        }
        check.disabled = false;
      },
    },
    U.check,
  );
  void version.then((v) => {
    current = v;
    title.textContent = U.installed(v ?? '–');
    check.disabled = !v;
  });

  return group(
    U.heading,
    tipButton(app.t, 'updates', U.heading),
    h('div', { class: 'field' }, title, status),
    h('div', { class: 'actions' }, check),
    panel,
  );
}

function providerBlock(
  app: App,
  p: ProviderId,
  key: string,
  current: () => WwjdSettings,
  save: (patch: Partial<WwjdSettings>) => Promise<void>,
): HTMLElement {
  const info = PROVIDER_INFO[p];
  const t = app.t;
  const T = t.settings;
  const keyInput = h('input', {
    type: 'password',
    autocomplete: 'off',
    spellcheck: 'false',
    placeholder: info.placeholder,
    value: key,
    'aria-label': T.apiKeyOf(info.name),
  });
  keyInput.addEventListener(
    'input',
    debounce(() => void app.keys.set(p, keyInput.value), 400),
  );
  const toggle: HTMLButtonElement = h(
    'button',
    {
      type: 'button',
      onClick: () => {
        const show = keyInput.type === 'password';
        keyInput.type = show ? 'text' : 'password';
        toggle.textContent = show ? T.hide : T.show;
      },
    },
    T.show,
  );

  const listId = `models-${p}`;
  const model = h('input', {
    list: listId,
    spellcheck: 'false',
    value: current().models[p],
    'aria-label': T.modelOf(info.name),
  });
  model.addEventListener(
    'input',
    debounce(() => {
      const m = model.value.trim();
      if (m) void save({ models: { ...current().models, [p]: m } });
    }, 400),
  );
  model.addEventListener('blur', () => {
    if (!model.value.trim()) model.value = current().models[p];
  });

  const result = h('span', { class: 'test-result', 'aria-live': 'polite' });
  const test = async () => {
    const apiKey = keyInput.value.trim();
    if (!apiKey) {
      result.className = 'test-result bad';
      result.textContent = T.fillKeyFirst;
      return;
    }
    result.className = 'test-result';
    result.textContent = T.busy;
    try {
      await app.keys.set(p, apiKey);
      const modelName = model.value.trim() || current().models[p];
      if (p === 'claude') {
        await testClaudeConnection({
          apiKey,
          model: modelName,
          timeoutMs: 15_000,
          fetch: nativeFetch,
        });
      } else {
        await testGeminiConnection({
          apiKey,
          model: modelName,
          timeoutMs: 15_000,
          fetch: nativeFetch,
        });
      }
      result.className = 'test-result ok';
      result.textContent = T.testOkShort;
    } catch (e) {
      result.className = 'test-result bad';
      result.textContent = e instanceof Error ? e.message : String(e);
    }
  };

  return h(
    'div',
    { class: 'provider', 'data-provider': p },
    h('div', { class: 'provider-head' }, h('h3', {}, info.name)),
    field(
      T.apiKey,
      h('span', { class: 'input-group' }, keyInput, toggle),
      h(
        'span',
        {},
        T.keyHintDevice[0],
        h('a', { href: info.url }, new URL(info.url).hostname),
        T.keyHintDevice[1],
      ),
      tipButton(t, 'apiKey', T.apiKeyOf(info.name)),
    ),
    keySteps(p, t),
    field(T.model, model, null, tipButton(t, 'model', T.modelOf(info.name))),
    h('datalist', { id: listId }, ...MODEL_SUGGESTIONS[p].map((m) => h('option', { value: m }))),
    h(
      'div',
      { class: 'actions' },
      h('button', { class: 'btn', onClick: () => void test() }, T.testConnection),
      result,
    ),
  );
}
