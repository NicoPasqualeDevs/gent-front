import { ConversationData } from './Bots';

export interface ChatHistoryType {
  conversation: string;
  messages: Array<{
    content: string;
    role: 'bot' | 'client';
    timestamp: string;
  }>;
  customer: string;
  customer_bot: string;
}

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export interface ConversationHistoryType extends ConversationData {
  conversation_id: string;
  customer_bot: string;
  client_user: string;
  timestamp: string;
  archived: boolean;
}

export interface ServerMessageResponse {
  customer_bot: string;
  conversation: string;
  user_message: {
    content: string;
    timestamp: string;
    role: "client";
  };
  response: {
    content: string;
    timestamp: string;
    role: "bot";
  };
  status: "ongoing" | "resolved";
  session_key: string;
}
