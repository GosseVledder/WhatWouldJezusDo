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
    summaryTitle: 'Resumen',
    checkedFacts: 'Hechos comprobados',
    coreActivity: 'Núcleo de la actividad:',
    sentimentAndAttitude: 'Sentimiento y actitud:',
    subjectLabel: 'Tema',
    presenterLabel: 'Presentador',
    presenterRole: 'Rol:',
    presenterConduct: 'Conducta:',
    presenterIsSubject: 'El presentador es el propio tema del vídeo.',
    speakers: {
      presenter: 'presentador',
      subject: 'tema',
      other: 'otro',
    },
    contradictionAlert: 'Autocontradicción detectada (= mentir por definición):',
    statementLabel: 'Declaración:',
    factcheckLabel: 'Verificación:',
    sourcesLabel: 'Fuente(s):',
    noSource: 'No se encontró ninguna fuente externa: comprobado solo por la IA.',
    otherSources: 'Otras fuentes consultadas:',
    verdicts: {
      bevestigd: 'confirmado',
      ontkracht: 'refutado',
      tegenspraak: 'contradicción',
      gemengd_of_context: 'mixto / contexto',
      opinie: 'opinión',
    },
    section2Title: (n) =>
      `2. Tema: evaluación según las enseñanzas de Jesús (${n} puntos relevantes ponderados)`,
    section3Title: (n) =>
      `3. Presentador: evaluación según las enseñanzas de Jesús (${n} puntos relevantes ponderados)`,
    presenterScore: 'Presentador',
    subjectScore: 'Relato y hechos',
    linkedToMoment: 'Vinculado al momento:',
    fromCache: (d) => `De la caché · ${d}`,
    justAnalyzed: 'Recién analizado',
    off: 'WWJD está desactivado: no se realizan análisis.',
    analyzeVideo: 'Analizar vídeo',
    loadingStep:
      'Verificando hechos y evaluando el vídeo según las enseñanzas de Jesús y los Diez Mandamientos…',
    progressSteps: {
      transcript: 'Obteniendo la transcripción',
      analyse: 'Comprobando los hechos, resumiendo y puntuando',
      factcheck: 'Buscando verificaciones oficiales',
      reconcile: 'Actualizando las puntuaciones con las verificaciones',
    },
    openSettings: 'Abrir ajustes',
    retry: 'Reintentar',
    refresh: 'Volver a analizar',
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
      'El uso de What Would Jezus Do es completamente gratuito: elige para el LLM o bien una clave gratuita de Gemini, o bien una clave de pago de Gemini, o bien una clave de pago de Claude, y para la verificación de hechos una clave gratuita de Google Fact Check.',
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
        '¿Ya aparece una clave? Es la tuya. Si no, haz clic en «Create API key» (elige o importa un proyecto si te lo pide).',
        'Copia la clave (empieza por AIza o AQ.) y pégala arriba en Clave API.',
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
        'Ve a «Credentials», haz clic en «+ Create credentials» → «API key», selecciona «Fact Check Tools API» en «API restrictions» y haz clic en «Create». Copia la clave (empieza por AIza) y pégala arriba.',
        'Haz clic en «Probar conexión».',
      ],
    },
    keyCost: {
      gemini:
        'Gratis mientras no vincules la facturación (billing) al proyecto de Google. Google fija un límite por minuto y por día (el límite diario se reinicia a medianoche, hora del Pacífico); AI Studio muestra tus propios límites. Cada vídeo nuevo cuesta una llamada; uno ya analizado no cuesta nada.',
      claude: 'De pago: cada análisis se descuenta de tu saldo. Sin saldo, la clave no funciona.',
      factcheck:
        'Gratis, sin tarjeta de crédito. Google fija un límite de uso por proyecto; lo ves en la página «Quotas» de Google Cloud. Se usa para verificar afirmaciones directamente con organizaciones de verificación reconocidas en todo el mundo.',
    },
    keyModels: {
      gemini:
        'Gratis vía AI Studio: los modelos Flash y Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). De pago: los modelos Pro (gemini-pro-latest); solo funcionan con facturación.',
      claude: 'Todos los modelos de Claude son de pago; Haiku es el más barato y Opus el más caro.',
      factcheck:
        'Usa una clave aparte: las claves de AI Studio solo funcionan con Gemini. Crea esta clave en Google Cloud, en un proyecto con la Fact Check Tools API activada.',
    },
    model: 'Modelo',
    testConnection: 'Probar conexión',
    busy: 'Un momento…',
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
    liveLabel: 'Modo en directo sincronizado',
    liveHint:
      'Mientras se reproduce el vídeo, el panel resalta lo que se dice y se desplaza hasta ello.',
    overlayLabel: 'Superposición en el vídeo',
    overlayHint:
      'Muestra también una pequeña tarjeta tipo subtítulo sobre el vídeo en cada momento comprobado.',
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
    language: 'Elige el idioma para la interfaz, el análisis de IA y las referencias bíblicas.',
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
    live: 'Activado: cada verificación y cada punto de la enseñanza de Jesús se ilumina en el momento en que se dice en el vídeo, y el panel se desplaza hasta él. Si te desplazas tú, espera unos segundos.',
    overlay:
      'Activado: en la parte inferior del vídeo aparece unos segundos una tarjeta pequeña y discreta con el veredicto en cada momento comprobado. Desactivado: solo el panel sigue el vídeo.',
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
    deleteAnalysis: 'Eliminar análisis',
    shareNoVideo: 'No se encontró ningún vídeo de YouTube en lo que compartiste.',
    cannotPlay: (c) => `El vídeo no se puede reproducir aquí (error ${c}).`,
    openInYouTube: 'Abrir en YouTube',
    seekTitle: (t) => `Ir a ${t} en el vídeo`,
    playerOff: 'El reproductor de YouTube está desactivado.',
    showPlayerAndSeek: (t) => `Mostrar el reproductor e ir a ${t}`,
    openInYouTubeAt: (t) => `Abrir en la aplicación de YouTube en ${t}`,
    openedInYouTube: (t) => `YouTube salta a ${t}`,
    cancel: 'Cancelar',
  },
  onboarding: {
    title: 'Te damos la bienvenida a What Would Jezus Do',
    intro: 'Dos claves gratuitas de Google y listo. Tarda unos 3 minutos.',
    geminiTitle: '1. Clave de Gemini',
    geminiText:
      'Gemini es la IA que comprueba los hechos y compara el vídeo con las enseñanzas de Jesús. La clave es gratuita.',
    geminiButton: 'Crear clave de Gemini',
    factcheckTitle: '2. Clave de Fact Check',
    factcheckText:
      'Busca verificaciones oficiales de organizaciones como Reuters y AP. Esta clave también es gratuita.',
    factcheckButton: 'Crear clave de Fact Check',
    steps: {
      gemini: [
        'Haz clic en el botón de arriba, inicia sesión con tu cuenta de Google y acepta las condiciones si Google lo pide.',
        '¿Ya aparece una clave? Es la tuya. Si no, haz clic en «Create API key» (elige o importa un proyecto si Google lo pide).',
        'Copia la clave con el icono de copiar que hay al lado.',
        'Vuelve aquí y pega la clave abajo.',
      ],
      factcheck: [
        'Haz clic en el botón de arriba e inicia sesión con la misma cuenta de Google.',
        'Arriba, elige un proyecto (el de la tarjeta 1 sirve) y haz clic en «Enable».',
        'Abre «Credentials» y haz clic en «+ Create credentials» → «API key».',
        'Google pide una restricción de API: en «API restrictions» selecciona «Fact Check Tools API», haz clic en «Create» y copia la clave.',
        'Vuelve aquí y pega la clave abajo.',
      ],
    },
    showMe: 'Muéstrame dónde hacer clic',
    pasteLabel: 'Pega la clave aquí',
    checking: 'Comprobando la clave…',
    works: 'Funciona',
    retry: 'Comprobar de nuevo',
    problems: {
      empty: 'Pega primero una clave.',
      wrong_key: 'Esta clave no es correcta. Cópiala de nuevo, entera y sin espacios.',
      wrong_api:
        'Esta clave es de otro servicio de Google. Crea una clave nueva con el botón de esta tarjeta.',
      restricted:
        'Esta clave está limitada a otros sitios web o aplicaciones. Crea una clave nueva sin esa limitación.',
      api_not_enabled:
        'La clave es correcta, pero este servicio aún no está activado en tu proyecto de Google.',
      quota:
        'Esta clave ha alcanzado su límite por ahora. Espera un minuto y vuelve a intentarlo, o mañana.',
      offline: 'No hay conexión a Internet. Comprueba tu conexión y vuelve a intentarlo.',
      model:
        'El modelo de IA elegido no está disponible para esta clave. Mantén el modelo estándar en Ajustes.',
      unknown: 'Algo salió mal al comprobar la clave. Vuelve a intentarlo en un momento.',
    },
    enableButton: 'Activarlo (un clic)',
    doneButton: 'Listo, abrir un vídeo de YouTube',
    doneButtonApp: 'Listo, analizar un vídeo',
    doneWaiting: 'Ambas claves necesitan primero una marca verde.',
    privacy: 'Tus claves se quedan en este dispositivo y solo se envían a Google.',
    setupNotFinished: 'Configuración sin terminar',
    setupMissing: (p) => `Añade tu clave de ${p} y tu clave de Fact Check para analizar vídeos.`,
    setupMissingAi: (p) => `Añade tu clave de ${p} para analizar vídeos.`,
    setupMissingFactcheck:
      'Añade tu clave de Fact Check para que las afirmaciones también se comparen con verificaciones oficiales.',
    finishSetup: 'Terminar la configuración',
    setupGuide: 'Guía de configuración',
    otherAi: '¿Prefieres Claude? Puedes elegirlo más tarde en Ajustes.',
  },

  errors: {
    auth: (p) =>
      `La clave API de ${p} no es válida o no tiene acceso. Comprueba la clave en los ajustes.`,
    quota: (p) =>
      `Se ha agotado la cuota o el crédito de ${p}. Vuelve a intentarlo más tarde o revisa tu cuenta.`,
    rate_limit: (p) =>
      `${p} está saturado o se ha alcanzado el límite por minuto. Espera un minuto y vuelve a intentarlo.`,
    bad_request: (p) => `${p} rechazó la solicitud.`,
    model_not_found: (p) =>
      `El modelo de ${p} indicado en los ajustes no existe. Elige otro modelo.`,
    video_unavailable: (p) => `${p} no puede abrir este vídeo (solo vídeos públicos).`,
    refusal: (p) => `${p} se negó a analizar este vídeo.`,
    truncated: (p) => `La respuesta de ${p} se cortó. Vuelve a intentarlo.`,
    network: () =>
      'No hay conexión con el servicio de IA. Comprueba tu conexión a Internet y vuelve a intentarlo.',
    timeout: () => 'El servicio de IA no respondió a tiempo. Vuelve a intentarlo.',
    aborted: () => 'El análisis se ha detenido.',
    parse: () => 'No se pudo leer la respuesta de la IA. Vuelve a intentarlo.',
    server: (p) => `${p} tuvo un problema de servidor. Vuelve a intentarlo más tarde.`,
    unknown: () => 'Error desconocido durante la evaluación.',
  },
};
