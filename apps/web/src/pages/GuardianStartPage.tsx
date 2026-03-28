import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type GuardianPlan = "solo" | "household";
type GuardianProtectionType = "pet" | "child" | "elder" | "medical" | "mixed";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function GuardianStartPage() {
  const nav = useNavigate();
  const query = useQuery();

  const initialPlan =
    query.get("plan") === "solo" || query.get("plan") === "household"
      ? (query.get("plan") as GuardianPlan)
      : "household";

  const [plan, setPlan] = useState<GuardianPlan>(initialPlan);
  const [ownerName, setOwnerName] = useState("");
  const [householdName, setHouseholdName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [protectionType, setProtectionType] =
    useState<GuardianProtectionType>("mixed");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSolo = plan === "solo";

  const page: React.CSSProperties = {
    minHeight: "100vh",
    color: "#e5e7eb",
    background:
      "radial-gradient(1100px 720px at 8% 4%, rgba(34,197,94,0.08), transparent 45%)," +
      "radial-gradient(920px 720px at 100% 2%, rgba(56,189,248,0.10), transparent 42%)," +
      "radial-gradient(1000px 820px at 50% 100%, rgba(59,130,246,0.10), transparent 48%)," +
      "#04070c",
    padding: "20px 14px 28px",
  };

  const shell: React.CSSProperties = {
    maxWidth: 1180,
    margin: "0 auto",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1.08fr",
    gap: 18,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: 24,
    padding: 22,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(2,6,23,0.58))",
    boxShadow:
      "0 24px 80px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.04)",
  };

  const title: React.CSSProperties = {
    fontSize: 38,
    fontWeight: 900,
    lineHeight: 1.02,
    letterSpacing: -1,
    color: "#fff",
    margin: 0,
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    color: "#fff",
    margin: 0,
  };

  const text: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.65,
    color: "rgba(226,232,240,0.88)",
  };

  const label: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(148,163,184,0.92)",
    marginBottom: 6,
  };

  const input: React.CSSProperties = {
    width: "100%",
    borderRadius: 16,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    padding: "14px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const textarea: React.CSSProperties = {
    ...input,
    minHeight: 110,
    resize: "vertical",
    fontFamily: "inherit",
  };

  const planGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  };

  const protectionGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 10,
    marginTop: 10,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!ownerName.trim() || !phone.trim()) {
      alert("Please add at least a name and phone number.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      source: "guardian_start",
      plan,
      ownerName: ownerName.trim(),
      householdName: householdName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      protectionType,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("hp_guardian_start_payload", JSON.stringify(payload));
    } catch {}

    setTimeout(() => {
      const params = new URLSearchParams({
        plan,
        guardian: "1",
        ownerName: ownerName.trim(),
        householdName: householdName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        protectionType,
      });

      nav(`/planet/guardian/activate?${params.toString()}`, {
        state: payload,
      });
    }, 300);
  }

  return (
    <div style={page}>
      <div style={shell}>
        <div style={grid}>
          <div style={card}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "8px 12px",
                border: "1px solid rgba(34,197,94,0.28)",
                background: "rgba(34,197,94,0.10)",
                color: "rgba(187,247,208,1)",
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: 0.5,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "rgba(74,222,128,1)",
                  boxShadow: "0 0 12px rgba(74,222,128,0.8)",
                }}
              />
              GUARDIAN START
            </div>

            <h1 style={title}>
              Start Guardian
              <br />
              right now.
            </h1>

            <div style={{ ...text, marginTop: 12 }}>
              No dead end. No generic creator flow. If someone is already ready,
              this is where we capture them and move them into Guardian.
            </div>

            <div style={{ ...card, marginTop: 18, padding: 18 }}>
              <div style={label}>Selected plan</div>
              <div style={planGrid}>
                {[
                  {
                    key: "solo" as GuardianPlan,
                    price: "$19.95/mo",
                    title: "Solo",
                    desc: "One person, pet, or dependent.",
                  },
                  {
                    key: "household" as GuardianPlan,
                    price: "$39.95/mo",
                    title: "Household",
                    desc: "Full household Guardian.",
                  },
                ].map((item) => {
                  const active = plan === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setPlan(item.key)}
                      style={{
                        textAlign: "left",
                        borderRadius: 18,
                        border: active
                          ? "1px solid rgba(34,197,94,0.34)"
                          : "1px solid rgba(148,163,184,0.18)",
                        background: active
                          ? "linear-gradient(180deg, rgba(34,197,94,0.14), rgba(2,6,23,0.46))"
                          : "rgba(255,255,255,0.03)",
                        color: "#fff",
                        padding: 16,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          color: active
                            ? "rgba(187,247,208,1)"
                            : "rgba(148,163,184,0.9)",
                          letterSpacing: 0.5,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 900,
                          marginTop: 6,
                        }}
                      >
                        {item.price}
                      </div>
                      <div style={{ ...text, marginTop: 8, fontSize: 13 }}>
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ ...card, marginTop: 18, padding: 18 }}>
              <h2 style={sectionTitle}>
                {isSolo ? "Solo protection" : "Household protection"}
              </h2>
              <div style={{ ...text, marginTop: 8 }}>
                {isSolo
                  ? "Best for one pet, one child, one parent, or one person needing a Guardian layer."
                  : "Best for mixed households using Guardian across kids, pets, elderly, and medical context."}
              </div>

              <div style={{ ...label, marginTop: 16 }}>What are you protecting?</div>
              <div style={protectionGrid}>
                {[
                  ["pet", "Pet"],
                  ["child", "Child"],
                  ["elder", "Elder"],
                  ["medical", "Medical"],
                  ["mixed", "Mixed"],
                ].map(([key, textLabel]) => {
                  const active = protectionType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        setProtectionType(key as GuardianProtectionType)
                      }
                      style={{
                        borderRadius: 14,
                        border: active
                          ? "1px solid rgba(34,197,94,0.34)"
                          : "1px solid rgba(148,163,184,0.18)",
                        background: active
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(255,255,255,0.03)",
                        color: active ? "rgba(187,247,208,1)" : "#fff",
                        fontSize: 13,
                        fontWeight: 800,
                        padding: "12px 8px",
                        cursor: "pointer",
                      }}
                    >
                      {textLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <form style={card} onSubmit={handleSubmit}>
            <h2 style={sectionTitle}>Get your Guardian started</h2>
            <div style={{ ...text, marginTop: 8 }}>
              Capture them here, then move them into activation.
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={label}>Owner / contact name</div>
              <input
                style={input}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={label}>Household or account name</div>
              <input
                style={input}
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                placeholder="Doyon household, Bella guardian, etc."
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginTop: 14,
              }}
            >
              <div>
                <div style={label}>Phone</div>
                <input
                  style={input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="5551234567"
                />
              </div>

              <div>
                <div style={label}>Email</div>
                <input
                  style={input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={label}>Notes</div>
              <textarea
                style={textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: child pickup awareness, pet recovery, elderly inactivity support, or mixed household coverage."
              />
            </div>

            <div
              style={{
                marginTop: 18,
                borderRadius: 18,
                border: "1px solid rgba(56,189,248,0.16)",
                background: "rgba(8,47,73,0.18)",
                padding: 14,
              }}
            >
              <div style={label}>What happens next</div>
              <div style={{ ...text, fontSize: 13 }}>
                We lock in the plan, capture the household context, and move you
                into Guardian activation so Presence ID flow and household setup
                can happen without friction.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 18,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => nav("/planet/guardian")}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.18)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "12px 16px",
                  cursor: "pointer",
                }}
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(34,197,94,0.34)",
                  background: "rgba(34,197,94,0.16)",
                  color: "rgba(187,247,208,1)",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "13px 20px",
                  cursor: "pointer",
                  minWidth: 220,
                }}
              >
                {isSubmitting ? "Starting Guardian..." : "Start Guardian"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}