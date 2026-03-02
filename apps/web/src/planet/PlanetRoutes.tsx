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
import InvoiceView from "../pages/InvoiceView";
import AwnitLandingPage from "../pages/AwnitLandingPage";

// Life
import LifePlanet from "../pages/LifePlanet";

/**
 * Planet layer:
 * - /planet/creator is a special launchpad (CreatorCity)
 * - AWNIT canonical:
 *    - /planet/awnit (landing)
 *    - /planet/awnit/demo (dashboard demo board)
 * - legacy AWNIT paths redirect to canonical
 */
export default function PlanetRoutes() {
  return (
    <Routes>
      {/* /planet -> default planet */}
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* ---------- Creator planet (special) ---------- */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/projects" element={<CreatorProjects />} />
      <Route path="creator/studio/*" element={<CreatorStudio />} />
      <Route path="creator/build" element={<CreatorBuild />} />
      <Route path="creator/release/:releaseId" element={<ReleaseViewer />} />
      <Route path="creator/*" element={<Navigate to="/planet/creator" replace />} />

      {/* ---------- AWNIT (CANONICAL) — must be ABOVE generic routes ---------- */}
      <Route path="awnit" element={<AwnitLandingPage />} />
      <Route path="awnit/demo" element={<AwnitDemoBoard />} />
      <Route path="awnit/demo/invoice/:invoiceId" element={<InvoiceView />} />

      {/* ---------- AWNIT (LEGACY REDIRECTS) ---------- */}
      <Route path="vehicles/awnit" element={<Navigate to="/planet/awnit" replace />} />
      <Route path="vehicles/awnit-demo" element={<Navigate to="/planet/awnit/demo" replace />} />
      <Route path="demo/awnit" element={<Navigate to="/planet/awnit/demo" replace />} />

      {/* ---------- Life (personal presence ledger) ---------- */}
      <Route path="life" element={<LifePlanet />} />

      {/* ---------- Generic planets ---------- */}
      <Route path=":planetId" element={<PlanetOverview />} />
      <Route path=":planetId/:cityId" element={<CityPage />} />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/city" replace />} />
    </Routes>
  );
}







