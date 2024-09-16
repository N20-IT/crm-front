import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";

function TableControls({ selectedCount }) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Box
      sx={{
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Typography>Zaznaczono: {selectedCount}</Typography>

        <FormControl
          sx={{
            "& .Mui-focused": {
              color: "#6D727F",
              borderColor: "#6D727F",
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6D727F",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6D727F",
            },
            "& :hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
          }}
        >
          <InputLabel id="filter-label">Filtruj</InputLabel>
          <Select
            labelId="filter-label"
            value={""}
            onChange={() => {}}
            label="Filtruj"
            sx={{
              minWidth: "120px",
            }}
          >
            <MenuItem value={""}>Brak filtra</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Szukaj..."
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            flex: 1,
            "& .Mui-focused": {
              color: "#6D727F",
              borderColor: "#6D727F",
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6D727F",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6D727F",
            },
            "& :hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
          }}
        />

        <Button
          variant="contained"
          sx={{ height: "100%", backgroundColor: "#FC8721" }}
        >
          Dodaj ofertę
        </Button>
      </Stack>
    </Box>
  );
}

export default TableControls;
