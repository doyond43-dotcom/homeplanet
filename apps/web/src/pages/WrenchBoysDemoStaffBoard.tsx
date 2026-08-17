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
  { key: "diagnosing", label: "Diagnosing" },
  { key: "waiting_parts", label: "Waiting Parts" },
  { key: "repairing", label: "Repairing" },
  { key: "done", label: "Done" },
];

function isQuickJob(payload: any) {
  const text = `${payload?.message ?? ""} ${payload?.service ?? ""}`.toLowerCase();

  return /oil|tire|battery|brake|inspection|maintenance|rotate/.test(text);
}

function stageLabel(stage?: JobStage | null) {
  return STAGES.find((item) => item.key === stage)?.label || "Diagnosing";
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
      return "text-slate-300";
  }
}

export default function WrenchBoysDemoStaffBoard() {
  const [rows, setRows] = useState<Row[]>(() => readWrenchBoysJobs());
  const [active, setActive] = useState<Row | null>(() => readWrenchBoysJobs()[0] || null);
  const [employeeCode] = useState("WB-DEMO");
  const [employeeName] = useState("Demo Staff");

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const quickRows = useMemo(
    () => filteredRows.filter((row) => isQuickJob(row.payload)),
    [filteredRows]
  );

  const longRows = useMemo(
    () => filteredRows.filter((row) => !isQuickJob(row.payload)),
    [filteredRows]
  );

  function setJobStage(row: Row, stage: JobStage) {
    const nextRows = updateWrenchBoysJobStage(
      row.id,
      stage,
      employeeCode
    );

    setRows(nextRows);

    if (stage === "done") {
      setActive(null);
      return;
    }

    setActive(nextRows.find((item) => item.id === row.id) || null);
  }

  function JobCard({ row }: { row: Row }) {
    return (
      <button
        type="button"
        onClick={() => setActive(row)}
        className="w-full text-left rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-orange-500 transition"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-black text-white truncate">
              {row.payload?.vehicle || "Vehicle"}
            </div>

            <div className="mt-1 text-sm text-zinc-400 truncate">
              {row.payload?.name || "Customer"}
            </div>

            <div className="mt-2 text-sm text-zinc-300">
              {row.payload?.message || row.payload?.service || "Service request"}
            </div>
          </div>

          <div
            className={`shrink-0 text-xs font-black uppercase tracking-wide ${stageColor(
              row.current_stage
            )}`}
          >
            {stageLabel(row.current_stage)}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-950 px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
              Wrench Boys Auto & Diesel
            </div>

            <h1 className="mt-1 text-2xl font-black">
              Technician Board
            </h1>
          </div>

          <div className="text-right">
            <div className="text-sm font-bold">{employeeName}</div>
            <div className="text-xs text-zinc-500">Live demo</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <div className="mb-5">
          <label
            htmlFor="wrench-boys-job-search"
            className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-500"
          >
            Find A Job
          </label>

          <div className="relative">
            <input
              id="wrench-boys-job-search"
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
        </div>

        <div className="mb-6 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="text-sm font-black text-orange-400">
            LIVE WORK
          </div>

          <div className="mt-1 text-sm text-zinc-400">
            Open a vehicle to diagnose, add proof, track parts and labor,
            update the service story, and move the job through completion.
          </div>
        </div>

        {searchQuery && filteredRows.length === 0 ? (
          <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
            <div className="font-black text-white">No matching jobs</div>
            <div className="mt-1 text-sm text-zinc-500">
              Try a customer name, vehicle, service, phone number, or receipt.
            </div>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Quick Service</h2>
              <span className="text-sm text-zinc-500">{quickRows.length}</span>
            </div>

            <div className="space-y-3">
              {quickRows.map((row) => (
                <JobCard key={row.id} row={row} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Repair / Diagnostic</h2>
              <span className="text-sm text-zinc-500">{longRows.length}</span>
            </div>

            <div className="space-y-3">
              {longRows.map((row) => (
                <JobCard key={row.id} row={row} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <WorkOrderDrawer
        open={Boolean(active)}
        row={active}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
        employeeCode={employeeCode}
        employeeName={employeeName}
        onStageChange={(stage) => {
          if (!active) return;
          setJobStage(active, stage);
        }}
      />
    </div>
  );
}

