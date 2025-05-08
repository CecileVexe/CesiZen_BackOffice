import { createTheme } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";

const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: { main: "#52B788" },
      secondary: { main: "#006c53" },
      text: { primary: "#1A1A1A", secondary: "#4B5563" },
    },
    typography: {
      fontFamily: "Roboto, Inter, sans-serif",

      h1: {
        fontFamily: "Fredoka, sans-serif",
        fontWeight: 500,
        fontSize: "2.5rem",
      },
      h2: {
        fontFamily: "Fredoka, sans-serif",
        fontWeight: 400,
        fontSize: "2rem",
      },
      h3: {
        fontFamily: "Fredoka, sans-serif",
        fontWeight: 500,
        fontSize: "1.75rem",
      },
      body1: {
        fontSize: "1rem",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#52B788",
            },
          },
        },
      },
    },
  },
  frFR
);

export default theme;
