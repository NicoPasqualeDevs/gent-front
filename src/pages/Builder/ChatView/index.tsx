import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Grid, Typography, Button, CircularProgress, Avatar, Tooltip, Paper } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ErrorToast } from "@/components/Toast";
import useAgentsApi from "@/hooks/apps/agents";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "@/context";
import { languages } from "@/utils/Traslations";
import LanguageSelector from "@/components/LanguageSelector";
import {
  MainContainer,
  SidebarContainer,
  ChatContainer,
  Header,
  MessagesContainer,
  MessageBubble,
  MessageContent,
  InputContainer,
  StyledTextField,
  LogoContainer,
  TimeStamp,
  HistoryBubble
} from './styles';
import {
  ChatHistoryType,
  formatTimestamp,
  ConversationHistoryType,
  ChatViewState,
  ChatResponse,
} from '@/types/ChatView';

const ChatView: React.FC = () => {
  const [state, setState] = useState<ChatViewState>({
    isLoading: true,
    isError: false,
    chatHistory: null,
    message: "",
    isSending: false,
    agentData: null,
    conversations: [],
    isHistoricalView: false,
    agentDataError: false,
    showFullName: false,
    isTransitioning: false,
    isInitialized: false
  });

  const {
    getChatHistory,
    sendMessage,
    closeChat,
    getAgentData,
    getAgentConversations
  } = useAgentsApi();
  
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useTheme();
  const { language } = useAppContext();
  const t = languages[language as keyof typeof languages].chatView;

  const loadData = useCallback(async () => {
    if (!agentId || state.isInitialized) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const historyResponse = await getChatHistory(agentId);
      const chatData = historyResponse.data as ChatResponse;

      const [conversationsResponse, agentDataResponse] = await Promise.all([
        getAgentConversations(agentId),
        getAgentData(agentId)
      ]);

      const mappedConversations: ConversationHistoryType[] = (conversationsResponse.data).map(conv => ({
        id: conv.conversation_id,
        conversation_id: conv.conversation_id,
        customer_agent: conv.customer_agent || '',
        client_user: '',
        timestamp: conv.timestamp,
        archived: false,
        messages: conv.messages.map(msg => ({
          content: msg.content,
          role: (msg.role === 'agent' || msg.role === 'client') ? msg.role : 'client',
          timestamp: msg.timestamp
        }))
      }));

      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: false,
        isInitialized: true,
        chatHistory: {
          conversation: chatData.conversation,
          messages: chatData.messages.map(msg => ({
            content: msg.content,
            role: msg.role,
            timestamp: msg.timestamp
          })),
          customer: '',
          customer_agent: chatData.customer_agent
        } as ChatHistoryType,
        conversations: mappedConversations,
        agentData: agentDataResponse.data
      }));

    } catch (error) {
      console.error("Error initializing data:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        isInitialized: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      ErrorToast(t.errorLoadingData);
    }
  }, [agentId, getChatHistory, getAgentConversations, getAgentData, t]);

  useEffect(() => {
    if (!state.isInitialized && agentId) {
      loadData();
    }
  }, [agentId, state.isInitialized]);

  useEffect(() => {
    const messages = state.chatHistory?.messages;
    if (!chatContainerRef.current || !messages?.length) return;

    const scrollToBottom = () => {
      const container = chatContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    scrollToBottom();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [state.chatHistory?.messages?.length]);

  const handleSendMessage = useCallback(async () => {
    if (!agentId || !state.message.trim() || state.isSending) return;
    
    setState(prev => ({ ...prev, isSending: true }));
    
    try {
      const response = await sendMessage(agentId, { message: state.message });
      const chatResponse = response.data;
      
      const newMessages = [
        {
          content: state.message,
          role: 'client' as const,
          timestamp: new Date().toISOString()
        },
        {
          content: chatResponse.messages[chatResponse.messages.length - 1].content,
          role: 'agent' as const,
          timestamp: chatResponse.messages[chatResponse.messages.length - 1].timestamp
        }
      ];

      setState(prev => {
        if (!prev.chatHistory) return prev;
        
        return {
          ...prev,
          isSending: false,
          message: "",
          chatHistory: {
            ...prev.chatHistory,
            conversation_id: chatResponse.conversation_id,
            messages: [...prev.chatHistory.messages, ...newMessages]
          }
        };
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setState(prev => ({ ...prev, isSending: false }));
      ErrorToast(t.errorSendingMessage);
    }
  }, [agentId, sendMessage, state.message, t.errorSendingMessage]);

  const handleFinishSession = async () => {
    const currentChatHistory = state.chatHistory;
    if (!currentChatHistory?.conversation) {
      console.error("No hay ID de conversación disponible");
      ErrorToast(t.errorClosingChat);
      return;
    }
    
    try {
      await closeChat(currentChatHistory.conversation);
      
      setState(prev => ({
        ...prev,
        isInitialized: false,
        chatHistory: null
      }));
      
      loadData();
    } catch (error) {
      ErrorToast(t.errorCleaningChat);
    }
  };

  const handleMouseEnter = () => {
    setState(prev => ({ ...prev, showFullName: true, isTransitioning: true }));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setState(prev => ({ ...prev, showFullName: false, isTransitioning: false }));
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isTransitioning: false }));
    }, 150);
  };

  const renderMessageContent = (content: string) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(linkRegex);
    const links = content.match(linkRegex);

    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {links && links[index] && (
              <>
                {' '}
                <a
                  href={links[index]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Enlace
                </a>
              </>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, message: e.target.value }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleConversationClick = (conversation: ConversationHistoryType) => {
    setState(prev => ({ ...prev, isHistoricalView: true, chatHistory: {
      conversation: conversation.conversation_id,
      messages: conversation.messages,
      customer: state.chatHistory?.customer || '',
      customer_agent: conversation.customer_agent
    } }));
  };

  const handleReturnToCurrent = () => {
    setState(prev => ({ ...prev, isHistoricalView: false, chatHistory: null }));
    loadData();
  };

  if (state.isLoading && !state.isInitialized) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (state.isError) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="error">
          {state.errorMessage || t.errorLoadingData}
        </Typography>
        <Button
          variant="contained"
          onClick={loadData}
          sx={{ mt: 2 }}
        >
          {t.errorLoadingData}
        </Button>
      </Paper>
    );
  }

  return (
    <MainContainer>
      <SidebarContainer>
        <LogoContainer>
          <Box
            width={state.showFullName ? "60px" : "30px"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              transition: "0.25s",
            }}
          >
            <Typography
              onClick={() => navigate(-1)}
              color={"white"}
              sx={{
                fontSize: "20px",
                lineHeight: 1,
                textAlign: "center",
                padding: "0px 2px",
                cursor: "pointer",
                overflow: "hidden",
                textShadow: state.showFullName ? "none" : `0 0 4px ${theme.palette.primary.light}`,
                transition: "all 0.25s ease-in-out",
              }}
            >
              {state.showFullName || state.isTransitioning ? "Gents" : "G"}
            </Typography>
          </Box>
        </LogoContainer>
        <Box p={1} textAlign="center" display="flex" flexDirection="column">
          <Typography variant="caption" mb={0.5}>{t.history}</Typography>
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
            {state.conversations.map((conversation, index) => (
              <Tooltip
                key={index}
                title={conversation.messages[1]?.content || (typeof t.noMessages === 'string' ? t.noMessages : t.noMessages())}
                placement="right"
              >
                <HistoryBubble onClick={() => handleConversationClick(conversation)}>
                  {index + 1}
                </HistoryBubble>
              </Tooltip>
            ))}
          </Box>
        </Box>
      </SidebarContainer>
      <ChatContainer>
        <Header>
          <Typography variant="h5" fontWeight="bold">
            {t.agentPanel.replace("{agentName}", state.agentData?.name || t.defaultAgentName)}
          </Typography>
          <LanguageSelector />
        </Header>
        <MessagesContainer ref={chatContainerRef}>
          {state.chatHistory?.messages.map((msg, index) => (
            <MessageBubble 
              key={index} 
              role={msg.role as 'agent' | 'client'}
            >
              <Avatar sx={{
                bgcolor: msg.role === "agent" ? '#50c878' : '#4a90e2',
                width: 40,
                height: 40,
                marginRight: msg.role === "agent" ? '12px' : '6px',
                marginLeft: msg.role === "agent" ? '6px' : '12px',
              }}>
                {msg.role === "agent" ? "AI" : "U"}
              </Avatar>
              <MessageContent>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  {msg.role === "agent" ? (state.agentData?.name || t.assistant) : t.user}
                </Typography>
                <Typography variant="body1">
                  {renderMessageContent(msg.content)}
                </Typography>
                <TimeStamp>
                  {formatTimestamp(msg.timestamp)}
                </TimeStamp>
              </MessageContent>
            </MessageBubble>
          )) ?? (
              <Typography variant="body1" textAlign="center" color="#888888">
                {typeof t.noMessages === 'function' ? t.noMessages() : t.noMessages}
              </Typography>
            )}
        </MessagesContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            variant="outlined"
            value={state.message}
            onChange={handleMessageChange}
            placeholder={state.isHistoricalView ? t.historicalView : t.inputPlaceholder}
            onKeyPress={handleKeyPress}
            disabled={state.isSending || state.isHistoricalView}
            multiline
            rows={3}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            {state.isHistoricalView ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleReturnToCurrent}
              >
                {t.returnToCurrent}
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleFinishSession}
                  disabled={state.isHistoricalView}
                >
                  {t.finishSession}
                </Button>
                <Button
                  variant="contained"
                  sx={{ color: theme.palette.secondary.main }}
                  onClick={handleSendMessage}
                  disabled={state.isSending || state.isHistoricalView}
                  endIcon={state.isSending ? <CircularProgress size={20} /> : <SendIcon />}
                >
                  {t.sendButton}
                </Button>
              </>
            )}
          </Box>
        </InputContainer>
      </ChatContainer>
    </MainContainer>
  );
};

export default ChatView;
