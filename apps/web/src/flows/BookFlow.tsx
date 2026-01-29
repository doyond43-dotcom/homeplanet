import { useEffect, useMemo, useState } from "react";
import { calmSection, calmSurface, calmWrap } from "../ui/calmShell";

/**
 * BookFlow â€” Calm, step-by-step book creation flow
 * v0.2.1 (HomePlanet Calm Core)
 *
 * Goals:
 * - No backend writes yet
 * - Calm, obvious navigation
 * - Real "Begin writing" step (no alert)
 * - Draft persists locally (localStorage) so users donâ€™t lose work
 */

type Step = 1 | 2 | 3 | 4;

const LS_KEY = "hp_bookflow_v1";

type BookDraft = {
  title: string;
  author: string;
  intent: string;
  draft: string;
  updatedAt: number;
};

export default function BookFlow() {
  const [step, setStep] = useState<Step>(1);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [intent, setIntent] = useState("");
  const [draft, setDraft] = useState("");

  // Calm, non-invasive save feedback (no alerts)
  const [savedTick, setSavedTick] = useState(false);

  // Load any saved local draft (optional but helpful)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<BookDraft>;
      if (typeof parsed.title === "string") setTitle(parsed.title);
      if (typeof parsed.author === "string") setAuthor(parsed.author);
      if (typeof parsed.intent === "string") setIntent(parsed.intent);
      if (typeof parsed.draft === "string") setDraft(parsed.draft);

      // If they already had meaningful content, start them on writing
      const hasSetup =
        (parsed.title ?? "").trim() &&
        (parsed.author ?? "").trim() &&
        (parsed.intent ?? "").trim();
      if (hasSetup) setStep(4);
    } catch {
      // ignore
    }
  }, []);

  const wordCount = useMemo(() => {
    const t = draft.trim();
    if (!t) return 0;
    return t.split(/\s+/).filter(Boolean).length;
  }, [draft]);

  const canStep1 = title.trim().length > 0;
  const canStep2 = author.trim().length > 0;
  const canStep3 = intent.trim().length > 0;

  function pulseSaved() {
    setSavedTick(true);
    window.setTimeout(() => setSavedTick(false), 1600);
  }

  function saveLocal() {
    const payload: BookDraft = {
      title,
      author,
      intent,
      draft,
      updatedAt: Date.now(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
    pulseSaved();
  }

  function resetAll() {
    if (!confirm("Reset this book draft? This clears local draft text too.")) return;
    setTitle("");
    setAuthor("");
    setIntent("");
    setDraft("");
    setStep(1);
    localStorage.removeItem(LS_KEY);
  }

  return (
    <div style={calmWrap}>
      <div style={calmSurface}>
        <h2 style={{ marginBottom: 8 }}>Write a Book</h2>
        <p style={{ opacity: 0.65, marginBottom: 16 }}>Calm. Private. Step by step.</p>

        {/* Calm section container (same standard as AnchorTest) */}
        <div style={calmSection}>
          <div style={stepHeaderStyle}>
            <span style={{ opacity: 0.7 }}>Step {step} of 4</span>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {savedTick && (
                <span style={{ fontSize: 12, opacity: 0.7, whiteSpace: "nowrap" }}>
                  Saved âœ…
                </span>
              )}

              <button style={btnGhostStyle} onClick={saveLocal} title="Save locally on this device">
                Save draft
              </button>
              <button
                style={btnGhostStyle}
                onClick={resetAll}
                title="Clear local draft + start over"
              >
                Reset
              </button>
            </div>
          </div>

          {/* STEP 1 â€” Title */}
          {step === 1 && (
            <div>
              <label style={labelStyle}>Book title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled (you can change this later)"
                style={inputStyle}
              />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={btnStyle} disabled={!canStep1} onClick={() => setStep(2)}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 â€” Author */}
          {step === 2 && (
            <div>
              <label style={labelStyle}>Author name</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name (or pen name)"
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

          {/* STEP 3 â€” Intent */}
          {step === 3 && (
            <div>
              <label style={labelStyle}>What is this book for?</label>
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="Why are you writing this?"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
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
                  title="Move into the writing screen"
                >
                  Begin writing
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 â€” Writing */}
          {step === 4 && (
            <div>
              <div style={miniMetaStyle}>
                <div>
                  <div style={miniKeyStyle}>Title</div>
                  <div style={miniValStyle}>{title || "â€”"}</div>
                </div>
                <div>
                  <div style={miniKeyStyle}>Author</div>
                  <div style={miniValStyle}>{author || "â€”"}</div>
                </div>
                <div>
                  <div style={miniKeyStyle}>Words</div>
                  <div style={miniValStyle}>{wordCount}</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={labelStyle}>Draft</label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Start writing. No pressure. One paragraph at a time."
                  rows={12}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
                />

                {/* Step B: subtle reassurance line */}
                <p style={{ marginTop: 10, opacity: 0.6, fontSize: 12, lineHeight: 1.4 }}>
                  You are not publishing yet. You are preparing something real.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button style={btnGhostStyle} onClick={() => setStep(3)}>
                  Back
                </button>

                <button
                  style={btnStyle}
                  onClick={() => saveLocal()}
                  title="Saves only to this device (localStorage)"
                >
                  Save
                </button>

                <span style={{ marginLeft: "auto", opacity: 0.55, fontSize: 12 }}>
                  Local-only for now. Backend comes later.
                </span>
              </div>

              <div style={intentBoxStyle}>
                <b>Intent:</b> <span style={{ opacity: 0.9 }}>{intent || "â€”"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* Styles (local, calm, no dependency on App.css)     */
/* -------------------------------------------------- */

const stepHeaderStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  pointerEvents: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
  paddingBottom: 10,

  // This prevents the header from becoming â€œunclickableâ€ due to overlap
  background: "rgba(0,0,0,0.25)",
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

const intentBoxStyle: React.CSSProperties = {
  marginTop: 10,
  opacity: 0.65,
  fontSize: 13,
  lineHeight: 1.45,
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};


