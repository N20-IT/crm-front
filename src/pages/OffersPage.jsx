import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Delete,
  Edit,
  Star,
  CalendarMonth,
  Map,
  AssignmentInd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TableControls from "../components/TableControls";
import Alerts from "../components/Alerts";
import AddOfferPanel from "../components/AddOfferPanel";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import EditOfferPanel from "../components/EditOfferPanel";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [offerIdToDelete, setOfferIdToDelete] = useState(null);
  const [isEditOfferPanelOpen, setEditOfferPanelOpen] = useState(false);
  const [editOfferData, setEditOfferData] = useState(null);

  const columns = [
    {
      id: "ulica",
      label: "Ulica",
    },
    {
      id: "dzielnica",
      label: "Dzielnica",
    },
    {
      id: "miasto",
      label: "Miasto",
    },
    {
      id: "nrDomu",
      label: "Numer Domu",
    },
    {
      id: "nrMieszkania",
      label: "Numer Mieszkania",
    },
    {
      id: "iloscPokoi",
      label: "Ilość pokoi / dom ",
    },
    {
      id: "metraz",
      label: "Metraż",
    },
    {
      id: "cena",
      label: "Cena",
    },
    {
      id: "telefonDoWlasciciela",
      label: "Telefon",
    },
    {
      id: "uwagi",
      label: "Uwagi",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "narzedzia",
      label: "Narzędzia",
    },
    {
      id: "checkbox",
    },
  ];

  useEffect(() => {
    fetchData();
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/listings", {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRows(response.data);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOffer = async (offerData) => {
    try {
      const response = await axios.post("/listings", offerData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertOpen(true);
      setAlertMessage("Dodano ofertę pomyślnie");
      setAlertSeverity("success");
      await fetchData();
      handleAddOfferClick();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    }
  };

  const handleDeleteOffer = async (offerId) => {
    try {
      const response = await axios.delete("/listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ids: offerId },
      });
      setAlertOpen(true);
      setAlertMessage("Ofertę usunięto pomyślnie");
      setAlertSeverity("success");
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleSaveEditedOffer = async (updatedOfferData) => {
    try {
      const response = await axios.put(
        `listings/${updatedOfferData._id}`,
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

  const paginatedRows = rows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddOfferClick = () => {
    setAddOfferPanelOpen(!isAddOfferPanelOpen);
  };

  const handleConfirmDelete = async () => {
    if (offerIdToDelete) {
      await handleDeleteOffer(offerIdToDelete);
      setOfferIdToDelete(null);
    }
    setOpenDialog(false);
  };

  const handleDeleteOfferClick = (offerId) => {
    setOfferIdToDelete(offerId);
    setOpenDialog(true);
  };
  const handleOpenCloseDialog = () => setOpenDialog(!openDialog);

  const handleEditClick = (offer) => {
    setEditOfferData(offer);
    setEditOfferPanelOpen(true);
  };

  const handleDeleteMiltipleOffers = () => {
    if (selected.length > 0) {
      setOfferIdToDelete(selected);
      setOpenDialog(true);
    }
  };

  return (
    <div className=" flex items-start justify-start h-screen ml-48 flex-col">
      <Sidebar />
      <h1 className=" font-bold text-5xl font-poppins ml-9 mt-6 mb-4">
        Oferty
      </h1>
      <TableContainer
        component={Paper}
        elevation={8}
        style={{
          width: "95%",
          alignSelf: "center",
          borderRadius: "10px",
          maxHeight: "795px",
        }}
      >
        <TableControls
          selectedCount={selected.length}
          onAddOfferClick={handleAddOfferClick}
          deleteMultipleOffersClick={handleDeleteMiltipleOffers}
        />

        <Table>
          <TableHead style={{ backgroundColor: "#272F3E" }}>
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
                    minWidth: "8%",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="rounded" width="100%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : paginatedRows.map((row) => (
                  <TableRow
                    key={row._id}
                    style={{
                      "& .MuiTableRowRoot": {
                        maxHeight: "60px",
                      },
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
                        width: "7.2%",
                      }}
                    >
                      {row.adres.ulica}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        width: "7.2%",
                      }}
                    >
                      {row.adres.dzielnica}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        width: "7.2%",
                      }}
                    >
                      {row.adres.miasto}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        width: "7.2%",
                      }}
                    >
                      {row.adres.numerDomu}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        width: "7.2%",
                      }}
                    >
                      {row.adres.numerMieszkania}
                    </TableCell>
                    <TableCell
                      style={{
                        textAlign: "center",
                        padding: "0px",
                        maxHeight: "60px",
                        fontFamily: "Poppins",
                        width: "7.2%",
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
                        width: "7.2%",
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
                        width: "7.2%",
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
                        width: "7.2%",
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
                        width: "7.2%",
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
                        width: "7.2%",
                      }}
                    >
                      {row.status}
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
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edytuj">
                        <IconButton onClick={() => handleEditClick(row)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dodaj do ciekawych ofert">
                        <IconButton>
                          <Star />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Dodaj do kalendarza">
                        <IconButton>
                          <CalendarMonth />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Pokaż na mapie">
                        <IconButton>
                          <Map />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Przypisz ofertę">
                        <IconButton>
                          <AssignmentInd />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Wiersze na stronę"
        showFirstButton
        showLastButton
        sx={{ width: "95%" }}
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
        />
      )}
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={handleOpenCloseDialog}
        onConfirm={handleConfirmDelete}
      />
      {isEditOfferPanelOpen && (
        <EditOfferPanel
          offerData={editOfferData}
          onSave={handleSaveEditedOffer}
          onCancel={() => setEditOfferPanelOpen(false)}
        />
      )}
    </div>
  );
}

export default OffersPage;
