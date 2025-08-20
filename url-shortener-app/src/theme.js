import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: { borderRadius: 16 },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 16, textTransform: "none" } } }
  }
});
export default theme;
