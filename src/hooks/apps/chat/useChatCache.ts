import { useRef } from 'react';
import { ChatHistoryType } from '@/types/ChatView';

export const useChatCache = () => {
  const cache = useRef<Map<string, ChatHistoryType>>(new Map());

  const getCachedHistory = (conversationId: string) => {
    return cache.current.get(conversationId);
  };

  const setCachedHistory = (conversationId: string, history: ChatHistoryType) => {
    cache.current.set(conversationId, history);
  };

  return { getCachedHistory, setCachedHistory };
}; 