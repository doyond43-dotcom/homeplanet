import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function formatDateTimeLocal(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
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

export default function MLSLanding() {
  const navigate = useNavigate();

  // Seed one “Today” example so it feels alive immediately (delete later)
  const [events, setEvents] = useState<SignalEvent[]>(() => [
    {
      id: `seed_${Date.now()}`,
      child: "Chelsea",
      type: "Pickup Change",
      details: "After school — Aunt picking up",
      createdAtISO: nowISO(),
    },
  ]);

  const [child, setChild] = useState("Chelsea");
  const [type, setType] = useState<SignalType>("Pickup Change");
  const [details, setDetails] = useState("");

  const latest = useMemo(() => {
    if (!events.length) return null;
    const sorted = [...events].sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1));
    return sorted[0];
  }, [events]);

  const timeline = useMemo(() => {
    const sorted = [...events].sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1));
    return sorted;
  }, [events]);

  const confirm = () => {
    const trimmedChild = (child || "").trim() || "Child";
    const trimmedDetails = (details || "").trim();

    const ev: SignalEvent = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      child: trimmedChild,
      type,
      details: trimmedDetails,
      createdAtISO: nowISO(),
    };

    // Instant continuity: append + clear input (no modal)
    setEvents((prev) => [ev, ...prev]);
    setDetails("");
  };

  const shell: React.CSSProperties = {
    minHeight: "100vh",
    padding: "40px 22px 60px",
    display: "flex",
    justifyContent: "center",
    background:
      "radial-gradient(900px 480px at 50% 0%, rgba(130,160,255,0.14), rgba(0,0,0,0) 60%), #070707",
    color: "rgba(255,255,255,0.92)",
  };

  const stage: React.CSSProperties = {
    width: "100%",
    maxWidth: 1120,
  };

  const panel: React.CSSProperties = {
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "0 28px 90px rgba(0,0,0,0.55)",
    overflow: "hidden",
  };

  const inner: React.CSSProperties = {
    padding: 34,
    background:
      "radial-gradient(900px 520px at 50% 0%, rgba(90,140,255,0.10), rgba(0,0,0,0) 62%)",
  };

  const topKicker: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.4,
    opacity: 0.58,
  };

  const h1: React.CSSProperties = {
    margin: "10px 0 10px",
    fontSize: 52,
    lineHeight: 1.03,
    fontWeight: 950,
  };

  const lead: React.CSSProperties = {
    margin: "0 0 18px",
    fontSize: 16,
    lineHeight: 1.5,
    opacity: 0.86,
    maxWidth: 860,
  };

  const pillRow: React.CSSProperties = {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
    marginBottom: 24,
  };

  const pillBtn: React.CSSProperties = {
    borderRadius: 999,
    padding: "10px 14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(0,0,0,0.42)",
    color: "rgba(255,255,255,0.92)",
    fontWeight: 900,
    cursor: "pointer",
    userSelect: "none",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 16,
  };

  const card: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.46)",
    padding: 18,
  };

  const cardTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 950,
    opacity: 0.9,
    letterSpacing: 0.2,
  };

  const divider: React.CSSProperties = {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "14px 0",
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    opacity: 0.72,
    marginBottom: 6,
  };

  const input: React.CSSProperties = {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.55)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
  };

  const textarea: React.CSSProperties = {
    ...input,
    minHeight: 92,
    resize: "vertical",
  };

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    marginTop: 12,
    borderRadius: 999,
    padding: "12px 14px",
    border: "1px solid rgba(0,255,180,0.25)",
    background: "rgba(0,255,180,0.18)",
    color: "white",
    fontWeight: 950,
    cursor: "pointer",
    userSelect: "none",
  };

  const todayCard: React.CSSProperties = {
    ...card,
    border: "1px solid rgba(0,255,180,0.22)",
    background: "linear-gradient(135deg, rgba(0,255,180,0.14), rgba(0,0,0,0.50) 70%)",
  };

  const badge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    padding: "7px 10px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.40)",
    fontSize: 12,
    fontWeight: 950,
    opacity: 0.92,
  };

  const row: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  };

  const soft: React.CSSProperties = { opacity: 0.78 };

  return (
    <div style={shell}>
      <div style={stage}>
        <div style={panel}>
          <div style={inner}>
            <div style={topKicker}>HOMEPLANET / MLS</div>
            <div style={h1}>Today</div>
            <div style={lead}>Everyone sees the same plan.</div>

            <div style={pillRow}>
              <button type="button" style={pillBtn} onClick={() => navigate("/core/registry")}>
                Back to Registry
              </button>
              <button type="button" style={pillBtn} onClick={() => navigate("/press/taylor-creek")}>
                Press Kit (control)
              </button>
              <button type="button" style={pillBtn} onClick={() => navigate("/taylor-creek")}>
                Taylor Creek (control)
              </button>
            </div>

            <div style={grid}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 950, marginBottom: 10, opacity: 0.9 }}>Today</div>

                  {latest ? (
                    <div style={todayCard}>
                      <div style={row}>
                        <div style={{ fontSize: 18, fontWeight: 950 }}>What changed</div>
                        <div style={badge}>Recorded</div>
                      </div>

                      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                        <div style={{ fontWeight: 950, opacity: 0.9 }}>{typeToHumanLine(latest.type)}</div>

                        <div>
                          <span style={{ opacity: 0.74, fontWeight: 900 }}>Who:</span>{" "}
                          <span style={{ fontWeight: 950 }}>{latest.child}</span>
                        </div>

                        {latest.details ? <div style={soft}>{latest.details}</div> : <div style={soft}>(no details yet)</div>}
                        <div style={{ opacity: 0.62, fontSize: 12 }}>{formatTimeLocal(latest.createdAtISO)}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={card}>No updates yet.</div>
                  )}
                </div>

                <div style={card}>
                  <div style={cardTitle}>Update the day</div>
                  <div style={divider} />

                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <div style={label}>Who</div>
                      <input
                        style={input}
                        value={child}
                        onChange={(e) => setChild(e.target.value)}
                        placeholder="Child name"
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <div style={label}>What happened</div>
                      <select style={input} value={type} onChange={(e) => setType(e.target.value as SignalType)}>
                        {SIGNAL_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div style={label}>Anything they should know</div>
                      <textarea
                        style={textarea}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Short note. Keep it real-life simple."
                      />
                    </div>

                    <button type="button" style={primaryBtn} onClick={confirm}>
                      Confirm
                    </button>

                    <div style={{ fontSize: 12, opacity: 0.62, lineHeight: 1.4 }}>
                      No switching apps. No re-entering. Just mark what changed.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                <div style={card}>
                  <div style={cardTitle}>Earlier today</div>
                  <div style={divider} />

                  {timeline.length ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      {timeline.map((ev) => (
                        <div
                          key={ev.id}
                          style={{
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(255,255,255,0.04)",
                            padding: 12,
                          }}
                        >
                          <div style={row}>
                            <div style={{ fontWeight: 950 }}>{typeToHumanLine(ev.type)}</div>
                            <div style={{ opacity: 0.6, fontSize: 12 }}>{formatDateTimeLocal(ev.createdAtISO)}</div>
                          </div>
                          <div style={{ marginTop: 6, opacity: 0.84 }}>
                            <span style={{ opacity: 0.7, fontWeight: 900 }}>Who:</span>{" "}
                            <span style={{ fontWeight: 950 }}>{ev.child}</span>
                          </div>
                          {ev.details ? <div style={{ marginTop: 6, opacity: 0.78 }}>{ev.details}</div> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.65 }}>Nothing recorded yet.</div>
                  )}
                </div>

                <div style={card}>
                  <div style={cardTitle}>Nothing resets.</div>
                  <div style={divider} />
                  <div style={{ fontSize: 13, opacity: 0.78, lineHeight: 1.5 }}>
                    Everyone stays aligned — the day updates in one place.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18, opacity: 0.6, fontSize: 12 }}>
              Nothing resets. Everyone stays aligned.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// BUILD_MARKER_20260212_232227

