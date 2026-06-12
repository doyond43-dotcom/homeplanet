import React from "react";
import { Link } from "react-router-dom";

const activeJobs = [
  {
    icon: "💧",
    title: "Johnson Drainage Project",
    status: "🚧 Active",
  },
  {
    icon: "⚡",
    title: "Miller Shed Power Run",
    status: "🟩 Scheduled",
  },
  {
    icon: "🏗️",
    title: "Thompson Concrete Pad",
    status: "🟨 Estimate Needed",
  },
];

export default function SmithPropertyCareCommandCenter() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-8">
          <p className="text-yellow-400 uppercase tracking-[0.25em] text-sm">
            Smith's Property Care
          </p>

          <h1 className="text-4xl font-black mt-3">
            Command Center
          </h1>

          <p className="text-white/60 mt-2">
            One place for jobs, estimates, communication, photos, and project updates.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 mb-6">
          <h2 className="text-2xl font-black">
            Good Morning, Smith ☀️
          </h2>

          <p className="text-white/60 mt-2">
            Here's what needs attention today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-blue-500/10 border border-blue-500/20 p-5">
            <div className="text-3xl">🟦</div>
            <div className="mt-3 text-3xl font-black">3</div>
            <div className="text-white/70">New Requests</div>
          </div>

          <div className="rounded-3xl bg-yellow-500/10 border border-yellow-500/20 p-5">
            <div className="text-3xl">🟨</div>
            <div className="mt-3 text-3xl font-black">2</div>
            <div className="text-white/70">Estimates Needed</div>
          </div>

          <div className="rounded-3xl bg-orange-500/10 border border-orange-500/20 p-5">
            <div className="text-3xl">🟧</div>
            <div className="mt-3 text-3xl font-black">1</div>
            <div className="text-white/70">Awaiting Response</div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 mb-8">
          <h2 className="text-2xl font-black mb-4">
            🚧 Active Jobs
          </h2>

          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Link
                key={job.title}
                to="/planet/smith-property-care/job"
                className="block rounded-2xl border border-white/10 bg-black/30 p-5 hover:bg-black/50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg">
                      {job.icon} {job.title}
                    </h3>

                    <p className="text-white/60 mt-1">
                      {job.status}
                    </p>
                  </div>

                  <div className="text-white/40">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3 text-white/75">
            <div>📷 Brock uploaded 8 photos</div>
            <div>📝 Daniel added estimate notes</div>
            <div>✅ Johnson approved estimate</div>
            <div>📞 Customer called about scheduling</div>
          </div>
        </div>
      </div>
    </main>
  );
}