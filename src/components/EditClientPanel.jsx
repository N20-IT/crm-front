import { Button } from "@mui/material";
import ClientForm from "./ClientForm";
import { useState } from "react";
import Alerts from "./Alerts";

function EditClientPanel({ initialData, onSave, onCancel, allUsers }) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-CA");
    const formattedTime = date
      .toLocaleTimeString("en-CA", { hour12: false })
      .slice(0, 5);
    return `${formattedDate}T${formattedTime}`;
  };

  const parsedInitialData = {
    ...initialData,
    dataZapytania: formatDateForInput(initialData?.dataZapytania ?? ""),
    ostatniKontakt: formatDateForInput(initialData?.ostatniKontakt ?? ""),
    dataNastepnegoKontaktu: formatDateForInput(
      initialData?.dataNastepnegoKontaktu ?? ""
    ),
    lokalizacja: initialData?.lokalizacja
      ? initialData.lokalizacja.split(",")
      : [],
  };
  const [formData, setFormData] = useState(parsedInitialData);
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

    if (!formData.status) validationErrors.status = "Status jest wymagany.";
    if (!formData.agent) validationErrors.agent = "Agent jest wymagany.";
    if (!formData.numerGalactica)
      validationErrors.numerGalactica = "Numer oferty Galactica jest wymagany.";
    if (formData.lokalizacja.length === 0)
      validationErrors.lokalizacja = "Lokalizacja jest wymagana.";
    if (!formData.daneKlienta)
      validationErrors.daneKlienta = "Dane klienta są wymagane.";

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
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[95%] overflow-auto">
        <h2 className="text-4xl font-bold mb-4 font-poppins">Edytuj klienta</h2>
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
      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}

export default EditClientPanel;
