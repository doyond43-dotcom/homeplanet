import { useNavigate } from "react-router-dom";

export default function LiveCirculationHeartbeatPage() {
  const navigate = useNavigate();

  const pressure = [
    {
      title: "WingIt Dinner Pulse",
      status: "Building",
      detail: "Food hall arrival and pickup pressure increasing.",
      tone: "border-orange-500/20 bg-orange-500/10 text-orange-300",
    },
    {
      title: "GreenBasket Pickup Rhythm",
      status: "Balanced",
      detail: "Short-stay pickup and supply movement are flowing normally.",
      tone: "border-lime-500/20 bg-lime-500/10 text-lime-300",
    },
    {
      title: "Daycare Transition",
      status: "Active",
      detail: "Parent lane, shuttle timing, and child handoff are visible.",
      tone: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
    },
    {
      title: "Parking Awareness",
      status: "Predicting",
      detail: "Best likely arrival zones are adjusting before congestion forms.",
      tone: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    },
  ];

  const lanes = [
    "People",
    "Goods",
    "Pickup",
    "Parking",
    "Shuttles",
    "Daycare",
    "Warehouse",
    "Events",
  ];

  const rhythm = [
    {
      label: "Arrival Load",
      value: "Building",
      tone: "text-orange-300",
    },
    {
      label: "Movement Health",
      value: "Stable",
      tone: "text-emerald-300",
    },
    {
      label: "Parking Forecast",
      value: "Adjusting",
      tone: "text-sky-300",
    },
    {
      label: "Hub Awareness",
      value: "Live",
      tone: "text-lime-300",
    },
  ];

  return (
    <div className="min-h-screen bg-black p-5 text-white md:p-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
      >
        Back
      </button>

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[40px] border border-emerald-400/20 bg-[#050505]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_36%)]" />

          <div className="absolute inset-0 opacity-25">
            <svg className="h-full w-full" viewBox="0 0 1400 700" fill="none">
              <path
                d="M80 110 C 310 210, 520 270, 710 350"
                stroke="rgba(56,189,248,0.55)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <path
                d="M710 350 C 930 270, 1110 180, 1320 110"
                stroke="rgba(132,204,22,0.5)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <path
                d="M710 350 C 900 450, 1110 560, 1320 620"
                stroke="rgba(249,115,22,0.5)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <path
                d="M710 350 C 470 430, 260 540, 80 620"
                stroke="rgba(217,70,239,0.48)"
                strokeWidth="5"
                strokeDasharray="12 12"
              />
              <circle
                cx="710"
                cy="350"
                r="115"
                stroke="rgba(16,185,129,0.25)"
                strokeWidth="4"
              />
              <circle
                cx="710"
                cy="350"
                r="190"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="relative z-10 grid gap-10 p-8 md:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-emerald-300">
                Live Circulation Heartbeat
              </div>

              <h1 className="mt-10 text-5xl font-black leading-none tracking-tight md:text-7xl">
                The environment is alive and aware.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
                The Live Circulation Board watches movement pressure, arrival
                load, parking awareness, shuttle timing, daycare transitions,
                pickup rhythm, and food hall activity as one living operational
                system.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="/planet/circulation"
                  className="rounded-2xl bg-white px-5 py-4 font-black text-black"
                >
                  Open Circulation
                </a>

                <a
                  href="/planet/hub"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white"
                >
                  Open Hub
                </a>
              </div>
            </div>

            <div className="rounded-[36px] border border-zinc-800 bg-black/45 p-6 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Current Rhythm
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {rhythm.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                      {item.label}
                    </div>

                    <div className={`mt-3 text-3xl font-black ${item.tone}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-400/15 bg-emerald-400/5 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">
                  Ecosystem State
                </div>

                <p className="mt-3 leading-7 text-zinc-300">
                  Movement is stable, but dinner arrival pressure and parking
                  prediction are beginning to adjust in real time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pressure.map((item) => (
            <div
              key={item.title}
              className={`rounded-[32px] border p-6 ${item.tone}`}
            >
              <div className="text-xs uppercase tracking-[0.28em] opacity-70">
                Live Pressure
              </div>

              <h2 className="mt-4 text-3xl font-black text-white">
                {item.title}
              </h2>

              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold">
                {item.status}
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-200">
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[40px] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_45%)]" />

            <div className="relative z-10">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Ecosystem Heartbeat Map
              </div>

              <h2 className="mt-4 text-5xl font-black leading-tight">
                The Hub watches the rhythm, not just the numbers.
              </h2>

              <div className="relative mt-10 h-[640px] overflow-hidden rounded-[32px] border border-white/10 bg-black">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1200 640" fill="none">
                  <path d="M120 130 C 360 230, 500 280, 610 330" stroke="rgba(56,189,248,0.55)" strokeWidth="5" strokeDasharray="12 12" />
                  <path d="M610 330 C 820 230, 990 160, 1120 110" stroke="rgba(132,204,22,0.55)" strokeWidth="5" strokeDasharray="12 12" />
                  <path d="M610 330 C 820 430, 1010 520, 1120 580" stroke="rgba(249,115,22,0.55)" strokeWidth="5" strokeDasharray="12 12" />
                  <path d="M610 330 C 420 430, 280 520, 110 580" stroke="rgba(217,70,239,0.50)" strokeWidth="5" strokeDasharray="12 12" />

                  <circle cx="610" cy="330" r="100" stroke="rgba(16,185,129,0.25)" strokeWidth="4" />
                  <circle cx="610" cy="330" r="175" stroke="rgba(255,255,255,0.07)" strokeWidth="2" />
                </svg>

                <HeartbeatNode
                  title="The Hub"
                  label="Nervous system"
                  className="left-[40%] top-[38%] border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_80px_rgba(16,185,129,0.18)]"
                />

                <HeartbeatNode
                  title="Parking"
                  label="Sensory awareness"
                  className="left-[5%] top-[10%] border-sky-500/30 bg-sky-500/10 text-sky-300"
                />

                <HeartbeatNode
                  title="GreenBasket"
                  label="Supply rhythm"
                  className="right-[5%] top-[10%] border-lime-500/30 bg-lime-500/10 text-lime-300"
                />

                <HeartbeatNode
                  title="WingIt"
                  label="Dinner pulse"
                  className="right-[6%] bottom-[8%] border-orange-500/30 bg-orange-500/10 text-orange-300"
                />

                <HeartbeatNode
                  title="Daycare"
                  label="Family transition"
                  className="left-[5%] bottom-[8%] border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[40px] border border-zinc-800 bg-zinc-950 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Circulation Lanes
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                Movement becomes readable.
              </h2>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {lanes.map((lane) => (
                  <div
                    key={lane}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300"
                  >
                    {lane}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[40px] border border-emerald-400/15 bg-emerald-400/5 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-emerald-300">
                Operational Meaning
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                The system does not wait for chaos.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-300">
                Arrival pressure, parking prediction, pickup lanes, shuttle
                movement, food demand, supply flow, and daycare transitions all
                become visible before they become problems.
              </p>
            </section>

            <section className="rounded-[40px] border border-sky-400/15 bg-sky-400/5 p-8">
              <div className="text-xs uppercase tracking-[0.35em] text-sky-300">
                Final Thought
              </div>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                The environment starts moving with people.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-300">
                This is not static software. This is live operational
                intelligence watching the ecosystem breathe.
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeartbeatNode({
  title,
  label,
  className,
}: {
  title: string;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute w-[220px] rounded-[28px] border p-5 backdrop-blur-md ${className}`}
    >
      <div className="text-2xl font-black leading-tight">{title}</div>

      <div className="mt-2 text-sm leading-relaxed opacity-80">
        {label}
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.25em] opacity-60">
        Live
      </div>
    </div>
  );
}