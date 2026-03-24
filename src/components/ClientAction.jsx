import {
  CalendarMonth,
  Delete,
  DeleteForever,
  Edit,
  Info,
  Print,
  RestoreFromTrash,
} from "@mui/icons-material";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

function ClientAction({
  row,
  handleDeleteClientClick,
  handlePermanentDeleteClientClick,
  handleEditClientClick,
  showDetailsIcon,
  handleGoToClientDetails,
  userRole,
  handleAddToCalendar,
  downloadPDF,
}) {
  const location = useLocation();

  return (
    <TableCell
      style={{
        textAlign: "center",
        maxHeight: "60px",
        padding: "0px",
        fontFamily: "Poppins",
      }}
    >
      {(userRole === "admin" || userRole === "user") &&
        (location.pathname === "/klienci" ? (
          <Tooltip title="Usuń">
            <IconButton
              onClick={() => handleDeleteClientClick(row)}
              sx={{
                padding: "4px",
                color: "#A11D1D",
              }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Przywróć klienta">
            <IconButton
              onClick={() => handleDeleteClientClick(row)}
              sx={{
                padding: "4px",
                color: "#A11D1D",
              }}
            >
              <RestoreFromTrash />
            </IconButton>
          </Tooltip>
        ))}

      {userRole === "admin" && location.pathname !== "/klienci" && (
        <Tooltip title="Usuń trwale">
          <IconButton
            onClick={() => handlePermanentDeleteClientClick(row._id)}
            sx={{
              padding: "4px",
              color: "#6b0000",
            }}
          >
            <DeleteForever />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Edytuj">
        <IconButton
          sx={{ padding: "4px", color: "#6A99C7" }}
          onClick={() => handleEditClientClick(row)}
        >
          <Edit />
        </IconButton>
      </Tooltip>

      {row.dataNastepnegoKontaktu && row.daneKlienta && (
        <Tooltip title="Dodaj do kalendarza">
          <IconButton
            onClick={() => handleAddToCalendar(row)}
            sx={{
              padding: "4px",
              color: "#6A9F6C",
            }}
          >
            <CalendarMonth />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Pobierz PDF">
        <IconButton
          onClick={() => downloadPDF(row)}
          sx={{
            padding: "4px",
            color: "black",
          }}
        >
          <Print />
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
