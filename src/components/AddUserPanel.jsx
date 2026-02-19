import React, { useState } from "react";
import { Button } from "@mui/material";
import UserForm from "./UserForm";
import Alerts from "./Alerts";

function AddUserPanel({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    email: "",
    imie: "",
    nazwisko: "",
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
    }
    if (!formData.nazwisko || formData.nazwisko.trim().length < 2) {
      newErrors.nazwisko = "Nazwisko musi mieć przynajmniej 2 znaki.";
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      const errorMessages = Object.values(errors).join("\n");
      setAlertMessage("Popraw następujące błędy:\n" + errorMessages);
      setAlertSeverity("error");
      setAlertOpen(true);
      return;
    }

    try {
      await onSave(formData);
      setFormData({
        email: "",
        imie: "",
        nazwisko: "",
        role: "user",
      });
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
          <div className="w-full">
            <UserForm formData={formData} onChange={handleChange} errors={errors} />
            <div className="sticky bottom-0 bg-white py-2 px-2 z-20">
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
          </div>
        </form>
      </div>

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
