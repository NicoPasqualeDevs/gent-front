import { useWidgetContext } from "@/pages/Builder/Widget/WidgetContext";
import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";
import { default_theme } from "../../../styles/default_theme";

const ChatActionContainer = forwardRef<HTMLDivElement, BoxProps>(
  (props, ref) => {
    const { chatState, widgetData } = useWidgetContext();

    const { children, ...otherProps } = props;
    return (
      <Box
        ref={ref}
        {...otherProps}
        sx={{
          height: "10%",
          display: `${
            chatState
              ? "flex"
              : () => {
                  setTimeout(() => {
                    return "none";
                  }, 600);
                }
          }`,
          justifyContent: "center",
          alignItems: "center",
          opacity: `${chatState ? "1" : "0"}`,
          transition: "opacity 0.5s",
          borderTop: `1px solid ${
            widgetData.primary_color
              ? widgetData.primary_color
              : default_theme.palette.primary.main
          }`,
        }}
      >
        {children}
      </Box>
    );
  }
);

export default ChatActionContainer;
