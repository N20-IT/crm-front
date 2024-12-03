import React, { useState, useCallback } from "react";
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
import axios from "axios";
import serverConfig from "../servers.json";
import { useReadCookie } from "../utils/auth";
import { debounce } from "lodash";
import statusesConfig from "../config/statusesConfig";

function AddOfferPanel({ onSave, onCancel, users }) {
  const backendServer = serverConfig["backend-server"];
  const token = useReadCookie();
  const [formData, setFormData] = useState({
    dzielnica: "",
    ulica: "",
    poddzielnica: "",
    miasto: "",
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
  const [isSubdistrictDisabled, setIsSubdistrictDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [phoneExistsInfo, setPhoneExistsInfo] = useState("");

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

  const checkIfPhoneExists = async (phoneNumber) => {
    try {
      const response = await axios.get(`${backendServer}/listings`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          telefonWlasciciela: phoneNumber,
        },
      });

      if (response.data.length > 0) {
        setPhoneExistsInfo("Oferta z tym numerem telefonu już istnieje.");
      } else {
        setPhoneExistsInfo("");
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania numeru telefonu:", error);
    }
  };

  const debouncedCheckIfPhoneExists = useCallback(
    debounce(checkIfPhoneExists, 1000),
    [checkIfPhoneExists]
  );

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
    ? dzielniceData.Dzielnice[formData.dzielnica]
    : [];

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name !== "dataKontaktu" && name !== "dataNastepnegoKontaktu"
        ? value.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]/g, "")
        : value;
    if (name === "telefonWlasciciela" && sanitizedValue.length === 9) {
      await debouncedCheckIfPhoneExists(sanitizedValue);
    }
    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.statusOferty === "Zajęty" && !formData.komentarz) {
      newErrors.komentarz =
        "Komentarz jest wymagany, gdy status jest 'Zajęty'.";
    }
    if (
      formData.statusOferty === "W kontakcie" &&
      (!formData.komentarz || !formData.dataNastepnegoKontaktu)
    ) {
      if (!formData.komentarz)
        newErrors.komentarz =
          "Komentarz jest wymagany, gdy status jest 'W kontakcie'.";
      if (!formData.dataNastepnegoKontaktu)
        newErrors.dataNastepnegoKontaktu =
          "Data następnego kontaktu jest wymagana przy statusie 'W kontakcie'.";
    }
    if (formData.statusOferty === "Był kontakt" && !formData.komentarz) {
      newErrors.komentarz =
        "Komentarz jest wymagany, gdy status to 'Był kontakt'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

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
                  name="dzielnica"
                  value={formData.dzielnica || ""}
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
              {phoneExistsInfo && (
                <p style={{ color: "blue", fontFamily: "Poppins" }}>
                  {phoneExistsInfo}
                </p>
              )}
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
              error={!!errors.komentarz}
              helperText={errors.komentarz}
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
                InputLabelProps={{ shrink: true }}
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
                error={!!errors.dataNastepnegoKontaktu}
                helperText={errors.dataNastepnegoKontaktu}
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
}

export default AddOfferPanel;
