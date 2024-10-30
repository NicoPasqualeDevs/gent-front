import theme from "@/styles/theme";
import { Typography, Grid, styled, Box } from "@mui/material";


interface ChatMessageProp {
  role: string;
  content: string;
}

const DialogContent = styled(Box)(() => ({
  "&.MuiBox-root": {
    display: "flex",
    marginBottom: "10px",
  },
}));
const BotMessageContent = styled(Box)(() => ({
  "&.MuiBox-root": {
    backgroundColor: theme.palette.secondary.dark,
    maxWidth: "70%",
    marginTop: "25px",
    padding: '12px',
    borderTopRightRadius: "12px",
    borderBottomRightRadius: "12px",
    borderBottomLeftRadius: "24px",
  },
}));
const UserMessageContent = styled(Box)(() => ({
  "&.MuiBox-root": {
    backgroundColor: theme.palette.primary.main,
    maxWidth: "70%",
    marginTop: "25px",
    padding: "12px",
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "24px",
  },
}));
const StyledTextMessage = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    fontSize: "14px",
  },
}));

export const ChatMessageComponent: React.FC<ChatMessageProp> = ({
  role,
  content,
}) => {
  if (role === "bot") {
    return (
      <DialogContent marginRight={"10px"}>
        <Box marginLeft={"10px"} marginRight={"5px"}>
          <svg
            style={{
              padding: "5px",
              borderRadius: "15px",
              background: theme.palette.secondary.dark,
            }}
            color={`${theme.palette.info.main}`}
            xmlns="http://www.w3.org/2000/svg"
            width="35px"
            height="35px"
            fill="currentColor"
            className="bi bi-robot"
            viewBox="0 0 16 16"
          >
            <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
            <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
          </svg>
        </Box>
        <BotMessageContent>
          <StyledTextMessage color={theme.palette.info.main}>{content}</StyledTextMessage>
        </BotMessageContent>
      </DialogContent>
    );
  }else{
    return (
      <DialogContent marginLeft={"5px"} justifyContent={"end"} >
        <UserMessageContent>
          <StyledTextMessage color={theme.palette.info.main}>{content}</StyledTextMessage>
        </UserMessageContent>
        <Box marginRight={"10px"} marginLeft={"5px"}>
          <svg
            style={{
              padding: "5px",
              borderRadius: "15px",
              background: theme.palette.primary.main,
            }}
            color={`${theme.palette.info.main}`}
            xmlns="http://www.w3.org/2000/svg"
            width="35px"
            height="35px"
            fill="currentColor"
            className="bi bi-robot"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </Box>
      </DialogContent>
    );
  }
};

export const BotWritingComponent: React.FC = () => {
  return (
    <Grid container justifyContent={"center"} marginBottom={"10px"}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        sx={{
          maxWidth: "170px",
          marginLeft: "8px",
          marginTop: "12px",
          backgroundColor: "#bababa",
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          borderBottomLeftRadius: "12px",
        }}
      >
        <svg
          style={{
            padding: "2px",
            borderRadius: "15px",
            background: "transparent",
            marginLeft: "4px",
            marginTop:"2px"
          }}
          color="white"
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          fill="currentColor"
          className="bi bi-robot"
          viewBox="0 0 16 16"
        >
          <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
          <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
        </svg>
        <Typography
          sx={{
            fontSize: "12px",
            lineHeight: "24px",
            padding:"2px",
            width: "120px",
            color: "white",
            marginLeft: "6px",
          }}
        >
          {` Esta escribiendo...`}
        </Typography>
      </Box>
    </Grid>
  );
};
