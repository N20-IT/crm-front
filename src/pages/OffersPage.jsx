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
} from "@mui/material";
import { Delete, Edit, Star, CalendarMonth, Map } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/auth";
import Sidebar from "../components/Sidebar";
function OffersPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
      id: "pokoje",
      label: "Ilość pokoi",
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
      id: "telefon",
      label: "Telefon",
    },
    {
      id: "komentarz",
      label: "Komentarz",
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "narzedzia",
      label: "Narzędzia",
    },
  ];

  const rows = [
    {
      id: 1,
      ulica: "Ulica 1",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fsddff",
      status: "aktywna",
    },
    {
      id: 2,
      ulica: "Ulica 1",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 3,
      ulica: "Ulica 1",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 4,
      ulica: "Ulica 1",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 5,
      ulica: "Ulica 1",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 6,
      ulica: "Ulica 6",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 7,
      ulica: "Ulica 7",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 8,
      ulica: "Ulica 8",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 9,
      ulica: "Ulica 8",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 10,
      ulica: "Ulica 8",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
    {
      id: 11,
      ulica: "Ulica 8",
      dzielnica: "dzielnica 1",
      pokoje: 2,
      metraz: "20m2",
      cena: "200000 zł",
      telefon: "123 456 789",
      komentarz: "fdf",
      status: "aktywna",
    },
  ];

  const handleSelect = (id) => {
    if (selected.includes(id))
      setSelected(selected.filter((itemId) => itemId !== id));
    else setSelected([...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === rows.length) setSelected([]);
    else setSelected(rows.map((row) => row.id));
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

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

  return (
    <div className=" flex items-start justify-start h-screen ml-48 flex-col">
      <Sidebar />
      <h1 className=" font-bold text-5xl">Oferty</h1>
      <TableContainer
        component={Paper}
        elevation={8}
        style={{ width: "95%", alignSelf: "center", borderRadius: "10px" }}
      >
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
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ textAlign: "center" }}>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={() => handleSelect(row.id)}
                    sx={{
                      color: "#272F3E",
                      "&.Mui-checked": {
                        color: "#272F3E",
                      },
                    }}
                  />
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.ulica}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.dzielnica}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.pokoje}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.metraz}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.cena}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.telefon}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.komentarz}
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  {row.status}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                  }}
                >
                  <Tooltip title="Usuń">
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edytuj">
                    <IconButton>
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
    </div>
  );
}

export default OffersPage;
