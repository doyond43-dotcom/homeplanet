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
import HomePlanetKids from "../pages/HomePlanetKids";
import HomePlanetKidsStart from "../pages/HomePlanetKidsStart";
import HomePlanetKidsSpace from "../pages/HomePlanetKidsSpace";
import HomePlanetKidsProject from "../pages/HomePlanetKidsProject";

import AutoRepairLiveBoard from "../pages/AutoRepairLiveBoard";
import AutoRepairLiveBoardSample from "../pages/AutoRepairLiveBoardSample";
import BeautySalonLiveBoard from "../pages/BeautySalonLiveBoard";
import BeautySalonBookingPage from "../pages/BeautySalonBookingPage";
import BeautySalonLandingPage from "../pages/BeautySalonLandingPage";
import ButcherLivestockIntakeFlow from "../pages/ButcherLivestockIntakeFlow";
import ButcherLivestockTruthBoard from "../pages/ButcherLivestockTruthBoard";
import ColorMeCrazyLanding from "../pages/ColorMeCrazyLanding";
import GuardianMobilityLiveBoard from "../pages/GuardianMobilityLiveBoard";
import LiveBoardRouter from "../pages/LiveBoardRouter";

// SAFARI
import SafariSalesPage from "../pages/SafariSalesPage";
import SafariAnimalPage from "../pages/SafariAnimalPage";
import SafariMomentPage from "../pages/SafariMomentPage";
import SafariLiveBoard from "../pages/SafariLiveBoard";

// Creation moment
import CreationMomentPage from "../pages/CreationMomentPage";

// Guardian child views
import ParentChildView from "../pages/ParentChildView";
import GuardianPublicProfilePage from "../pages/GuardianPublicProfilePage";

// Demo boards
import AwnitDemoBoard from "../pages/AwnitDemoBoard";
import CampAquaflowStandalone from "../pages/CampAquaflowStandalone";
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

// 🔥 YOUR NEW FILE
import JoeysPizzaLiveBoard from "../pages/JoeysPizzaLiveBoard";

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
  return (
    <Routes>
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* CREATOR */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/start" element={<CreatorLanding />} />
      <Route path="creator/systems" element={<CreatorSystems />} />

      {/* EXPERIENCE */}
      <Route path="experience" element={<ExperiencePlanet />} />

      {/* DEMOS */}
      <Route path="demo/restaurant" element={<RestaurantRushLiveDemo />} />

      {/* 🔥 YOUR LIVE PIZZA PAGE */}
      <Route path="demo/joeys-pizza" element={<JoeysPizzaLiveBoard />} />

      <Route path="demo/no-screenshot-payments" element={<NoScreenshotPaymentsDemo />} />
      <Route path="payments/no-screenshot" element={<NoScreenshotPaymentsDemo />} />

      {/* SAFARI */}
      <Route path="safari" element={<SafariSalesPage />} />
      <Route path="safari/:animalSlug" element={<SafariAnimalPage />} />

      {/* LIVE */}
      <Route path="live/safari-demo" element={<SafariLiveBoard />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/planet/creator" replace />} />
    </Routes>
  );
}