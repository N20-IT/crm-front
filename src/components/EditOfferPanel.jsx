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
import dzielniceData from "../dzielnice_poddzielnice.json";

const EditOfferPanel = ({ offerData, onSave, onCancel, users }) => {
  const [formData, setFormData] = useState(offerData);

  useEffect(() => {
    setFormData(offerData);
  }, [offerData]);

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

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className=" fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className=" text-4xl font-bold mb-4 font-poppins">Edytuj ofertę</h2>
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
                      label="Dzielnica/Gmina"
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
                label="Miasto/Wieś"
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
                label="Metraż"
                name="metraz"
                type="number"
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
                type="number"
                value={formData.cena}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Ilość pokoi"
                name="iloscPokoi"
                type="number"
                value={formData.iloscPokoi}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
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
            <InputLabel>Typ inwestycji</InputLabel>
            <Select
              value={formData.typInwestycji}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: "typInwestycji",
                    value: e.target.value,
                  },
                })
              }
              label="Typ inwestycji"
            >
              <MenuItem value="Dom">Dom</MenuItem>
              <MenuItem value="Mieszkanie">Mieszkanie</MenuItem>
              <MenuItem value="Lokal">Lokal</MenuItem>
              <MenuItem value="Działka">Działka</MenuItem>
            </Select>
          </FormControl>
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
                label="Data kontaktu"
                name="dataKontaktu"
                type="datetime-local"
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
                type="datetime-local"
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
                <MenuItem value="Zajęty">Zajęty</MenuItem>
                <MenuItem value="Chętny">Chętny</MenuItem>
                <MenuItem value="Spotkanie">Spotkanie</MenuItem>
                <MenuItem value="W kontakcie">W kontakcie</MenuItem>
                <MenuItem value="Był kontakt">Był kontakt</MenuItem>
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
