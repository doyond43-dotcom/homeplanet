// apps/web/src/routes/CityRoutes.tsx
import { Routes, Route, Link, Navigate } from "react-router-dom";

// /city/creator should be the CreatorCity launchpad (NOT CreatorStudio tool screen)
import CreatorCity from "../pages/CreatorCity";

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
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
        HomePlanet Cities
      </h1>
      <div style={{ color: "#94a3b8", marginBottom: 16 }}>
        Choose a City (these routes live under <code>/city/</code>).
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {cities.map((c) => (
          <Link
            key={c}
            to={`/city/${c}`}
            style={{
              border: "1px solid #1f2937",
              background: "#0b1220",
              padding: 14,
              borderRadius: 14,
              color: "#e5e7eb",
              textDecoration: "none",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 16 }}>{c}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              Open {c} city
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CityPlaceholder() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
        City not built yet
      </h2>
      <div style={{ color: "#94a3b8" }}>
        This route exists, but the City page hasn’t been wired yet.
      </div>
      <div style={{ marginTop: 16 }}>
        <Link to="/city" style={{ color: "#93c5fd" }}>
          ← Back to Cities
        </Link>
      </div>
    </div>
  );
}

export default function CityRoutes() {
  return (
    <Routes>
      {/* /city */}
      <Route index element={<CityIndex />} />

      {/* REAL CITY PAGES */}
      <Route path="creator" element={<CreatorCity />} />

      {/* Optional: keep /city/service as a friendly redirect */}
      <Route
        path="service"
        element={<Navigate to="/service/taylor-creek" replace />}
      />

      {/* /city/<anything-else> */}
      <Route path="*" element={<CityPlaceholder />} />
    </Routes>
  );
}
