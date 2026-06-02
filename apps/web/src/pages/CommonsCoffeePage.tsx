import { useNavigate } from "react-router-dom";

export default function CommonsCoffeePage() {
  const navigate = useNavigate();

  const items = [
    "Coffee & Conversation",
    "Community Gathering",
    "Remote Work",
    "Morning Circulation",
    "Evening Connections",
    "Reasons To Show Up",
  ];

  const modes = [
    {
      label: "Morning Circulation",
      route: "/planet/commons-coffee-morning",
    },
    {
      label: "Rainy Day Gathering",
      route: "/planet/commons-coffee-rainy-day",
    },
    {
      label: "Indoor Evening",
      route: "/planet/commons-coffee-visual",
    },
    {
      label: "Outdoor Evening",
      route: "/planet/commons-coffee-outdoor-evening",
    },
    {
      label: "Community Event Night",
      route: "/planet/commons-coffee-community-event",
    },
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
            Gathering Anchor
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Commons Coffee
          </h1>

          <p className="mt-4 max-w-4xl text-lg text-zinc-400">
            A gathering anchor where conversations begin, ideas form,
            relationships grow, and community naturally comes together.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-black/40 p-6"
              >
                <div className="text-lg font-medium text-white">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Operating Modes
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {modes.map((mode) => (
                <button
                  key={mode.label}
                  onClick={() => navigate(mode.route)}
                  className="rounded-2xl border border-white/10 bg-white px-5 py-4 text-left text-sm font-bold text-black transition hover:scale-[1.02]"
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
            <p className="text-xl leading-8 text-amber-100">
              Commons Coffee is more than coffee. It is a daily reason to show up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}