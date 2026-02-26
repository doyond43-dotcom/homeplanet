// apps/web/src/routes/CityRoutes.tsx
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import CreatorCity from "../pages/CreatorCity";

function CityIndex() {
  const cities = ["creator", "service", "education", "safety", "family", "commerce", "health", "legal"];

  const isLive = (c: string) => c === "creator" || c === "service";

  // ✅ City cards should route to REAL destinations.
  // - creator -> /city/creator (launchpad)
  // - service -> /service/taylor-creek (real app)
  // - others -> /city/<name> (coming soon placeholder)
  const cityTo = (c: string) => {
    if (c === "service") return "/service/taylor-creek";
    return `/city/${c}`;
  };

  const shell: React.CSSProperties = { padding: 24, maxWidth: 1100, margin: "0 auto", color: "#e5e7eb" };
  const h1: React.CSSProperties = { fontSize: 28, fontWeight: 900, marginBottom: 10 };
  const sub: React.CSSProperties = { color: "#94a3b8", marginBottom: 16 };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  };

  const cardBase: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.55)",
    padding: 14,
    borderRadius: 14,
    color: "#e5e7eb",
    textDecoration: "none",
    display: "block",
  };

  const badge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 900,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.22)",
    color: "#cbd5e1",
    background: "rgba(2,6,23,0.35)",
  };

  const liveBadge: React.CSSProperties = {
    ...badge,
    border: "1px solid rgba(34,197,94,0.35)",
    color: "rgba(187,247,208,1)",
    background: "rgba(34,197,94,0.12)",
  };

  const soonBadge: React.CSSProperties = {
    ...badge,
    border: "1px solid rgba(59,130,246,0.30)",
    color: "rgba(191,219,254,1)",
    background: "rgba(59,130,246,0.10)",
  };

  return (
    <div style={shell}>
      <h1 style={h1}>HomePlanet Cities</h1>
      <div style={sub}>
        Choose a City (these routes live under <code>/city/</code>).
      </div>

      <div style={grid}>
        {cities.map((c) => {
          const live = isLive(c);
          return (
            <Link key={c} to={cityTo(c)} style={cardBase}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 900, fontSize: 16, textTransform: "capitalize" }}>{c}</div>
                <span style={live ? liveBadge : soonBadge}>{live ? "LIVE" : "COMING SOON"}</span>
              </div>

              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 8 }}>
                {live ? `Open ${c} city` : `Preview ${c} city (not wired yet)`}
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
        Tip: Creator + Service are live. The others are placeholders until we wire their City pages.
      </div>
    </div>
  );
}

function CityPlaceholder() {
  const loc = useLocation();
  const seg = (loc.pathname.split("/city/")[1] || "").split("/")[0].trim();
  const city = seg || "city";

  const shell: React.CSSProperties = { padding: 24, maxWidth: 1100, margin: "0 auto", color: "#e5e7eb" };
  const h2: React.CSSProperties = { fontSize: 26, fontWeight: 900, margin: 0 };
  const sub: React.CSSProperties = { color: "#94a3b8", marginTop: 10, lineHeight: 1.4 };

  const row: React.CSSProperties = { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 };

  const btn: React.CSSProperties = {
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(15,23,42,0.55)",
    color: "#e5e7eb",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const btnPrimary: React.CSSProperties = {
    ...btn,
    border: "1px solid rgba(34,197,94,0.40)",
    background: "rgba(34,197,94,0.12)",
    color: "rgba(187,247,208,1)",
  };

  const panel: React.CSSProperties = {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(2,6,23,0.35)",
  };

  return (
    <div style={shell}>
      <div style={panel}>
        <div style={h2}>{city.charAt(0).toUpperCase() + city.slice(1)} City</div>
        <div style={sub}>
          This City route exists, but the City page hasn’t been wired yet.
          <br />
          You’re not lost — it’s just not built yet.
        </div>

        <div style={row}>
          <Link to="/city" style={btn}>
            ← Back to Cities
          </Link>
<Link to="/service/taylor-creek" style={btn}>
            Go to Service (Taylor Creek)
          </Link>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>
          When we wire this City, this page will be replaced automatically.
        </div>
      </div>
    </div>
  );
}

export default function CityRoutes() {
  return (
    <Routes>
      {/* /city */}
      <Route index element={<CityIndex />} />

      {/* ✅ REAL CITY PAGES */}
      <Route path="creator" element={<CreatorCity />} />

      {/* keep /city/service as a friendly redirect (in case anyone hits it) */}
      <Route path="service" element={<Navigate to="/service/taylor-creek" replace />} />

      {/* /city/<anything-else> */}
      <Route path="*" element={<CityPlaceholder />} />
    </Routes>
  );
}

