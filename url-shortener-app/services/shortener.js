import { loadDB, saveDB } from "./storage";
import { clampValidity } from "./validators";
import { logEvent } from "./logger";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const randCode = (len = 6) =>
  Array.from({ length: len }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");

export function createShortUrl({ originalUrl, preferredCode, validityMinutes }) {
  const db = loadDB();
  let code = (preferredCode || "").trim() || randCode();
  if (db[code]) {
    logEvent("SHORTCODE_COLLISION", `Attempted code '${code}' already exists`);
    return { error: "Shortcode already exists. Try a different code." };
  }
  const now = Date.now();
  const expiry = now + clampValidity(validityMinutes) * 60 * 1000;

  db[code] = { originalUrl, createdAt: now, expiry, clicks: [] };
  saveDB(db);
  logEvent("URL_CREATED", `Created code '${code}'`, { code, originalUrl, expiry });
  return { code, expiry };
}

export function listUrls() {
  const db = loadDB();
  return Object.entries(db).map(([code, v]) => ({ code, ...v }));
}

export function recordClick(code, source = "app") {
  const db = loadDB();
  const row = db[code];
  if (!row) return { error: "not-found" };

  const now = Date.now();
  if (now > row.expiry) return { error: "expired" };

  // coarse-grained "geo" without external APIs: language + timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown-tz";
  const lang = navigator.language || "unknown-lang";

  row.clicks.push({ ts: now, source, geo: `${lang}, ${tz}` });
  saveDB(db);
  logEvent("URL_CLICKED", `Code '${code}' clicked`, { code, source, tz, lang });
  return { ok: true, target: row.originalUrl };
}

export function getStats(code) {
  const db = loadDB();
  const row = db[code];
  if (!row) return null;
  return {
    code,
    ...row,
    totalClicks: row.clicks.length
  };
}
