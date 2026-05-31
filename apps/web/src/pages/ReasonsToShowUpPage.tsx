import { useNavigate } from "react-router-dom";

export default function ReasonsToShowUpPage() {
  const navigate = useNavigate();

  const items = [
    "🍔 Food",
    "☕ Coffee",
    "🎵 Live Music",
    "🎤 Karaoke",
    "🧠 Trivia",
    "🏈 Game Day",
    "💼 Opportunity",
    "🎓 Learning",
    "🤝 Community",
    "❤️ Belonging",
    "🌱 Growth",
    "📍 Participation",
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
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-400">
            Experience Layer
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Reasons To Show Up
          </h1>

          <p className="mt-4 max-w-4xl text-lg text-zinc-400">
            The ecosystem is not a collection of buildings. It is a collection
            of reasons to participate.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/40 p-5"
              >
                <div className="text-base font-medium text-white">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <p className="text-xl leading-9 text-amber-100">
              People do not show up for buildings.
              <br />
              They show up because something is happening.
              <br />
              The stronger the reasons to show up, the stronger the ecosystem
              becomes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}