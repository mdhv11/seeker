import React, { useState, useEffect } from 'react';
import Navbar from './components/Theme/Navbar';
import ChatWindow from './components/Chat/ChatWindow';
import { useCustomTheme } from './components/Theme/ThemeProvider';
import './App.css';

const App = () => {
  const { toggleTheme } = useCustomTheme();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [showTimestamps, setShowTimestamps] = useState(true);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  const handleClearChat = () => {
    console.log("Clearing chat from App");
    setMessages([]);
  };

  const handleToggleTimestamps = () => {
    console.log("Toggling timestamps from App");
    setShowTimestamps(prev => !prev);
  };
  
  return (
    <div className="app-container">
      <Navbar 
        toggleTheme={toggleTheme}
        onClearChat={handleClearChat}
        onToggleTimestamps={handleToggleTimestamps}
        showTimestamps={showTimestamps}
      />
      <ChatWindow 
        messages={messages}
        setMessages={setMessages}
        showTimestamps={showTimestamps}
      />
    </div>
  );
};

export default App;