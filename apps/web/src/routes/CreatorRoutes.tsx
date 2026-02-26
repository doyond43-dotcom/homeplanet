import { Routes, Route, Navigate, Link } from "react-router-dom";
import CreatorCity from "../pages/CreatorCity";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto", color: "#e5e7eb" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>{title}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/creator" style={pill()}>Creator</Link>
          <Link to="/creator/projects" style={pill()}>Projects</Link>
          <Link to="/creator/studio" style={pill()}>Studio</Link>
          <Link to="/creator/build" style={pillPrimary()}>Build</Link>
          <Link to="/city" style={pill()}>City</Link>
        </div>
      </div>

      <div style={{
        border: "1px solid rgba(148,163,184,0.18)",
        background: "rgba(15,23,42,0.55)",
        borderRadius: 16,
        padding: 16,
      }}>
        {children}
      </div>
    </div>
  );
}

function pill(): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    textDecoration: "none",
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.35)",
    color: "#e5e7eb",
    fontWeight: 800,
    fontSize: 13,
  };
}

function pillPrimary(): React.CSSProperties {
  return {
    ...pill(),
    border: "1px solid rgba(34,197,94,0.45)",
    background: "rgba(34,197,94,0.12)",
    color: "rgba(187,247,208,1)",
  };
}

function BuildPlaceholder() {
  return (
    <Shell title="Creator Build">
      <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
        This is the reserved route for the Creator “Build” flow.
        <br />
        Next: wire this to the real Build UI component.
      </div>
    </Shell>
  );
}

function ProjectsPlaceholder() {
  return (
    <Shell title="Creator Projects">
      <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
        This is the reserved route for Projects.
        <br />
        Next: wire this to your real Projects UI.
      </div>
    </Shell>
  );
}

function StudioPlaceholder() {
  return (
    <Shell title="Creator Studio">
      <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
        This is the reserved route for Studio.
        <br />
        Next: wire this to your real Studio component.
      </div>
    </Shell>
  );
}

export default function CreatorRoutes() {
  return (
    <Routes>
      <Route index element={<CreatorCity />} />
      <Route path="build" element={<BuildPlaceholder />} />
      <Route path="projects" element={<ProjectsPlaceholder />} />
      <Route path="studio" element={<StudioPlaceholder />} />
      <Route path="*" element={<Navigate to="/creator" replace />} />
    </Routes>
  );
}