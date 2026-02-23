import { Box, Button, Stack } from "@mui/material";
import React from "react";

function TableControlsUsers({ onAddUserClick }) {
  return (
    <Box
      sx={{
        width: "100%",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Button
          variant="contained"
          sx={{
            height: "40px",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
            fontSize: "18px",
          }}
          onClick={onAddUserClick}
        >
          Dodaj użytkownika
        </Button>
      </Stack>
    </Box>
  );
}

export default TableControlsUsers;
