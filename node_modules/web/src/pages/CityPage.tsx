import { useParams } from "react-router-dom";
import { PLANETS } from "../planet/planetMap";

export default function CityPage() {
  const { planetId, cityId } = useParams();
  const planet = PLANETS.find((p) => p.id === planetId);
  const city = planet?.cities.find((c) => c.id === cityId);

  return (
    <div>
      <h1 style={{ fontSize: 24, margin: 0 }}>
        🏙 {planet?.label ?? planetId} / {city?.label ?? cityId}
      </h1>

      <p style={{ marginTop: 10, color: "rgba(255,255,255,0.70)", lineHeight: 1.5 }}>
        Placeholder city page. Next we wire real actions + presence-first capture for this city.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
        <div style={{ flex: "1 1 260px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 800 }}>Next Action</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
            Add one “Create” flow here (single form + save + visible proof).
          </div>
        </div>
        <div style={{ flex: "1 1 260px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 800 }}>Presence</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
            Auto-anchor presence at inception (no interruptions).
          </div>
        </div>
        <div style={{ flex: "1 1 260px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.10)", padding: 14, background: "rgba(255,255,255,0.03)" }}>
          <div style={{ fontWeight: 800 }}>Telemetry Lens</div>
          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
            Later: witness logs & “live build mode” overlay.
          </div>
        </div>
      </div>
    </div>
  );
}
