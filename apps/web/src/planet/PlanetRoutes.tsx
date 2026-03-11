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

// Wilding
import WildingLandingPage from "../pages/WildingLandingPage";
import WildingLiveBoard from "../pages/WildingLiveBoard";

// Legal demo
import LegalDemoBoard from "../pages/LegalDemoBoard";

// Transportation demo (V2 Dispatch System)
import TransportationDispatchBoardV2 from "../pages/TransportationDispatchBoardV2";

// Mom's Kitchen demo
import MomsKitchenDemo from "../pages/MomsKitchenDemo";
import RestaurantRushManualDemo from "../pages/RestaurantRushManualDemo";
import RestaurantRushSimpleDemo from "../pages/RestaurantRushSimpleDemo";
import RestaurantRushLiveDemo from "../pages/RestaurantRushLiveDemo";

// Life
import LifePlanet from "../pages/LifePlanet";

/**
 * Planet layer:
 * - /planet/creator is the Creator hub
 * - /planet/vehicles/awnit-demo is AWNIT Live Demo Board
 * - /planet/vehicles/awnit-demo/invoice/:invoiceId is the invoice view
 * - /planet/services/wilding is the Wilding Enterprises landing page
 * - /planet/services/wilding-board is the Wilding Live Work Board
 * - /planet/legal/demo is the Legal Evidence Demo Board
 * - /planet/transport/demo is the Transportation Dispatch Demo Board (V2)
 * - /planet/food/moms-kitchen-demo is Mom's Kitchen Live Demo Board
 * - /planet/food/restaurant-rush-manual is the manual restaurant rush demo board
 * - /planet/food/restaurant-rush-simple is the simplified restaurant rush demo board
 * - /planet/food/restaurant-rush-live is the LIVE rush simulation demo
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

      {/* ---------- WILDING ---------- */}
      <Route path="services/wilding" element={<WildingLandingPage />} />
      <Route path="services/wilding-board" element={<WildingLiveBoard />} />

      {/* ---------- LEGAL DEMO ---------- */}
      <Route path="legal/demo" element={<LegalDemoBoard />} />

      {/* ---------- TRANSPORTATION DISPATCH DEMO (V2) ---------- */}
      <Route path="transport/demo" element={<TransportationDispatchBoardV2 />} />

      {/* ---------- FOOD / RESTAURANT DEMOS ---------- */}
      <Route path="food/moms-kitchen-demo" element={<MomsKitchenDemo />} />
      <Route path="food/restaurant-rush-manual" element={<RestaurantRushManualDemo />} />
      <Route path="food/restaurant-rush-simple" element={<RestaurantRushSimpleDemo />} />
      <Route path="food/restaurant-rush-live" element={<RestaurantRushLiveDemo />} />

      {/* ---------- Demo redirects ---------- */}
      <Route path="demo/awnit" element={<Navigate to="/planet/vehicles/awnit-demo" replace />} />
      <Route path="demo/wilding" element={<Navigate to="/planet/services/wilding" replace />} />
      <Route path="demo/wilding-board" element={<Navigate to="/planet/services/wilding-board" replace />} />
      <Route path="demo/restaurant-rush-manual" element={<Navigate to="/planet/food/restaurant-rush-manual" replace />} />
      <Route path="demo/restaurant-rush-simple" element={<Navigate to="/planet/food/restaurant-rush-simple" replace />} />
      <Route path="demo/restaurant-rush-live" element={<Navigate to="/planet/food/restaurant-rush-live" replace />} />

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