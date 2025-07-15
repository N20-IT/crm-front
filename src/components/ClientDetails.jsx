import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  IconButton,
  Divider,
  Skeleton,
  ThemeProvider,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableCell,
  Tooltip,
  TableBody,
  TableRow,
} from "@mui/material";

import axios from "axios";
import serverConfig from "../servers.json";
import { useReadCookie } from "../utils/auth";
import Alerts from "../components/Alerts";
import ClientAction from "./ClientAction";
import { useAuth } from "../utils/auth";
import CustomTypography from "./CustomTypography";
import { Close, DoDisturbOn, Info } from "@mui/icons-material";
import clientStatuesConfig from "../config/clientStatuesConfig";
import clientStandardConfig from "../config/clientStandardConfig";
import EditClientPanel from "./EditClientPanel";
import { customTooltip } from "../styles/CustomTooltip";
import CustomTableCell from "./CustomTableCell";
import { GetInformationFromToken } from "../utils/decodeToken";
import { useReadConfig } from "../config/columnConfig";
import EditOfferPanel from "./EditOfferPanel";
import OfferDetailsFromClient from "./OfferDetailsFromClient";

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
  const [assignedOffersDetails, setAssignedOffersDetails] = useState([]);
  const formatPhoneNumber = (number) => {
    return String(number).replace(/(\d{3})(?=\d)/g, "$1 ");
  };
  const [isOfferDetailsPanelOpen, setIsOfferDetailsPanelOpen] = useState(false);
  const [offerDetailsId, setOfferDetailsId] = useState(null);
  const userRole = GetInformationFromToken("custom:role");
  const [readConfig, setReadConfig] = useState(useReadConfig());
  const [isEditOfferPanelOpen, setEditOfferPanelOpen] = useState(false);
  const [editOfferData, setEditOfferData] = useState(null);

  const formatNumber = (value) =>
    value
      ? value.toLocaleString("pl-PL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

  const fetchDetailsData = useCallback(async () => {
    setLoading(true);
    try {
      // Pobieramy dane klienta
      const clientResponse = await axios.get(`${backendServer}/clients/${id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const clientData = clientResponse.data;
      setClient(clientData);
      if (
        clientData.przypisaneOferty &&
        clientData.przypisaneOferty.length > 0
      ) {
        const offersPromises = clientData.przypisaneOferty.map((offerId) =>
          axios
            .get(`${backendServer}/listings/${offerId}`, {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => res.data)
            .catch((error) => {
              console.error(`Błąd przy pobieraniu oferty ${offerId}:`, error);
              return null;
            })
        );

        const offersData = await Promise.all(offersPromises);
        const validOffers = offersData.filter((offer) => offer !== null);

        setAssignedOffersDetails(validOffers);
      }
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
      console.error("Błąd podczas pobierania danych:", error);
    } finally {
      setLoading(false);
    }
  }, [backendServer, id, token]);

  const handleRemoveOfferFromClient = useCallback(
    async (clientId, offerIdToRemove) => {
      setLoading(true);
      try {
        const updatedAssignedOffers = client.przypisaneOferty.filter(
          (offerId) => offerId !== offerIdToRemove
        );

        const updatedData = { przypisaneOferty: updatedAssignedOffers };

        await axios.put(`${backendServer}/clients/${clientId}`, updatedData, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setAlertOpen(true);
        setAlertMessage("Usunięto ofertę pomyślnie");
        setAlertSeverity("success");

        fetchDetailsData();
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Błąd podczas usuwania oferty: " + error.message);
        setAlertSeverity("error");
      } finally {
        setLoading(false);
      }
    },
    [token, backendServer, client]
  );

  const handleSaveEditedOffer = useCallback(
    async (updatedOfferData) => {
      setLoading(true);
      try {
        await axios.put(
          `${backendServer}/listings/${updatedOfferData._id}`,
          updatedOfferData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAlertOpen(true);
        setAlertMessage("Zaktualizowano pomyślnie");
        setAlertSeverity("success");
        setEditOfferPanelOpen(false);
        if (isOfferDetailsPanelOpen)
          setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
        await fetchDetailsData();
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
        setAlertSeverity("error");
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, fetchDetailsData]
  );

  const handleCloseEditPanel = () => {
    setIsEditClientPanelOpen(!isEditClientPanelOpen);
  };

  const handleEditClick = () => {
    setIsEditClientPanelOpen(true);
  };

  const handleCloseOfferDetailsPanel = () => {
    setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
    setOfferDetailsId(null);
  };

  const handleOpenOfferDetailsPanel = (offerId) => {
    setOfferDetailsId(offerId);
    setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
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
        <br></br>
        {!loading ? (
          <div>
            <Typography
              variant="h6"
              sx={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: "1.2rem",
              }}
            >
              Przypisane oferty
            </Typography>
            <ThemeProvider theme={customTooltip}>
              <TableContainer
                className="ml-5"
                component={Paper}
                elevation={8}
                style={{
                  width: "99.4%",
                  alignSelf: "center",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  maxHeight: "88vh",
                  marginLeft: "0px",
                  marginTop: "6px",
                }}
              >
                <Table>
                  <TableHead
                    style={{
                      backgroundColor: "#272F3E",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <TableCell
                      key="ulica"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Poppins",
                        padding: "0px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Tooltip title="Ulica">Ulica</Tooltip>
                    </TableCell>
                    <TableCell
                      key="dzielnica"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Poppins",
                        padding: "0px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Tooltip title="Dzielnica">Dzielnica</Tooltip>
                    </TableCell>
                    <TableCell
                      key="metraz"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Poppins",
                        padding: "0px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Tooltip title="Metraż">Metraż</Tooltip>
                    </TableCell>
                    <TableCell
                      key="szczegoly"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Poppins",
                        padding: "0px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Tooltip title="Szczegóły oferty">
                        Szczegóły oferty
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="odstap_oferte"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Poppins",
                        padding: "0px",
                        paddingLeft: "15px",
                        paddingRight: "15px",
                      }}
                    >
                      <Tooltip title="Odstąp ofertę">Odstąp ofertę</Tooltip>
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {Array.isArray(assignedOffersDetails) &&
                    client.przypisaneOferty.length > 0 ? (
                      assignedOffersDetails.map((row, index) => (
                        <TableRow
                          key={row._id}
                          style={{
                            "& .MuiTableRowRoot": {
                              maxHeight: "60px",
                            },
                            width: "100%",
                            background:
                              row.noweOfertyLiczba > 0
                                ? "#E6FFD7"
                                : index % 2 === 1
                                ? "#f5f5f5"
                                : "white",
                          }}
                        >
                          <CustomTableCell>
                            <strong>{row.ulica || ""}</strong>
                          </CustomTableCell>
                          <CustomTableCell>
                            <strong>{row.dzielnica || ""}</strong>
                          </CustomTableCell>
                          <CustomTableCell>
                            <strong>{formatNumber(row.metraz) || ""}</strong>
                          </CustomTableCell>
                          <CustomTableCell>
                            <Tooltip title="Zobacz szczegóły">
                              <IconButton
                                onClick={() =>
                                  handleOpenOfferDetailsPanel(row._id)
                                }
                              >
                                <Info />
                              </IconButton>
                            </Tooltip>
                          </CustomTableCell>
                          <CustomTableCell>
                            <Tooltip title="Odstąp ofertę">
                              <IconButton
                                onClick={() =>
                                  handleRemoveOfferFromClient(
                                    client._id,
                                    row._id
                                  )
                                }
                                sx={{
                                  color: "#A11D1D",
                                }}
                              >
                                <DoDisturbOn />
                              </IconButton>
                            </Tooltip>
                          </CustomTableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          style={{ textAlign: "center", width: "100%" }}
                        >
                          Brak danych do wyświetlenia
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </ThemeProvider>
          </div>
        ) : (
          <div></div>
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
        {isEditOfferPanelOpen && (
          <EditOfferPanel
            offerData={editOfferData}
            onSave={handleSaveEditedOffer}
            onCancel={() => setEditOfferPanelOpen(false)}
            users={users}
          />
        )}
        {isOfferDetailsPanelOpen && (
          <OfferDetailsFromClient
            id={offerDetailsId}
            onClose={handleCloseOfferDetailsPanel}
            userRole={userRole}
            readConfig={readConfig}
            handleSaveEditedOffer={handleSaveEditedOffer}
          />
        )}
      </div>
    </div>
  );
}

export default ClientDetails;
