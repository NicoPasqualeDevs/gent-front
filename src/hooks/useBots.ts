import {
  NewGreetingData,
  PromptTemplateData,
  PromptTemplatePost,
  ToolData,
  ToolRelationshipData,
} from "./../types/Bots";
import useApi from "@/hooks/useApi.ts";
import {
  ChatHistory,
  UpdatedChatHistory,
  Ktag,
  AgentData,
  AgentMetaData,
  WidgetData,
  GetCustomGreetingData,
  CustomGreetingData,
  AiTeam,
  ConversationData,
} from "@/types/Bots";
import { ApiResponseList, ApiResponse } from "@/types/Api";

type MessageUp = {
  message: string;
};

type UseBotsApiHook = {
  // Gets
  getKnowledgeTags: (aiTeamId: string) => Promise<Ktag[]>;
  getChatHistory: (botId: string) => Promise<ChatHistory>;
  getAgentData: (botId: string) => Promise<ApiResponse<AgentData>>;
  getNoAuthAgentData: (botId: string) => Promise<AgentData>;
  getBotsList: (
    aiTeamId: string,
    filterParams: string
  ) => Promise<ApiResponseList<AgentData>>;
  getKtags: (botId: string) => Promise<Ktag[]>;
  getWidget: (botId: string) => Promise<WidgetData>;
  getCustomMessages: (botId: string) => Promise<GetCustomGreetingData>;
  getPromptTemplate: (botId: string) => Promise<PromptTemplateData>;
  getAllTools: () => Promise<ToolData[]>;
  getBotTools: (botId: string) => Promise<ToolData[]>;
  getTool: (toolId: string) => Promise<ToolData>;
  getClientTools: (user_id: string) => Promise<ApiResponse<ToolData[]>>;
  getMyClients: () => Promise<ApiResponseList<AiTeam>>;
  getBotConversations: (botId: string) => Promise<ApiResponseList<ConversationData>>;
  getClientConversations: () => Promise<ApiResponseList<ConversationData>>;
  getClientBotConversations: (botId: string) => Promise<ConversationData[]>;

  //Post
  createBot: (aiTeamId: string, data: AgentMetaData) => Promise<AgentData>;
  sendMessage: (botId: string, data: MessageUp) => Promise<UpdatedChatHistory>;
  saveKtag: (botId: string, data: Ktag) => Promise<Ktag>;
  postWidget: (botId: string, data: WidgetData) => Promise<WidgetData>;
  postCustomMessages: (data: NewGreetingData) => Promise<CustomGreetingData>;
  postPromptTemplate: (
    botId: string,
    data: PromptTemplatePost
  ) => Promise<PromptTemplateData>;
  postTool: (data: FormData) => Promise<ToolData>;
  setToolRelationship: (
    botId: string,
    data: ToolRelationshipData
  ) => Promise<unknown>;
  removeToolRelationship: (
    botId: string,
    data: ToolRelationshipData
  ) => Promise<unknown>;
  closeChat: (conversation_id: string) => Promise<void>;

  //Puts
  updateBot: (botId: string, data: AgentMetaData) => Promise<AgentData>;
  editKtag: (tagId: string, data: Ktag) => Promise<void>;
  putWidget: (botId: string, data: WidgetData) => Promise<WidgetData>;
  putCustomMessage: (
    messageId: string,
    data: CustomGreetingData
  ) => Promise<CustomGreetingData>;

  //patchs
  patchWidget: (widgetId: string, data: WidgetData) => Promise<WidgetData>;
  patchTool: (toolId: string, data: FormData) => Promise<ToolData>;

  //Deletes
  deleteBot: (botId: string) => Promise<Response>;
  deleteKtag: (KtagId: string) => Promise<Response>;
  deleteCustomMessage: (messageId: string) => Promise<Response>;
  deleteTool: (toolId: string) => Promise<Response>;

  // Nuevos métodos para herramientas
  addToolToBot: (botId: string, toolIds: number[]) => Promise<ApiResponse<unknown>>;
  removeToolFromBot: (botId: string, toolIds: number[]) => Promise<ApiResponse<unknown>>;
};

const useBotsApi = (): UseBotsApiHook => {
  const { apiPut, apiPost, apiGet, noAuthGet, apiDelete, apiPatch } = useApi();

  // GETS
  const getBotsList = (
    aiTeamId: string,
    filterParams: string
  ): Promise<ApiResponseList<AgentData>> => {
    const path = `api/team_details/bots/${aiTeamId}${filterParams}`;
    return apiGet<ApiResponseList<AgentData>>(path);
  };
  const getAgentData = (botId: string): Promise<ApiResponse<AgentData>> => {
    const path = `api/bot/modify/${botId}`;
    return apiGet<ApiResponse<AgentData>>(path);
  };
  const getNoAuthAgentData = (botId: string): Promise<AgentData> => {
    const path = `api/bot/modify/${botId}`;
    return noAuthGet<AgentData>(path);
  };
  const getChatHistory = (botId: string): Promise<ChatHistory> => {
    const path = `chat/api/${botId}`;
    return apiGet<ChatHistory>(path);
  };
  const getKnowledgeTags = (aiTeamId: string): Promise<Ktag[]> => {
    const path = `api/ktag/${aiTeamId}`;
    return apiGet<Ktag[]>(path);
  };
  const getKtags = (botId: string): Promise<Ktag[]> => {
    const path = `api/ktag/${botId}`;
    return apiGet<Ktag[]>(path);
  };
  const getWidget = (botId: string): Promise<WidgetData> => {
    const path = `api/widget/${botId}`;
    return apiGet<WidgetData>(path);
  };
  const getCustomMessages = (botId: string): Promise<GetCustomGreetingData> => {
    const path = `api/greetings/list-bot/${botId}`;
    return apiGet<GetCustomGreetingData>(path);
  };
  const getPromptTemplate = (botId: string): Promise<PromptTemplateData> => {
    const path = `api/bot/prompt/${botId}`;
    return apiGet<PromptTemplateData>(path);
  };
  const getAllTools = (): Promise<ToolData[]> => {
    const path = `api/tool/all`;
    return apiGet<ToolData[]>(path);
  };
  const getBotTools = (botId: string): Promise<ToolData[]> => {
    const path = `api/tool/list/${botId}`;
    return apiGet<ApiResponse<ToolData[]>>(path).then(response => response.data);
  };
  const getTool = (toolId: string): Promise<ToolData> => {
    const path = `api/tool/modify/${toolId}`;
    return apiGet<ToolData>(path);
  };
  const getClientTools = (user_id: string): Promise<ApiResponse<ToolData[]>> => {
    const path = `api/tool/user/${user_id}`;
    return apiGet<ApiResponse<ToolData[]>>(path);
  };
  const getMyClients = (): Promise<ApiResponseList<AiTeam>> => {
    const path = `api/team_details/my_clients/`;  // Actualizado el endpoint
    return apiGet<ApiResponseList<AiTeam>>(path);
  };

  // POST
  const createBot = (aiTeamId: string, data: AgentMetaData): Promise<AgentData> => {
    const path = `api/team_details/bots/${aiTeamId}`;
    return apiPost(path, data);
  };
  const sendMessage = (
    botId: string,
    data: MessageUp
  ): Promise<UpdatedChatHistory> => {
    const path = `chat/api/${botId}`;
    return apiPost(path, data);
  };
  const saveKtag = (botId: string, data: Ktag): Promise<Ktag> => {
    const path = `api/ktag/${botId}`;
    return apiPost(path, data);
  };
  const postWidget = (botId: string, data: WidgetData): Promise<WidgetData> => {
    const path = `api/widget/${botId}`;
    return apiPost(path, data);
  };
  const postCustomMessages = (
    data: NewGreetingData
  ): Promise<CustomGreetingData> => {
    const path = `api/greetings/create`;
    return apiPost(path, data);
  };
  const postPromptTemplate = (
    botId: string,
    data: PromptTemplatePost
  ): Promise<PromptTemplateData> => {
    const path = `api/bot/prompt/${botId}`;
    return apiPost(path, data);
  };
  const postTool = (data: FormData): Promise<ToolData> => {
    const path = `api/tool/create`;
    console.log('Posting tool to:', path);
    return apiPost(path, data, {
        // No establecer Content-Type, dejar que el navegador lo maneje
    });
  };
  const setToolRelationship = (
    botId: string,
    data: ToolRelationshipData
  ): Promise<unknown> => {
    const path = `api/bot/tools/${botId}`;
    return apiPost(path, data);
  };
  const removeToolRelationship = (
    botId: string,
    data: ToolRelationshipData
  ): Promise<unknown> => {
    const path = `api/bot/remove-tools/${botId}`;
    return apiPost(path, data);
  };
  const closeChat = (conversation_id: string): Promise<void> => {
    const path = `api/clean-chat/`;
    return apiPost(path, { conversation_id });
  };

  // PUT
  const updateBot = (botId: string, data: AgentMetaData): Promise<AgentData> => {
    const path = `api/bot/modify/${botId}`;
    return apiPut(path, data);
  };
  const editKtag = (tagId: string, data: Ktag): Promise<void> => {
    const path = `api/ktag/modify/${tagId}`;
    return apiPut(path, data);
  };
  const putWidget = (botId: string, data: WidgetData): Promise<WidgetData> => {
    const path = `api/widget/modify/${botId}`;
    return apiPut(path, data);
  };
  const putCustomMessage = (
    messageId: string,
    data: CustomGreetingData
  ): Promise<CustomGreetingData> => {
    const path = `api/greetings/${messageId}`;
    return apiPut(path, data);
  };

  //Patch
  const patchWidget = (
    widgetId: string,
    data: WidgetData
  ): Promise<WidgetData> => {
    const path = `api/widget/modify/${widgetId}`;
    return apiPatch(path, data);
  };
  const patchTool = (toolId: string, data: FormData): Promise<ToolData> => {
    const path = `api/tool/modify/${toolId}`;
    return apiPatch(path, data);
  };

  // DELETE
  const deleteBot = (botId: string): Promise<Response> => {
    const path = `api/bot/modify/${botId}`;
    return apiDelete(path);
  };
  const deleteKtag = (KtagId: string): Promise<Response> => {
    const path = `api/ktag/modify/${KtagId}`;
    return apiDelete(path);
  };
  const deleteCustomMessage = (messageId: string): Promise<Response> => {
    const path = `api/greetings/${messageId}`;
    return apiDelete(path);
  };
  const deleteTool = (toolId: string): Promise<Response> => {
    const path = `api/tool/modify/${toolId}`;
    return apiDelete(path);
  };

  // Nuevos métodos para herramientas
  const addToolToBot = (botId: string, toolIds: number[]): Promise<ApiResponse<unknown>> => {
    const path = `api/bot/tools/${botId}`;
    return apiPost(path, { agent_tool_ids: toolIds });
  };

  const removeToolFromBot = (botId: string, toolIds: number[]): Promise<ApiResponse<unknown>> => {
    const path = `api/bot/remove-tools/${botId}`;
    return apiPost(path, { agent_tool_ids: toolIds });
  };

  // Nuevo método para obtener el historial de conversaciones
  const getBotConversations = (botId: string): Promise<ApiResponseList<ConversationData>> => {
    const path = `chat/api/conversations/${botId}`;
    return apiGet<ApiResponseList<ConversationData>>(path);
  };

  // Nuevo método para obtener todas las conversaciones del cliente
  const getClientConversations = (): Promise<ApiResponseList<ConversationData>> => {
    const path = `chat/api/conversations/`;
    return apiGet<ApiResponseList<ConversationData>>(path);
  };

  // Nuevo método para obtener las conversaciones de un bot específico
  const getClientBotConversations = (botId: string): Promise<ConversationData[]> => {
    const path = `chat/api/conversations/${botId}`;
    return apiGet<ConversationData[]>(path);
  };

  return {
    // Gets
    getKnowledgeTags,
    getChatHistory,
    getNoAuthAgentData,
    getAgentData,
    getBotsList,
    getKtags,
    getWidget,
    getCustomMessages,
    getPromptTemplate,
    getAllTools,
    getBotTools,
    getTool,
    getClientTools,
    getMyClients,
    getBotConversations,
    getClientConversations,
    getClientBotConversations,

    //Post
    createBot,
    sendMessage,
    saveKtag,
    postWidget,
    postCustomMessages,
    postPromptTemplate,
    postTool,
    setToolRelationship,
    removeToolRelationship,
    closeChat,

    //Put
    updateBot,
    editKtag,
    putWidget,
    putCustomMessage,

    //patch
    patchWidget,
    patchTool,

    //Delete
    deleteBot,
    deleteKtag,
    deleteCustomMessage,
    deleteTool,

    // Nuevos métodos para herramientas
    addToolToBot,
    removeToolFromBot,
  };
};

export default useBotsApi;
