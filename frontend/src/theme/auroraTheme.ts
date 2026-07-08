import { createTheme } from "@mui/material/styles";

export const auroraTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
    },
    secondary: {
      main: "#7C3AED",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
    },
    warning: {
      main: "#F59E0B",
    },
    success: {
      main: "#16A34A",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ].join(","),
  },
  shape: {
    borderRadius: 12,
  },
});
