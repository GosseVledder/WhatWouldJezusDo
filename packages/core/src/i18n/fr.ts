import type { Messages } from './messages';

export const fr: Messages = {
  locale: 'fr-FR',
  languageNames: {
    nl: 'néerlandais',
    en: 'anglais',
    de: 'allemand',
    fr: 'français',
    es: 'espagnol',
    it: 'italien',
    pt: 'portugais',
  },

  view: {
    switchAria: 'Activer ou désactiver WWJD',
    turnOff: 'Désactiver WWJD',
    turnOn: 'Activer WWJD',
    showDetails: 'Afficher la justification ▼',
    hideDetails: 'Masquer la justification ▲',
    jesusAlignment: 'Accord avec Jésus',
    section1Title: '1. Vérification des faits & Intégrité (Activité 1)',
    coreActivity: "Cœur de l'activité :",
    sentimentAndAttitude: 'Sentiment & attitude :',
    contradictionAlert: 'Auto-contradiction détectée (= mensonge par définition) :',
    statementLabel: 'Déclaration :',
    factcheckLabel: 'Vérification :',
    sourcesLabel: 'Source(s) :',
    verdicts: {
      bevestigd: 'confirmé',
      ontkracht: 'réfuté',
      tegenspraak: 'contradiction',
      gemengd_of_context: 'mitigé / contexte',
      opinie: 'opinion',
    },
    section2Title: (n) =>
      `2. Évaluation selon les préceptes de Jésus (${n} points pertinents retenus)`,
    linkedToMoment: 'Lié au moment :',
    fromCache: (d) => `Depuis le cache · ${d}`,
    justAnalyzed: "Analysé à l'instant",
    off: "WWJD est désactivé : aucune analyse n'est effectuée.",
    analyzeVideo: 'Analyser la vidéo',
    loadingStep: 'Vérification des faits et évaluation selon les préceptes de Jésus et les Dix Commandements…',
    fetchingTranscript: 'Récupération de la transcription…',
    evaluatingWith: (p) => `Vérification des faits et évaluation selon Jésus avec ${p}…`,
    openSettings: 'Ouvrir les paramètres',
    retry: 'Réessayer',
    refresh: 'Réanalyser',
    verifiedVia: (pub, rating) => `[Vérifié via ${pub} (verdict : « ${rating} »)]`,
  },

  settings: {
    title: 'Paramètres',
    loading: 'Chargement…',
    autoSaved: 'Les paramètres sont enregistrés immédiatement.',
    saved: 'Enregistré',
    languageHeading: 'Langue',
    languageLabel: 'Langue (interface, analyse & références bibliques)',
    languageHint:
      "Définit la langue de l'interface, de l'analyse IA et des textes bibliques liés.",
    aiService: 'Service d’IA',
    providerHint:
      'L’utilisation de What Would Jezus Do est entièrement gratuite : choisissez pour le LLM soit une clé Gemini gratuite, soit une clé Gemini payante, soit une clé Claude payante, et pour la vérification des faits une clé Google Fact Check gratuite.',
    apiKey: 'Clé API',
    apiKeyOf: (p) => `Clé API ${p}`,
    modelOf: (p) => `Modèle ${p}`,
    show: 'Afficher',
    hide: 'Masquer',
    keyHintBrowser: ['Créez une clé sur ', '. La clé reste uniquement dans ce navigateur.'],
    keyHintDevice: ['Créez une clé sur ', '. La clé est stockée chiffrée sur cet appareil.'],
    keyStepsTitle: 'Comment obtenir une clé ?',
    keySteps: {
      gemini: [
        'Ouvrez {site} et connectez-vous avec votre compte Google.',
        'Acceptez les conditions (la première fois seulement).',
        'Cliquez sur « Create API key » ; si demandé, choisissez un projet ou laissez-en créer un.',
        'Copiez la clé (elle commence par AIza) et collez-la ci-dessus dans Clé API.',
        'Cliquez sur « Tester la connexion ».',
      ],
      claude: [
        'Ouvrez {site} et créez un compte ou connectez-vous.',
        'Achetez du crédit sous « Billing » (prépayé) ; fixez de préférence aussi un plafond de dépenses.',
        'Choisissez « Create key » dans les clés API et donnez un nom à la clé.',
        "Copiez la clé (elle commence par sk-ant-) tout de suite : elle ne s'affiche qu'une fois. Collez-la ci-dessus dans Clé API.",
        'Cliquez sur « Tester la connexion ».',
      ],
      factcheck: [
        'Ouvrez {site} et connectez-vous avec votre compte Google (aucune carte bancaire requise).',
        'Sélectionnez un projet existant en haut ou cliquez sur « New Project » et nommez-le par ex. WWJD.',
        'Ouvrez la Fact Check Tools API dans la bibliothèque API (console.cloud.google.com/apis/library/factchecktools.googleapis.com) et cliquez sur « Enable ».',
        'Allez dans « Credentials », cliquez sur « + Create Credentials » → « API key », copiez la clé (commence par AIza) et collez-la ci-dessus.',
        'Cliquez sur « Tester la connexion ».',
      ],
    },
    keyCost: {
      gemini:
        "Gratuit tant que vous ne liez pas de facturation (billing) au projet Google. Comptez environ 10 analyses par minute et 200 par jour ; Google peut modifier ces limites et AI Studio affiche la vôtre. Chaque nouvelle vidéo coûte un appel, une vidéo déjà analysée rien.",
      claude:
        'Payant : chaque analyse est déduite de votre crédit. Sans crédit, la clé ne fonctionne pas.',
      factcheck:
        "100 % gratuit (jusqu'à 10 000 requêtes par jour, sans carte bancaire). Utilisé pour vérifier directement les affirmations auprès d'organisations de fact-checking reconnues.",
    },
    keyModels: {
      gemini:
        'Gratuits via AI Studio : les modèles Flash et Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Payants : les modèles Pro (gemini-pro-latest) ; ils ne fonctionnent qu’avec la facturation.',
      claude: 'Tous les modèles Claude sont payants ; Haiku est le moins cher, Opus le plus cher.',
      factcheck:
        'Astuce : si vous utilisez le même projet Google Cloud que pour votre clé Gemini, vous pouvez utiliser la même clé AIza après avoir activé la Fact Check Tools API.',
    },
    model: 'Modèle',
    testConnection: 'Tester la connexion',
    busy: 'Un instant…',
    testOk: '✓ La connexion fonctionne et le modèle existe.',
    testOkFactcheck: '✓ La connexion à la Google Fact Check API fonctionne.',
    testOkShort: 'La connexion fonctionne',
    testFailed: 'Échec de la connexion.',
    fillKeyFirst: 'Saisissez d’abord une clé API.',
    factcheckHeading: 'Vérification des faits (Google Fact Check API)',
    factcheckToggle: 'Utiliser la Google Fact Check Tools API',
    factcheckHint:
      "Recherche rapidement parmi les vérifications des faits officielles d'organisations reconnues dans le monde entier.",
    factcheckKeyLabel: 'Clé API Fact Check',
    factcheckKeyHintBrowser: [
      'Créez une clé gratuite sur ',
      '. La clé reste uniquement dans ce navigateur.',
    ],
    factcheckKeyHintDevice: [
      'Créez une clé gratuite sur ',
      '. La clé est stockée chiffrée sur cet appareil.',
    ],
    evalHeading: 'Analyse & affichage',
    displayHeading: 'Affichage',
    activeLabel: 'Extension active sur YouTube',
    activeHint: 'Désactivé : le panneau WWJD sur YouTube est désactivé.',
    autoLabel: 'Analyser automatiquement à l’ouverture d’une vidéo',
    autoHint: 'Désactivé : cliquez sur « Analyser la vidéo » dans le panneau.',
    collapsedLabel: 'Replier la justification par défaut',
    collapsedHint: "Afficher d'abord uniquement la note finale (0–10) et la conclusion courte.",
    tipLabel: 'Explication',
    cacheHeading: 'Cache',
    savedAnalyses: 'Analyses enregistrées',
    cacheText:
      'Chaque vidéo est analysée une fois par langue ; ensuite, l’analyse provient du cache.',
    clearCache: 'Vider le cache',
    clear: 'Effacer',
    cacheCount: (n) => (n === 1 ? '1 analyse enregistrée' : `${n} analyses enregistrées`),
    analysisCount: (n) => (n === 1 ? '1 analyse' : `${n} analyses`),
    confirmClear: 'Supprimer toutes les analyses enregistrées ?',
    advanced: 'Avancé',
    debugHeading: 'Journal de débogage',
    debugCheck:
      'Enregistrer par appel le fournisseur, le modèle, la taille, la durée et les jetons',
    showLog: 'Afficher le journal',
    clearLog: 'Effacer le journal',
    logEmpty: 'Aucun appel enregistré pour l’instant.',
    logHead: [
      'Heure',
      'Vidéo',
      'Étape',
      'Fournisseur',
      'Modèle',
      'Entrée (caractères)',
      'Durée',
      'Jetons entrée/sortie',
      'Erreur',
    ],
  },

  tips: {
    language:
      "Choisissez la langue de l'interface, de l'analyse IA et des références bibliques.",
    provider:
      "L'IA qui analyse la vidéo et l'évalue selon les 25 préceptes de Jésus. Gemini est gratuit (avec une limite quotidienne) ; Claude se paie par analyse.",
    apiKey:
      "Un code secret qui permet à WWJD d'utiliser le service d'IA en votre nom ; les éventuels coûts sont imputés à votre compte. La clé reste sur cet appareil et n'est envoyée qu'à ce service.",
    model:
      "Le modèle d'IA qui réalise l'analyse. Gardez celui par défaut, sauf si vous voulez en essayer un autre ; « Tester la connexion » vérifie qu'il existe. Avec une clé Gemini gratuite, seuls les modèles Flash et Flash-Lite fonctionnent ; Pro exige la facturation.",
    factcheck:
      "La Google Fact Check Tools API recherche rapidement parmi des milliers de vérifications d'organisations reconnues (comme Reuters, AP, PolitiFact). S'il n'existe pas de vérification pour une affirmation, l'IA effectue elle-même une analyse historique des faits.",
    factcheckKey:
      'Une clé API gratuite de la Google Cloud Console permettant d’appeler la Fact Check Tools API. La clé reste sur cet appareil et n’est envoyée qu’à Google.',
    actief:
      'Activé : le panneau WWJD apparaît sur les pages vidéo YouTube. Désactivé : l’extension ne fait rien sur YouTube.',
    auto: "Activé : chaque vidéo ouverte est analysée immédiatement ; une nouvelle vidéo coûte un appel à l'IA. Désactivé : uniquement quand vous cliquez sur « Analyser la vidéo ».",
    collapsed:
      'Activé : affiche d’abord uniquement le score de Jésus (0–10) et la conclusion courte ; dépliez la vérification complète et les références bibliques quand vous voulez les lire.',
    updates:
      "Recherche la dernière version de WWJD sur GitHub. Aucune clé ni autre donnée n'est envoyée.",
    cache:
      'Chaque analyse est conservée : rouvrir la même vidéo ne coûte rien. Vider supprime toutes les analyses enregistrées ; vos clés et vos paramètres restent.',
    debug:
      "Pour le dépannage : enregistre pour chaque appel à l'IA le modèle utilisé, la durée et le nombre de jetons. Votre clé n'y figure jamais.",
  },

  update: {
    heading: 'Mises à jour',
    installed: (v) => `Version installée : ${v}`,
    check: 'Rechercher des mises à jour',
    checking: 'Vérification…',
    upToDate: 'Vous avez la dernière version.',
    available: (v) => `La version ${v} est disponible.`,
    none: "Aucune version trouvée sur GitHub pour l'instant.",
    failed: (e) => `Échec de la vérification : ${e}`,
    whatsNew: 'Quoi de neuf ?',
    download: (v) => `Télécharger la version ${v}`,
    extensionSteps: [
      'Téléchargez le zip de la nouvelle version.',
      'Décompressez-le dans le dossier de WWJD (remplacez les fichiers).',
      'Cliquez sur Recharger ; cette page se rouvre ensuite.',
    ],
    reload: 'Recharger',
    downloadInstall: 'Télécharger et installer',
    downloading: 'Téléchargement…',
    opening: "Ouverture de l'installation…",
    installHint:
      "La première fois, Android vous demande d'autoriser les installations depuis WWJD ; touchez ensuite à nouveau ce bouton si nécessaire. Vos clés, vos paramètres et vos analyses sont conservés.",
    checksumFailed: 'Le fichier téléchargé ne correspond pas (SHA-256). Réessayez.',
    downloadFailed: (e) => `Échec du téléchargement : ${e}`,
  },

  extension: {
    actionTitle: 'WWJD – paramètres',
    disabledError: "L'analyse WWJD est désactivée dans les paramètres de l'extension.",
    noKeyError: (p) =>
      `Aucune clé API trouvée pour ${p}. Saisissez votre clé dans les paramètres WWJD.`,
    noTranscriptError: (r) =>
      `Impossible de récupérer une transcription pour cette vidéo (${r}).`,
    unknownError: "Erreur inconnue lors de l'évaluation.",
  },

  app: {
    analysisTitle: 'Analyse',
    shareAction: 'Partager → WWJD',
    back: 'Retour',
    settings: 'Paramètres',
    showPlayer: 'Afficher le lecteur YouTube',
    hidePlayer: 'Masquer le lecteur YouTube',
    pastePlaceholder: 'Collez un lien YouTube',
    linkAria: 'Lien YouTube ou ID de vidéo',
    notRecognized: 'Aucune vidéo YouTube reconnue dans ce lien.',
    shareHint: ['Dans l’application YouTube, appuyez sur ', '.'],
    analyzeButton: 'Analyser',
    recent: 'Récents',
    noAnalyses: 'Pas encore d’analyses.',
    deleteAnalysis: 'Supprimer l’analyse',
    shareNoVideo: 'Aucune vidéo YouTube trouvée dans ce que vous avez partagé.',
    cannotPlay: (c) => `La vidéo ne peut pas être lue ici (erreur ${c}).`,
    openInYouTube: 'Ouvrir dans YouTube',
    seekTitle: (t) => `Aller à ${t} dans la vidéo`,
    playerOff: 'Le lecteur YouTube est désactivé.',
    showPlayerAndSeek: (t) => `Afficher le lecteur et aller à ${t}`,
    openInYouTubeAt: (t) => `Ouvrir dans l’application YouTube à ${t}`,
    openedInYouTube: (t) => `YouTube passe à ${t}`,
    cancel: 'Annuler',
    noKeyError: 'Aucune clé API n’est encore configurée.',
  },
};
