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
  };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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

function sortDescByCreatedAt(a: Row, b: Row) {
  return (b.created_at || "").localeCompare(a.created_at || "");
}

function mergeUpsert(prev: Row[], incoming: Row, limit = 30) {
  const map = new Map<string, Row>();
  for (const r of prev) map.set(r.id, r);
  map.set(incoming.id, { ...(map.get(incoming.id) ?? ({} as any)), ...incoming });
  return Array.from(map.values()).sort(sortDescByCreatedAt).slice(0, limit);
}

function mergeDelete(prev: Row[], id: string, limit = 30) {
  return prev.filter((r) => r.id !== id).slice(0, limit);
}

function isQuickJob(payload: any) {
  const p = payload ?? {};
  const txt = `${p.message ?? ""} ${p.notes ?? ""} ${p.problem ?? ""}`.toLowerCase();
  return /oil|tire|flat|battery|jump|wiper|bulb|light|inspection|rotate|patch|plug/.test(txt);
}

export default function LiveShopTV() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Starting…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);

  const inFlightLoadRef = useRef(false);
  const lastFullSyncAtRef = useRef<number>(0);
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
      .limit(30);

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
      return Array.from(merged.values()).sort(sortDescByCreatedAt).slice(0, 30);
    });

    lastFullSyncAtRef.current = Date.now();
    setConnected(true);
    setStatus("Listening…");
  }

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
    if (dbNewest && localNewest && dbNewest !== localNewest) loadLatest("Resyncing…");
    if (dbNewest && !localNewest) loadLatest("Loading…");
  }

  useEffect(() => {
    setRows([]);
    setConnected(false);
    setLastErr(null);
    loadLatest("Loading…");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  useEffect(() => {
    if (!supabase || !shopSlug) return;

    setStatus("Listening…");
    setConnected(true);
    setLastErr(null);

    const channel = supabase
      .channel(`intake-tv:${shopSlug}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "public_intake_submissions", filter: `slug=eq.${shopSlug}` },
        (evt) => {
          const row = evt.new as Row;
          setRows((prev) => mergeUpsert(prev, row, 30));
          setStatus("New arrival");
          setTimeout(() => setStatus("Listening…"), 1200);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "public_intake_submissions", filter: `slug=eq.${shopSlug}` },
        (evt) => {
          const row = evt.new as Row;
          setRows((prev) => mergeUpsert(prev, row, 30));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "public_intake_submissions", filter: `slug=eq.${shopSlug}` },
        (evt) => {
          const oldRow = evt.old as Partial<Row>;
          if (oldRow?.id) setRows((prev) => mergeDelete(prev, oldRow.id as string, 30));
        }
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") loadLatest("Syncing…");
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

    const ticker = window.setInterval(() => bump((x) => (x + 1) % 10_000), 15_000);

    return () => {
      window.clearInterval(heartbeat);
      window.clearInterval(ticker);
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, supabase, rows.length]);

  const newest = rows[0] ?? null;
  const quickRows = rows.filter((r) => isQuickJob(r.payload));
  const longRows = rows.filter((r) => !isQuickJob(r.payload));

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 p-6 overflow-hidden">
      <div className="w-full h-full max-w-none mx-auto">
        <div
          className="h-full rounded-2xl border border-slate-800 bg-slate-950/40 p-6"
          style={{
            boxShadow:
              "0 0 0 1px rgba(148,163,184,.25), 0 0 40px rgba(59,130,246,.10), 0 0 90px rgba(16,185,129,.06)",
          }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-xl font-bold">
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
            <div className="text-slate-400 mt-6 text-lg">No arrivals yet.</div>
          ) : (
            <div className="mt-6">
              <div className="text-xs text-slate-400 font-semibold">Newest arrival</div>

              <div
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/30 p-6"
                style={{ boxShadow: "0 0 0 1px rgba(148,163,184,.20), 0 0 30px rgba(59,130,246,.14)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-4xl font-extrabold">{extractSummary(newest.payload).vehicle}</div>
                  <div className="shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-sm text-slate-200 font-semibold">
                    {ageShort(newest.created_at)}
                  </div>
                </div>

                <div className="text-slate-200 mt-2 text-xl">{extractSummary(newest.payload).message}</div>
                <div className="text-base text-slate-400 mt-3">
                  {extractSummary(newest.payload).name} • {formatTime(newest.created_at)}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 h-[48vh]">
                <div className="h-full">
                  <div className="text-xs text-slate-400 font-semibold">Quick jobs</div>
                  <div className="mt-2 space-y-2 h-full overflow-auto pr-1">
                    {quickRows.slice(0, 18).map((r) => {
                      const s = extractSummary(r.payload);
                      return (
                        <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-base font-semibold text-slate-100 truncate">
                                {s.vehicle} <span className="text-slate-400 font-normal">— {s.name}</span>
                              </div>
                              <div className="text-sm text-slate-300 mt-1 truncate">{s.message}</div>
                            </div>
                            <div className="shrink-0 text-sm text-slate-400">
                              <span className="mr-2">{ageShort(r.created_at)}</span>
                              {formatTime(r.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {quickRows.length === 0 ? <div className="text-sm text-slate-500 mt-2">No quick jobs yet.</div> : null}
                  </div>
                </div>

                <div className="h-full">
                  <div className="text-xs text-slate-400 font-semibold">Longer jobs</div>
                  <div className="mt-2 space-y-2 h-full overflow-auto pr-1">
                    {longRows.slice(0, 18).map((r) => {
                      const s = extractSummary(r.payload);
                      return (
                        <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-base font-semibold text-slate-100 truncate">
                                {s.vehicle} <span className="text-slate-400 font-normal">— {s.name}</span>
                              </div>
                              <div className="text-sm text-slate-300 mt-1 truncate">{s.message}</div>
                            </div>
                            <div className="shrink-0 text-sm text-slate-400">
                              <span className="mr-2">{ageShort(r.created_at)}</span>
                              {formatTime(r.created_at)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {longRows.length === 0 ? <div className="text-sm text-slate-500 mt-2">No longer jobs yet.</div> : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 mt-4">
            TV view: read-only. Staff uses <span className="text-slate-300">/live/{shopSlug}/board</span>.
          </div>
        </div>
      </div>
    </div>
  );
}