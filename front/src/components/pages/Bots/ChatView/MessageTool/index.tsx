import useBotsApi from "@/hooks/useBots";
import { Grid, Button, TextField, styled } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { BaseSyntheticEvent } from "react";
import { useState, useEffect } from "react";
import { ChatMessage } from "@/types/Bots";
import theme from "@/styles/theme";


type MessageToolsProps = {
  botId: string;
  updateBotMessages: (r: ChatMessage, userMessage: ChatMessage) => void;
  updateUserMessages: (r: ChatMessage) => void;
  updateBotWriting: (isWriting: boolean) => void;
};

const StyledMessageInput = styled(TextField)(({ theme }) => ({
  "& .MuiTextField": {
    borderRadius: "24px !important",
  },
  "& label.Mui-focused": {
    color: theme.palette.primary.main,
  },
  "& label.Mui": {
    color: theme.palette.primary.main,
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const MessageTool: React.FC<MessageToolsProps> = ({
  botId,
  updateBotMessages,
  updateUserMessages,
  updateBotWriting,
}) => {
  const { sendMessage } = useBotsApi();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        document.getElementById("submit-message")?.click();
      }
    };
    const MessageInput = document.getElementById("message-input");

    MessageInput?.addEventListener("keydown", handleKeyDown, true);

    return () => {
      MessageInput?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const iaHandler = async (userMessage: ChatMessage) => {
    let response: ChatMessage;
    const messagePost = { message: message };
    updateBotWriting(true);
    await sendMessage(botId, messagePost)
      .then((r) => {
        if(!r.reserve_link){
          response = r.response;
          updateBotWriting(false);
        }else{
          window.location.replace(r.reserve_link);
        }
      })
      .then(() => updateBotMessages(response, userMessage));
  };

  const messageHandler = (e: BaseSyntheticEvent) => {
    setMessage(e.target.value);
  };

  const submitMessage = () => {
    if (message !== "") {
      const userMessage: ChatMessage = {
        content: message,
        timestamp: new Date().toString(),
        role: "user",
      };
      updateBotWriting(true);
      updateUserMessages(userMessage);
      iaHandler(userMessage);
      setMessage("");
    }
  };

  return (
    <Grid container item xs={11} sx={{ margin: "0 auto", padding: "10px" }}>
      <Grid item xs={10} alignContent={"center"}>
        <StyledMessageInput
          id={"message-input"}
          sx={{ width: "100%", background: "white" }}
          type="text"
          name="message"
          size="small"
          onChange={messageHandler}
          value={message}
          color="secondary"
          placeholder={`Ingrese su mensaje...`}
          inputProps={{
            style: { fontSize: 16, borderRadius: "24px !important"   },
          }}
        />
      </Grid>
      <Grid item xs={2} textAlign={"end"}>
        <Button
          id={"submit-message"}
          onClick={submitMessage}
          sx={{
            borderRadius: "32px",
            height: "45px !important",
            padding: "0px !important",
          }}
        >
          <SendIcon fontSize={"large"} sx={{
            color: theme.palette.secondary.dark,
            transition: "color 0.2s ease-in-out",

            "&:hover":{
              color: theme.palette.primary.main,
            },
          }}/>
        </Button>
      </Grid>
    </Grid>
  );
};

export default MessageTool;
