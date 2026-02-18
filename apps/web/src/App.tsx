import { BrowserRouter, Routes, Route } from "react-router-dom";

import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import LiveAlias from "./routes/LiveAlias";

import AtmosphereDemoStrip from "./atmosphere/AtmosphereDemoStrip";

import MLSLanding from "./pages/MLSLanding";
import TaylorCreekSite from "./routes/TaylorCreekSite";
import PublicPage from "./routes/PublicPage";
import CityRoutes from "./routes/CityRoutes";

/*
  HomePlanet Routing Layer
  ------------------------
  /                   -> planet index (cities)
  /city/*             -> city navigation
  /taylor-creek       -> shop marketing page
  /c/:slug            -> customer intake page
  /live/:slug/board   -> shop live dashboard
*/

export default function App() {
  return (
    <BrowserRouter>
      <AtmosphereDemoStrip />

      <Routes>

        {/* PLANET ROOT (FIXED) */}
        <Route path="/" element={<CityRoutes />} />
        <Route path="/city/*" element={<CityRoutes />} />

        {/* MLS */}
        <Route path="/mls" element={<MLSLanding />} />

        {/* Shop marketing page */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />

        {/* PUBLIC CUSTOMER INTAKE */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE SHOP BOARD */}
        <Route path="/live/:slug/board" element={<LiveIntakeBoard />} />

        {/* LIVE ALIAS (auto redirect to /c/:slug) */}
        <Route path="/live/:slug" element={<LiveAlias />} />

        {/* fallback */}
        <Route
          path="*"
          element={
            <div style={{ padding: 40 }}>
              404 — Location not found
              <br />
              This place doesn't exist on HomePlanet yet.
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}





























