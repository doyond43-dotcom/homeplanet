import { BrowserRouter, Routes, Route } from "react-router-dom";

import MLSLanding from "./pages/MLSLanding";
import PressPage from "./routes/PressPage";
import PublicPage from "./routes/PublicPage";
import CityRoutes from "./routes/CityRoutes";
import NotFound from "./pages/NotFound";

/**
 * HomePlanet World Router
 * Order matters:
 * 1) specific locations
 * 2) dynamic slug
 * 3) true 404
 */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home (neutral entry — NOT MLS) */}
        <Route path="/" element={<div style={{padding:24}}>HomePlanet</div>} />

        {/* Control Layer */}
        <Route path="/mls" element={<MLSLanding />} />

        {/* Public Trust Layer */}
        <Route path="/press/:slug" element={<PressPage />} />

        {/* Geography Layer */}
        <Route path="/city/*" element={<CityRoutes />} />

        {/* Action Layer (tenant intake) */}
        <Route path="/:slug" element={<PublicPage />} />

        {/* True 404 — must be last */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}




















