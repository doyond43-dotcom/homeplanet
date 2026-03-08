import { Routes, Route, Navigate } from "react-router-dom";

import PlanetOverview from "../pages/PlanetOverview";
import CityPage from "../pages/CityPage";

// Creator planet special pages
import CreatorCity from "../pages/CreatorCity";
import CreatorProjects from "../pages/CreatorProjects";
import CreatorStudio from "../pages/CreatorStudio";
import CreatorBuild from "../pages/CreatorBuild";
import ReleaseViewer from "../pages/ReleaseViewer";

// AWNIT
import AwnitDemoBoard from "../pages/AwnitDemoBoard";
import AwnitIntake from "../pages/AwnitIntake";
import InvoiceView from "../pages/InvoiceView";
import AwnitLandingPage from "../pages/AwnitLandingPage";

// Legal demo
import LegalDemoBoard from "../pages/LegalDemoBoard";

// NEW: Transportation demo
import TransportationDemoBoard from "../pages/TransportationDemoBoard";

// Life
import LifePlanet from "../pages/LifePlanet";

/**
 * Planet layer:
 * - /planet/creator is the Creator hub
 * - /planet/vehicles/awnit-demo is AWNIT Live Demo Board
 * - /planet/vehicles/awnit-demo/invoice/:invoiceId is the invoice view
 * - /planet/legal/demo is the Legal Evidence Demo Board
 * - /planet/transport/demo is the Transportation Dispatch Demo Board
 * - /planet/:planetId routes to PlanetOverview
 * - /planet/:planetId/:cityId routes to CityPage
 */
export default function PlanetRoutes() {
  return (
    <Routes>
      {/* /planet -> default */}
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* ---------- Creator ---------- */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/projects" element={<CreatorProjects />} />
      <Route path="creator/studio/*" element={<CreatorStudio />} />
      <Route path="creator/build" element={<CreatorBuild />} />
      <Route path="creator/release/:releaseId" element={<ReleaseViewer />} />
      <Route path="creator/*" element={<Navigate to="/planet/creator" replace />} />

      {/* ---------- AWNIT (CANONICAL) ---------- */}
      <Route path="vehicles/awnit" element={<AwnitLandingPage />} />
      <Route path="vehicles/awnit-demo" element={<AwnitDemoBoard />} />
      <Route path="vehicles/awnit-intake" element={<AwnitIntake />} />
      <Route path="vehicles/awnit-demo/invoice/:invoiceId" element={<InvoiceView />} />

      {/* ---------- LEGAL DEMO ---------- */}
      <Route path="legal/demo" element={<LegalDemoBoard />} />

      {/* ---------- TRANSPORTATION DEMO ---------- */}
      <Route path="transport/demo" element={<TransportationDemoBoard />} />

      {/* Optional legacy / fallback demo path */}
      <Route path="demo/awnit" element={<Navigate to="/planet/vehicles/awnit-demo" replace />} />

      {/* ---------- Life ---------- */}
      <Route path="life" element={<LifePlanet />} />

      {/* ---------- Generic planets ---------- */}
      <Route path=":planetId" element={<PlanetOverview />} />
      <Route path=":planetId/:cityId" element={<CityPage />} />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/city" replace />} />
    </Routes>
  );
}