import { useEffect, useMemo, useState } from "react";
import AnchorTestScreen from "./AnchorTestScreen";

/**
 * AppFlow â€” Calm, step-by-step app creation flow
 * v0.1 (HomePlanet Calm Core)
 *
 * Goals:
 * - Calm starter line for non-technical humans
 * - Local-only draft persistence (no backend yet)
 * - "Holy shit" moment: you get a clean app blueprint + starter code block instantly
 */

type Step = 1 | 2 | 3 | 4;

const LS_KEY = "hp_appflow_v1";

type AppDraft = {
  name: string;
  oneLiner: string;
  audience: string;
  features: string;
  blueprint: string;
  updatedAt: number;
};

function safeTrim(s: string) {
  return (s ?? "").trim();
}

function buildBlueprint(input: {
  name: string;
  oneLiner: string;
  audience: string;
  features: string;
}) {
  const name = safeTrim(input.name) || "Untitled App";
  const oneLiner = safeTrim(input.oneLiner) || "A calm app concept.";
  const audience = safeTrim(input.audience) || "General users";
  const features = safeTrim(input.features) || "Feature list coming soon.";

  const featureLines = features
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 10);

  const featureBullets =
    featureLines.length > 0
      ? featureLines.map((f) => `- ${f}`).join("\n")
      : "- (add features)";

  const blueprint = `# ${name}

## One-liner
${oneLiner}

## Audience
${audience}

## Core features
${featureBullets}

## First screen (MVP)
- Simple home screen
- One primary action button
- Calm status + progress indicator

## Data (later)
- Start local
- Add Supabase/DB when stable
`;

  const starterCode = `// Starter skeleton (drop into a React component later)
export type AppSpec = {
  name: string;
  oneLiner: string;
  audience: string;
  features: string[];
};

export const appSpec: AppSpec = {
  name: "${name.replace(/"/g, '\\"')}",
  oneLiner: "${oneLiner.replace(/"/g, '\\"')}",
  audience: "${audience.replace(/"/g, '\\"')}",
  features: ${JSON.stringify(
    featureLines.length ? featureLines : ["(add features)"],
    null,
    2
  )}
};
`;

  return { blueprint, starterCode };
}

export default function AppFlow() {
  // âœ… TEMP: Render AnchorTest while we test it
  // Remove these 2 lines later to return to the builder flow.
  return <AnchorTestScreen />;

  const [step, setStep] = useState<Step>(1);

  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState("");

  const [savedTick, setSavedTick] = useState(false);

  // Load saved local draft (optional)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<AppDraft>;

      if (typeof parsed.name === "string") setName(parsed.name);
      if (typeof parsed.oneLiner === "string") setOneLiner(parsed.oneLiner);
      if (typeof parsed.audience === "string") setAudience(parsed.audience);
      if (typeof parsed.features === "string") setFeatures(parsed.features);

      const hasSetup =
        safeTrim(parsed.name ?? "") &&
        safeTrim(parsed.oneLiner ?? "") &&
        safeTrim(parsed.audience ?? "") &&
        safeTrim(parsed.features ?? "");

      if (hasSetup) setStep(4);
    } catch {
      // ignore
    }
  }, []);

  function pulseSaved() {
    setSavedTick(true);
    window.setTimeout(() => setSavedTick(false), 1600);
  }

  const canStep1 = safeTrim(name).length > 0;
  const canStep2 =
    safeTrim(oneLiner).length > 0 && safeTrim(audience).length > 0;
  const canStep3 = safeTrim(features).length > 0;

  function saveLocal() {
    const { blueprint } = buildBlueprint({ name, oneLiner, audience, features });
    const payload: AppDraft = {
      name,
      oneLiner,
      audience,
      features,
      blueprint,
      updatedAt: Date.now(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    pulseSaved();
  }

  function resetAll() {
    if (!confirm("Reset this app draft? This clears local text too.")) return;
    setName("");
    setOneLiner("");
    setAudience("");
    setFeatures("");
    setStep(1);
    localStorage.removeItem(LS_KEY);
  }

  const { blueprint, starterCode } = useMemo(() => {
    return buildBlueprint({ name, oneLiner, audience, features });
  }, [name, oneLiner, audience, features]);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ marginBottom: 8 }}>Build an App</h2>
      <p style={{ opacity: 0.65, marginBottom: 16 }}>Calm. Clear. Step by step.</p>

      <div style={cardStyle}>
        <div style={stepHeaderStyle}>
          <span style={{ opacity: 0.7 }}>Step {step} of 4</span>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {savedTick && (
              <span style={{ fontSize: 12, opacity: 0.7, whiteSpace: "nowrap" }}>
                Saved OK
              </span>
            )}

            <button style={btnGhostStyle} onClick={saveLocal} title="Save locally on this device">
              Save draft
            </button>
            <button style={btnGhostStyle} onClick={resetAll} title="Clear local draft + start over">
              Reset
            </button>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <label style={labelStyle}>App name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: CalmTasks, QuietNotes, HomePlanet Kids"
              style={inputStyle}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={btnStyle} disabled={!canStep1} onClick={() => setStep(2)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <label style={labelStyle}>One-liner</label>
            <input
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder="What does it do in one sentence?"
              style={inputStyle}
            />

            <label style={labelStyle}>Audience</label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Who is this for?"
              style={inputStyle}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnGhostStyle} onClick={() => setStep(1)}>
                Back
              </button>
              <button style={btnStyle} disabled={!canStep2} onClick={() => setStep(3)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <label style={labelStyle}>Top features (one per line)</label>
            <textarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={`Example:\nLogin\nCreate project\nShare link\nExport PDF`}
              rows={6}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button style={btnGhostStyle} onClick={() => setStep(2)}>
                Back
              </button>
              <button
                style={btnStyle}
                disabled={!canStep3}
                onClick={() => {
                  saveLocal();
                  setStep(4);
                }}
                title="Generate your blueprint"
              >
                Generate blueprint
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <div style={miniMetaStyle}>
              <div>
                <div style={miniKeyStyle}>Name</div>
                <div style={miniValStyle}>{safeTrim(name) || "â€”"}</div>
              </div>
              <div>
                <div style={miniKeyStyle}>Audience</div>
                <div style={miniValStyle}>{safeTrim(audience) || "â€”"}</div>
              </div>
              <div>
                <div style={miniKeyStyle}>Mode</div>
                <div style={miniValStyle}>Local draft</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Blueprint</label>
              <textarea
                value={blueprint}
                readOnly
                rows={12}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
              />

              <p style={{ marginTop: 10, opacity: 0.6, fontSize: 12, lineHeight: 1.4 }}>
                You are not shipping yet. You are building clarity.
              </p>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={labelStyle}>Starter code (copy later)</label>
              <textarea
                value={starterCode}
                readOnly
                rows={10}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={btnGhostStyle} onClick={() => setStep(3)}>
                Back
              </button>

              <button style={btnStyle} onClick={() => saveLocal()} title="Saves only to this device (localStorage)">
                Save
              </button>

              <span style={{ marginLeft: "auto", opacity: 0.55, fontSize: 12 }}>
                Local-only for now. Backend comes later.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- styles ---------------- */

const cardStyle: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 16,
  boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
};

const stepHeaderStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  pointerEvents: "none",
  pointerEvents: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
  paddingBottom: 10,
  background: "rgba(0,0,0,0.35)",
  backdropFilter: "blur(6px)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 13,
  opacity: 0.85,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  marginBottom: 16,
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  cursor: "pointer",
};

const btnGhostStyle: React.CSSProperties = {
  ...btnStyle,
  background: "transparent",
  opacity: 0.85,
};

const miniMetaStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  gap: 12,
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const miniKeyStyle: React.CSSProperties = {
  fontSize: 11,
  opacity: 0.6,
  letterSpacing: 0.4,
  marginBottom: 2,
};

const miniValStyle: React.CSSProperties = {
  fontSize: 13,
  opacity: 0.92,
};



