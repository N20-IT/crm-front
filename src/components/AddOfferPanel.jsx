import React, { useState } from "react";
import {
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  InputLabel,
} from "@mui/material";
import CustomTextField from "./CustomTextField";

function AddOfferPanel({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    adres: {
      ulica: "",
      dzielnica: "",
      miasto: "",
      numerDomu: "",
      numerMieszkania: "",
    },
    iloscPokoi: "",
    metraz: "",
    cena: "",
    telefonWlasciciela: "",
    komentarz: "",
    // status: "",
    agent: "",
  });

  const names = ["Damian Kaniski", "Wiktoria Grawska", "Paweł Sztak"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["ulica", "dzielnica", "miasto", "numerDomu", "numerMieszkania"].includes(
        name
      )
    ) {
      setFormData((prevState) => ({
        ...prevState,
        adres: {
          ...prevState.adres,
          [name]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Wystąpił błąd podczas zapisywania:", error);
    }
  };

  return (
    <div className=" fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-4xl font-bold mb-4 font-poppins">
          Dodaj nową ofertę
        </h2>
        <form>
          <div className="w-full">
            <CustomTextField
              label="Ulica"
              name="ulica"
              value={formData.adres.ulica}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <div className="w-full">
              <CustomTextField
                label="Dzielnica"
                name="dzielnica"
                value={formData.adres.dzielnica}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Miasto"
                name="miasto"
                value={formData.adres.miasto}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <div className="w-full">
              <CustomTextField
                label="Numer Domu"
                name="numerDomu"
                value={formData.adres.numerDomu}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Numer Mieszkania"
                name="numerMieszkania"
                value={formData.adres.numerMieszkania}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <div className="w-full">
              <CustomTextField
                label="Metraż"
                name="metraz"
                value={formData.metraz}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Cena"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
          </div>
          <div>
            <CustomTextField
              label="Ilość pokoi/dom"
              name="iloscPokoi"
              value={formData.iloscPokoi}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <CustomTextField
              label="Telefon do właściciela"
              name="telefonWlasciciela"
              value={formData.telefonWlasciciela}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <CustomTextField
              label="Komentarz"
              name="komentarz"
              value={formData.komentarz}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div className="w-full mt-4 mb-2">
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                },
                "& .MuiFormLabel-root": {
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  color: "#535968",
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
                value={formData.agent}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "agent",
                      value: e.target.value,
                    },
                  })
                }
                fullWidth
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                color: "white",
                backgroundColor: "#FC8721",
                fontFamily: "Poppins",
                fontSize: "20px",
                width: "100%",
              }}
            >
              Zapisz
            </Button>
            <Button
              variant="contained"
              onClick={onCancel}
              sx={{
                backgroundColor: "#6D727F",
                color: "white",
                fontFamily: "Poppins",
                fontSize: "20px",
                width: "100%",
              }}
            >
              Anuluj
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOfferPanel;
