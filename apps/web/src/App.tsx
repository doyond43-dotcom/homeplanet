import { BrowserRouter, Routes, Route, Navigate, Outlet, useSearchParams } from "react-router-dom";

import TaylorCreekPublicDemoBoard from "./pages/TaylorCreekPublicDemoBoard";
import TaylorCreekStaffDemoBoard from "./pages/TaylorCreekStaffDemoBoard";

import PublicPage from "./routes/PublicPage";
import TenantPublicPage from "./routes/TenantPublicPage";
import LiveShopTV from "./routes/LiveShopTV";
import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import PrintWorkOrder from "./routes/PrintWorkOrder";
import JanetsLiveTVBoard from "./routes/JanetsLiveTVBoard";

import ServiceRoutes from "./service/ServiceRoutes";
import CityRoutes from "./routes/CityRoutes";
import TaylorCreekSite from "./routes/TaylorCreekSite";

import PressPage from "./routes/PressPage";
import PressKitTaylorCreek from "./routes/PressKitTaylorCreek";

import PlanetRoutes from "./planet/PlanetRoutes";
import CreatorRoutes from "./routes/CreatorRoutes";
import WorkspaceRoutes from "./app/WorkspaceRoutes";

import LiveAwnitIntake from "./pages/LiveAwnitIntake";
import LegalDemoBoard from "./pages/LegalDemoBoard";
import DanFieldNotebookDesk from "./pages/DanFieldNotebookDesk";
import LeeStudentNotebookDesk from "./pages/LeeStudentNotebookDesk";
import NotFound from "./pages/NotFound";

import BeamScreen from "./routes/BeamScreen";
import BeamReceive from "./routes/BeamReceive";
import BeamOpen from "./routes/BeamOpen";

import WildingLiveBoardDispatch from "./pages/WildingLiveBoardDispatch";

function LiveShell() {
  return <Outlet />;
}

function MeasurementCardPlaceholder() {
  const [searchParams] = useSearchParams();

  const beam = searchParams.get("beam") || "";
  const sessionId = searchParams.get("session_id") || "";
  const code = searchParams.get("code") || "";

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Beam Card</div>
        <div className="mt-1 text-2xl font-extrabold">Door Measurement Card</div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs text-slate-400">Beam</div>
            <div className="mt-1 font-mono text-sm">{beam || "-"}</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs text-slate-400">Session</div>
            <div className="mt-1 font-mono text-sm">{sessionId || "-"}</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs text-slate-400">Code</div>
            <div className="mt-1 font-mono text-sm">{code || "-"}</div>
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

        {/* SERVICE */}
        <Route path="/service/*" element={<ServiceRoutes />} />

        {/* CITY */}
        <Route path="/city/*" element={<CityRoutes />} />

        {/* LEGAL */}
        <Route path="/legal-demo" element={<LegalDemoBoard />} />

        {/* NOTEBOOKS */}
        <Route path="/dan-field-notebook-desk" element={<DanFieldNotebookDesk />} />
        <Route path="/lee-student-notebook-desk" element={<LeeStudentNotebookDesk />} />

        {/* CORE */}
        <Route path="/planet/*" element={<PlanetRoutes />} />
        <Route path="/creator/*" element={<CreatorRoutes />} />
        <Route path="/app/*" element={<WorkspaceRoutes />} />

        {/* PRESS */}
        <Route path="/press" element={<PressPage />} />
        <Route path="/press/taylor-creek" element={<PressKitTaylorCreek />} />

        {/* TAYLOR CREEK */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />

        {/* PUBLIC */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE AWNIT */}
        <Route path="/live/awnit" element={<LiveAwnitIntake />} />

        {/* DEMO BOARDS (SAFE — WORKING) */}
        <Route path="/live/taylor-creek-demo/board" element={<TaylorCreekPublicDemoBoard />} />
        <Route path="/live/taylor-creek-demo/staff" element={<TaylorCreekStaffDemoBoard />} />

        
        {/* FORCE SAFE DEMO FOR TAYLOR CREEK */}
        <Route path="/live/taylor-creek" element={<Navigate to="/live/taylor-creek-demo/board" replace />} />
        <Route path="/live/taylor-creek/board" element={<Navigate to="/live/taylor-creek-demo/board" replace />} />
        <Route path="/live/taylor-creek/staff" element={<Navigate to="/live/taylor-creek-demo/staff" replace />} />

{/* LIVE SYSTEM */}
        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="board" element={<LiveShopTV />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
        </Route>

        {/* BEAM */}
        <Route path="/beam/staff" element={<BeamScreen />} />
        <Route path="/beam/open/:claimId" element={<BeamOpen />} />
        <Route path="/beam/:sessionId" element={<BeamReceive />} />

        {/* CARD */}
        <Route path="/cards/measurement" element={<MeasurementCardPlaceholder />} />

        {/* DISPATCH */}
        <Route path="/wilding-dispatch" element={<WildingLiveBoardDispatch />} />

        {/* TENANT */}
        <Route path="/:slug/*" element={<TenantPublicPage />} />

        {/* ROOT */}
        <Route path="/" element={<Navigate to="/city" replace />} />

        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}



