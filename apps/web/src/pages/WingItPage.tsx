import { useNavigate } from "react-router-dom";

export default function WingItPage() {
  const navigate = useNavigate();

  const modes = [
    {
      label: "Lunch Rush",
      route: "/planet/wingit-lunch-rush",
    },
    {
      label: "Live Music Night",
      route: "/planet/wingit-live-music-night",
    },
    {
      label: "Trivia Night",
      route: "/planet/wingit-trivia-night",
    },
    {
      label: "Karaoke Night",
      route: "/planet/wingit-karaoke-night",
    },
    {
      label: "Game Day Watch Party",
      route: "/planet/wingit-game-day-watch-party",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-12">

        <button
          onClick={() => navigate("/planet/atlas")}
          className="mb-8 text-sm text-zinc-400 hover:text-white"
        >
          ← Back to Atlas
        </button>

        <h1 className="text-4xl font-bold">
          WingIt
        </h1>

        <p className="mt-3 text-zinc-400">
          Food Hall Anchor
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">
            Reasons To Show Up
          </h2>

          <p className="mt-4 text-zinc-300 leading-relaxed">
            WingIt is more than a restaurant.
            It is a gathering place that changes throughout the day and week.
            Lunch. Sports. Music. Trivia. Karaoke.
            The building stays the same.
            The reasons to show up keep changing.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">
            Operating Modes
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {modes.map((mode) => (
              <button
                key={mode.label}
                onClick={() => navigate(mode.route)}
                className="rounded-2xl border border-white/10 bg-white px-5 py-4 text-left font-semibold text-black transition hover:scale-[1.02]"
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-zinc-300">
            Great ecosystems do not create destinations.
            They create reasons to return.
          </p>
        </div>

      </div>
    </div>
  );
}