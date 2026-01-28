import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import RecordPaymentPanel from "../components/RecordPaymentPanel";
/**
 * AuthorFlow — Calm writing + explicit handle generation (user-controlled)
 * v0.2 (adds Recommend Move vs Apply Move + basic stitching)
 *
 * What this adds:
 * - "Scan for handles" produces Suggestions
 * - Each Suggestion can be:
 *    1) Added as Handle
 *    2) Recommend move (shows suggested placement + lets user choose target)
 *    3) Apply move (actually moves text + stitches the draft cleanly)
 *
 * Still calm:
 * - Nothing moves unless the user clicks "Apply move"
 */

type Handle = {
  id: string;
  label: string;
  kind: "manual" | "generated";
  createdAt: number;
};

type MoveTarget = "opening" | "ending";

type Suggestion = {
  id: string;
  display: string; // what user sees
  source: string; // what we actually move/remove from the draft (best-effort)
  recommended: MoveTarget;
  target: MoveTarget; // user-chosen (defaults to recommended)
};

function safeTrim(s: string) {
  return (s ?? "").trim();
}

function normalize(s: string) {
  return safeTrim(s).replace(/\s+/g, " ").toLowerCase();
}

function makeId() {
  const c: any = typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;
  return c?.randomUUID?.() ?? `h_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function softCleanNewlines(s: string) {
  // Normalizes excessive blank lines but keeps paragraph breaks
  return (s ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function recommendTarget(text: string): MoveTarget {
  const t = normalize(text);
  // simple, deterministic heuristics for now
  if (/\b(must|always|never|proof|origin|presence|first|before)\b/.test(t)) return "opening";
  if (/\b(therefore|so|in conclusion|ultimately|end|closing|summary)\b/.test(t)) return "ending";
  return "ending";
}

/**
 * Extractor returns objects so we can keep both:
 * - display (may be shortened with …)
 * - source (full snippet we try to find/remove from draft)
 */
function extractSuggestionsFromDraft(draft: string): Array<{ source: string; display: string }> {
  const text = safeTrim(draft);
  if (!text) return [];

  const parts = text
    .replace(/\r\n/g, "\n")
    .split(/[\n]+|[.?!]+/g)
    .map((p) => p.trim())
    .filter(Boolean);

  const out: Array<{ source: string; display: string }> = [];

  for (const p of parts) {
    const cleaned = p.replace(/^[-*\u2022\d)+\]]+\s*/g, "").trim();
    if (!cleaned) continue;

    const words = cleaned.split(/\s+/).filter(Boolean);
    if (words.length === 0) continue;

    // Standalone sweet spot
    if (words.length >= 5 && words.length <= 12) {
      out.push({ source: cleaned, display: cleaned });
      continue;
    }

    // Longer line: keep a compact display, but preserve full source
    if (words.length > 12) {
      const display = words.slice(0, 9).join(" ") + "…";
      out.push({ source: cleaned, display });
      continue;
    }
  }

  // De-dup preserving order, max 6
  const seen = new Set<string>();
  const uniq: Array<{ source: string; display: string }> = [];
  for (const item of out) {
    const key = normalize(item.source);
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.push(item);
    if (uniq.length >= 6) break;
  }

  return uniq;
}

/**
 * Remove ONE occurrence of `needle` from `haystack`, with gentle stitching.
 * Best-effort:
 * 1) Exact substring match
 * 2) Match on normalized line basis
 */
function removeOnce(haystack: string, needle: string): { ok: boolean; next: string } {
  const h = haystack ?? "";
  const n = needle ?? "";

  if (!safeTrim(h) || !safeTrim(n)) return { ok: false, next: haystack };

  // 1) exact
  const idx = h.indexOf(n);
  if (idx >= 0) {
    const before = h.slice(0, idx);
    const after = h.slice(idx + n.length);
    const stitched = softCleanNewlines((before + after).replace(/[ \t]{2,}/g, " "));
    return { ok: true, next: stitched + (stitched ? "\n" : "") };
  }

  // 2) line-based normalize match
  const lines = h.replace(/\r\n/g, "\n").split("\n");
  const targetKey = normalize(n);
  let removed = false;

  const nextLines = lines.filter((line) => {
    if (removed) return true;
    if (normalize(line) === targetKey) {
      removed = true;
      return false;
    }
    return true;
  });

  if (removed) {
    const stitched = softCleanNewlines(nextLines.join("\n"));
    return { ok: true, next: stitched + (stitched ? "\n" : "") };
  }

  return { ok: false, next: haystack };
}

function insertAtTarget(draft: string, snippet: string, target: MoveTarget): string {
  const d = softCleanNewlines(draft ?? "");
  const s = softCleanNewlines(snippet ?? "");

  if (!s) return draft;
  if (!d) return s + "\n";

  if (target === "opening") {
    return softCleanNewlines(`${s}\n\n${d}`) + "\n";
  }

  // ending
  return softCleanNewlines(`${d}\n\n${s}`) + "\n";
}

export default function AuthorFlow() {
  const [draft, setDraft] = useState("");

  // Handles (confirmed list)
  const [handles, setHandles] = useState<Handle[]>([]);

  // Suggestions drawer
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Tiny UX: when user clicks "Recommend move", we show a calm hint line
  const [lastRecommended, setLastRecommended] = useState<{ id: string; when: number } | null>(null);

  const handleKeys = useMemo(() => new Set(handles.map((h) => normalize(h.label))), [handles]);

  function addManualHandle(label: string) {
    const v = safeTrim(label);
    if (!v) return;
    const key = normalize(v);
    if (handleKeys.has(key)) return;

    setHandles((prev) => [...prev, { id: makeId(), label: v, kind: "manual", createdAt: Date.now() }]);
  }

  function scanForHandles() {
    const found = extractSuggestionsFromDraft(draft);

    const next: Suggestion[] = found
      .filter((x) => !handleKeys.has(normalize(x.source)))
      .map((x) => {
        const rec = recommendTarget(x.source);
        return {
          id: makeId(),
          source: x.source,
          display: x.display,
          recommended: rec,
          target: rec,
        };
      });

    setSuggestions(next);
    setShowSuggestions(true);
    setLastRecommended(null);
  }

  function acceptSuggestionAsHandle(s: Suggestion) {
    const key = normalize(s.source);
    if (!safeTrim(s.source) || handleKeys.has(key)) return;

    setHandles((prev) => [
      ...prev,
      { id: makeId(), label: s.source, kind: "generated", createdAt: Date.now() },
    ]);

    setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
  }

  function dismissSuggestion(id: string) {
    setSuggestions((prev) => prev.filter((x) => x.id !== id));
  }

  function setSuggestionTarget(id: string, target: MoveTarget) {
    setSuggestions((prev) => prev.map((x) => (x.id === id ? { ...x, target } : x)));
  }

  function recommendMove(id: string) {
    // Does NOT change the draft.
    setLastRecommended({ id, when: Date.now() });
  }

  function applyMove(id: string) {
    const s = suggestions.find((x) => x.id === id);
    if (!s) return;

    // 1) remove from current draft (best-effort)
    const removed = removeOnce(draft, s.source);

    // 2) insert at chosen target
    const nextDraft = insertAtTarget(removed.next, s.source, s.target);
    setDraft(nextDraft);

    // keep the handle as a “structural marker”
    const key = normalize(s.source);
    if (!handleKeys.has(key)) {
      setHandles((prev) => [
        ...prev,
        { id: makeId(), label: s.source, kind: "generated", createdAt: Date.now() },
      ]);
    }

    // remove the suggestion (it’s been acted on)
    setSuggestions((prev) => prev.filter((x) => x.id !== id));
    setLastRecommended(null);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <h2 style={{ marginBottom: 6 }}>Write</h2>
      <p style={{ opacity: 0.65, marginBottom: 14 }}>
        Write freely. When you're ready, scan for handles.
      </p>

      {/* Handles panel */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Handles</div>

        {handles.length === 0 && <div style={mutedStyle}>No handles yet.</div>}

        {handles.length > 0 && (
          <div style={{ display: "grid", gap: 8 }}>
            {handles.map((h) => (
              <div key={h.id} style={handleRowStyle}>
                <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                  {h.kind === "generated" ? "✨ " : ""}
                  {h.label}
                </span>
                <span style={{ fontSize: 12, opacity: 0.55, whiteSpace: "nowrap" }}>
                  {h.kind === "generated" ? "added" : "manual"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Draft + Scan */}
      <div style={{ ...cardStyle, marginTop: 14 }}>
        <label style={labelStyle}>Draft</label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write. Nothing is moved automatically."
          rows={10}
          style={textareaStyle}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12, opacity: 0.55 }}>
            Nothing is moved automatically. You stay in control.
          </span>

          <button
            type="button"
            style={btn}
            onClick={scanForHandles}
            disabled={safeTrim(draft).length < 12}
            title="Extract key lines from your draft"
          >
            Scan for handles
          </button>

          <RecordPaymentPanel />
        </div>

        {/* Suggestions drawer */}
        {showSuggestions && (
          <div style={{ marginTop: 12 }}>
            <div style={sectionTitleStyle}>
              Suggestions{suggestions.length ? ` (${suggestions.length})` : ""}
            </div>

            {suggestions.length === 0 ? (
              <div style={{ fontSize: 13, opacity: 0.6 }}>
                No suggestions right now. Try shorter standalone sentences (5–12 words) or add a manual handle.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {suggestions.map((s) => {
                  const showHint = lastRecommended?.id === s.id && Date.now() - lastRecommended.when < 8000;
                  return (
                    <div key={s.id} style={suggestCardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ minWidth: 0, overflowWrap: "anywhere", fontSize: 13 }}>{s.display}</span>
                        <span style={{ fontSize: 12, opacity: 0.55, whiteSpace: "nowrap" }}>
                          rec: {s.recommended === "opening" ? "Opening" : "Ending"}
                        </span>
                      </div>

                      {showHint && (
                        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.65 }}>
                          Recommendation: place this at the{" "}
                          <b>{s.recommended === "opening" ? "opening" : "ending"}</b>. (No changes made.)
                        </div>
                      )}

                      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <button type="button" style={btnGhost} onClick={() => acceptSuggestionAsHandle(s)}>
                          Add as Handle
                        </button>

                        <button
                          type="button"
                          style={btnGhost}
                          onClick={() => recommendMove(s.id)}
                          title="Shows where it should go (no changes yet)"
                        >
                          Recommend move
                        </button>

                        <span style={{ fontSize: 12, opacity: 0.6 }}>Target</span>
                        <select
                          value={s.target}
                          onChange={(e) => setSuggestionTarget(s.id, e.target.value as MoveTarget)}
                          style={selectStyle}
                          title="Where should it go?"
                        >
                          <option value="opening">Opening</option>
                          <option value="ending">Ending</option>
                        </select>

                        <button
                          type="button"
                          style={btn}
                          onClick={() => applyMove(s.id)}
                          title="Moves the text and stitches the draft"
                        >
                          Apply move
                        </button>

                        <button type="button" style={btnGhost} onClick={() => dismissSuggestion(s.id)}>
                          Dismiss
                        </button>
                      </div>

                      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.6, lineHeight: 1.4 }}>
                        Applying will remove this line from its current spot (best-effort) and reinsert it at the{" "}
                        <b>{s.target === "opening" ? "opening" : "ending"}</b>.
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
              <button type="button" style={btnGhost} onClick={() => setShowSuggestions(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Manual add */}
      <div style={{ ...cardStyle, marginTop: 14 }}>
        <div style={sectionTitleStyle}>Add a handle</div>
        <ManualAdd onAdd={addManualHandle} />
      </div>
    </div>
  );
}

function ManualAdd({ onAdd }: { onAdd: (label: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="New handle…"
        style={inputStyle}
      />
      <button
        type="button"
        style={btn}
        onClick={() => {
          const v = value.trim();
          if (!v) return;
          onAdd(v);
          setValue("");
        }}
      >
        Add
      </button>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const cardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.35)",
  padding: 14,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.65,
  marginBottom: 8,
  letterSpacing: 0.4,
};

const mutedStyle: CSSProperties = {
  fontSize: 13,
  opacity: 0.55,
};

const handleRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: 10,
  padding: "10px 10px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  fontSize: 13,
};

const suggestCardStyle: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 12,
  opacity: 0.7,
  marginBottom: 6,
};

const textareaStyle: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: 10,
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: 1.5,
  marginBottom: 12,
};

const inputStyle: CSSProperties = {
  flex: 1,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "8px 10px",
  boxSizing: "border-box",
};

const selectStyle: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
  outline: "none",
};

const btn: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.15)",
  color: "#fff",
  cursor: "pointer",
};

const btnGhost: CSSProperties = {
  ...btn,
  background: "transparent",
  opacity: 0.82,
};




