// src/pages/AwnitDemoBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createInvoiceFromJob } from "../lib/invoices";
import { awnitListJobs, awnitUpdateJob } from "../lib/awnitJobsApi";
import HomePlanetFooter from "../components/HomePlanetFooter";

/**
 * AWNIT — Live Board (Supabase-backed)
 * Single source of truth: public.awnit_jobs
 *
 * Stabilized to:
 * - Persist scope/materials/notes to the CORRECT DB fields: scope_items, materials, tech_notes
 * - Keep optimistic UI in sync with those same DB fields
 * - Prevent the 5s refresh from overwriting edits while you’re actively clicking
 * - Remove “Invalid Date” by safely formatting timestamps and normalizing older shapes
 * - Ensure list items always have stable React keys (no key warnings)
 *
 * Responsive pass:
 * - Cleaner phone / tablet layout
 * - Header actions stack instead of crushing
 * - Stage lanes horizontal-scroll on smaller screens
 * - Job drawer actions wrap cleanly
 * - Right workspace panel becomes mobile-friendly
 *
 * Demo seed pass:
 * - When live data is sparse, fills empty lanes with believable demo jobs
 * - Real jobs always stay first
 * - Demo jobs only fill missing gaps
 *
 * Beam panel mode:
 * - Supports /planet/vehicles/awnit-demo?panel=measurement&open_url=/cards/measurement
 * - Keeps the board visible
 * - Opens the measurement card in a right-side workspace panel
 * - Guards the panel so it can only open /cards/* routes
 */

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

type AwnitJobRow = {
  id: string;
  title: string | null;
  summary: string | null;
  stage: Stage | string | null;

  apptDate?: string | null;
  apptTime?: string | null;
  crew?: string | null;

  customer?: {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;

  scope_items?: any;
  materials?: any;
  tech_notes?: string | null;

  meta?: any;
  updated_at?: string | null;
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
    /* noop */
  }
}

function reactKey(...parts: Array<any>) {
  return parts
    .map((p) => (p === undefined || p === null || p === "" ? "_" : String(p)))
    .join("__");
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

function safeTimeLabel(isoLike: any) {
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

function coerceStage(s: any): Stage {
  const v = (s || "").toString();
  const ok: Stage[] = ["Scheduled", "Measured", "Estimate Sent", "Ordered", "Installed", "Done"];
  return ok.includes(v as Stage) ? (v as Stage) : "Scheduled";
}

function coerceScopeItems(v: any): ScopeItem[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as ScopeItem[];
  return [];
}

function coerceMaterials(v: any): MaterialItem[] {
  if (!v) return [];
  const arr = Array.isArray(v) ? v : [];
  return arr
    .map((m: any, i: number): MaterialItem => {
      const id = (m?.id ?? m?.uuid ?? `mat-${i}`).toString();
      const name = (m?.name ?? m?.label ?? "").toString();
      const qty = (m?.qty ?? m?.quantity ?? "").toString().trim();
      const checked = Boolean(m?.checked);
      const addedBy = (m?.addedBy ?? m?.added_by ?? "live").toString();
      const addedAt = (m?.addedAt ?? m?.added_at ?? m?.createdAt ?? m?.created_at ?? "").toString();
      return {
        id,
        name,
        qty: qty ? qty : undefined,
        checked,
        addedBy,
        addedAt: addedAt || nowIso(),
      };
    })
    .filter((m) => (m.name || "").trim().length > 0);
}

function dictationAppendLine(prev: string, text: string, isFinal: boolean) {
  if (!isFinal) return prev;
  const line = (text || "").trim();
  if (!line) return prev;
  const base = (prev || "").trimEnd();
  return (base ? `${base}\n${line}` : line) + "\n";
}

function digitsPhone(s?: string | null) {
  const raw = (s || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw.replace(/[^\d+]/g, "");
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 12 && digits.length <= 15) return `+${digits}`;
  return digits;
}

function fmtAppt(job: AwnitJobRow) {
  const d = (job.apptDate || "").trim();
  const t = (job.apptTime || "").trim();
  const crew = (job.crew || "").trim();
  const base = [d, t].filter(Boolean).join(" ");
  return `${base || "—"}${crew ? ` • ${crew}` : ""}`;
}

function nextActionLabel(stage: Stage) {
  switch (stage) {
    case "Scheduled":
      return "Take measurements and confirm material count";
    case "Measured":
      return "Send estimate to customer";
    case "Estimate Sent":
      return "Follow up and lock approval";
    case "Ordered":
      return "Track material arrival and prep install";
    case "Installed":
      return "Capture completion photos and close job";
    case "Done":
      return "Job complete — ready for archive or follow-up";
    default:
      return "Review job and choose next action";
  }
}

function nextActionTone(stage: Stage) {
  switch (stage) {
    case "Scheduled":
      return "border-sky-400/35 bg-sky-500/10 text-sky-100";
    case "Measured":
      return "border-emerald-400/35 bg-emerald-500/10 text-emerald-100";
    case "Estimate Sent":
      return "border-violet-400/35 bg-violet-500/10 text-violet-100";
    case "Ordered":
      return "border-amber-400/35 bg-amber-500/10 text-amber-100";
    case "Installed":
      return "border-lime-400/35 bg-lime-500/10 text-lime-100";
    case "Done":
      return "border-white/10 bg-white/5 text-white/75";
    default:
      return "border-cyan-400/35 bg-cyan-500/10 text-cyan-100";
  }
}

function splitMaterialGroupName(name: string) {
  const raw = (name || "").trim();
  const m = raw.match(/^([^:]+):\s*(.+)$/);
  if (!m) {
    return { group: "General", itemName: raw };
  }
  return {
    group: m[1].trim(),
    itemName: m[2].trim(),
  };
}

function groupMaterialsForDisplay(materials: MaterialItem[]) {
  const map = new Map<string, MaterialItem[]>();

  for (const mat of materials) {
    const { group, itemName } = splitMaterialGroupName(mat.name);
    const nextItem = { ...mat, name: itemName };

    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(nextItem);
  }

  return Array.from(map.entries());
}

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

    if (listening && activeTargetRef.current === targetId) {
      stop();
      return;
    }

    if (listening && activeTargetRef.current && activeTargetRef.current !== targetId) {
      stop();
    }

    const rec = new ctor();
    recRef.current = rec;

    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    activeTargetRef.current = targetId;

    rec.onstart = () => setListening(true);
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.onresult = (event: any) => {
      let finals = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        const txt = (r[0]?.transcript || "").trim();
        if (!txt) continue;
        if (r.isFinal) finals += (finals ? " " : "") + txt;
      }
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
    "inline-flex min-h-[42px] items-center justify-center rounded-full px-3 py-2 text-sm font-extrabold border transition select-none whitespace-nowrap";
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

const MATERIAL_TEMPLATES: Record<string, string[]> = {
  "Window install": [
    "Window 1: Impact window unit",
    "Window 1: Shims",
    "General: Flashing tape",
    "General: Foam",
    "General: Screws",
    "General: Touch-up paint",
  ],
  "Door install": [
    "Door 1: Door slab / unit",
    "Door 1: Hinge set",
    "Door 1: Sweep",
    "General: Caulk / sealant",
    "General: Shims",
    "General: Screws",
    "General: Wood filler",
  ],
  "Screen repair": [
    "Screen 1: Spline",
    "Screen 1: Screen roll",
    "Screen 1: Spline tool",
    "General: Corners / clips",
    "General: Fasteners",
  ],
  "Trim + caulk touchup": [
    "Trim 1: Caulk / sealant",
    "Trim 1: Painter tape",
    "Trim 1: Touch-up paint",
    "General: Rags / wipes",
  ],
};

const GRAB_CODES = ["2222", "4444", "6666", "8888", "9999"] as const;

function demoScope(
  idBase: string,
  items: Array<{ type: ScopeType; label: string; quick: string; done?: boolean }>
): ScopeItem[] {
  return items.map((item, idx) => ({
    id: `${idBase}_scope_${idx + 1}`,
    type: item.type,
    label: item.label,
    quick: item.quick,
    done: Boolean(item.done),
    createdAt: "2026-03-13T10:12:00.000Z",
  }));
}

function demoMaterials(
  idBase: string,
  items: Array<{ name: string; qty?: string; checked?: boolean; addedBy?: string; addedAt?: string }>
): MaterialItem[] {
  return items.map((item, idx) => ({
    id: `${idBase}_mat_${idx + 1}`,
    name: item.name,
    qty: item.qty,
    checked: Boolean(item.checked),
    addedBy: item.addedBy || "2222",
    addedAt: item.addedAt || "2026-03-13T10:12:00.000Z",
  }));
}

const DEMO_SEED_JOBS: AwnitJobRow[] = [
  {
    id: "demo_scheduled_entry_door",
    title: "Customer wants dark bronze front entry door",
    summary: "Measure opening, confirm swing direction, review hardware finish and threshold condition.",
    stage: "Scheduled",
    apptDate: "2026-03-14",
    apptTime: "9:00 AM",
    crew: "Crew A",
    customer: {
      name: "Alex Parker",
      phone: "(555) 777-0142",
      email: "alex.parker@example.com",
      address: "202 Demo Lane",
    },
    scope_items: demoScope("demo_scheduled_entry_door", [
      {
        type: "door",
        label: "Door 1",
        quick:
          "Front entry door needs full measure.\nConfirm outswing vs inswing.\nCheck jamb width, threshold slope, and existing hardware backset.",
      },
      {
        type: "trim",
        label: "Trim 1",
        quick: "Inspect exterior trim return for soft spots.\nNote paint match requirement for final install.",
      },
    ]),
    materials: demoMaterials("demo_scheduled_entry_door", [
      { name: "Door 1: Prehung door unit" },
      { name: "Door 1: Hinge set" },
      { name: "General: Caulk / sealant" },
      { name: "General: Screws", qty: "2 boxes" },
    ]),
    tech_notes:
      "Customer wants finish and hardware to match existing exterior color.\nVerify swing direction and hardware color before final order release.\nTake before and after photos at threshold, strike side, exterior elevation, and interior finish line.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:12:00.000Z",
  },
  {
    id: "demo_scheduled_two_windows",
    title: "Need 2 windows replaced in guest room",
    summary: "Measure both openings, confirm stucco return depth, review grid pattern with customer.",
    stage: "Scheduled",
    apptDate: "2026-03-14",
    apptTime: "1:30 PM",
    crew: "Crew B",
    customer: {
      name: "John Carter",
      phone: "(555) 777-0199",
      email: "john.carter@example.com",
      address: "18 Creator Ave",
    },
    scope_items: demoScope("demo_scheduled_two_windows", [
      {
        type: "window",
        label: "Window 1",
        quick: "Left guest room window.\nCheck rough opening and existing sill condition.\nConfirm tempered requirement.",
      },
      {
        type: "window",
        label: "Window 2",
        quick: "Right guest room window.\nMatch visible lite pattern with adjacent front room window.",
      },
    ]),
    materials: demoMaterials("demo_scheduled_two_windows", [
      { name: "Window 1: Impact window unit" },
      { name: "Window 2: Impact window unit" },
      { name: "General: Flashing tape" },
      { name: "General: Foam" },
      { name: "General: Screws" },
    ]),
    tech_notes:
      "Customer asked if one window can be privacy glass.\nNeed to verify HOA color and interior trim finish.\nGood candidate to convert fast after measurement.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:14:00.000Z",
  },
  {
    id: "demo_measured_aluminum_screen",
    title: "Customer wants aluminum screen panel replaced",
    summary: "Measurements complete, waiting to finalize spline and mesh spec.",
    stage: "Measured",
    apptDate: "2026-03-13",
    apptTime: "11:00 AM",
    crew: "Crew A",
    customer: {
      name: "Alex Parker",
      phone: "(555) 777-0142",
      email: "alex.parker@example.com",
      address: "202 Demo Lane",
    },
    scope_items: demoScope("demo_measured_aluminum_screen", [
      {
        type: "screen",
        label: "Screen 1",
        quick:
          "Screen panel measured at 22-1/4 × 78-5/8.\nSpline channel is in fair condition.\nRecommend fresh spline at reinstall.",
        done: true,
      },
    ]),
    materials: demoMaterials("demo_measured_aluminum_screen", [
      { name: "Screen 1: Screen roll", checked: true },
      { name: "Screen 1: Spline", checked: true },
      { name: "Screen 1: Spline tool" },
      { name: "General: Fasteners" },
    ]),
    tech_notes:
      "Measurement complete.\nCustomer prefers darker mesh if available.\nNext step is estimate with material and labor line together.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:18:00.000Z",
  },
  {
    id: "demo_estimate_sent_side_door",
    title: "Estimate out for side garage door replacement",
    summary: "Customer received estimate, follow-up needed for hardware package selection.",
    stage: "Estimate Sent",
    apptDate: "2026-03-12",
    apptTime: "3:00 PM",
    crew: "Crew C",
    customer: {
      name: "Taylor Bennett",
      phone: "(555) 777-0111",
      email: "taylor.bennett@example.com",
      address: "55 Sample Court",
    },
    scope_items: demoScope("demo_estimate_sent_side_door", [
      {
        type: "door",
        label: "Door 1",
        quick:
          "Garage side entry opening measured and square enough for standard unit.\nCustomer deciding between smooth fiberglass and steel.",
        done: true,
      },
      {
        type: "custom",
        label: "Custom 1",
        quick: "Waiting on customer approval for upgraded deadbolt and lever set finish.",
      },
    ]),
    materials: demoMaterials("demo_estimate_sent_side_door", [
      { name: "Door 1: Door slab / unit", checked: true },
      { name: "Door 1: Sweep" },
      { name: "General: Shims" },
      { name: "General: Caulk / sealant" },
    ]),
    tech_notes:
      "Estimate sent this morning.\nCustomer liked bronze hardware but asked for brushed nickel option too.\nCall back tomorrow morning if no reply by 10:30.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:22:00.000Z",
  },
  {
    id: "demo_ordered_hardware_wait",
    title: "Waiting on hardware color approval before order release",
    summary: "Core order ready, final finish approval pending before vendor release.",
    stage: "Ordered",
    apptDate: "2026-03-17",
    apptTime: "TBD",
    crew: "Office",
    customer: {
      name: "Jordan Reed",
      phone: "(555) 777-0188",
      email: "jordan.reed@example.com",
      address: "77 Builder Way",
    },
    scope_items: demoScope("demo_ordered_hardware_wait", [
      {
        type: "door",
        label: "Door 1",
        quick: "Order package ready.\nHold release until satin nickel vs matte black hardware is confirmed.",
        done: true,
      },
      {
        type: "trim",
        label: "Trim 1",
        quick: "Exterior trim touch-up included in install scope.\nNeed one extra stick white PVC.",
      },
    ]),
    materials: demoMaterials("demo_ordered_hardware_wait", [
      { name: "Door 1: Door slab / unit", checked: true },
      { name: "Door 1: Hinge set", checked: true },
      { name: "General: Screws", checked: true },
      { name: "Trim 1: Touch-up paint" },
      { name: "General: Caulk / sealant" },
    ]),
    tech_notes:
      "Order draft built.\nNeed final hardware color text from customer before submitting.\nOnce approved, move install target to next open slot.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:26:00.000Z",
  },
  {
    id: "demo_installed_retrofit",
    title: "Customer wants retrofit install wrapped up today",
    summary: "Install complete, final completion photos and walkthrough still needed.",
    stage: "Installed",
    apptDate: "2026-03-13",
    apptTime: "8:00 AM",
    crew: "Crew A",
    customer: {
      name: "Alex Parker",
      phone: "(555) 777-0142",
      email: "alex.parker@example.com",
      address: "202 Demo Lane",
    },
    scope_items: demoScope("demo_installed_retrofit", [
      {
        type: "window",
        label: "Window 1",
        quick:
          "Opening measured at 35-3/4 × 53-1/8.\nStucco return is clean with usable shim space on both jambs.\nSill has light crown but remains serviceable.",
        done: true,
      },
      {
        type: "door",
        label: "Door 1",
        quick:
          "Existing rear entry opening measured at 35-7/8 × 79-1/4.\nJamb reads plumb overall with minor head variance approx. 1/8.",
        done: true,
      },
      {
        type: "screen",
        label: "Screen 1",
        quick:
          "Screen panel measured and reinstalled.\nRecommend fresh spline at reinstall.\nTake frame tension photo before final fit.",
        done: true,
      },
      {
        type: "trim",
        label: "Trim 1",
        quick: "Exterior trim return needs fresh caulk line after install.\nSmall paint touchup likely needed at upper left corner.",
      },
    ]),
    materials: demoMaterials("demo_installed_retrofit", [
      { name: "General: Caulk / sealant", checked: true },
      { name: "General: Shims", checked: true },
      { name: "General: Flashing tape", checked: true },
      { name: "General: Foam", checked: true },
      { name: "General: Screws", checked: true },
      { name: "General: Wood filler" },
    ]),
    tech_notes:
      "Customer wants finish and hardware to match existing exterior color.\nVerify swing direction and hardware color before final order release.\nTake before and after photos at threshold, strike side, exterior elevation, and interior finish line.\nInspect framing during removal for any hidden soft spots.\nFinal sweep: clean silicone line, collect signatures, and confirm customer satisfaction.",
    meta: {
      materialsQuickAdd:
        "Door 1: Prehung door unit\nDoor 1: Hinge set\nDoor 1: Lockset / handle kit\nDoor 1: Door sweep\nGeneral: Flashing tape\nGeneral: Foam\nGeneral: Screws x 2 boxes",
    },
    updated_at: "2026-03-13T10:30:00.000Z",
  },
  {
    id: "demo_installed_motorized_screen",
    title: "Install 16' × 10' motorized screen on rear patio",
    summary: "Main install finished, customer walkthrough and final trim cleanup pending.",
    stage: "Installed",
    apptDate: "2026-03-13",
    apptTime: "10:30 AM",
    crew: "Crew B",
    customer: {
      name: "Jamie Collins",
      phone: "(555) 777-0166",
      email: "jamie.collins@example.com",
      address: "44 Presentation Blvd",
    },
    scope_items: demoScope("demo_installed_motorized_screen", [
      {
        type: "custom",
        label: "Custom 1",
        quick: "Motorized screen housing mounted and powered.\nNeed final remote pairing confirmation with customer.",
        done: true,
      },
      {
        type: "trim",
        label: "Trim 1",
        quick: "Touch-up on right side return.\nFinal bead needs smoothing after cleanup.",
      },
    ]),
    materials: demoMaterials("demo_installed_motorized_screen", [
      { name: "General: Fasteners", checked: true },
      { name: "General: Touch-up paint" },
      { name: "General: Caulk / sealant", checked: true },
      { name: "General: Rags / wipes", checked: true },
    ]),
    tech_notes:
      "Install is visually complete.\nNeed remote sync demonstration and final trim cleanup.\nTake wide patio photo and close-up of bottom bar alignment before moving to done.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:33:00.000Z",
  },
  {
    id: "demo_done_trim_touchup",
    title: "Trim + caulk touchup completed at side entry",
    summary: "Work complete, photos captured, ready for archive or follow-up.",
    stage: "Done",
    apptDate: "2026-03-12",
    apptTime: "2:00 PM",
    crew: "Crew C",
    customer: {
      name: "Morgan Price",
      phone: "(555) 777-0107",
      email: "morgan.price@example.com",
      address: "91 Mockup Terrace",
    },
    scope_items: demoScope("demo_done_trim_touchup", [
      {
        type: "trim",
        label: "Trim 1",
        quick: "Completed exterior trim seal and touch-up.\nJoint lines cleaned and paint blended.",
        done: true,
      },
    ]),
    materials: demoMaterials("demo_done_trim_touchup", [
      { name: "Trim 1: Caulk / sealant", checked: true },
      { name: "Trim 1: Touch-up paint", checked: true },
      { name: "General: Rags / wipes", checked: true },
    ]),
    tech_notes:
      "Job complete.\nCompletion photos captured.\nCustomer happy with finish line and cleanup.\nSafe to archive after invoice confirmation.",
    meta: { materialsQuickAdd: "" },
    updated_at: "2026-03-13T10:36:00.000Z",
  },
];

function mergeWithDemoSeed(rows: AwnitJobRow[]): AwnitJobRow[] {
  const normalizedReal = rows.map((r) => ({
    ...r,
    stage: coerceStage(r.stage),
  }));

  const realIds = new Set(normalizedReal.map((j) => j.id));
  const byStage = new Map<Stage, AwnitJobRow[]>();

  const orderedStages: Stage[] = ["Scheduled", "Measured", "Estimate Sent", "Ordered", "Installed", "Done"];

  for (const stage of orderedStages) {
    byStage.set(
      stage,
      normalizedReal.filter((j) => coerceStage(j.stage) === stage)
    );
  }

  const merged: AwnitJobRow[] = [...normalizedReal];

  for (const stage of orderedStages) {
    const existing = byStage.get(stage) || [];
    const minimumNeeded = stage === "Installed" || stage === "Scheduled" ? 2 : 1;

    if (existing.length >= minimumNeeded) continue;

    const filler = DEMO_SEED_JOBS.filter(
      (j) => coerceStage(j.stage) === stage && !realIds.has(j.id)
    ).slice(0, minimumNeeded - existing.length);

    for (const demoJob of filler) {
      merged.push(demoJob);
      realIds.add(demoJob.id);
    }
  }

  return merged;
}

export default function AwnitDemoBoard() {
  (window as any).__AWNIT_API_MARKER__ = "supabase-wired-awnit-board-stabilized-v6-next-action";

  const location = useLocation();
  const navigate = useNavigate();

  const { supported, listening, toggle, activeTargetRef } = useSpeechDictation();
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  const [jobs, setJobs] = useState<AwnitJobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showPanels, setShowPanels] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [grabCode, setGrabCode] = useState<(typeof GRAB_CODES)[number] | "">(GRAB_CODES[0]);

  const [rightPanel, setRightPanel] = useState<null | "measurement">(null);
  const [panelTitle, setPanelTitle] = useState("Door Measurement Card");
  const [panelUrl, setPanelUrl] = useState("/cards/measurement");

  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const lastEditAtRef = useRef<number>(0);
  const markEdit = () => {
    lastEditAtRef.current = Date.now();
  };
  const recentlyEdited = () => Date.now() - lastEditAtRef.current < 3000;

  const stages: Stage[] = useMemo(() => ["Scheduled", "Measured", "Estimate Sent", "Ordered", "Installed", "Done"], []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const panel = params.get("panel");
    const rawOpenUrl = params.get("open_url");
    const title = params.get("title") || "Door Measurement Card";
    const sessionId = params.get("session_id");
    const code = params.get("code");
    const beam = params.get("beam");

    if (panel === "measurement") {
      let decodedOpenUrl = "/cards/measurement";

      if (rawOpenUrl) {
        try {
          decodedOpenUrl = decodeURIComponent(rawOpenUrl);
        } catch {
          decodedOpenUrl = rawOpenUrl;
        }
      }

      let safePanelPath = "/cards/measurement";

      if (decodedOpenUrl.startsWith("/cards/")) {
        safePanelPath = decodedOpenUrl;
      }

      const workspaceUrl = new URL(safePanelPath, window.location.origin);

      if (beam) workspaceUrl.searchParams.set("beam", beam);
      if (sessionId) workspaceUrl.searchParams.set("session_id", sessionId);
      if (code) workspaceUrl.searchParams.set("code", code);

      setRightPanel("measurement");
      setPanelTitle(title);
      setPanelUrl(`${workspaceUrl.pathname}${workspaceUrl.search}${workspaceUrl.hash}`);
    } else {
      setRightPanel(null);
      setPanelTitle("Door Measurement Card");
      setPanelUrl("/cards/measurement");
    }
  }, [location.search]);

  function closeRightPanel() {
    const params = new URLSearchParams(location.search);
    params.delete("panel");
    params.delete("beam");
    params.delete("card_type");
    params.delete("title");
    params.delete("open_url");
    params.delete("session_id");
    params.delete("code");

    const next = params.toString();

    navigate(
      {
        pathname: location.pathname,
        search: next ? `?${next}` : "",
      },
      { replace: true }
    );

    setRightPanel(null);
  }

  async function loadJobs() {
    if (recentlyEdited()) return;

    try {
      setLoadError(null);
      const rows = await awnitListJobs();

      const normalized: AwnitJobRow[] = (rows || []).map((r: any) => {
        const customer =
          r.customer && typeof r.customer === "object"
            ? r.customer
            : {
                name: r.customer_name ?? r.customerName ?? r.name ?? null,
                phone: r.customer_phone ?? r.customerPhone ?? r.phone ?? null,
                email: r.customer_email ?? r.customerEmail ?? r.email ?? null,
                address: r.customer_address ?? r.customerAddress ?? r.address ?? null,
              };

        return {
          ...r,
          customer,
          stage: coerceStage(r.stage),
          meta: r.meta && typeof r.meta === "object" ? r.meta : {},
        };
      });

      const merged = mergeWithDemoSeed(normalized);

      setJobs(merged);

      setSelectedJobId((cur) => {
        if (cur && merged.some((j) => j.id === cur)) return cur;
        return merged.length ? merged[0].id : null;
      });
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load jobs.");

      const merged = mergeWithDemoSeed([]);
      setJobs(merged);
      setSelectedJobId((cur) => {
        if (cur && merged.some((j) => j.id === cur)) return cur;
        return merged.length ? merged[0].id : null;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();

    const t = window.setInterval(() => {
      if (recentlyEdited()) return;
      loadJobs();
    }, 5000);

    return () => window.clearInterval(t);
  }, []);

  const selectedJob = useMemo(() => jobs.find((j) => j.id === selectedJobId) || null, [jobs, selectedJobId]);

  function updateJobOptimistic(jobId: string, patch: Partial<AwnitJobRow>) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...patch } : j)));
  }

  async function persist(jobId: string, patch: Record<string, any>) {
    markEdit();
    updateJobOptimistic(jobId, patch as any);

    const isDemoJob = jobId.startsWith("demo_");
    if (isDemoJob) return;

    try {
      const saved = await (awnitUpdateJob as any)(jobId, patch);
      if (saved && typeof saved === "object") {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, ...(saved as any) } : j)));
      }
    } catch (e: any) {
      await loadJobs();
      safeToast(e?.message || "Save failed.");
    }
  }

  const debounceRef = useRef<Record<string, number>>({});

  function persistDebounced(jobId: string, patch: Record<string, any>, key: string, ms = 450) {
    markEdit();
    const k = `${jobId}:${key}`;
    if (debounceRef.current[k]) window.clearTimeout(debounceRef.current[k]);
    debounceRef.current[k] = window.setTimeout(() => {
      persist(jobId, patch);
      delete debounceRef.current[k];
    }, ms);
  }

  function getScope(job: AwnitJobRow): ScopeItem[] {
    return coerceScopeItems((job as any).scope_items ?? (job as any).scopeItems);
  }

  function getMaterials(job: AwnitJobRow): MaterialItem[] {
    return coerceMaterials((job as any).materials);
  }

  function getNotes(job: AwnitJobRow): string {
    return (((job as any).tech_notes ?? (job as any).techNotes) || "").toString();
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
    const count = items.filter((x) => x.type === type).length;
    return count + 1;
  }

  function getMaterialsQuickAddText(job: AwnitJobRow): string {
    const m: any = (job as any)?.meta || {};
    return (m.materialsQuickAdd ?? "").toString();
  }

  function setMaterialsQuickAddText(job: AwnitJobRow, val: string) {
    markEdit();
    const curMeta: any = (job as any)?.meta || {};
    const nextMeta = { ...curMeta, materialsQuickAdd: val };

    updateJobOptimistic(job.id, { meta: nextMeta } as any);
    persistDebounced(job.id, { meta: nextMeta }, "meta");
  }

  async function setStage(jobId: string, stage: Stage) {
    await persist(jobId, { stage });
  }

  function addScopeItem(job: AwnitJobRow, type: ScopeType) {
    markEdit();

    const cur = getScope(job);
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

    const next = [item, ...cur];
    updateJobOptimistic(job.id, { scope_items: next } as any);
    persistDebounced(job.id, { scope_items: next }, "scope_items");
  }

  function removeScopeItem(job: AwnitJobRow, itemId: string) {
    markEdit();
    const target = (itemId ?? "").toString();
    const next = getScope(job).filter((x) => (x.id ?? "").toString() !== target);

    updateJobOptimistic(job.id, { scope_items: next } as any);
    persistDebounced(job.id, { scope_items: next }, "scope_items");
  }

  function toggleScopeDone(job: AwnitJobRow, itemId: string) {
    markEdit();
    const target = (itemId ?? "").toString();
    const next = getScope(job).map((x) =>
      (x.id ?? "").toString() === target ? { ...x, done: !Boolean((x as any).done) } : x
    );

    updateJobOptimistic(job.id, { scope_items: next } as any);
    persistDebounced(job.id, { scope_items: next }, "scope_items");
  }

  function setScopeQuick(job: AwnitJobRow, itemId: string, val: string) {
    markEdit();
    const target = (itemId ?? "").toString();
    const next = getScope(job).map((x) => ((x.id ?? "").toString() === target ? { ...x, quick: val } : x));

    updateJobOptimistic(job.id, { scope_items: next } as any);
    persistDebounced(job.id, { scope_items: next }, "scope_items");
  }

  function addMaterial(job: AwnitJobRow, name: string, qty?: string) {
    markEdit();
    const n = (name || "").trim();
    if (!n) return;

    const cur = getMaterials(job);
    const item: MaterialItem = {
      id: makeId(),
      name: n,
      qty: (qty || "").trim() || undefined,
      checked: false,
      addedBy: grabCode || "live",
      addedAt: nowIso(),
    };

    const next = [item, ...cur];
    updateJobOptimistic(job.id, { materials: next } as any);
    persistDebounced(job.id, { materials: next }, "materials");
  }

  function toggleMaterial(job: AwnitJobRow, id: string) {
    markEdit();
    const target = (id ?? "").toString();
    const next = getMaterials(job).map((x) =>
      (x.id ?? "").toString() === target ? { ...x, checked: !Boolean((x as any).checked) } : x
    );

    updateJobOptimistic(job.id, { materials: next } as any);
    persistDebounced(job.id, { materials: next }, "materials");
  }

  function removeMaterial(job: AwnitJobRow, id: string) {
    markEdit();
    const target = (id ?? "").toString();
    const next = getMaterials(job).filter((x) => (x.id ?? "").toString() !== target);

    updateJobOptimistic(job.id, { materials: next } as any);
    persistDebounced(job.id, { materials: next }, "materials");
  }

  function applyTemplate(job: AwnitJobRow, templateKey: string) {
    markEdit();
    const items = MATERIAL_TEMPLATES[templateKey] || [];
    if (!items.length) return;

    const cur = getMaterials(job);
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
      ...cur,
    ] as MaterialItem[];

    updateJobOptimistic(job.id, { materials: next } as any);
    persist(job.id, { materials: next });
  }

  function quickAddMaterials(job: AwnitJobRow) {
    markEdit();
    const raw = (getMaterialsQuickAddText(job) || "").trim();
    if (!raw) return;

    const lines = raw
      .split(/\r?\n/g)
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      const m = line.match(/^(.*?)(?:\s+x\s+(.+))?$/i);
      const name = (m?.[1] || "").trim();
      const qty = (m?.[2] || "").trim();
      addMaterial(job, name, qty || undefined);
    }

    setMaterialsQuickAddText(job, "");
  }

  function setNotes(job: AwnitJobRow, value: string) {
    markEdit();
    updateJobOptimistic(job.id, { tech_notes: value } as any);
    persistDebounced(job.id, { tech_notes: value }, "tech_notes");
  }

  function buildTechPayload(job: AwnitJobRow) {
    const c = job.customer || {};
    const appt = `${job.apptDate || "-"} ${job.apptTime || "-"}`.trim();
    return [
      `AWNIT — Job`,
      `Customer: ${c.name || "-"}`,
      `Phone: ${c.phone || "-"}`,
      `Address: ${c.address || "-"}`,
      `Email: ${c.email || "-"}`,
      ``,
      `Job: ${job.title || "-"}`,
      `Summary: ${job.summary || ""}`,
      `Appt: ${appt}`,
      `Crew: ${job.crew || "-"}`,
      `Stage: ${coerceStage(job.stage)}`,
      `Job ID: ${job.id}`,
    ].join("\n");
  }

  function smsHref(job: AwnitJobRow) {
    const phone = digitsPhone(job.customer?.phone || "");
    if (!phone) return "";
    const body = encodeURIComponent(buildTechPayload(job));
    return `sms:${phone}?&body=${body}`;
  }

  function emailHref(job: AwnitJobRow) {
    const email = (job.customer?.email || "").trim();
    if (!email) return "";
    const subject = encodeURIComponent(`AWNIT — ${job.title || "Job"}`);
    const body = encodeURIComponent(buildTechPayload(job));
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }

  function mapsHref(job: AwnitJobRow) {
    const addr = (job.customer?.address || "").trim();
    if (!addr) return "";
    const q = encodeURIComponent(addr);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function buildGrabListText(job: AwnitJobRow, materials: MaterialItem[]) {
    const c = job.customer || {};
    const header = [
      `AWNIT — Materials Grab List`,
      `Job: ${job.title || "-"}`,
      `Customer: ${c.name || "-"}`,
      `Address: ${c.address || "-"}`,
      `Appt: ${(job.apptDate || "-").toString()} ${(job.apptTime || "-").toString()}`.trim(),
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

  function openCameraCapture() {
    cameraInputRef.current?.click();
  }

  function handleCameraFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    safeToast(`Captured: ${file.name}`);
  }

  async function generateInvoice() {
    if (!selectedJob) return;

    try {
      setIsGeneratingInvoice(true);

      const scope = getScope(selectedJob);
      const mats = getMaterials(selectedJob);
      const notes = getNotes(selectedJob);

      const invoiceId = await createInvoiceFromJob({
        job: selectedJob as any,
        scopeItems: scope,
        materials: mats,
        notes,
      });

      if (!invoiceId) {
        safeToast("Invoice created, but no ID returned.");
        return;
      }

      window.location.assign(`/planet/vehicles/awnit-demo/invoice/${invoiceId}`);
    } catch (e: any) {
      safeToast(e?.message || "Invoice generation failed.");
    } finally {
      setIsGeneratingInvoice(false);
    }
  }

  const jobsByStage = useMemo(() => {
    const map = new Map<Stage, AwnitJobRow[]>();
    for (const s of stages) map.set(s, []);
    for (const j of jobs) map.get(coerceStage(j.stage))?.push(j);
    return map;
  }, [jobs, stages]);

  const activeCrewsCount = useMemo(() => {
    const crews = new Set(
      jobs
        .map((j) => (j.crew || "").trim())
        .filter(Boolean)
    );
    return crews.size;
  }, [jobs]);

  const todaysJobsCount = jobs.length;
  const invoiceReadyCount = jobs.filter((j) => {
    const s = coerceStage(j.stage);
    return s === "Estimate Sent" || s === "Ordered" || s === "Installed" || s === "Done";
  }).length;

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="flex min-h-screen w-full">
        <div className={rightPanel ? "min-w-0 flex-1" : "w-full"}>
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                handleCameraFiles(e.target.files);
                e.currentTarget.value = "";
              }}
            />

            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 sm:p-4 md:p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="min-w-0 text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
                      AWNIT — Live Board
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200 sm:text-xs">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      LIVE
                    </span>

                    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold text-cyan-100 sm:text-xs">
                      HomePlanet Demo Node
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-white/60">
                    Supabase-backed • scope + materials + notes • invoice v1
                  </div>

                  {loadError ? <div className="mt-2 text-xs text-red-300">{loadError}</div> : null}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  <button
                    type="button"
                    className="min-h-[48px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
                    onClick={() => setShowPanels((v) => !v)}
                  >
                    {showPanels ? "Hide Panels" : "Show Panels"}
                  </button>

                  <button
                    type="button"
                    className="min-h-[48px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
                    onClick={() => void loadJobs()}
                    disabled={loading}
                    title="Reload from database"
                  >
                    {loading ? "Loading…" : "Refresh"}
                  </button>

                  <button
                    type="button"
                    className="min-h-[48px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 sm:col-span-2 xl:col-span-1"
                    onClick={() => window.location.assign("/planet/vehicles/awnit-intake")}
                    title="Add a new job"
                  >
                    + Add Job
                  </button>

                  <div className="flex min-h-[48px] items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 sm:col-span-2 xl:col-span-1">
                    <div className="text-xs font-bold text-white/70">Grab Code</div>
                    <select
                      className="min-w-[88px] rounded-lg bg-transparent text-sm outline-none"
                      value={grabCode}
                      onChange={(e) => setGrabCode(e.target.value as any)}
                    >
                      {GRAB_CODES.map((c, idx) => (
                        <option key={reactKey("grab-code", c, idx)} value={c} className="text-black">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    className="min-h-[48px] rounded-xl border border-blue-400/40 bg-blue-500/20 px-5 py-3 text-sm font-extrabold text-blue-100 hover:bg-blue-500/30 disabled:opacity-50 sm:col-span-2 xl:col-span-2"
                    onClick={generateInvoice}
                    disabled={!selectedJob || isGeneratingInvoice}
                    title="Generate invoice from Scope + Materials + Notes"
                  >
                    {isGeneratingInvoice ? "Generating…" : "Generate Invoice"}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80">
                  Today&apos;s Jobs: <span className="text-white">{todaysJobsCount}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80">
                  Active Crews: <span className="text-white">{activeCrewsCount}</span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-white/80">
                  Invoice Ready: <span className="text-white">{invoiceReadyCount}</span>
                </div>
              </div>
            </div>

            {showPanels ? (
              <div className="mt-4">
                <div className="flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-6 xl:overflow-visible xl:pb-0">
                  {stages.map((s, stageIdx) => {
                    const tone = stageTone(s);
                    const list = jobsByStage.get(s) || [];

                    return (
                      <div
                        key={reactKey("stage-lane", s, stageIdx)}
                        className={cn(
                          "min-w-[280px] shrink-0 rounded-2xl border border-white/10 bg-white/5 xl:min-w-0",
                          tone.lane,
                          "border-l-4"
                        )}
                      >
                        <div className="flex items-center justify-between border-b border-white/10 p-3">
                          <div className="text-sm font-extrabold">{s}</div>
                          <div className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", tone.pill)}>
                            {list.length}
                          </div>
                        </div>

                        <div className="space-y-2 p-2">
                          {list.map((j, jobIdx) => (
                            <button
                              key={reactKey("job-card", s, j.id, j.updated_at, jobIdx)}
                              type="button"
                              onClick={() => setSelectedJobId(j.id)}
                              className={cn(
                                "w-full rounded-xl border px-3 py-3 text-left transition hover:bg-white/10",
                                selectedJobId === j.id
                                  ? "border-emerald-400/40 bg-emerald-400/10"
                                  : "border-white/10 bg-white/5"
                              )}
                            >
                              <div className="truncate text-sm font-bold">{j.title || "Untitled Job"}</div>
                              <div className="mt-0.5 truncate text-xs text-white/60">{j.customer?.name || "-"}</div>
                              <div className="mt-1 text-[11px] text-white/60">{fmtAppt(j)}</div>
                            </button>
                          ))}
                          {list.length === 0 ? <div className="px-3 py-2 text-xs text-white/40">No jobs</div> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex flex-col gap-3 border-b border-white/10 p-3 sm:p-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="text-lg font-extrabold">Job Drawer</div>
                  <div className="text-xs text-white/60">Click a job in lanes to load details</div>
                </div>

                {selectedJob ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    <button
                      type="button"
                      className="min-h-[44px] rounded-xl border border-blue-400/40 bg-blue-500/20 px-4 py-3 text-sm font-bold text-blue-100 hover:bg-blue-500/30"
                      onClick={() => copyToClipboard(buildTechPayload(selectedJob))}
                    >
                      Copy Tech Text
                    </button>

                    <button
                      type="button"
                      className="min-h-[44px] rounded-xl border border-blue-400/40 bg-blue-500/20 px-4 py-3 text-sm font-bold text-blue-100 hover:bg-blue-500/30"
                      onClick={openCameraCapture}
                      title="Open camera"
                    >
                      🖼️ Camera
                    </button>

                    {selectedJob.customer?.phone ? (
                      <a
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-500/30"
                        href={smsHref(selectedJob)}
                        target="_blank"
                        rel="noreferrer"
                        title="Text customer from device"
                      >
                        Text Customer
                      </a>
                    ) : null}

                    {selectedJob.customer?.address ? (
                      <a
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10"
                        href={mapsHref(selectedJob)}
                        target="_blank"
                        rel="noreferrer"
                        title="Open in Google Maps"
                      >
                        Maps
                      </a>
                    ) : null}

                    {selectedJob.customer?.phone ? (
                      <a
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10"
                        href={smsHref(selectedJob)}
                        target="_blank"
                        rel="noreferrer"
                        title="Send SMS from device"
                      >
                        Send SMS
                      </a>
                    ) : null}

                    {selectedJob.customer?.email ? (
                      <a
                        className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10"
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
                <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 xl:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                    <div className="text-sm font-extrabold">Customer</div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="font-bold">{selectedJob.customer?.name || "-"}</div>
                      <div className="break-words text-white/70">{selectedJob.customer?.address || "-"}</div>
                      <div className="break-all text-white/70">{selectedJob.customer?.phone || "-"}</div>
                      <div className="break-all text-white/70">{selectedJob.customer?.email || "-"}</div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                      <div className="text-xs font-bold text-white/60">Appointment</div>
                      <div className="mt-1 text-sm font-bold">{fmtAppt(selectedJob)}</div>
                    </div>

                    <div
                      className={cn(
                        "mt-4 rounded-2xl border p-3",
                        nextActionTone(coerceStage(selectedJob.stage))
                      )}
                    >
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] opacity-75">
                        Next Action
                      </div>
                      <div className="mt-1 text-sm font-bold">
                        {nextActionLabel(coerceStage(selectedJob.stage))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs font-bold text-white/60">Stage</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {stages.map((s, idx) => (
                          <button
                            key={reactKey("stage-pill", selectedJob.id, s, idx)}
                            type="button"
                            className={cn(
                              "rounded-full border px-3 py-2 text-xs font-extrabold",
                              coerceStage(selectedJob.stage) === s
                                ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                            )}
                            onClick={() => void setStage(selectedJob.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm font-extrabold">Scope + Measurements</div>
                      <div className="text-xs text-white/60">
                        {(() => {
                          const c = scopeCounts(getScope(selectedJob));
                          return `D:${c.doors} W:${c.windows} S:${c.screens} T:${c.trim} C:${c.custom}`;
                        })()}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {(["door", "window", "screen", "trim", "custom"] as ScopeType[]).map((t, idx) => (
                        <button
                          key={reactKey("scope-add", selectedJob.id, t, idx)}
                          type="button"
                          className="min-h-[42px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                          onClick={() => addScopeItem(selectedJob, t)}
                        >
                          + {t.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 space-y-2">
                      {getScope(selectedJob).length === 0 ? (
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                          Add items (Door/Window/Screen/Trim/Custom). Use mic to append a new line per tap.
                        </div>
                      ) : null}

                      {getScope(selectedJob).map((it, idx) => {
                        const targetId = `scope_${selectedJob.id}_${it.id}`;
                        const isActive = activeTargetRef.current === targetId;

                        return (
                          <div
                            key={reactKey("scope-item", selectedJob.id, it.id, it.type, it.createdAt, idx)}
                            className="rounded-2xl border border-white/10 bg-black/20 p-3"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
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
                                  <div className="min-w-0 truncate text-sm font-extrabold">{it.label}</div>
                                </div>
                                <div className="mt-1 text-xs text-white/50">{it.type}</div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <MicButton
                                  label="Mic"
                                  supported={supported}
                                  listening={listening}
                                  active={isActive}
                                  onClick={() =>
                                    toggle(targetId, (txt, isFinal) => {
                                      setScopeQuick(selectedJob, it.id, dictationAppendLine(it.quick, txt, isFinal));
                                    })
                                  }
                                />
                                <button
                                  type="button"
                                  className="min-h-[42px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                                  onClick={() => removeScopeItem(selectedJob, it.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                            <textarea
                              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                              value={it.quick}
                              onChange={(e) => setScopeQuick(selectedJob, it.id, e.target.value)}
                              placeholder="Measurements / notes (Mic adds a new line per tap)"
                              rows={4}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-extrabold">Materials Grab List</div>
                        <button
                          type="button"
                          className="min-h-[42px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                          onClick={() => copyToClipboard(buildGrabListText(selectedJob, getMaterials(selectedJob)))}
                        >
                          Copy Grab List
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.keys(MATERIAL_TEMPLATES).map((k, idx) => (
                          <button
                            key={reactKey("material-template", selectedJob.id, k, idx)}
                            type="button"
                            className="min-h-[42px] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                            onClick={() => applyTemplate(selectedJob, k)}
                          >
                            + {k}
                          </button>
                        ))}
                      </div>

                      <div className="mt-3">
                        <div className="text-xs font-bold text-white/60">Quick Add (one per line)</div>
                        <textarea
                          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                          value={getMaterialsQuickAddText(selectedJob)}
                          onChange={(e) => setMaterialsQuickAddText(selectedJob, e.target.value)}
                          placeholder={"General: Caulk / sealant\nDoor 1: Hinge set\nGeneral: Screws x 2 boxes"}
                          rows={4}
                        />
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            className="min-h-[42px] rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-black hover:bg-white/90"
                            onClick={() => quickAddMaterials(selectedJob)}
                          >
                            Add Lines
                          </button>

                          <div className="text-xs text-white/50">
                            Added by: <span className="font-bold text-white/70">{grabCode || "live"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 space-y-3">
                        {getMaterials(selectedJob).length === 0 ? (
                          <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/60">
                            No materials yet. Use templates or quick add.
                          </div>
                        ) : null}

                        {groupMaterialsForDisplay(getMaterials(selectedJob)).map(([groupName, items], groupIdx) => (
                          <div
                            key={reactKey("material-group", selectedJob.id, groupName, groupIdx)}
                            className="rounded-2xl border border-white/10 bg-black/20 p-3"
                          >
                            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/55">
                              {groupName}
                            </div>

                            <div className="space-y-2">
                              {items.map((m, idx) => (
                                <div
                                  key={reactKey("material-item", selectedJob.id, groupName, m.id, m.name, m.addedAt, idx)}
                                  className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:flex-row sm:items-start sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <button
                                      type="button"
                                      className="text-left"
                                      onClick={() => toggleMaterial(selectedJob, m.id)}
                                      title="Toggle checked"
                                    >
                                      <div className="break-words text-sm font-bold">
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
                                    className="min-h-[42px] self-start rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold hover:bg-white/10"
                                    onClick={() => removeMaterial(selectedJob, m.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-extrabold">Technician Notes</div>
                        <MicButton
                          label="Mic"
                          supported={supported}
                          listening={listening}
                          active={activeTargetRef.current === `notes_${selectedJob.id}`}
                          onClick={() =>
                            toggle(`notes_${selectedJob.id}`, (txt, isFinal) => {
                              setNotes(selectedJob, dictationAppendLine(getNotes(selectedJob), txt, isFinal));
                            })
                          }
                        />
                      </div>

                      <textarea
                        className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/30"
                        value={getNotes(selectedJob)}
                        onChange={(e) => setNotes(selectedJob, e.target.value)}
                        placeholder="Notes (Mic adds a new line per tap)"
                        rows={8}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <HomePlanetFooter className="mt-8" />
          </div>
        </div>

        {rightPanel === "measurement" && (
          <aside
            className={cn(
              "z-40 border-white/10 bg-black/50 backdrop-blur-xl",
              "fixed inset-x-0 bottom-0 top-[72px] border-t md:top-[80px]",
              "xl:relative xl:top-0 xl:w-[min(48vw,720px)] xl:min-w-[360px] xl:max-w-[720px] xl:border-l xl:border-t-0"
            )}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Beam Workspace</div>
                <div className="truncate text-sm font-semibold text-white">{panelTitle}</div>
              </div>

              <button
                type="button"
                onClick={closeRightPanel}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="h-[calc(100%-57px)] w-full xl:h-[calc(100vh-65px)]">
              <iframe title={panelTitle} src={panelUrl} className="h-full w-full bg-white" />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}