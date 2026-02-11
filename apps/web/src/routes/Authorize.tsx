import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type IntakeRow = {
  id: string;
  receipt_id?: string | null;
  slug: string;
  created_at?: string | null;
  payload: any;
};

function trimOrEmpty(v: any) {
  try { return String(v ?? "").trim(); } catch { return ""; }
}

function formatMoneyFromCap(capRaw: string | null) {
  const n = Number(String(capRaw ?? "").replace(/[^0-9.]/g, ""));
  if (!isFinite(n) || n <= 0) return "$0.00";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function safeNowIso() {
  try { return new Date().toISOString(); } catch { return ""; }
}

function makeReceipt(prefix: string) {
  const rand = (crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)).replace(/-/g, "");
  return `${prefix}-${rand.slice(0, 10).toUpperCase()}`;
}

export default function Authorize() {
  const { receipt } = useParams() as any;
  const [searchParams] = useSearchParams();

  const cap = searchParams.get("cap") || "250";
  const capLabel = useMemo(() => formatMoneyFromCap(cap), [cap]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [intake, setIntake] = useState<IntakeRow | null>(null);

  const [ok, setOk] = useState<string | null>(null);
  const [authReceipt, setAuthReceipt] = useState<string | null>(null);
  const [authAt, setAuthAt] = useState<string | null>(null);

  const normalizedReceipt = useMemo(() => trimOrEmpty(receipt), [receipt]);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr(null);
      setOk(null);

      if (!normalizedReceipt) {
        setLoading(false);
        setErr("Missing receipt.");
        return;
      }

      // Pull REAL intake by receipt_id OR id
      const { data, error } = await supabase
        .from("public_intake_submissions")
        .select("id, receipt_id, slug, created_at, payload")
        .or(`receipt_id.eq.${normalizedReceipt},id.eq.${normalizedReceipt}`)
        .limit(1)
        .maybeSingle();

      if (!alive) return;

      if (error) {
        setLoading(false);
        setErr(error.message || "Failed to load intake.");
        return;
      }
      if (!data) {
        setLoading(false);
        setErr("Intake not found for this receipt.");
        return;
      }

      setIntake(data as any);
      setLoading(false);
    }

    run();
    return () => { alive = false; };
  }, [normalizedReceipt]);

  // -----------------------------
  // Styles (match intake vibe)
  // -----------------------------
  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0b0f17",
      padding: 14,
      display: "flex",
      justifyContent: "center",
    } as const,
    shell: { width: "100%", maxWidth: 520 } as const,
    topBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 12,
    } as const,
    brand: { display: "flex", alignItems: "center", gap: 10 } as const,
    badge: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "linear-gradient(135deg,#3b82f6,#22c55e)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    } as const,
    brandText: { color: "#e8eefc", fontWeight: 900, fontSize: 14, lineHeight: 1.1 } as const,
    brandSub: { color: "#b7c2da", fontWeight: 700, fontSize: 12, opacity: 0.9 } as const,
    pill: {
      padding: "7px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.05)",
      color: "#e8eefc",
      fontWeight: 900,
      fontSize: 12,
    } as const,
    hero: {
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(34,197,94,0.14))",
      marginBottom: 12,
    } as const,
    heroInner: { padding: 14, display: "flex", flexDirection: "column", gap: 8 } as const,
    heroTitle: { color: "#e8eefc", fontSize: 20, fontWeight: 950, lineHeight: 1.15 } as const,
    heroText: { color: "#b7c2da", fontSize: 13, fontWeight: 700, lineHeight: 1.35 } as const,
    card: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      borderRadius: 18,
      padding: 14,
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
      backdropFilter: "blur(8px)",
      marginBottom: 12,
    } as const,
    label: { color: "#b7c2da", fontWeight: 900, fontSize: 12, marginBottom: 6 } as const,
    mono: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: 12,
      color: "#e8eefc",
      opacity: 0.95,
      wordBreak: "break-all" as const,
    } as const,
    bigMoney: { color: "#e8eefc", fontWeight: 950, fontSize: 26, letterSpacing: -0.3 } as const,
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
    btn: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "rgba(255,255,255,0.06)",
      color: "#e8eefc",
      fontWeight: 950,
      fontSize: 13,
      cursor: "pointer",
      marginTop: 10,
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
    footer: {
      marginTop: 14,
      color: "#b7c2da",
      fontSize: 11,
      fontWeight: 800,
      opacity: 0.8,
      textAlign: "center" as const,
    } as const,
  };

  const payload = intake?.payload || {};
  const who = trimOrEmpty(payload?.name) || "Customer";
  const phone = trimOrEmpty(payload?.phone);
  const email = trimOrEmpty(payload?.email);
  const msg = trimOrEmpty(payload?.message) || "(no message)";
  const slug = trimOrEmpty(intake?.slug);
  const intakeReceipt = trimOrEmpty(intake?.receipt_id) || trimOrEmpty(intake?.id);

  const authorize = async () => {
    if (!intakeReceipt || !slug) return;

    setSaving(true);
    setErr(null);
    setOk(null);

    // Client-generated authorization receipt (no select needed)
    const authR = makeReceipt("HP-AUTH");
    const ts = safeNowIso();

    const row: any = {
      auth_receipt: authR,
      intakeReceipt,
      slug,
      amount_cap: Number(String(cap).replace(/[^0-9.]/g, "")) || 0,
      created_at_client: ts,
      payload_snapshot: payload,
    };

    const { error } = await supabase
      .from("payment_authorizations")
      .insert(row);

    if (error) {
      setSaving(false);
      setErr(error.message || "Failed to record authorization.");
      return;
    }

    setSaving(false);
    setAuthReceipt(authR);
    setAuthAt(ts);
    setOk("Authorization recorded.");
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

  if (err && !intake) {
    return (
      <div style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.topBar}>
            <div style={styles.brand}>
              <div style={styles.badge} />
              <div>
                <div style={styles.brandText}>HomePlanet</div>
                <div style={styles.brandSub}>Authorization</div>
              </div>
            </div>
            <div style={styles.pill}>Proof-ready</div>
          </div>

          <div style={styles.card}>
            <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 16, marginBottom: 8 }}>Authorization</div>
            <div style={{ color: "#ffd2da", fontWeight: 900 }}>{err}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.topBar}>
          <div style={styles.brand}>
            <div style={styles.badge} />
            <div>
              <div style={styles.brandText}>HomePlanet</div>
              <div style={styles.brandSub}>Authorization • {slug || "business"}</div>
            </div>
          </div>
          <div style={styles.pill}>Receipt-linked</div>
        </div>

        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div style={styles.heroTitle}>Authorize service. Proof logged.</div>
            <div style={styles.heroText}>
              You’re approving a maximum amount — not a charge yet. Every change is timestamped.
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 16, marginBottom: 10 }}>Service Summary</div>

          <div style={styles.label}>Intake Receipt</div>
          <div style={styles.mono}>{intakeReceipt}</div>

          <div style={{ marginTop: 10 }}>
            <div style={styles.label}>Customer</div>
            <div style={{ color: "#e8eefc", fontWeight: 900 }}>{who}</div>
            <div style={{ color: "#b7c2da", fontWeight: 800, fontSize: 12, marginTop: 4 }}>
              {phone ? phone : ""}{phone && email ? " • " : ""}{email ? email : ""}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={styles.label}>Request</div>
            <div style={{ color: "#c7d2ea", fontWeight: 800, fontSize: 13, lineHeight: 1.35 }}>{msg}</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ color: "#e8eefc", fontWeight: 950, fontSize: 16, marginBottom: 10 }}>Authorization Cap</div>
          <div style={styles.bigMoney}>{capLabel}</div>
          <div style={{ color: "#b7c2da", fontWeight: 800, fontSize: 12, marginTop: 6, lineHeight: 1.35 }}>
            This is the maximum amount the business may charge without additional approval.
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={styles.trustItem}><div style={styles.dot} /><div>Receipt-backed and timestamped.</div></div>
            <div style={styles.trustItem}><div style={styles.dot} /><div>No surprise charges — capture happens later.</div></div>
            <div style={styles.trustItem}><div style={styles.dot} /><div>Change requests create a new proof record.</div></div>
          </div>

          <button onClick={authorize} disabled={saving} style={{ ...styles.cta, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Recording…" : `Authorize Up To ${capLabel}`}
          </button>

          <button
            onClick={() => alert("Request different amount — coming next.")}
            disabled={saving}
            style={styles.btn}
          >
            Request Different Amount
          </button>

          {ok ? (
            <div style={styles.bannerOk}>
              {ok}
              {authReceipt ? (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 950 }}>Authorization Receipt</div>
                  <div style={{ ...styles.mono, marginTop: 4 }}>{authReceipt}</div>
                  <div style={{ color: "#b7c2da", fontWeight: 800, fontSize: 12, marginTop: 6 }}>
                    Linked intake: {intakeReceipt}{authAt ? ` • ${authAt}` : ""}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {err ? <div style={styles.bannerErr}>{err}</div> : null}
        </div>

        <div style={styles.footer}>Powered by HomePlanet • Presence-First Authorization</div>
      </div>
    </div>
  );
}

