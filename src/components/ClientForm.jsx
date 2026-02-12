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
import clientPortalConfig from "../config/clientPortalConfig";

function ClientForm({
  formData,
  onChange,
  onPhoneNumbersChange,
  addPhoneField,
  removePhoneField,
  onCommentsChange,
  addCommentField,
  removeCommentField,
  allUsers,
  userRole,
  action,
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
    <>
      <CustomTextField
        label="Data zapytania"
        name="dataZapytania"
        type="date"
        value={
          formData.dataZapytania ? formData.dataZapytania.split("T")[0] : ""
        }
        onChange={onChange}
        variant="outlined"
        fullWidth
        margin="dense"
        InputLabelProps={{ shrink: true }}
      />
      <div className="flex justify-end space-x-2">
        <CustomTextField
          label="Dane klienta"
          name="daneKlienta"
          value={formData.daneKlienta}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="dense"
        />
        <CustomTextField
          label="Adres e-mail"
          name="email"
          value={formData.email}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="dense"
        />
      </div>
      <div className="flex flex-col">
        {formData.numerTelefonu.map((phone, index) => (
          <div key={index} className="flex items-center space-x-2">
            <CustomTextField
              label={`Numer telefonu ${index + 1}`}
              variant="outlined"
              fullWidth
              margin="dense"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneNumbersChange(index, e.target.value)}
            />
            <IconButton
              onClick={() => removePhoneField(index)}
              disabled={formData.numerTelefonu.length === 1}
              sx={{ marginTop: "8px", marginBottom: "4px" }}
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
      <div className="flex justify-end space-x-2">
        <CustomTextField
          label="Numer oferty w Galactice"
          name="numerGalactica"
          value={formData.numerGalactica}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="dense"
          type="number"
        />
        <FormControl
          fullWidth
          margin="dense"
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
        label="Opis klienta"
        name="komentarz"
        value={formData.komentarz}
        onChange={onChange}
        variant="outlined"
        fullWidth
        margin="dense"
        multiline
        maxRows={4}
      />
      <div className="flex justify-end space-x-2">
        <FormControl
          fullWidth
          margin="dense"
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
          margin="dense"
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
      </div>
      <div className="flex justify-end space-x-2">
        <FormControl
          fullWidth
          margin="dense"
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
            <MenuItem value="Lokal">Lokal</MenuItem>
            <MenuItem value="Działka">Działka</MenuItem>
            <MenuItem value="Bliźniak">Bliźniak</MenuItem>
            <MenuItem value="Szeregowy">Szeregowy</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="dense"
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
            value={formData.standard || []}
            onChange={(e) =>
              onChange({
                target: {
                  name: "standard",
                  value: e.target.value,
                },
              })
            }
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
            renderValue={(selected) => selected.join(", ")} // jak mają być wyświetlane wybrane opcje
          >
            {clientStandardConfig.map((standard) => (
              <MenuItem key={standard.value} value={standard.value}>
                <Checkbox
                  checked={formData.standard?.includes(standard.value)}
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
                    color: standard.value === "Brak" ? "gray" : "inherit",
                    fontStyle: standard.value === "Brak" ? "italic" : "normal",
                    fontWeight: standard.value === "Brak" ? "bold" : "normal",
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          fullWidth
          margin="dense"
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
          <InputLabel>Portal</InputLabel>
          <Select
            value={formData.portal}
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
                label="Portal"
              />
            }
            onChange={(e) =>
              onChange({
                target: {
                  name: "portal",
                  value: e.target.value,
                },
              })
            }
            label="Portal"
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
            {clientPortalConfig.map((portal) => (
              <MenuItem
                key={portal}
                value={portal === "Brak" ? "" : portal}
                sx={{
                  fontStyle: portal === "Brak" ? "italic" : "normal",
                  color: portal === "Brak" ? "gray" : "inherit",
                  fontWeight: portal === "Brak" ? "bold" : "poppins",
                }}
              >
                {portal}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="flex justify-end space-x-2">
        <CustomTextField
          label="Ilość pokoi od"
          name="iloscPokoiOd"
          type="number"
          value={formData.iloscPokoiOd}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="dense"
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
          margin="dense"
          error={errors.iloscPokoiDo}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <CustomTextField
          label="Metraż od"
          name="metrazOd"
          type="number"
          value={formData.metrazOd}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="dense"
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
          margin="dense"
          error={errors.metrazDo}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <CustomTextField
          label="Budżet od"
          name="budzetOd"
          type="number"
          value={formData.budzetOd}
          onChange={onChange}
          onBlur={handleBlur}
          variant="outlined"
          fullWidth
          margin="dense"
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
          margin="dense"
          error={errors.budzetDo}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <CustomTextField
          label="Ostatni kontakt"
          name="ostatniKontakt"
          type="date"
          value={
            formData.ostatniKontakt ? formData.ostatniKontakt.split("T")[0] : ""
          }
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <CustomTextField
          label="Data następnego kontaktu"
          name="dataNastepnegoKontaktu"
          type="date"
          value={
            formData.dataNastepnegoKontaktu
              ? formData.dataNastepnegoKontaktu.split("T")[0]
              : ""
          }
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
          inputProps={
            userRole !== "admin"
              ? {
                  min: new Date().toISOString().split("T")[0],
                  max: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0],
                }
              : {}
          }
        />
      </div>
      {/* <CustomTextField
        label="Komentarz dot. natępnego kontaktu"
        name="komentarzData"
        value={formData.komentarzData}
        onChange={onChange}
        variant="outlined"
        fullWidth
        margin="dense"
        multiline
        maxRows={4}
        // disabled={action === "add" || userRole === "admin" ? false : true}
      /> */}

      <div className="flex flex-col">
        {formData.komentarzDataList.map((komentarz, index) => (
          <div key={index} className="flex items-start space-x-2">
            <CustomTextField
              label={`Komentarz do daty następnego spotkania ${index + 1}`}
              value={komentarz.tekst}
              onChange={(e) => onCommentsChange(index, e.target.value)}
              variant="outlined"
              fullWidth
              margin="dense"
              multiline
              maxRows={4}
            />

            <IconButton
              onClick={() => removeCommentField(index)}
              disabled={formData.komentarzDataList.length === 1}
              sx={{ marginTop: "8px" }}
            >
              <RemoveCircle
                color={
                  formData.komentarzDataList.length === 1 ? "disabled" : "error"
                }
              />
            </IconButton>
          </div>
        ))}

        <IconButton onClick={addCommentField}>
          <AddCircle sx={{ color: "#FC8721" }} />
        </IconButton>
      </div>
    </>
  );
}

export default ClientForm;
