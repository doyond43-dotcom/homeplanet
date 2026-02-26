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
        <Link to="/creator" style={pill()}>Creator City</Link>
        <Link to="/planet/creator" style={pill()}>Creator Planet</Link>
        <Link to="/planet/creator/studio" style={pill()}>Planet Studio</Link>
        <Link to="/city" style={pill()}>City Layer</Link>
      </div>

      <div style={PANEL}>
        <Outlet />
      </div>
    </div>
  );
}

function CreatorPlanetHome() {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Creator Planet</div>
      <div style={{ ...SUBTLE, marginBottom: 12 }}>
        Planet namespace is live. This page is just the planet shell.
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/creator" style={pill()}>Go to Creator City (real UI)</Link>
        <Link to="/planet/creator/studio" style={pill()}>Open Planet Studio</Link>
      </div>
    </div>
  );
}

function CreatorStudioPlaceholder() {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Planet Studio</div>
      <div style={{ ...SUBTLE, lineHeight: 1.55 }}>
        This is the planet placeholder screen.
        <br />
        The real Creator tools live under <code>/creator</code>.
      </div>
      <div style={{ marginTop: 14 }}>
        <Link to="/creator" style={pill()}>Back to Creator City</Link>
      </div>
    </div>
  );
}

function PlanetNotFound() {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Planet not found</div>
      <div style={{ ...SUBTLE, marginBottom: 12 }}>That planet route isn’t wired yet.</div>
      <Link to="/planet/creator" style={pill()}>Go to Creator Planet</Link>
    </div>
  );
}

export default function PlanetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="creator" replace />} />

      <Route element={<PlanetLayout title="HomePlanet — Planet Routes" />}>
        {/* planet pages */}
        <Route path="creator" element={<CreatorPlanetHome />} />
        <Route path="creator/studio" element={<CreatorStudioPlaceholder />} />

        {/* ✅ IMPORTANT: redirect planet build/projects back to real Creator City tools */}
        <Route path="creator/build" element={<Navigate to="/creator/build" replace />} />
        <Route path="creator/projects" element={<Navigate to="/creator/projects" replace />} />

        <Route path="*" element={<PlanetNotFound />} />
      </Route>
    </Routes>
  );
}
