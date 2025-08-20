import React from "react";
import { Routes, Route } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";
import Redirector from "./pages/Redirector";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<ShortenerPage />} />
      <Route path="/stats" element={<StatsPage />} />
      {/* short links look like /go/abc123 */}
      <Route path="/go/:code" element={<Redirector />} />
    </Routes>
  );
}
