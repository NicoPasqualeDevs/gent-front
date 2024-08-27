import { useWidgetContext } from "@/components/pages/Bots/Widget/WidgetContext";
import useApi from "@/hooks/useApi";
import React, { useEffect, useState } from "react";
import DialogContent from "../DialogContent";
import LoadingBubble from "../LoadingBubble";
import ErrorBubble from "../ErrorBubble";
import autoScroll from "../../../helpers/autoScroll";
import { ErrorToast } from "@/components/Toast";

interface MessagesData {
  content: string;
  role: string | "client" | "bot";
  timestamp: string;
}

interface ChatHistoryData {
  customer_bot: string;
  conversation: string;
  messages: MessagesData[];
}

interface LoadBotProps {
  autoScrollRef: React.RefObject<HTMLDivElement>;
}

const LoadBot: React.FC<LoadBotProps> = ({ autoScrollRef }) => {
  const {
    chatState,
    widgetData,
    historyLoaded,
    historyError,
    setConversationID,
    setHistoryLoaded,
    setHistoryError,
  } = useWidgetContext();
  const { apiGet } = useApi();
  const [messages, setMessages] = useState<MessagesData[]>([]);

  const getChatHistory = (customer_bot: string): Promise<ChatHistoryData> => {
    const path = `chat/api/${customer_bot}`;
    return apiGet<ChatHistoryData>(path);
  };

  useEffect(() => {
    if (widgetData.customer_bot && chatState) {
      getChatHistory(widgetData.customer_bot)
        .then((response) => {
          setConversationID(response.conversation);
          setMessages([...response.messages]);
          setHistoryLoaded(true);
          setHistoryError(false);
        })
        .catch((error) => {
          console.log(error);
          setHistoryLoaded(true);
          setHistoryError(true);
          ErrorToast("Error al cargar historial de chat");
        });
    }
  }, [widgetData.id, chatState]);

  useEffect(() => {
    if (!chatState) {
      setMessages([]);
    }
  }, [chatState]);

  useEffect(() => {
    autoScroll(autoScrollRef);
  }, [messages]);

  return (
    <>
      {historyLoaded ? null : <LoadingBubble />}
      {historyError ? <ErrorBubble /> : null}
      {messages.map((msg, index) => {
        return (
          <DialogContent
            key={`history-msg-${index}`}
            role={msg.role}
            content={msg.content}
          />
        );
      })}
    </>
  );
};

export default LoadBot;
