import { Routes, Route, Navigate } from "react-router-dom";

import CreatorCity from "../pages/CreatorCity";
import CreatorBuild from "../pages/CreatorBuild";
import CreatorProjects from "../pages/CreatorProjects";
import CreatorStudio from "../pages/CreatorStudio";

/**
 * Planet layer:
 * - Keep /planet/creator/* working (legacy + deep links)
 * - You can later expand this to other planets without breaking creator.
 */
export default function PlanetRoutes() {
  return (
    <Routes>
      {/* /planet */}
      <Route index element={<Navigate to="/planet/creator" replace />} />

      {/* CREATOR PLANET (REAL) */}
      <Route path="creator" element={<CreatorCity />} />
      <Route path="creator/build/*" element={<CreatorBuild />} />
      <Route path="creator/projects/*" element={<CreatorProjects />} />
      <Route path="creator/studio/*" element={<CreatorStudio />} />

      {/* If someone hits /planet/creator/<anything> */}
      <Route path="creator/*" element={<Navigate to="/planet/creator" replace />} />

      {/* Other planets can be wired later */}
      <Route path="*" element={<Navigate to="/city" replace />} />
    </Routes>
  );
}