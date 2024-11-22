import React from "react";
import CustomTextField from "./CustomTextField";
import columnsUsersConfig from "../config/columnsUsersConfig";

function UserForm({ formData, onChange }) {
  return (
    <form>
      {columnsUsersConfig.map((field) => (
        <CustomTextField
          label={field.label}
          name={field.id}
          type={field.type}
          value={formData[field.id]}
          onChange={onChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      ))}
    </form>
  );
}
export default UserForm;
