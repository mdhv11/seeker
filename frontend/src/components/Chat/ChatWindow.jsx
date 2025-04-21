import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { StyledInput, SendButton } from './EnhancedChatStyles';
import TypingIndicator from './TypingIndicator';
import ChatMessage from './ChatMessage';
import ScrollToBottom from './ScrollToBottom';

const ChatWindow = ({ messages, setMessages, showTimestamps }) => {
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (!isBotTyping) {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isBotTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    try {
      // Simulate network delay for typing indicator (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || 'Oops! Something went wrong.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now() + 2,
        text: 'Oops! Something went wrong.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="calc(100vh - 64px)" 
      sx={{ overflow: 'hidden', position: 'relative' }}
    >
      {/* Chat messages */}
      <Box 
        ref={messagesContainerRef}
        flexGrow={1} 
        overflow="auto" 
        px={2} 
        py={2}
        sx={{
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {messages.length === 0 && (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%"
            sx={{ opacity: 0.5 }}
          >
            Start a conversation!
          </Box>
        )}
        
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id}
            message={msg}
            showTimestamp={showTimestamps}
          />
        ))}
        
        {isBotTyping && <TypingIndicator />}
      </Box>

      {/* Scroll to bottom button */}
      <ScrollToBottom scrollContainerRef={messagesContainerRef} />

      {/* Input area */}
      <Box 
        p={2} 
        borderTop={1} 
        borderColor="divider"
        bgcolor="background.paper"
      >
        <Box display="flex" alignItems="center">
          <StyledInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            fullWidth
            multiline
            maxRows={3}
          />
          <SendButton 
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <SendIcon />
          </SendButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;