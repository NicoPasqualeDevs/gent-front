import { AgentData } from "./Agents";

export interface ChatHistoryType {
  conversation: string;
  messages: ChatMessage[];
  customer: string;
  customer_agent: string;
}

export interface ChatSession {
  id: string;
  title: string;
  agent: string;
  user: string;
  team?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: number;
  session: string;
  content: string;
  message_type: 'client' | 'agent' | 'system';
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface ConversationHistoryType {
  id: string;
  conversation_id: string;
  customer_agent: string;
  client_user: string;
  timestamp: string;
  archived: boolean;
  messages: ChatMessage[];
}

export interface ServerMessageResponse {
  customer_agent: string;
  conversation: string;
  user_message: {
    content: string;
    timestamp: string;
    role: "client";
  };
  response: {
    content: string;
    timestamp: string;
    role: "agent";
  };
  status: "ongoing" | "resolved";
  session_key: string;
}

export interface ChatViewState {
  isLoading: boolean;
  isError: boolean;
  chatHistory: ChatHistoryType | null;
  message: string;
  isSending: boolean;
  agentData: AgentData | null;
  conversations: ConversationHistoryType[];
  isHistoricalView: boolean;
  agentDataError: boolean;
  showFullName: boolean;
  isTransitioning: boolean;
  isInitialized: boolean;
  sessionId: string | null;
  errorMessage?: string;
  welcomeMessageSent: boolean;
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export interface ChatResponse {
  conversation: string;
  messages: Array<{
    content: string;
    role: "agent" | "client";
    timestamp: string;
  }>;
  customer_agent: string;
}

export interface ConversationData {
  id: string;
  created_at: string;
  messages: Array<{
    content: string;
    role: string;
    timestamp: string;
  }>;
  customer_agent?: string;
}

export interface ChatViewTranslations {
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
  historicalView: string;
  returnToCurrent: string;
  errorCreatingSession: string;
  errorNoConnection: string;
  errorLoadingData: string;
  errorSendingMessage: string;
  errorClosingChat: string;
  errorCleaningChat: string;
}

export interface ChatMessage {
  content: string;
  role: 'agent' | 'client';
  timestamp: string;
  metadata?: Record<string, unknown>;
}
