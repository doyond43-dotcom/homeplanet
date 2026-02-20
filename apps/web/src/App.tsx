import { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

import LiveIntakeBoard from "./routes/LiveIntakeBoard";
import AtmosphereDemoStrip from "./atmosphere/AtmosphereDemoStrip";

import MLSLanding from "./pages/MLSLanding";
import TaylorCreekSite from "./routes/TaylorCreekSite";
import PublicPage from "./routes/PublicPage";
import CityRoutes from "./routes/CityRoutes";

type IntakeRow = {
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

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function extractPublic(payload: any) {
  const p = payload ?? {};
  const nameRaw =
    safeText(p.name || p.customer_name || p.first_name || p.full_name || "", 48) || "Customer";

  // Convert to “First L.” where possible (privacy-safe for TV)
  const parts = nameRaw.split(" ").filter(Boolean);
  const first = parts[0] || "Customer";
  const lastInitial = parts.length > 1 ? (parts[parts.length - 1]?.[0] || "").toUpperCase() : "";
  const displayName = lastInitial ? `${first} ${lastInitial}.` : first;

  const vehicle =
    safeText(p.vehicle || p.car || p.make_model || p.vehicle_info || p.vehicleText || "", 42) ||
    "Vehicle";

  return { displayName, vehicle };
}

function LiveShopTV() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const [rows, setRows] = useState<IntakeRow[]>([]);
  const [status, setStatus] = useState("Loading…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);

  const inFlightLoadRef = useRef(false);

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
      setStatus("Missing slug");
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
      .limit(18);

    inFlightLoadRef.current = false;

    if (error) {
      setLastErr(error.message || String(error));
      setStatus("Load failed");
      setConnected(false);
      return;
    }

    setRows((data ?? []) as IntakeRow[]);
    setConnected(true);
    setStatus("Live");
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

    setStatus("Live");
    setConnected(true);

    const channel = supabase
      .channel(`tv:${shopSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "public_intake_submissions",
          filter: `slug=eq.${shopSlug}`,
        },
        () => {
          // keep it simple + correct: refresh list
          loadLatest("Updating…");
          setTimeout(() => setStatus("Live"), 800);
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
        () => {
          loadLatest("Updating…");
          setTimeout(() => setStatus("Live"), 800);
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

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, supabase]);

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 p-5 md:p-7 overflow-hidden">
      <div className="w-full h-full max-w-none mx-auto">
        <div
          className="h-full rounded-2xl border border-slate-800 bg-slate-950/40 p-6 md:p-7"
          style={{
            boxShadow:
              "0 0 0 1px rgba(148,163,184,.25), 0 0 40px rgba(59,130,246,.10), 0 0 90px rgba(16,185,129,.06)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold leading-tight">Taylor Creek Auto Repair</div>
              <div className="text-slate-400 mt-1">
                Live queue • <span className="text-slate-200 font-semibold">/{shopSlug || "no-slug"}</span>
              </div>
            </div>

            <div className="text-right">
              <div
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
                  connected ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-slate-700 bg-slate-950/60 text-slate-200",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-2 w-2 rounded-full",
                    connected ? "bg-emerald-400" : "bg-slate-500",
                  ].join(" ")}
                />
                {connected ? status : "Reconnecting…"}
              </div>

              <div className="text-xs text-slate-500 mt-2">
                Total: <span className="text-slate-200 font-semibold">{rows.length}</span>
              </div>
            </div>
          </div>

          {lastErr ? (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {lastErr}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
              <div className="text-xs text-slate-400 font-semibold">Now in queue</div>

              <div className="mt-3 space-y-2 max-h-[65vh] overflow-auto pr-1">
                {rows.length === 0 ? (
                  <div className="text-slate-400">No arrivals yet.</div>
                ) : (
                  rows.map((r, idx) => {
                    const pub = extractPublic(r.payload);
                    const isTop = idx === 0;
                    return (
                      <div
                        key={r.id}
                        className={[
                          "rounded-xl border px-4 py-3",
                          isTop
                            ? "border-blue-400/40 bg-blue-500/10"
                            : "border-slate-800 bg-slate-950/20",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-lg font-bold truncate">
                              {pub.vehicle}
                              <span className="text-slate-400 font-semibold"> — {pub.displayName}</span>
                            </div>
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="text-xs text-slate-500">{formatTime(r.created_at)}</div>
                            <div className="mt-1 inline-flex items-center gap-2">
                              <div className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[11px] text-slate-200 font-semibold">
                                {ageShort(r.created_at)}
                              </div>
                              {r.converted_service_id ? (
                                <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-100 font-semibold">
                                  In progress
                                </div>
                              ) : (
                                <div className="rounded-full border border-slate-700 bg-slate-950/40 px-2 py-0.5 text-[11px] text-slate-200 font-semibold">
                                  Waiting
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
              <div className="text-xs text-slate-400 font-semibold">Customer info</div>
              <div className="mt-3 text-slate-200 leading-relaxed">
                If you just submitted, you’re in the system.
                <div className="text-slate-400 mt-2">
                  Staff will call you when ready.
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/20 p-4">
                <div className="text-xs text-slate-400 font-semibold">Submit a request</div>
                <div className="text-slate-200 mt-2 break-all">
                  homeplanet.city/c/{shopSlug || "taylor-creek"}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  (This TV screen does not show phone numbers or full notes.)
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Staff board (private): <span className="text-slate-300">/live/{shopSlug || "taylor-creek"}/board</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 mt-5">
            HomePlanet • Presence-first intake • TV mode (privacy safe)
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  HomePlanet Routing Layer
  ------------------------
  /                   -> redirect to /city (planet index)
  /city/*             -> city navigation
  /taylor-creek       -> shop marketing page
  /c/:slug            -> customer intake page (QR)
  /live/:slug         -> shop TV display (privacy-safe)
  /live/:slug/board   -> employee live dashboard (private)
*/

export default function App() {
  return (
    <BrowserRouter>
      <AtmosphereDemoStrip />

      <Routes>
        {/* ROOT: always go to Cities index */}
        <Route path="/" element={<Navigate to="/city" replace />} />

        {/* LIVE SHOP ROUTES — KEEP ABOVE /c/:slug */}
        <Route path="/live/:slug/board" element={<LiveIntakeBoard />} />
        <Route path="/live/:slug" element={<LiveShopTV />} />

        {/* City index + navigation */}
        <Route path="/city" element={<CityRoutes />} />
        <Route path="/city/*" element={<CityRoutes />} />

        {/* MLS */}
        <Route path="/mls" element={<MLSLanding />} />

        {/* Shop marketing page */}
        <Route path="/taylor-creek" element={<TaylorCreekSite />} />

        {/* PUBLIC CUSTOMER INTAKE (QR) */}
        <Route path="/c/:slug" element={<PublicPage />} />

        {/* fallback */}
        <Route
          path="*"
          element={
            <div style={{ padding: 40 }}>
              404 — Location not found
              <br />
              This place doesn't exist on HomePlanet yet.
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}





























