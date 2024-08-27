import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import MessageTool from "./MessageTool";
import useBotsApi from "@/hooks/useBots";
import {
  ChatMessageComponent,
  BotWritingComponent,
} from "./ChatMessageComponent";
import { useParams } from "react-router-dom";
import { ChatHistory, ChatMessage } from "@/types/Bots";
import { Grid, Box, Divider, styled, Typography } from "@mui/material";
import {
  CenterComponentContainer,
  MainComponentContainer,
} from "@/utils/ContainerUtil";

const ChatHeader = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    backgroundColor: theme.palette.secondary.dark,
    borderRadius: "10px 10px 0px 0px",
  },
}));
const ChatHeaderTitle = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    color: theme.palette.info.main,
    padding: "10px 15px",
  },
}));
const ChatContent = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    borderLeft: `2px solid ${theme.palette.primary.main}`,
    borderRight: `2px solid ${theme.palette.primary.main}`,
    height: "70vh",
    overflow: "scroll",
    overflowX: "clip",
    paddingTop: "10px",
  },
}));
const ChatAction = styled(Grid)(({ theme }) => ({
  "&.MuiGrid-root": {
    background: theme.palette.info.light, //"rgba(50,50,50,0.005)",
    border: "0px solid transparent !important",
    borderBottom: `2px solid ${theme.palette.primary.main} !important`,
    borderLeft: `2px solid ${theme.palette.primary.main} !important`,
    borderRight: `2px solid ${theme.palette.primary.main} !important`,
    borderBottomRightRadius: "12px",
    borderBottomLeftRadius: "12px",
    height: "72px",
  },
}));

const ChatView: React.FC = () => {
  const { botId } = useParams();
  const { getChatHistory } = useBotsApi();
  const [chatHistory, setChatHistory] = useState<ChatHistory>();
  const [botWriting, setBotWriting] = useState<boolean>(false);
  //const [name, setName] = useState<string>();

  const updateBotMessages = (r: ChatMessage, userMessage: ChatMessage) => {
    if (chatHistory) {
      const newChatHistory: ChatMessage[] = [...chatHistory.messages];
      newChatHistory.push(userMessage);
      newChatHistory.push(r);
      const updatedChatHistory: ChatHistory = {
        customer: chatHistory?.customer || "",
        customer_bot: chatHistory?.customer_bot || "",
        messages: newChatHistory,
      };
      setChatHistory(updatedChatHistory);
    }
  };

  const updateUserMessages = (r: ChatMessage) => {
    if (chatHistory) {
      const newChatHistory: ChatMessage[] = [...chatHistory.messages];
      newChatHistory.push(r);
      const updatedChatHistory: ChatHistory = {
        customer: chatHistory?.customer || "",
        customer_bot: chatHistory?.customer_bot || "",
        messages: newChatHistory,
      };
      setChatHistory(updatedChatHistory);
    }
  };

  const updateBotWriting = (isWriting: boolean) => {
    setBotWriting(isWriting);
  };

  const updateScrollPosition = () => {
    const ChatContentHtml = document.getElementById("chat-content");
    ChatContentHtml ? ChatContentHtml.scrollBy(0, 999999) : "";
  };

  useEffect(() => {
    if (botId) {
      getChatHistory(botId).then((r) => {
        setChatHistory(r);
        updateScrollPosition();
      });
    }
  }, [botId]);

  useEffect(() => {
    updateScrollPosition();
  }, [chatHistory]);

  return (
    <MainComponentContainer container>
      <Grid item xs={8} md={6} lg={3} >
        <ChatHeader>
          <ChatHeaderTitle variant="h5">
            ChatbotView
          </ChatHeaderTitle>
        </ChatHeader>
        <ChatContent sx={{background:"white"}} id={"chat-content"}>
          {!chatHistory && (
            <CenterComponentContainer>
              <CircularProgress size={100} />
            </CenterComponentContainer>
          )}
          {chatHistory &&
            chatHistory.messages.map((msg, i) => (
              <ChatMessageComponent
                key={`${botId}-chatMessage-${i}`}
                {...{ role: msg.role, content: msg.content }}
              />
            ))}
          {botWriting && <BotWritingComponent />}
        </ChatContent>
        <ChatAction>
          <Divider sx={{ border: "1px solid rgba(1,1,1,0.05)" }} />
          {botId && (
            <MessageTool
              botId={botId}
              updateBotWriting={updateBotWriting}
              updateBotMessages={updateBotMessages}
              updateUserMessages={updateUserMessages}
            />
          )}
        </ChatAction>
      </Grid>
    </MainComponentContainer>
  );
};

export default ChatView;
