// CHAT

export interface ChatMessage {
  content: string;
  role: "client" | "bot";
  timestamp: string;
}

export interface ChatHistory {
  customer: string;
  customer_bot: string;
  messages: ChatMessage[];
  conversation: string;
}

export interface UpdatedChatHistory {
  customer: string;
  customerBot: string;
  response: ChatMessage;
  reserve_link?: string;
}

// Nueva interfaz para ConversationData
export interface ConversationData {
  conversation_id: string;
  customer_bot: string;
  client_user: string;
  timestamp: string;
  messages: ChatMessage[];
  archived: boolean;
}

// BOT KDATA
export interface ContextEntryData {
  name: string;
  description: string;
  prompt_template: string;
  model_ai: string;
}

export interface PromptTemplateData {
  data: string;
}

export interface PromptTemplatePost {
  prompt_template: string;
}

export interface Ktag {
  [propKey: string]: string | undefined;
  id?: string | undefined;
  name: string;
  description: string;
  value: string;
  customer_bot: string;
}

export interface AgentData {
  id: string;
  name: string;
  description?: string;
  model_ai: string;
  context: string;
  owner?: string;
  owner_data?: {
    name: string;
    email: string;
  };
  widget_url?: string;
  status?: 'online' | 'offline' | 'busy' | 'error' | 'updating';
}

export interface AgentMetaData {
  [propKey: string]: string | undefined;
  id?: string;
  name: string;
  description: string;
  model_ai: string 
}

export interface WidgetData {
  id: string;
  primary_color?: string;
  primary_textContrast?: string;
  secondary_color?: string;
  secondary_textContrast?: string;
  badge_color?: string;
  badge_contrast?: string;
  font_family?: string;
  brand_alt?: string;
  brand_logo?: string | File;
  icon_bot?: string | File;
  icon_chat?: string | File;
  icon_hidden?: string | File;
  icon_send?: string | File;
  sql_injection_tester?: boolean;
  php_injection_tester?: boolean;
  strange_chars_tester?: boolean;
  band_list?: string;
  faq_questions?: string;
}

export interface CustomGreetingData {
  [propKey: string]: string | undefined;
  id: string;
  bot: string;
  text: string;
}

export interface NewGreetingData {
  [propKey: string]: string;
  bot: string;
  text: string;
}

export interface GetCustomGreetingData {
  success: boolean;
  data: CustomGreetingData[];
}

export interface AiTeam {
  id: string;
  name: string;
  description: string;
  address: string;
  code: string;
  user_email: string;
}

export interface BotFormData {
  name: string;
  description: string;
  model_ai: string;
  [key: string]: string;
}

export interface BotDataFormData {
  context: string;
  knowledge_key?: string;
  documents?: File[];
  [key: string]: string | File[] | undefined;
}
