import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { GetUserRoleFromToken } from "../utils/decodeToken";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import axios from "axios";
import serverConfig from "../servers.json";
import Alerts from "../components/Alerts";

function LogsPage() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const isAuthenticated = useAuth();
  const userRole = GetUserRoleFromToken();
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const backendServer = serverConfig["backend-server"];
  const [deletedOffers, setDeletedOffers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") navigate("/");
    // fetchDeletedOffers();
  }, [isAuthenticated, userRole, navigate]);

  const fetchLogs = useCallback(
    async (filename) => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendServer}/logs/${filename}`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setLogs(response.data);
      } catch (error) {
        console.log(error);
        setAlertOpen(true);
        setAlertMessage("Wystąpił błąd podczas ładowania logów.");
        setAlertSeverity("error");
      } finally {
        setLoading(false);
      }
    },
    [token, backendServer]
  );

  const handleLogClick = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const formattedDate = date.toISOString().split("T")[0]; // format YYYY-MM-DD
    const filename = `${formattedDate}-all.log`;
    fetchLogs(filename);
  };

  const fetchDeletedOffers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendServer}/listings/deleted`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setDeletedOffers(response.data);
    } catch (error) {
      console.error("Error fetching deleted offers:", error);
    } finally {
      setLoading(false);
    }
  }, [backendServer, token]);

  const handleRestoreOffer = async (offerId) => {
    try {
      await axios.post(
        `${backendServer}/listings/undelete/${offerId}`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeletedOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.id !== offerId)
      );
    } catch (error) {
      console.error("Error restoring offer:", error);
    }
  };

  const handleRestoreAll = async () => {
    try {
      const response = await axios.post(
        `${backendServer}/listings/undelete-all`,
        {},
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertOpen(true);
      setAlertMessage(response.data.message);
      setAlertSeverity("success");
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Wystąpił błąd podczas odzyskiwania ofert");
      setAlertSeverity("error");
    }
  };

  return (
    <div className="flex items-start justify-start h-screen ml-48 flex-col">
      <Sidebar />
      <Box sx={{ flexGrow: 1, marginLeft: "24px", width: "97%" }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: "16px",
            marginTop: "24px",
          }}
        >
          Panel Administratora
        </Typography>

        <div className="flex flex-row">
          <div className="ml-3 w-1/4">
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Usunięte oferty
              </Typography>
              {/* <Box sx={{ marginTop: 2, overflowX: "auto" }}>
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#FC8721" }} />
                ) : deletedOffers.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ulica</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell>Agent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deletedOffers.map((offer) => (
                        <TableRow key={offer.ulica}>
                          <TableCell>{offer.telefonWlasciciela}</TableCell>
                          <TableCell>{offer.agent}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => handleRestoreOffer(offer.id)}
                              // color="primary"
                            >
                              <RestoreIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography variant="body2">
                    Brak usuniętych ofert.
                  </Typography>
                )}
              </Box> */}
              <Button
                variant="contained"
                onClick={() => handleRestoreAll()}
                sx={{ marginTop: 2, backgroundColor: "#FC8721" }}
              >
                Przywróć oferty
              </Button>
            </Paper>
          </div>
          <div className="ml-3 w-3/4">
            <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Logi
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Array.from({ length: 8 }, (_, index) => {
                  const daysAgo = 7 - index;
                  const date = new Date();
                  date.setDate(date.getDate() - daysAgo);
                  const formattedDate = date.toISOString().split("T")[0];

                  return (
                    <Button
                      key={daysAgo}
                      variant="outlined"
                      onClick={() => handleLogClick(daysAgo)}
                      sx={{
                        textTransform: "none",
                        fontSize: "16px",
                        color: "#535968",
                        borderColor: "#535968",
                        "&:hover": {
                          borderColor: "#333",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      {daysAgo === 0
                        ? formattedDate + " (Dzisiaj)"
                        : daysAgo === 1
                        ? formattedDate + " (Wczoraj)"
                        : formattedDate}
                    </Button>
                  );
                })}
              </Box>
              <Box
                sx={{
                  marginTop: 3,
                  padding: 2,
                  maxHeight: 300,
                  overflowY: "auto",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#FC8721" }} />
                ) : (
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "Courier New, monospace",
                    }}
                  >
                    {logs || "Wybierz logi z listy powyżej."}
                  </Typography>
                )}
              </Box>
            </Paper>
          </div>
          <div className="ml-3 w-1/4">
            <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Zalogowani użytkownicy
              </Typography>
              {/* Zalogowani użytkownicy TODO */}
            </Paper>
          </div>
        </div>
      </Box>
      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </div>
  );
}

export default LogsPage;
