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
    coreActivity: "Nucleo dell'attività:",
    sentimentAndAttitude: 'Sentimento e atteggiamento:',
    contradictionAlert: 'Autocontraddizione rilevata (= mentire per definizione):',
    statementLabel: 'Affermazione:',
    factcheckLabel: 'Fact-check:',
    sourcesLabel: 'Fonte/i:',
    verdicts: {
      bevestigd: 'confermato',
      ontkracht: 'smentito',
      tegenspraak: 'contraddizione',
      gemengd_of_context: 'misto / contesto',
      opinie: 'opinione',
    },
    section2Title: (n) =>
      `2. Valutazione secondo gli insegnamenti di Gesù (${n} punti rilevanti valutati)`,
    linkedToMoment: 'Collegato al momento:',
    fromCache: (d) => `Dalla cache · ${d}`,
    justAnalyzed: 'Appena analizzato',
    off: 'WWJD è disattivato: non vengono effettuate analisi.',
    analyzeVideo: 'Analizza video',
    loadingStep: 'Verifica dei fatti e valutazione del video secondo gli insegnamenti di Gesù e i Dieci Comandamenti…',
    fetchingTranscript: 'Recupero della trascrizione…',
    evaluatingWith: (p) => `Verifica dei fatti e valutazione secondo Gesù con ${p}…`,
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
    languageLabel: "Lingua (interfaccia, analisi e riferimenti biblici)",
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
        'Fai clic su «Create API key»; se richiesto, scegli un progetto o lascialo creare.',
        'Copia la chiave (inizia con AIza) e incollala sopra in Chiave API.',
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
        'Vai su «Credentials», fai clic su «+ Create Credentials» → «API key», copia la chiave (inizia con AIza) e incollala sopra.',
        'Fai clic su «Prova connessione».',
      ],
    },
    keyCost: {
      gemini:
        'Gratis finché non colleghi la fatturazione (billing) al progetto Google. Conta su circa 10 analisi al minuto e 200 al giorno; Google può cambiarli e il tuo limite lo vedi in AI Studio. Ogni nuovo video costa una chiamata, un video già analizzato niente.',
      claude:
        'A pagamento: ogni analisi viene scalata dal tuo credito. Senza credito la chiave non funziona.',
      factcheck:
        '100% gratis (fino a 10.000 ricerche al giorno, senza carta di credito). Usato per verificare le affermazioni direttamente presso organizzazioni di fact-checking riconosciute.',
    },
    keyModels: {
      gemini:
        'Gratis tramite AI Studio: i modelli Flash e Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). A pagamento: i modelli Pro (gemini-pro-latest); funzionano solo con la fatturazione.',
      claude:
        'Tutti i modelli Claude sono a pagamento; Haiku è il più economico, Opus il più caro.',
      factcheck:
        'Consiglio: se usi lo stesso progetto Google Cloud della chiave Gemini, puoi usare la stessa chiave AIza dopo aver abilitato la Fact Check Tools API.',
    },
    model: 'Modello',
    testConnection: 'Prova connessione',
    busy: 'Un momento…',
    testOk: '✓ La connessione funziona e il modello esiste.',
    testOkFactcheck: '✓ La connessione con Google Fact Check API funziona.',
    testOkShort: 'La connessione funziona',
    testFailed: 'Connessione non riuscita.',
    fillKeyFirst: 'Inserisci prima una chiave API.',
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
    language:
      "Scegli la lingua per l'interfaccia, l'analisi IA e i riferimenti biblici.",
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
    updates:
      "Cerca su GitHub l'ultima versione di WWJD. Non vengono inviate chiavi né altri dati.",
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
    noKeyError: 'Non è ancora stata impostata una chiave API.',
  },
};
