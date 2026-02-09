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

function safeNowIso() {
  try {
    return new Date().toISOString();
  } catch {
    return "";
  }
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

function formatPreviewSentence(d: {
  name: string;
  phone: string;
  email: string;
  preferred_contact: string;
  best_time: string;
  address: string;
  message: string;
}) {
  const who = trimOrEmpty(d.name) || "New customer";
  const pref = trimOrEmpty(d.preferred_contact) || "Text";
  const when = trimOrEmpty(d.best_time);
  const where = trimOrEmpty(d.address);

  // Keep the “request” line tight and readable
  const msg = trimOrEmpty(d.message);
  const request = msg
    ? msg.length > 220
      ? msg.slice(0, 217) + "…"
      : msg
    : "Request details will appear here as you type…";

  const parts: string[] = [];
  parts.push(`${who} — prefers ${pref.toLowerCase()}`);
  if (when) parts.push(`best time: ${when.toLowerCase()}`);
  if (where) parts.push(`location: ${where}`);
  return {
    title: who,
    request,
    meta: parts.join(" • "),
  };
}

async function fileToJpegDataUrl(file: File, maxW = 1280, maxH = 1280, quality = 0.82) {
  const typeOk = /^image\//i.test(file.type);
  if (!typeOk) throw new Error("Please choose an image file.");

  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to load image."));
      i.src = url;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    let nw = w;
    let nh = h;

    const wr = maxW / Math.max(1, w);
    const hr = maxH / Math.max(1, h);
    const r = Math.min(1, wr, hr);

    nw = Math.max(1, Math.round(w * r));
    nh = Math.max(1, Math.round(h * r));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available.");

    ctx.drawImage(img, 0, 0, nw, nh);

    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    return dataUrl;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function approxBytesFromDataUrl(dataUrl: string) {
  // data:image/jpeg;base64,XXXX
  const idx = dataUrl.indexOf(",");
  if (idx < 0) return dataUrl.length;
  const b64 = dataUrl.slice(idx + 1);
  // base64 bytes ≈ (len * 3/4) - padding
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
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
    preferred_contact: "Text",
    address: "",
    best_time: "",
    message: "",
  });

  // Optional photo
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [lastPayloadJson, setLastPayloadJson] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const normalizedSlug = useMemo(() => String(slug || "").trim(), [slug]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError(null);
      setSuccess(null);
      setReceipt(null);
      setLastPayloadJson(null);
      setSavedAt(null);

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
    const payload: any = {
      name: trimOrEmpty(draft.name),
      phone: trimOrEmpty(draft.phone),
      email: trimOrEmpty(draft.email),
      preferred_contact: trimOrEmpty(draft.preferred_contact),
      address: trimOrEmpty(draft.address),
      best_time: trimOrEmpty(draft.best_time),
      message: trimOrEmpty(draft.message),
      client_ts: safeNowIso(),
      source: "qr_public",
    };

    // Optional photo fields (kept compact)
    if (photoDataUrl) {
      payload.photo = {
        name: photoName || "upload.jpg",
        mime: "image/jpeg",
        data_url: photoDataUrl,
      };
    }

    return normalizeStringsDeep(payload);
  };

  const canSubmit = useMemo(() => {
    const name = trimOrEmpty(draft.name);
    const phone = trimOrEmpty(draft.phone);
    const email = trimOrEmpty(draft.email);
    const msg = trimOrEmpty(draft.message);
    return !!name || !!phone || !!email || !!msg;
  }, [draft]);

  const preview = useMemo(() => formatPreviewSentence(draft), [draft]);

  const submit = async () => {
    if (!page) return;
    if (saving) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    setReceipt(null);
    setLastPayloadJson(null);
    setSavedAt(null);

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
      slug: page.slug,
      payload,
    };

    // Try returning receipt_id if the column exists; fallback to id-only.
    try {
      const { data, error } = await supabase
        .from("public_intake_submissions")
        .insert(insertBase)
        .select("id, receipt_id, created_at")
        .single();

      if (error) throw error;

      const r = String((data as any)?.receipt_id ?? (data as any)?.id ?? "");
      if (r) {
        setReceipt(r);
        try {
          window.localStorage.setItem("last_receipt_id", r);
        } catch {}
      }

      const ts = String((data as any)?.created_at ?? safeNowIso());
      setSavedAt(ts || safeNowIso());

      try {
        setLastPayloadJson(JSON.stringify(payload, null, 2));
      } catch {
        setLastPayloadJson(null);
      }

      setSaving(false);
      setSuccess("Request logged.");
      return;
    } catch (e: any) {
      try {
        const { data, error } = await supabase
          .from("public_intake_submissions")
          .insert(insertBase)
          .select("id, created_at")
          .single();

        if (error) throw error;

        const r = String((data as any)?.id ?? "");
        if (r) {
          setReceipt(r);
          try {
            window.localStorage.setItem("last_receipt_id", r);
          } catch {}
        }

        const ts = String((data as any)?.created_at ?? safeNowIso());
        setSavedAt(ts || safeNowIso());

        try {
          setLastPayloadJson(JSON.stringify(payload, null, 2));
        } catch {
          setLastPayloadJson(null);
        }

        setSaving(false);
        setSuccess("Request logged.");
        return;
      } catch (e2: any) {
        setSaving(false);
        setError(e2?.message || e?.message || "Failed to submit intake.");
      }
    }
  };

  // -----------------------------
  // Styles (mobile-first, "one-pager" feel)
  // -----------------------------
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0b0f17",
      padding: 14,
      display: "flex",
      justifyContent: "center",
    } as const,
    shell: {
      width: "100%",
      maxWidth: 520,
    } as const,
    topBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 12,
    } as const,
    brand: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    } as const,
    badge: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "linear-gradient(135deg,#3b82f6,#22c55e)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    } as const,
    brandText: {
      color: "#e8eefc",
      fontWeight: 900,
      fontSize: 14,
      lineHeight: 1.1,
    } as const,
    brandSub: {
      color: "#b7c2da",
      fontWeight: 700,
      fontSize: 12,
      opacity: 0.9,
    } as const,
    card: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 18,
      padding: 14,
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      backdropFilter: "blur(8px)",
    } as const,
    hero: {
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(34,197,94,0.14))",
      marginBottom: 12,
    } as const,
    heroInner: {
      padding: 14,
      minHeight: 150,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      gap: 8,
      position: "relative",
    } as const,
    heroTitle: {
      color: "#e8eefc",
      fontSize: 20,
      fontWeight: 950,
      lineHeight: 1.15,
      letterSpacing: -0.2,
    } as const,
    heroText: {
      color: "#b7c2da",
      fontSize: 13,
      fontWeight: 700,
      lineHeight: 1.35,
    } as const,
    pillRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 8,
    } as const,
    pill: {
      padding: "7px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.05)",
      color: "#e8eefc",
      fontWeight: 900,
      fontSize: 12,
    } as const,
    trust: {
      marginBottom: 12,
    } as const,
    trustItem: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      color: "#dbe7ff",
      fontSize: 13,
      fontWeight: 750,
      lineHeight: 1.35,
      opacity: 0.95,
      marginTop: 8,
    } as const,
    dot: {
      width: 10,
      height: 10,
      marginTop: 4,
      borderRadius: 999,
      background: "#22c55e",
      boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
      flex: "0 0 auto",
    } as const,
    label: {
      color: "#c7d2ea",
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.2,
      marginBottom: 6,
    } as const,
    input: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(0,0,0,0.18)",
      color: "#e8eefc",
      fontSize: 14,
      outline: "none",
    } as const,
    textarea: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(0,0,0,0.18)",
      color: "#e8eefc",
      fontSize: 14,
      outline: "none",
      resize: "vertical" as const,
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    } as const,
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 12,
    } as const,
    chips: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
    } as const,
    chip: (active: boolean) =>
      ({
        padding: "10px 12px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.14)",
        background: active ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)",
        color: "#e8eefc",
        fontWeight: 950,
        fontSize: 12,
        cursor: "pointer",
        userSelect: "none",
      } as const),
    cta: {
      width: "100%",
      padding: "14px 14px",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.16)",
      background: "linear-gradient(135deg, rgba(59,130,246,0.90), rgba(34,197,94,0.85))",
      color: "#071019",
      fontWeight: 950,
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    } as const,
    ctaDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    } as const,
    bannerOk: {
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(34,197,94,0.35)",
      background: "rgba(34,197,94,0.12)",
      color: "#d8ffe6",
      fontWeight: 900,
      fontSize: 13,
    } as const,
    bannerErr: {
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(176,0,32,0.45)",
      background: "rgba(176,0,32,0.12)",
      color: "#ffd2da",
      fontWeight: 900,
      fontSize: 13,
    } as const,
    receiptCard: {
      marginTop: 12,
      borderRadius: 18,
    } as const,
    mono: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: 12,
      color: "#e8eefc",
      opacity: 0.95,
      wordBreak: "break-all" as const,
    } as const,
    row: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: 10,
    } as const,
    smallBtn: {
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      color: "#e8eefc",
      fontWeight: 950,
      fontSize: 12,
      cursor: "pointer",
    } as const,
    footer: {
      marginTop: 14,
      color: "#b7c2da",
      fontSize: 11,
      fontWeight: 800,
      opacity: 0.8,
      textAlign: "center" as const,
    } as const,
    uploadBox: {
      borderRadius: 16,
      border: "1px dashed rgba(255,255,255,0.20)",
      background: "rgba(255,255,255,0.04)",
      padding: 12,
    } as const,
    uploadRow: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap" as const,
    } as const,
    uploadBtn: {
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      color: "#e8eefc",
      fontWeight: 950,
      fontSize: 12,
      cursor: "pointer",
    } as const,
    uploadHint: {
      color: "#b7c2da",
      fontSize: 12,
      fontWeight: 800,
      opacity: 0.9,
      lineHeight: 1.35,
    } as const,
    thumb: {
      width: 86,
      height: 64,
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,0.12)",
      objectFit: "cover" as const,
      background: "rgba(0,0,0,0.18)",
    } as const,
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={{ color: "#e8eefc", fontWeight: 900, fontSize: 14, padding: 10 }}>Loading…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.topBar}>
            <div style={styles.brand}>
              <div style={styles.badge} />
              <div>
                <div style={styles.brandText}>HomePlanet</div>
                <div style={styles.brandSub}>Public Intake</div>
              </div>
            </div>
          </div>
          <div style={{ ...styles.card, padding: 14 }}>
            <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 16, marginBottom: 8 }}>Public Intake</div>
            <div style={{ color: "#ffd2da", fontWeight: 900 }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div style={styles.brand}>
            <div style={styles.badge} />
            <div>
              <div style={styles.brandText}>HomePlanet</div>
              <div style={styles.brandSub}>Public Intake • {page?.slug}</div>
            </div>
          </div>
          <div style={{ ...styles.pill, opacity: 0.9 }}>Receipt-ready</div>
        </div>

        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroTitle}>Request logged. Proof-ready.</div>
            <div style={styles.heroText}>
              Submit your request in under a minute. You’ll get a receipt ID you can reference anytime.
            </div>
            <div style={styles.pillRow}>
              <div style={styles.pill}>Instant receipt</div>
              <div style={styles.pill}>Timestamped</div>
              <div style={styles.pill}>Verified intake</div>
            </div>
          </div>
        </div>

        {/* Trust bullets */}
        <div style={{ ...styles.card, ...styles.trust }}>
          <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 14 }}>What happens next</div>
          <div style={styles.trustItem}>
            <div style={styles.dot} />
            <div>Your request is saved immediately with a receipt ID.</div>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.dot} />
            <div>A reviewer can see it the moment it lands.</div>
          </div>
          <div style={styles.trustItem}>
            <div style={styles.dot} />
            <div>No “lost texts.” No “we never got it.” Everything is logged.</div>
          </div>
        </div>

        {/* Form card */}
        <div style={styles.card}>
          <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 16, marginBottom: 10 }}>One-Page Intake</div>

          {/* Preview */}
          <div
            style={{
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.22)",
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ color: "#b7c2da", fontWeight: 900, fontSize: 12, marginBottom: 6 }}>Live preview</div>
            <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 14 }}>{preview.title}</div>

            <div style={{ color: "#b7c2ea", fontWeight: 900, fontSize: 12, marginTop: 10 }}>
              Preview request description
            </div>
            <div style={{ color: "#c7d2ea", fontWeight: 800, fontSize: 13, marginTop: 6, lineHeight: 1.35 }}>
              {preview.request}
            </div>

            <div style={{ color: "#b7c2da", fontWeight: 900, fontSize: 12, marginTop: 10 }}>{preview.meta}</div>
          </div>

          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Full name</div>
              <input
                value={draft.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Customer name"
                style={styles.input}
              />
            </div>

            <div>
              <div style={styles.label}>Phone</div>
              <input
                value={draft.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="(555) 555-5555"
                style={styles.input}
              />
            </div>

            <div>
              <div style={styles.label}>Email</div>
              <input
                value={draft.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="email@example.com"
                style={styles.input}
              />
            </div>

            <div>
              <div style={styles.label}>Preferred contact</div>
              <div style={styles.chips}>
                {["Text", "Call", "Email"].map((m) => {
                  const active = trimOrEmpty(draft.preferred_contact).toLowerCase() === m.toLowerCase();
                  return (
                    <div
                      key={m}
                      onClick={() => setField("preferred_contact", m)}
                      style={styles.chip(active)}
                      role="button"
                      aria-label={`Preferred contact ${m}`}
                    >
                      {m}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={styles.label}>Address (optional)</div>
              <input
                value={draft.address}
                onChange={(e) => setField("address", e.target.value)}
                placeholder="City, State"
                style={styles.input}
              />
            </div>

            <div>
              <div style={styles.label}>Best time</div>
              <select
                value={draft.best_time}
                onChange={(e) => setField("best_time", e.target.value)}
                style={styles.input as any}
              >
                <option value="">Choose time…</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Anytime">Anytime</option>
              </select>
            </div>

            <div>
              <div style={styles.label}>What do you need help with?</div>
              <textarea
                value={draft.message}
                onChange={(e) => setField("message", e.target.value)}
                rows={6}
                placeholder="Describe the issue / request…"
                style={styles.textarea}
              />
            </div>

            {/* Photo upload (optional) */}
            <div>
              <div style={styles.label}>Upload a photo (optional)</div>
              <div style={styles.uploadBox}>
                <div style={styles.uploadRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {photoDataUrl ? <img src={photoDataUrl} alt="Upload preview" style={styles.thumb} /> : null}
                    <div style={styles.uploadHint}>
                      Add a photo of the issue.
                      <br />
                      (Kept compact for proof + speed.)
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={styles.uploadBtn}>
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setError(null);

                          try {
                            const dataUrl = await fileToJpegDataUrl(f, 1280, 1280, 0.82);
                            const bytes = approxBytesFromDataUrl(dataUrl);
                            // Hard cap to avoid giant jsonb rows
                            if (bytes > 650_000) {
                              throw new Error("Image too large. Try a smaller photo.");
                            }
                            setPhotoName(f.name);
                            setPhotoDataUrl(dataUrl);
                          } catch (err: any) {
                            setPhotoName(null);
                            setPhotoDataUrl(null);
                            setError(err?.message || "Failed to attach photo.");
                          } finally {
                            // allow re-pick same file
                            (e.target as any).value = "";
                          }
                        }}
                      />
                    </label>

                    {photoDataUrl ? (
                      <button
                        type="button"
                        style={styles.uploadBtn}
                        onClick={() => {
                          setPhotoName(null);
                          setPhotoDataUrl(null);
                        }}
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={saving || !canSubmit}
              style={{
                ...styles.cta,
                ...(saving || !canSubmit ? styles.ctaDisabled : {}),
              }}
            >
              {saving ? "Submitting…" : "Confirm & Get Receipt"}
            </button>

            {success ? <div style={styles.bannerOk}>{success}</div> : null}
            {error ? <div style={styles.bannerErr}>{error}</div> : null}
          </div>
        </div>

        {/* Receipt card */}
        {receipt ? (
          <div style={{ ...styles.card, ...styles.receiptCard }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 14 }}>Receipt</div>
                <div style={{ color: "#b7c2da", fontWeight: 900, fontSize: 12, marginTop: 4 }}>
                  Saved {savedAt ? `• ${savedAt}` : ""}
                </div>
              </div>
              <div style={{ ...styles.pill, background: "rgba(34,197,94,0.18)", borderColor: "rgba(34,197,94,0.35)" }}>
                Logged ✅
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={{ color: "#b7c2da", fontWeight: 900, fontSize: 12, marginBottom: 6 }}>Receipt ID</div>
              <div style={styles.mono}>{receipt}</div>
            </div>

            <div style={styles.row}>
              <button
                style={styles.smallBtn}
                onClick={async () => {
                  const ok = await copyText(receipt);
                  if (ok) alert("Receipt copied");
                }}
              >
                Copy Receipt
              </button>

              <button
                style={styles.smallBtn}
                onClick={async () => {
                  const summary =
                    `Receipt: ${receipt}\n` +
                    `Slug: ${page?.slug}\n` +
                    `Saved: ${savedAt ?? ""}\n` +
                    `Name: ${trimOrEmpty(draft.name)}\n` +
                    `Phone: ${trimOrEmpty(draft.phone)}\n` +
                    `Email: ${trimOrEmpty(draft.email)}\n` +
                    `Preferred: ${trimOrEmpty(draft.preferred_contact)}\n` +
                    `Address: ${trimOrEmpty(draft.address)}\n` +
                    `Best time: ${trimOrEmpty(draft.best_time)}\n` +
                    `Message: ${trimOrEmpty(draft.message)}` +
                    (photoName ? `\nPhoto: ${photoName}` : "");
                  const ok = await copyText(summary);
                  if (ok) alert("Summary copied");
                }}
              >
                Copy Summary
              </button>

              <button
                style={styles.smallBtn}
                onClick={async () => {
                  const text = lastPayloadJson || "";
                  if (!text) return;
                  const ok = await copyText(text);
                  if (ok) alert("JSON copied");
                }}
                disabled={!lastPayloadJson}
              >
                Copy JSON
              </button>
            </div>
          </div>
        ) : null}

        <div style={styles.footer}>Powered by HomePlanet • Presence-First Intake</div>
      </div>
    </div>
  );
}
