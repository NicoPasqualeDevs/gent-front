import { useWidgetContext } from "@/components/pages/Builder/Widget/WidgetContext";
import useApi from "@/hooks/useApi";
import { Box } from "@mui/material";
import { default_theme } from "../../../../styles/default_theme";

const BrandImg: React.FC = () => {
  const { apiBase } = useApi();
  const { chatState, widgetData } = useWidgetContext();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: `${chatState ? "40%" : "70%"}`,
        transition: "width 0.5s",
      }}
    >
      <Box
        component={"img"}
        src={apiBase.slice(0, -1) + widgetData.brand_logo}
        alt={widgetData.brand_alt}
        loading="lazy"
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          fontSize: `${chatState ? "2.5vh" : "4vh"}`,
          transition: "font-size 0.5s",
          color: `${
            widgetData.primary_textContrast
              ? widgetData.primary_textContrast
              : default_theme.palette.primary.textContrast
          }`,
        }}
      ></Box>
    </Box>
  );
};

export default BrandImg;
