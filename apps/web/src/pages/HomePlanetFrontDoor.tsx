import React from "react";

export default function HomePlanetFrontDoor() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#07111a",
        color: "#ffffff",
        padding: "40px 24px 100px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#4ade80",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 700,
          }}
        >
          HomePlanet
        </p>

        <h1
          style={{
            fontSize: "clamp(48px,8vw,96px)",
            lineHeight: 1,
            margin: "20px 0 20px",
          }}
        >
          What are you trying to do?
        </h1>

        <p
          style={{
            fontSize: 22,
            color: "#9ca3af",
            maxWidth: 800,
            marginBottom: 60,
          }}
        >
          Pick a path. See what a HomePlanet system could become.
        </p>

        <div
          style={{
            display: "grid",
            gap: 28,
          }}
        >
          <CategoryCard
            title="Run a Business"
            description="Home Services • Restaurant • Food Truck • Mobile Mechanic • Salon"
          />

          <CategoryCard
            title="Care for People & Pets"
            description="Babysitter • Pet Care • Elder Care • House Watch"
          />

          <CategoryCard
            title="Bring People Together"
            description="Community • Events • Local Help"
          />
        </div>
      </div>
    </main>
  );
}

function CategoryCard({
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
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 32,
        padding: 40,
        cursor: "pointer",
      }}
    >
      <h2
        style={{
          fontSize: 42,
          margin: 0,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          marginTop: 18,
          color: "#9ca3af",
          fontSize: 18,
        }}
      >
        {description}
      </p>

      <div
        style={{
          marginTop: 24,
          color: "#4ade80",
          fontWeight: 700,
        }}
      >
        Explore ?
      </div>
    </div>
  );
}
