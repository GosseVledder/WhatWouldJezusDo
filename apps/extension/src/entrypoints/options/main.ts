import {
  ICONS,
  keySteps,
  MODEL_SUGGESTIONS,
  SETTINGS_TIPS,
  tooltips,
  type KeyKind,
  type ProviderId,
  type TipKey,
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

let savedTimer: number | undefined;
function flashSaved(): void {
  const el = $('#saved');
  el.textContent = 'Opgeslagen';
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

async function init(): Promise<void> {
  const [s, keys] = await Promise.all([getSettings(), getApiKeys()]);
  const version = browser.runtime.getManifest().version;
  $('#version').textContent = `What Would Jezus Do ${version}`;
  initTips();

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

    // "Hoe kom ik aan een sleutel?" under the key row
    key.closest('.row')!.after(keySteps(p));
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
  $('#factcheck-key-row').after(keySteps('factcheck'));

  // Password show/hide toggles
  document.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((b) => {
    const input = $<HTMLInputElement>(`#${b.dataset.toggle}`);
    const updateLabel = () => {
      b.textContent = input.type === 'password' ? 'Toon' : 'Verberg';
    };
    updateLabel();
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
        out.textContent = '✗ Vul eerst een API-sleutel in.';
        return;
      }
      b.disabled = true;
      out.className = 'test-result';
      out.textContent = 'Bezig…';
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
          kind === 'factcheck'
            ? '✓ Verbinding met Google Fact Check API werkt.'
            : '✓ Verbinding werkt en het model bestaat.';
      } else {
        out.className = 'test-result error';
        out.textContent = `✗ ${res.data?.error ?? res.error ?? 'Verbinding mislukt.'}`;
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
  const refreshCount = async () => {
    const res = await send<{ aantal: number }>({ type: 'cacheStats' });
    const n = res.data?.aantal ?? 0;
    $('#cache-count').textContent =
      n === 1 ? '1 analyse opgeslagen' : `${n} analyses opgeslagen`;
  };
  void refreshCount();
  $('#clear-cache').addEventListener('click', async () => {
    if (!confirm('Alle opgeslagen analyses wissen?')) return;
    await send({ type: 'clearCache' });
    await refreshCount();
  });

  // Debug log
  const LOG_HEAD = [
    'Tijd',
    'Video',
    'Stap',
    'Provider',
    'Model',
    'Invoer (tekens)',
    'Duur',
    'Tokens in/uit',
    'Fout',
  ];
  const showLog = async () => {
    const log = $('#log');
    const res = await send<DebugEntry[]>({ type: 'getDebugLog' });
    const entries = res.data ?? [];
    log.hidden = false;
    if (entries.length === 0) {
      log.textContent = 'Nog geen aanroepen gelogd.';
      return;
    }
    const table = document.createElement('table');
    table
      .createTHead()
      .insertRow()
      .append(...LOG_HEAD.map((h) => Object.assign(document.createElement('th'), { textContent: h })));
    const body = table.createTBody();
    for (const e of entries.slice().reverse()) {
      const row = body.insertRow();
      const cells = [
        new Date(e.tijd).toLocaleString('nl-NL'),
        e.videoId,
        e.stap,
        e.provider,
        e.model,
        e.invoerTekens.toLocaleString('nl-NL'),
        `${(e.duurMs / 1000).toLocaleString('nl-NL', { maximumFractionDigits: 1 })} s`,
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
  $('#show-log').addEventListener('click', () => void showLog());
  $('#clear-log').addEventListener('click', async () => {
    await send({ type: 'clearDebugLog' });
    $('#log').hidden = true;
  });

  initUpdate();
}

/**
 * ⓘ next to every element with data-tip: the button sits beside the title and shows the
 * explanation from SETTINGS_TIPS.
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
    button.setAttribute('aria-label', `Uitleg: ${el.textContent}`);
    line.append(el, button);
    tips.bind(button, () => SETTINGS_TIPS[key]);
  });
}

function initUpdate(): void {
  const version = browser.runtime.getManifest().version;
  const button = $<HTMLButtonElement>('#check-update');
  const status = $('#update-status');
  const panel = $('#update-panel');
  $('#installed-version').textContent = `Geïnstalleerde versie: ${version}`;

  button.addEventListener('click', async () => {
    button.disabled = true;
    panel.hidden = true;
    status.dataset.state = 'checking';
    status.textContent = 'Controleren…';
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
      status.dataset.state = 'error';
      status.textContent = `Controleren mislukt: ${payload?.error ?? res.error ?? 'onbekende fout'}`;
      return;
    }

    const check = payload.check;
    status.dataset.state = check.status;
    if (check.status === 'none') {
      status.textContent = 'Nog geen versie gevonden op GitHub.';
    } else if (check.status === 'current') {
      status.textContent = 'Je hebt de nieuwste versie.';
    } else {
      status.textContent = '';
      panel.hidden = false;
      $('#update-available').textContent = `Versie ${check.asset.version} is beschikbaar.`;
      $<HTMLAnchorElement>('#update-notes').href = check.page;
      const download = $<HTMLAnchorElement>('#update-download');
      download.href = check.asset.url;
      download.textContent = `Versie ${check.asset.version} downloaden`;
    }
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
