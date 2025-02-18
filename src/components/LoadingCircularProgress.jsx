import React from "react";
import { CircularProgress, Box } from "@mui/material";

function LoadingCircularProgress() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <CircularProgress sx={{ color: "#FC8721" }} size={60} thickness={5} />
    </Box>
  );
}

export default LoadingCircularProgress;
