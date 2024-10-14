import { useWidgetContext } from "@/components/pages/Builder/Widget/WidgetContext";
import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";
import { default_theme } from "../../../styles/default_theme";

const ChatMainContainer = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { chatState, widgetData } = useWidgetContext();

  const { children, ...otherProps } = props;
  return (
    <Box
      ref={ref}
      {...otherProps}
      sx={{
        width: "100%",
        height: "80%",
        fontSize: "80%",
        overflow: "hidden",
        overflowY: "scroll",
        opacity: `${chatState ? "1" : "0"}`,
        transition: "opacity 0.5s",
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        scrollbarGutter: "none",
        scrollbarColor: `${
          widgetData.primary_color
            ? widgetData.primary_color
            : default_theme.palette.primary.main
        } transparent`,
        display: `${chatState ? "flex" : "none"}`,
        justifyContent: "center",
      }}
    >
      {children}
    </Box>
  );
});

export default ChatMainContainer;
