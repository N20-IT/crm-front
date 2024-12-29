import { createTheme } from "@mui/material/styles";

export const customTooltip = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "14px",
          fontFamily: "Poppins",
          fontWeight: "500",
          lineHeight: "1.5",
          backgroundColor: "#444",
          backgroundImage: "linear-gradient(145deg, #333, #555)",
          color: "#fff",
          padding: "12px 16px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
        },
      },
    },
  },
});
