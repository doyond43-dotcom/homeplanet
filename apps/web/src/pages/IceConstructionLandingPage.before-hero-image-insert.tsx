import { useNavigate } from "react-router-dom";

export default function IceConstructionLandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d0f",
        color: "#ffffff",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#f97316",
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          HOMEPLANET CONSTRUCTION EXPERIENCE
        </p>

        <h1
          style={{
            fontSize: "clamp(48px, 8vw, 88px)",
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          What We're Building Next.
        </h1>

        <p
          style={{
            maxWidth: 800,
            margin: "0 auto",
            color: "#cbd5e1",
            fontSize: 22,
            lineHeight: 1.6,
          }}
        >
          Waterfront remodels, luxury renovations, property transformations, and real-time
          project visibility. See what's happening before, during, and after
          every project.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 40,
          }}
        >
          <button
            onClick={() => navigate("/planet/ice-construction-command")}
            style={{
              padding: "16px 28px",
              borderRadius: 999,
              border: "none",
              background: "#39ff14",
              color: "#000",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open Command Center
          </button>

          <button
            style={{
              padding: "16px 28px",
              borderRadius: 999,
              border: "1px solid #374151",
              background: "transparent",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            View Active Projects
          </button>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        <h2 style={{ fontSize: 40, marginBottom: 30 }}>
          Featured Projects
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 24,
          }}
        >
          {[
            "Palm Beach Waterfront Remodel",
            "Oceanfront Condo Renovation",
            "Luxury Rental Conversion",
          ].map((project) => (
            <div
              key={project}
              style={{
                background: "#111827",
                border: "1px solid #1f2937",
                borderRadius: 24,
                padding: 24,
              }}
            >
              <h3>{project}</h3>
              <p style={{ color: "#94a3b8" }}>
                Live project updates, progress tracking, materials,
                customer communication, and project visibility.
              </p>

              <button
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: 14,
                  borderRadius: 12,
                  border: "none",
                  background: "#39ff14",
                  color: "#000",
                  fontWeight: 700,
                }}
              >
                View Project
              </button>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        <h2 style={{ fontSize: 40, marginBottom: 24 }}>
          Live Activity
        </h2>

        {[
          "Cabinets Delivered",
          "Progress Photos Uploaded",
          "Walkthrough Scheduled",
          "Materials Received",
          "Customer Approved Layout",
        ].map((item) => (
          <div
            key={item}
            style={{
              padding: "18px 0",
              borderBottom: "1px solid #1f2937",
              color: "#d1d5db",
            }}
          >
            {item}
          </div>
        ))}
      </section>

      <section
        style={{
          textAlign: "center",
          padding: "100px 24px",
          borderTop: "1px solid #1f2937",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(42px,6vw,72px)",
            marginBottom: 24,
          }}
        >
          Know Something We Don't?
        </h2>

        <p
          style={{
            maxWidth: 700,
            margin: "0 auto",
            color: "#94a3b8",
            fontSize: 20,
          }}
        >
          A better supplier. A better process. A better tool.
          The next great idea can come from anywhere.
        </p>

        <button
          style={{
            marginTop: 32,
            padding: "18px 36px",
            borderRadius: 999,
            border: "none",
            background: "#39ff14",
            color: "#000",
            fontWeight: 700,
          }}
        >
          Share An Idea
        </button>
      </section>
    </div>
  );
}




