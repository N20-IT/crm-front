import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  createFilterOptions,
  TextField,
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
  Tooltip,
  OutlinedInput,
  ListItemText,
  Checkbox,
  InputAdornment,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import { customTooltip } from "../styles/CustomTooltip";
import { Person, Delete, Star, Clear } from "@mui/icons-material";
import { KeyboardArrowDown } from "@mui/icons-material";
import CustomTextField from "./CustomTextField";
import { useChangeColumnConfig, useReadConfig } from "../config/columnConfig";
import dzielniceData from "../dzielnice_poddzielnice.json";
import statusesConfig from "../config/statusesConfig";
import { useFiltersStore } from "../store/filtersStore";
import { GetInformationFromToken } from "../utils/decodeToken";

function TableControls({
  selectedCount,
  onAddOfferClick,
  deleteMultipleOffersClick,
  onSearchChange,
  onFilterApply,
  allUsers,
  clients,
  userInformation,
}) {
  const {
    filters: appliedFilters,
    setFilters,
    clearFilters: clearGlobalFilters,
  } = useFiltersStore();

  // LOKALNY stan dla formularza filtrów
  const [localFilters, setLocalFilters] = useState(appliedFilters);

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
  const userRole = GetInformationFromToken("custom:role");

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
      const updatedFilters = { ...localFilters };
      onSearchChange(value, updatedFilters, columnConfig);
    } else if (value.length === 0 && value !== searchValue) {
      const updatedFilters = { ...localFilters };
      onSearchChange(value, updatedFilters, columnConfig);
    }
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
    setPriceError(false);
  };

  const validateDates = () => {
    const contactDateInvalid =
      localFilters.dataUtworzeniaOd &&
      localFilters.dataUtworzeniaDo &&
      new Date(localFilters.dataUtworzeniaOd) >
        new Date(localFilters.dataUtworzeniaDo);
    setDateError({
      contactDate: contactDateInvalid,
    });
  };
  const handleContactDateBlur = () => {
    validateDates();
  };

  const validateMetraz = () => {
    if (
      localFilters.minMetraz !== "" &&
      localFilters.maxMetraz !== "" &&
      Number(localFilters.minMetraz) > Number(localFilters.maxMetraz)
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
      localFilters.minIloscPokoi !== "" &&
      localFilters.maxIloscPokoi !== "" &&
      Number(localFilters.minIloscPokoi) > Number(localFilters.maxIloscPokoi)
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
      localFilters.minZlM2 !== "" &&
      localFilters.maxZlM2 !== "" &&
      Number(localFilters.minZlM2) > Number(localFilters.maxZlM2)
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
      localFilters.minPrice !== "" &&
      localFilters.maxPrice !== "" &&
      Number(localFilters.minPrice) > Number(localFilters.maxPrice)
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

    const removedDistricts = localFilters.dzielnica.filter(
      (district) => !selectedDistricts.includes(district),
    );

    handleLocalFilterChange("dzielnica", selectedDistricts);

    if (removedDistricts.length > 0) {
      const subdistrictsToRemove = removedDistricts.flatMap(
        (district) => dzielniceData.Dzielnice[district] || [],
      );
      const newPoddzielnica = localFilters.poddzielnica.filter(
        (subdistrict) => !subdistrictsToRemove.includes(subdistrict),
      );
      handleLocalFilterChange("poddzielnica", newPoddzielnica);
    }
  };

  const handlePoddzielnicaChange = (event) => {
    const selectedSubdistricts = Array.isArray(event.target.value)
      ? event.target.value
      : [];
    handleLocalFilterChange("poddzielnica", selectedSubdistricts);
  };

  const subdistricts =
    localFilters?.dzielnica.length > 0
      ? [
          ...new Set(
            localFilters.dzielnica.flatMap(
              (district) => dzielniceData.Dzielnice[district],
            ),
          ),
        ].sort()
      : [];

  const handleFilter = () => {
    if (
      !priceError &&
      !zlM2Error &&
      !iloscPokoiError &&
      !metrazError &&
      !dateError.contactDate &&
      !dateError.followUpDate
    ) {
      setFilters(localFilters);

      onFilterApply(searchValue, localFilters, columnConfig);
      toggleFilterPanel();
    }
  };

  const handleViewChange = async (event, newValue) => {
    if (newValue !== null) {
      setColumnConfig(newValue);
      changeColumnConfig(newValue);
      onFilterApply(searchValue, localFilters, newValue);
    }
  };

  const clientFilterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.daneKlienta,
  });

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

  const emptyFilters = {
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
    dataUtworzeniaOd: "",
    dataUtworzeniaDo: "",
    clientId: "",
  };

  const handleClearFilters = () => {
    setLocalFilters(emptyFilters);
    clearGlobalFilters();
  };

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  // Zmiana lokalnych filtrów - NIE wywołuje requestów
  const handleLocalFilterChange = (name, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={customTooltip}>
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
          {userRole === "admin" && (
            <>
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
            </>
          )}
          <Button
            variant="outlined"
            sx={{
              color: isAnyFilterFilled(appliedFilters) ? "#009900" : "#6D727F",
              fontFamily: "Poppins",
              borderColor: isAnyFilterFilled(appliedFilters)
                ? "#009900"
                : "black",
              width: "180px",
              height: "40px",
              fontSize: "18px",
            }}
            onClick={toggleFilterPanel}
          >
            Filtruj
          </Button>
          <Tooltip title="Wyczyść filtry">
            <IconButton
              onClick={() => {
                handleClearFilters();
                onFilterApply(searchValue, emptyFilters, columnConfig);
              }}
              sx={{
                color: isAnyFilterFilled(appliedFilters)
                  ? "#CC0000"
                  : "#6D727F",
                border: "1px solid",
                borderColor: isAnyFilterFilled(appliedFilters)
                  ? "#CC0000"
                  : "black",
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
                const updatedFilters = {
                  ...localFilters,
                  agent: localFilters.agent === userInformation ? "" : userInformation,
                };
                setLocalFilters(updatedFilters);
                setFilters(updatedFilters);
                onFilterApply(searchValue, updatedFilters, columnConfig);
              }}
              sx={{
                color:
                  localFilters.agent === userInformation
                    ? "#009900"
                    : "#6D727F",
                border: "1px solid",
                borderColor:
                  localFilters.agent === userInformation ? "#009900" : "black",
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
                    onClick={() =>
                      handleSearchChange({ target: { value: "" } })
                    }
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
            value={localFilters?.ulica}
            onChange={(e) => handleLocalFilterChange("ulica", e.target.value)}
            fullWidth
            sx={{ marginTop: "12px" }}
          />
          <FormControl
            fullWidth
            sx={{
              marginTop: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
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
              value={localFilters?.dzielnica}
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
                  <Checkbox
                    checked={localFilters?.dzielnica.includes(district)}
                  />
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
                borderRadius: "4px",
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
              value={localFilters?.poddzielnica}
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
                    checked={localFilters.poddzielnica.includes(subdistrict)}
                  />
                  <ListItemText primary={subdistrict} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CustomTextField
            label="Miasto/Wieś"
            value={localFilters?.miasto}
            onChange={(e) => handleLocalFilterChange("miasto", e.target.value)}
            fullWidth
            sx={{ marginTop: "12px" }}
          />
          <div className="flex justify-end space-x-4">
            <FormControl
              fullWidth
              sx={{
                marginTop: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
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
                value={localFilters?.typInwestycji || []}
                onChange={(e) =>
                  handleLocalFilterChange("typInwestycji", e.target.value)
                }
                multiple
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
                    label="Typ inwestycji"
                  />
                }
              >
                {[
                  "Dom",
                  "Mieszkanie",
                  "Lokal",
                  "Działka",
                  "Bliźniak",
                  "Szeregowy",
                ].map((typ) => (
                  <MenuItem
                    key={typ}
                    value={typ}
                    sx={{
                      "& .Mui-checked": { color: "#FC8721" },
                    }}
                  >
                    <Checkbox
                      checked={(localFilters?.typInwestycji || []).includes(
                        typ,
                      )}
                    />
                    <ListItemText primary={typ} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              sx={{
                marginTop: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
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
                value={localFilters?.rynek || []}
                onChange={(e) =>
                  handleLocalFilterChange("rynek", e.target.value)
                }
                multiple
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
                    label="Rynek"
                  />
                }
              >
                {["Pierwotny", "Wtórny"].map((rynek) => (
                  <MenuItem
                    key={rynek}
                    value={rynek}
                    sx={{
                      "& .Mui-checked": { color: "#FC8721" },
                    }}
                  >
                    <Checkbox
                      checked={(localFilters?.rynek || []).includes(rynek)}
                    />
                    <ListItemText primary={rynek} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-end space-x-4 mt-3">
            <CustomTextField
              label="Min ilość pokoi"
              value={localFilters?.minIloscPokoi}
              onChange={(e) =>
                handleLocalFilterChange("minIloscPokoi", e.target.value)
              }
              onBlur={handleMinIloscPokoiBlur}
              fullWidth
              type="number"
              error={
                iloscPokoiError &&
                Number(localFilters.maxIloscPokoi) <
                  Number(localFilters.minIloscPokoi)
              }
            />
            <CustomTextField
              label="Max ilość pokoi"
              value={localFilters?.maxIloscPokoi}
              onChange={(e) =>
                handleLocalFilterChange("maxIloscPokoi", e.target.value)
              }
              onBlur={handleMaxIloscPokoiBlur}
              fullWidth
              error={
                iloscPokoiError &&
                Number(localFilters.maxIloscPokoi) <
                  Number(localFilters.minIloscPokoi)
              }
              type="number"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-3">
            <CustomTextField
              label="Min metraż"
              value={localFilters?.minMetraz}
              onChange={(e) =>
                handleLocalFilterChange("minMetraz", e.target.value)
              }
              onBlur={handleMinMetrazBlur}
              fullWidth
              type="number"
              error={
                metrazError &&
                Number(localFilters.maxMetraz) < Number(localFilters.minMetraz)
              }
            />
            <CustomTextField
              label="Max metraż"
              value={localFilters?.maxMetraz}
              onChange={(e) =>
                handleLocalFilterChange("maxMetraz", e.target.value)
              }
              onBlur={handleMaxMetrazBlur}
              fullWidth
              error={
                metrazError &&
                Number(localFilters.maxMetraz) < Number(localFilters.minMetraz)
              }
              type="number"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-3">
            <CustomTextField
              label="Min cena"
              value={localFilters?.minPrice}
              onChange={(e) =>
                handleLocalFilterChange("minPrice", e.target.value)
              }
              onBlur={handleMinPriceBlur}
              fullWidth
              type="number"
              error={
                priceError &&
                Number(localFilters.maxPrice) < Number(localFilters.minPrice)
              }
            />
            <CustomTextField
              label="Max cena"
              value={localFilters?.maxPrice}
              onChange={(e) =>
                handleLocalFilterChange("maxPrice", e.target.value)
              }
              onBlur={handleMaxPriceBlur}
              fullWidth
              error={
                priceError &&
                Number(localFilters.maxPrice) < Number(localFilters.minPrice)
              }
              type="number"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-3">
            <CustomTextField
              label="Min zł/m2"
              value={localFilters?.minZlM2}
              onChange={(e) =>
                handleLocalFilterChange("minZlM2", e.target.value)
              }
              onBlur={handleMinZlM2Blur}
              fullWidth
              type="number"
              error={
                zlM2Error &&
                Number(localFilters.maxZlM2) < Number(localFilters.minZlM2)
              }
            />
            <CustomTextField
              label="Max zł/m2"
              value={localFilters?.maxZlM2}
              onChange={(e) =>
                handleLocalFilterChange("maxZlM2", e.target.value)
              }
              onBlur={handleMaxZlM2Blur}
              fullWidth
              type="number"
              error={
                zlM2Error &&
                Number(localFilters.maxZlM2) < Number(localFilters.minZlM2)
              }
            />
          </div>
          <div className="flex justify-end space-x-4">
            <FormControl
              fullWidth
              sx={{
                marginTop: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
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
                value={localFilters?.agent}
                onChange={(e) =>
                  handleLocalFilterChange("agent", e.target.value)
                }
                fullWidth
              >
                <MenuItem
                  value={""}
                  sx={{
                    fontStyle: "italic",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  Wszystko
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
                  borderRadius: "4px",
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
                value={localFilters?.statusOferty}
                onChange={(e) =>
                  handleLocalFilterChange("statusOferty", e.target.value)
                }
                label="Status"
              >
                {statusesConfig.map((status) => (
                  <MenuItem
                    key={status.value}
                    value={status.value === "Wszystko" ? "" : status.value}
                    sx={{
                      fontStyle:
                        status.value === "Wszystko" ? "italic" : "normal",
                      color: status.value === "Wszystko" ? "gray" : "inherit",
                      fontWeight:
                        status.value === "Wszystko" ? "bold" : "normal",
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
              label="Data utworzenia od"
              name="dataUtworzeniaOd"
              type="date"
              value={localFilters?.dataUtworzeniaOd}
              onChange={(e) =>
                handleLocalFilterChange("dataUtworzeniaOd", e.target.value)
              }
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onBlur={handleContactDateBlur}
              error={
                dateError.contactDate &&
                new Date(localFilters.dataUtworzeniaOd) >
                  new Date(localFilters.dataUtworzeniaDo)
              }
            />
            <CustomTextField
              label="Data utworzenia do"
              name="dataUtworzeniaDo"
              type="date"
              value={localFilters?.dataUtworzeniaDo}
              onChange={(e) =>
                handleLocalFilterChange("dataUtworzeniaDo", e.target.value)
              }
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onBlur={handleContactDateBlur}
              error={
                dateError.contactDate &&
                new Date(localFilters.dataUtworzeniaOd) >
                  new Date(localFilters.dataUtworzeniaDo)
              }
            />
          </div>
          <FormControl fullWidth sx={{ marginTop: "12px" }}>
            <Autocomplete
              options={clients || []}
              getOptionLabel={(option) => option.daneKlienta}
              value={
                clients?.find((c) => c._id === localFilters?.clientId) || null
              }
              onChange={(event, newValue) =>
                handleLocalFilterChange("clientId", newValue?._id || "")
              }
              filterOptions={clientFilterOptions}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              clearOnEscape
              noOptionsText="Brak wyników"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Klient"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "4px",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      height: "40px",
                      "& input": {
                        padding: "0 8px",
                        height: "100%",
                        lineHeight: "40px",
                      },
                    },
                    "& .MuiFormLabel-root": {
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      color: "#535968",
                      top: "50%",
                      left: "12px",
                      transform: "translateY(-50%)",
                    },
                    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                      transform: "translate(0, -28px) scale(0.75)",
                    },
                  }}
                />
              )}
            />
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
            onClick={handleFilter}
          >
            Zastosuj filtry
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
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
    </ThemeProvider>
  );
}

export default TableControls;
