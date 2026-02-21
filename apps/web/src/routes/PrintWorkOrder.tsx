// apps/web/src/routes/PrintWorkOrder.tsx
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams, useSearchParams } from "react-router-dom";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  current_stage: string | null;
  stage_updated_at?: string | null;
  stage_updated_by_employee_code?: string | null;
  handled_by_employee_code?: string | null;
};

function safeText(x: unknown, max = 5000): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isUuid(v: unknown) {
  if (typeof v !== "string") return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export default function PrintWorkOrder() {
  const { slug, id } = useParams();
  const [searchParams] = useSearchParams();
  const auto = searchParams.get("auto") === "1";

  const shopSlug = (slug ?? "").trim();
  const jobId = (id ?? "").trim();

  const supabase = useMemo(() => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }, []);

  const [row, setRow] = useState<Row | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setErr(null);
      setLoading(true);

      if (!supabase) {
        setErr("Supabase client not initialized (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
        setLoading(false);
        return;
      }
      if (!shopSlug) {
        setErr("Missing shop slug in URL.");
        setLoading(false);
        return;
      }
      if (!isUuid(jobId)) {
        setErr(`Bad job id (expected uuid). Got: ${String(jobId)}`);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("public_intake_submissions")
        .select(
          "id,created_at,slug,payload,current_stage,stage_updated_at,stage_updated_by_employee_code,handled_by_employee_code"
        )
        .eq("slug", shopSlug)
        .eq("id", jobId)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setErr(`${error.message}${error.details ? ` | ${error.details}` : ""}`);
        setLoading(false);
        return;
      }

      if (!data) {
        setErr("Work order not found.");
        setLoading(false);
        return;
      }

      setRow(data as any);
      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [supabase, shopSlug, jobId]);

  useEffect(() => {
    if (!auto) return;
    if (loading) return;
    if (err) return;
    if (!row) return;

    const t = window.setTimeout(() => window.print(), 250);
    return () => window.clearTimeout(t);
  }, [auto, loading, err, row]);

  const p = row?.payload ?? {};
  const customerName = safeText(p.name || p.customer_name || p.full_name || "Customer", 120);
  const phone = safeText(p.phone || p.phone_number || "", 60);
  const email = safeText(p.email || "", 120);

  const vehicle = safeText(p.vehicle || p.make_model || p.car || "Vehicle", 120);
  const plate = safeText(p.plate || p.tag || "", 40);
  const vin = safeText(p.vin || "", 60);
  const mileage = safeText(p.mileage || p.odometer || "", 20);

  const message = safeText(p.message || p.problem || p.notes || "—", 2000);

  const receiptId = row?.id ? String(row.id).slice(0, 8).toUpperCase() : "—";
  const stage = safeText(row?.current_stage || "diagnosing", 30);
  const lastBy = row?.stage_updated_by_employee_code || row?.handled_by_employee_code || "";
  const lastAt = row?.stage_updated_at || null;

  const publicIntakeUrl = `https://www.homeplanet.city/c/${encodeURIComponent(shopSlug)}`;
  const staffBoardUrl = `https://www.homeplanet.city/live/${encodeURIComponent(shopSlug)}/staff`;

  return (
    <div className="min-h-screen bg-white text-black">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .sheet { max-width: 900px; margin: 0 auto; padding: 24px; }
        .topbar { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; margin-bottom: 16px; }
        .title { font-size: 22px; font-weight: 800; line-height: 1.1; }
        .sub { font-size: 12px; color: #444; margin-top: 6px; }
        .pill { display: inline-block; border: 1px solid #ddd; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 700; background: #f7f7f7; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
        .card { border: 1px solid #e5e5e5; border-radius: 12px; padding: 12px; }
        .label { font-size: 11px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px; }
        .value { font-size: 14px; font-weight: 600; color: #111; }
        .muted { font-size: 12px; color: #444; margin-top: 2px; }
        .bigbox { border: 1px solid #e5e5e5; border-radius: 12px; padding: 12px; margin-top: 12px; }
        .lines { margin-top: 8px; border-top: 1px dashed #ccc; }
        .line { height: 26px; border-bottom: 1px dashed #ddd; }
        .checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; font-size: 12px; }
        .check { border: 1px solid #ddd; border-radius: 10px; padding: 8px; display: flex; gap: 8px; align-items: flex-start; }
        .box { width: 14px; height: 14px; border: 2px solid #333; border-radius: 3px; margin-top: 1px; flex: 0 0 auto; }
        .footer { margin-top: 14px; font-size: 11px; color: #444; display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .btn { border: 1px solid #111; border-radius: 10px; padding: 10px 12px; background: #111; color: #fff; font-weight: 800; cursor: pointer; }
        .btn2 { border: 1px solid #bbb; border-radius: 10px; padding: 10px 12px; background: #fff; color: #111; font-weight: 700; cursor: pointer; }
      `}</style>

      <div className="sheet">
        <div className="topbar">
          <div>
            <div className="title">Work Order</div>
            <div className="sub">
              Shop: <span className="mono">{shopSlug}</span> • Receipt ID: <span className="mono">{receiptId}</span>
              <br />
              Created: <span className="mono">{formatDateTime(row?.created_at)}</span>
              {lastAt ? (
                <>
                  {" "}
                  • Last stage update: <span className="mono">{formatDateTime(lastAt)}</span>
                  {lastBy ? (
                    <>
                      {" "}
                      by <span className="mono">{lastBy}</span>
                    </>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="pill">Stage: {stage}</div>
            <div className="no-print" style={{ marginTop: 10, display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => window.print()}>
                Print
              </button>
              <button className="btn2" onClick={() => window.close()}>
                Close
              </button>
            </div>
          </div>
        </div>

        {loading ? <div className="card">Loading…</div> : null}
        {err ? <div className="card" style={{ borderColor: "#fca5a5", background: "#fff1f2" }}>{err}</div> : null}

        {row ? (
          <>
            <div className="grid">
              <div className="card">
                <div className="label">Customer</div>
                <div className="value">{customerName}</div>
                <div className="muted">
                  {phone ? (
                    <>
                      Phone: <span className="mono">{phone}</span>
                    </>
                  ) : (
                    "Phone: —"
                  )}
                  <br />
                  {email ? (
                    <>
                      Email: <span className="mono">{email}</span>
                    </>
                  ) : (
                    "Email: —"
                  )}
                </div>
              </div>

              <div className="card">
                <div className="label">Vehicle</div>
                <div className="value">{vehicle}</div>
                <div className="muted">
                  Plate: <span className="mono">{plate || "—"}</span> • VIN: <span className="mono">{vin || "—"}</span>
                  <br />
                  Mileage: <span className="mono">{mileage || "—"}</span>
                </div>
              </div>
            </div>

            <div className="bigbox">
              <div className="label">Customer reported issue</div>
              <div style={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{message}</div>
            </div>

            <div className="grid">
              <div className="bigbox">
                <div className="label">Tech notes / findings</div>
                <div className="lines">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div className="line" key={i} />
                  ))}
                </div>
              </div>

              <div className="bigbox">
                <div className="label">Estimate / approvals</div>
                <div className="lines">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div className="line" key={i} />
                  ))}
                </div>

                <div className="checklist">
                  <div className="check">
                    <div className="box" />
                    <div>
                      Customer approved estimate
                      <div className="muted">Method: ☐ phone ☐ text ☐ in person</div>
                    </div>
                  </div>
                  <div className="check">
                    <div className="box" />
                    <div>
                      Parts ordered
                      <div className="muted">Vendor / ETA</div>
                    </div>
                  </div>
                  <div className="check">
                    <div className="box" />
                    <div>
                      Test drive completed
                      <div className="muted">Notes / results</div>
                    </div>
                  </div>
                  <div className="check">
                    <div className="box" />
                    <div>
                      Ready for pickup
                      <div className="muted">Date/time notified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bigbox">
              <div className="label">Sign-off</div>
              <div className="lines">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div className="line" key={i} />
                ))}
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                Customer signature: ____________________________ &nbsp;&nbsp; Date: _____________
              </div>
            </div>

            <div className="footer">
              <div>
                Public intake: <span className="mono">{publicIntakeUrl}</span>
              </div>
              <div>
                Staff board: <span className="mono">{staffBoardUrl}</span>
              </div>
              <div>
                Internal Receipt ID: <span className="mono">{receiptId}</span> • Full ID: <span className="mono">{row.id}</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}