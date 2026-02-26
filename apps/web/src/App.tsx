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

import PressPage from "./routes/PressPage";
import PressKitTaylorCreek from "./routes/PressKitTaylorCreek";

import PlanetRoutes from "./planet/PlanetRoutes";
import CreatorCity from "./pages/CreatorCity";

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

        {/* Cities (geography layer) */}
        <Route path="/city/*" element={<CityRoutes />} />

        {/* Planets (core app layer) */}
        <Route path="/planet/*" element={<PlanetRoutes />} />

        {/* ✅ RESTORE: Creator City at /creator/* (must be above tenant catch-all) */}
        <Route path="/creator/*" element={<CreatorCity />} />
        <Route path="/creator" element={<Navigate to="/creator" replace />} />

        {/* Press routes */}
        <Route path="/press" element={<PressPage />} />
        <Route path="/press/taylor-creek" element={<PressKitTaylorCreek />} />

        {/* Taylor Creek landing page */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />
        <Route path="/Taylor-Creek" element={<Navigate to="/taylor-creek" replace />} />

        {/* Canonical public intake page */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE SYSTEM */}
        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
          <Route path="board" element={<LiveShopTV />} />
        </Route>

        {/* Alias helper */}
        <Route path="/go/:slug" element={<LiveAlias />} />

        {/* Tenant public pages (keep LAST so it doesn't steal real routes) */}
        <Route path="/:slug/*" element={<TenantPublicPage />} />

        {/* Home (root) — send to Creator like before */}
        <Route path="/" element={<Navigate to="/creator" replace />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
