import { useWidgetContext } from "@/components/pages/Bots/Widget/WidgetContext";
import { Box, Typography } from "@mui/material";
import { default_theme } from "../../../styles/default_theme";
import BotIcon from "../BotIcon";
import useApi from "@/hooks/useApi";
import transformTextToStrong from "../../../helpers/transformTextToStrong";
import transformTextToLink from "../../../helpers/transformTextToLink";

interface DialogContentProps {
  key?: string;
  content: string;
  role: string | "bot" | "client";
}

const DialogContent: React.FC<DialogContentProps> = ({
  key,
  content,
  role,
}) => {
  const { widgetData } = useWidgetContext();
  const { apiBase } = useApi();

  return (
    <Box
      key={key ? key : ""}
      sx={
        role === "bot"
          ? {
              display: "flex",
              alignItems: "start",
              justifyContent: "left",
              marginTop: "5px",
              paddingBottom: "20px",
            }
          : {
              display: "flex",
              alignItems: "start",
              justifyContent: "right",
              marginTop: "10px",
              marginBottom: "5px",
            }
      }
    >
      {role === "bot" ? (
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: `${
              widgetData.primary_color
                ? widgetData.primary_color
                : default_theme.palette.primary.main
            }`,
          }}
        >
          {widgetData.icon_bot ? (
            <Box
              component={"img"}
              src={apiBase.slice(0, -1) + widgetData.icon_bot}
              loading="lazy"
              sx={{
                maxWidth: "80%",
                maxHeight: "80%",
              }}
            ></Box>
          ) : (
            <BotIcon
              sx={{
                width: "70%",
                color: `${
                  widgetData.primary_textContrast
                    ? widgetData.primary_textContrast
                    : default_theme.palette.primary.textContrast
                }`,
              }}
            />
          )}
        </Box>
      ) : null}
      <Box
        sx={
          role === "bot"
            ? {
                maxWidth: "65%",
                marginTop: "15px",
                marginLeft: "5px",
                borderTopRightRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                backgroundColor: `${
                  widgetData.primary_color
                    ? widgetData.primary_color
                    : default_theme.palette.primary.main
                }`,
              }
            : {
                maxWidth: "65%",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                backgroundColor: `${
                  widgetData.secondary_color
                    ? widgetData.secondary_color
                    : default_theme.palette.secondary.main
                }`,
              }
        }
      >
        <Typography
          component={"p"}
          sx={
            role
              ? {
                  padding: "10px",
                  margin: "0px",
                  color: `${
                    widgetData.primary_textContrast
                      ? widgetData.primary_textContrast
                      : default_theme.palette.primary.textContrast
                  }`,
                }
              : {
                  padding: "10px",
                  margin: "0px",
                  color: `${
                    widgetData.secondary_textContrast
                      ? widgetData.secondary_textContrast
                      : default_theme.palette.secondary.textContrast
                  }`,
                }
          }
          dangerouslySetInnerHTML={{
            __html: transformTextToStrong(transformTextToLink(content)),
          }}
        ></Typography>
      </Box>
    </Box>
  );
};

export default DialogContent;
