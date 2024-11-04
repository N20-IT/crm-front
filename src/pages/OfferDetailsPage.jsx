import React, { useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  Delete,
  Edit,
  Star,
  CalendarMonth,
  Map,
  AssignmentInd,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/auth";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import CustomTypography from "../components/CustomTypography";
import Alerts from "../components/Alerts";
import { useReadCookie } from "../utils/auth";
import ConfirmDialog from "../components/ConfirmDialog";
import EditOfferPanel from "../components/EditOfferPanel";
import serverConfig from "../servers.json";

function OfferDetailsPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditOfferPanelOpen, setEditOfferPanelOpen] = useState(false);
  const token = useReadCookie();
  const backendServer = serverConfig["backend-server"];

  const handleEditOffer = () => {
    console.log(offer);
  };

  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${backendServer}/listings/${id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setOffer(response.data);
      console.log(response.data);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async () => {
    try {
      const response = await axios.delete(`${backendServer}/listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids: [offer._id] },
      });
      setAlertOpen(true);
      setAlertMessage(response.data.message);
      setAlertSeverity("success");
      navigate("/oferty");
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleConfirmDelete = async () => {
    await handleDeleteOffer();
  };
  const handleDeleteOfferClick = () => {
    setOpenDialog(true);
  };
  const handleOpenCloseDialog = () => setOpenDialog(!openDialog);

  const handleEditClick = () => {
    setEditOfferPanelOpen(true);
  };

  useEffect(() => {
    fetchData();
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);
  return (
    <div className="flex flex-col items-center h-screen ml-48">
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          padding: "16px",
        }}
      >
        <Paper elevation={8} className="p-6">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              marginBottom: "12px",
              fontSize: "1.5rem",
              fontFamily: "Poppins",
            }}
          >
            Oferta {offer.nrOferty !== null ? "" : "nr " + offer.nrOferty}
          </Typography>
          <Divider sx={{ marginBottom: "16px" }} />
          {loading ? (
            <Grid2 container spacing={10} flexWrap={"nowrap"}>
              <Grid2 xs={12} md={6}>
                <Skeleton
                  variant="rounded"
                  height={238}
                  width={300}
                  animation="wave"
                />
              </Grid2>

              <Grid2 xs={12} md={6}>
                <Skeleton
                  variant="rounded"
                  height={238}
                  width={300}
                  animation="wave"
                />
              </Grid2>

              <Grid2 xs={12} md={6}>
                <Skeleton
                  variant="rounded"
                  height={238}
                  width={300}
                  animation="wave"
                />
              </Grid2>

              <Grid2 xs={12} md={6}>
                <Skeleton
                  variant="rounded"
                  height={238}
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
                  Informacje o nieruchomości
                </Typography>
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Ulica:</strong> {offer.adres?.ulica}
                  {offer.adres?.numerDomu ? ` ${offer.adres.numerDomu}` : ""}
                  {offer.adres?.numerMieszkania
                    ? `/${offer.adres.numerMieszkania}`
                    : ""}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Miasto/Wieś:</strong> {offer.adres?.miasto}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Dzielnica/Gmina:</strong> {offer.adres?.dzielnica}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Ilość pokoi:</strong> {offer.iloscPokoi}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Metraż:</strong> {offer.metraz} m²
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Cena:</strong> {offer.cena} zł
                </CustomTypography>
                <br></br>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontSize: "1.2rem",
                  }}
                >
                  Agent odpowiedzialny
                </Typography>
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Agent:</strong> {offer.agent}
                </CustomTypography>
                <br></br>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontSize: "1.2rem",
                  }}
                >
                  Dodatkowe informacje
                </Typography>
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Telefon właściciela:</strong>{" "}
                  {offer.telefonWlasciciela}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Status oferty:</strong> {offer.statusOferty}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Komentarz:</strong> {offer.komentarz}
                </CustomTypography>
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Zł/m²:</strong> {offer.zlM2}
                </CustomTypography>
                <br></br>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontSize: "1.2rem",
                  }}
                >
                  Informacje sytemowe
                </Typography>
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Utworzono:</strong>{" "}
                  {offer.dataUtworzenia
                    ? `${new Date(
                        offer.dataUtworzenia
                      ).toLocaleDateString()} przez ${offer.tworca}`
                    : "Brak danych"}
                </CustomTypography>

                {offer.edytor && offer.dataModyfikacji && (
                  <CustomTypography sx={{ fontSize: "1rem" }}>
                    <strong>Zmodyfikowano:</strong>{" "}
                    {`${new Date(
                      offer.dataModyfikacji
                    ).toLocaleDateString()} przez ${offer.edytor}`}
                  </CustomTypography>
                )}
              </Grid2>
            </Grid2>
          )}
          <Box className="flex justify-end mt-6">
            <Tooltip title="Usuń">
              <IconButton onClick={handleDeleteOfferClick}>
                <Delete sx={{ fontSize: "24px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edytuj">
              <IconButton onClick={handleEditOffer}>
                <Edit sx={{ fontSize: "24px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dodaj do ciekawych ofert">
              <IconButton>
                <Star sx={{ fontSize: "24px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dodaj do kalendarza">
              <IconButton>
                <CalendarMonth sx={{ fontSize: "24px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pokaż na mapie">
              <IconButton
                onClick={() => {
                  const { ulica, miasto } = offer.adres;
                  const location = `${miasto}, ${ulica}`;
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    location
                  )}`;
                  window.open(googleMapsUrl, "_blank");
                }}
              >
                <Map sx={{ fontSize: "24px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Przypisz ofertę">
              <IconButton>
                <AssignmentInd sx={{ fontSize: "24px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Box>
      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
      <ConfirmDialog
        open={openDialog}
        onClose={handleOpenCloseDialog}
        onConfirm={handleConfirmDelete}
        dialogTitle={"Potwierdzenie usunięcia"}
        dialogContent={
          "Czy na pewno chcesz usunąć? Ta operacja jest nieodwracalna."
        }
        buttonText={"Usuń"}
        buttonColor={"error"}
      />
    </div>
  );
}

export default OfferDetailsPage;
