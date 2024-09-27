import React, { useState } from "react";
import {
  MenuItem,
  Button,
  Box,
  Stack,
  Menu,
  Drawer,
  Typography,
} from "@mui/material";
import { Delete, Star } from "@mui/icons-material";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomTextField from "./CustomTextField";
function TableControls({
  selectedCount,
  onAddOfferClick,
  deleteMultipleOffersClick,
  onSearchChange,
  onFilterApply,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceError, setPriceError] = useState(false);
  const [touched, setTouched] = useState({ minPrice: false, maxPrice: false });
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    onSearchChange(e.target.value);
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    setPriceError(false);
  };

  const validatePrices = () => {
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const handleMinPriceBlur = () => {
    setTouched({ ...touched, minPrice: true });
    validatePrices();
  };

  const handleMaxPriceBlur = () => {
    setTouched({ ...touched, maxPrice: true });
    validatePrices();
  };
  const handleFilterApply = () => {
    if (!priceError) {
      const filters = {};
      if (minPrice !== "") filters.minPrice = minPrice;
      if (maxPrice !== "") filters.maxPrice = maxPrice;
      console.log(filters);
      onFilterApply(filters);
      toggleFilterPanel();
    }
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
        <Button
          variant="outlined"
          sx={{
            color: "#6D727F",
            fontFamily: "Poppins",
            borderColor: "black",
            width: "180px",
            height: "56px",
          }}
          onClick={toggleFilterPanel}
        >
          Filtruj
        </Button>
        <CustomTextField
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

      <Drawer
        anchor="right"
        open={isFilterPanelOpen}
        onClose={toggleFilterPanel}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "400px" },
            padding: "20px",
            boxSizing: "border-box",
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontFamily: "Poppins", color: "#272F3E" }}
        >
          Filter
        </Typography>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min Cena"
            value={minPrice}
            onChange={handleMinPriceChange}
            onBlur={handleMinPriceBlur}
            fullWidth
            type="number"
            error={priceError && Number(maxPrice) < Number(minPrice)}
          />
          <CustomTextField
            label="Max Cena"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            onBlur={handleMaxPriceBlur}
            fullWidth
            error={priceError && Number(maxPrice) < Number(minPrice)}
            type="number"
          />
        </div>
        <Button
          variant="contained"
          sx={{ marginTop: "20px" }}
          onClick={handleFilterApply}
        >
          Zastosuj filtry
        </Button>
      </Drawer>
    </Box>
  );
}

export default TableControls;
