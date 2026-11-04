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
    summaryTitle: 'Zusammenfassung',
    checkedFacts: 'Geprüfte Fakten',
    coreActivity: 'Kern der Aktivität:',
    sentimentAndAttitude: 'Stimmung & Haltung:',
    subjectLabel: 'Thema',
    presenterLabel: 'Moderator',
    presenterRole: 'Rolle:',
    presenterConduct: 'Handeln:',
    presenterIsSubject: 'Der Moderator ist selbst das Thema des Videos.',
    speakers: {
      presenter: 'Moderator',
      subject: 'Thema',
      other: 'Sonstige',
    },
    contradictionAlert: 'Selbstwiderspruch festgestellt (= per Definition Lüge):',
    statementLabel: 'Aussage:',
    factcheckLabel: 'Faktencheck:',
    sourcesLabel: 'Quelle(n):',
    noSource: 'Keine externe Quelle gefunden: nur von der KI geprüft.',
    otherSources: 'Weitere herangezogene Quellen:',
    verdicts: {
      bevestigd: 'bestätigt',
      ontkracht: 'widerlegt',
      tegenspraak: 'Widerspruch',
      gemengd_of_context: 'gemischt / Kontext',
      opinie: 'Meinung',
    },
    section2Title: (n) =>
      `2. Thema: Prüfung nach Jesu Richtlinien (${n} relevante Punkte gewichtet)`,
    section3Title: (n) =>
      `3. Moderator: Prüfung nach Jesu Richtlinien (${n} relevante Punkte gewichtet)`,
    presenterScore: 'Moderator',
    subjectScore: 'Geschichte & Fakten',
    linkedToMoment: 'Verknüpft mit Moment:',
    fromCache: (d) => `Aus dem Cache · ${d}`,
    justAnalyzed: 'Gerade analysiert',
    off: 'WWJD ist aus: Es werden keine Analysen erstellt.',
    analyzeVideo: 'Video analysieren',
    loadingStep:
      'Video wird faktengeprüft und nach Jesu Richtlinien und den Zehn Geboten bewertet…',
    progressSteps: {
      transcript: 'Transkript abrufen',
      analyse: 'Fakten prüfen, zusammenfassen und bewerten',
      factcheck: 'Offizielle Faktenchecks nachschlagen',
      reconcile: 'Bewertung mit den Faktenchecks aktualisieren',
    },
    openSettings: 'Einstellungen öffnen',
    retry: 'Erneut versuchen',
    refresh: 'Erneut analysieren',
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
      'Die Nutzung von What Would Jezus Do ist völlig kostenlos: Wähle für das LLM entweder einen kostenlosen Gemini-Schlüssel, einen kostenpflichtigen Gemini-Schlüssel oder einen kostenpflichtigen Claude-Schlüssel, und für den Faktencheck einen kostenlosen Google-Fact-Check-Schlüssel.',
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
        'Steht schon ein Schlüssel da? Das ist deiner. Sonst klicke auf „Create API key“ (wähle oder importiere bei Bedarf ein Projekt).',
        'Kopiere den Schlüssel (beginnt mit AIza oder AQ.) und füge ihn oben unter API-Schlüssel ein.',
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
        'Gehe zu „Credentials“, klicke auf „+ Create credentials“ → „API key“, wähle unter „API restrictions“ die „Fact Check Tools API“ und klicke auf „Create“. Kopiere den Schlüssel (beginnt mit AIza) und füge ihn oben ein.',
        'Klicke auf „Verbindung testen“.',
      ],
    },
    keyCost: {
      gemini:
        'Kostenlos, solange du keine Abrechnung (Billing) mit dem Google-Projekt verknüpfst. Google legt ein Limit pro Minute und pro Tag fest (das Tageslimit beginnt um Mitternacht pazifischer Zeit neu); deine eigenen Limits siehst du in AI Studio. Jedes neue Video kostet einen Aufruf, ein schon analysiertes nichts.',
      claude:
        'Kostenpflichtig: Jede Analyse wird von deinem Guthaben abgezogen. Ohne Guthaben funktioniert der Schlüssel nicht.',
      factcheck:
        'Kostenlos, keine Kreditkarte nötig. Google legt pro Projekt ein Nutzungslimit fest; du siehst es auf der Seite „Quotas“ in Google Cloud. Wird verwendet, um Behauptungen direkt bei anerkannten Faktencheck-Organisationen weltweit zu prüfen.',
    },
    keyModels: {
      gemini:
        'Kostenlos über AI Studio: die Flash- und Flash-Lite-Modelle (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Nicht kostenlos: die Pro-Modelle (gemini-pro-latest); sie funktionieren nur mit Abrechnung.',
      claude:
        'Alle Claude-Modelle sind kostenpflichtig; Haiku ist am günstigsten, Opus am teuersten.',
      factcheck:
        'Verwende einen eigenen Schlüssel: Schlüssel aus AI Studio funktionieren nur für Gemini. Erstelle diesen Schlüssel in Google Cloud, in einem Projekt, in dem die Fact Check Tools API aktiviert ist.',
    },
    model: 'Modell',
    testConnection: 'Verbindung testen',
    busy: 'Bitte warten…',
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
    liveLabel: 'Synchroner Live-Modus',
    liveHint: 'Während das Video läuft, hebt das Panel das Gesagte hervor und scrollt dorthin.',
    overlayLabel: 'Overlay auf dem Video',
    overlayHint:
      'Zeigt bei jedem geprüften Moment zusätzlich eine kleine Karte wie einen Untertitel auf dem Video.',
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
    language: 'Wähle die Sprache für die Benutzeroberfläche, die KI-Analyse und die Bibelverweise.',
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
    live: 'An: Jeder Faktencheck und jeder Hinweis aus der Lehre Jesu leuchtet in dem Moment auf, in dem er im Video gesagt wird, und das Panel scrollt dorthin. Scrollst du selbst, wartet es ein paar Sekunden.',
    overlay:
      'An: Unten im Video erscheint bei jedem geprüften Moment für ein paar Sekunden eine kleine, unauffällige Karte mit dem Urteil. Aus: Nur das Panel folgt dem Video.',
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
    deleteAnalysis: 'Analyse löschen',
    shareNoVideo: 'Im Geteilten wurde kein YouTube-Video gefunden.',
    cannotPlay: (c) => `Das Video kann hier nicht abgespielt werden (Fehler ${c}).`,
    openInYouTube: 'In YouTube öffnen',
    seekTitle: (t) => `Zu ${t} im Video`,
    playerOff: 'Der YouTube-Player ist aus.',
    showPlayerAndSeek: (t) => `Player zeigen und zu ${t} springen`,
    openInYouTubeAt: (t) => `In der YouTube-App bei ${t} öffnen`,
    openedInYouTube: (t) => `YouTube springt zu ${t}`,
    cancel: 'Abbrechen',
  },
  onboarding: {
    title: 'Willkommen bei What Would Jezus Do',
    intro: 'Zwei kostenlose Schlüssel von Google und es kann losgehen. Das dauert etwa 3 Minuten.',
    geminiTitle: '1. Gemini-Schlüssel',
    geminiText:
      'Gemini ist die KI, die die Fakten prüft und das Video mit der Lehre Jesu vergleicht. Der Schlüssel ist kostenlos.',
    geminiButton: 'Gemini-Schlüssel erstellen',
    factcheckTitle: '2. Fact-Check-Schlüssel',
    factcheckText:
      'Sucht offizielle Faktenchecks von Organisationen wie Reuters und AP. Auch dieser Schlüssel ist kostenlos.',
    factcheckButton: 'Fact-Check-Schlüssel erstellen',
    steps: {
      gemini: [
        'Klicke oben auf die Schaltfläche, melde dich mit deinem Google-Konto an und akzeptiere die Bedingungen, wenn Google danach fragt.',
        'Steht schon ein Schlüssel da? Das ist deiner. Sonst klicke auf „Create API key“ (wähle oder importiere ein Projekt, wenn Google fragt).',
        'Kopiere den Schlüssel mit dem Kopiersymbol daneben.',
        'Komm hierher zurück und füge den Schlüssel unten ein.',
      ],
      factcheck: [
        'Klicke oben auf die Schaltfläche und melde dich mit demselben Google-Konto an.',
        'Wähle oben ein Projekt (das aus Karte 1 passt) und klicke auf „Enable“.',
        'Öffne „Credentials“ und klicke auf „+ Create credentials“ → „API key“.',
        'Google verlangt eine API-Einschränkung: Wähle unter „API restrictions“ die „Fact Check Tools API“, klicke auf „Create“ und kopiere den Schlüssel.',
        'Komm hierher zurück und füge den Schlüssel unten ein.',
      ],
    },
    showMe: 'Zeig mir, wo ich klicken muss',
    pasteLabel: 'Schlüssel hier einfügen',
    checking: 'Schlüssel wird geprüft…',
    works: 'Funktioniert',
    retry: 'Erneut prüfen',
    problems: {
      empty: 'Füge zuerst einen Schlüssel ein.',
      wrong_key:
        'Dieser Schlüssel stimmt nicht. Kopiere ihn erneut, vollständig und ohne Leerzeichen.',
      wrong_api:
        'Dieser Schlüssel gehört zu einem anderen Google-Dienst. Erstelle mit der Schaltfläche auf dieser Karte einen neuen.',
      restricted:
        'Dieser Schlüssel ist auf andere Websites oder Apps beschränkt. Erstelle einen neuen ohne diese Beschränkung.',
      api_not_enabled:
        'Der Schlüssel stimmt, aber dieser Dienst ist in deinem Google-Projekt noch nicht eingeschaltet.',
      quota:
        'Dieser Schlüssel hat sein Limit vorerst erreicht. Warte eine Minute und versuche es erneut, oder morgen.',
      offline: 'Keine Internetverbindung. Prüfe deine Verbindung und versuche es erneut.',
      model:
        'Das gewählte KI-Modell ist für diesen Schlüssel nicht verfügbar. Behalte in den Einstellungen das Standardmodell.',
      unknown:
        'Beim Prüfen des Schlüssels ist etwas schiefgelaufen. Versuche es gleich noch einmal.',
    },
    enableButton: 'Einschalten (ein Klick)',
    doneButton: 'Fertig, YouTube-Video öffnen',
    doneButtonApp: 'Fertig, Video analysieren',
    doneWaiting: 'Beide Schlüssel brauchen zuerst ein grünes Häkchen.',
    privacy: 'Deine Schlüssel bleiben auf diesem Gerät und gehen nur an Google.',
    setupNotFinished: 'Einrichtung nicht abgeschlossen',
    setupMissing: (p) =>
      `Füge deinen ${p}-Schlüssel und deinen Fact-Check-Schlüssel hinzu, um Videos zu analysieren.`,
    setupMissingAi: (p) => `Füge deinen ${p}-Schlüssel hinzu, um Videos zu analysieren.`,
    setupMissingFactcheck:
      'Füge deinen Fact-Check-Schlüssel hinzu, damit Aussagen auch mit offiziellen Faktenchecks abgeglichen werden.',
    finishSetup: 'Einrichtung abschließen',
    setupGuide: 'Einrichtungshilfe',
    otherAi: 'Lieber Claude? Das kannst du später in den Einstellungen wählen.',
  },

  errors: {
    auth: (p) =>
      `Der ${p}-API-Schlüssel ist ungültig oder hat keinen Zugriff. Prüfe den Schlüssel in den Einstellungen.`,
    quota: (p) =>
      `Das Kontingent oder Guthaben von ${p} ist aufgebraucht. Versuche es später erneut oder prüfe dein Konto.`,
    rate_limit: (p) =>
      `${p} ist ausgelastet oder das Limit pro Minute ist erreicht. Warte eine Minute und versuche es erneut.`,
    bad_request: (p) => `${p} hat die Anfrage abgelehnt.`,
    model_not_found: (p) =>
      `Das in den Einstellungen gewählte ${p}-Modell existiert nicht. Wähle ein anderes Modell.`,
    video_unavailable: (p) => `${p} kann dieses Video nicht öffnen (nur öffentliche Videos).`,
    refusal: (p) => `${p} hat die Analyse dieses Videos abgelehnt.`,
    truncated: (p) => `Die Antwort von ${p} wurde abgeschnitten. Versuche es erneut.`,
    network: () =>
      'Keine Verbindung zum KI-Dienst. Prüfe deine Internetverbindung und versuche es erneut.',
    timeout: () => 'Der KI-Dienst hat nicht rechtzeitig geantwortet. Versuche es erneut.',
    aborted: () => 'Die Analyse wurde abgebrochen.',
    parse: () => 'Die Antwort der KI konnte nicht gelesen werden. Versuche es erneut.',
    server: (p) => `${p} hatte ein Serverproblem. Versuche es später erneut.`,
    unknown: () => 'Unbekannter Fehler bei der Analyse.',
  },
};
