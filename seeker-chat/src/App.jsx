import { useState, useEffect, useRef } from "react";
import {
  Typography,
  IconButton,
  Box,
  List,
  ListItem,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  CssBaseline,
} from "@mui/material";
import { Brightness4, Brightness7, MoreVert } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState(
    () => JSON.parse(localStorage.getItem("chatHistory")) || []
  );
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [showTimestamp, setShowTimestamp] = useState(() => {
    const saved = localStorage.getItem("showTimestamp");
    return saved ? JSON.parse(saved) : true;
  });
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const messagesEndRef = useRef(null);

  const darkTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTimestamps = () => {
    const newValue = !showTimestamp;
    setShowTimestamp(newValue);
    localStorage.setItem("showTimestamp", JSON.stringify(newValue));
    handleMenuClose();
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (newMessage) => {
    setError(""); // Clear error on new send
    setProgress(0); // Reset progress
    // Add user message
    setMessages((prev) => [
      ...prev,
      { ...newMessage, sender: "user", timestamp: Date.now() },
    ]);

    // Add typing indicator for the bot
    setMessages((prev) => [
      ...prev,
      { sender: "bot", typing: true, timestamp: Date.now() },
    ]);

    try {
      const formData = new FormData();
      formData.append("text", newMessage.text || "");
      if (newMessage.image) {
        formData.append("image", newMessage.image);
      }

      const response = await axios.post(
        "http://localhost:8080/chat",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percent);
            }
          },
        }
      );

      setProgress(0); // Reset after upload
      // Remove typing indicator and add bot reply
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the typing indicator
        {
          sender: "bot",
          text: response.data.reply || "I have no response.",
          timestamp: Date.now(),
        },
      ]);
      setError(""); // Clear error on success
    } catch (error) {
      setProgress(0); // Reset on error
      console.error(error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove the typing indicator
        {
          sender: "bot",
          text: "⚠️ Server unreachable. Please try again later.",
          timestamp: Date.now(),
        },
      ]);
      setError("⚠️ Server unreachable. Please try again later.");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" height="100vh">
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Seekeer
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={clearHistory}>Clear Chat</MenuItem>
              <MenuItem onClick={toggleTimestamps}>
                {showTimestamp ? "Hide Timestamps" : "Show Timestamps"}
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Chat Messages Area */}
        <Box flex={1} overflow="auto" p={2}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem
                key={idx}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <ChatBubble
                  message={msg}
                  isUser={msg.sender === "user"}
                  showTimestamp={showTimestamp}
                />
              </ListItem>
            ))}
          </List>
          <div ref={messagesEndRef} />
        </Box>

        {/* Chat Input */}
        <Box p={2} borderTop="1px solid" borderColor="divider">
          <ChatInput
            onSend={handleSendMessage}
            error={error}
            setError={setError}
            progress={progress}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
