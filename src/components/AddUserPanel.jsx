import React, { useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import Alerts from "./Alerts";

function AddUserPanel({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    imie: "",
    nazwisko: "",
    email: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.imie || formData.imie.trim().length < 2) {
      newErrors.imie = "Imię musi mieć przynajmniej 2 znaki.";
    } else if (formData.imie.trim().length > 50) {
      newErrors.imie = "Imię nie może mieć więcej niż 50 znaków.";
    }

    if (!formData.nazwisko || formData.nazwisko.trim().length < 2) {
      newErrors.nazwisko = "Nazwisko musi mieć przynajmniej 2 znaki.";
    } else if (formData.nazwisko.trim().length > 50) {
      newErrors.nazwisko = "Nazwisko nie może mieć więcej niż 50 znaków.";
    }

    if (!formData.email) {
      newErrors.email = "Email jest wymagany.";
    } else {
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Niepoprawny format email.";
      }
    }

    if (!["user", "admin"].includes(formData.role)) {
      newErrors.role = "Rola musi być 'user' lub 'admin'.";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");
      setAlertMessage("Popraw następujące błędy:\n" + errorMessages);
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    try {
      await onSave(formData);
      setFormData({ imie: "", nazwisko: "", email: "", role: "user" });
      setErrors({});
      setAlertMessage("Użytkownik został dodany pomyślnie.");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage("Wystąpił błąd podczas zapisywania użytkownika.");
      setAlertSeverity("error");
      setAlertOpen(true);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <div className="sticky top-0 bg-white pt-6 pb-2 px-2 z-20">
          <h2 className="text-4xl font-bold mb-4 font-poppins">
            Dodaj nowego użytkownika
          </h2>
        </div>
        <form>
          <div className="w-full space-y-4">
            {/* Imię */}
            <TextField
              fullWidth
              label="Imię"
              name="imie"
              value={formData.imie}
              onChange={handleChange}
              error={!!errors.imie}
              helperText={errors.imie}
            />

            {/* Nazwisko */}
            <TextField
              fullWidth
              label="Nazwisko"
              name="nazwisko"
              value={formData.nazwisko}
              onChange={handleChange}
              error={!!errors.nazwisko}
              helperText={errors.nazwisko}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            {/* Rola */}
            <TextField
              select
              fullWidth
              label="Rola"
              name="role"
              value={formData.role}
              onChange={handleChange}
              error={!!errors.role}
              helperText={errors.role}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>

            {/* Przyciski */}
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
          </div>
        </form>
      </div>

      {/* Alerty */}
      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}

export default AddUserPanel;
