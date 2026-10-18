// "How do I get a key?" on the settings pages (extension options and the app): a
// collapsed step list per service under the key field, with the key page linked in
// the steps, what the key costs and which models/limits apply.
import type { ProviderId } from '../engine/types';

export type KeyKind = ProviderId | 'factcheck';

/** Where a key for each service is created. */
export const KEY_URLS: Record<KeyKind, string> = {
  gemini: 'https://aistudio.google.com/apikey',
  claude: 'https://console.anthropic.com/settings/keys',
  factcheck: 'https://console.cloud.google.com/apis/credentials',
};

const KEY_STEPS_TEXT: Record<KeyKind, string[]> = {
  gemini: [
    'Open {site} en log in met je Google-account.',
    'Accepteer de voorwaarden (alleen de eerste keer).',
    'Klik op "Create API key"; kies zo nodig een project of laat er een aanmaken.',
    'Kopieer de sleutel (begint met AIza) en plak hem hierboven bij API-sleutel.',
    'Klik op "Test verbinding".',
  ],
  claude: [
    'Open {site} en maak een account aan of log in.',
    'Koop tegoed onder "Billing" (vooraf betaald); zet bij voorkeur ook een maximum op je uitgaven.',
    'Kies "Create key" bij de API-sleutels en geef de sleutel een naam.',
    'Kopieer de sleutel (begint met sk-ant-) meteen: je ziet hem maar één keer. Plak hem hierboven bij API-sleutel.',
    'Klik op "Test verbinding".',
  ],
  factcheck: [
    'Open {site} en log in met je Google-account (geen creditcard of betaalaccount nodig).',
    'Kies bovenin een bestaand project of klik op "New Project" en noem het bijvoorbeeld WWJD.',
    'Open de Fact Check Tools API in de API Library (console.cloud.google.com/apis/library/factchecktools.googleapis.com) en klik op "Enable".',
    'Ga naar "Credentials", klik op "+ Create Credentials" → "API key", kopieer de sleutel (begint met AIza) en plak hem hierboven.',
    'Klik op "Test verbinding".',
  ],
};

const KEY_COST_TEXT: Record<KeyKind, string> = {
  gemini:
    'Gratis zolang je geen facturering (billing) aan het Google-project koppelt. Reken op ongeveer 10 analyses per minuut en 200 per dag; Google kan dat wijzigen en je eigen limiet zie je in AI Studio. Elke nieuwe video kost één aanroep, een eerder geanalyseerde video niets.',
  claude: 'Betaald: elke analyse gaat van je tegoed af. Zonder tegoed werkt de sleutel niet.',
  factcheck:
    '100% gratis (tot 10.000 zoekopdrachten per dag, geen creditcard nodig). Wordt gebruikt om beweringen direct te verifiëren bij erkende factcheck-organisaties wereldwijd.',
};

const KEY_MODELS_TEXT: Record<KeyKind, string> = {
  gemini:
    'Gratis via AI Studio: de Flash- en Flash-Lite-modellen (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Niet gratis: de Pro-modellen (gemini-pro-latest); die werken alleen met facturering.',
  claude: 'Alle Claude-modellen zijn betaald; Haiku is het goedkoopst, Opus het duurst.',
  factcheck:
    'Tip: gebruik je hetzelfde Google Cloud-project als voor je Gemini-sleutel, dan kun je nadat je de Fact Check Tools API hebt ingeschakeld ook dezelfde AIza-sleutel gebruiken.',
};

export function keySteps(kind: KeyKind, doc: Document = document): HTMLDetailsElement {
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
  for (const step of KEY_STEPS_TEXT[kind]) {
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
    el('summary', 'Hoe kom ik aan een sleutel?'),
    list,
    Object.assign(el('p', KEY_COST_TEXT[kind]), { className: 'key-cost' }),
    Object.assign(el('p', KEY_MODELS_TEXT[kind]), { className: 'key-cost' }),
  );
  return details;
}

export const SETTINGS_TIPS = {
  provider:
    'Welke AI de video analyseert en toetst aan de 25 richtlijnen van Jezus. Gemini is gratis te gebruiken (met een daglimiet); Claude betaal je per analyse.',
  apiKey:
    'Een geheime code waarmee What Would Jezus Do namens jou de AI-dienst gebruikt; eventuele kosten komen op jouw account. De sleutel blijft op dit apparaat en gaat alleen naar die dienst.',
  model:
    'Het AI-model dat de analyse maakt. Laat de standaard staan, tenzij je een ander model wilt proberen; "Test verbinding" controleert of het bestaat. Met een gratis Gemini-sleutel werken alleen de Flash- en Flash-Lite-modellen; Pro vraagt facturering.',
  factcheck:
    'De Google Fact Check Tools API doorzoekt razendsnel duizenden bestaande factchecks van erkende organisaties (zoals Reuters, AP, Nieuwscheckers, PolitiFact). Is er geen bestaande factcheck voor een uitspraak, dan voert de AI zelf een historische feitenanalyse uit.',
  factcheckKey:
    'Een gratis API-sleutel uit de Google Cloud Console waarmee de Fact Check Tools API wordt aangeroepen. De sleutel blijft op dit apparaat en gaat alleen naar Google.',
  actief:
    'Aan: het What Would Jezus Do-paneel verschijnt op YouTube-videopagina’s. Uit: de extensie doet niets op YouTube.',
  auto: 'Aan: elke video die je opent wordt meteen geanalyseerd; een nieuwe video kost één AI-aanroep. Uit: pas analyseren wanneer je op "Analyseer" klikt.',
  collapsed:
    'Aan: toont eerst alleen de Jezus-score (0–10) en de korte conclusie; de volledige factcheck en de bijbelverwijzingen klap je open wanneer je die wilt lezen.',
  updates:
    'Zoekt op GitHub naar de nieuwste versie van What Would Jezus Do. Er gaan geen sleutels of andere gegevens mee.',
  cache:
    'Elke analyse wordt bewaard, zodat dezelfde video opnieuw openen niets kost. Wissen verwijdert alle bewaarde analyses; je sleutels en instellingen blijven staan.',
  debug:
    'Voor probleemoplossing: houdt per AI-aanroep bij welk model is gebruikt, hoe lang het duurde en hoeveel tokens het kostte. Je sleutel staat er nooit in.',
} as const;

export type TipKey = keyof typeof SETTINGS_TIPS;
