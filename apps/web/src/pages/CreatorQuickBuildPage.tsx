import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const workflowFamilies = [
  {
    label: "Home Services",
    slug: "home-services",
    description:
      "Run jobs, crews, requests, proof, payments, and customer updates.",
    examples:
      "Cleaning, plumbing, electrical, lawn, painting, handyman",
    stages: [
      "New Request",
      "Review",
      "Scheduled",
      "In Progress",
      "Proof Added",
      "Payment Due",
      "Complete",
    ],
  },
  {
    label: "Appointments",
    slug: "appointments",
    description:
      "Handle bookings, check-ins, service flow, payments, and follow-ups.",
    examples:
      "Barber, salon, massage, grooming, mobile appointments",
    stages: [
      "New Booking",
      "Confirmed",
      "Checked In",
      "Service Active",
      "Payment Due",
      "Complete",
    ],
  },
  {
    label: "Food & Hospitality",
    slug: "food-hospitality",
    description:
      "Coordinate orders, tables, kitchen flow, pickups, and guest experience.",
    examples:
      "Restaurants, food trucks, catering, coffee, bars",
    stages: [
      "New Order",
      "Confirmed",
      "Preparing",
      "Ready",
      "Payment",
      "Complete",
    ],
  },
  {
    label: "Tours & Experiences",
    slug: "tours-experiences",
    description:
      "Manage bookings, arrivals, memories, payments, and live guest flow.",
    examples:
      "Airboats, fishing, events, rentals, guides",
    stages: [
      "New Booking",
      "Confirmed",
      "Arriving",
      "Experience Active",
      "Memory Added",
      "Payment",
      "Complete",
    ],
  },
  {
    label: "Retail & Selling",
    slug: "retail-selling",
    description:
      "Handle products, orders, pickups, payments, and customer updates.",
    examples:
      "Local shops, print shops, merch, custom orders, pickups",
    stages: [
      "New Order",
      "Review",
      "In Production",
      "Ready",
      "Pickup / Delivery",
      "Paid",
      "Complete",
    ],
  },
  {
    label: "Community & Help",
    slug: "community-help",
    description:
      "Organize requests, communication, local coordination, and support flow.",
    examples:
      "Community needs, volunteers, local support, neighborhood help",
    stages: [
      "New Request",
      "Review",
      "Matched",
      "In Progress",
      "Updated",
      "Complete",
    ],
  },
  {
    label: "Custom Workflow",
    slug: "custom-workflow",
    description:
      "Tell HomePlanet what you're trying to run. The system can shape around it.",
    examples:
      "Anything that needs requests, updates, proof, payments, or coordination",
    stages: [
      "New Request",
      "Review",
      "Active",
      "Needs Update",
      "Payment / Proof",
      "Complete",
    ],
  },
];

const systemSignals = [
  "Customer intake enabled",
  "Live operations prepared",
  "Mobile workflow active",
  "Payment support connected",
  "Proof timeline ready",
  "Customer updates enabled",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreatorQuickBuildPage() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [selectedType, setSelectedType] = useState(workflowFamilies[0]);

  const boardSlug = useMemo(
    () => slugify(businessName || selectedType.label),
    [businessName, selectedType]
  );

  function buildBoard() {
    const slug = boardSlug || `homeplanet-board-${Date.now()}`;

    const payload = {
      boardSlug: slug,
      businessName: businessName || selectedType.label,
      createdAt: new Date().toISOString(),
      operationalSystem: {
        label: selectedType.label,
        liveBoard: true,
        staffBoard: true,
        lobbyBoard: true,
        requestFlow: true,
        photoProof: true,
        paymentQr: true,
        proofTimeline: true,
        stages: selectedType.stages.map((stage) => ({
          id: slugify(stage),
          label: stage,
          description: `HomePlanet prepared this operational step for ${selectedType.label}.`,
        })),
      },
    };

    window.localStorage.setItem(
      `hp-system:${slug}`,
      JSON.stringify(payload)
    );

    window.location.href = `/planet/creator/presence/${slug}`;
  }

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_80px_rgba(16,185,129,0.08)]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
            <Sparkles size={14} />
            Quick Build
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            What do you want HomePlanet to run?
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
            Pick the kind of operation you are running. HomePlanet prepares the
            live system around it.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_.82fr]">
          <section className="rounded-[2rem] border border-emerald-300/10 bg-emerald-300/[0.04] p-6">
            <label className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              Name your system
            </label>

            <input
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              placeholder="Example: Kevin's Painting Service"
              className="mt-3 h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-lg font-bold text-white outline-none placeholder:text-white/30"
            />

            <div className="mt-6">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                Pick your operation
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {workflowFamilies.map((type) => {
                  const active = selectedType.slug === type.slug;

                  return (
                    <button
                      type="button"
                      key={type.slug}
                      onClick={() => setSelectedType(type)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-emerald-300/50 bg-emerald-300/15 shadow-[0_0_35px_rgba(16,185,129,0.10)]"
                          : "border-white/10 bg-white/[0.04] hover:border-emerald-300/30 hover:bg-white/[0.06]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-lg font-black">
                          {type.label}
                        </div>

                        {active ? (
                          <CheckCircle2
                            className="text-emerald-300"
                            size={20}
                          />
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {type.description}
                      </p>

                      <p className="mt-3 text-xs font-bold leading-5 text-white/35">
                        {type.examples}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => buildBoard()}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-5 text-sm font-black text-neutral-950 shadow-xl shadow-emerald-500/20"
            >
              Build My Live System
              <ArrowRight size={18} />
            </button>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              HomePlanet detects
            </div>

            <h2 className="mt-3 text-3xl font-black">
              {businessName || selectedType.label}
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/58">
              HomePlanet will prepare the operational surface, customer entry
              point, proof layer, and payment-ready workflow without making your
              customer download an app.
            </p>

            <div className="mt-4 break-all rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-bold text-white/45">
              /planet/live/{boardSlug || selectedType.slug}
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-300/10 bg-emerald-300/[0.05] p-5">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                System Ready
              </div>

              <div className="mt-4 grid gap-3">
                {systemSignals.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-emerald-300"
                    />

                    <span className="text-sm font-bold text-white/75">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.04] p-5">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                Preview-first
              </div>

              <p className="mt-3 text-sm leading-6 text-white/58">
                You will see the live board first. Activate only when the system
                feels right.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}


