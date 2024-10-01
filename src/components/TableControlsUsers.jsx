import { Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import React from "react";
import { KeyboardArrowDown, Delete } from "@mui/icons-material";
import CustomTextField from "./CustomTextField";

function TableControlsUsers({
  selectedCount,
  onAddUserClick,
  deleteMultipleUsersClick,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "95%",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Button
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="outlined"
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: "#6D727F",
            fontFamily: "Poppins",
            borderColor: "black",
            width: "180px",
            height: "56px",
          }}
        >
          Zaznaczono {selectedCount}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              // deleteMultipleUsersClick();
              handleClose();
            }}
          >
            <Delete /> Usuń
          </MenuItem>
        </Menu>
        <Button
          variant="outlined"
          sx={{
            color: "#6D727F",
            fontFamily: "Poppins",
            borderColor: "black",
            width: "180px",
            height: "56px",
            fontSize: "18px",
          }}
        >
          Filtruj
        </Button>
        <CustomTextField
          label="Szukaj..."
          sx={{
            flex: 1,
          }}
        />
        <Button
          variant="contained"
          sx={{
            height: "100%",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
            fontSize: "18px",
          }}
          onClick={onAddUserClick}
        >
          Dodaj użytkownika
        </Button>
      </Stack>
    </Box>
  );
}

export default TableControlsUsers;
