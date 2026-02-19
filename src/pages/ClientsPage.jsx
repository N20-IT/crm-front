import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import ClientsTable from "../components/ClientsTable";
import columnsClientsConfig from "../config/columnsClientsConfig";
import serverConfig from "../servers.json";
import axios from "axios";
import Alerts from "../components/Alerts";
import ConfirmDialog from "../components/ConfirmDialog";
import ClientTableControls from "../components/ClientTableControls";
import AddClientPanel from "../components/AddClientPanel";
import { GetInformationFromToken } from "../utils/decodeToken";
import EditClientPanel from "../components/EditClientPanel";
import LoadingCircularProgress from "../components/LoadingCircularProgress";
import ClientDetails from "../components/ClientDetails";
import { useParams } from "react-router-dom";
import { useClientFiltersStore } from "../store/clientFilterStore";
import qs from "qs";

function ClientsPage() {
  const { id } = useParams();
  const { filters, clearFilters } = useClientFiltersStore();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const token = useReadCookie();
  const [quantityClients, setQuantityClients] = useState(0);
  const columns = useMemo(() => columnsClientsConfig, []);
  const backendServer = serverConfig["backend-server"];
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState("dataUtworzenia");
  const [order, setOrder] = useState("desc");
  const [openDialogDelete, setopenDialogDelete] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isAddClientPanelOpen, setIsAddClientPanelOpen] = useState(false);
  const [isEditClientPanelOpen, setIsEditClientPanelOpen] = useState(false);
  const [isClientDetailsPanelOpen, setIsClientDetailsPanelOpen] = useState(
    false,
  );
  const [clientDetailsId, setClientDetailsId] = useState(null);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const userInformation =
    GetInformationFromToken("name") +
    " " +
    GetInformationFromToken("family_name");
  const userRole = GetInformationFromToken("custom:role");
  const [clientToEdit, setClientToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleEditClientClickCancel = () => {
    setClientToEdit("");
    setIsEditClientPanelOpen(!isEditClientPanelOpen);
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      await handleDeleteClient(clientToDelete);
      setClientToDelete(null);
    }
    setopenDialogDelete(false);
  };

  const handleDeleteClientClick = (client) => {
    setClientToDelete(client);
    setopenDialogDelete(true);
  };

  const handleEditClientClick = (client) => {
    setClientToEdit(client);
    setIsEditClientPanelOpen(!isEditClientPanelOpen);
  };

  const handleOpenClientDetailsPanel = (clientId) => {
    setClientDetailsId(clientId);
    setIsClientDetailsPanelOpen(!isClientDetailsPanelOpen);
  };

  const handleOpenCloseDialog = () => setopenDialogDelete(!openDialogDelete);

  const handleCloseClientDetailsPanel = () => {
    setIsClientDetailsPanelOpen(!isClientDetailsPanelOpen);
    setClientDetailsId(null);
  };

  const handleSearchAndFilter = (searchQuery, currentFilters) => {
    setPage(0);
    fetchData(searchQuery, currentFilters, 0);
  };

  const handlePagination = (currentPage, rowsPerValue) => {
    if (currentPage !== page) setPage(currentPage);
    if (rowsPerValue !== itemsPerPage) setItemsPerPage(rowsPerValue);
    fetchData(searchValue, filters, currentPage, rowsPerValue, orderBy, order);
  };

  const handleSort = (currentPage, rowsPerValue, sortBy, sort) => {
    setPage(currentPage);
    if (rowsPerValue !== itemsPerPage) setItemsPerPage(rowsPerValue);
    if (sortBy !== orderBy) setOrderBy(sortBy);
    if (sort !== order) setOrder(sort);
    fetchData(searchValue, filters, currentPage, rowsPerValue, sortBy, sort);
  };

  const handleAddClientClick = () => {
    setIsAddClientPanelOpen(!isAddClientPanelOpen);
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
      currentPage = page,
      rowsPerValue = itemsPerPage,
      sortBy = orderBy,
      sort = order,
    ) => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendServer}/clients`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchQuery,
            page: currentPage,
            limit: rowsPerValue,
            sortBy,
            sort,
            czyUsuniety: false,
            ...currentFilters,
          },
          paramsSerializer: (params) => {
            const serializedParams = {
              ...params,
              lokalizacja: params.lokalizacja
                ? params.lokalizacja.join(",")
                : undefined,
              standard: params.standard ? params.standard.join(",") : undefined,
            };
            return qs.stringify(serializedParams, { arrayFormat: "repeat" });
          },
        });
        setRows(response.data["klienci"]);
        setQuantityClients(response.data["total"]);
      } catch (error) {
        console.log("Błąd podczas pobierania danych", error);
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token],
  );

  const handleDeleteClient = useCallback(
    async (editedClient) => {
      setLoading(true);
      editedClient.czyUsuniety = true;
      try {
        await axios.put(
          `${backendServer}/clients/${editedClient._id}`,
          editedClient,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAlertOpen(true);
        setAlertMessage("Pomyślnie usunięto klienta");
        setAlertSeverity("success");
        if (isClientDetailsPanelOpen) setIsClientDetailsPanelOpen(false);
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
    [backendServer, token, fetchData],
  );

  // const handleDeleteClient = useCallback(
  //   async (clientId) => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.delete(
  //         `${backendServer}/clients/${clientId}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setAlertOpen(true);
  //       setAlertMessage("Pomyślnie usunięto klienta");
  //       setAlertSeverity("success");
  //       if (isClientDetailsPanelOpen) setIsClientDetailsPanelOpen(false);
  //       await fetchData();
  //       setSelected([]);
  //     } catch (error) {
  //       setAlertOpen(true);
  //       setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
  //       setAlertSeverity("error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [backendServer, token, fetchData]
  // );

  const handleEditClient = useCallback(
    async (updatedClientDate) => {
      setLoading(true);
      try {
        await axios.put(
          `${backendServer}/clients/${updatedClientDate._id}`,
          updatedClientDate,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setAlertOpen(true);
        setAlertMessage("Zaktualizowano pomyślnie");
        setAlertSeverity("success");
        setIsEditClientPanelOpen(false);
        // if (isClientDetailsPanelOpen)
        //   setIsClientDetailsPanelOpen(!isClientDetailsPanelOpen);
        await fetchData();
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Błąd podczas edytowania klienta: " + error.message);
        setAlertSeverity("error");
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, fetchData, handleEditClientClick],
  );

  const handleSaveClient = useCallback(
    async (clientData) => {
      setLoading(true);
      try {
        await axios.post(`${backendServer}/clients`, clientData, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        handleAddClientClick();
        await fetchData();
        setAlertOpen(true);
        setAlertMessage("Dodano klienta pomyślnie");
        setAlertSeverity("success");
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Wystąpił błąd podczas dodawania klienta");
        setAlertSeverity("error");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token, fetchData, handleAddClientClick],
  );

  const downloadPDF = useCallback(
    async (clientData) => {
      try {
        const response = await axios.get(
          `${backendServer}/clients/${clientData._id}/print`,
          {
            headers: {
              accept: "application/pdf",
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          },
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `klient_${clientData.daneKlienta}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        setAlertOpen(true);
        setAlertMessage("Pomyślnie pobrano PDF");
        setAlertSeverity("success");
      } catch (error) {
        setAlertOpen(true);
        setAlertMessage("Wystąpił błąd podczas pobierania PDF");
        setAlertSeverity("error");
        console.log(error.message);
      }
    },
    [backendServer, token],
  );

  useEffect(() => {
    if (!isAuthenticated) navigate("/");

    if (id !== undefined) {
      setIsClientDetailsPanelOpen(true);
      setClientDetailsId(id);
    }

    fetchAgents();
    fetchData();
  }, [isAuthenticated, id, navigate, fetchAgents, fetchData]);

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, []);

  return (
    <div className="flex items-start justify-start h-screen ml-16 flex-col">
      <Sidebar />
      {loading && <LoadingCircularProgress />}
      <div className="flex justify-center w-full">
        <ClientTableControls
          onAddClientClick={handleAddClientClick}
          onSearchFilterApply={handleSearchAndFilter}
          allUsers={allUsers.length !== 0 ? allUsers : users}
          userRole={userRole}
        />
      </div>
      <ClientsTable
        rows={rows}
        columns={columns}
        selected={selected}
        setSelected={setSelected}
        quantityClients={quantityClients}
        onPaginationApply={handlePagination}
        onSortApply={handleSort}
        handleDeleteClientClick={handleDeleteClientClick}
        handleEditClientClick={handleEditClientClick}
        loading={loading}
        handleGoToClientDetails={handleOpenClientDetailsPanel}
        userRole={userRole}
        downloadPDF={downloadPDF}
        page={page}
        itemsPerPage={itemsPerPage}
        orderBy={orderBy}
        order={order}
      />
      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
      <ConfirmDialog
        open={openDialogDelete}
        onClose={handleOpenCloseDialog}
        onConfirm={handleConfirmDelete}
        dialogTitle={"Potwierdzenie usunięcia"}
        dialogContent={"Czy na pewno chcesz usunąć?"}
        buttonText={"Usuń"}
        buttonColor={"error"}
      />
      {isAddClientPanelOpen && (
        <AddClientPanel
          onSave={handleSaveClient}
          onCancel={handleAddClientClick}
          allUsers={allUsers.length !== 0 ? allUsers : users}
          userInformation={userInformation}
        />
      )}
      {isEditClientPanelOpen && (
        <EditClientPanel
          initialData={clientToEdit}
          onSave={handleEditClient}
          onCancel={handleEditClientClickCancel}
          allUsers={allUsers.length !== 0 ? allUsers : users}
        />
      )}
      {isClientDetailsPanelOpen && (
        <ClientDetails
          id={clientDetailsId}
          onClose={handleCloseClientDetailsPanel}
          handleSaveEditedClient={handleEditClient}
          handleDeleteClientClick={handleDeleteClientClick}
          users={users}
          downloadPDF={downloadPDF}
        />
      )}
    </div>
  );
}

export default ClientsPage;
