import { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    // Si ya existe una conexión para este usuario autenticado, no crear una nueva
    if (auth?.uuid && wsRef.current) {
      return;
    }

    // Si no hay ID de conversación, no conectar
    if (!conversationId) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(`${wsUrl}/ws/chat/${conversationId}/`);
    
    // Agregar token de autenticación si existe
    if (auth?.token) {
      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'authentication',
          token: auth.token
        }));
      };
    }

    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket conectado');
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket desconectado');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat.message') {
        setMessages(prev => [...prev, data.message]);
      }
    };

    return () => {
      // Solo cerrar la conexión si el usuario no está autenticado
      if (wsRef.current && !auth?.uuid) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [conversationId, auth]);

  const sendMessage = (content: string, role: 'client' | 'agent' = 'client') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'chat.message',
        message: {
          content,
          role,
          timestamp: new Date().toISOString()
        }
      }));
    }
  };

  return {
    messages,
    sendMessage,
    isConnected
  };
};
