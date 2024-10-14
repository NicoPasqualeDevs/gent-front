import { useWidgetContext } from "@/pages/Builder/Widget/WidgetContext";
import { Box, Button } from "@mui/material";
import { default_theme } from "../../../styles/default_theme";
import useApi from "@/hooks/useApi";

const BackButton: React.FC = () => {
  const {
    chatState,
    widgetData,
    conversation_id,
    setChatState,
    setConversationID,
  } = useWidgetContext();

  const { apiPost } = useApi();

  const closeConversation = (conversation_id: string) => {
    const path = "api/clean-chat";
    return apiPost(path, { conversation_id: conversation_id });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "end",
        transition: "width 0.5s",
        width: `${chatState ? "60%" : "30%"}`,
      }}
    >
      <Button
        sx={{
          width: "30%",
          fontSize: "120%",
          padding: "2%",
          borderRadius: "20px",
          opacity: `${chatState ? "1" : "0"}`,
          transition: "opacity 0.5s",
          color: `${
            widgetData.primary_textContrast
              ? widgetData.primary_textContrast
              : default_theme.palette.primary.textContrast
          }`,
          ":hover": {
            color: `${
              widgetData.secondary_color
                ? widgetData.secondary_color
                : default_theme.palette.secondary.main
            }`,
          },
        }}
        onClick={() => {
          if (chatState) {
            setChatState(false);
            if (conversation_id) {
              closeConversation(conversation_id)
                .then(() => {
                  setConversationID("");
                  console.log("conversacion cerrada");
                })
                .catch(() => {
                  console.log("no se pudo cerrar la conversación");
                });
            }
          }
        }}
      >
        X
      </Button>
    </Box>
  );
};

export default BackButton;
