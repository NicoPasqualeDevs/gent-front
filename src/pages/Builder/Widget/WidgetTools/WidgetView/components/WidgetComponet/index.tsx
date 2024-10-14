import { Box } from "@mui/material";
import Header from "../Header";
import { useEffect } from "react";
import { useWidgetContext } from "../../../../WidgetContext";
import FAQContent from "../FAQContent";
import ChatContent from "../ChatContent";
import { default_theme } from "../../styles/default_theme";

const WidgetComponent: React.FC = () => {
  const { widgetData, setWidgetData } = useWidgetContext();

  useEffect(() => {
    setWidgetData({ id: "1" });
  }, []);
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "25%",
        height: "80%",
        borderRadius: "15px",
        position: "relative",
        overflow: "hidden",
        fontFamily: `${
          widgetData.font_family
            ? widgetData.font_family
            : default_theme.typography.fontFamily
        }`,
      }}
    >
      <Header />
      <FAQContent />
      <ChatContent />
    </Box>
  );
};

export default WidgetComponent;
