import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PLANETS } from "../planet/planetMap";

type City = { id: string; label: string; desc?: string };

function normalizeCities(input: any): City[] {
  if (!input) return [];
  return (Array.isArray(input) ? input : [])
    .map((c) => ({
      id: String(c?.id ?? ""),
      label: String(c?.label ?? c?.name ?? c?.title ?? c?.id ?? "City"),
      desc: c?.desc ? String(c.desc) : c?.subtitle ? String(c.subtitle) : undefined,
    }))
    .filter((c) => c.id);
}

/**
 * PlanetSidebar — OS navigation spine (flex-safe; no overlays)
 * Adds:
 * - Collapsed / Expanded states (system-level, not page-level)
 * - Crisp pill controls that match Creator Build
 * Keeps:
 * - iOS-safe single-event navigation
 * - Hard fallback if router doesn’t update path
 */
export function PlanetSidebar(props: { witnessMode: boolean; onToggleWitnessMode: () => void }) {
  const { witnessMode, onToggleWitnessMode } = props;
  void witnessMode;
  void onToggleWitnessMode;

  const navigate = useNavigate();
  const location = useLocation();

  // Collapsed / expanded (sidebar state)
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return window.innerWidth < 900; // default collapsed on narrow screens
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onResize = () => {
      // Auto-collapse when narrow; don't auto-expand when wide (keeps user intent)
      if (window.innerWidth < 900) setCollapsed(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // which planet sections are expanded
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const p of PLANETS as any[]) initial[String(p.id)] = false;
    return initial;
  });

  const lastNavRef = useRef<number>(0);

  const isActive = (to: string) => location.pathname === to;
  const isUnder = (prefix: string) => location.pathname === prefix || location.pathname.startsWith(prefix + "/");

  const activeGlow = (on: boolean): React.CSSProperties =>
  on
    ? {
        border: "1px solid rgba(0,255,180,0.45)",
        background: "rgba(0,255,180,0.22)",
        color: "white",
        boxShadow: "0 10px 28px rgba(0,0,0,0.38)",
      }
    : {};

  const go = useCallback(
    (to: string, e?: any) => {
      try {
        e?.preventDefault?.();
        e?.stopPropagation?.();
      } catch {}

      const now = Date.now();
      if (now - lastNavRef.current < 350) return; // prevent double-fire
      lastNavRef.current = now;

      if (location.pathname === to) return;

      try {
        navigate(to);
      } catch {}

      setTimeout(() => {
        if (window.location.pathname !== to) {
          window.location.assign(to);
        }
      });
    },
    [navigate, location.pathname]
  );

  const planets = useMemo(() => (PLANETS as any[]) ?? [], []);

  // Sidebar shell — IMPORTANT: flex-safe; no fixed overlays; cannot cover <main>
  const shell: React.CSSProperties = {
    position: "sticky",
    top: 0,
    height: "100dvh",
    overflowY: "auto",
    padding: 14,
    paddingBottom: "calc(14px + env(safe-area-inset-bottom))",
    borderRight: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.58)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    // flex-safe sizing
    width: collapsed ? 82 : 320,
    flex: "0 0 auto",

    pointerEvents: "auto",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  };

  const title: React.CSSProperties = { margin: 0, fontSize: 16, fontWeight: 950 };
  const subtitle: React.CSSProperties = { marginTop: 4, fontSize: 12, color: "rgba(255,255,255,0.70)" };

  const sectionLabel: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    color: "rgba(255,255,255,0.72)",
    paddingLeft: 6,
    marginTop: 14,
    display: collapsed ? "none" : "block",
  };

  const pill: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.30)",
    background: "rgba(0,0,0,0.65)",
    color: "white",
    boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
    userSelect: "none",
    WebkitTapHighlightColor: "transparent",
  };

  const row: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.05)",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  };

  const subRow: React.CSSProperties = {
    ...row,
    marginLeft: 10,
    background: "rgba(0,0,0,0.20)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: collapsed ? "none" : "flex",
  };

  const caret: React.CSSProperties = { opacity: 0.70, fontWeight: 900 };

  // Shared nav props — single event to avoid duplicate toggles on iOS
  const tapSafeNavProps = (to: string) => ({
    onClick: (e: any) => go(to, e),
  });

  return (
    <aside style={shell}>
      {/* Top “spine” header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={title}>{collapsed ? "HP" : "HomePlanet"}</div>
          {!collapsed ? <div style={subtitle}>Presence-first navigation</div> : null}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCollapsed((v) => !v);
          }}
          style={{
            ...pill,
            padding: collapsed ? "10px 10px" : "10px 12px",
            minWidth: collapsed ? 42 : 96,
            textAlign: "center",
          }}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? "▸" : "Collapse"}
        </button>
      </div>

      <div style={sectionLabel}>Planets</div>

      <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
        {planets.map((p) => {
          const planetId = String(p.id);
          const planetLabel = String(p.label ?? p.id);
          const cities = normalizeCities(p.cities);

          const isOpen = !!open[planetId];
          const planetPrefix = `/planet/${planetId}`;
          const planetActive = isUnder(planetPrefix);

          return (
            <div key={planetId} style={{ display: "grid", gap: 8 }}>
              {/* Planet row (toggle) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (collapsed) {
                    // In collapsed mode, clicking a planet takes you to planet overview immediately
                    go(`/planet/${planetId}`, e);
                    return;
                  }
                  setOpen((s) => ({ ...s, [planetId]: !s[planetId] }));
                }}
                style={{
                  ...row,
                  ...activeGlow(planetActive),
                  justifyContent: collapsed ? "center" : "space-between",
                  padding: collapsed ? "12px 10px" : "10px 12px",
                }}
                title={planetLabel}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: collapsed ? "center" : "flex-start" }}>
                  <div style={{ fontWeight: 950, letterSpacing: 0.2 }}>
                    {collapsed ? planetLabel.slice(0, 2).toUpperCase() : planetLabel}
                  </div>
                  {!collapsed && p.subtitle ? (
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginTop: 2 }}>
                      {String(p.subtitle)}
                    </div>
                  ) : null}
                </div>

                {!collapsed ? <div style={caret}>{isOpen ? "▾" : "▸"}</div> : null}
              </button>

              {/* Expanded content */}
              {!collapsed && isOpen ? (
                <div style={{ display: "grid", gap: 8 }}>
                  {/* Planet overview */}
                  {(() => {
                    const to = `/planet/${planetId}`;
                    return (
                      <button type="button" {...tapSafeNavProps(to)} style={{ ...subRow, ...activeGlow(isActive(to)) }}>
                        <div style={{ fontWeight: 900 }}>Overview</div>
                        <div style={caret}></div>
                      </button>
                    );
                  })()}

                  {/* Cities */}
                  {cities.slice(0, 12).map((c) => {
                    const to = `/planet/${planetId}/${c.id}`;
                    return (
                      <button key={c.id} type="button" {...tapSafeNavProps(to)} style={{ ...subRow, ...activeGlow(isActive(to)) }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ fontWeight: 900 }}>{c.label}</div>
                          {c.desc ? <div style={{ fontSize: 12, opacity: 0.70, marginTop: 2 }}>{c.desc}</div> : null}
                        </div>
                        <div style={caret}></div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {!collapsed ? (
        <div style={{ marginTop: 18, opacity: 0.58, fontSize: 11, lineHeight: 1.35, paddingLeft: 6 }}>
          iOS-safe navigation: click + navigate() + hard fallback if needed.
        </div>
      ) : null}
    </aside>
  );
}


