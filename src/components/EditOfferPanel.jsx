import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  InputLabel,
} from "@mui/material";
import CustomTextField from "./CustomTextField";

const EditOfferPanel = ({ offerData, onSave, onCancel, users }) => {
  const [formData, setFormData] = useState(offerData);

  useEffect(() => {
    setFormData(offerData);
  }, [offerData]);

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

  const handleSave = () => {
    onSave(formData); // Przekaż dane do funkcji zapisującej
  };

  return (
    <div className=" fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className=" text-4xl font-bold mb-4 font-poppins">Edytuj ofertę</h2>
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
              value={formData.statusOferty}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "statusOferty",
                    value: e.target.value,
                  },
                })
              }
              label="Status"
            >
              <MenuItem value="">
                <em>Brak</em>
              </MenuItem>
              <MenuItem value="wolny">Wolny</MenuItem>
              <MenuItem value="zajety">Zajęty</MenuItem>
            </Select>
          </FormControl>
          <div className="w-full mt-4 mb-2">
            <FormControl
              fullWidth
              sx={{
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
                {users.map((user) => (
                  <MenuItem key={user} value={user}>
                    {user}
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
};

export default EditOfferPanel;
