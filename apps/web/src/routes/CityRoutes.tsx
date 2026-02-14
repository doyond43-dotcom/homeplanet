import { Routes, Route, useParams, Link } from "react-router-dom";

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
        {cities.map((c) => (
          <Link
            key={c}
            to={`/city/${c}`}
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
        ))}
      </div>
    </div>
  );
}

function CityPlaceholder() {
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
      <Route index element={<CityIndex />} />
      <Route path="*" element={<CityPlaceholder />} />
    </Routes>
  );
}
