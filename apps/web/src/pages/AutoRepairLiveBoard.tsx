import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { resolveStarterBoardConfig } from "../lib/starterBoardConfig";

type OnboardingPayload = {
  businessName?: string;
  ownerName?: string;
  businessType?: string;
  city?: string;
  primaryGoal?: string;
  boardSlug?: string;
  presenceId?: string;
  presenceKey?: string;
};

type RepairStage = string;

type RepairJob = {
  id: string;
  roNumber: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: RepairStage;
  eta: string;
  advisor: string;
  notes: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: string;
};

type DbRepairJob = {
  id: string;
  board_slug: string;
  ro_number: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: string;
  eta: string;
  advisor: string;
  notes: string;
  phone: string;
  appointment_date: string | null;
  appointment_time: string;
  created_at: string;
  updated_at: string;
};

type StarterBoardRow = {
  board_slug: string;
  business_name: string;
  business_type: string;
  city: string;
  owner_name: string;
  presence_id: string;
  presence_key: string;
  trial_started_at: string;
  trial_ends_at: string;
  starter_plan: string;
  is_active: boolean;
  created_at: string;
};

type MessageActionCardProps = {
  title: string;
  subtitle: string;
  message: string;
  phone: string;
  onCopy: (label: string, text: string) => void;
};

type RestaurantIdentityMode = "table" | "name";

type RestaurantTicketDraft = {
  id?: string;
  roNumber?: string;
  customer: string;
  vehicle: string;
  concern: string;
  stage: string;
  eta: string;
  advisor: string;
  notes: string;
};

const DEMO_BOARD_SLUG = "demo-auto-repair";

function makeRONumber(index: number) {
  return `RO-${String(1042 + index).padStart(4, "0")}`;
}

function dbToUi(row: DbRepairJob): RepairJob {
  return {
    id: row.id,
    roNumber: row.ro_number,
    customer: row.customer,
    vehicle: row.vehicle,
    concern: row.concern,
    stage: row.stage,
    eta: row.eta,
    advisor: row.advisor,
    notes: row.notes,
    phone: row.phone,
    appointmentDate: row.appointment_date ?? "",
    appointmentTime: row.appointment_time,
    createdAt: row.created_at,
  };
}

function uiPatchToDb(job: RepairJob) {
  return {
    ro_number: job.roNumber,
    customer: job.customer,
    vehicle: job.vehicle,
    concern: job.concern,
    stage: job.stage,
    eta: job.eta,
    advisor: job.advisor,
    notes: job.notes,
    phone: job.phone,
    appointment_date: job.appointmentDate || null,
    appointment_time: job.appointmentTime,
  };
}

function stageTone(stage: string) {
  const normalized = stage.toLowerCase();

  if (
    normalized.includes("intake") ||
    normalized.includes("lead") ||
    normalized.includes("check-in") ||
    normalized.includes("drive-in") ||
    normalized.includes("ticket")
  ) {
    return "border-sky-400/25 bg-sky-400/10 text-sky-200";
  }

  if (
    normalized.includes("diagnos") ||
    normalized.includes("measure") ||
    normalized.includes("site visit") ||
    normalized.includes("grill")
  ) {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  if (
    normalized.includes("approval") ||
    normalized.includes("quote") ||
    normalized.includes("findings") ||
    normalized.includes("selection") ||
    normalized.includes("plating")
  ) {
    return "border-amber-400/25 bg-amber-400/10 text-amber-200";
  }

  if (
    normalized.includes("bay") ||
    normalized.includes("repair") ||
    normalized.includes("install") ||
    normalized.includes("balance") ||
    normalized.includes("alignment") ||
    normalized.includes("ordered")
  ) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (
    normalized.includes("ready") ||
    normalized.includes("done") ||
    normalized.includes("complete")
  ) {
    return "border-indigo-400/25 bg-indigo-400/10 text-indigo-200";
  }

  return "border-white/10 bg-white/5 text-white";
}

function formatAppointment(date: string, time: string) {
  if (!date && !time) return "No appointment set";
  if (date && !time) return date;
  if (!date && time) return time;
  return `${date} at ${time}`;
}

function buildApprovalMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, this is ${businessName}. Your ${job.vehicle || "job"} is currently in "${job.stage}". We need your approval before moving forward on: ${job.concern || "the recommended next step"}. Reply here to approve or call us with questions.`;
}

function buildReadyMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, your ${job.vehicle || "job"} at ${businessName} is ready.${job.notes ? ` Notes: ${job.notes}` : ""}`;
}

function buildAppointmentMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, your appointment with ${businessName} is set for ${formatAppointment(job.appointmentDate, job.appointmentTime)} for ${job.vehicle || "your job"}.`;
}

function buildStatusMessage(job: RepairJob, businessName: string) {
  return `Hi ${job.customer || "customer"}, here is your update from ${businessName}: ${job.vehicle || "Your job"} is currently in "${job.stage}".${job.concern ? ` Need: ${job.concern}.` : ""}${job.eta ? ` ETA: ${job.eta}.` : ""}`;
}

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function openTextMessage(phone: string, text: string) {
  const cleanedPhone = sanitizePhone(phone);
  const encoded = encodeURIComponent(text);
  const href = cleanedPhone
    ? `sms:${cleanedPhone}?body=${encoded}`
    : `sms:?body=${encoded}`;
  window.location.href = href;
}

function formatProofDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function formatTicketNumber(roNumber: string) {
  const match = roNumber.match(/(\d+)/);
  return match ? `Ticket #${match[1]}` : roNumber;
}

function restaurantPrimaryLabel(
  job: RepairJob,
  identityMode: RestaurantIdentityMode,
) {
  if (identityMode === "name") {
    return job.customer?.trim() || "Guest name pending";
  }

  return job.vehicle?.trim() || "Table pending";
}

function restaurantSecondaryLabel(
  job: RepairJob,
  identityMode: RestaurantIdentityMode,
) {
  if (identityMode === "name") {
    return job.vehicle?.trim() || "Table pending";
  }

  return job.customer?.trim() || "Guest name pending";
}

function countUrgentTickets(jobs: RepairJob[]) {
  return jobs.filter((job) => {
    const stage = job.stage.toLowerCase();
    return (
      stage.includes("ready") ||
      stage.includes("grill") ||
      stage.includes("plating")
    );
  }).length;
}

function normalizeRestaurantStage(stage: string) {
  const value = stage.toLowerCase();

  if (
    value.includes("new intake") ||
    value.includes("intake") ||
    value.includes("new ticket") ||
    value.includes("drive-in") ||
    value.includes("check-in")
  ) {
    return "New Ticket";
  }

  if (
    value.includes("diagnosing") ||
    value.includes("diagnostic") ||
    value.includes("in bay") ||
    value.includes("repairing") ||
    value.includes("repair") ||
    value.includes("on grill")
  ) {
    return "On Grill";
  }

  if (
    value.includes("waiting approval") ||
    value.includes("approval") ||
    value.includes("quote") ||
    value.includes("findings") ||
    value.includes("plating")
  ) {
    return "Plating";
  }

  if (value.includes("ready for pickup") || value.includes("ready")) {
    return "Ready";
  }

  if (
    value.includes("done") ||
    value.includes("completed") ||
    value.includes("complete")
  ) {
    return "Completed";
  }

  return "New Ticket";
}

function makeRestaurantDraft(
  stages: string[],
  job?: RepairJob | null,
): RestaurantTicketDraft {
  if (job) {
    return {
      id: job.id,
      roNumber: job.roNumber,
      customer: job.customer,
      vehicle: job.vehicle,
      concern: job.concern,
      stage: normalizeRestaurantStage(job.stage),
      eta: job.eta,
      advisor: job.advisor,
      notes: job.notes,
    };
  }

  return {
    customer: "",
    vehicle: "",
    concern: "",
    stage: stages[0] || "New Ticket",
    eta: "",
    advisor: "",
    notes: "",
  };
}

export default function AutoRepairLiveBoard() {
  const location = useLocation();
  const { boardSlug } = useParams<{ boardSlug: string }>();

  const payload =
    ((location.state as { onboardingPayload?: OnboardingPayload } | null)
      ?.onboardingPayload ?? {}) as OnboardingPayload;

  const liveBoardSlug = boardSlug || payload.boardSlug || DEMO_BOARD_SLUG;

  const [jobs, setJobs] = useState<RepairJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [stageMenuOpen, setStageMenuOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [boardMeta, setBoardMeta] = useState<StarterBoardRow | null>(null);
  const [managerPanelOpen, setManagerPanelOpen] = useState(false);
  const [restaurantIdentityMode, setRestaurantIdentityMode] =
    useState<RestaurantIdentityMode>("table");
  const [ticketEditorOpen, setTicketEditorOpen] = useState(false);
  const [ticketEditorSaving, setTicketEditorSaving] = useState(false);
  const [ticketEditorDraft, setTicketEditorDraft] =
    useState<RestaurantTicketDraft | null>(null);

  const stageMenuRef = useRef<HTMLDivElement | null>(null);
  const saveTimerRef = useRef<number | null>(null);

  const businessName =
    boardMeta?.business_name ||
    payload.businessName?.trim() ||
    "Auto Repair Live Board";
  const city = boardMeta?.city || payload.city?.trim() || "Your City";
  const businessType =
    boardMeta?.business_type || payload.businessType?.trim() || "Auto Repair";
  const primaryGoal = payload.primaryGoal?.trim() || "";

  const config = useMemo(
    () =>
      resolveStarterBoardConfig({
        businessType,
        businessName,
        primaryGoal,
      }),
    [businessType, businessName, primaryGoal],
  );

  const isRestaurant = config.key === "restaurant-rush";

  const stages = useMemo(() => {
    if (isRestaurant) {
      return [...config.stages];
    }

    const dataStages = Array.from(new Set(jobs.map((job) => job.stage)));
    const merged = [...config.stages];

    for (const stage of dataStages) {
      if (!merged.includes(stage)) {
        merged.push(stage);
      }
    }

    return merged;
  }, [config.stages, isRestaurant, jobs]);

  useEffect(() => {
    void loadBoardMeta();
    void loadJobs();
  }, [liveBoardSlug]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!stageMenuRef.current) return;
      if (!stageMenuRef.current.contains(event.target as Node)) {
        setStageMenuOpen(false);
      }
    }

    if (stageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [stageMenuOpen]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRestaurant) {
      setSelectedJobId(null);
      setStageMenuOpen(false);
    } else {
      setManagerPanelOpen(false);
      setTicketEditorOpen(false);
      setTicketEditorDraft(null);
    }
  }, [isRestaurant]);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId],
  );

  const grouped = useMemo(() => {
    if (isRestaurant) {
      return stages.map((stage) => ({
        stage,
        jobs: jobs.filter(
          (job) => normalizeRestaurantStage(job.stage) === stage,
        ),
      }));
    }

    return stages.map((stage) => ({
      stage,
      jobs: jobs.filter((job) => job.stage === stage),
    }));
  }, [isRestaurant, jobs, stages]);

  const totals = useMemo(() => {
    const finalStage = stages[stages.length - 1] || "Ready";

    return {
      total: jobs.length,
      inProgress: jobs.filter((job) => {
        const stage = isRestaurant
          ? normalizeRestaurantStage(job.stage)
          : job.stage;
        return stage !== finalStage && stage !== stages[0];
      }).length,
      ready: jobs.filter((job) => {
        const stage = isRestaurant
          ? normalizeRestaurantStage(job.stage)
          : job.stage;
        return stage === finalStage;
      }).length,
      newIntake: jobs.filter((job) => {
        const stage = isRestaurant
          ? normalizeRestaurantStage(job.stage)
          : job.stage;
        return stage === stages[0];
      }).length,
    };
  }, [isRestaurant, jobs, stages]);

  const restaurantSnapshot = useMemo(() => {
    if (!isRestaurant) return null;

    const readyCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "Ready",
    ).length;

    const completedCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "Completed",
    ).length;

    const grillCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "On Grill",
    ).length;

    const platingCount = jobs.filter(
      (job) => normalizeRestaurantStage(job.stage) === "Plating",
    ).length;

    return {
      readyCount,
      completedCount,
      grillCount,
      platingCount,
      urgentCount: jobs.filter((job) => {
        const stage = normalizeRestaurantStage(job.stage);
        return stage === "On Grill" || stage === "Plating" || stage === "Ready";
      }).length,
    };
  }, [isRestaurant, jobs]);

  async function loadBoardMeta() {
    const { data } = await supabase
      .from("starter_boards")
      .select("*")
      .eq("board_slug", liveBoardSlug)
      .maybeSingle();

    if (data) {
      setBoardMeta(data as StarterBoardRow);
    }
  }

  async function loadJobs() {
    setLoading(true);
    setStatusNote("");

    const { data, error } = await supabase
      .from("auto_repair_jobs")
      .select("*")
      .eq("board_slug", liveBoardSlug)
      .order("created_at", { ascending: true });

    if (error) {
      setStatusNote(`Load failed: ${error.message}`);
      setLoading(false);
      return;
    }

    const nextJobs = (data as DbRepairJob[]).map(dbToUi);
    setJobs(nextJobs);

    if (!isRestaurant && nextJobs.length > 0) {
      setSelectedJobId((current) =>
        current && nextJobs.some((job) => job.id === current)
          ? current
          : nextJobs[0].id,
      );
    } else {
      setSelectedJobId(null);
    }

    setLoading(false);
  }

  function updateLocalSelectedJob<K extends keyof RepairJob>(
    key: K,
    value: RepairJob[K],
  ) {
    if (!selectedJob) return;

    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id ? { ...job, [key]: value } : job,
    );
    setJobs(updatedJobs);
    scheduleSave(updatedJobs.find((job) => job.id === selectedJob.id) ?? null);
  }

  function scheduleSave(job: RepairJob | null) {
    if (!job) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    setSaving(true);
    setStatusNote("Saving...");

    saveTimerRef.current = window.setTimeout(() => {
      void persistJob(job);
    }, 250);
  }

  async function persistJob(job: RepairJob) {
    const { error } = await supabase
      .from("auto_repair_jobs")
      .update(uiPatchToDb(job))
      .eq("id", job.id);

    if (error) {
      setStatusNote(`Save failed: ${error.message}`);
      setSaving(false);
      return;
    }

    setSaving(false);
    setStatusNote("Saved");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  function openRestaurantTicketEditor(job?: RepairJob | null) {
    setTicketEditorDraft(makeRestaurantDraft(stages, job));
    setTicketEditorOpen(true);
  }

  function closeRestaurantTicketEditor() {
    setTicketEditorOpen(false);
    setTicketEditorDraft(null);
    setTicketEditorSaving(false);
  }

  async function saveRestaurantTicket() {
    if (!ticketEditorDraft) return;

    setTicketEditorSaving(true);
    setStatusNote(ticketEditorDraft.id ? "Saving ticket..." : "Creating ticket...");

    if (ticketEditorDraft.id) {
      const payloadToSave = {
        customer: ticketEditorDraft.customer,
        vehicle: ticketEditorDraft.vehicle,
        concern: ticketEditorDraft.concern,
        stage: ticketEditorDraft.stage,
        eta: ticketEditorDraft.eta,
        advisor: ticketEditorDraft.advisor,
        notes: ticketEditorDraft.notes,
      };

      const { data, error } = await supabase
        .from("auto_repair_jobs")
        .update(payloadToSave)
        .eq("id", ticketEditorDraft.id)
        .select("*")
        .single();

      if (error) {
        setTicketEditorSaving(false);
        setStatusNote(`Save failed: ${error.message}`);
        return;
      }

      const updatedJob = dbToUi(data as DbRepairJob);
      setJobs((current) =>
        current.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
      );
      setTicketEditorSaving(false);
      setStatusNote("Saved");
      closeRestaurantTicketEditor();
      window.setTimeout(() => setStatusNote(""), 1000);
      return;
    }

    const { data, error } = await supabase
      .from("auto_repair_jobs")
      .insert({
        board_slug: liveBoardSlug,
        ro_number: makeRONumber(jobs.length),
        customer: ticketEditorDraft.customer,
        vehicle: ticketEditorDraft.vehicle,
        concern: ticketEditorDraft.concern,
        stage: ticketEditorDraft.stage || stages[0] || "New Ticket",
        eta: ticketEditorDraft.eta,
        advisor: ticketEditorDraft.advisor,
        notes: ticketEditorDraft.notes,
        phone: "",
        appointment_date: null,
        appointment_time: "",
      })
      .select("*")
      .single();

    if (error) {
      setTicketEditorSaving(false);
      setStatusNote(`Create failed: ${error.message}`);
      return;
    }

    const createdJob = dbToUi(data as DbRepairJob);
    setJobs((current) => [createdJob, ...current]);
    setTicketEditorSaving(false);
    setStatusNote("Created");
    closeRestaurantTicketEditor();
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function deleteRestaurantTicket() {
    if (!ticketEditorDraft?.id) return;

    setTicketEditorSaving(true);
    setStatusNote("Deleting ticket...");

    const { error } = await supabase
      .from("auto_repair_jobs")
      .delete()
      .eq("id", ticketEditorDraft.id);

    if (error) {
      setTicketEditorSaving(false);
      setStatusNote(`Delete failed: ${error.message}`);
      return;
    }

    setJobs((current) => current.filter((job) => job.id !== ticketEditorDraft.id));
    setTicketEditorSaving(false);
    setStatusNote("Deleted");
    closeRestaurantTicketEditor();
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function handleAddJob() {
    if (isRestaurant) {
      openRestaurantTicketEditor();
      return;
    }

    setSaving(true);
    setStatusNote("Creating item...");

    const createdInput = {
      board_slug: liveBoardSlug,
      ro_number: makeRONumber(jobs.length),
      customer: "",
      vehicle: "",
      concern: "",
      stage: config.stages[0] || "New Intake",
      eta: "",
      advisor: "Front Counter",
      notes: "",
      phone: "",
      appointment_date: null,
      appointment_time: "",
    };

    const { data, error } = await supabase
      .from("auto_repair_jobs")
      .insert(createdInput)
      .select("*")
      .single();

    if (error) {
      setSaving(false);
      setStatusNote(`Create failed: ${error.message}`);
      return;
    }

    const createdJob = dbToUi(data as DbRepairJob);
    setJobs((current) => [createdJob, ...current]);
    setSelectedJobId(createdJob.id);
    setStageMenuOpen(false);
    setSaving(false);
    setStatusNote("Created");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function handleDeleteSelected() {
    if (!selectedJob) return;

    setSaving(true);
    setStatusNote("Deleting...");

    const { error } = await supabase
      .from("auto_repair_jobs")
      .delete()
      .eq("id", selectedJob.id);

    if (error) {
      setSaving(false);
      setStatusNote(`Delete failed: ${error.message}`);
      return;
    }

    const next = jobs.filter((job) => job.id !== selectedJob.id);
    setJobs(next);
    setSelectedJobId(next[0]?.id ?? null);
    setStageMenuOpen(false);
    setSaving(false);
    setStatusNote("Deleted");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function handleReload() {
    setSaving(true);
    setStatusNote("Reloading live data...");
    setSelectedJobId(null);
    setStageMenuOpen(false);
    await loadBoardMeta();
    await loadJobs();
    setSaving(false);
    setStatusNote("Loaded live board data");
    window.setTimeout(() => setStatusNote(""), 1000);
  }

  async function copyMessage(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(`${label} copied`);
      window.setTimeout(() => setCopiedMessage(""), 1600);
    } catch {
      setCopiedMessage("Copy failed");
      window.setTimeout(() => setCopiedMessage(""), 1600);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.12)]">
          <div className="grid gap-6 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-8">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                {config.familyLabel}
              </div>

              <h1 className="mt-4 text-3xl font-semibold md:text-5xl">
                {businessName}
              </h1>

              <p className="mt-3 max-w-3xl text-base text-slate-300 md:text-lg">
                {config.boardSubtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleAddJob()}
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  {config.createButtonLabel}
                </button>

                <button
                  type="button"
                  onClick={() => void handleReload()}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Reload Live Data
                </button>

                {isRestaurant ? (
                  <>
                    <div className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100">
                      Kitchen mode active
                    </div>

                    <button
                      type="button"
                      onClick={() => setManagerPanelOpen(true)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                    >
                      Manager Panel
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Demo status
              </div>
              <div className="mt-3 text-2xl font-semibold">Board Ready</div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div>City: {city}</div>
                <div>Flow: {config.flowLabel}</div>
                <div>Mode: {businessType}</div>
                <div>Live link: /planet/live/{liveBoardSlug}</div>
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
                {loading
                  ? "Loading from Supabase..."
                  : saving
                    ? "Saving to Supabase..."
                    : statusNote || "Connected to Supabase"}
              </div>
            </div>
          </div>
        </div>

        {boardMeta ? (
          <div className="mb-6 rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-emerald-200/70">
                  HomePlanet Truth Layer
                </div>
                <h2 className="mt-2 text-2xl font-semibold">Origin locked</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-50">
                  This starter board has a timestamped creation record tied to
                  its Presence ID, Presence Key, board slug, and trial start.
                </p>
              </div>

              <div className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                Presence-first timestamped
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <ProofCard label="Presence ID" value={boardMeta.presence_id} />
              <ProofCard label="Board slug" value={boardMeta.board_slug} />
              <ProofCard
                label="Created at"
                value={formatProofDate(boardMeta.created_at)}
              />
              <ProofCard
                label="Trial started"
                value={formatProofDate(boardMeta.trial_started_at)}
              />
              <ProofCard
                label="Trial ends"
                value={formatProofDate(boardMeta.trial_ends_at)}
              />
            </div>
          </div>
        ) : null}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <StatCard label={isRestaurant ? "Tickets" : "Items"} value={totals.total} />
          <StatCard label="In Progress" value={totals.inProgress} />
          <StatCard
            label={isRestaurant ? "Ready / Completed" : "Completed / Ready"}
            value={totals.ready}
          />
          <StatCard
            label={isRestaurant ? "New Tickets" : "New"}
            value={totals.newIntake}
            accent
          />
        </div>

        <div
          className={`grid gap-6 ${
            isRestaurant ? "xl:grid-cols-1" : "xl:grid-cols-[1.15fr_0.85fr]"
          }`}
        >
          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-4 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">
                  {isRestaurant ? "Live Ticket Flow" : "Active Flow"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {isRestaurant
                    ? "Full-width kitchen mode keeps tickets visible across the whole board."
                    : "Click any card to open its working drawer."}
                </p>
              </div>

              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
                {config.familyLabel}
              </div>
            </div>

            <div
              className={`grid gap-4 ${
                isRestaurant
                  ? "md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"
                  : "md:grid-cols-2 2xl:grid-cols-3"
              }`}
            >
              {grouped.map((column) => (
                <div
                  key={column.stage}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold">{column.stage}</h3>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                      {column.jobs.length}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {column.jobs.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                        {isRestaurant ? "No tickets here yet." : "Nothing here yet."}
                      </div>
                    ) : (
                      column.jobs.map((job) => {
                        const selected = selectedJobId === job.id;

                        if (isRestaurant) {
                          return (
                            <button
                              key={job.id}
                              type="button"
                              onClick={() => openRestaurantTicketEditor(job)}
                              className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.05]"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                    {formatTicketNumber(job.roNumber)}
                                  </div>
                                  <div className="mt-2 text-lg font-semibold text-white">
                                    {restaurantPrimaryLabel(
                                      job,
                                      restaurantIdentityMode,
                                    )}
                                  </div>
                                  <div className="mt-1 text-sm text-slate-400">
                                    {restaurantSecondaryLabel(
                                      job,
                                      restaurantIdentityMode,
                                    )}
                                  </div>
                                </div>

                                <div
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stageTone(
                                    normalizeRestaurantStage(job.stage),
                                  )}`}
                                >
                                  {normalizeRestaurantStage(job.stage)}
                                </div>
                              </div>

                              <div className="mt-3 text-sm leading-6 text-slate-300">
                                {job.concern || "Items Ordered pending"}
                              </div>

                              <div className="mt-3 text-xs leading-5 text-slate-500">
                                {job.notes || "Special instructions pending"}
                              </div>

                              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                                <span>{job.advisor || "Server pending"}</span>
                                <span>{job.eta || "Ticket Time pending"}</span>
                              </div>
                            </button>
                          );
                        }

                        return (
                          <button
                            key={job.id}
                            type="button"
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setStageMenuOpen(false);
                            }}
                            className={`w-full rounded-[20px] border p-4 text-left transition ${
                              selected
                                ? "border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.10)]"
                                : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                  {job.roNumber}
                                </div>
                                <div className="mt-2 text-base font-semibold">
                                  {job.customer || "New Customer"}
                                </div>
                              </div>

                              <div
                                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${stageTone(
                                  job.stage,
                                )}`}
                              >
                                {job.stage}
                              </div>
                            </div>

                            <div className="mt-2 text-sm text-slate-300">
                              {job.vehicle || `${config.labels.item} pending`}
                            </div>

                            <div className="mt-2 text-sm text-slate-400">
                              {job.concern || `${config.labels.concern} pending`}
                            </div>

                            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                              <span>
                                {job.advisor ||
                                  `${config.labels.advisor} pending`}
                              </span>
                              <span>{job.eta || `${config.labels.eta} pending`}</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>

            {isRestaurant ? (
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Manager layer
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-300">
                      Restaurant mode stays full width during rush. Manager tools
                      stay tucked away in a slide-over panel so the live board
                      keeps maximum space for tickets.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setManagerPanelOpen(true)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
                  >
                    Open Manager Panel
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {!isRestaurant ? (
            <div className="rounded-[30px] border border-white/10 bg-[#081122] p-5">
              {selectedJob ? (
                <>
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Work Item
                      </div>
                      <div className="mt-2 text-2xl font-semibold">
                        {selectedJob.roNumber}
                      </div>
                      <div className="mt-1 text-sm text-slate-400">
                        Working drawer
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJobId(null);
                        setStageMenuOpen(false);
                      }}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Field label="Customer Name">
                      <input
                        value={selectedJob.customer}
                        onChange={(e) =>
                          updateLocalSelectedJob("customer", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder="Customer name"
                      />
                    </Field>

                    <Field label={config.labels.item}>
                      <input
                        value={selectedJob.vehicle}
                        onChange={(e) =>
                          updateLocalSelectedJob("vehicle", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={config.labels.item}
                      />
                    </Field>

                    <Field label={config.labels.concern}>
                      <input
                        value={selectedJob.concern}
                        onChange={(e) =>
                          updateLocalSelectedJob("concern", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={config.labels.concern}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={config.labels.stage}>
                        <div className="relative" ref={stageMenuRef}>
                          <button
                            type="button"
                            onClick={() => setStageMenuOpen((open) => !open)}
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left outline-none transition hover:border-cyan-400/30"
                          >
                            <span>{selectedJob.stage}</span>
                            <span className="text-slate-400">▾</span>
                          </button>

                          {stageMenuOpen ? (
                            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-2xl border border-white/10 bg-[#0b1730] p-2 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                              {stages.map((stage) => {
                                const active = stage === selectedJob.stage;

                                return (
                                  <button
                                    key={stage}
                                    type="button"
                                    onClick={() => {
                                      updateLocalSelectedJob("stage", stage);
                                      setStageMenuOpen(false);
                                    }}
                                    className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition last:mb-0 ${
                                      active
                                        ? "bg-cyan-400/12 text-cyan-100"
                                        : "text-slate-200 hover:bg-white/[0.05]"
                                    }`}
                                  >
                                    <span>{stage}</span>
                                    {active ? (
                                      <span className="text-cyan-300">✓</span>
                                    ) : null}
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      </Field>

                      <Field label={config.labels.eta}>
                        <input
                          value={selectedJob.eta}
                          onChange={(e) =>
                            updateLocalSelectedJob("eta", e.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                          placeholder={config.labels.eta}
                        />
                      </Field>
                    </div>

                    <Field label={config.labels.advisor}>
                      <input
                        value={selectedJob.advisor}
                        onChange={(e) =>
                          updateLocalSelectedJob("advisor", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={config.labels.advisor}
                      />
                    </Field>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={config.labels.phone}>
                        <input
                          value={selectedJob.phone}
                          onChange={(e) =>
                            updateLocalSelectedJob("phone", e.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                          placeholder="863-555-1212"
                        />
                      </Field>

                      <Field label={config.labels.appointmentDate}>
                        <input
                          type="date"
                          value={selectedJob.appointmentDate}
                          onChange={(e) =>
                            updateLocalSelectedJob("appointmentDate", e.target.value)
                          }
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        />
                      </Field>
                    </div>

                    <Field label={config.labels.appointmentTime}>
                      <input
                        type="time"
                        value={selectedJob.appointmentTime}
                        onChange={(e) =>
                          updateLocalSelectedJob("appointmentTime", e.target.value)
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                      />
                    </Field>

                    <Field label={config.labels.notes}>
                      <textarea
                        value={selectedJob.notes}
                        onChange={(e) =>
                          updateLocalSelectedJob("notes", e.target.value)
                        }
                        className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                        placeholder={config.labels.notes}
                      />
                    </Field>

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Appointment summary
                      </div>
                      <div className="mt-2 text-sm leading-6 text-slate-300">
                        {formatAppointment(
                          selectedJob.appointmentDate,
                          selectedJob.appointmentTime,
                        )}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                            Quick customer messages
                          </div>
                          <div className="mt-2 text-sm leading-6 text-cyan-50">
                            Text the customer directly or copy the message first.
                          </div>
                        </div>

                        {copiedMessage ? (
                          <div className="rounded-full border border-cyan-400/20 px-3 py-1 text-xs text-cyan-100">
                            {copiedMessage}
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3">
                        <MessageActionCard
                          title={config.actions.updateTitle}
                          subtitle={config.actions.updateSubtitle}
                          message={buildStatusMessage(selectedJob, businessName)}
                          phone={selectedJob.phone}
                          onCopy={copyMessage}
                        />

                        <MessageActionCard
                          title={config.actions.approvalTitle}
                          subtitle={config.actions.approvalSubtitle}
                          message={buildApprovalMessage(selectedJob, businessName)}
                          phone={selectedJob.phone}
                          onCopy={copyMessage}
                        />

                        <MessageActionCard
                          title={config.actions.appointmentTitle}
                          subtitle={config.actions.appointmentSubtitle}
                          message={buildAppointmentMessage(selectedJob, businessName)}
                          phone={selectedJob.phone}
                          onCopy={copyMessage}
                        />

                        <MessageActionCard
                          title={config.actions.completionTitle}
                          subtitle={config.actions.completionSubtitle}
                          message={buildReadyMessage(selectedJob, businessName)}
                          phone={selectedJob.phone}
                          onCopy={copyMessage}
                        />
                      </div>

                      {!selectedJob.phone ? (
                        <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                          Add a customer phone number to enable text buttons.
                        </div>
                      ) : null}
                    </div>

                    <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                        Save mode
                      </div>
                      <div className="mt-2 text-sm leading-6 text-emerald-50">
                        Changes save automatically to Supabase and stay after
                        refresh.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleDeleteSelected()}
                      className="w-full rounded-full border border-red-400/25 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15"
                    >
                      Delete Item
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[520px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Working drawer
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold">Select a card</h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
                      Click any card on the left to open the details drawer, edit
                      it, and watch the board update live.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {isRestaurant && managerPanelOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close manager panel backdrop"
            onClick={() => setManagerPanelOpen(false)}
            className="absolute inset-0 bg-black/55"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-[460px] border-l border-white/10 bg-[#081122] shadow-[0_0_60px_rgba(0,0,0,0.45)]">
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Restaurant manager panel
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {businessName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Manager tools stay off-board so kitchen flow keeps maximum
                    room for live tickets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setManagerPanelOpen(false)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                      Today’s snapshot
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <MiniStat label="Live tickets" value={String(totals.total)} />
                      <MiniStat label="In progress" value={String(totals.inProgress)} />
                      <MiniStat
                        label="Ready"
                        value={String(restaurantSnapshot?.readyCount ?? 0)}
                      />
                      <MiniStat
                        label="Completed"
                        value={String(restaurantSnapshot?.completedCount ?? 0)}
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Ticket identity mode
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">
                      Choose how tickets display on the board right now. Later,
                      this should be asked during restaurant onboarding and saved.
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRestaurantIdentityMode("table")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          restaurantIdentityMode === "table"
                            ? "bg-cyan-400 text-slate-950"
                            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        Table numbers
                      </button>

                      <button
                        type="button"
                        onClick={() => setRestaurantIdentityMode("name")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          restaurantIdentityMode === "name"
                            ? "bg-cyan-400 text-slate-950"
                            : "border border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                        }`}
                      >
                        Customer names
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Live ticket status
                    </div>

                    <div className="mt-4 space-y-3">
                      <PanelRow
                        label="On grill"
                        value={String(restaurantSnapshot?.grillCount ?? 0)}
                      />
                      <PanelRow
                        label="Plating"
                        value={String(restaurantSnapshot?.platingCount ?? 0)}
                      />
                      <PanelRow
                        label="Urgent view"
                        value={String(restaurantSnapshot?.urgentCount ?? 0)}
                      />
                      <PanelRow
                        label="New tickets"
                        value={String(totals.newIntake)}
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-amber-400/20 bg-amber-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-amber-200/70">
                      Notifications
                    </div>
                    <div className="mt-3 space-y-3 text-sm text-amber-50">
                      <NotificationLine
                        title="Ready queue watch"
                        body={`${restaurantSnapshot?.readyCount ?? 0} ticket(s) currently marked ready.`}
                      />
                      <NotificationLine
                        title="Rush awareness"
                        body={`${restaurantSnapshot?.urgentCount ?? 0} ticket(s) in grill, plating, or ready states.`}
                      />
                      <NotificationLine
                        title="Next layer"
                        body="Runner alerts, expo notices, and sound-based rush signals can plug into this panel next."
                      />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-200/70">
                      Inventory watch
                    </div>
                    <div className="mt-2 text-sm leading-6 text-emerald-50">
                      Placeholder for low-stock items, 86 list, prep alerts, and
                      ingredient watch. This belongs here instead of taking board
                      space away from live tickets.
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Manager notes
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-400">
                      Placeholder for shift notes, labor reminders, rush prep,
                      comp tracking, and end-of-day notes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isRestaurant && ticketEditorOpen && ticketEditorDraft ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close ticket editor backdrop"
            onClick={closeRestaurantTicketEditor}
            className="absolute inset-0 bg-black/60"
          />

          <div className="absolute left-1/2 top-1/2 w-[min(760px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/10 bg-[#081122] shadow-[0_0_60px_rgba(0,0,0,0.45)]">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Restaurant ticket editor
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {ticketEditorDraft.id
                      ? ticketEditorDraft.roNumber
                        ? formatTicketNumber(ticketEditorDraft.roNumber)
                        : "Edit Ticket"
                      : "New Ticket"}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Enter the table, guest, items ordered, special instructions,
                    server, and ticket time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeRestaurantTicketEditor}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Table Number">
                  <input
                    value={ticketEditorDraft.vehicle}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, vehicle: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Table 12"
                  />
                </Field>

                <Field label="Customer Name">
                  <input
                    value={ticketEditorDraft.customer}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, customer: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Robert"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Server">
                  <input
                    value={ticketEditorDraft.advisor}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, advisor: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="Mia"
                  />
                </Field>

                <Field label="Ticket Time">
                  <input
                    value={ticketEditorDraft.eta}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, eta: e.target.value } : current,
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="8 min"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Stage">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {stages.map((stage) => {
                      const active = ticketEditorDraft.stage === stage;

                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() =>
                            setTicketEditorDraft((current) =>
                              current ? { ...current, stage } : current,
                            )
                          }
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                            active
                              ? "border-cyan-400/35 bg-cyan-400/10 text-cyan-100"
                              : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.05]"
                          }`}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Items Ordered">
                  <textarea
                    value={ticketEditorDraft.concern}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, concern: e.target.value } : current,
                      )
                    }
                    className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="2 eggs over medium, bacon, white toast, plain bagel"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Special Instructions">
                  <textarea
                    value={ticketEditorDraft.notes}
                    onChange={(e) =>
                      setTicketEditorDraft((current) =>
                        current ? { ...current, notes: e.target.value } : current,
                      )
                    }
                    className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 outline-none transition focus:border-cyan-400/40"
                    placeholder="No butter on toast, bacon extra crispy"
                  />
                </Field>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-5">
              <div className="text-sm text-slate-400">
                {ticketEditorDraft.id
                  ? "Update this ticket or delete it."
                  : "Create this ticket and place it directly on the live board."}
              </div>

              <div className="flex flex-wrap gap-3">
                {ticketEditorDraft.id ? (
                  <button
                    type="button"
                    onClick={() => void deleteRestaurantTicket()}
                    disabled={ticketEditorSaving}
                    className="rounded-full border border-red-400/25 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete Ticket
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={closeRestaurantTicketEditor}
                  disabled={ticketEditorSaving}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void saveRestaurantTicket()}
                  disabled={ticketEditorSaving}
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {ticketEditorSaving
                    ? "Saving..."
                    : ticketEditorDraft.id
                      ? "Save Ticket"
                      : "Create Ticket"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MessageActionCard({
  title,
  subtitle,
  message,
  phone,
  onCopy,
}: MessageActionCardProps) {
  const hasPhone = Boolean(phone.trim());

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="mt-1 text-xs text-slate-400">{subtitle}</div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!hasPhone}
          onClick={() => openTextMessage(phone, message)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            hasPhone
              ? "bg-cyan-400 text-slate-950 hover:scale-[1.01]"
              : "cursor-not-allowed bg-white/10 text-slate-500"
          }`}
        >
          Text customer
        </button>

        <button
          type="button"
          onClick={() => onCopy(title, message)}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
        >
          Copy message
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 ${
        accent
          ? "border-cyan-400/25 bg-cyan-400/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div
        className={`text-xs uppercase tracking-[0.22em] ${
          accent ? "text-cyan-200/70" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
    </div>
  );
}

function ProofCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 break-all text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-sm font-medium text-slate-300">{label}</div>
      {children}
    </label>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function PanelRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function NotificationLine({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-300/15 bg-black/10 px-4 py-3">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm leading-6 text-amber-50/90">{body}</div>
    </div>
  );
}