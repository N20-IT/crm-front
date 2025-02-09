import { KeyboardArrowDown, ViewList, ViewModule } from "@mui/icons-material";
import {
  Box,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import CustomTextField from "./CustomTextField";

function ClientTableControls({ onAddClientClick }) {
  return (
    <Box
      sx={{
        width: "100%",
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
          aria-haspopup="true"
          variant="outlined"
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: "#6D727F",
            fontFamily: "Poppins",
            borderColor: "black",
            width: "180px",
            height: "40px",
          }}
        >
          Zaznaczono
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: "#6D727F",
            fontFamily: "Poppins",
            borderColor: "black",
            width: "180px",
            height: "40px",
            fontSize: "18px",
          }}
        >
          Filtruj
        </Button>
        <CustomTextField
          label="Szukaj..."
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              height: "40px",
            },
            "& .MuiInputLabel-root": {
              transform: "translate(14px, 9px) scale(1)",
            },
            "& .MuiInputLabel-root.MuiInputLabel-shrink": {
              transform: "translate(14px, -9px) scale(0.75)",
            },
          }}
        />
        <ToggleButtonGroup
          exclusive
          aria-label="view selection"
          sx={{ height: "40px" }}
        >
          <Tooltip title="Widok podstawowy">
            <ToggleButton value={0} aria-label="basic view">
              <ViewList sx={{ color: "#FC8721" }} />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Widok rozszerzony">
            <ToggleButton value={1} aria-label="expanded view">
              <ViewModule sx={{ color: "default" }} />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <Button
          variant="contained"
          sx={{
            height: "40px",
            backgroundColor: "#FC8721",
            fontFamily: "Poppins",
            fontSize: "18px",
          }}
          onClick={onAddClientClick}
        >
          Dodaj Klienta
        </Button>
      </Stack>
    </Box>
  );
}

export default ClientTableControls;
