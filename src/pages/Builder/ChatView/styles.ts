import { styled } from "@mui/material/styles";
import { Box, TextField, Typography } from "@mui/material";

export const MainContainer = styled(Box)(() => ({
  height: '100vh',
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  display: 'flex',
}));

export const SidebarContainer = styled(Box)(() => ({
  width: '120px',
  borderRight: '1px solid #333333',
  display: 'flex',
  flexDirection: 'column',
}));

export const ChatContainer = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

export const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #333333',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[600],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.palette.grey[500],
  },
}));

export const MessageBubble = styled(Box)<{ role: 'bot' | 'client' }>(({ theme, role }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  paddingLeft: role === 'bot' ? theme.spacing(1) : 0,
  paddingRight: role === 'bot' ? 0 : theme.spacing(1),
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
  backgroundColor: role === 'bot' ? '#383838' : '#2b5278',
  alignSelf: role === 'bot' ? 'flex-start' : 'flex-end',
  display: 'flex',
  flexDirection: role === 'bot' ? 'row' : 'row-reverse',
  alignItems: 'flex-start',
}));

export const MessageContent = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  marginRight: theme.spacing(3),
  flexGrow: 1,
  position: 'relative',
  paddingBottom: theme.spacing(2),
}));

export const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #333333',
}));

export const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': {
      borderColor: '#555555',
    },
    '&:hover fieldset': {
      borderColor: '#777777',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4a90e2',
    },
  },
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 0.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60px',
}));

export const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  opacity: 0.5,
  position: 'absolute',
  right: 0,
  bottom: 0,
  marginTop: theme.spacing(0.5),
}));

export const HistoryBubble = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#383838',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '4px auto',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#4a4a4a',
  },
}));
