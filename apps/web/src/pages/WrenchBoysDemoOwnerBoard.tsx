import { useEffect, useMemo, useState } from "react";
import WorkOrderDrawer, {
  type JobStage,
  type Row,
} from "../routes/WorkOrderDrawer";
import {
  readWrenchBoysJobs,
  subscribeToWrenchBoysJobs,
  updateWrenchBoysJobStage,
} from "../lib/wrenchBoysDemoStore";

const STAGES: { key: JobStage; label: string }[] = [
  { key: "diagnosing", label: "Needs Attention" },
  { key: "waiting_parts", label: "Waiting Parts" },
  { key: "repairing", label: "Repairing" },
  { key: "done", label: "Done" },
];

function stageLabel(stage?: JobStage | null) {
  return STAGES.find((item) => item.key === stage)?.label || "Needs Attention";
}

function stageColor(stage?: JobStage | null) {
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
      return "text-zinc-300";
  }
}

function stagePanelTone(stage: JobStage) {
  switch (stage) {
    case "diagnosing":
      return "border-blue-500/15";
    case "waiting_parts":
      return "border-orange-500/20";
    case "repairing":
      return "border-emerald-500/15";
    case "done":
      return "border-green-500/15";
  }
}

export default function WrenchBoysDemoOwnerBoard() {
  const [rows, setRows] = useState<Row[]>(() => readWrenchBoysJobs());
  const [active, setActive] = useState<Row | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const ownerCode = "WB-OWNER";
  const ownerName = "Owner Demo";

  useEffect(() => {
    return subscribeToWrenchBoysJobs(() => {
      const nextRows = readWrenchBoysJobs();
      setRows(nextRows);

      setActive((current) => {
        if (!current) return null;
        return nextRows.find((row) => row.id === current.id) || null;
      });
    });
  }, []);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return rows;

    return rows.filter((row) => {
      const payload = row.payload || {};

      const searchable = [
        row.id,
        payload.name,
        payload.phone,
        payload.vehicle,
        payload.service,
        payload.service_choice,
        payload.checkIn,
        payload.checkin_mode,
        payload.message,
        payload.receipt,
        payload.receipt_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [rows, searchQuery]);

  const counts = useMemo(
    () => ({
      active: rows.filter((row) => row.current_stage !== "done").length,
      attention: rows.filter((row) => row.current_stage === "diagnosing").length,
      waiting: rows.filter((row) => row.current_stage === "waiting_parts").length,
      repairing: rows.filter((row) => row.current_stage === "repairing").length,
    }),
    [rows]
  );

  function rowsForStage(stage: JobStage) {
    return filteredRows.filter(
      (row) => (row.current_stage || "diagnosing") === stage
    );
  }

  function setJobStage(row: Row, stage: JobStage) {
    const nextRows = updateWrenchBoysJobStage(
      row.id,
      stage,
      ownerCode
    );

    setRows(nextRows);
    setActive(nextRows.find((item) => item.id === row.id) || null);
  }

  function JobCard({ row }: { row: Row }) {
    return (
      <button
        type="button"
        onClick={() => setActive(row)}
        className="w-full rounded-2xl border border-zinc-800 bg-black p-4 text-left transition hover:border-orange-500/60"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-black text-white">
              {row.payload?.vehicle || "Vehicle"}
            </div>

            <div className="mt-1 truncate text-sm text-zinc-400">
              {row.payload?.name || "Customer"}
            </div>
          </div>

          <div
            className={`shrink-0 text-[10px] font-black uppercase tracking-[0.12em] ${stageColor(
              row.current_stage
            )}`}
          >
            {stageLabel(row.current_stage)}
          </div>
        </div>

        <div className="mt-3 text-sm leading-6 text-zinc-300">
          {row.payload?.message || row.payload?.service || "Service request"}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-900 pt-3">
          <span className="text-xs text-zinc-600">
            {row.payload?.receipt_id || row.id}
          </span>

          <span className="text-xs font-bold text-orange-500">
            Open Job
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-950 px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
              Wrench Boys Auto & Diesel
            </div>

            <h1 className="mt-1 text-2xl font-black">
              Owner Board
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/planet/wrench-boys/staff"
              className="hidden rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-orange-500/60 hover:text-white sm:block"
            >
              Technician Board
            </a>

            <div className="text-right">
              <div className="text-sm font-bold">{ownerName}</div>
              <div className="text-xs text-zinc-500">Live demo</div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <section className="mb-6">
          <label
            htmlFor="wrench-boys-owner-search"
            className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500"
          >
            Find A Job
          </label>

          <div className="relative">
            <input
              id="wrench-boys-owner-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search customer, vehicle, service, phone, or receipt..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 pr-24 text-white outline-none transition placeholder:text-zinc-600 focus:border-orange-500/70"
            />

            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:border-orange-500/60 hover:text-white"
              >
                Clear
              </button>
            ) : null}
          </div>
        </section>

        <section className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-3xl font-black text-white">{counts.active}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Active Jobs
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-4">
            <div className="text-3xl font-black text-blue-300">{counts.attention}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Need Attention
            </div>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-4">
            <div className="text-3xl font-black text-orange-300">{counts.waiting}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Waiting Parts
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
            <div className="text-3xl font-black text-emerald-300">{counts.repairing}</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-500">
              Repairing
            </div>
          </div>
        </section>

        <section className="mb-7 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="text-sm font-black text-orange-400">
            SHOP CONTROL
          </div>

          <div className="mt-1 text-sm leading-6 text-zinc-400">
            See what needs attention, what is waiting on parts, what is being repaired,
            and what has been completed. Open any job for the full service record.
          </div>
        </section>

        {searchQuery && filteredRows.length === 0 ? (
          <div className="mb-7 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            <div className="font-black">No matching jobs</div>
            <div className="mt-1 text-sm text-zinc-500">
              Try a customer, vehicle, service, phone number, or receipt.
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((stage) => {
            const stageRows = rowsForStage(stage.key);

            return (
              <section
                key={stage.key}
                className={`rounded-2xl border bg-zinc-950/40 p-4 ${stagePanelTone(
                  stage.key
                )}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="font-black text-white">
                    {stage.label}
                  </h2>

                  <span className="rounded-full border border-zinc-800 bg-black px-2.5 py-1 text-xs font-bold text-zinc-400">
                    {stageRows.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageRows.length ? (
                    stageRows.map((row) => (
                      <JobCard key={row.id} row={row} />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed border-zinc-800 p-5 text-center text-sm text-zinc-600">
                      No jobs here
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <WorkOrderDrawer
        open={Boolean(active)}
        row={active}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
        employeeCode={ownerCode}
        employeeName={ownerName}
        onStageChange={(stage) => {
          if (!active) return;
          setJobStage(active, stage);
        }}
      />
    </div>
  );
}
