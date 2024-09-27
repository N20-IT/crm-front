import { TextField } from "@mui/material";

const CustomTextField = ({ sx = {}, children, ...rest }) => (
  <TextField
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "6px",
        fontFamily: "Poppins",
        fontSize: "18px",
      },
      "& .MuiFormLabel-root": {
        fontFamily: "Poppins",
        fontSize: "18px",
        color: "#535968",
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
      ...sx,
    }}
    {...rest}
    // {...props}
  />
);

export default CustomTextField;
