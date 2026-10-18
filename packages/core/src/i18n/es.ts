import type { Messages } from './messages';

export const es: Messages = {
  locale: 'es-ES',
  languageNames: {
    nl: 'neerlandés',
    en: 'inglés',
    de: 'alemán',
    fr: 'francés',
    es: 'español',
    it: 'italiano',
    pt: 'portugués',
  },

  view: {
    switchAria: 'Activar o desactivar WWJD',
    turnOff: 'Desactivar WWJD',
    turnOn: 'Activar WWJD',
    showDetails: 'Mostrar fundamentación ▼',
    hideDetails: 'Ocultar fundamentación ▲',
    jesusAlignment: 'Concordancia con Jesús',
    section1Title: '1. Verificación de hechos e Integridad (Actividad 1)',
    coreActivity: 'Núcleo de la actividad:',
    sentimentAndAttitude: 'Sentimiento y actitud:',
    contradictionAlert: 'Autocontradicción detectada (= mentir por definición):',
    statementLabel: 'Declaración:',
    factcheckLabel: 'Verificación:',
    sourcesLabel: 'Fuente(s):',
    verdicts: {
      bevestigd: 'confirmado',
      ontkracht: 'refutado',
      tegenspraak: 'contradicción',
      gemengd_of_context: 'mixto / contexto',
      opinie: 'opinión',
    },
    section2Title: (n) =>
      `2. Evaluación según las enseñanzas de Jesús (${n} puntos relevantes ponderados)`,
    linkedToMoment: 'Vinculado al momento:',
    fromCache: (d) => `De la caché · ${d}`,
    justAnalyzed: 'Recién analizado',
    off: 'WWJD está desactivado: no se realizan análisis.',
    analyzeVideo: 'Analizar vídeo',
    loadingStep: 'Verificando hechos y evaluando el vídeo según las enseñanzas de Jesús y los Diez Mandamientos…',
    fetchingTranscript: 'Obteniendo la transcripción…',
    evaluatingWith: (p) => `Verificando hechos y evaluando según las enseñanzas de Jesús con ${p}…`,
    openSettings: 'Abrir ajustes',
    retry: 'Reintentar',
    verifiedVia: (pub, rating) => `[Verificado vía ${pub} (calificación: «${rating}»)]`,
  },

  settings: {
    title: 'Ajustes',
    loading: 'Cargando…',
    autoSaved: 'Los ajustes se guardan al instante.',
    saved: 'Guardado',
    languageHeading: 'Idioma',
    languageLabel: 'Idioma (interfaz, análisis y referencias bíblicas)',
    languageHint:
      'Establece el idioma de la interfaz, del análisis de IA y de los textos bíblicos enlazados.',
    aiService: 'Servicio de IA',
    providerHint:
      'El servicio elegido extrae declaraciones de la transcripción, verifica los hechos y evalúa el vídeo frente a las 25 enseñanzas y mandamientos de Jesús.',
    apiKey: 'Clave API',
    apiKeyOf: (p) => `Clave API de ${p}`,
    modelOf: (p) => `Modelo de ${p}`,
    show: 'Mostrar',
    hide: 'Ocultar',
    keyHintBrowser: ['Crea una clave en ', '. La clave solo se guarda en este navegador.'],
    keyHintDevice: ['Crea una clave en ', '. La clave se guarda cifrada en este dispositivo.'],
    keyStepsTitle: '¿Cómo consigo una clave?',
    keySteps: {
      gemini: [
        'Abre {site} e inicia sesión con tu cuenta de Google.',
        'Acepta las condiciones (solo la primera vez).',
        'Haz clic en «Create API key»; si te lo pide, elige un proyecto o deja que se cree uno.',
        'Copia la clave (empieza por AIza) y pégala arriba en Clave API.',
        'Haz clic en «Probar conexión».',
      ],
      claude: [
        'Abre {site} y crea una cuenta o inicia sesión.',
        'Compra saldo en «Billing» (prepago); conviene fijar también un tope de gasto.',
        'Elige «Create key» en las claves API y ponle un nombre.',
        'Copia la clave (empieza por sk-ant-) enseguida: solo se muestra una vez. Pégala arriba en Clave API.',
        'Haz clic en «Probar conexión».',
      ],
      factcheck: [
        'Abre {site} e inicia sesión con tu cuenta de Google (no requiere tarjeta de crédito).',
        'Elige arriba un proyecto existente o haz clic en «New Project» y llámalo p. ej. WWJD.',
        'Abre la Fact Check Tools API en la biblioteca de APIs (console.cloud.google.com/apis/library/factchecktools.googleapis.com) y haz clic en «Enable».',
        'Ve a «Credentials», haz clic en «+ Create Credentials» → «API key», copia la clave (empieza por AIza) y pégala arriba.',
        'Haz clic en «Probar conexión».',
      ],
    },
    keyCost: {
      gemini:
        'Gratis mientras no vincules facturación (billing) al proyecto de Google. Cuenta con unos 10 análisis por minuto y 200 al día; Google puede cambiarlo y tu propio límite aparece en AI Studio. Cada vídeo nuevo cuesta una llamada; uno ya analizado, nada.',
      claude: 'De pago: cada análisis se descuenta de tu saldo. Sin saldo, la clave no funciona.',
      factcheck:
        '100 % gratis (hasta 10 000 consultas al día, sin tarjeta de crédito). Se usa para verificar afirmaciones directamente en organizaciones de verificación reconocidas.',
    },
    keyModels: {
      gemini:
        'Gratis vía AI Studio: los modelos Flash y Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). De pago: los modelos Pro (gemini-pro-latest); solo funcionan con facturación.',
      claude: 'Todos los modelos de Claude son de pago; Haiku es el más barato y Opus el más caro.',
      factcheck:
        'Consejo: si usas el mismo proyecto de Google Cloud que para tu clave de Gemini, puedes usar la misma clave AIza tras activar la Fact Check Tools API.',
    },
    model: 'Modelo',
    testConnection: 'Probar conexión',
    busy: 'Un momento…',
    testOk: '✓ La conexión funciona y el modelo existe.',
    testOkFactcheck: '✓ La conexión con Google Fact Check API funciona.',
    testOkShort: 'La conexión funciona',
    testFailed: 'Falló la conexión.',
    fillKeyFirst: 'Introduce primero una clave API.',
    factcheckHeading: 'Verificación de hechos (Google Fact Check API)',
    factcheckToggle: 'Usar Google Fact Check Tools API',
    factcheckHint:
      'Busca rápidamente verificaciones oficiales existentes de organizaciones reconocidas en todo el mundo.',
    factcheckKeyLabel: 'Clave API de Fact Check',
    factcheckKeyHintBrowser: [
      'Crea una clave gratuita en ',
      '. La clave solo se guarda en este navegador.',
    ],
    factcheckKeyHintDevice: [
      'Crea una clave gratuita en ',
      '. La clave se guarda cifrada en este dispositivo.',
    ],
    evalHeading: 'Análisis y visualización',
    displayHeading: 'Visualización',
    activeLabel: 'Extensión activa en YouTube',
    activeHint: 'Desactivado: el panel WWJD en YouTube está desactivado.',
    autoLabel: 'Analizar automáticamente al abrir un vídeo',
    autoHint: 'Desactivado: haz clic en «Analizar vídeo» en el panel.',
    collapsedLabel: 'Ocultar fundamentación por defecto',
    collapsedHint: 'Mostrar primero solo la puntuación final (0–10) y la conclusión breve.',
    tipLabel: 'Explicación',
    cacheHeading: 'Caché',
    savedAnalyses: 'Análisis guardados',
    cacheText:
      'Cada vídeo se analiza una sola vez por idioma; después, el análisis sale de la caché.',
    clearCache: 'Vaciar caché',
    clear: 'Borrar',
    cacheCount: (n) => (n === 1 ? '1 análisis guardado' : `${n} análisis guardados`),
    analysisCount: (n) => (n === 1 ? '1 análisis' : `${n} análisis`),
    confirmClear: '¿Borrar todos los análisis guardados?',
    advanced: 'Avanzado',
    debugHeading: 'Registro de depuración',
    debugCheck:
      'Registrar por llamada el proveedor, el modelo, la longitud, la duración y los tokens',
    showLog: 'Mostrar registro',
    clearLog: 'Borrar registro',
    logEmpty: 'Todavía no hay llamadas registradas.',
    logHead: [
      'Hora',
      'Vídeo',
      'Paso',
      'Proveedor',
      'Modelo',
      'Entrada (caracteres)',
      'Duración',
      'Tokens entrada/salida',
      'Error',
    ],
  },

  tips: {
    language:
      'Elige el idioma para la interfaz, el análisis de IA y las referencias bíblicas.',
    provider:
      'Qué IA analiza el vídeo y lo evalúa según las 25 enseñanzas de Jesús. Gemini se puede usar gratis (con un límite diario); Claude se paga por análisis.',
    apiKey:
      'Un código secreto con el que WWJD usa el servicio de IA en tu nombre; el posible coste va a tu cuenta. La clave se queda en este dispositivo y solo se envía a ese servicio.',
    model:
      'El modelo de IA que realiza el análisis. Deja el predeterminado salvo que quieras probar otro; «Probar conexión» comprueba que existe. Con una clave gratuita de Gemini solo funcionan los modelos Flash y Flash-Lite; Pro requiere facturación.',
    factcheck:
      'La Google Fact Check Tools API busca rápidamente entre miles de verificaciones de organizaciones reconocidas (como Reuters, AP, PolitiFact). Si no hay una verificación previa para una declaración, la IA realiza un análisis histórico de los hechos.',
    factcheckKey:
      'Una clave API gratuita de Google Cloud Console para llamar a la Fact Check Tools API. La clave se queda en este dispositivo y solo se envía a Google.',
    actief:
      'Activado: el panel WWJD aparece en las páginas de vídeo de YouTube. Desactivado: la extensión no hace nada en YouTube.',
    auto: 'Activado: cada vídeo que abres se analiza enseguida; un vídeo nuevo cuesta una llamada a la IA. Desactivado: solo cuando haces clic en «Analizar vídeo».',
    collapsed:
      'Activado: muestra primero solo la puntuación de Jesús (0–10) y la conclusión breve; despliega la verificación completa y las citas bíblicas cuando quieras leerlas.',
    updates: 'Busca en GitHub la última versión de WWJD. No se envían claves ni otros datos.',
    cache:
      'Cada análisis se guarda, así que volver a abrir el mismo vídeo no cuesta nada. Vaciar elimina todos los análisis guardados; tus claves y tus ajustes se mantienen.',
    debug:
      'Para resolver problemas: registra por cada llamada a la IA qué modelo se usó, cuánto tardó y cuántos tokens costó. Tu clave nunca aparece.',
  },

  update: {
    heading: 'Actualizaciones',
    installed: (v) => `Versión instalada: ${v}`,
    check: 'Buscar actualizaciones',
    checking: 'Comprobando…',
    upToDate: 'Tienes la última versión.',
    available: (v) => `La versión ${v} está disponible.`,
    none: 'Aún no hay ninguna versión en GitHub.',
    failed: (e) => `No se pudo comprobar: ${e}`,
    whatsNew: 'Novedades',
    download: (v) => `Descargar la versión ${v}`,
    extensionSteps: [
      'Descarga el zip con la nueva versión.',
      'Descomprímelo sobre la carpeta de WWJD (sustituye los archivos).',
      'Haz clic en Recargar; después esta página se vuelve a abrir.',
    ],
    reload: 'Recargar',
    downloadInstall: 'Descargar e instalar',
    downloading: 'Descargando…',
    opening: 'Abriendo el instalador…',
    installHint:
      'La primera vez, Android te pide que permitas instalar desde WWJD; después, vuelve a tocar este botón si hace falta. Tus claves, ajustes y análisis se conservan.',
    checksumFailed: 'El archivo descargado no coincide (SHA-256). Inténtalo de nuevo.',
    downloadFailed: (e) => `No se pudo descargar: ${e}`,
  },

  extension: {
    actionTitle: 'WWJD – ajustes',
    disabledError: 'El análisis WWJD está desactivado en los ajustes de la extensión.',
    noKeyError: (p) =>
      `No se encontró clave API para ${p}. Introduce tu clave en los ajustes de WWJD.`,
    noTranscriptError: (r) => `No se pudo obtener la transcripción de este vídeo (${r}).`,
    unknownError: 'Error desconocido durante la evaluación.',
  },

  app: {
    analysisTitle: 'Análisis',
    shareAction: 'Compartir → WWJD',
    back: 'Atrás',
    settings: 'Ajustes',
    showPlayer: 'Mostrar el reproductor de YouTube',
    hidePlayer: 'Ocultar el reproductor de YouTube',
    pastePlaceholder: 'Pega un enlace de YouTube',
    linkAria: 'Enlace de YouTube o ID del vídeo',
    notRecognized: 'No se reconoce ningún vídeo de YouTube en este enlace.',
    shareHint: ['En la aplicación de YouTube, toca ', '.'],
    analyzeButton: 'Analizar',
    recent: 'Recientes',
    noAnalyses: 'Todavía no hay análisis.',
    shareNoVideo: 'No se encontró ningún vídeo de YouTube en lo que compartiste.',
    cannotPlay: (c) => `El vídeo no se puede reproducir aquí (error ${c}).`,
    openInYouTube: 'Abrir en YouTube',
    seekTitle: (t) => `Ir a ${t} en el vídeo`,
    playerOff: 'El reproductor de YouTube está desactivado.',
    showPlayerAndSeek: (t) => `Mostrar el reproductor e ir a ${t}`,
    openInYouTubeAt: (t) => `Abrir en la aplicación de YouTube en ${t}`,
    openedInYouTube: (t) => `YouTube salta a ${t}`,
    cancel: 'Cancelar',
    noKeyError: 'Todavía no se ha configurado ninguna clave API.',
  },
};
