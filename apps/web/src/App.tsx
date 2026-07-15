import DemoPestControlLandingPage from "./pages/DemoPestControlLandingPage";
import DemoPestControlBoardPage from "./pages/DemoPestControlBoardPage";
import HomePlanetTransportationPage from "./pages/HomePlanetTransportationPage";

import HomePlanetTransportationRequestPage from "./pages/HomePlanetTransportationRequestPage";

import OkeechobeeLawnProgramPage from './pages/OkeechobeeLawnProgramPage';
import OkeechobeeLawnIntelligenceDashboard from './pages/OkeechobeeLawnIntelligenceDashboard';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useSearchParams } from "react-router-dom";


import TaylorCreekRealDemoBoard from "./pages/TaylorCreekRealDemoBoard";

import TaylorCreekRealDemoStaffBoard from "./pages/TaylorCreekRealDemoStaffBoard";

import HomeServicesLiveSystemStaffBoard from "./pages/HomeServicesLiveSystemStaffBoard";


import PublicPage from "./routes/PublicPage";

import TenantPublicPage from "./routes/TenantPublicPage";

import LiveShopTV from "./routes/LiveShopTV";

import LiveIntakeBoard from "./routes/LiveIntakeBoard";

import PrintWorkOrder from "./routes/PrintWorkOrder";


import ServiceRoutes from "./service/ServiceRoutes";

import CityRoutes from "./routes/CityRoutes";

import TaylorCreekSite from "./routes/TaylorCreekSite";


import PressPage from "./routes/PressPage";

import PressKitTaylorCreek from "./routes/PressKitTaylorCreek";


import PlanetRoutes from "./planet/PlanetRoutes";
import OnlyTheEssentialsLandingV2 from "./pages/OnlyTheEssentialsLandingV2";

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

import HomePlanetMarketAwarenessFunnelV1, { HomePlanetMarketAwarenessDashboardV1 } from "./pages/HomePlanetMarketAwarenessFunnelV1";

import HomePlanetAfterTheClickDemo from "./pages/HomePlanetAfterTheClickDemo";

import BrightSideFlowDemo from "./pages/BrightSideFlowDemo";
import HomePlanetNotepad from './pages/HomePlanetNotepad';


import SlapABugLandingPage from "./pages/SlapABugLandingPage";
import SlapABugBoardPage from "./pages/SlapABugBoardPage";
import VZProfessionalLawncareLanding from "./pages/VZProfessionalLawncareLanding";
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

function isOkeechobeeTogetherDomain() {
  return window.location.hostname.toLowerCase().includes("okeechobeetogether.");
}

function OkeechobeeDomainHomeRedirect() {
  if (isOkeechobeeTogetherDomain()) {
    return <Navigate to="/planet/okeechobee" replace />;
  }

  return <Navigate to="/city" replace />;
}

function OkeechobeeDomainCityRedirect() {
  if (isOkeechobeeTogetherDomain()) {
    return <Navigate to="/planet/okeechobee" replace />;
  }

  return <CityRoutes />;
}

function OkeechobeeDomainEventRedirect() {
  if (!isOkeechobeeTogetherDomain()) {
    return <NotFound />;
  }

  const parts = window.location.pathname.split("/").filter(Boolean);
  const slug = parts[1] || "";

  return <Navigate to={`/planet/okeechobee/event/${slug}`} replace />;
}

function OkeechobeeDomainCreateRedirect() {
  if (!isOkeechobeeTogetherDomain()) {
    return <NotFound />;
  }

  return <Navigate to="/planet/okeechobee/create" replace />;
}
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
                    <Route path="/planet/demo/pest-control/board" element={<DemoPestControlBoardPage />} />
          <Route path="/planet/demo/pest-control" element={<DemoPestControlLandingPage />} />          <Route path="/planet/slap-a-bug/board" element={<SlapABugBoardPage />} />
          <Route path="/planet/slap-a-bug" element={<SlapABugLandingPage />} />
<Route path="/vz" element={<VZProfessionalLawncareLanding />} />
<Route path="/planet/vz-professional-lawncare" element={<VZProfessionalLawncareLanding />} />                    <Route path="/planet/transportation/request" element={<HomePlanetTransportationRequestPage />} />
          <Route path="/planet/transportation" element={<HomePlanetTransportationPage />} />
<Route path="/planet/demo/brightside-flow" element={<BrightSideFlowDemo />} />
          <Route path="/planet/demo/after-the-click" element={<HomePlanetAfterTheClickDemo />} />
          <Route path="/planet/build-your-live-system/dashboard" element={<HomePlanetMarketAwarenessDashboardV1 />} />
          <Route path="/planet/build-your-live-system" element={<HomePlanetMarketAwarenessFunnelV1 />} />        <Route path="/service/*" element={<ServiceRoutes />} />
        <Route path="/city/*" element={<OkeechobeeDomainCityRedirect />} />

        <Route path="/legal-demo" element={<LegalDemoBoard />} />

        <Route path="/dan-field-notebook-desk" element={<DanFieldNotebookDesk />} />
        <Route path="/lee-student-notebook-desk" element={<LeeStudentNotebookDesk />} />

        <Route path="/planet/*" element={<PlanetRoutes />} />
        <Route path="/creator/*" element={<CreatorRoutes />} />
        <Route path="/app/*" element={<WorkspaceRoutes />} />

        <Route path="/press" element={<PressPage />} />
        <Route path="/press/taylor-creek" element={<PressKitTaylorCreek />} />

        <Route path="/taylor-creek" element={<TaylorCreekSite />} />
        <Route path="/c/:slug" element={<PublicPage />} />

        <Route path="/live/awnit" element={<LiveAwnitIntake />} />

        {/* SAFE TAYLOR CREEK DEMO ROUTES */}
        <Route path="/live/taylor-creek-demo/board" element={<TaylorCreekRealDemoBoard />} />
        <Route path="/live/taylor-creek-demo/staff" element={<TaylorCreekRealDemoStaffBoard />} />
        <Route path="/planet/demo/home-services-staff" element={<HomeServicesLiveSystemStaffBoard />} />

        {/* FORCE REAL TAYLOR CREEK PUBLIC LINKS TO SAFE DEMO */}
        <Route path="/live/taylor-creek" element={<Navigate to="/live/taylor-creek-demo/board" replace />} />
        <Route path="/live/taylor-creek/board" element={<Navigate to="/live/taylor-creek-demo/board" replace />} />
        <Route path="/live/taylor-creek/staff" element={<Navigate to="/live/taylor-creek-demo/staff" replace />} />

        <Route path="/live/:slug" element={<LiveShell />}>
          <Route index element={<LiveShopTV />} />
          <Route path="staff" element={<LiveIntakeBoard />} />
          <Route path="board" element={<LiveShopTV />} />
          <Route path="work-order/:id" element={<PrintWorkOrder />} />
        </Route>

        <Route path="/beam/staff" element={<BeamScreen />} />
        <Route path="/beam/open/:claimId" element={<BeamOpen />} />
        <Route path="/beam/:sessionId" element={<BeamReceive />} />

        <Route path="/cards/measurement" element={<MeasurementCardPlaceholder />} />

        <Route path="/wilding-dispatch" element={<WildingLiveBoardDispatch />} />

        <Route path="/event/:slug" element={<OkeechobeeDomainEventRedirect />} />
        <Route path="/create" element={<OkeechobeeDomainCreateRedirect />} />

        <Route path="/onlytheessentials" element={<OnlyTheEssentialsLandingV2 />} />
<Route path="/essentials" element={<OnlyTheEssentialsLandingV2 />} />

        <Route path="/:slug/*" element={<TenantPublicPage />} />

        <Route path="/" element={<OkeechobeeDomainHomeRedirect />} />
          <Route
            path="/planet/okeechobee/lawn-program"
            element={<OkeechobeeLawnProgramPage />}
          />
          <Route
            path="/planet/okeechobee/lawn-program/intelligence"
            element={<OkeechobeeLawnIntelligenceDashboard />}
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/planet/notepad" element={<HomePlanetNotepad />} />
        </Routes>
    </BrowserRouter>
  );
}
































