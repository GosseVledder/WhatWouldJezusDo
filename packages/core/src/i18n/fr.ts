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
    summaryTitle: 'Résumé',
    checkedFacts: 'Faits vérifiés',
    coreActivity: "Cœur de l'activité :",
    sentimentAndAttitude: 'Sentiment & attitude :',
    subjectLabel: 'Sujet',
    presenterLabel: 'Présentateur',
    presenterRole: 'Rôle :',
    presenterConduct: 'Conduite :',
    presenterIsSubject: 'Le présentateur est lui-même le sujet de la vidéo.',
    speakers: {
      presenter: 'présentateur',
      subject: 'sujet',
      other: 'autre',
    },
    contradictionAlert: 'Auto-contradiction détectée (= mensonge par définition) :',
    statementLabel: 'Déclaration :',
    factcheckLabel: 'Vérification :',
    sourcesLabel: 'Source(s) :',
    noSource: 'Aucune source externe trouvée : vérifié par l’IA uniquement.',
    otherSources: 'Autres sources consultées :',
    verdicts: {
      bevestigd: 'confirmé',
      ontkracht: 'réfuté',
      tegenspraak: 'contradiction',
      gemengd_of_context: 'mitigé / contexte',
      opinie: 'opinion',
    },
    section2Title: (n) =>
      `2. Sujet : évaluation selon les préceptes de Jésus (${n} points pertinents retenus)`,
    section3Title: (n) =>
      `3. Présentateur : évaluation selon les préceptes de Jésus (${n} points pertinents retenus)`,
    presenterScore: 'Présentateur',
    subjectScore: 'Récit et faits',
    linkedToMoment: 'Lié au moment :',
    fromCache: (d) => `Depuis le cache · ${d}`,
    justAnalyzed: "Analysé à l'instant",
    off: "WWJD est désactivé : aucune analyse n'est effectuée.",
    analyzeVideo: 'Analyser la vidéo',
    loadingStep:
      'Vérification des faits et évaluation selon les préceptes de Jésus et les Dix Commandements…',
    progressSteps: {
      transcript: 'Récupération de la transcription',
      analyse: 'Vérification des faits, résumé et notation',
      factcheck: 'Recherche de vérifications officielles',
      reconcile: 'Mise à jour des scores avec les vérifications',
    },
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
    languageHint: "Définit la langue de l'interface, de l'analyse IA et des textes bibliques liés.",
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
        "Une clé est déjà affichée ? C'est la vôtre. Sinon, cliquez sur « Create API key » (choisissez ou importez un projet si demandé).",
        'Copiez la clé (elle commence par AIza ou AQ.) et collez-la ci-dessus dans Clé API.',
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
        'Allez dans « Credentials », cliquez sur « + Create credentials » → « API key », sélectionnez « Fact Check Tools API » sous « API restrictions » et cliquez sur « Create ». Copiez la clé (commence par AIza) et collez-la ci-dessus.',
        'Cliquez sur « Tester la connexion ».',
      ],
    },
    keyCost: {
      gemini:
        'Gratuit tant que vous ne liez pas de facturation (billing) au projet Google. Google fixe une limite par minute et par jour (la limite quotidienne repart à minuit, heure du Pacifique) ; AI Studio affiche vos propres limites. Chaque nouvelle vidéo coûte un appel, une vidéo déjà analysée ne coûte rien.',
      claude:
        'Payant : chaque analyse est déduite de votre crédit. Sans crédit, la clé ne fonctionne pas.',
      factcheck:
        "Gratuit, sans carte bancaire. Google fixe une limite d'utilisation par projet ; vous la voyez sur la page « Quotas » de Google Cloud. Sert à vérifier les affirmations directement auprès d'organisations de fact-checking reconnues dans le monde entier.",
    },
    keyModels: {
      gemini:
        'Gratuits via AI Studio : les modèles Flash et Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Payants : les modèles Pro (gemini-pro-latest) ; ils ne fonctionnent qu’avec la facturation.',
      claude: 'Tous les modèles Claude sont payants ; Haiku est le moins cher, Opus le plus cher.',
      factcheck:
        'Utilisez une clé distincte : les clés créées dans AI Studio ne fonctionnent que pour Gemini. Créez cette clé dans Google Cloud, dans un projet où la Fact Check Tools API est activée.',
    },
    model: 'Modèle',
    testConnection: 'Tester la connexion',
    busy: 'Un instant…',
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
    liveLabel: 'Mode direct synchronisé',
    liveHint: 'Pendant la lecture, le panneau met en évidence ce qui est dit et y défile.',
    overlayLabel: 'Superposition sur la vidéo',
    overlayHint:
      'Affiche aussi une petite carte façon sous-titre sur la vidéo à chaque moment vérifié.',
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
    language: "Choisissez la langue de l'interface, de l'analyse IA et des références bibliques.",
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
    live: 'Activé : chaque vérification et chaque point de l’enseignement de Jésus s’allume au moment où il est dit dans la vidéo, et le panneau y défile. Si vous faites défiler vous-même, il attend quelques secondes.',
    overlay:
      'Activé : une petite carte discrète avec le verdict apparaît quelques secondes en bas de la vidéo à chaque moment vérifié. Désactivé : seul le panneau suit la vidéo.',
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
    noTranscriptError: (r) => `Impossible de récupérer une transcription pour cette vidéo (${r}).`,
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
  },
  onboarding: {
    title: 'Bienvenue dans What Would Jezus Do',
    intro: 'Deux clés Google gratuites et c’est parti. Cela prend environ 3 minutes.',
    geminiTitle: '1. Clé Gemini',
    geminiText:
      "Gemini est l'IA qui vérifie les faits et compare la vidéo à l'enseignement de Jésus. La clé est gratuite.",
    geminiButton: 'Créer la clé Gemini',
    factcheckTitle: '2. Clé Fact Check',
    factcheckText:
      'Recherche les vérifications officielles d’organisations comme Reuters et AP. Cette clé est gratuite elle aussi.',
    factcheckButton: 'Créer la clé Fact Check',
    steps: {
      gemini: [
        'Cliquez sur le bouton ci-dessus, connectez-vous avec votre compte Google et acceptez les conditions si Google le demande.',
        "Une clé est déjà affichée ? C'est la vôtre. Sinon, cliquez sur « Create API key » (choisissez ou importez un projet si Google le demande).",
        "Copiez la clé avec l'icône de copie à côté.",
        'Revenez ici et collez la clé ci-dessous.',
      ],
      factcheck: [
        'Cliquez sur le bouton ci-dessus et connectez-vous avec le même compte Google.',
        'En haut, choisissez un projet (celui de la carte 1 convient) et cliquez sur « Enable ».',
        'Ouvrez « Credentials » et cliquez sur « + Create credentials » → « API key ».',
        "Google demande une restriction d'API : sous « API restrictions », sélectionnez « Fact Check Tools API », cliquez sur « Create » et copiez la clé.",
        'Revenez ici et collez la clé ci-dessous.',
      ],
    },
    showMe: 'Montrez-moi où cliquer',
    pasteLabel: 'Collez la clé ici',
    checking: 'Vérification de la clé…',
    works: 'Fonctionne',
    retry: 'Vérifier à nouveau',
    problems: {
      empty: "Collez d'abord une clé.",
      wrong_key: "Cette clé n'est pas correcte. Copiez-la à nouveau, en entier et sans espaces.",
      wrong_api:
        'Cette clé appartient à un autre service Google. Créez une nouvelle clé avec le bouton de cette carte.',
      restricted:
        "Cette clé est limitée à d'autres sites ou applications. Créez une nouvelle clé sans cette limite.",
      api_not_enabled:
        "La clé est correcte, mais ce service n'est pas encore activé dans votre projet Google.",
      quota:
        'Cette clé a atteint sa limite pour le moment. Attendez une minute et réessayez, ou demain.',
      offline: 'Pas de connexion Internet. Vérifiez votre connexion et réessayez.',
      model:
        "Le modèle d'IA choisi n'est pas disponible pour cette clé. Gardez le modèle standard dans les paramètres.",
      unknown:
        'Un problème est survenu lors de la vérification de la clé. Réessayez dans un instant.',
    },
    enableButton: "L'activer (un clic)",
    doneButton: 'Terminé, ouvrir une vidéo YouTube',
    doneButtonApp: 'Terminé, analyser une vidéo',
    doneWaiting: "Les deux clés doivent d'abord avoir une coche verte.",
    privacy: 'Vos clés restent sur cet appareil et ne sont envoyées qu’à Google.',
    setupNotFinished: 'Configuration non terminée',
    setupMissing: (p) => `Ajoutez votre clé ${p} et votre clé Fact Check pour analyser des vidéos.`,
    setupMissingAi: (p) => `Ajoutez votre clé ${p} pour analyser des vidéos.`,
    setupMissingFactcheck:
      'Ajoutez votre clé Fact Check pour que les affirmations soient aussi comparées aux vérifications officielles.',
    finishSetup: 'Terminer la configuration',
    setupGuide: 'Guide de configuration',
    otherAi: 'Vous préférez Claude ? Vous pourrez le choisir plus tard dans les paramètres.',
  },

  errors: {
    auth: (p) =>
      `La clé API ${p} n'est pas valide ou n'a pas accès. Vérifiez la clé dans les paramètres.`,
    quota: (p) =>
      `Le quota ou le crédit ${p} est épuisé. Réessayez plus tard ou vérifiez votre compte.`,
    rate_limit: (p) =>
      `${p} est surchargé ou la limite par minute est atteinte. Attendez une minute et réessayez.`,
    bad_request: (p) => `${p} a refusé la requête.`,
    model_not_found: (p) =>
      `Le modèle ${p} indiqué dans les paramètres n'existe pas. Choisissez un autre modèle.`,
    video_unavailable: (p) => `${p} ne peut pas ouvrir cette vidéo (vidéos publiques uniquement).`,
    refusal: (p) => `${p} a refusé d'analyser cette vidéo.`,
    truncated: (p) => `La réponse de ${p} a été coupée. Réessayez.`,
    network: () =>
      "Pas de connexion avec le service d'IA. Vérifiez votre connexion Internet et réessayez.",
    timeout: () => "Le service d'IA n'a pas répondu à temps. Réessayez.",
    aborted: () => "L'analyse a été arrêtée.",
    parse: () => "La réponse de l'IA n'a pas pu être lue. Réessayez.",
    server: (p) => `${p} a rencontré un problème de serveur. Réessayez plus tard.`,
    unknown: () => "Erreur inconnue lors de l'évaluation.",
  },
};
