import { Phone, Wrench, Shield, Clock, Snowflake, Building2 } from "lucide-react";

const issueCards = [
  {
    title: "AC Not Cooling",
    description: "Warm air, system running but the house is still hot, or the AC just can't keep up.",
  },
  {
    title: "No Air / Weak Airflow",
    description: "Little to no airflow from vents, weak circulation, or rooms not cooling evenly.",
  },
  {
    title: "Water Leak / Drain Line",
    description: "Water around the air handler, drain line issues, or signs of overflow.",
  },
  {
    title: "System Won't Turn On",
    description: "No power, blank thermostat, outside unit not kicking on, or system completely down.",
  },
  {
    title: "Repair / Diagnostics",
    description: "Electrical issues, strange noises, frozen coil, repeated shutdowns, or performance problems.",
  },
  {
    title: "New Unit / Replacement",
    description: "Full replacement, upgrade quote, new install, or help deciding whether to repair or replace.",
  },
  {
    title: "Maintenance / Tune-Up",
    description: "Seasonal service, system checkup, or preventative maintenance before small issues get expensive.",
  },
  {
    title: "Not Sure What's Wrong?",
    description: "Tell Florida Cooling what the system is doing and the team will help guide the next step.",
  },
];

const serviceCards = [
  {
    title: "Diagnostics & Repairs",
    description: "Find the issue first. Fix the right problem instead of guessing.",
    icon: Wrench,
  },
  {
    title: "Emergency Service",
    description: "When the AC goes down and cooling can't wait, Florida Cooling can step in fast.",
    icon: Clock,
  },
  {
    title: "Installation & Replacement",
    description: "Residential and commercial system installs, replacements, and upgrade guidance.",
    icon: Snowflake,
  },
  {
    title: "Residential & Commercial",
    description: "Service for homes, businesses, and properties that need real HVAC support.",
    icon: Building2,
  },
];

export default function FloridaCoolingLandingPage() {
  return (
    <div className="min-h-screen bg-[#07111a] text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="mb-4 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-sky-300">
            OKEECHOBEE HVAC SERVICE
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.95] md:text-7xl">
            AC Service, Repair & Installation
            <span className="block text-sky-400">Without The Runaround.</span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-zinc-300 md:text-xl">
            Florida Cooling serves Okeechobee with residential and commercial HVAC service,
            diagnostics, repairs, installations, and emergency response when cooling can't wait.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="tel:+18635326671"
              className="rounded-2xl bg-sky-500 px-6 py-4 font-bold text-black transition hover:bg-sky-400"
            >
              Call Now
            </a>

            <a
              href="sms:+18635326671"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-bold transition hover:bg-white/10"
            >
              Text Florida Cooling
            </a>

            <a
              href="#request"
              className="rounded-2xl border border-sky-500/40 bg-sky-500/10 px-6 py-4 font-bold text-sky-300 transition hover:bg-sky-500/20"
            >
              Request Estimate
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Licensed & Insured</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">24 Hour Service</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Residential & Commercial</div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Free Estimates</div>
          </div>
        </div>
      </section>

      {/* COVER IMAGE */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950">
          <img
            src="/images/florida-cooling-field-proof-clean.png"
            alt="Florida Cooling service team"
            className="h-[300px] w-full object-cover md:h-[420px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="mb-3 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-sky-300">
              REAL HVAC SERVICE
            </div>

            <h2 className="max-w-3xl text-3xl font-black leading-tight md:text-5xl">
              The AC crew Okeechobee can call when it counts.
            </h2>
          </div>
        </div>
      </section>

      {/* ISSUE CARDS */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-black md:text-5xl">What do you need help with?</h2>
          <p className="mt-3 max-w-3xl text-lg text-zinc-400">
            Choose the closest issue. It helps Florida Cooling understand what's going on before the first call.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {issueCards.map((card) => (
            <button
              key={card.title}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-6 text-left transition hover:border-sky-500/35 hover:bg-zinc-900"
            >
              <h3 className="text-2xl font-black">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* REQUEST BLOCK */}
      <section id="request" className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="grid gap-8 rounded-[32px] border border-white/10 bg-zinc-950 p-6 md:grid-cols-[1fr_1.1fr] md:p-10">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-sky-300">
              TELL FLORIDA COOLING FIRST
            </div>

            <h2 className="text-4xl font-black md:text-5xl">Send the details before the visit.</h2>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-300">
              Pick the HVAC issue, tell Florida Cooling what the system is doing, and send your contact info
              so the team can follow up with the next step without making you repeat everything twice.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Pick the HVAC issue",
                "Tell us what the system is doing",
                "Request goes into the Florida Cooling board",
                "Uriel or Victor follow up with the next step",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#07111a] p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-black text-black">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-base font-semibold text-zinc-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#07111a] p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  HVAC Issue
                </label>
                <select className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-white outline-none">
                  <option>Choose an issue</option>
                  {issueCards.map((card) => (
                    <option key={card.title}>{card.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  Area / Address
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-white outline-none"
                  placeholder="Okeechobee / address"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  Urgency
                </label>
                <select className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-white outline-none">
                  <option>How urgent is it?</option>
                  <option>No Cooling / Urgent</option>
                  <option>Needs Service Soon</option>
                  <option>Estimate / Replacement</option>
                  <option>Routine Maintenance</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  Your Name
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-white outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  Phone Number
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-white outline-none"
                  placeholder="Phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                  What is the system doing?
                </label>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-4 text-white outline-none"
                  placeholder="Warm air, leaking by air handler, thermostat blank, outside unit humming, system not turning on, etc."
                />
              </div>
            </div>

            <button className="mt-5 w-full rounded-2xl bg-sky-500 px-6 py-4 text-lg font-black text-black transition hover:bg-sky-400">
              Send AC Request
            </button>
          </div>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-black md:text-5xl">Why Okeechobee Calls Florida Cooling</h2>
          <p className="mt-3 max-w-3xl text-lg text-zinc-400">
            Real HVAC support for homes, businesses, and customers who need the next step handled clearly.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-zinc-950 p-6"
              >
                <Icon className="mb-4 h-9 w-9 text-sky-400" />
                <h3 className="text-2xl font-black">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPANY SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-12">
        <div className="rounded-[32px] border border-white/10 bg-zinc-950 p-6 md:p-10">
          <div className="mb-8">
            <div className="mb-3 inline-flex rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-sky-300">
              FLORIDA COOLING TEAM
            </div>

            <h2 className="text-4xl font-black md:text-5xl">Built through licensed HVAC experience.</h2>

            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-300">
              Florida Cooling is led by Uriel Manzone and serves Okeechobee with residential and commercial HVAC
              service, diagnostics, repairs, installations, and real follow-through when cooling matters.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#07111a] p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Owner / License Holder</p>
              <h3 className="mt-3 text-3xl font-black">Uriel Manzone</h3>
              <p className="mt-3 text-zinc-300">
                Licensed HVAC lead and owner behind Florida Cooling's service, estimates, and company direction.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#07111a] p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">Service Team</p>
              <h3 className="mt-3 text-3xl font-black">Victor Pineda</h3>
              <p className="mt-3 text-zinc-300">
                Field service support, customer-facing work, and hands-on HVAC help as part of the Florida Cooling team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="border-t border-white/10 bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-black md:text-6xl">Need AC help today?</h2>
            <p className="mt-4 max-w-2xl text-lg text-zinc-300">
              Call Florida Cooling, send a text, or request service and let the team take it from there.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="tel:+18635326671"
              className="inline-flex items-center gap-3 rounded-2xl bg-sky-500 px-6 py-4 font-black text-black transition hover:bg-sky-400"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>

            <a
              href="sms:+18635326671"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 font-black transition hover:bg-white/10"
            >
              <Shield className="h-5 w-5" />
              Text Florida Cooling
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}










