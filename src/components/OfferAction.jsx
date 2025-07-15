import React, { useState } from "react";
import { TableCell, IconButton, Tooltip } from "@mui/material";
import {
  Delete,
  Edit,
  Star,
  CalendarMonth,
  Map,
  AssignmentInd,
  Info,
  Assignment,
} from "@mui/icons-material";
import { useReadFiltersConfig } from "../config/filtersCookiesConfig";
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
  handleAssignmentOfferToClientClick,
}) {
  const [filters] = useState(useReadFiltersConfig());

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

      {filters.clientId && (
        <Tooltip title="Przypisz ofertę klientowi">
          <IconButton
            onClick={() =>
              handleAssignmentOfferToClientClick(filters.clientId, row._id)
            }
            sx={{
              padding: "4px",
              color: "#ffbd00",
            }}
          >
            <Assignment />
          </IconButton>
        </Tooltip>
      )}

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

      {row.miasto && row.ulica && (
        <Tooltip title="Pokaż na mapie">
          <IconButton
            onClick={() => {
              const { ulica, miasto } = row;
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

      <Tooltip title="Przypisz ofertę agentowi">
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
