import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  dialogTitle,
  dialogContent,
  buttonText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "4px",
          fontFamily: "Poppins",
        },
      }}
    >
      {/* ===== HEADER ===== */}
      <DialogTitle
        sx={{
          fontFamily: "Poppins",
          fontSize: "28px",
          fontWeight: 600,
          padding: "24px 24px 12px 24px",
        }}
      >
        {dialogTitle}
      </DialogTitle>

      <Divider />

      {/* ===== CONTENT ===== */}
      <DialogContent
        sx={{
          padding: "24px",
        }}
      >
        <p className="text-lg font-poppins text-black">
          {dialogContent}
        </p>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions
        sx={{
          padding: "16px 24px 24px 24px",
          gap: "16px",
        }}
      >
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            backgroundColor: "#FC8721",
            color: "white",
            fontFamily: "Poppins",
            fontSize: "20px",
            width: "100%",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#e67615",
            },
          }}
        >
          {buttonText}
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: "#6D727F",
            color: "white",
            fontFamily: "Poppins",
            fontSize: "20px",
            width: "100%",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#5c616d",
            },
          }}
        >
          Anuluj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;