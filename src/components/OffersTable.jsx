import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
  IconButton,
} from "@mui/material";
import { Language, FileCopy } from "@mui/icons-material";
import OfferActions from "../components/OfferAction";
import CustomTableCell from "./CustomTableCell";
import statusesConfig from "../config/statusesConfig";

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
  onPaginationApply,
  onSortApply,
  quantityOffers,
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

  const filteredColumns = columns.filter((column) =>
    readConfig === 0 ? column.view === "basic" : true
  );

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

  const customTheme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "14px",
            fontFamily: "Poppins",
            fontWeight: "500",
            lineHeight: "1.5",
            backgroundColor: "#444",
            backgroundImage: "linear-gradient(145deg, #333, #555)",
            color: "#fff",
            padding: "12px 16px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  });

  const formatPhoneNumber = (number) => {
    return number.replace(/(\d{3})(?=\d)/g, "$1 ");
  };

  const copyToClipboard = (number) => {
    const formattedNumber = number.replace(/\D/g, "");
    const textarea = document.createElement("textarea");
    textarea.value = formattedNumber;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  return (
    <ThemeProvider theme={customTheme}>
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
                  paddingLeft: "14px",
                  paddingRight: "14px",
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
            ) : Array.isArray(rows) && rows.length > 0 ? (
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
                  </TableCell>{" "}
                  <OfferActions
                    row={row}
                    userRole={userRole}
                    readConfig={readConfig}
                    handleDeleteOfferClick={handleDeleteOfferClick}
                    handleEditClick={handleEditClick}
                    handleAddToCalendar={handleAddToCalendar}
                    handleUpdateOfferAgentClick={handleUpdateOfferAgentClick}
                    handleGoToOfferDetailsPage={handleGoToOfferDetailsPage}
                    showDetailsIcon={true}
                  />
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
                  {readConfig === 1 ? (
                    <CustomTableCell>
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
                  <CustomTableCell
                    sx={{
                      color:
                        statusesConfig.find(
                          (status) => status.value === row.statusOferty
                        )?.color || "black",
                      fontSize: "13px",
                    }}
                  >
                    <strong>{row.statusOferty}</strong>
                  </CustomTableCell>
                  <CustomTableCell>
                    <strong>{row.agent || ""}</strong>
                  </CustomTableCell>
                  {readConfig === 1 ? (
                    <CustomTableCell>
                      {row.komentarz && row.komentarz.length > 50 ? (
                        <Tooltip title={row.komentarz}>
                          <span>{row.komentarz.slice(0, 50)} ...</span>
                        </Tooltip>
                      ) : (
                        row.komentarz || ""
                      )}
                    </CustomTableCell>
                  ) : (
                    true
                  )}
                  {readConfig === 1 ? (
                    <CustomTableCell>
                      {row.daneWlasciciela || ""}
                    </CustomTableCell>
                  ) : (
                    true
                  )}
                  <CustomTableCell sx={{ whiteSpace: "nowrap" }}>
                    <strong>
                      <span style={{ whiteSpace: "nowrap" }}>
                        {formatPhoneNumber(row.telefonWlasciciela || "")}
                      </span>
                      {row.telefonWlasciciela && (
                        <Tooltip title="Skopiuj numer">
                          <IconButton
                            onClick={() =>
                              copyToClipboard(row.telefonWlasciciela || "")
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
                  {readConfig === 1 ? (
                    <CustomTableCell>
                      {formatNumber(row.zlM2) || ""}
                    </CustomTableCell>
                  ) : (
                    true
                  )}
                  <CustomTableCell>
                    {formatNumber(row.cena) || ""}
                  </CustomTableCell>
                  {readConfig === 1 ? (
                    <CustomTableCell>
                      {formatNumber(row.powDzialki) || ""}
                    </CustomTableCell>
                  ) : (
                    true
                  )}
                  <CustomTableCell>
                    {formatNumber(row.metraz) || ""}
                  </CustomTableCell>
                  <CustomTableCell>{row.iloscPokoi || ""}</CustomTableCell>
                  <CustomTableCell>
                    <strong>{getShortType(row.typInwestycji)}</strong>
                  </CustomTableCell>
                  {readConfig === 1 ? (
                    <CustomTableCell>
                      {getShortType(row.rynek) || ""}
                    </CustomTableCell>
                  ) : (
                    true
                  )}
                  {readConfig === 1 ? (
                    <CustomTableCell>{row.miasto || ""}</CustomTableCell>
                  ) : (
                    true
                  )}
                  <CustomTableCell>
                    <strong>{row.dzielnica || ""}</strong>
                  </CustomTableCell>
                  {readConfig === 1 ? (
                    <CustomTableCell>{row.poddzielnica || ""}</CustomTableCell>
                  ) : (
                    true
                  )}
                  <CustomTableCell>
                    <strong>{row.ulica || ""}</strong>
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
          count={quantityOffers}
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
            width: "30vw",
          }}
        />
      </TableContainer>
    </ThemeProvider>
  );
}

export default OffersTable;
