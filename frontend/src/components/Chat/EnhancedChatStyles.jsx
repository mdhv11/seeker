import { styled } from '@mui/material/styles';
import { Box, InputBase, IconButton } from '@mui/material';

export const ChatBubble = styled(Box)(({ theme, sender }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: sender === 'user' 
    ? theme.palette.primary.main 
    : theme.palette.background.paper,
  color: sender === 'user' 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(0.5),
  wordBreak: 'break-word',
}));

export const StyledInput = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1, 1.5),
  backgroundColor: theme.palette.background.default,
  borderRadius: 20,
  '&:focus': {
    outline: 'none',
  },
}));

export const SendButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  padding: theme.spacing(1),
}));