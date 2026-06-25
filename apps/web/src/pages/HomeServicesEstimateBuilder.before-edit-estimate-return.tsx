import React, { useMemo, useState } from "react";

type Level = "None" | "Light" | "Moderate" | "Heavy";

const levels: Level[] = ["None", "Light", "Moderate", "Heavy"];

const modifierValues: Record<Level, { price: number; labor: number }> = {
  None: { price: 0, labor: 0 },
  Light: { price: 25, labor: 20 },
  Moderate: { price: 50, labor: 45 },
  Heavy: { price: 90, labor: 75 },
};

export default function HomeServicesEstimateBuilder() {
  const [heavyInsectCasings, setHeavyInsectCasings] = useState<Level>("None");
  const [spiderWebDensity, setSpiderWebDensity] = useState<Level>("None");
  const [limitedAccess, setLimitedAccess] = useState<Level>("None");

  const basePrice = 250;

  const totals = useMemo(() => {
    const selected = [heavyInsectCasings, spiderWebDensity, limitedAccess];

    return selected.reduce(
      (total, level) => ({
        price: total.price + modifierValues[level].price,
        labor: total.labor + modifierValues[level].labor,
      }),
      { price: basePrice, labor: 0 }
    );
  }, [heavyInsectCasings, spiderWebDensity, limitedAccess]);

  return (
    <main style={page}>
      <div style={container}>
        <p style={kicker}>ESTIMATE BUILDER</p>
        <h1 style={title}>Daniel Doyon</h1>
        <p style={muted}>House Wash • 4004 se 29th court</p>

        <section style={card}>
          <p>Base Service</p>
          <div style={baseRow}>
            <span>House Wash</span>
            <strong>$250</strong>
          </div>
        </section>

        <section style={card}>
          <p>Estimate Modifiers</p>

          <ModifierRow
            label="Heavy Insect Casings"
            value={heavyInsectCasings}
            onChange={setHeavyInsectCasings}
          />

          <ModifierRow
            label="Spider Web Density"
            value={spiderWebDensity}
            onChange={setSpiderWebDensity}
          />

          <ModifierRow
            label="Limited Access"
            value={limitedAccess}
            onChange={setLimitedAccess}
          />
        </section>

        <section style={summaryCard}>
          <div>
            <p style={muted}>Estimated Total</p>
            <strong style={bigNumber}>${totals.price}</strong>
          </div>

          <div>
            <p style={muted}>Added Labor</p>
            <strong style={bigNumber}>{totals.labor} min</strong>
          </div>
        </section>

        <button
          style={primaryButton}
          onClick={() => {
            window.localStorage.setItem(
              "homeServicesEstimate",
              JSON.stringify({
                customer: "Daniel Doyon",
                service: "House Wash",
                address: "4004 se 29th court",
                basePrice,
                estimatedTotal: totals.price,
                addedLabor: totals.labor,
                modifiers: {
                  heavyInsectCasings,
                  spiderWebDensity,
                  limitedAccess,
                },
              })
            );

            const params = new URLSearchParams({
              customer: "Daniel Doyon",
              total: String(totals.price),
              labor: String(totals.labor),
              heavyInsectCasings,
              spiderWebDensity,
              limitedAccess,
            });

            window.location.href =
              "/planet/job-workspace-v3?" + params.toString();
          }}
        >
          Convert To Job
        </button>
      </div>
    </main>
  );
}

function ModifierRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Level;
  onChange: (level: Level) => void;
}) {
  return (
    <div style={modifierBlock}>
      <strong>{label}</strong>

      <div style={levelGrid}>
        {levels.map((level) => {
          const active = value === level;

          return (
            <button
              key={level}
              style={{
                ...levelButton,
                background: active ? "#4ade80" : "#1f2937",
                color: active ? "#07111a" : "#fff",
                borderColor: active
                  ? "rgba(74,222,128,.9)"
                  : "rgba(255,255,255,.1)",
              }}
              onClick={() => onChange(level)}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#07111a",
  color: "#fff",
  padding: "28px",
};

const container: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
};

const kicker: React.CSSProperties = {
  color: "#4ade80",
  fontWeight: 900,
  letterSpacing: ".14em",
};

const title: React.CSSProperties = {
  fontSize: "clamp(48px, 8vw, 72px)",
  margin: "16px 0 18px",
};

const muted: React.CSSProperties = {
  color: "#94a3b8",
};

const card: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 24,
  padding: 28,
  marginTop: 28,
};

const baseRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  fontSize: 24,
};

const modifierBlock: React.CSSProperties = {
  marginTop: 26,
};

const levelGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
  marginTop: 14,
};

const levelButton: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.1)",
  padding: 16,
  fontWeight: 900,
  cursor: "pointer",
};

const summaryCard: React.CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.1)",
  borderRadius: 24,
  padding: 28,
  marginTop: 28,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 18,
};

const bigNumber: React.CSSProperties = {
  fontSize: 38,
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  borderRadius: 18,
  border: 0,
  background: "#4ade80",
  color: "#07111a",
  padding: 20,
  marginTop: 22,
  fontWeight: 900,
  fontSize: 18,
  cursor: "pointer",
};


