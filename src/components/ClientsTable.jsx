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
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import CustomTableCell from "./CustomTableCell";
import { CheckBox, FileCopy } from "@mui/icons-material";

function ClientsTable({ rows, columns, selected, setSelected, readConfig }) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dataUtworzenia");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleSortRequest = (columnId) => {
    const isDesc = orderBy === columnId && order === "desc";
    isDesc ? setOrder("asc") : setOrder("desc");
    setOrderBy(columnId);
    // onSortApply(0, rowsPerPage, columnId, isDesc ? "asc" : "desc");
  };

  const filteredColumns = columns.filter((column) =>
    readConfig === 0 ? column.view === "basic" : true
  );

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
                  <TableCell>
                    <CheckBox />
                  </TableCell>
                  <TableCell></TableCell>
                  <CustomTableCell>
                    {new Date(row.dataZapytania).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
                    <strong>
                      <br />
                      {new Date(row.dataZapytania).toLocaleTimeString("pl-PL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </strong>
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
                  <CustomTableCell>{row.adresEmail || ""}</CustomTableCell>
                  <CustomTableCell>{row.numerGalactica || ""}</CustomTableCell>
                  <CustomTableCell>{row.nrOfertyLink || ""}</CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.status || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.agent || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.lokalizacja || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.rodzajNieruchomosci || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>{row.iloscPokoiOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.iloscPokoiDo || ""}</CustomTableCell>
                  <CustomTableCell>{row.metrazOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.metrazDo || ""}</CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.standard || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>{row.budzetOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.budzetDo || ""}</CustomTableCell>
                  <CustomTableCell>
                    {new Date(row.ostatniKontakt).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
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
                  </CustomTableCell>
                  <CustomTableCell>
                    {new Date(row.dataNastepnegoKontaktu).toLocaleDateString(
                      "pl-PL",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}{" "}
                    <strong>
                      <br />
                      {new Date(row.dataNastepnegoKontaktu).toLocaleTimeString(
                        "pl-PL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </strong>
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
      </TableContainer>
    </ThemeProvider>
  );
}

export default ClientsTable;
