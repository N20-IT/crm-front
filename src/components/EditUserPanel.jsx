import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import Alerts from "./Alerts";
import UserPanelLayout from "./UserPanelLayout";

function EditUserPanel({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setAlertMessage("Użytkownik został zaktualizowany pomyślnie.");
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
    <>
      <UserPanelLayout
        title="Edytuj użytkownika"
        onSave={handleSave}
        onCancel={onCancel}
      >
        <TextField
          fullWidth
          label="Imię"
          name="imie"
          value={formData.imie}
          onChange={handleChange}
          error={!!errors.imie}
          helperText={errors.imie}
        />
        <TextField
          fullWidth
          label="Nazwisko"
          name="nazwisko"
          value={formData.nazwisko}
          onChange={handleChange}
          error={!!errors.nazwisko}
          helperText={errors.nazwisko}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
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
      </UserPanelLayout>

      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </>
  );
}

export default EditUserPanel;