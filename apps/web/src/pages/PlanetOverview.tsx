@'
import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PLANETS } from "../planet/planetMap";

type City = { id: string; label: string; desc?: string };

function normalizeCities(input: any): City[] {
  if (!input) return [];
  // support either: [{id,label,desc}] or [{id,name,subtitle}] etc.
  return (Array.isArray(input) ? input : [])
    .map((c) => ({
      id: String(c?.id ?? ""),
      label: String(c?.label ?? c?.name ?? c?.title ?? c?.id ?? "City"),
      desc: c?.desc ? String(c.desc) : (c?.subtitle ? String(c.subtitle) : undefined),
    }))
    .filter((c) => c.id);
}

function pickBuildCityId(_planetId: string, cities: City[]) {
  // Build maps to existing "projects" city (preferred) to avoid refactors.
  // If "projects" doesn't exist, fall back to first city.
  const preferred = ["projects", "build"];
  const hit = preferred.find((id) => cities.some((c) => c.id === id));
  return hit ?? (cities[0]?.id ?? "projects");
}

/**
 * Mobile Safari fix:
 * Some iOS setups will "highlight" Link cards but never fire navigation
 * (usually due to touch/click synthesis getting blocked by overlays/filters).
 *
 * This component forces navigation on touch/pointer as a fallback.
 */
function NavCard(props: {
  to: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  debugName?: string;
}) {
  const navigate = useNavigate();

  const go = () => {
    try {
      navigate(props.to);
    } catch (e) {
      // last-resort: full navigation
      window.location.href = props.to;
    }
  };

  return (
    <Link
      to={props.to}
      style={{
        ...(props.style ?? {}),
        // Force card to be tappable even if something weird is happening
        pointerEvents: "auto",
        cursor: "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent" as any,
      }}
      onClick={(e) => {
        // Prefer normal Link behavior, but if iOS "click" is being swallowed,
        // the handlers below will still navigate.
        // NOTE: do NOT preventDefault here unless we have to.
        if (props.debugName) console.log("🟢 click:", props.debugName, "->", props.to);
      }}
      onPointerUp={() => {
        if (props.debugName) console.log("🟣 pointerUp:", props.debugName, "->", props.to);
        go();
      }}
      onTouchEnd={(e) => {
        // iOS: touchend is the most reliable "user intent" event.
        if (props.debugName) console.log("🟠 touchEnd:", props.debugName, "->", props.to);
        e.preventDefault(); // prevents ghost/double click + ensures our nav wins
        go();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
      role="link"
      tabIndex={0}
    >
      {props.children}
    </Link>
  );
}

export default function PlanetOverview() {
  const { planetId } = useParams();
  const planet = PLANETS.find((p) => p.id === planetId);

  const cities = useMemo(() => normalizeCities((planet as any)?.cities), [planet]);
  const buildCityId = useMemo(() => pickBuildCityId(String(planetId ?? ""), cities), [planetId, cities]);

  if (!planet) {
    return (
      <div style={{ padding: 18 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Planet not found</h1>
        <p style={{ marginTop: 10, color: "rgba(255,255,255,0.70)" }}>
          That planet id doesn’t exist yet.
        </p>
      </div>
    );
  }

  const featured = {
    title: "🏗 Build",
    subtitle: "Create → release → evolve",
    desc: "This is the gravity well. Everything begins here.",
    to:
      planet.id === "creator"
        ? "/planet/creator/build" // primary path: Build
        : `/planet/${planet.id}/${buildCityId}`,
  };

  const secondaryCities = cities
    .filter((c) => c.id !== buildCityId) // keep featured city out of the list
    .map((c) => ({
      title: c.label,
      subtitle: c.desc ?? "",
      to: `/planet/${planet.id}/${c.id}`,
      id: c.id,
    }));

  const pageStyle: React.CSSProperties = {
    padding: 0,
    // Helps iOS: ensure the page itself can receive touches cleanly
    pointerEvents: "auto",
    touchAction: "manipulation",
  };

  const shellCard: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 14,
    alignItems: "start",
  };

  const stack: React.CSSProperties = {
    display: "grid",
    gap: 12,
  };

  const cardBase: React.CSSProperties = {
    display: "block",
    textDecoration: "none",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.18)",
    padding: 14,
    color: "rgba(255,255,255,0.92)",
    boxShadow: "0 14px 44px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    // critical: never let this card become non-interactive
    pointerEvents: "auto",
  };

  const featuredCard: React.CSSProperties = {
    ...cardBase,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
    padding: 18,
    minHeight: 140,
  };

  const smallCard: React.CSSProperties = {
    ...cardBase,
    boxShadow: "0 10px 34px rgba(0,0,0,0.30)",
  };

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: 800,
    marginTop: 10,
  };

  const kTitle: React.CSSProperties = { margin: 0, fontSize: 22, fontWeight: 950 };
  const kSub: React.CSSProperties = { marginTop: 8, color: "rgba(255,255,255,0.70)", lineHeight: 1.5 };

  return (
    <div
      style={pageStyle}
      onClickCapture={() => {
        // If you open Safari remote inspector, you’ll see this proving taps reach the page.
        console.log("✅ PlanetOverview tap reached");
      }}
    >
      <div style={shellCard}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>
              🌎 Planet: <span style={{ fontWeight: 950 }}>{planet.label ?? planet.id}</span>
            </h1>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.65)" }}>
              {(planet as any)?.subtitle ?? ""}
            </div>
            <div style={pill}>
              <span>Primary Path:</span>
              <span style={{ color: "rgba(255,255,255,0.92)" }}>Build</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={grid as any}>
            {/* Featured / Build */}
            <NavCard to={featured.to} style={featuredCard} debugName="Featured/Build">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <h2 style={kTitle}>{featured.title}</h2>
                  <div style={{ marginTop: 6, color: "rgba(255,255,255,0.78)", fontWeight: 800 }}>
                    {featured.subtitle}
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 12,
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                  }}
                >
                  Enter
                </div>
              </div>
              <div style={kSub}>{featured.desc}</div>
            </NavCard>

            {/* Secondary / Cities */}
            <div style={stack}>
              <div style={{ fontWeight: 900, color: "rgba(255,255,255,0.85)", marginLeft: 2 }}>Cities</div>

              {secondaryCities.length === 0 ? (
                <div
                  style={{
                    borderRadius: 18,
                    border: "1px dashed rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.02)",
                    padding: 14,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  No other cities yet. Build is the entry point.
                </div>
              ) : (
                secondaryCities.slice(0, 6).map((c) => (
                  <NavCard key={c.id} to={c.to} style={smallCard} debugName={`City/${c.id}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                      <div style={{ fontWeight: 950 }}>{c.title}</div>
                      <div style={{ opacity: 0.65, fontWeight: 900 }}>→</div>
                    </div>
                    {c.subtitle ? (
                      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.65)", lineHeight: 1.45 }}>
                        {c.subtitle}
                      </div>
                    ) : null}
                  </NavCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'@ | Set-Content .\src\pages\PlanetOverview.tsx -Encoding UTF8





