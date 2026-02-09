import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// IMPORTANT: Adjust this import if your supabase client lives elsewhere.
// Common locations in your repo are: src/lib/supabase, src/supabaseClient, src/utils/supabase
import { supabase } from "../lib/supabase";

type PublicPageRow = {
  id: string;
  slug: string;
  project_id: string;
};

type SubmissionInsert = {
  slug: string;
  project_id: string;
  payload: any;
  created_at?: string;
};

// -----------------------------
// Mojibake / UTF-8 helpers (SINGLE SOURCE OF TRUTH — no duplicates)
// -----------------------------
function fixMojibakeOnce(input: string): string {
  // Heuristic: try to correct common UTF-8 mis-decoding sequences.
  // Safe: if it doesn't look corrupted, return unchanged.
  if (!input) return input;
  const looksCorrupted = /Ã.|â€™|â€œ|â€|â€“|â€”|â€¦|Â /u.test(input);
  if (!looksCorrupted) return input;

  try {
    // Attempt Latin-1 -> UTF-8 re-interpretation (common Notepad / encoding path)
    // In browser JS we can do: encode as Latin-1 bytes then decode as UTF-8.
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

// -----------------------------
// Minimal public intake renderer
// -----------------------------
export default function PublicPage() {
  const params = useParams();
  const slug = (params as any)?.slug || (params as any)?.id || "";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<PublicPageRow | null>(null);
  const [payloadText, setPayloadText] = useState<string>("{}");
  const [success, setSuccess] = useState<string | null>(null);

  const normalizedSlug = useMemo(() => String(slug || "").trim(), [slug]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!normalizedSlug) {
        setLoading(false);
        setError("Missing public page identifier (slug).");
        return;
      }

      const { data, error } = await supabase
        .from("public_pages")
        .select("id, slug, project_id, mode")
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

      // Normalize strings deep to correct mojibake in stored content
      const cleaned = normalizeStringsDeep(data) as PublicPageRow;

      setPage(cleaned);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, [normalizedSlug]);

  const submit = async () => {
    if (!page) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    let parsed: any;
    try {
      parsed = payloadText?.trim() ? JSON.parse(payloadText) : {};
    } catch {
      setSaving(false);
      setError("Payload JSON is not valid. Fix it and try again.");
      return;
    }

    const insert: SubmissionInsert = {
      slug: page.slug,
      project_id: page.project_id,
      payload: normalizeStringsDeep(parsed),
    };

    const { error } = await supabase
      .from("public_intake_submissions")
      .insert(insert);

    if (error) {
      setSaving(false);
      setError(error.message || "Failed to submit intake.");
      return;
    }

    setSaving(false);
    setSuccess("Submitted successfully.");
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
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Public Page</div>
        <div style={{ color: "#b00020" }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
        {null || "Public Intake"}
      </div>


      <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700 }}>Submission Payload (JSON)</div>
      <textarea
        value={payloadText}
        onChange={(e) => setPayloadText(e.target.value)}
        rows={10}
        style={{
          width: "100%",
          marginTop: 8,
          padding: 12,
          borderRadius: 10,
          border: "1px solid #00000030",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          fontSize: 12,
        }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
        <button
          onClick={submit}
          disabled={saving}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #00000030",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          {saving ? "Submitting…" : "Submit"}
        </button>

        {success ? <div style={{ color: "#0a7a2f", fontWeight: 700 }}>{success}</div> : null}
        {error ? <div style={{ color: "#b00020", fontWeight: 700 }}>{error}</div> : null}
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
        Note: If you see an import error for supabase, change the import path at the top to match your project.
      </div>
    </div>
  );
}








