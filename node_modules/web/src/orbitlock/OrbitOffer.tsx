import type { OrbitReason } from "./useOrbitLock";

export function OrbitOffer(props: {
  open: boolean;
  label: string;
  reason: OrbitReason;
  onGuide: () => void;
  onDismiss: () => void;
}) {
  if (!props.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        width: 360,
        maxWidth: "calc(100vw - 36px)",
        zIndex: 50,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.14)",
        background: "rgba(10,10,14,0.82)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
        backdropFilter: "blur(10px)",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.92)" }}>
            Take the Wheel (Orbit Lock)
          </div>
          <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.70)" }}>
            {props.label}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
            Reason: {props.reason}
          </div>
        </div>

        <button
          onClick={props.onDismiss}
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.75)",
            cursor: "pointer",
            fontWeight: 900,
          }}
          aria-label="Dismiss Orbit Lock offer"
          title="Dismiss"
        >
          ×
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <button
          onClick={props.onGuide}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.92)",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          Guide me
        </button>
        <button
          onClick={props.onDismiss}
          style={{
            padding: "10px 12px",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.75)",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          I’m good
        </button>
      </div>
    </div>
  );
}

