import { useMemo, useState } from "react";

type Stage = "Scheduled" | "Measured" | "Estimate Sent" | "Ordered" | "Installed" | "Done";
type ScopeType = "door" | "window" | "screen" | "trim" | "custom";

type ScopeItem = {
  id: string;
  type: ScopeType;
  label: string;
  quick: string;
  done: boolean;
  createdAt: string;
};

type MaterialItem = {
  id: string;
  name: string;
  qty?: string;
  checked: boolean;
  addedBy: string;
  addedAt: string;
};

type DemoJob = {
  id: string;
  title: string;
  summary: string;
  stage: Stage;
  apptDate: string;
  apptTime: string;
  crew: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  scope_items: ScopeItem[];
  materials: MaterialItem[];
  tech_notes: string;
  updated_at: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function safeToast(msg: string) {
  try {
    alert(msg);
  } catch {
    // noop
  }
}

function copyToClipboard(text: string) {
  const val = (text || "").trim();
  if (!val) {
    safeToast("Nothing to copy.");
    return;
  }

  navigator.clipboard
    .writeText(val)
    .then(() => safeToast("Copied."))
    .catch(() => safeToast("Copy failed."));
}

function safeTimeLabel(isoLike: string) {
  try {
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function stageTone(stage: Stage) {
  switch (stage) {
    case "Scheduled":
      return { lane: "border-l-sky-400/70", pill: "border-sky-300/30 bg-sky-300/15 text-sky-100" };
    case "Measured":
      return { lane: "border-l-emerald-400/80", pill: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100" };
    case "Estimate Sent":
      return { lane: "border-l-violet-400/70", pill: "border-violet-300/30 bg-violet-300/15 text-violet-100" };
    case "Ordered":
      return { lane: "border-l-amber-300/70", pill: "border-amber-300/30 bg-amber-300/15 text-amber-100" };
    case "Installed":
      return { lane: "border-l-lime-300/70", pill: "border-lime-300/30 bg-lime-300/15 text-lime-100" };
    case "Done":
      return { lane: "border-l-slate-300/40", pill: "border-white/10 bg-white/5 text-slate-200" };
    default:
      return { lane: "border-l-emerald-400/60", pill: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100" };
  }
}

function fmtAppt(job: DemoJob) {
  const base = [job.apptDate, job.apptTime].filter(Boolean).join(" ");
  return `${base || "—"}${job.crew ? ` • ${job.crew}` : ""}`;
}

function scopeCounts(items: ScopeItem[]) {
  const doors = items.filter((x) => x.type === "door").length;
  const windows = items.filter((x) => x.type === "window").length;
  const screens = items.filter((x) => x.type === "screen").length;
  const trim = items.filter((x) => x.type === "trim").length;
  const custom = items.filter((x) => x.type === "custom").length;
  return { doors, windows, screens, trim, custom };
}

function nextIndex(items: ScopeItem[], type: ScopeType) {
  return items.filter((x) => x.type === type).length + 1;
}

const MATERIAL_TEMPLATES: Record<string, string[]> = {
  "Pool enclosure repair": ["20/20 screen roll", "Spline .140", "Spline tool", "Screen corners / clips", "Fasteners"],
  "Porch rescreen": ["Charcoal screen roll", "Spline", "Spline tool", "Ladder straps"],
  "Screen door install": ["Door hardware kit", "Closer", "Handle set", "Screws", "Touch-up paint"],
  "Trim + caulk touchup": ["Caulk / sealant", "Painter tape", "Rags / wipes", "Touch-up paint"],
};

const GRAB_CODES = ["2222", "4444", "6666", "8888", "9999"] as const;

function seedJobs(): DemoJob[] {
  return [
    {
      id: "wild-701",
      title: "Pool Enclosure Rescreen",
      summary: "Rear enclosure tear + weak spline edge",
      stage: "Scheduled",
      apptDate: "2026-03-12",
      apptTime: "09:30",
      crew: "Crew 1",
      customer: {
        name: "Maria Johnson",
        phone: "(772) 201-8891",
        email: "mariaj@example.com",
        address: "214 SW 8th Ave, Okeechobee, FL 34974",
      },
      scope_items: [
        {
          id: makeId(),
          type: "screen",
          label: "Panel 1",
          quick: "33 by 68.\nReplace torn lower corner.\nCheck spline all the way around.",
          done: false,
          createdAt: nowIso(),
        },
      ],
      materials: [
        {
          id: makeId(),
          name: "20/20 screen roll",
          qty: "1",
          checked: false,
          addedBy: "2222",
          addedAt: nowIso(),
        },
      ],
      tech_notes: "Customer wants us to start on the south side first.",
      updated_at: nowIso(),
    },
    {
      id: "wild-702",
      title: "Front Porch Rescreen",
      summary: "Multiple front porch openings measured",
      stage: "Measured",
      apptDate: "2026-03-12",
      apptTime: "01:00",
      crew: "Crew 2",
      customer: {
        name: "Angela Smith",
        phone: "(772) 555-1422",
        email: "asmith@example.com",
        address: "Port St. Lucie, FL",
      },
      scope_items: [
        {
          id: makeId(),
          type: "screen",
          label: "Opening 1",
          quick: "48 by 82",
          done: false,
          createdAt: nowIso(),
        },
        {
          id: makeId(),
          type: "screen",
          label: "Opening 2",
          quick: "42 by 82",
          done: false,
          createdAt: nowIso(),
        },
      ],
      materials: [
        {
          id: makeId(),
          name: "Charcoal screen roll",
          qty: "1",
          checked: true,
          addedBy: "2222",
          addedAt: nowIso(),
        },
      ],
      tech_notes: "Measured and ready for estimate.",
      updated_at: nowIso(),
    },
    {
      id: "wild-703",
      title: "Screen Door Replacement",
      summary: "Rear patio door needs full replacement",
      stage: "Estimate Sent",
      apptDate: "2026-03-13",
      apptTime: "11:00",
      crew: "Crew 1",
      customer: {
        name: "Robert Diaz",
        phone: "(772) 777-1199",
        email: "robertdiaz@example.com",
        address: "Jensen Beach, FL",
      },
      scope_items: [
        {
          id: makeId(),
          type: "door",
          label: "Door 1",
          quick: "36 by 80.\nBrown frame.\nNeed closer + handle set.",
          done: false,
          createdAt: nowIso(),
        },
      ],
      materials: [
        {
          id: makeId(),
          name: "Door hardware kit",
          checked: false,
          addedBy: "4444",
          addedAt: nowIso(),
        },
      ],
      tech_notes: "Estimate emailed. Waiting on customer approval.",
      updated_at: nowIso(),
    },
    {
      id: "wild-704",
      title: "Lanai Material Order",
      summary: "Material approved and ordered",
      stage: "Ordered",
      apptDate: "2026-03-14",
      apptTime: "08:30",
      crew: "Crew 3",
      customer: {
        name: "Carol Bennett",
        phone: "(772) 888-4401",
        email: "cbennett@example.com",
        address: "Fort Pierce, FL",
      },
      scope_items: [
        {
          id: makeId(),
          type: "screen",
          label: "West Side Panels",
          quick: "Panel 1: 40 by 76\nPanel 2: 40 by 76\nPanel 3: 28 by 76",
          done: false,
          createdAt: nowIso(),
        },
      ],
      materials: [
        {
          id: makeId(),
          name: "Super screen order placed",
          checked: true,
          addedBy: "6666",
          addedAt: nowIso(),
        },
        {
          id: makeId(),
          name: "Black spline",
          qty: "4 rolls",
          checked: true,
          addedBy: "6666",
          addedAt: nowIso(),
        },
      ],
      tech_notes: "Waiting for supply delivery before install scheduling.",
      updated_at: nowIso(),
    },
    {
      id: "wild-705",
      title: "Patio Repair Completed",
      summary: "Install done, ready for final closeout",
      stage: "Installed",
      apptDate: "2026-03-11",
      apptTime: "02:00",
      crew: "Crew 2",
      customer: {
        name: "Sean Driscoll",
        phone: "(772) 999-8877",
        email: "sean@example.com",
        address: "Palm City, FL",
      },
      scope_items: [
        {
          id: makeId(),
          type: "screen",
          label: "Back Porch Section",
          quick: "54 by 90.\nInstalled clean.",
          done: true,
          createdAt: nowIso(),
        },
        {
          id: makeId(),
          type: "trim",
          label: "Trim Touchup",
          quick: "South frame cleanup.",
          done: true,
          createdAt: nowIso(),
        },
      ],
      materials: [
        {
          id: makeId(),
          name: "Sealant",
          checked: true,
          addedBy: "8888",
          addedAt: nowIso(),
        },
        {
          id: makeId(),
          name: "Touch-up paint",
          checked: true,
          addedBy: "8888",
          addedAt: nowIso(),
        },
      ],
      tech_notes: "Installed clean. Need final photos and then mark done.",
      updated_at: nowIso(),
    },
  ];
}

export default function WildingDemoBoardV2() {
  const [jobs, setJobs] = useState<DemoJob[]>(seedJobs());
  const [selectedJobId, setSelectedJobId] = useState<string | null>(seedJobs()[0]?.id ?? null);
  const [showPanels, setShowPanels] = useState(true);
  const [grabCode, setGrabCode] = useState<(typeof GRAB_CODES)[number] | "">(GRAB_CODES[0]);

  const stages: Stage[] = useMemo(
    () => ["Scheduled", "Measured", "Estimate Sent", "Ordered", "Installed", "Done"],
    []
  );

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || null,
    [jobs, selectedJobId]
  );

  const jobsByStage = useMemo(() => {
    const map = new Map<Stage, DemoJob[]>();
    for (const s of stages) map.set(s, []);
    for (const j of jobs) map.get(j.stage)?.push(j);
    return map;
  }, [jobs, stages]);

  function updateJob(jobId: string, patch: Partial<DemoJob>) {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              ...patch,
              updated_at: nowIso(),
            }
          : job
      )
    );
  }

  function setStage(jobId: string, stage: Stage) {
    updateJob(jobId, { stage });
  }

  function addScopeItem(job: DemoJob, type: ScopeType) {
    const idx = nextIndex(job.scope_items, type);
    const labelBase =
      type === "door"
        ? "Door"
        : type === "window"
        ? "Window"
        : type === "screen"
        ? "Screen"
        : type === "trim"
        ? "Trim"
        : "Custom";

    const item: ScopeItem = {
      id: makeId(),
      type,
      label: `${labelBase} ${idx}`,
      quick: "",
      done: false,
      createdAt: nowIso(),
    };

    updateJob(job.id, { scope_items: [item, ...job.scope_items] });
  }

  function removeScopeItem(job: DemoJob, itemId: string) {
    updateJob(job.id, {
      scope_items: job.scope_items.filter((x) => x.id !== itemId),
    });
  }

  function toggleScopeDone(job: DemoJob, itemId: string) {
    updateJob(job.id, {
      scope_items: job.scope_items.map((x) =>
        x.id === itemId ? { ...x, done: !x.done } : x
      ),
    });
  }

  function setScopeQuick(job: DemoJob, itemId: string, val: string) {
    updateJob(job.id, {
      scope_items: job.scope_items.map((x) =>
        x.id === itemId ? { ...x, quick: val } : x
      ),
    });
  }

  function addMaterial(job: DemoJob, name: string, qty?: string) {
    const n = (name || "").trim();
    if (!n) return;

    const item: MaterialItem = {
      id: makeId(),
      name: n,
      qty: (qty || "").trim() || undefined,
      checked: false,
      addedBy: grabCode || "live",
      addedAt: nowIso(),
    };

    updateJob(job.id, { materials: [item, ...job.materials] });
  }

  function toggleMaterial(job: DemoJob, id: string) {
    updateJob(job.id, {
      materials: job.materials.map((x) =>
        x.id === id ? { ...x, checked: !x.checked } : x
      ),
    });
  }

  function removeMaterial(job: DemoJob, id: string) {
    updateJob(job.id, {
      materials: job.materials.filter((x) => x.id !== id),
    });
  }

  function applyTemplate(job: DemoJob, templateKey: string) {
    const items = MATERIAL_TEMPLATES[templateKey] || [];
    if (!items.length) return;

    const now = nowIso();
    const next = [
      ...items.map((n) => ({
        id: makeId(),
        name: n,
        qty: undefined,
        checked: false,
        addedBy: grabCode || "live",
        addedAt: now,
      })),
      ...job.materials,
    ] as MaterialItem[];

    updateJob(job.id, { materials: next });
  }

  function buildTechPayload(job: DemoJob) {
    return [
      `WILDING — Job`,
      `Customer: ${job.customer.name || "-"}`,
      `Phone: ${job.customer.phone || "-"}`,
      `Address: ${job.customer.address || "-"}`,
      `Email: ${job.customer.email || "-"}`,
      ``,
      `Job: ${job.title || "-"}`,
      `Summary: ${job.summary || ""}`,
      `Appt: ${fmtAppt(job)}`,
      `Stage: ${job.stage}`,
      `Job ID: ${job.id}`,
    ].join("\n");
  }

  function buildGrabListText(job: DemoJob, materials: MaterialItem[]) {
    const header = [
      `WILDING — Materials Grab List`,
      `Job: ${job.title || "-"}`,
      `Customer: ${job.customer.name || "-"}`,
      `Address: ${job.customer.address || "-"}`,
      `Appt: ${fmtAppt(job)}`,
      ``,
    ].join("\n");

    const lines = materials
      .slice()
      .reverse()
      .map((m, idx) => {
        const q = m.qty ? ` (x ${m.qty})` : "";
        const chk = m.checked ? "✅" : "⬜";
        return `${chk} ${idx + 1}. ${m.name}${q} — ${m.addedBy}`;
      });

    return header + lines.join("\n");
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-7xl p-3 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">Wilding — Live Board</div>
            <div className="text-sm text-white/60">
              Screen repair workflow • measurements • materials • notes • estimate + invoice
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
              onClick={() => setShowPanels((v) => !v)}
            >
              {showPanels ? "Hide Panels" : "Show Panels"}
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="text-xs font-bold text-white/70">Grab Code</div>
              <select
                className="rounded-lg bg-transparent text-sm outline-none"
                value={grabCode}
                onChange={(e) => setGrabCode(e.target.value as any)}
              >
                {GRAB_CODES.map((c) => (
                  <option key={c} value={c} className="text-black">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-extrabold text-black hover:bg-emerald-400"
              onClick={() => safeToast("Demo invoice generated.")}
            >
              Generate Invoice
            </button>
          </div>
        </div>

        {showPanels ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {stages.map((s) => {
              const tone = stageTone(s);
              const list = jobsByStage.get(s) || [];
              return (
                <div
                  key={s}
                  className={cn("rounded-2xl border border-white/10 bg-white/5", tone.lane, "border-l-4")}
                >
                  <div className="flex items-center justify-between border-b border-white/10 p-3">
                    <div className="text-sm font-extrabold">{s}</div>
                    <div className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", tone.pill)}>
                      {list.length}
                    </div>
                  </div>

                  <div className="space-y-2 p-2">
                    {list.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setSelectedJobId(j.id)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left hover:bg-white/10",
                          selectedJobId === j.id
                            ? "border-emerald-400/40 bg-emerald-400/10"
                            : "border-white/10 bg-white/5"
                        )}
                      >
                        <div className="truncate text-sm font-bold">{j.title}</div>
                        <div className="mt-0.5 truncate text-xs text-white/60">{j.customer.name}</div>
                        <div className="mt-1 text-[11px] text-white/60">{fmtAppt(j)}</div>
                      </button>
                    ))}

                    {list.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-white/40">No jobs</div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5">
          <div className="flex flex-col gap-2 border-b border-white/10 p-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-extrabold">Job Drawer</div>
              <div className="text-xs text-white/60">Click a job in lanes to load details</div>
            </div>

            {selectedJob ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                  onClick={() => copyToClipboard(buildTechPayload(selectedJob))}
                >
                  Copy Tech Text
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                  onClick={() => safeToast("Demo SMS action")}
                >
                  Send SMS
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                  onClick={() => safeToast("Demo email action")}
                >
                  Email
                </button>
              </div>
            ) : null}
          </div>

          {!selectedJob ? (
            <div className="p-4 text-sm text-white/60">Select a job to open the drawer.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-extrabold">Customer</div>

                <div className="mt-2 space-y-1 text-sm">
                  <div className="font-bold">{selectedJob.customer.name}</div>
                  <div className="text-white/70">{selectedJob.customer.address}</div>
                  <div className="text-white/70">{selectedJob.customer.phone}</div>
                  <div className="text-white/70">{selectedJob.customer.email}</div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs font-bold text-white/60">Appointment</div>
                  <div className="mt-1 text-sm font-bold">{fmtAppt(selectedJob)}</div>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-white/60">Stage</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {stages.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-extrabold",
                          selectedJob.stage === s
                            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                        )}
                        onClick={() => setStage(selectedJob.id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold">Scope + Measurements</div>
                  <div className="text-xs text-white/60">
                    {(() => {
                      const c = scopeCounts(selectedJob.scope_items);
                      return `D:${c.doors} W:${c.windows} S:${c.screens} T:${c.trim} C:${c.custom}`;
                    })()}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(["door", "window", "screen", "trim", "custom"] as ScopeType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                      onClick={() => addScopeItem(selectedJob, t)}
                    >
                      + {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="mt-3 space-y-2">
                  {selectedJob.scope_items.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                      Add items (Door/Window/Screen/Trim/Custom).
                    </div>
                  ) : null}

                  {selectedJob.scope_items.map((it) => (
                    <div
                      key={it.id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className={cn(
                                "rounded-full border px-3 py-1 text-xs font-extrabold",
                                it.done
                                  ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
                                  : "border-white/10 bg-white/5 text-white/70"
                              )}
                              onClick={() => toggleScopeDone(selectedJob, it.id)}
                            >
                              {it.done ? "Done" : "Open"}
                            </button>
                            <div className="truncate text-sm font-extrabold">{it.label}</div>
                          </div>
                          <div className="mt-1 text-xs text-white/50">{it.type}</div>
                        </div>

                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                          onClick={() => removeScopeItem(selectedJob, it.id)}
                        >
                          Remove
                        </button>
                      </div>

                      <textarea
                        className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                        value={it.quick}
                        onChange={(e) => setScopeQuick(selectedJob, it.id, e.target.value)}
                        placeholder="Measurements / notes"
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold">Materials Grab List</div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                      onClick={() => copyToClipboard(buildGrabListText(selectedJob, selectedJob.materials))}
                    >
                      Copy Grab List
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.keys(MATERIAL_TEMPLATES).map((k) => (
                      <button
                        key={k}
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                        onClick={() => applyTemplate(selectedJob, k)}
                      >
                        + {k}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 space-y-2">
                    {selectedJob.materials.length === 0 ? (
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                        No materials yet.
                      </div>
                    ) : null}

                    {selectedJob.materials.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3"
                      >
                        <div className="min-w-0">
                          <button
                            type="button"
                            className="text-left"
                            onClick={() => toggleMaterial(selectedJob, m.id)}
                            title="Toggle checked"
                          >
                            <div className="truncate text-sm font-bold">
                              {m.checked ? "✅" : "⬜"} {m.name}
                              {m.qty ? <span className="text-white/60"> (x {m.qty})</span> : null}
                            </div>
                            <div className="mt-1 text-xs text-white/50">
                              {m.addedBy} • {safeTimeLabel(m.addedAt)}
                            </div>
                          </button>
                        </div>

                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                          onClick={() => removeMaterial(selectedJob, m.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                      onClick={() => addMaterial(selectedJob, "Spline", "2 rolls")}
                    >
                      + Spline
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                      onClick={() => addMaterial(selectedJob, "Screen roll", "1")}
                    >
                      + Screen Roll
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold">Technician Notes</div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                      onClick={() => safeToast("Mic can be added next pass.")}
                    >
                      Mic
                    </button>
                  </div>

                  <textarea
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                    value={selectedJob.tech_notes}
                    onChange={(e) => updateJob(selectedJob.id, { tech_notes: e.target.value })}
                    placeholder="Notes"
                    rows={8}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}