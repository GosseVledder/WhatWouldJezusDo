import type { AnalysisStep, ScoredGuideline, WwjdEvaluation } from '../engine/types';
import { getGuidelineById, localizeBibleSource, normalizeLang } from '../guidelines/jesus';
import { messages, type Messages } from '../i18n/messages';
import type { KeyKind } from './keySteps';
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
  panelCollapsed?: boolean;
  onRefresh?: () => void;
  onOpenOptions?: () => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  onToggleEnabled?: (enabled: boolean) => void;
  enabled?: boolean;
  fromCache?: boolean;
  /** Keys still missing: shows the "Setup not finished" card. */
  setupMissing?: KeyKind[];
  /** Synced live mode: the details scroll on their own while the video plays. */
  live?: boolean;
  onOpenSetup?: () => void;
  taal?: string;
  t?: Messages;
}

export type WwjdViewState =
  | { kind: 'idle' }
  | { kind: 'loading'; step?: string; progress?: AnalysisProgress }
  | { kind: 'error'; message: string; details?: string; showSettings?: boolean }
  | { kind: 'done'; evaluation: WwjdEvaluation; fromCache?: boolean };

/** Where an analysis is; `factcheck` false when no Fact Check key is used (step left out). */
export interface AnalysisProgress {
  current: AnalysisStep;
  factcheck: boolean;
}

/** The step list of an analysis: done, active or still to come. */
export function progressSteps(
  t: Messages,
  progress: AnalysisProgress,
): { step: AnalysisStep; label: string; status: 'done' | 'active' | 'todo' }[] {
  const order: AnalysisStep[] = ['transcript', 'analyse'];
  if (progress.factcheck) order.push('factcheck');
  if (progress.current === 'reconcile') order.push('reconcile');
  const at = order.indexOf(progress.current);
  return order.map((step, i) => ({
    step,
    label: t.view.progressSteps[step],
    status: i < at ? 'done' : i === at ? 'active' : 'todo',
  }));
}

export interface WwjdStateHandlers {
  onStart?: () => void;
  onRefresh?: () => void;
  onOpenOptions?: () => void;
  onSeek?: (seconds: number) => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  onToggleEnabled?: (enabled: boolean) => void;
  /** Opens the welcome page ("Setup guide"). */
  onOpenSetup?: () => void;
}

/** "Setup not finished" card with a button back to the welcome page. */
/** What the setup card asks for, from the list of missing keys (AI key and/or Fact Check key). */
export function setupMissingText(t: Messages, missing: KeyKind[]): string {
  const O = t.onboarding;
  const ai = missing.find((k) => k !== 'factcheck');
  const name = ai === 'claude' ? 'Claude' : 'Gemini';
  if (ai && missing.includes('factcheck')) return O.setupMissing(name);
  if (ai) return O.setupMissingAi(name);
  return O.setupMissingFactcheck;
}

export function setupNotice(
  t: Messages,
  missing: KeyKind[],
  onOpenSetup?: () => void,
): HTMLElement {
  const O = t.onboarding;
  return h(
    'div',
    { class: 'setup-card', role: 'status' },
    h('strong', {}, O.setupNotFinished),
    h('span', {}, setupMissingText(t, missing)),
    onOpenSetup
      ? h('button', { type: 'button', class: 'btn primary', onClick: onOpenSetup }, O.finishSetup)
      : null,
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function scoreClassFor(score: number): string {
  if (score >= 7.0) return 'score-high';
  if (score < 4.0) return 'score-low';
  return 'score-mid';
}

function renderGuidelineCard(
  g: ScoredGuideline,
  lang: ReturnType<typeof normalizeLang>,
  v: Messages['view'],
): HTMLElement {
  const gEl = document.createElement('div');
  gEl.className = 'guideline-card';
  const gScoreClass = scoreClassFor(g.score);
  const dbGuideline = lang !== 'nl' ? getGuidelineById(g.guidelineId, lang) : undefined;
  const guidelineTitle = dbGuideline ? dbGuideline.title : g.title;
  const bibleSources =
    lang !== 'nl'
      ? (dbGuideline?.sources ?? g.bibleSources.map((b) => localizeBibleSource(b, lang)))
      : g.bibleSources;

  if (g.relatedQuotes.length > 0) {
    // Synced live mode: a teaching note lights up when one of its quotes is said
    gEl.dataset.moments = g.relatedQuotes.map((q) => q.startSeconds).join(',');
    gEl.dataset.liveKind = 'teaching';
    gEl.dataset.liveText = `#${g.number} ${guidelineTitle}`;
    gEl.dataset.liveLabel = `${g.score.toFixed(1)} / 10`;
    gEl.dataset.liveTone = gScoreClass;
    gEl.setAttribute('data-scroll', '');
  }
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
  return gEl;
}

/** The presenter's own score, when the presenter is not the subject and was scored. */
export function presenterScoreOf(evaluation: WwjdEvaluation): number | undefined {
  const p = evaluation.presenterEvaluation;
  return p && p.relevantGuidelines.length > 0 ? p.finalScore : undefined;
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

  const isPanelCollapsed = !!options.panelCollapsed;
  let isCollapsed = isPanelCollapsed ? true : !!options.initiallyCollapsed;

  const card = document.createElement('div');
  card.className = isPanelCollapsed ? 'wwjd-card collapsed' : 'wwjd-card';

  // Determine score color class
  const scoreClass = scoreClassFor(evaluation.finalScore);

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
    isCollapsed ? v.showDetails : v.hideDetails,
  );
  actions.append(toggleBtnEl);

  // Details Container (Collapsible)
  const detailsContainer = document.createElement('div');
  detailsContainer.id = 'wwjd-details-body';
  if (options.live) {
    card.classList.add('live');
    detailsContainer.classList.add('live-scroll');
  }
  if (isCollapsed) {
    detailsContainer.style.display = 'none';
  }

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
  if (options.setupMissing?.length)
    card.appendChild(setupNotice(t, options.setupMissing, options.onOpenSetup));

  // Score banner
  const scaleIllustration = getScaleIllustration(evaluation.finalScore);
  const scoreBanner = document.createElement('div');
  scoreBanner.className = `wwjd-score-banner ${scoreClass}`;
  scoreBanner.setAttribute('data-scale-step', String(scaleIllustration.step));
  scoreBanner.innerHTML = `
    <div class="wwjd-score-visuals" data-scale-step="${scaleIllustration.step}">
      <div class="wwjd-score-number">${evaluation.finalScore.toFixed(1)}</div>
      <img
        class="wwjd-scale-face"
        src="${scaleIllustration.faceUrl}"
        alt=""
        aria-hidden="true"
        data-scale-step="${scaleIllustration.step}"
      />
      <img
        class="wwjd-scale-scene"
        src="${scaleIllustration.sceneUrl}"
        alt="${escapeHtml(v.jesusAlignment)} (${scaleIllustration.step}/9)"
        data-scale-step="${scaleIllustration.step}"
      />
    </div>
    <div class="wwjd-score-details">
      <strong>${escapeHtml(v.jesusAlignment)}: ${evaluation.finalScore.toFixed(1)} / 10</strong>
      ${escapeHtml(evaluation.verdictSummary)}
    </div>
  `;
  // Two independent scores side by side: the story and its facts, and the presenter.
  const presenterScore = presenterScoreOf(evaluation);
  if (presenterScore !== undefined) {
    scoreBanner
      .querySelector('.wwjd-score-details')!
      .prepend(
        h(
          'div',
          { class: 'score-pair' },
          h(
            'span',
            { class: `score-chip ${scoreClass}`, 'data-role': 'subject' },
            `${v.subjectScore} ${evaluation.finalScore.toFixed(1)}`,
          ),
          h(
            'span',
            { class: `score-chip ${scoreClassFor(presenterScore)}`, 'data-role': 'presenter' },
            `${v.presenterScore} ${presenterScore.toFixed(1)}`,
          ),
        ),
      );
  }
  card.appendChild(scoreBanner);

  // --- SAMENVATTING: boodschap van de video + de gecontroleerde feiten met tijdcodes ---
  // Geschreven na de factcheck en vóór de scores; oudere evaluaties zonder samenvatting tonen
  // alleen de lijst.
  const dossier = evaluation.factcheckDossier;
  const summarySection = h(
    'div',
    { class: 'summary-section' },
    h('div', { class: 'section-title' }, v.summaryTitle),
    evaluation.videoSummary ? h('p', { class: 'video-summary' }, evaluation.videoSummary) : null,
    dossier.statements.length > 0
      ? h(
          'div',
          { class: 'checked-facts' },
          h('div', { class: 'checked-facts-title' }, v.checkedFacts),
          h(
            'ul',
            {},
            ...dossier.statements.map((stmt) =>
              h(
                'li',
                { 'data-moments': String(stmt.startSeconds) },
                h(
                  'button',
                  { type: 'button', class: 'time-btn', 'data-start': String(stmt.startSeconds) },
                  stmt.timestampLabel,
                ),
                h(
                  'span',
                  { class: `verdict-tag ${stmt.verdict}` },
                  v.verdicts[stmt.verdict] ?? stmt.verdict.replace(/_/g, ' '),
                ),
                h('span', { class: 'checked-fact-claim' }, stmt.claim || stmt.quote),
              ),
            ),
          ),
        )
      : null,
  );
  detailsContainer.appendChild(summarySection);

  // --- SECTIE 1: FEITENCHECK & INTEGRITEIT (ACTIVITEIT 1) ---
  // Oudere evaluaties kennen geen rolverdeling; die tonen we ongewijzigd
  const hasRoles = dossier.presenterIsSubject !== undefined || dossier.presenter !== undefined;
  const presenter = dossier.presenterIsSubject ? undefined : dossier.presenter;

  const factcheckSection = document.createElement('div');
  factcheckSection.style.marginTop = '14px';
  factcheckSection.innerHTML = `
    <div class="section-title">${escapeHtml(v.section1Title)}</div>
    <div class="activity-summary">
      ${hasRoles ? `<strong>${escapeHtml(v.subjectLabel)}</strong><br>` : ''}
      <strong>${escapeHtml(v.coreActivity)}</strong> ${escapeHtml(dossier.coreActivity)}<br>
      <strong>${escapeHtml(v.sentimentAndAttitude)}</strong> ${escapeHtml(dossier.sentimentAndAttitude)}
    </div>
    ${
      dossier.presenterIsSubject
        ? `<div class="activity-summary">${escapeHtml(v.presenterIsSubject)}</div>`
        : presenter
          ? `<div class="activity-summary">
      <strong>${escapeHtml(v.presenterLabel)}</strong><br>
      <strong>${escapeHtml(v.presenterRole)}</strong> ${escapeHtml(presenter.role)}<br>
      <strong>${escapeHtml(v.presenterConduct)}</strong> ${escapeHtml(presenter.conduct)}<br>
      <strong>${escapeHtml(v.sentimentAndAttitude)}</strong> ${escapeHtml(presenter.sentimentAndAttitude)}
    </div>`
          : ''
    }
  `;

  const contradictionGroups: { label?: string; items: string[] }[] = [
    { label: hasRoles ? v.subjectLabel : undefined, items: dossier.contradictionsDetected },
    { label: v.presenterLabel, items: presenter?.contradictionsDetected ?? [] },
  ];
  contradictionGroups.forEach(({ label, items }) => {
    if (items.length === 0) return;
    const alertDiv = document.createElement('div');
    alertDiv.className = 'contradiction-alert';
    alertDiv.style.marginTop = '6px';
    alertDiv.innerHTML = `
      ⚠️ <strong>${label ? `${escapeHtml(label)} · ` : ''}${escapeHtml(v.contradictionAlert)}</strong><br>
      ${items.map((c) => `• ${escapeHtml(c)}`).join('<br>')}
    `;
    factcheckSection.appendChild(alertDiv);
  });

  // Statement list
  dossier.statements.forEach((stmt) => {
    const stmtEl = document.createElement('div');
    stmtEl.className = 'statement-item';
    const verdictLabel = v.verdicts[stmt.verdict] ?? stmt.verdict.replace(/_/g, ' ');
    // Synced live mode: the fact check lights up when the statement is said
    stmtEl.dataset.moments = String(stmt.startSeconds);
    stmtEl.dataset.liveKind = 'fact';
    stmtEl.dataset.liveText = stmt.claim || stmt.quote;
    stmtEl.dataset.liveLabel = verdictLabel;
    stmtEl.dataset.liveTone = stmt.verdict;
    stmtEl.setAttribute('data-scroll', '');
    const speakerLabel = stmt.speaker ? v.speakers[stmt.speaker] : undefined;
    stmtEl.innerHTML = `
      <div class="statement-header">
        <button type="button" class="time-btn" data-start="${stmt.startSeconds}">
          ⏱️ ${escapeHtml(stmt.timestampLabel)}
        </button>
        <span class="statement-tags">
          ${speakerLabel ? `<span class="speaker-tag ${stmt.speaker}">${escapeHtml(speakerLabel)}</span>` : ''}
          <span class="verdict-tag ${stmt.verdict}">${escapeHtml(verdictLabel)}</span>
        </span>
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
          : stmt.verdict !== 'opinie'
            ? `<div class="no-source"><small>${escapeHtml(v.noSource)}</small></div>`
            : ''
      }
    `;
    factcheckSection.appendChild(stmtEl);
  });

  if (evaluation.webSources?.length) {
    factcheckSection.appendChild(
      h(
        'div',
        { class: 'other-sources' },
        h('small', {}, `${v.otherSources} `),
        ...evaluation.webSources.flatMap((s, i) => [
          i > 0 ? ', ' : null,
          h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.title || s.url),
        ]),
      ),
    );
  }
  detailsContainer.appendChild(factcheckSection);

  // --- SECTIE 2: BEOORDELING VOLGENS JEZUS' RICHTLIJNEN (ACTIVITEIT 2) ---
  const jesusSection = document.createElement('div');
  jesusSection.style.marginTop = '14px';
  jesusSection.innerHTML = `
    <div class="section-title">${escapeHtml(v.section2Title(evaluation.relevantGuidelines.length))}</div>
  `;

  evaluation.relevantGuidelines.forEach((g) => {
    jesusSection.appendChild(renderGuidelineCard(g, lang, v));
  });
  detailsContainer.appendChild(jesusSection);

  // --- SECTIE 3: BEOORDELING VAN DE PRESENTATOR (alleen als die niet zelf het onderwerp is) ---
  const presenterEval = evaluation.presenterEvaluation;
  if (presenterEval && presenterEval.relevantGuidelines.length > 0) {
    const presenterSection = document.createElement('div');
    presenterSection.style.marginTop = '14px';
    presenterSection.innerHTML = `
      <div class="section-title">${escapeHtml(v.section3Title(presenterEval.relevantGuidelines.length))}</div>
      <div class="presenter-score">
        <span class="guideline-score ${scoreClassFor(presenterEval.finalScore)}">${escapeHtml(v.presenterScore)}: ${presenterEval.finalScore.toFixed(1)} / 10</span>
        <span>${escapeHtml(presenterEval.verdictSummary)}</span>
      </div>
    `;
    presenterEval.relevantGuidelines.forEach((g) => {
      presenterSection.appendChild(renderGuidelineCard(g, lang, v));
    });
    detailsContainer.appendChild(presenterSection);
  }

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
      options.onRefresh
        ? h(
            'button',
            {
              type: 'button',
              class: 'meta-refresh-btn',
              onClick: options.onRefresh,
            },
            `↻ ${v.refresh}`,
          )
        : null,
    ),
  );

  card.appendChild(detailsContainer);
  card.appendChild(
    h(
      'div',
      { class: 'peek' },
      presenterScore !== undefined
        ? `${v.subjectScore} ${evaluation.finalScore.toFixed(1)} · ${v.presenterScore} ${presenterScore.toFixed(1)} · ${evaluation.verdictSummary}`
        : `${evaluation.finalScore.toFixed(1)} / 10 · ${evaluation.verdictSummary}`,
    ),
  );
  container.appendChild(card);

  // Wire up collapse toggle button
  const toggleBtn = container.querySelector('#wwjd-toggle-btn');
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
  opts: {
    collapsed?: boolean;
    panelCollapsed?: boolean;
    enabled?: boolean;
    /** Keys still missing (see `setupStatus`). Without the AI key nothing can be analysed. */
    setupMissing?: KeyKind[];
    live?: boolean;
    taal?: string;
    t?: Messages;
  } = {},
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
      panelCollapsed: opts.panelCollapsed,
      onRefresh: handlers.onRefresh,
      onOpenOptions: handlers.onOpenOptions,
      onToggleCollapse: handlers.onToggleCollapse,
      onToggleEnabled: handlers.onToggleEnabled,
      enabled,
      fromCache: state.fromCache,
      setupMissing: opts.setupMissing,
      onOpenSetup: handlers.onOpenSetup,
      live: opts.live,
      taal: lang,
      t,
    });
    return;
  }

  container.innerHTML = '';
  const styleEl = document.createElement('style');
  styleEl.textContent = WWJD_BASE_CSS;
  container.appendChild(styleEl);

  const isPanelCollapsed = !!opts.panelCollapsed;
  const actions = h('div', { class: 'wwjd-header-actions' });
  const header = h(
    'div',
    { class: 'wwjd-header' },
    h('div', { class: 'title', role: 'heading', 'aria-level': '2' }, 'WWJD'),
    actions,
  );
  const card = h(
    'div',
    { class: isPanelCollapsed ? 'wwjd-card collapsed' : 'wwjd-card', 'aria-live': 'polite' },
    header,
  );

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

  if (!enabled) {
    card.append(h('p', { class: 'off' }, v.off));
    container.appendChild(card);
    return;
  }

  const missing = opts.setupMissing ?? [];
  if (missing.length) card.append(setupNotice(t, missing, handlers.onOpenSetup));
  if (missing.some((k) => k !== 'factcheck')) {
    // No AI key: the setup card is all there is to do.
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
    const steps = state.progress ? progressSteps(t, state.progress) : null;
    const stepText = steps
      ? (steps.find((s) => s.status === 'active')?.label ?? v.loadingStep)
      : (state.step ?? v.loadingStep);
    card.append(
      h(
        'div',
        { class: 'loading', role: 'status' },
        steps
          ? h(
              'ol',
              { class: 'progress-steps' },
              ...steps.map((s) =>
                h(
                  'li',
                  {
                    'data-status': s.status,
                    'aria-current': s.status === 'active' ? 'step' : false,
                  },
                  s.status === 'active'
                    ? h('span', { class: 'spinner' })
                    : h(
                        'span',
                        { class: 'step-mark', 'aria-hidden': 'true' },
                        s.status === 'done' ? '✓' : '',
                      ),
                  s.label,
                ),
              ),
            )
          : h('div', { class: 'step' }, h('span', { class: 'spinner' }), stepText),
        h('div', { class: 'bar w90' }),
        h('div', { class: 'bar w80' }),
        h('div', { class: 'bar w60' }),
      ),
      h('div', { class: 'peek' }, stepText),
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
    card.append(
      h('div', { class: 'error-msg', role: 'alert' }, state.message),
      errActions,
      h('div', { class: 'peek' }, state.message),
    );
  }

  container.appendChild(card);
}
