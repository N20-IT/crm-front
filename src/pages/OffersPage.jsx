import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  TablePagination,
  Tooltip,
  Skeleton,
  TableSortLabel,
} from "@mui/material";
import {
  Delete,
  Edit,
  Star,
  CalendarMonth,
  Map,
  AssignmentInd,
  Info,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TableControls from "../components/TableControls";
import Alerts from "../components/Alerts";
import AddOfferPanel from "../components/AddOfferPanel";
import ConfirmDialog from "../components/ConfirmDialog";
import EditOfferPanel from "../components/EditOfferPanel";
import serverConfig from "../servers.json";
import { GetEmailFromToken, GetUserRoleFromToken } from "../utils/decodeToken";

function OffersPage() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const isAuthenticated = useAuth();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const columns = [
    {
      id: "ulica",
      label: "Ulica",
      sortable: true,
    },
    {
      id: "dzielnica",
      label: "Dzielnica",
      sortable: true,
    },
    {
      id: "miasto",
      label: "Miasto",
      sortable: true,
    },
    {
      id: "numerDomu",
      label: "Numer Domu",
      sortable: false,
    },
    {
      id: "numerMieszkania",
      label: "Numer Mieszkania",
      sortable: false,
    },
    {
      id: "iloscPokoi",
      label: "Ilość pokoi / dom ",
      sortable: true,
    },
    {
      id: "metraz",
      label: "Metraż",
      sortable: true,
    },
    {
      id: "cena",
      label: "Cena",
      sortable: true,
    },
    {
      id: "zlM2",
      label: "Zł/M2",
      sortable: true,
    },
    {
      id: "telefonDoWlasciciela",
      label: "Telefon",
      sortable: false,
    },
    {
      id: "daneWlasciciela",
      label: "Dane właściciela",
      sortable: false,
    },
    {
      id: "komentarz",
      label: "Komentarz",
      sortable: false,
    },
    {
      id: "agent",
      label: "Agent",
      sortable: false,
    },
    {
      id: "status",
      label: "Status",
      sortable: false,
    },
    { id: "dataUtworzenia", label: "Data Utworzenia", sortable: true },
    {
      id: "narzedzia",
      label: "Narzędzia",
      sortable: false,
    },
  ];

  const fetchAgents = useCallback(async () => {
    try {
      const response = await axios.get(`${backendServer}/list-users`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = JSON.parse(response.data.body);
      const emailList = usersList.map((user) => user.Email);
      setUsers(emailList);
    } catch (error) {
      console.log(error);
    }
  }, [token, backendServer]);

  const fetchData = useCallback(
    async (searchQuery = "", filters = {}) => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendServer}/listings`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: searchQuery,
            ...filters,
          },
        });
        setRows(response.data);
      } catch (error) {
        console.error("Błąd pobierania danych:", error);
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token]
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

  const handleSelect = (id) => {
    if (selected.includes(id))
      setSelected(selected.filter((itemId) => itemId !== id));
    else setSelected([...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === rows.length) setSelected([]);
    else setSelected(rows.map((row) => row._id));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const handleSearchAndFilter = (searchQuery, filters) => {
    fetchData(searchQuery, filters);
  };

  const handleSortRequest = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedRows = useMemo(() => {
    const column = columns.find((col) => col.id === orderBy);

    if (!column || !column.sortable) {
      return rows;
    }
    return [...rows].sort((a, b) => {
      if (orderBy) {
        let aValue = a[orderBy] ?? "";
        let bValue = b[orderBy] ?? "";

        if (
          orderBy === "ulica" ||
          orderBy === "dzielnica" ||
          orderBy === "miasto" ||
          orderBy === "numerDomu" ||
          orderBy === "numerMieszkania"
        ) {
          aValue = a.adres ? a.adres[orderBy] : "";
          bValue = b.adres ? b.adres[orderBy] : "";
        }

        if (
          aValue === undefined ||
          aValue === null ||
          aValue === "" ||
          aValue === " " ||
          aValue === "???" ||
          aValue === "????"
        )
          return 1;
        if (
          bValue === undefined ||
          bValue === null ||
          bValue === "" ||
          bValue === " " ||
          bValue === "???" ||
          bValue === "????"
        )
          return -1;

        if (typeof aValue === "number" && typeof bValue === "number") {
          return order === "asc" ? aValue - bValue : bValue - aValue;
        }

        return order === "asc"
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      }
      return rows;
    });
  }, [rows, order, orderBy]);

  const paginatedRows = useMemo(() => {
    return Array.isArray(sortedRows)
      ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];
  }, [sortedRows, page, rowsPerPage]);

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
    userRole === "admin" ? fetchAgents() : setUsers([email]);
    fetchData(searchQuery);
  }, [
    fetchData,
    isAuthenticated,
    navigate,
    searchQuery,
    fetchAgents,
    email,
    userRole,
  ]);

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
        <TableContainer
          component={Paper}
          elevation={8}
          style={{
            width: "100%",
            alignSelf: "center",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
            maxHeight: "74.765%",
          }}
        >
          <Table>
            <TableHead
              style={{
                backgroundColor: "#272F3E",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <TableRow>
                <TableCell
                  padding="checkbox"
                  style={{
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  <Checkbox
                    checked={selected.length === rows.length}
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    onChange={handleSelectAll}
                    style={{
                      color: "white",
                    }}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "Poppins",
                    }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleSortRequest(column.id)}
                        style={{ color: "white", fontSize: "13px" }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="rounded" width="100%" height={16} />
                      </TableCell>
                    ))}
                    <TableCell key={"narzedzia"}>
                      <Skeleton variant="rounded" width="100%" height={16} />
                    </TableCell>
                  </TableRow>
                ))
              ) : Array.isArray(paginatedRows) && paginatedRows.length > 0 ? (
                paginatedRows.map((row) => (
                  <TableRow
                    key={row._id}
                    style={{
                      "& .MuiTableRowRoot": {
                        maxHeight: "60px",
                      },
                      width: "100%",
                    }}
                  >
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "5px",
                        maxHeight: "60px",
                      }}
                    >
                      <Checkbox
                        checked={selected.includes(row._id)}
                        onChange={() => handleSelect(row._id)}
                        sx={{
                          color: "#272F3E",
                          "&.Mui-checked": {
                            color: "#272F3E",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.adres?.ulica || ""}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.adres?.dzielnica || ""}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.adres?.miasto || ""}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.adres?.numerDomu || ""}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.adres?.numerMieszkania || ""}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.iloscPokoi}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.metraz}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.cena}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.zlM2}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.telefonWlasciciela}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.daneWlasciciela}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.komentarz}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      <strong>{row.agent}</strong>
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        width: "6.916%",
                        color:
                          row.statusOferty === "Zajety"
                            ? "red"
                            : row.statusOferty === "Wolny"
                            ? "#5BBF8C"
                            : "black",
                        fontSize: "13px",
                      }}
                    >
                      <strong>{row.statusOferty}</strong>
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        fontSize: "13px",
                      }}
                    >
                      {row.dataUtworzenia}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        maxHeight: "60px",
                        padding: "0px",
                        fontFamily: "Poppins",
                      }}
                    >
                      <Tooltip title="Usuń">
                        <IconButton
                          onClick={() => handleDeleteOfferClick([row._id])}
                          sx={{ padding: "4px" }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edytuj">
                        <IconButton
                          onClick={() => handleEditClick(row)}
                          sx={{ padding: "4px" }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dodaj do ciekawych ofert">
                        <IconButton sx={{ padding: "4px" }}>
                          <Star />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dodaj do kalendarza">
                        <IconButton sx={{ padding: "4px" }}>
                          <CalendarMonth />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Pokaż na mapie">
                        <IconButton sx={{ padding: "4px" }}>
                          <Map />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Przypisz ofertę">
                        <IconButton
                          onClick={() => handleUpdateOfferAgentClick(row._id)}
                          sx={{ padding: "4px" }}
                        >
                          <AssignmentInd />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Szczegóły oferty">
                        <IconButton
                          sx={{ padding: "4px" }}
                          onClick={() => handleGoToOfferDetailsPage(row._id)}
                        >
                          <Info />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    style={{ textAlign: "center" }}
                  >
                    Brak danych do wyświetlenia
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Wiersze na stronę"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
        showFirstButton
        showLastButton
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 43.2,
          zIndex: 1000,
        }}
      />
    </div>
  );
}

export default OffersPage;
