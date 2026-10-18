import type { Messages } from './messages';

export const de: Messages = {
  locale: 'de-DE',
  languageNames: {
    nl: 'Niederländisch',
    en: 'Englisch',
    de: 'Deutsch',
    fr: 'Französisch',
    es: 'Spanisch',
    it: 'Italienisch',
    pt: 'Portugiesisch',
  },

  view: {
    switchAria: 'WWJD ein oder aus',
    turnOff: 'WWJD ausschalten',
    turnOn: 'WWJD einschalten',
    showDetails: 'Begründung anzeigen ▼',
    hideDetails: 'Begründung einklappen ▲',
    jesusAlignment: 'Jesus-Übereinstimmung',
    section1Title: '1. Faktencheck & Integrität (Aktivität 1)',
    coreActivity: 'Kern der Aktivität:',
    sentimentAndAttitude: 'Stimmung & Haltung:',
    contradictionAlert: 'Selbstwiderspruch festgestellt (= per Definition Lüge):',
    statementLabel: 'Aussage:',
    factcheckLabel: 'Faktencheck:',
    sourcesLabel: 'Quelle(n):',
    verdicts: {
      bevestigd: 'bestätigt',
      ontkracht: 'widerlegt',
      tegenspraak: 'Widerspruch',
      gemengd_of_context: 'gemischt / Kontext',
      opinie: 'Meinung',
    },
    section2Title: (n) =>
      `2. Prüfung nach Jesu Richtlinien (${n} relevante Punkte gewichtet)`,
    linkedToMoment: 'Verknüpft mit Moment:',
    fromCache: (d) => `Aus dem Cache · ${d}`,
    justAnalyzed: 'Gerade analysiert',
    off: 'WWJD ist aus: Es werden keine Analysen erstellt.',
    analyzeVideo: 'Video analysieren',
    loadingStep: 'Video wird faktengeprüft und nach Jesu Richtlinien und den Zehn Geboten bewertet…',
    fetchingTranscript: 'Transkript wird abgerufen…',
    evaluatingWith: (p) => `Fakten prüfen und nach Jesu Richtlinien bewerten mit ${p}…`,
    openSettings: 'Einstellungen öffnen',
    retry: 'Erneut versuchen',
    verifiedVia: (pub, rating) => `[Verifiziert über ${pub} (Urteil: „${rating}“)]`,
  },

  settings: {
    title: 'Einstellungen',
    loading: 'Wird geladen…',
    autoSaved: 'Einstellungen werden sofort gespeichert.',
    saved: 'Gespeichert',
    languageHeading: 'Sprache',
    languageLabel: 'Sprache (Oberfläche, Analyse & Bibelverweise)',
    languageHint:
      'Bestimmt die Sprache der Oberfläche, der KI-Analyse und der verlinkten Bibelstellen.',
    aiService: 'KI-Dienst',
    providerHint:
      'Der gewählte Dienst extrahiert Aussagen aus dem Transkript, überprüft die Fakten und bewertet das Video anhand der 25 Richtlinien und Gebote Jesu.',
    apiKey: 'API-Schlüssel',
    apiKeyOf: (p) => `API-Schlüssel ${p}`,
    modelOf: (p) => `Modell ${p}`,
    show: 'Zeigen',
    hide: 'Verbergen',
    keyHintBrowser: [
      'Erstelle einen Schlüssel auf ',
      '. Der Schlüssel bleibt nur in diesem Browser.',
    ],
    keyHintDevice: [
      'Erstelle einen Schlüssel auf ',
      '. Der Schlüssel wird verschlüsselt auf diesem Gerät gespeichert.',
    ],
    keyStepsTitle: 'Wie bekomme ich einen Schlüssel?',
    keySteps: {
      gemini: [
        'Öffne {site} und melde dich mit deinem Google-Konto an.',
        'Akzeptiere die Bedingungen (nur beim ersten Mal).',
        'Klicke auf „Create API key“; wähle bei Bedarf ein Projekt oder lass eines anlegen.',
        'Kopiere den Schlüssel (beginnt mit AIza) und füge ihn oben unter API-Schlüssel ein.',
        'Klicke auf „Verbindung testen“.',
      ],
      claude: [
        'Öffne {site} und erstelle ein Konto oder melde dich an.',
        'Kaufe Guthaben unter „Billing“ (Vorauszahlung); lege am besten auch eine Ausgabengrenze fest.',
        'Wähle bei den API-Schlüsseln „Create key“ und gib dem Schlüssel einen Namen.',
        'Kopiere den Schlüssel (beginnt mit sk-ant-) sofort: Er wird nur einmal angezeigt. Füge ihn oben unter API-Schlüssel ein.',
        'Klicke auf „Verbindung testen“.',
      ],
      factcheck: [
        'Öffne {site} und melde dich mit deinem Google-Konto an (keine Kreditkarte erforderlich).',
        'Wähle oben ein bestehendes Projekt oder klicke auf „New Project“ und nenne es z. B. WWJD.',
        'Öffne die Fact Check Tools API in der API Library (console.cloud.google.com/apis/library/factchecktools.googleapis.com) und klicke auf „Enable“.',
        'Gehe zu „Credentials“, klicke auf „+ Create Credentials“ → „API key“, kopiere den Schlüssel (beginnt mit AIza) und füge ihn oben ein.',
        'Klicke auf „Verbindung testen“.',
      ],
    },
    keyCost: {
      gemini:
        'Kostenlos, solange du keine Abrechnung (Billing) mit dem Google-Projekt verknüpfst. Rechne mit etwa 10 Analysen pro Minute und 200 pro Tag; Google kann das ändern, dein eigenes Limit siehst du in AI Studio. Jedes neue Video kostet einen Aufruf, ein schon analysiertes nichts.',
      claude:
        'Kostenpflichtig: Jede Analyse wird von deinem Guthaben abgezogen. Ohne Guthaben funktioniert der Schlüssel nicht.',
      factcheck:
        '100 % kostenlos (bis zu 10.000 Abfragen pro Tag, keine Kreditkarte nötig). Wird verwendet, um Behauptungen direkt bei anerkannten Faktencheck-Organisationen weltweit zu prüfen.',
    },
    keyModels: {
      gemini:
        'Kostenlos über AI Studio: die Flash- und Flash-Lite-Modelle (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Nicht kostenlos: die Pro-Modelle (gemini-pro-latest); sie funktionieren nur mit Abrechnung.',
      claude:
        'Alle Claude-Modelle sind kostenpflichtig; Haiku ist am günstigsten, Opus am teuersten.',
      factcheck:
        'Tipp: Wenn du dasselbe Google-Cloud-Projekt wie für deinen Gemini-Schlüssel verwendest, kannst du nach dem Aktivieren der Fact Check Tools API denselben AIza-Schlüssel nutzen.',
    },
    model: 'Modell',
    testConnection: 'Verbindung testen',
    busy: 'Bitte warten…',
    testOk: '✓ Die Verbindung funktioniert und das Modell existiert.',
    testOkFactcheck: '✓ Verbindung mit der Google Fact Check API funktioniert.',
    testOkShort: 'Verbindung funktioniert',
    testFailed: 'Verbindung fehlgeschlagen.',
    fillKeyFirst: 'Gib zuerst einen API-Schlüssel ein.',
    factcheckHeading: 'Faktencheck (Google Fact Check API)',
    factcheckToggle: 'Google Fact Check Tools API verwenden',
    factcheckHint:
      'Durchsucht blitzschnell bestehende offizielle Faktenchecks anerkannter Organisationen weltweit.',
    factcheckKeyLabel: 'API-Schlüssel Fact Check',
    factcheckKeyHintBrowser: [
      'Erstelle einen kostenlosen Schlüssel auf ',
      '. Der Schlüssel bleibt nur in diesem Browser.',
    ],
    factcheckKeyHintDevice: [
      'Erstelle einen kostenlosen Schlüssel auf ',
      '. Der Schlüssel wird verschlüsselt auf diesem Gerät gespeichert.',
    ],
    evalHeading: 'Analyse & Anzeige',
    displayHeading: 'Anzeige',
    activeLabel: 'Erweiterung auf YouTube aktiv',
    activeHint: 'Aus: Das WWJD-Panel auf YouTube ist deaktiviert.',
    autoLabel: 'Beim Öffnen eines Videos automatisch analysieren',
    autoHint: 'Aus: Klicke im Panel auf „Video analysieren“.',
    collapsedLabel: 'Begründung standardmäßig einklappen',
    collapsedHint: 'Zeige zuerst nur die Endnote (0–10) und das kurze Fazit.',
    tipLabel: 'Erklärung',
    cacheHeading: 'Cache',
    savedAnalyses: 'Gespeicherte Analysen',
    cacheText:
      'Jedes Video wird pro Sprache einmal analysiert; danach kommt die Analyse aus dem Cache.',
    clearCache: 'Cache leeren',
    clear: 'Löschen',
    cacheCount: (n) => (n === 1 ? '1 Analyse gespeichert' : `${n} Analysen gespeichert`),
    analysisCount: (n) => (n === 1 ? '1 Analyse' : `${n} Analysen`),
    confirmClear: 'Alle gespeicherten Analysen löschen?',
    advanced: 'Erweitert',
    debugHeading: 'Debug-Protokoll',
    debugCheck: 'Pro Aufruf Anbieter, Modell, Eingabelänge, Dauer und Tokens protokollieren',
    showLog: 'Protokoll anzeigen',
    clearLog: 'Protokoll löschen',
    logEmpty: 'Noch keine Aufrufe protokolliert.',
    logHead: [
      'Zeit',
      'Video',
      'Schritt',
      'Anbieter',
      'Modell',
      'Eingabe (Zeichen)',
      'Dauer',
      'Tokens ein/aus',
      'Fehler',
    ],
  },

  tips: {
    language:
      'Wähle die Sprache für die Benutzeroberfläche, die KI-Analyse und die Bibelverweise.',
    provider:
      'Welche KI das Video analysiert und anhand der 25 Richtlinien Jesu prüft. Gemini ist kostenlos nutzbar (mit Tageslimit); Claude bezahlst du pro Analyse.',
    apiKey:
      'Ein geheimer Code, mit dem WWJD den KI-Dienst in deinem Namen nutzt; etwaige Kosten gehen auf dein Konto. Der Schlüssel bleibt auf diesem Gerät und geht nur an diesen Dienst.',
    model:
      'Das KI-Modell, das die Analyse erstellt. Lass den Standard stehen, außer du möchtest ein anderes Modell ausprobieren; „Verbindung testen“ prüft, ob es existiert. Mit einem kostenlosen Gemini-Schlüssel funktionieren nur die Flash- und Flash-Lite-Modelle; Pro braucht eine Abrechnung.',
    factcheck:
      'Die Google Fact Check Tools API durchsucht blitzschnell Tausende bestehende Faktenchecks anerkannter Organisationen (wie Reuters, AP, PolitiFact). Gibt es keinen bestehenden Faktencheck für eine Aussage, führt die KI selbst eine historische Faktenanalyse durch.',
    factcheckKey:
      'Ein kostenloser API-Schlüssel aus der Google Cloud Console zum Aufrufen der Fact Check Tools API. Der Schlüssel bleibt auf diesem Gerät und geht nur an Google.',
    actief:
      'An: Das WWJD-Panel erscheint auf YouTube-Videoseiten. Aus: Die Erweiterung tut auf YouTube nichts.',
    auto: 'An: Jedes Video, das du öffnest, wird sofort analysiert; ein neues Video kostet einen KI-Aufruf. Aus: erst analysieren, wenn du auf „Video analysieren“ klickst.',
    collapsed:
      'An: Zeigt zuerst nur den Jesus-Wert (0–10) und das kurze Fazit; den vollständigen Faktencheck und die Bibelverweise klappst du bei Bedarf auf.',
    updates:
      'Sucht auf GitHub nach der neuesten Version von WWJD. Es werden keine Schlüssel oder anderen Daten gesendet.',
    cache:
      'Jede Analyse wird gespeichert, damit dasselbe Video erneut zu öffnen nichts kostet. Leeren entfernt alle gespeicherten Analysen; Schlüssel und Einstellungen bleiben.',
    debug:
      'Zur Fehlersuche: speichert pro KI-Aufruf, welches Modell verwendet wurde, wie lange es dauerte und wie viele Tokens es kostete. Dein Schlüssel ist nie enthalten.',
  },

  update: {
    heading: 'Updates',
    installed: (v) => `Installierte Version: ${v}`,
    check: 'Nach Updates suchen',
    checking: 'Wird geprüft…',
    upToDate: 'Du hast die neueste Version.',
    available: (v) => `Version ${v} ist verfügbar.`,
    none: 'Noch keine Version auf GitHub gefunden.',
    failed: (e) => `Prüfung fehlgeschlagen: ${e}`,
    whatsNew: 'Was ist neu?',
    download: (v) => `Version ${v} herunterladen`,
    extensionSteps: [
      'Lade die ZIP-Datei mit der neuen Version herunter.',
      'Entpacke sie in den Ordner von WWJD (Dateien ersetzen).',
      'Klicke auf „Neu laden“; diese Seite öffnet sich danach erneut.',
    ],
    reload: 'Neu laden',
    downloadInstall: 'Herunterladen und installieren',
    downloading: 'Wird heruntergeladen…',
    opening: 'Installation wird geöffnet…',
    installHint:
      'Beim ersten Mal bittet Android dich, Installationen über WWJD zu erlauben; tippe danach bei Bedarf noch einmal auf diese Schaltfläche. Schlüssel, Einstellungen und Analysen bleiben erhalten.',
    checksumFailed: 'Die heruntergeladene Datei stimmt nicht (SHA-256). Bitte versuche es erneut.',
    downloadFailed: (e) => `Herunterladen fehlgeschlagen: ${e}`,
  },

  extension: {
    actionTitle: 'WWJD – Einstellungen',
    disabledError: 'WWJD-Analyse ist in den Erweiterungseinstellungen deaktiviert.',
    noKeyError: (p) =>
      `Kein API-Schlüssel für ${p} gefunden. Bitte gib deinen Schlüssel in den WWJD-Einstellungen ein.`,
    noTranscriptError: (r) => `Für dieses Video konnte kein Transkript abgerufen werden (${r}).`,
    unknownError: 'Unbekannter Fehler bei der Analyse.',
  },

  app: {
    analysisTitle: 'Analyse',
    shareAction: 'Teilen → WWJD',
    back: 'Zurück',
    settings: 'Einstellungen',
    showPlayer: 'YouTube-Player anzeigen',
    hidePlayer: 'YouTube-Player ausblenden',
    pastePlaceholder: 'YouTube-Link einfügen',
    linkAria: 'YouTube-Link oder Video-ID',
    notRecognized: 'In diesem Link wurde kein YouTube-Video erkannt.',
    shareHint: ['Tippe in der YouTube-App auf ', '.'],
    analyzeButton: 'Analysieren',
    recent: 'Zuletzt',
    noAnalyses: 'Noch keine Analysen.',
    shareNoVideo: 'Im Geteilten wurde kein YouTube-Video gefunden.',
    cannotPlay: (c) => `Das Video kann hier nicht abgespielt werden (Fehler ${c}).`,
    openInYouTube: 'In YouTube öffnen',
    seekTitle: (t) => `Zu ${t} im Video`,
    playerOff: 'Der YouTube-Player ist aus.',
    showPlayerAndSeek: (t) => `Player zeigen und zu ${t} springen`,
    openInYouTubeAt: (t) => `In der YouTube-App bei ${t} öffnen`,
    openedInYouTube: (t) => `YouTube springt zu ${t}`,
    cancel: 'Abbrechen',
    noKeyError: 'Es ist noch kein API-Schlüssel eingestellt.',
  },
};
