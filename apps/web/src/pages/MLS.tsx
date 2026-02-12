import React from "react";

export default function MLS() {
  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: "24px", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "34px", margin: "0 0 10px" }}>MLS — Parenting Signal Infrastructure</h1>
      <p style={{ opacity: 0.85, marginTop: 0 }}>
        Live preview link (hotfix). Full concept page is being polished.
      </p>

      <div style={{ marginTop: "18px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <a href="/planets" style={{ padding: "12px 16px", borderRadius: "12px", background: "#1e3a8a", color: "#fff", textDecoration: "none" }}>
          Go to Invention Planet
        </a>

        <a href="/taylor-creek" style={{ padding: "12px 16px", borderRadius: "12px", background: "#111827", color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,.15)" }}>
          View Taylor Creek
        </a>
      </div>

      <p style={{ marginTop: "18px", opacity: 0.65 }}>
        If this page loads, the issue is inside the full MLS layout and we’ll restore it next.
      </p>
    </div>
  );
}
