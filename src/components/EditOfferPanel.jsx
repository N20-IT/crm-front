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
import statusesConfig from "../config/statusesConfig";

const EditOfferPanel = ({ offerData, onSave, onCancel, users }) => {
  const [formData, setFormData] = useState(offerData);

  useEffect(() => {
    setFormData(offerData);
  }, [offerData]);

  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(false);
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
    const districtValue = event.target.value;
    const isKrakowDistrict = krakowDistricts.includes(districtValue);

    const updatedFormData = {
      dzielnica: districtValue,
      miasto: isKrakowDistrict ? "Kraków" : "",
    };

    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
    }));

    setIsSubdistrictDisabled(!isKrakowDistrict);
  };

  const handleSubdistrictChange = (event) => {
    handleChange({
      target: {
        name: "poddzielnica",
        value: event.target.value,
      },
    });
  };

  const subdistricts = formData.dzielnica
    ? dzielniceData.Dzielnice[formData.dzielnica] || []
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name === "telefonWlasciciela") {
      sanitizedValue = sanitizedValue.replace(/\s/g, "");
    }
    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className=" fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl h-3/4 overflow-auto">
        <h2 className=" text-4xl font-bold mb-4 font-poppins">Edytuj ofertę</h2>
        <form>
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-x-4 md:space-y-0">
            <div className="w-full">
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
                  value={formData.dzielnica}
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
                disabled={!formData.dzielnica || isSubdistrictDisabled}
              >
                <InputLabel id="subdistrict-label">Poddzielnica</InputLabel>
                <Select
                  labelId="subdistrict-label"
                  value={formData.poddzielnica}
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
                  {Array.isArray(subdistricts) &&
                    subdistricts.map((subdistrict) => (
                      <MenuItem key={subdistrict} value={subdistrict}>
                        {subdistrict}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-x-4 md:space-y-0">
            <div className="w-full">
              <CustomTextField
                label="Ulica"
                name="ulica"
                value={formData.ulica}
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
                value={formData.miasto}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-x-4 md:space-y-0">
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
                label="Pow. działki"
                name="powDzialki"
                type="number"
                value={formData.powDzialki}
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
          </div>
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-x-4 md:space-y-0">
            <div className="w-full">
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
            </div>
            <div className="w-full">
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
                  value={formData.rynek}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "rynek",
                        value: e.target.value,
                      },
                    })
                  }
                  label="Rynek"
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
                  <MenuItem value="Pierwotny">Pierwotny</MenuItem>
                  <MenuItem value="Wtórny">Wtórny</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-x-4 md:space-y-0">
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
          <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-x-4 md:space-y-0">
            <div className="w-full">
              <CustomTextField
                label="Data kontaktu"
                name="dataKontaktu"
                type="datetime-local"
                value={
                  formData.dataKontaktu
                    ? new Date(formData.dataKontaktu).toLocaleDateString(
                        "en-CA"
                      ) +
                      "T" +
                      new Date(formData.dataKontaktu)
                        .toLocaleTimeString("en-CA", { hour12: false })
                        .slice(0, 5)
                    : ""
                }
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="w-full">
              <CustomTextField
                label="Data nast. kontaktu"
                name="dataNastepnegoKontaktu"
                type="datetime-local"
                value={
                  formData.dataNastepnegoKontaktu
                    ? new Date(
                        formData.dataNastepnegoKontaktu
                      ).toLocaleDateString("en-CA") +
                      "T" +
                      new Date(formData.dataNastepnegoKontaktu)
                        .toLocaleTimeString("en-CA", { hour12: false })
                        .slice(0, 5)
                    : ""
                }
                onChange={handleChange}
                variant="outlined"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </div>
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#535968",
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#535968",
                },
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
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
          <CustomTextField
            label="Link do oferty"
            name="linkOferta"
            value={formData.linkOferta}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />

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
