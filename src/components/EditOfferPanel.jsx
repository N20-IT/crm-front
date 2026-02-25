import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  InputLabel,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

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

  const handlePhoneNumbersChange = async (index, value) => {
    setFormData((prevData) => {
      const newPhones = [...prevData.telefonWlasciciela];
      newPhones[index] = value;
      return { ...prevData, telefonWlasciciela: newPhones };
    });
  };

  const addPhoneField = () => {
    setFormData((prevData) => ({
      ...prevData,
      telefonWlasciciela: [...prevData.telefonWlasciciela, ""],
    }));
  };

  const removePhoneField = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      telefonWlasciciela: prevData.telefonWlasciciela.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleCommentsChange = (index, value) => {
    setFormData((prevData) => {
      const newComments = [...prevData.komentarz];

      newComments[index] = {
        ...newComments[index],
        tekst: value,
        data: new Date().toISOString(),
      };

      return {
        ...prevData,
        komentarz: newComments,
      };
    });
  };

  const addCommentField = () => {
    setFormData((prevData) => ({
      ...prevData,
      komentarz: [
        ...prevData.komentarz,
        {
          tekst: "",
          data: new Date().toISOString(),
        },
      ],
    }));
  };

  const removeCommentField = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      komentarz: prevData.komentarz.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className=" fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[95%] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className=" text-4xl font-bold mb-4 font-poppins">Edytuj ofertę</h2>
        <form>
          <div className="flex justify-end space-x-2">
            <FormControl
              fullWidth
              margin="dense"
              sx={{
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
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="dense"
              sx={{
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
          <div className="flex justify-end space-x-2">
            <CustomTextField
              label="Ulica"
              name="ulica"
              value={formData.ulica ?? ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="dense"
            />
            <CustomTextField
              label="Miasto/Wieś"
              name="miasto"
              value={formData.miasto ?? ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <CustomTextField
              label="Metraż"
              name="metraz"
              type="number"
              value={formData.metraz ?? ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="dense"
            />
            <CustomTextField
              label="Pow. działki"
              name="powDzialki"
              type="number"
              value={formData.powDzialki ?? ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="dense"
            />
            <CustomTextField
              label="Ilość pokoi"
              name="iloscPokoi"
              type="number"
              value={formData.iloscPokoi ?? ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="dense"
            />
            <CustomTextField
              label="Cena"
              name="cena"
              type="number"
              value={formData.cena ?? ""}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="dense"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <FormControl
              fullWidth
              margin="dense"
              sx={{
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
                <MenuItem key="Dom" value="Dom">
                  Dom
                </MenuItem>
                <MenuItem key="Mieszkanie" value="Mieszkanie">
                  Mieszkanie
                </MenuItem>
                <MenuItem key="Lokal" value="Lokal">
                  Lokal
                </MenuItem>
                <MenuItem key="Działka" value="Działka">
                  Działka
                </MenuItem>
                <MenuItem key="Bliźniak" value="Bliźniak">
                  Bliźniak
                </MenuItem>
                <MenuItem key="Szeregowy" value="Szeregowy">
                  Szeregowy
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              margin="dense"
              sx={{
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
                <MenuItem key="Pierwotny" value="Pierwotny">
                  Pierwotny
                </MenuItem>
                <MenuItem key="Wtórny" value="Wtórny">
                  Wtórny
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <CustomTextField
            label="Dane właściciela"
            name="daneWlasciciela"
            value={formData.daneWlasciciela ?? ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="dense"
          />
          <div className="flex flex-col">
            {formData.telefonWlasciciela.map((phone, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <CustomTextField
                    label={`Telefon/Email ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    onChange={(e) =>
                      handlePhoneNumbersChange(index, e.target.value)
                    }
                    value={phone}
                  />
                  <IconButton
                    onClick={() => removePhoneField(index)}
                    disabled={formData.telefonWlasciciela.length === 1}
                    sx={{ marginTop: "8px", marginBottom: "4px" }}
                  >
                    <RemoveCircle
                      color={
                        formData.telefonWlasciciela.length === 1
                          ? "disabled"
                          : "error"
                      }
                    />
                  </IconButton>
                </div>
              </div>
            ))}
            <IconButton onClick={addPhoneField} color="primary">
              <AddCircle sx={{ color: "#FC8721" }} />
            </IconButton>
          </div>
          <div className="flex flex-col">
            {formData.komentarz.map((komentarz, index) => (
              <div key={index} className="flex items-start space-x-2">
                <CustomTextField
                  label={`Komentarz do daty następnego spotkania ${index + 1}`}
                  value={komentarz.tekst}
                  onChange={(e) => handleCommentsChange(index, e.target.value)}
                  variant="outlined"
                  fullWidth
                  margin="dense"
                  multiline
                  maxRows={4}
                />

                <IconButton
                  onClick={() => removeCommentField(index)}
                  disabled={formData.komentarz.length === 1}
                  sx={{ marginTop: "8px" }}
                >
                  <RemoveCircle
                    color={
                      formData.komentarz.length === 1 ? "disabled" : "error"
                    }
                  />
                </IconButton>
              </div>
            ))}

            <IconButton onClick={addCommentField}>
              <AddCircle sx={{ color: "#FC8721" }} />
            </IconButton>
          </div>
          {/* <CustomTextField
            label="Komentarz"
            name="komentarz"
            value={formData.komentarz ?? ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="dense"
            multiline
            maxRows={4}
          /> */}
          <div className="flex justify-end space-x-2">
            <CustomTextField
              label="Data kontaktu"
              name="dataKontaktu"
              type="datetime-local"
              value={
                formData.dataKontaktu
                  ? new Date(formData.dataKontaktu).toLocaleDateString(
                      "en-CA",
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
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <CustomTextField
              label="Data nast. kontaktu"
              name="dataNastepnegoKontaktu"
              type="datetime-local"
              value={
                formData.dataNastepnegoKontaktu
                  ? new Date(
                      formData.dataNastepnegoKontaktu,
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
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <FormControl
              fullWidth
              margin="dense"
              sx={{
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
              margin="dense"
              sx={{
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
            value={formData.linkOferta ?? ""}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="dense"
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
