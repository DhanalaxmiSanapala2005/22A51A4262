import React, { useMemo, useState } from "react";
import { Alert, Card, CardContent, Typography, Stack, Snackbar } from "@mui/material";
import UrlBatchForm from "../components/UrlBatchForm";
import UrlCard from "../components/UrlCard";
import LogConsole from "../components/LogConsole";
import { listUrls } from "../services/shortener";
import { logEvent } from "../services/logger";

export default function ShortenerPage() {
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(() => listUrls().sort((a, b) => b.createdAt - a.createdAt), [refresh]);
  const [toast, setToast] = useState(null);

  const onCreated = (results) => {
    setRefresh((x) => x + 1);
    const ok = results.filter(r => r.ok).length;
    const fail = results.length - ok;
    setToast({ msg: `Created ${ok} / ${results.length} links${fail ? `, ${fail} failed` : ""}`, severity: fail ? "warning" : "success" });
    logEvent("BATCH_RESULT", "Batch create completed", { ok, fail });
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Shorten up to 5 URLs</Typography>
          <Typography variant="body2" color="text.secondary">
            Default validity is <strong>60 minutes</strong> if not provided. Custom codes must be 4–12 chars:
            letters, digits, “_” or “-”.
          </Typography>
          <UrlBatchForm onCreated={onCreated} />
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="h6">Your Links (this browser)</Typography>
          {data.map((row) => <UrlCard key={row.code} row={row} />)}
        </Stack>
      )}

      <LogConsole />

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)}>
        {toast && <Alert severity={toast.severity}>{toast.msg}</Alert>}
      </Snackbar>
    </Stack>
  );
}
