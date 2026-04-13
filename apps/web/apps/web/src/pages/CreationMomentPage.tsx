import { useEffect } from "react";

export default function CreationMomentPage() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hp_starter_payload");

      if (!stored) {
        window.location.href = "/planet/creator";
        return;
      }

      const payload = JSON.parse(stored);
      const boardSlug = payload?.boardSlug || "starter-board";

      // small delay so it feels like a build moment
      setTimeout(() => {
        window.location.href = `/planet/live/${boardSlug}`;
      }, 1200);
    } catch (err) {
      console.error("CreationMomentPage error:", err);
      window.location.href = "/planet/creator";
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "#e5e7eb",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          padding: 24,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.03)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          Building your live board...
        </div>
        <div style={{ marginTop: 10, opacity: 0.7 }}>
          Locking in your system
        </div>
      </div>
    </div>
  );
}