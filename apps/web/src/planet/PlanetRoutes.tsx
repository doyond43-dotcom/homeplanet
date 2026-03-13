import { Routes, Route, Navigate } from "react-router-dom";

import PlanetOverview from "../pages/PlanetOverview";
import CityPage from "../pages/CityPage";

// Creator planet special pages
import CreatorCity from "../pages/CreatorCity";
import CreatorProjects from "../pages/CreatorProjects";
import CreatorStudio from "../pages/CreatorStudio";
import CreatorBuild from "../pages/CreatorBuild";
import ReleaseViewer from "../pages/ReleaseViewer";

// AWNIT Demo Board
import AwnitDemoBoard from "../pages/AwnitDemoBoard";
import InvoiceView from "../pages/InvoiceView";

import LifePlanet from "../pages/LifePlanet";

/* NEW PAGE */
import JeanettesLanding from "../pages/JeanettesLanding";

/* Restaurant demo pages */
import RestaurantRushSimpleDemo from "../pages/RestaurantRushSimpleDemo";
import RestaurantRushManualDemo from "../pages/RestaurantRushManualDemo";
import RestaurantRushLiveDemo from "../pages/RestaurantRushLiveDemo";
import RestaurantRushDemo from "../pages/RestaurantRushDemo";
import MomsKitchenDemo from "../pages/MomsKitchenDemo";

/**
 * Planet layer:
 * - /planet/creator is a special "launchpad" (CreatorCity)
 * - /planet/vehicles/awnit-demo is a special demo surface
 * - /planet/food/... exposes restaurant demo pages
 * - /planet/:planetId routes to PlanetOverview
 * - /planet/:planetId/:cityId routes to CityPage
 * - legacy creator paths stay stable
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

      {/* If someone hits /planet/creator/<anything-unknown>, keep them on Creator */}
      <Route path="creator/*" element={<Navigate to="/planet/creator" replace />} />

      {/* ---------- AWNIT Demo (must be ABOVE generic routes) ---------- */}
      <Route path="vehicles/awnit-demo" element={<AwnitDemoBoard />} />
      <Route path="vehicles/awnit-demo/invoice/:invoiceId" element={<InvoiceView />} />

      {/* ---------- Legacy/Fallback demo path (optional) ---------- */}
      <Route path="demo/awnit" element={<AwnitDemoBoard />} />

      {/* ---------- Restaurant / Food demos (must be ABOVE generic routes) ---------- */}
      <Route path="food/restaurant-rush-simple" element={<RestaurantRushSimpleDemo />} />
      <Route path="food/restaurant-rush-manual" element={<RestaurantRushManualDemo />} />
      <Route path="food/restaurant-rush-live" element={<RestaurantRushLiveDemo />} />
      <Route path="food/restaurant-rush" element={<RestaurantRushDemo />} />
      <Route path="food/moms-kitchen" element={<MomsKitchenDemo />} />

      {/* ---------- Jeanette Landing Page ---------- */}
      <Route path="jeanettes" element={<JeanettesLanding />} />

      {/* ---------- Life (personal presence ledger) ---------- */}
      <Route path="life" element={<LifePlanet />} />

      {/* ---------- Generic planets ---------- */}
      <Route path=":planetId" element={<PlanetOverview />} />
      <Route path=":planetId/:cityId" element={<CityPage />} />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/planet/creator" replace />} />
    </Routes>
  );
}