// apps/web/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import PublicPage from "./routes/PublicPage";
import LiveShopTV from "./routes/LiveShopTV";
import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import LiveAlias from "./routes/LiveAlias";
import PrintWorkOrder from "./routes/PrintWorkOrder";

import ServiceRoutes from "./service/ServiceRoutes";

function LiveShell() {
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* SERVICE SYSTEM — fully isolated namespace */}
        <Route path="/service/*" element={<ServiceRoutes />} />

        {/* Canonical public page */}
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

        {/* Home */}
        <Route path="/" element={<Navigate to="/c/taylor-creek" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/c/taylor-creek" replace />} />

      </Routes>
    </BrowserRouter>
  );
}