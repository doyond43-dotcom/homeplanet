// apps/web/src/routes/LiveIntakeBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useParams } from "react-router-dom";

type JobStage = "diagnosing" | "waiting_parts" | "repairing" | "done";

type Row = {
  id: string; // uuid
  created_at: string;
  slug: string;
  payload: any;

  current_stage: JobStage | null;
  stage_updated_at?: string | null;
  stage_updated_by_employee_code?: string | null;
  handled_by_employee_code?: string | null;
};

const STAGES: { key: JobStage; label: string; help: string }[] = [
  { key: "diagnosing", label: "Diagnosing", help: "Inspection / diagnosis in progress" },
  { key: "waiting_parts", label: "Waiting Parts", help: "Blocked waiting on parts" },
  { key: "repairing", label: "Repairing", help: "Repair work underway" },
  { key: "done", label: "Done", help: "Completed (removes from board)" },
];

function isQuickJob(payload: any) {
  const p = payload ?? {};
  const txt = `${p.message ?? ""} ${p.notes ?? ""} ${p.problem ?? ""}`.toLowerCase();
  return /oil|tire|flat|battery|jump|wiper|bulb|light|inspection|rotate|patch|plug/.test(txt);
}

function safeText(x: unknown, max = 140): string {
  const s = (typeof x === "string" ? x : JSON.stringify(x ?? "")).replace(/\s+/g, " ").trim();
  if (!s) return "";
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function stageColor(p_stage: string) {
  switch (stage) {
    case "diagnosing":
      return "text-blue-300";
    case "waiting_parts":
      return "text-orange-300";
    case "repairing":
      return "text-emerald-300";
    case "done":
      return "text-green-300";
    default:
      return "text-slate-300";
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function LiveIntakeBoard() {
  const { slug } = useParams();
  const shopSlug = (slug ?? "").trim();

  const supabase = useMemo(() => {
    const url = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }, []);

  const storageKey = useMemo(() => `hp_employee_code:${shopSlug || "no-slug"}`, [shopSlug]);
  const nameKey = useMemo(() => `hp_employee_name:${shopSlug || "no-slug"}`, [shopSlug]);

  const [employeeCode, setEmployeeCode] = useState<string>(() => localStorage.getItem(storageKey) || "");
  const [employeeName, setEmployeeName] = useState<string>(() => localStorage.getItem(nameKey) || "");
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState<Row | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!shopSlug) return;
    localStorage.setItem(storageKey, employeeCode || "");
    localStorage.setItem(nameKey, employeeName || "");
  }, [employeeCode, employeeName, shopSlug, storageKey, nameKey]);

  async function load(reason = "load") {
    if (!supabase || !shopSlug) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    setErr(null);

    const { data, error } = await supabase
      .from("public_intake_submissions")
      .select(
        [
          "id",
          "created_at",
          "slug",
          "payload",
          "current_stage",
          "stage_updated_at",
          "stage_updated_by_employee_code",
          "handled_by_employee_code",
        ].join(",")
      )
      .eq("slug", shopSlug)
      .neq("current_stage", "done")
      .order("created_at", { ascending: false });

    inFlightRef.current = false;

    if (error) {
      setErr(`[${reason}] ${error.message || String(error)}`);
      return;
    }

    setRows((data as any) || []);
  }

  useEffect(() => {
    load("initial");

    if (!supabase || !shopSlug) return;

    const channel = supabase
      .channel(`board:${shopSlug}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "public_intake_submissions", filter: `slug=eq.${shopSlug}` },
        () => load("realtime:intake")
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "job_stage_events", filter: `slug=eq.${shopSlug}` },
        () => load("realtime:events")
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, shopSlug]);

  async function setJobStage(row: Row, p_stage: JobStage) {
    if (!supabase) return;

    if (!shopSlug) {
      setErr("Missing shop slug in URL. Open /live/<slug>/board and try again.");
      return;
    }

    let code = employeeCode.trim();

    if (!code) {
      const input = window.prompt("Enter your mechanic code (initials or 4-digit PIN):", "");
      code = (input || "").trim();

      if (!code) {
        setErr("Stage change cancelled — employee code required.");
        return;
      }

      setEmployeeCode(code);
      localStorage.setItem(storageKey, code);

      if (!employeeName.trim()) {
        setEmployeeName(code);
        localStorage.setItem(nameKey, code);
      }
    }

    setBusy(true);
    setErr(null);

    const nowIso = new Date().toISOString();
    setRows((prev) =>
      prev
        .map((r) =>
          r.id === row.id
            ? {
                ...r,
                current_stage: stage,
                stage_updated_at: nowIso,
                stage_updated_by_employee_code: code,
                handled_by_employee_code: code,
              }
            : r
        )
        .filter((r) => r.current_stage !== "done")
    );

    if (stage === "done") setActive(null);

    // ✅ Use the NEW unambiguous RPC (prevents overload + signature mismatch hell)
    const res = (await (supabase as any).rpc("hp_set_job_stage", {
      p_shop_slug: shopSlug,
      p_job_id: row.id,
      p_employee_code: code,
      p_stage: stage,
    })) as any;

    setBusy(false);

    if (res?.error) {
      setErr(res.error.message || String(res.error));
      await load("rpc-error-refresh");
      return;
    }

    await load("stage-update");
  }

  const quickRows = rows.filter((r) => isQuickJob(r.payload));
  const longRows = rows.filter((r) => !isQuickJob(r.payload));

  const employeeReady = !!employeeCode.trim();

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-lg font-bold">Employee Board</div>
          <div className="text-xs text-slate-400 truncate">/live/{shopSlug || "no-slug"}/board</div>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder="Employee code"
            className="w-40 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Name (optional)"
            className="w-48 hidden md:block rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <button
            type="button"
            onClick={() => load("manual-refresh")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:border-slate-500"
          >
            Refresh
          </button>
        </div>
      </div>

      {err ? (
        <div className="mx-6 mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      {!employeeReady ? (
        <div className="p-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 max-w-xl">
            <div className="text-xl font-bold">Enter employee code to continue</div>
            <div className="text-sm text-slate-300 mt-2">
              This makes every stage change attributable — and writes an immutable event stamp for proof.
            </div>
            <div className="text-xs text-slate-500 mt-3">Stored locally on this device for this shop slug.</div>
            <div className="text-xs text-slate-500 mt-2">
              (You can also skip this and just change a stage — it will prompt you the first time.)
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className={(active ? "w-2/3" : "w-full") + " p-6 overflow-y-auto"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-2">Quick jobs</div>
                <div className="space-y-3">
                  {quickRows.map((r) => {
                    const stage = (r.current_stage || "diagnosing") as string;
                    const vehicle = safeText(r.payload?.vehicle || "Vehicle", 48);
                    const name = safeText(r.payload?.name || "Customer", 40);
                    const message = safeText(r.payload?.message || "", 140);
                    const lastBy = r.stage_updated_by_employee_code || r.handled_by_employee_code || null;
                    const lastAt = r.stage_updated_at || null;

                    return (
                      <div
                        key={r.id}
                        onClick={() => setActive(r)}
                        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-blue-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-lg">{vehicle}</div>
                          <div className={"text-xs font-semibold " + stageColor(stage)}>
                            {STAGES.find((s) => s.key === stage)?.label ?? stage}
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">{name}</div>
                        <div className="text-xs text-slate-400 mt-1">{message}</div>

                        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{formatTime(r.created_at)}</span>
                          {lastBy && (
                            <span className="text-slate-400">
                              Last:{" "}
                              <span className="text-slate-200 font-semibold">
                                {lastBy}
                                {lastAt ? ` @ ${formatTime(lastAt)}` : ""}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {quickRows.length === 0 ? <div className="text-sm text-slate-500">No quick jobs yet.</div> : null}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-semibold mb-2">Longer jobs</div>
                <div className="space-y-3">
                  {longRows.map((r) => {
                    const stage = (r.current_stage || "diagnosing") as string;
                    const vehicle = safeText(r.payload?.vehicle || "Vehicle", 48);
                    const name = safeText(r.payload?.name || "Customer", 40);
                    const message = safeText(r.payload?.message || "", 140);
                    const lastBy = r.stage_updated_by_employee_code || r.handled_by_employee_code || null;
                    const lastAt = r.stage_updated_at || null;

                    return (
                      <div
                        key={r.id}
                        onClick={() => setActive(r)}
                        className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-4 hover:border-blue-400"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-bold text-lg">{vehicle}</div>
                          <div className={"text-xs font-semibold " + stageColor(stage)}>
                            {STAGES.find((s) => s.key === stage)?.label ?? stage}
                          </div>
                        </div>
                        <div className="text-sm text-slate-300">{name}</div>
                        <div className="text-xs text-slate-400 mt-1">{message}</div>

                        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{formatTime(r.created_at)}</span>
                          {lastBy && (
                            <span className="text-slate-400">
                              Last:{" "}
                              <span className="text-slate-200 font-semibold">
                                {lastBy}
                                {lastAt ? ` @ ${formatTime(lastAt)}` : ""}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {longRows.length === 0 ? <div className="text-sm text-slate-500">No longer jobs yet.</div> : null}
                </div>
              </div>
            </div>
          </div>

          {active ? (
            <div className="w-1/3 border-l border-slate-800 bg-slate-900 p-6 overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold mb-1 truncate">
                    {safeText(active.payload?.vehicle || "Vehicle", 60)}
                  </h2>
                  <div className="text-sm text-slate-300">{safeText(active.payload?.name || "Customer", 60)}</div>
                  <div className="text-xs text-slate-500 mt-1">{formatTime(active.created_at)}</div>
                </div>
                <button
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm hover:border-slate-500"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>

              <div className="text-sm text-slate-300 mt-4 rounded-xl border border-slate-800 bg-slate-950/30 p-3 whitespace-pre-wrap">
                {active.payload?.message || "No message"}
              </div>

              <div className="text-xs text-slate-400 mt-5 mb-2">Set Stage (provably stamped to employee code)</div>

              <div className="grid grid-cols-1 gap-2">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    disabled={busy}
                    className={[
                      "w-full p-3 rounded-xl border text-left",
                      "border-slate-700 bg-slate-800/40 hover:bg-slate-800/70",
                      busy ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                    onClick={() => setJobStage(active, s.key)}
                  >
                    <div className={"font-semibold " + stageColor(s.key)}>{s.label}</div>
                    <div className="text-[11px] text-slate-400">{s.help}</div>
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 mt-4">
                Active employee:{" "}
                <span className="text-slate-200 font-semibold">
                  {employeeName || "Employee"} ({employeeCode || "—"})
                </span>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

