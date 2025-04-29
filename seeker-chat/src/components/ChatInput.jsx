import React, { useState, useRef } from 'react';
import { Box, IconButton, InputAdornment, TextField, CircularProgress, Typography } from '@mui/material';
import { Send, Image as ImageIcon, Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const handleSend = async () => {
    if (!text.trim() && !imageFile) return;

    setIsSending(true);
    await onSend({ text, image: imageFile });
    setIsSending(false);

    setText('');
    setImageFile(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <Box
      p={2}
      sx={{
        backgroundColor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {imageFile && (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          bgcolor={theme.palette.background.paper}
          p={1}
          borderRadius={2}
          boxShadow={1}
        >
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {imageFile.name}
          </Typography>
          <IconButton size="small" onClick={handleImageRemove}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={1}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <ImageIcon />
                </IconButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageSelect}
                />
              </InputAdornment>
            ),
          }}
        />

        <IconButton
          onClick={handleSend}
          disabled={isSending}
          sx={{
            ml: 1,
            p: 1.5,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'scale(1.05)',
            },
          }}
        >
          {isSending ? <CircularProgress size={24} color="inherit" /> : <Send />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatInput;
