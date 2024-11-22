import { PathData } from "@/types/Pathbar";

// Definimos las rutas principales de la aplicación
export const ROOT_PATHS = {
  BUILDER: '/builder',
  AUTH: '/auth',
  HOME: '/home',
} as const;

// Definimos las subrutas del builder
export const BUILDER_PATHS = {
  AGENTS: 'agents',
  FORM: 'form',
  TOOLS: 'tools',
  WIDGET: 'widgetCustomizer',
  CONTEXT: 'contextEntry',
  CHAT: 'chat',
} as const;

// Tipo para extraData que coincida con PathData
export type NavigationExtraData = Record<string, string | number | boolean>;

// Definimos los tipos de navegación
export type NavigationType = 
  | 'teams'
  | 'agents'
  | 'tools'
  | 'widget'
  | 'context'
  | 'chat';

// Interface para la configuración de navegación
export interface NavigationConfig {
  path: string;
  translationKey: string;
  requiresParams?: boolean;
  paramKeys?: string[];
}

// Configuración de navegación
export const NAVIGATION_CONFIG: Record<NavigationType, NavigationConfig> = {
  teams: {
    path: ROOT_PATHS.BUILDER,
    translationKey: 'leftMenu.teams'
  },
  agents: {
    path: `${ROOT_PATHS.BUILDER}/${BUILDER_PATHS.AGENTS}/:clientName/:teamId`,
    translationKey: 'agentsList.agentsOf',
    requiresParams: true,
    paramKeys: ['clientName', 'teamId']
  },
  tools: {
    path: `${ROOT_PATHS.BUILDER}/${BUILDER_PATHS.AGENTS}/${BUILDER_PATHS.TOOLS}/:teamId/:clientName/:agentId`,
    translationKey: 'tools.type',
    requiresParams: true,
    paramKeys: ['teamId', 'clientName', 'agentId']
  },
  widget: {
    path: `${ROOT_PATHS.BUILDER}/${BUILDER_PATHS.AGENTS}/${BUILDER_PATHS.WIDGET}/:agentId`,
    translationKey: 'widgetCustomizer.title',
    requiresParams: true,
    paramKeys: ['agentId']
  },
  context: {
    path: `${ROOT_PATHS.BUILDER}/${BUILDER_PATHS.AGENTS}/${BUILDER_PATHS.CONTEXT}/:teamId/:agentId?`,
    translationKey: 'contextEntry.title',
    requiresParams: true,
    paramKeys: ['teamId', 'agentId']
  },
  chat: {
    path: `${ROOT_PATHS.BUILDER}/${BUILDER_PATHS.AGENTS}/${BUILDER_PATHS.CHAT}/:agentId`,
    translationKey: 'chatView.agentPanel',
    requiresParams: true,
    paramKeys: ['agentId']
  }
};

// Helper para construir PathData
export const buildPathData = (
  type: NavigationType,
  params?: Record<string, string>,
  extraData?: NavigationExtraData
): PathData => {
  const config = NAVIGATION_CONFIG[type];
  let currentPath = config.path;
  
  if (config.requiresParams && params) {
    config.paramKeys?.forEach(key => {
      currentPath = currentPath.replace(`:${key}`, params[key] || '');
    });
  }

  return {
    label: params?.label || '',
    current_path: currentPath,
    preview_path: type === 'teams' ? currentPath : '',
    translationKey: config.translationKey,
    extraData
  };
};

// Helper para construir breadcrumbs
export const buildBreadcrumbs = (
  type: NavigationType,
  params?: Record<string, string>,
  extraData?: NavigationExtraData
): PathData[] => {
  const breadcrumbs: PathData[] = [];
  
  // Siempre agregamos la ruta raíz (teams)
  breadcrumbs.push(buildPathData('teams'));

  switch (type) {
    case 'agents':
      if (params?.clientName && params?.teamId) {
        breadcrumbs.push(buildPathData('agents', params, extraData));
      }
      break;
      
    case 'tools':
      if (params?.clientName && params?.teamId) {
        breadcrumbs.push(buildPathData('agents', {
          clientName: params.clientName,
          teamId: params.teamId
        }));
        if (params?.agentId) {
          breadcrumbs.push(buildPathData('tools', params, extraData));
        }
      }
      break;
      
    case 'widget':
      if (params?.agentId) {
        breadcrumbs.push(buildPathData('widget', params, extraData));
      }
      break;

    case 'context':
      if (params?.teamId) {
        breadcrumbs.push(buildPathData('context', params, extraData));
      }
      break;

    case 'chat':
      if (params?.agentId) {
        breadcrumbs.push(buildPathData('chat', params, extraData));
      }
      break;
  }

  return breadcrumbs;
}; 