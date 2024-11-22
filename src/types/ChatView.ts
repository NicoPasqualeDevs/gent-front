import { AgentData } from "@/types/Agents";

export interface ChatHistoryType {
  conversation: string;
  messages: Array<{
    content: string;
    role: 'agent' | 'client';
    timestamp: string;
  }>;
  customer: string;
  customer_agent: string;
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export interface ConversationHistoryType {
  id: string;
  conversation_id: string;
  customer_agent: string;
  client_user: string;
  timestamp: string;
  archived: boolean;
  messages: Array<{
    content: string;
    role: 'agent' | 'client';
    timestamp: string;
  }>;
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
  errorMessage?: string;
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
}

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
