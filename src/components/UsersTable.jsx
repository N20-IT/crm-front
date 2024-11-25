import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Checkbox,
  Skeleton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

function UsersTable({
  users,
  selected,
  loading,
  onSelect,
  onSelectAll,
  onDeleteClick,
  onEditClick,
  columns,
  rowsPerPage,
  page,
}) {
  return (
    <Table>
      <TableHead style={{ backgroundColor: "#272F3E" }}>
        <TableRow>
          <TableCell
            padding="checkbox"
            style={{ color: "white", textAlign: "center" }}
          >
            <Checkbox
              checked={selected.length === users.length}
              indeterminate={
                selected.length > 0 && selected.length < users.length
              }
              onChange={onSelectAll}
              style={{ color: "white" }}
            />
          </TableCell>
          {columns.map((column) => (
            <TableCell
              key={column.id}
              style={{
                color: "white",
                textAlign: "center",
                fontFamily: "Poppins",
              }}
            >
              {column.label}
            </TableCell>
          ))}
          <TableCell
            key={"narzedzia"}
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Poppins",
            }}
          >
            Narzędzia
          </TableCell>
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
          : users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.email}>
                  <TableCell style={{ textAlign: "center", padding: "5px" }}>
                    <Checkbox
                      checked={selected.includes(user.email)}
                      onChange={() => onSelect(user.email)}
                      sx={{
                        color: "#272F3E",
                        "&.Mui-checked": { color: "#272F3E" },
                      }}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ textAlign: "center", fontFamily: "Poppins" }}
                    >
                      {user[column.id]}
                    </TableCell>
                  ))}
                  <TableCell style={{ textAlign: "center" }}>
                    <Tooltip title="Usuń">
                      <IconButton
                        sx={{ padding: "4px", color: "#A11D1D" }}
                        onClick={() => onDeleteClick(user._id)}
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
                </TableRow>
              ))}
      </TableBody>
    </Table>
  );
}

export default UsersTable;
