import { ApiResponse } from "@/types/Api";
import { 
  AgentData, 
  AgentFormData, 
  AgentDataFormData,
  ChatHistory,
  ConversationData,
  Ktag,
  PromptTemplateData
} from "@/types/Agents";
import useApi from "@/hooks/api/useApi";

interface ChatResponse {
  conversation_id: string;
  messages: Array<{
    content: string;
    role: 'agent' | 'client';
    timestamp: string;
  }>;
  status: 'active' | 'archived';
}

interface MessageRequest {
  message: string;
  conversation_id?: string;
  [key: string]: unknown;
}

interface UseAgentsApi {
  getAgentDetails: (agentId: string) => Promise<ApiResponse<AgentData>>;
  getAgentsList: (teamId: string, filterParams: string) => Promise<ApiResponse<AgentData[]>>;
  createAgent: (data: AgentFormData, teamId: string) => Promise<ApiResponse<AgentData>>;
  updateAgent: (data: AgentFormData, agentId: string) => Promise<ApiResponse<AgentData>>;
  updateAgentData: (data: AgentDataFormData, agentId: string) => Promise<ApiResponse<AgentData>>;
  deleteAgent: (agentId: string) => Promise<ApiResponse<void>>;
  uploadDocument: (file: File, agentId: string) => Promise<ApiResponse<void>>;
  getChatHistory: (agentId: string) => Promise<ApiResponse<ChatHistory>>;
  sendMessage: (agentId: string, data: MessageRequest) => Promise<ApiResponse<ChatResponse>>;
  closeChat: (conversationId: string) => Promise<ApiResponse<void>>;
  getAgentConversations: (agentId: string) => Promise<ApiResponse<ConversationData[]>>;
  getKnowledgeTags: (agentId: string) => Promise<ApiResponse<Ktag[]>>;
  createKnowledgeTag: (agentId: string, data: Ktag) => Promise<ApiResponse<Ktag>>;
  updateKnowledgeTag: (tagId: string, data: Ktag) => Promise<ApiResponse<Ktag>>;
  deleteKnowledgeTag: (tagId: string) => Promise<ApiResponse<void>>;
  getPromptTemplate: (agentId: string) => Promise<ApiResponse<PromptTemplateData>>;
  savePromptTemplate: (agentId: string, template: string) => Promise<ApiResponse<PromptTemplateData>>;
}

const useAgentsApi = (): UseAgentsApi => {
  const { apiGet, apiPost, apiPut, apiDelete } = useApi();

  const getAgentDetails = async (agentId: string): Promise<ApiResponse<AgentData>> => {
    return apiGet(`agents/${agentId}/`);
  };

  const getAgentsList = async (teamId: string, filterParams: string): Promise<ApiResponse<AgentData[]>> => {
    return apiGet(`agents/teams/${teamId}/?${filterParams}`);
  };

  const createAgent = async (data: AgentFormData, teamId: string): Promise<ApiResponse<AgentData>> => {
    return apiPost(`agents/teams/${teamId}/`, data);
  };

  const updateAgent = async (data: AgentFormData, agentId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`agents/modify/${agentId}/`, data);
  };

  const updateAgentData = async (data: AgentDataFormData, agentId: string): Promise<ApiResponse<AgentData>> => {
    return apiPut(`agents/${agentId}/data/`, data);
  };

  const deleteAgent = async (agentId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`agents/modify/${agentId}/`);
  };

  const uploadDocument = async (file: File, agentId: string): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiPost(`agents/${agentId}/upload/`, formData);
  };

  const getChatHistory = async (agentId: string): Promise<ApiResponse<ChatHistory>> => {
    return apiGet(`agents/${agentId}/chat-history/`);
  };

  const sendMessage = async (agentId: string, data: MessageRequest): Promise<ApiResponse<ChatResponse>> => {
    return apiPost(`agents/${agentId}/send-message/`, data);
  };

  const closeChat = async (conversationId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`agents/close-chat/${conversationId}/`);
  };

  const getAgentConversations = async (agentId: string): Promise<ApiResponse<ConversationData[]>> => {
    return apiGet(`agents/${agentId}/conversations/`);
  };

  const getKnowledgeTags = async (agentId: string): Promise<ApiResponse<Ktag[]>> => {
    return apiGet(`agents/${agentId}/knowledge-tags/`);
  };

  const createKnowledgeTag = async (agentId: string, data: Ktag): Promise<ApiResponse<Ktag>> => {
    return apiPost(`agents/${agentId}/knowledge-tags/`, data);
  };

  const updateKnowledgeTag = async (tagId: string, data: Ktag): Promise<ApiResponse<Ktag>> => {
    return apiPut(`agents/knowledge-tags/${tagId}/`, data);
  };

  const deleteKnowledgeTag = async (tagId: string): Promise<ApiResponse<void>> => {
    return apiDelete(`agents/knowledge-tags/${tagId}/`);
  };

  const getPromptTemplate = async (agentId: string): Promise<ApiResponse<PromptTemplateData>> => {
    return apiGet(`agents/prompt-templates/${agentId}/`);
  };

  const savePromptTemplate = async (agentId: string, template: string): Promise<ApiResponse<PromptTemplateData>> => {
    return apiPost(`agents/prompt-templates/${agentId}/`, { template });
  };

  return {
    getAgentDetails,
    getAgentsList,
    createAgent,
    updateAgent,
    updateAgentData,
    deleteAgent,
    uploadDocument,
    getChatHistory,
    sendMessage,
    closeChat,
    getAgentConversations,
    getKnowledgeTags,
    createKnowledgeTag,
    updateKnowledgeTag,
    deleteKnowledgeTag,
    getPromptTemplate,
    savePromptTemplate
  };
};

export default useAgentsApi;
