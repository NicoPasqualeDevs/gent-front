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
    const wsUrl = isProduction 
        ? import.meta.env.VITE_PROD_WS_URL 
        : import.meta.env.VITE_DEV_WS_URL;

    const wsEndpoint = `${wsUrl}/ws/chat/${sessionId}/`;
    const finalWsUrl = wsEndpoint.replace(/^http/, 'ws');
    const ws = new WebSocket(finalWsUrl);
    
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

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Componente desmontado');
      }
    };
  }, [sessionId, auth]);

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
