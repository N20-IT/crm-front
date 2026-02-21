import { TextField } from "@mui/material";

const CustomTextField = ({ sx = {}, children, ...rest }) => (
  <TextField
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "4px",
        fontFamily: "Poppins",
        fontSize: "16px",
        height: rest.multiline ? "auto" : "40px",
        "& input": {
          padding: "8px",
          height: "16px",
        },
      },
      "& .MuiFormLabel-root": {
        fontFamily: "Poppins",
        fontSize: "16px",
        color: "#535968",
        transform: "translate(14px, 9px) scale(1)",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#535968",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#535968",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#535968",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#535968",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#535968",
      },
      "& .MuiInputLabel-root.MuiInputLabel-shrink": {
        transform: "translate(14px, -9px) scale(0.75)",
      },

      ...sx,
    }}
    {...rest}
  />
);

export default CustomTextField;
