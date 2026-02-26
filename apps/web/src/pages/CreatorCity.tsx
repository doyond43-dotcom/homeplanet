// apps/web/src/pages/CreatorCity.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PLANETS } from "../planet/planetMap";

type AnyPlanet = Record<string, any>;

function normalizePlanets(input: any): AnyPlanet[] {
  if (!input) return [];
  if (Array.isArray(input)) return input as AnyPlanet[];
  if (typeof input === "object") return Object.values(input) as AnyPlanet[];
  return [];
}

function planetKey(p: AnyPlanet, i: number) {
  return String(p.key ?? p.id ?? p.slug ?? p.name ?? p.title ?? i);
}

function planetLabel(p: AnyPlanet, i: number) {
  return String(p.label ?? p.title ?? p.name ?? planetKey(p, i));
}

function planetHref(p: AnyPlanet, i: number) {
  // Try common shapes used across the app
  const href =
    p.href ??
    p.path ??
    p.route ??
    p.to ??
    p.url ??
    (p.key || p.id || p.slug || p.name
      ? `/planet/${String(p.key ?? p.id ?? p.slug ?? p.name)}`
      : "/planet");
  return String(href);
}

export default function CreatorCity() {
  const nav = useNavigate();

  const planets = useMemo(() => normalizePlanets(PLANETS), []);

  const shell: React.CSSProperties = {
    padding: 24,
    color: "#e5e7eb",
  };

  const card: React.CSSProperties = {
    border: "1px solid #1f2937",
    background: "#0b1220",
    borderRadius: 16,
    padding: 16,
  };

  const btn: React.CSSProperties = {
    border: "1px solid #334155",
    background: "#0b1220",
    color: "#e5e7eb",
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
  };

  const btnPrimary: React.CSSProperties = {
    ...btn,
    border: "1px solid rgba(16,185,129,0.55)",
    background: "rgba(16,185,129,0.10)",
    color: "#d1fae5",
  };

  return (
    <div style={shell}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, margin: 0 }}>
            Creator City
          </h1>
          <div style={{ color: "#94a3b8", marginTop: 6 }}>
            This is the launchpad. Pick a planet, jump into
            Studio/Projects/Build, or create the next one.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            style={btnPrimary}
            onClick={() => nav("/creator/build")}
          >
            + Create Planet
          </button>
          <button style={btn} onClick={() => nav("/creator/projects")}>
            Projects
          </button>
          <button style={btn} onClick={() => nav("/creator/studio")}>
            Studio
          </button>
          <button style={btn} onClick={() => nav("/creator/build")}>
            Build
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
        }}
      >
        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>
            Planet Creation Flow
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 13,
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            The â€œCreate Planetâ€ button routes into the Creator build flow. This
            keeps /city/creator clean and stable.
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              style={btnPrimary}
              onClick={() => nav("/creator/build")}
            >
              Start Build
            </button>
            <button style={btn} onClick={() => nav("/creator/projects")}>
              Open Projects
            </button>
          </div>
        </div>

        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>What this fixes</div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 13,
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            CreatorStudio stays the tool screen. CreatorCity becomes the place
            you go to create and launch planets without getting lost in deep
            URLs.
          </div>
          <div style={{ marginTop: 12, color: "#94a3b8", fontSize: 12 }}>
            Tip: We can later add â€œRecent planetsâ€ + â€œUsage counterâ€ badges
            here.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 10 }}>
          Planets
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {planets.map((p, i) => {
            const key = planetKey(p, i);
            const label = planetLabel(p, i);
            const href = planetHref(p, i);

            return (
              <button
                key={key}
                onClick={() => nav(href)}
                style={{
                  textAlign: "left",
                  border: "1px solid #1f2937",
                  background: "#0b1220",
                  padding: 14,
                  borderRadius: 16,
                  color: "#e5e7eb",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 15 }}>{label}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 6 }}>
                  {href}
                </div>
              </button>
            );
          })}
        </div>

        {planets.length === 0 ? (
          <div style={{ color: "#94a3b8", marginTop: 10 }}>
            PLANETS list is empty/unavailable â€” thatâ€™s okay. CreatorCity still
            works as the build launchpad.
          </div>
        ) : null}
      </div>
    </div>
  );
}

