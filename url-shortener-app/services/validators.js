export const isValidHttpUrl = (str) => /^https?:\/\/.+/i.test(str.trim());

export const isValidCode = (s) => {
  if (!s) return true; // optional
  return /^[A-Za-z0-9_-]{4,12}$/.test(s);
};

export const clampValidity = (minutes) => {
  if (!minutes && minutes !== 0) return 60; // default validity: 60 minutes
  const n = Number(minutes);
  if (Number.isNaN(n)) return 60;
  return Math.max(1, Math.min(24 * 60, Math.floor(n))); // 1 min .. 24h
};
