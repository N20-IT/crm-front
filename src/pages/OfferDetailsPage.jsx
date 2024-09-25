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
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
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
          height: "70%",
          padding: "16px",
        }}
      >
        <Paper elevation={8} className="p-6">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              marginBottom: "16px",
              fontFamily: "Poppins",
            }}
          >
            Oferta nr {offer.nrOferty}
          </Typography>
          <Divider sx={{ marginBottom: "24px" }} />
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
                  variant="h5"
                  sx={{ fontFamily: "Poppins", fontWeight: 600 }}
                >
                  Informacje o nieruchomości
                </Typography>
                <CustomTypography sx={{ marginTop: "8px" }}>
                  <strong>Ulica:</strong> {offer.adres ? offer.adres.ulica : ""}
                  {offer.adres
                    ? `${offer.adres.numerDomu}/${offer.adres.numerMieszkania}`
                    : ""}
                </CustomTypography>
                <CustomTypography>
                  <strong>Miasto:</strong>{" "}
                  {offer.adres ? offer.adres.miasto : ""}
                </CustomTypography>
                <CustomTypography>
                  <strong>Dzielnica:</strong>{" "}
                  {offer.adres ? offer.adres.dzielnica : ""}
                </CustomTypography>
                <CustomTypography>
                  <strong>Ilość pokoi:</strong> {offer.iloscPokoi}
                </CustomTypography>
                <CustomTypography>
                  <strong>Metraż:</strong> {offer.metraz} m²
                </CustomTypography>
                <CustomTypography>
                  <strong>Cena:</strong> {offer.cena} zł
                </CustomTypography>
              </Grid2>

              <Grid2 xs={12} md={6}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Poppins", fontWeight: 600 }}
                >
                  Agent odpowiedzialny
                </Typography>
                <CustomTypography sx={{ marginTop: "8px" }}>
                  <strong>Agent:</strong> {offer.agent}
                </CustomTypography>
              </Grid2>
              <Grid2 xs={12} md={6}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Poppins", fontWeight: 600 }}
                >
                  Dodatkowe informacje
                </Typography>
                <CustomTypography sx={{ marginTop: "8px" }}>
                  <strong>Telefon właściciela:</strong>
                  {offer.telefonWlasciciela}
                </CustomTypography>
                <CustomTypography>
                  <strong>Status oferty:</strong> {offer.statusOferty}
                </CustomTypography>
                <CustomTypography>
                  <strong>Uwagi:</strong> {offer.uwagi}
                </CustomTypography>
                <CustomTypography>
                  <strong>Zł/m²:</strong> {offer.zlM2}
                </CustomTypography>
              </Grid2>
              <Grid2 xs={12} md={6}>
                <Typography
                  variant="h5"
                  sx={{ fontFamily: "Poppins", fontWeight: 600 }}
                >
                  Daty kontaktu i zakończenia
                </Typography>
                <CustomTypography sx={{ marginTop: "8px" }}>
                  <strong>Data kontaktu:</strong>
                  {offer.dataKontraktu
                    ? new Date(offer.dataKontaktu).toLocaleDateString()
                    : "Brak danych"}
                </CustomTypography>
                <CustomTypography>
                  <strong>Data zakończenia:</strong>
                  {offer.dataZakonczenia
                    ? new Date(offer.dataZakonczenia).toLocaleDateString()
                    : "Brak danych"}
                </CustomTypography>
              </Grid2>
            </Grid2>
          )}
          <Box className="flex justify-end mt-6">
            <Tooltip title="Usuń">
              <IconButton onClick={handleDeleteOfferClick}>
                <Delete sx={{ fontSize: "30px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edytuj">
              <IconButton onClick={handleEditOffer}>
                <Edit sx={{ fontSize: "30px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dodaj do ciekawych ofert">
              <IconButton>
                <Star sx={{ fontSize: "30px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dodaj do kalendarza">
              <IconButton>
                <CalendarMonth sx={{ fontSize: "30px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pokaż na mapie">
              <IconButton>
                <Map sx={{ fontSize: "30px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Przypisz ofertę">
              <IconButton>
                <AssignmentInd sx={{ fontSize: "30px", color: "#535968" }} />
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
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={handleOpenCloseDialog}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default OfferDetailsPage;
