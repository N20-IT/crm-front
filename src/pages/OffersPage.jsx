import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import axios from "axios";
import qs from "qs";
import Sidebar from "../components/Sidebar";
import TableControls from "../components/TableControls";
import Alerts from "../components/Alerts";
import AddOfferPanel from "../components/AddOfferPanel";
import ConfirmDialog from "../components/ConfirmDialog";
import EditOfferPanel from "../components/EditOfferPanel";
import serverConfig from "../servers.json";
import { GetEmailFromToken, GetUserRoleFromToken } from "../utils/decodeToken";
import { useReadConfig } from "../config/columnConfig";
import OffersTable from "../components/OffersTable";
import columnsOffersConfig from "../config/columnsOffersConfig";

function OffersPage() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const isAuthenticated = useAuth();
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAddOfferPanelOpen, setAddOfferPanelOpen] = useState(false);
  const [openDialogDelete, setopenDialogDelete] = useState(false);
  const [
    openDialogConfirmOfferAssignment,
    setOpenDialogConfirmOfferAssignment,
  ] = useState(false);
  const [offerIdToDelete, setOfferIdToDelete] = useState(null);
  const [offerIdToUpdateAgent, setOfferIdToUpdateAgent] = useState(null);
  const [isEditOfferPanelOpen, setEditOfferPanelOpen] = useState(false);
  const [editOfferData, setEditOfferData] = useState(null);
  const backendServer = serverConfig["backend-server"];
  const [searchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const email = GetEmailFromToken();
  const userRole = GetUserRoleFromToken();
  const [readConfig, setReadConfig] = useState(useReadConfig());

  const columns = useMemo(() => columnsOffersConfig, []);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/list-users`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = JSON.parse(response.data.body);
      const agents = usersList.map((user) => user.Name + " " + user.FamilyName);
      setUsers(agents);
    } catch (error) {
      console.log(error);
    }
  }, [token, backendServer]);

  const fetchData = useCallback(
    async (searchQuery = "", filters = {}, columnConfig = readConfig) => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendServer}/listings`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            columnConfig: columnConfig,
          },
          params: {
            search: searchQuery,
            ...filters,
          },
          paramsSerializer: (params) => {
            const serializedParams = {
              ...params,
              dzielnica: params.dzielnica
                ? params.dzielnica.join(",")
                : undefined,
              poddzielnica: params.poddzielnica
                ? params.poddzielnica.join(",")
                : undefined,
            };
            return qs.stringify(serializedParams, { arrayFormat: "repeat" });
          },
        });
        setRows(response.data);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, readConfig]
  );

  const handleSaveOffer = async (offerData) => {
    try {
      await axios.post(`${backendServer}/listings`, offerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleAddOfferClick();
      await fetchData();
      setAlertOpen(true);
      setAlertMessage("Dodano ofertę pomyślnie");
      setAlertSeverity("success");
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      const response = await axios.delete(`${backendServer}/listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids: offerId },
      });
      setAlertOpen(true);
      setAlertMessage(response.data.message);
      setAlertSeverity("success");
      await fetchData();
      setSelected([]);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleSaveEditedOffer = async (updatedOfferData) => {
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
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleConfirmOfferAssignment = async () => {
    try {
      const updatedData = { agent: email };
      await axios.put(
        `${backendServer}/listings/${offerIdToUpdateAgent}`,
        updatedData,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertOpen(true);
      setAlertMessage("Pomyślnie zaktualizowano ofertę");
      setAlertSeverity("success");
      setOpenDialogConfirmOfferAssignment(false);
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleGoToOfferDetailsPage = (offerId) => {
    navigate(`/oferta/${offerId}`);
  };

  const handleAddOfferClick = () => {
    setAddOfferPanelOpen(!isAddOfferPanelOpen);
  };

  const handleConfirmDelete = async () => {
    if (offerIdToDelete) {
      await handleDeleteOffer(offerIdToDelete);
      setOfferIdToDelete(null);
    }
    setopenDialogDelete(false);
  };

  const handleDeleteOfferClick = (offerId) => {
    setOfferIdToDelete(offerId);
    setopenDialogDelete(true);
  };

  const handleUpdateOfferAgentClick = (offerId) => {
    setOfferIdToUpdateAgent(offerId);
    handleOpenCloseDialogConfirmOfferAssignment(true);
  };

  const handleOpenCloseDialog = () => setopenDialogDelete(!openDialogDelete);
  const handleOpenCloseDialogConfirmOfferAssignment = () =>
    setOpenDialogConfirmOfferAssignment(!openDialogConfirmOfferAssignment);

  const handleEditClick = (offer) => {
    setEditOfferData(offer);
    setEditOfferPanelOpen(true);
  };

  const handleDeleteMiltipleOffers = () => {
    if (selected.length > 0) {
      setOfferIdToDelete(selected);
      setopenDialogDelete(true);
    }
  };

  const handleSearchAndFilter = (searchQuery, filters, columnConfig) => {
    setReadConfig(columnConfig);
    fetchData(searchQuery, filters, columnConfig);
  };

  const handleAddToCalendar = (row) => {
    const eventTitle = "Spotkanie";
    const eventDescription = row.linkOferta;

    const startDate = new Date(row.dataNastepnegoKontaktu);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const formatDateForCalendar = (date) =>
      date
        .toISOString()
        .replace(/[-:.]/g, "")
        .slice(0, 15) + "Z";

    const formattedStartDate = formatDateForCalendar(startDate);
    const formattedEndDate = formatDateForCalendar(endDate);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${formattedStartDate}/${formattedEndDate}&details=${encodeURIComponent(
      eventDescription
    )}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    userRole === "admin" ? fetchAgents() : setUsers([email]);
    fetchData(searchQuery);
  }, [isAuthenticated, navigate, searchQuery, fetchAgents, email, userRole]);

  return (
    <div>
      <div className=" flex items-start justify-start h-screen ml-48 flex-col">
        <Sidebar />
        <h1 className=" font-bold text-5xl font-poppins ml-6 mt-6 mb-4">
          Oferty
        </h1>
        <div className="flex justify-center w-full">
          <TableControls
            selectedCount={selected.length}
            onAddOfferClick={handleAddOfferClick}
            deleteMultipleOffersClick={handleDeleteMiltipleOffers}
            onSearchChange={handleSearchAndFilter}
            onFilterApply={handleSearchAndFilter}
            users={users}
          />
        </div>
        <OffersTable
          rows={rows}
          columns={columns}
          selected={selected}
          setSelected={setSelected}
          readConfig={readConfig}
          loading={loading}
          userRole={userRole}
          handleDeleteOfferClick={handleDeleteOfferClick}
          handleEditClick={handleEditClick}
          handleAddToCalendar={handleAddToCalendar}
          handleUpdateOfferAgentClick={handleUpdateOfferAgentClick}
          handleGoToOfferDetailsPage={handleGoToOfferDetailsPage}
        />
        <Alerts
          message={alertMessage}
          severity={alertSeverity}
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
        />
        {isAddOfferPanelOpen && (
          <AddOfferPanel
            onSave={handleSaveOffer}
            onCancel={handleAddOfferClick}
            users={users}
          />
        )}
        <ConfirmDialog
          open={openDialogDelete}
          onClose={handleOpenCloseDialog}
          onConfirm={handleConfirmDelete}
          dialogTitle={"Potwierdzenie usunięcia"}
          dialogContent={
            "Czy na pewno chcesz usunąć? Ta operacja jest nieodwracalna."
          }
          buttonText={"Usuń"}
          buttonColor={"error"}
        />
        <ConfirmDialog
          open={openDialogConfirmOfferAssignment}
          onClose={handleOpenCloseDialogConfirmOfferAssignment}
          onConfirm={handleConfirmOfferAssignment}
          dialogTitle={"Potwierdzenie przypisania oferty"}
          dialogContent={"Czy na pewno chcesz przypisać sobie ofertę?"}
          buttonText={"Potwierdź"}
          buttonColor={"warning"}
        />
        {isEditOfferPanelOpen && (
          <EditOfferPanel
            offerData={editOfferData}
            onSave={handleSaveEditedOffer}
            onCancel={() => setEditOfferPanelOpen(false)}
            users={users}
          />
        )}
      </div>
    </div>
  );
}

export default OffersPage;
