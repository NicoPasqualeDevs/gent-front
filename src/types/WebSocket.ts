export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface WebSocketState {
  isConnected: boolean;
  connectionState: WebSocketConnectionState;
  error: string | null;
  messages: (WebSocketMessage | ChatMessage)[];
  lastPing: string | null;
}

export interface WebSocketHook {
  sendMessage: (content: string) => void;
  messages: WebSocketMessage[];
  isConnected: boolean;
  error: string | null;
}

export interface WebSocketConfig {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onClose?: () => void;
  onOpen?: () => void;
}

export interface WebSocketEvent {
  type: string;
  payload: unknown;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  content: string;
  role: 'agent' | 'client';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface WebSocketMessage {
  type: 'user' | 'system' | 'client' | 'agent';
  content: string;
  metadata?: {
    timestamp: string;
    session_id?: string;
    [key: string]: unknown;
  };
} 