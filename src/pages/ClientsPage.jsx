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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/clients`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
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

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    fetchData();
    if (isCollapsed) {
      const timer = setTimeout(() => setIsSidebarCollapsedDelayed(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsSidebarCollapsedDelayed(false);
    }
  }, [isAuthenticated, navigate, isCollapsed]);
  return (
    <div
      className={`flex items-start justify-start h-screen ${
        isSidebarCollapsedDelayed ? "ml-16" : "ml-48"
      } flex-col`}
    >
      <Sidebar />
      <div className="flex justify-center w-full">
        <ClientTableControls />
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
    </div>
  );
}

export default ClientsPage;
