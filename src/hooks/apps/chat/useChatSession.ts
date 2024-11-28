import { useState, useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { ChatSession } from '@/types/ChatView';
import { ErrorToast } from '@/components/Toast';

interface UseChatSessionReturn {
  createSession: (agentId: string) => Promise<string>;
  endSession: (sessionId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  currentSessionId: string | null;
}

export const useChatSession = (): UseChatSessionReturn => {
  const [state, setState] = useState({
    isLoading: false,
    error: null as string | null,
    currentSessionId: null as string | null
  });
  
  const { apiPost, apiPatch } = useApi();

  const createSession = useCallback(async (agentId: string) => {
    if (state.currentSessionId) return state.currentSessionId;
    
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await apiPost<ChatSession>('chat/sessions/', {
        agent: agentId,
        metadata: {
          created_from: 'web_chat'
        }
      });
      
      const sessionId = response.data.id;
      setState(prev => ({
        ...prev,
        isLoading: false,
        currentSessionId: sessionId
      }));
      
      return sessionId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la sesión';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      ErrorToast(errorMessage);
      throw error;
    }
  }, []);

  const endSession = async (sessionId: string): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await apiPatch<void>(`chat/sessions/${sessionId}/close/`, {});
      setState(prev => ({
        ...prev,
        isLoading: false,
        currentSessionId: null
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cerrar la sesión';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      ErrorToast(errorMessage);
      throw error;
    }
  };

  return { ...state, createSession, endSession };
}; 