import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const BUILD_MARKER = "BUILD_MARKER_20260213_FIXED_UTF8";

export default function MLSLanding() {
console.log("" + BUILD_MARKER);

const navigate = useNavigate();
const isMobile = useMediaQuery("(max-width: 740px)");

// clean seed example
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
return [...events].sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1))[0];
}, [events]);

const timeline = useMemo(() => {
return [...events].sort((a, b) => (a.createdAtISO < b.createdAtISO ? 1 : -1));
}, [events]);

// FIXED — no encoding hacks
const confirm = () => {
const ev: SignalEvent = {
id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
child: (child || "").trim() || "Child",
type,
details: (details || "").trim(),
createdAtISO: nowISO(),
};

```
setEvents((prev) => [ev, ...prev]);
setDetails("");
```

};

const go = (to: string) => {
try { navigate(to); } catch {}
setTimeout(() => {
try { if (window.location.pathname !== to) window.location.assign(to); } catch {}
}, 50);
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
{"BUILD_MARKER_UI: " + BUILD_MARKER} </div>

```
  <div style={{ padding: 24, color: "white" }}>
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
```

);
}





