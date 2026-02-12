export default function MLSLanding() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 700px at 60% 30%, rgba(45,92,255,.18), rgba(0,0,0,0)), #060916",
        color: "#EAF0FF",
        padding: "28px 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div style={{ opacity: 0.85, fontSize: 14, marginBottom: 12 }}>
          ☄️ Invention Planet • Origin Concept: <b>Chelsea Rule</b> • Captured:{" "}
          <b>October 2025 (approx.)</b>
        </div>

        <div
          style={{
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,.10)",
            background:
              "linear-gradient(135deg, rgba(25,35,80,.75), rgba(10,12,22,.55))",
            boxShadow: "0 30px 80px rgba(0,0,0,.45)",
            padding: "28px",
          }}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            {["Concept Locked", "Wearable-linked", "Family guidance layer", "Privacy-first"].map(
              (t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    padding: "7px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.14)",
                    background: "rgba(0,0,0,.20)",
                    opacity: 0.9,
                  }}
                >
                  {t}
                </span>
              )
            )}
          </div>

          <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: "0 0 10px 0" }}>MLS</h1>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 14px 0", opacity: 0.9 }}>
            Parenting Signal Infrastructure
          </h2>

          <div style={{ fontSize: 16, opacity: 0.88, lineHeight: 1.55, maxWidth: 860 }}>
            A structured concept for wearable-linked behavioral awareness and calm guidance that
            helps families notice patterns early, respond calmly, and reduce day-to-day chaos
            without turning parenting into surveillance.
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
            <a
              href="/planets"
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                background: "#1E2A5E",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              View System Registry →
            </a>

            <a
              href="/"
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,.18)",
                color: "#EAF0FF",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              Home →
            </a>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 14,
            marginTop: 18,
          }}
        >
          {[
            [
              "Signal Capture",
              "Wearable-linked activity and state signals captured as events (not judgments). The goal is pattern visibility, not control.",
            ],
            [
              "Pattern Mapping",
              "Trend detection over time to identify stress build-up, sleep disruption, mood swings, or routine breaks before they become crises.",
            ],
            [
              "Guidance Layer",
              "Calm, structured suggestions for parents based on patterns: de-escalation prompts, routine adjustments, reflection checkpoints.",
            ],
            [
              "Privacy Model",
              "Family-owned data. Clear consent boundaries. No resale. No exploitation. Designed to support the family—not profile it.",
            ],
          ].map(([title, body], i) => (
            <div
              key={i}
              style={{
                borderRadius: 22,
                border: "1px solid rgba(255,255,255,.10)",
                background: "rgba(0,0,0,.18)",
                padding: "18px",
                boxShadow: "0 18px 50px rgba(0,0,0,.35)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>{title}</div>
              <div style={{ opacity: 0.82, lineHeight: 1.5 }}>{body}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 14,
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,.10)",
            background: "rgba(0,0,0,.16)",
            padding: "18px",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>
            Future layers (optional)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 12,
            }}
          >
            {[
              "Therapist bridge (opt-in, family controlled)",
              "Family dashboard + weekly summaries",
              "School/teacher collaboration mode (opt-in)",
              "Child-safe AI boundary mode (no adult content, no manipulation)",
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(20,25,50,.25)",
                  padding: "12px 14px",
                  opacity: 0.9,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, opacity: 0.55, fontSize: 13 }}>
            Note: This is a structured concept page to preserve origin + vision (not a claim of
            completed wearable integration).
          </div>
        </div>
      </div>
    </div>
  );
}

