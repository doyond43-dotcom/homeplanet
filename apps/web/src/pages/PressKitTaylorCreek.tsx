import { Link, useNavigate, useSearchParams } from "react-router-dom";

export default function PressKitTaylorCreek() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const slug = (sp.get("slug") || "pmqf6bn1gs").trim();

  const goIntake = () => nav(`/c/${encodeURIComponent(slug)}`);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05070d",
        color: "#e5e7eb",
        padding: "24px",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              🪐 Taylor Creek Auto Repair
            </div>
            <div style={{ opacity: 0.8 }}>Powered by HomePlanet</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <a href="#demo">Run Live Demo</a>
            <a href="#downloads">Downloads</a>
            <a href="#press">Press Release</a>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <h1>Public Proof Infrastructure — Live Demonstration</h1>

          <button onClick={goIntake}>Try it now →</button>
          <Link to="/live/taylor-creek">Open Live Demo</Link>
        </div>
      </div>
    </div>
  );
}

