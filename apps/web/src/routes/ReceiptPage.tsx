import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

type ReceiptResult = {
  id?: string;
  receipt_id?: string | null;
  slug?: string | null;
  created_at?: string | null;
  payload?: any;
};

function trimOrEmpty(v: any) {
  try {
    return String(v ?? "").trim();
  } catch {
    return "";
  }
}

function safePretty(v: any) {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return "";
  }
}

export default function ReceiptPage() {
  const params = useParams();
  const receipt = (params as any)?.receipt || "";
  const normalized = useMemo(() => trimOrEmpty(receipt), [receipt]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [row, setRow] = useState<ReceiptResult | null>(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr(null);
      setRow(null);

      if (!normalized) {
        setLoading(false);
        setErr("Missing receipt ID.");
        return;
      }

      const { data, error } = await supabase.rpc("get_intake_receipt", {
        receipt: normalized,
      });

      if (!alive) return;

      if (error) {
        setLoading(false);
        setErr(error.message || "Receipt lookup failed.");
        return;
      }

      if (!data) {
        setLoading(false);
        setErr("Receipt not found.");
        return;
      }

      setRow(data as ReceiptResult);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, [normalized]);

  const receiptId = row?.receipt_id || row?.id || normalized;
  const createdAt = row?.created_at || "";
  const slug = row?.slug || "";
  const payload = row?.payload || {};

  const summary = [
    `Receipt: ${receiptId}`,
    slug ? `Slug: ${slug}` : "",
    createdAt ? `Saved: ${createdAt}` : "",
    payload?.name ? `Name: ${payload.name}` : "",
    payload?.phone ? `Phone: ${payload.phone}` : "",
    payload?.email ? `Email: ${payload.email}` : "",
    payload?.preferred_contact ? `Preferred: ${payload.preferred_contact}` : "",
    payload?.address ? `Address: ${payload.address}` : "",
    payload?.best_time ? `Best time: ${payload.best_time}` : "",
    payload?.message ? `Message: ${payload.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div style={{ minHeight: "100vh", background: "#0b0f17", padding: 14 }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ color: "#e8eefc", fontWeight: 900, fontSize: 18 }}>
          Receipt • Proof-ready
        </div>

        <div
          style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 18,
            padding: 14,
          }}
        >
          {loading ? (
            <div style={{ color: "#e8eefc" }}>Loading receipt…</div>
          ) : err ? (
            <div style={{ color: "#ffd2da", fontWeight: 900 }}>{err}</div>
          ) : (
            <>
              <div style={{ color: "#e8eefc", fontWeight: 900 }}>
                Receipt ID
              </div>

              <pre
                style={{
                  marginTop: 6,
                  color: "#c7d2ea",
                  fontSize: 12,
                  whiteSpace: "pre-wrap",
                }}
              >
                {receiptId}
              </pre>

              <div style={{ marginTop: 12 }}>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(receiptId);
                    alert("Receipt copied");
                  }}
                >
                  Copy Receipt
                </button>

                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(summary);
                    alert("Summary copied");
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Copy Summary
                </button>

                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      JSON.stringify(payload, null, 2)
                    );
                    alert("JSON copied");
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Copy JSON
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
