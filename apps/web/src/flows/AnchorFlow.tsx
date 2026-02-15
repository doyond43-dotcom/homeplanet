import { useState } from "react";

/**
 * AnchorFlow — Presence-first snapshot + Handles (Calm Core)
 * Handles are human-confirmable truth anchors.
 */

type Handle = {
  id: string;
  label: string;
  locked: boolean;
};

export default function AnchorFlow() {
  // Simulated snapshot state (already exists in your flow)
  const [capturedAt] = useState<string>(new Date().toISOString());

  // Suggested handles (static for now)
  const [suggested, setSuggested] = useState<Handle[]>([
    { id: "core_claim", label: "Core Claim", locked: false },
    { id: "key_definition", label: "Key Definition", locked: false },
    { id: "evidence_gap", label: "Evidence Gap", locked: false }
  ]);

  const [locked, setLocked] = useState<Handle[]>([]);

  function confirmHandle(h: Handle) {
    setSuggested((s) => s.filter((x) => x.id !== h.id));
    setLocked((l) => [...l, { ...h, locked: true }]);
  }

  function ignoreHandle(h: Handle) {
    setSuggested((s) => s.filter((x) => x.id !== h.id));
  }

  return (
    <div className="hpCard">
      <div className="hpCardTitle">
        <span>Anchor</span>
        <span style={{ fontSize: 12, opacity: 0.55 }}>
          captured {new Date(capturedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* HANDLE PANEL */}
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 0.4,
            opacity: 0.7,
            marginBottom: 6
          }}
        >
          Handles
        </div>

        {/* Suggested */}
        {suggested.length > 0 && (
          <div style={{ display: "grid", gap: 6 }}>
            {suggested.map((h) => (
              <div
                key={h.id}
                className="hpItem"
                style={{
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <span>{h.label}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="hpBtnGhost"
                    onClick={() => confirmHandle(h)}
                  >
                    Confirm
                  </button>
                  <button
                    className="hpBtnGhost"
                    onClick={() => ignoreHandle(h)}
                    style={{ opacity: 0.6 }}
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 0.4,
                opacity: 0.55,
                marginBottom: 6
              }}
            >
              Locked Handles
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              {locked.map((h) => (
                <div
                  key={h.id}
                  className="hpItem"
                  style={{
                    opacity: 0.85
                  }}
                >
                  ðŸ”’ {h.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {suggested.length === 0 && locked.length === 0 && (
          <div style={{ fontSize: 13, opacity: 0.6 }}>
            No handles detected.
          </div>
        )}
      </div>
    </div>
  );
}
