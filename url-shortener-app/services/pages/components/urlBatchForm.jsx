import React, { useState } from "react";
import { Box, Grid, TextField, IconButton, Button, Tooltip, Alert } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { createShortUrl } from "../services/shortener";
import { isValidHttpUrl, isValidCode } from "../services/validators";
import { logEvent } from "../services/logger";

const emptyRow = () => ({ url: "", code: "", minutes: "" });

export default function UrlBatchForm({ onCreated }) {
  const [rows, setRows] = useState([emptyRow()]);
  const [error, setError] = useState("");

  const addRow = () => {
    if (rows.length >= 5) return setError("You can shorten at most 5 URLs at once.");
    setRows([...rows, emptyRow()]);
  };

  const removeRow = (idx) => {
    const next = rows.slice();
    next.splice(idx, 1);
    setRows(next.length ? next : [emptyRow()]);
  };

  const update = (idx, key, value) => {
    const next = rows.slice();
    next[idx][key] = value;
    setRows(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // client-side validation
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!isValidHttpUrl(r.url)) return setError(`Row ${i + 1}: Enter a valid http(s) URL.`);
      if (!isValidCode(r.code)) return setError(`Row ${i + 1}: Custom code must be 4–12 chars (A–Z, a–z, 0–9, _ or -).`);
    }

    const results = rows.map((r) => {
      const { code, expiry, error } = createShortUrl({
        originalUrl: r.url.trim(),
        preferredCode: r.code.trim(),
        validityMinutes: r.minutes
      });
      return error ? { ok: false, error, input: r } : { ok: true, code, expiry, input: r };
    });

    onCreated(results);
    logEvent("BATCH_SUBMIT", "Submitted batch shorten", { count: rows.length });

    // reset but keep last set of inputs so user sees what happened
    setRows([emptyRow()]);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {rows.map((r, idx) => (
          <React.Fragment key={idx}>
            <Grid item xs={12} md={7}>
              <TextField label="Original URL (https://...)" fullWidth value={r.url}
                         onChange={(e) => update(idx, "url", e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Custom code (optional)" fullWidth value={r.code}
                         onChange={(e) => update(idx, "code", e.target.value)} />
            </Grid>
            <Grid item xs={10} md={1.5}>
              <TextField label="Validity (min)" type="number" fullWidth value={r.minutes}
                         onChange={(e) => update(idx, "minutes", e.target.value)} />
            </Grid>
            <Grid item xs={2} md={0.5} sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Remove row">
                <span>
                  <IconButton onClick={() => removeRow(idx)} disabled={rows.length === 1}>
                    <Delete />
                  </IconButton>
                </span>
              </Tooltip>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button type="submit" variant="contained">Shorten</Button>
        <Button variant="outlined" onClick={addRow} startIcon={<Add />}>Add Row</Button>
      </Box>
    </Box>
  );
}
