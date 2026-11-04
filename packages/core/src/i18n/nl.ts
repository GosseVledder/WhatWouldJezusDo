import type { Messages } from './messages';

export const nl: Messages = {
  locale: 'nl-NL',
  languageNames: {
    nl: 'Nederlands',
    en: 'Engels',
    de: 'Duits',
    fr: 'Frans',
    es: 'Spaans',
    it: 'Italiaans',
    pt: 'Portugees',
  },

  view: {
    switchAria: 'WWJD aan of uit',
    turnOff: 'WWJD uitzetten',
    turnOn: 'WWJD aanzetten',
    showDetails: 'Toon onderbouwing ▼',
    hideDetails: 'Onderbouwing inklappen ▲',
    jesusAlignment: 'Jezus-overeenkomst',
    section1Title: '1. Factcheck & Integriteit (Activiteit 1)',
    summaryTitle: 'Samenvatting',
    checkedFacts: 'Gecontroleerde feiten',
    coreActivity: 'Kern van activiteit:',
    sentimentAndAttitude: 'Sentiment & houding:',
    subjectLabel: 'Onderwerp',
    presenterLabel: 'Presentator',
    presenterRole: 'Rol:',
    presenterConduct: 'Handelen:',
    presenterIsSubject: 'De presentator is zelf het onderwerp van de video.',
    speakers: {
      presenter: 'presentator',
      subject: 'onderwerp',
      other: 'overig',
    },
    contradictionAlert: 'Zelf-tegenspraak geconstateerd (= per definitie liegen):',
    statementLabel: 'Uitspraak:',
    factcheckLabel: 'Factcheck:',
    sourcesLabel: 'Bron(nen):',
    noSource: 'Geen externe bron gevonden: alleen door de AI gecontroleerd.',
    otherSources: 'Overige geraadpleegde bronnen:',
    verdicts: {
      bevestigd: 'bevestigd',
      ontkracht: 'ontkracht',
      tegenspraak: 'tegenspraak',
      gemengd_of_context: 'gemengd of context',
      opinie: 'opinie',
    },
    section2Title: (n) =>
      `2. Onderwerp: toetsing aan Jezus' Richtlijnen (${n} relevante punten meegewogen)`,
    section3Title: (n) =>
      `3. Presentator: toetsing aan Jezus' Richtlijnen (${n} relevante punten meegewogen)`,
    presenterScore: 'Presentator',
    subjectScore: 'Verhaal & feiten',
    linkedToMoment: 'Gekoppeld aan moment:',
    fromCache: (d) => `Uit cache · ${d}`,
    justAnalyzed: 'Zojuist geanalyseerd',
    off: 'WWJD staat uit: er worden geen analyses gemaakt.',
    analyzeVideo: 'Analyseer video',
    loadingStep: "Video factchecken en toetsen aan Jezus' richtlijnen en De Tien Geboden…",
    progressSteps: {
      transcript: 'Transcript ophalen',
      analyse: 'Feiten controleren, samenvatten en beoordelen',
      factcheck: 'Officiële factchecks opzoeken',
      reconcile: 'Scores bijwerken met de factchecks',
    },
    openSettings: 'Instellingen openen',
    retry: 'Opnieuw proberen',
    refresh: 'Opnieuw analyseren',
    verifiedVia: (pub, rating) => `[Geverifieerd via ${pub} (oordeel: "${rating}")]`,
  },

  settings: {
    title: 'Instellingen',
    loading: 'Laden…',
    autoSaved: 'Instellingen worden direct opgeslagen.',
    saved: 'Opgeslagen',
    languageHeading: 'Taal',
    languageLabel: 'Taal (interface, analyse & Bijbelverwijzingen)',
    languageHint:
      'Bepaalt de taal van de interface, de AI-analyse én de Bijbelbronnen waarnaar wordt verwezen.',
    aiService: 'AI-dienst',
    providerHint:
      'Het gebruik van What Would Jezus Do is volledig gratis: kies voor de LLM óf een gratis Gemini-sleutel, óf een betaalde Gemini-sleutel, óf een betaalde Claude-sleutel, én voor de feitencontrole een gratis Google Fact Check-sleutel.',
    apiKey: 'API-sleutel',
    apiKeyOf: (p) => `API-sleutel ${p}`,
    modelOf: (p) => `Model ${p}`,
    show: 'Toon',
    hide: 'Verberg',
    keyHintBrowser: ['Maak een sleutel aan op ', '. De sleutel blijft alleen in deze browser.'],
    keyHintDevice: ['Maak een sleutel aan op ', '. De sleutel staat versleuteld op dit toestel.'],
    keyStepsTitle: 'Hoe kom ik aan een sleutel?',
    keySteps: {
      gemini: [
        'Open {site} en log in met je Google-account.',
        'Accepteer de voorwaarden (alleen de eerste keer).',
        'Staat er al een sleutel? Dan is dat de jouwe. Zo niet, klik op "Create API key" (kies of importeer zo nodig een project).',
        'Kopieer de sleutel (begint met AIza of AQ.) en plak hem hierboven bij API-sleutel.',
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
        'Ga naar "Credentials", klik op "+ Create credentials" → "API key", kies bij "API restrictions" de "Fact Check Tools API" en klik op "Create". Kopieer de sleutel (begint met AIza) en plak hem hierboven.',
        'Klik op "Test verbinding".',
      ],
    },
    keyCost: {
      gemini:
        'Gratis zolang je geen facturering (billing) aan het Google-project koppelt. Google stelt een limiet per minuut en per dag in (de daglimiet begint om middernacht Pacific-tijd opnieuw); je eigen limieten zie je in AI Studio. Elke nieuwe video kost één aanroep, een eerder geanalyseerde video niets.',
      claude: 'Betaald: elke analyse gaat van je tegoed af. Zonder tegoed werkt de sleutel niet.',
      factcheck:
        'Gratis, geen creditcard nodig. Google stelt per project een gebruikslimiet in; die zie je op de pagina Quotas in Google Cloud. Wordt gebruikt om beweringen direct te verifiëren bij erkende factcheck-organisaties wereldwijd.',
    },
    keyModels: {
      gemini:
        'Gratis via AI Studio: de Flash- en Flash-Lite-modellen (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Niet gratis: de Pro-modellen (gemini-pro-latest); die werken alleen met facturering.',
      claude: 'Alle Claude-modellen zijn betaald; Haiku is het goedkoopst, Opus het duurst.',
      factcheck:
        'Gebruik een aparte sleutel: sleutels uit AI Studio werken alleen voor Gemini. Maak deze sleutel in Google Cloud, in een project waarin de Fact Check Tools API is ingeschakeld.',
    },
    model: 'Model',
    testConnection: 'Test verbinding',
    busy: 'Bezig…',
    factcheckHeading: 'Feitencontrole (Google Fact Check API)',
    factcheckToggle: 'Google Fact Check Tools API gebruiken',
    factcheckHint:
      'Doorzoekt razendsnel bestaande officiële factchecks van erkende organisaties wereldwijd.',
    factcheckKeyLabel: 'API-sleutel Fact Check',
    factcheckKeyHintBrowser: [
      'Maak een gratis sleutel aan op ',
      '. De sleutel blijft alleen in deze browser.',
    ],
    factcheckKeyHintDevice: [
      'Maak een gratis sleutel aan op ',
      '. De sleutel staat versleuteld op dit toestel.',
    ],
    evalHeading: 'Analyse & weergave',
    displayHeading: 'Weergave',
    activeLabel: 'Extensie actief op YouTube',
    activeHint: 'Uit: het WWJD-paneel op YouTube is uitgeschakeld.',
    autoLabel: 'Automatisch analyseren bij het openen van een video',
    autoHint: 'Uit: klik op "Analyseer video" in het paneel.',
    collapsedLabel: 'Onderbouwing standaard inklappen',
    collapsedHint: 'Toon eerst alleen de eindscore (0–10) en de korte conclusie.',
    liveLabel: 'Live meelezen',
    liveHint: 'Tijdens het afspelen licht het paneel op wat er gezegd wordt en scrolt ernaartoe.',
    overlayLabel: 'Overlay op video',
    overlayHint:
      'Toon bij elk gecontroleerd moment ook een klein kaartje als ondertitel op de video.',
    tipLabel: 'Uitleg',
    cacheHeading: 'Cache',
    savedAnalyses: 'Opgeslagen analyses',
    cacheText:
      'Elke video wordt één keer per taal geanalyseerd; daarna komt de analyse uit de cache.',
    clearCache: 'Cache wissen',
    clear: 'Wissen',
    cacheCount: (n) => (n === 1 ? '1 analyse opgeslagen' : `${n} analyses opgeslagen`),
    analysisCount: (n) => (n === 1 ? '1 analyse' : `${n} analyses`),
    confirmClear: 'Alle opgeslagen analyses wissen?',
    advanced: 'Geavanceerd',
    debugHeading: 'Debuglog',
    debugCheck: 'Per aanroep provider, model, invoerlengte, duur en tokens bijhouden',
    showLog: 'Log tonen',
    clearLog: 'Log wissen',
    logEmpty: 'Nog geen aanroepen gelogd.',
    logHead: [
      'Tijd',
      'Video',
      'Stap',
      'Provider',
      'Model',
      'Invoer (tekens)',
      'Duur',
      'Tokens in/uit',
      'Fout',
    ],
  },

  tips: {
    language:
      'Kies de taal voor de gebruikersinterface, de AI-analyse én de Bijbelverwijzingen (Nederlands gebruikt debijbel.nl NBV21; andere talen gebruiken de bijbehorende Bijbelvertaling).',
    provider:
      'Welke AI de video analyseert en toetst aan de 25 richtlijnen van Jezus. Gemini is gratis te gebruiken (met een daglimiet); Claude betaal je per analyse.',
    apiKey:
      'Een geheime code waarmee WWJD namens jou de AI-dienst gebruikt; eventuele kosten komen op jouw account. De sleutel blijft op dit apparaat en gaat alleen naar die dienst.',
    model:
      'Het AI-model dat de analyse maakt. Laat de standaard staan, tenzij je een ander model wilt proberen; "Test verbinding" controleert of het bestaat. Met een gratis Gemini-sleutel werken alleen de Flash- en Flash-Lite-modellen; Pro vraagt facturering.',
    factcheck:
      'De Google Fact Check Tools API doorzoekt razendsnel duizenden bestaande factchecks van erkende organisaties (zoals Reuters, AP, Nieuwscheckers, PolitiFact). Is er geen bestaande factcheck voor een uitspraak, dan voert de AI zelf een historische feitenanalyse uit.',
    factcheckKey:
      'Een gratis API-sleutel uit de Google Cloud Console waarmee de Fact Check Tools API wordt aangeroepen. De sleutel blijft op dit apparaat en gaat alleen naar Google.',
    actief:
      'Aan: het WWJD-paneel verschijnt op YouTube-videopagina’s. Uit: de extensie doet niets op YouTube.',
    auto: 'Aan: elke video die je opent wordt meteen geanalyseerd; een nieuwe video kost één AI-aanroep. Uit: pas analyseren wanneer je op "Analyseer video" klikt.',
    collapsed:
      'Aan: toont eerst alleen de Jezus-score (0–10) en de korte conclusie; de volledige factcheck en de bijbelverwijzingen klap je open wanneer je die wilt lezen.',
    live: 'Aan: elke factcheck en elk punt uit het onderwijs van Jezus licht op op het moment dat het in de video gezegd wordt, en het paneel scrolt ernaartoe. Scrol je zelf, dan wacht het een paar seconden.',
    overlay:
      'Aan: onderin de video verschijnt bij elk gecontroleerd moment een paar seconden een klein, onopvallend kaartje met het oordeel. Uit: alleen het paneel volgt de video.',
    updates:
      'Zoekt op GitHub naar de nieuwste versie van WWJD. Er gaan geen sleutels of andere gegevens mee.',
    cache:
      'Elke analyse wordt bewaard, zodat dezelfde video opnieuw openen niets kost. Wissen verwijdert alle bewaarde analyses; je sleutels en instellingen blijven staan.',
    debug:
      'Voor probleemoplossing: houdt per AI-aanroep bij welk model is gebruikt, hoe lang het duurde en hoeveel tokens het kostte. Je sleutel staat er nooit in.',
  },

  update: {
    heading: 'Updates',
    installed: (v) => `Geïnstalleerde versie: ${v}`,
    check: 'Controleren op updates',
    checking: 'Controleren…',
    upToDate: 'Je hebt de nieuwste versie.',
    available: (v) => `Versie ${v} is beschikbaar.`,
    none: 'Nog geen versie gevonden op GitHub.',
    failed: (e) => `Controleren mislukt: ${e}`,
    whatsNew: 'Wat is er nieuw?',
    download: (v) => `Versie ${v} downloaden`,
    extensionSteps: [
      'Download de zip met de nieuwe versie.',
      'Pak hem uit over de map van WWJD heen (bestanden vervangen).',
      'Klik op Herladen; deze pagina opent daarna opnieuw.',
    ],
    reload: 'Herladen',
    downloadInstall: 'Downloaden en installeren',
    downloading: 'Downloaden…',
    opening: 'Installatie wordt geopend…',
    installHint:
      'De eerste keer vraagt Android om installeren via WWJD toe te staan; tik daarna zo nodig nog een keer op deze knop. Je sleutels, instellingen en analyses blijven bewaard.',
    checksumFailed: 'Het gedownloade bestand klopt niet (SHA-256). Probeer het opnieuw.',
    downloadFailed: (e) => `Downloaden mislukt: ${e}`,
  },

  extension: {
    actionTitle: 'WWJD – instellingen',
    disabledError: 'WWJD analyse is uitgeschakeld in de extensie-instellingen.',
    noKeyError: (p) =>
      `Geen API-sleutel gevonden voor ${p}. Vul je sleutel in via de WWJD-instellingen.`,
    noTranscriptError: (r) => `Kon geen transcript ophalen voor deze video (${r}).`,
    unknownError: 'Onbekende fout bij evaluatie.',
  },

  app: {
    analysisTitle: 'Analyse',
    shareAction: 'Delen → WWJD',
    back: 'Terug',
    settings: 'Instellingen',
    showPlayer: 'YouTube-player tonen',
    hidePlayer: 'YouTube-player verbergen',
    pastePlaceholder: 'Plak een YouTube-link',
    linkAria: 'YouTube-link of video-ID',
    notRecognized: 'Geen YouTube-video herkend in deze link.',
    shareHint: ['Tik in de YouTube-app op ', '.'],
    analyzeButton: 'Analyseer',
    recent: 'Recent',
    noAnalyses: 'Nog geen analyses.',
    deleteAnalysis: 'Analyse verwijderen',
    shareNoVideo: 'Geen YouTube-video gevonden in wat je deelde.',
    cannotPlay: (c) => `De video kan hier niet worden afgespeeld (fout ${c}).`,
    openInYouTube: 'Open in YouTube',
    seekTitle: (t) => `Naar ${t} in de video`,
    playerOff: 'De YouTube-player staat uit.',
    showPlayerAndSeek: (t) => `Toon player en spring naar ${t}`,
    openInYouTubeAt: (t) => `Open in de YouTube-app op ${t}`,
    openedInYouTube: (t) => `YouTube springt naar ${t}`,
    cancel: 'Annuleren',
  },
  onboarding: {
    title: 'Welkom bij What Would Jezus Do',
    intro: 'Twee gratis sleutels van Google en je kunt beginnen. Het kost ongeveer 3 minuten.',
    geminiTitle: '1. Gemini-sleutel',
    geminiText:
      'Gemini is de AI die de feiten controleert en de video naast het onderwijs van Jezus legt. De sleutel is gratis.',
    geminiButton: 'Gemini-sleutel maken',
    factcheckTitle: '2. Fact Check-sleutel',
    factcheckText:
      'Zoekt officiële factchecks op van organisaties zoals Reuters en AP. Ook deze sleutel is gratis.',
    factcheckButton: 'Fact Check-sleutel maken',
    steps: {
      gemini: [
        'Klik op de knop hierboven, log in met je Google-account en accepteer de voorwaarden als Google daarom vraagt.',
        'Staat er al een sleutel? Dan is dat de jouwe. Zo niet, klik op "Create API key" (kies of importeer een project als Google daarom vraagt).',
        'Kopieer de sleutel met het kopieericoontje ernaast.',
        'Kom terug naar deze pagina en plak de sleutel hieronder.',
      ],
      factcheck: [
        'Klik op de knop hierboven en log in met hetzelfde Google-account.',
        'Kies bovenaan een project (dat van kaart 1 is prima) en klik op "Enable".',
        'Open "Credentials" en klik op "+ Create credentials" → "API key".',
        'Google vraagt om een API-beperking: kies bij "API restrictions" de "Fact Check Tools API", klik op "Create" en kopieer de sleutel.',
        'Kom terug naar deze pagina en plak de sleutel hieronder.',
      ],
    },
    showMe: 'Laat zien waar ik moet klikken',
    pasteLabel: 'Plak de sleutel hier',
    checking: 'Sleutel controleren…',
    works: 'Werkt',
    retry: 'Opnieuw controleren',
    problems: {
      empty: 'Plak eerst een sleutel.',
      wrong_key: 'Deze sleutel klopt niet. Kopieer hem opnieuw, helemaal en zonder spaties.',
      wrong_api:
        'Deze sleutel hoort bij een andere Google-dienst. Maak een nieuwe sleutel met de knop op deze kaart.',
      restricted:
        'Deze sleutel is beperkt tot andere websites of apps. Maak een nieuwe sleutel zonder die beperking.',
      api_not_enabled:
        'De sleutel klopt, maar deze dienst staat nog niet aan in je Google-project.',
      quota:
        'Deze sleutel heeft zijn limiet voorlopig bereikt. Wacht een minuut en probeer het opnieuw, of morgen.',
      offline: 'Geen internetverbinding. Controleer je verbinding en probeer het opnieuw.',
      model:
        'Het gekozen AI-model is niet beschikbaar voor deze sleutel. Houd in Instellingen het standaardmodel aan.',
      unknown: 'Er ging iets mis bij het controleren van de sleutel. Probeer het zo opnieuw.',
    },
    enableButton: 'Zet hem aan (één klik)',
    doneButton: 'Klaar, open een YouTube-video',
    doneButtonApp: 'Klaar, analyseer een video',
    doneWaiting: 'Beide sleutels hebben eerst een groen vinkje nodig.',
    privacy: 'Je sleutels blijven op dit apparaat en gaan alleen naar Google.',
    setupNotFinished: 'Installatie nog niet af',
    setupMissing: (p) =>
      `Voeg je ${p}-sleutel en je Fact Check-sleutel toe om video's te analyseren.`,
    setupMissingAi: (p) => `Voeg je ${p}-sleutel toe om video's te analyseren.`,
    setupMissingFactcheck:
      'Voeg je Fact Check-sleutel toe, dan worden beweringen ook getoetst aan officiële factchecks.',
    finishSetup: 'Installatie afmaken',
    setupGuide: 'Installatiehulp',
    otherAi: 'Liever Claude? Die kun je later kiezen in Instellingen.',
  },

  errors: {
    auth: (p) =>
      `De ${p}-API-sleutel is ongeldig of heeft geen toegang. Controleer de sleutel bij Instellingen.`,
    quota: (p) =>
      `Het quotum of tegoed van ${p} is op. Probeer het later opnieuw of controleer je account.`,
    rate_limit: (p) =>
      `${p} is druk of de limiet per minuut is bereikt. Wacht een minuut en probeer het opnieuw.`,
    bad_request: (p) => `${p} weigerde het verzoek.`,
    model_not_found: (p) =>
      `Het ${p}-model dat bij Instellingen staat, bestaat niet. Kies een ander model.`,
    video_unavailable: (p) => `${p} kan deze video niet openen (alleen openbare video's).`,
    refusal: (p) => `${p} weigerde deze video te analyseren.`,
    truncated: (p) => `Het antwoord van ${p} werd afgekapt. Probeer het opnieuw.`,
    network: () =>
      'Geen verbinding met de AI-dienst. Controleer je internetverbinding en probeer het opnieuw.',
    timeout: () => 'De AI-dienst antwoordde niet op tijd. Probeer het opnieuw.',
    aborted: () => 'De analyse is gestopt.',
    parse: () => 'Het antwoord van de AI kon niet worden gelezen. Probeer het opnieuw.',
    server: (p) => `${p} had een serverprobleem. Probeer het later opnieuw.`,
    unknown: () => 'Onbekende fout bij evaluatie.',
  },
};
