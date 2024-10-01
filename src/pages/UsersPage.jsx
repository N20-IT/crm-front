import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { GetUserRoleFromToken } from "../utils/decodeToken";
import axios from "axios";
import serverConfig from "../servers.json";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Checkbox,
  TablePagination,
  Skeleton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import TableControlsUsers from "../components/TableControlsUsers";
import ConfirmDialog from "../components/ConfirmDialog";
import Alerts from "../components/Alerts";
import AddUserPanel from "../components/AddUserPanel";
function UsersPage() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const [selected, setSelected] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const isAuthenticated = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [isAddUserPanelOpen, setAddUserPanelOpen] = useState(false);
  const userRole = GetUserRoleFromToken();
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const backendServer = serverConfig["backend-server"];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const columns = [
    { id: "email", label: "Email" },
    {
      id: "narzedzia",
      label: "Narzędzia",
    },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendServer}/list-users`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = JSON.parse(response.data.body);
      setUsers(usersList);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [backendServer, token]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSelectAll = () => {
    if (selected.length === users.length) setSelected([]);
    else setSelected(users.map((user) => user.Email));
  };

  const handleSelect = (id) => {
    if (selected.includes(id))
      setSelected(selected.filter((itemId) => itemId !== id));
    else setSelected([...selected, id]);
  };

  const handleOpenCloseDialog = () => setOpenDialog(!openDialog);

  const handleConfirmDelete = async () => {
    if (userIdToDelete) {
      await handleDeleteUser(userIdToDelete);
      setUserIdToDelete(null);
    }
    setOpenDialog(false);
  };

  const handleDeleteUserClick = (offerId) => {
    setUserIdToDelete(offerId);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${backendServer}/delete-user`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { email: userId },
      });
      setAlertOpen(true);
      setAlertMessage("Pomyślnie usunięto użytkownika");
      setAlertSeverity("success");
      await fetchData();
      setSelected([]);
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      await axios.post(`${backendServer}/create-user`, userData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      handleAddUserClick();
      await fetchData();
      setAlertOpen(true);
      setAlertMessage("Dodano użytkownika pomyślnie");
      setAlertSeverity("success");
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    }
  };

  const handleAddUserClick = () => {
    setAddUserPanelOpen(!isAddUserPanelOpen);
  };
  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") navigate("/");
    fetchData();
  }, [isAuthenticated, userRole, navigate, fetchData]);

  return (
    <div className=" flex items-start justify-start h-screen ml-48 flex-col">
      <Sidebar />
      <h1 className=" font-bold text-5xl font-poppins ml-9 mt-6 mb-4">
        Użytkownicy
      </h1>
      <div className="flex justify-center w-full">
        <TableControlsUsers
          selectedCount={selected.length}
          onAddUserClick={handleAddUserClick}
        />
      </div>
      <TableContainer
        component={Paper}
        elevation={8}
        style={{
          width: "95%",
          alignSelf: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          maxHeight: "74.765%",
        }}
      >
        <Table>
          <TableHead style={{ backgroundColor: "#272F3E", width: "60px" }}>
            <TableRow>
              <TableCell
                padding="checkbox"
                style={{
                  color: "white",
                  textAlign: "center",
                }}
              >
                <Checkbox
                  checked={selected.length === users.length}
                  indeterminate={
                    selected.length > 0 && selected.length < users.length
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
                    <TableCell colSpan={columns.length + 1}>
                      <Skeleton
                        variant="rounded"
                        width="100%"
                        height={16}
                        animation="wave"
                      />
                    </TableCell>
                  </TableRow>
                ))
              : users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.Email}>
                      <TableCell
                        style={{
                          textAlign: "center",
                          padding: "5px",
                          maxHeight: "60px",
                        }}
                      >
                        <Checkbox
                          checked={selected.includes(user.Email)}
                          onChange={() => handleSelect(user.Email)}
                          sx={{
                            color: "#272F3E",
                            "&.Mui-checked": {
                              color: "#272F3E",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        key={user.Email}
                        style={{
                          textAlign: "center",
                          fontFamily: "Poppins",
                          minWidth: "8%",
                        }}
                      >
                        {user.Email}
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
                            sx={{ padding: "4px" }}
                            onClick={() => handleDeleteUserClick(user.Email)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Alerts
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
      <ConfirmDialog
        open={openDialog}
        onClose={handleOpenCloseDialog}
        onConfirm={handleConfirmDelete}
      />
      {isAddUserPanelOpen && (
        <AddUserPanel onSave={handleSaveUser} onCancel={handleAddUserClick} />
      )}
      <TablePagination
        component="div"
        count={users.length}
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

export default UsersPage;
