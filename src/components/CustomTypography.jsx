import React from "react";
import { Typography } from "@mui/material";

const CustomTypography = ({ sx = {}, children, ...rest }) => {
  return (
    <Typography
      sx={{ fontFamily: "Poppins", fontSize: "22px", ...sx }}
      {...rest}
    >
      {children}
    </Typography>
  );
};

export default CustomTypography;
