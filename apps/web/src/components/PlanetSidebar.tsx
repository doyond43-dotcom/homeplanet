import { NavLink, useLocation } from "react-router-dom";
import { CORE_LINKS, PLANETS, TELEMETRY_LENS } from "../planet/planetMap";
import { useMemo, useState } from "react";

type Props = {
  witnessMode: boolean;
  onToggleWitnessMode: () => void;
};

const linkStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 12,
  textDecoration: "none",
  color: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const linkActive: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
};

export function PlanetSidebar({ witnessMode, onToggleWitnessMode }: Props) {
  const { pathname } = useLocation();

  const [open, setOpen] = useState<Record<string, boolean>>({
    creator: true,
    career: false,
    vehicles: false,
    education: false,
    safety: false,
    payments: false,
  });

  const currentPlanet = useMemo(() => {
    const m = pathname.match(/^\/planet\/([^/]+)/);
    return m?.[1] ?? null;
  }, [pathname]);

  return (
    <aside style={{
      width: 320,
      minWidth: 320,
      height: "100vh",
      padding: 14,
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      borderRight: "1px solid rgba(255,255,255,0.10)",
      background: "linear-gradient(180deg, rgba(10,10,14,0.95), rgba(10,10,14,0.85))",
      backdropFilter: "blur(10px)",
      pointerEvents: open ? "auto" : "none",
    }}>
      <div style={{
        padding: "10px 12px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
      }}>
        <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.2 }}>
          ☉ HomePlanet
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.62)" }}>
          Planetary OS • Core + Residents + Telemetry
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11, padding: "4px 8px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.75)"
          }}>
            Presence-first
          </span>
          <span style={{
            fontSize: 11, padding: "4px 8px", borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            color: witnessMode ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
            background: witnessMode ? "rgba(255,255,255,0.08)" : "transparent",
          }}>
            {witnessMode ? "Witness: ON" : "Witness: OFF"}
          </span>
          {currentPlanet && (
            <span style={{
              fontSize: 11, padding: "4px 8px", borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.75)"
            }}>
              Planet: {currentPlanet}
            </span>
          )}
        </div>
      </div>

      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)", paddingLeft: 6 }}>
          Core
        </div>
        {CORE_LINKS.map((l) => (
          <NavLink
            key={l.id}
            to={l.to}
            style={({ isActive }) => ({
              ...linkStyle,
              ...(isActive ? linkActive : null),
            })}
          >
            <span>{l.label}</span>
            <span style={{ fontSize: 12, opacity: 0.55 }}>↗</span>
          </NavLink>
        ))}
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)", paddingLeft: 6 }}>
          Planets (Residents)
        </div>

        {PLANETS.map((p) => {
          const isOpen = open[p.id] ?? false;
          return (
            <div key={p.id} style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
              overflow: "hidden",
            }}>
              <button
                onClick={() => setOpen((s) => ({ ...s, [p.id]: !isOpen }))}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.90)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>🌍 {p.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                    {p.subtitle ?? ""}
                  </div>
                </span>
                <span style={{ fontSize: 12, opacity: 0.65 }}>{isOpen ? "▾" : "▸"}</span>
              </button>

              {isOpen && (
                <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <NavLink
                    to={`/planet/${p.id}`}
                    style={({ isActive }) => ({
                      ...linkStyle,
                      ...(isActive ? linkActive : null),
                      padding: "8px 10px",
                    })}
                  >
                    <span>Planet Overview</span>
                    <span style={{ fontSize: 12, opacity: 0.55 }}>↗</span>
                  </NavLink>

                  {p.cities.map((c) => (
                    <NavLink
                      key={c.id}
                      to={`/planet/${p.id}/${c.id}`}
                      style={({ isActive }) => ({
                        ...linkStyle,
                        ...(isActive ? linkActive : null),
                        padding: "8px 10px",
                      })}
                    >
                      <span>🏙 {c.label}</span>
                      <span style={{ fontSize: 12, opacity: 0.55 }}>↗</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <section style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.65)", paddingLeft: 6 }}>
          Telemetry Lens
        </div>

        <button
          onClick={onToggleWitnessMode}
          style={{
            ...linkStyle,
            cursor: "pointer",
            border: witnessMode ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.10)",
            background: witnessMode ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
          }}
        >
          <span>{TELEMETRY_LENS.label}</span>
          <span style={{ fontSize: 12, opacity: 0.75 }}>{witnessMode ? "ON" : "OFF"}</span>
        </button>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.50)", paddingLeft: 6, lineHeight: 1.35 }}>
          Witness Mode is a UI toggle today. Later it becomes your live build / proof lens without interrupting creation.
        </div>
      </section>
    </aside>
  );
}


