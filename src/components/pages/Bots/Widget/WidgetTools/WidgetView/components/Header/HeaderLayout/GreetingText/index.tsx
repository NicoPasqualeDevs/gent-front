import { useWidgetContext } from "@/components/pages/Bots/Widget/WidgetContext";
import { Box, Typography } from "@mui/material";
import { default_theme } from "../../../../styles/default_theme";

const GreetingText: React.FC = () => {
  const { chatState, widgetData } = useWidgetContext();

  return (
    <Box
      sx={{
        height: "50%",
        width: "100%",
        display: `${
          chatState
            ? "flex"
            : () => {
                setTimeout(() => {
                  return "none";
                }, 600);
              }
        }`,
        alignItems: "end",
        justifyContent: "end",
        alignContent: "end",
        opacity: `${chatState ? "0" : "1"}`,
        transition: "opacity 0.5s",
      }}
    >
      <Typography
        sx={{
          margin: "0 0 0 0",
          marginBottom: "5%",
          fontSize: `${chatState ? "0px" : "120%"}`,
          transition: "font-size 0.5s",
          color: `${
            widgetData.primary_textContrast
              ? widgetData.primary_textContrast
              : default_theme.palette.primary.textContrast
          }`,
        }}
      >
        Hola 👋 ¿Cómo podemos ayudarte?
      </Typography>
    </Box>
  );
};

export default GreetingText;
