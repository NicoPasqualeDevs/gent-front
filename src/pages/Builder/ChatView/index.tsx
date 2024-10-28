import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Grid, Typography, TextField, Button, CircularProgress, Avatar, Tooltip } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ErrorToast } from "@/components/Toast";
import useBotsApi from "@/hooks/useBots";
import { useParams, useNavigate } from "react-router-dom";
import { AgentData, ChatHistory, ChatMessage, UpdatedChatHistory as UpdatedChatHistoryType, ConversationData } from "@/types/Bots";
import { useTheme } from "@mui/material/styles";
import { useAppContext } from "@/context/app";
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

const ChatView: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const {
    getChatHistory,
    sendMessage,
    closeChat,
    getAgentData,
    getClientBotConversations  // Agregamos el nuevo hook
  } = useBotsApi();
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showFullName, setShowFullName] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { language } = useAppContext();
  const t = languages[language as keyof typeof languages].chatView;
  const [agentDataError, setAgentDataError] = useState<boolean>(false);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isHistoricalView, setIsHistoricalView] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowFullName(true);
    setIsTransitioning(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setShowFullName(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
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

  const fetchChatViewData = useCallback(async () => {
    if (!botId) return;
    try {
      const history = await getChatHistory(botId);
      setChatHistory(history);
      const conversationsResponse = await getClientBotConversations(botId);
      console.log(conversationsResponse, "<-- conversationsResponse.data")
      setConversations(conversationsResponse);

      if (!agentDataError) {
        try {
          const agentDataResponse = await getAgentData(botId);
          setAgentData(agentDataResponse.data);
        } catch (agentError) {
          console.error("Error al cargar los datos del agente:", agentError);
          setAgentDataError(true);
          setAgentData({
            id: 'simulated-id',
            name: `${t.defaultAgentName}`,
            description: '',
            api_bot: '',
            api_details: '',
            iframe_code: '',
            labels: [],
            widget_url: '',
            model_ai: '',
          } as AgentData);
        }
      }
    } catch (error) {
      console.error("Error al cargar los datos del chat:", error);
      ErrorToast(t.errorLoadingData);
    } finally {
      setIsLoading(false); // Cambiado de true a false
    }
  }, [botId, getChatHistory, getClientBotConversations, getAgentData, t.errorLoadingData, t.defaultAgentName, agentDataError]);

  useEffect(() => {
    if (!chatHistory && !agentData && !agentDataError) {
      fetchChatViewData();
    }
  }, [fetchChatViewData, chatHistory, agentData, agentDataError]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [chatHistory?.messages]);

  const handleSendMessage = async () => {
    if (!botId || !message.trim() || isSending) return;
    setIsSending(true);
    try {
      const updatedHistory: UpdatedChatHistoryType = await sendMessage(botId, { message });
      setChatHistory((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages,
          { content: message, role: "client", timestamp: new Date().toISOString() },
          updatedHistory.response
          ],
        };
      });
      setMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      ErrorToast(t.errorSendingMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFinishSession = async () => {
    if (!chatHistory?.conversation) {
      console.error("No hay ID de conversación disponible");
      ErrorToast(t.errorClosingChat);
      return;
    }
    await closeChat(chatHistory.conversation).then(() => {
      const initialMessage: ChatMessage = {
        content: t.noMessages,
        timestamp: new Date().toISOString(),
        role: 'bot'
      };

      setChatHistory({
        conversation: chatHistory.conversation,
        messages: [initialMessage],
        customer: chatHistory.customer,
        customer_bot: chatHistory.customer_bot
      });
      setMessage("");
    }).catch(() => {
      ErrorToast(t.errorCleaningChat);
    })
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConversationClick = (conversation: ConversationData) => {
    setIsHistoricalView(true);
    setChatHistory({
      conversation: conversation.conversation_id,
      messages: conversation.messages,
      customer: chatHistory?.customer || '',
      customer_bot: chatHistory?.customer_bot || ''
    });
  };

  const handleReturnToCurrent = () => {
    setIsHistoricalView(false);
    fetchChatViewData();
  };

  if (isLoading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <MainContainer>
      <SidebarContainer>
        <LogoContainer>
          <Box
            width={showFullName ? "60px" : "30px"}
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
                textShadow: showFullName ? "none" : `0 0 4px ${theme.palette.primary.light}`,
                transition: "all 0.25s ease-in-out",
              }}
            >
              {showFullName || isTransitioning ? "Gents" : "G"}
            </Typography>
          </Box>
        </LogoContainer>
        <Box p={1} textAlign="center" display="flex" flexDirection="column">
          <Typography variant="caption" mb={0.5}>{t.history}</Typography>
          <Box sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
            {conversations.map((conversation, index) => (
              <Tooltip
                key={index}
                title={conversation.messages[1]?.content || t.noMessages}
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
            {t.agentPanel.replace("{agentName}", agentData?.name || t.defaultAgentName)}
          </Typography>
          <LanguageSelector />
        </Header>
        <MessagesContainer ref={chatContainerRef}>
          {chatHistory?.messages.map((msg, index) => (
            <MessageBubble key={index} role={msg.role}>
              <Avatar sx={{
                bgcolor: msg.role === "bot" ? '#50c878' : '#4a90e2',
                width: 40,
                height: 40,
                marginRight: msg.role === "bot" ? '12px' : '6px',
                marginLeft: msg.role === "bot" ? '6px' : '12px',
              }}>
                {msg.role === "bot" ? "AI" : "U"}
              </Avatar>
              <MessageContent>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  {msg.role === "bot" ? (agentData?.name || t.assistant) : t.user}
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
                {t.noMessages}
              </Typography>
            )}
        </MessagesContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
            placeholder={isHistoricalView ? t.historicalView : t.inputPlaceholder}
            onKeyPress={handleKeyPress}
            disabled={isSending || isHistoricalView}
            multiline
            rows={3}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            {isHistoricalView ? (
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
                  disabled={isHistoricalView}
                >
                  {t.finishSession}
                </Button>
                <Button
                  variant="contained"
                  sx={{ color: theme.palette.secondary.main }}
                  onClick={handleSendMessage}
                  disabled={isSending || isHistoricalView}
                  endIcon={isSending ? <CircularProgress size={20} /> : <SendIcon />}
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
