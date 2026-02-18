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
      safeText(
        p.vehicle || p.car || p.make_model || p.vehicle_info || p.vehicleText || "",
        42
      ) || "Vehicle not specified",
    message: safeText(p.message || p.notes || p.problem || p.issue || "", 160) || "No message provided",
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

  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("Starting…");
  const [connected, setConnected] = useState(false);
  const [lastErr, setLastErr] = useState<string | null>(null);

  const lastBeepRef = useRef<number>(0);

  // ✅ Create ONE Supabase client instance (NOT every render)
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

  async function loadLatest() {
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

    setStatus("Loading…");
    setLastErr(null);

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select("id, created_at, slug, payload, converted_service_id")
      .eq("slug", shopSlug)
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      setLastErr(error.message || String(error));
      setStatus("Load failed");
      setConnected(false);
      return;
    }

    setRows(data ?? []);
    setConnected(true);
    setStatus("Listening…");
  }

  useEffect(() => {
    loadLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug]);

  useEffect(() => {
    if (!supabase || !shopSlug) return;

    setStatus("Listening…");
    setConnected(true);
    setLastErr(null);

    const channel = supabase
      .channel(`live_${shopSlug}`)
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
          setRows((prev) => [row, ...prev].slice(0, 25));
          setStatus("New arrival");
          softBeep();
          setTimeout(() => setStatus("Listening…"), 1200);
        }
      )
      .subscribe((s) => {
        // This helps you see if realtime is actually subscribing
        // (SUBSCRIBED / TIMED_OUT / CHANNEL_ERROR)
        if (s === "SUBSCRIBED") {
          setConnected(true);
          setLastErr(null);
        }
      });

    // ✅ Fallback polling (if realtime websocket flakes, you STILL see new arrivals)
    const poll = window.setInterval(() => {
      loadLatest();
    }, 5000);

    return () => {
      window.clearInterval(poll);
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSlug, supabase]);

  const newest = rows[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
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
              <div className="mt-2 rounded-2xl border border-slate-800 bg-slate-900/30 p-4">
                <div className="text-xl font-bold">{extractSummary(newest.payload).vehicle}</div>
                <div className="text-slate-200 mt-1">{extractSummary(newest.payload).message}</div>
                <div className="text-sm text-slate-400 mt-2">
                  {extractSummary(newest.payload).name} • {formatTime(newest.created_at)}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400 font-semibold">Recent</div>
              <div className="mt-2 space-y-2">
                {rows.slice(0, 8).map((r) => {
                  const s = extractSummary(r.payload);
                  return (
                    <div
                      key={r.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="text-sm font-semibold text-slate-100">
                          {s.vehicle}{" "}
                          <span className="text-slate-400 font-normal">— {s.name}</span>
                        </div>
                        <div className="text-xs text-slate-500">{formatTime(r.created_at)}</div>
                      </div>
                      <div className="text-xs text-slate-300 mt-1">{s.message}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 mt-3">
          Tip: keep this tab open. Submit from <span className="text-slate-300">/c/{shopSlug}</span> and you should see the row appear within 1–5 seconds.
        </div>
      </div>
    </div>
  );
}
