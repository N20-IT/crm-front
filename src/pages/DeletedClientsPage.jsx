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
import { useLogout } from "../utils/auth";

function DeletedClientsPage() {
  const { id } = useParams();
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
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [orderBy, setOrderBy] = useState("dataUtworzenia");
  const [order, setOrder] = useState("desc");
  const [openDialogDelete, setopenDialogDelete] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
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
  const logout = useLogout();

  const handleEditClientClickCancel = () => {
    setClientToEdit("");
    setIsEditClientPanelOpen(!isEditClientPanelOpen);
  };

  const handleConfirmDelete = async () => {
    if (clientIdToDelete) {
      await handleRestoreClient(clientIdToDelete);
      setClientIdToDelete(null);
    }
    setopenDialogDelete(false);
  };

  const handleDeleteClientClick = (clientId) => {
    setClientIdToDelete(clientId);
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

  const handlePagination = (currentPage, rowsPerValue) => {
    if (currentPage !== page) setPage(currentPage);
    if (rowsPerValue !== itemsPerPage) setItemsPerPage(rowsPerValue);
    fetchData(currentPage, rowsPerValue, orderBy, order);
  };

  const handleSort = (currentPage, rowsPerValue, sortBy, sort) => {
    setPage(currentPage);
    if (rowsPerValue !== itemsPerPage) setItemsPerPage(rowsPerValue);
    if (sortBy !== orderBy) setOrderBy(sortBy);
    if (sort !== order) setOrder(sort);
    fetchData(currentPage, rowsPerValue, sortBy, sort);
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
            page: currentPage,
            limit: rowsPerValue,
            sortBy,
            sort,
            czyUsuniety: true,
          },
        });
        if (response.data === "Forbidden") logout();

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

  const handleRestoreClient = useCallback(async (updatedClientDate) => {
    setLoading(true);
    updatedClientDate.czyUsuniety = false;
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
      setAlertMessage("Pomyślnie przywrócono klienta");
      setAlertSeverity("success");
      setIsEditClientPanelOpen(false);
      if (isClientDetailsPanelOpen)
        setIsClientDetailsPanelOpen(!isClientDetailsPanelOpen);
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas przywracania klienta: " + error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  });

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
        setAlertMessage("Pomyślnie edytowano klienta");
        setAlertSeverity("success");
        setIsEditClientPanelOpen(false);
        if (isClientDetailsPanelOpen)
          setIsClientDetailsPanelOpen(!isClientDetailsPanelOpen);
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
    if (!isAuthenticated || userRole !== "admin") navigate("/");

    if (id !== undefined) {
      setIsClientDetailsPanelOpen(true);
      setClientDetailsId(id);
    }

    fetchAgents();
    fetchData();
  }, [isAuthenticated, userRole, id, navigate, fetchAgents, fetchData]);
  return (
    <div className="flex items-start justify-start ml-16 mt-[10px] flex-col overflow-x-hidden">
      <Sidebar />
      {loading && <LoadingCircularProgress />}

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
        dialogTitle={"Potwierdzenie przywrócenia klienta"}
        dialogContent={"Czy na pewno chcesz przywrócić tego klienta?"}
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

export default DeletedClientsPage;
