import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Stack,
  Menu,
} from "@mui/material";
import { Delete, Star } from "@mui/icons-material";
import { KeyboardArrowDown } from "@mui/icons-material";
function TableControls({
  selectedCount,
  onAddOfferClick,
  deleteMultipleOffersClick,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Box
      sx={{
        width: "95%",
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
      >
        <Button
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="outlined"
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: "#6D727F",
            fontFamily: "Poppins",
            borderColor: "black",
            width: "180px",
            height: "56px",
          }}
        >
          Zaznaczono {selectedCount}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              deleteMultipleOffersClick();
              handleClose();
            }}
          >
            <Delete />
            Usuń
          </MenuItem>
          <MenuItem>
            <Star />
            Dodaj do ciekawych ofert
          </MenuItem>
        </Menu>
        <FormControl
          sx={{
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              color: "#535968",
            },
            "& .MuiFormLabel-root.Mui-focused": {
              fontFamily: "Poppins",
              color: "#535968",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
            "& .MuiOutlinedInput-root": {
              fontFamily: "Poppins",
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              color: "#535968",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#535968",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#535968",
            },
          }}
        />

        <Button
          variant="contained"
          sx={{
            height: "100%",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
          }}
          onClick={onAddOfferClick}
        >
          Dodaj ofertę
        </Button>
      </Stack>
    </Box>
  );
}

export default TableControls;
