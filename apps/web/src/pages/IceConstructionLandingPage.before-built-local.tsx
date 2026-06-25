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
maxWidth: 1400,
margin: "0 auto",
padding: "40px 24px 80px",
}}
>
<div
style={{
position: "relative",
borderRadius: 28,
overflow: "hidden",
border: "1px solid #1f2937",
boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
}}
>
<img
src="/images/ice-construction-waterfront-hero-v1.png"
alt="Ice Construction Hero"
style={{
width: "100%",
display: "block",
minHeight: 700,
objectFit: "cover",
}}
/>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,.82), rgba(0,0,0,.35), rgba(0,0,0,.15))",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 650,
            padding: "60px",
          }}
        >
          <p
            style={{
              color: "#f97316",
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            HOMEPLANET CONSTRUCTION EXPERIENCE
          </p>

          <h1
            style={{
              fontSize: "clamp(56px, 7vw, 96px)",
              lineHeight: 0.95,
              marginBottom: 24,
            }}
          >
            What We're
            <br />
            Building Next.
          </h1>

          <p
            style={{
              color: "#e5e7eb",
              fontSize: 26,
              lineHeight: 1.5,
              marginBottom: 40,
              maxWidth: 520,
            }}
          >
            This isn't about construction.
            <br />
            It's about what comes next.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                padding: "18px 30px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(0,0,0,0.35)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              View Active Projects
            </button>

            <button
              onClick={() =>
                navigate("/planet/ice-construction-command")
              }
              style={{
                padding: "18px 30px",
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
          </div>
        </div>
      </div>
    </div>
  </section>

  <section
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 24px 60px",
    }}
  >
    <div style={{ marginBottom: 80 }}>
  <h3
    style={{
      textAlign: "center",
      fontSize: 54,
      marginBottom: 24,
      letterSpacing: 1,
    }}
  >
    A House Becomes A Home.
  </h3>

  <img
    src="/images/ice-construction-what-comes-next-living-room-v1.png"
    alt="A House Becomes A Home"
    style={{
      width: "100%",
      borderRadius: 24,
      display: "block",
    }}
  />


</div>

<div style={{ marginBottom: 80 }}>
  <h3
    style={{
      textAlign: "center",
      fontSize: 54,
      marginBottom: 24,
      letterSpacing: 1,
    }}
  >
    Designed Around Life.
  </h3>

  <img
    src="/images/ice-construction-what-comes-next-entertaining-space-v1.png"
    alt="Designed Around Life"
    style={{
      width: "100%",
      borderRadius: 24,
      display: "block",
    }}
  />


</div>

<div style={{ marginBottom: 40 }}>
  <h3
    style={{
      textAlign: "center",
      fontSize: 54,
      marginBottom: 24,
      letterSpacing: 1,
    }}
  >
    The Next Chapter.
  </h3>

  <img
    src="/images/ice-construction-what-comes-next-sunset-patio-v1.png"
    alt="The Next Chapter"
    style={{
      width: "100%",
      borderRadius: 24,
      display: "block",
    }}
  />


</div>
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




