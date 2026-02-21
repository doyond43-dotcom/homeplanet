// apps/web/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import PublicPage from "./routes/PublicPage";
import LiveShopTV from "./routes/LiveShopTV";
import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import LiveAlias from "./routes/LiveAlias";
import PrintWorkOrder from "./routes/PrintWorkOrder";

/**
 * LiveShell prevents /live/:slug from hijacking subroutes.
 * Now:
 *   /live/:slug                 -> TV
 *   /live/:slug/staff           -> Employee board
 *   /live/:slug/board           -> (legacy link) -> TV
 *   /live/:slug/work-order/:id  -> Printable work order
 */
function LiveShell() {
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Canonical public page */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE SYSTEM — nested so routes stop fighting */}
        <Route path="/live/:slug" element={<LiveShell />}>
          {/* Default: TV display */}
          <Route index element={<LiveShopTV />} />

          {/* Staff interactive dashboard */}
          <Route path="staff" element={<LiveIntakeBoard />} />

          {/* Printable work order */}
          <Route path="work-order/:id" element={<PrintWorkOrder />} />

          {/* Backwards compatibility (old QR codes) */}
          <Route path="board" element={<LiveShopTV />} />
        </Route>

        {/* Alias helper */}
        <Route path="/go/:slug" element={<LiveAlias />} />

        {/* Home */}
        <Route path="/" element={<Navigate to="/c/taylor-creek" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/c/taylor-creek" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
