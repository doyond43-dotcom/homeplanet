// apps/web/src/routes/LiveIntakeBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

/* ---------- types ---------- */

type JobStage = "diagnosing" | "waiting_parts" | "repairing" | "done";

type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;
  current_stage: JobStage | null;
  stage_updated_at?: string | null;
  stage_updated_by_employee_code?: string | null;
  handled_by_employee_code?: string | null;
};

/* ---------- constants ---------- */

const STAGES = [
  { key: "diagnosing", label: "Diagnosing", help: "Inspection / diagnosis in progress" },
  { key: "waiting_parts", label: "Waiting Parts", help: "Blocked waiting on parts" },
  { key: "repairing", label: "Repairing", help: "Repair work underway" },
  { key: "done", label: "Done", help: "Completed (removes from board)" },
] as const;

/* ---------- helpers ---------- */

function isQuickJob(payload: any) {
  const txt = `${payload?.message ?? ""} ${payload?.notes ?? ""} ${payload?.problem ?? ""}`.toLowerCase();
  return /oil|tire|flat|battery|jump|wiper|bulb|light|inspection|rotate|patch|plug/.test(txt);
}

function safeText(x: unknown, max = 140): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function isUuid(v: unknown) {
  return typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

/* ---------- component ---------- */

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const supabase = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    return createClient(url, key, { realtime: { params: { eventsPerSecond: 10 } } });
  }, []);

  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);

  const inFlight = useRef(false);

  /* ---------- load ---------- */

  async function load(reason = "load") {
    if (!supabase || !shopSlug || inFlight.current) return;
    inFlight.current = true;

    const { data } = await supabase
      .from("public_intake_submissions")
      .select("*")
      .eq("slug", shopSlug)
      .neq("current_stage", "done")
      .order("created_at", { ascending: false });

    inFlight.current = false;
    setRows((data as any) || []);
  }

  /* ---------- REALTIME + HEARTBEAT FIX ---------- */

  useEffect(() => {
    if (!supabase || !shopSlug) return;

    let mounted = true;

    const refresh = async (reason: string) => {
      if (!mounted) return;
      await load(reason);
    };

    // initial
    load("initial");

    const channel = supabase
      .channel(`board:${shopSlug}`, {
        config: { broadcast: { ack: true }, presence: { key: shopSlug } },
      })

      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "public_intake_submissions", filter: `slug=eq.${shopSlug}` },
        (payload) => {
          console.log("Realtime intake:", payload);
          refresh("realtime:intake");
        }
      )

      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "job_stage_events", filter: `slug=eq.${shopSlug}` },
        (payload) => {
          console.log("Realtime stage:", payload);
          refresh("realtime:stage");
        }
      )

      .subscribe((status) => console.log("Realtime status:", status));

    // heartbeat fallback (fixes iPad/Safari sleep sockets)
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") load("heartbeat");
    }, 3000);

    const focusRefresh = () => {
      if (document.visibilityState === "visible") load("focus");
    };
    document.addEventListener("visibilitychange", focusRefresh);

    return () => {
      mounted = false;
      clearInterval(poll);
      document.removeEventListener("visibilitychange", focusRefresh);
      supabase.removeChannel(channel);
    };
  }, [supabase, shopSlug]);

  /* ---------- UI ---------- */

  const quick = rows.filter(r => isQuickJob(r.payload));
  const long = rows.filter(r => !isQuickJob(r.payload));

  return (
    <div className="h-screen bg-slate-950 text-white p-6">
      <h1 className="text-xl font-bold mb-4">Employee Board — /live/{shopSlug}/board</h1>

      <div className="grid grid-cols-2 gap-6">
        {[["Quick jobs", quick], ["Longer jobs", long]].map(([title, list]: any) => (
          <div key={title}>
            <div className="text-sm text-slate-400 mb-2">{title}</div>
            <div className="space-y-3">
              {list.map((r: Row) => (
                <div key={r.id}
                  onClick={() => setActive(r)}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-blue-400"
                >
                  <div className="flex justify-between">
                    <div className="font-bold">{safeText(r.payload?.vehicle, 40)}</div>
                    <div className="text-blue-300">{r.current_stage}</div>
                  </div>
                  <div className="text-sm text-slate-300">{safeText(r.payload?.name, 40)}</div>
                  <div className="text-xs text-slate-400 mt-1">{safeText(r.payload?.message, 120)}</div>
                  <div className="text-xs text-slate-500 mt-2">{formatTime(r.created_at)}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}