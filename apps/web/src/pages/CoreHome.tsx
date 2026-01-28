import { useOutletContext } from "react-router-dom";

export default function CoreHome() {
  const ctx = useOutletContext() as { witnessMode?: boolean } | undefined;

  return (
    <div>
      <h1 style={{ fontSize: 26, margin: 0 }}>HomePlanet Core</h1>
      <p style={{ marginTop: 10, color: "rgba(255,255,255,0.70)", lineHeight: 1.5 }}>
        This is the planetary operating system shell. Planets (Residents) live in the sidebar. Telemetry is a lens,
        not a destination. Presence is anchored at inception.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
        <div style={{ flex: "1 1 280px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 800 }}>Core</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>Doctrine, governance, authority, presence-first timestamping.</div>
        </div>
        <div style={{ flex: "1 1 280px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 800 }}>Residents (Planets)</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>Creator, Career, Vehicles, Education, Safety, Payments.</div>
        </div>
        <div style={{ flex: "1 1 280px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 800 }}>Telemetry Lens</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
            Witness Mode: <b>{ctx?.witnessMode ? "ON" : "OFF"}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
