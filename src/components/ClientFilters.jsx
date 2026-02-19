import {
  Button,
  Checkbox,
  Drawer,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import CustomTextField from "./CustomTextField";
import statusesConfig from "../config/statusesConfig";
import { useEffect, useState } from "react";
import { useClientFiltersStore } from "../store/clientFilterStore";
import dzielniceData from "../dzielnice_poddzielnice.json";
import clientStandardConfig from "../config/clientStandardConfig";

export default function ClientFilters({ onFilterApply, allUsers }) {
  const {
    filters: appliedFilters,
    setFilters,
    clearFilters: clearGlobalFilters,
    filterPanel,
    changeFilterPanelOpen,
  } = useClientFiltersStore();

  const [localFilters, setLocalFilters] = useState(appliedFilters);
  const [dateError, setDateError] = useState({
    contactDate: false,
    lateContactDate: false,
    followUpDate: false,
  });

  const handleLocalFilterChange = (name, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLokalizacjaChange = (district) => {
    const newLokalizacja = localFilters.lokalizacja.includes(district)
      ? localFilters.lokalizacja.filter((item) => item !== district)
      : [...localFilters.lokalizacja, district];

    handleLocalFilterChange("lokalizacja", newLokalizacja);
  };

  const handlepokojeOdBlur = () => {
    setIloscPokoiTouched({ ...iloscPokoiTouched, pokojeOd: true });
    validateIloscPokoi();
  };
  const handlepokojeDoBlur = () => {
    setIloscPokoiTouched({ ...iloscPokoiTouched, pokojeDo: true });
    validateIloscPokoi();
  };

  const [iloscPokoiTouched, setIloscPokoiTouched] = useState({
    pokojeOd: false,
    pokojeDo: false,
  });
  const [iloscPokoiError, setIloscPokoiError] = useState(false);
  const validateIloscPokoi = () => {
    if (
      localFilters.pokojeOd !== "" &&
      localFilters.pokojeDo !== "" &&
      Number(localFilters.pokojeOd) > Number(localFilters.pokojeDo)
    )
      setIloscPokoiError(true);
    else setIloscPokoiError(false);
  };

  const handlemetrazOdBlur = () => {
    setMetrazTouched({ ...metrazTouched, metrazOd: true });
    validateMetraz();
  };

  const handlemetrazDoBlur = () => {
    setMetrazTouched({ ...metrazTouched, metrazDo: true });
    validateMetraz();
  };
  const [metrazTouched, setMetrazTouched] = useState({
    metrazOd: false,
    metrazDo: false,
  });
  const [metrazError, setMetrazError] = useState(false);
  const validateMetraz = () => {
    if (
      localFilters.metrazOd !== "" &&
      localFilters.metrazDo !== "" &&
      Number(localFilters.metrazOd) > Number(localFilters.metrazDo)
    )
      setMetrazError(true);
    else setMetrazError(false);
  };

  const handleBudzetOdBlur = () => {
    setBudzetTouched({ ...budzetTouched, budzetOd: true });
    validateBudzet();
  };

  const handleBudzetDoBlur = () => {
    setBudzetTouched({ ...budzetTouched, budzetDo: true });
    validateBudzet();
  };
  const [budzetTouched, setBudzetTouched] = useState({
    budzetOd: false,
    budzetDo: false,
  });
  const [budzetError, setBudzetError] = useState(false);
  const validateBudzet = () => {
    if (
      localFilters.budzetOd !== "" &&
      localFilters.budzetDo !== "" &&
      Number(localFilters.budzetOd) > Number(localFilters.budzetDo)
    )
      setBudzetError(true);
    else setBudzetError(false);
  };

  const validateDates = () => {
    const contactDateInvalid =
      localFilters.dataZapytaniaOd &&
      localFilters.dataZapytaniaDo &&
      new Date(localFilters.dataZapytaniaOd) >
        new Date(localFilters.dataZapytaniaDo);
    const lateContactDateInvalid =
      localFilters.ostatniKontaktOd &&
      localFilters.ostatniKontaktDo &&
      new Date(localFilters.ostatniKontaktOd) >
        new Date(localFilters.ostatniKontaktDo);
    const followUpDateInvalid =
      localFilters.dataNastepnegoKontaktuOd &&
      localFilters.dataNastepnegoKontaktuDo &&
      new Date(localFilters.dataNastepnegoKontaktuOd) >
        new Date(localFilters.dataNastepnegoKontaktuDo);
    setDateError({
      contactDate: contactDateInvalid,
      lateContactDate: lateContactDateInvalid,
      followUpDate: followUpDateInvalid,
    });
  };
  const handleContactDateBlur = () => {
    validateDates();
  };

  const handleLateContactDateBlur = () => {
    validateDates();
  };

  const handleFollowUpDateBlur = () => {
    validateDates();
  };

  const handleFilter = () => {
    if (
      !iloscPokoiError &&
      !metrazError &&
      !dateError.contactDate &&
      !dateError.followUpDate &&
      !dateError.lateContactDate
    ) {
      setFilters(localFilters);

      onFilterApply(localFilters);
      changeFilterPanelOpen();
    }
  };

  const handleClearFilters = () => {
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

    setLocalFilters(emptyFilters);

    clearGlobalFilters();

    onFilterApply(emptyFilters);
  };

  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  return (
    <Drawer
      anchor="right"
      open={filterPanel.isOpen}
      onClose={changeFilterPanelOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: "400px" },
          padding: "20px",
          boxSizing: "border-box",
        },
      }}
    >
      <Typography variant="h4" sx={{ fontFamily: "Poppins", color: "#272F3E" }}>
        Filtruj
      </Typography>
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
          value={localFilters?.status}
          onChange={(e) => handleLocalFilterChange("status", e.target.value)}
          label="Status"
        >
          {statusesConfig.map((status) => (
            <MenuItem
              key={status.value}
              value={status.value === "Wszystko" ? "" : status.value}
              sx={{
                fontStyle: status.value === "Wszystko" ? "italic" : "normal",
                color: status.value === "Wszystko" ? "gray" : "inherit",
                fontWeight: status.value === "Wszystko" ? "bold" : "poppins",
              }}
            >
              {status.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <div className="flex justify-end space-x-4"> */}
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
          value={localFilters?.agent}
          onChange={(e) => handleLocalFilterChange("agent", e.target.value)}
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
        <InputLabel id="district-label">Lokalizacja</InputLabel>
        <Select
          labelId="district-label"
          value={localFilters?.lokalizacja}
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
              label="Lokalizacja"
            />
          }
        >
          {Object.keys(dzielniceData.Dzielnice).map((district) => (
            <MenuItem
              key={district}
              value={district}
              onClick={() => handleLokalizacjaChange(district)}
              sx={{
                "& .Mui-checked": { color: "#FC8721" },
              }}
            >
              <Checkbox
                checked={localFilters.lokalizacja?.includes(district) || false}
                onChange={(event) => {
                  handleLokalizacjaChange(district);
                }}
                sx={{
                  color: "#FC8721",
                  "&.Mui-checked": { color: "#FC8721" },
                }}
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
          value={localFilters?.typInwestycji}
          onChange={(e) =>
            handleLocalFilterChange("typInwestycji", e.target.value)
          }
          label="Typ inwestycji"
        >
          <MenuItem
            value=""
            sx={{
              fontStyle: "italic",
              color: "gray",
              fontWeight: "bold",
            }}
          >
            Wszystko
          </MenuItem>
          <MenuItem value="Dom">Dom</MenuItem>
          <MenuItem value="Mieszkanie">Mieszkanie</MenuItem>
          <MenuItem value="Lokal">Lokal</MenuItem>
          <MenuItem value="Działka">Działka</MenuItem>
          <MenuItem value="Bliźniak">Bliźniak</MenuItem>
          <MenuItem value="Szeregowy">Szeregowy</MenuItem>
        </Select>
      </FormControl>
      <div className="flex justify-end space-x-4 mt-3">
        <CustomTextField
          label="Ilość pokoi od"
          value={localFilters?.pokojeOd}
          onChange={(e) => handleLocalFilterChange("pokojeOd", e.target.value)}
          onBlur={handlepokojeOdBlur}
          fullWidth
          type="number"
          error={
            iloscPokoiError &&
            Number(localFilters.pokojeDo) < Number(localFilters.pokojeOd)
          }
        />
        <CustomTextField
          label="Ilość pokoi do"
          value={localFilters?.pokojeDo}
          onChange={(e) => handleLocalFilterChange("pokojeDo", e.target.value)}
          onBlur={handlepokojeDoBlur}
          fullWidth
          error={
            iloscPokoiError &&
            Number(localFilters.pokojeDo) < Number(localFilters.pokojeOd)
          }
          type="number"
        />
      </div>
      <div className="flex justify-end space-x-4 mt-3">
        <CustomTextField
          label="Metraż od"
          value={localFilters?.metrazOd}
          onChange={(e) => handleLocalFilterChange("metrazOd", e.target.value)}
          onBlur={handlemetrazOdBlur}
          fullWidth
          type="number"
          error={
            metrazError &&
            Number(localFilters.metrazDo) < Number(localFilters.metrazOd)
          }
        />
        <CustomTextField
          label="Metraż do"
          value={localFilters?.metrazDo}
          onChange={(e) => handleLocalFilterChange("metrazDo", e.target.value)}
          onBlur={handlemetrazDoBlur}
          fullWidth
          error={
            metrazError &&
            Number(localFilters.metrazDo) < Number(localFilters.metrazOd)
          }
          type="number"
        />
      </div>
      <div className="flex justify-end space-x-4 mt-3">
        <CustomTextField
          label="Budżet od"
          value={localFilters?.budzetOd}
          onChange={(e) => handleLocalFilterChange("budzetOd", e.target.value)}
          onBlur={handleBudzetOdBlur}
          fullWidth
          type="number"
          error={
            budzetError &&
            Number(localFilters.budzetDo) < Number(localFilters.budzetOd)
          }
        />
        <CustomTextField
          label="Budżet do"
          value={localFilters?.budzetDo}
          onChange={(e) => handleLocalFilterChange("budzetDo", e.target.value)}
          onBlur={handleBudzetDoBlur}
          fullWidth
          error={
            budzetError &&
            Number(localFilters.budzetDo) < Number(localFilters.budzetOd)
          }
          type="number"
        />
      </div>
      <FormControl
        fullWidth
        margin="normal"
        sx={{
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
        <InputLabel>Standard</InputLabel>
        <Select
          multiple
          value={localFilters.standard || []}
          onChange={(e) => handleLocalFilterChange("standard", e.target.value)}
          input={
            <OutlinedInput
              label="Standard"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#535968",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#535968",
                },
              }}
            />
          }
          renderValue={(selected) => selected.join(", ")}
        >
          {clientStandardConfig.map((standard) => (
            <MenuItem key={standard.value} value={standard.value}>
              <Checkbox
                checked={localFilters.standard?.includes(standard.value)}
                sx={{
                  color: "#FC8721",
                  "&.Mui-checked": { color: "#FC8721" },
                }}
              />
              <ListItemText
                primary={standard.label}
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: standard.value === "Wszystko" ? "gray" : "inherit",
                  fontStyle: standard.value === "Wszystko" ? "italic" : "normal",
                  fontWeight: standard.value === "Wszystko" ? "bold" : "normal",
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="flex justify-end space-x-4 mt-3">
        <CustomTextField
          label="Data zapytania od"
          name="dataZapytaniaOd"
          type="date"
          value={localFilters?.dataZapytaniaOd}
          onChange={(e) =>
            handleLocalFilterChange("dataZapytaniaOd", e.target.value)
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onBlur={handleContactDateBlur}
          error={
            dateError.contactDate &&
            new Date(localFilters.dataZapytaniaOd) >
              new Date(localFilters.dataZapytaniaDo)
          }
        />
        <CustomTextField
          label="Data zapytania do"
          name="dataZapytaniaDo"
          type="date"
          value={localFilters?.dataZapytaniaDo}
          onChange={(e) =>
            handleLocalFilterChange("dataZapytaniaDo", e.target.value)
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onBlur={handleContactDateBlur}
          error={
            dateError.contactDate &&
            new Date(localFilters.dataZapytaniaOd) >
              new Date(localFilters.dataZapytaniaDo)
          }
        />
      </div>
      <div className="flex justify-end space-x-4 mt-3">
        <CustomTextField
          label="Data ostatniego kontaktu od"
          name="ostatniKontaktOd"
          type="date"
          value={localFilters?.ostatniKontaktOd}
          onChange={(e) =>
            handleLocalFilterChange("ostatniKontaktOd", e.target.value)
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onBlur={handleLateContactDateBlur}
          error={
            dateError.lateContactDate &&
            new Date(localFilters.ostatniKontaktOd) >
              new Date(localFilters.ostatniKontaktDo)
          }
        />
        <CustomTextField
          label="Data ostatniego kontaktu do"
          name="ostatniKontaktDo"
          type="date"
          value={localFilters?.ostatniKontaktDo}
          onChange={(e) =>
            handleLocalFilterChange("ostatniKontaktDo", e.target.value)
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onBlur={handleLateContactDateBlur}
          error={
            dateError.lateContactDate &&
            new Date(localFilters.ostatniKontaktOd) >
              new Date(localFilters.ostatniKontaktDo)
          }
        />
      </div>

      <div className="flex justify-end space-x-4 mt-3">
        <CustomTextField
          label="Data następnego kontaktu od"
          name="dataNastepnegoKontaktuOd"
          type="date"
          value={localFilters?.dataNastepnegoKontaktuOd}
          onChange={(e) =>
            handleLocalFilterChange("dataNastepnegoKontaktuOd", e.target.value)
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onBlur={handleFollowUpDateBlur}
          error={
            dateError.followUpDate &&
            new Date(localFilters.dataNastepnegoKontaktuOd) >
              new Date(localFilters.dataNastepnegoKontaktuDo)
          }
        />
        <CustomTextField
          label="Data następnego kontaktu do"
          name="dataNastepnegoKontaktuDo"
          type="date"
          value={localFilters?.dataNastepnegoKontaktuDo}
          onChange={(e) =>
            handleLocalFilterChange("dataNastepnegoKontaktuDo", e.target.value)
          }
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onBlur={handleFollowUpDateBlur}
          error={
            dateError.followUpDate &&
            new Date(localFilters.dataNastepnegoKontaktuOd) >
              new Date(localFilters.dataNastepnegoKontaktuDo)
          }
        />
      </div>
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
  );
}
