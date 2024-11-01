import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { GetUserRoleFromToken } from "../utils/decodeToken";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import axios from "axios";
import serverConfig from "../servers.json";

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

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") navigate("/");
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
        setLogs(response.data); // Upewnij się, że odpowiedź to tekst logów
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

  return (
    <div className="flex items-start justify-start h-screen ml-48 flex-col">
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <h1 className="font-bold text-5xl">Panel administratora</h1>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box sx={{ border: "1px solid #ccc", padding: 2 }}>
              <h2>Akcje</h2>
              {/* elementy akcji - przywracanie danych ofert */}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ border: "1px solid #ccc", padding: 2 }}>
              <h2>Logi</h2>
              {Array.from({ length: 8 }, (_, index) => {
                const daysAgo = 7 - index;
                const date = new Date();
                date.setDate(date.getDate() - daysAgo);
                const formattedDate = date.toISOString().split("T")[0];

                return (
                  <IconButton
                    key={daysAgo}
                    onClick={() => handleLogClick(daysAgo)}
                  >
                    {daysAgo === 0
                      ? formattedDate + " (Dzisiaj)"
                      : daysAgo === 1
                      ? formattedDate + " (Wczoraj)"
                      : formattedDate}
                  </IconButton>
                );
              })}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2" component="pre">
                  {loading ? "Ładowanie..." : logs}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ border: "1px solid #ccc", padding: 2 }}>
              <h2>Dziennik Aktywności</h2>
              {/* dziennik aktywności TODO */}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default LogsPage;
