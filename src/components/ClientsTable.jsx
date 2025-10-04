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
  Typography,
  Skeleton,
  Badge,
} from "@mui/material";
import CustomTableCell from "./CustomTableCell";
import { FileCopy, OpenInNew } from "@mui/icons-material";
import ClientAction from "./ClientAction";
import clientStatuesConfig from "../config/clientStatuesConfig";
import clientStandardConfig from "../config/clientStandardConfig";
import { useNavigate } from "react-router-dom";
import { useFiltersStore } from "../store/filtersStore";

function ClientsTable({
  rows,
  columns,
  selected,
  setSelected,
  quantityClients,
  onPaginationApply,
  onSortApply,
  handleDeleteClientClick,
  handleEditClientClick,
  loading,
  handleGoToClientDetails,
}) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dataZapytania");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const navigate = useNavigate();
  const { setClientId } = useFiltersStore();

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
    onSortApply(0, rowsPerPage, columnId, isDesc ? "asc" : "desc");
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

  const formatNumber = (value) =>
    value
      ? value.toLocaleString("pl-PL", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

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

  const handleMatchClient = (clientId) => {
    setClientId(clientId);
    navigate("/oferty");
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
                key="nrOfertyLink"
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  padding: "0px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                <Tooltip arrow title="Wybrane oferty">
                  Oferty
                </Tooltip>
              </TableCell>
              <TableCell
                key="narzedzia"
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  padding: "0px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                <Tooltip arrow title="Narzędzia">
                  Narzędzia
                </Tooltip>
              </TableCell>
              {columns.map((column, index) => (
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
                      <Tooltip arrow title={column.label}>
                        {column.shortLabel}
                      </Tooltip>
                    </TableSortLabel>
                  ) : (
                    <Tooltip arrow title={column.label}>
                      {column.shortLabel}
                    </Tooltip>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(rowsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell key={"checkbox"}>
                      <Skeleton variant="rounded" width="100%" height={16} />
                    </TableCell>
                    <TableCell key={"narzedzia"}>
                      <Skeleton variant="rounded" width="100%" height={16} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="rounded" width="100%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : true}
            {Array.isArray(rows) && rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={row._id}
                  style={{
                    "& .MuiTableRowRoot": {
                      maxHeight: "60px",
                    },
                    width: "100%",
                    background:
                      row.noweOfertyLiczba > 0
                        ? "#E6FFD7"
                        : index % 2 === 1
                        ? "#f5f5f5"
                        : "white",
                  }}
                >
                  <CustomTableCell style={{ whiteSpace: "nowrap" }}>
                    <Tooltip arrow title={"Dobierz oferty"}>
                      <IconButton onClick={() => handleMatchClient(row._id)}>
                        <Badge
                          badgeContent={row.noweOfertyLiczba}
                          max={1000}
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: "#FC8721",
                              color: "white",
                              zIndex: 0,
                            },
                          }}
                        >
                          <OpenInNew />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </CustomTableCell>

                  <ClientAction
                    row={row}
                    handleDeleteClientClick={handleDeleteClientClick}
                    handleEditClientClick={handleEditClientClick}
                    handleGoToClientDetails={handleGoToClientDetails}
                    showDetailsIcon={true}
                  />
                  <CustomTableCell>
                    {row.dataUtworzenia ? (
                      <>
                        {new Date(row.dataUtworzenia).toLocaleDateString(
                          "pl-PL",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}{" "}
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
                      </>
                    ) : (
                      ""
                    )}
                  </CustomTableCell>
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
                  <CustomTableCell>{row.daneKlienta || ""}</CustomTableCell>
                  <CustomTableCell sx={{ whiteSpace: "nowrap" }}>
                    <strong>
                      {Array.isArray(row.numerTelefonu) &&
                      row.numerTelefonu.length > 0 ? (
                        row.numerTelefonu.map((number, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>{formatPhoneNumber(number)}</span>
                            <Tooltip arrow title="Skopiuj numer">
                              <IconButton
                                onClick={() => copyToClipboard(number)}
                                sx={{ padding: "6px" }}
                              >
                                <FileCopy />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ))
                      ) : (
                        <span>Brak numeru</span>
                      )}
                    </strong>
                  </CustomTableCell>

                  <CustomTableCell>
                    {row.email ? (
                      <a
                        href={`mailto:${row.email}`}
                        style={{
                          color: "#1976d2",
                          textDecoration: "none",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        {row.email}
                      </a>
                    ) : (
                      ""
                    )}
                  </CustomTableCell>
                  <CustomTableCell>
                    {row.komentarzData && row.komentarzData.length > 50 ? (
                      <Tooltip arrow title={row.komentarzData}>
                        <span>{row.komentarzData.slice(0, 50)} ...</span>
                      </Tooltip>
                    ) : (
                      row.komentarzData || ""
                    )}
                  </CustomTableCell>
                  <CustomTableCell>{row.numerGalactica || ""}</CustomTableCell>
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
                    {row.komentarz && row.komentarz.length > 50 ? (
                      <Tooltip arrow title={row.komentarz}>
                        <span>{row.komentarz.slice(0, 50)} ...</span>
                      </Tooltip>
                    ) : (
                      row.komentarz || ""
                    )}
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.portal || ""}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <Tooltip
                      arrow
                      title={
                        <Typography
                          sx={{ whiteSpace: "pre-line", fontSize: "14px" }}
                        >
                          {row.lokalizacja?.split(",").join("\n")}
                        </Typography>
                      }
                    >
                      <strong>
                        {row.lokalizacja
                          ?.split(",")
                          .slice(0, 3)
                          .join(", ")}
                        {row.lokalizacja?.split(",").length > 3 ? "..." : ""}
                      </strong>
                    </Tooltip>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>
                      {getShortType(row.rodzajNieruchomosci) || ""}
                    </strong>
                  </CustomTableCell>
                  <CustomTableCell>{row.iloscPokoiOd || ""}</CustomTableCell>
                  <CustomTableCell>{row.iloscPokoiDo || ""}</CustomTableCell>
                  <CustomTableCell>
                    {formatNumber(row.metrazOd) || ""}
                  </CustomTableCell>
                  <CustomTableCell>
                    {formatNumber(row.metrazDo) || ""}
                  </CustomTableCell>
                  <CustomTableCell>
                    {(() => {
                      // Ujednolicamy format danych (string -> array)
                      const standards = Array.isArray(row.standard)
                        ? row.standard
                        : typeof row.standard === "string"
                        ? row.standard.split(",").map((s) => s.trim())
                        : [];

                      // Przygotowujemy kolory i etykiety
                      const coloredStandards = standards.map((standard) => {
                        const color =
                          clientStandardConfig.find((s) => s.value === standard)
                            ?.color || "black";
                        return { label: standard, color };
                      });

                      // Tworzymy zawartość do wyświetlenia (max 3 elementy)
                      const visibleStandards = coloredStandards.slice(0, 3);
                      const hiddenStandards = coloredStandards.slice(3);

                      return (
                        <Tooltip
                          arrow
                          title={
                            hiddenStandards.length > 0 ? (
                              <div
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                }}
                              >
                                {coloredStandards.map((s, i) => (
                                  <div key={i} style={{ color: s.color }}>
                                    {s.label}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              ""
                            )
                          }
                          placement="top"
                        >
                          <strong>
                            {visibleStandards.map((s, i) => (
                              <span
                                key={i}
                                style={{ color: s.color, marginRight: "6px" }}
                              >
                                {s.label}
                                {i < visibleStandards.length - 1 && ", "}
                              </span>
                            ))}
                            {hiddenStandards.length > 0 && <span>...</span>}
                          </strong>
                        </Tooltip>
                      );
                    })()}
                  </CustomTableCell>
                  <CustomTableCell>
                    {formatNumber(row.budzetOd) || ""}
                  </CustomTableCell>
                  <CustomTableCell>
                    {formatNumber(row.budzetDo) || ""}
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
