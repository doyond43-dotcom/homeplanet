import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { emitCoreTruth } from "./lib/coreTruth";
import { usePresence } from "./lib/usePresence";

export default function CoreTruthView() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  // Presence auto-tracking
  usePresence(!!user);

  async function recordPresence() {
    try {
      setBusy(true);
      await emitCoreTruth("presence_ping", {
        note: "User pressed Record Presence",
        client_time: new Date().toISOString(),
      });
      alert("Presence recorded");
    } finally {
      setBusy(false);
    }
  }

  async function verifyPresence() {
    const partner = prompt("Paste partner user ID (UID):")?.trim();
    if (!partner) return;

    try {
      setBusy(true);
      await emitCoreTruth("presence_ping", {
        note: "User verified presence (LoveBirds v1)",
        verified: true,
        partner_user_id: partner,
        client_time: new Date().toISOString(),
      });
      alert("Verification sent");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 18,
        display: "grid",
        gap: 12,
        justifyItems: "center",
      }}
    >
      <button
        onClick={recordPresence}
        disabled={busy}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
          cursor: busy ? "not-allowed" : "pointer",
          minWidth: 180,
          opacity: busy ? 0.7 : 1,
        }}
      >
        Record Presence
      </button>

      <button
        onClick={verifyPresence}
        disabled={busy}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.06)",
          color: "#fff",
          cursor: busy ? "not-allowed" : "pointer",
          minWidth: 180,
          opacity: busy ? 0.7 : 1,
        }}
      >
        Verify Presence
      </button>
    </div>
  );
}



