import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type IntakeRow = {
  id: string;
  created_at: string;
  slug?: string | null;
  project_id?: string | null;
  payload?: any;
  receipt_id?: string | null;
};

function safeStr(v: any) {
  try {
    if (v == null) return "";
    if (typeof v === "string") return v.trim();
    if (typeof v === "number") return String(v);
    return String(v ?? "").trim();
  } catch {
    return "";
  }
}

function prettyTime(iso: any) {
  try {
    const d = new Date(String(iso));
    if (Number.isNaN(d.getTime())) return String(iso ?? "");
    return d.toLocaleString();
  } catch {
    return String(iso ?? "");
  }
}

function shouldHideName(name: string): boolean {
  const n = safeStr(name).toLowerCase();
  if (!n) return false;

  return (
    n.includes("fuck") ||
    n.includes("shit") ||
    n.includes("cunt") ||
    n.includes("bitch") ||
    n.includes("asshole") ||
    n.includes("test customer") ||
    n.includes("dummy") ||
    n.includes("asdf") ||
    n.includes("qwerty")
  );
}

function shouldShowRow(row: any): boolean {
  const p = (row as any)?.payload || {};
  const name = safeStr(p.name || p.full_name || p.fullName);
  return !shouldHideName(name);
}
export default function IntakeViewerPanel({
  projectId,
  slug,
}: {
  projectId: string | null | undefined;
  slug?: string | null;
}) {
  const [rows, setRows] = useState<IntakeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Receipt lookup
  const [receiptLookup, setReceiptLookup] = useState("");
  const [receiptResult, setReceiptResult] = useState<any | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);

  // Detect whether the table has a receipt_id column (so we don't require SQL to run dev)
  const [hasReceiptIdCol, setHasReceiptIdCol] = useState<boolean>(false);

  const headerNote = slug ? `slug: ${slug}` : "";

  // Column detection (safe, non-fatal)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // This is a fast query that will fail if receipt_id doesn't exist.
        const { error } = await supabase
          .from("public_intake_submissions")
          .select("receipt_id")
          .limit(1);

        if (!cancelled) setHasReceiptIdCol(!error);
      } catch {
        if (!cancelled) setHasReceiptIdCol(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Single source of truth fetch
  const fetchSubmissions = useCallback(async () => {
    if (!projectId && !slug) return;

    setLoading(true);
    setErr(null);

    try {
      const selectCols = hasReceiptIdCol
        ? "id,created_at,slug,project_id,payload,receipt_id"
        : "id,created_at,slug,project_id,payload";

      const base = supabase
        .from("public_intake_submissions")
        .select(selectCols)
        .order("created_at", { ascending: false })
        .limit(200);

      const { data, error } = slug
        ? await base.eq("slug", slug)
        : await base.eq("project_id", projectId);

      if (error) throw error;
      setRows((data as any) ?? []);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, [projectId, slug, hasReceiptIdCol]);

  // Initial load
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Realtime: on INSERT, re-fetch (reliability > manual merge)
  useEffect(() => {
    if (!projectId && !slug) return;

    const channel = supabase
      .channel("intake-submissions:" + String(projectId ?? slug ?? "none"))
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "public_intake_submissions",
          filter: slug ? "slug=eq." + slug : "project_id=eq." + projectId,
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, slug, fetchSubmissions]);

  async function lookupReceipt() {
    const receipt = receiptLookup.trim();
    setReceiptError(null);
    setReceiptResult(null);

    if (!receipt) return;

    try {
      const selectCols = hasReceiptIdCol
        ? "id,created_at,slug,project_id,payload,receipt_id"
        : "id,created_at,slug,project_id,payload";

      const q = supabase
        .from("public_intake_submissions")
        .select(selectCols)
        .limit(1);

      // If receipt_id exists, lookup by receipt_id; otherwise treat receipt as id
      const { data, error } = hasReceiptIdCol
        ? await q.eq("receipt_id", receipt).maybeSingle()
        : await q.eq("id", receipt).maybeSingle();

      if (error) {
        setReceiptError(error.message);
        return;
      }

      if (!data) {
        setReceiptError("Not found.");
        return;
      }

      setReceiptResult(data);
      await fetchSubmissions();
    } catch (e: any) {
      setReceiptError(e?.message ?? String(e));
    }
  }

  // Nice-to-have polish: if the submit page wrote last_receipt_id, auto-run lookup once
  useEffect(() => {
    try {
      const key = "last_receipt_id";
      const v = window.localStorage.getItem(key);
      if (!v) return;

      setReceiptLookup(v);
      window.localStorage.removeItem(key);

      setTimeout(() => {
        lookupReceipt();
      }, 0);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, slug, hasReceiptIdCol]);

  return (
    <div
      style={{
        marginTop: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: 14,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "white" }}>
          Intake
        </div>
        <div
          style={{
            opacity: 0.65,
            fontSize: 12,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {rows.length} {rows.length === 1 ? "submission" : "submissions"}{" "}
          {headerNote ? `- ${headerNote}` : ""}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={fetchSubmissions}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              cursor: "pointer",
              color: "white",
              fontWeight: 800,
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Receipt lookup block */}
      <div
        style={{
          marginTop: 10,
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 12,
          padding: 12,
          background: "rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          Receipt lookup
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input
            value={receiptLookup}
            onChange={(e) => setReceiptLookup(e.target.value)}
            placeholder={hasReceiptIdCol ? "Paste receipt_id…" : "Paste row id (uuid)…"}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(0,0,0,0.25)",
              color: "white",
              outline: "none",
              fontSize: 13,
            }}
          />

          <button
            onClick={lookupReceipt}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              cursor: "pointer",
              color: "white",
              fontWeight: 800,
              whiteSpace: "nowrap",
            }}
          >
            Find
          </button>
        </div>

        {receiptError ? (
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,180,180,0.95)" }}>
            {receiptError}
          </div>
        ) : null}

        {receiptResult ? (
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.80)" }}>
            Found:{" "}
            <span
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
            >
              {(receiptResult as any).receipt_id ?? (receiptResult as any).id}
            </span>{" "}
            — {String((receiptResult as any).created_at)}
          </div>
        ) : null}
      </div>

      {loading && (
        <div style={{ marginTop: 10, opacity: 0.75, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          Loading...
        </div>
      )}

      {err && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            border: "1px solid rgba(255,80,80,0.35)",
            background: "rgba(255,80,80,0.08)",
            color: "rgba(255,200,200,0.95)",
            fontSize: 13,
          }}
        >
          Intake load failed: {err}
        </div>
      )}

      {!loading && !err && rows.length === 0 && (
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
          No submissions yet. Open the public link in incognito and submit a test,
          then hit Refresh.
        </div>
      )}

      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.filter(shouldShowRow).map((r: any) => {
          const p = (r as any).payload || {};
          const name = safeStr(p.name || p.full_name || p.fullName);
          const email = safeStr(p.email);
          const phone = safeStr(p.phone);
          const contact = safeStr(p.preferred_contact || p.preferredContact);
          const address = safeStr(p.address);
          const bestTime = safeStr(p.best_time || p.bestTime);
          const needHelp = safeStr(p.need_help_with || p.needHelpWith);
          const message = safeStr(p.message || p.issue || p.request);
          const isOpen = expandedId === (r as any).id;
          const receiptToCopy = (r as any).receipt_id ?? (r as any).id;

          return (
            <div
              key={(r as any).id}
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: 12,
                background: "rgba(0,0,0,0.15)",
                color: "rgba(255,255,255,0.9)",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <div style={{ fontWeight: 800 }}>{name || email || phone || "Submission"}</div>
                <div style={{ opacity: 0.65, fontSize: 12 }}>
                  {prettyTime((r as any).created_at)}
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => setExpandedId(isOpen ? null : (r as any).id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          JSON.stringify((r as any).payload ?? {}, null, 2)
                        );
                        alert("Payload copied");
                      } catch {}
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    Copy JSON
                  </button>

                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(String(receiptToCopy));
                        alert("Receipt ID copied");
                      } catch {}
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 800,
                    }}
                  >
                    Copy Receipt
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Email</div>
                  <div>{email || "-"}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Phone</div>
                  <div>{phone || "-"}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Preferred</div>
                  <div>{contact || "-"}</div>
                </div>
                <div style={{ fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Address</div>
                  <div>{address || "-"}</div>
                </div>

                {bestTime && (
                  <div style={{ fontSize: 13 }}>
                    <div style={{ opacity: 0.6, fontSize: 12 }}>Best time</div>
                    <div>{bestTime}</div>
                  </div>
                )}

                {needHelp && (
                  <div style={{ fontSize: 13 }}>
                    <div style={{ opacity: 0.6, fontSize: 12 }}>Need help with</div>
                    <div>{needHelp}</div>
                  </div>
                )}
              </div>

              {message && (
                <div style={{ marginTop: 10, fontSize: 13 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Request</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{message}</div>
                </div>
              )}

              {isOpen && (
                <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Receipt</div>
                  <div
                    style={{
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    }}
                  >
                    {String(receiptToCopy)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

