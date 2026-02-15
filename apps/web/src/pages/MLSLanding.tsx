import React, { useMemo, useState } from "react";

function useMediaQuery(query: string) {
  const get = () => (typeof window !== "undefined" ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = React.useState(get);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    if (m.addEventListener) m.addEventListener("change", onChange);
    else m.addListener(onChange);
    return () => {
      if (m.removeEventListener) m.removeEventListener("change", onChange);
      else m.removeListener(onChange);
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
  child: string;
  type: SignalType;
  details: string;
  createdAtISO: string;
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
    case "Pickup Change": return "Pickup plan changed";
    case "Dropoff Change": return "Dropoff plan changed";
    case "Late Notice": return "Running late";
    case "Absent": return "Absent today";
    case "Early Release": return "Early release";
    case "Approved Person Update": return "Approved person updated";
    case "School Note": return "Note to school";
    default: return "Update";
  }
}

const BUILD_MARKER = "BUILD_MARKER_UTC_20260215_052019";

const pageBg: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(900px 520px at 50% -10%, rgba(130,160,255,0.20), rgba(0,0,0,0) 60%), #070707",
  color: "rgba(255,255,255,0.92)",
};

const shell: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "28px 18px 60px",
};

const topRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 14,
};

const tag: React.CSSProperties = {
  letterSpacing: 2,
  fontSize: 12,
  fontWeight: 900,
  opacity: 0.55,
};

const title: React.CSSProperties = {
  fontSize: 52,
  lineHeight: 1.02,
  margin: "10px 0 6px",
  fontWeight: 900,
};

const subtitle: React.CSSProperties = {
  fontSize: 18,
  opacity: 0.72,
  marginTop: 6,
};

const card: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.35)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.55)",
};

const cardPad: React.CSSProperties = { padding: 16 };

const pillRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 10 };

const pillBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 800,
  cursor: "pointer",
};

const heroGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.15fr 0.85fr",
  gap: 14,
  marginTop: 18,
};

const heroCard: React.CSSProperties = {
  ...card,
  background:
    "linear-gradient(180deg, rgba(18,88,68,0.65), rgba(0,0,0,0.25)), rgba(0,0,0,0.35)",
  border: "1px solid rgba(84,220,170,0.28)",
};

const heroHeadline: React.CSSProperties = { fontSize: 30, fontWeight: 950, margin: "0 0 10px" };

const smallLabel: React.CSSProperties = { fontSize: 12, letterSpacing: 1.2, opacity: 0.7, fontWeight: 900 };

const kv: React.CSSProperties = { display: "grid", gridTemplateColumns: "110px 1fr", gap: 10, marginTop: 10 };

const k: React.CSSProperties = { opacity: 0.7, fontWeight: 800 };
const v: React.CSSProperties = { fontWeight: 900 };

const timeChip: React.CSSProperties = {
  alignSelf: "flex-start",
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.40)",
  fontWeight: 900,
  opacity: 0.9,
};

const sideCard: React.CSSProperties = { ...card };

const sectionTitle: React.CSSProperties = { fontSize: 14, fontWeight: 950, letterSpacing: 1.2, opacity: 0.78, margin: 0 };

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  padding: "10px 12px",
  outline: "none",
  fontWeight: 800,
};

const selectBase: React.CSSProperties = { ...inputBase };

const textAreaBase: React.CSSProperties = {
  ...inputBase,
  minHeight: 88,
  resize: "vertical",
  lineHeight: 1.35,
  fontWeight: 800,
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.95)",
  fontWeight: 950,
  cursor: "pointer",
};

const listGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  marginTop: 14,
};

const eventCard: React.CSSProperties = {
  ...card,
  background: "rgba(0,0,0,0.30)",
};

const eventTop: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 10,
};

const eventType: React.CSSProperties = { fontWeight: 950, fontSize: 16 };
const eventMeta: React.CSSProperties = { opacity: 0.72, fontWeight: 800, fontSize: 12 };

export default function MLSLanding() {
  console.log("" + BUILD_MARKER);

  const isMobile = useMediaQuery("(max-width: 740px)");

  const [events, setEvents] = useState<SignalEvent[]>(() => [
    {
      id: "seed_" + String(Date.now()),
      child: "Chelsea",
      type: "Pickup Change",
      details: "After school Ã¢â‚¬â€ Aunt picking up",
      createdAtISO: nowISO(),
    },
  ]);

  const [child, setChild] = useState("Chelsea");
  const [type, setType] = useState<SignalType>("Pickup Change");
  const [details, setDetails] = useState("");

  const latest = useMemo(() => {
    if (!events.length) return null;
    return [...events].sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1))[0];
  }, [events]);

  const confirm = () => {
    const d = (details || "").trim();
    if (!d) return;

    const ev: SignalEvent = {
      id: String(Date.now()) + "_" + Math.random().toString(16).slice(2),
      child: (child || "").trim() || "Child",
      type,
      details: d,
      createdAtISO: nowISO(),
    };

    setEvents((prev) => [ev, ...prev]);
    setDetails("");
  };

  const grid = isMobile
    ? { ...heroGrid, gridTemplateColumns: "1fr" }
    : heroGrid;

  const list = isMobile
    ? { ...listGrid, gridTemplateColumns: "1fr" }
    : listGrid;

  return (
    <div style={pageBg}>
      {/* Build marker overlay */}
      <div
        style={{
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
        }}
      >
        {"BUILD_MARKER_UI: " + BUILD_MARKER}
      </div>

      <div style={shell}>
        <div style={topRow}>
          <div>
            <div style={tag}>HOMEPLANET / MLS</div>
            <div style={title}>Today</div>
            <div style={subtitle}>Everyone sees the same plan.</div>
          </div>

          <div style={pillRow}>
            <button style={pillBtn} onClick={() => (window.location.href = "/")}>
              Back to Registry
            </button>
            <button style={pillBtn} onClick={() => alert("Press Kit (control) Ã¢â‚¬â€ coming next")}>
              Press Kit (control)
            </button>
            <button style={pillBtn} onClick={() => alert("Taylor Creek (control) Ã¢â‚¬â€ coming next")}>
              Taylor Creek (control)
            </button>
          </div>
        </div>

        <div style={grid}>
          <div style={{ ...heroCard, ...cardPad }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
              <div>
                <div style={smallLabel}>WHAT CHANGED</div>
                <div style={heroHeadline}>{latest ? typeToHumanLine(latest.type) : "No updates yet"}</div>
              </div>
              <div style={timeChip}>{latest ? "Recorded" : "Waiting"}</div>
            </div>

            {latest && (
              <div style={kv}>
                <div style={k}>Who</div>
                <div style={v}>{latest.child}</div>

                <div style={k}>Details</div>
                <div style={v}>{latest.details}</div>

                <div style={k}>When</div>
                <div style={v}>
                  {formatDateLocal(latest.createdAtISO)} Ã¢â‚¬Â¢ {formatTimeLocal(latest.createdAtISO)}
                </div>
              </div>
            )}
          </div>

          <div style={{ ...sideCard, ...cardPad }}>
            <p style={sectionTitle}>RECORD A CHANGE</p>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <input style={inputBase} value={child} onChange={(e) => setChild(e.target.value)} placeholder="Who (guardian)" />
              <select style={selectBase} value={type} onChange={(e) => setType(e.target.value as SignalType)}>
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
                placeholder="Details (what changed)"
              />
              <button style={primaryBtn} onClick={confirm}>
                Confirm
              </button>
              <div style={{ opacity: 0.62, fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>
                Tip: Keep it short and literal. This becomes the shared truth.
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <p style={sectionTitle}>RECENT SIGNALS</p>

          <div style={list}>
            {events.slice(0, 6).map((e) => (
              <div key={e.id} style={{ ...eventCard, ...cardPad }}>
                <div style={eventTop}>
                  <div style={eventType}>{typeToHumanLine(e.type)}</div>
                  <div style={eventMeta}>
                    {formatDateLocal(e.createdAtISO)} Ã¢â‚¬Â¢ {formatTimeLocal(e.createdAtISO)}
                  </div>
                </div>
                <div style={{ fontWeight: 900, opacity: 0.85 }}>Who: {e.child}</div>
                <div style={{ marginTop: 8, fontWeight: 800, opacity: 0.92 }}>{e.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}