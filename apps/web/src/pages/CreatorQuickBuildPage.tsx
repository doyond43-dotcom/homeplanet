import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

const workflowFamilies = [
  {
    label: "Home Services",
    slug: "home-services",
    description:
      "Run jobs, crews, requests, proof, payments, and customer updates.",
    examples: "Cleaning, plumbing, electrical, lawn, painting, handyman",
    stages: ["New Request", "Review", "Scheduled", "In Progress", "Proof Added", "Payment Due", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Maria Jenkins",
      title: "House wash + driveway cleaning",
      note: "A sample request showing how HomePlanet tracks a local service job from request to proof and payment.",
    },
  },
  {
    label: "Appointments",
    slug: "appointments",
    description:
      "Handle bookings, check-ins, service flow, payments, and follow-ups.",
    examples: "Barber, salon, massage, grooming, mobile appointments",
    stages: ["New Booking", "Confirmed", "Checked In", "Service Active", "Payment Due", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Marcus Reed",
      title: "Fade + beard trim",
      note: "A sample appointment showing booking, check-in, service activity, and completion.",
    },
  },
  {
    label: "Food & Hospitality",
    slug: "food-hospitality",
    description:
      "Coordinate orders, tables, kitchen flow, pickups, and guest experience.",
    examples: "Restaurants, food trucks, catering, coffee, bars",
    stages: ["New Order", "Confirmed", "Preparing", "Ready", "Payment", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Jessica Lane",
      title: "Smash burger combo",
      note: "A sample food flow showing order intake, prep, ready status, and payment.",
    },
  },
  {
    label: "Tours & Experiences",
    slug: "tours-experiences",
    description:
      "Manage bookings, arrivals, memories, payments, and live guest flow.",
    examples: "Airboats, fishing, events, rentals, guides",
    stages: ["New Booking", "Confirmed", "Arriving", "Experience Active", "Memory Added", "Payment", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Ryan Carter",
      title: "Airboat sunset ride",
      note: "A sample experience flow showing booking, arrival, active experience, memory, and payment.",
    },
  },
  {
    label: "Retail & Selling",
    slug: "retail-selling",
    description:
      "Handle products, orders, pickups, payments, and customer updates.",
    examples: "Local shops, print shops, merch, custom orders, pickups",
    stages: ["New Order", "Review", "In Production", "Ready", "Pickup / Delivery", "Paid", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Ashley Monroe",
      title: "Hoodie pickup order",
      note: "A sample retail flow showing order review, production, pickup, and payment.",
    },
  },
  {
    label: "Community & Help",
    slug: "community-help",
    description:
      "Organize requests, communication, local coordination, and support flow.",
    examples: "Community needs, volunteers, local support, neighborhood help",
    stages: ["New Request", "Review", "Matched", "In Progress", "Updated", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Local resident request",
      title: "Yard cleanup assistance",
      note: "A sample community request showing local coordination and follow-through.",
    },
  },
  {
    label: "Custom Workflow",
    slug: "custom-workflow",
    description:
      "Tell HomePlanet what you're trying to run. The system can shape around it.",
    examples: "Anything that needs requests, updates, proof, payments, or coordination",
    stages: ["New Request", "Review", "Active", "Needs Update", "Payment / Proof", "Complete"],
    exampleWorkflow: {
      label: "Example Workflow",
      customerName: "Starter request",
      title: "Custom workflow example",
      note: "A sample workflow showing how HomePlanet can shape around what you are trying to run.",
    },
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
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CreatorQuickBuildPage() {
  const [businessName, setBusinessName] = useState("");
  const [selectedType, setSelectedType] = useState(workflowFamilies[0]);
  const [leadName, setLeadName] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadError, setLeadError] = useState("");

  const boardSlug = useMemo(
    () => slugify(businessName || selectedType.label),
    [businessName, selectedType]
  );

  function buildBoard() {
    const slug = boardSlug || `homeplanet-board-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const stages = selectedType.stages.map((stage) => ({
      id: slugify(stage),
      label: stage,
      description: `HomePlanet prepared this operational step for ${selectedType.label}.`,
    }));

    const exampleWorkflow = {
      id: `example-${slug}`,
      kind: "example-workflow",
      label: selectedType.exampleWorkflow.label,
      customerName: selectedType.exampleWorkflow.customerName,
      title: selectedType.exampleWorkflow.title,
      note: selectedType.exampleWorkflow.note,
      stageId: stages[0]?.id || "new-request",
      stageLabel: stages[0]?.label || "New Request",
      removable: true,
      createdAt,
    };

    const payload = {
      boardSlug: slug,
      businessName: businessName || selectedType.label,
      createdAt,
      operationalSystem: {
        label: selectedType.label,
        liveBoard: true,
        staffBoard: true,
        lobbyBoard: true,
        requestFlow: true,
        photoProof: true,
        paymentQr: true,
        proofTimeline: true,
        stages,
        exampleWorkflow,
      },
      exampleWorkflow,
    };

    window.localStorage.setItem(`hp-system:${slug}`, JSON.stringify(payload));
    window.localStorage.setItem(`hp-example-workflow:${slug}`, JSON.stringify(exampleWorkflow));

    window.location.href = `/planet/creator/presence/${slug}`;
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadError("");

    const name = leadName.trim();
    const contact = leadContact.trim();
    const message = leadMessage.trim();

    if (!contact && !message) {
      setLeadError("Add a phone/email or a quick note so HomePlanet can follow up.");
      return;
    }

    const { error } = await supabase.from("homeplanet_leads").insert({
      name,
      contact,
      message,
      selected_operation: selectedType.label,
      business_name: businessName.trim(),
      board_slug: boardSlug,
    });

    if (error) {
      console.error("[homeplanet-leads] insert failed:", error);
      setLeadError("Message could not be saved yet. Try again in a moment.");
      return;
    }

    setLeadSaved(true);
    setLeadName("");
    setLeadContact("");
    setLeadMessage("");
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
            Pick the kind of operation you are running. HomePlanet prepares the live system around it.
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
                        <div className="text-lg font-black">{type.label}</div>
                        {active ? <CheckCircle2 className="text-emerald-300" size={20} /> : null}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-white/60">{type.description}</p>
                      <p className="mt-3 text-xs font-bold leading-5 text-white/35">{type.examples}</p>
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

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <div className="text-center">
                <p className="text-sm font-bold leading-6 text-white/60">
                  Need help shaping your live system?
                </p>
                <p className="mt-1 text-xs font-bold text-white/35">
                  Tell us what you are trying to run. We will help map it.
                </p>
              </div>

              {leadSaved ? (
                <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-center text-sm font-black text-emerald-200">
                  Message saved. HomePlanet will follow up.
                </div>
              ) : (
                <form onSubmit={submitLead} className="mt-4 grid gap-3">
                  <input
                    value={leadName}
                    onChange={(event) => setLeadName(event.target.value)}
                    placeholder="What should we call you?"
                    className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none placeholder:text-white/30"
                  />

                  <input
                    value={leadContact}
                    onChange={(event) => setLeadContact(event.target.value)}
                    placeholder="Phone or email"
                    className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm font-bold text-white outline-none placeholder:text-white/30"
                  />

                  <textarea
                    value={leadMessage}
                    onChange={(event) => setLeadMessage(event.target.value)}
                    placeholder="What are you trying to run?"
                    className="min-h-24 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30"
                  />

                  {leadError ? (
                    <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-3 text-center text-xs font-bold text-red-200">
                      {leadError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-5 py-3 text-sm font-black text-emerald-200 transition hover:bg-emerald-300/15"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              HomePlanet detects
            </div>

            <h2 className="mt-3 text-3xl font-black">
              {businessName || selectedType.label}
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/58">
              HomePlanet will prepare the operational surface, customer entry point, proof layer, and payment-ready workflow without making your customer download an app.
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
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                    <CheckCircle2 size={18} className="text-emerald-300" />
                    <span className="text-sm font-bold text-white/75">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.04] p-5">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                Preview-first
              </div>

              <p className="mt-3 text-sm leading-6 text-white/58">
                You will see the live board first. Activate only when the system feels right.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}