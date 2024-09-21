import React, { useEffect } from "react";
import { Container, Typography, Box, Grid2, Paper } from "@mui/material";
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
    <div className="flex flex-col items-start justify-start h-screen ml-48">
      <Sidebar />
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", fontFamily: "Poppins" }}
        >
          Szczegóły oferty nr {offer.nrOferty}
        </Typography>

        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ fontFamily: "Poppins" }}>
            Podstawowe informacje
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 item xs={18}>
              <CustomTypography>
                <strong>Agent:</strong> {offer.agent}
              </CustomTypography>
              <CustomTypography>
                <strong>Metraż:</strong> {offer.metraz} m²
              </CustomTypography>
              <CustomTypography>
                <strong>Cena:</strong> {offer.cena} PLN
              </CustomTypography>
              <CustomTypography>
                <strong>Stan:</strong> {offer.statusOferty}
              </CustomTypography>
            </Grid2>
            <Grid2 item xs={12}>
              <CustomTypography>
                <strong>Liczba pokoi:</strong> {offer.iloscPokoi}
              </CustomTypography>
              <CustomTypography>
                <strong>Cena za m²:</strong> {offer.zlM2} PLN
              </CustomTypography>
              <CustomTypography>
                <strong>Telefon właściciela:</strong> {offer.telefonWlasciciela}
              </CustomTypography>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </div>
  );
}

export default OfferDetailsPage;
