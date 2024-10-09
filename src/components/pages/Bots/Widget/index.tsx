import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Grid, Typography, TextField, Button, CircularProgress, Avatar, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from '@mui/icons-material/Send';
import { ErrorToast } from "@/components/Toast";
import useBotsApi from "@/hooks/useBots";
import { useParams, useNavigate } from "react-router-dom";
import { ChatHistory, UpdatedChatHistory as UpdatedChatHistoryType } from "@/types/Bots";
import { useTheme } from "@mui/material/styles";

const MainContainer = styled(Box)(() => ({
  height: '100vh',
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  display: 'flex',
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: '120px', // Aumentado de 100px a 120px
  borderRight: '1px solid #333333',
  display: 'flex',
  flexDirection: 'column',
}));

const ChatContainer = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #333333',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[600],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.grey[500],
  },
}));

const MessageBubble = styled(Box)<{ isAgent: boolean }>(({ theme, isAgent }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
  backgroundColor: isAgent ? '#383838' : '#2b5278',
  alignSelf: isAgent ? 'flex-start' : 'flex-end',
  display: 'flex',
  flexDirection: isAgent ? 'row' : 'row-reverse',
  alignItems: 'flex-start', // Añadido para alinear verticalmente el contenido
}));

const MessageContent = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  marginLeft: isUser ? theme.spacing(3) : 0, // Aumentado de 2 a 3
  marginRight: isUser ? 0 : theme.spacing(3), // Aumentado de 2 a 3
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #333333',
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': {
      borderColor: '#555555',
    },
    '&:hover fieldset': {
      borderColor: '#777777',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4a90e2',
    },
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 0.5), // Reducido aún más el padding horizontal
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Centrar el contenido horizontalmente
  height: '60px',
}));

const Widget: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const { getChatHistory, sendMessage, closeChat } = useBotsApi();
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showFullName, setShowFullName] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  useEffect(() => {
    let isMounted = true;

    const fetchChatHistory = async () => {
      if (!botId) return;
      setIsLoading(true);
      try {
        const history = await getChatHistory(botId);
        if (isMounted) {
          console.log(history)
          setChatHistory(history);
        }
      } catch (error) {
        console.error("Error al cargar el historial del chat:", error);
        if (isMounted) {
          ErrorToast("No se pudo cargar el historial del chat");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, [botId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
          { content: message, role: "user", timestamp: new Date().toISOString() },
          updatedHistory.response
          ],
        };
      });
      setMessage("");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      ErrorToast("No se pudo enviar el mensaje");
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

  const cleanChat = useCallback(async (conversationId: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/clean-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.warn("Error al limpiar el chat:", errorData);
        return false;
      }
      
      return true;
    } catch (cleanError) {
      console.warn("Error al llamar a clean-chat:", cleanError);
      return false;
    }
  }, []);

  const handleFinishSession = async () => {
    if (!chatHistory?.conversation) {
      console.error("No hay ID de conversación disponible");
      ErrorToast("No se pudo cerrar el chat: falta el ID de conversación");
      return;
    }
    
    console.log("ID de conversación:", chatHistory.conversation);
    
    try {
      // Intentar cerrar el chat en el backend
      try {
        await closeChat(chatHistory.conversation);
      } catch (closeError) {
        console.warn("Error al cerrar el chat en el backend:", closeError);
      }
      
      // Intentar limpiar el chat
      const cleanSuccess = await cleanChat(chatHistory.conversation);
      
      if (cleanSuccess) {
        // Cargar el mensaje inicial
        const initialMessage = {
          content: 'Estoy aquí para ayudarte. ¿En qué puedo ser útil?',
          timestamp: new Date().toISOString(),
          role: 'bot'
        };
        
        setChatHistory({
          conversation: chatHistory.conversation, // Mantenemos el mismo ID de conversación
          messages: [initialMessage]
        });
        setMessage("");
      } else {
        ErrorToast("No se pudo limpiar el chat completamente");
      }
    } catch (error) {
      console.error("Error inesperado al cerrar el chat:", error);
      ErrorToast("Ocurrió un error inesperado al cerrar el chat");
    }
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
            width={showFullName ? "60px" : "30px"} // Reducido el ancho máximo
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
              transition: "0.25s",
            }}
          >
            <Typography
              onClick={() => navigate("/builder")}
              color={"white"}
              sx={{
                fontSize: "20px", // Reducido aún más el tamaño de la fuente
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
          <Typography variant="caption" mb={0.5}>Historial</Typography>
          <Typography variant="caption" color="#888888" sx={{ fontSize: '0.7rem' }}>
            (Próximamente)
          </Typography>
        </Box>
      </SidebarContainer>
      <ChatContainer>
        <Header>
          <Typography variant="h5" fontWeight="bold">Panel de Agentes IA</Typography>
        </Header>
        <MessagesContainer ref={chatContainerRef}>
          {chatHistory?.messages.map((msg, index) => (
            <MessageBubble key={index} isAgent={msg.role === "bot"}>
              <Avatar sx={{
                bgcolor: msg.role === "bot" ? '#50c878' : '#4a90e2',
                width: 40,
                height: 40,
              }}>
                {msg.role === "bot" ? "AI" : "U"}
              </Avatar>
              <MessageContent isUser={msg.role === "user"}>
                <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                  {msg.role === "bot" ? "Asistente IA" : "Usuario"}
                </Typography>
                <Typography variant="body1">
                  {renderMessageContent(msg.content)}
                </Typography>
              </MessageContent>
            </MessageBubble>
          )) ?? (
              <Typography variant="body1" textAlign="center" color="#888888">
                No hay mensajes disponibles. Comienza una conversación con el agente IA.
              </Typography>
            )}
        </MessagesContainer>
        <InputContainer>
          <StyledTextField
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
            placeholder="Escribe tu mensaje para el agente IA..."
            onKeyPress={handleKeyPress}
            disabled={isSending}
            multiline
            rows={3}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleFinishSession}
            >
              Finalizar sesión
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={isSending}
              endIcon={isSending ? <CircularProgress size={20} /> : <SendIcon />}
            >
              Enviar
            </Button>
          </Box>
        </InputContainer>
      </ChatContainer>
    </MainContainer>
  );
};

export default Widget;