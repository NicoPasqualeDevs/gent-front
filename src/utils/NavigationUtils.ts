import { NavigateFunction } from 'react-router-dom';
import { 
  ROOT_PATHS, 
  BUILDER_PATHS,
  NavigationType,
  NavigationConfig,
  NAVIGATION_CONFIG,
  buildBreadcrumbs,
  NavigationExtraData
} from './NavigationConfig';
import { useAppContext } from '@/context/app';

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

// Función helper para navegar y actualizar breadcrumbs
const navigateWithBreadcrumbs = (
  navigate: NavigateFunction,
  type: NavigationType,
  params: NavigationParams,
  options?: NavigationOptions
) => {
  const { replacePath } = useAppContext();
  const config = NAVIGATION_CONFIG[type];
  
  validateParams(config, params);
  const path = buildPath(config, params);
  
  navigate(path, { replace: options?.replace });
  
  if (options?.updateBreadcrumbs !== false) {
    const stringParams = filterStringParams(params);
    const breadcrumbs = buildBreadcrumbs(type, stringParams, params.extraData);
    replacePath(breadcrumbs);
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
  toAiTeamsList: (navigate: NavigateFunction, options?: NavigationOptions) => 
    navigateWithBreadcrumbs(navigate, 'aiTeams', {}, options),
    
  toAiTeamForm: (
    navigate: NavigateFunction, 
    params: { aiTeamId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'agents', params, options),
    
  toAgentsList: (
    navigate: NavigateFunction, 
    params: { aiTeamId: string; clientName: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'agents', params, options),
    
  toAgentContext: (
    navigate: NavigateFunction, 
    params: { aiTeamId: string; botId?: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'context', params, options),
  
  toChat: (
    navigate: NavigateFunction, 
    params: { botId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'chat', params, options),
  
  toWidget: (
    navigate: NavigateFunction, 
    params: { botId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'widget', params, options),
  
  toToolsForm: (
    navigate: NavigateFunction, 
    params: { aiTeamId: string; botId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'tools', params, options),
  
  toToolsRelationship: (
    navigate: NavigateFunction, 
    params: { aiTeamId: string; botId: string; label?: string }, 
    options?: NavigationOptions
  ) => navigateWithBreadcrumbs(navigate, 'tools', params, options)
}; 