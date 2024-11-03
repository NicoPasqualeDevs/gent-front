import { ApiResponse } from "@/types/Api";
import { AgentData } from "@/types/Bots";
import useApi from "./useApi";

interface BotFormData {
  name: string;
  description: string;
  model_ai: string;
}

interface BotDataFormData {
  context: string;
  documents?: File[];
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

interface ToolRelationshipData {
  agent_tool_ids: number[];
}

interface UseBotsApi {
  getBotDetails: (botId: string) => Promise<ApiResponse<AgentData>>;
  getBotsList: (aiTeamId: string, filterParams: string) => Promise<ApiResponse<AgentData[]>>;
  createBot: (data: BotFormData) => Promise<ApiResponse<AgentData>>;
  updateBot: (data: BotFormData, botId: string) => Promise<ApiResponse<AgentData>>;
  updateBotData: (data: BotDataFormData, botId: string) => Promise<ApiResponse<AgentData>>;
  deleteBot: (botId: string) => Promise<ApiResponse<void>>;
  uploadDocument: (file: File, botId: string, onProgress?: (progress: number) => void) => Promise<ApiResponse<void>>;
  getChatHistory: (botId: string) => Promise<ApiResponse<ChatHistory>>;
  sendMessage: (botId: string, data: { message: string }) => Promise<ApiResponse<UpdatedChatHistoryType>>;
  closeChat: (conversationId: string) => Promise<void>;
  getAgentData: (botId: string) => Promise<ApiResponse<AgentData>>;
  getClientBotConversations: (botId: string) => Promise<ConversationData[]>;
  postTool: (data: FormData) => Promise<any>;
  getAllTools: () => Promise<any>;
  getBotTools: (botId: string) => Promise<any>;
  setToolRelationship: (data: ToolRelationshipData) => Promise<any>;
  removeToolRelationship: (data: ToolRelationshipData) => Promise<any>;
}

const useBotsApi = (): UseBotsApi => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();

  const getBotDetails = (botId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`api/bots/${botId}/`);
  };

  const getBotsList = (aiTeamId: string, filterParams: string): Promise<ApiResponse<AgentData[]>> => {
    return apiGet(`api/team_details/bots/${aiTeamId}${filterParams}`);
  };

  const createBot = (data: BotFormData): Promise<ApiResponse<AgentData>> => {
    return apiPost('api/bots/', data);
  };

  const updateBot = (data: BotFormData, botId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`api/bots/${botId}/`, data);
  };

  const updateBotData = (data: BotDataFormData, botId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`api/bots/${botId}/data/`, data);
  };

  const deleteBot = (botId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`api/bots/${botId}/`);
  };

  const uploadDocument = async (
    file: File,
    botId: string,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      onUploadProgress: (progressEvent: any) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    };

    return apiPost(`api/bots/${botId}/upload/`, formData, config);
  };

  const getChatHistory = (botId: string): Promise<ApiResponse<ChatHistory>> => {
    return apiGet(`api/bots/${botId}/chat-history/`);
  };

  const sendMessage = async (botId: string, data: { message: string }): Promise<ApiResponse<UpdatedChatHistoryType>> => {
    return apiPost(`api/bots/${botId}/send-message/`, data);
  };

  const closeChat = async (conversationId: string): Promise<void> => {
    await apiDelete(`api/bots/close-chat/${conversationId}/`);
    return;
  };

  const getAgentData = (botId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`api/bots/${botId}/agent-data/`);
  };

  const getClientBotConversations = async (botId: string): Promise<ConversationData[]> => {
    const response = await apiGet(`api/bots/${botId}/client-bot-conversations/`);
    return response.data as ConversationData[];
  };

  const postTool = (data: FormData): Promise<any> => {
    return apiPost('api/tools/', data);
  };

  const getAllTools = (): Promise<any> => {
    return apiGet('api/tools/');
  };

  const getBotTools = (botId: string): Promise<any> => {
    return apiGet(`api/bots/${botId}/tools/`);
  };

  const setToolRelationship = (data: ToolRelationshipData): Promise<any> => {
    return apiPost('api/tools/relationship/', data);
  };

  const removeToolRelationship = (data: ToolRelationshipData): Promise<any> => {
    return apiDelete(`api/tools/relationship/`, data);
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
