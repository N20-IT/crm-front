import { useEffect, useState, useCallback } from "react";
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
import LoadingCircularProgress from "../components/LoadingCircularProgress";
import columnsOffersConfig from "../config/columnsOffersConfig";
import columnsClientsConfig from "../config/columnsClientsConfig";

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

  const [draggedItem, setDraggedItem] = useState({ type: null, index: null });
  const tileHeight = 30;
  const avatarSize = Math.max(24, Math.min(40, Math.floor(tileHeight * 0.6)));
  const userInformation =
    GetInformationFromToken("name") +
    " " +
    GetInformationFromToken("family_name");

  const [offersConfig, setOffersConfig] = useState([]);
  const [clientsConfig, setClientsConfig] = useState([]);
  const [userData, setUserData] = useState("");

  // Default configurations and ordering (minimal fields: id and isVisible)
  const defaultClientsOrder = [
    { id: "dataUtworzenia", isVisible: true },
    { id: "dataZapytania", isVisible: true },
    { id: "ostatniKontakt", isVisible: true },
    { id: "dataNastepnegoKontaktu", isVisible: true },
    { id: "daneKlienta", isVisible: true },
    { id: "numerTelefonu", isVisible: true },
    { id: "adresEmail", isVisible: true },
    { id: "komentarzData", isVisible: true },
    { id: "numerGalactica", isVisible: true },
    { id: "status", isVisible: true },
    { id: "agent", isVisible: true },
    { id: "komentarz", isVisible: true },
    { id: "portal", isVisible: true },
    { id: "lokalizacja", isVisible: true },
    { id: "rodzajNieruchomosci", isVisible: true },
    { id: "iloscPokoiOd", isVisible: true },
    { id: "iloscPokoiDo", isVisible: true },
    { id: "metrazOd", isVisible: true },
    { id: "metrazDo", isVisible: true },
    { id: "standard", isVisible: true },
    { id: "budzetOd", isVisible: true },
    { id: "budzetDo", isVisible: true },
  ];

  const defaultOffersOrder = [
    { id: "linkOferta", isVisible: true },
    { id: "dataUtworzenia", isVisible: true },
    { id: "dataNastepnegoKontaktu", isVisible: true },
    { id: "dataKontaktu", isVisible: true },
    { id: "status", isVisible: true },
    { id: "agent", isVisible: true },
    { id: "komentarz", isVisible: true },
    { id: "daneWlasciciela", isVisible: true },
    { id: "telefonDoWlasciciela", isVisible: true },
    { id: "zlM2", isVisible: true },
    { id: "cena", isVisible: true },
    { id: "powDzialki", isVisible: true },
    { id: "metraz", isVisible: true },
    { id: "iloscPokoi", isVisible: true },
    { id: "typInwestycji", isVisible: true },
    { id: "rynek", isVisible: true },
    { id: "miasto", isVisible: true },
    { id: "dzielnica", isVisible: true },
    { id: "poddzielnica", isVisible: true },
    { id: "ulica", isVisible: true },
  ];

  const buildConfigFromDefaults = (defaults, fullList) =>
    defaults.map((d) => {
      const full = fullList.find((f) => f.id === d.id) || { id: d.id };
      return { ...full, ...d };
    });

  const resetClientsDefaults = () => {
    const newConfig = buildConfigFromDefaults(defaultClientsOrder, columnsClientsConfig);
    setClientsConfig(newConfig);
  };

  const resetOffersDefaults = () => {
    const newConfig = buildConfigFromDefaults(defaultOffersOrder, columnsOffersConfig);
    setOffersConfig(newConfig);
  };

  const toggleShowHideAll = (type) => {
    const cfg = type === "offers" ? offersConfig : clientsConfig;
    if (!cfg || cfg.length === 0) return;
    const anyHidden = cfg.some((c) => !c.isVisible);
    const newCfg = cfg.map((c) => ({ ...c, isVisible: anyHidden }));
    type === "offers" ? setOffersConfig(newCfg) : setClientsConfig(newCfg);
  };

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendServer}/users?min=true`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = response.data["users"];
      const matchedUser = usersList.find(
        (user) => user.imie + " " + user.nazwisko === userInformation,
      );
      setUserData(matchedUser);
      const offersConfig = (matchedUser?.listingsColumns || []).map((col) => {
        const full = columnsOffersConfig.find((c) => c.id === col.id);
        return full ? { ...full, ...col } : col;
      });
      const clientsConfig = (matchedUser?.clientColumns || []).map((col) => {
        const full = columnsClientsConfig.find((c) => c.id === col.id);
        return full ? { ...full, ...col } : col;
      });
      setOffersConfig(offersConfig);
      setClientsConfig(clientsConfig);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [token, backendServer]);

  const handleSaveUser = async (userData, clientConfig, offersConfig) => {
    setLoading(true);
    try {
      const userToSave = {
        ...userData,
        clientColumns: clientConfig,
        listingsColumns: offersConfig,
      };
      await axios.put(`${backendServer}/users/${userData._id}`, userToSave, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchAgents();
      setAlertOpen(true);
      setAlertMessage("Pomyślnie zapisano konfigurację");
      setAlertSeverity("success");
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || (userRole !== "admin" && userRole !== "user"))
      navigate("/");
    else fetchAgents();
  }, [isAuthenticated, userRole, navigate, fetchAgents]);

  const getConfigByType = (type) => (type === "offers" ? offersConfig : clientsConfig);
  const setConfigByType = (type, newConfig) =>
    type === "offers" ? setOffersConfig(newConfig) : setClientsConfig(newConfig);

  const handleToggleVisibility = (id, type) => {
    const config = getConfigByType(type);
    const newConfig = config.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item,
    );
    setConfigByType(type, newConfig);
  };

  const handleDragStart = (e, index, type) => {
    setDraggedItem({ type, index });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index, type) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== type || draggedItem.index === index) return;

    const config = getConfigByType(type);
    const newConfig = [...config];
    const draggedItemContent = newConfig[draggedItem.index];

    newConfig.splice(draggedItem.index, 1);
    newConfig.splice(index, 0, draggedItemContent);

    setConfigByType(type, newConfig);
    setDraggedItem({ type, index });
  };

  const handleDragEnd = () => {
    setDraggedItem({ type: null, index: null });
  };

  const handleSaveConfiguration = async () => {
    setLoading(true);
    try {
      await handleSaveUser(userData, clientsConfig, offersConfig);
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
      {loading && <LoadingCircularProgress />}

      <div className="flex-1 w-full p-8 overflow-auto">
        <Typography variant="h4" className="mb-6 font-bold">
          Konfigurator widoków tabel
        </Typography>

          <Typography variant="body2" className="mb-4 text-gray-600">
            Przeciągnij kolumny, aby zmienić ich kolejność. Użyj przełącznika,
            aby pokazać lub ukryć kolumnę.
          </Typography>

        <Paper className="p-6">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => {
                  fetchAgents();
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }} />
          </Box>
<Divider className="mb-4" />
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Oferty
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={resetOffersDefaults}
                  sx={{ backgroundColor: "#FC8721", color: "white" }}
                >
                  Domyślne
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={() => toggleShowHideAll("offers")}
                  sx={{ backgroundColor: "#FC8721", color: "white" }}
                >
                  Pokaż/Ukryj wszystkie
                </Button>
              </Box>
              <List className="bg-gray-50 rounded-lg">
                {offersConfig.map((column, index) => (
                  <ListItem
                    key={column.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, "offers")}
                    onDragOver={(e) => handleDragOver(e, index, "offers")}
                    onDragEnd={handleDragEnd}
                    className={`bg-white mb-2 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow ${
                      draggedItem.type === "offers" && draggedItem.index === index
                        ? "opacity-50"
                        : ""
                    }`}
                    sx={{ display: "flex", alignItems: "center", padding: "8px 16px", minHeight: tileHeight }}
                  >
                    <Box
                      className="flex items-center justify-center mr-3"
                      sx={{
                        minWidth: avatarSize,
                        height: avatarSize,
                        borderRadius: "50%",
                        backgroundColor: column.isVisible ? "#FC8721" : "#6d727f",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: Math.max(12, Math.floor(avatarSize * 0.4)),
                      }}
                    >
                      {index + 1}
                    </Box>

                    <DragIndicator className="text-gray-400 mr-3 cursor-grab active:cursor-grabbing" />

                    <Box className="flex-1">
                      <Typography variant="body1" className="font-medium">
                        {column.label}{' '}
                        <Typography component="span" variant="caption" sx={{ color: "#6b7280", ml: 1 }}>
                          ({column.shortLabel})
                        </Typography>
                      </Typography>
                    </Box>

                    <Box className="flex items-center gap-2">
                      {column.isVisible ? (
                        <Visibility sx={{ color: "#6d727f" }} />
                      ) : (
                        <VisibilityOff sx={{ color: "#6d727f" }} />
                      )}
                      <Switch
                        checked={column.isVisible}
                        onChange={() => handleToggleVisibility(column.id, "offers")}
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
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Klienci
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={resetClientsDefaults}
                  sx={{ backgroundColor: "#FC8721", color: "white" }}
                >
                  Domyślne
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={() => toggleShowHideAll("clients")}
                  sx={{ backgroundColor: "#FC8721", color: "white" }}
                >
                  Pokaż/Ukryj wszystkie
                </Button>
              </Box>
              <List className="bg-gray-50 rounded-lg">
                {clientsConfig.map((column, index) => (
                  <ListItem
                    key={column.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, "clients")}
                    onDragOver={(e) => handleDragOver(e, index, "clients")}
                    onDragEnd={handleDragEnd}
                    className={`bg-white mb-2 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow ${
                      draggedItem.type === "clients" && draggedItem.index === index
                        ? "opacity-50"
                        : ""
                    }`}
                    sx={{ display: "flex", alignItems: "center", padding: "8px 16px", minHeight: tileHeight }}
                  >
                    <Box
                      className="flex items-center justify-center mr-3"
                      sx={{
                        minWidth: avatarSize,
                        height: avatarSize,
                        borderRadius: "50%",
                        backgroundColor: column.isVisible ? "#FC8721" : "#6d727f",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: Math.max(12, Math.floor(avatarSize * 0.4)),
                      }}
                    >
                      {index + 1}
                    </Box>

                    <DragIndicator className="text-gray-400 mr-3 cursor-grab active:cursor-grabbing" />

                    <Box className="flex-1">
                      <Typography variant="body1" className="font-medium">
                        {column.label}{' '}
                        <Typography component="span" variant="caption" sx={{ color: "#6b7280", ml: 1 }}>
                          ({column.shortLabel})
                        </Typography>
                      </Typography>
                    </Box>

                    <Box className="flex items-center gap-2">
                      {column.isVisible ? (
                        <Visibility sx={{ color: "#6d727f" }} />
                      ) : (
                        <VisibilityOff sx={{ color: "#6d727f" }} />
                      )}
                      <Switch
                        checked={column.isVisible}
                        onChange={() => handleToggleVisibility(column.id, "clients")}
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
            </Box>
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
