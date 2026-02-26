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

        {/* SERVICE */}
        <Route path="/service/*" element={<ServiceRoutes />} />

        {/* PLANET */}
        <Route path="/planet/*" element={<PlanetRoutes />} />

        {/* CREATOR (REAL APP — MUST BE ABOVE TENANT) */}
        <Route path="/creator/*" element={<CreatorCity />} />

        {/* CITY */}
        <Route path="/city/*" element={<CityRoutes />} />

        {/* PRESS */}
        <Route path="/press" element={<PressPage />} />
        <Route path="/press/taylor-creek" element={<PressKitTaylorCreek />} />

        {/* TAYLOR CREEK */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />
        <Route path="/Taylor-Creek" element={<Navigate to="/taylor-creek" replace />} />

        {/* PUBLIC INTAKE */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE */}
        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
          <Route path="board" element={<LiveShopTV />} />
        </Route>

        {/* TENANT (LAST OR IT STEALS EVERYTHING) */}
        <Route path="/:slug/*" element={<TenantPublicPage />} />

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/creator" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}