import { useNavigate } from "react-router-dom";

export default function HomeServicesActivationPage() {
  const navigate = useNavigate();

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

        <div className="mt-10 grid gap-4 md:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            Pressure Washing
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            Pest Control
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            Landscaping
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            Cleaning Services
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            Pool Service
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            Mobile Service Businesses
          </div>

        </div>

        <button
          onClick={() => navigate("/planet/creator/building")}
          className="mt-10 rounded-2xl bg-green-400 px-8 py-4 text-lg font-black text-black transition hover:bg-green-300"
        >
          Activate Home Services System
        </button>

      </section>
    </main>
  );
}
