import { Routes, Route, Navigate } from "react-router-dom";

import PlanetOverview from "../pages/PlanetOverview";
import CityPage from "../pages/CityPage";

// Creator planet special pages
import CreatorCity from "../pages/CreatorCity";
import CreatorProjects from "../pages/CreatorProjects";
import CreatorStudio from "../pages/CreatorStudio";
import CreatorBuild from "../pages/CreatorBuild";
import ReleaseViewer from "../pages/ReleaseViewer";
import StarterBoardPreview from "../pages/StarterBoardPreview";

// Demo boards
import AwnitDemoBoard from "../pages/AwnitDemoBoard";
import AutoRepairLiveBoard from "../pages/AutoRepairLiveBoard";
import InvoiceView from "../pages/InvoiceView";
import CommunitySaleBoard from "../pages/community/CommunitySaleBoard";
import TransportationDispatchBoardV2 from "../pages/TransportationDispatchBoardV2";

import LifePlanet from "../pages/LifePlanet";
import JeanettesLanding from "../pages/JeanettesLanding";

// Restaurant demo pages (legacy demo components remain available via explicit routes)
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

// RouteCut Lawn
import RouteCutLawnPage from "../pages/RouteCutLawnPage";
import RouteCutOperatorBoard from "../pages/RouteCutOperatorBoard";
import RouteCutLiveView from "../pages/RouteCutLiveView";

// Payment
import HomePlanetPaymentNode from "../pages/HomePlanetPaymentNode";
import PricingPage from "../pages/PricingPage";
import OnboardingFlow from "../pages/OnboardingFlow";
import OnboardingBuildTransition from "../pages/OnboardingBuildTransition";

export default function PlanetRoutes() {
  /**
   * Dedicated restaurant live-board slug.
   * This must not point at the auto-repair demo slug anymore.
   */
  const RESTAURANT_LIVE_TARGET = "/planet/live/peggies-diner";

  return (
    <Routes>
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* Creator */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/projects" element={<CreatorProjects />} />
      <Route path="creator/studio/*" element={<CreatorStudio />} />
      <Route path="creator/build" element={<CreatorBuild />} />
      <Route path="creator/release/:releaseId" element={<ReleaseViewer />} />
      <Route
        path="creator/*"
        element={<Navigate to="/planet/creator" replace />}
      />

      {/* Generic public demo aliases */}
      <Route path="demo/home-services" element={<AwnitDemoBoard />} />
      <Route path="demo/auto-service" element={<AutoRepairLiveBoard />} />
      <Route path="demo/kitchen-flow" element={<RestaurantRushSimpleDemo />} />
      <Route
        path="demo/kitchen-manual"
        element={<RestaurantRushManualDemo />}
      />

      {/* Restaurant aliases should open the dedicated restaurant live slug */}
      <Route
        path="demo/kitchen-live"
        element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />}
      />
      <Route
        path="demo/restaurant"
        element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />}
      />

      <Route path="demo/example-kitchen" element={<MomsKitchenDemo />} />
      <Route path="demo/legal-workspace" element={<JoeGrantLegalDesk />} />
      <Route path="demo/lawn-route" element={<RouteCutLawnPage />} />
      <Route path="demo/community-sale" element={<CommunitySaleBoard />} />
      <Route
        path="demo/transportation"
        element={<TransportationDispatchBoardV2 />}
      />

      {/* Live board links (slug-driven boards) */}
      <Route path="live/:boardSlug" element={<AutoRepairLiveBoard />} />

      {/* Legacy / named demo routes kept alive */}
      <Route path="vehicles/awnit-demo" element={<AwnitDemoBoard />} />
      <Route
        path="vehicles/awnit-demo/invoice/:invoiceId"
        element={<InvoiceView />}
      />
      <Route path="demo/awnit" element={<AwnitDemoBoard />} />

      {/* Food */}
      <Route
        path="food/restaurant-rush-simple"
        element={<RestaurantRushSimpleDemo />}
      />
      <Route
        path="food/restaurant-rush-manual"
        element={<RestaurantRushManualDemo />}
      />
      <Route
        path="food/restaurant-rush-live"
        element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />}
      />
      <Route
        path="food/restaurant-rush"
        element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />}
      />

      {/* Keep older restaurant demos accessible explicitly */}
      <Route
        path="food/restaurant-rush-legacy"
        element={<RestaurantRushDemo />}
      />
      <Route
        path="food/restaurant-rush-live-classic"
        element={<RestaurantRushLiveDemo />}
      />

      <Route path="food/moms-kitchen" element={<MomsKitchenDemo />} />

      {/* Legal */}
      <Route path="legal/joe-grant" element={<JoeGrantLegalDesk />} />

      {/* Community */}
      <Route
        path="community/community-sale"
        element={<CommunitySaleBoard />}
      />

      {/* Transportation */}
      <Route
        path="transportation/dispatch"
        element={<TransportationDispatchBoardV2 />}
      />

      {/* Guardian */}
      <Route
        path="guardian"
        element={<Navigate to="/planet/guardian-pet/timeline" replace />}
      />
      <Route path="guardian/join" element={<GuardianJoinDesk />} />
      <Route path="guardian/presence" element={<GuardianPresenceDesk />} />

      {/* Pet Guardian */}
      <Route path="guardian-pet" element={<GuardianPetTagDemo />} />
      <Route
        path="guardian-pet/pet/:petId"
        element={<GuardianPetTagDemo />}
      />
      <Route
        path="guardian-pet/found/:petId"
        element={<GuardianPetTagDemo />}
      />
      <Route path="guardian-pet/timeline" element={<PetCareTimelinePanel />} />

      {/* Lawn */}
      <Route path="lawn/routecut" element={<RouteCutLawnPage />} />
      <Route path="demo/routecut" element={<RouteCutLawnPage />} />
      <Route path="routecut/operator" element={<RouteCutOperatorBoard />} />
      <Route path="routecut/live" element={<RouteCutLiveView />} />

      {/* Payment */}
      <Route path="payments/node" element={<HomePlanetPaymentNode />} />

      {/* Onboarding */}
      <Route path="start" element={<OnboardingFlow />} />
      <Route
        path="start/building"
        element={<OnboardingBuildTransition />}
      />
      <Route path="start/preview" element={<StarterBoardPreview />} />

      {/* Other special pages */}
      <Route path="pricing" element={<PricingPage />} />
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