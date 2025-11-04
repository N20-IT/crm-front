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
import { GetInformationFromToken } from "../utils/decodeToken";
import { useReadConfig } from "../config/columnConfig";
import OffersTable from "../components/OffersTable";
import OfferDetailsPage from "./OfferDetailsPage";
import columnsOffersConfig from "../config/columnsOffersConfig";
import LoadingCircularProgress from "../components/LoadingCircularProgress";
import { useParams } from "react-router-dom";
import { useFiltersStore } from "../store/filtersStore";

function OffersPage() {
  const { id } = useParams();
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
  const [
    openDialogChangeOfferInterest,
    setOpenDialogChangeOfferInterest,
  ] = useState(false);
  const [
    openDialogAssignmentOfferToClient,
    setOpenDialogAssignmentOfferToClient,
  ] = useState(false);
  const [clientIdToAssign, setClientIdToAssign] = useState(null);
  const [offerIdToAssign, setOfferIdToAssign] = useState(null);
  const [offerIdToDelete, setOfferIdToDelete] = useState(null);
  const [offerIdToUpdateAgent, setOfferIdToUpdateAgent] = useState(null);
  const [offerToChangeOfferInterest, setOfferToChangeOfferInterest] = useState(
    null
  );
  const [isEditOfferPanelOpen, setEditOfferPanelOpen] = useState(false);
  const [isOfferDetailsPanelOpen, setIsOfferDetailsPanelOpen] = useState(false);
  const [offerDetailsId, setOfferDetailsId] = useState(null);
  const [editOfferData, setEditOfferData] = useState(null);
  const backendServer = serverConfig["backend-server"];
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const userInformation =
    GetInformationFromToken("name") +
    " " +
    GetInformationFromToken("family_name");
  const userRole = GetInformationFromToken("custom:role");
  const [readConfig, setReadConfig] = useState(useReadConfig());
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const { filters, updateFilter, setFilters, clearFilters } = useFiltersStore();

  const [searchValue, setSearchValue] = useState("");
  const [quantityOffers, setQuantityOffers] = useState(0);
  const [orderBy, setOrderBy] = useState("dataUtworzenia");
  const [order, setOrder] = useState("desc");
  const [clients, setClients] = useState([]);
  const columns = useMemo(() => columnsOffersConfig, []);

  const handleOpenOfferDetailsPanel = (offerId) => {
    setOfferDetailsId(offerId);
    setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
  };

  const handleCloseOfferDetailsPanel = () => {
    setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
    setOfferDetailsId(null);
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

  const handleChangeOfferInterestClick = (offer) => {
    setOfferToChangeOfferInterest(offer);
    handleOpenCloseDialogChangeOfferInterest(true);
  };

  const handleOpenCloseDialog = () => setopenDialogDelete(!openDialogDelete);
  const handleOpenCloseDialogChangeOfferInterest = () =>
    setOpenDialogChangeOfferInterest(!openDialogChangeOfferInterest);
  const handleOpenCloseDialogConfirmOfferAssignment = () =>
    setOpenDialogConfirmOfferAssignment(!openDialogConfirmOfferAssignment);

  const handleOpenCloseDialogAssignmentOfferToClient = () =>
    setOpenDialogAssignmentOfferToClient(!openDialogAssignmentOfferToClient);

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

  const handleSearchAndFilter = (searchQuery, currentFilters, columnConfig) => {
    setReadConfig(columnConfig);
    fetchData(searchQuery, currentFilters, columnConfig);
  };

  const handleAssignmentOfferToClientClick = (clientId, offerId) => {
    setClientIdToAssign(clientId);
    setOfferIdToAssign(offerId);
    setOpenDialogAssignmentOfferToClient(true);
  };

  const handlePagination = (currentPage, rowsPerValue) => {
    if (currentPage !== page) setPage(currentPage);
    if (rowsPerValue !== itemsPerPage) setItemsPerPage(rowsPerValue);
    fetchData(
      searchValue,
      filters,
      readConfig,
      currentPage,
      rowsPerValue,
      orderBy,
      order
    );
  };

  const handleSort = (currentPage, rowsPerValue, sortBy, sort) => {
    setPage(currentPage);
    if (rowsPerValue !== itemsPerPage) setItemsPerPage(rowsPerValue);
    if (sortBy !== orderBy) setOrderBy(sortBy);
    if (sort !== order) setOrder(sort);
    fetchData(
      searchValue,
      filters,
      readConfig,
      currentPage,
      rowsPerValue,
      sortBy,
      sort
    );
  };

  const handleAddToCalendar = (row) => {
    const eventTitle = row.telefonWlasciciela;
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

  const fetchAgents = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/users?min=true`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = response.data["users"];
      const agents = usersList.map((user) => user.imie + " " + user.nazwisko);
      if (userRole === "admin") setUsers(agents);
      else {
        setUsers([userInformation]);
        setAllUsers(agents);
      }
    } catch (error) {
      console.log(error);
    }
  }, [token, backendServer, userInformation, userRole]);

  const fetchData = useCallback(
    async (
      searchQuery = searchValue,
      currentFilters = filters,
      columnConfig = readConfig,
      currentPage = page,
      rowsPerValue = itemsPerPage,
      sortBy = orderBy,
      sort = order
    ) => {
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
            page: currentPage,
            limit: rowsPerValue,
            sortBy,
            sort,
            ...currentFilters,
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
        setRows(response.data["listings"]);
        setQuantityOffers(response.data["total"]);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      backendServer,
      token,
      readConfig,
      filters,
      itemsPerPage,
      order,
      orderBy,
      page,
      searchValue,
    ]
  );

  const fetchClients = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/clients?min=true`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setClients(response.data["klienci"]);
    } catch (error) {
      console.log("Błąd podczas pobierania klientów: " + error.message);
    }
  }, [backendServer, token]);

  const handleSaveOffer = useCallback(
    async (offerData) => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, fetchData, handleAddOfferClick]
  );

  const handleDeleteOffer = useCallback(
    async (offerId) => {
      setLoading(true);
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
        if (isOfferDetailsPanelOpen)
          setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
        await fetchData();
        setSelected([]);
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
        setAlertSeverity("error");
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, fetchData]
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
        await fetchData();
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
        setAlertSeverity("error");
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, fetchData]
  );

  const handleAssigmentOfferToClient = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${backendServer}/clients/${clientIdToAssign}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentClientData = response.data;

      if (currentClientData.przypisaneOferty.includes(offerIdToAssign)) {
        setAlertOpen(true);
        setAlertMessage("Ta oferta jest już przypisana do tego klienta");
        setAlertSeverity("warning");
        if (openDialogAssignmentOfferToClient)
          setOpenDialogAssignmentOfferToClient(
            !openDialogAssignmentOfferToClient
          );

        setLoading(false);
        return;
      }

      const updatedAssignedOffers = [
        ...currentClientData.przypisaneOferty,
        offerIdToAssign,
      ];

      const updatedData = { przypisaneOferty: updatedAssignedOffers };

      await axios.put(
        `${backendServer}/clients/${clientIdToAssign}`,
        updatedData,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertOpen(true);
      setAlertMessage("Zaktualizowano pomyślnie");
      setAlertSeverity("success");
      setEditOfferPanelOpen(false);
      if (openDialogAssignmentOfferToClient)
        setOpenDialogAssignmentOfferToClient(
          !openDialogAssignmentOfferToClient
        );
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  });

  const handleConfirmOfferAssignment = useCallback(async () => {
    setLoading(true);
    try {
      const updatedData = { agent: userInformation };
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
      if (isOfferDetailsPanelOpen)
        setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  }, [backendServer, token, fetchData]);

  const handleChangeOfferInterest = useCallback(async () => {
    if (!offerToChangeOfferInterest) {
      console.error("offerToChangeOfferInterest is null - cannot proceed");
      setAlertOpen(true);
      setAlertMessage("Błąd: Brak oferty do aktualizacji");
      setAlertSeverity("error");
      setOpenDialogChangeOfferInterest(false);
      return;
    }

    setLoading(true);
    const editedOffer = {
      ...offerToChangeOfferInterest,
      czyCiekawa: true,
    };
    try {
      await axios.put(
        `${backendServer}/listings/${editedOffer._id}`,
        editedOffer,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAlertOpen(true);
      setAlertMessage("Pomyślnie zaktualizowano ofertę");
      setAlertSeverity("success");
      setOpenDialogChangeOfferInterest(false);
      if (isOfferDetailsPanelOpen)
        setIsOfferDetailsPanelOpen(!isOfferDetailsPanelOpen);
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas aktualizowania oferty: " + error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  }, [
    backendServer,
    token,
    fetchData,
    offerToChangeOfferInterest,
    isOfferDetailsPanelOpen,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (id !== undefined) {
      setIsOfferDetailsPanelOpen(true);
      setOfferDetailsId(id);
    }

    fetchAgents();
    fetchClients();
    fetchData();
  }, [isAuthenticated, id, fetchAgents, fetchClients, fetchData]);

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, []);

  return (
    <div>
      <div className="flex items-start justify-start h-screen ml-16  flex-col">
        <Sidebar />
        {loading && <LoadingCircularProgress />}
        <div className="flex justify-center w-full">
          <TableControls
            selectedCount={selected.length}
            onAddOfferClick={handleAddOfferClick}
            deleteMultipleOffersClick={handleDeleteMiltipleOffers}
            onSearchChange={handleSearchAndFilter}
            onFilterApply={handleSearchAndFilter}
            allUsers={allUsers.length !== 0 ? allUsers : users}
            clients={clients}
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
          handleChangeOfferInterestClick={handleChangeOfferInterestClick}
          handleGoToOfferDetailsPage={handleOpenOfferDetailsPanel}
          onPaginationApply={handlePagination}
          onSortApply={handleSort}
          quantityOffers={quantityOffers}
          handleChangeOfferInterest={handleChangeOfferInterest}
          handleAssignmentOfferToClientClick={
            handleAssignmentOfferToClientClick
          }
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
            userInformation={userInformation}
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
          open={openDialogAssignmentOfferToClient}
          onClose={handleOpenCloseDialogAssignmentOfferToClient}
          onConfirm={handleAssigmentOfferToClient}
          dialogTitle={"Potwierdzenie przypisania oferty klientowi"}
          dialogContent={
            "Czy na pewno chcesz przypisać tę ofertę klientowi:\n" +
            clients.find((client) => client._id === clientIdToAssign)
              ?.daneKlienta
          }
          buttonText={"Potwierdź"}
          buttonColor={"warning"}
        />

        {offerToChangeOfferInterest && (
          <ConfirmDialog
            open={openDialogChangeOfferInterest}
            onClose={handleOpenCloseDialogChangeOfferInterest}
            onConfirm={handleChangeOfferInterest}
            dialogTitle={
              offerToChangeOfferInterest.czyCiekawa
                ? "Potwierdzenie usunięcia oferty z ciekawych"
                : "Potwierdzenie dodania oferty do ciekawych"
            }
            dialogContent={
              offerToChangeOfferInterest.czyCiekawa
                ? "Czy na pewno chcesz usunąć te ofertę z ciekawych?"
                : "Czy na pewno chcesz dodać te ofertę do ciekawych?"
            }
            buttonText={"Potwierdź"}
            buttonColor={"warning"}
          />
        )}

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
        {isOfferDetailsPanelOpen && (
          <OfferDetailsPage
            id={offerDetailsId}
            onClose={handleCloseOfferDetailsPanel}
            userRole={userRole}
            readConfig={readConfig}
            handleSaveEditedOffer={handleSaveEditedOffer}
            handleDeleteOfferClick={handleDeleteOfferClick}
            handleAddToCalendar={handleAddToCalendar}
            handleUpdateOfferAgentClick={handleUpdateOfferAgentClick}
            users={users}
          />
        )}
      </div>
    </div>
  );
}

export default OffersPage;
