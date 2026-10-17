export const WWJD_BASE_CSS = `
:host {
  all: initial;
  --yt-bg: #ffffff;
  --yt-card: rgba(0, 0, 0, 0.05);
  --yt-card-hover: rgba(0, 0, 0, 0.08);
  --yt-text: #0f0f0f;
  --yt-text-2: #606060;
  --yt-border: rgba(0, 0, 0, 0.1);
  --yt-accent: #065fd4;
  --yt-accent-bg: #def1ff;
  --yt-green: #137333;
  --yt-green-bg: #e6f4ea;
  --yt-amber: #b05a00;
  --yt-amber-bg: #fef7e0;
  --yt-red: #c5221f;
  --yt-red-bg: #fce8e6;
  --yt-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  font-family: "Roboto", "Arial", sans-serif;
  color: var(--yt-text);
  font-size: 14px;
  line-height: 20px;
}
:host([data-theme="dark"]) {
  --yt-bg: #212121;
  --yt-card: rgba(255, 255, 255, 0.08);
  --yt-card-hover: rgba(255, 255, 255, 0.14);
  --yt-text: #f1f1f1;
  --yt-text-2: #aaaaaa;
  --yt-border: rgba(255, 255, 255, 0.15);
  --yt-accent: #3ea6ff;
  --yt-accent-bg: #263850;
  --yt-green: #81c995;
  --yt-green-bg: #133924;
  --yt-amber: #fdd663;
  --yt-amber-bg: #3d2e14;
  --yt-red: #f28b82;
  --yt-red-bg: #441b18;
  --yt-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}
* { box-sizing: border-box; }
button { font: inherit; color: inherit; cursor: pointer; }
a { color: var(--yt-accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.wwjd-card {
  background: var(--yt-card);
  border: 1px solid var(--yt-border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wwjd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.wwjd-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wwjd-brand .logo-badge {
  background: var(--yt-accent);
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.wwjd-brand .title {
  font-size: 16px;
  font-weight: 600;
  color: var(--yt-text);
}

.wwjd-score-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.wwjd-score-banner.score-high {
  background: var(--yt-green-bg);
  border-color: var(--yt-green);
  color: var(--yt-green);
}

.wwjd-score-banner.score-mid {
  background: var(--yt-amber-bg);
  border-color: var(--yt-amber);
  color: var(--yt-amber);
}

.wwjd-score-banner.score-low {
  background: var(--yt-red-bg);
  border-color: var(--yt-red);
  color: var(--yt-red);
}

.wwjd-score-number {
  font-size: 32px;
  font-weight: 800;
  line-height: 1;
}

.wwjd-score-details {
  flex: 1;
  color: var(--yt-text);
  font-size: 13px;
  line-height: 18px;
}

.wwjd-score-details strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}

.toggle-details-btn {
  background: var(--yt-card-hover);
  border: 0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--yt-text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-details-btn:hover {
  background: var(--yt-border);
}

/* Factcheck Dossier (Activiteit 1) */
.section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--yt-text-2);
  margin-top: 8px;
}

.activity-summary {
  font-size: 13px;
  background: var(--yt-card);
  padding: 10px 12px;
  border-radius: 6px;
  border-left: 3px solid var(--yt-accent);
}

.contradiction-alert {
  background: var(--yt-red-bg);
  color: var(--yt-red);
  border: 1px solid var(--yt-red);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.statement-item {
  background: var(--yt-card);
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 6px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.time-btn {
  background: var(--yt-accent-bg);
  color: var(--yt-accent);
  border: 0;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  font-family: monospace;
}

.time-btn:hover {
  filter: brightness(0.9);
}

.verdict-tag {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

.verdict-tag.bevestigd {
  background: var(--yt-green-bg);
  color: var(--yt-green);
}

.verdict-tag.ontkracht {
  background: var(--yt-red-bg);
  color: var(--yt-red);
}

.verdict-tag.tegenspraak {
  background: var(--yt-red-bg);
  color: var(--yt-red);
}

.verdict-tag.gemengd_of_context {
  background: var(--yt-amber-bg);
  color: var(--yt-amber);
}

.verdict-tag.opinie {
  background: var(--yt-card-hover);
  color: var(--yt-text-2);
}

/* Guideline Items (Activiteit 2) */
.guideline-card {
  background: var(--yt-card);
  border: 1px solid var(--yt-border);
  border-radius: 8px;
  padding: 12px;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.guideline-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.guideline-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--yt-text);
}

.guideline-score {
  font-weight: 800;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 4px;
}

.guideline-reasoning {
  font-size: 13px;
  line-height: 18px;
  color: var(--yt-text);
}

.bible-sources-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.bible-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--yt-accent-bg);
  color: var(--yt-accent);
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.bible-badge:hover {
  filter: brightness(0.95);
  text-decoration: none;
}
`;
