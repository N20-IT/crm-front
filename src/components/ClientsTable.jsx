import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { customTooltip } from "../styles/CustomTooltip";
import {
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import CustomTableCell from "./CustomTableCell";
import { FileCopy, OpenInNew } from "@mui/icons-material";
import ClientAction from "./ClientAction";
import clientStatuesConfig from "../config/clientStatuesConfig";
import clientStandardConfig from "../config/clientStandardConfig";

function ClientsTable({
  rows,
  columns,
  selected,
  setSelected,
  readConfig,
  quantityClients,
  onPaginationApply,
  handleDeleteClientClick,
  handleEditClientClick,
}) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dataUtworzenia");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleSelect = (id) => {
    if (selected.includes(id))
      setSelected(selected.filter((itemId) => itemId !== id));
    else setSelected([...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === rows.length) setSelected([]);
    else setSelected(rows.map((row) => row._id));
  };

  const handleSortRequest = (columnId) => {
    const isDesc = orderBy === columnId && order === "desc";
    isDesc ? setOrder("asc") : setOrder("desc");
    setOrderBy(columnId);
    // onSortApply(0, rowsPerPage, columnId, isDesc ? "asc" : "desc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    onPaginationApply(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    onPaginationApply(0, parseInt(event.target.value, 10));
  };

  const filteredColumns = columns.filter((column) =>
    readConfig === 0 ? column.view === "basic" : true
  );

  const getShortType = (type) => {
    switch (type) {
      case "Dom":
        return "D";
      case "Mieszkanie":
        return "M";
      case "Działka":
        return "Dz";
      case "Lokal":
        return "L";
      case "Pierwotny":
        return "P";
      case "Wtórny":
        return "W";
      default:
        return type;
    }
  };

  const formatPhoneNumber = (number) => {
    return String(number).replace(/(\d{3})(?=\d)/g, "$1 ");
  };

  const copyToClipboard = (number) => {
    const formattedNumber = String(number).replace(/\D/g, "");
    const textarea = document.createElement("textarea");
    textarea.value = formattedNumber;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  return (
    <ThemeProvider theme={customTooltip}>
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
                    padding: "0px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                />
              </TableCell>
              <TableCell
                key="narzedzia"
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  padding: "0px",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                }}
              >
                <Tooltip title="Narzędzia">Narzędzia</Tooltip>
              </TableCell>
              {filteredColumns.map((column, index) => (
                <TableCell
                  key={column.id}
                  sx={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    padding: "0px",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                  }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order === "asc" ? "asc" : "desc"}
                      onClick={() => handleSortRequest(column.id)}
                      sx={{
                        color: "white !important",
                        fontSize: "13px",
                        paddingLeft: "20px",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      <Tooltip title={column.label}>
                        {column.shortLabel}
                      </Tooltip>
                    </TableSortLabel>
                  ) : (
                    <Tooltip title={column.label}>{column.shortLabel}</Tooltip>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(rows) && rows.length > 0 ? (
              rows.map((row, index) => (
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
                  <ClientAction
                    row={row}
                    handleDeleteClientClick={handleDeleteClientClick}
                    handleEditClientClick={handleEditClientClick}
                  />
                  <CustomTableCell>
                    {row.dataZapytania ? (
                      <>
                        {new Date(row.dataZapytania).toLocaleDateString(
                          "pl-PL",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}{" "}
                        <strong>
                          <br />
                          {new Date(row.dataZapytania).toLocaleTimeString(
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
                  <CustomTableCell>{row.daneKlienta || ""}</CustomTableCell>
                  <CustomTableCell sx={{ whiteSpace: "nowrap" }}>
                    <strong>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {formatPhoneNumber(row.numerTelefonu || "")}
                      </span>
                      {row.numerTelefonu && (
                        <Tooltip title="Skopiuj numer">
                          <IconButton
                            onClick={() =>
                              copyToClipboard(row.numerTelefonu || "")
                            }
                            sx={{
                              padding: "6px",
                            }}
                          >
                            <FileCopy />
                          </IconButton>
                        </Tooltip>
                      )}
                    </strong>
                  </CustomTableCell>
                  <CustomTableCell>{row.email || ""}</CustomTableCell>
                  <CustomTableCell>{row.numerGalactica || ""}</CustomTableCell>
                  <CustomTableCell>
                    {row.nrOfertyLink ? (
                      <Tooltip title={row.nrOfertyLink || ""}>
                        <IconButton>
                          <OpenInNew />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                  </CustomTableCell>
                  <CustomTableCell
                    sx={{
                      color:
                        clientStatuesConfig.find(
                          (status) => status.value === row.status
                        )?.color || "black",
                      fontSize: "13px",
                    }}
                  >
                    <strong>{row.status || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.agent || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.lokalizacja || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>
                      {getShortType(row.rodzajNieruchomosci) || ""}
                    </strong>
                  </CustomTableCell>
                  <CustomTableCell>{row.iloscPokoiOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.iloscPokoiDo || ""}</CustomTableCell>
                  <CustomTableCell>{row.metrazOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.metrazDo || ""}</CustomTableCell>
                  <CustomTableCell
                    sx={{
                      color:
                        clientStandardConfig.find(
                          (standard) => standard.value == row.standard
                        )?.color || "black",
                    }}
                  >
                    <strong>{row.standard || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>{row.budzetOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.budzetDo || ""}</CustomTableCell>
                  <CustomTableCell>
                    {row.ostatniKontakt ? (
                      <>
                        {new Date(row.ostatniKontakt).toLocaleDateString(
                          "pl-PL",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}{" "}
                        <strong>
                          <br />
                          {new Date(row.ostatniKontakt).toLocaleTimeString(
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
        {/* Do poprawy */}
        <TablePagination
          component="div"
          count={quantityClients}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Wiersze na stronę"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} z ${count}`
          }
          showFirstButton
          showLastButton
          sx={{
            position: "fixed",
            bottom: 0,
            right: 43.2,
            zIndex: 1000,
            width: "50%",
          }}
        />
      </TableContainer>
    </ThemeProvider>
  );
}

export default ClientsTable;
