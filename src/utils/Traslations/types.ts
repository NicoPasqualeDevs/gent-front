export type TranslationType = {
  greeting: string;
  farewell: string;
  actionAllower: {
    fieldRequired: string;
    confirmAction: string;
    confirmation: string;
    write: string;
    confirm: string;
    cancel: string;
  };
  leftMenu: {
    aiTeams: string;
    registerTeam: string;
    logout: string;
    logoutSuccess: string;
    registerUser: string;
    tools: string;
    workShop: string;
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
  };
  aiTeamsList: {
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
  };
  iaPanel: {
    createAgent: string;
    searchPlaceholder: string;
    agentsOf: string;
    perPage: string;
    noAgentsFound: string;
    noAgentsToShow: string;
    agentsCount: string;
    testAgent: string;
    useAPI: string;
    widget: string;
    configuration: string;
    data: string;
    customization: string;
    tools: string;
    deleteSuccess: string;
    errorConnection: string;
    errorLoadingClient: string;
    errorDeletingBot: string;
    edit: string;
    created: string;
    implementation: string;
    reloadData: string;
    deleteConfirmation: string;
    deletingAgent: string;
    deleteButton: string;
    manageButton: string;
    reloadButton: string;
    configureButton: string;
    copyWidget: string;
    widgetCopied: string;
    modelAI: string;
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
  };
};

export type GreetingsType = {
  [key: string]: string[];
};

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
  ]
};

export const getRandomGreeting = (lang: string): string => {
  const langGreetings = greetings[lang] || greetings.en;
  return langGreetings[Math.floor(Math.random() * langGreetings.length)];
}; 