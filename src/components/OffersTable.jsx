import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Tooltip,
  Skeleton,
  TableSortLabel,
  Link,
  TablePagination,
} from "@mui/material";
import { Language } from "@mui/icons-material";
import OfferActions from "../components/OfferAction";
import CustomTableCell from "./CustomTableCell";

function OffersTable({
  rows,
  columns,
  selected,
  setSelected,
  readConfig,
  loading,
  userRole,
  handleDeleteOfferClick,
  handleEditClick,
  handleAddToCalendar,
  handleUpdateOfferAgentClick,
  handleGoToOfferDetailsPage,
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSelect = (id) => {
    if (selected.includes(id))
      setSelected(selected.filter((itemId) => itemId !== id));
    else setSelected([...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === paginatedRows.length) setSelected([]);
    else setSelected(paginatedRows.map((row) => row._id));
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
  }, [rows, order, orderBy, columns]);

  const paginatedRows = useMemo(() => {
    return Array.isArray(sortedRows)
      ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : [];
  }, [sortedRows, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredColumns = columns.filter((column) =>
    readConfig === 0 ? column.view === "basic" : true
  );
  return (
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
            {filteredColumns.map((column, index) => (
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
                {filteredColumns.map((column) => (
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
            paginatedRows.map((row, index) => (
              <TableRow
                key={row._id}
                style={{
                  "& .MuiTableRowRoot": {
                    maxHeight: "60px",
                  },
                  width: "100%",
                  background: index % 2 === 1 ? "#f5f5f5" : "white",
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
                <CustomTableCell>{row.ulica || ""}</CustomTableCell>
                <CustomTableCell>{row.dzielnica || ""}</CustomTableCell>
                {readConfig === 1 ? (
                  <CustomTableCell>{row.poddzielnica || ""}</CustomTableCell>
                ) : (
                  true
                )}
                {readConfig === 1 ? (
                  <CustomTableCell>{row.miasto || ""}</CustomTableCell>
                ) : (
                  true
                )}

                <CustomTableCell>{row.typInwestycji}</CustomTableCell>
                <CustomTableCell>{row.iloscPokoi}</CustomTableCell>
                <CustomTableCell>{row.metraz}</CustomTableCell>
                {readConfig === 1 ? (
                  <CustomTableCell>{row.powDzialki}</CustomTableCell>
                ) : (
                  true
                )}
                <CustomTableCell>{row.cena}</CustomTableCell>
                {readConfig === 1 ? (
                  <CustomTableCell>{row.zlM2}</CustomTableCell>
                ) : (
                  true
                )}
                <CustomTableCell>{row.telefonWlasciciela}</CustomTableCell>
                {readConfig === 1 ? (
                  <CustomTableCell>{row.daneWlasciciela}</CustomTableCell>
                ) : (
                  true
                )}
                {readConfig === 1 ? (
                  <CustomTableCell>{row.komentarz}</CustomTableCell>
                ) : (
                  true
                )}
                <CustomTableCell>
                  <strong>{row.agent}</strong>
                </CustomTableCell>
                {readConfig === 1 ? (
                  <CustomTableCell>{row.tworca}</CustomTableCell>
                ) : (
                  true
                )}
                <CustomTableCell
                  sx={{
                    color: (() => {
                      switch (row.statusOferty) {
                        case "Wolny":
                          return "green";
                        case "Zajęty":
                          return "red";
                        case "Chętny":
                          return "#FFA500";
                        case "Spotkanie":
                          return "#1E90FF";
                        case "W kontakcie":
                          return "#8A2BE2";
                        case "Był kontakt":
                          return "#004400";
                        default:
                          return "black";
                      }
                    })(),
                    fontSize: "13px",
                  }}
                >
                  <strong>{row.statusOferty}</strong>
                </CustomTableCell>
                {readConfig === 1 ? (
                  <CustomTableCell>
                    {row.dataKontaktu ? (
                      <>
                        {new Date(row.dataKontaktu).toLocaleDateString(
                          "pl-PL",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}{" "}
                        <strong>
                          <br />
                          {new Date(row.dataKontaktu).toLocaleTimeString(
                            "pl-PL",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </strong>
                      </>
                    ) : (
                      ""
                    )}
                  </CustomTableCell>
                ) : (
                  true
                )}
                {readConfig === 1 ? (
                  <CustomTableCell>
                    {row.dataNastepnegoKontaktu ? (
                      <>
                        {new Date(
                          row.dataNastepnegoKontaktu
                        ).toLocaleDateString("pl-PL", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}{" "}
                        <strong>
                          <br />
                          {new Date(
                            row.dataNastepnegoKontaktu
                          ).toLocaleTimeString("pl-PL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </>
                    ) : (
                      ""
                    )}
                  </CustomTableCell>
                ) : (
                  true
                )}
                {readConfig === 1 ? (
                  <CustomTableCell>
                    {new Date(row.dataUtworzenia).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
                    <strong>
                      <br />
                      {new Date(row.dataUtworzenia).toLocaleTimeString(
                        "pl-PL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </strong>
                  </CustomTableCell>
                ) : (
                  true
                )}
                {readConfig === 1 ? (
                  <CustomTableCell>
                    {row.linkOferta ? (
                      <Link href={row.linkOferta} target="_blank">
                        <Tooltip title={row.linkOferta}>
                          <Language sx={{ color: "#FC8721" }} />
                        </Tooltip>
                      </Link>
                    ) : (
                      ""
                    )}
                  </CustomTableCell>
                ) : (
                  true
                )}
                <OfferActions
                  row={row}
                  userRole={userRole}
                  readConfig={readConfig}
                  handleDeleteOfferClick={handleDeleteOfferClick}
                  handleEditClick={handleEditClick}
                  handleAddToCalendar={handleAddToCalendar}
                  handleUpdateOfferAgentClick={handleUpdateOfferAgentClick}
                  handleGoToOfferDetailsPage={handleGoToOfferDetailsPage}
                />
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
          right: 43.2,
          zIndex: 1000,
          width: "35%",
        }}
      />
    </TableContainer>
  );
}

export default OffersTable;
