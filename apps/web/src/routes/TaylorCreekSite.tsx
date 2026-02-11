import * as React from "react";
import { Link } from "react-router-dom";

export default function TaylorCreekSite() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold">
              TC
            </div>
            <div>
              <div className="text-lg font-semibold leading-tight flex items-center gap-2">
                <span aria-hidden>🪐</span>
                <span>Taylor Creek Auto Repair</span>
                <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/50 px-2.5 py-1 text-[11px] text-slate-200">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-300/80" />
                  Planet: Auto Services
                </span>
              </div>
              <div className="text-xs text-slate-400 leading-tight">
                Okeechobee, Florida • HomePlanet Verified Node
              </div>
            </div>
          </div>

          {/* Gold tier / trust badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-400/10 px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-300" />
            <span className="text-xs font-medium text-amber-200">
              Gold Tier • Public Proof Enabled
            </span>
          </div>
        </div>
      </div>

      {/* Page container */}
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        {/* HERO */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 md:p-10 shadow">
          {/* Hero-only “steel” texture + subtle HomePlanet glow */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/45">
            {/* subtle blue system glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.9), rgba(56,189,248,0.0) 55%)",
              }}
            />
            {/* subtle red shop glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -bottom-32 h-[560px] w-[560px] rounded-full blur-3xl opacity-15"
              style={{
                background:
                  "radial-gradient(circle at 70% 70%, rgba(239,68,68,0.9), rgba(239,68,68,0.0) 60%)",
              }}
            />
            {/* brushed steel grain (hero only) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 10px)",
              }}
            />
            {/* slight vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)",
              }}
            />

            <div className="relative p-6 md:p-10">
              <div className="grid md:grid-cols-[1fr_360px] gap-10">
                {/* Left */}
                <div>
                  {/* Proof badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Receipt-ready", "Timestamped", "Verified intake", "Public lookup"].map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-[11px] text-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Honest repairs. Clear communication.{" "}
                    <span className="block mt-1 text-red-500">
                      Receipt-ready proof.
                    </span>
                  </h1>

                  <p className="mt-4 text-slate-300 max-w-2xl">
                    Submit a service request in under a minute. Add a photo if needed.
                    You’ll get a receipt ID and a clean, time-ordered intake record you can reference later.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      to="/c/taylor-creek"
                      className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 font-semibold hover:bg-red-500 transition shadow-sm"
                    >
                      Start a service request
                    </Link>

                    <a
                      href="tel:+10000000000"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 px-6 py-3 font-semibold hover:bg-slate-900 transition"
                    >
                      Call the shop
                    </a>

                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Taylor+Creek+Auto+Repair+Okeechobee+FL"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-950/40 px-6 py-3 font-semibold hover:bg-slate-900 transition"
                    >
                      Get directions
                    </a>
                  </div>

                  <div className="mt-5 text-xs text-slate-500">
                    Powered by HomePlanet • Presence-First Intake • Receipt + record at submission (not after).
                  </div>

                  {/* Presence-first note (kept subtle + “HomePlanet”) */}
                  <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 flex items-start gap-3">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-sky-300/80" />
                    <div>
                      <span className="font-semibold">Presence-First:</span>{" "}
                      your request is anchored at submission — before edits, confusion, or “we never got it.”
                    </div>
                  </div>
                </div>

                {/* Right */}
                <aside className="space-y-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
                    <div className="text-xs tracking-wider text-slate-400 font-semibold">
                      OPERATING HOURS
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Mon–Fri</span><span>8:00am – 5:00pm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span><span>By appointment</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span><span>Closed</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-800 pt-4">
                      <div className="text-xs tracking-wider text-slate-400 font-semibold">
                        NODE CONTACT
                      </div>
                      <div className="mt-2 text-sm text-slate-300 space-y-1">
                        <div>Phone: (000) 000-0000</div>
                        <div>Address: Okeechobee, FL</div>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        Safe placeholders — swap with real details anytime.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/45 p-5">
                    <div className="text-sm font-semibold text-slate-200">
                      Proof-ready workflow
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      Photos + notes become a single, time-ordered record.
                      Cleaner approvals. Fewer disputes. Easier follow-ups.
                    </p>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE CARDS (make these feel like “nodes”, not generic cards) */}
        <section className="grid md:grid-cols-3 gap-5">
          {/* red rail */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950/45 p-6 overflow-hidden">
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-[2px]"
              style={{ background: "linear-gradient(to bottom, rgba(239,68,68,0.0), rgba(239,68,68,0.8), rgba(239,68,68,0.0))" }}
            />
            <div className="text-sm font-semibold">Submit → Receipt → PDF</div>
            <p className="mt-2 text-sm text-slate-300">
              Every intake becomes a time-anchored proof trail the moment it lands.
            </p>
          </div>

          {/* blue rail */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950/45 p-6 overflow-hidden">
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-[2px]"
              style={{ background: "linear-gradient(to bottom, rgba(56,189,248,0.0), rgba(56,189,248,0.85), rgba(56,189,248,0.0))" }}
            />
            <div className="text-sm font-semibold">Public Lookup Enabled</div>
            <p className="mt-2 text-sm text-slate-300">
              Customers and managers can reference records instantly when needed.
            </p>
          </div>

          {/* amber rail */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950/45 p-6 overflow-hidden">
            <div
              aria-hidden
              className="absolute left-0 top-0 h-full w-[2px]"
              style={{ background: "linear-gradient(to bottom, rgba(251,191,36,0.0), rgba(251,191,36,0.85), rgba(251,191,36,0.0))" }}
            />
            <div className="text-sm font-semibold">Gold Tier Node</div>
            <p className="mt-2 text-sm text-slate-300">
              Enhanced verification for high-trust operations (visual layer for now).
            </p>
          </div>
        </section>

        {/* SERVICES */}
        <section className="grid md:grid-cols-3 gap-5">
          {[
            ["Diagnostics", "No guessing. Findings documented before work begins."],
            ["Brakes & Suspension", "Safety-critical systems handled with clear notes and verification."],
            ["Maintenance", "Oil, fluids, inspections, and longevity care."],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-950/45 p-6"
            >
              <div className="text-sm font-semibold">{title}</div>
              <p className="mt-2 text-sm text-slate-300">{body}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-900 pt-6">
          <div>© {new Date().getFullYear()} Taylor Creek Auto Repair</div>
          <div className="flex gap-4">
            <Link to="/c/taylor-creek" className="hover:text-slate-300">
              Service request
            </Link>
            <Link to="/press/taylor-creek" className="hover:text-slate-300">
              Press kit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

