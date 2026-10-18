// Settings: AI service, keys and models (with "Test verbinding"), Google Fact Check API,
// display options, cache and updates; an ⓘ explains each setting. Every change is saved
// directly. Same design as the extension's options page: grouped cards with switches and
// stacked fields.
import {
  h,
  ICONS,
  KEY_URLS,
  keySteps,
  MODEL_SUGGESTIONS,
  SETTINGS_TIPS,
  testClaudeConnection,
  testFactCheckConnection,
  testGeminiConnection,
  tooltips,
  type ProviderId,
  type ReleaseAsset,
  type TipKey,
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
function tipButton(key: TipKey, topic: string): HTMLButtonElement {
  const button = h('button', {
    class: 'tip',
    html: ICONS.info,
    'aria-label': `Uitleg: ${topic}`,
  });
  tooltips().bind(button, () => SETTINGS_TIPS[key]);
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
  const el = h('div', { class: 'screen settings' }, h('p', { class: 'hint loading' }, 'Laden…'));
  void build(app, el);
  return {
    title: 'Instellingen',
    el,
    dispose: () => tooltips().hide(),
  };
}

async function build(app: App, el: HTMLElement): Promise<void> {
  let s: WwjdSettings = await app.settings.get();
  const keys = await app.keys.get();
  const save = async (patch: Partial<WwjdSettings>) => {
    s = await app.settings.save(patch);
  };

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
    h('div', { class: 'segmented', role: 'radiogroup', 'aria-label': 'AI-dienst' }, ...segments),
    h(
      'p',
      { class: 'card-intro' },
      'De gekozen dienst extraheert uitspraken uit het transcript, controleert de feiten en toetst de video aan de 25 richtlijnen en geboden van Jezus.',
    ),
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
    count.textContent = n === 1 ? '1 analyse' : `${n} analyses`;
  };
  const clear = async () => {
    if (!window.confirm('Alle opgeslagen analyses wissen?')) return;
    await app.cache.clear();
    await updateCount();
  };

  const version = installedVersion();
  const versionText = h('span', {});
  el.replaceChildren(
    h(
      'section',
      { class: 'group' },
      h(
        'div',
        { class: 'group-head' },
        h('h2', {}, 'AI-dienst'),
        tipButton('provider', 'AI-dienst'),
      ),
      aiCard,
    ),
    fcSection,
    group(
      'Weergave',
      null,
      switchRow(
        'Onderbouwing standaard inklappen',
        'Toon eerst alleen de eindscore (0–10) en de korte conclusie.',
        collapsedSwitch,
        tipButton('collapsed', 'Onderbouwing standaard inklappen'),
      ),
    ),
    group(
      'Opgeslagen analyses',
      null,
      h(
        'div',
        { class: 'row' },
        h('span', { class: 'row-text' }, titleLine('Cache', tipButton('cache', 'Cache')), count),
        h('button', { class: 'btn danger', onClick: () => void clear() }, 'Wissen'),
      ),
    ),
    updateGroup(version),
    h(
      'footer',
      { class: 'foot' },
      versionText,
      h('span', {}, 'Instellingen worden direct opgeslagen.'),
    ),
  );
  updateBlocks();
  void updateCount();
  void version.then((v) => v && (versionText.textContent = `What Would Jezus Do ${v}`));
}

function factcheckGroup(
  app: App,
  initialKey: string,
  current: () => WwjdSettings,
  save: (patch: Partial<WwjdSettings>) => Promise<void>,
): HTMLElement {
  const keyInput = h('input', {
    type: 'password',
    autocomplete: 'off',
    spellcheck: 'false',
    placeholder: 'AIza…',
    value: initialKey,
    'aria-label': 'API-sleutel Fact Check',
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
        toggle.textContent = show ? 'Verberg' : 'Toon';
      },
    },
    'Toon',
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
          result.textContent = 'Vul eerst een API-sleutel in.';
          return;
        }
        result.className = 'test-result';
        result.textContent = 'Bezig…';
        try {
          await app.keys.set('factcheck', apiKey);
          await testFactCheckConnection(apiKey, { fetch: nativeFetch, timeoutMs: 15_000 });
          result.className = 'test-result ok';
          result.textContent = 'Verbinding werkt';
        } catch (e) {
          result.className = 'test-result bad';
          result.textContent = e instanceof Error ? e.message : String(e);
        }
      },
    },
    'Test verbinding',
  );

  const keyField = field(
    'API-sleutel Fact Check',
    h('span', { class: 'input-group' }, keyInput, toggle),
    h(
      'span',
      {},
      'Maak een gratis sleutel aan op ',
      h('a', { href: KEY_URLS.factcheck }, 'console.cloud.google.com'),
      '. De sleutel staat versleuteld op dit toestel.',
    ),
    tipButton('factcheckKey', 'API-sleutel Fact Check'),
  );
  const steps = keySteps('factcheck');
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
    'Feitencontrole',
    tipButton('factcheck', 'Feitencontrole'),
    switchRow(
      'Google Fact Check Tools API gebruiken',
      'Doorzoekt eerst razendsnel bestaande officiële factchecks van erkende organisaties.',
      fcSwitch,
      tipButton('factcheck', 'Google Fact Check Tools API'),
    ),
    h('div', { class: 'provider' }, keyField, steps, actionsRow),
  );
}

function updateGroup(version: Promise<string | null>): HTMLElement {
  const title = h('span', { class: 'row-title' }, 'Geïnstalleerde versie: …');
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
          progress.textContent = 'Downloaden…';
          try {
            await downloadAndInstall(asset, (p) => (progress.textContent = `Downloaden… ${p}%`));
            progress.textContent = 'Installatie wordt geopend…';
          } catch (e) {
            progress.className = 'row-hint bad';
            progress.textContent =
              e instanceof UpdateError && e.code === 'checksum'
                ? 'Het gedownloade bestand klopt niet (SHA-256). Probeer het opnieuw.'
                : `Downloaden mislukt: ${e instanceof Error ? e.message : String(e)}`;
          }
          install.disabled = false;
        },
      },
      'Downloaden en installeren',
    );
    panel.replaceChildren(
      h(
        'p',
        { class: 'update-head' },
        h('b', {}, `Versie ${asset.version} is beschikbaar.`),
        h('a', { href: page }, 'Wat is er nieuw?'),
      ),
      install,
      progress,
      h(
        'span',
        { class: 'row-hint' },
        'De eerste keer vraagt Android om installeren via What Would Jezus Do toe te staan; tik daarna zo nodig nog een keer op deze knop. Je sleutels, instellingen en analyses blijven bewaard.',
      ),
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
        setStatus('Controleren…', 'checking');
        try {
          const r = await checkAppUpdate(current);
          if (r.status === 'available') {
            setStatus('', 'available');
            showAvailable(r.asset, r.page);
          } else {
            setStatus(
              r.status === 'current'
                ? 'Je hebt de nieuwste versie.'
                : 'Nog geen versie gevonden op GitHub.',
              r.status,
            );
          }
        } catch (e) {
          setStatus(`Controleren mislukt: ${e instanceof Error ? e.message : String(e)}`, 'error');
        }
        check.disabled = false;
      },
    },
    'Controleren op updates',
  );
  void version.then((v) => {
    current = v;
    title.textContent = `Geïnstalleerde versie: ${v ?? '–'}`;
    check.disabled = !v;
  });

  return group(
    'Updates',
    tipButton('updates', 'Updates'),
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
  const keyInput = h('input', {
    type: 'password',
    autocomplete: 'off',
    spellcheck: 'false',
    placeholder: info.placeholder,
    value: key,
    'aria-label': `API-sleutel ${info.name}`,
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
        toggle.textContent = show ? 'Verberg' : 'Toon';
      },
    },
    'Toon',
  );

  const listId = `models-${p}`;
  const model = h('input', {
    list: listId,
    spellcheck: 'false',
    value: current().models[p],
    'aria-label': `Model ${info.name}`,
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
      result.textContent = 'Vul eerst een API-sleutel in.';
      return;
    }
    result.className = 'test-result';
    result.textContent = 'Bezig…';
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
      result.textContent = 'Verbinding werkt';
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
      'API-sleutel',
      h('span', { class: 'input-group' }, keyInput, toggle),
      h(
        'span',
        {},
        'Maak een sleutel aan op ',
        h('a', { href: info.url }, new URL(info.url).hostname),
        '. De sleutel staat versleuteld op dit toestel.',
      ),
      tipButton('apiKey', `API-sleutel ${info.name}`),
    ),
    keySteps(p),
    field('Model', model, null, tipButton('model', `Model ${info.name}`)),
    h('datalist', { id: listId }, ...MODEL_SUGGESTIONS[p].map((m) => h('option', { value: m }))),
    h(
      'div',
      { class: 'actions' },
      h('button', { class: 'btn', onClick: () => void test() }, 'Test verbinding'),
      result,
    ),
  );
}
