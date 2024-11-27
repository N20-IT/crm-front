import React from "react";
import { TableCell } from "@mui/material";

const CustomTableCell = ({ sx = {}, children, ...rest }) => {
  return (
    <TableCell
      style={{
        textAlign: "center",
        padding: "0px",
        maxHeight: "60px",
        fontFamily: "Poppins",
        fontSize: "13px",
        width: "9.5%",
        ...sx,
      }}
    >
      {children}
    </TableCell>
  );
};

export default CustomTableCell;
