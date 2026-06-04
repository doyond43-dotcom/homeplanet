import { ArrowRight, CheckCircle2, Flame, Radio, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const operations = [
  ["Home Services", "Crews • Proof • Payments • Scheduling"],
  ["Food Trucks", "Orders • Prep • Pickup • Checkout"],
  ["Appointments", "Bookings • Check-in • Service • Paid"],
  ["Tours", "Bookings • Arrivals • Memories • Payments"],
  ["Retail", "Orders • Production • Pickup • Updates"],
  ["Community", "Requests • Matching • Updates • Help"],
];

const liveFeed = [
  ["REQUEST CREATED", "Customer requested service"],
  ["WORK VERIFIED", "Crew checked in on-site"],
  ["PROOF ATTACHED", "Photos connected to the work"],
  ["PAYMENT CONNECTED", "Invoice linked to completed work"],
  ["TIMELINE PRESERVED", "Truth chain complete"],
];

const surfaces = [
  ["Owner", "Runs the operation and sees the complete timeline."],
  ["Staff", "Monitors activity and coordinates workflow."],
  ["Crew", "Performs field work and captures proof."],
  ["Customer", "Requests service and follows progress."],
];

export default function PlanetHomePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <header className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_90px_rgba(16,185,129,0.10)] lg:grid-cols-[1fr_.85fr] lg:p-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              <Sparkles size={14} />
              HomePlanet Live Systems
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl">
              Run your real-world operation live.
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-white/60">
              Real work. Real proof. Real timelines.

              Every request, update, photo, payment, and completion stays connected to the work that created it.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/planet/live/live-system-demo")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-6 py-5 text-sm font-black text-neutral-950 shadow-xl shadow-emerald-500/20"
              >
                Build Live System
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => navigate("/planet/live/live-system-demo")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-sm font-black text-white/80"
              >
                View Live Demo
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/10 bg-cyan-300/[0.04] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
                Live Operation
              </div>
              <Radio size={18} className="text-emerald-300" />
            </div>

            <div className="grid gap-3">
              {liveFeed.map(([label, text]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-black/35 p-4"
                >
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    {label}
                  </div>
                  <div className="mt-2 text-sm font-bold text-white/75">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
          <div className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
            See How Live Systems Work
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {operations.map(([title, detail]) => {
              const typeMap: Record<string, string> = {
                "Home Services": "home-services",
                "Food Trucks": "food-hospitality",
                Appointments: "appointments",
                Tours: "tours-experiences",
                Retail: "retail-selling",
                Community: "community-help",
              };

              return (
                <button
                  key={title}
                  onClick={() =>
                    title === "Home Services"
                      ? navigate("/planet/live-pages/home-services")
                      : undefined
                  }
                  className={`rounded-3xl p-5 text-left transition ${
                    title === "Home Services"
                      ? "border border-emerald-400/50 bg-emerald-500/[0.08] shadow-[0_0_40px_rgba(74,222,128,0.18)] hover:border-emerald-300"
                      : "border border-white/10 bg-black/30 hover:border-emerald-300/35 hover:bg-emerald-300/[0.06]"
                  }`}
                >
                  {title === "Home Services" && (
                    <>
                      <div className="mb-3 inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
                        LIVE NOW
                      </div>

                      <img src="/images/home-services-operational-hero.png" alt="Home Services" className="mb-4 h-40 w-full rounded-2xl object-cover object-center" />
                    </>
                  )}
                  {title === "Food Trucks" && (
                    <img src="/images/food-truck-operational-hero.png" alt="Food Trucks" className="mb-4 h-40 w-full rounded-2xl object-cover object-center" />
                  )}
                  {title === "Appointments" && (
                    <img src="/images/appointments-operational-hero.png" alt="Appointments" className="mb-4 h-40 w-full rounded-2xl object-cover object-center" />
                  )}
                  {title === "Tours" && (
                    <img src="/images/tours-operational-hero.png" alt="Tours" className="mb-4 h-40 w-full rounded-2xl object-cover object-center" />
                  )}
                  {title === "Retail" && (
                    <img src="/images/retail-operational-hero.png" alt="Retail" className="mb-4 h-40 w-full rounded-2xl object-cover object-center" />
                  )}
                  {title === "Community" && (
                    <img src="/images/community-operational-hero.png" alt="Community" className="mb-4 h-40 w-full rounded-2xl object-cover object-center" />
                  )}

                  <div className="text-xl font-black">{title}</div>

                  <div className="mt-3 text-sm font-bold leading-6 text-white/50">
                    {detail}
                  </div>

                  {title === "Home Services" && (
                    <div className="mt-3 text-xs font-bold leading-5 text-white/40">
                      Perfect for pest control, pressure washing, cleaning,
                      landscaping and field service businesses.
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_.8fr]">
          <div className="rounded-[2rem] border border-emerald-300/15 bg-emerald-500/[0.08] p-6">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              <Flame size={14} />
              Live System Preview
            </div>

            <div className="grid gap-3">
              {["Request Created", "Work Verified", "Proof Attached", "Payment Connected"].map(
                (stage, index) => (
                  <div
                    key={stage}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                          Truth Chain Step {index + 1}
                        </div>
                        <div className="mt-1 text-lg font-black">{stage}</div>
                      </div>
                      <CheckCircle2 className="text-emerald-300" size={20} />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-500/15 bg-cyan-500/[0.05] p-6">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              Connected Surfaces
            </div>

            <div className="mt-4 grid gap-3">
              {surfaces.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-lg font-black">{title}</div>
                  <div className="mt-2 text-sm font-bold leading-6 text-white/50">
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-cyan-500/15 bg-cyan-500/[0.05] p-6 text-center">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
            How it works
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Choose operation", "HomePlanet prepares system", "Run live"].map(
              (item, index) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div className="text-sm font-black text-emerald-300">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-lg font-black">{item}</div>
                </div>
              )
            )}
          </div>
        </section>
      </section>
    </main>
  );
}











