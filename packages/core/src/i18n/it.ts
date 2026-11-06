import type { Messages } from './messages';

export const it: Messages = {
  locale: 'it-IT',
  languageNames: {
    nl: 'olandese',
    en: 'inglese',
    de: 'tedesco',
    fr: 'francese',
    es: 'spagnolo',
    it: 'italiano',
    pt: 'portoghese',
  },

  view: {
    switchAria: 'Attiva o disattiva WWJD',
    turnOff: 'Disattiva WWJD',
    turnOn: 'Attiva WWJD',
    showDetails: 'Mostra motivazione ▼',
    hideDetails: 'Nascondi motivazione ▲',
    jesusAlignment: 'Sintonia con Gesù',
    section1Title: '1. Fact-check e Integrità (Attività 1)',
    summaryTitle: 'Riepilogo',
    checkedFacts: 'Fatti verificati',
    coreActivity: "Nucleo dell'attività:",
    sentimentAndAttitude: 'Sentimento e atteggiamento:',
    subjectLabel: 'Soggetto',
    presenterLabel: 'Presentatore',
    presenterRole: 'Ruolo:',
    presenterConduct: 'Condotta:',
    presenterIsSubject: 'Il presentatore è egli stesso il soggetto del video.',
    speakers: {
      presenter: 'presentatore',
      subject: 'soggetto',
      other: 'altro',
    },
    contradictionAlert: 'Autocontraddizione rilevata (= mentire per definizione):',
    statementLabel: 'Affermazione:',
    factcheckLabel: 'Fact-check:',
    sourcesLabel: 'Fonte/i:',
    noSource: 'Nessuna fonte esterna trovata: verificato solo dall’IA.',
    otherSources: 'Altre fonti consultate:',
    verdicts: {
      bevestigd: 'confermato',
      ontkracht: 'smentito',
      tegenspraak: 'contraddizione',
      gemengd_of_context: 'misto / contesto',
      opinie: 'opinione',
    },
    section2Title: (n) =>
      `2. Racconto e fatti: valutazione secondo gli insegnamenti di Gesù (${n} punti rilevanti valutati)`,
    section3Title: (n) =>
      `3. Presentatore: valutazione secondo gli insegnamenti di Gesù (${n} punti rilevanti valutati)`,
    presenterScore: 'Presentatore',
    subjectScore: 'Racconto e fatti',
    aspectAll: 'Tutto',
    aspectFilterAria: 'Filtra la motivazione',
    linkedToMoment: 'Collegato al momento:',
    fromCache: (d) => `Dalla cache · ${d}`,
    justAnalyzed: 'Appena analizzato',
    off: 'WWJD è disattivato: non vengono effettuate analisi.',
    analyzeVideo: 'Analizza video',
    loadingStep:
      'Verifica dei fatti e valutazione del video secondo gli insegnamenti di Gesù e i Dieci Comandamenti…',
    progressSteps: {
      transcript: 'Recupero della trascrizione',
      analyse: 'Verifica dei fatti, riepilogo e valutazione',
      factcheck: 'Ricerca di verifiche ufficiali',
      reconcile: 'Aggiornamento dei punteggi con le verifiche',
    },
    usuallyTakes: (d) => `di solito ~${d}`,
    openSettings: 'Apri impostazioni',
    retry: 'Riprova',
    refresh: 'Rianalizza',
    verifiedVia: (pub, rating) => `[Verificato tramite ${pub} (giudizio: «${rating}»)]`,
  },

  settings: {
    title: 'Impostazioni',
    loading: 'Caricamento…',
    autoSaved: 'Le impostazioni vengono salvate subito.',
    saved: 'Salvato',
    languageHeading: 'Lingua',
    languageLabel: 'Lingua (interfaccia, analisi e riferimenti biblici)',
    languageHint:
      "Imposta la lingua dell'interfaccia, dell'analisi IA e dei testi biblici collegati.",
    aiService: 'Servizio di IA',
    providerHint:
      "L'uso di What Would Jezus Do è completamente gratuito: scegli per l'LLM o una chiave Gemini gratuita, o una chiave Gemini a pagamento, o una chiave Claude a pagamento, e per il fact-check una chiave Google Fact Check gratuita.",
    apiKey: 'Chiave API',
    apiKeyOf: (p) => `Chiave API ${p}`,
    modelOf: (p) => `Modello ${p}`,
    show: 'Mostra',
    hide: 'Nascondi',
    keyHintBrowser: ['Crea una chiave su ', '. La chiave resta solo in questo browser.'],
    keyHintDevice: ['Crea una chiave su ', '. La chiave è salvata cifrata su questo dispositivo.'],
    keyStepsTitle: 'Come ottengo una chiave?',
    keySteps: {
      gemini: [
        'Apri {site} e accedi con il tuo account Google.',
        'Accetta i termini (solo la prima volta).',
        "C'è già una chiave? È la tua. Altrimenti fai clic su «Create API key» (scegli o importa un progetto se richiesto).",
        'Copia la chiave (inizia con AIza o AQ.) e incollala sopra in Chiave API.',
        'Fai clic su «Prova connessione».',
      ],
      claude: [
        'Apri {site} e crea un account o accedi.',
        'Acquista credito in «Billing» (prepagato); è consigliabile impostare anche un tetto di spesa.',
        'Scegli «Create key» tra le chiavi API e dai un nome alla chiave.',
        'Copia subito la chiave (inizia con sk-ant-): viene mostrata una sola volta. Incollala sopra in Chiave API.',
        'Fai clic su «Prova connessione».',
      ],
      factcheck: [
        'Apri {site} e accedi con il tuo account Google (nessuna carta di credito richiesta).',
        'Scegli in alto un progetto esistente o fai clic su «New Project» e chiamalo ad es. WWJD.',
        'Apri la Fact Check Tools API nella libreria API (console.cloud.google.com/apis/library/factchecktools.googleapis.com) e fai clic su «Enable».',
        'Vai su «Credentials», fai clic su «+ Create credentials» → «API key», seleziona «Fact Check Tools API» in «API restrictions» e fai clic su «Create». Copia la chiave (inizia con AIza) e incollala sopra.',
        'Fai clic su «Prova connessione».',
      ],
    },
    keyCost: {
      gemini:
        'Gratuito finché non colleghi la fatturazione (billing) al progetto Google. Google fissa un limite al minuto e al giorno (il limite giornaliero riparte a mezzanotte, ora del Pacifico); AI Studio mostra i tuoi limiti. Ogni nuovo video costa una chiamata, un video già analizzato non costa nulla.',
      claude:
        'A pagamento: ogni analisi viene scalata dal tuo credito. Senza credito la chiave non funziona.',
      factcheck:
        'Gratuito, nessuna carta di credito. Google fissa un limite di utilizzo per progetto; lo vedi nella pagina «Quotas» di Google Cloud. Serve a verificare le affermazioni direttamente presso organizzazioni di fact-checking riconosciute in tutto il mondo.',
    },
    keyModels: {
      gemini:
        'Gratis tramite AI Studio: i modelli Flash e Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). A pagamento: i modelli Pro (gemini-pro-latest); funzionano solo con la fatturazione.',
      claude:
        'Tutti i modelli Claude sono a pagamento; Haiku è il più economico, Opus il più caro.',
      factcheck:
        'Usa una chiave separata: le chiavi di AI Studio funzionano solo con Gemini. Crea questa chiave in Google Cloud, in un progetto in cui la Fact Check Tools API è abilitata.',
    },
    model: 'Modello',
    testConnection: 'Prova connessione',
    busy: 'Un momento…',
    factcheckHeading: 'Verifica dei fatti (Google Fact Check API)',
    factcheckToggle: 'Usa Google Fact Check Tools API',
    factcheckHint:
      'Cerca rapidamente tra i fact-check ufficiali esistenti di organizzazioni riconosciute in tutto il mondo.',
    factcheckKeyLabel: 'Chiave API Fact Check',
    factcheckKeyHintBrowser: [
      'Crea una chiave gratuita su ',
      '. La chiave resta solo in questo browser.',
    ],
    factcheckKeyHintDevice: [
      'Crea una chiave gratuita su ',
      '. La chiave è salvata cifrata su questo dispositivo.',
    ],
    evalHeading: 'Analisi e visualizzazione',
    displayHeading: 'Visualizzazione',
    activeLabel: 'Estensione attiva su YouTube',
    activeHint: 'Disattivato: il pannello WWJD su YouTube è disattivato.',
    autoLabel: 'Analizza automaticamente all’apertura di un video',
    autoHint: 'Disattivato: fai clic su «Analizza video» nel pannello.',
    collapsedLabel: 'Comprimi la motivazione per impostazione predefinita',
    collapsedHint: 'Mostra prima solo il punteggio finale (0–10) e la conclusione breve.',
    liveLabel: 'Modalità live sincronizzata',
    liveHint: 'Durante la riproduzione, il pannello evidenzia ciò che viene detto e vi scorre.',
    overlayLabel: 'Sovrapposizione sul video',
    overlayHint:
      'Mostra anche una piccola scheda simile a un sottotitolo sul video a ogni momento verificato.',
    tipLabel: 'Spiegazione',
    cacheHeading: 'Cache',
    savedAnalyses: 'Analisi salvate',
    cacheText:
      'Ogni video viene analizzato una sola volta per lingua; poi l’analisi arriva dalla cache.',
    clearCache: 'Svuota cache',
    clear: 'Cancella',
    cacheCount: (n) => (n === 1 ? '1 analisi salvata' : `${n} analisi salvate`),
    analysisCount: (n) => (n === 1 ? '1 analisi' : `${n} analisi`),
    confirmClear: 'Eliminare tutte le analisi salvate?',
    advanced: 'Avanzate',
    debugHeading: 'Registro di debug',
    debugCheck: 'Registra per ogni chiamata fornitore, modello, lunghezza, durata e token',
    showLog: 'Mostra registro',
    clearLog: 'Cancella registro',
    logEmpty: 'Nessuna chiamata registrata finora.',
    logHead: [
      'Ora',
      'Video',
      'Passo',
      'Fornitore',
      'Modello',
      'Input (caratteri)',
      'Durata',
      'Token in/out',
      'Errore',
    ],
  },

  tips: {
    language: "Scegli la lingua per l'interfaccia, l'analisi IA e i riferimenti biblici.",
    provider:
      'Quale IA analizza il video e lo valuta secondo i 25 insegnamenti di Gesù. Gemini si può usare gratis (con un limite giornaliero); Claude si paga per analisi.',
    apiKey:
      'Un codice segreto con cui WWJD usa il servizio di IA per conto tuo; gli eventuali costi vanno sul tuo account. La chiave resta su questo dispositivo e viene inviata solo a quel servizio.',
    model:
      'Il modello di IA che esegue l’analisi. Lascia quello predefinito, a meno che tu non voglia provarne un altro; «Prova connessione» verifica che esista. Con una chiave Gemini gratuita funzionano solo i modelli Flash e Flash-Lite; Pro richiede la fatturazione.',
    factcheck:
      'La Google Fact Check Tools API cerca rapidamente tra migliaia di verifiche di organizzazioni riconosciute (come Reuters, AP, PolitiFact). Se non c’è un fact-check esistente per un’affermazione, l’IA esegue da sé un’analisi storica dei fatti.',
    factcheckKey:
      'Una chiave API gratuita dalla Google Cloud Console per chiamare la Fact Check Tools API. La chiave resta su questo dispositivo e viene inviata solo a Google.',
    actief:
      'Attivo: il pannello WWJD appare sulle pagine video di YouTube. Disattivo: l’estensione non fa nulla su YouTube.',
    auto: "Attivo: ogni video che apri viene analizzato subito; un nuovo video costa una chiamata all'IA. Disattivo: solo quando fai clic su «Analizza video».",
    collapsed:
      'Attivo: mostra prima solo il punteggio di Gesù (0–10) e la conclusione breve; espandi il fact-check completo e i riferimenti biblici quando vuoi leggerli.',
    live: 'Attivo: ogni verifica e ogni punto dell’insegnamento di Gesù si illumina nel momento in cui viene detto nel video e il pannello vi scorre. Se scorri tu, attende qualche secondo.',
    overlay:
      'Attivo: in basso nel video compare per qualche secondo una piccola scheda discreta con il giudizio a ogni momento verificato. Disattivo: solo il pannello segue il video.',
    updates: "Cerca su GitHub l'ultima versione di WWJD. Non vengono inviate chiavi né altri dati.",
    cache:
      'Ogni analisi viene conservata, così riaprire lo stesso video non costa nulla. Svuota rimuove tutte le analisi salvate; chiavi e impostazioni restano.',
    debug:
      "Per la risoluzione dei problemi: registra per ogni chiamata all'IA quale modello è stato usato, quanto è durata e quanti token è costata. La chiave non è mai inclusa.",
  },

  update: {
    heading: 'Aggiornamenti',
    installed: (v) => `Versione installata: ${v}`,
    check: 'Controlla aggiornamenti',
    checking: 'Controllo in corso…',
    upToDate: "Hai l'ultima versione.",
    available: (v) => `È disponibile la versione ${v}.`,
    none: 'Nessuna versione trovata su GitHub per ora.',
    failed: (e) => `Controllo non riuscito: ${e}`,
    whatsNew: 'Novità',
    download: (v) => `Scarica la versione ${v}`,
    extensionSteps: [
      'Scarica lo zip con la nuova versione.',
      'Estrailo nella cartella di WWJD (sostituisci i file).',
      'Fai clic su Ricarica; questa pagina si riapre subito dopo.',
    ],
    reload: 'Ricarica',
    downloadInstall: 'Scarica e installa',
    downloading: 'Download in corso…',
    opening: "Apertura dell'installazione…",
    installHint:
      'La prima volta Android ti chiede di consentire le installazioni da WWJD; poi, se serve, tocca di nuovo questo pulsante. Chiavi, impostazioni e analisi vengono mantenute.',
    checksumFailed: 'Il file scaricato non corrisponde (SHA-256). Riprova.',
    downloadFailed: (e) => `Download non riuscito: ${e}`,
  },

  extension: {
    actionTitle: 'WWJD – impostazioni',
    disabledError: "L'analisi WWJD è disattivata nelle impostazioni dell'estensione.",
    noKeyError: (p) =>
      `Nessuna chiave API trovata per ${p}. Inserisci la chiave nelle impostazioni di WWJD.`,
    noTranscriptError: (r) => `Impossibile recuperare la trascrizione per questo video (${r}).`,
    unknownError: 'Errore sconosciuto durante la valutazione.',
  },

  app: {
    analysisTitle: 'Analisi',
    shareAction: 'Condividi → WWJD',
    back: 'Indietro',
    settings: 'Impostazioni',
    showPlayer: 'Mostra il player di YouTube',
    hidePlayer: 'Nascondi il player di YouTube',
    pastePlaceholder: 'Incolla un link di YouTube',
    linkAria: 'Link di YouTube o ID del video',
    notRecognized: 'Nessun video di YouTube riconosciuto in questo link.',
    shareHint: ['Nell’app YouTube, tocca ', '.'],
    analyzeButton: 'Analizza',
    recent: 'Recenti',
    noAnalyses: 'Ancora nessuna analisi.',
    deleteAnalysis: 'Elimina analisi',
    shareNoVideo: 'Nessun video di YouTube trovato in ciò che hai condiviso.',
    cannotPlay: (c) => `Il video non può essere riprodotto qui (errore ${c}).`,
    openInYouTube: 'Apri in YouTube',
    seekTitle: (t) => `Vai a ${t} nel video`,
    playerOff: 'Il player di YouTube è disattivato.',
    showPlayerAndSeek: (t) => `Mostra il player e vai a ${t}`,
    openInYouTubeAt: (t) => `Apri nell’app YouTube a ${t}`,
    openedInYouTube: (t) => `YouTube salta a ${t}`,
    cancel: 'Annulla',
  },
  onboarding: {
    title: 'Ti diamo il benvenuto in What Would Jezus Do',
    intro: 'Due chiavi gratuite di Google e si parte. Ci vogliono circa 3 minuti.',
    geminiTitle: '1. Chiave Gemini',
    geminiText:
      "Gemini è l'IA che verifica i fatti e confronta il video con l'insegnamento di Gesù. La chiave è gratuita.",
    geminiButton: 'Crea la chiave Gemini',
    factcheckTitle: '2. Chiave Fact Check',
    factcheckText:
      'Cerca le verifiche ufficiali di organizzazioni come Reuters e AP. Anche questa chiave è gratuita.',
    factcheckButton: 'Crea la chiave Fact Check',
    steps: {
      gemini: [
        'Fai clic sul pulsante qui sopra, accedi con il tuo account Google e accetta i termini se Google lo chiede.',
        "C'è già una chiave? È la tua. Altrimenti fai clic su «Create API key» (scegli o importa un progetto se Google lo chiede).",
        "Copia la chiave con l'icona di copia accanto.",
        'Torna qui e incolla la chiave qui sotto.',
      ],
      factcheck: [
        'Fai clic sul pulsante qui sopra e accedi con lo stesso account Google.',
        'In alto, scegli un progetto (quello della scheda 1 va bene) e fai clic su «Enable».',
        'Apri «Credentials» e fai clic su «+ Create credentials» → «API key».',
        'Google chiede una restrizione API: in «API restrictions» seleziona «Fact Check Tools API», fai clic su «Create» e copia la chiave.',
        'Torna qui e incolla la chiave qui sotto.',
      ],
    },
    showMe: 'Mostrami dove fare clic',
    pasteLabel: 'Incolla qui la chiave',
    checking: 'Controllo della chiave…',
    works: 'Funziona',
    retry: 'Controlla di nuovo',
    problems: {
      empty: 'Incolla prima una chiave.',
      wrong_key: 'Questa chiave non è corretta. Copiala di nuovo, per intero e senza spazi.',
      wrong_api:
        'Questa chiave appartiene a un altro servizio Google. Crea una nuova chiave con il pulsante di questa scheda.',
      restricted:
        'Questa chiave è limitata ad altri siti o app. Crea una nuova chiave senza questa limitazione.',
      api_not_enabled:
        'La chiave è corretta, ma questo servizio non è ancora attivo nel tuo progetto Google.',
      quota:
        'Questa chiave ha raggiunto il suo limite per ora. Attendi un minuto e riprova, oppure domani.',
      offline: 'Nessuna connessione a Internet. Controlla la connessione e riprova.',
      model:
        'Il modello di IA scelto non è disponibile per questa chiave. Mantieni il modello standard nelle Impostazioni.',
      unknown:
        'Qualcosa è andato storto durante il controllo della chiave. Riprova tra un momento.',
    },
    enableButton: 'Attivalo (un clic)',
    doneButton: 'Fatto, apri un video di YouTube',
    doneButtonApp: 'Fatto, analizza un video',
    doneWaiting: 'Entrambe le chiavi devono prima avere un segno di spunta verde.',
    privacy: 'Le tue chiavi restano su questo dispositivo e vengono inviate solo a Google.',
    setupNotFinished: 'Configurazione non completata',
    setupMissing: (p) => `Aggiungi la chiave ${p} e la chiave Fact Check per analizzare i video.`,
    setupMissingAi: (p) => `Aggiungi la chiave ${p} per analizzare i video.`,
    setupMissingFactcheck:
      'Aggiungi la chiave Fact Check perché le affermazioni vengano confrontate anche con le verifiche ufficiali.',
    finishSetup: 'Completa la configurazione',
    setupGuide: 'Guida alla configurazione',
    otherAi: 'Preferisci Claude? Puoi sceglierlo più tardi nelle Impostazioni.',
  },

  errors: {
    auth: (p) =>
      `La chiave API di ${p} non è valida o non ha accesso. Controlla la chiave nelle impostazioni.`,
    quota: (p) =>
      `La quota o il credito di ${p} è esaurito. Riprova più tardi o controlla il tuo account.`,
    rate_limit: (p) =>
      `${p} è sovraccarico o è stato raggiunto il limite al minuto. Aspetta un minuto e riprova.`,
    bad_request: (p) => `${p} ha rifiutato la richiesta.`,
    model_not_found: (p) =>
      `Il modello ${p} indicato nelle impostazioni non esiste. Scegli un altro modello.`,
    video_unavailable: (p) => `${p} non riesce ad aprire questo video (solo video pubblici).`,
    refusal: (p) => `${p} si è rifiutato di analizzare questo video.`,
    truncated: (p) => `La risposta di ${p} è stata troncata. Riprova.`,
    network: () =>
      'Nessuna connessione con il servizio di IA. Controlla la connessione a Internet e riprova.',
    timeout: () => 'Il servizio di IA non ha risposto in tempo. Riprova.',
    aborted: () => "L'analisi è stata interrotta.",
    parse: () => "Non è stato possibile leggere la risposta dell'IA. Riprova.",
    server: (p) => `${p} ha avuto un problema del server. Riprova più tardi.`,
    unknown: () => 'Errore sconosciuto durante la valutazione.',
  },
};
