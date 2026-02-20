import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  converted_service_id: string | null;
};

function safeText(x: unknown, max = 90): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function extractSummary(payload: any) {
  const p = payload ?? {};
  return {
    name: safeText(p.name || p.customer_name || p.first_name || p.full_name || "", 28) || "New customer",
    vehicle:
      safeText(p.vehicle || p.car || p.make_model || p.vehicle_info || p.vehicleText || "", 42) ||
      "Vehicle not specified",
    message: safeText(p.message || p.notes || p.problem || p.issue || "", 160) || "No message provided",
    // Optional common fields (nice to show if present)
    phone: safeText(p.phone || p.phone_number || p.mobile || "", 24),
    vin: safeText(p.vin || p.VIN || "", 24),
    year: safeText(p.year || p.vehicle_year || "", 8),
    plate: safeText(p.plate || p.tag || p.license_plate || "", 16),
    mileage: safeText(p.mileage || p.odometer || "", 12),
  };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function ageShort(iso: string) {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
}

// --- deterministic merge helpers (ops-safe) ---
function sortDescByCreatedAt(a: Row, b: Row) {
  return (b.created_at || "").localeCompare(a.created_at || "");
}

function mergeUpsert(prev: Row[], incoming: Row, limit = 25) {
  const map = new Map<string, Row>();
  for (const r of prev) map.set(r.id, r);
  map.set(incoming.id, { ...(map.get(incoming.id) ?? ({} as any)), ...incoming });
  return Array.from(map.values()).sort(sortDescByCreatedAt).slice(0, limit);
}

function mergeDelete(prev: Row[], id: string, limit = 25) {
  return prev.filter((r) => r.id !== id).slice(0, limit);
}

function isQuickJob(payload: any) {
  const p = payload ?? {};
  const txt = `${p.message ?? ""} ${p.notes ?? ""} ${p.problem ?? ""}`.toLowerCase();
  // simple heuristic: words that usually mean fast
  return /oil|tire|flat|battery|jump|wiper|bulb|light|inspection|rotate|patch|plug/.test(txt);
}

function getPartsProof(payload: any): { oldUrl?: string; newUrl?: string; label?: string } {
  const p = payload ?? {};
  // Supports a few possible shapes without breaking
  // Example possibilities:
  // payload.parts_proof = { old: 'url', new: 'url' }
  // payload.parts = { old_photo_url, new_photo_url }
  // payload.old_part_photo, payload.new_part_photo
  const oldUrl =
    p?.parts_proof?.old ||
    p?.parts?.old_photo_url ||
    p?.old_part_photo ||
    p?.oldPartPhoto ||
    p?.old_part_url ||
    p?.oldPartUrl;

  const newUrl =
    p?.parts_proof?.new ||
    p?.parts?.new_photo_url ||
    p?.new_part_photo ||
    p?.newPartPhoto ||
    p?.new_part_url ||
    p?.newPartUrl;

  const label = safeText(p?.parts_proof?.label || p?.parts?.label || "", 60);

  return { oldUrl, newUrl, label };
}

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Starting…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);

  // ✅ selection + drawer
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const lastBeepRef = useRef<number>(0);
  const inFlightLoadRef = useRef(false);
  const lastFullSyncAtRef = useRef<number>(0);

  // force a re-render periodically so the age badges update
  const [, bump] = useState(0);

  const supabase = useMemo(() => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }, []);

  const selectedRow = selectedId ? rows.find((r) => r.id === selectedId) : null;

  function softBeep() {
    const now = Date.now();
    if (now - lastBeepRef.current < 2500) return;
    lastBeepRef.current = now;
    try {
      const ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 120);
    } catch {}
  }

  async function loadLatest(reason: string) {
    if (!supabase) {
      setStatus("Waiting for env…");
      setConnected(false);
      return;
    }
    if (!shopSlug) {
      setStatus("Missing slug in URL");
      setConnected(false);
      return;
    }

    if (inFlightLoadRef.current) return;
    inFlightLoadRef.current = true;

    setStatus(reason);
    setLastErr(null);

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("id, created_at, slug, payload, converted_service_id")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(25);

    inFlightLoadRef.current = false;

    if (error) {
      setLastErr(error.message || String(error));
      setStatus("Load failed");
      setConnected(false);
      return;
    }

    setRows((prev) => {
      const merged = new Map<string, Row>();
      for (const r of prev) merged.set(r.id, r);
      for (const r of data ?? []) merged.set(r.id, r);
      return Array.from(merged.values()).sort(sortDescByCreatedAt).slice(0, 25);
    });

    lastFullSyncAtRef.current = Date.now();
    setConnected(true);
    setStatus("Listening…");
  }

  // lightweight drift check: if the DB has a newer created_at than our newest, full sync.
  async function driftCheck() {
    if (!supabase || !shopSlug) return;

    const localNewest = rows[0]?.created_at ?? null;

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("created_at")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      setConnected(false);
      return;
    }

    const dbNewest = (data?.[0] as any)?.created_at ?? null;
    if (dbNewest && localNewest && dbNewest !== localNewest) {
      loadLatest("Resyncing…");
    }
    if (dbNewest && !localNewest) {
      loadLatest("Loading…");
    }
  }

  useEffect(() => {
    // initial load whenever slug changes
    setRows([]);
    setConnected(false);
    setLastErr(null);
    setSelectedId(null);
    loadLatest("Loading…");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  useEffect(() => {
    if (!supabase || !shopSlug) return;

    setStatus("Listening…");
    setConnected(true);
    setLastErr(null);

    const channel = supabase
      .channel(`intake:${shopSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (evt) => {
          const row = evt.new as Row;
          setRows((prev) => mergeUpsert(prev, row, 25));
          setStatus("New arrival");
          softBeep();
          setTimeout(() => setStatus("Listening…"), 1200);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (evt) => {
          const row = evt.new as Row;
          setRows((prev) => mergeUpsert(prev, row, 25));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (evt) => {
          const oldRow = evt.old as Partial<Row>;
          if (oldRow?.id) setRows((prev) => mergeDelete(prev, oldRow.id as string, 25));
          if (oldRow?.id && selectedId === oldRow.id) setSelectedId(null);
        }
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") {
          setConnected(true);
          setLastErr(null);
          loadLatest("Syncing…");
        }
        if (s === "TIMED_OUT" || s === "CHANNEL_ERROR") {
          setConnected(false);
          setStatus("Reconnecting…");
          loadLatest("Resyncing…");
        }
      });

    const heartbeat = window.setInterval(() => {
      const age = Date.now() - lastFullSyncAtRef.current;
      if (age > 10_000) driftCheck();
    }, 20_000);

    const ticker = window.setInterval(() => {
      bump((x) => (x + 1) % 10_000);
    }, 15_000);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearInterval(heartbeat);
      window.clearInterval(ticker);
      window.removeEventListener("keydown", onKey);
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, supabase, rows.length, selectedId]);

  const newest = rows[0];

  const quickRows = rows.filter((r) => isQuickJob(r.payload));
  const longRows = rows.filter((r) => !isQuickJob(r.payload));

  function openRow(r: Row) {
    setSelectedId(r.id);
  }

  function printReceipt(r: Row) {
    // Minimal: print a simple text receipt via browser print
    const s = extractSummary(r.payload);
    const proof = getPartsProof(r.payload);
    const html = `
      <html>
        <head><title>Receipt - ${s.vehicle}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 24px;">
          <h2 style="margin: 0 0 8px 0;">Taylor Creek Auto Repair</h2>
          <div style="color:#555; margin-bottom: 16px;">Ticket ${r.id}</div>

          <h3 style="margin: 16px 0 8px 0;">Customer</h3>
          <div><b>Name:</b> ${s.name || "-"}</div>
          <div><b>Phone:</b> ${s.phone || "-"}</div>

          <h3 style="margin: 16px 0 8px 0;">Vehicle</h3>
          <div><b>Vehicle:</b> ${s.vehicle || "-"}</div>
          <div><b>Year:</b> ${s.year || "-"}</div>
          <div><b>VIN:</b> ${s.vin || "-"}</div>
          <div><b>Plate:</b> ${s.plate || "-"}</div>
          <div><b>Mileage:</b> ${s.mileage || "-"}</div>

          <h3 style="margin: 16px 0 8px 0;">Issue / Notes</h3>
          <div style="white-space: pre-wrap;">${safeText(s.message, 2000) || "-"}</div>

          <h3 style="margin: 16px 0 8px 0;">Time</h3>
          <div><b>Created:</b> ${formatDateTime(r.created_at)}</div>

          <h3 style="margin: 16px 0 8px 0;">Parts Proof</h3>
          <div><b>Label:</b> ${proof.label || "-"}</div>
          <div><b>Old photo:</b> ${proof.oldUrl ? proof.oldUrl : "-"}</div>
          <div><b>New photo:</b> ${proof.newUrl ? proof.newUrl : "-"}</div>

          <div style="margin-top: 24px; color:#777; font-size: 12px;">
            Generated by HomePlanet • Presence-first record
          </div>
        </body>
      </html>
    `;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 p-4 md:p-6 overflow-hidden">
      <div className="w-full h-full max-w-none mx-auto">
        <div
          className="h-full rounded-2xl border border-slate-800 bg-slate-950/40 p-5 md:p-6"
          style={{
            boxShadow:
              "0 0 0 1px rgba(148,163,184,.25), 0 0 40px rgba(59,130,246,.10), 0 0 90px rgba(16,185,129,.06)",
          }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-lg font-bold">
              {connected ? status : "Reconnecting…"}{" "}
              <span className="text-xs text-slate-400 font-semibold">/{shopSlug || "no-slug"}</span>
            </div>
            <div className="text-xs text-slate-400">
              Rows: <span className="text-slate-200 font-semibold">{rows.length}</span>
            </div>
          </div>

          {lastErr ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {lastErr}
            </div>
          ) : null}

          {!newest ? (
            <div className="text-slate-400 mt-4">No arrivals yet.</div>
          ) : (
            <div className="mt-5">
              <div className="text-xs text-slate-400 font-semibold">Newest arrival</div>

              <button
                type="button"
                onClick={() => openRow(newest)}
                className="mt-2 w-full text-left rounded-2xl border border-slate-800 bg-slate-900/30 p-4 hover:border-slate-600 hover:bg-slate-900/40 active:scale-[0.998] transition cursor-pointer"
                style={{
                  boxShadow: "0 0 0 1px rgba(148,163,184,.20), 0 0 30px rgba(59,130,246,.14)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl md:text-3xl font-bold">{extractSummary(newest.payload).vehicle}</div>

                  <div className="shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-xs text-slate-200 font-semibold">
                    {ageShort(newest.created_at)}
                  </div>
                </div>

                <div className="text-slate-200 mt-1">{extractSummary(newest.payload).message}</div>
                <div className="text-sm text-slate-400 mt-2">
                  {extractSummary(newest.payload).name} • {formatTime(newest.created_at)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Click to open details</div>
              </button>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Quick jobs</div>
                  <div className="mt-2 space-y-2 max-h-[45vh] overflow-auto pr-1">
                    {quickRows.slice(0, 12).map((r) => {
                      const s = extractSummary(r.payload);
                      const active = selectedId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => openRow(r)}
                          className={[
                            "w-full text-left rounded-xl border bg-slate-950/30 px-3 py-2 transition cursor-pointer",
                            active
                              ? "border-emerald-400/40 bg-emerald-500/10"
                              : "border-slate-800 hover:border-slate-600",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-100 truncate">
                                {s.vehicle} <span className="text-slate-400 font-normal">— {s.name}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[11px] text-slate-200 font-semibold">
                                {ageShort(r.created_at)}
                              </div>
                              <div className="text-xs text-slate-500">{formatTime(r.created_at)}</div>
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 mt-1">{s.message}</div>
                        </button>
                      );
                    })}
                    {quickRows.length === 0 ? (
                      <div className="text-xs text-slate-500 mt-2">No quick jobs detected yet.</div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-semibold">Longer jobs</div>
                  <div className="mt-2 space-y-2 max-h-[45vh] overflow-auto pr-1">
                    {longRows.slice(0, 12).map((r) => {
                      const s = extractSummary(r.payload);
                      const active = selectedId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => openRow(r)}
                          className={[
                            "w-full text-left rounded-xl border bg-slate-950/30 px-3 py-2 transition cursor-pointer",
                            active ? "border-blue-400/40 bg-blue-500/10" : "border-slate-800 hover:border-slate-600",
                          ].join(" ")}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-slate-100 truncate">
                                {s.vehicle} <span className="text-slate-400 font-normal">— {s.name}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[11px] text-slate-200 font-semibold">
                                {ageShort(r.created_at)}
                              </div>
                              <div className="text-xs text-slate-500">{formatTime(r.created_at)}</div>
                            </div>
                          </div>

                          <div className="text-xs text-slate-300 mt-1">{s.message}</div>
                        </button>
                      );
                    })}
                    {longRows.length === 0 ? (
                      <div className="text-xs text-slate-500 mt-2">No longer jobs yet.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 mt-4">
            Tip: keep this tab open. Submit from <span className="text-slate-300">/c/{shopSlug}</span> and you should see
            the row appear within 1–5 seconds.
          </div>
        </div>
      </div>

      {/* ✅ Drawer overlay (pointer-safe + production-safe) */}
      {selectedRow ? (
        <div className="fixed inset-0 z-50">
          {/* Backdrop: explicit click/tap target that closes */}
          <button
            type="button"
            aria-label="Close details"
            className="absolute inset-0 bg-black/50"
            style={{ cursor: "default" }}
            onPointerDown={() => setSelectedId(null)}
          />

          {/* Desktop: right drawer. Mobile: bottom sheet */}
          <div
            className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-[520px]"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="h-[85vh] md:h-full bg-slate-950 border border-slate-800 md:border-l-slate-800 rounded-t-2xl md:rounded-none p-4 md:p-5 overflow-auto">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-lg font-bold truncate">{extractSummary(selectedRow.payload).vehicle}</div>
                  <div className="text-sm text-slate-400">
                    {extractSummary(selectedRow.payload).name} • {formatDateTime(selectedRow.created_at)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-500"
                >
                  Close
                </button>
              </div>

              {/* Quick meta */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">
                  <div className="text-slate-500">Age</div>
                  <div className="text-slate-200 font-semibold">{ageShort(selectedRow.created_at)}</div>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">
                  <div className="text-slate-500">Ticket ID</div>
                  <div className="text-slate-200 font-semibold truncate">{selectedRow.id}</div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4">
                <div className="text-xs text-slate-400 font-semibold">Notes / Problem</div>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200 whitespace-pre-wrap">
                  {extractSummary(selectedRow.payload).message || "—"}
                </div>
              </div>

              {/* Vehicle fields */}
              <div className="mt-4">
                <div className="text-xs text-slate-400 font-semibold">Vehicle Details</div>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-sm text-slate-200">
                  {(() => {
                    const s = extractSummary(selectedRow.payload);
                    const lines = [
                      s.year ? `Year: ${s.year}` : null,
                      s.vin ? `VIN: ${s.vin}` : null,
                      s.plate ? `Plate: ${s.plate}` : null,
                      s.mileage ? `Mileage: ${s.mileage}` : null,
                      s.phone ? `Phone: ${s.phone}` : null,
                    ].filter(Boolean);

                    return lines.length ? (
                      lines.map((t) => <div key={t as string}>{t}</div>)
                    ) : (
                      <div className="text-slate-500">—</div>
                    );
                  })()}
                </div>
              </div>

              {/* Parts proof */}
              <div className="mt-4">
                <div className="text-xs text-slate-400 font-semibold">Parts Proof</div>
                <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950/30 p-3">
                  {(() => {
                    const proof = getPartsProof(selectedRow.payload);
                    const hasAny = !!proof.oldUrl || !!proof.newUrl;
                    return (
                      <>
                        {proof.label ? <div className="text-sm text-slate-200 mb-2">{proof.label}</div> : null}

                        {!hasAny ? (
                          <div className="text-sm text-slate-500">No parts photos attached yet.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">
                              <div className="text-xs text-slate-500 mb-1">Old part</div>
                              {proof.oldUrl ? (
                                <a
                                  href={proof.oldUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-blue-300 underline break-all"
                                >
                                  Open photo
                                </a>
                              ) : (
                                <div className="text-sm text-slate-500">—</div>
                              )}
                            </div>
                            <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-2">
                              <div className="text-xs text-slate-500 mb-1">New part</div>
                              {proof.newUrl ? (
                                <a
                                  href={proof.newUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-blue-300 underline break-all"
                                >
                                  Open photo
                                </a>
                              ) : (
                                <div className="text-sm text-slate-500">—</div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => printReceipt(selectedRow)}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-500/15"
                >
                  Print receipt
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedRow.id).catch(() => {});
                  }}
                  className="rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 hover:border-slate-500"
                >
                  Copy ticket ID
                </button>
              </div>

              <div className="text-xs text-slate-500 mt-4">
                Tip: press <span className="text-slate-300">Esc</span> to close.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}