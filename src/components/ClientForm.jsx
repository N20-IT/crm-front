import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

import CustomTextField from "./CustomTextField";
import clientStatuesConfig from "../config/clientStatuesConfig";
import dzielniceData from "../dzielnice_poddzielnice.json";
import clientStandardConfig from "../config/clientStandardConfig";
import { useState } from "react";

function ClientForm({
  formData,
  onChange,
  onPhoneNumbersChange,
  addPhoneField,
  removePhoneField,
  allUsers,
}) {
  const [errors, setErrors] = useState({});

  const handleLokalizacjaChange = (district) => {
    const newLokalizacja = formData.lokalizacja.includes(district)
      ? formData.lokalizacja.filter((item) => item !== district)
      : [...formData.lokalizacja, district];

    onChange({
      target: {
        name: "lokalizacja",
        value: newLokalizacja,
      },
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "budzetOd" || name === "budzetDo") {
      const budzetOd = name === "budzetOd" ? value : formData.budzetOd;
      const budzetDo = name === "budzetDo" ? value : formData.budzetDo;

      if (budzetOd && budzetDo && parseFloat(budzetDo) < parseFloat(budzetOd)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          budzetDo: true,
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, budzetDo: null }));
      }
    }

    if (name === "iloscPokoiOd" || name === "iloscPokoiDo") {
      const iloscPokoiOd =
        name === "iloscPokoiOd" ? value : formData.iloscPokoiOd;
      const iloscPokoiDo =
        name === "iloscPokoiDo" ? value : formData.iloscPokoiDo;

      if (
        iloscPokoiOd &&
        iloscPokoiDo &&
        parseFloat(iloscPokoiDo) < parseFloat(iloscPokoiOd)
      ) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          iloscPokoiDo: true,
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, iloscPokoiDo: null }));
      }
    }

    if (name === "metrazOd" || name === "metrazDo") {
      const metrazOd = name === "metrazOd" ? value : formData.metrazOd;
      const metrazDo = name === "metrazDo" ? value : formData.metrazDo;

      if (metrazOd && metrazDo && parseFloat(metrazDo) < parseFloat(metrazOd)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          metrazDo: true,
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, metrazDo: null }));
      }
    }
  };

  return (
    <form>
      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Data zapytania"
          name="dataZapytania"
          type="datetime-local"
          value={formData.dataZapytania}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Dane klienta"
          name="daneKlienta"
          value={formData.daneKlienta}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <CustomTextField
          label="Adres e-mail"
          name="email"
          value={formData.email}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>
      <div className="flex flex-col">
        {formData.numerTelefonu.map((phone, index) => (
          <div key={index} className="flex items-center space-x-2">
            <CustomTextField
              label={`Numer telefonu ${index + 1}`}
              variant="outlined"
              fullWidth
              margin="normal"
              type="number"
              value={phone}
              onChange={(e) => onPhoneNumbersChange(index, e.target.value)}
            />
            <IconButton
              onClick={() => removePhoneField(index)}
              disabled={formData.numerTelefonu.length === 1}
              sx={{ marginTop: "8px" }}
            >
              <RemoveCircle
                color={
                  formData.numerTelefonu.length === 1 ? "disabled" : "error"
                }
              />
            </IconButton>
          </div>
        ))}

        <IconButton onClick={addPhoneField} color="primary">
          <AddCircle sx={{ color: "#FC8721" }} />
        </IconButton>
      </div>
      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Numer oferty w Galactice"
          name="numerGalactica"
          value={formData.numerGalactica}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
        />
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
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) =>
              onChange({
                target: {
                  name: "status",
                  value: e.target.value,
                },
              })
            }
            label="Status"
          >
            {clientStatuesConfig.map((status) => (
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

      <CustomTextField
        label="Komentarz"
        name="komentarz"
        value={formData.komentarz}
        onChange={onChange}
        variant="outlined"
        fullWidth
        margin="normal"
        multiline
        maxRows={4}
      />
      <div className="flex justify-end space-x-4">
        <FormControl
          fullWidth
          margin="normal"
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
            value={formData.agent}
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
            onChange={(e) =>
              onChange({
                target: {
                  name: "agent",
                  value: e.target.value,
                },
              })
            }
            label="Agent"
          >
            <MenuItem
              key={"null"}
              value={""}
              sx={{
                fontStyle: "italic",
                color: "gray",
                fontWeight: "bold",
              }}
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
          margin="normal"
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
            value={formData.lokalizacja}
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
                  checked={formData.lokalizacja?.includes(district) || false}
                  onChange={(event) => {
                    handleLokalizacjaChange(district);
                  }}
                />
                <ListItemText primary={district} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex justify-end space-x-4">
        <FormControl
          fullWidth
          margin="normal"
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
          <InputLabel>Rodzaj nieruchomości</InputLabel>
          <Select
            value={formData.rodzajNieruchomosci}
            onChange={(e) =>
              onChange({
                target: {
                  name: "rodzajNieruchomosci",
                  value: e.target.value,
                },
              })
            }
            label="Rodzaj nieruchomości"
          >
            <MenuItem
              key={"null"}
              value={""}
              sx={{
                fontStyle: "italic",
                color: "gray",
                fontWeight: "bold",
              }}
            >
              Brak
            </MenuItem>
            <MenuItem value="Dom">Dom</MenuItem>
            <MenuItem value="Mieszkanie">Mieszkanie</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          margin="normal"
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
          <InputLabel>Standard</InputLabel>
          <Select
            value={formData.standard}
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
                label="Standard"
              />
            }
            onChange={(e) =>
              onChange({
                target: {
                  name: "standard",
                  value: e.target.value,
                },
              })
            }
            label="Standard"
          >
            <MenuItem
              key={"null"}
              value={""}
              sx={{
                fontStyle: "italic",
                color: "gray",
                fontWeight: "bold",
              }}
            >
              Brak
            </MenuItem>
            {clientStandardConfig.map((standard) => (
              <MenuItem
                key={standard.value}
                value={standard.value === "Brak" ? "" : standard.value}
                sx={{
                  fontStyle: standard.value === "Brak" ? "italic" : "normal",
                  color: standard.value === "Brak" ? "gray" : "inherit",
                  fontWeight: standard.value === "Brak" ? "bold" : "poppins",
                }}
              >
                {standard.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Ilość pokoi od"
          name="iloscPokoiOd"
          type="number"
          value={formData.iloscPokoiOd}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.iloscPokoiDo}
        />
        <CustomTextField
          label="Ilość pokoi do"
          name="iloscPokoiDo"
          type="number"
          value={formData.iloscPokoiDo}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.iloscPokoiDo}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Metraż od"
          name="metrazOd"
          type="number"
          value={formData.metrazOd}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.metrazDo}
        />
        <CustomTextField
          label="Metraż do"
          name="metrazDo"
          type="number"
          value={formData.metrazDo}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.metrazDo}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Budżet od"
          name="budzetOd"
          type="number"
          value={formData.budzetOd}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.budzetDo}
        />
        <CustomTextField
          label="Budżet do"
          name="budzetDo"
          type="number"
          value={formData.budzetDo}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="normal"
          error={errors.budzetDo}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <CustomTextField
          label="Ostatni kontakt"
          name="ostatniKontakt"
          type="datetime-local"
          value={formData.ostatniKontakt}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <CustomTextField
          label="Data następnego kontaktu"
          name="dataNastepnegoKontaktu"
          type="datetime-local"
          value={formData.dataNastepnegoKontaktu}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </div>
    </form>
  );
}

export default ClientForm;
