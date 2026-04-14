import { Routes, Route, Navigate } from "react-router-dom";

import PlanetOverview from "../pages/PlanetOverview";
import CityPage from "../pages/CityPage";

// Creator planet special pages
import CreatorCity from "../pages/CreatorCity";
import CreatorLanding from "../pages/CreatorLanding";
import CreatorSystems from "../pages/CreatorSystems";
import CreatorProjects from "../pages/CreatorProjects";
import CreatorStudio from "../pages/CreatorStudio";
import CreatorStudioBoard from "../pages/CreatorStudioBoard";
import CreatorBuild from "../pages/CreatorBuild";
import ReleaseViewer from "../pages/ReleaseViewer";
import StarterBoardPreview from "../pages/StarterBoardPreview";
import RcAirboatsLiveDemo from "../pages/RcAirboatsLiveDemo";
import ExperiencePlanet from "../pages/ExperiencePlanet";
import PresenceGridPreview from "../pages/PresenceGridPreview";
import HayleyLiveBoard from "../pages/HayleyLiveBoard";
import MealBoardDemo from "../pages/MealBoardDemo";
import MealLaunchFlow from "../pages/MealLaunchFlow";
import MealBusinessDemo from "../pages/MealBusinessDemo";
import BigDaveEatsLive from "../pages/BigDaveEatsLive";
import SkateZoneDemo from "../pages/SkateZoneDemo";
import SkateZoneQrDemo from "../pages/SkateZoneQrDemo";
import SkateZonePublicWaiverPage from "../pages/SkateZonePublicWaiverPage";
import PredatorShieldIntervention from "../pages/PredatorShieldIntervention";

import BeautySalonLiveBoard from "../pages/BeautySalonLiveBoard";
import BeautySalonBookingPage from "../pages/BeautySalonBookingPage";
import BeautySalonLandingPage from "../pages/BeautySalonLandingPage";
import ColorMeCrazyLanding from "../pages/ColorMeCrazyLanding";

// Creation moment
import CreationMomentPage from "../pages/CreationMomentPage";

// Guardian child views
import ParentChildView from "../pages/ParentChildView";
import GuardianPublicProfilePage from "../pages/GuardianPublicProfilePage";

// Demo boards
import AwnitDemoBoard from "../pages/AwnitDemoBoard";
import AutoRepairLiveBoard from "../pages/AutoRepairLiveBoard";
import InvoiceView from "../pages/InvoiceView";
import CommunitySaleBoard from "../pages/community/CommunitySaleBoard";
import TransportationDispatchBoardV2 from "../pages/TransportationDispatchBoardV2";
import EscapeBoardDemo from "../pages/EscapeBoardDemo";
import EscapeSessionLauncher from "../pages/EscapeSessionLauncher";
import EscapeSessionPage from "../pages/EscapeSessionPage";
import EscapeWatchModePage from "../pages/EscapeWatchModePage";
import PlanetBamboo from "../pages/PlanetBamboo";

import LifePlanet from "../pages/LifePlanet";
import JeanettesLanding from "../pages/JeanettesLanding";

// Restaurant demo pages
import RestaurantRushSimpleDemo from "../pages/RestaurantRushSimpleDemo";
import RestaurantRushManualDemo from "../pages/RestaurantRushManualDemo";
import RestaurantRushLiveDemo from "../pages/RestaurantRushLiveDemo";
import RestaurantRushDemo from "../pages/RestaurantRushDemo";
import MomsKitchenDemo from "../pages/MomsKitchenDemo";
import MealBusinessLiveDemo from "../pages/MealBusinessLiveDemo";

// Legal
import JoeGrantLegalDesk from "../pages/JoeGrantLegalDesk";

// Guardian
import PlanetGuardian from "../pages/PlanetGuardian";
import GuardianPresenceDesk from "../pages/GuardianPresenceDesk";
import GuardianJoinDesk from "../pages/GuardianJoinDesk";
import GuardianPetTagDemo from "../pages/GuardianPetTagDemo";
import GuardianHouseholdBoard from "../pages/GuardianHouseholdBoard";
import GuardianHomePage from "../pages/GuardianHomePage";
import GuardianStartPage from "../pages/GuardianStartPage";
import GuardianActivationPage from "../pages/GuardianActivationPage";
import GuardianOnboardingPage from "../pages/GuardianOnboardingPage";
import GuardianPanicPage from "../pages/GuardianPanicPage";
import GuardianPanicLiveBoard from "../pages/GuardianPanicLiveBoard";
import PetCareTimelinePanel from "../components/guardian/PetCareTimelinePanel";

// Fulfillment
import PetTagFulfillmentBoard from "../pages/PetTagFulfillmentBoard";

// Emily
import EmilyLearningDesk from "../pages/EmilyLearningDesk";

// RouteCut
import RouteCutLawnPage from "../pages/RouteCutLawnPage";
import RouteCutOperatorBoard from "../pages/RouteCutOperatorBoard";
import RouteCutLiveView from "../pages/RouteCutLiveView";

// Payment
import HomePlanetPaymentNode from "../pages/HomePlanetPaymentNode";
import NoScreenshotPaymentsDemo from "../pages/NoScreenshotPaymentsDemo";
import PricingPage from "../pages/PricingPage";
import OnboardingFlow from "../pages/OnboardingFlow";
import OnboardingBuildTransition from "../pages/OnboardingBuildTransition";

export default function PlanetRoutes() {
  const RESTAURANT_LIVE_TARGET = "/planet/live/peggies-diner";

  return (
    <Routes>
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* CREATOR */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/start" element={<CreatorLanding />} />
      <Route path="creator/systems" element={<CreatorSystems />} />
      <Route path="creator/projects" element={<CreatorProjects />} />
      <Route path="creator/studio/*" element={<CreatorStudio />} />
      <Route path="creator/studio-board" element={<CreatorStudioBoard />} />
      <Route path="creator/build" element={<CreatorBuild />} />
      <Route path="creator/release/:releaseId" element={<ReleaseViewer />} />
      <Route path="creator/rc-live" element={<RcAirboatsLiveDemo />} />
      <Route path="creator/hayley-live" element={<HayleyLiveBoard />} />
      <Route path="creator/big-dave-eats" element={<BigDaveEatsLive />} />
      <Route path="creator/building" element={<CreationMomentPage />} />
      <Route path="creator/*" element={<Navigate to="/planet/creator" replace />} />

      {/* EXPERIENCE */}
      <Route path="experience" element={<ExperiencePlanet />} />
      <Route path="experience/demo" element={<ExperiencePlanet />} />
      <Route path="experience/escape-board" element={<EscapeBoardDemo />} />
      <Route path="experience/start" element={<EscapeSessionLauncher />} />
      <Route path="experience/session/:sessionId" element={<EscapeSessionPage />} />
      <Route path="experience/watch" element={<EscapeWatchModePage />} />

      {/* DEMOS */}
      <Route path="demo/home-services" element={<AwnitDemoBoard />} />
      <Route path="demo/auto-service" element={<BeautySalonLiveBoard />} />
      <Route path="demo/kitchen-flow" element={<RestaurantRushSimpleDemo />} />
      <Route path="demo/kitchen-manual" element={<RestaurantRushManualDemo />} />
      <Route path="demo/escape-board" element={<EscapeBoardDemo />} />
      <Route path="demo/kitchen-live" element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />} />
      <Route path="demo/restaurant" element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />} />
      <Route path="demo/example-kitchen" element={<MomsKitchenDemo />} />
      <Route path="demo/legal-workspace" element={<JoeGrantLegalDesk />} />
      <Route path="demo/lawn-route" element={<RouteCutLawnPage />} />
      <Route path="demo/community-sale" element={<CommunitySaleBoard />} />
      <Route path="demo/transportation" element={<TransportationDispatchBoardV2 />} />
      <Route path="demo/meal-board" element={<MealBoardDemo />} />
      <Route path="demo/meal-business" element={<MealBusinessDemo />} />
      <Route path="demo/skatezone" element={<SkateZoneDemo />} />
      <Route path="demo/skatezone-qr" element={<SkateZoneQrDemo />} />
      <Route path="demo/beauty-color-me-crazy" element={<BeautySalonLiveBoard />} />
      <Route path="demo/bamboo" element={<PlanetBamboo />} />
      <Route path="demo/no-screenshot-payments" element={<NoScreenshotPaymentsDemo />} />

      {/* LIVE BOARD */}
      <Route path="live/:boardSlug" element={<BeautySalonLiveBoard />} />

      {/* VEHICLES */}
      <Route path="vehicles/awnit-demo" element={<AwnitDemoBoard />} />
      <Route path="vehicles/awnit-demo/invoice/:invoiceId" element={<InvoiceView />} />
      <Route path="demo/awnit" element={<AwnitDemoBoard />} />

      {/* FOOD */}
      <Route path="food/restaurant-rush-simple" element={<RestaurantRushSimpleDemo />} />
      <Route path="food/restaurant-rush-manual" element={<RestaurantRushManualDemo />} />
      <Route path="food/restaurant-rush-live" element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />} />
      <Route path="food/restaurant-rush" element={<Navigate to={RESTAURANT_LIVE_TARGET} replace />} />
      <Route path="food/restaurant-rush-legacy" element={<RestaurantRushDemo />} />
      <Route path="food/restaurant-rush-live-classic" element={<RestaurantRushLiveDemo />} />
      <Route path="food/moms-kitchen" element={<MomsKitchenDemo />} />

      {/* LIFESTYLE */}
      <Route path="lifestyle/meal-demo" element={<MealBusinessDemo />} />
      <Route path="lifestyle/meal-live" element={<MealBusinessLiveDemo />} />
      <Route path="lifestyle/meal-start" element={<MealLaunchFlow />} />
      <Route path="lifestyle/meal-board-demo" element={<MealBoardDemo />} />

      {/* ICE */}
      <Route path="ice/skatezone-demo" element={<SkateZoneDemo />} />
      <Route path="ice/skatezone-qr-demo" element={<SkateZoneQrDemo />} />

      {/* BEAUTY */}
      <Route path="beauty/color-me-crazy/start" element={<BeautySalonLandingPage />} />
      <Route path="beauty/color-me-crazy/book" element={<BeautySalonBookingPage />} />
      <Route path="beauty/color-me-crazy" element={<BeautySalonLiveBoard />} />
      <Route path="beauty/color-me-crazy/home" element={<ColorMeCrazyLanding />} />

      {/* PUBLIC WAIVER */}
      <Route path="waiver/:waiverId" element={<SkateZonePublicWaiverPage />} />

      {/* LEGAL */}
      <Route path="legal/joe-grant" element={<JoeGrantLegalDesk />} />

      {/* COMMUNITY */}
      <Route path="community/community-sale" element={<CommunitySaleBoard />} />

      {/* TRANSPORT */}
      <Route path="transportation/dispatch" element={<TransportationDispatchBoardV2 />} />

      {/* BAMBOO */}
      <Route path="bamboo" element={<PlanetBamboo />} />

      {/* PREDATORSHIELD */}
      <Route path="predatorshield/test" element={<PredatorShieldIntervention />} />

      {/* GUARDIAN */}
      <Route path="guardian" element={<PlanetGuardian />} />
      <Route path="guardian/start" element={<GuardianStartPage />} />
      <Route path="guardian/activate" element={<GuardianActivationPage />} />
      <Route path="guardian/onboarding" element={<GuardianOnboardingPage />} />
      <Route path="guardian/panic" element={<GuardianPanicPage />} />
      <Route path="guardian/panic/:incidentId" element={<GuardianPanicLiveBoard />} />
      <Route path="guardian-household" element={<GuardianHouseholdBoard />} />
      <Route path="guardian/home" element={<GuardianHomePage />} />
      <Route path="guardian/join" element={<GuardianJoinDesk />} />
      <Route path="guardian/presence" element={<GuardianPresenceDesk />} />
      <Route path="guardian/fulfillment" element={<PetTagFulfillmentBoard />} />
      <Route path="guardian/child/:childId" element={<ParentChildView />} />
      <Route path="guardian/public/:profileId" element={<GuardianPublicProfilePage />} />
      <Route path="guardian-pet" element={<GuardianPetTagDemo />} />
      <Route path="guardian-pet/pet/:petId" element={<GuardianPetTagDemo />} />
      <Route path="guardian-pet/found/:petId" element={<GuardianPetTagDemo />} />
      <Route path="guardian-pet/timeline" element={<PetCareTimelinePanel />} />

      {/* ROUTECUT */}
      <Route path="lawn/routecut" element={<RouteCutLawnPage />} />
      <Route path="demo/routecut" element={<RouteCutLawnPage />} />
      <Route path="routecut/operator" element={<RouteCutOperatorBoard />} />
      <Route path="routecut/live" element={<RouteCutLiveView />} />

      {/* PAYMENTS */}
      <Route path="payments/node" element={<HomePlanetPaymentNode />} />
      <Route path="payments/no-screenshot" element={<NoScreenshotPaymentsDemo />} />

      {/* START */}
      <Route path="start" element={<OnboardingFlow />} />
      <Route path="start/building" element={<OnboardingBuildTransition />} />
      <Route path="start/preview" element={<StarterBoardPreview />} />

      {/* STATIC */}
      <Route path="pricing" element={<PricingPage />} />
      <Route path="jeanettes" element={<JeanettesLanding />} />
      <Route path="life" element={<LifePlanet />} />
      <Route path="emily" element={<EmilyLearningDesk />} />

      {/* DEV */}
      <Route path="dev/presence-grid" element={<PresenceGridPreview />} />

      {/* FALLBACK */}
      <Route path=":planetId" element={<PlanetOverview />} />
      <Route path=":planetId/:cityId" element={<CityPage />} />
      <Route path="*" element={<Navigate to="/planet/creator" replace />} />
    </Routes>
  );
}
