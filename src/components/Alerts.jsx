import React from "react";
import { Alert, Snackbar } from "@mui/material";

const Alerts = ({ message, severity, open, onClose }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        variant="filled"
        severity={severity}
        sx={{ width: "100%", fontSize: "20px", fontFamily: "Poppins" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alerts;
