import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, Typography, TextField, Button, Paper, CircularProgress } from "@mui/material";
import { ErrorToast } from "@/components/Toast";
import useBotsApi from "@/hooks/useBots";
import { useParams, useNavigate } from "react-router-dom";
import { ChatHistory, UpdatedChatHistory as UpdatedChatHistoryType } from "@/types/Bots";

const Widget: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [message, setMessage] = useState<string>(""); // Added default value
  const [isSending, setIsSending] = useState<boolean>(false);
  const { getChatHistory, sendMessage, closeChat } = useBotsApi();
  const { botId } = useParams<{ botId: string }>();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);


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
      <Grid item xs={12} sm={8} md={6}>
        <Paper elevation={3} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box p={2} display="flex" justifyContent="flex-end">
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleCloseChat}
            >
              Cerrar chat
            </Button>
          </Box>
          <Box p={2} flexGrow={1} overflow="auto" ref={chatContainerRef}>
            {chatHistory?.messages.map((msg, index) => (
              <Box key={index} mb={2} alignSelf={msg.role === "user" ? "flex-end" : "flex-start"}>
                <Typography variant="body1" bgcolor={msg.role === "user" ? "#e3f2fd" : "#f5f5f5"} p={1} borderRadius={2}>
                  {msg.content}
                </Typography>
              </Box>
            )) ?? (
              <Typography variant="body1" textAlign="center">
                No hay mensajes disponibles.
              </Typography>
            )}
          </Box>
          <Box p={2} display="flex">
            <TextField
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
              color="primary" 
              onClick={handleSendMessage} 
              style={{ marginLeft: "10px" }}
              disabled={isSending}
            >
              {isSending ? <CircularProgress size={24} /> : "Enviar"}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Widget;
