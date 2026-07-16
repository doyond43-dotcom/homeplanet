import React from "react";
import { Link } from "react-router-dom";

export default function SlapABugIntelligencePage() {
  const signals = [
    ["Urgent infestation language", "Prioritize follow-up when a customer says infestation, everywhere, or urgent."],
    ["Photo uploaded", "Brad may be able to understand the problem before the visit."],
    ["Repeat pest issue", "Possible recurring service opportunity."],
    ["Fast response needed", "Customer may be hot and ready to schedule now."],
    ["Neighborhood pattern", "Multiple reports in the same area can point to local demand."],
    ["Review opportunity", "Completed job should trigger a review request."],
    ["Follow-up needed", "Some pest jobs need a check-in after the first visit."],
    ["Recurring monthly fit", "Roaches, ants, mosquitoes, and rentals may fit routine service."]
  ];

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/planet/slap-a-bug/board" className="text-sm font-bold text-red-300">
              ← Back to Board
            </Link>
            <h1 className="mt-3 text-4xl font-black">Slap A Bug Intelligence</h1>
            <p className="mt-2 text-white/60">
              Signals that help Brad know what needs attention, follow-up, or a next action.
            </p>
          </div>
          <Link to="/planet/slap-a-bug/request" className="rounded-2xl bg-red-500 px-5 py-3 text-center font-black">
            New Request
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map(([title, body]) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-4 h-2 w-16 rounded-full bg-red-500" />
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-red-500/25 bg-red-500/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-200">
            Example Live Suggestions
          </p>
          <div className="mt-5 grid gap-3">
            {[
              "Infestation language detected — prioritize follow-up.",
              "Customer uploaded photos — Brad may be able to estimate before visiting.",
              "Roach issue reported — likely needs quick response.",
              "Completed service — ask for a review.",
              "Customer may fit recurring pest control plan."
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm font-bold text-white/78">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
