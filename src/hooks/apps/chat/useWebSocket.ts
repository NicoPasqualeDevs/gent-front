import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/context';

interface WebSocketMessage {
  content: string;
  role: 'client' | 'agent' | 'system';
  timestamp: string;
}

export const useWebSocket = (conversationId: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { auth } = useAppContext();

  const connectWebSocket = useCallback(() => {
    if (!conversationId) return;

    const isProduction = import.meta.env.PROD;
    const wsUrl = isProduction 
        ? import.meta.env.VITE_PROD_WS_URL 
        : import.meta.env.VITE_WS_URL;

    const ws = new WebSocket(`${wsUrl}/ws/chat/${conversationId}/`);
    
    ws.onopen = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
      
      if (auth?.token) {
        ws.send(JSON.stringify({
          type: 'authentication',
          token: auth.token
        }));
      }
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('Error de WebSocket:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat.message') {
          setMessages(prev => [...prev, data.message]);
        }
      } catch (error) {
        console.error('Error al procesar mensaje:', error);
      }
    };

    wsRef.current = ws;
  }, [conversationId, auth]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat.message',
        message: {
          content,
          role: 'client',
          timestamp: new Date().toISOString()
        }
      }));
    } else {
      console.error('WebSocket no está conectado');
    }
  }, []);

  return {
    messages,
    sendMessage,
    isConnected
  };
};
