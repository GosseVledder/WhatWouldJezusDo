import type { Messages } from './messages';

export const pt: Messages = {
  locale: 'pt-PT',
  languageNames: {
    nl: 'neerlandês',
    en: 'inglês',
    de: 'alemão',
    fr: 'francês',
    es: 'espanhol',
    it: 'italiano',
    pt: 'português',
  },

  view: {
    switchAria: 'Ligar ou desligar o WWJD',
    turnOff: 'Desligar o WWJD',
    turnOn: 'Ligar o WWJD',
    showDetails: 'Mostrar fundamentação ▼',
    hideDetails: 'Ocultar fundamentação ▲',
    jesusAlignment: 'Alinhamento com Jesus',
    section1Title: '1. Verificação de factos e Integridade (Atividade 1)',
    summaryTitle: 'Resumo',
    checkedFacts: 'Factos verificados',
    coreActivity: 'Núcleo da atividade:',
    sentimentAndAttitude: 'Sentimento e atitude:',
    subjectLabel: 'Tema',
    presenterLabel: 'Apresentador',
    presenterRole: 'Papel:',
    presenterConduct: 'Conduta:',
    presenterIsSubject: 'O apresentador é o próprio tema do vídeo.',
    speakers: {
      presenter: 'apresentador',
      subject: 'tema',
      other: 'outro',
    },
    contradictionAlert: 'Autocontradição detetada (= mentir por definição):',
    statementLabel: 'Declaração:',
    factcheckLabel: 'Verificação:',
    sourcesLabel: 'Fonte(s):',
    noSource: 'Nenhuma fonte externa encontrada: verificado apenas pela IA.',
    otherSources: 'Outras fontes consultadas:',
    verdicts: {
      bevestigd: 'confirmado',
      ontkracht: 'refutado',
      tegenspraak: 'contradição',
      gemengd_of_context: 'misto / contexto',
      opinie: 'opinião',
    },
    section2Title: (n) =>
      `2. História e factos: avaliação segundo os ensinamentos de Jesus (${n} pontos relevantes ponderados)`,
    section3Title: (n) =>
      `3. Apresentador: avaliação segundo os ensinamentos de Jesus (${n} pontos relevantes ponderados)`,
    presenterScore: 'Apresentador',
    subjectScore: 'História e factos',
    aspectAll: 'Tudo',
    aspectFilterAria: 'Filtrar a fundamentação',
    linkedToMoment: 'Ligado ao momento:',
    fromCache: (d) => `Da cache · ${d}`,
    justAnalyzed: 'Acabado de analisar',
    off: 'O WWJD está desligado: não são feitas análises.',
    analyzeVideo: 'Analisar vídeo',
    loadingStep:
      'A verificar factos e a avaliar o vídeo segundo os ensinamentos de Jesus e os Dez Mandamentos…',
    progressSteps: {
      transcript: 'A obter a transcrição',
      analyse: 'A verificar os factos, resumir e pontuar',
      factcheck: 'A procurar verificações oficiais',
      reconcile: 'A atualizar as pontuações com as verificações',
    },
    usuallyTakes: (d) => `normalmente ~${d}`,
    openSettings: 'Abrir definições',
    retry: 'Tentar novamente',
    refresh: 'Analisar novamente',
    verifiedVia: (pub, rating) => `[Verificado via ${pub} (classificação: «${rating}»)]`,
  },

  settings: {
    title: 'Definições',
    loading: 'A carregar…',
    autoSaved: 'As definições são guardadas imediatamente.',
    saved: 'Guardado',
    languageHeading: 'Idioma',
    languageLabel: 'Idioma (interface, análise e referências bíblicas)',
    languageHint:
      'Define o idioma da interface, da análise de IA e dos textos bíblicos associados.',
    aiService: 'Serviço de IA',
    providerHint:
      'A utilização do What Would Jezus Do é totalmente gratuita: escolha para o LLM ou uma chave Gemini gratuita, ou uma chave Gemini paga, ou uma chave Claude paga, e para a verificação de factos uma chave Google Fact Check gratuita.',
    apiKey: 'Chave de API',
    apiKeyOf: (p) => `Chave de API ${p}`,
    modelOf: (p) => `Modelo ${p}`,
    show: 'Mostrar',
    hide: 'Ocultar',
    keyHintBrowser: ['Crie uma chave em ', '. A chave fica apenas neste navegador.'],
    keyHintDevice: ['Crie uma chave em ', '. A chave é guardada encriptada neste dispositivo.'],
    keyStepsTitle: 'Como obtenho uma chave?',
    keySteps: {
      gemini: [
        'Abra {site} e inicie sessão com a sua conta Google.',
        'Aceite os termos (só da primeira vez).',
        'Já aparece uma chave? É a sua. Caso contrário, clique em «Create API key» (escolha ou importe um projeto se for pedido).',
        'Copie a chave (começa por AIza ou AQ.) e cole-a acima em Chave de API.',
        'Clique em «Testar ligação».',
      ],
      claude: [
        'Abra {site} e crie uma conta ou inicie sessão.',
        'Compre crédito em «Billing» (pré-pago); de preferência, defina também um limite de gastos.',
        'Escolha «Create key» nas chaves de API e dê um nome à chave.',
        'Copie a chave (começa por sk-ant-) de imediato: só é mostrada uma vez. Cole-a acima em Chave de API.',
        'Clique em «Testar ligação».',
      ],
      factcheck: [
        'Abra {site} e inicie sessão com a sua conta Google (sem necessidade de cartão de crédito).',
        'Escolha no topo um projeto existente ou clique em «New Project» e dê-lhe o nome p. ex. WWJD.',
        'Abra a Fact Check Tools API na biblioteca de APIs (console.cloud.google.com/apis/library/factchecktools.googleapis.com) e clique em «Enable».',
        'Vá a «Credentials», clique em «+ Create credentials» → «API key», selecione «Fact Check Tools API» em «API restrictions» e clique em «Create». Copie a chave (começa por AIza) e cole-a acima.',
        'Clique em «Testar ligação».',
      ],
    },
    keyCost: {
      gemini:
        'Gratuito enquanto não associar faturação (billing) ao projeto Google. A Google define um limite por minuto e por dia (o limite diário recomeça à meia-noite, hora do Pacífico); o AI Studio mostra os seus limites. Cada vídeo novo custa uma chamada; um vídeo já analisado não custa nada.',
      claude: 'Pago: cada análise é descontada do seu crédito. Sem crédito, a chave não funciona.',
      factcheck:
        'Gratuito, sem cartão de crédito. A Google define um limite de utilização por projeto; pode vê-lo na página «Quotas» do Google Cloud. Serve para verificar afirmações diretamente junto de organizações de verificação de factos reconhecidas em todo o mundo.',
    },
    keyModels: {
      gemini:
        'Grátis via AI Studio: os modelos Flash e Flash-Lite (gemini-flash-latest, gemini-3.8-flash, gemini-flash-lite-latest). Pagos: os modelos Pro (gemini-pro-latest); só funcionam com faturação.',
      claude: 'Todos os modelos Claude são pagos; o Haiku é o mais barato e o Opus o mais caro.',
      factcheck:
        'Use uma chave separada: as chaves do AI Studio só funcionam com o Gemini. Crie esta chave no Google Cloud, num projeto com a Fact Check Tools API ativada.',
    },
    model: 'Modelo',
    testConnection: 'Testar ligação',
    busy: 'Um momento…',
    factcheckHeading: 'Verificação de factos (Google Fact Check API)',
    factcheckToggle: 'Usar a Google Fact Check Tools API',
    factcheckHint:
      'Pesquisa rapidamente verificações de factos oficiais existentes de organizações reconhecidas em todo o mundo.',
    factcheckKeyLabel: 'Chave de API Fact Check',
    factcheckKeyHintBrowser: [
      'Crie uma chave gratuita em ',
      '. A chave fica apenas neste navegador.',
    ],
    factcheckKeyHintDevice: [
      'Crie uma chave gratuita em ',
      '. A chave é guardada encriptada neste dispositivo.',
    ],
    evalHeading: 'Análise e visualização',
    displayHeading: 'Visualização',
    activeLabel: 'Extensão ativa no YouTube',
    activeHint: 'Desligado: o painel WWJD no YouTube está desativado.',
    autoLabel: 'Analisar automaticamente ao abrir um vídeo',
    autoHint: 'Desligado: clique em «Analisar vídeo» no painel.',
    collapsedLabel: 'Recolher fundamentação por predefinição',
    collapsedHint: 'Mostrar primeiro apenas a pontuação final (0–10) e a conclusão curta.',
    liveLabel: 'Modo ao vivo sincronizado',
    liveHint: 'Durante a reprodução, o painel destaca o que está a ser dito e desloca-se até lá.',
    overlayLabel: 'Sobreposição no vídeo',
    overlayHint:
      'Mostra também um pequeno cartão tipo legenda no vídeo em cada momento verificado.',
    tipLabel: 'Explicação',
    cacheHeading: 'Cache',
    savedAnalyses: 'Análises guardadas',
    cacheText: 'Cada vídeo é analisado uma só vez por idioma; depois, a análise vem da cache.',
    clearCache: 'Limpar cache',
    clear: 'Apagar',
    cacheCount: (n) => (n === 1 ? '1 análise guardada' : `${n} análises guardadas`),
    analysisCount: (n) => (n === 1 ? '1 análise' : `${n} análises`),
    confirmClear: 'Apagar todas as análises guardadas?',
    advanced: 'Avançado',
    debugHeading: 'Registo de depuração',
    debugCheck: 'Registar por chamada o fornecedor, o modelo, o tamanho, a duração e os tokens',
    showLog: 'Mostrar registo',
    clearLog: 'Apagar registo',
    logEmpty: 'Ainda não há chamadas registadas.',
    logHead: [
      'Hora',
      'Vídeo',
      'Passo',
      'Fornecedor',
      'Modelo',
      'Entrada (caracteres)',
      'Duração',
      'Tokens entrada/saída',
      'Erro',
    ],
  },

  tips: {
    language: 'Escolha o idioma para a interface, a análise de IA e as referências bíblicas.',
    provider:
      'Que IA analisa o vídeo e o avalia segundo os 25 ensinamentos de Jesus. O Gemini pode ser usado gratuitamente (com um limite diário); o Claude paga-se por análise.',
    apiKey:
      'Um código secreto com que o WWJD usa o serviço de IA em seu nome; os eventuais custos vão para a sua conta. A chave fica neste dispositivo e só é enviada para esse serviço.',
    model:
      'O modelo de IA que cria a análise. Mantenha o predefinido, a não ser que queira experimentar outro; «Testar ligação» verifica se existe. Com uma chave Gemini gratuita só funcionam os modelos Flash e Flash-Lite; o Pro exige faturação.',
    factcheck:
      'A Google Fact Check Tools API pesquisa rapidamente milhares de verificações de organizações reconhecidas (como Reuters, AP, PolitiFact). Se não houver verificação prévia para uma afirmação, a IA realiza uma análise histórica dos factos.',
    factcheckKey:
      'Uma chave de API gratuita da Google Cloud Console para chamar a Fact Check Tools API. A chave fica neste dispositivo e só é enviada à Google.',
    actief:
      'Ligado: o painel WWJD aparece nas páginas de vídeos do YouTube. Desligado: a extensão não faz nada no YouTube.',
    auto: 'Ligado: cada vídeo que abre é analisado de imediato; um vídeo novo custa uma chamada à IA. Desligado: só quando clica em «Analisar vídeo».',
    collapsed:
      'Ligado: mostra primeiro apenas a pontuação de Jesus (0–10) e a conclusão curta; expanda a verificação completa e as referências bíblicas quando as quiser ler.',
    live: 'Ativado: cada verificação e cada ponto do ensino de Jesus acende no momento em que é dito no vídeo, e o painel desloca-se até lá. Se fizer scroll, espera alguns segundos.',
    overlay:
      'Ativado: na parte inferior do vídeo aparece durante alguns segundos um cartão pequeno e discreto com o veredicto em cada momento verificado. Desativado: só o painel acompanha o vídeo.',
    updates:
      'Procura no GitHub a versão mais recente do WWJD. Não são enviadas chaves nem outros dados.',
    cache:
      'Cada análise é guardada, por isso voltar a abrir o mesmo vídeo não custa nada. Limpar remove todas as análises guardadas; as suas chaves e definições mantêm-se.',
    debug:
      'Para resolver problemas: regista por cada chamada à IA que modelo foi usado, quanto tempo demorou e quantos tokens custou. A sua chave nunca é incluída.',
  },

  update: {
    heading: 'Atualizações',
    installed: (v) => `Versão instalada: ${v}`,
    check: 'Procurar atualizações',
    checking: 'A verificar…',
    upToDate: 'Tem a versão mais recente.',
    available: (v) => `A versão ${v} está disponível.`,
    none: 'Ainda não foi encontrada nenhuma versão no GitHub.',
    failed: (e) => `A verificação falhou: ${e}`,
    whatsNew: 'Novidades',
    download: (v) => `Transferir a versão ${v}`,
    extensionSteps: [
      'Transfira o zip com a nova versão.',
      'Extraia-o por cima da pasta do WWJD (substitua os ficheiros).',
      'Clique em Recarregar; esta página volta a abrir-se.',
    ],
    reload: 'Recarregar',
    downloadInstall: 'Transferir e instalar',
    downloading: 'A transferir…',
    opening: 'A abrir a instalação…',
    installHint:
      'Na primeira vez, o Android pede-lhe que permita instalações a partir do WWJD; depois, se necessário, toque novamente neste botão. As suas chaves, definições e análises são mantidas.',
    checksumFailed: 'O ficheiro transferido não corresponde (SHA-256). Tente novamente.',
    downloadFailed: (e) => `A transferência falhou: ${e}`,
  },

  extension: {
    actionTitle: 'WWJD – definições',
    disabledError: 'A análise WWJD está desativada nas definições da extensão.',
    noKeyError: (p) =>
      `Nenhuma chave de API encontrada para ${p}. Introduza a sua chave nas definições do WWJD.`,
    noTranscriptError: (r) => `Não foi possível obter a transcrição para este vídeo (${r}).`,
    unknownError: 'Erro desconhecido durante a avaliação.',
  },

  app: {
    analysisTitle: 'Análise',
    shareAction: 'Partilhar → WWJD',
    back: 'Voltar',
    settings: 'Definições',
    showPlayer: 'Mostrar o leitor do YouTube',
    hidePlayer: 'Ocultar o leitor do YouTube',
    pastePlaceholder: 'Cole uma ligação do YouTube',
    linkAria: 'Ligação do YouTube ou ID do vídeo',
    notRecognized: 'Nenhum vídeo do YouTube reconhecido nesta ligação.',
    shareHint: ['Na aplicação do YouTube, toque em ', '.'],
    analyzeButton: 'Analisar',
    recent: 'Recentes',
    noAnalyses: 'Ainda não há análises.',
    deleteAnalysis: 'Eliminar análise',
    shareNoVideo: 'Não foi encontrado nenhum vídeo do YouTube no que partilhou.',
    cannotPlay: (c) => `O vídeo não pode ser reproduzido aqui (erro ${c}).`,
    openInYouTube: 'Abrir no YouTube',
    seekTitle: (t) => `Ir para ${t} no vídeo`,
    playerOff: 'O leitor do YouTube está desligado.',
    showPlayerAndSeek: (t) => `Mostrar o leitor e ir para ${t}`,
    openInYouTubeAt: (t) => `Abrir na aplicação do YouTube em ${t}`,
    openedInYouTube: (t) => `O YouTube salta para ${t}`,
    cancel: 'Cancelar',
  },
  onboarding: {
    title: 'Boas-vindas ao What Would Jezus Do',
    intro: 'Duas chaves gratuitas da Google e pode começar. Demora cerca de 3 minutos.',
    geminiTitle: '1. Chave Gemini',
    geminiText:
      'O Gemini é a IA que verifica os factos e compara o vídeo com os ensinamentos de Jesus. A chave é gratuita.',
    geminiButton: 'Criar chave Gemini',
    factcheckTitle: '2. Chave Fact Check',
    factcheckText:
      'Procura verificações oficiais de organizações como a Reuters e a AP. Esta chave também é gratuita.',
    factcheckButton: 'Criar chave Fact Check',
    steps: {
      gemini: [
        'Clique no botão acima, inicie sessão com a sua conta Google e aceite os termos se a Google pedir.',
        'Já aparece uma chave? É a sua. Caso contrário, clique em «Create API key» (escolha ou importe um projeto se a Google pedir).',
        'Copie a chave com o ícone de copiar ao lado.',
        'Volte aqui e cole a chave abaixo.',
      ],
      factcheck: [
        'Clique no botão acima e inicie sessão com a mesma conta Google.',
        'No topo, escolha um projeto (o do cartão 1 serve) e clique em «Enable».',
        'Abra «Credentials» e clique em «+ Create credentials» → «API key».',
        'A Google pede uma restrição de API: em «API restrictions» selecione «Fact Check Tools API», clique em «Create» e copie a chave.',
        'Volte aqui e cole a chave abaixo.',
      ],
    },
    showMe: 'Mostre-me onde clicar',
    pasteLabel: 'Cole a chave aqui',
    checking: 'A verificar a chave…',
    works: 'Funciona',
    retry: 'Verificar novamente',
    problems: {
      empty: 'Cole primeiro uma chave.',
      wrong_key: 'Esta chave não está correta. Copie-a novamente, completa e sem espaços.',
      wrong_api:
        'Esta chave pertence a outro serviço Google. Crie uma nova chave com o botão deste cartão.',
      restricted:
        'Esta chave está limitada a outros sites ou apps. Crie uma nova chave sem essa limitação.',
      api_not_enabled:
        'A chave está correta, mas este serviço ainda não está ativado no seu projeto Google.',
      quota:
        'Esta chave atingiu o limite por agora. Aguarde um minuto e tente novamente, ou amanhã.',
      offline: 'Sem ligação à Internet. Verifique a ligação e tente novamente.',
      model:
        'O modelo de IA escolhido não está disponível para esta chave. Mantenha o modelo padrão nas Definições.',
      unknown: 'Algo correu mal ao verificar a chave. Tente novamente daqui a pouco.',
    },
    enableButton: 'Ativar (um clique)',
    doneButton: 'Pronto, abrir um vídeo do YouTube',
    doneButtonApp: 'Pronto, analisar um vídeo',
    doneWaiting: 'Ambas as chaves precisam primeiro de um visto verde.',
    privacy: 'As suas chaves ficam neste dispositivo e só são enviadas para a Google.',
    setupNotFinished: 'Configuração por concluir',
    setupMissing: (p) => `Adicione a sua chave ${p} e a sua chave Fact Check para analisar vídeos.`,
    setupMissingAi: (p) => `Adicione a sua chave ${p} para analisar vídeos.`,
    setupMissingFactcheck:
      'Adicione a sua chave Fact Check para que as afirmações também sejam comparadas com verificações oficiais.',
    finishSetup: 'Concluir a configuração',
    setupGuide: 'Guia de configuração',
    otherAi: 'Prefere o Claude? Pode escolhê-lo mais tarde nas Definições.',
  },

  errors: {
    auth: (p) =>
      `A chave API de ${p} não é válida ou não tem acesso. Verifique a chave nas definições.`,
    quota: (p) =>
      `A quota ou o crédito de ${p} esgotou-se. Tente novamente mais tarde ou verifique a sua conta.`,
    rate_limit: (p) =>
      `${p} está sobrecarregado ou o limite por minuto foi atingido. Aguarde um minuto e tente novamente.`,
    bad_request: (p) => `${p} recusou o pedido.`,
    model_not_found: (p) =>
      `O modelo ${p} indicado nas definições não existe. Escolha outro modelo.`,
    video_unavailable: (p) => `${p} não consegue abrir este vídeo (apenas vídeos públicos).`,
    refusal: (p) => `${p} recusou-se a analisar este vídeo.`,
    truncated: (p) => `A resposta de ${p} foi cortada. Tente novamente.`,
    network: () =>
      'Sem ligação ao serviço de IA. Verifique a ligação à Internet e tente novamente.',
    timeout: () => 'O serviço de IA não respondeu a tempo. Tente novamente.',
    aborted: () => 'A análise foi interrompida.',
    parse: () => 'Não foi possível ler a resposta da IA. Tente novamente.',
    server: (p) => `${p} teve um problema no servidor. Tente novamente mais tarde.`,
    unknown: () => 'Erro desconhecido durante a avaliação.',
  },
};
