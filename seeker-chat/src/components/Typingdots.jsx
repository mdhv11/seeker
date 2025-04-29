import React from "react";
import { Box } from "@mui/material";

const TypingDots = () => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "grey.500",
          animation: "typingBlink 1.4s infinite",
          animationDelay: "0s",
        }}
      />
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "grey.500",
          animation: "typingBlink 1.4s infinite",
          animationDelay: "0.2s",
        }}
      />
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "grey.500",
          animation: "typingBlink 1.4s infinite",
          animationDelay: "0.4s",
        }}
      />
      <style>
        {`
          @keyframes typingBlink {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default TypingDots;
