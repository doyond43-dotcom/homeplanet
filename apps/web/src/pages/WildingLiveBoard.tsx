import React, { useMemo, useState } from "react";

type JobStage =
  | "scheduled"
  | "measured"
  | "estimate_sent"
  | "ordered"
  | "installed"
  | "done";

type ScopeType =
  | "screen_repair"
  | "screen_door"
  | "pool_enclosure"
  | "porch_rescreen"
  | "trim_caulking"
  | "custom";

type ScopeItem = {
  id: string;
  title: string;
  kind: ScopeType;
  measurements: string;
};

type MaterialItem = {
  id: string;
  label: string;
  addedBy: string;
  checked: boolean;
  timeLabel: string;
};

type Job = {
  id: string;
  jobNo: number;
  title: string;
  customer: string;
  address: string;
  phone: string;
  email: string;
  appointment: string;
  assignedCrew: string;
  stage: JobStage;
  scopeItems: ScopeItem[];
  materials: MaterialItem[];
  notes: string;
  estimateAmount?: number;
};

const stageMeta: Array<{
  id: JobStage;
  label: string;
  accent: string;
  chip: string;
}> = [
  {
    id: "scheduled",
    label: "Scheduled",
    accent: "border-cyan-400/35",
    chip: "text-cyan-200 border-cyan-400/25 bg-cyan-500/10",
  },
  {
    id: "measured",
    label: "Measured",
    accent: "border-emerald-400/35",
    chip: "text-emerald-200 border-emerald-400/25 bg-emerald-500/10",
  },
  {
    id: "estimate_sent",
    label: "Estimate Sent",
    accent: "border-fuchsia-400/35",
    chip: "text-fuchsia-200 border-fuchsia-400/25 bg-fuchsia-500/10",
  },
  {
    id: "ordered",
    label: "Ordered",
    accent: "border-amber-400/35",
    chip: "text-amber-200 border-amber-400/25 bg-amber-500/10",
  },
  {
    id: "installed",
    label: "Installed",
    accent: "border-lime-400/35",
    chip: "text-lime-200 border-lime-400/25 bg-lime-500/10",
  },
  {
    id: "done",
    label: "Done",
    accent: "border-white/10",
    chip: "text-white/70 border-white/10 bg-white/5",
  },
];

function stageLabel(stage: JobStage) {
  return stageMeta.find((s) => s.id === stage)?.label ?? stage;
}

function seedJobs(): Job[] {
  return [
    {
      id: "w-501",
      jobNo: 501,
      title: "Pool Enclosure Screen Repair",
      customer: "Maria Johnson",
      address: "214 SW 8th Ave, Okeechobee, FL 34974",
      phone: "(555) 201-8891",
      email: "maria.j@example.com",
      appointment: "2026-03-12 09:30",
      assignedCrew: "Crew 1",
      stage: "scheduled",
      scopeItems: [
        {
          id: "scope-501-a",
          title: "North Wall Panel",
          kind: "pool_enclosure",
          measurements: "Panel 1: 33 x 68\nPanel 2: 36 x 72",
        },
      ],
      materials: [
        {
          id: "mat-501-a",
          label: "Roll of screen",
          addedBy: "Danny",
          checked: true,
          timeLabel: "9:10 AM",
        },
        {
          id: "mat-501-b",
          label: "Spline .140",
          addedBy: "Danny",
          checked: false,
          timeLabel: "9:11 AM",
        },
      ],
      notes: "Customer wants the tear addressed first. Gate side panel also loose.",
      estimateAmount: 420,
    },
    {
      id: "w-502",
      jobNo: 502,
      title: "Front Porch Rescreen",
      customer: "Angela Smith",
      address: "Port St. Lucie, FL",
      phone: "(555) 420-1190",
      email: "angela.smith@example.com",
      appointment: "2026-03-12 01:00",
      assignedCrew: "Crew 2",
      stage: "measured",
      scopeItems: [
        {
          id: "scope-502-a",
          title: "Porch Opening A",
          kind: "porch_rescreen",
          measurements: "48 x 82",
        },
        {
          id: "scope-502-b",
          title: "Porch Opening B",
          kind: "porch_rescreen",
          measurements: "42 x 82",
        },
      ],
      materials: [
        {
          id: "mat-502-a",
          label: "Charcoal screen roll",
          addedBy: "Austin",
          checked: true,
          timeLabel: "10:45 AM",
        },
        {
          id: "mat-502-b",
          label: "Spline tool from shop",
          addedBy: "Austin",
          checked: false,
          timeLabel: "10:46 AM",
        },
      ],
      notes: "Homeowner prefers darker screen mesh if available.",
      estimateAmount: 565,
    },
    {
      id: "w-503",
      jobNo: 503,
      title: "Screen Door Replacement",
      customer: "Robert Diaz",
      address: "Jensen Beach, FL",
      phone: "(555) 999-2201",
      email: "robert.diaz@example.com",
      appointment: "2026-03-13 11:00",
      assignedCrew: "Crew 1",
      stage: "estimate_sent",
      scopeItems: [
        {
          id: "scope-503-a",
          title: "Rear Patio Door",
          kind: "screen_door",
          measurements: "36 x 80",
        },
      ],
      materials: [
        {
          id: "mat-503-a",
          label: "Door closer",
          addedBy: "Danny",
          checked: false,
          timeLabel: "11:15 AM",
        },
        {
          id: "mat-503-b",
          label: "New door handle kit",
          addedBy: "Danny",
          checked: false,
          timeLabel: "11:16 AM",
        },
      ],
      notes: "Estimate text already sent. Waiting on approval.",
      estimateAmount: 285,
    },
    {
      id: "w-504",
      jobNo: 504,
      title: "Lanai Screen Material Order",
      customer: "Carol Bennett",
      address: "Fort Pierce, FL",
      phone: "(555) 288-5522",
      email: "carol.bennett@example.com",
      appointment: "2026-03-14 08:30",
      assignedCrew: "Crew 3",
      stage: "ordered",
      scopeItems: [
        {
          id: "scope-504-a",
          title: "Lanai West Side",
          kind: "screen_repair",
          measurements: "Panel 1: 40 x 76\nPanel 2: 40 x 76\nPanel 3: 28 x 76",
        },
      ],
      materials: [
        {
          id: "mat-504-a",
          label: "Super screen order placed",
          addedBy: "Shop",
          checked: true,
          timeLabel: "2:20 PM",
        },
        {
          id: "mat-504-b",
          label: "Black spline",
          addedBy: "Shop",
          checked: true,
          timeLabel: "2:21 PM",
        },
      ],
      notes: "Material order placed yesterday. Waiting on delivery.",
      estimateAmount: 760,
    },
    {
      id: "w-505",
      jobNo: 505,
      title: "Patio Repair Completed",
      customer: "Sean Driscoll",
      address: "Palm City, FL",
      phone: "(555) 288-7000",
      email: "sdriscoll@example.com",
      appointment: "2026-03-11 02:00",
      assignedCrew: "Crew 2",
      stage: "installed",
      scopeItems: [
        {
          id: "scope-505-a",
          title: "Back Porch Section",
          kind: "screen_repair",
          measurements: "54 x 90",
        },
        {
          id: "scope-505-b",
          title: "Trim / Caulk Touchup",
          kind: "trim_caulking",
          measurements: "South frame cleanup",
        },
      ],
      materials: [
        {
          id: "mat-505-a",
          label: "Flashing tape",
          addedBy: "Austin",
          checked: true,
          timeLabel: "4:00 PM",
        },
        {
          id: "mat-505-b",
          label: "Sealant",
          addedBy: "Austin",
          checked: true,
          timeLabel: "4:02 PM",
        },
      ],
      notes: "Installed clean. Photos still needed before moving to done.",
      estimateAmount: 490,
    },
  ];
}

function scopeKindLabel(kind: ScopeType) {
  switch (kind) {
    case "screen_repair":
      return "Screen Repair";
    case "screen_door":
      return "Door";
    case "pool_enclosure":
      return "Pool Enclosure";
    case "porch_rescreen":
      return "Porch";
    case "trim_caulking":
      return "Trim";
    default:
      return "Custom";
  }
}

function nextStage(stage: JobStage): JobStage {
  switch (stage) {
    case "scheduled":
      return "measured";
    case "measured":
      return "estimate_sent";
    case "estimate_sent":
      return "ordered";
    case "ordered":
      return "installed";
    case "installed":
      return "done";
    default:
      return "done";
  }
}

export default function WildingDemoBoard() {
  const [jobs, setJobs] = useState<Job[]>(seedJobs());
  const [selectedId, setSelectedId] = useState<string>(seedJobs()[1].id);
  const [quickAddText, setQuickAddText] = useState("");
  const [addedBy, setAddedBy] = useState("2222");

  const selectedJob = jobs.find((j) => j.id === selectedId) ?? jobs[0];

  const grouped = useMemo(() => {
    return stageMeta.map((stage) => ({
      ...stage,
      jobs: jobs.filter((job) => job.stage === stage.id),
    }));
  }, [jobs]);

  function updateSelected(patch: Partial<Job>) {
    if (!selectedJob) return;
    setJobs((prev) =>
      prev.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              ...patch,
            }
          : job
      )
    );
  }

  function updateScope(scopeId: string, measurements: string) {
    if (!selectedJob) return;
    setJobs((prev) =>
      prev.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              scopeItems: job.scopeItems.map((scope) =>
                scope.id === scopeId ? { ...scope, measurements } : scope
              ),
            }
          : job
      )
    );
  }

  function addScope(kind: ScopeType) {
    if (!selectedJob) return;

    const titleMap: Record<ScopeType, string> = {
      screen_repair: "Screen Repair",
      screen_door: "Door Install",
      pool_enclosure: "Pool Enclosure Repair",
      porch_rescreen: "Porch Rescreen",
      trim_caulking: "Trim + Caulk Touchup",
      custom: "Custom Scope",
    };

    const newScope: ScopeItem = {
      id: `scope-${Date.now()}`,
      kind,
      title: titleMap[kind],
      measurements: "",
    };

    updateSelected({
      scopeItems: [...selectedJob.scopeItems, newScope],
    });
  }

  function removeScope(scopeId: string) {
    if (!selectedJob) return;
    updateSelected({
      scopeItems: selectedJob.scopeItems.filter((s) => s.id !== scopeId),
    });
  }

  function addMaterial(label: string) {
    if (!selectedJob || !label.trim()) return;

    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      label: label.trim(),
      addedBy,
      checked: false,
      timeLabel: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    updateSelected({
      materials: [newItem, ...selectedJob.materials],
    });
  }

  function addQuickLines() {
    const lines = quickAddText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!selectedJob || lines.length === 0) return;

    const newItems: MaterialItem[] = lines.map((line, idx) => ({
      id: `mat-${Date.now()}-${idx}`,
      label: line,
      addedBy,
      checked: false,
      timeLabel: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    }));

    updateSelected({
      materials: [...newItems, ...selectedJob.materials],
    });

    setQuickAddText("");
  }

  function toggleMaterial(itemId: string) {
    if (!selectedJob) return;
    updateSelected({
      materials: selectedJob.materials.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    });
  }

  function removeMaterial(itemId: string) {
    if (!selectedJob) return;
    updateSelected({
      materials: selectedJob.materials.filter((item) => item.id !== itemId),
    });
  }

  function moveSelectedTo(stage: JobStage) {
    if (!selectedJob) return;
    updateSelected({ stage });
  }

  function advanceSelected() {
    if (!selectedJob) return;
    updateSelected({ stage: nextStage(selectedJob.stage) });
  }

  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_25%)]" />

        <div className="relative mx-auto max-w-[1680px] px-4 py-5 md:px-6">
          <header className="mb-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-[38px] font-semibold tracking-tight text-white">
                  Wilding — Live Board
                </h1>
                <p className="mt-1 text-sm text-white/65">
                  Screen repair workflow • measurements • materials • notes • estimate + invoice
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                  Hide Panels
                </button>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                  Grab Code <span className="ml-2 font-semibold text-white">2222 ▾</span>
                </div>

                <button className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 py-2 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/20">
                  Generate Invoice
                </button>
              </div>
            </div>
          </header>

          <section className="mb-4 grid gap-3 xl:grid-cols-6">
            {grouped.map((stage) => (
              <div
                key={stage.id}
                className={`rounded-[24px] border ${stage.accent} bg-white/[0.06] p-3 shadow-xl shadow-black/20 backdrop-blur`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-lg font-semibold text-white">{stage.label}</div>
                  <div className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stage.chip}`}>
                    {stage.jobs.length}
                  </div>
                </div>

                <div className="space-y-2">
                  {stage.jobs.length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-6 text-sm text-white/30">
                      No jobs
                    </div>
                  )}

                  {stage.jobs.map((job) => {
                    const isSelected = selectedJob?.id === job.id;
                    return (
                      <button
                        key={job.id}
                        onClick={() => setSelectedId(job.id)}
                        className={`w-full rounded-[18px] border p-3 text-left transition ${
                          isSelected
                            ? "border-cyan-400/45 bg-cyan-500/10"
                            : "border-white/10 bg-[#111d2e] hover:bg-[#152338]"
                        }`}
                      >
                        <div className="truncate text-lg font-semibold text-white">
                          {job.title}
                        </div>
                        <div className="mt-1 text-sm text-white/72">{job.customer}</div>
                        <div className="mt-1 text-xs text-white/45">
                          {job.appointment} • {job.assignedCrew}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h2 className="text-[32px] font-semibold tracking-tight text-white">
                  Job Drawer
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Click a job in lanes to load details
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                  Copy Tech Text
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                  Send SMS
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10">
                  Email
                </button>
              </div>
            </div>

            {selectedJob && (
              <div className="grid gap-4 xl:grid-cols-[1fr_1fr_1.05fr]">
                <div className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                  <div className="mb-3 text-xl font-semibold text-white">Customer</div>

                  <div className="space-y-1 text-[17px] text-white/88">
                    <div className="font-semibold">{selectedJob.customer}</div>
                    <div>{selectedJob.address}</div>
                    <div>{selectedJob.phone}</div>
                    <div>{selectedJob.email}</div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-sm text-white/50">Appointment</div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {selectedJob.appointment} • {selectedJob.assignedCrew}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-sm text-white/50">Stage</div>
                    <div className="flex flex-wrap gap-2">
                      {stageMeta.map((stage) => (
                        <button
                          key={stage.id}
                          onClick={() => moveSelectedTo(stage.id)}
                          className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                            selectedJob.stage === stage.id
                              ? stage.chip
                              : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {stage.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      onClick={advanceSelected}
                      className="rounded-2xl border border-cyan-400/30 bg-cyan-500/12 px-4 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/18"
                    >
                      Advance Stage
                    </button>
                    <button className="rounded-2xl border border-emerald-400/30 bg-emerald-500/12 px-4 py-3 text-sm font-semibold text-emerald-100 hover:bg-emerald-500/18">
                      Invoice Ready
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-sm text-white/50">Estimate Amount</div>
                    <div className="mt-1 text-2xl font-semibold text-white">
                      ${selectedJob.estimateAmount?.toLocaleString() ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-xl font-semibold text-white">
                      Scope + Measurements
                    </div>
                    <div className="text-sm text-white/50">
                      {selectedJob.scopeItems.length} areas
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    <QuickScopeButton label="+ SCREEN" onClick={() => addScope("screen_repair")} />
                    <QuickScopeButton label="+ DOOR" onClick={() => addScope("screen_door")} />
                    <QuickScopeButton label="+ ENCLOSURE" onClick={() => addScope("pool_enclosure")} />
                    <QuickScopeButton label="+ PORCH" onClick={() => addScope("porch_rescreen")} />
                    <QuickScopeButton label="+ TRIM" onClick={() => addScope("trim_caulking")} />
                    <QuickScopeButton label="+ CUSTOM" onClick={() => addScope("custom")} />
                  </div>

                  <div className="space-y-4">
                    {selectedJob.scopeItems.map((scope) => (
                      <div
                        key={scope.id}
                        className="rounded-[20px] border border-white/10 bg-white/[0.04] p-3"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
                              {scopeKindLabel(scope.kind)}
                            </span>
                            <span className="text-lg font-semibold text-white">
                              {scope.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
                              Mic
                            </button>
                            <button
                              onClick={() => removeScope(scope.id)}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={scope.measurements}
                          onChange={(e) => updateScope(scope.id, e.target.value)}
                          rows={5}
                          className="w-full rounded-2xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white outline-none placeholder:text-white/30"
                          placeholder="Enter measurements, panel count, spline notes, or repair details..."
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xl font-semibold text-white">
                        Materials Grab List
                      </div>
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
                        Copy Grab List
                      </button>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      <MiniAction onClick={() => addMaterial("Window screen roll")}>
                        + Window install
                      </MiniAction>
                      <MiniAction onClick={() => addMaterial("Screen door hardware kit")}>
                        + Door install
                      </MiniAction>
                      <MiniAction onClick={() => addMaterial("Charcoal repair screen")}>
                        + Screen repair
                      </MiniAction>
                      <MiniAction onClick={() => addMaterial("Trim + caulk touchup")}>
                        + Trim + caulk touchup
                      </MiniAction>
                    </div>

                    <div className="mb-3">
                      <div className="mb-2 text-sm text-white/55">Quick Add (one per line)</div>
                      <textarea
                        value={quickAddText}
                        onChange={(e) => setQuickAddText(e.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white outline-none placeholder:text-white/30"
                        placeholder={"Roll of screen\n4 rolls spline\nGrab 2 spline tool from the shop"}
                      />
                    </div>

                    <div className="mb-4 flex items-center justify-between gap-3">
                      <button
                        onClick={addQuickLines}
                        className="rounded-2xl border border-white/10 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
                      >
                        Add Lines
                      </button>

                      <div className="text-sm text-white/55">
                        Added by:
                        <input
                          value={addedBy}
                          onChange={(e) => setAddedBy(e.target.value)}
                          className="ml-2 w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-right text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedJob.materials.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-white/[0.03] p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <label className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleMaterial(item.id)}
                                className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                              />
                              <div className="min-w-0">
                                <div className={`text-base font-medium ${item.checked ? "text-emerald-100" : "text-white"}`}>
                                  {item.label}
                                </div>
                                <div className="mt-1 text-xs text-white/45">
                                  {item.addedBy} • {item.timeLabel}
                                </div>
                              </div>
                            </label>
                          </div>

                          <button
                            onClick={() => removeMaterial(item.id)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-[#0c1623] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xl font-semibold text-white">
                        Technician Notes
                      </div>
                      <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10">
                        Mic
                      </button>
                    </div>

                    <textarea
                      value={selectedJob.notes}
                      onChange={(e) => updateSelected({ notes: e.target.value })}
                      rows={8}
                      className="w-full rounded-2xl border border-white/10 bg-[#111d2e] p-3 text-sm text-white outline-none placeholder:text-white/30"
                      placeholder="Unload on the south side, gate code, trim touchup, customer preference, photos needed..."
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function QuickScopeButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/88 hover:bg-white/10"
    >
      {label}
    </button>
  );
}

function MiniAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white/88 hover:bg-white/10"
    >
      {children}
    </button>
  );
}