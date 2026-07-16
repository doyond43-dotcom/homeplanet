import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  ClipboardList,
  CreditCard,
  FileText,
  MessageSquare,
  Phone,
  Shield,
  Snowflake,
  Star,
  ThermometerSnowflake,
  Wrench,
} from "lucide-react";

const FLORIDA_COOLING_PHONE_RAW = "8635326671";
const FLORIDA_COOLING_PHONE_DISPLAY = "(863) 532-6671";
const FLORIDA_COOLING_TEL = `tel:${FLORIDA_COOLING_PHONE_RAW}`;
const FLORIDA_COOLING_SMS = `sms:${FLORIDA_COOLING_PHONE_RAW}`;

const issueCards = [
  {
    title: "AC Not Cooling",
    description: "Warm air, system running but the house is still hot, or the AC just can't keep up.",
    urgency: "High",
  },
  {
    title: "No Air / Weak Airflow",
    description: "Little to no airflow from vents, weak circulation, or rooms not cooling evenly.",
    urgency: "High",
  },
  {
    title: "Water Leak / Drain Line",
    description: "Water around the air handler, drain line issues, or signs of overflow.",
    urgency: "Medium",
  },
  {
    title: "System Won't Turn On",
    description: "No power, blank thermostat, outside unit not kicking on, or system completely down.",
    urgency: "High",
  },
  {
    title: "Repair / Diagnostics",
    description: "Electrical issues, strange noises, frozen coil, repeated shutdowns, or performance problems.",
    urgency: "Medium",
  },
  {
    title: "New Unit / Replacement",
    description: "Full replacement, upgrade quote, new install, or help deciding whether to repair or replace.",
    urgency: "Estimate",
  },
  {
    title: "Maintenance / Tune-Up",
    description: "Seasonal service, system checkup, or preventative maintenance before small issues get expensive.",
    urgency: "Routine",
  },
  {
    title: "Not Sure What's Wrong?",
    description: "Tell Florida Cooling what the system is doing and the team will help guide the next step.",
    urgency: "Review",
  },
];

const services = [
  {
    title: "Diagnostics & Repairs",
    description: "Find the issue first. Fix the right problem instead of guessing.",
    icon: Wrench,
  },
  {
    title: "Emergency Cooling Help",
    description: "When the AC goes down and cooling cannot wait, the request goes straight into the service flow.",
    icon: Clock,
  },
  {
    title: "Install & Replacement",
    description: "Replacement quotes, new installs, upgrades, and repair-versus-replace guidance.",
    icon: Snowflake,
  },
  {
    title: "Residential & Commercial",
    description: "Service for homes, businesses, rental properties, and local buildings that need real HVAC support.",
    icon: Building2,
  },
];

const workflowCards = [
  {
    title: "New Request",
    description: "Customer issue, phone, urgency, and notes land in one place.",
    icon: ClipboardList,
  },
  {
    title: "Estimate",
    description: "Diagnostics, replacement notes, photos, and recommended next steps.",
    icon: FileText,
  },
  {
    title: "Schedule",
    description: "Service window, assigned tech, arrival notes, and customer follow-up.",
    icon: Clock,
  },
  {
    title: "Payment",
    description: "Payment due, payment sent, paid, and proof attached to the job.",
    icon: CreditCard,
  },
];

const activeSignals = [
  {
    customer: "Maria R.",
    issue: "AC Not Cooling",
    status: "Needs follow-up",
    note: "House is 82 degrees. Outside unit running, warm air inside.",
  },
  {
    customer: "Lakeview Office",
    issue: "Commercial HVAC",
    status: "Estimate needed",
    note: "Front office cooling uneven. Wants service window this week.",
  },
  {
    customer: "Treasure Island Home",
    issue: "Drain Line / Water Leak",
    status: "Schedule service",
    note: "Water near air handler. Customer can send photos before visit.",
  },
];

export default function FloridaCoolingLandingPage() {
  const [selectedIssue, setSelectedIssue] = useState(issueCards[0].title);
  const [requestSent, setRequestSent] = useState(false);

  const selectedCard = useMemo(
    () => issueCards.find((card) => card.title === selectedIssue) ?? issueCards[0],
    [selectedIssue]
  );

  function handleIssueClick(issue: string) {
    setSelectedIssue(issue);
    setRequestSent(false);

    const requestSection = document.getElementById("request");
    if (requestSection) {
      requestSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#06111d] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-[-18rem] top-[-18rem] h-[44rem] w-[44rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-[-20rem] top-[12rem] h-[46rem] w-[46rem] rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-[-26rem] left-[20%] h-[44rem] w-[44rem] rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <main className="relative">
        {/* HERO */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-10 pt-8 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:pb-16 md:pt-12">
          <div className="flex min-h-[620px] flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/25 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-200">
              <Snowflake className="h-4 w-4" />
              Florida Cooling · Okeechobee HVAC
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.055em] md:text-7xl lg:text-8xl">
              AC help without the runaround.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-2xl">
              Florida Cooling is led by <span className="font-bold text-white">Uriel Manzone</span>, owner and license holder, helping Okeechobee homes and businesses get clear HVAC service from request to completion.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={FLORIDA_COOLING_TEL}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-sky-300 px-6 py-4 text-base font-black text-slate-950 shadow-[0_0_40px_rgba(125,211,252,0.28)] transition hover:bg-white"
              >
                <Phone className="h-5 w-5" />
                Call {FLORIDA_COOLING_PHONE_DISPLAY}
              </a>

              <a
                href={FLORIDA_COOLING_SMS}
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-6 py-4 text-base font-black text-white backdrop-blur transition hover:bg-white/14"
              >
                <MessageSquare className="h-5 w-5" />
                Text Florida Cooling
              </a>

              <a
                href="#request"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-sky-300/30 bg-sky-300/10 px-6 py-4 text-base font-black text-sky-100 transition hover:bg-sky-300/16"
              >
                Request Service
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 grid gap-3 text-sm font-bold text-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              {["Uriel First", "Licensed HVAC", "24 Hour Service", "Residential + Commercial"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/7 px-4 py-3 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="relative w-full overflow-hidden rounded-[2.25rem] border border-white/12 bg-slate-950/72 p-4 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(125,211,252,0.24),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.16),transparent_42%)]" />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#071827]">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-300/16 via-transparent to-black/40" />

                <div className="relative p-6 md:p-8">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Live service flow</p>
                      <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] md:text-5xl">Cooling request opened</h2>
                    </div>

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-sky-300 text-slate-950 shadow-[0_0_40px_rgba(125,211,252,0.3)]">
                      <ThermometerSnowflake className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-3xl border border-white/10 bg-black/24 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Selected issue</p>
                          <h3 className="mt-2 text-2xl font-black">{selectedCard.title}</h3>
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">{selectedCard.description}</p>
                        </div>

                        <div className="rounded-full border border-sky-300/25 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
                          {selectedCard.urgency}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {["Request", "Board", "Next Action"].map((item, index) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/7 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Step {index + 1}</p>
                          <p className="mt-2 text-lg font-black">{item}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-3xl border border-sky-300/20 bg-sky-300/10 p-5">
                      <p className="text-sm font-bold leading-relaxed text-sky-50">
                        The page is the front door. The Florida Cooling board underneath keeps the request, estimate, schedule, payment, proof, and follow-up together.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ISSUE SELECTION */}
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Start with the problem</p>
              <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.045em] md:text-6xl">
                What is going on with your AC?
              </h2>
            </div>

            <p className="max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
              Tap the closest issue. That choice carries into the request so Florida Cooling knows what kind of job is coming in.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {issueCards.map((card) => {
              const active = selectedIssue === card.title;

              return (
                <button
                  key={card.title}
                  onClick={() => handleIssueClick(card.title)}
                  className={[
                    "group rounded-[1.65rem] border p-5 text-left transition",
                    active
                      ? "border-sky-300/55 bg-sky-300/15 shadow-[0_0_38px_rgba(125,211,252,0.16)]"
                      : "border-white/10 bg-white/6 hover:border-sky-300/35 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className={active ? "text-sky-200" : "text-slate-400 group-hover:text-sky-200"}>
                      <Snowflake className="h-6 w-6" />
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-300">
                      {card.urgency}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black tracking-[-0.03em]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{card.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* REQUEST */}
        <section id="request" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-10 md:px-8 md:py-14">
          <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/72 p-4 shadow-2xl md:grid-cols-[0.85fr_1.15fr] md:p-6 lg:p-8">
            <div className="rounded-[1.65rem] border border-sky-300/18 bg-[radial-gradient(circle_at_20%_20%,rgba(125,211,252,0.2),transparent_34%),rgba(14,23,38,0.72)] p-6 md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Request Florida Cooling</p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] md:text-5xl">
                Tell Uriel's team what the system is doing.
              </h2>

              <p className="mt-4 text-lg leading-relaxed text-slate-300">
                Your request starts with the issue, then becomes a real HomePlanet workflow: estimate, schedule, notes, payment, proof, and review.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Issue captured before the call",
                  "Request lands in the Florida Cooling board",
                  "Active workspace keeps the job moving",
                  "Proof and follow-up stay attached",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-200" />
                    <p className="font-bold text-slate-100">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.65rem] border border-white/10 bg-[#071827] p-5 md:p-6">
              {requestSent ? (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[1.4rem] border border-sky-300/25 bg-sky-300/10 p-8 text-center">
                  <CheckCircle2 className="h-16 w-16 text-sky-200" />
                  <h3 className="mt-5 text-4xl font-black tracking-[-0.04em]">Request received.</h3>
                  <p className="mt-3 max-w-xl text-lg leading-relaxed text-slate-200">
                    Florida Cooling can now review the issue and follow up with the next step.
                  </p>

                  <button
                    onClick={() => setRequestSent(false)}
                    className="mt-7 rounded-2xl border border-white/15 bg-white/8 px-6 py-4 font-black text-white transition hover:bg-white/14"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">Selected issue</p>
                    <p className="mt-2 text-2xl font-black">{selectedIssue}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        HVAC Issue
                      </label>
                      <select
                        value={selectedIssue}
                        onChange={(event) => setSelectedIssue(event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-300/55"
                      >
                        {issueCards.map((card) => (
                          <option key={card.title}>{card.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Your Name
                      </label>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-300/55"
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-300/55"
                        placeholder="Phone number"
                        autoComplete="tel"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Area / Address
                      </label>
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-300/55"
                        placeholder="Okeechobee / address"
                        autoComplete="street-address"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Urgency
                      </label>
                      <select className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-300/55">
                        <option>No Cooling / Urgent</option>
                        <option>Needs Service Soon</option>
                        <option>Estimate / Replacement</option>
                        <option>Routine Maintenance</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        What is the system doing?
                      </label>
                      <textarea
                        rows={5}
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-300/55"
                        placeholder="Warm air, leaking by air handler, thermostat blank, outside unit humming, system not turning on, etc."
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setRequestSent(true)}
                    className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-300 px-6 py-4 text-lg font-black text-slate-950 shadow-[0_0_35px_rgba(125,211,252,0.24)] transition hover:bg-white"
                  >
                    Send AC Request
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* PROOF / TEAM */}
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Florida Cooling team</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] md:text-6xl">
                Uriel first. Licensed direction. Real HVAC follow-through.
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
                Florida Cooling should be framed around Uriel Manzone as the owner and license holder. Victor Pineda can have his own service workspace too, but this company page stays Florida Cooling first.
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-sky-300/20 bg-sky-300/10 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">Owner / License Holder</p>
                  <h3 className="mt-3 text-3xl font-black">Uriel Manzone</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    Company lead for Florida Cooling service, estimates, quality, and customer direction.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Service Team</p>
                  <h3 className="mt-3 text-3xl font-black">Victor Pineda</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    Field service support and customer-facing HVAC work as part of the Florida Cooling team.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <div key={service.title} className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-300/12 text-sky-200">
                        <Icon className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-black tracking-[-0.03em]">{service.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{service.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOARD PREVIEW */}
        <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Under the live page</p>
            <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.045em] md:text-6xl">
              The Florida Cooling board keeps the job moving.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">
              This is the HomePlanet part: the public page captures the request, then the workflow board handles the real work underneath.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {workflowCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div key={card.title} className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-300/12 text-sky-200">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-2xl font-black tracking-[-0.03em]">{card.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{card.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-950/72 p-4 md:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Active signals</p>
                  <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">Incoming HVAC work</h3>
                </div>

                <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-sky-100">
                  Board Preview
                </div>
              </div>

              <div className="space-y-3">
                {activeSignals.map((signal) => (
                  <div key={`${signal.customer}-${signal.issue}`} className="rounded-[1.35rem] border border-white/10 bg-[#071827] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-xl font-black">{signal.customer}</h4>
                        <p className="mt-1 text-sm font-bold text-sky-100">{signal.issue}</p>
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/7 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-300">
                        {signal.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{signal.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-sky-300/20 bg-sky-300/10 p-5">
                <div className="flex items-start gap-4">
                  <Star className="mt-1 h-6 w-6 shrink-0 text-sky-200" />
                  <div>
                    <h4 className="text-xl font-black">Active workspace drawer comes next.</h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">
                      Estimate, schedule, payment, notes, proof, and review all belong inside the open request drawer, not scattered across texts and memory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="border-t border-white/10 bg-slate-950/80">
          <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-18">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-200">Need cooling help?</p>
                <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-6xl">
                  Start with Florida Cooling.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                  Call, text, or send the request so Uriel's team can see the issue and move it into the right next step.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <a
                  href={FLORIDA_COOLING_TEL}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-sky-300 px-6 py-4 font-black text-slate-950 transition hover:bg-white"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>

                <a
                  href={FLORIDA_COOLING_SMS}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-6 py-4 font-black text-white transition hover:bg-white/14"
                >
                  <Shield className="h-5 w-5" />
                  Text Florida Cooling
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
