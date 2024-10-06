import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  dialogTitle,
  dialogContent,
  buttonText,
  buttonColor,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: "10px" } }}
    >
      <DialogTitle
        className=" bg-orange text-white"
        sx={{ fontFamily: ["Poppins"], fontSize: "24px", borderRadius: "10px" }}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <p className=" text-black font-poppins text-xl mt-3">{dialogContent}</p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#6D727F",
            color: "white",
            fontFamily: ["Poppins"],
            fontSize: "18px",
            width: "105px",
          }}
        >
          Anuluj
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={buttonColor}
          sx={{
            color: "white",
            fontFamily: ["Poppins"],
            fontSize: "18px",
            width: "105px",
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
