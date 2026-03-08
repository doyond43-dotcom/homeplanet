// src/pages/LegalDemoBoard.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type MatterStage =
  | "Intake"
  | "Evidence Review"
  | "Timeline Built"
  | "Demand Prep"
  | "Litigation Ready"
  | "Archived";

type EvidenceKind = "pdf" | "photo" | "video" | "audio" | "note" | "record" | "other";

type TimelineEvent = {
  id: string;
  date: string;
  title: string;
  summary: string;
  source: string;
  kind: EvidenceKind;
  createdAt: string;
};

type EvidenceItem = {
  id: string;
  name: string;
  kind: EvidenceKind;
  source: string;
  addedAt: string;
  fileSizeLabel?: string;
  fileTypeLabel?: string;
};

type ActorItem = {
  id: string;
  name: string;
  role: string;
};

type FactItem = {
  id: string;
  text: string;
};

type IssueItem = {
  id: string;
  text: string;
};

type LegalMatter = {
  id: string;
  title: string;
  summary: string;
  stage: MatterStage;
  matterNumber?: string;
  attorney: string;
  client: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  incidentDate?: string;
  venue?: string;
  sourceAnchor?: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  actors: ActorItem[];
  facts: FactItem[];
  issues: IssueItem[];
  notes: string;
  meta?: Record<string, any>;
};

type SpeechCtor = new () => any;

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
  if (!val) {
    safeToast("Nothing to copy.");
    return;
  }

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

function safeDateLabel(isoLike: any) {
  try {
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}

function formatBytes(bytes: number) {
  if (!bytes || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
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

function getSpeechCtor(): SpeechCtor | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition ? (w.SpeechRecognition || w.webkitSpeechRecognition) : null;
}

function dictationAppendLine(prev: string, text: string, isFinal: boolean) {
  if (!isFinal) return prev;
  const line = (text || "").trim();
  if (!line) return prev;
  const base = (prev || "").trimEnd();
  return (base ? `${base}\n${line}` : line) + "\n";
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
    "inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-extrabold border transition select-none whitespace-nowrap";
  const off =
    "border-[#4a5770] bg-[linear-gradient(180deg,rgba(28,37,57,.96),rgba(18,25,40,.96))] text-[#f1ead8] hover:bg-[#243049]";
  const on =
    "border-[#d9bc74] bg-[linear-gradient(180deg,rgba(62,47,20,.96),rgba(40,30,12,.96))] text-[#fff2cf] hover:bg-[#4a3916]";
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

function stageTone(stage: MatterStage) {
  switch (stage) {
    case "Intake":
      return {
        lane: "border-l-[#53c6ff]",
        glow: "",
        pill: "border-[#53c6ff]/40 bg-[#53c6ff]/12 text-[#d9f5ff]",
      };
    case "Evidence Review":
      return {
        lane: "border-l-[#d4ab54]",
        glow: "",
        pill: "border-[#d4ab54]/40 bg-[#d4ab54]/12 text-[#fff2cf]",
      };
    case "Timeline Built":
      return {
        lane: "border-l-[#8a79ff]",
        glow: "",
        pill: "border-[#8a79ff]/40 bg-[#8a79ff]/12 text-[#e8e1ff]",
      };
    case "Demand Prep":
      return {
        lane: "border-l-[#ffb84d]",
        glow: "",
        pill: "border-[#ffb84d]/40 bg-[#ffb84d]/12 text-[#fff1d7]",
      };
    case "Litigation Ready":
      return {
        lane: "border-l-[#7cf7d4]",
        glow: "",
        pill: "border-[#7cf7d4]/40 bg-[#7cf7d4]/12 text-[#defff7]",
      };
    case "Archived":
      return {
        lane: "border-l-[#6c7488]",
        glow: "",
        pill: "border-white/10 bg-white/5 text-slate-200",
      };
    default:
      return {
        lane: "border-l-[#d4ab54]",
        glow: "",
        pill: "border-[#d4ab54]/40 bg-[#d4ab54]/12 text-[#fff2cf]",
      };
  }
}

function coerceStage(s: any): MatterStage {
  const v = (s || "").toString();
  const ok: MatterStage[] = ["Intake", "Evidence Review", "Timeline Built", "Demand Prep", "Litigation Ready", "Archived"];
  return ok.includes(v as MatterStage) ? (v as MatterStage) : "Intake";
}

function buildMatterText(matter: LegalMatter) {
  return [
    `HomePlanet — Legal Evidence Demo`,
    `Matter: ${matter.title || "-"}`,
    `Matter #: ${matter.matterNumber || "-"}`,
    `Attorney: ${matter.attorney || "-"}`,
    `Client: ${matter.client?.name || "-"}`,
    `Phone: ${matter.client?.phone || "-"}`,
    `Email: ${matter.client?.email || "-"}`,
    `Venue: ${matter.venue || "-"}`,
    `Incident Date: ${matter.incidentDate || "-"}`,
    `Stage: ${matter.stage || "-"}`,
    `Source Anchor: ${matter.sourceAnchor || "Presence-first matter intake"}`,
  ].join("\n");
}

function smsHref(matter: LegalMatter) {
  const phone = digitsPhone(matter.client?.phone || "");
  if (!phone) return "";
  const body = encodeURIComponent(buildMatterText(matter));
  return `sms:${phone}?&body=${body}`;
}

function emailHref(matter: LegalMatter) {
  const email = (matter.client?.email || "").trim();
  if (!email) return "";
  const subject = encodeURIComponent(`HomePlanet Legal Demo — ${matter.title || "Matter"}`);
  const body = encodeURIComponent(buildMatterText(matter));
  return `mailto:${email}?subject=${subject}&body=${body}`;
}

function mapsHref(matter: LegalMatter) {
  const addr = (matter.client?.address || "").trim();
  if (!addr) return "";
  const q = encodeURIComponent(addr);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function buildPacketPreview(matter: LegalMatter) {
  const timeline = matter.timeline
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t, idx) => `${idx + 1}. ${t.date || "—"} — ${t.title} (${t.kind})${t.summary ? ` — ${t.summary}` : ""}`)
    .join("\n");

  const evidence = matter.evidence
    .slice()
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt))
    .map((e, idx) => `${idx + 1}. ${e.name} — ${e.kind} — ${e.source}`)
    .join("\n");

  const actors = matter.actors.map((a, idx) => `${idx + 1}. ${a.name} — ${a.role}`).join("\n");
  const facts = matter.facts.map((f, idx) => `${idx + 1}. ${f.text}`).join("\n");
  const issues = matter.issues.map((i, idx) => `${idx + 1}. ${i.text}`).join("\n");

  return [
    `HOMEPLANET — CASE PACKET PREVIEW`,
    ``,
    `Matter: ${matter.title}`,
    `Matter #: ${matter.matterNumber || "-"}`,
    `Attorney: ${matter.attorney}`,
    `Client: ${matter.client.name}`,
    `Venue: ${matter.venue || "-"}`,
    `Incident Date: ${matter.incidentDate || "-"}`,
    `Current Stage: ${matter.stage}`,
    `Source Anchor: ${matter.sourceAnchor || "Presence-first matter intake"}`,
    ``,
    `SUMMARY`,
    matter.summary || "-",
    ``,
    `TIMELINE`,
    timeline || "-",
    ``,
    `EVIDENCE`,
    evidence || "-",
    ``,
    `ACTORS`,
    actors || "-",
    ``,
    `FACTS`,
    facts || "-",
    ``,
    `ISSUES`,
    issues || "-",
    ``,
    `NOTES`,
    matter.notes?.trim() || "-",
    ``,
    `ANCHORING LANGUAGE`,
    `Every item entered into this matter is anchored to its point of entry, preserving source context, sequence, and review visibility for legal workflow demonstration purposes.`,
  ].join("\n");
}

function seedMatters(): LegalMatter[] {
  const now = nowIso();

  return [
    {
      id: "matter_demo_1",
      title: "Personal Injury Demo Matter",
      summary: "Rear-end collision matter used to demonstrate evidence intake, timeline building, and packet preparation.",
      stage: "Evidence Review",
      matterNumber: "HP-LEGAL-001",
      attorney: "Marshall Rosenbach",
      client: {
        name: "Jane Doe",
        phone: "(772) 555-0147",
        email: "jane.doe@example.com",
        address: "123 River Palm Ave, Okeechobee, FL",
      },
      incidentDate: "2026-01-12",
      venue: "Okeechobee County",
      sourceAnchor: "Presence-first matter intake",
      updatedAt: now,
      timeline: [
        {
          id: makeId(),
          date: "2026-01-12",
          title: "Collision occurred",
          summary: "Client reports rear-end impact at intersection with neck pain beginning shortly after.",
          source: "Client intake",
          kind: "note",
          createdAt: now,
        },
        {
          id: makeId(),
          date: "2026-01-13",
          title: "Police report received",
          summary: "Initial incident documentation entered into matter timeline.",
          source: "Police report PDF",
          kind: "pdf",
          createdAt: now,
        },
        {
          id: makeId(),
          date: "2026-01-15",
          title: "Witness statement logged",
          summary: "Witness confirms impact sequence and lane position.",
          source: "Witness statement",
          kind: "record",
          createdAt: now,
        },
        {
          id: makeId(),
          date: "2026-01-18",
          title: "Medical evaluation added",
          summary: "Follow-up care documented with pain complaints and treatment recommendations.",
          source: "Medical record",
          kind: "record",
          createdAt: now,
        },
      ],
      evidence: [
        {
          id: makeId(),
          name: "police_report.pdf",
          kind: "pdf",
          source: "Police report",
          addedAt: now,
          fileTypeLabel: "application/pdf",
        },
        {
          id: makeId(),
          name: "scene_photo_01.jpg",
          kind: "photo",
          source: "Scene photo",
          addedAt: now,
          fileTypeLabel: "image/jpeg",
        },
        {
          id: makeId(),
          name: "witness_statement.pdf",
          kind: "record",
          source: "Witness statement",
          addedAt: now,
          fileTypeLabel: "application/pdf",
        },
        {
          id: makeId(),
          name: "medical_record.pdf",
          kind: "record",
          source: "Medical record",
          addedAt: now,
          fileTypeLabel: "application/pdf",
        },
      ],
      actors: [
        { id: makeId(), name: "Jane Doe", role: "Client" },
        { id: makeId(), name: "John Witness", role: "Witness" },
        { id: makeId(), name: "Officer M. Perez", role: "Responding Officer" },
        { id: makeId(), name: "Dr. L. Carter", role: "Treating Physician" },
      ],
      facts: [
        { id: makeId(), text: "Rear-end collision reported." },
        { id: makeId(), text: "Client reported neck pain shortly after impact." },
        { id: makeId(), text: "Witness confirms collision sequence." },
        { id: makeId(), text: "Police report logged next day." },
      ],
      issues: [
        { id: makeId(), text: "Causation and symptom timeline." },
        { id: makeId(), text: "Damage documentation consistency." },
        { id: makeId(), text: "Evidence packet organization for demand preparation." },
      ],
      notes:
        "Attorney review notes:\n- Organize timeline for quick case understanding.\n- Keep source visibility attached to each event.\n- Demonstrate packet-ready structure without manual folder digging.\n",
      meta: {
        newEvidenceName: "",
        newEvidenceSource: "",
        newEvidenceKind: "pdf",
        newTimelineTitle: "",
        newTimelineSummary: "",
        newTimelineDate: "2026-01-20",
        newTimelineSource: "",
        newTimelineKind: "note",
        newActorName: "",
        newActorRole: "",
        newFactText: "",
        newIssueText: "",
      },
    },
    {
      id: "matter_demo_2",
      title: "Premises Liability Demo Matter",
      summary: "Slip-and-fall demo matter for showing evidence intake, issue grouping, and attorney packet preparation.",
      stage: "Evidence Review",
      matterNumber: "HP-LEGAL-002",
      attorney: "Marshall Rosenbach",
      client: {
        name: "Robert Lane",
        phone: "(863) 555-0192",
        email: "robert.lane@example.com",
        address: "88 Cypress Trail, Okeechobee, FL",
      },
      incidentDate: "2026-02-03",
      venue: "St. Lucie County",
      sourceAnchor: "Matter opened from attorney intake",
      updatedAt: now,
      timeline: [
        {
          id: makeId(),
          date: "2026-02-03",
          title: "Incident intake created",
          summary: "Client states he slipped near wet entry surface.",
          source: "Initial intake note",
          kind: "note",
          createdAt: now,
        },
      ],
      evidence: [
        {
          id: makeId(),
          name: "store_entry_photo.jpg",
          kind: "photo",
          source: "Scene photo",
          addedAt: now,
          fileTypeLabel: "image/jpeg",
        },
      ],
      actors: [
        { id: makeId(), name: "Robert Lane", role: "Client" },
        { id: makeId(), name: "Store Manager", role: "Potential Witness" },
      ],
      facts: [{ id: makeId(), text: "Client reports wet surface at entry." }],
      issues: [{ id: makeId(), text: "Premises notice and maintenance record development." }],
      notes: "Early intake matter.\n",
      meta: {
        newEvidenceName: "",
        newEvidenceSource: "",
        newEvidenceKind: "photo",
        newTimelineTitle: "",
        newTimelineSummary: "",
        newTimelineDate: "2026-02-03",
        newTimelineSource: "",
        newTimelineKind: "note",
        newActorName: "",
        newActorRole: "",
        newFactText: "",
        newIssueText: "",
      },
    },
  ];
}

export default function LegalDemoBoard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { supported, listening, toggle, activeTargetRef } = useSpeechDictation();

  const [matters, setMatters] = useState<LegalMatter[]>(() => seedMatters());
  const [showPanels, setShowPanels] = useState(true);
  const [selectedMatterId, setSelectedMatterId] = useState<string | null>(() => seedMatters()[0]?.id || null);

  const [rightPanel, setRightPanel] = useState<null | "workspace">(null);
  const [panelTitle, setPanelTitle] = useState("Workspace Card");
  const [panelUrl, setPanelUrl] = useState("/cards/measurement");

  const [packetPreviewOpen, setPacketPreviewOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const panel = params.get("panel");
    const rawOpenUrl = params.get("open_url");
    const title = params.get("title") || "Workspace Card";
    const sessionId = params.get("session_id");
    const code = params.get("code");
    const beam = params.get("beam");

    if (panel === "workspace" || panel === "measurement") {
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

      setRightPanel("workspace");
      setPanelTitle(title);
      setPanelUrl(`${workspaceUrl.pathname}${workspaceUrl.search}${workspaceUrl.hash}`);
    } else {
      setRightPanel(null);
      setPanelTitle("Workspace Card");
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

  const stages: MatterStage[] = useMemo(
    () => ["Intake", "Evidence Review", "Timeline Built", "Demand Prep", "Litigation Ready", "Archived"],
    []
  );

  const selectedMatter = useMemo(
    () => matters.find((m) => m.id === selectedMatterId) || null,
    [matters, selectedMatterId]
  );

  function updateMatterOptimistic(matterId: string, patch: Partial<LegalMatter>) {
    setMatters((prev) =>
      prev.map((m) => (m.id === matterId ? { ...m, ...patch, updatedAt: nowIso() } : m))
    );
  }

  function setStage(matterId: string, stage: MatterStage) {
    updateMatterOptimistic(matterId, { stage });
  }

  function setNotes(matter: LegalMatter, value: string) {
    updateMatterOptimistic(matter.id, { notes: value });
  }

  function setMetaValue(matter: LegalMatter, key: string, value: any) {
    updateMatterOptimistic(matter.id, { meta: { ...(matter.meta || {}), [key]: value } });
  }

  function addEvidenceRow(matter: LegalMatter, name: string, kind: EvidenceKind, source: string, extra?: Partial<EvidenceItem>) {
    const trimmedName = (name || "").trim();
    if (!trimmedName) return;

    const item: EvidenceItem = {
      id: makeId(),
      name: trimmedName,
      kind,
      source: (source || "Manual entry").trim() || "Manual entry",
      addedAt: nowIso(),
      ...extra,
    };

    updateMatterOptimistic(matter.id, { evidence: [item, ...matter.evidence] });
  }

  function removeEvidence(matter: LegalMatter, id: string) {
    updateMatterOptimistic(matter.id, { evidence: matter.evidence.filter((x) => x.id !== id) });
  }

  function addTimelineEvent(
    matter: LegalMatter,
    payload: {
      date: string;
      title: string;
      summary: string;
      source: string;
      kind: EvidenceKind;
    }
  ) {
    const title = (payload.title || "").trim();
    if (!title) return;

    const next: TimelineEvent = {
      id: makeId(),
      date: payload.date || new Date().toISOString().slice(0, 10),
      title,
      summary: (payload.summary || "").trim(),
      source: (payload.source || "Matter entry").trim() || "Matter entry",
      kind: payload.kind,
      createdAt: nowIso(),
    };

    updateMatterOptimistic(matter.id, { timeline: [next, ...matter.timeline] });
  }

  function removeTimelineEvent(matter: LegalMatter, id: string) {
    updateMatterOptimistic(matter.id, { timeline: matter.timeline.filter((x) => x.id !== id) });
  }

  function addActor(matter: LegalMatter, name: string, role: string) {
    const n = (name || "").trim();
    const r = (role || "").trim();
    if (!n || !r) return;

    const next: ActorItem = { id: makeId(), name: n, role: r };
    updateMatterOptimistic(matter.id, { actors: [next, ...matter.actors] });
  }

  function removeActor(matter: LegalMatter, id: string) {
    updateMatterOptimistic(matter.id, { actors: matter.actors.filter((x) => x.id !== id) });
  }

  function addFact(matter: LegalMatter, text: string) {
    const t = (text || "").trim();
    if (!t) return;

    const next: FactItem = { id: makeId(), text: t };
    updateMatterOptimistic(matter.id, { facts: [next, ...matter.facts] });
  }

  function removeFact(matter: LegalMatter, id: string) {
    updateMatterOptimistic(matter.id, { facts: matter.facts.filter((x) => x.id !== id) });
  }

  function addIssue(matter: LegalMatter, text: string) {
    const t = (text || "").trim();
    if (!t) return;

    const next: IssueItem = { id: makeId(), text: t };
    updateMatterOptimistic(matter.id, { issues: [next, ...matter.issues] });
  }

  function removeIssue(matter: LegalMatter, id: string) {
    updateMatterOptimistic(matter.id, { issues: matter.issues.filter((x) => x.id !== id) });
  }

  function addMatter() {
    const id = makeId();
    const next: LegalMatter = {
      id,
      title: "New Demo Matter",
      summary: "Matter created for legal workflow demonstration.",
      stage: "Intake",
      matterNumber: `HP-LEGAL-${Math.floor(Math.random() * 900 + 100)}`,
      attorney: "Marshall Rosenbach",
      client: { name: "New Client" },
      incidentDate: new Date().toISOString().slice(0, 10),
      venue: "Unassigned",
      sourceAnchor: "Presence-first matter intake",
      updatedAt: nowIso(),
      timeline: [],
      evidence: [],
      actors: [],
      facts: [],
      issues: [],
      notes: "",
      meta: {
        newEvidenceName: "",
        newEvidenceSource: "",
        newEvidenceKind: "pdf",
        newTimelineTitle: "",
        newTimelineSummary: "",
        newTimelineDate: new Date().toISOString().slice(0, 10),
        newTimelineSource: "",
        newTimelineKind: "note",
        newActorName: "",
        newActorRole: "",
        newFactText: "",
        newIssueText: "",
      },
    };

    setMatters((prev) => [next, ...prev]);
    setSelectedMatterId(id);
  }

  function matterCounts(matter: LegalMatter) {
    return {
      evidence: matter.evidence.length,
      timeline: matter.timeline.length,
      actors: matter.actors.length,
      facts: matter.facts.length,
      issues: matter.issues.length,
    };
  }

  function handleEvidenceFiles(matter: LegalMatter, files: FileList | null) {
    if (!files || !files.length) return;

    const additions: EvidenceItem[] = Array.from(files).map((file) => {
      const mime = file.type || "";
      let kind: EvidenceKind = "other";

      if (mime.includes("pdf")) kind = "pdf";
      else if (mime.startsWith("image/")) kind = "photo";
      else if (mime.startsWith("video/")) kind = "video";
      else if (mime.startsWith("audio/")) kind = "audio";
      else if (mime.includes("text")) kind = "note";
      else if (mime.includes("word") || mime.includes("officedocument")) kind = "record";

      return {
        id: makeId(),
        name: file.name,
        kind,
        source: "Uploaded file",
        addedAt: nowIso(),
        fileSizeLabel: formatBytes(file.size),
        fileTypeLabel: file.type || "unknown",
      };
    });

    updateMatterOptimistic(matter.id, {
      evidence: [...additions, ...matter.evidence],
    });

    const timelineAdditions: TimelineEvent[] = additions.map((item) => ({
      id: makeId(),
      date: new Date().toISOString().slice(0, 10),
      title: `Evidence uploaded: ${item.name}`,
      summary: `File added to matter evidence list.`,
      source: "Uploaded file",
      kind: item.kind,
      createdAt: nowIso(),
    }));

    updateMatterOptimistic(matter.id, {
      timeline: [...timelineAdditions, ...matter.timeline],
    });
  }

  function copyPacketPreview(matter: LegalMatter) {
    void copyToClipboard(buildPacketPreview(matter));
  }

  const mattersByStage = useMemo(() => {
    const map = new Map<MatterStage, LegalMatter[]>();
    for (const s of stages) map.set(s, []);
    for (const m of matters) map.get(coerceStage(m.stage))?.push(m);
    return map;
  }, [matters, stages]);

  const latestTimelineEvent = selectedMatter
    ? selectedMatter.timeline.slice().sort((a, b) => b.date.localeCompare(a.date))[0]
    : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,rgba(34,126,255,.20),transparent_26%),radial-gradient(circle_at_82%_0%,rgba(224,188,96,.10),transparent_24%),radial-gradient(circle_at_top,rgba(19,35,66,1)_0%,rgba(8,18,35,1)_42%,rgba(4,10,22,1)_100%)] text-[#f4efe1]">
      <div className="flex min-h-screen w-full">
        <div className={rightPanel ? "min-w-0 flex-1" : "w-full"}>
          <div className="mx-auto max-w-7xl p-3 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-2xl font-extrabold tracking-tight text-white">
                  HomePlanet — Legal Evidence Board
                </div>
                <div className="text-sm text-[#d7c8a6]">
                  HomePlanet Core Board • legal evidence intake • timeline • packet preview
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-semibold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                  onClick={() => setShowPanels((v) => !v)}
                >
                  {showPanels ? "Hide Lanes" : "Show Lanes"}
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-[#80652e] bg-[linear-gradient(180deg,rgba(49,39,18,.96),rgba(29,22,11,.96))] px-3 py-2 text-sm font-semibold text-[#fff2cf] hover:border-[#d9bc74] hover:bg-[#3a2c14]"
                  onClick={addMatter}
                >
                  + Add Matter
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-4 py-2 text-sm font-extrabold text-[#151b25] hover:brightness-110"
                  onClick={() => selectedMatter && copyPacketPreview(selectedMatter)}
                  disabled={!selectedMatter}
                  title="Copy packet preview text"
                >
                  Generate Case Packet
                </button>
              </div>
            </div>

            {showPanels ? (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {stages.map((s, stageIdx) => {
                  const tone = stageTone(s);
                  const list = mattersByStage.get(s) || [];

                  return (
                    <div
                      key={reactKey("stage-lane", s, stageIdx)}
                      className={cn(
                        "rounded-2xl border border-[#2b3850] bg-[#0d1628]",
                        tone.lane,
                        "border-l-4"
                      )}
                    >
                      <div className="flex items-center justify-between border-b border-[#243149] p-3">
                        <div className="text-sm font-extrabold text-[#fff7df]">{s}</div>
                        <div className={cn("rounded-full border px-2 py-0.5 text-xs font-bold", tone.pill)}>
                          {list.length}
                        </div>
                      </div>

                      <div className="space-y-2 p-2">
                        {list.map((m, matterIdx) => (
                          <button
                            key={reactKey("matter-card", s, m.id, m.updatedAt, matterIdx)}
                            type="button"
                            onClick={() => setSelectedMatterId(m.id)}
                            className={cn(
                              "w-full rounded-xl border px-3 py-2 text-left transition",
                              selectedMatterId === m.id
                                ? "border-[#e0bc60] bg-[#1b2740] ring-1 ring-[#e0bc60]/30"
                                : "border-[#33425a] bg-[#162136] hover:border-[#53c6ff]/40 hover:bg-[#1a2740]"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-bold text-[#fdf7e7]">
                                  {m.title || "Untitled Matter"}
                                </div>
                                <div className="mt-0.5 truncate text-xs text-[#d7c8a6]">
                                  {m.client?.name || "-"}
                                </div>
                                <div className="mt-1 text-[11px] text-[#9fb5d3]">
                                  {m.matterNumber || "-"}
                                </div>
                              </div>

                              {selectedMatterId === m.id ? (
                                <div className="rounded-full border border-[#e0bc60]/60 bg-[#3a2b10] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#fff2cf]">
                                  Active
                                </div>
                              ) : null}
                            </div>
                          </button>
                        ))}
                        {list.length === 0 ? <div className="px-3 py-2 text-xs text-[#7688a5]">No matters</div> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="mt-4 rounded-2xl border border-[#2c3b56] bg-[linear-gradient(180deg,rgba(10,19,36,.96),rgba(6,13,27,.96))]">
              <div className="flex flex-col gap-2 border-b border-[#223148] p-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-extrabold text-white">Matter Drawer</div>
                  <div className="text-xs text-[#c8b997]">Open a matter to review evidence, timeline, and packet preview</div>
                </div>

                {selectedMatter ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-bold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                      onClick={() => copyToClipboard(buildMatterText(selectedMatter))}
                    >
                      Copy Matter Text
                    </button>

                    {selectedMatter.client?.address ? (
                      <a
                        className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-bold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                        href={mapsHref(selectedMatter)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Maps
                      </a>
                    ) : null}

                    {selectedMatter.client?.phone ? (
                      <a
                        className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-bold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                        href={smsHref(selectedMatter)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Send SMS
                      </a>
                    ) : null}

                    {selectedMatter.client?.email ? (
                      <a
                        className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-sm font-bold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                        href={emailHref(selectedMatter)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Email
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {!selectedMatter ? (
                <div className="p-4 text-sm text-[#c6baa1]">Select a matter to open the drawer.</div>
              ) : (
                <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-3">
                  <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                    <div className="text-sm font-extrabold text-[#fff3d2]">Matter</div>

                    <div className="mt-2 space-y-2 text-sm">
                      <div>
                        <div className="text-xs font-bold text-[#d2be92]">Title</div>
                        <input
                          className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                          value={selectedMatter.title}
                          onChange={(e) => updateMatterOptimistic(selectedMatter.id, { title: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#d2be92]">Summary</div>
                        <textarea
                          className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                          value={selectedMatter.summary}
                          onChange={(e) => updateMatterOptimistic(selectedMatter.id, { summary: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Matter #</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={selectedMatter.matterNumber || ""}
                            onChange={(e) => updateMatterOptimistic(selectedMatter.id, { matterNumber: e.target.value })}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Attorney</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={selectedMatter.attorney}
                            onChange={(e) => updateMatterOptimistic(selectedMatter.id, { attorney: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Client</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={selectedMatter.client.name}
                            onChange={(e) =>
                              updateMatterOptimistic(selectedMatter.id, {
                                client: { ...selectedMatter.client, name: e.target.value },
                              })
                            }
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Incident Date</div>
                          <input
                            type="date"
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={selectedMatter.incidentDate || ""}
                            onChange={(e) => updateMatterOptimistic(selectedMatter.id, { incidentDate: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#d2be92]">Venue</div>
                        <input
                          className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                          value={selectedMatter.venue || ""}
                          onChange={(e) => updateMatterOptimistic(selectedMatter.id, { venue: e.target.value })}
                        />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#d2be92]">Source Anchor</div>
                        <input
                          className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                          value={selectedMatter.sourceAnchor || ""}
                          onChange={(e) => updateMatterOptimistic(selectedMatter.id, { sourceAnchor: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(13,21,36,.96),rgba(10,16,29,.96))] p-3">
                      <div className="text-xs font-bold text-[#e7cf95]">Current Stage</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {stages.map((s, idx) => (
                          <button
                            key={reactKey("stage-pill", selectedMatter.id, s, idx)}
                            type="button"
                            className={cn(
                              "rounded-full border px-3 py-1 text-xs font-extrabold transition",
                              coerceStage(selectedMatter.stage) === s
                                ? "border-[#e0bc60]/70 bg-[linear-gradient(180deg,rgba(63,48,20,.98),rgba(39,29,12,.98))] text-[#fff2cf]"
                                : "border-[#41536f] bg-[#1b263a] text-[#cdd9ee] hover:border-[#53c6ff]/50 hover:bg-[#23314b]"
                            )}
                            onClick={() => setStage(selectedMatter.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(13,21,36,.96),rgba(10,16,29,.96))] p-3">
                      <div className="text-xs font-bold text-[#e7cf95]">Matter Snapshot</div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                          <div className="text-xs text-[#d2be92]">Evidence</div>
                          <div className="text-lg font-extrabold text-white">{matterCounts(selectedMatter).evidence}</div>
                        </div>
                        <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                          <div className="text-xs text-[#d2be92]">Timeline</div>
                          <div className="text-lg font-extrabold text-white">{matterCounts(selectedMatter).timeline}</div>
                        </div>
                        <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                          <div className="text-xs text-[#d2be92]">Actors</div>
                          <div className="text-lg font-extrabold text-white">{matterCounts(selectedMatter).actors}</div>
                        </div>
                        <div className="rounded-xl border border-[#3a4b67] bg-[#19253a] p-2">
                          <div className="text-xs text-[#d2be92]">Facts</div>
                          <div className="text-lg font-extrabold text-white">{matterCounts(selectedMatter).facts}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-[#354b67] bg-[linear-gradient(180deg,rgba(13,21,36,.96),rgba(10,16,29,.96))] p-3">
                      <div className="text-xs font-bold text-[#e7cf95]">Active Matter Summary</div>

                      <div className="mt-2 space-y-2 text-sm text-[#d9d3c4]">
                        <div>
                          <span className="text-[#9fb5d3]">Client:</span> {selectedMatter.client.name || "-"}
                        </div>
                        <div>
                          <span className="text-[#9fb5d3]">Venue:</span> {selectedMatter.venue || "-"}
                        </div>
                        <div>
                          <span className="text-[#9fb5d3]">Incident:</span> {selectedMatter.incidentDate || "-"}
                        </div>
                        <div>
                          <span className="text-[#9fb5d3]">Anchor:</span> {selectedMatter.sourceAnchor || "-"}
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-[#3a4b67] bg-[#18253a] p-3">
                        <div className="text-xs font-bold text-[#d2be92]">Latest Timeline Event</div>
                        <div className="mt-2 text-sm font-bold text-[#fdf7e7]">
                          {latestTimelineEvent?.title || "No events yet"}
                        </div>
                        <div className="mt-1 text-xs text-[#9fb5d3]">
                          {latestTimelineEvent?.date || ""}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#fff3d2]">Evidence Intake</div>
                        <label className="cursor-pointer rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]">
                          Upload Files
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              handleEvidenceFiles(selectedMatter, e.target.files);
                              e.currentTarget.value = "";
                            }}
                          />
                        </label>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                        <div className="md:col-span-1">
                          <div className="text-xs font-bold text-[#d2be92]">Name</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newEvidenceName || "").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newEvidenceName", e.target.value)}
                            placeholder="police_report.pdf"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <div className="text-xs font-bold text-[#d2be92]">Source</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newEvidenceSource || "").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newEvidenceSource", e.target.value)}
                            placeholder="Police report / witness / client / medical"
                          />
                        </div>

                        <div className="md:col-span-1">
                          <div className="text-xs font-bold text-[#d2be92]">Kind</div>
                          <select
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newEvidenceKind || "pdf").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newEvidenceKind", e.target.value)}
                          >
                            {["pdf", "photo", "video", "audio", "note", "record", "other"].map((k) => (
                              <option key={k} value={k}>
                                {k}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-2">
                        <button
                          type="button"
                          className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                          onClick={() => {
                            addEvidenceRow(
                              selectedMatter,
                              (selectedMatter.meta?.newEvidenceName || "").toString(),
                              ((selectedMatter.meta?.newEvidenceKind || "pdf").toString() as EvidenceKind),
                              (selectedMatter.meta?.newEvidenceSource || "").toString()
                            );

                            setMetaValue(selectedMatter, "newEvidenceName", "");
                            setMetaValue(selectedMatter, "newEvidenceSource", "");
                          }}
                        >
                          Add Evidence Row
                        </button>
                      </div>

                      <div className="mt-3 space-y-2">
                        {selectedMatter.evidence.length === 0 ? (
                          <div className="rounded-xl border border-[#3a4b67] bg-[#121b2d] p-3 text-sm text-[#c6baa1]">
                            No evidence yet. Upload files or add an evidence row.
                          </div>
                        ) : null}

                        {selectedMatter.evidence.map((e, idx) => (
                          <div
                            key={reactKey("evidence-item", selectedMatter.id, e.id, e.name, e.addedAt, idx)}
                            className="flex items-start justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3"
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-bold text-[#f5f0e0]">
                                {e.name} <span className="text-[#9fb5d3]">({e.kind})</span>
                              </div>
                              <div className="mt-1 text-xs text-[#d2be92]">
                                {e.source} • {safeDateLabel(e.addedAt)} {safeTimeLabel(e.addedAt)}
                              </div>
                              {e.fileSizeLabel || e.fileTypeLabel ? (
                                <div className="mt-1 text-[11px] text-[#8ea3bf]">
                                  {[e.fileSizeLabel, e.fileTypeLabel].filter(Boolean).join(" • ")}
                                </div>
                              ) : null}
                            </div>

                            <button
                              type="button"
                              className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                              onClick={() => removeEvidence(selectedMatter, e.id)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#fff3d2]">Timeline Builder</div>
                        <MicButton
                          label="Mic"
                          supported={supported}
                          listening={listening}
                          active={activeTargetRef.current === `timeline_summary_${selectedMatter.id}`}
                          onClick={() =>
                            toggle(`timeline_summary_${selectedMatter.id}`, (txt, isFinal) => {
                              setMetaValue(
                                selectedMatter,
                                "newTimelineSummary",
                                dictationAppendLine(
                                  (selectedMatter.meta?.newTimelineSummary || "").toString(),
                                  txt,
                                  isFinal
                                )
                              );
                            })
                          }
                        />
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2">
                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Event Date</div>
                          <input
                            type="date"
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newTimelineDate || "").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newTimelineDate", e.target.value)}
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Event Title</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newTimelineTitle || "").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newTimelineTitle", e.target.value)}
                            placeholder="Police report received"
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Source</div>
                          <input
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newTimelineSource || "").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newTimelineSource", e.target.value)}
                            placeholder="Police report / client intake / witness"
                          />
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Kind</div>
                          <select
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newTimelineKind || "note").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newTimelineKind", e.target.value)}
                          >
                            {["pdf", "photo", "video", "audio", "note", "record", "other"].map((k) => (
                              <option key={k} value={k}>
                                {k}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-[#d2be92]">Summary</div>
                          <textarea
                            className="mt-1 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                            value={(selectedMatter.meta?.newTimelineSummary || "").toString()}
                            onChange={(e) => setMetaValue(selectedMatter, "newTimelineSummary", e.target.value)}
                            placeholder="Short event summary"
                            rows={4}
                          />
                        </div>

                        <div>
                          <button
                            type="button"
                            className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                            onClick={() => {
                              addTimelineEvent(selectedMatter, {
                                date: (selectedMatter.meta?.newTimelineDate || "").toString(),
                                title: (selectedMatter.meta?.newTimelineTitle || "").toString(),
                                summary: (selectedMatter.meta?.newTimelineSummary || "").toString(),
                                source: (selectedMatter.meta?.newTimelineSource || "").toString(),
                                kind: ((selectedMatter.meta?.newTimelineKind || "note").toString() as EvidenceKind),
                              });

                              setMetaValue(selectedMatter, "newTimelineTitle", "");
                              setMetaValue(selectedMatter, "newTimelineSummary", "");
                              setMetaValue(selectedMatter, "newTimelineSource", "");
                            }}
                          >
                            Add Timeline Event
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {selectedMatter.timeline.length === 0 ? (
                          <div className="rounded-xl border border-[#3a4b67] bg-[#121b2d] p-3 text-sm text-[#c6baa1]">
                            No timeline events yet.
                          </div>
                        ) : null}

                        {selectedMatter.timeline
                          .slice()
                          .sort((a, b) => a.date.localeCompare(b.date))
                          .map((t, idx) => (
                            <div
                              key={reactKey("timeline-item", selectedMatter.id, t.id, t.date, idx)}
                              className="rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-[#ffd98c]">{t.date || "—"}</div>
                                  <div className="mt-1 text-sm font-extrabold text-[#fdf7e7]">{t.title}</div>
                                  <div className="mt-1 text-xs text-[#d2be92]">
                                    {t.source} • {t.kind}
                                  </div>
                                  {t.summary ? <div className="mt-2 text-sm text-[#d9d3c4]">{t.summary}</div> : null}
                                </div>

                                <button
                                  type="button"
                                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                                  onClick={() => removeTimelineEvent(selectedMatter, t.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                      <div className="text-sm font-extrabold text-[#fff3d2]">Case Structure</div>

                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <div className="rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3">
                          <div className="text-xs font-bold text-[#e7cf95]">Actors</div>

                          <div className="mt-2 grid grid-cols-1 gap-2">
                            <input
                              className="rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                              value={(selectedMatter.meta?.newActorName || "").toString()}
                              onChange={(e) => setMetaValue(selectedMatter, "newActorName", e.target.value)}
                              placeholder="Actor name"
                            />
                            <input
                              className="rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                              value={(selectedMatter.meta?.newActorRole || "").toString()}
                              onChange={(e) => setMetaValue(selectedMatter, "newActorRole", e.target.value)}
                              placeholder="Role"
                            />
                            <button
                              type="button"
                              className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                              onClick={() => {
                                addActor(
                                  selectedMatter,
                                  (selectedMatter.meta?.newActorName || "").toString(),
                                  (selectedMatter.meta?.newActorRole || "").toString()
                                );
                                setMetaValue(selectedMatter, "newActorName", "");
                                setMetaValue(selectedMatter, "newActorRole", "");
                              }}
                            >
                              Add Actor
                            </button>
                          </div>

                          <div className="mt-3 space-y-2">
                            {selectedMatter.actors.map((a, idx) => (
                              <div
                                key={reactKey("actor-item", selectedMatter.id, a.id, a.name, idx)}
                                className="flex items-center justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[#18253a] p-2"
                              >
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-bold text-[#f5f0e0]">{a.name}</div>
                                  <div className="text-xs text-[#d2be92]">{a.role}</div>
                                </div>
                                <button
                                  type="button"
                                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-1.5 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                                  onClick={() => removeActor(selectedMatter, a.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3">
                          <div className="text-xs font-bold text-[#e7cf95]">Facts</div>

                          <div className="mt-2">
                            <textarea
                              className="w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                              value={(selectedMatter.meta?.newFactText || "").toString()}
                              onChange={(e) => setMetaValue(selectedMatter, "newFactText", e.target.value)}
                              placeholder="Enter fact"
                              rows={3}
                            />
                            <button
                              type="button"
                              className="mt-2 rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                              onClick={() => {
                                addFact(selectedMatter, (selectedMatter.meta?.newFactText || "").toString());
                                setMetaValue(selectedMatter, "newFactText", "");
                              }}
                            >
                              Add Fact
                            </button>
                          </div>

                          <div className="mt-3 space-y-2">
                            {selectedMatter.facts.map((f, idx) => (
                              <div
                                key={reactKey("fact-item", selectedMatter.id, f.id, idx)}
                                className="flex items-start justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[#18253a] p-2"
                              >
                                <div className="text-sm text-[#f5f0e0]">{f.text}</div>
                                <button
                                  type="button"
                                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-1.5 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                                  onClick={() => removeFact(selectedMatter, f.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(15,23,37,.98),rgba(11,18,30,.98))] p-3">
                          <div className="text-xs font-bold text-[#e7cf95]">Issues</div>

                          <div className="mt-2">
                            <textarea
                              className="w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none focus:border-[#53c6ff]"
                              value={(selectedMatter.meta?.newIssueText || "").toString()}
                              onChange={(e) => setMetaValue(selectedMatter, "newIssueText", e.target.value)}
                              placeholder="Enter issue"
                              rows={3}
                            />
                            <button
                              type="button"
                              className="mt-2 rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                              onClick={() => {
                                addIssue(selectedMatter, (selectedMatter.meta?.newIssueText || "").toString());
                                setMetaValue(selectedMatter, "newIssueText", "");
                              }}
                            >
                              Add Issue
                            </button>
                          </div>

                          <div className="mt-3 space-y-2">
                            {selectedMatter.issues.map((i, idx) => (
                              <div
                                key={reactKey("issue-item", selectedMatter.id, i.id, idx)}
                                className="flex items-start justify-between gap-2 rounded-xl border border-[#3a4b67] bg-[#18253a] p-2"
                              >
                                <div className="text-sm text-[#f5f0e0]">{i.text}</div>
                                <button
                                  type="button"
                                  className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-1.5 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                                  onClick={() => removeIssue(selectedMatter, i.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#fff3d2]">Attorney Notes</div>
                        <MicButton
                          label="Mic"
                          supported={supported}
                          listening={listening}
                          active={activeTargetRef.current === `notes_${selectedMatter.id}`}
                          onClick={() =>
                            toggle(`notes_${selectedMatter.id}`, (txt, isFinal) => {
                              setNotes(selectedMatter, dictationAppendLine(selectedMatter.notes, txt, isFinal));
                            })
                          }
                        />
                      </div>

                      <textarea
                        className="mt-3 w-full rounded-xl border border-[#3a4b67] bg-[#1f2b42] px-3 py-2 text-sm text-[#f5f0e0] outline-none placeholder:text-[#7f93ad] focus:border-[#53c6ff]"
                        value={selectedMatter.notes}
                        onChange={(e) => setNotes(selectedMatter, e.target.value)}
                        placeholder="Attorney / paralegal notes"
                        rows={8}
                      />
                    </div>

                    <div className="rounded-2xl border border-[#31425d] bg-[linear-gradient(180deg,rgba(21,32,51,.98),rgba(14,23,38,.98))] p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#fff3d2]">Case Packet Preview</div>
                        <button
                          type="button"
                          className="rounded-xl border border-[#4a5a78] bg-[linear-gradient(180deg,rgba(23,35,58,.96),rgba(14,23,38,.96))] px-3 py-2 text-xs font-extrabold text-[#eef4ff] hover:border-[#67d2ff] hover:bg-[#23314b]"
                          onClick={() => setPacketPreviewOpen((v) => !v)}
                        >
                          {packetPreviewOpen ? "Hide" : "Show"}
                        </button>
                      </div>

                      {packetPreviewOpen ? (
                        <>
                          <textarea
                            className="mt-3 w-full rounded-xl border border-[#3a4b67] bg-[linear-gradient(180deg,rgba(8,15,28,.98),rgba(5,10,20,.98))] px-3 py-2 text-xs text-[#f5f0e0] outline-none"
                            value={buildPacketPreview(selectedMatter)}
                            readOnly
                            rows={16}
                          />

                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="rounded-xl border border-[#e0bc60] bg-[linear-gradient(180deg,#f0cf7e,#d5a94d)] px-3 py-2 text-xs font-extrabold text-[#14181f] hover:brightness-110"
                              onClick={() => copyPacketPreview(selectedMatter)}
                            >
                              Copy Packet Preview
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {rightPanel === "workspace" && (
          <aside className="relative w-[min(48vw,720px)] min-w-[360px] max-w-[720px] border-l border-[#31425d] bg-[linear-gradient(180deg,rgba(8,14,26,.98),rgba(5,9,18,.98))] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-[#223148] px-4 py-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.2em] text-[#e0bc60]">Beam Workspace</div>
                <div className="truncate text-sm font-semibold text-white">{panelTitle}</div>
              </div>

              <button
                type="button"
                onClick={closeRightPanel}
                className="rounded-lg border border-[#4a5a78] px-3 py-1.5 text-sm text-[#eef4ff] transition hover:border-[#67d2ff] hover:bg-[#1a2840]"
              >
                Close
              </button>
            </div>

            <div className="h-[calc(100vh-65px)] w-full">
              <iframe title={panelTitle} src={panelUrl} className="h-full w-full bg-white" />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}