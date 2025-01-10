import React from "react";
import CustomTextField from "./CustomTextField";
import columnsUsersConfig from "../config/columnsUsersConfig";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";

function UserForm({ formData, onChange }) {
  return (
    <form>
      {columnsUsersConfig
        .filter((column) => column.includeInForm)
        .map((field) =>
          field.id !== "role" ? (
            <CustomTextField
              key={field.id}
              label={field.label}
              name={field.id}
              type={field.type}
              value={formData[field.id]}
              onChange={onChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
          ) : (
            <FormControl
              key={field.id}
              fullWidth
              sx={{
                marginTop: "12px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  height: "40px",
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
                "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                  transform: "translate(14px, -9px) scale(0.75)",
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
            >
              <InputLabel>Rola</InputLabel>
              <Select
                value={formData[field.id]}
                onChange={onChange}
                label="Rola"
                name="role"
              >
                <MenuItem
                  key={"null"}
                  value={""}
                  sx={{
                    fontStyle: "italic",
                    color: "gray",
                    fontWeight: "bold",
                  }}
                >
                  Brak
                </MenuItem>
                <MenuItem value="user">Użytkownik</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>
          )
        )}
    </form>
  );
}
export default UserForm;
