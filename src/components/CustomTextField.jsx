import { TextField } from "@mui/material";

const CustomTextField = (props) => (
  <TextField
    sx={{
      "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        fontFamily: "Poppins",
        fontSize: "20px",
      },
      "& .MuiFormLabel-root": {
        fontFamily: "Poppins",
        fontSize: "20px",
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
    }}
    {...props}
  />
);

export default CustomTextField;
