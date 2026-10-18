import type { ScoredGuideline, WwjdEvaluation } from '../engine/types';
import { getGuidelineById, localizeBibleSource, normalizeLang } from '../guidelines/jesus';
import { messages, type Messages } from '../i18n/messages';
import { getScaleIllustration } from './scaleImages';
import { WWJD_BASE_CSS } from './styles';

type Child = Node | string | null | undefined | false;

/** Minimal element builder. Text is always set as text, never parsed as HTML. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Record<string, unknown> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') el.className = String(value);
    else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === 'html') {
      el.innerHTML = String(value);
    } else el.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child);
  }
  return el;
}

export interface RenderOptions {
  onSeek?: (seconds: number) => void;
  initiallyCollapsed?: boolean;
  onRefresh?: () => void;
  onOpenOptions?: () => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  onToggleEnabled?: (enabled: boolean) => void;
  enabled?: boolean;
  fromCache?: boolean;
  taal?: string;
  t?: Messages;
}

export type WwjdViewState =
  | { kind: 'idle' }
  | { kind: 'loading'; step?: string }
  | { kind: 'error'; message: string; details?: string; showSettings?: boolean }
  | { kind: 'done'; evaluation: WwjdEvaluation; fromCache?: boolean };

export interface WwjdStateHandlers {
  onStart?: () => void;
  onRefresh?: () => void;
  onOpenOptions?: () => void;
  onSeek?: (seconds: number) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  onToggleEnabled?: (enabled: boolean) => void;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderWwjdView(
  container: HTMLElement,
  evaluation: WwjdEvaluation,
  options: RenderOptions = {},
): void {
  const lang = normalizeLang(options.taal ?? evaluation.taal ?? 'nl');
  const t = options.t ?? messages(lang);
  const v = t.view;

  container.innerHTML = '';

  const styleEl = document.createElement('style');
  styleEl.textContent = WWJD_BASE_CSS;
  container.appendChild(styleEl);

  const card = document.createElement('div');
  card.className = 'wwjd-card';

  // Determine score color class
  let scoreClass = 'score-mid';
  if (evaluation.finalScore >= 7.0) scoreClass = 'score-high';
  else if (evaluation.finalScore < 4.0) scoreClass = 'score-low';

  // Format header (short name WWJD, without refresh or settings icons)
  const header = document.createElement('div');
  header.className = 'wwjd-header';
  const title = h('div', { class: 'title', role: 'heading', 'aria-level': '2' }, 'WWJD');
  const actions = h('div', { class: 'wwjd-header-actions' });

  const toggleBtnEl = h(
    'button',
    {
      type: 'button',
      class: 'toggle-details-btn',
      id: 'wwjd-toggle-btn',
    },
    options.initiallyCollapsed ? v.showDetails : v.hideDetails,
  );
  actions.append(toggleBtnEl);

  if (options.onToggleEnabled) {
    const enabled = options.enabled !== false;
    actions.append(
      h(
        'button',
        {
          type: 'button',
          class: 'switch',
          role: 'switch',
          'aria-checked': String(enabled),
          'aria-label': v.switchAria,
          title: enabled ? v.turnOff : v.turnOn,
          onClick: () => options.onToggleEnabled?.(!enabled),
        },
        h('span', { class: 'knob' }),
      ),
    );
  }

  header.append(title, actions);
  card.appendChild(header);

  // Score banner
  const scaleIllustration = getScaleIllustration(evaluation.finalScore);
  const scoreBanner = document.createElement('div');
  scoreBanner.className = `wwjd-score-banner ${scoreClass}`;
  scoreBanner.setAttribute('data-scale-step', String(scaleIllustration.step));
  scoreBanner.innerHTML = `
    <div class="wwjd-score-visuals" data-scale-step="${scaleIllustration.step}">
      <img
        class="wwjd-scale-scene"
        src="${scaleIllustration.sceneUrl}"
        alt="${escapeHtml(v.jesusAlignment)} (${scaleIllustration.step}/9)"
        data-scale-step="${scaleIllustration.step}"
      />
      <img
        class="wwjd-scale-face"
        src="${scaleIllustration.faceUrl}"
        alt=""
        aria-hidden="true"
        data-scale-step="${scaleIllustration.step}"
      />
    </div>
    <div class="wwjd-score-number">${evaluation.finalScore.toFixed(1)}</div>
    <div class="wwjd-score-details">
      <strong>${escapeHtml(v.jesusAlignment)}: ${evaluation.finalScore.toFixed(1)} / 10</strong>
      ${escapeHtml(evaluation.verdictSummary)}
    </div>
  `;
  card.appendChild(scoreBanner);

  // Details Container (Collapsible)
  const detailsContainer = document.createElement('div');
  detailsContainer.id = 'wwjd-details-body';
  if (options.initiallyCollapsed) {
    detailsContainer.style.display = 'none';
  }

  // --- SECTIE 1: FEITENCHECK & INTEGRITEIT (ACTIVITEIT 1) ---
  const factcheckSection = document.createElement('div');
  factcheckSection.innerHTML = `
    <div class="section-title">${escapeHtml(v.section1Title)}</div>
    <div class="activity-summary">
      <strong>${escapeHtml(v.coreActivity)}</strong> ${escapeHtml(evaluation.factcheckDossier.coreActivity)}<br>
      <strong>${escapeHtml(v.sentimentAndAttitude)}</strong> ${escapeHtml(evaluation.factcheckDossier.sentimentAndAttitude)}
    </div>
  `;

  if (evaluation.factcheckDossier.contradictionsDetected.length > 0) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'contradiction-alert';
    alertDiv.style.marginTop = '6px';
    alertDiv.innerHTML = `
      ⚠️ <strong>${escapeHtml(v.contradictionAlert)}</strong><br>
      ${evaluation.factcheckDossier.contradictionsDetected.map((c) => `• ${escapeHtml(c)}`).join('<br>')}
    `;
    factcheckSection.appendChild(alertDiv);
  }

  // Statement list
  evaluation.factcheckDossier.statements.forEach((stmt) => {
    const stmtEl = document.createElement('div');
    stmtEl.className = 'statement-item';
    const verdictLabel = v.verdicts[stmt.verdict] ?? stmt.verdict.replace(/_/g, ' ');
    stmtEl.innerHTML = `
      <div class="statement-header">
        <button type="button" class="time-btn" data-start="${stmt.startSeconds}">
          ⏱️ ${escapeHtml(stmt.timestampLabel)}
        </button>
        <span class="verdict-tag ${stmt.verdict}">${escapeHtml(verdictLabel)}</span>
      </div>
      <div><strong>${escapeHtml(v.statementLabel)}</strong> "${escapeHtml(stmt.quote)}"</div>
      <div><strong>${escapeHtml(v.factcheckLabel)}</strong> ${escapeHtml(stmt.historicalAnalysis)}</div>
      ${
        stmt.sources && stmt.sources.length > 0
          ? `<div><small>${escapeHtml(v.sourcesLabel)} ${stmt.sources
              .map(
                (s) =>
                  `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.title || s.url)}</a>`,
              )
              .join(', ')}</small></div>`
          : ''
      }
    `;
    factcheckSection.appendChild(stmtEl);
  });
  detailsContainer.appendChild(factcheckSection);

  // --- SECTIE 2: BEOORDELING VOLGENS JEZUS' RICHTLIJNEN (ACTIVITEIT 2) ---
  const jesusSection = document.createElement('div');
  jesusSection.style.marginTop = '14px';
  jesusSection.innerHTML = `
    <div class="section-title">${escapeHtml(v.section2Title(evaluation.relevantGuidelines.length))}</div>
  `;

  evaluation.relevantGuidelines.forEach((g: ScoredGuideline) => {
    const gEl = document.createElement('div');
    gEl.className = 'guideline-card';

    let gScoreClass = 'score-mid';
    if (g.score >= 7.0) gScoreClass = 'score-high';
    else if (g.score < 4.0) gScoreClass = 'score-low';

    const dbGuideline = lang !== 'nl' ? getGuidelineById(g.guidelineId, lang) : undefined;
    const guidelineTitle = dbGuideline ? dbGuideline.title : g.title;
    const bibleSources =
      lang !== 'nl'
        ? (dbGuideline?.sources ?? g.bibleSources.map((b) => localizeBibleSource(b, lang)))
        : g.bibleSources;

    gEl.innerHTML = `
      <div class="guideline-head">
        <div class="guideline-title">#${g.number} ${escapeHtml(guidelineTitle)}</div>
        <div class="guideline-score ${gScoreClass}">${g.score.toFixed(1)} / 10</div>
      </div>
      <div class="guideline-reasoning">${escapeHtml(g.reasoning)}</div>
      ${
        g.relatedQuotes.length > 0
          ? `<div style="font-size: 12px; color: var(--yt-text-2);">
              ${escapeHtml(v.linkedToMoment)} ${g.relatedQuotes
                .map(
                  (q) =>
                    `<button type="button" class="time-btn" data-start="${q.startSeconds}">${escapeHtml(q.timestampLabel)}</button> "${escapeHtml(q.quote)}"`,
                )
                .join('; ')}
            </div>`
          : ''
      }
      <div class="bible-sources-list">
        ${bibleSources
          .map(
            (b) => `
          <a class="bible-badge" href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(b.quote)}">
            📖 ${escapeHtml(b.reference)} ↗
          </a>
        `,
          )
          .join('')}
      </div>
    `;
    jesusSection.appendChild(gEl);
  });
  detailsContainer.appendChild(jesusSection);

  const providerLabel = evaluation.provider === 'claude' ? 'Claude' : 'Gemini';
  const datum = new Date(evaluation.createdAt);
  const dateLabel = Number.isNaN(datum.getTime())
    ? ''
    : options.fromCache
      ? v.fromCache(datum.toLocaleDateString(t.locale))
      : v.justAnalyzed;
  detailsContainer.appendChild(
    h(
      'div',
      { class: 'meta' },
      h('span', {}, `${providerLabel} · ${evaluation.model}`),
      dateLabel ? h('span', {}, dateLabel) : null,
    ),
  );

  card.appendChild(detailsContainer);
  container.appendChild(card);

  // Wire up collapse toggle button
  const toggleBtn = container.querySelector('#wwjd-toggle-btn');
  let isCollapsed = !!options.initiallyCollapsed;
  toggleBtn?.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    detailsContainer.style.display = isCollapsed ? 'none' : 'block';
    toggleBtn.textContent = isCollapsed ? v.showDetails : v.hideDetails;
    options.onToggleCollapse?.(isCollapsed);
  });

  // Wire up timestamp clicks
  container.querySelectorAll('.time-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const start = Number(btn.getAttribute('data-start'));
      if (!Number.isNaN(start) && options.onSeek) {
        options.onSeek(start);
      }
    });
  });
}

export function renderWwjdStateView(
  container: HTMLElement,
  state: WwjdViewState,
  handlers: WwjdStateHandlers = {},
  opts: { collapsed?: boolean; enabled?: boolean; taal?: string; t?: Messages } = {},
): void {
  const lang = normalizeLang(
    opts.taal ?? (state.kind === 'done' ? state.evaluation.taal : undefined) ?? 'nl',
  );
  const t = opts.t ?? messages(lang);
  const v = t.view;
  const enabled = opts.enabled !== false;

  if (enabled && state.kind === 'done') {
    renderWwjdView(container, state.evaluation, {
      onSeek: handlers.onSeek,
      initiallyCollapsed: opts.collapsed,
      onRefresh: handlers.onRefresh,
      onOpenOptions: handlers.onOpenOptions,
      onToggleCollapse: handlers.onToggleCollapse,
      onToggleEnabled: handlers.onToggleEnabled,
      enabled,
      fromCache: state.fromCache,
      taal: lang,
      t,
    });
    return;
  }

  container.innerHTML = '';
  const styleEl = document.createElement('style');
  styleEl.textContent = WWJD_BASE_CSS;
  container.appendChild(styleEl);

  const actions = h('div', { class: 'wwjd-header-actions' });
  if (handlers.onToggleEnabled) {
    actions.append(
      h(
        'button',
        {
          type: 'button',
          class: 'switch',
          role: 'switch',
          'aria-checked': String(enabled),
          'aria-label': v.switchAria,
          title: enabled ? v.turnOff : v.turnOn,
          onClick: () => handlers.onToggleEnabled?.(!enabled),
        },
        h('span', { class: 'knob' }),
      ),
    );
  }

  const header = h(
    'div',
    { class: 'wwjd-header' },
    h('div', { class: 'title', role: 'heading', 'aria-level': '2' }, 'WWJD'),
    actions,
  );

  const card = h('div', { class: 'wwjd-card', 'aria-live': 'polite' }, header);

  if (!enabled) {
    card.append(h('p', { class: 'off' }, v.off));
    container.appendChild(card);
    return;
  }

  if (state.kind === 'idle') {
    card.append(
      h(
        'div',
        { class: 'actions' },
        h(
          'button',
          { type: 'button', class: 'btn primary', onClick: handlers.onStart },
          v.analyzeVideo,
        ),
      ),
    );
  } else if (state.kind === 'loading') {
    card.append(
      h(
        'div',
        { class: 'loading', role: 'status' },
        h(
          'div',
          { class: 'step' },
          h('span', { class: 'spinner' }),
          state.step ?? v.loadingStep,
        ),
        h('div', { class: 'bar w90' }),
        h('div', { class: 'bar w80' }),
        h('div', { class: 'bar w60' }),
      ),
    );
  } else if (state.kind === 'error') {
    const errActions = h('div', { class: 'actions' });
    if (state.showSettings && handlers.onOpenOptions) {
      errActions.append(
        h(
          'button',
          { type: 'button', class: 'btn primary', onClick: handlers.onOpenOptions },
          v.openSettings,
        ),
      );
    }
    if (handlers.onRefresh) {
      errActions.append(
        h('button', { type: 'button', class: 'btn', onClick: handlers.onRefresh }, v.retry),
      );
    }
    card.append(h('div', { class: 'error-msg', role: 'alert' }, state.message), errActions);
  }

  container.appendChild(card);
}
