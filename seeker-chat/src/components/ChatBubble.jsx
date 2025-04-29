import React from "react";
import { Box, Typography, Avatar, Paper, useTheme } from "@mui/material";
import TypingDots from "./TypingDots";

const ChatBubble = ({ message, isUser, showTimestamp }) => {
  const theme = useTheme();

  if (!message || typeof message !== "object") return null; // Guard clause

  const bubbleBgColor = isUser
    ? theme.palette.mode === "dark"
      ? "#2E7D32" // Dark green
      : "#DCF8C6" // Light green
    : theme.palette.mode === "dark"
    ? "#424242" // Dark grey
    : "#F1F0F0"; // Light grey

  const textColor = isUser
    ? theme.palette.mode === "dark"
      ? "#C8E6C9"
      : theme.palette.text.primary
    : theme.palette.text.primary;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={isUser ? "flex-end" : "flex-start"}
      mb={2}
      mx={2}
    >
      <Box
        display="flex"
        alignItems="flex-end"
        gap={1}
        maxWidth="75%"
        sx={{
          flexDirection: isUser ? "row-reverse" : "row", // Align user messages to the right
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            bgcolor: isUser
              ? theme.palette.secondary.main
              : theme.palette.primary.main,
            width: 32,
            height: 32,
          }}
        >
          {isUser ? "U" : "B"}
        </Avatar>

        {/* Bubble */}
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            maxWidth: "100%",
            bgcolor: bubbleBgColor,
            color: textColor,
            borderRadius: 2,
            boxShadow: 2,
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {message.typing ? (
            <TypingDots />
          ) : (
            <>
              {/* Image */}
              {message.image && typeof message.image === "string" && (
                <Box mb={1}>
                  <img
                    src={message.image}
                    alt="uploaded"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}

              {/* Text */}
              {message.text && (
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {message.text}
                </Typography>
              )}
            </>
          )}
        </Paper>
      </Box>

      {/* Timestamp */}
      {showTimestamp && !message.typing && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mt: 0.5, fontSize: "0.7rem", opacity: 0.6 }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      )}
    </Box>
  );
};

export default ChatBubble;
