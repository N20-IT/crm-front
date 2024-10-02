import React, { useState } from "react";
import { Button } from "@mui/material";
import CustomTextField from "./CustomTextField";

function AddUserPanel({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    family_name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
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
          Dodaj nowego użytkownika
        </h2>
        <form>
          <div className="w-full">
            <CustomTextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <CustomTextField
              label="Imię"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <CustomTextField
              label="Nazwisko"
              name="family_name"
              value={formData.family_name}
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
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserPanel;
