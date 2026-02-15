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

const BUILD_MARKER = "BUILD_MARKER_UTC_20260215_044414";

export default function MLSLanding() {
  console.log("" + BUILD_MARKER);

    const isMobile = useMediaQuery("(max-width: 740px)");

  const [events, setEvents] = useState<SignalEvent[]>(() => [
    {
      id: `seed_${Date.now()}`,
      child: "Chelsea",
      type: "Pickup Change",
      details: "After school ÃƒÆ’Ã‚Â¢ÃƒÂ¢â€Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â Aunt picking up",
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
    const ev: SignalEvent = {
      id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      child: (child || "").trim() || "Child",
      type,
      details: (details || "").trim(),
      createdAtISO: nowISO(),
    };

    setEvents(prev => [ev, ...prev]);
    setDetails("");
  };

  

  return (
    <>
      <div style={{
        position: "fixed",
        top: 8,
        right: 12,
        zIndex: 99999,
        fontSize: 12,
        fontWeight: 900,
        padding: "6px 10px",
        borderRadius: 10,
        background: "rgba(0,0,0,0.75)",
        border: "1px solid rgba(255,255,255,0.25)",
        color: "white",
        pointerEvents: "none",
      }}>
        {"BUILD_MARKER_UI: " + BUILD_MARKER}
      </div>

      <div style={{ padding: isMobile ? 16 : 24, color: "white" }}>
        <h1>Today</h1>

        {latest && (
          <div>
            <strong>{typeToHumanLine(latest.type)}</strong>
            <div>Who: {latest.child}</div>
            <div>{latest.details}</div>
            <div>{formatTimeLocal(latest.createdAtISO)}</div>
          </div>
        )}

        <hr />

        <input value={child} onChange={(e)=>setChild(e.target.value)} />
        <select value={type} onChange={(e)=>setType(e.target.value as SignalType)}>
          {SIGNAL_TYPES.map(t=><option key={t}>{t}</option>)}
        </select>
        <textarea value={details} onChange={(e)=>setDetails(e.target.value)} />

        <button onClick={confirm}>Confirm</button>
      </div>
    </>
  );
}






