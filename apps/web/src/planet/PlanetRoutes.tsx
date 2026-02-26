import { Navigate, Route, Routes, Outlet, Link } from "react-router-dom";

function PlanetLayout({ title }: { title: string }) {
  return (
    <div style={{ padding: 20, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
        <div style={{ opacity: 0.6, fontSize: 12 }}>Planet layer</div>
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

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 16,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

function pill(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "inherit",
    fontSize: 13,
  };
}

function CreatorHome() {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Creator Planet</div>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        This is the planet route namespace. We’re live and stable.
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link to="/planet/creator/studio" style={pill()}>
          Enter Creator Studio
        </Link>
      </div>
    </div>
  );
}

/**
 * TEMP Studio placeholder:
 * This ensures /planet/creator/studio works immediately (Friday demo safe).
 * Later we will swap this element to your real Creator Studio component.
 */
function CreatorStudioPlaceholder() {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Creator Studio</div>
      <div style={{ opacity: 0.85, lineHeight: 1.5 }}>
        Planet route is now real (no redirects).
        <br />
        Next step: wire this route to your actual CreatorStudio page/component.
      </div>

      <div style={{ marginTop: 14, opacity: 0.75, fontSize: 12 }}>
        Route: <code>/planet/creator/studio</code>
      </div>
    </div>
  );
}

function PlanetNotFound() {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Planet not found</div>
      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        That planet route isn’t wired yet.
      </div>
      <Link to="/planet/creator" style={pill()}>
        Go to Creator Planet
      </Link>
    </div>
  );
}

export default function PlanetRoutes() {
  return (
    <Routes>
      {/* /planet -> /planet/creator */}
      <Route index element={<Navigate to="creator" replace />} />

      {/* Creator planet */}
      <Route element={<PlanetLayout title="HomePlanet — Planet Routes" />}>
        <Route path="creator" element={<CreatorHome />} />
        <Route path="creator/studio" element={<CreatorStudioPlaceholder />} />

        {/* Unknown planets */}
        <Route path="*" element={<PlanetNotFound />} />
      </Route>
    </Routes>
  );
}
