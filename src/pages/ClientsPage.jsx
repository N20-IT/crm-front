import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import ClientsTable from "../components/ClientsTable";
import columnsClientsConfig from "../config/columnsClientsConfig";
import { useReadConfig } from "../config/columnConfig";
import serverConfig from "../servers.json";
import axios from "axios";
import Alerts from "../components/Alerts";
import ConfirmDialog from "../components/ConfirmDialog";
import ClientTableControls from "../components/ClientTableControls";
import AddClientPanel from "../components/AddClientPanel";
import { GetInformationFromToken } from "../utils/decodeToken";
import EditClientPanel from "../components/EditClientPanel";

//TODO
function ClientsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const token = useReadCookie();
  const [quantityClients, setQuantityClients] = useState(0);
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const [isSidebarCollapsedDelayed, setIsSidebarCollapsedDelayed] = useState(
    isCollapsed
  );
  const columns = useMemo(() => columnsClientsConfig, []);
  const [readConfig, setReadConfig] = useState(useReadConfig());
  const backendServer = serverConfig["backend-server"];
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [filters, setFilters] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [orderBy, setOrderBy] = useState("dataUtworzenia");
  const [order, setOrder] = useState("desc");
  const [openDialogDelete, setopenDialogDelete] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [isClientPanelOpen, setIsClientPanelOpen] = useState(false);
  const [isAddClientPanelOpen, setIsAddClientPanelOpen] = useState(false);
  const [isEditClientPanelOpen, setIsEditClientPanelOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const userInformation =
    GetInformationFromToken("name") +
    " " +
    GetInformationFromToken("family_name");
  const userRole = GetInformationFromToken("custom:role");
  const [clientToEdit, setClientToEdit] = useState(null);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/users`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = response.data;
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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/clients`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRows(response.data["klienci"]);
      setQuantityClients(response.data["total"]);
    } catch (error) {
      console.log("Błąd podczas pobierania danych", error);
    }
  });

  const handleDeleteClient = async (clientId) => {
    try {
      const response = await axios.delete(
        `${backendServer}/clients/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlertOpen(true);
      setAlertMessage(response.data.message);
      setAlertSeverity("success");
      if (isClientPanelOpen) setIsClientPanelOpen(!isClientPanelOpen);
      await fetchData();
      setSelected([]);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleEditClient = async (updatedClientDate) => {
    try {
      await axios.put(
        `${backendServer}/clients/${updatedClientDate._id}`,
        updatedClientDate,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleEditClientClick();
      setAlertOpen(true);
      setAlertMessage("Pomyslnie edytowano klienta");
      setAlertSeverity("success");
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas edytowania klienta: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleEditClientClickCancel = () => {
    setClientToEdit("");
    setIsEditClientPanelOpen(!isEditClientPanelOpen);
  };

  const handleConfirmDelete = async () => {
    if (clientIdToDelete) {
      await handleDeleteClient(clientIdToDelete);
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

  const handleOpenCloseDialog = () => setopenDialogDelete(!openDialogDelete);

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

  const handleSaveClient = async (clientData) => {
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
    }
  };

  const handleAddClientClick = () => {
    setIsAddClientPanelOpen(!isAddClientPanelOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    fetchAgents();
    fetchData();
    if (isCollapsed) {
      const timer = setTimeout(() => setIsSidebarCollapsedDelayed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsSidebarCollapsedDelayed(false);
    }
  }, [isAuthenticated, navigate, isCollapsed, fetchAgents]);
  return (
    <div
      className={`flex items-start justify-start h-screen ${
        isSidebarCollapsedDelayed ? "ml-16" : "ml-48"
      } flex-col`}
    >
      <Sidebar />
      <div className="flex justify-center w-full">
        <ClientTableControls onAddClientClick={handleAddClientClick} />
      </div>
      <ClientsTable
        rows={rows}
        columns={columns}
        selected={selected}
        setSelected={setSelected}
        readConfig={readConfig}
        quantityClients={quantityClients}
        onPaginationApply={handlePagination}
        handleDeleteClientClick={handleDeleteClientClick}
        handleEditClientClick={handleEditClientClick}
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
        dialogContent={
          "Czy na pewno chcesz usunąć? Ta operacja jest nieodwracalna."
        }
        buttonText={"Usuń"}
        buttonColor={"error"}
      />
      {isAddClientPanelOpen && (
        <AddClientPanel
          onSave={handleSaveClient}
          onCancel={handleAddClientClick}
          allUsers={allUsers.length !== 0 ? allUsers : users}
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
    </div>
  );
}

export default ClientsPage;
