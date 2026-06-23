// apps/web/src/routes/WorkOrderDrawer.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";

export type JobStage = "diagnosing" | "waiting_parts" | "repairing" | "done";

export type Row = {
  id: string;
  created_at: string;
  slug: string;
  payload: any;

  current_stage?: JobStage | null;
  stage_updated_at?: string | null;
  stage_updated_by_employee_code?: string | null;
  handled_by_employee_code?: string | null;
};

type Props = {
  open: boolean;
  row: Row | null;
  onOpenChange: (open: boolean) => void;

  employeeCode?: string;
  employeeName?: string;
  onStageChange?: (stage: JobStage) => void | Promise<void>;
};

export type Line = {
  id: string;
  description: string;
  price: string;
};

type ServiceStory = {
  customerReported: string;
  advisorObserved: string;
  techFound: string;
  recommendedService: string;
  workPerformed: string;
};

type ProofPhoto = {
  id: string;
  label: string;
  name: string;
  mime: string;
  dataUrl: string;
  createdAt: string;
};

export type PrintData = {
  row: {
    id: string;
    created_at: string;
    slug: string;
    payload: any;
  };
  notes: string;
  labor: Line[];
  parts: Line[];
  laborTotal: number;
  partsTotal: number;
  grand: number;

  technicianCode?: string;
  technicianName?: string;

  nextActionLabel?: string;
  nextActionAt?: string;
  nextActionNote?: string;

  serviceStory?: ServiceStory;
  assignedTech?: string;
  priority?: string;
  internalNotes?: string;
  proofPhotos?: ProofPhoto[];

  savedAtIso?: string;
};

type DraftDoc = {
  notes: string;
  labor: Line[];

  parts: Line[];

  next_action_at?: string | null;
  next_action_label?: string | null;
  next_action_note?: string | null;

  service_story?: ServiceStory | null;
  assigned_tech?: string | null;
  priority?: string | null;
  internal_notes?: string | null;
  proof_photos?: ProofPhoto[] | null;
};

/* ---------- utils ---------- */

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function total(lines: Line[]) {
  return (lines || []).reduce((t, l) => t + (parseFloat(l.price) || 0), 0);
}

function makeId() {
  try {
    const c = (globalThis as any)?.crypto;
    if (c?.randomUUID) return c.randomUUID();
  } catch {}
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeLinesForDoc(lines: Partial<Line>[]) {
  return (lines || [])
    .map((l) => ({
      id: String(l.id || makeId()),
      description: String(l.description || ""),
      price: String(l.price || ""),
    }))
    .filter((l) => l.description.trim() || l.price.trim());
}

function ensureUiLines(lines: Partial<Line>[]) {
  const cleaned = (lines || []).map((l) => ({
    id: String(l.id || makeId()),
    description: String(l.description || ""),
    price: String(l.price || ""),
  }));

  return cleaned.length
    ? (cleaned as Line[])
    : [{ id: makeId(), description: "", price: "" }];
}

function trimOrEmpty(v: unknown) {
  try {
    return String(v ?? "").trim();
  } catch {
    return "";
  }
}

function emptyStory(): ServiceStory {
  return {
    customerReported: "",
    advisorObserved: "",
    techFound: "",
    recommendedService: "",
    workPerformed: "",
  };
}

function normalizeStory(value: Partial<ServiceStory> | null | undefined): ServiceStory {
  return {
    customerReported: String(value?.customerReported || ""),
    advisorObserved: String(value?.advisorObserved || ""),
    techFound: String(value?.techFound || ""),
    recommendedService: String(value?.recommendedService || ""),
    workPerformed: String(value?.workPerformed || ""),
  };
}

function hasAnyStoryContent(story: Partial<ServiceStory> | null | undefined) {
  const s = normalizeStory(story);
  return Boolean(
    s.customerReported.trim() ||
      s.advisorObserved.trim() ||
      s.techFound.trim() ||
      s.recommendedService.trim() ||
      s.workPerformed.trim(),
  );
}

function buildServiceSummary(story: ServiceStory) {
  const chunks: string[] = [];

  if (story.customerReported.trim()) {
    chunks.push(`Customer reported: ${story.customerReported.trim()}.`);
  }
  if (story.advisorObserved.trim()) {
    chunks.push(`Advisor observed: ${story.advisorObserved.trim()}.`);
  }
  if (story.techFound.trim()) {
    chunks.push(`Tech found: ${story.techFound.trim()}.`);
  }
  if (story.recommendedService.trim()) {
    chunks.push(`Recommended service: ${story.recommendedService.trim()}.`);
  }
  if (story.workPerformed.trim()) {
    chunks.push(`Work performed: ${story.workPerformed.trim()}.`);
  }

  return chunks.join(" ");
}

function normalizeProofPhotos(input: Partial<ProofPhoto>[] | null | undefined): ProofPhoto[] {
  return (input || [])
    .map((it) => ({
      id: String(it?.id || makeId()),
      label: String(it?.label || "General"),
      name: String(it?.name || "photo.jpg"),
      mime: String(it?.mime || "image/jpeg"),
      dataUrl: String(it?.dataUrl || ""),
      createdAt: String(it?.createdAt || new Date().toISOString()),
    }))
    .filter((it) => it.dataUrl.trim());
}

function seedStoryFromRow(row: Row | null): ServiceStory {
  if (!row) return emptyStory();

  const payload = row.payload || {};

  const directReported =
    trimOrEmpty(payload.customer_reported) ||
    trimOrEmpty(payload.message);

  const service = trimOrEmpty(payload.service_choice);
  const checkin = trimOrEmpty(payload.checkin_mode);
  const vehicle = trimOrEmpty(payload.vehicle);

  const builtReported = [service, checkin, vehicle].filter(Boolean).join(" - ");
  const customerReported = directReported || builtReported || "";

  let advisorObserved = "";
  if (vehicle || service || checkin) {
    const pieces: string[] = [];
    if (service) pieces.push(`intake tagged as ${service.toLowerCase()}`);
    if (checkin) pieces.push(`customer marked ${checkin.toLowerCase()}`);
    if (vehicle) pieces.push(`vehicle listed as ${vehicle}`);
    advisorObserved = pieces.join(" • ");
  }

  return {
    customerReported,
    advisorObserved,
    techFound: "",
    recommendedService: "",
    workPerformed: "",
  };
}

async function fileToJpegDataUrl(file: File, maxW = 1600, maxH = 1600, quality = 0.84) {
  const typeOk = /^image\//i.test(file.type);
  if (!typeOk) throw new Error("Please choose an image file.");

  const url = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to load image."));
      i.src = url;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    const wr = maxW / Math.max(1, w);
    const hr = maxH / Math.max(1, h);
    const r = Math.min(1, wr, hr);

    const nw = Math.max(1, Math.round(w * r));
    const nh = Math.max(1, Math.round(h * r));

    const canvas = document.createElement("canvas");
    canvas.width = nw;
    canvas.height = nh;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not available.");

    ctx.drawImage(img, 0, 0, nw, nh);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function approxBytesFromDataUrl(dataUrl: string) {
  const idx = dataUrl.indexOf(",");
  if (idx < 0) return dataUrl.length;
  const b64 = dataUrl.slice(idx + 1);
  const pad = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - pad);
}

function toDraftDoc(
  notes: string,
  labor: Line[],
  parts: Line[],
  next_action_at?: string | null,
  next_action_label?: string | null,
  next_action_note?: string | null,
  service_story?: ServiceStory | null,
  assigned_tech?: string | null,
  priority?: string | null,
  internal_notes?: string | null,
  proof_photos?: ProofPhoto[] | null,
): DraftDoc {
  return {
    notes: String(notes || ""),
    labor: normalizeLinesForDoc(labor || []),
    parts: normalizeLinesForDoc(parts || []),

    next_action_at: next_action_at ? String(next_action_at) : null,
    next_action_label: next_action_label ? String(next_action_label) : null,
    next_action_note: next_action_note ? String(next_action_note) : null,

    service_story: normalizeStory(service_story || emptyStory()),
    assigned_tech: assigned_tech ? String(assigned_tech) : null,
    priority: priority ? String(priority) : null,
    internal_notes: internal_notes ? String(internal_notes) : null,
    proof_photos: normalizeProofPhotos(proof_photos || []),
  };
}

function shallowEqDoc(a: DraftDoc, b: DraftDoc) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** -------- Quick Text (Tab shorthand expansion) -------- */
const QUICK_TEXT: Record<string, string> = {
  ds: "driver side",
  drv: "driver side",
  driver: "driver side",

  ps: "passenger side",
  pass: "passenger side",
  passenger: "passenger side",

  fr: "front",
  front: "front",
  rr: "rear",
  rear: "rear",

  l: "left",
  left: "left",
  r: "right",
  right: "right",

  hl: "headlamp",
  headlamp: "headlamp",
  headlight: "headlamp",

  alt: "alternator",
  alternator: "alternator",

  batt: "battery",
  battery: "battery",

  wm: "window motor",
  "window-motor": "window motor",

  sw: "switch",
  switch: "switch",

  plug: "tire plug",
  "tire-plug": "tire plug",

  rot: "rotation",
  rotate: "rotation",
  rotation: "rotation",

  rep: "replace",
  repl: "replace",
  replace: "replace",

  test: "test",
  diag: "diagnostic",
  diagnostic: "diagnostic",

  inst: "install",
  install: "install",

  br: "brake",
  bt: "battery test",
  at: "alternator test",
};

type TextEl = HTMLInputElement;

function expandLastTokenOnTab(e: KeyboardEvent<TextEl>, dict = QUICK_TEXT) {
  if (e.key !== "Tab") return;

  const el = e.currentTarget;
  const value = el.value ?? "";
  const caret = el.selectionStart ?? value.length;
  if (caret !== value.length) return;

  const parts = value.split(/\s+/);
  const last = (parts[parts.length - 1] ?? "").trim().toLowerCase();
  if (!last) return;

  const replacement = dict[last];
  if (!replacement) return;

  e.preventDefault();

  parts[parts.length - 1] = replacement;
  const next = parts.join(" ").replace(/\s+/g, " ").trimStart();

  el.value = next;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** -------- Voice (Web Speech API) -------- */
type SpeechRec = {
  start: () => void;
  stop: () => void;
  abort: () => void;
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((ev: any) => void) | null;
  onerror: ((ev: any) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRec) | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/* ---------- tuning ---------- */
const SAVE_DEBOUNCE_MS = 1200;
const PROOF_LABELS = [
  "Beginning",
  "Diagnosis",
  "Old Part",
  "New Part",
  "Middle",
  "Completion",
] as const;

export default function WorkOrderDrawer({
  open,
  row,
  onOpenChange,
  employeeCode,
  employeeName,
  onStageChange,
}: Props) {
  const nav = useNavigate();
  const supabase = useMemo(() => getSupabase(), []);

  const jobId = row?.id || "";
  const draftKey = useMemo(() => (jobId ? `workOrderDraft:${jobId}` : ""), [jobId]);

  const [notes, setNotes] = useState("");
  const [labor, setLabor] = useState<Line[]>(() => [{ id: makeId(), description: "", price: "" }]);
  const [parts, setParts] = useState<Line[]>(() => [{ id: makeId(), description: "", price: "" }]);

  const [nextActionLabel, setNextActionLabel] = useState<string>("Part ETA");
  const [nextActionAt, setNextActionAt] = useState<string>("");
  const [nextActionNote, setNextActionNote] = useState<string>("");

  const [serviceStory, setServiceStory] = useState<ServiceStory>(emptyStory());
  const [assignedTech, setAssignedTech] = useState<string>("");
  const [priority, setPriority] = useState<string>("normal");
  const [internalNotes, setInternalNotes] = useState<string>("");

  const [proofPhotos, setProofPhotos] = useState<ProofPhoto[]>([]);
  const [photoLabel, setPhotoLabel] = useState<string>("Beginning");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState<string>("");

  const notesRef = useRef(notes);
  const laborRef = useRef(labor);
  const partsRef = useRef(parts);

  const nextActionLabelRef = useRef(nextActionLabel);
  const nextActionAtRef = useRef(nextActionAt);
  const nextActionNoteRef = useRef(nextActionNote);

  const serviceStoryRef = useRef(serviceStory);
  const assignedTechRef = useRef(assignedTech);
  const priorityRef = useRef(priority);
  const internalNotesRef = useRef(internalNotes);
  const proofPhotosRef = useRef(proofPhotos);

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);
  useEffect(() => {
    laborRef.current = labor;
  }, [labor]);
  useEffect(() => {
    partsRef.current = parts;
  }, [parts]);

  useEffect(() => {
    nextActionLabelRef.current = nextActionLabel;
  }, [nextActionLabel]);
  useEffect(() => {
    nextActionAtRef.current = nextActionAt;
  }, [nextActionAt]);
  useEffect(() => {
    nextActionNoteRef.current = nextActionNote;
  }, [nextActionNote]);

  useEffect(() => {
    serviceStoryRef.current = serviceStory;
  }, [serviceStory]);
  useEffect(() => {
    assignedTechRef.current = assignedTech;
  }, [assignedTech]);
  useEffect(() => {
    priorityRef.current = priority;
  }, [priority]);
  useEffect(() => {
    internalNotesRef.current = internalNotes;
  }, [internalNotes]);
  useEffect(() => {
    proofPhotosRef.current = proofPhotos;
  }, [proofPhotos]);

  const [syncLabel, setSyncLabel] = useState<string>("");
  const [savedAt, setSavedAt] = useState<string>("");

  const clientId = useMemo(() => {
    try {
      const existing = sessionStorage.getItem("hp_client_id");
      if (existing) return existing;
      const id = makeId();
      sessionStorage.setItem("hp_client_id", id);
      return id;
    } catch {
      return makeId();
    }
  }, []);

  const [dictating, setDictating] = useState<null | { kind: "notes" | "labor" | "parts"; id?: string }>(null);

  const recRef = useRef<SpeechRec | null>(null);
  const speechCtor = useMemo(() => getSpeechRecognition(), []);

  const lastAppliedRemoteRef = useRef<string>("");
  const lastSentRef = useRef<string>("");
  const saveTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(false);

  const hydratingRef = useRef<boolean>(false);
  const hydratedOnceRef = useRef<boolean>(false);

  /* ---------- Load draft when opening a job ---------- */
  useEffect(() => {
    if (!row?.id) return;

    mountedRef.current = true;
    hydratingRef.current = true;
    hydratedOnceRef.current = false;

    setSyncLabel("Live sync");
    setSavedAt("");
    setPhotoError("");
    setPhotoBusy(false);

    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrintData>;
        setNotes(String(parsed.notes || ""));
        setLabor(ensureUiLines((parsed.labor as Partial<Line>[]) || []));
        setParts(ensureUiLines((parsed.parts as Partial<Line>[]) || []));

        setNextActionLabel(String(parsed.nextActionLabel || "Part ETA"));
        setNextActionAt(String(parsed.nextActionAt || ""));
        setNextActionNote(String(parsed.nextActionNote || ""));

        const seeded = seedStoryFromRow(row);
        const incomingStory = normalizeStory(parsed.serviceStory);
        setServiceStory(hasAnyStoryContent(incomingStory) ? incomingStory : seeded);

        setAssignedTech(String(parsed.assignedTech || ""));
        setPriority(String(parsed.priority || "normal"));
        setInternalNotes(String(parsed.internalNotes || ""));
        setProofPhotos(normalizeProofPhotos(parsed.proofPhotos || []));

        if (parsed.savedAtIso) {
          setSavedAt(formatTime(String(parsed.savedAtIso)));
        }
      } else {
        setNotes("");
        setLabor([{ id: makeId(), description: "", price: "" }]);
        setParts([{ id: makeId(), description: "", price: "" }]);

        setNextActionLabel("Part ETA");
        setNextActionAt("");
        setNextActionNote("");

        setServiceStory(seedStoryFromRow(row));
        setAssignedTech("");
        setPriority("normal");
        setInternalNotes("");
        setProofPhotos([]);
      }
    } catch {
      setNotes("");
      setLabor([{ id: makeId(), description: "", price: "" }]);
      setParts([{ id: makeId(), description: "", price: "" }]);

      setNextActionLabel("Part ETA");
      setNextActionAt("");
      setNextActionNote("");

      setServiceStory(seedStoryFromRow(row));
      setAssignedTech("");
      setPriority("normal");
      setInternalNotes("");
      setProofPhotos([]);
    }

    (async () => {
      try {
        const { data, error } = await supabase
          .from("work_order_drafts")
          .select("doc, updated_at, updated_by_device_id")
          .eq("job_id", row.id)
          .limit(1)
          .maybeSingle();

        if (!mountedRef.current) return;

        if (error) {
          setSyncLabel("Live sync (read err)");
          hydratedOnceRef.current = true;
          hydratingRef.current = false;
          return;
        }

        if (data?.doc) {
          const doc = data.doc as DraftDoc;

          const normalized = toDraftDoc(
            doc.notes || "",
            (doc.labor as any) || [],
            (doc.parts as any) || [],
            doc.next_action_at || null,
            doc.next_action_label || null,
            doc.next_action_note || null,
            doc.service_story || emptyStory(),
            doc.assigned_tech || "",
            doc.priority || "normal",
            doc.internal_notes || "",
            doc.proof_photos || [],
          );

          const js = JSON.stringify(normalized);
          lastAppliedRemoteRef.current = js;

          setNotes(normalized.notes);
          setLabor(ensureUiLines(normalized.labor));
          setParts(ensureUiLines(normalized.parts));

          setNextActionLabel(String(normalized.next_action_label || "Part ETA"));
          setNextActionAt(String(normalized.next_action_at || ""));
          setNextActionNote(String(normalized.next_action_note || ""));

          const seeded = seedStoryFromRow(row);
          const incomingStory = normalizeStory(normalized.service_story);
          setServiceStory(hasAnyStoryContent(incomingStory) ? incomingStory : seeded);

          setAssignedTech(String(normalized.assigned_tech || ""));
          setPriority(String(normalized.priority || "normal"));
          setInternalNotes(String(normalized.internal_notes || ""));
          setProofPhotos(normalizeProofPhotos(normalized.proof_photos || []));

          if (data.updated_at) setSavedAt(formatTime(String(data.updated_at)));
          setSyncLabel("Live sync");
        }

        hydratedOnceRef.current = true;
        hydratingRef.current = false;
      } catch {
        if (!mountedRef.current) return;
        setSyncLabel("Live sync (read err)");
        hydratedOnceRef.current = true;
        hydratingRef.current = false;
      }
    })();

    return () => {
      mountedRef.current = false;
      hydratingRef.current = false;
      hydratedOnceRef.current = false;

      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    };
  }, [row?.id, draftKey, row, supabase]);

  /* ---------- Realtime subscribe ---------- */
  useEffect(() => {
    if (!open || !row?.id) return;

    const chan = supabase
      .channel(`wo-draft:${row.id}`, { config: { broadcast: { ack: true } } })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "work_order_drafts",
          filter: `job_id=eq.${row.id}`,
        },
        (p: any) => {
          const next = p.new;
          if (!next?.doc) return;

          const updatedByDevice = String(next.updated_by_device_id || "");
          if (updatedByDevice && updatedByDevice === clientId) return;

          const doc = next.doc as DraftDoc;
          const normalized = toDraftDoc(
            doc.notes || "",
            (doc.labor as any) || [],
            (doc.parts as any) || [],
            doc.next_action_at || null,
            doc.next_action_label || null,
            doc.next_action_note || null,
            doc.service_story || emptyStory(),
            doc.assigned_tech || "",
            doc.priority || "normal",
            doc.internal_notes || "",
            doc.proof_photos || [],
          );

          const js = JSON.stringify(normalized);
          if (js === lastAppliedRemoteRef.current) return;
          lastAppliedRemoteRef.current = js;

          const current = toDraftDoc(
            notesRef.current,
            laborRef.current,
            partsRef.current,
            nextActionAtRef.current || null,
            nextActionLabelRef.current || null,
            nextActionNoteRef.current || null,
            serviceStoryRef.current,
            assignedTechRef.current || null,
            priorityRef.current || null,
            internalNotesRef.current || null,
            proofPhotosRef.current,
          );
          if (shallowEqDoc(current, normalized)) return;

          setNotes(normalized.notes);
          setLabor(ensureUiLines(normalized.labor));
          setParts(ensureUiLines(normalized.parts));

          setNextActionLabel(String(normalized.next_action_label || "Part ETA"));
          setNextActionAt(String(normalized.next_action_at || ""));
          setNextActionNote(String(normalized.next_action_note || ""));

          const seeded = seedStoryFromRow(row);
          const incomingStory = normalizeStory(normalized.service_story);
          setServiceStory(hasAnyStoryContent(incomingStory) ? incomingStory : seeded);

          setAssignedTech(String(normalized.assigned_tech || ""));
          setPriority(String(normalized.priority || "normal"));
          setInternalNotes(String(normalized.internal_notes || ""));
          setProofPhotos(normalizeProofPhotos(normalized.proof_photos || []));

          if (next.updated_at) setSavedAt(formatTime(String(next.updated_at)));
          setSyncLabel("Live sync");
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setSyncLabel("Live sync");
        else setSyncLabel(`Live sync (${String(status)})`);
      });

    return () => {
      try {
        supabase.removeChannel(chan);
      } catch {}
    };
  }, [open, row?.id, clientId, row, supabase]);

  /* ---------- Save ---------- */
  useEffect(() => {
    if (!row?.id) return;
    if (hydratingRef.current || !hydratedOnceRef.current) return;

    const laborTotal = total(labor);
    const partsTotal = total(parts);
    const grand = laborTotal + partsTotal;

    const payload: PrintData = {
      row,
      notes,
      labor,
      parts,
      laborTotal,
      partsTotal,
      grand,
      technicianCode: (employeeCode || "").trim() || undefined,
      technicianName: (employeeName || "").trim() || undefined,

      nextActionLabel,
      nextActionAt,
      nextActionNote,

      serviceStory,
      assignedTech,
      priority,
      internalNotes,
      proofPhotos,

      savedAtIso: new Date().toISOString(),
    };

    try {
      localStorage.setItem(draftKey, JSON.stringify(payload));
    } catch {}

    const doc = toDraftDoc(
      notes,
      labor,
      parts,
      nextActionAt || null,
      nextActionLabel || null,
      nextActionNote || null,
      serviceStory,
      assignedTech || null,
      priority || null,
      internalNotes || null,
      proofPhotos,
    );
    const js = JSON.stringify(doc);

    if (js === lastAppliedRemoteRef.current) return;
    if (js === lastSentRef.current) return;

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(async () => {
      try {
        setSyncLabel("Live sync");

        const tech =
          (employeeCode || "").trim() ||
          (row.stage_updated_by_employee_code || row.handled_by_employee_code || "").trim() ||
          "";

        const { error } = await supabase.from("work_order_drafts").upsert(
          {
            job_id: row.id,
            shop_slug: row.slug,
            doc,
            updated_by_device_id: clientId,
            updated_by_employee_code: tech || null,
            updated_by: tech || null,
          },
          { onConflict: "job_id" },
        );

        if (error) {
          setSyncLabel("Live sync (save err)");
          return;
        }

        lastSentRef.current = js;
        setSavedAt(formatTime(new Date().toISOString()));
        setSyncLabel("Live sync");
      } catch {
        setSyncLabel("Live sync (save err)");
      }
    }, SAVE_DEBOUNCE_MS);
  }, [
    row?.id,
    draftKey,
    notes,
    labor,
    parts,
    nextActionLabel,
    nextActionAt,
    nextActionNote,
    serviceStory,
    assignedTech,
    priority,
    internalNotes,
    proofPhotos,
    row,
    employeeCode,
    employeeName,
    clientId,
    supabase,
  ]);

  function updateLine(
    setter: Dispatch<SetStateAction<Line[]>>,
    id: string,
    key: keyof Omit<Line, "id">,
    val: string,
  ) {
    setter((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: val } : l)));
  }

  function addLine(setter: Dispatch<SetStateAction<Line[]>>) {
    setter((prev) => [...prev, { id: makeId(), description: "", price: "" }]);
  }

  function updateStoryField(key: keyof ServiceStory, value: string) {
    setServiceStory((prev) => ({ ...prev, [key]: value }));
  }

  async function handleProofPhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPhotoBusy(true);
    setPhotoError("");

    try {
      const built: ProofPhoto[] = [];

      for (const file of files) {
        const dataUrl = await fileToJpegDataUrl(file, 1600, 1600, 0.84);
        const bytes = approxBytesFromDataUrl(dataUrl);
        if (bytes > 950_000) {
          throw new Error("One of the proof photos is too large. Try a smaller image.");
        }

        built.push({
          id: makeId(),
          label: photoLabel || "General",
          name: file.name || "photo.jpg",
          mime: "image/jpeg",
          dataUrl,
          createdAt: new Date().toISOString(),
        });
      }

      setProofPhotos((prev) => [...built, ...prev]);
    } catch (err: any) {
      setPhotoError(err?.message || "Failed to attach proof photo.");
    } finally {
      e.target.value = "";
      setPhotoBusy(false);
    }
  }

  function removeProofPhoto(id: string) {
    setProofPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  const laborTotal = total(labor);
  const partsTotal = total(parts);
  const grand = laborTotal + partsTotal;
  const serviceSummary = useMemo(() => buildServiceSummary(serviceStory), [serviceStory]);

  function close() {
    try {
      recRef.current?.abort?.();
    } catch {}
    recRef.current = null;
    setDictating(null);
    onOpenChange(false);
  }

  async function setStage(stage: JobStage) {
    if (!onStageChange) return;
    await onStageChange(stage);
    if (stage === "done") close();
  }

  function goPrint() {
    if (!row) return;

    const techCode =
      (employeeCode || "").trim() ||
      (row.stage_updated_by_employee_code || row.handled_by_employee_code || "").trim() ||
      "";

    const data: PrintData = {
      row,
      notes,
      labor: ensureUiLines(normalizeLinesForDoc(labor)),
      parts: ensureUiLines(normalizeLinesForDoc(parts)),
      laborTotal,
      partsTotal,
      grand,
      technicianCode: techCode || undefined,
      technicianName: (employeeName || "").trim() || undefined,

      nextActionLabel,
      nextActionAt,
      nextActionNote,

      serviceStory,
      assignedTech,
      priority,
      internalNotes,
      proofPhotos,

      savedAtIso: new Date().toISOString(),
    };

    try {
      sessionStorage.setItem("printWorkOrder", JSON.stringify(data));
      sessionStorage.setItem(`printWorkOrder:${row.id}`, JSON.stringify(data));
    } catch {}

    try {
      localStorage.setItem(`workOrderDraft:${row.id}`, JSON.stringify(data));
    } catch {}

    nav(`/live/${row.slug}/staff?print=${encodeURIComponent(row.id)}`);
  }

  function startDictationForNotes() {
    if (!speechCtor) return;

    if (dictating?.kind === "notes") {
      try {
        recRef.current?.stop?.();
      } catch {}
      return;
    }

    try {
      recRef.current?.abort?.();
    } catch {}

    const rec = new speechCtor();
    recRef.current = rec;

    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (ev: any) => {
      const t = ev?.results?.[0]?.[0]?.transcript;
      if (typeof t === "string" && t.trim()) {
        setNotes((prev) => (prev ? prev.trimEnd() + "\n" + t.trim() : t.trim()));
      }
    };

    rec.onerror = () => {
      try {
        rec.abort();
      } catch {}
      recRef.current = null;
      setDictating(null);
    };

    rec.onend = () => setDictating((d) => (d?.kind === "notes" ? null : d));

    setDictating({ kind: "notes" });
    rec.start();
  }

  function startDictationForLine(kind: "labor" | "parts", lineId: string) {
    if (!speechCtor) return;

    if (dictating?.kind === kind && dictating?.id === lineId) {
      try {
        recRef.current?.stop?.();
      } catch {}
      return;
    }

    try {
      recRef.current?.abort?.();
    } catch {}

    const rec = new speechCtor();
    recRef.current = rec;

    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;

    rec.onresult = (ev: any) => {
      const t = ev?.results?.[0]?.[0]?.transcript;
      if (typeof t === "string" && t.trim()) {
        const text = t.trim();
        if (kind === "labor") {
          setLabor((prev) =>
            prev.map((l) => {
              if (l.id !== lineId) return l;
              const merged = l.description ? l.description.trimEnd() + " " + text : text;
              return { ...l, description: merged };
            }),
          );
        } else {
          setParts((prev) =>
            prev.map((p) => {
              if (p.id !== lineId) return p;
              const merged = p.description ? p.description.trimEnd() + " " + text : text;
              return { ...p, description: merged };
            }),
          );
        }
      }
    };

    rec.onerror = () => {
      try {
        rec.abort();
      } catch {}
      recRef.current = null;
      setDictating(null);
    };

    rec.onend = () =>
      setDictating((d) => (d?.kind === kind && d?.id === lineId ? null : d));

    setDictating({ kind, id: lineId });
    rec.start();
  }

  if (!open || !row) return null;

  const stage = (row.current_stage || "diagnosing") as JobStage;
  const lastBy = row.stage_updated_by_employee_code || row.handled_by_employee_code || "";
  const lastAt = row.stage_updated_at || "";

  const techLabel =
    (employeeName || "").trim() ||
    (employeeCode || "").trim() ||
    (lastBy || "").trim() ||
    "";

  const customerName = row.payload?.name || "Customer";
  const vehicleLabel = row.payload?.vehicle || "Vehicle";
  const phoneLabel = row.payload?.phone || "-";
  const serviceChoice = row.payload?.service_choice || "-";
  const checkinMode = row.payload?.checkin_mode || "-";
  const photoUrl = row.payload?.photo?.data_url || row.payload?.photo_url || "";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={close}>
      <div
        className="h-full w-[620px] overflow-y-auto bg-slate-950 p-6 text-white space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <div className="text-2xl font-bold truncate">{vehicleLabel}</div>
            <div className="text-sm text-slate-300 truncate">{customerName}</div>
            <div className="text-xs text-slate-500 mt-1">
              {new Date(row.created_at).toLocaleString()}
            </div>

            <div className="text-xs text-slate-400 mt-2">
              Stage: <span className="text-slate-200 font-semibold">{stage}</span>
              {lastBy ? (
                <>
                  {" "}
                  - Last: <span className="text-slate-200 font-semibold">{lastBy}</span>
                  {lastAt ? <span className="text-slate-400"> @ {formatTime(lastAt)}</span> : null}
                </>
              ) : null}
            </div>

            {techLabel ? (
              <div className="text-[11px] text-slate-500 mt-1">
                Technician: <span className="text-slate-300 font-semibold">{techLabel}</span>
              </div>
            ) : null}

            <div className="mt-2 flex items-center gap-3">
              <span className="text-[11px] font-semibold rounded-md border border-emerald-700/60 bg-emerald-600/10 px-2 py-1 text-emerald-200">
                {syncLabel || "Live sync"}
              </span>
              {savedAt ? <span className="text-[11px] text-slate-500">Saved: {savedAt}</span> : null}
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-slate-700 px-3 py-2 hover:border-slate-400"
          >
            Close
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <div className="text-lg font-semibold">Intake</div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoBox label="Customer" value={customerName} />
            <InfoBox label="Phone" value={phoneLabel} />
            <InfoBox label="Vehicle" value={vehicleLabel} />
            <InfoBox label="Service" value={serviceChoice} />
            <InfoBox label="Check-In" value={checkinMode} />
            <InfoBox label="Receipt" value={row.payload?.receipt_id || row.id} />
          </div>

          {row.payload?.message ? (
            <div>
              <div className="text-sm text-slate-400 mb-1">Customer Message</div>
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200">
                {row.payload.message}
              </div>
            </div>
          ) : null}

          {photoUrl ? (
            <div>
              <div className="text-sm text-slate-400 mb-1">Intake Photo</div>
              <img
                src={photoUrl}
                alt="Intake"
                className="max-h-64 w-full rounded-xl border border-slate-700 object-cover"
              />
            </div>
          ) : null}
        </div>

        {onStageChange ? (
          <div className="space-y-2">
            <div className="text-sm text-slate-400">Job Stage</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStage("diagnosing")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "diagnosing"
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Diagnosing
              </button>
              <button
                type="button"
                onClick={() => setStage("waiting_parts")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "waiting_parts"
                    ? "border-orange-400 bg-orange-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Waiting Parts
              </button>
              <button
                type="button"
                onClick={() => setStage("repairing")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "repairing"
                    ? "border-emerald-400 bg-emerald-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Repairing
              </button>
              <button
                type="button"
                onClick={() => setStage("done")}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                  stage === "done"
                    ? "border-green-400 bg-green-500/10"
                    : "border-slate-700 hover:border-slate-400"
                }`}
              >
                Done
              </button>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <div className="text-lg font-semibold">Service Story</div>

          <StoryField
            label="Customer Reported"
            value={serviceStory.customerReported}
            onChange={(v) => updateStoryField("customerReported", v)}
            placeholder="What the customer said was happening..."
          />

          <StoryField
            label="Advisor Observed"
            value={serviceStory.advisorObserved}
            onChange={(v) => updateStoryField("advisorObserved", v)}
            placeholder="What the advisor noticed at intake..."
          />

          <StoryField
            label="Tech Found"
            value={serviceStory.techFound}
            onChange={(v) => updateStoryField("techFound", v)}
            placeholder="What the tech found during diagnosis..."
          />

          <StoryField
            label="Recommended Service"
            value={serviceStory.recommendedService}
            onChange={(v) => updateStoryField("recommendedService", v)}
            placeholder="What service is recommended..."
          />

          <StoryField
            label="Work Performed"
            value={serviceStory.workPerformed}
            onChange={(v) => updateStoryField("workPerformed", v)}
            placeholder="What was actually done..."
          />

          <div className="rounded-xl border border-emerald-700/50 bg-emerald-500/10 p-3">
            <div className="text-xs uppercase tracking-wide text-emerald-300 font-semibold">
              Stitched Service Summary
            </div>
            <div className="mt-2 text-sm leading-6 text-emerald-100">
              {serviceSummary || "Service summary will build here as the story is filled out."}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <div className="text-lg font-semibold">Proof Photos</div>

          <div className="grid grid-cols-[180px_1fr] gap-2">
            <select
              value={photoLabel}
              onChange={(e) => setPhotoLabel(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
            >
              {PROOF_LABELS.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>

            <label className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold cursor-pointer hover:border-slate-500">
              {photoBusy ? "Uploading..." : "Add Photo"}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={handleProofPhotoChange}
                disabled={photoBusy}
              />
            </label>
          </div>

          <div className="text-xs text-slate-500">
            Beginning, diagnosis, old parts, new parts, middle progress, completion.
          </div>

          {photoError ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {photoError}
            </div>
          ) : null}

          {proofPhotos.length ? (
            <div className="grid grid-cols-2 gap-3">
              {proofPhotos.map((photo) => (
                <div key={photo.id} className="rounded-xl border border-slate-700 bg-slate-900 p-2">
                  <img
                    src={photo.dataUrl}
                    alt={photo.label}
                    className="h-36 w-full rounded-lg object-cover border border-slate-800"
                  />
                  <div className="mt-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">
                        {photo.label}
                      </div>
                      <div className="text-xs text-slate-300 truncate">{photo.name}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProofPhoto(photo.id)}
                      className="rounded-md border border-slate-700 px-2 py-1 text-[11px] hover:border-slate-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-500">
              No drawer proof photos yet.
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="text-sm text-slate-400">Technician Notes</div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                startDictationForNotes();
              }}
              disabled={!speechCtor}
              className={`text-xs px-3 py-1 rounded-lg border ${
                !speechCtor
                  ? "border-slate-800 text-slate-600"
                  : dictating?.kind === "notes"
                    ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                    : "border-slate-700 text-slate-200 hover:border-slate-400"
              }`}
              title={!speechCtor ? "Voice input not supported in this browser" : "Dictate notes"}
            >
              {dictating?.kind === "notes" ? "Listening..." : "Mic"}
            </button>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
            placeholder="Diagnosis, findings, recommendations..."
          />
          <div className="text-[11px] text-slate-500 mt-2">
            Live sync + local safety draft.
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <div className="text-lg font-semibold">Assignment</div>

          <div>
            <div className="text-sm text-slate-400 mb-1">Assigned Tech</div>
            <input
              value={assignedTech}
              onChange={(e) => setAssignedTech(e.target.value)}
              placeholder="Assign technician"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <div className="text-sm text-slate-400 mb-2">Priority</div>
            <div className="flex gap-2 flex-wrap">
              {["high", "normal", "low"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize ${
                    priority === p
                      ? "border-blue-400 bg-blue-500/10 text-white"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm text-slate-400">Next Date</div>
            <div className="text-[11px] text-slate-500">Part ETA / customer return</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={nextActionLabel}
              onChange={(e) => setNextActionLabel(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm"
            >
              <option>Part ETA</option>
              <option>Customer Return</option>
              <option>Appointment</option>
              <option>Recheck</option>
              <option>Drop-off</option>
              <option>Other</option>
            </select>

            <input
              type="datetime-local"
              value={nextActionAt}
              onChange={(e) => setNextActionAt(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-sm"
            />
          </div>

          <input
            value={nextActionNote}
            onChange={(e) => setNextActionNote(e.target.value)}
            placeholder='Optional note (e.g., "AutoZone arriving", "customer after 3pm")'
            className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Labor</div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addLine(setLabor);
              }}
              className="text-xs text-blue-400"
            >
              + Add
            </button>
          </div>

          {labor.map((l) => (
            <div key={l.id} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startDictationForLine("labor", l.id);
                }}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "labor" && dictating?.id === l.id
                      ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                      : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={!speechCtor ? "Voice input not supported" : "Dictate labor description"}
              >
                Mic
              </button>

              <input
                value={l.description}
                onChange={(e) => updateLine(setLabor, l.id, "description", e.target.value)}
                onKeyDown={expandLastTokenOnTab}
                placeholder="Labor description"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={l.price}
                onChange={(e) => updateLine(setLabor, l.id, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">
            Labor Total: ${laborTotal.toFixed(2)}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold">Parts</div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addLine(setParts);
              }}
              className="text-xs text-blue-400"
            >
              + Add
            </button>
          </div>

          {parts.map((p) => (
            <div key={p.id} className="flex gap-2 mb-2 items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  startDictationForLine("parts", p.id);
                }}
                disabled={!speechCtor}
                className={`h-9 px-2 rounded-lg border ${
                  !speechCtor
                    ? "border-slate-800 text-slate-600"
                    : dictating?.kind === "parts" && dictating?.id === p.id
                      ? "border-emerald-400 text-emerald-200 bg-emerald-500/10"
                      : "border-slate-700 text-slate-200 hover:border-slate-400"
                }`}
                title={!speechCtor ? "Voice input not supported" : "Dictate part description"}
              >
                Mic
              </button>

              <input
                value={p.description}
                onChange={(e) => updateLine(setParts, p.id, "description", e.target.value)}
                onKeyDown={expandLastTokenOnTab}
                placeholder="Part"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 h-9"
              />
              <input
                value={p.price}
                onChange={(e) => updateLine(setParts, p.id, "price", e.target.value)}
                placeholder="0.00"
                className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-right h-9"
              />
            </div>
          ))}

          <div className="text-right text-sm text-slate-300 mt-1">
            Parts Total: ${partsTotal.toFixed(2)}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 text-right text-lg font-bold">
          Grand Total: ${grand.toFixed(2)}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4">
          <div className="text-lg font-semibold">Completion</div>

          <div>
            <div className="text-sm text-slate-400 mb-1">Internal / Final Notes</div>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              className="w-full h-28 bg-slate-900 border border-slate-700 rounded-xl p-3"
              placeholder="Completion notes, pickup notes, final notes..."
            />
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm text-slate-300">
            <div>
              <span className="text-slate-500">Assigned Tech:</span>{" "}
              <span className="font-semibold text-slate-100">{assignedTech || "-"}</span>
            </div>
            <div className="mt-1">
              <span className="text-slate-500">Priority:</span>{" "}
              <span className="font-semibold text-slate-100 capitalize">{priority}</span>
            </div>
            <div className="mt-1">
              <span className="text-slate-500">Current Stage:</span>{" "}
              <span className="font-semibold text-slate-100">{stage}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            goPrint();
          }}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold"
        >
          Print Work Order
        </button>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">
        {label}
      </div>
      <div className="mt-1 text-sm text-slate-100 break-words">{value}</div>
    </div>
  );
}

function StoryField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-24 bg-slate-900 border border-slate-700 rounded-xl p-3"
        placeholder={placeholder}
      />
    </div>
  );
}