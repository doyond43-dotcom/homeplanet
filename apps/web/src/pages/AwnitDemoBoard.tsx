import { useEffect, useMemo, useRef, useState } from "react";

// NOTE (Preview-safe): we avoid react-router-dom here because the preview runtime
// may not mount a <Router>, which would crash useNavigate().
// In your real repo, you can restore:
//   import { useNavigate } from "react-router-dom";


/**
 * AWNIT — Live Board (1-week test)
 * - Appointment required at Add Job
 * - Stage color lanes like Taylor Creek
 * - Scope + per-unit Measurements (Doors/Windows/Screens/Trim + Custom) + MIC (new line per tap)
 * - Materials Grab List (separate) + MIC (new line per tap) + multi-line quick add
 * - "Grab Code" accountability on Copy Grab List (week-1 = numeric IDs, names later)
 *
 * NOTE (Canvas/Preview build):
 * The preview/build environment does NOT have your repo modules:
 *   ../lib/invoices
 *   ../lib/supabase
 *
 * So this file includes SAFE, LOCAL STUBS that compile in preview.
 * In your real repo, replace the stubs with your real imports.
 */

// ---------------- Types ----------------
type Stage = "Scheduled" | "Measured" | "Estimate Sent" | "Ordered" | "Installed" | "Done";

type Job = {
  id: string;
  title: string;
  summary: string;
  stage: Stage;

  apptDate: string; // YYYY-MM-DD
  apptTime: string; // HH:MM
  crew?: string;

  customer: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
};

type ScopeType = "door" | "window" | "screen" | "trim" | "custom";

type ScopeItem = {
  id: string;
  type: ScopeType;
  label: string; // "Door 1", "Window 2", "Custom 1"
  quick: string; // multi-line measurements/notes
  done: boolean;
  createdAt: string;
};

type MaterialItem = {
  id: string;
  name: string;
  qty?: string;
  checked: boolean;
  addedBy: string; // week-1: grabCode if available, else "live"
  addedAt: string; // ISO
};

// ---------------- Repo stubs (safe for preview) ----------------
/**
 * EXPECTED BEHAVIOR QUESTION (answer in chat so I wire it correctly in your repo):
 * When you click “Generate Invoice”, should it:
 *   A) ALWAYS create a brand-new invoice, OR
 *   B) update/overwrite an existing draft invoice for this job if one already exists?
 */

// Minimal stub: creates an invoice id and stores payload in localStorage (preview only).
async function createInvoiceFromJob(input: {
  job: Job;
  scopeItems: ScopeItem[];
  materials: MaterialItem[];
  notes: string;
}): Promise<string> {
  const id = `inv_${makeId()}`;
  try {
    const key = `awnit_demo_invoice_${id}`;
    localStorage.setItem(
      key,
      JSON.stringify({
        id,
        createdAt: new Date().toISOString(),
        job: input.job,
        scopeItems: input.scopeItems,
        materials: input.materials,
        notes: input.notes,
      })
    );
  } catch {
    // ignore for preview
  }
  return id;
}

// Preview stub for the footer line. In your repo, replace with:
//   import { supabase as sb } from "../lib/supabase";
const sb: any = null;

// ---------------- Helpers ----------------
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function safeToast(msg: string) {
  try {
    // eslint-disable-next-line no-alert
    alert(msg);
  } catch {
    /* noop */
  }
}

async function copyToClipboard(text: string) {
  const val = (text || "").trim();
  if (!val) return safeToast("Nothing to copy.");
  try {
    await navigator.clipboard.writeText(val);
    safeToast("Copied.");
  } catch {
    const ta = document.createElement("textarea");
    ta.value = val;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      safeToast("Copied.");
    } catch {
      safeToast("Copy failed.");
    } finally {
      document.body.removeChild(ta);
    }
  }
}

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function fmtAppt(j: Job) {
  const d = (j.apptDate || "").trim();
  const t = (j.apptTime || "").trim();
  const crew = (j.crew || "").trim();
  const base = [d, t].filter(Boolean).join(" ");
  return `${base || "—"}${crew ? ` • ${crew}` : ""}`;
}

function stageTone(stage: Stage) {
  switch (stage) {
    case "Scheduled":
      return { lane: "border-l-sky-400/70", pill: "border-sky-300/30 bg-sky-300/15 text-sky-100" };
    case "Measured":
      return {
        lane: "border-l-emerald-400/80",
        pill: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
      };
    case "Estimate Sent":
      return { lane: "border-l-violet-400/70", pill: "border-violet-300/30 bg-violet-300/15 text-violet-100" };
    case "Ordered":
      return { lane: "border-l-amber-300/70", pill: "border-amber-300/30 bg-amber-300/15 text-amber-100" };
    case "Installed":
      return { lane: "border-l-lime-300/70", pill: "border-lime-300/30 bg-lime-300/15 text-lime-100" };
    case "Done":
      return { lane: "border-l-slate-300/40", pill: "border-white/10 bg-white/5 text-slate-200" };
    default:
      return {
        lane: "border-l-emerald-400/60",
        pill: "border-emerald-400/30 bg-emerald-400/15 text-emerald-100",
      };
  }
}

// ---------------- Speech (Mic) ----------------
type SpeechCtor = new () => any;

function getSpeechCtor(): SpeechCtor | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition ? (w.SpeechRecognition || w.webkitSpeechRecognition) : null;
}

function useSpeechDictation() {
  const ctorRef = useRef<SpeechCtor | null>(null);
  const recRef = useRef<any>(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const activeTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ctor = getSpeechCtor();
    ctorRef.current = ctor;
    setSupported(!!ctor);
  }, []);

  function stop() {
    try {
      recRef.current?.stop?.();
    } catch {
      /* noop */
    }
  }

  function toggle(targetId: string, onText: (text: string, isFinal: boolean) => void) {
    const ctor = ctorRef.current;
    if (!ctor) {
      safeToast("Mic not supported in this browser.");
      return;
    }

    // same target = toggle off
    if (listening && activeTargetRef.current === targetId) {
      stop();
      return;
    }

    // switching targets while listening: stop previous first
    if (listening && activeTargetRef.current && activeTargetRef.current !== targetId) {
      stop();
    }

    const rec = new ctor();
    recRef.current = rec;

    rec.continuous = false; // tap mic = one burst, then stop
    rec.interimResults = false;
    rec.lang = "en-US";

    activeTargetRef.current = targetId;

    rec.onstart = () => setListening(true);
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.onresult = (event: any) => {
      let interim = "";
      let finals = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const txt = (r[0]?.transcript || "").trim();
        if (!txt) continue;
        if (r.isFinal) finals += (finals ? " " : "") + txt;
        else interim += (interim ? " " : "") + txt;
      }

      if (interim) onText(interim, false);
      if (finals) onText(finals, true);
    };

    try {
      rec.start();
    } catch {
      safeToast("Mic start failed.");
    }
  }

  return { supported, listening, toggle, stop, activeTargetRef };
}

function MicButton({
  label = "Mic",
  supported,
  listening,
  active,
  onClick,
}: {
  label?: string;
  supported: boolean;
  listening: boolean;
  active: boolean;
  onClick: () => void;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-extrabold border transition select-none whitespace-nowrap";
  const off = "border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15";
  const on = "border-emerald-400/40 bg-emerald-400/15 hover:bg-emerald-400/20 active:bg-emerald-400/25";
  const disabled = "opacity-40 cursor-not-allowed";

  return (
    <button
      type="button"
      className={cn(base, supported ? (active && listening ? on : off) : off, !supported && disabled)}
      onClick={() => supported && onClick()}
      title={supported ? "Tap to dictate" : "Mic not supported"}
      aria-label="Microphone"
    >
      🎤
      <span className="ml-2">{label}</span>
    </button>
  );
}

// tap mic = new line behavior
function dictationAppendLine(prev: string, text: string, isFinal: boolean) {
  // Only commit FINAL results. One mic tap = one new line.
  if (!isFinal) return prev;
  const line = (text || "").trim();
  if (!line) return prev;

  const base = (prev || "").trimEnd();
  return (base ? `${base}\n${line}` : line) + "\n";
}

// ---------------- Materials Templates (simple) ----------------
const MATERIAL_TEMPLATES: Record<string, string[]> = {
  "Window install": ["Caulk / sealant", "Shims", "Flashing tape", "Foam", "Screws", "Touch-up paint"],
  "Door install": ["Caulk / sealant", "Shims", "Flashing tape", "Foam", "Screws", "Wood filler"],
  "Screen repair": ["Spline", "Screen roll", "Spline tool", "Corners / clips", "Fasteners"],
  "Trim + caulk touchup": ["Caulk / sealant", "Painter tape", "Touch-up paint", "Rags / wipes"],
};

// Week-1 Employee IDs (names later)
const GRAB_CODES = ["2222", "4444", "6666", "8888", "9999"] as const;

// ---------------- Small self-tests (DEV only) ----------------
function digitsPhone(s?: string) {
  const raw = (s || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw.replace(/[^\d+]/g, "");
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 12 && digits.length <= 15) return `+${digits}`;
  return digits;
}

function buildGrabListText(job: Job, materials: MaterialItem[]) {
  const header = [
    `AWNIT — Materials Grab List`,
    `Job: ${job.title}`,
    `Customer: ${job.customer.name || "-"}`,
    `Address: ${job.customer.address || "-"}`,
    `Appt: ${job.apptDate || "-"} ${job.apptTime || "-"}`.trim(),
    ``,
  ].join("\n");

  const lines = materials
    .slice()
    .reverse()
    .map((m, idx) => {
      const who = m.addedBy || "live";
      const q = m.qty ? ` (x ${m.qty})` : "";
      const chk = m.checked ? "✅" : "⬜";
      return `${chk} ${idx + 1}. ${m.name}${q} — ${who}`;
    });

  return header + lines.join("\n");
}

if ((import.meta as any)?.env?.DEV) {
  // dictationAppendLine
  console.assert(dictationAppendLine("", "hello", true) === "hello\n", "dictationAppendLine: first line");
  console.assert(
    dictationAppendLine("hello\n", "world", true) === "hello\nworld\n",
    "dictationAppendLine: append"
  );
  console.assert(dictationAppendLine("hello\n", "", true) === "hello\n", "dictationAppendLine: empty ignored");
  console.assert(dictationAppendLine("hello\n", "world", false) === "hello\n", "dictationAppendLine: interim ignored");

  // digitsPhone
  console.assert(digitsPhone("(555) 123-4567") === "+15551234567", "digitsPhone: US 10-digit");
  console.assert(digitsPhone("+1 (555) 123-4567") === "+15551234567", "digitsPhone: already +");
  console.assert(digitsPhone("1-555-123-4567") === "+15551234567", "digitsPhone: leading 1");

  // buildGrabListText
  const j: Job = {
    id: "job_test",
    title: "Test Job",
    summary: "",
    stage: "Scheduled",
    apptDate: "2026-01-01",
    apptTime: "09:00",
    customer: { name: "Test Customer" },
  };
  const mats: MaterialItem[] = [
    { id: "m1", name: "Caulk", checked: false, addedBy: "2222", addedAt: new Date().toISOString() },
    { id: "m2", name: "Screws", qty: "2 boxes", checked: true, addedBy: "4444", addedAt: new Date().toISOString() },
  ];
  const txt = buildGrabListText(j, mats);
  console.assert(txt.includes("AWNIT — Materials Grab List"), "buildGrabListText: header");
  console.assert(txt.includes("✅ 2. Screws (x 2 boxes)"), "buildGrabListText: numbering + qty");
}

// ---------------- Component ----------------
export default function AwnitDemoBoard() {
  // Preview-safe navigate stub. In your repo, swap back to: const navigate = useNavigate();
  const navigate = (to: string) => {
    try {
      window.location.href = to;
    } catch {
      /* noop */
    }
  };
  const { supported, listening, toggle, activeTargetRef } = useSpeechDictation();
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Seed jobs
  const seedJobs: Job[] = useMemo(
    () => [
      {
        id: "job_1001",
        title: "Screen Enclosure Repair",
        summary: "Torn screen + spline replacement on west side panel.",
        stage: "Measured",
        apptDate: "2026-02-28",
        apptTime: "09:30",
        crew: "Crew 1",
        customer: {
          name: "Maria Johnson",
          phone: "(555) 201-8891",
          email: "maria.j@example.com",
          address: "214 SW 8th Ave, Okeechobee, FL 34974",
        },
      },
      {
        id: "job_1002",
        title: "Hurricane Shutter Measure",
        summary: "Initial measure for front windows + slider.",
        stage: "Scheduled",
        apptDate: "2026-02-28",
        apptTime: "13:00",
        crew: "Austin",
        customer: {
          name: "Derek Stone",
          phone: "(555) 913-4402",
          email: "derek.stone@example.com",
          address: "105 NE 3rd St, Okeechobee, FL 34972",
        },
      },
      {
        id: "job_1003",
        title: "Window Replacement Quote",
        summary: "Estimate deliver + follow-up scheduled.",
        stage: "Estimate Sent",
        apptDate: "2026-03-01",
        apptTime: "10:00",
        crew: "Ruben",
        customer: {
          name: "Alicia Perez",
          phone: "(555) 650-7780",
          email: "alicia.p@example.com",
          address: "7900 US-441, Okeechobee, FL 34974",
        },
      },
    ],
    []
  );

  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [showPanels, setShowPanels] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedJobId && jobs.length) setSelectedJobId(jobs[0].id);
  }, [jobs, selectedJobId]);

  const selectedJob = useMemo(() => jobs.find((j) => j.id === selectedJobId) || null, [jobs, selectedJobId]);

  // ---------------- Drawer: Scope Items per Job ----------------
  const [scopeByJob, setScopeByJob] = useState<Record<string, ScopeItem[]>>({});

  function getScope(jobId: string) {
    return scopeByJob[jobId] || [];
  }

  function nextIndex(items: ScopeItem[], type: ScopeType) {
    const count = items.filter((x) => x.type === type).length;
    return count + 1;
  }

  function addScopeItem(jobId: string, type: ScopeType) {
    setScopeByJob((prev) => {
      const cur = prev[jobId] || [];
      const idx = nextIndex(cur, type);
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
      return { ...prev, [jobId]: [item, ...cur] };
    });
  }

  function removeScopeItem(jobId: string, itemId: string) {
    setScopeByJob((prev) => {
      const cur = prev[jobId] || [];
      return { ...prev, [jobId]: cur.filter((x) => x.id !== itemId) };
    });
  }

  function toggleScopeDone(jobId: string, itemId: string) {
    setScopeByJob((prev) => {
      const cur = prev[jobId] || [];
      return { ...prev, [jobId]: cur.map((x) => (x.id === itemId ? { ...x, done: !x.done } : x)) };
    });
  }

  function setScopeQuick(jobId: string, itemId: string, val: string) {
    setScopeByJob((prev) => {
      const cur = prev[jobId] || [];
      return { ...prev, [jobId]: cur.map((x) => (x.id === itemId ? { ...x, quick: val } : x)) };
    });
  }

  function scopeCounts(items: ScopeItem[]) {
    const doors = items.filter((x) => x.type === "door").length;
    const windows = items.filter((x) => x.type === "window").length;
    const screens = items.filter((x) => x.type === "screen").length;
    const trim = items.filter((x) => x.type === "trim").length;
    const custom = items.filter((x) => x.type === "custom").length;
    return { doors, windows, screens, trim, custom };
  }

  // ---------------- Materials per Job ----------------
  const [materialsByJob, setMaterialsByJob] = useState<Record<string, MaterialItem[]>>({});
  const [grabCode, setGrabCode] = useState<(typeof GRAB_CODES)[number] | "">(GRAB_CODES[0]);
  const [materialsQuickAdd, setMaterialsQuickAdd] = useState("");

  function getMaterials(jobId: string) {
    return materialsByJob[jobId] || [];
  }

  function addMaterial(jobId: string, name: string, qty?: string) {
    const n = (name || "").trim();
    if (!n) return;
    setMaterialsByJob((prev) => {
      const cur = prev[jobId] || [];
      const item: MaterialItem = {
        id: makeId(),
        name: n,
        qty: (qty || "").trim() || undefined,
        checked: false,
        addedBy: grabCode || "live",
        addedAt: nowIso(),
      };
      return { ...prev, [jobId]: [item, ...cur] };
    });
  }

  function removeMaterial(jobId: string, id: string) {
    setMaterialsByJob((prev) => {
      const cur = prev[jobId] || [];
      return { ...prev, [jobId]: cur.filter((x) => x.id !== id) };
    });
  }

  function toggleMaterial(jobId: string, id: string) {
    setMaterialsByJob((prev) => {
      const cur = prev[jobId] || [];
      return { ...prev, [jobId]: cur.map((x) => (x.id === id ? { ...x, checked: !x.checked } : x)) };
    });
  }

  function applyTemplate(jobId: string, templateKey: string) {
    const items = MATERIAL_TEMPLATES[templateKey] || [];
    for (const n of items) addMaterial(jobId, n);
  }

  function quickAddMaterials(jobId: string) {
    const raw = (materialsQuickAdd || "").trim();
    if (!raw) return;

    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const m = line.match(/^(.*?)(?:\s+x\s+(.+))?$/i);
      const name = (m?.[1] || "").trim();
      const qty = (m?.[2] || "").trim();
      addMaterial(jobId, name, qty || undefined);
    }
    setMaterialsQuickAdd("");
  }

  // ---------------- Notes per Job ----------------
  const [notesByJob, setNotesByJob] = useState<Record<string, string>>({});
  const selectedNotes = notesByJob[selectedJobId || ""] || "";

  function setNotes(jobId: string, value: string) {
    setNotesByJob((prev) => ({ ...prev, [jobId]: value }));
  }

  // ---------------- Stage updates ----------------
  function setStage(jobId: string, stage: Stage) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, stage } : j)));
  }

  // ---------------- Share / copy to tech ----------------
  function buildTechPayload(job: Job) {
    const c = job.customer;
    const appt = `${job.apptDate || "-"} ${job.apptTime || "-"}`.trim();
    return [
      `AWNIT — Job`,
      `Customer: ${c.name || "-"}`,
      `Phone: ${c.phone || "-"}`,
      `Address: ${c.address || "-"}`,
      `Email: ${c.email || "-"}`,
      ``,
      `Job: ${job.title}`,
      `Summary: ${job.summary}`,
      `Appt: ${appt}`,
      `Crew: ${job.crew || "-"}`,
      `Stage: ${job.stage}`,
    ].join("\n");
  }

  function smsHref(job: Job) {
    const phone = digitsPhone(job.customer.phone);
    if (!phone) return "";
    const body = encodeURIComponent(buildTechPayload(job));
    return `sms:${phone}?&body=${body}`;
  }

  function emailHref(job: Job) {
    const email = (job.customer.email || "").trim();
    if (!email) return "";
    const subject = encodeURIComponent(`AWNIT — ${job.title}`);
    const body = encodeURIComponent(buildTechPayload(job));
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  function mapsHref(job: Job) {
    const addr = (job.customer.address || "").trim();
    if (!addr) return "";
    const q = encodeURIComponent(addr);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  // ---------------- Invoice ----------------
  async function generateInvoice() {
    if (!selectedJob) return;
    try {
      setIsGeneratingInvoice(true);

      const scope = getScope(selectedJob.id);
      const mats = getMaterials(selectedJob.id);
      const notes = notesByJob[selectedJob.id] || "";

      const invoiceId = await createInvoiceFromJob({
        job: selectedJob,
        scopeItems: scope,
        materials: mats,
        notes,
      });

      if (!invoiceId) {
        safeToast("Invoice created, but no ID returned.");
        return;
      }

      // Preview will navigate if your router has this route.
      // In your repo this should land on your invoice page.
      navigate(`/planet/vehicles/awnit-demo/invoice/`);
    } catch (e: any) {
      safeToast(e?.message || "Invoice generation failed.");
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  // ---------------- UI computed ----------------
  const stages: Stage[] = useMemo(() => ["Scheduled", "Measured", "Estimate Sent", "Ordered", "Installed", "Done"], []);
  const jobsByStage = useMemo(() => {
    const map = new Map<Stage, Job[]>();
    for (const s of stages) map.set(s, []);
    for (const j of jobs) map.get(j.stage)?.push(j);
    return map;
  }, [jobs, stages]);

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-7xl p-3 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-extrabold tracking-tight">AWNIT — Live Board</div>
            <div className="text-sm text-white/60">Week-1 demo surface • scope + materials + notes • invoice v1</div>
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
              className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-extrabold text-black hover:bg-emerald-400 disabled:opacity-50"
              onClick={generateInvoice}
              disabled={!selectedJob || isGeneratingInvoice}
              title="Generate invoice from Scope + Materials + Notes"
            >
              {isGeneratingInvoice ? "Generating…" : "Generate Invoice"}
            </button>
          </div>
        </div>

        {/* Lanes */}
        {showPanels ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {stages.map((s) => {
              const tone = stageTone(s);
              const list = jobsByStage.get(s) || [];
              return (
                <div key={s} className={cn("rounded-2xl border border-white/10 bg-white/5", tone.lane, "border-l-4")}>
                  <div className="flex items-center justify-between border-b border-white/10 p-3">
                    <div className="text-sm font-extrabold">{s}</div>
                    <div className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", tone.pill)}>{list.length}</div>
                  </div>

                  <div className="p-2 space-y-2">
                    {list.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setSelectedJobId(j.id)}
                        className={cn(
                          "w-full rounded-xl border px-3 py-2 text-left hover:bg-white/10",
                          selectedJobId === j.id ? "border-emerald-400/40 bg-emerald-400/10" : "border-white/10 bg-white/5"
                        )}
                      >
                        <div className="text-sm font-bold truncate">{j.title}</div>
                        <div className="mt-0.5 text-xs text-white/60 truncate">{j.customer.name}</div>
                        <div className="mt-1 text-[11px] text-white/60">{fmtAppt(j)}</div>
                      </button>
                    ))}
                    {list.length === 0 ? <div className="px-3 py-2 text-xs text-white/40">No jobs</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Drawer */}
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

                {selectedJob.customer.address ? (
                  <a
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                    href={mapsHref(selectedJob)}
                    target="_blank"
                    rel="noreferrer"
                    title="Open in Google Maps"
                  >
                    Maps
                  </a>
                ) : null}

                {selectedJob.customer.phone ? (
                  <a
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                    href={smsHref(selectedJob)}
                    target="_blank"
                    rel="noreferrer"
                    title="Send SMS from device"
                  >
                    Send SMS
                  </a>
                ) : null}

                {selectedJob.customer.email ? (
                  <a
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold hover:bg-white/10"
                    href={emailHref(selectedJob)}
                    target="_blank"
                    rel="noreferrer"
                    title="Send email"
                  >
                    Email
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {!selectedJob ? (
            <div className="p-4 text-sm text-white/60">Select a job to open the drawer.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-3">
              {/* Left: customer + stage */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-sm font-extrabold">Customer</div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="font-bold">{selectedJob.customer.name || "-"}</div>
                  <div className="text-white/70">{selectedJob.customer.address || "-"}</div>
                  <div className="text-white/70">{selectedJob.customer.phone || "-"}</div>
                  <div className="text-white/70">{selectedJob.customer.email || "-"}</div>
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

              {/* Middle: scope + measurements */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold">Scope + Measurements</div>
                  <div className="text-xs text-white/60">
                    {(() => {
                      const c = scopeCounts(getScope(selectedJob.id));
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
                      onClick={() => addScopeItem(selectedJob.id, t)}
                    >
                      + {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="mt-3 space-y-2">
                  {getScope(selectedJob.id).length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                      Add items (Door/Window/Screen/Trim/Custom). Use mic to append a new line per tap.
                    </div>
                  ) : null}

                  {getScope(selectedJob.id).map((it) => {
                    const targetId = `scope_${selectedJob.id}_${it.id}`;
                    const isActive = activeTargetRef.current === targetId;

                    return (
                      <div key={it.id} className="rounded-2xl border border-white/10 bg-black/20 p-3">
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
                                onClick={() => toggleScopeDone(selectedJob.id, it.id)}
                              >
                                {it.done ? "Done" : "Open"}
                              </button>
                              <div className="text-sm font-extrabold truncate">{it.label}</div>
                            </div>
                            <div className="mt-1 text-xs text-white/50">{it.type}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <MicButton
                              label="Mic"
                              supported={supported}
                              listening={listening}
                              active={isActive}
                              onClick={() =>
                                toggle(targetId, (txt, isFinal) => {
                                  setScopeQuick(selectedJob.id, it.id, dictationAppendLine(it.quick, txt, isFinal));
                                })
                              }
                            />
                            <button
                              type="button"
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                              onClick={() => removeScopeItem(selectedJob.id, it.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <textarea
                          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                          value={it.quick}
                          onChange={(e) => setScopeQuick(selectedJob.id, it.id, e.target.value)}
                          placeholder="Measurements / notes… (Mic adds a new line per tap)"
                          rows={4}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Materials + Notes */}
              <div className="space-y-3">
                {/* Materials */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold">Materials Grab List</div>
                    <button
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                      onClick={() => copyToClipboard(buildGrabListText(selectedJob, getMaterials(selectedJob.id)))}
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
                        onClick={() => applyTemplate(selectedJob.id, k)}
                      >
                        + {k}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-bold text-white/60">Quick Add (one per line)</div>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                      value={materialsQuickAdd}
                      onChange={(e) => setMaterialsQuickAdd(e.target.value)}
                      placeholder={"Caulk / sealant\nScrews x 2 boxes\nShims"}
                      rows={4}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        type="button"
                        className="rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-black hover:bg-white/90"
                        onClick={() => quickAddMaterials(selectedJob.id)}
                      >
                        Add Lines
                      </button>

                      <div className="text-xs text-white/50">
                        Added by: <span className="font-bold text-white/70">{grabCode || "live"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {getMaterials(selectedJob.id).length === 0 ? (
                      <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                        No materials yet. Use templates or quick add.
                      </div>
                    ) : null}

                    {getMaterials(selectedJob.id).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3"
                      >
                        <div className="min-w-0">
                          <button
                            type="button"
                            className="text-left"
                            onClick={() => toggleMaterial(selectedJob.id, m.id)}
                            title="Toggle checked"
                          >
                            <div className="text-sm font-bold truncate">
                              {m.checked ? "✅" : "⬜"} {m.name}
                              {m.qty ? <span className="text-white/60"> (x {m.qty})</span> : null}
                            </div>
                            <div className="mt-1 text-xs text-white/50">
                              {m.addedBy} • {new Date(m.addedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                            </div>
                          </button>
                        </div>

                        <button
                          type="button"
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                          onClick={() => removeMaterial(selectedJob.id, m.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold">Technician Notes</div>
                    <MicButton
                      label="Mic"
                      supported={supported}
                      listening={listening}
                      active={activeTargetRef.current === `notes_${selectedJob.id}`}
                      onClick={() =>
                        toggle(`notes_${selectedJob.id}`, (txt, isFinal) => {
                          setNotes(selectedJob.id, dictationAppendLine(selectedNotes, txt, isFinal));
                        })
                      }
                    />
                  </div>

                  <textarea
                    className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                    value={selectedNotes}
                    onChange={(e) => setNotes(selectedJob.id, e.target.value)}
                    placeholder="Notes… (Mic adds a new line per tap)"
                    rows={8}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dev / env note */}
        <div className="mt-4 text-xs text-white/40">
          Supabase client: {sb ? "env detected" : "env missing (fine for local demo)"} • Route: /planet/vehicles/awnit-demo
        </div>
      </div>
    </div>
  );
}

