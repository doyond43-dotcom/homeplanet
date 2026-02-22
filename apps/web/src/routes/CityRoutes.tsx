// apps/web/src/routes/CityRoutes.tsx
import { Routes, Route, useParams, Link, Navigate } from "react-router-dom";
import PrintWorkOrder from "./PrintWorkOrder";
import ServiceBoard from "../service/ServiceBoard";

function CityIndex() {
  const cities = [
    "creator",
    "service",
    "education",
    "safety",
    "family",
    "commerce",
    "health",
    "legal",
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>Cities</h1>
      <p style={{ opacity: 0.7, marginBottom: 20 }}>
        Geography layer — navigation map of HomePlanet
      </p>

      <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        {cities.map((c) => {
          // SPECIAL: Service City should jump into the real Service namespace
          const to = c === "service" ? "/service/taylor-creek" : `/city/${c}`;

          return (
            <Link
              key={c}
              to={to}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                textDecoration: "none",
                background: "#121212",
                border: "1px solid #2a2a2a",
                color: "white",
                textTransform: "capitalize",
              }}
            >
              {c} city
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function CityPlaceholder() {
  // Works for /city/* (splat). If this renders on root by accident, clean will be "".
  const { "*": citySlug } = useParams();
  const clean = (citySlug || "").split("/")[0];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>
        {clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "City"} City
      </h1>

      <p style={{ opacity: 0.7 }}>
        City placeholder — routing anchor only. No features being added.
      </p>
    </div>
  );
}

export default function CityRoutes() {
  return (
    <Routes>
      {/* ABSOLUTE route so /print/:id works even if CityRoutes is mounted under /:slug/* */}
      <Route path="/print/:id" element={<PrintWorkOrder />} />

      {/* NEW: clean isolated Service UI layer (safe to delete later) */}
      <Route path="/service" element={<Navigate to="/service/taylor-creek" replace />} />
      <Route path="/service/:shopSlug" element={<ServiceBoard />} />
      <Route path="/service/:shopSlug/board" element={<ServiceBoard />} />

      {/* /  OR  /city  */}
      <Route index element={<CityIndex />} />

      {/* /city/<anything> */}
      <Route path="*" element={<CityPlaceholder />} />
    </Routes>
  );
}