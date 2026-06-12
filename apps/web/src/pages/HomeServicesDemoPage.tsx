import React from "react";

export default function HomeServicesDemoPage() {
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
          Home Services Demo
        </p>

        <h1
          style={{
            fontSize: "clamp(48px,7vw,88px)",
            lineHeight: 1,
            margin: "20px 0",
          }}
        >
          See How The System Works
        </h1>

        <FlowCard
          title="1. Customer Experience"
          description="Customer requests an estimate, uploads photos, asks questions, and starts the job."
        />

        <FlowCard
          title="2. Operations Board"
          description="The request appears on the business board where jobs are scheduled and tracked."
        />

        <FlowCard
          title="3. Staff Experience"
          description="Crew receives assignment, navigation, notes, photos, and completion tasks."
        />

        <FlowCard
          title="4. Payment & Proof"
          description="Customer receives before/after photos, payment request, and completed job record."
        />

        <div
          style={{
            marginTop: 40,
            background: "#0f172a",
            borderRadius: 24,
            padding: 32,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2>Build My System</h2>

          <p style={{ color: "#9ca3af" }}>
            Ready to create a HomePlanet system for your business?
          </p>

          <div
            style={{
              marginTop: 20,
              color: "#4ade80",
              fontWeight: 700,
            }}
          >
            Start My System ?
          </div>
        </div>
      </div>
    </main>
  );
}

function FlowCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#0f172a,#111827)",
        borderRadius: 28,
        padding: 32,
        marginBottom: 24,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          color: "#9ca3af",
          fontSize: 18,
        }}
      >
        {description}
      </p>
    </div>
  );
}
