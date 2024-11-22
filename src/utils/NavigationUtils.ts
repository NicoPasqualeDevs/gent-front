import { NavigateFunction } from 'react-router-dom';
import { 
  ROOT_PATHS, 
  NavigationType,
  NavigationConfig,
  NAVIGATION_CONFIG,
  buildBreadcrumbs,
  NavigationExtraData,
} from './NavigationConfig';
import { PathData } from "@/types/Pathbar";

interface NavigationOptions {
  replace?: boolean;
  updateBreadcrumbs?: boolean;
}

// Separamos los tipos base de navegación
interface BaseNavigationParams {
  label?: string;
  extraData?: NavigationExtraData;
}

// Extendemos para parámetros dinámicos
type NavigationParams = BaseNavigationParams & {
  [key: string]: string | NavigationExtraData | undefined;
};

// Función helper para validar parámetros requeridos
const validateParams = (config: NavigationConfig, params: NavigationParams) => {
  if (!config.requiresParams) return true;
  
  return config.paramKeys?.every(key => {
    if (!params[key]) {
      throw new Error(`Parameter ${key} is required`);
    }
    return true;
  });
};

// Función helper para construir la ruta
const buildPath = (config: NavigationConfig, params: NavigationParams): string => {
  let path = config.path;
  config.paramKeys?.forEach(key => {
    const value = params[key];
    if (typeof value === 'string') {
      path = path.replace(`:${key}`, value);
    }
  });
  return path;
};

// Función helper para filtrar y convertir parámetros
const filterStringParams = (params: NavigationParams): Record<string, string> => {
  const filtered: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string') {
      filtered[key] = value;
    }
  });
  return filtered;
};

// Actualizamos la interfaz del contexto con el tipo correcto
interface NavigationContext {
  replacePath: (breadcrumbs: PathData[]) => void;
}

// Función helper para navegar y actualizar breadcrumbs
const navigateWithBreadcrumbs = (
  navigate: NavigateFunction,
  type: NavigationType,
  params: NavigationParams,
  context: NavigationContext,
  options?: NavigationOptions
) => {
  const config = NAVIGATION_CONFIG[type];
  
  validateParams(config, params);
  const path = buildPath(config, params);
  
  navigate(path, { replace: options?.replace });
  
  if (options?.updateBreadcrumbs !== false) {
    const stringParams = filterStringParams(params);
    const breadcrumbs = buildBreadcrumbs(type, stringParams, params.extraData);
    context.replacePath(breadcrumbs);
  }
};

// Funciones de autenticación
export const authNavigationUtils = {
  postAuthRedirect: (navigate: NavigateFunction, options?: NavigationOptions) => {
    navigate(ROOT_PATHS.BUILDER, { replace: options?.replace ?? true });
  },
  
  postRegisterRedirect: (navigate: NavigateFunction, options?: NavigationOptions) => {
    navigate(ROOT_PATHS.BUILDER, { replace: options?.replace ?? true });
  },
  
  toLogin: (navigate: NavigateFunction) => 
    navigate(`${ROOT_PATHS.AUTH}/login`),
    
  toRegister: (navigate: NavigateFunction) => 
    navigate(`${ROOT_PATHS.BUILDER}/register-user`)
};

// Funciones del builder
export const builderNavigationUtils = {
  toAiTeamsList: (navigate: NavigateFunction, context: NavigationContext, options?: NavigationOptions) => 
    navigateWithBreadcrumbs(navigate, 'teams', {}, context, options),
    
  toAiTeamForm: (
    navigate: NavigateFunction,
    context: NavigationContext, 
    params: { aiTeamId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'agents', params, context, options),
    
  toAgentsList: (
    navigate: NavigateFunction,
    context: NavigationContext, 
    params: { aiTeamId: string; clientName: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'agents', params, context, options),
    
  toAgentContext: (
    navigate: NavigateFunction,
    context: NavigationContext, 
    params: { aiTeamId: string; agentId?: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'context', params, context, options),
  
  toChat: (
    navigate: NavigateFunction, 
    context: NavigationContext, 
    params: { agentId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'chat', params, context, options),
  
  toWidget: (
    navigate: NavigateFunction, 
    context: NavigationContext, 
    params: { agentId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'widget', params, context, options),
  
  toToolsForm: (
    navigate: NavigateFunction, 
    context: NavigationContext, 
    params: { aiTeamId: string; agentId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'tools', params, context, options),
  
  toToolsRelation: (
    navigate: NavigateFunction, 
    context: NavigationContext, 
    params: { aiTeamId: string; agentId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'tools', params, context, options)
}; 