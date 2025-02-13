import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Skeleton,
  TableSortLabel,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import CustomTableCell from "./CustomTableCell";

function UsersTable({
  users,
  loading,
  onDeleteClick,
  onEditClick,
  columns,
  rowsPerPage,
  page,
  onSortApply,
}) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("imie");

  const handleSortRequest = (columnId) => {
    const isDesc = orderBy === columnId && order === "desc";
    isDesc ? setOrder("asc") : setOrder("desc");
    setOrderBy(columnId);
    onSortApply(columnId, isDesc ? "asc" : "desc");
  };
  return (
    <Table>
      <TableHead style={{ backgroundColor: "#272F3E" }}>
        <TableRow>
          <TableCell
            key={"narzedzia"}
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Poppins",
              padding: "0px",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          >
            Narzędzia
          </TableCell>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              style={{
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
        {loading
          ? [...Array(rowsPerPage)].map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={columns.length + 1}>
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={16}
                    animation="wave"
                  />
                </TableCell>
              </TableRow>
            ))
          : users.map((user) => (
              <TableRow key={user.email}>
                <TableCell
                  style={{
                    textAlign: "center",
                    padding: "9px",
                    maxHeight: "60px",
                    fontFamily: "Poppins",
                    width: "9.5%",
                  }}
                >
                  <Tooltip title="Usuń">
                    <IconButton
                      sx={{ padding: "4px", color: "#A11D1D" }}
                      onClick={() => onDeleteClick(user)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edytuj">
                    <IconButton
                      sx={{ padding: "4px", color: "#6A99C7" }}
                      onClick={() => onEditClick(user)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                {columns.map((column) => (
                  <CustomTableCell
                    key={column.id}
                    style={{ textAlign: "center", fontFamily: "Poppins" }}
                  >
                    {user[column.id]}
                  </CustomTableCell>
                ))}
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}

export default UsersTable;
