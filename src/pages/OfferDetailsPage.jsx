import React, { useEffect } from "react";
import {
  Box,
  Grid2,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Divider,
  Container,
} from "@mui/material";
import {
  Delete,
  Edit,
  Star,
  CalendarMonth,
  Map,
  AssignmentInd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import CustomTypography from "../components/CustomTypography";

//TODO
function OfferDetailsPage() {
  const offer = {
    _id: "66e9c9657ae54924278395be",
    dataUtworzenia: "2024-09-17T18:24:28.802Z",
    dataModyfikacji: "2024-09-17T18:24:37.289Z",
    agent: "Wiktoria Grawska",
    iloscPokoi: 0,
    adres: {
      ulica: "string",
      numerDomu: "string",
      numerMieszkania: "string",
      miasto: "string",
      dzielnica: "string",
      _id: "66e9c9657ae54924278395bf",
    },
    metraz: 167,
    cena: 1890000,
    telefonWlasciciela: "string",
    statusOferty: "string",
    uwagi: "string",
    zlM2: 11317.365269461077,
    dataZakonczenia: "2024-09-17T18:24:28.802Z",
    dataKontaktu: "2024-09-17T18:24:28.802Z",
    dataNastepnegoKontaktu: "2024-09-17T18:24:28.802Z",
    komentarz: "string",
    nrOferty: "string",
    __v: 0,
  };
  const handleEditOffer = () => {
    //TODO
  };

  const handleDeleteOffer = () => {
    //TODO
  };

  const handleBackToOffers = () => {
    //TODO
  };
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  useEffect(() => {
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
          height: "100%",
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

          <Grid2 container spacing={3}>
            <Grid2 item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Poppins", fontWeight: 600 }}
              >
                Informacje o nieruchomości
              </Typography>
              <CustomTypography sx={{ marginTop: "8px" }}>
                <strong>Ulica:</strong> {offer.adres.ulica}
                {offer.adres.numerDomu}/{offer.adres.numerMieszkania}
              </CustomTypography>
              <CustomTypography>
                <strong>Miasto:</strong> {offer.adres.miasto}
              </CustomTypography>
              <CustomTypography>
                <strong>Dzielnica:</strong> {offer.adres.dzielnica}
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

            <Grid2 item xs={12} md={6}>
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
            <Grid2 item xs={12} md={6}>
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
            <Grid2 item xs={12} md={6}>
              <Typography
                variant="h5"
                sx={{ fontFamily: "Poppins", fontWeight: 600 }}
              >
                Daty kontaktu i zakończenia
              </Typography>
              <CustomTypography sx={{ marginTop: "8px" }}>
                <strong>Data kontaktu:</strong>{" "}
                {new Date(offer.dataKontaktu).toLocaleDateString()}
              </CustomTypography>
              <CustomTypography>
                <strong>Data zakończenia:</strong>{" "}
                {new Date(offer.dataZakonczenia).toLocaleDateString()}
              </CustomTypography>
            </Grid2>
          </Grid2>
          <Box className="flex justify-end mt-6">
            <Tooltip title="Usuń">
              <IconButton>
                <Delete sx={{ fontSize: "30px", color: "#535968" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edytuj">
              <IconButton>
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
    </div>
  );
}

export default OfferDetailsPage;
