import React, { useState, useRef } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  Typography,
  LinearProgress,
} from "@mui/material";
import {
  Send,
  Image as ImageIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const ChatInput = ({ onSend, error, setError, progress }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const theme = useTheme();

  const handleSend = async () => {
    if (!text.trim() && !imageFile) return;

    setText("");
    setImageFile(null);
    setError && setError("");

    setIsSending(true);
    await onSend({ text, image: imageFile });
    setIsSending(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: "100%",
        maxWidth: { xs: "100vw", sm: "100%" },
        boxSizing: "border-box",
        "@media (max-width:600px)": {
          p: 1,
        },
      }}
    >
      {/* Upload progress bar */}
      {progress > 0 && progress < 100 && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 1 }}
          aria-label="Image upload progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      )}

      {imageFile && (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          bgcolor={theme.palette.background.paper}
          p={1}
          borderRadius={2}
          boxShadow={1}
          aria-label={`Image preview: ${imageFile.name}`}
        >
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ flexGrow: 1 }}
          >
            {imageFile.name}
          </Typography>
          <IconButton
            size="small"
            onClick={handleImageRemove}
            aria-label="Remove image"
            disabled={progress > 0 && progress < 100}
          >
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
          inputRef={inputRef}
          InputProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach image"
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <ImageIcon />
                </IconButton>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleImageSelect}
                />
              </InputAdornment>
            ),
          }}
          aria-label="Type a message"
        />

        <IconButton
          onClick={handleSend}
          disabled={isSending || (progress > 0 && progress < 100)}
          aria-label="Send message"
          sx={{
            ml: 1,
            p: 1.5,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "scale(1.05)",
            },
          }}
        >
          {isSending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Send />
          )}
        </IconButton>
      </Box>
      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{ mt: 0.5, color: "#d32f2f", fontWeight: 500 }}
          role="alert"
          aria-live="assertive"
        >
          {error}
        </Typography>
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, color: "#1976d2", fontWeight: 500 }}
        aria-label="Input instructions"
      >
        Press <b>Enter</b> to send, <b>Shift+Enter</b> for newline
      </Typography>
    </Box>
  );
};

export default ChatInput;
