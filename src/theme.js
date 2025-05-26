"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#F0B92B", // Amarillo dorado, más sofisticado
      light: "#FFD666", // Tono claro armonioso
      dark: "#D8A01F", // Tono oscuro rico
      contrastText: "#263238", // Texto oscuro para legibilidad sobre amarillo
    },
    secondary: {
      main: "#37474F", // Gris oscuro
      light: "#607D8B", // Gris azulado (tercer color principal)
      dark: "#263238",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#37474F",
      secondary: "#607D8B",
    },
    error: {
      main: "#F44336",
    },
    warning: {
      main: "#FF9800",
    },
    info: {
      main: "#607D8B", // Gris azulado (tercer color principal)
    },
    success: {
      main: "#4CAF50",
    },
    positiveAccent: {
      main: "#00897B", // Teal 700 - un verde azulado oscuro y elegante
      light: "#4DB6AC", // Teal 300 - una versión más clara
      dark: "#00695C", // Teal 800 - una versión más profunda
      contrastText: "#FFFFFF", // Texto blanco para asegurar buena legibilidad
    },
    custom: {
      facebookBlue: "#1877F2",
      whatsappGreen: "#25D366",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#D8A01F",
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: "#263238",
          },
        },
      },
      variants: [
        {
          props: { color: "facebook" },
          style: {
            backgroundColor: "#1877F2",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#0b5fcc",
            },
          },
        },
        {
          props: { color: "whatsapp" },
          style: {
            backgroundColor: "#25D366",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#128C7E",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiSvgIcon: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            color: "#FFCF40",
          },
        },
        {
          props: { color: "primaryInverted" },
          style: {
            color: "#FFFFFF", // Iconos blancos para usar sobre fondos amarillos
          },
        },
        {
          props: { color: "facebook" },
          style: {
            color: "#1877F2", // Color oficial de Facebook
          },
        },
        {
          props: { color: "whatsapp" },
          style: {
            color: "#25D366", // Color oficial de WhatsApp
          },
        },
      ],
    },
    MuiIconButton: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            backgroundColor: "#FFCF40",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#FDB913",
            },
          },
        },
      ],
    },
    // Componente personalizado para círculos de iconos
    MuiBox: {
      variants: [
        {
          props: { className: "icon-circle-primary" },
          style: {
            backgroundColor: "#FFCF40",
            color: "#FFFFFF",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 8px rgba(255, 207, 64, 0.3)",
          },
        },
      ],
    },
  },
});

export default theme;
