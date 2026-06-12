import React from "react";

export default function BusinessDemoDirectory() {
  const demos = [
    {
      title: "Home Services Demo",
      flow: "Customer Request ? Operations Board ? Staff Assignment ? Payment & Proof",
    },
    {
      title: "Restaurant Demo",
      flow: "Customer ? Table Request ? Staff Awareness ? Service Complete",
    },
    {
      title: "Food Truck Demo",
      flow: "Location ? Menu ? Order ? Event",
    },
    {
      title: "Mobile Mechanic Demo",
      flow: "Vehicle Intake ? Diagnosis ? Repair ? Payment",
    },
    {
      title: "Salon Demo",
      flow: "Appointment ? Service ? Notes ? Follow-Up",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07111a",
        color: "#fff",
        padding: "40px 24px 100px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <p
          style={{
            color: "#4ade80",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 700,
          }}
        >
          Business Demo Systems
        </p>

        <h1
          style={{
            fontSize: "clamp(48px,7vw,88px)",
            lineHeight: 1,
            margin: "20px 0",
          }}
        >
          Run a Business
        </h1>

        <p
          style={{
            color: "#9ca3af",
            fontSize: 22,
            marginBottom: 50,
          }}
        >
          Pick a demo and see how the system works.
        </p>

        <div
          style={{
            display: "grid",
            gap: 24,
          }}
        >
          {demos.map((demo) => (
            <div
              key={demo.title}
              style={{
                background: "linear-gradient(135deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 32,
                padding: 32,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 34 }}>
                {demo.title}
              </h2>

              <p
                style={{
                  marginTop: 14,
                  color: "#9ca3af",
                  fontSize: 18,
                }}
              >
                {demo.flow}
              </p>

              <div
                style={{
                  marginTop: 22,
                  color: "#4ade80",
                  fontWeight: 700,
                }}
              >
                Explore Demo ?
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
