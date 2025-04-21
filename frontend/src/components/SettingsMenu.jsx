import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const SettingsMenu = ({ onClearChat, onToggleTimestamps, showTimestamps }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearChatClick = () => {
    console.log("Clear chat clicked in menu");
    if (typeof onClearChat === 'function') {
      onClearChat();
    } else {
      console.error("onClearChat is not a function");
    }
    handleClose();
  };

  const handleToggleTimestampsClick = () => {
    console.log("Toggle timestamps clicked in menu");
    if (typeof onToggleTimestamps === 'function') {
      onToggleTimestamps();
    } else {
      console.error("onToggleTimestamps is not a function");
    }
    handleClose();
  };

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls={open ? 'settings-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'settings-button',
        }}
      >
        <MenuItem onClick={handleClearChatClick}>Clear Chat</MenuItem>
        <MenuItem onClick={handleToggleTimestampsClick}>
          {showTimestamps ? 'Hide Timestamps' : 'Show Timestamps'}
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenu;