import { Box } from "@mui/material";
import { useWidgetContext } from "../../../../WidgetContext";
import { default_theme } from "../../styles/default_theme";
import LoadBot from "./LoadBot";
import SendIcon from "./SendIcon";
import * as Yup from "yup";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import DialogContent from "./DialogContent";
import WritingBubble from "./WritingBubble";
import useApi from "@/hooks/useApi";
import autoScroll from "../../helpers/autoScroll";
import {
  InputData,
  LetterSubstitution,
  MessageResponse,
  MessagesData,
} from "../../types";
import forbidenContentDetector from "../../helpers/forbidenContentDetector";
import ChatMainContainer from "./ChatMainContainer";
import ChatActionContainer from "./ChatActionContainer";
import ChatInput from "./ChatInput";

const letterSubstitutions: LetterSubstitution = {
  i: "[iìíîïīįīǐ!1]",
  a: "[aàáâãäåāăą@]",
  e: "[eèéêëēėęě]",
  o: "[oòóôõöōųō]",
};

const initialValues: InputData = {
  input: "",
};

const validationSchema = Yup.object({
  input: Yup.string(),
});

const ChatContent: React.FC = () => {
  const {
    widgetData,
    chatState,
    historyLoaded,
    historyError,
    startQuestion,
    setStartQuestion,
  } = useWidgetContext();
  const [messages, setMessages] = useState<MessagesData[]>([]);
  const [writing, setWriting] = useState<boolean>(false);
  const { apiPost } = useApi();
  const chatContent = useRef<HTMLDivElement>(null);

  const sendMessage = (msg: string): Promise<MessageResponse> => {
    const path = `chat/api/${widgetData.customer_bot}`;
    return apiPost(path, { message: msg });
  };

  const onSubmit = (values: InputData) => {
    const {
      bad_content_alert,
      sql_injection_alert,
      php_injection_alert,
      strange_chars_alert,
      band_content_match,
      band_content_alert,
    } = forbidenContentDetector(
      values.input,
      widgetData.band_list?.split("|"),
      letterSubstitutions,
      widgetData.sql_injection_tester,
      widgetData.php_injection_tester,
      widgetData.strange_chars_tester
    );
    if (values.input.trim() !== "" && historyLoaded && !historyError) {
      if (bad_content_alert) {
        if (sql_injection_alert) {
          setMessages([
            ...messages,
            {
              content:
                "Ha intentado realizar una ataque de Inyección de SQL. Será reportado a las autoridades. Se encuentra en graves problemas",
              role: "client",
            },
          ]);
        } else if (php_injection_alert) {
          setMessages([
            ...messages,
            {
              content:
                "Ha intentado realizar una ataque de Inyección de PHP. Será reportado a las autoridades. Se encuentra en graves problemas",
              role: "client",
            },
          ]);
        } else if (strange_chars_alert) {
          setMessages([
            ...messages,
            {
              content:
                "Está utilizando símbolos sospechosos. Por favor, no los utilice e intente de nuevo",
              role: "client",
            },
          ]);
        } else if (band_content_alert) {
          setMessages([
            ...messages,
            {
              content: `Está utilizando palabras prohibidas. Por favor no utilice las siguientes palabras:${band_content_match.map(
                (item) => ` ${item}`
              )}.`,
              role: "client",
            },
          ]);
        }
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: values.input, role: "client" },
        ]);
        setWriting(true);
        sendMessage(values.input)
          .then((response) => {
            setWriting(false);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: response.response.content,
                role: response.response.role,
              },
            ]);
            if (response.reserve_link) {
              window.location = response.reserve_link;
            }
          })
          .catch((error) => {
            console.log(error);
            setWriting(false);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: "el servidor está sobrecargado, intente de nuevo",
                role: "bot",
              },
            ]);
          });
      }
    }
  };

  const { handleSubmit, handleChange } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  useEffect(() => {
    autoScroll(chatContent);
  }, [messages]);

  useEffect(() => {
    if (!chatState) {
      setMessages([]);
    }
    if (chatState) {
      if (startQuestion && startQuestion.trim() !== "") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: startQuestion, role: "client" },
        ]);
        setWriting(true);
        sendMessage(startQuestion)
          .then((response) => {
            setStartQuestion("");
            setWriting(false);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: response.response.content,
                role: response.response.role,
              },
            ]);
            if (response.reserve_link) {
              window.location = response.reserve_link;
            }
          })
          .catch((error) => {
            console.log(error);
            setStartQuestion("");
            setWriting(false);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: "el servidor está sobrecargado, intente de nuevo",
                role: "bot",
              },
            ]);
          });
      }
    }
  }, [chatState]);

  return (
    <>
      <ChatMainContainer ref={chatContent}>
        <Box sx={{ width: "90%", height: "100%" }}>
          <LoadBot autoScrollRef={chatContent} />
          {historyLoaded && !historyError
            ? messages.map((msg, index) => {
                return (
                  <DialogContent
                    role={msg.role}
                    content={msg.content}
                    key={`new-msg-${index}`}
                  />
                );
              })
            : null}
          {writing ? <WritingBubble /> : null}
        </Box>
      </ChatMainContainer>
      <ChatActionContainer>
        <Box
          component={"form"}
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "90%",
          }}
        >
          <ChatInput component={"input"} name="input" onChange={handleChange} />
          <Box
            component={"button"}
            type="submit"
            sx={{
              all: "unset",
              width: "10%",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(45deg)",
              cursor: "pointer",
              transition: "color 0.5s ease",
              color: `${
                widgetData.primary_color
                  ? widgetData.primary_color
                  : default_theme.palette.primary.main
              }`,
              ":hover": {
                color: `${
                  widgetData.secondary_color
                    ? widgetData.secondary_color
                    : default_theme.palette.secondary.main
                }`,
              },
            }}
          >
            <SendIcon />
          </Box>
        </Box>
      </ChatActionContainer>
    </>
  );
};

export default ChatContent;
