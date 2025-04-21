import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const TypingIndicator = () => {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" alignItems="center" mb={2} ml={1}>
      <Avatar sx={{ mr: 1, bgcolor: 'primary.light' }}>
        <SmartToyIcon />
      </Avatar>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 2,
          py: 1,
          px: 2,
          boxShadow: 1,
          maxWidth: '70%'
        }}
      >
        <Typography variant="body2">
          Typing{dots}
        </Typography>
      </Box>
    </Box>
  );
};

export default TypingIndicator;