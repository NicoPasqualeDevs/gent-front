import { Box, Button } from "@mui/material";
import { default_theme } from "../../styles/default_theme";
import ChatIcon from "./ChatIcon";
import PopUpBadge from "./PopUpBadge";
import HiddenIcon from "./HiddenIcon";
import { useWidgetContext } from "../../../../WidgetContext";
import useApi from "@/hooks/useApi";

const PopUpButton: React.FC = () => {
  const { popUpState, widgetData, setPopUpState } = useWidgetContext();
  const { apiBase } = useApi();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "1%",
        marginBottom: "1%",
      }}
    >
      <Button
        sx={{
          height: "50px",
          width: "50px",
          borderRadius: "50%",
          paddingTop: "30px",
          paddingRight: "0px",
          paddingLeft: "0px",
          paddingBottom: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "background-color 0.5s ease",
          backgroundColor: `${
            widgetData?.primary_color
              ? widgetData.primary_color
              : default_theme.palette.primary.main
          }`,
          color: `${
            widgetData?.primary_textContrast
              ? widgetData.primary_textContrast
              : default_theme.palette.primary.textContrast
          }`,

          ":hover": {
            backgroundColor: `${
              widgetData?.secondary_color
                ? widgetData.secondary_color
                : default_theme.palette.secondary.main
            }`,
            color: `${
              widgetData?.secondary_textContrast
                ? widgetData.secondary_textContrast
                : default_theme.palette.secondary.textContrast
            }`,
          },
        }}
        onClick={() => setPopUpState(!popUpState)}
      >
        <PopUpBadge widgetData={widgetData} />
        {popUpState ? (
          widgetData?.icon_hidden ? (
            <Box
              component={"img"}
              src={apiBase.slice(0, -1) + widgetData?.icon_hidden}
              alt="hidden_icon"
              loading="lazy"
              sx={{ width: "50%" }}
            />
          ) : (
            <HiddenIcon sx={{ width: "50%" }} />
          )
        ) : widgetData?.icon_chat ? (
          <Box
            component={"img"}
            src={apiBase.slice(0, -1) + widgetData?.icon_chat}
            alt="chat_icon"
            loading="lazy"
            sx={{ width: "50%" }}
          />
        ) : (
          <ChatIcon sx={{ width: "50%" }} />
        )}
      </Button>
    </Box>
  );
};

export default PopUpButton;
