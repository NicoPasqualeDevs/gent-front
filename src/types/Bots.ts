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

// BOT KDATA
export interface ContextEntryData {
  name: string;
  description: string;
  prompt_template: string;
  model_ai: string; // Añadimos este campo
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
  [propKey: string]: string | undefined | Ktag[] | null;
  api_bot: string | null;
  api_details: string;
  description: string;
  id: string;
  iframe_code: string;
  labels: Ktag[];
  name: string;
  widget_url: string;
  model_ai: string 
}

export interface AgentMetaData {
  [propKey: string]: string | undefined;
  id?: string;
  name: string;
  description: string;
  model_ai: string 
}

export interface WidgetData {
  [propKey: string]: string | boolean | undefined;
  id: string;
  customer_bot?: string;
  primary_color?: string;
  primary_textContrast?: string;
  secondary_color?: string;
  secondary_textContrast?: string;
  badge_color?: string;
  badge_contrast?: string;
  font_family?: string;
  faq_questions?: string;
  brand_alt?: string;
  brand_logo?: string;
  icon_chat?: string;
  icon_bot?: string;
  icon_send?: string;
  icon_hidden?: string;
  band_list?: string;
  sql_injection_tester?: boolean;
  php_injection_tester?: boolean;
  strange_chars_tester?: boolean;
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

export interface ToolData {
  [propKey: string]: string | File | undefined;
  id?: string;
  tool_name: string;
  type?: string;
  tool_code?: string | File;
  instruction?: string;
}

export interface ToolRelationshipData {
  agent_tool_ids: number[];
}
