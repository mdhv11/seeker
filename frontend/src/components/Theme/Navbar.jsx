import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Paper, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import SettingsMenu from '../SettingsMenu';

const Navbar = ({ toggleTheme, onClearChat, onToggleTimestamps, showTimestamps }) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Paper
          elevation={4}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: '20px',
            background: 'linear-gradient(to right, #2196f3, #21cbf3)',
            color: '#fff',
            fontWeight: 'bold',
            boxShadow: '0 0 8px rgba(0,0,0,0.3)',
          }}
        >
          <Typography variant="h6" component="div">
            Seekeer
          </Typography>
        </Paper>

        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit">
              <Brightness4Icon />
            </IconButton>
          </Tooltip>

          <Box display={{ xs: 'none', sm: 'block' }}>
            <SettingsMenu 
              onClearChat={onClearChat}
              onToggleTimestamps={onToggleTimestamps}
              showTimestamps={showTimestamps}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;