export type PredictionSeverity = "low" | "medium" | "high" | "critical";

export type PredictionSignalCode =
  | "missing-proof"
  | "stage-stuck"
  | "rapid-stage-change"
  | "missing-contact"
  | "missing-appointment"
  | "completed-without-proof"
  | "completed-without-payment"
  | "stage-regression"
  | "origin-proof-gap"
  | "missing-core-fields";

export type PredictionSignal = {
  id: string;
  code: PredictionSignalCode;
  severity: PredictionSeverity;
  title: string;
  detail: string;
  itemId: string;
  itemLabel: string;
  createdAt: string;
  meta?: Record<string, string | number | boolean | null>;
};

export type PredictionEngineItem = {
  id: string;
  roNumber?: string;
  customer?: string;
  vehicle?: string;
  concern?: string;
  stage?: string;
  eta?: string;
  advisor?: string;
  notes?: string;
  phone?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  createdAt?: string;
  updatedAt?: string;
  proofCount?: number;
  paymentStatus?: string;
  originLinked?: boolean;
};

export type PredictionStagePolicy = {
  stages: string[];
  completedStages?: string[];
  paymentRequiredStages?: string[];
  stuckThresholdHours?: number;
  rapidProgressionMinutes?: number;
  requirePhone?: boolean;
  requireAppointment?: boolean;
  requireProofAtCompletion?: boolean;
  requireOriginLink?: boolean;
};

export type PredictionEngineOptions = {
  now?: Date;
  policy?: Partial<PredictionStagePolicy>;
};

const DEFAULT_POLICY: PredictionStagePolicy = {
  stages: [],
  completedStages: ["ready", "completed", "done", "sold", "processed"],
  paymentRequiredStages: ["ready", "completed", "done", "sold"],
  stuckThresholdHours: 48,
  rapidProgressionMinutes: 5,
  requirePhone: false,
  requireAppointment: false,
  requireProofAtCompletion: true,
  requireOriginLink: false,
};

function normalize(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function toDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function hoursBetween(a: Date, b: Date) {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60);
}

function minutesBetween(a: Date, b: Date) {
  return Math.abs(b.getTime() - a.getTime()) / (1000 * 60);
}

function buildItemLabel(item: PredictionEngineItem) {
  return (
    item.roNumber?.trim() ||
    item.vehicle?.trim() ||
    item.customer?.trim() ||
    item.id
  );
}

function slugifyStage(value?: string) {
  return normalize(value).replace(/\s+/g, "-");
}

function isCompletedStage(
  stage: string | undefined,
  policy: PredictionStagePolicy,
) {
  const normalized = normalize(stage);
  if (!normalized) return false;

  return policy.completedStages!.some((entry) => normalized === normalize(entry));
}

function requiresPayment(
  stage: string | undefined,
  policy: PredictionStagePolicy,
) {
  const normalized = normalize(stage);
  if (!normalized) return false;

  return policy.paymentRequiredStages!.some(
    (entry) => normalized === normalize(entry),
  );
}

function makeSignal(args: {
  code: PredictionSignalCode;
  severity: PredictionSeverity;
  title: string;
  detail: string;
  item: PredictionEngineItem;
  now: Date;
  meta?: Record<string, string | number | boolean | null>;
}): PredictionSignal {
  return {
    id: `${args.item.id}:${args.code}`,
    code: args.code,
    severity: args.severity,
    title: args.title,
    detail: args.detail,
    itemId: args.item.id,
    itemLabel: buildItemLabel(args.item),
    createdAt: args.now.toISOString(),
    meta: args.meta,
  };
}

export function evaluatePredictionSignals(
  items: PredictionEngineItem[],
  options?: PredictionEngineOptions,
): PredictionSignal[] {
  const now = options?.now ?? new Date();
  const policy: PredictionStagePolicy = {
    ...DEFAULT_POLICY,
    ...(options?.policy || {}),
  };

  const stageOrder = policy.stages.map((stage) => slugifyStage(stage));
  const signals: PredictionSignal[] = [];

  for (const item of items) {
    const label = buildItemLabel(item);
    const stage = normalize(item.stage);
    const createdAt = toDate(item.createdAt);
    const updatedAt = toDate(item.updatedAt) || createdAt;
    const proofCount = item.proofCount ?? 0;
    const paymentStatus = normalize(item.paymentStatus);
    const hasPhone = Boolean((item.phone || "").trim());
    const hasAppointment = Boolean(
      (item.appointmentDate || "").trim() || (item.appointmentTime || "").trim(),
    );
    const hasCustomer = Boolean((item.customer || "").trim());
    const hasVehicle = Boolean((item.vehicle || "").trim());
    const hasConcern = Boolean((item.concern || "").trim());

    if (!hasCustomer || !hasVehicle || !hasConcern) {
      signals.push(
        makeSignal({
          code: "missing-core-fields",
          severity: "medium",
          title: "Core item details missing",
          detail: `${label} is missing one or more key fields needed for clean tracking.`,
          item,
          now,
          meta: {
            hasCustomer,
            hasVehicle,
            hasConcern,
          },
        }),
      );
    }

    if (policy.requirePhone && !hasPhone) {
      signals.push(
        makeSignal({
          code: "missing-contact",
          severity: "medium",
          title: "Customer contact missing",
          detail: `${label} has no phone number, which weakens updates, approvals, and proof communication.`,
          item,
          now,
        }),
      );
    }

    if (policy.requireAppointment && !hasAppointment) {
      signals.push(
        makeSignal({
          code: "missing-appointment",
          severity: "low",
          title: "Appointment information missing",
          detail: `${label} has no appointment date or time locked yet.`,
          item,
          now,
        }),
      );
    }

    if (proofCount === 0) {
      signals.push(
        makeSignal({
          code: "missing-proof",
          severity: "low",
          title: "No proof captured yet",
          detail: `${label} has no proof moments logged yet.`,
          item,
          now,
        }),
      );
    }

    if (policy.requireOriginLink && item.originLinked === false) {
      signals.push(
        makeSignal({
          code: "origin-proof-gap",
          severity: "high",
          title: "Origin proof chain is broken",
          detail: `${label} does not have a complete origin link, which weakens truth and traceability.`,
          item,
          now,
        }),
      );
    }

    if (updatedAt) {
      const ageHours = hoursBetween(updatedAt, now);
      if (
        ageHours >= (policy.stuckThresholdHours || DEFAULT_POLICY.stuckThresholdHours!)
        && !isCompletedStage(stage, policy)
      ) {
        signals.push(
          makeSignal({
            code: "stage-stuck",
            severity: ageHours >= 96 ? "high" : "medium",
            title: "Stage appears stuck",
            detail: `${label} has been sitting in "${item.stage || "unknown"}" for too long without movement.`,
            item,
            now,
            meta: {
              hoursSinceUpdate: Math.round(ageHours * 10) / 10,
            },
          }),
        );
      }
    }

    if (createdAt && updatedAt) {
      const rapidMinutes = minutesBetween(createdAt, updatedAt);
      if (
        rapidMinutes > 0 &&
        rapidMinutes <=
          (policy.rapidProgressionMinutes ||
            DEFAULT_POLICY.rapidProgressionMinutes!)
      ) {
        signals.push(
          makeSignal({
            code: "rapid-stage-change",
            severity: "medium",
            title: "Progression happened unusually fast",
            detail: `${label} moved too quickly after creation, which may need verification.`,
            item,
            now,
            meta: {
              minutesFromCreateToUpdate: Math.round(rapidMinutes * 10) / 10,
            },
          }),
        );
      }
    }

    if (stageOrder.length > 0 && stage) {
      const stageIndex = stageOrder.indexOf(slugifyStage(stage));
      if (stageIndex === -1) {
        signals.push(
          makeSignal({
            code: "stage-regression",
            severity: "low",
            title: "Stage not recognized by policy",
            detail: `${label} is in "${item.stage}", which does not match the current board stage policy.`,
            item,
            now,
          }),
        );
      }
    }

    if (isCompletedStage(stage, policy) && policy.requireProofAtCompletion && proofCount < 1) {
      signals.push(
        makeSignal({
          code: "completed-without-proof",
          severity: "high",
          title: "Completed stage has no proof",
          detail: `${label} is marked complete or ready without supporting proof.`,
          item,
          now,
        }),
      );
    }

    if (
      isCompletedStage(stage, policy) &&
      requiresPayment(stage, policy) &&
      paymentStatus &&
      paymentStatus !== "payment-confirmed" &&
      paymentStatus !== "paid" &&
      paymentStatus !== "completed"
    ) {
      signals.push(
        makeSignal({
          code: "completed-without-payment",
          severity: "high",
          title: "Completion is ahead of payment",
          detail: `${label} is complete or ready, but payment is not confirmed yet.`,
          item,
          now,
          meta: {
            paymentStatus,
          },
        }),
      );
    }
  }

  return dedupeAndSortSignals(signals);
}

function severityRank(severity: PredictionSeverity) {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function dedupeAndSortSignals(signals: PredictionSignal[]) {
  const unique = new Map<string, PredictionSignal>();

  for (const signal of signals) {
    const existing = unique.get(signal.id);
    if (!existing || severityRank(signal.severity) > severityRank(existing.severity)) {
      unique.set(signal.id, signal);
    }
  }

  return Array.from(unique.values()).sort((a, b) => {
    const severityDiff = severityRank(b.severity) - severityRank(a.severity);
    if (severityDiff !== 0) return severityDiff;
    return a.itemLabel.localeCompare(b.itemLabel);
  });
}

export function summarizePredictionSignals(signals: PredictionSignal[]) {
  return {
    total: signals.length,
    critical: signals.filter((s) => s.severity === "critical").length,
    high: signals.filter((s) => s.severity === "high").length,
    medium: signals.filter((s) => s.severity === "medium").length,
    low: signals.filter((s) => s.severity === "low").length,
  };
}

export function getTopPredictionSignal(signals: PredictionSignal[]) {
  return signals[0] ?? null;
}

export function mapRepairJobsToPredictionItems<
  T extends {
    id: string;
    roNumber?: string;
    customer?: string;
    vehicle?: string;
    concern?: string;
    stage?: string;
    eta?: string;
    advisor?: string;
    notes?: string;
    phone?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    createdAt?: string;
    updatedAt?: string;
    proof?: Array<unknown>;
    paymentStatus?: string;
  },
>(jobs: T[]): PredictionEngineItem[] {
  return jobs.map((job) => ({
    id: job.id,
    roNumber: job.roNumber,
    customer: job.customer,
    vehicle: job.vehicle,
    concern: job.concern,
    stage: job.stage,
    eta: job.eta,
    advisor: job.advisor,
    notes: job.notes,
    phone: job.phone,
    appointmentDate: job.appointmentDate,
    appointmentTime: job.appointmentTime,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    proofCount: Array.isArray(job.proof) ? job.proof.length : 0,
    paymentStatus: job.paymentStatus,
  }));
}

export function defaultRepairPredictionPolicy(
  stages: string[],
): PredictionStagePolicy {
  return {
    ...DEFAULT_POLICY,
    stages,
    completedStages: ["ready", "completed", "done", "ready for pickup"],
    paymentRequiredStages: ["ready", "completed", "done", "ready for pickup"],
    stuckThresholdHours: 36,
    rapidProgressionMinutes: 3,
    requirePhone: true,
    requireAppointment: false,
    requireProofAtCompletion: true,
    requireOriginLink: false,
  };
}

export function defaultLivestockPredictionPolicy(
  stages: string[],
): PredictionStagePolicy {
  return {
    ...DEFAULT_POLICY,
    stages,
    completedStages: ["ready", "sold", "processed"],
    paymentRequiredStages: ["sold", "processed"],
    stuckThresholdHours: 24,
    rapidProgressionMinutes: 15,
    requirePhone: false,
    requireAppointment: false,
    requireProofAtCompletion: true,
    requireOriginLink: true,
  };
}