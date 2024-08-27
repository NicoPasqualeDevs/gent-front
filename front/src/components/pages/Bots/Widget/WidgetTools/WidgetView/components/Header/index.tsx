import { Box } from "@mui/material";
import { default_theme } from "../../styles/default_theme";
import { useWidgetContext } from "../../../../WidgetContext";
import StartButton from "./StartButton";
import HeaderLayout from "./HeaderLayout";

const Header: React.FC = () => {
  const { chatState, widgetData } = useWidgetContext();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: "15px",
        borderTopLeftRadius: "15px",
        borderBottom: "1px solid white",
        transition: "height 0.5s",
        backgroundColor: `${
          widgetData?.primary_color
            ? widgetData.primary_color
            : default_theme.palette.primary.main
        }`,
        height: `${chatState ? "10%" : "40%"}`,
      }}
    >
      <HeaderLayout />
      <StartButton />
    </Box>
  );
};

export default Header;
