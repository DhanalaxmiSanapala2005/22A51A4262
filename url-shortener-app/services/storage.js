// localStorage schema keys
const DB_KEY = "um_urls_v1";
const LOG_KEY = "um_logs_v1";

// read/write helpers
export const loadDB = () => JSON.parse(localStorage.getItem(DB_KEY) || "{}");
export const saveDB = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db));

export const loadLogs = () => JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
export const saveLogs = (logs) => localStorage.setItem(LOG_KEY, JSON.stringify(logs));
