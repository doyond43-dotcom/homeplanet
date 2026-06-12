import React from "react";
export default function SmithPropertyCareLandingPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <section className="px-5 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
          <div className="p-6 sm:p-10">
            <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
              Smith&apos;s Property Care
            </p>

            <h1 className="mt-4 text-4xl sm:text-6xl font-black leading-tight">
              Property Problems Solved.
            </h1>

            <p className="mt-5 text-lg text-white/75 max-w-2xl">
              Drainage, irrigation, electrical access, excavation, concrete,
              plumbing access, grading, and property improvements.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2">💧 Drainage</span>
              <span className="rounded-full bg-white/10 px-4 py-2">⚡ Electrical</span>
              <span className="rounded-full bg-white/10 px-4 py-2">🚧 Excavation</span>
              <span className="rounded-full bg-white/10 px-4 py-2">🏗️ Concrete</span>
              <span className="rounded-full bg-white/10 px-4 py-2">🚿 Plumbing Access</span>
              <span className="rounded-full bg-white/10 px-4 py-2">🌿 Property Care</span>
            </div>

            <a
              href="#request"
              className="mt-8 inline-flex rounded-2xl bg-yellow-400 px-6 py-4 font-bold text-black shadow-lg shadow-yellow-400/20"
            >
              Tell Us What&apos;s Going On
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-4 max-w-5xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["🚚", "Equipped To Show Up", "Truck, trailer, machines, and the tools to handle real property work."],
            ["📷", "Real Work. Real Proof.", "Before, during, and after photos turn every completed job into proof."],
            ["🤝", "Built Around The Job", "Every request becomes a job card so the team stays on the same page."],
          ].map(([icon, title, text]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-3xl">{icon}</div>
              <h2 className="mt-3 text-xl font-black">{title}</h2>
              <p className="mt-2 text-sm text-white/65">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="request" className="px-5 py-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
            Start Here
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Tell us what&apos;s going on.
          </h2>

          <p className="mt-3 text-white/70">
            No long form. No guessing the service category. Just describe the problem.
          </p>

          <div className="mt-5">
            <textarea
              className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none placeholder:text-white/35"
              placeholder={`My backyard floods every time it rains.

Need power run to a shed.

Water line broke under the driveway.

Need a concrete pad poured.

Looking for help grading my property.`}
            />

            <input
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none placeholder:text-white/35"
              placeholder="Best phone number"
            />

            <button className="mt-4 w-full rounded-2xl bg-yellow-400 px-6 py-4 font-black text-black">
              Submit Request
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

