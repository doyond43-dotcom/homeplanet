import { Navigate, Route, Routes } from "react-router-dom";

/**
 * PlanetRoutes
 * Temporary stability mode:
 * - /planet stays valid (no 404)
 * - /planet/creator/* forwards to the real Creator tools under /creator/*
 * This prevents the planet namespace from stealing UI while we finish Friday demo.
 */
export default function PlanetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/creator" replace />} />

      {/* Creator planet -> Creator tools */}
      <Route path="creator" element={<Navigate to="/creator" replace />} />
      <Route path="creator/build" element={<Navigate to="/creator/build" replace />} />
      <Route path="creator/projects" element={<Navigate to="/creator/projects" replace />} />
      <Route path="creator/studio" element={<Navigate to="/creator/studio" replace />} />
      <Route path="creator/*" element={<Navigate to="/creator" replace />} />

      {/* Any other planet route -> Creator for now */}
      <Route path="*" element={<Navigate to="/creator" replace />} />
    </Routes>
  );
}