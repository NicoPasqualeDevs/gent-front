import { Box } from "@mui/material";
import { useWidgetContext } from "../../../../WidgetContext";
import { default_theme } from "../../styles/default_theme";

const FAQContent: React.FC = () => {
  const { chatState, widgetData, setChatState, setStartQuestion } =
    useWidgetContext();

  return (
    <Box
      sx={{
        width: "100%",
        height: "45%",
        position: "absolute",
        top: "48%",
        justifyContent: "center",
        opacity: `${chatState ? "0" : "1"}`,
        transition: "opacity 0.5s",
        display: `${chatState ? "none" : "flex"}`,
      }}
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          borderRadius: "10px",
          border: `1px solid ${
            widgetData.primary_color
              ? widgetData.primary_color
              : default_theme.palette.primary.main
          }`,
          fontSize: "100%",
          opacity: `${chatState ? "0" : "1"}`,
        }}
      >
        {widgetData.faq_questions?.split("|").map((item) => {
          return (
            <Box
              component={"a"}
              href="#"
              sx={{
                all: "unset",
                margin: "0px",
                padding: "0px 3%",
                cursor: "pointer",
                overflow: "hidden",
                color: `${
                  widgetData.primary_color
                    ? widgetData.primary_color
                    : default_theme.palette.primary.main
                }`,
                opacity: `${chatState ? "0" : "1"}`,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setStartQuestion(item);
                setChatState(true);
              }}
            >
              {item}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default FAQContent;
