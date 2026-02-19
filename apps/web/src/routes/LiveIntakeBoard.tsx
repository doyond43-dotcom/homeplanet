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

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Starting…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);

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

    return () => {
      window.clearInterval(heartbeat);
      window.clearInterval(ticker);
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, supabase, rows.length]);

  const newest = rows[0];

  return (
    // ✅ FULL SCREEN (TV/monitor friendly)
    <div className="h-screen w-screen bg-slate-950 text-slate-100 p-4 md:p-6 overflow-hidden">
      {/* ✅ subtle TV glow on the whole board */}
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

              <div
                className="mt-2 rounded-2xl border border-slate-800 bg-slate-900/30 p-4"
                style={{
                  boxShadow: "0 0 0 1px rgba(148,163,184,.20), 0 0 30px rgba(59,130,246,.14)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl md:text-3xl font-bold">
                    {extractSummary(newest.payload).vehicle}
                  </div>

                  {/* ✅ age badge */}
                  <div className="shrink-0 rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-xs text-slate-200 font-semibold">
                    {ageShort(newest.created_at)}
                  </div>
                </div>

                <div className="text-slate-200 mt-1">{extractSummary(newest.payload).message}</div>
                <div className="text-sm text-slate-400 mt-2">
                  {extractSummary(newest.payload).name} • {formatTime(newest.created_at)}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400 font-semibold">Recent</div>

              {/* ✅ scroll instead of shrinking everything */}
              <div className="mt-2 space-y-2 max-h-[55vh] overflow-auto pr-1">
                {rows.slice(0, 8).map((r) => {
                  const s = extractSummary(r.payload);
                  return (
                    <div
                      key={r.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-100 truncate">
                            {s.vehicle}{" "}
                            <span className="text-slate-400 font-normal">— {s.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* ✅ age badge */}
                          <div className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[11px] text-slate-200 font-semibold">
                            {ageShort(r.created_at)}
                          </div>
                          <div className="text-xs text-slate-500">{formatTime(r.created_at)}</div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 mt-1">{s.message}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 mt-4">
            Tip: keep this tab open. Submit from <span className="text-slate-300">/c/{shopSlug}</span>{" "}
            and you should see the row appear within 1–5 seconds.
          </div>
        </div>
      </div>
    </div>
  );
}