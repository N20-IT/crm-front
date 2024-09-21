import React from "react";
import { Typography } from "@mui/material";

const CustomTypography = (props) => {
  return (
    <Typography sx={{ fontFamily: "Poppins", fontSize: "22px" }}>
      {props.children}
    </Typography>
  );
};

export default CustomTypography;
