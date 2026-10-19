import type { FactcheckVerdict } from '../engine/types';
import type { KeyKind } from '../ui/keySteps';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';
import { nl } from './nl';
import { pt } from './pt';

export const UI_LANGUAGES = ['nl', 'en', 'de', 'fr', 'es', 'it', 'pt'] as const;
export type UiLang = (typeof UI_LANGUAGES)[number];

/** Every language in its own name, for the language selector menu. */
export const UI_LANGUAGE_NAMES: Record<UiLang, string> = {
  nl: 'Nederlands',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
};

/** Two strings around a link or a bold part: [before, after]. */
export type Around = [string, string];

export interface Messages {
  /** BCP 47 locale for dates and numbers. */
  locale: string;
  /** Name of each supported language in this language. */
  languageNames: Record<UiLang, string>;

  view: {
    switchAria: string;
    turnOff: string;
    turnOn: string;
    showDetails: string;
    hideDetails: string;
    jesusAlignment: string;
    section1Title: string;
    coreActivity: string;
    sentimentAndAttitude: string;
    contradictionAlert: string;
    statementLabel: string;
    factcheckLabel: string;
    sourcesLabel: string;
    verdicts: Record<FactcheckVerdict, string>;
    section2Title: (count: number) => string;
    linkedToMoment: string;
    fromCache: (date: string) => string;
    justAnalyzed: string;
    off: string;
    analyzeVideo: string;
    loadingStep: string;
    fetchingTranscript: string;
    evaluatingWith: (provider: string) => string;
    openSettings: string;
    retry: string;
    refresh: string;
    verifiedVia: (publisher: string, rating: string) => string;
  };

  settings: {
    title: string;
    loading: string;
    autoSaved: string;
    saved: string;
    languageHeading: string;
    languageLabel: string;
    languageHint: string;
    aiService: string;
    providerHint: string;
    apiKey: string;
    apiKeyOf: (provider: string) => string;
    modelOf: (provider: string) => string;
    show: string;
    hide: string;
    keyHintBrowser: Around;
    keyHintDevice: Around;
    keyStepsTitle: string;
    keySteps: Record<KeyKind, string[]>;
    keyCost: Record<KeyKind, string>;
    keyModels: Record<KeyKind, string>;
    model: string;
    testConnection: string;
    busy: string;
    testOk: string;
    testOkFactcheck: string;
    testOkShort: string;
    testFailed: string;
    fillKeyFirst: string;
    factcheckHeading: string;
    factcheckToggle: string;
    factcheckHint: string;
    factcheckKeyLabel: string;
    factcheckKeyHintBrowser: Around;
    factcheckKeyHintDevice: Around;
    evalHeading: string;
    displayHeading: string;
    activeLabel: string;
    activeHint: string;
    autoLabel: string;
    autoHint: string;
    collapsedLabel: string;
    collapsedHint: string;
    tipLabel: string;
    cacheHeading: string;
    savedAnalyses: string;
    cacheText: string;
    clearCache: string;
    clear: string;
    cacheCount: (n: number) => string;
    analysisCount: (n: number) => string;
    confirmClear: string;
    advanced: string;
    debugHeading: string;
    debugCheck: string;
    showLog: string;
    clearLog: string;
    logEmpty: string;
    logHead: [string, string, string, string, string, string, string, string, string];
  };

  tips: {
    language: string;
    provider: string;
    apiKey: string;
    model: string;
    factcheck: string;
    factcheckKey: string;
    actief: string;
    auto: string;
    collapsed: string;
    updates: string;
    cache: string;
    debug: string;
  };

  update: {
    heading: string;
    installed: (version: string) => string;
    check: string;
    checking: string;
    upToDate: string;
    available: (version: string) => string;
    none: string;
    failed: (error: string) => string;
    whatsNew: string;
    download: (version: string) => string;
    extensionSteps: [string, string, string];
    reload: string;
    downloadInstall: string;
    downloading: string;
    opening: string;
    installHint: string;
    checksumFailed: string;
    downloadFailed: (error: string) => string;
  };

  extension: {
    actionTitle: string;
    disabledError: string;
    noKeyError: (provider: string) => string;
    noTranscriptError: (reason: string) => string;
    unknownError: string;
  };

  app: {
    analysisTitle: string;
    shareAction: string;
    back: string;
    settings: string;
    showPlayer: string;
    hidePlayer: string;
    pastePlaceholder: string;
    linkAria: string;
    notRecognized: string;
    shareHint: Around;
    analyzeButton: string;
    recent: string;
    noAnalyses: string;
    deleteAnalysis: string;
    shareNoVideo: string;
    cannotPlay: (code: number | string) => string;
    openInYouTube: string;
    seekTitle: (time: string) => string;
    playerOff: string;
    showPlayerAndSeek: (time: string) => string;
    openInYouTubeAt: (time: string) => string;
    openedInYouTube: (time: string) => string;
    cancel: string;
    noKeyError: string;
  };
}

const DICTS: Record<UiLang, Messages> = { nl, en, de, fr, es, it, pt };

export function isUiLang(code: string): code is UiLang {
  return (UI_LANGUAGES as readonly string[]).includes(code);
}

/** Texts for a language; unknown languages fall back to English, then Dutch. */
export function messages(lang: string | undefined): Messages {
  const base = (lang ?? 'nl').toLowerCase().split('-')[0] ?? 'nl';
  return isUiLang(base) ? DICTS[base] : lang ? DICTS.en : DICTS.nl;
}
