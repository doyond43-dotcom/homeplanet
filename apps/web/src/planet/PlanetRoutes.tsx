import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";

/**
 * PlanetRoutes (restore)
 *
 * Purpose right now:
 * - Fix prod build (App.tsx imports ./planet/PlanetRoutes)
 * - Prevent /planet/creator/* from 404 by redirecting to existing root routes (e.g. /creator/*)
 *
 * Later we can reintroduce “true planet nesting” once production is green.
 */

function PlanetCityRedirect() {
  const { city } = useParams<{ city: string }>();
  const loc = useLocation();

  const safeCity = (city || "").trim().toLowerCase();

  const prefix = `/planet/${safeCity}`;
  const suffix = loc.pathname.startsWith(prefix) ? loc.pathname.slice(prefix.length) : "";

  const to = `/${safeCity}${suffix}${loc.search}${loc.hash}`;

  if (!safeCity) return <Navigate to="creator" replace />;

  return <Navigate to={to} replace />;
}

export default function PlanetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="creator" replace />} />
      <Route path=":city/*" element={<PlanetCityRedirect />} />
      <Route path="*" element={<Navigate to="creator" replace />} />
    </Routes>
  );
}
