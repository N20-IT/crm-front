import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
const ConfirmDeleteDialog = ({ open, onClose, onConfirm }) => {
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
        Potwierdzenie usunięcia
      </DialogTitle>
      <DialogContent>
        <p className=" text-black font-poppins text-xl mt-3">
          Czy na pewno chcesz usunąć? Ta operacja jest nieodwracalna.
        </p>
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
          color="error"
          sx={{
            color: "white",
            fontFamily: ["Poppins"],
            fontSize: "18px",
            width: "105px",
          }}
        >
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
