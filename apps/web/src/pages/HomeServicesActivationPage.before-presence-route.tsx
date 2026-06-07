import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeServicesActivationPage() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-green-400">
          Home Services Activation
        </p>

        <h1 className="mt-4 text-5xl font-black leading-[0.95] md:text-7xl">
          Activate Your
          <br />
          Home Services System
        </h1>

        <p className="mt-6 max-w-3xl text-lg text-zinc-300">
          HomePlanet connects customer requests, crew dispatch, photos,
          payments, communication, and awareness into one live system.
        </p>

        <div className="mt-10 space-y-6">

          <div>
            <label className="text-sm font-bold text-zinc-300">
              Business Name
            </label>

            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Example: Kevin's Pressure Washing"
              className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-zinc-300">
              What kind of home service do you provide?
            </label>

            <input
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="Example: Pressure Washing"
              className="mt-2 h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none"
            />

            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Examples: Pressure Washing, Pest Control, Landscaping,
              Pool Service, Dryer Vent Cleaning, Window Cleaning,
              Soft Wash, Junk Removal, Mobile Repair, and more.
            </p>
          </div>

        </div>

        <div className="mt-10 rounded-3xl border border-green-400/20 bg-green-500/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-green-300">
            HomePlanet Recommendations
          </p>

          <p className="mt-4 text-zinc-300">
            Tell HomePlanet what you do and the system will recommend
            operational tools that fit your business.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="font-black text-white">
                Pressure Washing
              </p>

              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>Before & After Photos</li>
                <li>Crew Dispatch</li>
                <li>Payment Links</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="font-black text-white">
                Pest Control
              </p>

              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>Treatment Records</li>
                <li>Follow-Up Scheduling</li>
                <li>Service Reports</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="font-black text-white">
                Pool Service
              </p>

              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li>Service Logs</li>
                <li>Recurring Visits</li>
                <li>Chemical Readings</li>
              </ul>
            </div>

          </div>
        </div>

        <button
          onClick={() => navigate("/planet/home-services/building")}
          className="mt-10 rounded-2xl bg-green-400 px-8 py-4 text-lg font-black text-black transition hover:bg-green-300"
        >
          Activate Home Services System
        </button>

      </section>
    </main>
  );
}
