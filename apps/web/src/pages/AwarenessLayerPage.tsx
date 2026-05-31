import { useNavigate } from "react-router-dom";

export default function AwarenessLayerPage() {
  const navigate = useNavigate();

  const items = [
    "🚗 Parking Awareness",
    "🍔 Restaurant Awareness",
    "📢 Community Awareness",
    "👷 Workforce Awareness",
    "📦 Inventory Awareness",
    "🛡 Safety Awareness",
    "🚌 Mobility Awareness",
    "🏢 Facility Awareness",
    "🎉 Event Awareness",
    "🔮 Predictive Awareness",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-6">

        <button
          onClick={() => navigate("/planet/atlas")}
          className="mb-6 text-left text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to Atlas
        </button>

        <div className="flex-1 rounded-3xl border border-white/10 bg-zinc-950 p-8">

          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-blue-400">
            Ecosystem Intelligence
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Awareness Layer
          </h1>

          <p className="mt-4 max-w-4xl text-lg text-zinc-400">
            Traditional infrastructure reacts.
            Awareness infrastructure notices.
            The ecosystem becomes capable of seeing,
            understanding, and responding before
            problems become disruptions.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/40 p-6"
              >
                <div className="text-lg font-medium text-white">
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-blue-500/20 bg-blue-500/10 p-6">
            <p className="text-xl leading-9 text-blue-100">
              Awareness is not one feature.
              <br />
              It is a layer that sits across the entire ecosystem.
              <br />
              Parking. Restaurants. Community. Safety.
              Workforce. Mobility. Events.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}