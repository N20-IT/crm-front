import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useReadCookie } from "../utils/auth";
import Sidebar from "../components/Sidebar";
import { GetInformationFromToken } from "../utils/decodeToken";
import axios from "axios";
import serverConfig from "../servers.json";
import { TableContainer, Paper, TablePagination } from "@mui/material";
import TableControlsUsers from "../components/TableControlsUsers";
import ConfirmDialog from "../components/ConfirmDialog";
import Alerts from "../components/Alerts";
import AddUserPanel from "../components/AddUserPanel";
import EditUserPanel from "../components/EditUserPanel";
import UsersTable from "../components/UsersTable";
import columnsUsersConfig from "../config/columnsUsersConfig";
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
  const userRole = GetInformationFromToken("custom:role");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isEditUserPanelOpen, setIsEditUserPanelOpen] = useState(false);
  const backendServer = serverConfig["backend-server"];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendServer}/users`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const usersList = response.data;
      const mappedUsersList = usersList.map((user) => ({
        ...user,
        role:
          user.role === "admin"
            ? "Administrator"
            : user.role === "user"
            ? "Użytkownik"
            : user.role,
      }));

      setUsers(mappedUsersList);
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

  const handleEditUserClick = (userId) => {
    setUserToEdit(userId);
    setIsEditUserPanelOpen(!isEditUserPanelOpen);
  };

  const handleEditUserClickCancel = () => {
    setUserToEdit("");
    setIsEditUserPanelOpen(!isEditUserPanelOpen);
  };

  const handleEditUser = async (updatedUserData) => {
    try {
      await axios.put(
        `${backendServer}/users/${updatedUserData._id}`,
        updatedUserData,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleEditUserClickCancel();
      setAlertOpen(true);
      setAlertMessage("Pomyslnie edytowano użytkownika");
      setAlertSeverity("success");
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas edytowania użytkownika: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleDeleteUserClick = (userId) => {
    setUserIdToDelete(userId);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${backendServer}/users/${userId}`, {
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
      setAlertMessage("Błąd podczas usuwania użytkownika: " + error.message);
      setAlertSeverity("error");
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      await axios.post(`${backendServer}/users`, userData, {
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
      <h1 className=" font-bold text-5xl font-poppins ml-6 mt-6 mb-4">
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
          width: "100%",
          alignSelf: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          maxHeight: "74.765%",
        }}
      >
        <UsersTable
          users={users}
          selected={selected}
          loading={loading}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onDeleteClick={handleDeleteUserClick}
          onEditClick={handleEditUserClick}
          columns={columnsUsersConfig}
          rowsPerPage={rowsPerPage}
          page={page}
        />
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
        dialogTitle={"Potwierdzenie usunięcia"}
        dialogContent={
          "Czy na pewno chcesz usunąć tego użytkownika? Ta operacja jest nieodwracalna."
        }
        buttonText={"Usuń"}
        buttonColor={"error"}
      />
      {isAddUserPanelOpen && (
        <AddUserPanel onSave={handleSaveUser} onCancel={handleAddUserClick} />
      )}
      {isEditUserPanelOpen && (
        <EditUserPanel
          initialData={userToEdit}
          onSave={handleEditUser}
          onCancel={handleEditUserClickCancel}
        />
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
