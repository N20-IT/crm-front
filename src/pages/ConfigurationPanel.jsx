import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { GetInformationFromToken } from "../utils/decodeToken";
import axios from "axios";
import serverConfig from "../servers.json";
import Alerts from "../components/Alerts";
import {
  Box,
  Paper,
  Typography,
  Switch,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import {
  DragIndicator,
  Visibility,
  VisibilityOff,
  Save,
} from "@mui/icons-material";

function ConfigurationPanel() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const isAuthenticated = useAuth();
  const userRole = GetInformationFromToken("custom:role");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const backendServer = serverConfig["backend-server"];

  const [activeTab, setActiveTab] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);

  const [offersConfig, setOffersConfig] = useState([
    { id: "ulica", label: "Ulica", shortLabel: "Ul.", visible: false },
    {
      id: "poddzielnica",
      label: "Poddzielnica",
      shortLabel: "Poddz.",
      visible: true,
    },
    {
      id: "dzielnica",
      label: "Dzielnica",
      shortLabel: "Dziel.",
      visible: true,
    },
    { id: "miasto", label: "Miasto", shortLabel: "Miasto", visible: true },
    { id: "rynek", label: "Rynek", shortLabel: "Rynek", visible: false },
  ]);

  const [clientsConfig, setClientsConfig] = useState([
    { id: "daneKlienta", label: "Klient", shortLabel: "Klient", visible: true },
    {
      id: "numerTelefonu",
      label: "Numer telefonu",
      shortLabel: "Tel.",
      visible: false,
    },
    {
      id: "adresEmail",
      label: "Adres e-mail",
      shortLabel: "Email",
      visible: true,
    },
    {
      id: "komentarz",
      label: "Opis klienta",
      shortLabel: "Opis",
      visible: true,
    },
    {
      id: "lokalizacja",
      label: "Lokalizacja",
      shortLabel: "Lok.",
      visible: false,
    },
  ]);

  useEffect(() => {
    console.log(isAuthenticated, userRole);
    if (!isAuthenticated || (userRole !== "admin" && userRole !== "user"))
      navigate("/");
  }, [isAuthenticated, userRole, navigate]);

  const getCurrentConfig = () => {
    return activeTab === 0 ? offersConfig : clientsConfig;
  };

  const setCurrentConfig = (newConfig) => {
    if (activeTab === 0) {
      setOffersConfig(newConfig);
    } else {
      setClientsConfig(newConfig);
    }
  };

  const handleToggleVisibility = (id) => {
    const config = getCurrentConfig();
    const newConfig = config.map((item) =>
      item.id === id ? { ...item, visible: !item.visible } : item,
    );
    setCurrentConfig(newConfig);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const config = getCurrentConfig();
    const newConfig = [...config];
    const draggedItemContent = newConfig[draggedItem];

    newConfig.splice(draggedItem, 1);
    newConfig.splice(index, 0, draggedItemContent);

    setCurrentConfig(newConfig);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveConfiguration = async () => {
    setLoading(true);
    try {
      const configToSave = {
        offers: offersConfig,
        clients: clientsConfig,
      };

      // await axios.post(`${backendServer}/api/config/columns`, configToSave, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setAlertMessage("Konfiguracja została zapisana pomyślnie");
      setAlertSeverity("success");
      setAlertOpen(true);
    } catch (error) {
      setAlertMessage("Błąd podczas zapisywania konfiguracji");
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start justify-start h-screen ml-16 flex-col">
      <Sidebar />

      <div className="flex-1 w-full p-8 overflow-auto">
        <Typography variant="h4" className="mb-6 font-bold">
          Konfiguracja widoków tabel
        </Typography>
        <Chip
          label="Strona w budowie"
          size="small"
          sx={{
            backgroundColor: "#FFF3CD",
            color: "#856404",
            fontWeight: "600",
            fontFamily: "Poppins",
            marginBottom: "16px",
          }}
        />

        <Paper className="p-6">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="mb-4"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#FC8721",
                height: 3,
              },
              "& .MuiTab-root": {
                color: "#6d727f",
                fontWeight: 500,
                "&.Mui-selected": {
                  color: "#FC8721",
                  fontWeight: "bold",
                },
              },
            }}
          >
            <Tab label="Oferty" />
            <Tab label="Klienci" />
          </Tabs>

          <Divider className="mb-4" />

          <Typography variant="body2" className="mb-4 text-gray-600">
            Przeciągnij kolumny, aby zmienić ich kolejność. Użyj przełącznika,
            aby pokazać lub ukryć kolumnę.
          </Typography>

          <List className="bg-gray-50 rounded-lg">
            {getCurrentConfig().map((column, index) => (
              <ListItem
                key={column.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-white mb-2 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow ${
                  draggedItem === index ? "opacity-50" : ""
                }`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 16px",
                }}
              >
                {/* Numeracja */}
                <Box
                  className="flex items-center justify-center mr-3"
                  sx={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: column.visible ? "#FC8721" : "#6d727f",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                  }}
                >
                  {index + 1}
                </Box>

                <DragIndicator className="text-gray-400 mr-3 cursor-grab active:cursor-grabbing" />

                <Box className="flex-1">
                  <Typography variant="body1" className="font-medium">
                    {column.label}
                  </Typography>
                  <Typography variant="caption" className="text-gray-500">
                    {column.shortLabel}
                  </Typography>
                </Box>

                <Box className="flex items-center gap-2">
                  {column.visible ? (
                    <Visibility sx={{ color: "#6d727f" }} />
                  ) : (
                    <VisibilityOff sx={{ color: "#6d727f" }} />
                  )}
                  <Switch
                    checked={column.visible}
                    onChange={() => handleToggleVisibility(column.id)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#FC8721",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#FC8721",
                      },
                    }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>

          <Box className="mt-6 flex justify-end gap-3">
            <Button
              variant="outlined"
              onClick={() => {
                setActiveTab(0);
              }}
              sx={{
                borderColor: "#6d727f",
                backgroundColor: "#6d727f",
                color: "white",
              }}
            >
              Anuluj
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveConfiguration}
              disabled={loading}
              sx={{
                backgroundColor: "#FC8721",
              }}
            >
              Zapisz konfigurację
            </Button>
          </Box>
        </Paper>
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
