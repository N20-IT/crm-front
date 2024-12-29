import React, { useEffect } from "react";
import { TableCell, IconButton, Tooltip } from "@mui/material";
import {
  Delete,
  Edit,
  Star,
  CalendarMonth,
  Map,
  AssignmentInd,
  Info,
} from "@mui/icons-material";

function OfferActions({
  row,
  userRole,
  readConfig,
  handleDeleteOfferClick,
  handleEditClick,
  handleAddToCalendar,
  handleUpdateOfferAgentClick,
  handleGoToOfferDetailsPage,
  showDetailsIcon,
  handleChangeOfferInterestClick,
}) {
  useEffect(() => {
    console.log(row);
  });
  return (
    <TableCell
      style={{
        textAlign: "center",
        maxHeight: "60px",
        padding: "0px",
        fontFamily: "Poppins",
      }}
    >
      {userRole === "admin" && (
        <Tooltip title="Usuń">
          <IconButton
            onClick={() => handleDeleteOfferClick([row._id])}
            sx={{
              padding: "4px",
              color: "#A11D1D",
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Edytuj">
        <IconButton
          onClick={() => handleEditClick(row)}
          sx={{
            padding: "4px",
            color: "#6A99C7",
          }}
        >
          <Edit />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={
          row.czyCiekawa ? "Usuń z ciekawych ofert" : "Dodaj do ciekawych ofert"
        }
      >
        <IconButton
          onClick={() => handleChangeOfferInterestClick(row)}
          sx={{
            padding: "4px",
            color: row.czyCiekawa ? "#FFD700" : "grey",
          }}
        >
          <Star />
        </IconButton>
      </Tooltip>

      {readConfig === 1 && (
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

      {row.adres?.miasto && row.adres?.ulica && (
        <Tooltip title="Pokaż na mapie">
          <IconButton
            onClick={() => {
              const { ulica, miasto } = row.adres;
              const location = `${miasto}, ${ulica}`;
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                location
              )}`;
              window.open(googleMapsUrl, "_blank");
            }}
            sx={{
              padding: "4px",
              color: "#FC8721",
            }}
          >
            <Map />
          </IconButton>
        </Tooltip>
      )}

      <Tooltip title="Przypisz ofertę">
        <IconButton
          onClick={() => handleUpdateOfferAgentClick(row._id)}
          sx={{
            padding: "4px",
            color: "#765592",
          }}
        >
          <AssignmentInd />
        </IconButton>
      </Tooltip>

      <Tooltip title="Szczegóły oferty">
        {showDetailsIcon && (
          <IconButton
            onClick={() => handleGoToOfferDetailsPage(row._id)}
            sx={{
              padding: "4px",
              color: "#777",
            }}
          >
            <Info />
          </IconButton>
        )}
      </Tooltip>
    </TableCell>
  );
}

export default OfferActions;
