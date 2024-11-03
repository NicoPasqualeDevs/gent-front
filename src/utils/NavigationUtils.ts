import { NavigateFunction } from 'react-router-dom';

interface NavigationOptions {
  replace?: boolean;
}

interface BuilderNavigationParams {
  aiTeamId: string;
  botId?: string;
  clientName?: string;
  toolId?: string;
}

// Funciones de autenticación
export const authNavigationUtils = {
  postAuthRedirect: (navigate: NavigateFunction, options?: NavigationOptions) => {
    navigate('/builder', { replace: options?.replace ?? true });
  },
  
  postRegisterRedirect: (navigate: NavigateFunction, options?: NavigationOptions) => {
    navigate('/builder', { replace: options?.replace ?? true });
  },
  
  toLogin: (navigate: NavigateFunction) => 
    navigate('/auth/login'),
    
  toRegister: (navigate: NavigateFunction) => 
    navigate('/auth/register/new-user')
};

// Funciones del builder
export const builderNavigationUtils = {
  // Navegación principal
  toAiTeamsList: (navigate: NavigateFunction) => 
    navigate('/builder'),
    
  toAiTeamForm: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'aiTeamId'>) => {
    if (!params.aiTeamId) throw new Error('aiTeamId is required');
    navigate(`/builder/form/${params.aiTeamId}`);
  },
    
  // Navegación de agentes
  toAgentsList: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'aiTeamId' | 'clientName'>) => {
    if (!params.aiTeamId || !params.clientName) throw new Error('aiTeamId and clientName are required');
    navigate(`/builder/agents/${params.aiTeamId}/${params.clientName}`);
  },
    
  toAgentContext: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'aiTeamId' | 'botId'>) => {
    if (!params.aiTeamId) throw new Error('aiTeamId is required');
    navigate(`/builder/agents/contextEntry/${params.aiTeamId}/${params.botId || ''}`);
  },
  
  // Agregar nuevas funciones
  toChat: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'botId'>) => {
    if (!params.botId) throw new Error('botId is required');
    navigate(`/builder/agents/chat/${params.botId}`);
  },
  
  toWidget: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'aiTeamId' | 'botId'>) => {
    if (!params.aiTeamId || !params.botId) throw new Error('aiTeamId and botId are required');
    navigate(`/builder/agents/widgetCustomizer/${params.aiTeamId}/${params.botId}`);
  },
  
  toToolsForm: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'aiTeamId' | 'botId'>) => {
    if (!params.aiTeamId || !params.botId) throw new Error('aiTeamId and botId are required');
    navigate(`/builder/agents/tools/form/${params.aiTeamId}/${params.botId}`);
  },
  
  toToolsRelationship: (navigate: NavigateFunction, params: Pick<BuilderNavigationParams, 'aiTeamId' | 'botId'>) => {
    if (!params.aiTeamId || !params.botId) throw new Error('aiTeamId and botId are required');
    navigate(`/builder/agents/tools/relationship/${params.aiTeamId}/${params.botId}`);
  }
}; 