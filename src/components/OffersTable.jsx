import React, { useRef, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { customTooltip } from "../styles/CustomTooltip";
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
  Badge,
} from "@mui/material";
import { Language, FileCopy, OpenInNew } from "@mui/icons-material";
import OfferActions from "../components/OfferAction";
import CustomTableCell from "./CustomTableCell";
import statusesConfig from "../config/statusesConfig";
import { useClientFiltersStore } from "../store/clientFilterStore";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumberForDisplay } from "../utils/formatPhoneNumber";

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
  handleChangeOfferInterestClick,
  handleGoToOfferDetailsPage,
  onPaginationApply,
  onSortApply,
  quantityOffers,
  handleAssignmentOfferToClientClick,
  downloadPDF,
  page,
  itemsPerPage,
  orderBy,
  order,
  offerColumnConfig,
}) {
  const handleSelect = (id) => {
    if (selected.includes(id))
      setSelected(selected.filter((itemId) => itemId !== id));
    else setSelected([...selected, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === rows.length) setSelected([]);
    else setSelected(rows.map((row) => row._id));
  };

  const safePage = Number.isFinite(Number(page)) ? Number(page) : 0;
  const safeItemsPerPage = Number.isFinite(Number(itemsPerPage))
    ? Number(itemsPerPage)
    : 25;

  const handleSortRequest = (columnId) => {
    const isDesc = orderBy === columnId && order === "desc";
    onSortApply(0, safeItemsPerPage, columnId, isDesc ? "asc" : "desc");
    scrollToTop();
  };

  const containerRef = useRef(null);

  const { setOfferId } = useClientFiltersStore();
  const navigate = useNavigate();

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

  const handleChangePage = (event, newPage) => {
    onPaginationApply(newPage, safeItemsPerPage);
    scrollToTop();
  };

  const handleChangeRowsPerPage = (event) => {
    const newRows = parseInt(event.target.value, 10);
    onPaginationApply(0, newRows);
    scrollToTop();
  };

  // Scroll to top when rows change (covers filtering and external updates)
  useEffect(() => {
    // Use immediate jump to top when data updates
    try {
      if (containerRef.current) containerRef.current.scrollTop = 0;
    } catch (e) {
      // ignore
    }
  }, [rows, quantityOffers]);

  const filteredColumns = columns.filter((column) =>
    readConfig === 0 ? column.view === "basic" : true,
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

  const formatPhoneNumber = (number) => formatPhoneNumberForDisplay(number);

  const copyToClipboard = (value) => {
    const isEmail = value.includes("@");

    const toCopy = isEmail ? value : value.replace(/\D/g, "");

    const textarea = document.createElement("textarea");
    textarea.value = toCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleMatchOffer = (offerId) => {
    setOfferId(offerId);
    navigate("/klienci");
  };

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
              zIndex: 1100,
            }}
          >
            <TableRow>
              {loading ? (
                <>
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
                  {userRole === "admin" && (
                    <TableCell
                      padding="checkbox"
                      style={{
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      <Checkbox
                        checked={selected?.length === rows?.length}
                        indeterminate={
                          selected.length > 0 && selected.length < rows.length
                        }
                        onChange={handleSelectAll}
                        style={{
                          color: "white",
                          padding: "0px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          position: "relative",
                          zIndex: 1100,
                        }}
                      />
                    </TableCell>
                  )}
                  {/* <TableCell
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
                      <span>Klienci</span>
                    </Tooltip>
                  </TableCell> */}
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
                    <Tooltip title="Narzędzia">
                      <span>Narzędzia</span>
                    </Tooltip>
                  </TableCell>
                  {offerColumnConfig
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
                            <Tooltip title={column.label}>
                              <span> {column.shortLabel}</span>
                            </Tooltip>
                          </TableSortLabel>
                        ) : (
                          <Tooltip title={column.label}>
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
            {loading ? (
              [...Array(safeItemsPerPage)].map((_, index) => (
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
                  {userRole === "admin" && (
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
                  )}

                  {/* <CustomTableCell style={{ whiteSpace: "nowrap" }}>
                    <Tooltip arrow title={"Dobierz klientów"}>
                      <IconButton onClick={() => handleMatchOffer(row._id)}>
                        <Badge
                          badgeContent={row.nowiKlienciLiczba}
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
                  </CustomTableCell> */}
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
                    handleChangeOfferInterestClick={
                      handleChangeOfferInterestClick
                    }
                    handleAssignmentOfferToClientClick={
                      handleAssignmentOfferToClientClick
                    }
                    downloadPDF={downloadPDF}
                  />
                  {offerColumnConfig
                    .filter((column) => column.isVisible)
                    .map((column) => (
                      <CustomTableCell key={column.id}>
                        {(() => {
                          const value = row[column.id];
                          switch (column.id) {
                            case "linkOferta":
                              return value ? (
                                <Link href={value} target="_blank">
                                  <Tooltip title={value}>
                                    <Language sx={{ color: "#FC8721" }} />
                                  </Tooltip>
                                </Link>
                              ) : (
                                ""
                              );
                            case "dataUtworzenia":
                            case "dataNastepnegoKontaktu":
                            case "dataKontaktu":
                              return value ? (
                                <>
                                  {new Date(value).toLocaleDateString("pl-PL", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  })}
                                  <strong>
                                    <br />
                                    {new Date(value).toLocaleTimeString(
                                      "pl-PL",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </strong>
                                </>
                              ) : (
                                ""
                              );
                            case "status":
                              return (
                                <span
                                  style={{
                                    color:
                                      statusesConfig.find(
                                        (status) =>
                                          status.value === row.statusOferty,
                                      )?.color || "black",
                                    fontSize: "13px",
                                  }}
                                >
                                  <strong>{row.statusOferty}</strong>
                                </span>
                              );
                            case "agent":
                              return <strong>{row.agent || ""}</strong>;
                            case "komentarz":
                              return value && value.length > 50 ? (
                                <Tooltip title={value}>
                                  <span>{value.slice(0, 50)} ...</span>
                                </Tooltip>
                              ) : (
                                value || ""
                              );
                            case "daneWlasciciela":
                              return value || "";
                            case "telefonDoWlasciciela":
                            case "telefonWlasciciela":
                              return (
                                <strong>
                                  {Array.isArray(row.telefonWlasciciela) &&
                                  row.telefonWlasciciela.length > 0 ? (
                                    row.telefonWlasciciela.map((val, idx) =>
                                      val !== "" ? (
                                        <div
                                          key={idx}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                          }}
                                        >
                                          <span
                                            style={{ whiteSpace: "nowrap" }}
                                          >
                                            {val.includes("@")
                                              ? val
                                              : formatPhoneNumber(val)}{" "}
                                          </span>
                                          <Tooltip title="Skopiuj">
                                            <IconButton
                                              onClick={() =>
                                                copyToClipboard(val)
                                              }
                                              sx={{ padding: "6px" }}
                                            >
                                              <FileCopy />
                                            </IconButton>
                                          </Tooltip>
                                        </div>
                                      ) : (
                                        <span key={idx}>Brak</span>
                                      ),
                                    )
                                  ) : (
                                    <span>Brak</span>
                                  )}
                                </strong>
                              );
                            case "zlM2":
                            case "cena":
                            case "powDzialki":
                            case "metraz":
                              return formatNumber(value) || "";
                            case "iloscPokoi":
                              return value || "";
                            case "typInwestycji":
                            case "rynek":
                              return <strong>{getShortType(value)}</strong>;
                            case "miasto":
                            case "dzielnica":
                            case "poddzielnica":
                            case "ulica":
                              return <strong>{value || ""}</strong>;
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
          page={safePage}
          onPageChange={handleChangePage}
          rowsPerPage={safeItemsPerPage}
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

export default OffersTable;
