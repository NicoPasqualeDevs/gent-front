import { ApiResponse } from "@/types/Api";
import { AgentData } from "@/types/Bots";
import { ServerMessageResponse } from "@/types/ChatView";
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

/* interface UpdatedChatHistoryType {
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
} */

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

interface KnowledgeTag extends Record<string, unknown> {
  id?: string;
  name: string;
  description: string;
  value: string;
  customer_bot: string;
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
  sendMessage: (botId: string, data: { message: string }) => Promise<ApiResponse<ServerMessageResponse>>;
  closeChat: (conversationId: string) => Promise<void>;
  getAgentData: (botId: string) => Promise<ApiResponse<AgentData>>;
  getClientBotConversations: (botId: string) => Promise<ConversationData[]>;
  postTool: (data: FormData) => Promise<unknown>;
  getAllTools: () => Promise<unknown>;
  getBotTools: (botId: string) => Promise<unknown>;
  setToolRelationship: (data: ToolRelationshipData) => Promise<unknown>;
  removeToolRelationship: (data: ToolRelationshipData) => Promise<unknown>;
  getKnowledgeTags: (botId: string) => Promise<ApiResponse<KnowledgeTag[]>>;
  createKnowledgeTag: (botId: string, data: KnowledgeTag) => Promise<ApiResponse<KnowledgeTag>>;
  updateKnowledgeTag: (tagId: string, data: KnowledgeTag) => Promise<ApiResponse<KnowledgeTag>>;
  deleteKnowledgeTag: (tagId: string) => Promise<ApiResponse<void>>;
  getPromptTemplate: (botId: string) => Promise<ApiResponse<string>>;
  savePromptTemplate: (botId: string, promptTemplate: string) => Promise<ApiResponse<void>>;
}

const useBotsApi = (): UseBotsApi => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();

  const getBotDetails = (botId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`bot/${botId}/`);
  };

  const getBotsList = (aiTeamId: string, filterParams: string): Promise<ApiResponse<AgentData[]>> => {
    return apiGet(`bot/${aiTeamId}/${filterParams}`);
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

    return apiPost(`bot/${teamId}/`, payload);
  };

  const updateBot = (data: BotFormData, botId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`bot/${botId}/`, data);
  };

  const updateBotData = (data: BotDataFormData, botId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`bot/${botId}/data/`, data);
  };

  const deleteBot = (botId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`bot/${botId}/`);
  };

  const uploadDocument = async (
    file: File,
    botId: string,
  ): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiPost<void>(`bot/${botId}/upload/`, formData);
  };

  const getChatHistory = (botId: string): Promise<ApiResponse<ChatHistory>> => {
      return apiGet(`chat/${botId}/`);
  };

  const sendMessage = async (botId: string, data: { message: string }): Promise<ApiResponse<ServerMessageResponse>> => {
    return apiPost(`chat/${botId}/`, data);
  };

  const closeChat = async (conversationId: string): Promise<void> => {
      await apiPost(`chat/clean-chat/`, { conversation_id: conversationId });
    return;
  };

  const getAgentData = (botId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`bot/modify/${botId}/`);
  };

  const getClientBotConversations = async (botId: string): Promise<ConversationData[]> => {
    const response = await apiGet(`chat/conversations/${botId}/`);
    return response.data as ConversationData[];
  };

  const postTool = (data: FormData): Promise<unknown> => {
      return apiPost('tools/', data);
  };

  const getAllTools = (): Promise<unknown> => {
    return apiGet('tools/');
  };

  const getBotTools = (botId: string): Promise<unknown> => {
    return apiGet(`bot/${botId}/tools/`);
  };

  const setToolRelationship = (data: ToolRelationshipData): Promise<unknown> => {
    return apiPost('tools/relationship/', data as Record<string, unknown>);
  };

  const removeToolRelationship = (data: ToolRelationshipData): Promise<unknown> => {
    return apiDelete(`tools/relationship/`, { data });
  };

  const getKnowledgeTags = (botId: string): Promise<ApiResponse<KnowledgeTag[]>> => {
      return apiGet(`ktag/${botId}/`);
  };

  const createKnowledgeTag = (botId: string, data: KnowledgeTag): Promise<ApiResponse<KnowledgeTag>> => {
      return apiPost(`ktag/${botId}/`, data as Record<string, unknown>);
  };

  const updateKnowledgeTag = (tagId: string, data: KnowledgeTag): Promise<ApiResponse<KnowledgeTag>> => {
      return apiPut(`ktag/modify/${tagId}/`, data as Record<string, unknown>);
  };

  const deleteKnowledgeTag = (tagId: string): Promise<ApiResponse<void>> => {
      return apiDelete(`ktag/modify/${tagId}/`);
  };

  const getPromptTemplate = (botId: string): Promise<ApiResponse<string>> => {
    return apiGet(`bot/prompt/${botId}/`);
  };

  const savePromptTemplate = (botId: string, promptTemplate: string): Promise<ApiResponse<void>> => {
    return apiPost(`bot/prompt/${botId}/`, {
      prompt_template: promptTemplate
    });
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
    removeToolRelationship,
    getKnowledgeTags,
    createKnowledgeTag,
    updateKnowledgeTag,
    deleteKnowledgeTag,
    getPromptTemplate,
    savePromptTemplate
  };
};

export default useBotsApi;
