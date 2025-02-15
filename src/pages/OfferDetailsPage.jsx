import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid2,
  Typography,
  IconButton,
  Divider,
  Skeleton,
  Link,
  Tooltip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import axios from "axios";
import CustomTypography from "../components/CustomTypography";
import Alerts from "../components/Alerts";
import { useReadCookie } from "../utils/auth";
import EditOfferPanel from "../components/EditOfferPanel";
import serverConfig from "../servers.json";
import OfferActions from "../components/OfferAction";
import statusesConfig from "../config/statusesConfig";

function OfferDetailsPage({
  id,
  onClose,
  userRole,
  readConfig,
  handleSaveEditedOffer,
  handleDeleteOfferClick,
  handleAddToCalendar,
  handleUpdateOfferAgentClick,
  users,
}) {
  const [offer, setOffer] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditOfferPanelOpen, setEditOfferPanelOpen] = useState(false);
  const token = useReadCookie();
  const backendServer = serverConfig["backend-server"];
  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  const fetchDetailsData = useCallback(async () => {
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
  }, [backendServer, id, token]);

  const handleEditClick = () => {
    setEditOfferPanelOpen(true);
  };
  const handleCloseEditPanel = () => {
    setEditOfferPanelOpen(!isEditOfferPanelOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    else fetchDetailsData();
  }, [isAuthenticated, navigate, fetchDetailsData]);
  return (
    <div className=" fixed inset-0 bg-light-grey bg-opacity-75 flex items-center justify-center z-50">
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
            Oferta {offer.nrOferty !== null ? "" : "nr " + offer.nrOferty}
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
              {offer.ulica && (
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Ulica:</strong> {offer.ulica}
                </CustomTypography>
              )}
              {offer.miasto && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Miasto/Wieś:</strong> {offer.miasto}
                </CustomTypography>
              )}
              {offer.dzielnica && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Dzielnica/Gmina:</strong> {offer.dzielnica}
                </CustomTypography>
              )}
              {offer.poddzielnica && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Poddzielnica:</strong> {offer.poddzielnica}
                </CustomTypography>
              )}
              {offer.typInwestycji && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Typ inwestycji:</strong> {offer.typInwestycji}
                </CustomTypography>
              )}
              {offer.rynek && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Rynek:</strong> {offer.rynek}
                </CustomTypography>
              )}
              {offer.iloscPokoi && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Ilość pokoi:</strong> {offer.iloscPokoi}
                </CustomTypography>
              )}
              {offer.metraz && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Metraż:</strong> {offer.metraz} m²
                </CustomTypography>
              )}
              {offer.powDzialki && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Powierzchnia działki:</strong> {offer.powDzialki}
                </CustomTypography>
              )}
              {offer.cena && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Cena:</strong> {offer.cena} zł
                </CustomTypography>
              )}
              {offer.linkOferta && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Link do oferty:</strong>{" "}
                  <Tooltip title={offer.linkOferta}>
                    <Link
                      href={offer.linkOferta}
                      target="_blank"
                      style={{ color: "#FC8721", textDecoration: "underline" }}
                    >
                      Zobacz szczegóły
                    </Link>
                  </Tooltip>
                </CustomTypography>
              )}

              <br></br>
              {offer.agent && (
                <>
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
                </>
              )}

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
              {offer.telefonWlasciciela && (
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Telefon właściciela: </strong>{" "}
                  {offer.telefonWlasciciela}
                </CustomTypography>
              )}
              {offer.statusOferty && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Status oferty: </strong>

                  <Box
                    component="span"
                    sx={{
                      color: offer.statusOferty
                        ? statusesConfig.find(
                            (status) => status.value === offer.statusOferty
                          ).color
                        : "inherit",
                    }}
                  >
                    {offer?.statusOferty}
                  </Box>
                </CustomTypography>
              )}
              {offer.komentarz && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Komentarz:</strong> {offer.komentarz}
                </CustomTypography>
              )}
              {offer.zlM2 && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Zł/m²:</strong> {offer.zlM2}
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
                Informacje sytemowe
              </Typography>
              {offer.dataKontaktu && (
                <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                  <strong>Data kontaktu:</strong>{" "}
                  {new Date(offer.dataKontaktu).toLocaleString("pl-PL", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CustomTypography>
              )}
              {offer.dataNastepnegoKontaktu && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Data następnego kontaktu:</strong>{" "}
                  {new Date(offer.dataNastepnegoKontaktu).toLocaleString(
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
              <CustomTypography sx={{ fontSize: "1rem" }}>
                <strong>Utworzono:</strong>{" "}
                {offer.dataUtworzenia
                  ? `${new Date(offer.dataUtworzenia).toLocaleString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} przez ${offer.tworca}`
                  : "Brak danych"}
              </CustomTypography>

              {offer.edytor && offer.dataModyfikacji && (
                <CustomTypography sx={{ fontSize: "1rem" }}>
                  <strong>Zmodyfikowano:</strong>{" "}
                  {`${new Date(offer.dataModyfikacji).toLocaleString("pl-PL", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })} przez ${offer.edytor}`}
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
          <OfferActions
            row={offer}
            userRole={userRole}
            readConfig={readConfig}
            handleDeleteOfferClick={handleDeleteOfferClick}
            handleEditClick={handleEditClick}
            handleAddToCalendar={(e) => handleAddToCalendar(offer)}
            handleUpdateOfferAgentClick={handleUpdateOfferAgentClick}
            showDetailsIcon={false}
          />
        </Box>
        <Alerts
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
        {isEditOfferPanelOpen && (
          <EditOfferPanel
            offerData={offer}
            onSave={handleSaveEditedOffer}
            onCancel={handleCloseEditPanel}
            users={users}
          />
        )}
      </div>
    </div>
  );
}

export default OfferDetailsPage;
