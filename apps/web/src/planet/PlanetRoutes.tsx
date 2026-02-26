import { Navigate, Route, Routes, Outlet, Link } from "react-router-dom";

const PAGE: React.CSSProperties = {
  padding: 20,
  maxWidth: 980,
  margin: "0 auto",
  color: "rgba(255,255,255,0.92)",
};

const PANEL: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  padding: 16,
  background: "rgba(255,255,255,0.06)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
};

const SUBTLE: React.CSSProperties = { opacity: 0.78 };

function pill(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
  };
}

function PlanetLayout({ title }: { title: string }) {
  return (
    <div style={PAGE}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0.2 }}>{title}</div>
        <div style={{ ...SUBTLE, fontSize: 12 }}>Planet layer</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <Link to="/planet/creator" style={pill()}>
          Creator
        </Link>
        <Link to="/planet/creator/studio" style={pill()}>
          Creator Studio
        </Link>
        <Link to="/city" style={pill()}>
          City Layer
        </Link>
        <Link to="/" style={pill()}>
          Home
        </Link>
      </div>

      <div style={PANEL}>
        <Outlet />
      </div>
    </div>
  );
}

function CreatorHome() {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Creator Planet</div>
      <div style={{ ...SUBTLE, marginBottom: 12 }}>
        Planet namespace is live. This is the stable routing shell.
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/planet/creator/studio" style={pill()}>
          Enter Creator Studio
        </Link>
      </div>
    </div>
  );
}

function CreatorStudioPlaceholder() {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Creator Studio</div>
      <div style={{ ...SUBTLE, lineHeight: 1.55 }}>
        This route is now real (no redirects, no tenant hijack).
        <br />
        Next: wire this to the actual Creator Studio component.
      </div>

      <div style={{ marginTop: 14, ...SUBTLE, fontSize: 12 }}>
        Route:{" "}
        <code style={{ padding: "2px 6px", borderRadius: 8, background: "rgba(0,0,0,0.35)" }}>
          /planet/creator/studio
        </code>
      </div>
    </div>
  );
}

function PlanetNotFound() {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Planet not found</div>
      <div style={{ ...SUBTLE, marginBottom: 12 }}>That planet route isn’t wired yet.</div>
      <Link to="/planet/creator" style={pill()}>
        Go to Creator Planet
      </Link>
    </div>
  );
}

export default function PlanetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="creator" replace />} />

      <Route element={<PlanetLayout title="HomePlanet — Planet Routes" />}>
        <Route path="creator" element={<CreatorHome />} />
        <Route path="creator/studio" element={<CreatorStudioPlaceholder />} />
        <Route path="*" element={<PlanetNotFound />} />
      </Route>
    </Routes>
  );
}
