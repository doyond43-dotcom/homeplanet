import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AtmosphereDemoStrip from "./atmosphere/AtmosphereDemoStrip";
import LiveAlias from "./routes/LiveAlias";

import MLSLanding from "./pages/MLSLanding";
import TaylorCreekSite from "./routes/TaylorCreekSite";
import PublicPage from "./routes/PublicPage";

/*
  HomePlanet Routing Layer
  ------------------------
  /taylor-creek        -> marketing / info page
  /c/:slug             -> customer intake page
  /live/:slug          -> shop live dashboard
*/

export default function App() {
  return (
    <BrowserRouter>
      <AtmosphereDemoStrip />
<Routes>

        {/* Main Pages */}
        <Route path="/" element={<Navigate to="/taylor-creek" replace />} />
        <Route path="/mls" element={<MLSLanding />} />

        {/* Shop marketing page */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />

        {/* PUBLIC CUSTOMER INTAKE */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* LIVE SHOP VIEW */}
        <Route path="/live/:slug" element={<TaylorCreekSite />} />

        {/* fallback */}
        <Route path="*" element={<div style={{padding:40}}>404 — Location not found<br/>This place doesn't exist on HomePlanet yet.</div>} />

              <Route path="/live/:slug" element={<LiveAlias />} />
      </Routes>
    </BrowserRouter>
  );
}
























