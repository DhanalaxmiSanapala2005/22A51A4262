import React from "react";
import { ThemeProvider, CssBaseline, Container, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Router from "./router";
import theme from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>AffordMed – React URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/">Shorten</Button>
          <Button color="inherit" component={Link} to="/stats">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Router />
      </Container>
    </ThemeProvider>
  );
}
