import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '@/context';

interface WebSocketMessage {
  content: string;
  role: 'client' | 'agent' | 'system';
  timestamp: string;
}

export const useWebSocket = (sessionId: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const { auth } = useAppContext();

  const connectWebSocket = useCallback(() => {
    if (!sessionId) return;

    const isProduction = import.meta.env.MODE === 'production';
    const baseUrl = isProduction 
        ? import.meta.env.VITE_PROD_WS_URL 
        : import.meta.env.VITE_DEV_WS_URL;

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const wsEndpoint = `${cleanBaseUrl}/ws/chat/${sessionId}/`;
    
    console.log('Attempting to connect to:', wsEndpoint);
    
    const ws = new WebSocket(wsEndpoint);
    
    ws.onopen = () => {
      console.log('WebSocket conectado exitosamente');
      setIsConnected(true);
      
      if (auth?.token) {
        ws.send(JSON.stringify({
          type: 'authentication',
          token: auth.token
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);

        if (data.type === 'chat.message' && data.message) {
          const newMessage: WebSocketMessage = {
            content: data.message.content,
            role: data.message.role,
            timestamp: data.message.timestamp
          };
          console.log('Adding new message to state:', newMessage);
          setMessages(prev => [...prev, newMessage]);
        } else if (data.type === 'error') {
          console.error('Error from server:', data.content);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket desconectado:', event.code, event.reason);
      setIsConnected(false);
      
      if (event.code !== 1000) {
        setTimeout(connectWebSocket, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('Error de WebSocket:', error);
      if (wsRef.current?.readyState !== WebSocket.CLOSED) {
        ws.close();
      }
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Componente desmontado');
      }
    };
  }, [sessionId, auth]);

  useEffect(() => {
    const cleanup = connectWebSocket();
    return () => {
      cleanup?.();
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        type: 'chat.message',
        message: {
          content: content,
          role: 'client',
          timestamp: new Date().toISOString()
        }
      };
      console.log('Sending message:', message);
      wsRef.current.send(JSON.stringify(message));
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
