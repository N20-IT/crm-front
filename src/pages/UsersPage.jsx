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
import LoadingCircularProgress from "../components/LoadingCircularProgress";

function UsersPage() {
  const navigate = useNavigate();
  const token = useReadCookie();
  const [openDialog, setOpenDialog] = useState(false);
  const isAuthenticated = useAuth();
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [orderBy, setOrderBy] = useState("imie");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [isAddUserPanelOpen, setAddUserPanelOpen] = useState(false);
  const userRole = GetInformationFromToken("custom:role");
  const [userToDelete, setUserToDelete] = useState([]);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isEditUserPanelOpen, setIsEditUserPanelOpen] = useState(false);
  const backendServer = serverConfig["backend-server"];
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [quantityUsers, setQuantityUsers] = useState(0);

  const fetchData = useCallback(
    async (
      currentPage = page,
      rowsPerValue = rowsPerPage,
      sortBy = orderBy,
      sort = order
    ) => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendServer}/users`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: rowsPerValue,
            sortBy,
            sort,
          },
        });
        const usersList = response.data["users"];
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
        setQuantityUsers(response.data["total"]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [backendServer, token]
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData(newPage, rowsPerPage, orderBy, order);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchData(0, parseInt(event.target.value, 10), orderBy, order);
  };

  const handleOpenCloseDialog = () => setOpenDialog(!openDialog);

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await handleDeleteUser(userToDelete);
      setUserToDelete([]);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (user) => {
    setLoading(true);
    try {
      await axios.delete(`${backendServer}/users/${user._id}`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { email: user._id },
      });
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania użytkownika: " + error.message);
      setAlertSeverity("error");
    }

    try {
      await axios.delete(`${backendServer}/delete-user`, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { email: user.email },
      });
      setAlertOpen(true);
      setAlertMessage("Pomyślnie usunięto użytkownika");
      setAlertSeverity("success");
      await fetchData();
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage("Błąd podczas usuwania ofert: " + error.message);
      setAlertSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userData) => {
    setLoading(true);
    try {
      await axios.post(`${backendServer}/users`, userData, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      setAlertOpen(true);
      setAlertMessage(error.message);
      setAlertSeverity("error");
    }
    try {
      const transformedData = transformUserData(userData);
      await axios.post(`${backendServer}/create-user`, transformedData, {
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setAddUserPanelOpen(!isAddUserPanelOpen);
  };

  const transformUserData = (data) => {
    return {
      email: data.email || "",
      name: data.imie || "",
      family_name: data.nazwisko || "",
      "custom:role": data.role || "",
    };
  };

  const handleSort = (sortBy, sort) => {
    setPage(0);
    if (sortBy !== orderBy) setOrderBy(sortBy);
    if (sort !== order) setOrder(sort);
    fetchData(0, rowsPerPage, sortBy, sort);
  };

  useEffect(() => {
    if (!isAuthenticated || userRole !== "admin") navigate("/");
    else fetchData();
  }, [isAuthenticated, userRole, navigate, fetchData]);

  return (
    <div className="flex items-start justify-start h-screen ml-16 flex-col">
      <Sidebar />
      {loading && <LoadingCircularProgress />}
      <div className="flex justify-center w-full">
        <TableControlsUsers onAddUserClick={handleAddUserClick} />
      </div>
      <TableContainer
        className="ml-5"
        component={Paper}
        elevation={8}
        style={{
          width: "99.4%",
          alignSelf: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          maxHeight: "88vh",
          marginLeft: "10px",
        }}
      >
        <UsersTable
          users={users}
          loading={loading}
          onDeleteClick={handleDeleteUserClick}
          onEditClick={handleEditUserClick}
          columns={columnsUsersConfig}
          rowsPerPage={rowsPerPage}
          page={page}
          onSortApply={handleSort}
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
        count={quantityUsers}
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
