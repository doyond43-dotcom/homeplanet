import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MLSLanding from "./pages/MLSLanding";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main = MLS (so root works even if /mls is weird) */}
        <Route path="/" element={<MLSLanding />} />

        {/* Explicit MLS route */}
        <Route path="/mls" element={<MLSLanding />} />

        {/* Anything else goes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}



















