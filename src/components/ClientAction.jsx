import { Delete, Edit } from "@mui/icons-material";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import React from "react";

function ClientAction() {
  return (
    <TableCell
      style={{
        textAlign: "center",
        maxHeight: "60px",
        padding: "0px",
        fontFamily: "Poppins",
      }}
    >
      <Tooltip title="Usuń">
        <IconButton
          sx={{
            padding: "4px",
            color: "#A11D1D",
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edytuj">
        <IconButton sx={{ padding: "4px", color: "#6A99C7" }}>
          <Edit />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

export default ClientAction;
