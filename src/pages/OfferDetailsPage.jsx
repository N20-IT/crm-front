import React, { useEffect, useState } from "react";
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
  const [statusesColor, setStatuesColor] = useState("");

  // const statusConfig = offer.statusOferty
  //   ? statusesConfig.find((element) => element.value === offer.statusOferty)
  //   : {};

  const navigate = useNavigate();
  const isAuthenticated = useAuth();

  const fetchDetailsData = async () => {
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

  const handleEditClick = () => {
    setEditOfferPanelOpen(true);
  };
  const handleCloseEditPanel = () => {
    setEditOfferPanelOpen(!isEditOfferPanelOpen);
  };

  useEffect(() => {
    fetchDetailsData();
    if (offer.statusOferty) {
      setStatuesColor(
        statusesConfig.find((status) => status.value === offer.statusOferty)
      );
    }
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate, offer.statusOferty, statusesColor]);
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
              <CustomTypography sx={{ marginTop: "6px", fontSize: "1rem" }}>
                <strong>Ulica:</strong> {offer.ulica}
                {offer.numerDomu ? ` ${offer.numerDomu}` : ""}
                {offer.numerMieszkania ? `/${offer.numerMieszkania}` : ""}
              </CustomTypography>
              <CustomTypography sx={{ fontSize: "1rem" }}>
                <strong>Miasto/Wieś:</strong> {offer.miasto}
              </CustomTypography>
              <CustomTypography sx={{ fontSize: "1rem" }}>
                <strong>Dzielnica/Gmina:</strong> {offer.dzielnica}
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
                <strong>Telefon właściciela: </strong>{" "}
                {offer.telefonWlasciciela}
              </CustomTypography>
              <CustomTypography sx={{ fontSize: "1rem" }}>
                <strong>Status oferty: </strong>

                <Box
                  component="span"
                  sx={{ color: statusesColor || "inherit" }}
                >
                  {offer?.statusOferty}
                </Box>
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
