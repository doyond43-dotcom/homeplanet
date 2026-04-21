import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  BadgeCheck,
  Box,
  ClipboardList,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  PackageCheck,
  Scale,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tractor,
  UserRound,
} from "lucide-react";

type LivestockStage =
  | "animal-received"
  | "origin-locked"
  | "processing-instructions"
  | "cut-pack-stage"
  | "boxed-frozen"
  | "ready-for-pickup"
  | "paid-released";

type ProofItem = {
  id: string;
  title: string;
  note: string;
  timestamp: string;
  stage: LivestockStage;
};

type LivestockRecord = {
  animalId: string;
  animalSlug: string;
  ownerName: string;
  farmSource: string;
  intakeAt: string;
  weightIn: string;
  currentStage: LivestockStage;
  animalType: string;
  processingInstructions: string[];
  cutRequests: string[];
  packagingNotes: string[];
  boxCount: number;
  freezerStatus: string;
  freezerLocation: string;
  pickupStatus: string;
  paymentStatus: string;
  receiptStatus: string;
  proofStatus: string;
  estimatedYield: string;
  finalYield: string;
  amountDue: string;
  paymentMethod: string;
};

type IntakeNavState = Partial<LivestockRecord>;

const STAGES: Array<{
  key: LivestockStage;
  label: string;
  shortLabel: string;
  desc: string;
}> = [
  {
    key: "animal-received",
    label: "Animal Received",
    shortLabel: "Received",
    desc: "Animal arrives and intake begins.",
  },
  {
    key: "origin-locked",
    label: "Origin Locked",
    shortLabel: "Origin Locked",
    desc: "Identity, source, and ownership are sealed to the animal.",
  },
  {
    key: "processing-instructions",
    label: "Processing Instructions",
    shortLabel: "Instructions",
    desc: "Cut sheet, customer requests, and processing notes are confirmed.",
  },
  {
    key: "cut-pack-stage",
    label: "Processing (Cut & Pack)",
    shortLabel: "Cut / Pack",
    desc: "Processing, cutting, sorting, and packing are in motion.",
  },
  {
    key: "boxed-frozen",
    label: "Boxed / Frozen",
    shortLabel: "Frozen",
    desc: "Final packed product is boxed, frozen, and storage-ready.",
  },
  {
    key: "ready-for-pickup",
    label: "Ready for Pickup",
    shortLabel: "Pickup Ready",
    desc: "Order is complete and customer handoff is ready.",
  },
  {
    key: "paid-released",
    label: "Paid / Released",
    shortLabel: "Released",
    desc: "Payment is complete and final handoff is verified.",
  },
];

const SAMPLE_RECORD: LivestockRecord = {
  animalId: "STEER-4821",
  animalSlug: "steer-4821-doyon",
  ownerName: "Daniel Doyon",
  farmSource: "Taylor Creek Cattle, Okeechobee",
  intakeAt: "April 18, 2026 • 8:42 AM",
  weightIn: "1,228 lb",
  currentStage: "boxed-frozen",
  animalType: "Beef Steer",
  processingInstructions: [
    "Customer requested standard family cut sheet.",
    "Steaks cut at 1 inch thickness.",
    "Roasts split into smaller family-size portions.",
    "Ground beef packed in 1 lb bags.",
  ],
  cutRequests: [
    "Ribeyes separated and clearly labeled.",
    "Brisket kept whole.",
    "Soup bones saved.",
    "Liver kept.",
    "Fat retained on request.",
  ],
  packagingNotes: [
    "Vacuum sealed where possible.",
    "Each box labeled with animal ID and owner name.",
    "Mixed cuts separated by type for easier freezer loading.",
  ],
  boxCount: 11,
  freezerStatus: "Frozen and staged",
  freezerLocation: "Freezer B • Rack 2 • Right Side",
  pickupStatus: "Waiting on customer pickup",
  paymentStatus: "Unpaid",
  receiptStatus: "Ready to lock at release",
  proofStatus: "Proof in motion",
  estimatedYield: "Estimated 490–530 lb packaged",
  finalYield: "512 lb packaged",
  amountDue: "$1,180.00",
  paymentMethod: "Zelle / Cash App / In-person",
};

const SAMPLE_PROOF: ProofItem[] = [
  {
    id: "proof-1",
    title: "Intake photo locked",
    note: "Animal received and tagged at intake with source and owner confirmed.",
    timestamp: "April 18, 2026 • 8:44 AM",
    stage: "animal-received",
  },
  {
    id: "proof-2",
    title: "Origin tied to source",
    note: "Farm source, owner, and animal ID matched before processing.",
    timestamp: "April 18, 2026 • 8:49 AM",
    stage: "origin-locked",
  },
  {
    id: "proof-3",
    title: "Processing sheet confirmed",
    note: "Cut instructions reviewed and locked to this animal record.",
    timestamp: "April 18, 2026 • 9:10 AM",
    stage: "processing-instructions",
  },
  {
    id: "proof-4",
    title: "Pack stage captured",
    note: "Cut and pack workflow documented with timestamped stage note.",
    timestamp: "April 19, 2026 • 2:18 PM",
    stage: "cut-pack-stage",
  },
  {
    id: "proof-5",
    title: "Frozen hold confirmed",
    note: "Final boxes counted, labeled, and placed into freezer storage.",
    timestamp: "April 19, 2026 • 6:02 PM",
    stage: "boxed-frozen",
  },
];

function getStageIndex(stage: LivestockStage): number {
  return STAGES.findIndex((item) => item.key === stage);
}

function stageIsComplete(currentStage: LivestockStage, stage: LivestockStage): boolean {
  return getStageIndex(stage) < getStageIndex(currentStage);
}

function stageIsActive(currentStage: LivestockStage, stage: LivestockStage): boolean {
  return currentStage === stage;
}

function stageIsUpcoming(currentStage: LivestockStage, stage: LivestockStage): boolean {
  return getStageIndex(stage) > getStageIndex(currentStage);
}

function statusClasses(kind: "complete" | "active" | "upcoming"): string {
  if (kind === "complete") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-100";
  }
  if (kind === "active") {
    return "border-cyan-400/40 bg-cyan-500/10 text-cyan-100";
  }
  return "border-white/10 bg-white/[0.03] text-slate-300";
}

export default function ButcherLivestockTruthBoard() {
  const location = useLocation();
  const navState = (location.state as IntakeNavState | null) ?? null;

  const [record] = useState<LivestockRecord>(() => ({
    ...SAMPLE_RECORD,
    ...navState,
  }));

  const [proof] = useState<ProofItem[]>(SAMPLE_PROOF);

  const currentStageMeta = useMemo(
    () => STAGES.find((stage) => stage.key === record.currentStage) ?? STAGES[0],
    [record.currentStage],
  );

  const completionPercent = useMemo(() => {
    const currentIndex = getStageIndex(record.currentStage);
    return Math.round(((currentIndex + 1) / STAGES.length) * 100);
  }, [record.currentStage]);

  const proofCount = proof.length;

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(180deg,rgba(9,18,33,0.98),rgba(6,12,24,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Livestock Truth Board
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  One animal. One truth chain. One verified handoff.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  This is your animal, from source to freezer, with nothing lost in between.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[380px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Animal ID
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{record.animalId}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Stage
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {currentStageMeta.shortLabel}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Proof
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{proofCount} entries</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Progress
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{completionPercent}%</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <UserRound className="h-4 w-4 text-cyan-300" />
                  Owner / Customer
                </div>
                <p className="mt-2 text-sm text-slate-200">{record.ownerName}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Tractor className="h-4 w-4 text-cyan-300" />
                  Farm / Source
                </div>
                <p className="mt-2 text-sm text-slate-200">{record.farmSource}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Clock3 className="h-4 w-4 text-cyan-300" />
                  Intake Locked
                </div>
                <p className="mt-2 text-sm text-slate-200">{record.intakeAt}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Scale className="h-4 w-4 text-cyan-300" />
                  Weight In
                </div>
                <p className="mt-2 text-sm text-slate-200">{record.weightIn}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                    Current Truth Position
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">
                    {currentStageMeta.label}
                  </div>
                  <div className="mt-1 text-sm text-cyan-50/80">{currentStageMeta.desc}</div>
                </div>

                <div className="min-w-[220px]">
                  <div className="mb-2 flex items-center justify-between text-xs text-cyan-50/80">
                    <span>Chain progress</span>
                    <span>{completionPercent}% complete</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-cyan-300 transition-all"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Origin Card</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This is the original animal record. Everything in this system ties back to this
                identity.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Animal Type", value: record.animalType },
                  { label: "Animal ID", value: record.animalId },
                  { label: "Animal Slug", value: record.animalSlug },
                  { label: "Owner", value: record.ownerName },
                  { label: "Source Farm", value: record.farmSource },
                  { label: "Proof Status", value: record.proofStatus },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-100">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Processing Truth Flow</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                The workflow follows the actual butcher process: animal received, source locked,
                instructions confirmed, processed, boxed, frozen, paid, and released.
              </p>

              <div className="mt-5 grid gap-3">
                {STAGES.map((stage, index) => {
                  const complete = stageIsComplete(record.currentStage, stage.key);
                  const active = stageIsActive(record.currentStage, stage.key);
                  const upcoming = stageIsUpcoming(record.currentStage, stage.key);

                  const kind = complete ? "complete" : active ? "active" : "upcoming";

                  return (
                    <div
                      key={stage.key}
                      className={`rounded-3xl border p-4 transition-all ${statusClasses(kind)}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white">
                            {index + 1}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                              {complete ? (
                                <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
                                  Complete
                                </span>
                              ) : null}
                              {active ? (
                                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                                  Active
                                </span>
                              ) : null}
                              {upcoming ? (
                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                                  Upcoming
                                </span>
                              ) : null}
                            </div>

                            <p className="mt-1 text-sm leading-6 text-slate-300">{stage.desc}</p>
                          </div>
                        </div>

                        <div className="sm:min-w-[180px] sm:text-right">
                          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            Truth state
                          </div>
                          <div className="mt-1 text-sm font-medium text-slate-100">
                            {complete
                              ? "Locked in chain"
                              : active
                                ? "Current position"
                                : "Waiting in flow"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-cyan-300" />
                  <h2 className="text-lg font-semibold text-white">Processing Instructions</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {record.processingInstructions.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-cyan-300" />
                  <h2 className="text-lg font-semibold text-white">Cut Requests</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {record.cutRequests.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Proof Timeline (Verified)</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This is where HomePlanet separates from paper or memory. Instead of telling the
                customer what happened later, the shop builds timestamped truth while the work is
                happening.
              </p>

              <div className="mt-5 grid gap-3">
                {proof.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                            {STAGES.find((stage) => stage.key === item.stage)?.shortLabel}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{item.note}</p>
                      </div>

                      <div className="sm:min-w-[170px] sm:text-right">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Timestamp
                        </div>
                        <div className="mt-1 text-sm font-medium text-slate-100">
                          {item.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <Box className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Yield / Pack Card</h2>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { icon: Scale, label: "Estimated Yield", value: record.estimatedYield },
                  { icon: PackageCheck, label: "Final Yield", value: record.finalYield },
                  { icon: Box, label: "Box Count", value: `${record.boxCount} boxes` },
                  { icon: Snowflake, label: "Freezer Status", value: record.freezerStatus },
                  { icon: MapPin, label: "Freezer Location", value: record.freezerLocation },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        {item.label}
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-100">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-cyan-400/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/80">
                  Packaging Notes
                </div>
                <div className="mt-3 space-y-2">
                  {record.packagingNotes.map((note) => (
                    <div key={note} className="text-sm leading-6 text-cyan-50/90">
                      • {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Payment + Receipt</h2>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  { label: "Amount Due", value: record.amountDue },
                  { label: "Payment Status", value: record.paymentStatus },
                  { label: "Payment Options", value: record.paymentMethod },
                  { label: "Pickup Status", value: record.pickupStatus },
                  { label: "Receipt Status", value: record.receiptStatus },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-100">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-100">
                  <FileText className="h-4 w-4" />
                  Receipt truth layer
                </div>
                <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                  Final release is not just a payment mark. It is the verified handoff event tied
                  to animal ID, origin, processing chain, box count, and customer release
                  timestamp.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Prediction Layer</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Once enough animals run through the truth chain, the board can predict likely yield,
                box count, and turnaround windows based on real intake weight and real processing
                history instead of guessing.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                  Current prediction snapshot
                </div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
                  <div>• Similar intake weights usually land around 10–12 final boxes.</div>
                  <div>• Packaged yield range was predicted correctly before final freeze.</div>
                  <div>• Release timing can be forecast once pack-stage rhythm stabilizes.</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 sm:p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                Customer Proof View
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Animal origin ? processing truth ? customer proof
              </h2>
              <p className="mt-3 text-sm leading-6 text-cyan-50/90">
                The customer should be able to look at this board and immediately understand: this
                was my animal, from this source, with these instructions, processed through these
                stages, boxed like this, frozen here, and released only after verified payment and
                receipt.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
