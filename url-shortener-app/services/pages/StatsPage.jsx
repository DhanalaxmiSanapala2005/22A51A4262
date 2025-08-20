import React from "react";
import { Card, CardContent, Typography, Chip, Divider, Stack } from "@mui/material";
import { listUrls } from "../services/shortener";

const fmt = (ms) => new Date(ms).toLocaleString();

export default function StatsPage() {
  const items = listUrls().sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">URL Shortener Statistics</Typography>
      {items.length === 0 && <Typography color="text.secondary">No data yet. Create a link on the Shorten page.</Typography>}

      {items.map((u) => (
        <Card key={u.code}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              /go/{u.code} &nbsp;
              <Chip size="small" label={`${u.totalClicks} clicks`} />
            </Typography>
            <Typography variant="body2">Original: <a href={u.originalUrl} target="_blank" rel="noreferrer">{u.originalUrl}</a></Typography>
            <Typography variant="body2">Created: {fmt(u.createdAt)} &nbsp;|&nbsp; Expires: {fmt(u.expiry)}</Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Click Details</Typography>
            {u.clicks.length === 0 && <Typography color="text.secondary">No clicks yet.</Typography>}
            {u.clicks.map((c, i) => (
              <Typography key={i} variant="body2">
                • {fmt(c.ts)} — source: {c.source} — geo: {c.geo}
              </Typography>
            ))}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
