import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Scale,
  ShieldCheck,
  Sparkles,
  Tag,
  Tractor,
  UserRound,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type IntakeStage =
  | "animal-dropoff"
  | "weight-intake"
  | "processing-instructions"
  | "confirm-lock";

type AnimalType = "Beef Steer" | "Beef Cow" | "Hog" | "Lamb" | "Goat" | "Other";

type LivestockStage =
  | "animal-received"
  | "origin-locked"
  | "processing-instructions"
  | "cut-pack-stage"
  | "boxed-frozen"
  | "ready-for-pickup"
  | "paid-released";

const STAGES: Array<{
  key: IntakeStage;
  label: string;
  desc: string;
}> = [
  {
    key: "animal-dropoff",
    label: "Animal Drop-Off",
    desc: "Owner, source, animal type, and tag are captured.",
  },
  {
    key: "weight-intake",
    label: "Weight + Intake",
    desc: "Weight in and intake moment are locked to the record.",
  },
  {
    key: "processing-instructions",
    label: "Processing Instructions",
    desc: "Cuts, packaging, and special requests are confirmed.",
  },
  {
    key: "confirm-lock",
    label: "Confirm + Lock",
    desc: "The animal record is sealed and the truth board is created.",
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildAnimalId(tagNumber: string): string {
  const cleaned = tagNumber.trim().replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return "STEER-4821";
  return `STEER-${cleaned.toUpperCase()}`;
}

function buildAnimalSlug(animalId: string, ownerName: string): string {
  return `${slugify(animalId)}-${slugify(ownerName)}`;
}

export default function ButcherLivestockIntakeFlow() {
  const navigate = useNavigate();

  const [currentStage] = useState<IntakeStage>("animal-dropoff");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");

  const [ownerName, setOwnerName] = useState("Daniel Doyon");
  const [phone, setPhone] = useState("");
  const [farmSource, setFarmSource] = useState("Taylor Creek Cattle, Okeechobee");
  const [animalType, setAnimalType] = useState<AnimalType>("Beef Steer");
  const [tagNumber, setTagNumber] = useState("4821");
  const [weightIn, setWeightIn] = useState("1228 lb");
  const [intakeAt] = useState("April 20, 2026 at 8:42 AM");

  const animalId = useMemo(() => buildAnimalId(tagNumber), [tagNumber]);
  const animalSlug = useMemo(
    () => buildAnimalSlug(animalId, ownerName || "customer"),
    [animalId, ownerName],
  );

  const stageIndex = useMemo(
    () => STAGES.findIndex((stage) => stage.key === currentStage),
    [currentStage],
  );

  const completionPercent = useMemo(
    () => Math.round(((stageIndex + 1) / STAGES.length) * 100),
    [stageIndex],
  );

  const processingInstructions = useMemo(
    () => [
      "Customer requested standard family cut sheet.",
      "Steaks cut at 1 inch thickness.",
      "Roasts split into smaller family-size portions.",
      "Ground beef packed in 1 lb bags.",
    ],
    [],
  );

  const cutRequests = useMemo(
    () => [
      "Ribeyes separated and clearly labeled.",
      "Brisket kept whole.",
      "Soup bones saved.",
      "Liver kept.",
      "Fat retained on request.",
    ],
    [],
  );

  const packagingNotes = useMemo(
    () => [
      "Vacuum sealed where possible.",
      "Each box labeled with animal ID and owner name.",
      "Mixed cuts separated by type for easier freezer loading.",
    ],
    [],
  );

  async function handleContinue() {
    setIsSaving(true);
    setSaveError("");

    const payload = {
      animal_id: animalId,
      animal_slug: animalSlug,
      owner_name: ownerName.trim() || "Customer",
      phone: phone.trim(),
      farm_source: farmSource.trim() || "Unknown source",
      intake_at: intakeAt,
      weight_in: weightIn.trim() || "Pending weight",
      animal_type: animalType,
      current_stage: "animal-received" as LivestockStage,
      processing_instructions: processingInstructions,
      cut_requests: cutRequests,
      packaging_notes: packagingNotes,
      box_count: 0,
      freezer_status: "Not frozen yet",
      freezer_location: "Not assigned yet",
      pickup_status: "Not ready for pickup",
      payment_status: "Unpaid",
      receipt_status: "Not issued yet",
      proof_status: "Intake locked",
      estimated_yield: "Estimated 490–530 lb packaged",
      final_yield: "Pending final packaged weight",
      amount_due: "$1,180.00",
      payment_method: "Zelle / Cash App / In-person",
    };

    const { error } = await supabase
      .from("livestock_records")
      .upsert(payload, { onConflict: "animal_slug" });

    if (error) {
      setSaveError(error.message || "Unable to save livestock intake record.");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    navigate(`/planet/livestock/truth/${animalSlug}`);
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-cyan-500/20 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(180deg,rgba(9,18,33,0.98),rgba(6,12,24,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
          <div className="flex flex-col gap-6 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Livestock Intake Flow
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Intake is where the truth chain starts.
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  This is not a generic intake form. This is the moment the animal is received,
                  identified, weighed, instructed, and locked into a permanent origin-to-handoff
                  record.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[380px]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Animal ID
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{animalId}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Stage
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    {stageIndex + 1}/{STAGES.length}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Intake Time
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">08:42</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    Board Slug
                  </div>
                  <div className="mt-2 truncate text-sm font-semibold text-white">{animalSlug}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <UserRound className="h-4 w-4 text-cyan-300" />
                  Owner / Customer
                </div>
                <p className="mt-2 text-sm text-slate-200">{ownerName}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Tractor className="h-4 w-4 text-cyan-300" />
                  Farm / Source
                </div>
                <p className="mt-2 text-sm text-slate-200">{farmSource}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Clock3 className="h-4 w-4 text-cyan-300" />
                  Intake Locked
                </div>
                <p className="mt-2 text-sm text-slate-200">{intakeAt}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Scale className="h-4 w-4 text-cyan-300" />
                  Weight In
                </div>
                <p className="mt-2 text-sm text-slate-200">{weightIn}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                    Current Intake Position
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">Animal Drop-Off</div>
                  <div className="mt-1 text-sm text-cyan-50/80">
                    Owner, source, animal type, and tag are captured.
                  </div>
                </div>

                <div className="min-w-[220px]">
                  <div className="mb-2 flex items-center justify-between text-xs text-cyan-50/80">
                    <span>Intake progress</span>
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

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Intake Flow</h2>
              </div>

              <div className="mt-5 grid gap-3">
                {STAGES.map((stage, index) => {
                  const active = index === stageIndex;
                  const complete = index < stageIndex;

                  return (
                    <div
                      key={stage.key}
                      className={`rounded-3xl border p-4 transition-all ${
                        active
                          ? "border-cyan-400/40 bg-cyan-500/10"
                          : complete
                            ? "border-emerald-400/30 bg-emerald-500/10"
                            : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white">
                          {index + 1}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{stage.label}</h3>
                            {active ? (
                              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
                                Active
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{stage.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Animal Drop-Off</h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Owner / Customer
                  </div>
                  <input
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Owner name"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Phone
                  </div>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Phone number"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Farm / Source
                  </div>
                  <input
                    value={farmSource}
                    onChange={(e) => setFarmSource(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="Farm or source"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Animal Type
                  </div>
                  <select
                    value={animalType}
                    onChange={(e) => setAnimalType(e.target.value as AnimalType)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"
                  >
                    <option className="bg-slate-900">Beef Steer</option>
                    <option className="bg-slate-900">Beef Cow</option>
                    <option className="bg-slate-900">Hog</option>
                    <option className="bg-slate-900">Lamb</option>
                    <option className="bg-slate-900">Goat</option>
                    <option className="bg-slate-900">Other</option>
                  </select>
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Tag / Animal Number
                  </div>
                  <input
                    value={tagNumber}
                    onChange={(e) => setTagNumber(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                    placeholder="4821"
                  />
                </label>

                <label className="block">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                    Generated Animal ID
                  </div>
                  <input
                    value={animalId}
                    readOnly
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"
                  />
                </label>
              </div>
            </div>

            {saveError ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {saveError}
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-slate-400"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Continue"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">Live Intake Preview</h2>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { label: "Animal Type", value: animalType },
                  { label: "Animal ID", value: animalId },
                  { label: "Owner", value: ownerName },
                  { label: "Source Farm", value: farmSource },
                  { label: "Intake Timestamp", value: intakeAt },
                  { label: "Board Route", value: `/planet/livestock/truth/${animalSlug}` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 break-all text-sm font-medium text-slate-100">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0b1728] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">What Gets Locked</h2>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  "Animal identity tied to source and owner",
                  "Intake timestamp and weigh-in event",
                  "Processing instructions and cut requests",
                  "Starting point for proof, receipt, payment, and release",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                  >
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-cyan-400/20 bg-cyan-400/10 p-5 sm:p-6">
              <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100/80">
                Truth Creation Moment
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Intake is not data entry. It is proof creation.
              </h2>
              <p className="mt-3 text-sm leading-6 text-cyan-50/90">
                The butcher is not just checking in an animal. The shop is creating the permanent
                root record that every stage, proof item, box count, payment, and release event
                will later connect back to.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}