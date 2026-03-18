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
import JeanettesLanding from "../pages/JeanettesLanding";

// Restaurant demo pages
import RestaurantRushSimpleDemo from "../pages/RestaurantRushSimpleDemo";
import RestaurantRushManualDemo from "../pages/RestaurantRushManualDemo";
import RestaurantRushLiveDemo from "../pages/RestaurantRushLiveDemo";
import RestaurantRushDemo from "../pages/RestaurantRushDemo";
import MomsKitchenDemo from "../pages/MomsKitchenDemo";

// Legal demo pages
import JoeGrantLegalDesk from "../pages/JoeGrantLegalDesk";

// Guardian
import GuardianPresenceDesk from "../pages/GuardianPresenceDesk";
import GuardianJoinDesk from "../pages/GuardianJoinDesk";
import GuardianPetTagDemo from "../pages/GuardianPetTagDemo";
import PetCareTimelinePanel from "../components/guardian/PetCareTimelinePanel";

// Emily
import EmilyLearningDesk from "../pages/EmilyLearningDesk";

/**
 * Planet layer:
 * - /planet/creator is a special "launchpad" (CreatorCity)
 * - /planet/vehicles/awnit-demo is a special demo surface
 * - /planet/food/... exposes restaurant demo pages
 * - /planet/legal/... exposes legal demo pages
 * - /planet/guardian now redirects to the pet care timeline demo
 * - /planet/guardian/join and /planet/guardian/presence keep the original human Guardian surfaces
 * - /planet/guardian-pet is the separate pet tag demo landing
 * - /planet/emily exposes Emily's learning desk
 * - /planet/:planetId routes to PlanetOverview
 * - /planet/:planetId/:cityId routes to CityPage
 */
export default function PlanetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* Creator */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/projects" element={<CreatorProjects />} />
      <Route path="creator/studio/*" element={<CreatorStudio />} />
      <Route path="creator/build" element={<CreatorBuild />} />
      <Route path="creator/release/:releaseId" element={<ReleaseViewer />} />
      <Route path="creator/*" element={<Navigate to="/planet/creator" replace />} />

      {/* AWNIT */}
      <Route path="vehicles/awnit-demo" element={<AwnitDemoBoard />} />
      <Route path="vehicles/awnit-demo/invoice/:invoiceId" element={<InvoiceView />} />
      <Route path="demo/awnit" element={<AwnitDemoBoard />} />

      {/* Food */}
      <Route path="food/restaurant-rush-simple" element={<RestaurantRushSimpleDemo />} />
      <Route path="food/restaurant-rush-manual" element={<RestaurantRushManualDemo />} />
      <Route path="food/restaurant-rush-live" element={<RestaurantRushLiveDemo />} />
      <Route path="food/restaurant-rush" element={<RestaurantRushDemo />} />
      <Route path="food/moms-kitchen" element={<MomsKitchenDemo />} />

      {/* Legal */}
      <Route path="legal/joe-grant" element={<JoeGrantLegalDesk />} />

      {/* Guardian */}
      <Route
        path="guardian"
        element={<Navigate to="/planet/guardian-pet/timeline" replace />}
      />
      <Route path="guardian/join" element={<GuardianJoinDesk />} />
      <Route path="guardian/presence" element={<GuardianPresenceDesk />} />

      {/* Pet Guardian */}
      <Route path="guardian-pet" element={<GuardianPetTagDemo />} />
      <Route path="guardian-pet/pet/:petId" element={<GuardianPetTagDemo />} />
      <Route path="guardian-pet/found/:petId" element={<GuardianPetTagDemo />} />
      <Route path="guardian-pet/timeline" element={<PetCareTimelinePanel />} />

      {/* Other special pages */}
      <Route path="jeanettes" element={<JeanettesLanding />} />
      <Route path="life" element={<LifePlanet />} />
      <Route path="emily" element={<EmilyLearningDesk />} />

      {/* Generic planets */}
      <Route path=":planetId" element={<PlanetOverview />} />
      <Route path=":planetId/:cityId" element={<CityPage />} />

      <Route path="*" element={<Navigate to="/planet/creator" replace />} />
    </Routes>
  );
}