import React from 'react';
import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useCustomTheme } from '../components/Theme/ThemeProvider';

const ToggleThemeButton = () => {
  const { mode, toggleTheme } = useCustomTheme();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ToggleThemeButton;
