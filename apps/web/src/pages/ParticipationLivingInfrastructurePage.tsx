import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Building2,
  Dumbbell,
  HeartHandshake,
  ShoppingBasket,
  Shirt,
  Truck,
  Users,
} from "lucide-react";

export default function ParticipationLivingInfrastructurePage() {
  const navigate = useNavigate();

  const livingLayers = [
    {
      eyebrow: "Living Close",
      title: "Workforce Towers",
      body: "Compact, hotel-style rooms for people working inside the ecosystem, with shared lounges, laundry access, food nearby, and less daily driving.",
      items: ["Compact rooms", "Shared lounges", "Close to work", "Lower commute stress"],
      accent: "border-cyan-400/20 bg-cyan-500/10 text-cyan-300",
      icon: Building2,
    },
    {
      eyebrow: "Daily Support",
      title: "Life Services",
      body: "Laundry drop-off, gym access, daycare connection, GreenBasket pickup, and WingIt meals all sit close enough to become part of daily rhythm.",
      items: ["Laundry drop-off", "Gym + wellness", "Daycare connection", "Meals nearby"],
      accent: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
      icon: HeartHandshake,
    },
    {
      eyebrow: "Movement",
      title: "Shuttle Timing",
      body: "Shuttles can be timed around shifts, school/daycare drop-off, pickup windows, and resident needs so movement feels coordinated instead of chaotic.",
      items: ["Shift timing", "Pickup windows", "Daycare routes", "On-demand alerts"],
      accent: "border-amber-400/20 bg-amber-500/10 text-amber-300",
      icon: Truck,
    },
  ];

  const dailyFlow = [
    ["6:45 AM", "Tower shuttle routes activate"],
    ["7:10 AM", "Daycare drop-off circulation begins"],
    ["12:00 PM", "WingIt lunch flow supports workers"],
    ["3:30 PM", "Laundry pickup window opens"],
    ["5:30 PM", "GreenBasket pickup + dinner routes open"],
  ];

  const pulses = [
    ["Tower A", "Morning shuttle active", Building2],
    ["Laundry", "Drop-off window open", Shirt],
    ["Gym", "Wellness access live", Dumbbell],
    ["GreenBasket", "Pickup ready", ShoppingBasket],
    ["WingIt", "Dinner flow building", Users],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute left-[8%] top-[10%] h-[320px] w-[320px] rounded-full bg-emerald-500 blur-[140px]" />
        <div className="absolute right-[10%] top-[22%] h-[300px] w-[300px] rounded-full bg-cyan-500 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[360px] w-[360px] rounded-full bg-amber-500 blur-[160px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="h-full w-full" viewBox="0 0 1600 1200" fill="none">
          <path
            d="M120 260 C 420 320, 640 420, 860 520"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
          <path
            d="M860 520 C 1080 430, 1280 340, 1480 220"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
          <path
            d="M860 520 C 1120 620, 1300 760, 1480 940"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="10 14"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          Back
        </button>

        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/88 backdrop-blur-sm">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative p-8 md:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_40%)]" />

              <div className="relative z-10">
                <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Participation Living Infrastructure
                </div>

                <h1 className="mt-8 max-w-3xl text-5xl font-black leading-none tracking-tight md:text-7xl">
                  Live closer. Circulate better.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                  Participation Living is the human layer of the ecosystem:
                  workforce housing, shuttles, laundry, daycare, food, wellness,
                  and daily support arranged around less friction and more
                  participation.
                </p>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      Mood
                    </div>
                    <div className="mt-3 text-xl font-bold text-emerald-300">
                      Human + Supported
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                      Role
                    </div>
                    <div className="mt-3 text-xl font-bold text-emerald-300">
                      Workforce Rhythm
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border-t border-white/10 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-amber-950/30 p-8 md:p-12 lg:border-l lg:border-t-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_40%)]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Daily Resident Flow
                    </div>
                    <h2 className="mt-3 text-3xl font-black">
                      The day gets easier.
                    </h2>
                  </div>

                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                    Active
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {dailyFlow.map(([time, label]) => (
                    <div
                      key={time}
                      className="rounded-3xl border border-white/10 bg-black/35 p-5 transition hover:-translate-y-0.5 hover:bg-black/45"
                    >
                      <div className="text-sm font-bold text-white">{time}</div>
                      <div className="mt-1 text-sm text-zinc-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {livingLayers.map((layer) => {
            const Icon = layer.icon;

            return (
              <div
                key={layer.title}
                className={`rounded-[2rem] border p-7 backdrop-blur-sm ${layer.accent}`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-xs uppercase tracking-[0.28em]">
                    {layer.eyebrow}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-white">
                  {layer.title}
                </h2>

                <p className="mt-5 text-sm leading-7 text-zinc-300">
                  {layer.body}
                </p>

                <div className="mt-7 space-y-3">
                  {layer.items.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/5 bg-black/35 px-4 py-3 text-sm text-zinc-200"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-zinc-950/88 p-8 backdrop-blur-sm md:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            The Human Difference
          </div>

          <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight text-white">
            This is not just employee housing. It is participation
            infrastructure.
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-zinc-400">
            A cook, cleaner, driver, daycare worker, maintenance tech, or store
            associate should not have to fight the whole outside world just to
            get to work, eat, wash clothes, handle childcare, and get home. The
            ecosystem reduces that friction by placing daily support close to
            the work itself.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-5">
          {pulses.map(([title, value, Icon]) => {
            const PulseIcon = Icon as typeof Activity;

            return (
              <div
                key={title as string}
                className="rounded-2xl border border-white/10 bg-zinc-950/88 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-emerald-400/30"
              >
                <div className="mb-4 rounded-2xl border border-white/10 bg-black/35 p-3 w-fit">
                  <PulseIcon className="h-4 w-4 text-emerald-300" />
                </div>

                <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  {title as string}
                </div>

                <div className="mt-3 text-base font-bold text-white">
                  {value as string}
                </div>
              </div>
            );
          })}
        </section>

        <section className="rounded-[2rem] border border-emerald-400/10 bg-emerald-400/5 p-8 md:p-10">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Why It Matters
          </div>

          <h2 className="mt-5 text-4xl font-black text-white">
            If the system does not move people, the people will never move.
          </h2>

          <p className="mt-6 max-w-5xl text-lg leading-9 text-zinc-300">
            Participation Living turns housing into a circulation system. People
            live closer, move easier, work with less stress, and participate
            more naturally because the ecosystem supports the rhythm of daily
            life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/planet/live-circulation-heartbeat"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-black transition hover:scale-[1.02]"
            >
              Open Circulation Heartbeat
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="/planet/ecosystem"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Back to Ecosystem
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}