// apps/web/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import PublicPage from "./routes/PublicPage";
import TenantPublicPage from "./routes/TenantPublicPage";
import LiveShopTV from "./routes/LiveShopTV";
import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import LiveAlias from "./routes/LiveAlias";
import PrintWorkOrder from "./routes/PrintWorkOrder";

import ServiceRoutes from "./service/ServiceRoutes";
import CityRoutes from "./routes/CityRoutes";
import TaylorCreekSite from "./routes/TaylorCreekSite";
import NotFound from "./pages/NotFound";

function LiveShell() {
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SERVICE SYSTEM — fully isolated namespace */}
        <Route path="/service/*" element={<ServiceRoutes />} />

        {/* Cities (geography layer) — MUST be above tenant catch-all */}
        <Route path="/city/*" element={<CityRoutes />} />

        {/* Taylor Creek landing page — MUST be above tenant catch-all */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />
        {/* Friendly casing redirect (optional but prevents surprises) */}
        <Route path="/Taylor-Creek" element={<Navigate to="/taylor-creek" replace />} />

        {/* Canonical public intake page */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* Tenant public pages (themed shells + fallback to PublicPage)
            NOTE: keep BELOW /city/* and /taylor-creek so it doesn't steal them */}
        <Route path="/:slug/*" element={<TenantPublicPage />} />

        {/* LIVE SYSTEM */}
        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
          <Route path="board" element={<LiveShopTV />} />
        </Route>

        {/* Alias helper */}
        <Route path="/go/:slug" element={<LiveAlias />} />

        {/* Home */}
        <Route path="/" element={<Navigate to="/taylor-creek" replace />} />

        {/* Catch all (DO NOT silently redirect to Taylor Creek) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}