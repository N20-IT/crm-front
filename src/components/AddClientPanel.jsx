import { Button } from "@mui/material";
import ClientForm from "./ClientForm";
import { useState } from "react";
import Alerts from "./Alerts";
import { GetInformationFromToken } from "../utils/decodeToken";

function AddClientPanel({ onSave, onCancel, allUsers }) {
  const userRole = GetInformationFromToken("custom:role");
  const [formData, setFormData] = useState({
    lokalizacja: [],
    numerTelefonu: [""],
    standard: [],
  });
  const [, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const validationErrors = {};
    if (
      formData.budzetOd &&
      formData.budzetDo &&
      parseFloat(formData.budzetDo) < parseFloat(formData.budzetOd)
    ) {
      validationErrors.budzetDo =
        "Wartość w polu 'Budżet do' nie może być mniejsza niż w polu 'Budżet od'.";
    }

    if (
      formData.iloscPokoiOd &&
      formData.iloscPokoiDo &&
      parseFloat(formData.iloscPokoiDo) < parseFloat(formData.iloscPokoiOd)
    ) {
      validationErrors.iloscPokoiDo =
        "Wartość w polu 'Ilość pokoi do' nie może być mniejsza niż w polu 'Ilość pokoi od'.";
    }

    if (
      formData.metrazOd &&
      formData.metrazDo &&
      parseFloat(formData.metrazDo) < parseFloat(formData.metrazOd)
    ) {
      validationErrors.metrazDo =
        "Wartość w polu 'Metraż do' nie może być mniejsza niż w polu 'Metraż od'.";
    }
    if (!formData.komentarz && userRole !== "admin")
      validationErrors.komentarz = "Komentarz jest wymagany.";
    if (
      formData.dataNastepnegoKontaktu &&
      !formData.komentarzData &&
      userRole !== "admin"
    )
      validationErrors.komentarzData =
        "Komentarz do daty następnego kontaktu jest wymagany.";
    if (formData.lokalizacja.length === 0 && userRole !== "admin")
      validationErrors.lokalizacja = "Lokalizacja jest wymagana.";
    if (!formData.rodzajNieruchomosci && userRole !== "admin")
      validationErrors.rodzajNieruchomosci =
        "Rodzaj nieruchomości jest wymagany.";
    if (
      !formData.iloscPokoiOd &&
      !formData.iloscPokoiDo &&
      userRole !== "admin"
    )
      validationErrors.iloscPokoi = "Ilość pokoi jest wymagana.";
    if (!formData.budzetOd && !formData.budzetDo && userRole !== "admin")
      validationErrors.budzet = "Przedział budżetu jest wymagany.";
    if (
      !formData.email &&
      formData.numerTelefonu[0] === "" &&
      userRole !== "admin"
    )
      validationErrors.contact =
        "Przynajmniej jeden kontakt jest wymagany - email lub numer telefonu.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessages = Object.values(validationErrors).join("\n");
      setAlertOpen(true);
      setAlertMessage("Popraw następujące błędy: \n" + errorMessages);
      setAlertSeverity("error");
      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        lokalizacja: formData.lokalizacja.join(","),
      };
      await onSave(updatedFormData);
      setFormData({ lokalizacja: [] });
      setErrors({});
    } catch (error) {
      console.error("Błąd podczas zapisywania klienta:", error);
    }
  };

  const handlePhoneNumbersChange = (index, value) => {
    setFormData((prevData) => {
      const newPhones = [...prevData.numerTelefonu];
      newPhones[index] = value;
      return { ...prevData, numerTelefonu: newPhones };
    });
  };

  const addPhoneField = () => {
    setFormData((prevData) => ({
      ...prevData,
      numerTelefonu: [...prevData.numerTelefonu, ""],
    }));
  };

  const removePhoneField = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      numerTelefonu: prevData.numerTelefonu.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white px-6 rounded-lg shadow-lg w-1/3 max-h-[95%] overflow-auto">
        <div className="sticky top-0 bg-white pt-6 pb-2 px-2 z-20">
          <h2 className="text-4xl font-bold mb-4 font-poppins">
            Dodaj nowego klienta
          </h2>
        </div>
        <form>
          <div className="w-full">
            <ClientForm
              formData={formData}
              onChange={handleChange}
              onPhoneNumbersChange={handlePhoneNumbersChange}
              addPhoneField={addPhoneField}
              removePhoneField={removePhoneField}
              allUsers={allUsers}
            />
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

export default AddClientPanel;
