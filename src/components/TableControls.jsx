import React, { useState } from "react";
import {
  MenuItem,
  Button,
  Box,
  Stack,
  Menu,
  Drawer,
  Typography,
  FormControl,
  InputLabel,
  Select,
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
  const [dzielnica, setDzielnica] = useState("");
  const [miasto, setMiasto] = useState("");
  const [minIloscPokoi, setMinIloscPokoi] = useState("");
  const [maxIloscPokoi, setMaxIloscPokoi] = useState("");
  const [iloscPokoiTouched, setIloscPokoiTouched] = useState({
    minIloscPokoi: false,
    maxIloscPokoi: false,
  });
  const [iloscPokoiError, setIloscPokoiError] = useState(false);
  const [minMetraz, setMinMetraz] = useState("");
  const [maxMetraz, setMaxMetraz] = useState("");
  const [metrazTouched, setMetrazTouched] = useState({
    minMetraz: false,
    maxMetraz: false,
  });
  const [metrazError, setMetrazError] = useState(false);
  const [ulica, setUlica] = useState("");
  const [minZlM2, setMinZlM2] = useState("");
  const [maxZlM2, setMaxZlM2] = useState("");
  const [zlM2Touched, setZlM2Touched] = useState({
    minZlM2: false,
    maxZlM2: false,
  });
  const [zlM2Error, setZlM2Error] = useState(false);
  const [status, setStatus] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [priceTouched, setpriceTouched] = useState({
    minPrice: false,
    maxPrice: false,
  });
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

  const validateMetraz = () => {
    if (
      minMetraz !== "" &&
      (maxMetraz !== "") & (Number(minMetraz) > Number(maxMetraz))
    )
      setMetrazError(true);
    else setMetrazError(false);
  };

  const handleMinMetraz = (e) => {
    setMinMetraz(e.target.value);
  };

  const handleMaxMetraz = (e) => {
    setMaxMetraz(e.target.value);
  };

  const handleMinMetrazBlur = () => {
    setMetrazTouched({ ...metrazTouched, minMetraz: true });
    validateMetraz();
  };
  const handleMaxMetrazBlur = () => {
    setMetrazTouched({ ...metrazTouched, maxMetraz: true });
    validateMetraz();
  };

  const validateIloscPokoi = () => {
    if (
      minIloscPokoi !== "" &&
      maxIloscPokoi !== "" &&
      Number(minIloscPokoi) > Number(maxIloscPokoi)
    )
      setIloscPokoiError(true);
    else setIloscPokoiError(false);
  };

  const handleMinIloscPokoi = (e) => {
    setMinIloscPokoi(e.target.value);
  };

  const handleMaxIloscPokoi = (e) => {
    setMaxIloscPokoi(e.target.value);
  };

  const handleMinIloscPokoiBlur = () => {
    setIloscPokoiTouched({ ...iloscPokoiTouched, minIloscPokoi: true });
    validateIloscPokoi();
  };
  const handleMaxIloscPokoiBlur = () => {
    setIloscPokoiTouched({ ...iloscPokoiTouched, maxIloscPokoi: true });
    validateIloscPokoi();
  };

  const validateZlM2 = () => {
    if (minZlM2 !== "" && maxZlM2 !== "" && Number(minZlM2) > Number(maxZlM2))
      setZlM2Error(true);
    else setZlM2Error(false);
  };

  const handleMinZlM2 = (e) => {
    setMinZlM2(e.target.value);
  };
  const handleMaxZlM2 = (e) => {
    setMaxZlM2(e.target.value);
  };

  const handleMinZlM2Blur = () => {
    setZlM2Touched({ ...zlM2Touched, minZlM2: true });
    validateZlM2();
  };

  const handleMaxZlM2Blur = () => {
    setZlM2Touched({ ...zlM2Touched, maxZlM2: true });
    validateZlM2();
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
    setpriceTouched({ ...priceTouched, minPrice: true });
    validatePrices();
  };

  const handleMaxPriceBlur = () => {
    setpriceTouched({ ...priceTouched, maxPrice: true });
    validatePrices();
  };
  const handleFilterApply = () => {
    if (!priceError && !zlM2Error && !iloscPokoiError && !metrazError) {
      const filters = {};
      if (ulica) filters.ulica = ulica;
      if (dzielnica) filters.dzielnica = dzielnica;
      if (miasto) filters.miasto = miasto;
      if (minIloscPokoi !== "") filters.minIloscPokoi = minIloscPokoi;
      if (maxIloscPokoi !== "") filters.maxIloscPokoi = maxIloscPokoi;
      if (minMetraz !== "") filters.minMetraz = minMetraz;
      if (maxMetraz !== "") filters.maxMetraz = maxMetraz;
      if (minPrice !== "") filters.minPrice = minPrice;
      if (maxPrice !== "") filters.maxPrice = maxPrice;
      if (minZlM2 !== "") filters.minZlM2 = minZlM2;
      if (maxZlM2 !== "") filters.maxZlM2 = maxZlM2;
      if (status) filters.status = status;
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
            fontSize: "18px",
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
          }}
        />

        <Button
          variant="contained"
          sx={{
            height: "100%",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
            fontSize: "18px",
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
        <CustomTextField
          label="Ulica"
          value={ulica}
          onChange={(e) => setUlica(e.target.value)}
          fullWidth
          sx={{ marginTop: "12px" }}
        />
        <CustomTextField
          label="Dzielnica"
          value={dzielnica}
          onChange={(e) => setDzielnica(e.target.value)}
          fullWidth
          sx={{ marginTop: "12px" }}
        />
        <CustomTextField
          label="Miasto"
          value={miasto}
          onChange={(e) => setMiasto(e.target.value)}
          fullWidth
          sx={{ marginTop: "12px" }}
        />

        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min ilość pokoi"
            value={minIloscPokoi}
            onChange={handleMinIloscPokoi}
            onBlur={handleMinIloscPokoiBlur}
            fullWidth
            type="number"
            error={
              iloscPokoiError && Number(maxIloscPokoi) < Number(minIloscPokoi)
            }
          />
          <CustomTextField
            label="Max ilość pokoi"
            value={maxIloscPokoi}
            onChange={handleMaxIloscPokoi}
            onBlur={handleMaxIloscPokoiBlur}
            fullWidth
            error={
              iloscPokoiError && Number(maxIloscPokoi) < Number(minIloscPokoi)
            }
            type="number"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min metraż"
            value={minMetraz}
            onChange={handleMinMetraz}
            onBlur={handleMinMetrazBlur}
            fullWidth
            type="number"
            error={metrazError && Number(maxMetraz) < Number(minMetraz)}
          />
          <CustomTextField
            label="Max metraż"
            value={maxMetraz}
            onChange={handleMaxMetraz}
            onBlur={handleMaxMetrazBlur}
            fullWidth
            error={metrazError && Number(maxMetraz) < Number(minMetraz)}
            type="number"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min cena"
            value={minPrice}
            onChange={handleMinPriceChange}
            onBlur={handleMinPriceBlur}
            fullWidth
            type="number"
            error={priceError && Number(maxPrice) < Number(minPrice)}
          />
          <CustomTextField
            label="Max cena"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            onBlur={handleMaxPriceBlur}
            fullWidth
            error={priceError && Number(maxPrice) < Number(minPrice)}
            type="number"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min zł/m2"
            value={minZlM2}
            onChange={handleMinZlM2}
            onBlur={handleMinZlM2Blur}
            fullWidth
            type="number"
            error={zlM2Error && Number(maxZlM2) < Number(minZlM2)}
          />
          <CustomTextField
            label="Max zł/m2"
            value={maxZlM2}
            onChange={handleMaxZlM2}
            onBlur={handleMaxZlM2Blur}
            fullWidth
            type="number"
            error={zlM2Error && Number(maxZlM2) < Number(minZlM2)}
          />
        </div>
        <FormControl
          fullWidth
          sx={{
            marginTop: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              fontFamily: "Poppins",
              fontSize: "18px",
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              fontSize: "18px",
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
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">
              <em>Brak</em>
            </MenuItem>
            <MenuItem value="wolny">Wolny</MenuItem>
            <MenuItem value="zajety">Zajęty</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{
            marginTop: "25px",
            color: "white",
            fontFamily: "Poppins",
            height: "56px",
            fontSize: "18px",
            backgroundColor: "#FC8721",
          }}
          onClick={handleFilterApply}
        >
          Zastosuj filtry
        </Button>
      </Drawer>
    </Box>
  );
}

export default TableControls;
