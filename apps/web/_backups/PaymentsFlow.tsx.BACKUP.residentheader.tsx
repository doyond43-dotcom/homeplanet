import type { CSSProperties } from "react";
import RecordPaymentPanel from "../components/RecordPaymentPanel";

/**
 * PaymentsFlow — Resident module for payments + binder artifacts
 * Keeps Write (AuthorFlow) clean and calm.
 */
export default function PaymentsFlow() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ marginBottom: 6 }}>Payments</h2>
      <p style={{ opacity: 0.65, marginBottom: 14 }}>
        Record a payment event. HomePlanet creates a binder-ready artifact for timestamping.
      </p>

      <div style={cardStyle}>
        <RecordPaymentPanel />
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
};
