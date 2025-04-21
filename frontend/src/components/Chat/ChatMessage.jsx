import React from 'react';
import { Avatar, Box, Typography, Paper } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const ChatMessage = ({ message, showTimestamp }) => {
  const isUser = message.sender === 'user';
  const avatarIcon = isUser ? <PersonIcon /> : <SmartToyIcon />;
  const align = isUser ? 'flex-end' : 'flex-start';
  
  return (
    <Box 
      display="flex" 
      alignItems="flex-start"
      justifyContent={align} 
      mb={2}
      sx={{ opacity: 1, animation: 'fadeIn 0.3s ease-in-out' }}
    >
      {!isUser && (
        <Avatar 
          sx={{ 
            mr: 1, 
            bgcolor: 'primary.light',
            mt: 0.5
          }}
        >
          {avatarIcon}
        </Avatar>
      )}
      
      <Paper 
        elevation={1}
        sx={{ 
          p: 1.5, 
          maxWidth: '70%', 
          borderRadius: 2,
          bgcolor: isUser ? 'primary.main' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          position: 'relative'
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
        {showTimestamp && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              textAlign: 'right', 
              mt: 0.5,
              opacity: 0.8
            }}
          >
            {message.timestamp}
          </Typography>
        )}
      </Paper>
      
      {isUser && (
        <Avatar 
          sx={{ 
            ml: 1, 
            bgcolor: 'secondary.main',
            mt: 0.5
          }}
        >
          {avatarIcon}
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;