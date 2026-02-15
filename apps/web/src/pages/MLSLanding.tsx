import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function useMediaQuery(query: string) {
  const get = () =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false;
  const [matches, setMatches] = React.useState(get);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    if ((m as any).addEventListener) (m as any).addEventListener("change", onChange);
    else (m as any).addListener(onChange);
    return () => {
      if ((m as any).removeEventListener) (m as any).removeEventListener("change", onChange);
      else (m as any).removeListener(onChange);
    };
  }, [query]);

  return matches;
}

type SignalType =
  | "Pickup Change"
  | "Dropoff Change"
  | "Late Notice"
  | "Absent"
  | "Early Release"
  | "Approved Person Update"
  | "School Note"
  | "Other";

type SignalEvent = {
  id: string;
  family_key: string;
  child: string;
  type: SignalType;
  details: string;
  created_at: string; // timestamptz from Supabase
};

function nowISO() {
  return new Date().toISOString();
}

function formatTimeLocal(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatDateLocal(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function formatDayHeaderLocal(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  } catch {
    return "Today";
  }
}

const SIGNAL_TYPES: SignalType[] = [
  "Pickup Change",
  "Dropoff Change",
  "Late Notice",
  "Absent",
  "Early Release",
  "Approved Person Update",
  "School Note",
  "Other",
];

function typeToHumanLine(t: SignalType) {
  switch (t) {
    case "Pickup Change":
      return "Pickup plan changed";
    case "Dropoff Change":
      return "Dropoff plan changed";
    case "Late Notice":
      return "Running late";
    case "Absent":
      return "Absent today";
    case "Early Release":
      return "Early release";
    case "Approved Person Update":
      return "Approved person updated";
    case "School Note":
      return "Note to school";
    default:
      return "Update";
  }
}

/**
 * DEMO NOTES:
 * - This file is the deploy truth for /mls
 * - UTF-8 NO BOM only
 * - Build marker is your verification stamp
 */
const BUILD_MARKER = "BUILD_MARKER_UTC_20260215_090500";

// DEMO family key (shared across all devices for now)
const DEMO_FAMILY_KEY = "demo";

function getSupabase(): SupabaseClient | null {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
}

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 520px at 50% -10%, rgba(130,160,255,0.22), rgba(0,0,0,0) 60%), #070707",
  color: "rgba(255,255,255,0.92)",
};

const shell: React.CSSProperties = {
  maxWidth: 1060,
  margin: "0 auto",
  padding: "22px 16px 120px",
};

const buildMarkerOverlay: React.CSSProperties = {
  position: "fixed",
  top: 10,
  left: 10,
  zIndex: 99999,
  fontSize: 12,
  fontWeight: 950,
  padding: "8px 12px",
  borderRadius: 12,
  background: "rgba(0,0,0,0.65)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "white",
  pointerEvents: "none",
  maxWidth: "92vw",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const topBar: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 14,
};

const brandTag: React.CSSProperties = {
  letterSpacing: 2,
  fontSize: 12,
  fontWeight: 950,
  opacity: 0.6,
};

const h1: React.CSSProperties = {
  fontSize: 40,
  lineHeight: 1.05,
  margin: "6px 0 4px",
  fontWeight: 950,
};

const sub: React.CSSProperties = {
  fontSize: 15,
  opacity: 0.72,
  margin: 0,
  fontWeight: 750,
};

const btnRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  justifyContent: "flex-end",
};

const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 900,
  cursor: "pointer",
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.08fr 0.92fr",
  gap: 14,
  alignItems: "start",
};

const card: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.35)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
};

const pad: React.CSSProperties = { padding: 16 };

const dayCard: React.CSSProperties = {
  ...card,
  background:
    "linear-gradient(180deg, rgba(20,80,130,0.26), rgba(0,0,0,0.18)), rgba(0,0,0,0.35)",
  border: "1px solid rgba(130,160,255,0.22)",
};

const dayTop: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const dayTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 950,
  margin: 0,
  letterSpacing: 0.2,
};

const dayMeta: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.72,
  fontWeight: 800,
};

const statusPill: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.40)",
  fontWeight: 950,
  opacity: 0.95,
  whiteSpace: "nowrap",
};

const bigLine: React.CSSProperties = {
  fontSize: 26,
  fontWeight: 980,
  margin: "12px 0 6px",
  letterSpacing: 0.1,
};

const kv: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "96px 1fr",
  gap: 10,
  marginTop: 12,
};

const k: React.CSSProperties = {
  opacity: 0.72,
  fontWeight: 850,
  fontSize: 12,
  letterSpacing: 1.1,
  textTransform: "uppercase",
};

const v: React.CSSProperties = {
  fontWeight: 900,
  fontSize: 15,
  lineHeight: 1.25,
};

const note: React.CSSProperties = {
  marginTop: 12,
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  fontWeight: 750,
  opacity: 0.86,
  lineHeight: 1.35,
};

const timelineCard: React.CSSProperties = { ...card };

const sectionTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 950,
  letterSpacing: 1.6,
  opacity: 0.72,
  margin: 0,
};

const timelineList: React.CSSProperties = {
  marginTop: 12,
  display: "grid",
  gap: 10,
};

const momentRow: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.30)",
  padding: 12,
};

const momentTop: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const momentType: React.CSSProperties = { fontWeight: 950, fontSize: 14 };

const momentTime: React.CSSProperties = {
  opacity: 0.72,
  fontWeight: 900,
  fontSize: 12,
};

const momentWho: React.CSSProperties = {
  marginTop: 6,
  fontWeight: 900,
  opacity: 0.86,
  fontSize: 13,
};

const momentDetails: React.CSSProperties = {
  marginTop: 6,
  fontWeight: 850,
  opacity: 0.96,
  fontSize: 15,
  lineHeight: 1.25,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(255,255,255,0.10)",
  margin: "12px 0 0",
};

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  padding: "12px 12px",
  outline: "none",
  fontWeight: 850,
  appearance: "none" as any,
  WebkitAppearance: "none" as any,
};

const textAreaBase: React.CSSProperties = {
  ...inputBase,
  minHeight: 96,
  resize: "vertical",
  lineHeight: 1.35,
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.14)",
  color: "rgba(255,255,255,0.95)",
  fontWeight: 980,
  cursor: "pointer",
};

const btnDisabled: React.CSSProperties = { opacity: 0.5, cursor: "not-allowed" };

const bannerErr: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,80,80,0.35)",
  background: "rgba(255,80,80,0.10)",
  padding: "10px 12px",
  fontWeight: 850,
};

const bannerOk: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 14,
  border: "1px solid rgba(34,197,94,0.35)",
  background: "rgba(34,197,94,0.12)",
  padding: "10px 12px",
  fontWeight: 850,
};

const quickDockWrap: React.CSSProperties = {
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "12px 12px calc(env(safe-area-inset-bottom, 0px) + 12px)",
  background:
    "linear-gradient(180deg, rgba(7,7,7,0), rgba(7,7,7,0.88) 26%, rgba(7,7,7,0.98))",
  zIndex: 9990,
};

const quickDock: React.CSSProperties = {
  maxWidth: 1060,
  margin: "0 auto",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.55)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.65)",
  padding: 12,
};

const dockGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "0.85fr 0.85fr 1.3fr auto",
  gap: 10,
  alignItems: "center",
};

const dockHint: React.CSSProperties = {
  marginTop: 8,
  fontSize: 12,
  opacity: 0.68,
  fontWeight: 750,
  lineHeight: 1.25,
};

function uniqById(list: SignalEvent[]) {
  const m = new Map<string, SignalEvent>();
  for (const e of list) m.set(e.id, e);
  return Array.from(m.values()).sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export default function MLSLanding() {
  console.log("" + BUILD_MARKER);

  const isNarrow = useMediaQuery("(max-width: 860px)");
  const isMobile = useMediaQuery("(max-width: 740px)");

  const sbRef = useRef<SupabaseClient | null>(null);
  if (!sbRef.current) sbRef.current = getSupabase();

  const [events, setEvents] = useState<SignalEvent[]>([]);
  const [child, setChild] = useState("Chelsea");
  const [type, setType] = useState<SignalType>("Pickup Change");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const latest = useMemo(() => {
    if (!events.length) return null;
    return [...events].sort((a, b) => (a.created_at < b.created_at ? 1 : -1))[0];
  }, [events]);

  const dayLabel = useMemo(() => formatDayHeaderLocal(nowISO()), []);
  const lastUpdated = latest
    ? `${formatDateLocal(latest.created_at)} • ${formatTimeLocal(latest.created_at)}`
    : "No updates yet";

  const layoutGrid: React.CSSProperties = isNarrow
    ? { ...grid2, gridTemplateColumns: "1fr" }
    : grid2;

  const timeline = useMemo(() => {
    const sorted = [...events].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    return sorted.slice(0, 12);
  }, [events]);

  const canConfirm = (details || "").trim().length > 0;

  async function loadLatest() {
    const sb = sbRef.current;
    if (!sb) {
      setErr("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");
      setLoading(false);
      return;
    }

    setErr(null);
    setLoading(true);

    const { data, error } = await sb
      .from("mls_events")
      .select("id,family_key,child,type,details,created_at")
      .eq("family_key", DEMO_FAMILY_KEY)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      setErr(error.message);
      setLoading(false);
      return;
    }

    setEvents(uniqById((data || []) as SignalEvent[]));
    setLoading(false);
  }

  async function insertEvent(payload: {
    child: string;
    type: SignalType;
    details: string;
  }) {
    const sb = sbRef.current;
    if (!sb) return;

    setErr(null);
    setOk(null);

    const { error } = await sb.from("mls_events").insert([
      {
        family_key: DEMO_FAMILY_KEY,
        child: payload.child,
        type: payload.type,
        details: payload.details,
      },
    ]);

    if (error) {
      setErr(error.message);
      return;
    }

    setOk("Saved ✓");
  }

  async function clearDay() {
    const sb = sbRef.current;
    if (!sb) return;

    setErr(null);
    setOk(null);

    const { error } = await sb.from("mls_events").delete().eq("family_key", DEMO_FAMILY_KEY);
    if (error) {
      setErr(error.message);
      return;
    }

    setEvents([]);
    setOk("Cleared ✓");
  }

  async function resetDemo() {
    setErr(null);
    setOk(null);

    await clearDay();
    await insertEvent({
      child: "Chelsea",
      type: "Pickup Change",
      details: "After school — Aunt picking up",
    });
  }

  async function anchorDay() {
    await insertEvent({
      child: (child || "").trim() || "Child",
      type: "Other",
      details: "Day anchored — plan acknowledged",
    });
  }

  async function confirm() {
    const d = (details || "").trim();
    if (!d) return;

    await insertEvent({
      child: (child || "").trim() || "Child",
      type,
      details: d,
    });

    setDetails("");
  }

  useEffect(() => {
    loadLatest();

    const sb = sbRef.current;
    if (!sb) return;

    // Realtime insert listener
    const channel = sb
      .channel("mls_events_demo")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mls_events" },
        (payload) => {
          const row = payload.new as SignalEvent;
          if (!row || row.family_key !== DEMO_FAMILY_KEY) return;
          setEvents((prev) => uniqById([row, ...prev]));
        }
      )
      .subscribe();

    return () => {
      try {
        sb.removeChannel(channel);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={pageBg}>
      <div style={buildMarkerOverlay}>{"BUILD_MARKER_UI: " + BUILD_MARKER}</div>

      <div style={shell}>
        <div style={topBar}>
          <div>
            <div style={brandTag}>HOMEPLANET / MLS</div>
            <div style={h1}>Day Alignment</div>
            <p style={sub}>Everyone sees the same plan — the day stays in one place.</p>
          </div>

          <div style={btnRow}>
            <button style={btnGhost} onClick={() => (window.location.href = "/")}>
              Back to Registry
            </button>
            <button style={btnGhost} onClick={() => alert("Press Kit (control) — coming next")}>
              Press Kit (control)
            </button>
            <button style={btnGhost} onClick={() => alert("Taylor Creek (control) — coming next")}>
              Taylor Creek (control)
            </button>
          </div>
        </div>

        <div style={layoutGrid}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ ...dayCard, ...pad }}>
              <div style={dayTop}>
                <div>
                  <p style={dayTitle}>{dayLabel}</p>
                  <div style={dayMeta}>Last aligned: {lastUpdated}</div>
                </div>
                <div style={statusPill}>{latest ? "Aligned" : loading ? "Loading" : "Waiting"}</div>
              </div>

              <div style={bigLine}>
                {latest ? typeToHumanLine(latest.type) : loading ? "Loading…" : "No changes recorded yet"}
              </div>

              {latest ? (
                <div style={kv}>
                  <div style={k}>Who</div>
                  <div style={v}>{latest.child}</div>

                  <div style={k}>Details</div>
                  <div style={v}>{latest.details}</div>

                  <div style={k}>Recorded</div>
                  <div style={v}>
                    {formatDateLocal(latest.created_at)} • {formatTimeLocal(latest.created_at)}
                  </div>
                </div>
              ) : (
                <div style={note}>
                  Start with one literal sentence. This becomes the shared truth everyone can point to.
                </div>
              )}

              <div style={divider} />

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={btnGhost} onClick={anchorDay}>
                  Anchor Day
                </button>
                <button style={btnGhost} onClick={resetDemo}>
                  Reset Demo
                </button>
                <button style={btnGhost} onClick={clearDay}>
                  Clear Day
                </button>
              </div>

              <div style={note}>
                Presence-first: capture the change first. Structure comes after. No hacks. No rewriting history.
              </div>

              {err ? <div style={bannerErr}>Error: {err}</div> : null}
              {ok ? <div style={bannerOk}>{ok}</div> : null}
            </div>

            <div style={{ ...timelineCard, ...pad }}>
              <p style={sectionTitle}>TIMELINE</p>
              <div style={timelineList}>
                {timeline.map((e) => (
                  <div key={e.id} style={momentRow}>
                    <div style={momentTop}>
                      <div style={momentType}>{typeToHumanLine(e.type)}</div>
                      <div style={momentTime}>
                        {formatDateLocal(e.created_at)} • {formatTimeLocal(e.created_at)}
                      </div>
                    </div>
                    <div style={momentWho}>Who: {e.child}</div>
                    <div style={momentDetails}>{e.details}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.66, fontWeight: 750, lineHeight: 1.25 }}>
                The user stays in one place. The day reorganizes around the newest truth.
              </div>
            </div>
          </div>

          {!isMobile && (
            <div style={{ ...card, ...pad }}>
              <p style={sectionTitle}>RECORD A CHANGE</p>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <input
                  style={inputBase}
                  value={child}
                  onChange={(e) => setChild(e.target.value)}
                  placeholder="Who (guardian / child / contact)"
                />

                <select style={inputBase} value={type} onChange={(e) => setType(e.target.value as SignalType)}>
                  {SIGNAL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <textarea
                  style={textAreaBase}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Details (short, literal, dispute-ready)"
                />

                <button
                  style={{ ...primaryBtn, ...(canConfirm ? null : btnDisabled) }}
                  onClick={confirm}
                  disabled={!canConfirm}
                >
                  Confirm
                </button>

                <div style={{ opacity: 0.66, fontWeight: 750, fontSize: 12, lineHeight: 1.3 }}>
                  Tip: one sentence. No storytelling. Just the plan change.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <div style={quickDockWrap}>
          <div style={quickDock}>
            <div style={dockGrid}>
              <input style={inputBase} value={child} onChange={(e) => setChild(e.target.value)} placeholder="Who" />

              <select style={inputBase} value={type} onChange={(e) => setType(e.target.value as SignalType)}>
                {SIGNAL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                style={inputBase}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="What changed"
              />

              <button style={{ ...primaryBtn, ...(canConfirm ? null : btnDisabled) }} onClick={confirm} disabled={!canConfirm}>
                Confirm
              </button>
            </div>

            <div style={dockHint}>Mobile rule: stay on one screen. The day updates around you.</div>
          </div>
        </div>
      )}
    </div>
  );
}



