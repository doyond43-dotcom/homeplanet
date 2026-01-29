import { useEffect } from "react";
import type { OrbitReason } from "./useOrbitLock";

export function OrbitOffer(props: {
  open: boolean;
  label: string;
  reason: OrbitReason;
  onGuide: () => void;
  onDismiss: () => void;
}) {
  // Optional: allow ESC to dismiss on desktop
  useEffect(() => {
    if (!props.open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onDismiss();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [props.open, props.onDismiss]);

  if (!props.open) return null;

  return (
    // IMPORTANT: this wrapper must NOT block clicks on the app behind it
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none", // ✅ lets the rest of the app stay clickable
      }}
    >
      {/* The card itself is clickable */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Orbit Lock offer"
        style={{
          pointerEvents: "auto", // ✅ only the card catches taps/clicks
          position: "absolute",
          right: 12,
          bottom: "calc(12px + env(safe-area-inset-bottom))",
          width: "min(360px, calc(100vw - 24px))",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(10,10,14,0.82)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          padding: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 13, color: "rgba(255,255,255,0.92)" }}>
              Take the Wheel (Orbit Lock)
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.70)",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
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
              flex: "0 0 auto",
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
              whiteSpace: "nowrap",
            }}
          >
            I’m good
          </button>
        </div>
      </div>
    </div>
  );
}


