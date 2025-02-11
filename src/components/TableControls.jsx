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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  OutlinedInput,
  ListItemText,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Delete, Star, ViewList, ViewModule, Clear } from "@mui/icons-material";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomTextField from "./CustomTextField";
import { useChangeColumnConfig, useReadConfig } from "../config/columnConfig";
import dzielniceData from "../dzielnice_poddzielnice.json";
import statusesConfig from "../config/statusesConfig";

function TableControls({
  selectedCount,
  onAddOfferClick,
  deleteMultipleOffersClick,
  onSearchChange,
  onFilterApply,
  allUsers,
  // clients,
}) {
  const [filters, setFilters] = useState({
    ulica: "",
    dzielnica: [],
    poddzielnica: [],
    miasto: "",
    typInwestycji: "",
    rynek: "",
    minIloscPokoi: "",
    maxIloscPokoi: "",
    minMetraz: "",
    maxMetraz: "",
    minPrice: "",
    maxPrice: "",
    agent: "",
    statusOferty: "",
    dataKontaktuOd: "",
    dataKontaktuDo: "",
    dataNastepnegoKontaktuOd: "",
    dataNastepnegoKontaktuDo: "",
    clientId: "",
  });

  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [iloscPokoiTouched, setIloscPokoiTouched] = useState({
    minIloscPokoi: false,
    maxIloscPokoi: false,
  });
  const [iloscPokoiError, setIloscPokoiError] = useState(false);
  const [metrazTouched, setMetrazTouched] = useState({
    minMetraz: false,
    maxMetraz: false,
  });
  const [metrazError, setMetrazError] = useState(false);
  const [zlM2Touched, setZlM2Touched] = useState({
    minZlM2: false,
    maxZlM2: false,
  });
  const [zlM2Error, setZlM2Error] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [priceTouched, setpriceTouched] = useState({
    minPrice: false,
    maxPrice: false,
  });
  const [dateError, setDateError] = useState({
    contactDate: false,
    followUpDate: false,
  });
  const open = Boolean(anchorEl);
  const changeColumnConfig = useChangeColumnConfig();
  const readConfig = useReadConfig();
  const [columnConfig, setColumnConfig] = useState(readConfig);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length > 2 && value !== searchValue) {
      const updatedFilters = { ...filters };
      onSearchChange(value, updatedFilters, columnConfig);
    } else if (value.length === 0 && value !== searchValue) {
      const updatedFilters = { ...filters };
      onSearchChange(value, updatedFilters, columnConfig);
    }
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    setPriceError(false);
  };

  const validateDates = () => {
    const contactDateInvalid =
      filters.dataKontaktuOd &&
      filters.dataKontaktuDo &&
      new Date(filters.dataKontaktuOd) > new Date(filters.dataKontaktuDo);
    const followUpDateInvalid =
      filters.dataNastepnegoKontaktuOd &&
      filters.dataNastepnegoKontaktuDo &&
      new Date(filters.dataNastepnegoKontaktuOd) >
        new Date(filters.dataNastepnegoKontaktuDo);
    setDateError({
      contactDate: contactDateInvalid,
      followUpDate: followUpDateInvalid,
    });
  };
  const handleContactDateBlur = () => {
    validateDates();
  };

  const handleFollowUpDateBlur = () => {
    validateDates();
  };

  const validateMetraz = () => {
    if (
      filters.minMetraz !== "" &&
      filters.maxMetraz !== "" &&
      Number(filters.minMetraz) > Number(filters.maxMetraz)
    )
      setMetrazError(true);
    else setMetrazError(false);
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
      filters.minIloscPokoi !== "" &&
      filters.maxIloscPokoi !== "" &&
      Number(filters.minIloscPokoi) > Number(filters.maxIloscPokoi)
    )
      setIloscPokoiError(true);
    else setIloscPokoiError(false);
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
    if (
      filters.minZlM2 !== "" &&
      filters.maxZlM2 !== "" &&
      Number(filters.minZlM2) > Number(filters.maxZlM2)
    )
      setZlM2Error(true);
    else setZlM2Error(false);
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
      filters.minPrice !== "" &&
      filters.maxPrice !== "" &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setPriceError(true);
    } else {
      setPriceError(false);
    }
  };

  const handleMinPriceBlur = () => {
    setpriceTouched({ ...priceTouched, minPrice: true });
    validatePrices();
  };

  const handleMaxPriceBlur = () => {
    setpriceTouched({ ...priceTouched, maxPrice: true });
    validatePrices();
  };

  const handleDzielnicaChange = (event) => {
    const selectedDistricts = event.target.value;

    const removedDistricts = filters.dzielnica.filter(
      (district) => !selectedDistricts.includes(district)
    );

    updateFilters("dzielnica", selectedDistricts);

    if (removedDistricts.length > 0) {
      const subdistrictsToRemove = removedDistricts.flatMap(
        (district) => dzielniceData.Dzielnice[district] || []
      );
      const newPoddzielnica = filters.poddzielnica.filter(
        (subdistrict) => !subdistrictsToRemove.includes(subdistrict)
      );
      updateFilters("poddzielnica", newPoddzielnica);
    }
  };

  const handlePoddzielnicaChange = (event) => {
    const selectedSubdistricts = Array.isArray(event.target.value)
      ? event.target.value
      : [];
    updateFilters("poddzielnica", selectedSubdistricts);
  };

  const subdistricts =
    filters.dzielnica.length > 0
      ? [
          ...new Set(
            filters.dzielnica.flatMap(
              (district) => dzielniceData.Dzielnice[district]
            )
          ),
        ].sort()
      : [];

  const updateFilters = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    if (
      !priceError &&
      !zlM2Error &&
      !iloscPokoiError &&
      !metrazError &&
      !dateError.contactDate &&
      !dateError.followUpDate
    ) {
      onFilterApply(searchValue, filters, columnConfig);
      toggleFilterPanel();
    }
  };

  const clearFilters = () => {
    setFilters({
      ulica: "",
      dzielnica: [],
      poddzielnica: [],
      miasto: "",
      typInwestycji: "",
      rynek: "",
      minIloscPokoi: "",
      maxIloscPokoi: "",
      minMetraz: "",
      maxMetraz: "",
      minPrice: "",
      maxPrice: "",
      agent: "",
      statusOferty: "",
      dataKontaktuOd: "",
      dataKontaktuDo: "",
      dataNastepnegoKontaktuOd: "",
      dataNastepnegoKontaktuDo: "",
      clientId: "",
    });
    setDateError({
      contactDate: false,
      followUpDate: false,
    });
    onFilterApply("", {}, readConfig);
    toggleFilterPanel();
  };

  const handleViewChange = async (event, newValue) => {
    if (newValue !== null) {
      setColumnConfig(newValue);
      changeColumnConfig(newValue);
      onFilterApply(searchValue, filters, newValue);
    }
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
            height: "40px",
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
            height: "40px",
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
        <ToggleButtonGroup
          value={columnConfig}
          exclusive
          onChange={handleViewChange}
          aria-label="view selection"
          sx={{ height: "40px" }}
        >
          <Tooltip title="Widok podstawowy">
            <ToggleButton value={0} aria-label="basic view">
              <ViewList
                sx={{
                  color: columnConfig === 0 ? "#FC8721" : "default",
                }}
              />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Widok rozszerzony">
            <ToggleButton value={1} aria-label="expanded view">
              <ViewModule
                sx={{
                  color: columnConfig === 1 ? "#FC8721" : "default",
                }}
              />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          sx={{
            height: "40px",
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
          Filtruj
        </Typography>
        <CustomTextField
          label="Ulica"
          value={filters.ulica}
          onChange={(e) => updateFilters("ulica", e.target.value)}
          fullWidth
          sx={{ marginTop: "12px" }}
        />
        <FormControl
          fullWidth
          sx={{
            marginTop: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              fontFamily: "Poppins",
              fontSize: "16px",
              height: "40px",
              "& input": {
                padding: "8px",
                height: "16px",
              },
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              fontSize: "16px",
              color: "#535968",
              transform: "translate(14px, 9px) scale(1)",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
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
          <InputLabel id="district-label">Dzielnica</InputLabel>
          <Select
            labelId="district-label"
            value={filters.dzielnica}
            onChange={handleDzielnicaChange}
            multiple
            id="demo-multiple-checkbox"
            renderValue={(selected) => selected.join(", ")}
            input={
              <OutlinedInput
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#535968",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#535968",
                  },
                }}
                label="Dzielnica/Gmina"
              />
            }
          >
            {Object.keys(dzielniceData.Dzielnice).map((district) => (
              <MenuItem
                key={district}
                value={district}
                sx={{
                  "& .Mui-checked": { color: "#FC8721" },
                }}
              >
                <Checkbox checked={filters.dzielnica.includes(district)} />
                <ListItemText primary={district} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          sx={{
            marginTop: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              fontFamily: "Poppins",
              fontSize: "16px",
              height: "40px",
              "& input": {
                padding: "8px",
                height: "16px",
              },
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              fontSize: "16px",
              color: "#535968",
              transform: "translate(14px, 9px) scale(1)",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
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
          <InputLabel id="district-label">Poddzielnica</InputLabel>
          <Select
            labelId="district-label"
            value={filters.poddzielnica}
            onChange={handlePoddzielnicaChange}
            multiple
            id="demo-multiple-checkbox"
            renderValue={(selected) =>
              Array.isArray(selected) ? selected.join(", ") : ""
            }
            input={
              <OutlinedInput
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#535968",
                  },

                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#535968",
                  },
                }}
                label="Poddzielnice"
              />
            }
          >
            {subdistricts.map((subdistrict) => (
              <MenuItem
                key={subdistrict}
                value={subdistrict}
                sx={{
                  "& .Mui-checked": { color: "#FC8721" },
                }}
              >
                <Checkbox
                  checked={filters.poddzielnica.includes(subdistrict)}
                />
                <ListItemText primary={subdistrict} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CustomTextField
          label="Miasto/Wieś"
          value={filters.miasto}
          onChange={(e) => updateFilters("miasto", e.target.value)}
          fullWidth
          sx={{ marginTop: "12px" }}
        />
        <div className="flex justify-end space-x-4">
          <FormControl
            fullWidth
            sx={{
              marginTop: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontFamily: "Poppins",
                fontSize: "16px",
                height: "40px",
                "& input": {
                  padding: "8px",
                  height: "16px",
                },
              },
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
                fontSize: "16px",
                color: "#535968",
                transform: "translate(14px, 9px) scale(1)",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
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
            <InputLabel>Typ inwestycji</InputLabel>
            <Select
              value={filters.typInwestycji}
              onChange={(e) => updateFilters("typInwestycji", e.target.value)}
              label="Typ inwestycji"
            >
              <MenuItem
                value=""
                sx={{ fontStyle: "italic", color: "gray", fontWeight: "bold" }}
              >
                Brak
              </MenuItem>
              <MenuItem value="Dom">Dom</MenuItem>
              <MenuItem value="Mieszkanie">Mieszkanie</MenuItem>
              <MenuItem value="Lokal">Lokal</MenuItem>
              <MenuItem value="Działka">Działka</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{
              marginTop: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontFamily: "Poppins",
                fontSize: "16px",
                height: "40px",
                "& input": {
                  padding: "8px",
                  height: "16px",
                },
              },
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
                fontSize: "16px",
                color: "#535968",
                transform: "translate(14px, 9px) scale(1)",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
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
            <InputLabel>Rynek</InputLabel>
            <Select
              value={filters.rynek}
              onChange={(e) => updateFilters("rynek", e.target.value)}
              label="Rynek"
            >
              <MenuItem
                value=""
                sx={{ fontStyle: "italic", color: "gray", fontWeight: "bold" }}
              >
                Brak
              </MenuItem>
              <MenuItem value="Pierwotny">Pierwotny</MenuItem>
              <MenuItem value="Wtórny">Wtórny</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min ilość pokoi"
            value={filters.minIloscPokoi}
            onChange={(e) => updateFilters("minIloscPokoi", e.target.value)}
            onBlur={handleMinIloscPokoiBlur}
            fullWidth
            type="number"
            error={
              iloscPokoiError &&
              Number(filters.maxIloscPokoi) < Number(filters.minIloscPokoi)
            }
          />
          <CustomTextField
            label="Max ilość pokoi"
            value={filters.maxIloscPokoi}
            onChange={(e) => updateFilters("maxIloscPokoi", e.target.value)}
            onBlur={handleMaxIloscPokoiBlur}
            fullWidth
            error={
              iloscPokoiError &&
              Number(filters.maxIloscPokoi) < Number(filters.minIloscPokoi)
            }
            type="number"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min metraż"
            value={filters.minMetraz}
            onChange={(e) => updateFilters("minMetraz", e.target.value)}
            onBlur={handleMinMetrazBlur}
            fullWidth
            type="number"
            error={
              metrazError &&
              Number(filters.maxMetraz) < Number(filters.minMetraz)
            }
          />
          <CustomTextField
            label="Max metraż"
            value={filters.maxMetraz}
            onChange={(e) => updateFilters("maxMetraz", e.target.value)}
            onBlur={handleMaxMetrazBlur}
            fullWidth
            error={
              metrazError &&
              Number(filters.maxMetraz) < Number(filters.minMetraz)
            }
            type="number"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min cena"
            value={filters.minPrice}
            onChange={(e) => updateFilters("minPrice", e.target.value)}
            onBlur={handleMinPriceBlur}
            fullWidth
            type="number"
            error={
              priceError && Number(filters.maxPrice) < Number(filters.minPrice)
            }
          />
          <CustomTextField
            label="Max cena"
            value={filters.maxPrice}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
            onBlur={handleMaxPriceBlur}
            fullWidth
            error={
              priceError && Number(filters.maxPrice) < Number(filters.minPrice)
            }
            type="number"
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Min zł/m2"
            value={filters.minZlM2}
            onChange={(e) => updateFilters("minZlM2", e.target.value)}
            onBlur={handleMinZlM2Blur}
            fullWidth
            type="number"
            error={
              zlM2Error && Number(filters.maxZlM2) < Number(filters.minZlM2)
            }
          />
          <CustomTextField
            label="Max zł/m2"
            value={filters.maxZlM2}
            onChange={(e) => updateFilters("maxZlM2", e.target.value)}
            onBlur={handleMaxZlM2Blur}
            fullWidth
            type="number"
            error={
              zlM2Error && Number(filters.maxZlM2) < Number(filters.minZlM2)
            }
          />
        </div>
        <div className="flex justify-end space-x-4">
          <FormControl
            fullWidth
            sx={{
              marginTop: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontFamily: "Poppins",
                fontSize: "16px",
                height: "40px",
                "& input": {
                  padding: "8px",
                  height: "16px",
                },
              },
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
                fontSize: "16px",
                color: "#535968",
                transform: "translate(14px, 9px) scale(1)",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
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
            <InputLabel>Agent</InputLabel>
            <Select
              input={
                <OutlinedInput
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#535968",
                    },

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#535968",
                    },
                  }}
                  label="Agent"
                />
              }
              value={filters.agent}
              onChange={(e) => updateFilters("agent", e.target.value)}
              fullWidth
            >
              <MenuItem
                value={""}
                sx={{ fontStyle: "italic", color: "gray", fontWeight: "bold" }}
              >
                Brak
              </MenuItem>
              {allUsers.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            multiple
            sx={{
              marginTop: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                fontFamily: "Poppins",
                fontSize: "16px",
                height: "40px",
                "& input": {
                  padding: "8px",
                  height: "16px",
                },
              },
              "& .MuiFormLabel-root": {
                fontFamily: "Poppins",
                fontSize: "16px",
                color: "#535968",
                transform: "translate(14px, 9px) scale(1)",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                transform: "translate(14px, -9px) scale(0.75)",
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
              value={filters.statusOferty}
              onChange={(e) => updateFilters("statusOferty", e.target.value)}
              label="Status"
            >
              {statusesConfig.map((status) => (
                <MenuItem
                  key={status.value}
                  value={status.value === "Brak" ? "" : status.value}
                  sx={{
                    fontStyle: status.value === "Brak" ? "italic" : "normal",
                    color: status.value === "Brak" ? "gray" : "inherit",
                    fontWeight: status.value === "Brak" ? "bold" : "poppins",
                  }}
                >
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Kontakt od"
            name="dataKontaktuOd"
            type="date"
            value={filters.dataKontaktuOd}
            onChange={(e) => updateFilters("dataKontaktuOd", e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onBlur={handleContactDateBlur}
            error={
              dateError.contactDate &&
              new Date(filters.dataKontaktuOd) >
                new Date(filters.dataKontaktuDo)
            }
          />
          <CustomTextField
            label="Kontakt do"
            name="dataKontaktuDo"
            type="date"
            value={filters.dataKontaktuDo}
            onChange={(e) => updateFilters("dataKontaktuDo", e.target.value)}
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onBlur={handleContactDateBlur}
            error={
              dateError.contactDate &&
              new Date(filters.dataKontaktuOd) >
                new Date(filters.dataKontaktuDo)
            }
          />
        </div>
        <div className="flex justify-end space-x-4 mt-3">
          <CustomTextField
            label="Następny od"
            name="dataNastepnegoKontaktuOd"
            type="date"
            value={filters.dataNastepnegoKontaktuOd}
            onChange={(e) =>
              updateFilters("dataNastepnegoKontaktuOd", e.target.value)
            }
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onBlur={handleFollowUpDateBlur}
            error={
              dateError.followUpDate &&
              new Date(filters.dataNastepnegoKontaktuOd) >
                new Date(filters.dataNastepnegoKontaktuDo)
            }
          />
          <CustomTextField
            label="Następny do"
            name="dataNastepnegoKontaktuDo"
            type="date"
            value={filters.dataNastepnegoKontaktuDo}
            onChange={(e) =>
              updateFilters("dataNastepnegoKontaktuDo", e.target.value)
            }
            variant="outlined"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onBlur={handleFollowUpDateBlur}
            error={
              dateError.followUpDate &&
              new Date(filters.dataNastepnegoKontaktuOd) >
                new Date(filters.dataNastepnegoKontaktuDo)
            }
          />
        </div>
        {/* <FormControl
          fullWidth
          sx={{
            marginTop: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
              fontFamily: "Poppins",
              fontSize: "16px",
              height: "40px",
              "& input": {
                padding: "8px",
                height: "16px",
              },
            },
            "& .MuiFormLabel-root": {
              fontFamily: "Poppins",
              fontSize: "16px",
              color: "#535968",
              transform: "translate(14px, 9px) scale(1)",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
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
          <InputLabel>Klient</InputLabel>
          <Select
            value={filters.clientId}
            onChange={(e) => updateFilters("clientId", e.target.value)}
            label="Typ inwestycji"
          >
            <MenuItem
              value=""
              sx={{ fontStyle: "italic", color: "gray", fontWeight: "bold" }}
            >
              Brak
            </MenuItem>
            {clients.map((client) => (
              <MenuItem key={client._id} value={client._id}>
                {client.daneKlienta}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
          onClick={handleFilter}
        >
          Zastosuj filtry
        </Button>
        <Button
          variant="outlined"
          onClick={clearFilters}
          sx={{
            marginTop: "25px",
            fontFamily: "Poppins",
            height: "56px",
            fontSize: "18px",
            backgroundColor: "#6D727F",
            color: "white",
          }}
        >
          Wyczyść filtry
        </Button>
      </Drawer>
    </Box>
  );
}

export default TableControls;
