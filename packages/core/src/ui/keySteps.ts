// "How do I get a key?" on the settings pages (extension options and the app): a
// collapsed step list per service under the key field, with the key page linked in
// the steps, what the key costs and which models/limits apply.
import type { ProviderId } from '../engine/types';
import { messages, type Messages } from '../i18n/messages';
import { nl } from '../i18n/nl';

export type KeyKind = ProviderId | 'factcheck';

/** Where a key for each service is created. */
export const KEY_URLS: Record<KeyKind, string> = {
  gemini: 'https://aistudio.google.com/apikey',
  claude: 'https://console.anthropic.com/settings/keys',
  factcheck: 'https://console.cloud.google.com/apis/credentials',
};

export function keySteps(
  kind: KeyKind,
  t: Messages = messages('nl'),
  doc: Document = document,
): HTMLDetailsElement {
  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string) => {
    const node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const url = KEY_URLS[kind];
  const link = () =>
    Object.assign(el('a', new URL(url).hostname), {
      href: url,
      target: '_blank',
      rel: 'noreferrer',
    });

  const list = el('ol');
  for (const step of t.settings.keySteps[kind]) {
    const item = el('li');
    step.split('{site}').forEach((part, i) => {
      if (i > 0) item.append(link());
      item.append(part);
    });
    list.append(item);
  }

  const details = el('details');
  details.className = 'key-steps';
  details.append(
    el('summary', t.settings.keyStepsTitle),
    list,
    Object.assign(el('p', t.settings.keyCost[kind]), { className: 'key-cost' }),
    Object.assign(el('p', t.settings.keyModels[kind]), { className: 'key-cost' }),
  );
  return details;
}

export const SETTINGS_TIPS = nl.tips;

export type TipKey = keyof Messages['tips'];
