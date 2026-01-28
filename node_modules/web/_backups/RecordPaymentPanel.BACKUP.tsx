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

type BinderArtifactRow = {
  id: string;
  user_id: string;
  created_at: string;
  kind: string;
  source_event_id: string | null;
  title: string;
  body: string;
};

function safeTrim(v: string) {
  return (v ?? "").trim();
}

function formatLocalFromIso(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
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
    e.notes ? `Notes: ${e.notes}` : "",
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

export default function RecordPaymentPanel() {
  const [amount, setAmount] = useState("");
  const [who, setWho] = useState("");
  const [forWhat, setForWhat] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [events, setEvents] = useState<PaymentEventRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const canSave = useMemo(() => {
    return !!(safeTrim(amount) && safeTrim(who) && safeTrim(forWhat) && userId && !saving);
  }, [amount, who, forWhat, userId, saving]);

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

  async function saveEvent() {
    if (!canSave || !userId) return;

    setSaving(true);
    setErr(null);

    const payload = {
      amount: safeTrim(amount),
      who: safeTrim(who),
      for_what: safeTrim(forWhat),
      method,
      notes: safeTrim(notes) || null,
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
      title: `Payment: ${inserted.amount} • ${inserted.who}`,
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
    setAmount("");
    setWho("");
    setForWhat("");
    setNotes("");

    setSaving(false);
  }

  async function copyBinderTextForEvent(e: PaymentEventRow) {
    const text = buildBinderText(e);
    await copyText(text);
  }

  return (
    <div style={{ ...cardStyle, marginTop: 14 }}>
      <div style={sectionTitleStyle}>Payment → Event → Binder Artifact (Supabase)</div>

      {err && (
        <div style={errBox}>
          {err}
        </div>
      )}

      {loading ? (
        <div style={{ fontSize: 12, opacity: 0.7 }}>Loading…</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 10 }}>
            <Field label="Amount">
              <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="$0.00" style={input} />
            </Field>

            <Field label="From / Who">
              <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Customer or payer" style={input} />
            </Field>

            <Field label="For">
              <input value={forWhat} onChange={(e) => setForWhat(e.target.value)} placeholder="What was paid for" style={input} />
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

            <Field label="Notes">
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" style={input} />
            </Field>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" style={btn} onClick={saveEvent} disabled={!canSave}>
                {saving ? "Saving…" : "Save Payment Event"}
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
                        {e.amount} • {e.who}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{e.for_what}</div>
                      <div style={{ fontSize: 12, opacity: 0.55 }}>
                        {formatLocalFromIso(e.created_at)} • {e.method}
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

const input: CSSProperties = {
  width: "100%",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  padding: "8px 10px",
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
  opacity: 0.82,
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

