import { useWidgetContext } from "@/pages/Builder/Widget/WidgetContext";
import { Box, Button, Typography } from "@mui/material";
import { default_theme } from "../../../styles/default_theme";

const StartButton: React.FC = () => {
  const { chatState, widgetData, setChatState } = useWidgetContext();

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "-8%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        transition: "opacity 0.5s",
      }}
    >
      <Button
        sx={{
          borderRadius: "10px",
          backgroundColor: "white",
          boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.2)",
          opacity: `${chatState ? "0" : "1"}`,
          transition: "opacity 0.5s",
          width: "90%",
          textAlign: "center",
          color: `${
            widgetData.primary_color
              ? widgetData.primary_color
              : default_theme.palette.primary.main
          }`,
          ":hover": {
            backgroundColor: "white",
          },
          display: `${
            chatState
              ? () => {
                  setTimeout(() => {
                    return "none";
                  }, 600);
                }
              : "block"
          }`,
        }}
        onClick={() => {
          if (!chatState) {
            setChatState(true);
          }
        }}
      >
        <Typography>Envíanos un mensaje</Typography>
      </Button>
    </Box>
  );
};

export default StartButton;
