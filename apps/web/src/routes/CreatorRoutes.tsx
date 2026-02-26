import { Routes, Route, Navigate } from "react-router-dom";

import CreatorCity from "../pages/CreatorCity";
import CreatorBuild from "../pages/CreatorBuild";
import CreatorProjects from "../pages/CreatorProjects";
import CreatorStudio from "../pages/CreatorStudio";

export default function CreatorRoutes() {
  return (
    <Routes>
      {/* /creator */}
      <Route index element={<CreatorCity />} />

      {/* REAL tools */}
      <Route path="build/*" element={<CreatorBuild />} />
      <Route path="projects/*" element={<CreatorProjects />} />
      <Route path="studio/*" element={<CreatorStudio />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/creator" replace />} />
    </Routes>
  );
}