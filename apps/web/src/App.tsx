import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MLSLanding from "./pages/MLSLanding";
import HomePlanetDashboard from "./pages/HomePlanetDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root */}
        <Route path="/" element={<HomePlanetDashboard />} />

        {/* MLS public page */}
        <Route path="/mls" element={<MLSLanding />} />

        {/* Fallback – redirect anything unknown to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



















