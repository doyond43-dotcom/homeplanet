import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type GuardianPlan = "solo" | "household";
type GuardianProtectionType = "pet" | "child" | "elder" | "medical" | "mixed";

type GuardianActivationPayload = {
  source?: string;
  plan: GuardianPlan;
  ownerName: string;
  householdName: string;
  phone: string;
  email: string;
  protectionType: GuardianProtectionType;
  notes?: string;
  createdAt?: string;
  presenceId?: string;
  activationStatus?: "pending" | "submitted";
};

type GuardianActivationRecord = GuardianActivationPayload & {
  presenceId: string;
  activationStatus: "pending";
  submittedAt: string;
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function generatePresenceId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "HP-GDN-";

  for (let i = 0; i < 6; i += 1) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return id;
}

export default function GuardianActivationPage() {
  const nav = useNavigate();
  const location = useLocation();
  const query = useQuery();

  const statePayload =
    location.state && typeof location.state === "object"
      ? (location.state as Partial<GuardianActivationPayload>)
      : null;

  const [submittedVisual, setSubmittedVisual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fallbackPlan =
    query.get("plan") === "solo" || query.get("plan") === "household"
      ? (query.get("plan") as GuardianPlan)
      : "household";

  const fallbackProtectionType =
    query.get("protectionType") === "pet" ||
    query.get("protectionType") === "child" ||
    query.get("protectionType") === "elder" ||
    query.get("protectionType") === "medical" ||
    query.get("protectionType") === "mixed"
      ? (query.get("protectionType") as GuardianProtectionType)
      : "mixed";

  const [payload, setPayload] = useState<GuardianActivationPayload>({
    plan: fallbackPlan,
    ownerName: query.get("ownerName") || "",
    householdName: query.get("householdName") || "",
    phone: query.get("phone") || "",
    email: query.get("email") || "",
    protectionType: fallbackProtectionType,
    notes: query.get("notes") || "",
    source: "guardian_start",
    presenceId: "",
    activationStatus: "pending",
  });

  useEffect(() => {
    if (statePayload) {
      setPayload((prev) => ({
        ...prev,
        ...statePayload,
        plan:
          statePayload.plan === "solo" || statePayload.plan === "household"
            ? statePayload.plan
            : prev.plan,
        protectionType:
          statePayload.protectionType === "pet" ||
          statePayload.protectionType === "child" ||
          statePayload.protectionType === "elder" ||
          statePayload.protectionType === "medical" ||
          statePayload.protectionType === "mixed"
            ? statePayload.protectionType
            : prev.protectionType,
      }));

      if (statePayload.presenceId) {
        setSubmittedVisual(true);
      }

      return;
    }

    try {
      const activationRaw = localStorage.getItem("hp_guardian_activation_record");
      if (activationRaw) {
        const activationRecord = JSON.parse(activationRaw) as Partial<GuardianActivationRecord>;

        setPayload((prev) => ({
          ...prev,
          ...activationRecord,
          plan:
            activationRecord.plan === "solo" || activationRecord.plan === "household"
              ? activationRecord.plan
              : prev.plan,
          protectionType:
            activationRecord.protectionType === "pet" ||
            activationRecord.protectionType === "child" ||
            activationRecord.protectionType === "elder" ||
            activationRecord.protectionType === "medical" ||
            activationRecord.protectionType === "mixed"
              ? activationRecord.protectionType
              : prev.protectionType,
        }));

        if (activationRecord.presenceId) {
          setSubmittedVisual(true);
        }

        return;
      }
    } catch {
      // fall through to start payload
    }

    try {
      const raw = localStorage.getItem("hp_guardian_start_payload");
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<GuardianActivationPayload>;
      setPayload((prev) => ({
        ...prev,
        ...parsed,
        plan:
          parsed.plan === "solo" || parsed.plan === "household"
            ? parsed.plan
            : prev.plan,
        protectionType:
          parsed.protectionType === "pet" ||
          parsed.protectionType === "child" ||
          parsed.protectionType === "elder" ||
          parsed.protectionType === "medical" ||
          parsed.protectionType === "mixed"
            ? parsed.protectionType
            : prev.protectionType,
      }));
    } catch {
      // keep current fallback payload
    }
  }, [statePayload]);

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
    gridTemplateColumns: "1.04fr 0.96fr",
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

  const sectionTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    color: "#fff",
    margin: 0,
  };

  const title: React.CSSProperties = {
    fontSize: 38,
    fontWeight: 900,
    lineHeight: 1.02,
    letterSpacing: -1,
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

  const infoGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  };

  const infoCard: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(255,255,255,0.03)",
    padding: 16,
  };

  const statusRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  };

  const capturedStatus: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(34,197,94,0.28)",
    background: "rgba(34,197,94,0.10)",
    padding: 16,
  };

  const pendingStatus: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(56,189,248,0.22)",
    background: "rgba(8,47,73,0.22)",
    padding: 16,
  };

  const planLabel = payload.plan === "solo" ? "Solo" : "Household";

  const protectionLabel =
    payload.protectionType === "pet"
      ? "Pet"
      : payload.protectionType === "child"
      ? "Child"
      : payload.protectionType === "elder"
      ? "Elder"
      : payload.protectionType === "medical"
      ? "Medical"
      : "Mixed";

  function buildHouseholdPath() {
    const params = new URLSearchParams({
      plan: payload.plan,
      guardian: "1",
      ownerName: payload.ownerName || "",
      householdName: payload.householdName || "",
      phone: payload.phone || "",
      email: payload.email || "",
      protectionType: payload.protectionType,
      presenceId: payload.presenceId || "",
      activationStatus: payload.activationStatus || "pending",
    });

    return `/planet/guardian-household?${params.toString()}`;
  }

  function handleEnterDemo() {
    nav(buildHouseholdPath());
  }

  async function handleSubmitActivation() {
    if (submittedVisual && payload.presenceId) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const presenceId = payload.presenceId || generatePresenceId();

      const activationRecord: GuardianActivationRecord = {
        ...payload,
        presenceId,
        activationStatus: "pending",
        submittedAt: new Date().toISOString(),
      };

      const { error } = await supabase.from("guardian_activations").insert({
        presence_id: activationRecord.presenceId,
        source: activationRecord.source || "guardian_start",
        plan: activationRecord.plan,
        owner_name: activationRecord.ownerName,
        household_name: activationRecord.householdName,
        phone: activationRecord.phone,
        email: activationRecord.email,
        protection_type: activationRecord.protectionType,
        notes: activationRecord.notes || "",
        activation_status: activationRecord.activationStatus,
        created_at: activationRecord.createdAt || new Date().toISOString(),
        submitted_at: activationRecord.submittedAt,
      });

      if (error) {
        throw error;
      }

      try {
        localStorage.setItem(
          "hp_guardian_activation_record",
          JSON.stringify(activationRecord)
        );
      } catch {
        // ignore local storage failure
      }

      setPayload((prev) => ({
        ...prev,
        presenceId,
        activationStatus: "pending",
      }));

      setSubmittedVisual(true);
    } catch (error: any) {
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Activation submit failed.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
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
                border: "1px solid rgba(56,189,248,0.28)",
                background: "rgba(56,189,248,0.10)",
                color: "rgba(186,230,253,1)",
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
                  background: "rgba(56,189,248,1)",
                  boxShadow: "0 0 12px rgba(56,189,248,0.8)",
                }}
              />
              GUARDIAN ACTIVATION
            </div>

            <h1 style={title}>
              Activation
              <br />
              ready to review.
            </h1>

            <div style={{ ...text, marginTop: 12 }}>
              The Guardian request is captured, staged, and ready to move
              forward without losing the household context.
            </div>

            <div style={statusRow}>
              <div style={capturedStatus}>
                <div style={label}>Status</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: "rgba(74,222,128,1)",
                      boxShadow: "0 0 14px rgba(74,222,128,0.8)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    Captured
                  </div>
                </div>
              </div>

              <div style={pendingStatus}>
                <div style={label}>Status</div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: "rgba(56,189,248,1)",
                      boxShadow: "0 0 14px rgba(56,189,248,0.7)",
                    }}
                  />
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    Activation pending
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...card, marginTop: 18, padding: 18 }}>
              <h2 style={sectionTitle}>Captured Guardian details</h2>

              <div style={infoGrid}>
                <div style={infoCard}>
                  <div style={label}>Selected plan</div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: 900,
                    }}
                  >
                    {planLabel}
                  </div>
                </div>

                <div style={infoCard}>
                  <div style={label}>Protection type</div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 20,
                      fontWeight: 900,
                    }}
                  >
                    {protectionLabel}
                  </div>
                </div>

                <div style={infoCard}>
                  <div style={label}>Owner name</div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {payload.ownerName || "—"}
                  </div>
                </div>

                <div style={infoCard}>
                  <div style={label}>Household name</div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {payload.householdName || "—"}
                  </div>
                </div>

                <div style={infoCard}>
                  <div style={label}>Contact phone</div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {payload.phone || "—"}
                  </div>
                </div>

                <div style={infoCard}>
                  <div style={label}>Contact email</div>
                  <div
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {payload.email || "—"}
                  </div>
                </div>
              </div>

              {payload.notes ? (
                <div
                  style={{
                    marginTop: 14,
                    borderRadius: 18,
                    border: "1px solid rgba(148,163,184,0.16)",
                    background: "rgba(255,255,255,0.03)",
                    padding: 16,
                  }}
                >
                  <div style={label}>Notes</div>
                  <div style={{ ...text, marginTop: 4 }}>{payload.notes}</div>
                </div>
              ) : null}
            </div>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Next move</h2>
            <div style={{ ...text, marginTop: 8 }}>
              You can enter the Guardian household demo immediately, or submit
              the activation request and mint the Presence ID now.
            </div>

            <div style={{ ...card, marginTop: 18, padding: 18 }}>
              <div style={label}>Activation checkpoint</div>
              <div style={{ ...text, fontSize: 13 }}>
                Captured data is being held in flow so the household can move
                into Guardian without dropping the plan, owner, contact, or
                protection type.
              </div>
            </div>

            {submittedVisual ? (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(34,197,94,0.28)",
                  background: "rgba(34,197,94,0.10)",
                  padding: 16,
                }}
              >
                <div style={label}>Activation request</div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 18,
                  }}
                >
                  Activation recorded
                </div>

                <div style={{ ...text, marginTop: 8, fontSize: 13 }}>
                  Presence-aware activation has been saved and is ready across
                  Guardian flow.
                </div>

                {payload.presenceId ? (
                  <div style={{ marginTop: 12 }}>
                    <div style={label}>Presence ID</div>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 20,
                        letterSpacing: 0.6,
                      }}
                    >
                      {payload.presenceId}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {submitError ? (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(248,113,113,0.28)",
                  background: "rgba(127,29,29,0.24)",
                  padding: 16,
                  color: "#fecaca",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {submitError}
              </div>
            ) : null}

            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 22,
              }}
            >
              <button
                type="button"
                onClick={handleEnterDemo}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(34,197,94,0.34)",
                  background: "rgba(34,197,94,0.16)",
                  color: "rgba(187,247,208,1)",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "14px 20px",
                  cursor: "pointer",
                }}
              >
                Enter Guardian Demo
              </button>

              <button
                type="button"
                onClick={handleSubmitActivation}
                disabled={isSubmitting || (submittedVisual && Boolean(payload.presenceId))}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(56,189,248,0.24)",
                  background:
                    submittedVisual && payload.presenceId
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(56,189,248,0.10)",
                  color:
                    submittedVisual && payload.presenceId
                      ? "rgba(187,247,208,1)"
                      : "rgba(186,230,253,1)",
                  fontWeight: 900,
                  fontSize: 14,
                  padding: "14px 20px",
                  cursor:
                    isSubmitting || (submittedVisual && payload.presenceId)
                      ? "default"
                      : "pointer",
                  opacity:
                    isSubmitting || (submittedVisual && payload.presenceId) ? 0.95 : 1,
                }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : submittedVisual && payload.presenceId
                  ? "Activation Submitted"
                  : "Submit Activation Request"}
              </button>

              <button
                type="button"
                onClick={() => nav("/planet/guardian/start")}
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
                Back to Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}