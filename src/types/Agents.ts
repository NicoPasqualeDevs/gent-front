// CHAT

export interface ChatMessage {
  content: string;
  role: "client" | "agent";
  timestamp: string;
}

export interface ChatHistory {
  customer: string;
  customer_agent: string;
  messages: ChatMessage[];
  conversation: string;
}

export interface UpdatedChatHistory {
  customer: string;
  customerAgent: string;
  response: ChatMessage;
  reserve_link?: string;
}

// Nueva interfaz para ConversationData
export interface ConversationData {
  conversation_id: string;
  customer_agent: string;
  client_user: string;
  timestamp: string;
  messages: ChatMessage[];
  archived: boolean;
}

// AGENT KDATA
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
  customer_agent: string;
}

// Definimos tipos específicos para configuration y capabilities
interface AgentConfiguration {
  temperature?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  [key: string]: number | undefined;
}

interface AgentCapability {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  is_enabled: boolean;
}

interface AgentMemory {
  id: string;
  key: string;
  value: string | number | boolean | null;
  context: string;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

export interface AgentData {
  id: string;
  name: string;
  description: string;
  agent_type: string;
  system_prompt: string;
  configuration: AgentConfiguration;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  capabilities: AgentCapability[];
  memories: AgentMemory[];
  selected_api_key: number | null;
  model_ai: string | null;
  team: string;
  status: string;
  widget_url: string;
  context?: string;
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
  icon_agent?: string | File;
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
  agent: string;
  text: string;
}

export interface NewGreetingData {
  [propKey: string]: string;
  agent: string;
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

export interface AgentFormData {
  name: string;
  description: string;
  selected_api_key: string;
  model_ai: string;
  team: string;
  [key: string]: string;
}

export interface AgentDataFormData {
  context: string;
  knowledge_key?: string;
  documents?: File[];
  [key: string]: string | File[] | undefined;
}

import { Metadata } from '@/types/Api';

export interface AgentResponse {
  success: boolean;
  message: string;
  data: AgentData;
  metadata?: Metadata;
}

// Agregar la nueva interfaz IaPanelState
export interface IaPanelState {
  isLoading: boolean;
  isError: boolean;
  searchQuery: string;
  contentPerPage: string;
  currentPage: number;
  isSearching: boolean;
  pageContent: AgentData[];
  allowerState: boolean;
  agentToDelete: string;
  isDeleting: boolean;
  refreshTrigger: boolean;
  errorMessage?: string;
  paginationData?: {
    current_page: number;
    total_pages: number;
    total_items: number;
  };
}

export interface AgentsListResponse {
  success: boolean;
  message: string;
  data: AgentData[];
  metadata: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
  };
}
