import { useState, useCallback } from 'react';
import { ChatMessage, WebSocketState, WebSocketMessage } from '@/types/WebSocket';

export const useWebSocketState = () => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    error: null,
    messages: []
  });

  const updateConnection = useCallback((isConnected: boolean) => {
    setState(prev => ({ ...prev, isConnected }));
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    const websocketMessage: WebSocketMessage = {
      type: message.role === 'agent' ? 'agent' : 'client',
      content: message.content,
      metadata: {
        timestamp: message.timestamp,
        ...message.metadata
      }
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, websocketMessage]
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    state,
    updateConnection,
    addMessage,
    setError
  };
}; 