import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { supabase } from "../lib/supabaseClient";

type PaymentMethod = "cash" | "card" | "zelle" | "venmo" | "paypal" | "other";

type PaymentEventRow = {
  id: string;
  user_id: string;
  created_at: string; // timestamptz
  amount: string;
  who: string;
  for_what: string;
  method: PaymentMethod;
  notes: string | null;
};

function safeTrim(v: string) {
  return (v ?? "").trim();
}

function normalizeSpaces(s: string) {
  return safeTrim(s).replace(/\s+/g, " ");
}

function formatLocalFromIso(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// Title Case-ish, but keeps common acronyms reasonable
function titleCaseWords(input: string) {
  const s = normalizeSpaces(input);
  if (!s) return s;

  const keepUpper = new Set(["AC", "A/C", "VIN", "OEM", "ABS"]);
  return s
    .split(" ")
    .map((w) => {
      const raw = w.trim();
      if (!raw) return raw;

      const upper = raw.toUpperCase();
      if (keepUpper.has(upper)) return upper;

      // preserve tokens like "A/C"
      if (raw.includes("/")) {
        return raw
          .split("/")
          .map((p) => (p ? p[0].toUpperCase() + p.slice(1).toLowerCase() : p))
          .join("/");
      }

      return raw[0].toUpperCase() + raw.slice(1).toLowerCase();
    })
    .join(" ");
}

// Amount helpers
function parseAmountLoose(v: string): number | null {
  const s = (v ?? "").replace(/[^0-9.]/g, "");
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}

function formatMoney(n: number) {
  // always 2 decimals
  return `$${n.toFixed(2)}`;
}

function normalizeAmountInput(v: string) {
  // allow typing freely, but keep it clean-ish
  return v.replace(/[^\d.$]/g, "");
}

function buildForWhatSummary(items: string[]) {
  // Compact, human-readable summary for the single for_what column
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  // join with " ”¢ " so it reads nice in the event list
  return items.join(" ”¢ ");
}

function buildNotesBlob(lineItems: string[], extraNotes: string) {
  const items = lineItems.map((x) => `- ${x}`).join("\n");
  const extra = safeTrim(extraNotes);

  const parts: string[] = [];
  if (lineItems.length) {
    parts.push("Line items:");
    parts.push(items);
  }
  if (extra) {
    if (parts.length) parts.push("");
    parts.push("Notes:");
    parts.push(extra);
  }

  return parts.length ? parts.join("\n") : null;
}

function buildBinderText(e: Pick<PaymentEventRow, "created_at" | "amount" | "who" | "for_what" | "method" | "notes">) {
  return [
    "HOMEPLANET — PAYMENT EVENT",
    "",
    `Timestamp (local): ${formatLocalFromIso(e.created_at)}`,
    `Timestamp (epoch ms): ${new Date(e.created_at).getTime()}`,
    "",
    `Amount: ${e.amount}`,
    `From: ${e.who}`,
    `For: ${e.for_what}`,
    `Method: ${e.method}`,
    e.notes ? `Notes:\n${e.notes}` : "",
    "",
    "Presence-first record:",
    "This payment was recorded inside HomePlanet at the moment of capture.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Binder artifact text copied.");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    alert("Binder artifact text copied.");
  }
}

/** Quick chips tuned for mechanic flow */
const BASE_CHIPS: Array<{ label: string; value: string }> = [
  { label: "Front", value: "Front" },
  { label: "Rear", value: "Rear" },
  { label: "Driver", value: "Driver" },
  { label: "Passenger", value: "Passenger" },

  { label: "Brakes", value: "Brakes" },
  { label: "Pads + Rotors", value: "Pads & Rotors" },
  { label: "Caliper", value: "Caliper" },

  { label: "A/C", value: "A/C" },
  { label: "Compressor", value: "Compressor" },
  { label: "Recharge", value: "Recharge" },
  { label: "Leak check", value: "Leak Check" },
];

function includesWordish(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

export default function RecordPaymentPanel() {
  const [amount, setAmount] = useState("$0.00");
  const [who, setWho] = useState("");
  const [lineItemDraft, setLineItemDraft] = useState("");
  const [lineItems, setLineItems] = useState<string[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [events, setEvents] = useState<PaymentEventRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const computedForWhat = useMemo(() => buildForWhatSummary(lineItems), [lineItems]);

  const canSave = useMemo(() => {
    const amtOk = parseAmountLoose(amount);
    return !!(amtOk && amtOk > 0 && safeTrim(who) && (lineItems.length > 0) && userId && !saving);
  }, [amount, who, lineItems, userId, saving]);

  // Dynamic smart chips:
  // If Compressor exists but Recharge doesn't, we promote Recharge
  const smartChips = useMemo(() => {
    const hasCompressor =
      lineItems.some((x) => includesWordish(x, "compressor")) || includesWordish(lineItemDraft, "compressor");

    const hasRecharge = lineItems.some((x) => includesWordish(x, "recharge"));
    const chips = [...BASE_CHIPS];

    // Put Recharge earlier if "Compressor" is in play
    if (hasCompressor && !hasRecharge) {
      const idx = chips.findIndex((c) => c.value.toLowerCase() === "recharge");
      if (idx > 0) {
        const [c] = chips.splice(idx, 1);
        chips.splice(2, 0, c); // move near top
      }
    }

    return chips;
  }, [lineItems, lineItemDraft]);

  useEffect(() => {
    let alive = true;

    async function boot() {
      setLoading(true);
      setErr(null);

      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (!alive) return;

      if (authErr) {
        setUserId(null);
        setErr(`Auth error: ${authErr.message}`);
        setLoading(false);
        return;
      }

      const uid = authData?.user?.id ?? null;
      setUserId(uid);

      if (!uid) {
        setErr("Not signed in. Sign in first, then payments can be recorded.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("payment_events")
        .select("id,user_id,created_at,amount,who,for_what,method,notes")
        .order("created_at", { ascending: false })
        .limit(25);

      if (!alive) return;

      if (error) {
        setErr(`Load error: ${error.message}`);
      } else {
        setEvents((data ?? []) as PaymentEventRow[]);
      }

      setLoading(false);
    }

    boot();

    return () => {
      alive = false;
    };
  }, []);

  function addLineItem(raw?: string) {
    const v = titleCaseWords(raw ?? lineItemDraft);
    if (!v) return;

    // Light normalization: collapse multiple dashes into a calm em-dash style
    const pretty = v
      .replace(/\s*-\s*/g, " — ")
      .replace(/\s*—\s*/g, " — ")
      .replace(/\s{2,}/g, " ")
      .trim();

    // De-dupe (case-insensitive)
    const key = pretty.toLowerCase();
    if (lineItems.some((x) => x.toLowerCase() === key)) {
      setLineItemDraft("");
      return;
    }

    setLineItems((prev) => [...prev, pretty]);
    setLineItemDraft("");
  }

  function removeLineItem(idx: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function applyChip(chipValue: string) {
    // If draft is empty, start it. If it already has content, append with a delimiter.
    const base = safeTrim(lineItemDraft);
    const token = titleCaseWords(chipValue);

    if (!base) {
      setLineItemDraft(token);
      return;
    }

    // Avoid repeating exact token
    if (includesWordish(base, token)) return;

    // For structure words, we append with " — "
    const structural = ["Front", "Rear", "Driver", "Passenger", "Brakes", "A/C"];
    const delim = " — ";

    if (structural.includes(token)) {
      setLineItemDraft(`${base}${delim}${token}`);
    } else {
      // parts that read better as “ — Pads & Rotors”
      setLineItemDraft(`${base}${delim}${token}`);
    }
  }

  function onAmountBlur() {
    const n = parseAmountLoose(amount);
    if (n === null) {
      setAmount("$0.00");
      return;
    }
    setAmount(formatMoney(n));
  }

  async function saveEvent() {
    if (!canSave || !userId) return;

    setSaving(true);
    setErr(null);

    const amtNum = parseAmountLoose(amount) ?? 0;
    const amountNormalized = formatMoney(amtNum);

    const whoClean = titleCaseWords(who);
    const forWhatSummary = computedForWhat;

    const notesBlob = buildNotesBlob(lineItems, notes);

    const payload = {
      amount: amountNormalized,
      who: whoClean,
      for_what: forWhatSummary,
      method,
      notes: notesBlob,
      user_id: userId, // if your DB trigger fills this, it's still okay
    };

    // 1) Insert payment event
    const { data: inserted, error: insErr } = await supabase
      .from("payment_events")
      .insert(payload)
      .select("id,user_id,created_at,amount,who,for_what,method,notes")
      .single();

    if (insErr || !inserted) {
      setSaving(false);
      setErr(`Save error (payment_events): ${insErr?.message ?? "Unknown error"}`);
      return;
    }

    // 2) Build binder text and insert binder artifact
    const binderBody = buildBinderText(inserted as PaymentEventRow);

    const artifactPayload = {
      user_id: userId,
      kind: "payment_event",
      source_event_id: inserted.id,
      title: `Payment: ${inserted.amount} ”¢ ${inserted.who}`,
      body: binderBody,
    };

    const { error: artErr } = await supabase.from("binder_artifacts").insert(artifactPayload);

    if (artErr) {
      // Payment saved, binder artifact failed — still show the payment and expose the error.
      setErr(`Saved payment, but binder_artifacts failed: ${artErr.message}`);
    }

    // Update UI
    setEvents((prev) => [inserted as PaymentEventRow, ...prev]);

    // Clear fields
    setAmount("$0.00");
    setWho("");
    setLineItemDraft("");
    setLineItems([]);
    setNotes("");

    setSaving(false);
  }

  async function copyBinderTextForEvent(e: PaymentEventRow) {
    const text = buildBinderText(e);
    await copyText(text);
  }

  return (
    <div style={{ ...cardStyle, marginTop: 14 }}>
      <div style={sectionTitleStyle}>Payment â†’ Event â†’ Binder Artifact (Supabase)</div>

      {err && <div style={errBox}>{err}</div>}

      {loading ? (
        <div style={{ fontSize: 12, opacity: 0.7 }}>Loading”¦</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 10 }}>
            <Field label="Amount">
              <input
                value={amount}
                onChange={(e) => setAmount(normalizeAmountInput(e.target.value))}
                onBlur={onAmountBlur}
                placeholder="$0.00"
                style={input}
                inputMode="decimal"
              />
              <div style={tipStyle}>Tip: type 250 â†’ saves as 250.00</div>
            </Field>

            <Field label="From / Who">
              <input
                value={who}
                onChange={(e) => setWho(e.target.value)}
                onBlur={() => setWho(titleCaseWords(who))}
                placeholder="Customer or payer"
                style={input}
              />
            </Field>

            <Field label="Add line item">
              <input
                value={lineItemDraft}
                onChange={(e) => setLineItemDraft(titleCaseWords(e.target.value))}
                placeholder='Example: Front — Brakes — Pads & Rotors'
                style={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLineItem();
                  }
                }}
              />

              <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {smartChips.map((c) => (
                  <button key={c.label} type="button" style={chipBtn} onClick={() => applyChip(c.value)}>
                    {c.label}
                  </button>
                ))}

                <div style={{ flex: 1 }} />

                <button type="button" style={btnGhost} onClick={() => addLineItem()} disabled={!safeTrim(lineItemDraft)}>
                  Add item
                </button>
              </div>

              {lineItems.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 6 }}>Saved as:</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {lineItems.map((item, idx) => (
                      <div key={`${item}-${idx}`} style={lineItemRow}>
                        <span style={{ minWidth: 0, overflowWrap: "anywhere" }}>{item}</span>
                        <button type="button" style={miniDangerBtn} onClick={() => removeLineItem(idx)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Field>

            <Field label="Method">
              <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} style={select}>
                <option value="cash">cash</option>
                <option value="card">card</option>
                <option value="zelle">zelle</option>
                <option value="venmo">venmo</option>
                <option value="paypal">paypal</option>
                <option value="other">other</option>
              </select>
            </Field>

            <Field label="Notes (optional)">
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" style={input} />
            </Field>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" style={btn} onClick={saveEvent} disabled={!canSave}>
                {saving ? "Saving”¦" : "Save Payment Event"}
              </button>
            </div>
          </div>

          <div style={{ marginTop: 14, fontSize: 12, opacity: 0.65 }}>
            Recorded events (from Supabase) — copy into binder / timestamp PDF
          </div>

          {events.length > 0 ? (
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
              {events.map((e) => (
                <div key={e.id} style={eventCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {e.amount} ”¢ {e.who}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{e.for_what}</div>
                      <div style={{ fontSize: 12, opacity: 0.55 }}>
                        {formatLocalFromIso(e.created_at)} ”¢ {e.method}
                      </div>
                    </div>

                    <button type="button" style={btnGhost} onClick={() => copyBinderTextForEvent(e)}>
                      Copy binder text
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>No payments yet.</div>
          )}
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={row}>
      <label style={labelStyle}>{label}</label>
      {children}
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
  marginBottom: 10,
};

const row: CSSProperties = {
  display: "grid",
  gap: 6,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  opacity: 0.7,
};

const tipStyle: CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  opacity: 0.72,
};

const input: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "8px 10px",
  boxSizing: "border-box",
};

const select: CSSProperties = {
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.35)",
  color: "#fff",
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
  opacity: 0.88,
};

const chipBtn: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.20)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
};

const lineItemRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
  fontSize: 12,
};

const miniDangerBtn: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid rgba(255,80,80,0.35)",
  background: "rgba(255,80,80,0.10)",
  color: "#fff",
  cursor: "pointer",
  fontSize: 12,
  opacity: 0.9,
  whiteSpace: "nowrap",
};

const eventCard: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.03)",
};

const errBox: CSSProperties = {
  marginBottom: 10,
  padding: 10,
  borderRadius: 12,
  border: "1px solid rgba(255,80,80,0.35)",
  background: "rgba(255,80,80,0.10)",
  color: "#fff",
  fontSize: 12,
};


