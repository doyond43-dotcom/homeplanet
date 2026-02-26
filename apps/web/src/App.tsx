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
import CreatorRoutes from "./routes/CreatorRoutes";

import NotFound from "./pages/NotFound";

function LiveShell() {
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* SERVICE SYSTEM — isolated namespace */}
        <Route path="/service/*" element={<ServiceRoutes />} />

        {/* Cities (geography layer) — MUST be above tenant catch-all */}
        <Route path="/city/*" element={<CityRoutes />} />

        {/* Planets (core app layer) — MUST be above tenant catch-all */}
        <Route path="/planet/*" element={<PlanetRoutes />} />

        {/* Creator tool hub — MUST be above tenant catch-all */}
        <Route path="/creator/*" element={<CreatorRoutes />} />

        {/* Press routes — MUST be above tenant catch-all */}
        <Route path="/press" element={<PressPage />} />
        <Route path="/press/taylor-creek" element={<PressKitTaylorCreek />} />

        {/* Taylor Creek landing page — MUST be above tenant catch-all */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />
        <Route path="/Taylor-Creek" element={<Navigate to="/taylor-creek" replace />} />

        {/* Canonical public intake page */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE SYSTEM — MUST be above tenant catch-all */}
        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
          <Route path="board" element={<LiveShopTV />} />
        </Route>

        {/* Tenant public pages (LAST before NotFound) */}
        <Route path="/:slug/*" element={<TenantPublicPage />} />

        {/* Root */}
        <Route path="/" element={<Navigate to="/city" replace />} />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}