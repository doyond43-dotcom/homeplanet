import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  starterPlan?: string;
};

type StarterBoardRow = {
  id?: string;
  board_slug: string;
  business_name: string | null;
  business_type: string | null;
  city: string | null;
  owner_name: string | null;
  phone: string | null;
  presence_id: string | null;
  presence_key: string | null;
  starter_plan: string | null;
  is_active: boolean | null;
  claim_status: string | null;
  created_at?: string | null;
};

type AutoRepairJobSeed = {
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
  appointment_date: string;
  appointment_time: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['".,!?/\\]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function normalizeBusinessName(value?: string) {
  return (value ?? "").trim();
}

function normalizeOwnerName(value?: string) {
  return (value ?? "").trim();
}

function normalizeBusinessType(value?: string) {
  return (value ?? "auto-repair").trim();
}

function normalizeCity(value?: string) {
  return (value ?? "").trim();
}

function createPresenceId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "HP-";
  for (let i = 0; i < 8; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function ensureBoardSlug(payload: OnboardingPayload) {
  const fromPayload = (payload.boardSlug ?? "").trim();
  if (fromPayload) return fromPayload;

  const businessName = normalizeBusinessName(payload.businessName);
  const city = normalizeCity(payload.city);
  const base = [businessName || "starter-board", city].filter(Boolean).join("-");
  const slugBase = slugify(base || "starter-board");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${slugBase}-${suffix}`;
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function defaultAppointmentTime() {
  return "09:00";
}

function buildSeedJob(
  boardSlug: string,
  payload: OnboardingPayload,
): AutoRepairJobSeed {
  const businessType = normalizeBusinessType(payload.businessType);
  const boardConfig = resolveStarterBoardConfig(businessType);

  const firstStage =
    boardConfig?.stages?.[0]?.id ??
    boardConfig?.stages?.[0]?.label ??
    "new";

  const contactName =
    normalizeOwnerName(payload.ownerName) ||
    normalizeBusinessName(payload.businessName) ||
    "Customer";

  const businessName = normalizeBusinessName(payload.businessName);

  return {
    board_slug: boardSlug,
    ro_number: `RO-${String(Math.floor(1000 + Math.random() * 9000))}`,
    customer: contactName,
    vehicle: businessType === "auto-repair" ? "Vehicle pending" : "New job",
    concern:
      payload.primaryGoal?.trim() ||
      `New ${businessName ? `${businessName} ` : ""}${businessType} intake`,
    stage: firstStage,
    eta: "TBD",
    advisor: normalizeOwnerName(payload.ownerName) || "Front Desk",
    notes: "Starter job created during onboarding transition.",
    phone: "",
    appointment_date: todayDate(),
    appointment_time: defaultAppointmentTime(),
  };
}

async function getStarterBoardBySlug(boardSlug: string) {
  const { data, error } = await supabase
    .from("starter_boards")
    .select("*")
    .eq("board_slug", boardSlug)
    .limit(1)
    .maybeSingle<StarterBoardRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function createStarterBoard(
  payload: OnboardingPayload,
  boardSlug: string,
) {
  const insertRow: StarterBoardRow = {
    board_slug: boardSlug,
    business_name: normalizeBusinessName(payload.businessName) || null,
    business_type: normalizeBusinessType(payload.businessType) || null,
    city: normalizeCity(payload.city) || null,
    owner_name: normalizeOwnerName(payload.ownerName) || null,
    phone: null,
    presence_id: payload.presenceId?.trim() || createPresenceId(),
    presence_key: payload.presenceKey?.trim() || crypto.randomUUID(),
    starter_plan: payload.starterPlan?.trim() || "free",
    is_active: true,
    claim_status: "starter",
  };

  const { data, error } = await supabase
    .from("starter_boards")
    .insert(insertRow)
    .select("*")
    .single<StarterBoardRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function updateStarterBoard(
  existing: StarterBoardRow,
  payload: OnboardingPayload,
  boardSlug: string,
) {
  const patch: Partial<StarterBoardRow> = {
    board_slug: boardSlug,
    business_name:
      existing.business_name ??
      normalizeBusinessName(payload.businessName) ??
      null,
    business_type:
      existing.business_type ??
      normalizeBusinessType(payload.businessType) ??
      null,
    city: existing.city ?? normalizeCity(payload.city) ?? null,
    owner_name:
      existing.owner_name ?? normalizeOwnerName(payload.ownerName) ?? null,
    presence_id:
      existing.presence_id ??
      payload.presenceId?.trim() ??
      createPresenceId(),
    presence_key:
      existing.presence_key ??
      payload.presenceKey?.trim() ??
      crypto.randomUUID(),
    starter_plan:
      existing.starter_plan ?? payload.starterPlan?.trim() ?? "free",
    is_active: existing.is_active ?? true,
    claim_status: existing.claim_status ?? "starter",
  };

  const { data, error } = await supabase
    .from("starter_boards")
    .update(patch)
    .eq("board_slug", boardSlug)
    .select("*")
    .single<StarterBoardRow>();

  if (error) {
    throw error;
  }

  return data;
}

async function ensureStarterBoard(payload: OnboardingPayload) {
  const boardSlug = ensureBoardSlug(payload);

  let existing = await getStarterBoardBySlug(boardSlug);

  if (!existing) {
    return createStarterBoard(payload, boardSlug);
  }

  const missingPresence = !existing.presence_id || !existing.presence_key;
  const missingCore =
    !existing.business_name || !existing.business_type || !existing.board_slug;

  if (missingPresence || missingCore) {
    existing = await updateStarterBoard(existing, payload, boardSlug);
  }

  return existing;
}

async function ensureStarterJob(
  board: StarterBoardRow,
  payload: OnboardingPayload,
) {
  const { count, error: countError } = await supabase
    .from("auto_repair_jobs")
    .select("*", { count: "exact", head: true })
    .eq("board_slug", board.board_slug);

  if (countError) {
    throw countError;
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const seedJob = buildSeedJob(board.board_slug, payload);

  const { error: insertError } = await supabase
    .from("auto_repair_jobs")
    .insert(seedJob);

  if (insertError) {
    throw insertError;
  }
}

export default function OnboardingBuildTransition() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasStartedRef = useRef(false);

  const payload = useMemo<OnboardingPayload>(() => {
    return (location.state as OnboardingPayload | null) ?? {};
  }, [location.state]);

  const [status, setStatus] = useState<
    "idle" | "creating" | "hydrating" | "finalizing" | "error"
  >("idle");
  const [statusLabel, setStatusLabel] = useState("Preparing your live board...");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const run = async () => {
      try {
        setStatus("creating");
        setStatusLabel("Locking your live board identity...");

        const board = await ensureStarterBoard(payload);

        if (!board?.board_slug || !board?.presence_id || !board?.presence_key) {
          throw new Error("Starter board did not return a real board identity.");
        }

        setStatus("hydrating");
        setStatusLabel("Loading board structure...");

        await ensureStarterJob(board, payload);

        setStatus("finalizing");
        setStatusLabel("Opening your live board...");

        navigate(`/planet/live/${board.board_slug}`, {
          replace: true,
          state: {
            businessName: board.business_name ?? payload.businessName ?? "",
            ownerName: board.owner_name ?? payload.ownerName ?? "",
            businessType:
              board.business_type ?? payload.businessType ?? "auto-repair",
            city: board.city ?? payload.city ?? "",
            primaryGoal: payload.primaryGoal ?? "",
            boardSlug: board.board_slug,
            presenceId: board.presence_id,
            presenceKey: board.presence_key,
            starterPlan: board.starter_plan ?? payload.starterPlan ?? "free",
            onboardingLocked: true,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to complete onboarding transition.";

        setStatus("error");
        setErrorMessage(message);
        setStatusLabel("We hit a problem locking your live board.");
      }
    };

    void run();
  }, [navigate, payload]);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
            HomePlanet Build
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Building your live board
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">
            {statusLabel}
          </p>

          <div className="mt-8 space-y-4">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-emerald-400 transition-all duration-500 ${
                  status === "idle"
                    ? "w-[8%]"
                    : status === "creating"
                      ? "w-[38%]"
                      : status === "hydrating"
                        ? "w-[68%]"
                        : status === "finalizing"
                          ? "w-[96%]"
                          : "w-[100%] bg-red-400"
                }`}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div
                className={`rounded-2xl border p-4 ${
                  status === "creating" ||
                  status === "hydrating" ||
                  status === "finalizing"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-white/10 bg-white/[0.03] text-white/55"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Identity
                </div>
                <div className="mt-2 text-sm">Starter board locked</div>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  status === "hydrating" || status === "finalizing"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-white/10 bg-white/[0.03] text-white/55"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Structure
                </div>
                <div className="mt-2 text-sm">Board rows prepared</div>
              </div>

              <div
                className={`rounded-2xl border p-4 ${
                  status === "finalizing"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-white/10 bg-white/[0.03] text-white/55"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Launch
                </div>
                <div className="mt-2 text-sm">Opening live board</div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
            <div className="font-medium text-white/80">Incoming setup</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div>
                <span className="text-white/45">Business:</span>{" "}
                {payload.businessName?.trim() || "Starter Board"}
              </div>
              <div>
                <span className="text-white/45">Type:</span>{" "}
                {payload.businessType?.trim() || "auto-repair"}
              </div>
              <div>
                <span className="text-white/45">Owner:</span>{" "}
                {payload.ownerName?.trim() || "Not provided"}
              </div>
              <div>
                <span className="text-white/45">City:</span>{" "}
                {payload.city?.trim() || "Not provided"}
              </div>
            </div>
          </div>

          {status === "error" ? (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-100">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
