import { useState, useRef, useEffect } from "react";
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
import { formatPhoneNumberForDisplay } from "../utils/formatPhoneNumber";

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
  userRole,
  downloadPDF,
  page,
  itemsPerPage,
  orderBy,
  order,
  clientColumnConfig,
}) {
  const containerRef = useRef(null);

  const scrollToTop = (smooth = true) => {
    try {
      if (containerRef.current) {
        if (smooth && containerRef.current.scrollTo) {
          containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          containerRef.current.scrollTop = 0;
        }
      }
    } catch (e) {
      // ignore
    }
  };
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
    onSortApply(0, itemsPerPage, columnId, isDesc ? "asc" : "desc");
    scrollToTop();
  };

  const handleChangePage = (event, newPage) => {
    onPaginationApply(newPage, itemsPerPage);
    scrollToTop();
  };

  const handleChangeRowsPerPage = (event) => {
    const newRows = parseInt(event.target.value, 10);
    onPaginationApply(0, newRows);
    scrollToTop();
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
      case "Bliźniak":
        return "B";
      case "Szeregowy":
        return "Sz";
      default:
        return type;
    }
  };

  const formatPhoneNumber = (number) => formatPhoneNumberForDisplay(number);

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

  const handleAddToCalendar = (row) => {
    const eventTitle = row.daneKlienta + " " + row.numerTelefonu;

    const startDate = new Date(row.dataNastepnegoKontaktu);
    startDate.setHours(12, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const formatDateForCalendar = (date) =>
      date
        .toISOString()
        .replace(/[-:.]/g, "")
        .slice(0, 15) + "Z";

    const formattedStartDate = formatDateForCalendar(startDate);
    const formattedEndDate = formatDateForCalendar(endDate);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle,
    )}&dates=${formattedStartDate}/${formattedEndDate}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  // Scroll to top when rows change (covers filtering and external updates)
  useEffect(() => {
    // smooth scroll when rows or total changes
    scrollToTop(true);
  }, [rows, quantityClients]);

  return (
    <ThemeProvider theme={customTooltip}>
      <TableContainer
        ref={containerRef}
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
              {loading ? (
                <>
                  {" "}
                  <TableCell key={"checkbox"}>
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={16}
                      sx={{ backgroundColor: "white" }}
                    />
                  </TableCell>
                  <TableCell key={"narzedzia"}>
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={16}
                      sx={{ backgroundColor: "white" }}
                    />
                  </TableCell>
                  {Array.from({ length: 20 }).map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton
                        variant="rounded"
                        width="100%"
                        height={16}
                        sx={{ backgroundColor: "white" }}
                      />
                    </TableCell>
                  ))}
                </>
              ) : (
                <>
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
                      <span>Oferty</span>
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
                      <span>Narzędzia</span>
                    </Tooltip>
                  </TableCell>
                  {clientColumnConfig
                    .filter((column) => column.isVisible)
                    .map((column) => (
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
                              <span>{column.shortLabel}</span>
                            </Tooltip>
                          </TableSortLabel>
                        ) : (
                          <Tooltip arrow title={column.label}>
                            <span>{column.shortLabel}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                    ))}
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(itemsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell key={"checkbox"}>
                      <Skeleton variant="rounded" width="100%" height={16} />
                    </TableCell>
                    <TableCell key={"narzedzia"}>
                      <Skeleton variant="rounded" width="100%" height={16} />
                    </TableCell>
                    {Array.from({ length: 20 }).map((_, index) => (
                      <TableCell key={index}>
                        <Skeleton variant="rounded" width="100%" height={16} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : null}
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
                      row.listings.length > 0
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
                          badgeContent={row.listings.length}
                          max={10000}
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
                    userRole={userRole}
                    handleAddToCalendar={handleAddToCalendar}
                    downloadPDF={downloadPDF}
                  />
                  {clientColumnConfig
                    .filter((column) => column.isVisible)
                    .map((column) => (
                      <CustomTableCell
                        key={column.id}
                        sx={
                          column.id === "numerTelefonu"
                            ? { whiteSpace: "nowrap" }
                            : {}
                        }
                      >
                        {(() => {
                          const value = row[column.id];
                          switch (column.id) {
                            case "dataUtworzenia":
                            case "dataZapytania":
                            case "ostatniKontakt":
                            case "dataNastepnegoKontaktu":
                              return value
                                ? new Date(value).toLocaleDateString("pl-PL", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })
                                : "";
                            case "daneKlienta":
                              return value || "";
                            case "numerTelefonu":
                              return (
                                <strong>
                                  {Array.isArray(value) &&
                                  value.some((n) => n !== "") ? (
                                    value.map((number, idx) => (
                                      <div
                                        key={idx}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px",
                                        }}
                                      >
                                        <span>
                                          {number
                                            ? formatPhoneNumber(number)
                                            : "–"}
                                        </span>
                                        <Tooltip arrow title="Skopiuj numer">
                                          <IconButton
                                            onClick={() =>
                                              copyToClipboard(number)
                                            }
                                            sx={{ padding: "6px" }}
                                            disabled={number === ""}
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
                              );
                            case "email":
                              return value ? (
                                <a
                                  href={`mailto:${value}`}
                                  style={{
                                    color: "#1976d2",
                                    textDecoration: "none",
                                    fontWeight: "500",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.textDecoration =
                                      "underline")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.textDecoration =
                                      "none")
                                  }
                                >
                                  {value}
                                </a>
                              ) : (
                                ""
                              );
                            case "komentarzDataList":
                              return Array.isArray(value) &&
                                value.at(-1)?.tekst ? (
                                value.at(-1).tekst.length > 50 ? (
                                  <Tooltip arrow title={value.at(-1).tekst}>
                                    <span>
                                      {value.at(-1).tekst.slice(0, 50)} ...
                                    </span>
                                  </Tooltip>
                                ) : (
                                  value.at(-1).tekst
                                )
                              ) : (
                                ""
                              );
                            case "numerGalactica":
                              return value || "";
                            case "status":
                              return (
                                <span
                                  style={{
                                    color:
                                      clientStatuesConfig.find(
                                        (status) => status.value === value,
                                      )?.color || "black",
                                    fontSize: "13px",
                                  }}
                                >
                                  <strong>{value || ""}</strong>
                                </span>
                              );
                            case "agent":
                              return <strong>{value || ""}</strong>;
                            case "komentarz":
                              return value && value.length > 50 ? (
                                <Tooltip arrow title={value}>
                                  <span>{value.slice(0, 50)} ...</span>
                                </Tooltip>
                              ) : (
                                value || ""
                              );
                            case "portal":
                              return <strong>{value || ""}</strong>;
                            case "lokalizacja":
                              return (
                                <Tooltip
                                  arrow
                                  title={
                                    <Typography
                                      sx={{
                                        whiteSpace: "pre-line",
                                        fontSize: "14px",
                                      }}
                                    >
                                      {value?.split(",").join("\n")}
                                    </Typography>
                                  }
                                >
                                  <strong>
                                    {value
                                      ?.split(",")
                                      .slice(0, 3)
                                      .join(", ")}
                                    <span>
                                      {value?.split(",").length > 3
                                        ? "..."
                                        : ""}
                                    </span>
                                  </strong>
                                </Tooltip>
                              );
                            case "rodzajNieruchomosci":
                              return (
                                <strong>{getShortType(value) || ""}</strong>
                              );
                            case "iloscPokoiOd":
                            case "iloscPokoiDo":
                              return value || "";
                            case "metrazOd":
                            case "metrazDo":
                              return formatNumber(value) || "";
                            case "standard":
                              // Ujednolicamy format danych (string -> array)
                              const standards = Array.isArray(value)
                                ? value
                                : typeof value === "string"
                                ? value.split(",").map((s) => s.trim())
                                : [];
                              // Przygotowujemy kolory i etykiety
                              const coloredStandards = standards.map(
                                (standard) => {
                                  const color =
                                    clientStandardConfig.find(
                                      (s) => s.value === standard,
                                    )?.color || "black";
                                  return { label: standard, color };
                                },
                              );
                              // Tworzymy zawartość do wyświetlenia (max 3 elementy)
                              const visibleStandards = coloredStandards.slice(
                                0,
                                3,
                              );
                              const hiddenStandards = coloredStandards.slice(3);
                              return (
                                <Tooltip
                                  arrow
                                  title={
                                    hiddenStandards.length > 0 && (
                                      <div
                                        style={{
                                          fontFamily: "Poppins",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {coloredStandards.map((s, i) => (
                                          <div
                                            key={i}
                                            style={{ color: s.color }}
                                          >
                                            <span>{s.label}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )
                                  }
                                  placement="top"
                                >
                                  <strong>
                                    {visibleStandards.map((s, i) => (
                                      <span
                                        key={i}
                                        style={{
                                          color: s.color,
                                          marginRight: "6px",
                                        }}
                                      >
                                        <span>{s.label}</span>
                                        <span>
                                          {i < visibleStandards.length - 1 &&
                                            ", "}
                                        </span>
                                      </span>
                                    ))}
                                    {hiddenStandards.length > 0 && (
                                      <span>...</span>
                                    )}
                                  </strong>
                                </Tooltip>
                              );
                            case "budzetOd":
                            case "budzetDo":
                              return formatNumber(value) || "";
                            default:
                              return value || "";
                          }
                        })()}
                      </CustomTableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={clientColumnConfig.length + 2}
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
          rowsPerPage={itemsPerPage}
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
            zIndex: 30,
            width: "50%",
          }}
        />
      </TableContainer>
    </ThemeProvider>
  );
}

export default ClientsTable;
