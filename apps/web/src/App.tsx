// apps/web/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicPage from "./routes/PublicPage";
import LiveShopTV from "./routes/LiveShopTV";
import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import LiveAlias from "./routes/LiveAlias";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Canonical routes */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* TV screen (big display) */}
        <Route path="/live/:slug/board" element={<LiveShopTV />} />

        {/* Employee dashboard (interactive staff) */}
        <Route path="/live/:slug/staff" element={<LiveIntakeBoard />} />

        {/* Optional helper: /live/:slug goes to TV */}
        <Route path="/live/:slug" element={<LiveShopTV />} />

        {/* Optional helper redirect to /c/:slug */}
        <Route path="/go/:slug" element={<LiveAlias />} />

        {/* Home -> you can choose where it goes. For now, send home to a safe place. */}
        <Route path="/" element={<Navigate to="/c/taylor-creek" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/c/taylor-creek" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
