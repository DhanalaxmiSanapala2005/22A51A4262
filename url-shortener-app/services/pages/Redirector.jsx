import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { CircularProgress, Box, Alert } from "@mui/material";
import { recordClick, getStats } from "../services/shortener";

export default function Redirector() {
  const { code } = useParams();
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    // try to log a click, then redirect
    const stats = getStats(code);
    if (!stats) {
      setState({ loading: false, error: "not-found" });
      return;
    }
    if (Date.now() > stats.expiry) {
      setState({ loading: false, error: "expired" });
      return;
    }
    const res = recordClick(code, document.referrer ? "external" : "app");
    if (res.error) {
      setState({ loading: false, error: res.error });
    } else {
      // Perform the actual redirect
      window.location.replace(res.target);
    }
  }, [code]);

  if (state.loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "40vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (state.error === "not-found") {
    return <Alert severity="error">This short URL does not exist.</Alert>;
  }
  if (state.error === "expired") {
    return <Alert severity="warning">This short URL has expired.</Alert>;
  }

  // If nothing else, go home
  return <Navigate to="/" replace />;
}
