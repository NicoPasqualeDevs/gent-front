import { useState, useCallback } from 'react';
import useApi from '@/hooks/api/useApi';
import { ChatHistoryType, ConversationHistoryType } from '@/types/ChatView';

export const useChatHistory = () => {
  const [history, setHistory] = useState<ChatHistoryType | null>(null);
  const [conversations, setConversations] = useState<ConversationHistoryType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { apiGet } = useApi();

  const loadHistory = useCallback(async (agentId: string) => {
    setIsLoading(true);
    try {
      const [historyResponse, conversationsResponse] = await Promise.all([
        apiGet<ChatHistoryType>(`chat/history/${agentId}`),
        apiGet<ConversationHistoryType[]>(`chat/conversations/${agentId}`)
      ]);

      setHistory(historyResponse.data);
      setConversations(conversationsResponse.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    history,
    conversations,
    isLoading,
    loadHistory
  };
}; 