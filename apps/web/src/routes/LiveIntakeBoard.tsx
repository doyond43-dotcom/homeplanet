import React, { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  converted_service_id: string | null;
};

function envAny(keys: string[]): string {
  const e = (import.meta as any)?.env || {};
  for (const k of keys) {
    const v = e[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function safeText(x: unknown, max = 90): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function extractSummary(payload: any) {
  // Lobby-safe summary only. Do NOT show phone/email.
  // We try common keys but fall back safely.
  const p = payload ?? {};
  const name =
    p.name || p.customer_name || p.first_name || p.full_name || p.contact_name || "";
  const vehicle =
    p.vehicle || p.car || p.make_model || p.vehicle_info || p.year_make_model || "";
  const message =
    p.message || p.notes || p.problem || p.issue || p.reason || p.description || "";

  return {
    name: safeText(name, 28) || "New customer",
    vehicle: safeText(vehicle, 42) || "Vehicle not specified",
    message: safeText(message, 120) || "No message provided",
  };
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const supabaseUrl = useMemo(
    () =>
      envAny([
        "VITE_SUPABASE_URL",
        "VITE_PUBLIC_SUPABASE_URL",
        "VITE_SUPABASE_PROJECT_URL",
      ]),
    []
  );

  const supabaseAnon = useMemo(
    () =>
      envAny([
        "VITE_SUPABASE_ANON_KEY",
        "VITE_PUBLIC_SUPABASE_ANON_KEY",
        "VITE_SUPABASE_KEY",
      ]),
    []
  );

  const supabase = useMemo(() => {
    if (!supabaseUrl || !supabaseAnon) return null;
    return createClient(supabaseUrl, supabaseAnon, {
      auth: { persistSession: false },
    });
  }, [supabaseUrl, supabaseAnon]);

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState<string>("Listening…");
  const [connected, setConnected] = useState<boolean>(true);
  const lastBeepRef = useRef<number>(0);

  function softBeep() {
    // Subtle lobby-safe beep (no external asset).
    // Won't fire until user has interacted with the page at least once in some browsers.
    const now = Date.now();
    // anti-spam: max 1 per 2.5s
    if (now - lastBeepRef.current < 2500) return;
    lastBeepRef.current = now;

    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close?.();
      }, 120);
    } catch {
      // ignore
    }
  }

  async function loadInitial() {
    if (!supabase) {
      setStatus("Missing Supabase env (URL/ANON). Board cannot connect.");
      setConnected(false);
      return;
    }
    if (!shopSlug) {
      setStatus("Missing slug in URL. Example: /live/taylor-creek/board");
      return;
    }

    setStatus("Loading recent arrivals…");
    setConnected(true);

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("id, created_at, slug, payload, converted_service_id")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      setStatus("Connection error. Retrying…");
      setConnected(false);
      return;
    }

    setRows((data as any) ?? []);
    setStatus("Listening…");
    setConnected(true);
  }

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, !!supabase]);

  useEffect(() => {
    if (!supabase || !shopSlug) return;

    // Realtime insert listener (works only if Realtime is enabled for this table)
    const ch = supabase
      .channel(`live_intake_${shopSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        (payload) => {
          const row = payload.new as Row;
          setRows((prev) => {
            // de-dupe by id
            if (prev.some((x) => x.id === row.id)) return prev;
            return [row, ...prev].slice(0, 25);
          });
          setStatus("New arrival");
          softBeep();
          setTimeout(() => setStatus("Listening…"), 1500);
        }
      )
      .subscribe((s) => {
        // Best-effort UI state; not all statuses are reliable
        if (s === "SUBSCRIBED") {
          setConnected(true);
        }
      });

    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, !!supabase]);

  // Simple reconnect loop if initial load failed
  useEffect(() => {
    if (connected) return;
    const t = setInterval(() => loadInitial(), 6000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  const visible = rows.slice(0, 7);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold">
              HP
            </div>
            <div>
              <div className="text-lg font-semibold leading-tight">
                LIVE INTAKE — <span className="text-sky-300">{shopSlug || "unknown"}</span>
              </div>
              <div className="text-xs text-slate-400 leading-tight">
                Room board • Read-only • Lobby-safe
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs text-slate-200">
              {status}
            </div>
            <div
              className={
                "rounded-full border px-3 py-1 text-xs " +
                (connected
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-amber-400/40 bg-amber-400/10 text-amber-200")
              }
            >
              {connected ? "Connected" : "Reconnecting…"}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* BIG POP AREA (newest) */}
        {visible[0] ? (
          <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/45 p-7 shadow">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.9), rgba(56,189,248,0.0) 55%)",
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-400">Newest arrival</div>
                  <div className="mt-1 text-2xl font-bold tracking-tight">
                    {extractSummary(visible[0].payload).vehicle}
                  </div>
                  <div className="mt-2 text-base text-slate-200">
                    {extractSummary(visible[0].payload).message}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Time</div>
                  <div className="text-xl font-semibold">{formatTime(visible[0].created_at)}</div>
                  <div className="mt-2 text-xs text-slate-500">Receipt</div>
                  <div className="font-mono text-xs text-slate-200">{visible[0].id}</div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-300/80" />
                <span className="font-semibold">{extractSummary(visible[0].payload).name}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Waiting</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-10 text-center">
            <div className="text-2xl font-bold">Listening…</div>
            <div className="mt-2 text-sm text-slate-400">
              No arrivals yet. This screen will update the moment someone submits.
            </div>
          </div>
        )}

        {/* STACK (compressed) */}
        <div className="mt-8 space-y-3">
          {visible.slice(1).map((r) => {
            const s = extractSummary(r.payload);
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-800 bg-slate-950/35 px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {s.vehicle} <span className="text-slate-500">—</span>{" "}
                    <span className="text-slate-300">{s.message}</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 truncate">
                    {s.name} • {formatTime(r.created_at)} • <span className="font-mono">{r.id}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">
                  {r.converted_service_id ? "Converted" : "Waiting"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs text-slate-500">
          HomePlanet • Presence-first intake • This board shows lobby-safe summaries only.
        </div>
      </div>
    </div>
  );
}
