import { useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context';
import { useWebSocketState } from './useWebSocketState';
import { ChatMessage } from '@/types/Agents';
import { WebSocketMessage } from '@/types/WebSocket';

export const useWebSocket = (conversationId: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { auth } = useAppContext();
  const { state, updateConnection, addMessage, setError } = useWebSocketState();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!conversationId) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/ws/chat/${conversationId}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      updateConnection(true);
      if (auth?.token) {
        ws.send(JSON.stringify({
          type: 'authentication',
          token: auth.token
        }));
      }
    };

    ws.onclose = () => {
      updateConnection(false);
      // Intentar reconectar después de 3 segundos
      reconnectTimeoutRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      setError('Error de conexión WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat.message') {
          addMessage(data.message);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }, [conversationId, auth?.token]);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('No hay conexión disponible');
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'chat.message',
      content,
      timestamp: new Date().toISOString()
    }));
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const formatMessage = (message: WebSocketMessage): ChatMessage => ({
    content: message.content,
    role: message.type === 'system' || message.type === 'agent' ? 'agent' : 'client',
    timestamp: message.metadata?.timestamp || new Date().toISOString(),
    metadata: message.metadata || {}
  });

  return {
    messages: state.messages.map(msg => formatMessage(msg as WebSocketMessage)),
    sendMessage,
    isConnected: state.isConnected,
    error: state.error
  };
}; 