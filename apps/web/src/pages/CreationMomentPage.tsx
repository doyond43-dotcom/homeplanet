import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreationMomentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0);

  const steps = [
    "Building your system…",
    "Assigning Presence ID…",
    "Locking origin…",
    "Preparing live board…",
  ];

  useEffect(() => {
    if (step < steps.length - 1) {
      const t = setTimeout(() => setStep(step + 1), 600);
      return () => clearTimeout(t);
    } else {
      const final = setTimeout(() => {
        const redirect = (location.state as any)?.redirectTo;
        navigate(redirect || "/planet/vehicles/awnit-demo");
      }, 900);
      return () => clearTimeout(final);
    }
  }, [step, navigate, location.state]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 0%, rgba(16,185,129,0.15), transparent 40%), #020617",
        color: "#e2e8f0",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 420,
          maxWidth: "100%",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(2,6,23,0.85)",
          padding: 28,
          boxShadow:
            "0 30px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#34d399",
            marginBottom: 10,
          }}
        >
          HOMEPLANET SYSTEM BUILD
        </div>

        <div
          style={{
            fontSize: 26,
            fontWeight: 900,
            marginBottom: 18,
          }}
        >
          Creating your system
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;

            return (
              <div
                key={i}
                style={{
                  borderRadius: 12,
                  border: active
                    ? "1px solid rgba(34,197,94,0.4)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: active
                    ? "rgba(34,197,94,0.12)"
                    : "rgba(255,255,255,0.03)",
                  padding: "10px 12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: done
                    ? "#86efac"
                    : active
                    ? "#dcfce7"
                    : "#94a3b8",
                  transition: "all 0.25s ease",
                }}
              >
                {done ? "✓ " : active ? "● " : "○ "} {s}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            height: 4,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg,#34d399,#22c55e)",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: "#64748b",
          }}
        >
          Presence-first system initialization in progress
        </div>
      </div>
    </div>
  );
}