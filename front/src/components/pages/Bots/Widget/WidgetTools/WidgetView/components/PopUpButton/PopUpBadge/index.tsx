import { Box } from "@mui/material";
import { default_theme } from "../../../styles/default_theme";
import { WidgetData } from "@/types/Bots";

interface PopUpBadgeProps {
  widgetData?: WidgetData;
}

const PopUpBadge: React.FC<PopUpBadgeProps> = ({ widgetData }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        width: "22px",
        height: "22px",
        marginBottom: "40px",
        marginRight: "40px",
        borderRadius: "50%",
        fontSize: "120%",
        padding: "0px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: `${
          widgetData?.badge_contrast
            ? widgetData.badge_contrast
            : default_theme.palette.danger.textContrast
        }`,
        backgroundColor: `${
          widgetData?.badge_color
            ? widgetData.badge_color
            : default_theme.palette.danger.main
        }`,
      }}
    >
      !
    </Box>
  );
};

export default PopUpBadge;
