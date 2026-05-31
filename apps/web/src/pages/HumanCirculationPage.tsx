import { useNavigate } from "react-router-dom";

export default function HumanCirculationPage() {
  const navigate = useNavigate();

  const items = [
    "👨 Resident",
    "☕ Commons Coffee",
    "🛒 GreenBasket",
    "🍗 WingIt",
    "📢 Community Pulse",
    "💼 Opportunity",
    "🎓 Learning",
    "🤝 Participation",
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

          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-cyan-400">
            Ecosystem Philosophy
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Human Circulation
          </h1>

          <p className="mt-4 max-w-4xl text-lg text-zinc-400">
            Healthy ecosystems do not simply move vehicles.
            They move people, opportunity, relationships,
            learning, work, and participation.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/40 p-5"
              >
                <div className="text-base font-medium text-white">
                  {item}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-6">
            <p className="text-xl leading-9 text-cyan-100">
              Roads move vehicles.
              <br />
              Healthy ecosystems move people.
              <br />
              Human circulation is the flow of people,
              relationships, opportunity, work, learning,
              and participation through the ecosystem.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}