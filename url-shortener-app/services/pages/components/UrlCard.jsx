import React from "react";
import { Card, CardContent, Typography, Chip, Stack, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const fmt = (ms) => new Date(ms).toLocaleString();

export default function UrlCard({ row }) {
  const shortPath = `/go/${row.code}`;
  const shortAbs = `${window.location.origin}${shortPath}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shortAbs);
      alert("Short URL copied to clipboard.");
    } catch {
      alert("Copy failed.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">{shortPath} &nbsp; <Chip size="small" label={`${row.clicks.length} clicks`} /></Typography>
          <Typography variant="body2">Original: <a href={row.originalUrl} target="_blank" rel="noreferrer">{row.originalUrl}</a></Typography>
          <Typography variant="body2">Created: {fmt(row.createdAt)} &nbsp;|&nbsp; Expires: {fmt(row.expiry)}</Typography>
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            <Button size="small" variant="contained" startIcon={<OpenInNewIcon />} href={shortPath}>Open</Button>
            <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={copy}>Copy</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
