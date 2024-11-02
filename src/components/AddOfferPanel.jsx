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
import dzielniceData from "../dzielnice_poddzielnice.json";

function AddOfferPanel({ onSave, onCancel, users }) {
  const [formData, setFormData] = useState({
    adres: {
      ulica: "",
      dzielnica: "",
      poddzielnica: "",
      miasto: "",
    },
    typInwestycji: "",
    iloscPokoi: "",
    metraz: "",
    cena: "",
    daneWlasciciela: "",
    telefonWlasciciela: "",
    linkOferta: "",
    komentarz: "",
    agent: "",
    statusOferty: "",
  });
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Wybrana dzielnica
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(""); // Wybrana poddzielnica
  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(true);
  const krakowDistricts = [
    "Stare Miasto",
    "Grzegórzki",
    "Prądnik Czerwony",
    "Prądnik Biały",
    "Krowodrza",
    "Bronowice",
    "Zwierzyniec",
    "Czyżyny",
    "Mistrzejowice",
    "Bieńczyce",
    "Wzgórza Krzesławickie",
    "Nowa Huta",
    "Dębniki",
    "Łagiewniki - Borek Fałęcki",
    "Swoszowice",
    "Podgórze",
    "Podgórze Duchackie",
    "Bieżanów - Prokocim",
  ];

  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    setSelectedSubdistrict("");

    if (krakowDistricts.includes(district)) {
      handleChange({
        target: {
          name: "miasto",
          value: "Kraków",
        },
      });
      setIsSubdistrictDisabled(false);
    } else {
      handleChange({
        target: {
          name: "miasto",
          value: "",
        },
      });
      setIsSubdistrictDisabled(true);
    }
  };

  const handleSubdistrictChange = (event) => {
    setSelectedSubdistrict(event.target.value);
  };

  const subdistricts = selectedDistrict
    ? dzielniceData.Dzielnice[selectedDistrict]
    : [];

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
          <div className="flex justify-end space-x-4">
            <div className="w-full">
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
                <InputLabel id="district-label">Dzielnica</InputLabel>
                <Select
                  labelId="district-label"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
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
                      label="Dzielnica"
                    />
                  }
                >
                  {Object.keys(dzielniceData.Dzielnice).map((district) => (
                    <MenuItem keys={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="w-full">
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
                disabled={!selectedDistrict || isSubdistrictDisabled}
              >
                <InputLabel id="subdistrict-label">Poddzielnica</InputLabel>
                <Select
                  labelId="subdistrict-label"
                  value={selectedSubdistrict}
                  onChange={handleSubdistrictChange}
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
                      label="Poddzielnica"
                    />
                  }
                >
                  {subdistricts.map((subdistrict) => (
                    <MenuItem key={subdistrict} value={subdistrict}>
                      {subdistrict}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
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
            <div className="w-full">
              <CustomTextField
                label="Poddzielnica"
                name="poddzielnica"
                value={formData.adres.poddzielnica}
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
              label="Typ inwestycji"
              name="typInwestycji"
              value={formData.typInwestycji}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div>
            <CustomTextField
              label="Ilość pokoi"
              name="iloscPokoi"
              value={formData.iloscPokoi}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <div className="w-full">
              <CustomTextField
                label="Dane właściciela"
                name="daneWlasciciela"
                value={formData.daneWlasciciela}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
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
          <div className="flex justify-end space-x-4">
            <div className="w-full">
              <CustomTextField
                label="Data zakończenia"
                name="dataZakonczenia"
                value={formData.dataZakonczenia}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Data kontaktu"
                name="dataKontaktu"
                value={formData.dataKontaktu}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Data nast. kontaktu"
                name="dataNastepnegoKontaktu"
                value={formData.dataNastepnegoKontaktu}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
          </div>
          <div className="w-full mb-2">
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
                <MenuItem value="Wolny">Wolny</MenuItem>
                <MenuItem value="Zajęta">Zajęta</MenuItem>
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
