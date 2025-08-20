import { loadLogs, saveLogs } from "./storage";

// simple client "middleware" style logger
export function logEvent(type, msg, meta = {}) {
  const entry = {
    t: new Date().toISOString(),
    type,
    msg,
    meta
  };
  const logs = loadLogs();
  logs.unshift(entry);      // newest first
  saveLogs(logs.slice(0, 500)); // keep last 500
  // also visible to reviewers:
  // eslint-disable-next-line no-console
  console.info(`[${entry.t}] ${type}: ${msg}`, meta);
}
