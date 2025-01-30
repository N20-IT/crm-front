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

//TODO
function ClientsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const token = useReadCookie();
  const [quantityClients, setQuantityClients] = useState(0);
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed);
  const [isSidebarCollapsedDelayed, setIsSidebarCollapsedDelayed] = useState(
    isCollapsed
  );
  const columns = useMemo(() => columnsClientsConfig, []);
  const [readConfig, setReadConfig] = useState(useReadConfig());
  const backendServer = serverConfig["backend-server"];

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

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    fetchData();
  }, [isAuthenticated, navigate]);
  return (
    <div
      className={`flex items-start justify-start h-screen ${
        isSidebarCollapsedDelayed ? "ml-16" : "ml-48"
      } flex-col`}
    >
      <Sidebar />
      <ClientsTable
        rows={rows}
        columns={columns}
        selected={selected}
        setSelected={setSelected}
        readConfig={readConfig}
      />
    </div>
  );
}

export default ClientsPage;
