import { BrowserRouter, Routes, Route, Navigate, Outlet, useSearchParams } from "react-router-dom";

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

import LiveAwnitIntake from "./pages/LiveAwnitIntake";
import NotFound from "./pages/NotFound";

/* BEAM ROUTES */
import BeamScreen from "./routes/BeamScreen";
import BeamReceive from "./routes/BeamReceive";
import BeamOpen from "./routes/BeamOpen";

function LiveShell() {
  return <Outlet />;
}

function MeasurementCardPlaceholder() {
  const [searchParams] = useSearchParams();

  const beam = searchParams.get("beam") || "";
  const sessionId = searchParams.get("session_id") || "";
  const code = searchParams.get("code") || "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Beam Card</div>
        <div className="mt-1 text-2xl font-extrabold">Door Measurement Card</div>
        <div className="mt-2 text-sm text-slate-300">
          This is the real <span className="font-mono">/cards/measurement</span> route.
        </div>

        <div className="mt-4 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-3 text-sm text-emerald-100">
          Good news: the panel is now opening a real card route instead of redirecting back to the AWNIT board.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs text-slate-400">Beam</div>
            <div className="mt-1 font-mono text-sm text-slate-100">{beam || "—"}</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs text-slate-400">Session ID</div>
            <div className="mt-1 break-all font-mono text-sm text-slate-100">{sessionId || "—"}</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs text-slate-400">Code</div>
            <div className="mt-1 font-mono text-sm text-slate-100">{code || "—"}</div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="text-sm font-bold text-slate-100">Next step</div>
          <div className="mt-2 text-sm text-slate-300">
            Once this displays correctly in the right-side Beam Workspace, we replace this placeholder with the real
            measurement card UI.
          </div>
        </div>
      </div>
    </div>
  );
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

        {/* LIVE: AWNIT Intake (explicit) — must be above /live/:slug */}
        <Route path="/live/awnit" element={<LiveAwnitIntake />} />

        {/* LIVE SYSTEM — MUST be above tenant catch-all */}
        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
          <Route path="board" element={<LiveShopTV />} />
        </Route>

        {/* BEAM SYSTEM */}
        <Route path="/beam/staff" element={<BeamScreen />} />
        <Route path="/beam/open/:claimId" element={<BeamOpen />} />
        <Route path="/beam/:sessionId" element={<BeamReceive />} />

        {/* REAL CARD ROUTE */}
        <Route path="/cards/measurement" element={<MeasurementCardPlaceholder />} />

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