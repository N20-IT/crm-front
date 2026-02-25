import {
  Clear,
  Person,
  KeyboardArrowDown,
  ViewList,
  ViewModule,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import CustomTextField from "./CustomTextField";
import { useClientFiltersStore } from "../store/clientFilterStore";
import { useEffect, useState } from "react";
import ClientFilters from "./ClientFilters";

function ClientTableControls({
  onAddClientClick,
  onSearchFilterApply,
  allUsers,
  userInformation
}) {
  const {
    filters,
    clearFilters,
    changeFilterPanelOpen,
  } = useClientFiltersStore();
  const [searchValue, setSearchValue] = useState("");

  const isAnyFilterFilled = (localFilters) => {
    if (!localFilters || typeof localFilters !== "object") {
      return false;
    }

    return Object.values(localFilters).some((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== "";
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length > 2 && value !== searchValue) {
      const updatedFilters = { ...filters };
      onSearchFilterApply(value, updatedFilters);
    } else if (value.length === 0 && value !== searchValue) {
      const updatedFilters = { ...filters };
      onSearchFilterApply(value, updatedFilters);
    }
  };

  const handleFilterChange = (newFilters) => {
    onSearchFilterApply(searchValue, newFilters);
  };

  const emptyFilters = {
    status: "",
    agent: "",
    lokalizacja: [],
    rodzajNieruchomosci: "",
    pokojeOd: "",
    pokojeDo: "",
    metrazOd: "",
    metrazDo: "",
    budzetOd: "",
    budzetDo: "",
    standard: [],
    dataZapytaniaOd: "",
    dataZapytaniaDo: "",
    ostatniKontaktOd: "",
    ostatniKontaktDo: "",
    dataNastepnegoKontaktuOd: "",
    dataNastepnegoKontaktuDo: "",
  };

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
        justifyContent="flex-end"
      >
        <Button
          variant="contained"
          sx={{
            height: "40px",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
            fontSize: "18px",
          }}
          onClick={onAddClientClick}
        >
          Dodaj Klienta
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: isAnyFilterFilled(filters) ? "#009900" : "#6D727F",
            fontFamily: "Poppins",
            borderColor: isAnyFilterFilled(filters) ? "#009900" : "black",
            width: "180px",
            height: "40px",
            fontSize: "18px",
          }}
          onClick={changeFilterPanelOpen}
        >
          Filtruj
        </Button>
        <Tooltip title="Wyczyść filtry">
          <IconButton
            onClick={() => {
              clearFilters();
              onSearchFilterApply(searchValue, emptyFilters);
            }}
            sx={{
              color: isAnyFilterFilled(filters) ? "#CC0000" : "#6D727F",
              border: "1px solid",
              borderColor: isAnyFilterFilled(filters) ? "#CC0000" : "black",
              borderRadius: "4px",
              height: "40px",
              width: "40px",
            }}
          >
            <Clear />
          </IconButton>
        </Tooltip>
        <Tooltip title="Moje rekordy">
          <IconButton
            onClick={() => {
              const updatedFilters = { ...filters, agent: userInformation };
              useClientFiltersStore.getState().setFilters(updatedFilters);
              onSearchFilterApply(searchValue, updatedFilters);
            }}
            sx={{
              color: filters.agent === userInformation ? "#009900" : "#6D727F",
              border: "1px solid",
              borderColor: filters.agent === userInformation ? "#009900" : "black",
              borderRadius: "4px",
              height: "40px",
              width: "40px",
              ml: 1,
            }}
          >
            <Person />
          </IconButton>
        </Tooltip>
        <CustomTextField
          label="Szukaj..."
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleSearchChange({ target: { value: "" } })}
                  edge="end"
                  size="small"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "40px",
            },
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 9px) scale(1)",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
            },
          }}
        />
      </Stack>
      <ClientFilters onFilterApply={handleFilterChange} allUsers={allUsers} />
    </Box>
  );
}

export default ClientTableControls;
