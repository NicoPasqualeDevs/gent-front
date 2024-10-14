import { useWidgetContext } from "@/components/pages/Builder/Widget/WidgetContext";
import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";
import { default_theme } from "../../../styles/default_theme";

interface ChatInputProps extends BoxProps {
  name: string;
}

const ChatInput = forwardRef<HTMLDivElement, ChatInputProps>((props, ref) => {
  const { widgetData } = useWidgetContext();

  const { ...otherProps } = props;
  return (
    <Box
      ref={ref}
      {...otherProps}
      sx={{
        all: "unset",
        width: "70%",
        fontSize: "90%",
        marginRight: "2%",
        paddingLeft: "2%",
        paddingTop: "2%",
        paddingBottom: "2%",
        borderRadius: "10px",
        border: "1px solid gray",
        color: `${
          widgetData.primary_color
            ? widgetData.primary_color
            : default_theme.palette.primary.main
        }`,
        ":hover": {
          border: `1px solid ${
            widgetData.primary_color
              ? widgetData.primary_color
              : default_theme.palette.primary.main
          }`,
        },
      }}
    />
  );
});

export default ChatInput;
