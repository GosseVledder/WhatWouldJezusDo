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
  gap: 8px;
  min-height: 24px;
}

.wwjd-header .title {
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: var(--yt-text);
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.wwjd-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: 0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--yt-text);
  flex: none;
}

.icon-btn:hover {
  background: var(--yt-card-hover);
}

.icon-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.switch {
  position: relative;
  flex: none;
  width: 36px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: #909090;
  cursor: pointer;
  transition: background 0.15s;
}

.switch .knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: left 0.15s;
}

.switch[aria-checked="true"] {
  background: var(--yt-accent);
}

.switch[aria-checked="true"] .knob {
  left: 18px;
}

.off {
  margin: 4px 0 0;
  color: var(--yt-text-2);
  font-size: 13px;
}

.btn {
  background: var(--yt-card-hover);
  border: 0;
  border-radius: 18px;
  padding: 0 14px;
  height: 32px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn:hover {
  background: var(--yt-border);
}

.btn.primary {
  background: var(--yt-text);
  color: var(--yt-bg);
}

.btn.primary:hover {
  opacity: 0.85;
}

.btn svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.loading {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}

.loading .step {
  color: var(--yt-text-2);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--yt-border);
  border-top-color: var(--yt-accent);
  animation: spin 0.8s linear infinite;
  flex: none;
}

.bar {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--yt-card) 0%, var(--yt-card-hover) 50%, var(--yt-card) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.bar.w80 { width: 80%; }
.bar.w60 { width: 60%; }
.bar.w90 { width: 90%; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

.error-msg {
  margin-top: 4px;
  color: var(--yt-text);
}

.error-msg::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--yt-red);
  margin-right: 8px;
  vertical-align: 1px;
}

.meta {
  margin-top: 10px;
  font-size: 12px;
  color: var(--yt-text-2);
  display: flex;
  flex-wrap: wrap;
  gap: 4px 10px;
}

.wwjd-score-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.wwjd-score-visuals {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: none;
}

.wwjd-scale-face {
  width: 56px;
  height: 77px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid currentColor;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  display: block;
}

.wwjd-scale-scene {
  width: 56px;
  height: 122px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid currentColor;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  display: block;
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

export const ICONS = {
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>',
  logo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7V2z"/></svg>',
  refresh:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
  chevronUp:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>',
  chevronDown:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>',
  close:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  warn: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
  settings:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.14 12.94a7.3 7.3 0 0 0 0-1.88l2.03-1.58-1.92-3.32-2.39.96a7 7 0 0 0-1.63-.94L14.87 3.6h-3.84l-.36 2.58c-.59.24-1.13.56-1.63.94l-2.39-.96-1.92 3.32 2.03 1.58a7.3 7.3 0 0 0 0 1.88l-2.03 1.58 1.92 3.32 2.39-.96c.5.38 1.04.7 1.63.94l.36 2.58h3.84l.36-2.58c.59-.24 1.13-.56 1.63-.94l2.39.96 1.92-3.32-2.03-1.58zM12.95 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>',
};
