import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import LiveAlias from "./routes/LiveAlias";
import LiveShopTV from "./routes/LiveShopTV";

import AtmosphereDemoStrip from "./atmosphere/AtmosphereDemoStrip";

import MLSLanding from "./pages/MLSLanding";
import TaylorCreekSite from "./routes/TaylorCreekSite";
import PublicPage from "./routes/PublicPage";
import CityRoutes from "./routes/CityRoutes";

/*
  HomePlanet Routing Layer
  ------------------------
  /                   -> redirect to /city (planet index)
  /city/*             -> city navigation
  /taylor-creek       -> shop marketing page
  /c/:slug            -> customer intake page (QR)
  /live/:slug         -> TV board (public display)
  /live/:slug/board   -> staff board (clickable rows + drawer)
  /go/:slug           -> alias redirect to /c/:slug (optional helper)
*/

export default function App() {
  return (
    <BrowserRouter>
      <AtmosphereDemoStrip />

      <Routes>
        {/* ROOT: always go to Cities index */}
        <Route path="/" element={<Navigate to="/city" replace />} />

        {/* City index + navigation */}
        <Route path="/city" element={<CityRoutes />} />
        <Route path="/city/*" element={<CityRoutes />} />

        {/* MLS */}
        <Route path="/mls" element={<MLSLanding />} />

        {/* Shop marketing page */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />

        {/* PUBLIC CUSTOMER INTAKE (QR CODE TARGET) */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* STAFF BOARD (internal use) */}
        <Route path="/live/:slug/board" element={<LiveIntakeBoard />} />

        {/* TV BOARD (public display) */}
        <Route path="/live/:slug" element={<LiveShopTV />} />

        {/* OPTIONAL: alias redirect to intake (keeps old "live-as-intake" idea without breaking TV) */}
        <Route path="/go/:slug" element={<LiveAlias />} />

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
