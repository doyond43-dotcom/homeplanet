import { useNavigate } from "react-router-dom";

export default function CommunityPulsePage() {
  const navigate = useNavigate();

  const items = [
    "Neighbor Helping Neighbor",
    "Student Opportunities",
    "Volunteer Needs",
    "Community Events",
    "Local Support",
    "Live Participation",
  ];

  const modes = [
    { label: "Rainy Evening Awareness", route: "/planet/community-pulse-rainy-evening" },
    { label: "Outdoor Community Kiosk", route: "/planet/community-pulse-outdoor-kiosk" },
    { label: "Commons Coffee Display", route: "/planet/community-pulse-commons-coffee" },
    { label: "Parking Awareness Display", route: "/planet/community-pulse-parking" },
    { label: "Mobile View", route: "/planet/community-pulse-mobile" },
    { label: "Impact Stories", route: "/planet/community-pulse-impact-stories" },
    { label: "GreenBasket Commons Board", route: "/planet/community-pulse-greenbasket" },
    { label: "Awareness Board Concept", route: "/planet/community-pulse-awareness-board" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-6">
        <button
          onClick={() => navigate("/planet/atlas")}
          className="mb-6 text-left text-sm text-zinc-400 transition hover:text-white"
        >
          ? Back to Atlas
        </button>

        <div className="flex-1 rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-emerald-400">
            Human Participation Layer
          </div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Community Pulse
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-zinc-400">
            A living awareness layer connecting people, opportunities,
            needs, and participation across the ecosystem.
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
              Community Pulse Locations
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

          <div className="mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-lg leading-8 text-emerald-100">
              A healthy ecosystem helps people become aware of one another's
              needs, opportunities, and participation in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
