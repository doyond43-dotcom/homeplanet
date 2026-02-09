import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// IMPORTANT: Adjust this import if your supabase client lives elsewhere.
import { supabase } from "../lib/supabase";

type PublicPageRow = {
  id: string;
  slug: string;
};

// -----------------------------
// Mojibake / UTF-8 helpers (SINGLE SOURCE OF TRUTH — no duplicates)
// -----------------------------
function fixMojibakeOnce(input: string): string {
  if (!input) return input;
  const looksCorrupted = /Ã.|â€™|â€œ|â€|â€“|â€”|â€¦|Â /u.test(input);
  if (!looksCorrupted) return input;

  try {
    const bytes = Uint8Array.from(input, (c) => c.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    return decoded || input;
  } catch {
    return input;
  }
}

function normalizeStringsDeep<T>(value: T): T {
  const seen = new WeakMap<object, any>();

  const walk = (v: any): any => {
    if (typeof v === "string") return fixMojibakeOnce(v);
    if (v === null || v === undefined) return v;
    if (typeof v !== "object") return v;

    if (seen.has(v)) return seen.get(v);

    if (Array.isArray(v)) {
      const arr: any[] = [];
      seen.set(v, arr);
      for (const item of v) arr.push(walk(item));
      return arr;
    }

    const obj: Record<string, any> = {};
    seen.set(v, obj);
    for (const [k, val] of Object.entries(v)) obj[k] = walk(val);
    return obj;
  };

  return walk(value);
}

function trimOrEmpty(v: any) {
  try {
    return String(v ?? "").trim();
  } catch {
    return "";
  }
}

export default function PublicPage() {
  const params = useParams();
  const slug = (params as any)?.slug || (params as any)?.id || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<PublicPageRow | null>(null);

  // form draft (real fields)
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    email: "",
    preferred_contact: "",
    address: "",
    best_time: "",
    message: "",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);

  const normalizedSlug = useMemo(() => String(slug || "").trim(), [slug]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setReceipt(null);

      if (!normalizedSlug) {
        setLoading(false);
        setError("Missing public page identifier (slug).");
        return;
      }

      const { data, error } = await supabase
        .from("public_pages")
        .select("id, slug")
        .eq("slug", normalizedSlug)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setLoading(false);
        setError(error.message || "Failed to load public page.");
        return;
      }

      if (!data) {
        setLoading(false);
        setError("Public page not found.");
        return;
      }

      const cleaned = normalizeStringsDeep(data) as PublicPageRow;
      setPage(cleaned);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, [normalizedSlug]);

  const setField = (k: keyof typeof draft, v: string) => {
    setDraft((d) => ({ ...d, [k]: v }));
  };

  const buildPayload = () => {
    const payload = {
      name: trimOrEmpty(draft.name),
      phone: trimOrEmpty(draft.phone),
      email: trimOrEmpty(draft.email),
      preferred_contact: trimOrEmpty(draft.preferred_contact),
      address: trimOrEmpty(draft.address),
      best_time: trimOrEmpty(draft.best_time),
      message: trimOrEmpty(draft.message),
    };
    return normalizeStringsDeep(payload);
  };

  const submit = async () => {
    if (!page) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    setReceipt(null);

    const payload = buildPayload();

    const hasAny =
      !!trimOrEmpty((payload as any).name) ||
      !!trimOrEmpty((payload as any).phone) ||
      !!trimOrEmpty((payload as any).email) ||
      !!trimOrEmpty((payload as any).message);

    if (!hasAny) {
      setSaving(false);
      setError("Add at least a name/phone/email or a short message, then submit.");
      return;
    }

    const insertBase: any = {
      public_page_id: page.id,
      slug: page.slug,
      payload,
    };

    // Try returning receipt_id if the column exists; fallback to id-only.
    try {
      const { data, error } = await supabase
        .from("public_intake_submissions")
        .insert(insertBase)
        .select("id, receipt_id")
        .single();

      if (error) throw error;

      const r = String((data as any)?.receipt_id ?? (data as any)?.id ?? "");
      if (r) {
        setReceipt(r);
        try {
          window.localStorage.setItem("last_receipt_id", r);
        } catch {}
      }

      setSaving(false);
      setSuccess("Submitted successfully.");
      return;
    } catch (e: any) {
      // fallback: receipt_id column may not exist
      try {
        const { data, error } = await supabase
          .from("public_intake_submissions")
          .insert(insertBase)
          .select("id")
          .single();

        if (error) throw error;

        const r = String((data as any)?.id ?? "");
        if (r) {
          setReceipt(r);
          try {
            window.localStorage.setItem("last_receipt_id", r);
          } catch {}
        }

        setSaving(false);
        setSuccess("Submitted successfully.");
        return;
      } catch (e2: any) {
        setSaving(false);
        setError(e2?.message || e?.message || "Failed to submit intake.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Public Intake</div>
        <div style={{ color: "#b00020" }}>{error}</div>
      </div>
    );
  }

  const input = {
    width: "100%",
    marginTop: 6,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #00000030",
    fontSize: 14,
  } as const;

  const label = { fontSize: 12, fontWeight: 800, opacity: 0.8 } as const;

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>Public Intake</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={label}>Full name</div>
          <input
            value={draft.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Customer name"
            style={input}
          />
        </div>

        <div>
          <div style={label}>Phone</div>
          <input
            value={draft.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="(555) 555-5555"
            style={input}
          />
        </div>

        <div>
          <div style={label}>Email</div>
          <input
            value={draft.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="email@example.com"
            style={input}
          />
        </div>

        <div>
          <div style={label}>Preferred contact</div>
          <input
            value={draft.preferred_contact}
            onChange={(e) => setField("preferred_contact", e.target.value)}
            placeholder="Text / Call / Email"
            style={input}
          />
        </div>

        <div>
          <div style={label}>Address (optional)</div>
          <input
            value={draft.address}
            onChange={(e) => setField("address", e.target.value)}
            placeholder="City, State"
            style={input}
          />
        </div>

        <div>
          <div style={label}>Best time</div>
          <input
            value={draft.best_time}
            onChange={(e) => setField("best_time", e.target.value)}
            placeholder="Morning / Afternoon / Evening"
            style={input}
          />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={label}>What do you need help with?</div>
        <textarea
          value={draft.message}
          onChange={(e) => setField("message", e.target.value)}
          rows={6}
          placeholder="Describe the issue / request..."
          style={{
            ...input,
            fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={submit}
          disabled={saving}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #00000030",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 900,
          }}
        >
          {saving ? "Submitting…" : "Submit"}
        </button>

        {success ? <div style={{ color: "#0a7a2f", fontWeight: 900 }}>{success}</div> : null}
        {error ? <div style={{ color: "#b00020", fontWeight: 900 }}>{error}</div> : null}

        {receipt ? (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
              Receipt:
              <span
                style={{
                  marginLeft: 8,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
                {receipt}
              </span>
            </div>

            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(receipt);
                  alert("Receipt ID copied");
                } catch {}
              }}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #00000030",
                cursor: "pointer",
                fontWeight: 900,
              }}
            >
              Copy Receipt
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
