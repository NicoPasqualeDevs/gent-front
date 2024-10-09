import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Typography, TextField, Button, Paper, CircularProgress, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import { ErrorToast } from "@/components/Toast";
import useBotsApi from "@/hooks/useBots";
import { useParams, useNavigate } from "react-router-dom";
import { ChatHistory, UpdatedChatHistory as UpdatedChatHistoryType } from "@/types/Bots";

const StyledPaper = styled(Paper)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  overflow: 'hidden',
  backgroundColor: '#1a1a2e',
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#16213e',
  color: '#e94560',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#1a1a2e',
}));

const MessageBubble = styled(Box)<{ isUser: boolean }>(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: '20px',
  marginBottom: theme.spacing(1),
  backgroundColor: isUser ? '#e94560' : '#0f3460',
  color: '#ffffff',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  wordBreak: 'break-word',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: '#16213e',
  display: 'flex',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': {
      borderColor: '#0f3460',
    },
    '&:hover fieldset': {
      borderColor: '#e94560',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e94560',
    },
  },
}));

const Widget: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [message, setMessage] = useState<string>(""); // Added default value
  const [isSending, setIsSending] = useState<boolean>(false);
  const { getChatHistory, sendMessage, closeChat } = useBotsApi();
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const renderMessageContent = (content: string) => {
    const linkRegex = /\(https?:\/\/[^\s)]+\)/g;
    const parts = content.split(linkRegex);
    const links = content.match(linkRegex);

    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {links && links[index] && (
              <a
                href={links[index].slice(1, -1)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', textDecoration: 'underline' }}
              >
                {links[index].slice(1, -1)}
              </a>
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

  const handleCloseChat = async () => {
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
        // Continuar con el proceso de limpieza local
      }
      
      // Intentar limpiar el chat
      try {
        const response = await fetch('http://127.0.0.1:8000/api/clean-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation_id: chatHistory.conversation }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Error al limpiar el chat:", errorData);
          // Continuar con el cierre local del chat
        }
      } catch (cleanError) {
        console.warn("Error al llamar a clean-chat:", cleanError);
        // Continuar con el cierre local del chat
      }

      // Limpiar el chat localmente independientemente de los errores anteriores
      setChatHistory(null);
      setMessage("");

      navigate(-1); // Redirige a la vista anterior
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
    <Grid container justifyContent="center" style={{ height: "100vh", padding: "20px" }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <StyledPaper elevation={3}>
          <Header>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: '#e94560', mr: 2 }}>
                <SmartToyIcon />
              </Avatar>
              <Typography variant="h6">Asistente IA</Typography>
            </Box>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleCloseChat}
            >
              Cerrar chat
            </Button>
          </Header>
          <ChatContainer ref={chatContainerRef}>
            {chatHistory?.messages.map((msg, index) => (
              <MessageBubble key={index} isUser={msg.role === "user"}>
                <Typography variant="body1">
                  {renderMessageContent(msg.content)}
                </Typography>
              </MessageBubble>
            )) ?? (
              <Typography variant="body1" textAlign="center" color="#ffffff">
                No hay mensajes disponibles.
              </Typography>
            )}
          </ChatContainer>
          <InputContainer>
            <StyledTextField
              fullWidth
              variant="outlined"
              value={message}
              onChange={handleMessageChange}
              placeholder="Escribe un mensaje..."
              onKeyPress={handleKeyPress}
              disabled={isSending}
            />
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleSendMessage} 
              style={{ marginLeft: "10px" }}
              disabled={isSending}
            >
              {isSending ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </InputContainer>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Widget;