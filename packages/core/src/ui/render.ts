import type { ScoredGuideline, WwjdEvaluation } from '../engine/types';
import { WWJD_BASE_CSS } from './styles';

export interface RenderOptions {
  onSeek?: (seconds: number) => void;
  initiallyCollapsed?: boolean;
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

  // Format header
  const header = document.createElement('div');
  header.className = 'wwjd-header';
  header.innerHTML = `
    <div class="wwjd-brand">
      <span class="logo-badge">WWJD</span>
      <span class="title">What Would Jezus Do</span>
    </div>
    <button type="button" class="toggle-details-btn" id="wwjd-toggle-btn">
      ${options.initiallyCollapsed ? 'Toon onderbouwing ▼' : 'Onderbouwing inklappen ▲'}
    </button>
  `;
  card.appendChild(header);

  // Score banner
  const scoreBanner = document.createElement('div');
  scoreBanner.className = `wwjd-score-banner ${scoreClass}`;
  scoreBanner.innerHTML = `
    <div class="wwjd-score-number">${evaluation.finalScore.toFixed(1)}</div>
    <div class="wwjd-score-details">
      <strong>Jezus-overeenkomst: ${evaluation.finalScore.toFixed(1)} / 10</strong>
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
    <div class="section-title">1. Factcheck & Integriteit (Activiteit 1)</div>
    <div class="activity-summary">
      <strong>Kern van activiteit:</strong> ${escapeHtml(evaluation.factcheckDossier.coreActivity)}<br>
      <strong>Sentiment & houding:</strong> ${escapeHtml(evaluation.factcheckDossier.sentimentAndAttitude)}
    </div>
  `;

  if (evaluation.factcheckDossier.contradictionsDetected.length > 0) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'contradiction-alert';
    alertDiv.style.marginTop = '6px';
    alertDiv.innerHTML = `
      ⚠️ <strong>Zelf-tegenspraak geconstateerd (= per definitie liegen):</strong><br>
      ${evaluation.factcheckDossier.contradictionsDetected.map((c) => `• ${escapeHtml(c)}`).join('<br>')}
    `;
    factcheckSection.appendChild(alertDiv);
  }

  // Statement list
  evaluation.factcheckDossier.statements.forEach((stmt) => {
    const stmtEl = document.createElement('div');
    stmtEl.className = 'statement-item';
    stmtEl.innerHTML = `
      <div class="statement-header">
        <button type="button" class="time-btn" data-start="${stmt.startSeconds}">
          ⏱️ ${escapeHtml(stmt.timestampLabel)}
        </button>
        <span class="verdict-tag ${stmt.verdict}">${stmt.verdict.replace(/_/g, ' ')}</span>
      </div>
      <div><strong>Uitspraak:</strong> "${escapeHtml(stmt.quote)}"</div>
      <div><strong>Factcheck:</strong> ${escapeHtml(stmt.historicalAnalysis)}</div>
      ${
        stmt.sources && stmt.sources.length > 0
          ? `<div><small>Bron(nen): ${stmt.sources
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
    <div class="section-title">2. Toetsing aan Jezus' Richtlijnen (${evaluation.relevantGuidelines.length} relevante punten meegewogen)</div>
  `;

  evaluation.relevantGuidelines.forEach((g: ScoredGuideline) => {
    const gEl = document.createElement('div');
    gEl.className = 'guideline-card';

    let gScoreClass = 'score-mid';
    if (g.score >= 7.0) gScoreClass = 'score-high';
    else if (g.score < 4.0) gScoreClass = 'score-low';

    gEl.innerHTML = `
      <div class="guideline-head">
        <div class="guideline-title">#${g.number} ${escapeHtml(g.title)}</div>
        <div class="guideline-score ${gScoreClass}">${g.score.toFixed(1)} / 10</div>
      </div>
      <div class="guideline-reasoning">${escapeHtml(g.reasoning)}</div>
      ${
        g.relatedQuotes.length > 0
          ? `<div style="font-size: 12px; color: var(--yt-text-2);">
              Gekoppeld aan moment: ${g.relatedQuotes
                .map(
                  (q) =>
                    `<button type="button" class="time-btn" data-start="${q.startSeconds}">${escapeHtml(q.timestampLabel)}</button> "${escapeHtml(q.quote)}"`,
                )
                .join('; ')}
            </div>`
          : ''
      }
      <div class="bible-sources-list">
        ${g.bibleSources
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

  card.appendChild(detailsContainer);
  container.appendChild(card);

  // Wire up collapse toggle button
  const toggleBtn = container.querySelector('#wwjd-toggle-btn');
  let isCollapsed = !!options.initiallyCollapsed;
  toggleBtn?.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    detailsContainer.style.display = isCollapsed ? 'none' : 'block';
    toggleBtn.textContent = isCollapsed ? 'Toon onderbouwing ▼' : 'Onderbouwing inklappen ▲';
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
