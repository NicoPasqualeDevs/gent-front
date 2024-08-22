// CHAT

export interface ChatMessage {
  content: string;
  role: "user" | "bot";
  timestamp: string;
}

export interface ChatHistory {
  customer: string;
  customer_bot: string;
  messages: ChatMessage[];
}

export interface UpdatedChatHistory {
  customer: string;
  customerBot: string;
  response: ChatMessage;
  reserve_link?: string;
}

// BOT KDATA

export interface Ktag {
  [propKey: string]: string | undefined;
  id?: string | undefined;
  name: string;
  description: string;
  value: string;
  customer_bot: string;
}

export interface BotData {
  [propKey: string]: string | undefined | Ktag[];
  api_bot: string;
  api_details: string;
  description: string;
  id: string;
  iframe_code: string;
  labels: Ktag[];
  name: string;
  widget_url: string;
}

export interface BotMetaData {
  [propKey: string]: string | undefined;
  id?: string;
  name: string;
  description: string
}
