import { ApiResponse } from "@/types/Api";
import { AgentData } from "@/types/Bots";
import useApi from "./api/useApi";

interface BotFormData {
  name: string;
  description: string;
  model_ai: string;
  [key: string]: string;
}

interface BotDataFormData {
  context: string;
  documents?: File[];
  [key: string]: string | File[] | undefined;
}

interface ChatHistory {
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

interface UpdatedChatHistoryType {
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

interface ConversationData {
  id: string;
  created_at: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

interface ToolRelationshipData extends Record<string, unknown> {
  agent_tool_ids: number[];
}

interface UseBotsApi {
  getBotDetails: (botId: string) => Promise<ApiResponse<AgentData>>;
  getBotsList: (aiTeamId: string, filterParams: string) => Promise<ApiResponse<AgentData[]>>;
  createBot: (data: BotFormData, teamId: string) => Promise<ApiResponse<AgentData>>;
  updateBot: (data: BotFormData, botId: string) => Promise<ApiResponse<AgentData>>;
  updateBotData: (data: BotDataFormData, botId: string) => Promise<ApiResponse<AgentData>>;
  deleteBot: (botId: string) => Promise<ApiResponse<void>>;
  uploadDocument: (file: File, botId: string, onProgress?: (progress: number) => void) => Promise<ApiResponse<void>>;
  getChatHistory: (botId: string) => Promise<ApiResponse<ChatHistory>>;
  sendMessage: (botId: string, data: { message: string }) => Promise<ApiResponse<UpdatedChatHistoryType>>;
  closeChat: (conversationId: string) => Promise<void>;
  getAgentData: (botId: string) => Promise<ApiResponse<AgentData>>;
  getClientBotConversations: (botId: string) => Promise<ConversationData[]>;
  postTool: (data: FormData) => Promise<unknown>;
  getAllTools: () => Promise<unknown>;
  getBotTools: (botId: string) => Promise<unknown>;
  setToolRelationship: (data: ToolRelationshipData) => Promise<unknown>;
  removeToolRelationship: (data: ToolRelationshipData) => Promise<unknown>;
}

const useBotsApi = (): UseBotsApi => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();

  const getBotDetails = (botId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`api/bot/${botId}/`);
  };

  const getBotsList = (aiTeamId: string, filterParams: string): Promise<ApiResponse<AgentData[]>> => {
    return apiGet(`api/bot/${aiTeamId}/${filterParams}`);
  };

  const createBot = (data: BotFormData, teamId: string): Promise<ApiResponse<AgentData>> => {
    if (!teamId) {
      throw new Error('Team ID is required');
    }
    
    const requiredFields = ['name', 'description', 'model_ai'];
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }

    const payload = {
      name: data.name,
      description: data.description,
      model_ai: data.model_ai,
      owner: teamId
    };

    return apiPost(`api/bot/${teamId}/`, payload);
  };

  const updateBot = (data: BotFormData, botId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`api/bot/${botId}/`, data);
  };

  const updateBotData = (data: BotDataFormData, botId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`api/bots/${botId}/data/`, data);
  };

  const deleteBot = (botId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`api/bot/${botId}/`);
  };

  const uploadDocument = async (
    file: File,
    botId: string,
  ): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiPost<void>(`api/bot/${botId}/upload/`, formData);
  };

  const getChatHistory = (botId: string): Promise<ApiResponse<ChatHistory>> => {
    return apiGet(`api/bot/${botId}/chat-history/`);
  };

  const sendMessage = async (botId: string, data: { message: string }): Promise<ApiResponse<UpdatedChatHistoryType>> => {
    return apiPost(`api/bot/${botId}/send-message/`, data);
  };

  const closeChat = async (conversationId: string): Promise<void> => {
    await apiDelete(`api/bot/close-chat/${conversationId}/`);
    return;
  };

  const getAgentData = (botId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`api/bot/${botId}/agent-data/`);
  };

  const getClientBotConversations = async (botId: string): Promise<ConversationData[]> => {
    const response = await apiGet(`api/bot/${botId}/client-bot-conversations/`);
    return response.data as ConversationData[];
  };

  const postTool = (data: FormData): Promise<unknown> => {
    return apiPost('api/tools/', data);
  };

  const getAllTools = (): Promise<unknown> => {
    return apiGet('api/tools/');
  };

  const getBotTools = (botId: string): Promise<unknown> => {
    return apiGet(`api/bot/${botId}/tools/`);
  };

  const setToolRelationship = (data: ToolRelationshipData): Promise<unknown> => {
    return apiPost('api/tools/relationship/', data as Record<string, unknown>);
  };

  const removeToolRelationship = (data: ToolRelationshipData): Promise<unknown> => {
    return apiDelete(`api/tools/relationship/`, { data });
  };

  return {
    getBotDetails,
    getBotsList,
    createBot,
    updateBot,
    updateBotData,
    deleteBot,
    uploadDocument,
    getChatHistory,
    sendMessage,
    closeChat,
    getAgentData,
    getClientBotConversations,
    postTool,
    getAllTools,
    getBotTools,
    setToolRelationship,
    removeToolRelationship
  };
};

export default useBotsApi;
