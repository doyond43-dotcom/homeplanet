import React from "react";
import { Link } from "react-router-dom";

export default function SmithPropertyCareJobDetail() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-4xl mx-auto px-5 py-8">
        <Link
          to="/planet/smith-property-care/command-center"
          className="text-yellow-400 text-sm"
        >
          ← Back to Command Center
        </Link>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-yellow-400">
            Job Detail
          </p>

          <h1 className="mt-3 text-4xl font-black">
            💧 Johnson Drainage Project
          </h1>

          <p className="mt-3 text-white/70">
            🚧 Active • 📍 Okeechobee, FL
          </p>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">What&apos;s Going On?</h2>
          <p className="mt-3 text-white/75">
            My backyard floods every time it rains. Water pools near the patio
            and starts moving toward the house.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl">👷</div>
            <h3 className="mt-3 font-black">Smith</h3>
            <p className="text-white/60 text-sm">Owner / Operations</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl">📋</div>
            <h3 className="mt-3 font-black">Daniel</h3>
            <p className="text-white/60 text-sm">Sales / Customer Communication</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl">🔧</div>
            <h3 className="mt-3 font-black">Brock</h3>
            <p className="text-white/60 text-sm">Field Support</p>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Timeline</h2>

          <div className="mt-5 space-y-4">
            {[
              ["Daniel", "Customer submitted request."],
              ["Daniel", "Called customer. Wants the water moved away from the patio."],
              ["Smith", "Site visit completed. Drainage issue confirmed."],
              ["Brock", "Available to help with materials and prep."],
              ["Daniel", "Estimate approved. Job moved to active."],
            ].map(([name, note]) => (
              <div key={note} className="rounded-2xl bg-black/30 border border-white/10 p-4">
                <p className="font-black">{name}</p>
                <p className="mt-1 text-white/70">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Photos</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/50">
              📷 Before
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/50">
              🚧 During
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-center text-white/50">
              ✅ After
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-5">
          <button className="rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black">
            📞 Call
          </button>
          <button className="rounded-2xl bg-white/10 px-4 py-3 font-bold">
            📍 Maps
          </button>
          <button className="rounded-2xl bg-white/10 px-4 py-3 font-bold">
            📷 Photo
          </button>
          <button className="rounded-2xl bg-white/10 px-4 py-3 font-bold">
            📝 Note
          </button>
          <button className="rounded-2xl bg-white/10 px-4 py-3 font-bold">
            ➡ Status
          </button>
        </section>
      </div>
    </main>
  );
}