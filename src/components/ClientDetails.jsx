import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  IconButton,
  Divider,
  Skeleton,
} from "@mui/material";

import axios from "axios";
import serverConfig from "../servers.json";
import { useReadCookie } from "../utils/auth";
import Alerts from "../components/Alerts";
import ClientAction from "./ClientAction";
import { useAuth } from "../utils/auth";
import CustomTypography from "./CustomTypography";
import { Close } from "@mui/icons-material";
import clientStatuesConfig from "../config/clientStatuesConfig";
import clientStandardConfig from "../config/clientStandardConfig";
import EditClientPanel from "./EditClientPanel";

function ClientDetails({
  id,
  onClose,
  handleSaveEditedClient,
  handleDeleteClientClick,
  users,
}) {
  const [client, setClient] = useState("");
  const backendServer = serverConfig["backend-server"];
  const token = useReadCookie();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuth();
  const [isEditClientPanelOpen, setIsEditClientPanelOpen] = useState(false);

  const formatPhoneNumber = (number) => {
    return String(number).replace(/(\d{3})(?=\d)/g, "$1 ");
  };

  const formatNumber = (value) =>
    value
      ? value.toLocaleString("pl-PL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

  const fetchDetailsData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/clients/${id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setClient(response.data);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  }, [backendServer, id, token]);

  const handleCloseEditPanel = () => {
    setIsEditClientPanelOpen(!isEditClientPanelOpen);
  };

  const handleEditClick = () => {
    setIsEditClientPanelOpen(true);
  };

  useEffect(() => {
    fetchDetailsData();
  }, [fetchDetailsData]);
  return (
    <div className="fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: "1.5rem",
              fontFamily: "Poppins",
            }}
          >
            Klient {client.daneKlienta}
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: "gray",
            }}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ marginBottom: "16px" }} />
        {loading ? (
          <Grid2>
            <Grid2
              sx={{ justifyContent: "center", alignItems: "center" }}
              xs={12}
              md={6}
              container
              spacing={2}
            >
              <Skeleton
                variant="rounded"
                height={150}
                width={300}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                height={150}
                width={300}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                height={150}
                width={300}
                animation="wave"
              />
              <Skeleton
                variant="rounded"
                height={150}
                width={300}
                animation="wave"
              />
            </Grid2>
          </Grid2>
        ) : (
          <Grid2 container spacing={10} flexWrap={"nowrap"}>
            <Grid2 xs={12} md={6}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "1.2rem",
                }}
              >
                Informacje o kliencie
              </Typography>
              {client.daneKlienta && (
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Imię i nazwisko:</strong> {client.daneKlienta}
                </CustomTypography>
              )}
              {client.numerTelefonu && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Numer telefonu:</strong>{" "}
                  {formatPhoneNumber(client.numerTelefonu)}
                </CustomTypography>
              )}
              {client.email && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Email:</strong> {client.email}
                </CustomTypography>
              )}
              {client.numerGalactica && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Numer Galactica:</strong> {client.numerGalactica}
                </CustomTypography>
              )}
              {client.status && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Status: </strong>
                  <Box
                    component="span"
                    sx={{
                      color:
                        clientStatuesConfig.find(
                          (status) => status.value === client.status
                        )?.color || "inherit",
                    }}
                  >
                    {client.status}
                  </Box>
                </CustomTypography>
              )}
              {client.standard && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Standard: </strong>
                  <Box
                    component="span"
                    sx={{
                      color:
                        clientStandardConfig.find(
                          (standard) => standard.value === client.standard
                        )?.color || "inherit",
                    }}
                  >
                    {client.standard}
                  </Box>
                </CustomTypography>
              )}
              {client.agent && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Agent:</strong> {client.agent}
                </CustomTypography>
              )}
              {client.lokalizacja && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Lokalizacja:</strong>{" "}
                  {client.lokalizacja.split(",").map((loc, index) => (
                    <span key={index}>
                      {loc.trim()}
                      {index < client.lokalizacja.split(",").length - 1
                        ? ", "
                        : ""}
                    </span>
                  ))}
                </CustomTypography>
              )}
              {client.rodzajNieruchomosci && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Rodzaj nieruchomości:</strong>{" "}
                  {client.rodzajNieruchomosci}
                </CustomTypography>
              )}
              {(client.iloscPokoiOd || client.iloscPokoiDo) && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Ilość pokoi:</strong>
                  {client.iloscPokoiOd && ` od ${client.iloscPokoiOd}`}
                  {client.iloscPokoiDo && ` do ${client.iloscPokoiDo}`}
                </CustomTypography>
              )}
              {(client.metrazOd || client.metrazDo) && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Metraż:</strong>
                  {client.metrazOd && ` od ${formatNumber(client.metrazOd)} m²`}
                  {client.metrazDo && ` do ${formatNumber(client.metrazDo)} m²`}
                </CustomTypography>
              )}
              {(client.budzetOd || client.budzetDo) && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Budżet:</strong>
                  {client.budzetOd && ` od ${formatNumber(client.budzetOd)} zł`}
                  {client.budzetDo && ` do ${formatNumber(client.budzetDo)} zł`}
                </CustomTypography>
              )}

              <br></br>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "1.2rem",
                }}
              >
                Informacje o kontakcie
              </Typography>
              {client.ostatniKontakt && (
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Ostatni kontakt:</strong>{" "}
                  {new Date(client.ostatniKontakt).toLocaleString("pl-PL", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CustomTypography>
              )}
              {client.dataNastepnegoKontaktu && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Data następnego kontaktu:</strong>{" "}
                  {new Date(client.dataNastepnegoKontaktu).toLocaleString(
                    "pl-PL",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </CustomTypography>
              )}
              {client.dataZapytania && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Data zapytania:</strong>{" "}
                  {new Date(client.dataZapytania).toLocaleString("pl-PL", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CustomTypography>
              )}
            </Grid2>
          </Grid2>
        )}
        <Box
          className="flex justify-end mt-6"
          sx={{
            "& .MuiTableCell-root": {
              border: 0,
            },
          }}
        >
          <ClientAction
            row={client}
            handleDeleteClientClick={handleDeleteClientClick}
            handleEditClientClick={handleEditClick}
            showDetailsIcon={false}
          />
        </Box>
        <Alerts
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
        {isEditClientPanelOpen && (
          <EditClientPanel
            initialData={client}
            onSave={handleSaveEditedClient}
            onCancel={handleCloseEditPanel}
            allUsers={users}
          />
        )}
      </div>
    </div>
  );
}

export default ClientDetails;
