export interface TranslationType {
  greeting: string;
  farewell: string;
  common: {
    errorLoadingData: string;
    errorSavingData: string;
    loading: string;
    saving: string;
    success: string;
    error: string;
    sessionExpired: string;
    errorConnection: string;
    apiKey: string;
    model: string;
    select: string;
  };
  actionAllower: {
    fieldRequired: string;
    confirmAction: string;
    confirmation: string;
    write: string;
    confirm: string;
    cancel: string;
  };
  leftMenu: {
    teams: string;
    registerTeam: string;
    registerUser: string;
    tools: string;
    workShop: string;
    logout: string;
    logoutSuccess: string;
  };
  aiTeamsForm: {
    editTitle: string;
    createTitle: string;
    teamName: string;
    address: string;
    description: string;
    edit: string;
    register: string;
    fieldRequired: string;
    successUpdate: string;
    successCreate: string;
    errorConnection: string;
    selectUser: string;
    noUsersAvailable: string;
    currentUser: string;
    saving: string;
    update: string;
    create: string;
    cancel: string;
    owner: string;
  };
  teamsList: {
    newAiTeam: string;
    searchPlaceholder: string;
    yourAiTeams: string;
    perPage: string;
    manageTeam: string;
    edit: string;
    delete: string;
    confirmDelete: string;
    deleteTeam: string;
    noTeamsFound: string;
    noTeamsToShow: string;
    teamsCount: string;
    successDelete: string;
    owner: string;
    noDescription: string;
    manage: string;
    comingSoon: string;
    noAddress: string;
    llmKeyBadge: string;
    noOwner: string;
  };
  agentsList: {
    agentsOf: string;
    tooltipsEnabled: string;
    tooltipsDisabled: string;
    searchPlaceholder: string;
    perPage: string;
    noAgentsFound: string;
    noAgentsToShow: string;
    createAgent: string;
    reloadData: string;
    agentsCount: string;
    errorConnection: string;
    errorMissingParams: string;
    deleteSuccess: string;
    noModelSpecified: string;
    testAgent: string;
    useAPI: string;
    widget: string;
    configuration: string;
    data: string;
    customization: string;
    tools: string;
    errorLoadingClient: string;
    errorDeletingBot: string;
    errorNoData: string;
    edit: string;
    created: string;
    implementation: string;
    deleteConfirmation: string;
    deletingAgent: string;
    deleteButton: string;
    manageButton: string;
    reloadButton: string;
    configureButton: string;
    copyWidget: string;
    widgetCopied: string;
    modelAI: string;
    errorNoResponse: string;
    errorInvalidData: string;
    errorInvalidDataFormat: string;
    errorUnknown: string;
  };
  chatView: {
    agentPanel: string;
    defaultAgentName: string;
    history: string;
    comingSoon: string;
    noMessages: () => string;
    inputPlaceholder: string;
    sendButton: string;
    finishSession: string;
    assistant: string;
    user: string;
    errorLoadingAgent: string;
    errorLoadingHistory: string;
    errorSendingMessage: string;
    errorClosingChat: string;
    errorCleaningChat: string;
    unexpectedError: string;
    errorLoadingData: string;
    historicalView: string;
    returnToCurrent: string;
    errorCreatingSession: string;
    errorNoConnection: string;
  };
  notFound: {
    title: string;
    message: string;
    redirectMessage: string;
  };
  login: {
    title: string;
    subtitle: string;
    version: string;
    rotatingTexts: string[];
    emailLabel: string;
    passwordLabel: string;
    loginButton: string;
    registerPrompt: string;
    registerLink: string;
    startButton: string;
    invalidEmail: string;
    invalidCredentials: string;
    fieldRequired: string;
    connectionError: string;
    invalidServerResponse: string;
  };
  toolsForm: {
    required: string;
    onlyPyFiles: string;
    createSuccess: string;
    updateSuccess: string;
    connectionError: string;
    fileError: string;
    editTool: string;
    createNewTool: string;
    toolName: string;
    toolType: string;
    instructions: string;
    toolFile: string;
    fileInput: string;
    update: string;
    create: string;
    edit: string;
    toolNotFound: string;
    toolNotFoundMessage: string;
    backToTools: string;
    aiTeam: string;
    fieldRequired: string;
    successUpdate: string;
    successCreate: string;
    errorConnection: string;
    editTitle: string;
    createTitle: string;
    selectUser: string;
    currentUser: string;
    cancel: string;
  };
  tools: {
    libraryTitle: string;
    relatedTitle: string;
    type: string;
    relateButton: string;
    unrelateButton: string;
    successRelate: string;
    successUnrelate: string;
    errorRelate: string;
    errorUnrelate: string;
    errorToken: string;
    errorLoading: string;
    createToolButton: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    noToolsFound: string;
    noToolsToShow: string;
    toolsCount: string;
    perPage: string;
    reloadData: string;
    manage: string;
    edit: string;
    delete: string;
    deleteConfirmation: string;
    deleteSuccess: string;
    deleteError: string;
    errorMissingParams: string;
    noToolsAvailable: string;
    noType: string;
    noRelatedTools: string;
    errorMissingBot: string;
  };
  contextEntry: {
    title: string;
    editTitle: string;
    createTitle: string;
    name: string;
    description: string;
    modelAI: string;
    saving: string;
    update: string;
    create: string;
    cancel: string;
    successUpdate: string;
    successCreate: string;
    errorConnection: string;
    fieldRequired: string;
    errorMissingTeamId: string;
    errorMissingagentId: string;
  };
  dataEntry: {
    title: string;
    editTitle: string;
    context: string;
    documents: string;
    upload: string;
    saving: string;
    update: string;
    cancel: string;
    successUpdate: string;
    errorConnection: string;
    fieldRequired: string;
    dragAndDrop: string;
    maxSize: string;
    invalidType: string;
    uploadError: string;
    uploadProgress: string;
    removeFile: string;
    uploadSuccess: string;
    knowledgeKey: string;
    knowledgeKeyHelper: string;
    knowledgeSet: string;
    addKnowledgeSet: string;
    searchKnowledge: string;
    noKnowledgeFound: string;
    noKnowledgeSets: string;
  };
  header: {
    profile: string;
  };
  auth: {
    register: string;
    login: string;
    logout: string;
    registerTitle: string;
    registerSuccess: string;
    registerError: string;
  };
  widgetCustomizer: {
    title: string;
    tabs: {
      colors: string;
      typography: string;
      images: string;
      security: string;
      greetings: string;
      data: string;
    };
    colors: {
      primaryColor: string;
      primaryTextContrast: string;
      secondaryColor: string;
      secondaryTextContrast: string;
      badgeColor: string;
      badgeContrast: string;
    };
    typography: {
      fontFamily: string;
      fontFamilyPlaceholder: string;
      faqQuestions: string;
      faqQuestionsPlaceholder: string;
      bannedWords: string;
      bannedWordsPlaceholder: string;
    };
    images: {
      brandAlt: string;
      brandAltPlaceholder: string;
      brandLogo: string;
      botIcon: string;
      chatIcon: string;
      hiddenIcon: string;
      sendIcon: string;
    };
    security: {
      sqlInjection: string;
      phpInjection: string;
      strangeChars: string;
    };
    greetings: {
      newMessage: string;
      update: string;
      delete: string;
      create: string;
    };
    actions: {
      save: string;
      saveColors: string;
      saveTypography: string;
      saveImages: string;
      saveSecurity: string;
      saveGreetings: string;
      saveData: string;
    };
    messages: {
      updateSuccess: string;
      updateError: string;
      colorsSaved: string;
      typographySaved: string;
      imagesSaved: string;
      securitySaved: string;
      greetingsSaved: string;
      dataSaved: string;
    };
    inputs: {
      fontFamily: {
        label: string;
        placeholder: string;
        helperText: string;
      };
      faqQuestions: {
        label: string;
        placeholder: string;
        helperText: string;
      };
      bandList: {
        label: string;
        placeholder: string;
        helperText: string;
      };
      brandAlt: {
        label: string;
        placeholder: string;
        helperText: string;
      };
    };
    validation: {
      required: string;
      invalidColor: string;
      invalidFile: string;
      maxFileSize: string;
    };
    preview: {
      title: string;
      loading: string;
      error: string;
    };
  };
  robotCard: {
    agentStatus: string;
    widget: string;
    customization: string;
    useAPI: string;
    tools: string;
    edit: string;
    testAgent: string;
    delete: string;
    defaultStatus: string;
    statusOnline: string;
    statusOffline: string;
    statusBusy: string;
    statusError: string;
    statusUpdating: string;
    greetings: string[];
    helpTexts: {
      knowledge: string;
      widget: string;
      customization: string;
      api: string;
      tools: string;
      edit: string;
      test: string;
      monitor: string;
      delete: string;
    };
    configLLM: string;
    emptyApiKeys: string;
    errorLoadingApiKeys: string;
    knowledge: string;
    monitorAgent: string;
  };
}

export interface GreetingsType {
  [key: string]: string[];
}

export const greetings: GreetingsType = {
  en: [
    "Hello! How are you?",
    "Welcome! How can I help you?",
    "Greetings! How's your day going?",
    "Nice to see you! How are you doing?"
  ],
  es: [
    "¡Hola! ¿Cómo estás?",
    "¡Bienvenido! ¿En qué puedo ayudarte?",
    "¡Saludos! ¿Qué tal tu día?",
    "¡Qué gusto verte! ¿Cómo te va?"
  ],
  fr: [
    "Bonjour ! Comment allez-vous ?",
    "Bienvenue ! Comment puis-je vous aider ?",
    "Salutations ! Comment se passe votre journée ?",
    "Ravi de vous voir ! Comment ça va ?"
  ],
  de: [
    "Hallo! Wie geht es Ihnen?",
    "Willkommen! Wie kann ich Ihnen helfen?",
    "Grüß Gott! Wie läuft Ihr Tag?",
    "Schön Sie zu sehen! Wie geht es Ihnen?"
  ],
  br: [
    "Olá! Como você está?",
    "Bem-vindo! Em que posso ajudar?",
    "Saudações! Como está seu dia?",
    "Que bom ver você! Como vai?"
  ],
  hi: [
    "नमस्ते! आप कैसे हैं?",
    "स्वागत है! मैं आपकी कैसे मदद कर सका हूं?",
    "अभिवादन! आपका दि कैसा जा रहा है?",
    "आपको देखकर अच्छा लगा! आप कैसे हैं?"
  ]
};

export function getRandomGreeting(language: string): string {
  const langGreetings = greetings[language] || greetings.en;
  return langGreetings[Math.floor(Math.random() * langGreetings.length)];
}

export interface PathbarTranslations {
  home: string;
}

export interface LeftMenuTranslations {
  teams: string;
  registerTeam: string;
  registerUser: string;
  tools: string;
  workShop: string;
  logout: string;
  logoutSuccess: string;
}

export interface Translations {
  // ... otras interfaces existentes
  leftMenu: LeftMenuTranslations;
  pathbar: PathbarTranslations;
}

export interface ToolsTranslations {
  libraryTitle: string;
  relatedTitle: string;
  type: string;
  relateButton: string;
  unrelateButton: string;
  successRelate: string;
  successUnrelate: string;
  errorRelate: string;
  errorUnrelate: string;
  errorToken: string;
  errorLoading: string;
  createToolButton: string;
  title: string;
  description: string;
  searchPlaceholder: string;
  noToolsFound: string;
  noToolsToShow: string;
  toolsCount: string;
  perPage: string;
  reloadData: string;
  manage: string;
  edit: string;
  delete: string;
  deleteConfirmation: string;
  deleteSuccess: string;
  deleteError: string;
  errorMissingParams: string;
  noToolsAvailable: string;
  noType: string;
  noRelatedTools: string;
  errorMissingBot: string;
} 