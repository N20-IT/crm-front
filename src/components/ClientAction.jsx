import { Delete, Edit, Info } from "@mui/icons-material";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import React from "react";

function ClientAction({
  row,
  handleDeleteClientClick,
  handleEditClientClick,
  showDetailsIcon,
  handleGoToClientDetails,
}) {
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
          onClick={() => handleDeleteClientClick([row._id])}
          sx={{
            padding: "4px",
            color: "#A11D1D",
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edytuj">
        <IconButton
          sx={{ padding: "4px", color: "#6A99C7" }}
          onClick={() => handleEditClientClick(row)}
        >
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Szczegóły klienta">
        {showDetailsIcon && (
          <IconButton
            sx={{ padding: "4px", color: "#777" }}
            onClick={() => handleGoToClientDetails(row._id)}
          >
            <Info />
          </IconButton>
        )}
      </Tooltip>
    </TableCell>
  );
}

export default ClientAction;
