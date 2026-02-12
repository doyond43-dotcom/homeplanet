import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import CreatorStudio from "./pages/CreatorStudio";
import PlanetOverview from "./pages/PlanetOverview";
import CityPage from "./pages/CityPage";
import CreatorProjects from "./pages/CreatorProjects";
import CreatorBuild from "./pages/CreatorBuild";
import ReleaseViewer from "./pages/ReleaseViewer";
import SimpleDocPage from "./pages/SimpleDocPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import CreatorLive from "./pages/CreatorLive";
import LiveViewer from "./pages/LiveViewer";
import { RequireAuth } from "./auth/RequireAuth";
import TenantPublicPage from "./routes/TenantPublicPage";
import ReceiptPage from "./routes/ReceiptPage";
import Authorize from "./routes/Authorize";
import HomePlanetDashboard from "./pages/HomePlanetDashboard";
import HomePlanetLanding from "./pages/HomePlanetLanding";
import PressKitTaylorCreek from "./routes/PressKitTaylorCreek";
import TaylorCreekSite from "./routes/TaylorCreekSite";
import MLSLanding from "./pages/MLSLanding";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* -----------------------------
            Public QR / intake + auth + receipt
        ----------------------------- */}
        <Route path="/c/:slug" element={<TenantPublicPage />} />
        <Route path="/r/:receipt" element={<ReceiptPage />} />
        <Route path="/authorize/:receipt" element={<Authorize />} />

        <Route path="/press/taylor-creek" element={<PressKitTaylorCreek />} />

        <Route element={<AppShell />}>
          {/* -----------------------------
              Public auth routes
          ----------------------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot" element={<Navigate to="/reset-password" replace />} />

          {/* -----------------------------
              Public live viewer (NO auth)
          ----------------------------- */}
          <Route path="/live/:room" element={<LiveViewer />} />

          {/* -----------------------------
              Core
          ----------------------------- */}
          <Route path="/" element={<HomePlanetLanding />} />
          <Route path="/explorer" element={<HomePlanetDashboard />} />

          {/* MLS (isolated; does not affect root/core) */}
          <Route path="/mls" element={<MLSLanding />} />

          <Route
            path="/core/doctrine"
            element={
              <SimpleDocPage
                title="Doctrine"
                body="HomePlanet doctrine lives here. Next: render the canonical doctrine + excerpts."
              />
            }
          />
          <Route
            path="/core/binder"
            element={
              <SimpleDocPage
                title="Binder Map"
                body="HomePlanet binder map lives here. Next: show volumes + quick links."
              />
            }
          />

          {/* -----------------------------
              Protected app routes
          ----------------------------- */}
          <Route
            path="/planet/creator/release/:releaseId"
            element={
              <RequireAuth>
                <ReleaseViewer />
              </RequireAuth>
            }
          />

          <Route
            path="/planet/:planetId"
            element={
              <RequireAuth>
                <PlanetOverview />
              </RequireAuth>
            }
          />

          <Route
            path="/planet/creator/projects"
            element={
              <RequireAuth>
                <CreatorProjects />
              </RequireAuth>
            }
          />

          <Route
            path="/planet/creator/build"
            element={
              <RequireAuth>
                <CreatorBuild />
              </RequireAuth>
            }
          />

          <Route
            path="/planet/:planetId/:cityId"
            element={
              <RequireAuth>
                <CityPage />
              </RequireAuth>
            }
          />

          <Route
            path="/planet/creator/live"
            element={
              <RequireAuth>
                <CreatorLive />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="/planet/creator/studio" element={<CreatorStudio />} />
        <Route path="/planet/creator/studio/:mode" element={<CreatorStudio />} />

        {/* Public standalone pages (non-AppShell) */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />

        {/* Default (MUST be last) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}












