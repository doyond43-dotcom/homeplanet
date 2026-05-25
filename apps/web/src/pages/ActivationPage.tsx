import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ActivationPage() {
  const navigate = useNavigate();
  const { boardSlug = "live-system" } = useParams();

  const payload =
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(`hp-system:${boardSlug}`) || "{}")
      : {};

  const businessName =
    payload?.businessName || titleFromSlug(boardSlug);

  function activateTrial() {
    const activationPayload = {
      active: true,
      activatedAt: new Date().toISOString(),
      trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    };

    window.localStorage.setItem(
      `hp-trial:${boardSlug}`,
      JSON.stringify(activationPayload)
    );

    navigate(`/planet/live/${boardSlug}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 15%, rgba(16,185,129,0.18), transparent 30%), radial-gradient(circle at 85% 10%, rgba(56,189,248,0.18), transparent 32%), #020817",
        color: "white",
        padding: 24,
        display: "grid",
        placeItems: "center",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          borderRadius: 32,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.05)",
          boxShadow: "0 30px 120px rgba(0,0,0,0.45)",
          overflow: "hidden",
          position: "relative",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(16,185,129,0.18), transparent 34%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", padding: 34 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              padding: "10px 16px",
              background: "rgba(16,185,129,0.14)",
              border: "1px solid rgba(16,185,129,0.24)",
              color: "#a7f3d0",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: "0.08em",
            }}
          >
            <Sparkles size={14} />
            LIVE SYSTEM READY
          </div>

          <div style={{ marginTop: 28 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 18,
                  background: "rgba(16,185,129,0.16)",
                  display: "grid",
                  placeItems: "center",
                  color: "#6ee7b7",
                }}
              >
                <Globe2 size={28} />
              </div>

              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.62)",
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: "0.08em",
                  }}
                >
                  HOMEPLANET SYSTEM
                </div>

                <h1
                  style={{
                    margin: "6px 0 0",
                    fontSize: 38,
                    lineHeight: 1,
                    fontWeight: 950,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {businessName}
                </h1>
              </div>
            </div>

            <div
              style={{
                marginTop: 30,
                fontSize: 22,
                lineHeight: 1.3,
                fontWeight: 900,
              }}
            >
              Your live business system is ready.
            </div>

            <div
              style={{
                marginTop: 12,
                color: "rgba(255,255,255,0.70)",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Customer pages, operational workflow, QR payments,
              proof tracking, and live updates are already connected.
            </div>

            <div
              style={{
                marginTop: 28,
                display: "grid",
                gap: 14,
              }}
            >
              {[
                "Customer intake page",
                "Live operational board",
                "QR payment support",
                "Photo proof workflow",
                "Mobile-ready system",
                "14-day free activation",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    borderRadius: 18,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                    padding: "14px 16px",
                  }}
                >
                  <CheckCircle2 size={18} color="#6ee7b7" />
                  <div style={{ fontWeight: 800 }}>{item}</div>
                </div>
              ))}
            </div>

            <button
              onClick={activateTrial}
              style={{
                marginTop: 34,
                width: "100%",
                border: 0,
                borderRadius: 22,
                background:
                  "linear-gradient(135deg, rgba(16,185,129,1), rgba(52,211,153,1))",
                color: "#022c22",
                padding: "18px 22px",
                fontSize: 16,
                fontWeight: 950,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 18px 50px rgba(16,185,129,0.35)",
              }}
            >
              Activate Free Trial
              <ArrowRight size={18} />
            </button>

            <Link
              to={`/planet/live/${boardSlug}`}
              style={{
                marginTop: 18,
                display: "block",
                textAlign: "center",
                color: "rgba(255,255,255,0.58)",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Continue without activating
            </Link>

            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                gap: 10,
                justifyContent: "center",
                color: "rgba(255,255,255,0.45)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <ShieldCheck size={14} />
              No app download required
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}