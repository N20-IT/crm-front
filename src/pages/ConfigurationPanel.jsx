import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import serverConfig from "../servers.json";
import Alerts from "../components/Alerts";
import {
  Paper,
  Typography,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";
import CustomTextField from "../components/CustomTextField";

// Początkowa konfiguracja
const initialConfig = {
  offers: [
    { name: "Ulica", shortLabel: "Ul.", order: 1 },
    { name: "Poddzielnica", shortLabel: "Poddz", order: 2 },
    { name: "Dzielnica", shortLabel: "Dziel.", order: 3 },
    { name: "Miasto", shortLabel: "Miasto", order: 4 },
    { name: "Rynek", shortLabel: "Rynek", order: 5 },
  ],
  clients: [
    { name: "Klient", shortLabel: "Klient", order: 1 },
    { name: "Numer telefonu", shortLabel: "Tel.", order: 2 },
    { name: "Adres e-mail", shortLabel: "Email", order: 3 },
    { name: "Opis klienta", shortLabel: "Opis", order: 4 },
    { name: "Lokalizacja", shortLabel: "Lok.", order: 5 },
  ],
};

function ConfigurationPanel() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const isAuthenticated = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const backendServer = serverConfig["backend-server"];

  const [config, setConfig] = useState(initialConfig);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  // Ładowanie konfiguracji z backendu
  const loadConfiguration = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendServer}/api/configuration`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error("Błąd ładowania konfiguracji:", error);
      setAlertMessage("Błąd podczas ładowania konfiguracji");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  }, [backendServer, token]);

  // Zapisywanie konfiguracji
  const saveConfiguration = async () => {
    setLoading(true);
    try {
      await axios.post(`${backendServer}/api/configuration`, config, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlertMessage("Konfiguracja została zapisana pomyślnie");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Błąd zapisywania konfiguracji:", error);
      setAlertMessage("Błąd podczas zapisywania konfiguracji");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Aktualizacja pola w konfiguracji
  const updateField = (type, index, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  // Dodawanie nowego pola
  const addField = (type) => {
    const newOrder = config[type].length + 1;
    setConfig((prev) => ({
      ...prev,
      [type]: [...prev[type], { name: "", shortLabel: "", order: newOrder }],
    }));
  };

  // Usuwanie pola
  const removeField = (type, index) => {
    setConfig((prev) => ({
      ...prev,
      [type]: prev[type]
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, order: i + 1 })),
    }));
  };

  // Drag and drop handlers
  const handleDragStart = (type, index) => {
    setDraggedItem({ type, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (type, dropIndex) => {
    if (!draggedItem || draggedItem.type !== type) return;

    const items = [...config[type]];
    const [draggedElement] = items.splice(draggedItem.index, 1);
    items.splice(dropIndex, 0, draggedElement);

    // Aktualizuj order
    const updatedItems = items.map((item, i) => ({ ...item, order: i + 1 }));

    setConfig((prev) => ({
      ...prev,
      [type]: updatedItems,
    }));

    setDraggedItem(null);
  };

  // Renderowanie sekcji konfiguracji
  const renderConfigSection = (title, type, color) => (
    <Accordion className="mb-4">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="bg-gray-50">
        <div className="flex items-center gap-2">
          <Chip
            label={config[type].length}
            size="small"
            sx={{ backgroundColor: color, color: "white" }}
          />
          <Typography variant="h6" className="font-semibold">
            {title}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="space-y-3">
          {config[type].map((field, index) => (
            <Paper
              key={index}
              elevation={1}
              className="p-4"
              draggable
              onDragStart={() => handleDragStart(type, index)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(type, index)}
              style={{
                cursor: "move",
                opacity:
                  draggedItem?.type === type && draggedItem?.index === index
                    ? 0.5
                    : 1,
              }}
            >
              <div className="flex items-center gap-3">
                <IconButton size="small" className="cursor-move">
                  <DragIcon />
                </IconButton>

                <Chip
                  label={field.order}
                  size="small"
                  variant="outlined"
                  sx={{ color: color, borderColor: color }}
                />

                <div className="flex-1 flex items-center gap-2">
                  <Typography
                    variant="body1"
                    className="font-medium"
                    sx={{ minWidth: "120px" }}
                  >
                    {field.name}
                  </Typography>
                  <Chip
                    label={field.shortLabel}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                    }}
                  />
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div className="flex items-start justify-start min-h-screen ml-16 flex-col p-6">
      <Sidebar />

      <div className="w-full">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <Typography variant="h4" className="font-bold mb-2">
              Konfiguracja tabel
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Zarządzaj kolumnami dla tabel ofert i klientów
            </Typography>
          </div>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveConfiguration}
            disabled={loading}
            size="large"
            sx={{
              height: "40px",
              backgroundColor: "#FC8721",
              fontFamily: "Poppins",
              fontSize: "18px",
              "&:hover": {
                backgroundColor: "#e67a1f",
              },
            }}
          >
            Zapisz zmiany
          </Button>
        </div>
        {renderConfigSection("Tabela ofert", "offers", "#FC8721")}
        {renderConfigSection("Tabela klientów", "clients", "#6d727f")}
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

export default ConfigurationPanel;
