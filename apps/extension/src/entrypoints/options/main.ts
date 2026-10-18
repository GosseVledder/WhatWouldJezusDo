import {
  ICONS,
  keySteps,
  messages,
  MODEL_SUGGESTIONS,
  tooltips,
  UI_LANGUAGE_NAMES,
  UI_LANGUAGES,
  type KeyKind,
  type Messages,
  type ProviderId,
  type TipKey,
  type UiLang,
  type UpdateCheck,
  type WwjdSettings,
} from '@wwjd/core';
import type { DebugEntry } from '../../storage/debuglog';
import { getApiKeys, setApiKey } from '../../storage/secrets';
import { getSettings, saveSettings } from '../../storage/settings';

const REOPEN_OPTIONS_KEY = 'reopenOptions';
const PROVIDERS: ProviderId[] = ['gemini', 'claude'];
const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

interface RuntimeResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

const send = <T>(msg: Record<string, unknown>) =>
  browser.runtime.sendMessage(msg) as Promise<RuntimeResponse<T>>;

let t: Messages = messages('nl');
const onLanguage: (() => void)[] = [];

function applyTexts(): void {
  const lookup = (key: string): string => {
    const [path, index] = key.split('.');
    const [section, name] = path!.includes(':') ? path!.split(':') : ['settings', path];
    const value = (t as unknown as Record<string, Record<string, unknown>>)[section!]?.[name!];
    return String(Array.isArray(value) ? value[Number(index)] : (value ?? key));
  };
  document.documentElement.lang = t.locale.split('-')[0]!;
  document.title = t.extension.actionTitle;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = lookup(el.dataset.i18n!);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', lookup(el.dataset.i18nAria!));
  });
  onLanguage.forEach((fn) => fn());
}

let savedTimer: number | undefined;
function flashSaved(): void {
  const el = $('#saved');
  el.textContent = t.settings.saved;
  el.classList.add('show');
  window.clearTimeout(savedTimer);
  savedTimer = window.setTimeout(() => el.classList.remove('show'), 1500);
}

async function save(patch: Partial<WwjdSettings>): Promise<void> {
  await saveSettings(patch);
  flashSaved();
}

function debounce<A extends unknown[]>(fn: (...a: A) => void, ms: number): (...a: A) => void {
  let timer: number | undefined;
  return (...a) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...a), ms);
  };
}

const option = (value: string, text: string) =>
  Object.assign(document.createElement('option'), { value, textContent: text });

async function init(): Promise<void> {
  const [s, keys] = await Promise.all([getSettings(), getApiKeys()]);
  t = messages(s.taal);
  const version = browser.runtime.getManifest().version;
  $('#version').textContent = `WWJD ${version}`;
  initTips();

  // Language selector
  const taalSelect = $<HTMLSelectElement>('#taal');
  taalSelect.replaceChildren(
    ...UI_LANGUAGES.map((code) => option(code, UI_LANGUAGE_NAMES[code])),
  );
  taalSelect.value = s.taal;
  taalSelect.addEventListener('change', async () => {
    t = messages(taalSelect.value);
    applyTexts();
    await save({ taal: taalSelect.value as UiLang });
  });

  // Provider radio buttons
  document.querySelectorAll<HTMLInputElement>('input[name="provider"]').forEach((r) => {
    r.checked = r.value === s.provider;
    r.addEventListener('change', () => {
      void save({ provider: r.value as ProviderId });
      updateProviderSections();
    });
  });

  // Keys and models for Gemini & Claude
  for (const p of PROVIDERS) {
    const key = $<HTMLInputElement>(`#key-${p}`);
    const model = $<HTMLInputElement>(`#model-${p}`);
    const list = $(`#models-${p}`);
    key.value = keys[p];
    model.value = s.models[p];
    list.replaceChildren(
      ...MODEL_SUGGESTIONS[p].map((m) =>
        Object.assign(document.createElement('option'), { value: m }),
      ),
    );
    const saveKey = debounce(async () => {
      await setApiKey(p, key.value);
      flashSaved();
    }, 400);
    const saveModel = debounce(async () => {
      if (!model.value.trim()) return;
      const cur = await getSettings();
      await save({ models: { ...cur.models, [p]: model.value.trim() } });
    }, 400);
    key.addEventListener('input', saveKey);
    model.addEventListener('input', saveModel);
    model.addEventListener('blur', async () => {
      if (!model.value.trim()) model.value = (await getSettings()).models[p];
    });

    // "How do I get a key?" under the key row; rebuilt on language change
    let steps: HTMLDetailsElement | undefined;
    const renderSteps = () => {
      const next = keySteps(p, t);
      next.open = steps?.open ?? false;
      if (steps) steps.replaceWith(next);
      else key.closest('.row')!.after(next);
      steps = next;
    };
    renderSteps();
    onLanguage.push(renderSteps);
  }

  // Google Fact Check Tools API key + steps
  const fcKey = $<HTMLInputElement>('#key-factcheck');
  fcKey.value = keys.factcheck;
  fcKey.addEventListener(
    'input',
    debounce(async () => {
      await setApiKey('factcheck', fcKey.value);
      flashSaved();
    }, 400),
  );
  let fcSteps: HTMLDetailsElement | undefined;
  const renderFcSteps = () => {
    const next = keySteps('factcheck', t);
    next.open = fcSteps?.open ?? false;
    if (fcSteps) fcSteps.replaceWith(next);
    else $('#factcheck-key-row').after(next);
    fcSteps = next;
  };
  renderFcSteps();
  onLanguage.push(renderFcSteps);

  // Password show/hide toggles
  document.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((b) => {
    const input = $<HTMLInputElement>(`#${b.dataset.toggle}`);
    const updateLabel = () => {
      b.textContent = input.type === 'password' ? t.settings.show : t.settings.hide;
    };
    onLanguage.push(updateLabel);
    b.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      updateLabel();
    });
  });

  // Test connection buttons (gemini, claude, factcheck)
  document.querySelectorAll<HTMLButtonElement>('[data-test]').forEach((b) => {
    b.addEventListener('click', async () => {
      const kind = b.dataset.test as KeyKind;
      const out = $(`#test-${kind}`);
      const apiKey = $<HTMLInputElement>(`#key-${kind}`).value.trim();
      if (!apiKey) {
        out.className = 'test-result error';
        out.textContent = `✗ ${t.settings.fillKeyFirst}`;
        return;
      }
      b.disabled = true;
      out.className = 'test-result';
      out.textContent = t.settings.busy;
      await setApiKey(kind, apiKey);
      const model =
        kind === 'factcheck' ? '' : $<HTMLInputElement>(`#model-${kind}`).value.trim();
      const res = await send<{ ok: boolean; error?: string }>({
        type: 'testConnection',
        kind,
        apiKey,
        model,
      }).catch(
        (e: unknown): RuntimeResponse<{ ok: boolean; error?: string }> => ({
          ok: false,
          error: String(e),
        }),
      );
      b.disabled = false;
      if (res.ok && res.data?.ok !== false) {
        out.className = 'test-result ok';
        out.textContent =
          kind === 'factcheck' ? t.settings.testOkFactcheck : t.settings.testOk;
      } else {
        out.className = 'test-result error';
        out.textContent = `✗ ${res.data?.error ?? res.error ?? t.settings.testFailed}`;
      }
    });
  });

  // Switches
  for (const id of [
    'googleFactCheckActief',
    'actief',
    'automatisch',
    'paneelIngeklapt',
    'debugLog',
  ] as const) {
    const box = $<HTMLInputElement>(`#${id}`);
    box.checked = s[id];
    box.addEventListener('change', () => void save({ [id]: box.checked }));
  }

  const fcSwitch = $<HTMLInputElement>('#googleFactCheckActief');
  const updateFactCheckDim = () => {
    const on = fcSwitch.checked;
    $('#factcheck-group').classList.toggle('dim', !on);
    fcKey.disabled = !on;
    $<HTMLButtonElement>('[data-test="factcheck"]').disabled = !on;
  };
  fcSwitch.addEventListener('change', updateFactCheckDim);
  updateFactCheckDim();
  updateProviderSections();

  // Cache stats & clear
  let aantal: number | null = null;
  const showCount = () => {
    if (aantal !== null) $('#cache-count').textContent = t.settings.cacheCount(aantal);
  };
  const refreshCount = async () => {
    const res = await send<{ aantal: number }>({ type: 'cacheStats' });
    aantal = res.data?.aantal ?? 0;
    showCount();
  };
  onLanguage.push(showCount);
  void refreshCount();
  $('#clear-cache').addEventListener('click', async () => {
    if (!confirm(t.settings.confirmClear)) return;
    await send({ type: 'clearCache' });
    await refreshCount();
  });

  // Debug log
  let logShown = false;
  const showLog = async () => {
    const log = $('#log');
    const res = await send<DebugEntry[]>({ type: 'getDebugLog' });
    const entries = res.data ?? [];
    log.hidden = false;
    logShown = true;
    if (entries.length === 0) {
      log.textContent = t.settings.logEmpty;
      return;
    }
    const table = document.createElement('table');
    table
      .createTHead()
      .insertRow()
      .append(
        ...t.settings.logHead.map((h) =>
          Object.assign(document.createElement('th'), { textContent: h }),
        ),
      );
    const body = table.createTBody();
    for (const e of entries.slice().reverse()) {
      const row = body.insertRow();
      const cells = [
        new Date(e.tijd).toLocaleString(t.locale),
        e.videoId,
        e.stap,
        e.provider,
        e.model,
        e.invoerTekens.toLocaleString(t.locale),
        `${(e.duurMs / 1000).toLocaleString(t.locale, { maximumFractionDigits: 1 })} s`,
        e.usage ? `${e.usage.inputTokens ?? '–'} / ${e.usage.outputTokens ?? '–'}` : '–',
        e.fout ?? '',
      ];
      cells.forEach((c, i) => {
        const td = row.insertCell();
        td.textContent = c;
        if (i === cells.length - 1 && c) td.className = 'err';
      });
    }
    log.replaceChildren(table);
  };
  onLanguage.push(() => logShown && void showLog());
  $('#show-log').addEventListener('click', () => void showLog());
  $('#clear-log').addEventListener('click', async () => {
    await send({ type: 'clearDebugLog' });
    $('#log').hidden = true;
    logShown = false;
  });

  initUpdate();
  applyTexts();
}

/**
 * ⓘ next to every element with data-tip: the button sits beside the title and shows the
 * explanation from `t.tips`.
 */
function initTips(): void {
  const tips = tooltips();
  document.querySelectorAll<HTMLElement>('[data-tip]').forEach((el) => {
    const key = el.dataset.tip as TipKey;
    const line = document.createElement('span');
    line.className = 'title-line';
    el.replaceWith(line);
    const button = document.createElement('button');
    button.className = 'tip';
    button.innerHTML = ICONS.info;
    line.append(el, button);
    tips.bind(button, () => t.tips[key]);
    onLanguage.push(() =>
      button.setAttribute('aria-label', `${t.settings.tipLabel}: ${el.textContent}`),
    );
  });
}

function initUpdate(): void {
  const version = browser.runtime.getManifest().version;
  const button = $<HTMLButtonElement>('#check-update');
  const status = $('#update-status');
  const panel = $('#update-panel');
  let state:
    | { ok: true; check: UpdateCheck }
    | { ok: false; error: string }
    | 'checking'
    | null = null;

  const show = () => {
    $('#installed-version').textContent = t.update.installed(version);
    panel.hidden = true;
    status.dataset.state =
      state === null
        ? ''
        : state === 'checking'
          ? 'checking'
          : state.ok
            ? state.check.status
            : 'error';
    if (state === null) status.textContent = '';
    else if (state === 'checking') status.textContent = t.update.checking;
    else if (!state.ok) status.textContent = t.update.failed(state.error);
    else if (state.check.status === 'none') status.textContent = t.update.none;
    else if (state.check.status === 'current') status.textContent = t.update.upToDate;
    else {
      const { asset, page } = state.check;
      status.textContent = '';
      panel.hidden = false;
      $('#update-available').textContent = t.update.available(asset.version);
      $<HTMLAnchorElement>('#update-notes').href = page;
      const download = $<HTMLAnchorElement>('#update-download');
      download.href = asset.url;
      download.textContent = t.update.download(asset.version);
    }
  };
  onLanguage.push(show);

  button.addEventListener('click', async () => {
    button.disabled = true;
    state = 'checking';
    show();
    const res = await send<{ ok: boolean; check?: UpdateCheck; error?: string }>({
      type: 'checkUpdate',
    }).catch(
      (e: unknown): RuntimeResponse<{ ok: boolean; check?: UpdateCheck; error?: string }> => ({
        ok: false,
        error: String(e),
      }),
    );
    button.disabled = false;
    const payload = res.data;
    if (!res.ok || !payload?.ok || !payload.check) {
      state = { ok: false, error: payload?.error ?? res.error ?? 'unknown error' };
    } else {
      state = { ok: true, check: payload.check };
    }
    show();
  });

  $('#update-reload').addEventListener('click', async () => {
    await browser.storage.local.set({ [REOPEN_OPTIONS_KEY]: true });
    browser.runtime.reload();
  });
}

function updateProviderSections(): void {
  const p = document.querySelector<HTMLInputElement>('input[name="provider"]:checked')?.value;
  document.querySelectorAll<HTMLElement>('[data-provider]').forEach((block) => {
    block.hidden = block.dataset.provider !== p;
  });
}

void init();
