import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  Flame,
  MapPin,
  Mic2,
  Send,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react";

type PickStatus = "LIVE" | "JUST TRIED" | "GOING NEXT" | "FEATURED";

type FoodSpot = {
  id: string;
  name: string;
  location: string;
  dish: string;
  reason: string;
  status: PickStatus;
  price: string;
  distance: string;
  vibe: string;
  note: string;
};

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

const todaysPicks: FoodSpot[] = [
  {
    id: "tonys-bbq",
    name: "Tony’s BBQ",
    location: "Okeechobee",
    dish: "Brisket Plate",
    reason: "Best brisket texture on today’s run.",
    status: "LIVE",
    price: "$$",
    distance: "6 min away",
    vibe: "Smoky, heavy, legit",
    note: "This is the live stop right now. Brisket, mac, and beans are the move.",
  },
  {
    id: "marias-tacos",
    name: "Maria’s Tacos",
    location: "Taylor Creek",
    dish: "Birria Tacos",
    reason: "Crisp outside, juicy inside, easy crowd winner.",
    status: "GOING NEXT",
    price: "$",
    distance: "11 min away",
    vibe: "Fast, loud, worth the stop",
    note: "Next stop on the route. Best shot if you want something faster and cheaper.",
  },
  {
    id: "gators-pizza",
    name: "Gator’s Pizza",
    location: "Okeechobee",
    dish: "Hot Honey Pepperoni",
    reason: "Best late-day pizza play if tonight is the move.",
    status: "JUST TRIED",
    price: "$$",
    distance: "14 min away",
    vibe: "Greasy in the right way",
    note: "Solid if you want a crowd-pleaser tonight. Best eaten hot, not later.",
  },
  {
    id: "riverfront-grill",
    name: "Riverfront Grill",
    location: "PSL",
    dish: "Blackened Mahi Bowl",
    reason: "Cleaner option without feeling boring.",
    status: "FEATURED",
    price: "$$$",
    distance: "28 min away",
    vibe: "Fresh, cleaner, sit-down energy",
    note: "Featured spot today. Best fit for people wanting something lighter but still legit.",
  },
];

const timelineSeed: TimelineEvent[] = [
  {
    id: "t1",
    time: "9:42 AM",
    title: "Arrived at Tony’s BBQ",
    detail: "Parking lot already had a line. Good sign.",
  },
  {
    id: "t2",
    time: "9:51 AM",
    title: "Ordered brisket + mac",
    detail: "Kept it simple. This is the plate that matters here.",
  },
  {
    id: "t3",
    time: "10:12 AM",
    title: "First bite",
    detail: "Brisket passed the test. Soft, smoky, not dry.",
  },
  {
    id: "t4",
    time: "10:25 AM",
    title: "Locked next stop",
    detail: "Maria’s Tacos is up next at 12:30 PM.",
  },
];

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function getStatusStyles(status: PickStatus) {
  switch (status) {
    case "LIVE":
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
    case "GOING NEXT":
      return "border-sky-400/25 bg-sky-400/10 text-sky-200";
    case "JUST TRIED":
      return "border-amber-400/25 bg-amber-400/10 text-amber-200";
    case "FEATURED":
      return "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200";
    default:
      return "border-white/10 bg-white/[0.04] text-slate-300";
  }
}

export default function BigDaveEatsLive() {
  const [selectedSpotId, setSelectedSpotId] = useState<string>(todaysPicks[0].id);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimelineIndex((current) => (current + 1) % timelineSeed.length);
      setPulse(true);

      window.setTimeout(() => {
        setPulse(false);
      }, 1100);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const selectedSpot =
    todaysPicks.find((spot) => spot.id === selectedSpotId) ?? todaysPicks[0];

  const liveSpot = useMemo(
    () => todaysPicks.find((spot) => spot.status === "LIVE") ?? todaysPicks[0],
    []
  );

  const nextSpot = useMemo(
    () =>
      todaysPicks.find((spot) => spot.status === "GOING NEXT") ?? todaysPicks[1],
    []
  );

  const featuredSpot = useMemo(
    () =>
      todaysPicks.find((spot) => spot.status === "FEATURED") ??
      todaysPicks[todaysPicks.length - 1],
    []
  );

  const activeTimelineItem = timelineSeed[timelineIndex];

  return (
    <div className="min-h-screen bg-[#07111a] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,23,34,0.96),rgba(8,15,23,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                Big Dave Eats • live creator system
              </div>

              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Real food. Real spots. Live picks.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  This is not a dead profile. It is a live food creator board.
                  People can see what Dave is trying now, where he is going next,
                  and which spots are worth the trip.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Live now
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {liveSpot.name} • {liveSpot.dish}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Going next
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {nextSpot.name} • {nextSpot.dish}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Today’s mode
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    Food run active • route updating live
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#07111a] transition hover:opacity-95"
                >
                  See today’s picks
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Follow / get updates
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[26px] border border-emerald-400/20 bg-emerald-400/[0.08] p-4">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/80">
                      Now live
                    </div>
                    <div className="mt-1 text-xl font-semibold text-white">
                      {liveSpot.name}
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    Live
                  </span>
                </div>

                <div className="space-y-2 text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-emerald-200" />
                    <span>At: {liveSpot.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed size={15} className="text-emerald-200" />
                    <span>Trying: {liveSpot.dish}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame size={15} className="text-emerald-200" />
                    <span>{liveSpot.reason}</span>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "rounded-[26px] border p-4 transition",
                  pulse
                    ? "border-emerald-400/30 bg-emerald-400/[0.08] shadow-[0_0_0_1px_rgba(16,185,129,0.06),0_0_28px_rgba(16,185,129,0.08)]"
                    : "border-white/10 bg-[#091722]/90"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Live response
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {activeTimelineItem.title}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {activeTimelineItem.time}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {activeTimelineItem.detail}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                    Today’s picks
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Where people should go right now
                  </h2>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Spots
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    {todaysPicks.length}
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {todaysPicks.map((spot) => {
                  const isSelected = selectedSpot.id === spot.id;

                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setSelectedSpotId(spot.id)}
                      className={cn(
                        "w-full rounded-[24px] border p-4 text-left transition",
                        isSelected
                          ? "border-white/20 bg-white/[0.06]"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      )}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-base font-semibold text-white">
                              {spot.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {spot.location}
                            </div>
                            <span
                              className={cn(
                                "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                                getStatusStyles(spot.status)
                              )}
                            >
                              {spot.status}
                            </span>
                          </div>

                          <div className="text-sm font-medium text-white">
                            {spot.dish}
                          </div>

                          <div className="text-sm leading-6 text-slate-300">
                            {spot.reason}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <div className="rounded-2xl border border-white/10 bg-[#08131d] px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              Price
                            </div>
                            <div className="mt-1 text-sm font-semibold text-white">
                              {spot.price}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-[#08131d] px-3 py-2">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              Distance
                            </div>
                            <div className="mt-1 text-sm font-semibold text-white">
                              {spot.distance}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
              <div className="mb-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Live timeline
                </div>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Presence, not just content
                </h2>
              </div>

              <div className="space-y-3">
                {timelineSeed.map((item, index) => {
                  const isActive = index === timelineIndex;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "rounded-[22px] border p-4 transition",
                        isActive
                          ? "border-emerald-400/25 bg-emerald-400/[0.06]"
                          : "border-white/10 bg-white/[0.02]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {item.title}
                          </div>
                          <p className="mt-1 text-sm leading-6 text-slate-300">
                            {item.detail}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock3 size={14} />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Spot detail
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                    getStatusStyles(selectedSpot.status)
                  )}
                >
                  {selectedSpot.status}
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-white">
                {selectedSpot.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {selectedSpot.note}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#08131d] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Dish
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selectedSpot.dish}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#08131d] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Vibe
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selectedSpot.vibe}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#08131d] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Price
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selectedSpot.price}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#08131d] p-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                    Distance
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    {selectedSpot.distance}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-white/10 bg-[#08131d] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Why it made the board
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {selectedSpot.reason}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#07111a] transition hover:opacity-95"
                >
                  View spot
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Go there
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-sky-400/15 bg-sky-400/[0.05] p-4 sm:p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-300">
                    What’s next
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {nextSpot.name}
                  </h2>
                </div>
                <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                  Next stop
                </span>
              </div>

              <div className="space-y-2 text-sm leading-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock3 size={15} className="text-sky-200" />
                  <span>Expected at 12:30 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store size={15} className="text-sky-200" />
                  <span>{nextSpot.dish}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-sky-200" />
                  <span>{nextSpot.location}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
              >
                Follow today’s route
              </button>
            </div>

            <div className="rounded-[28px] border border-fuchsia-400/15 bg-fuchsia-400/[0.05] p-4 sm:p-5">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-300">
                    Featured spot
                  </div>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {featuredSpot.name}
                  </h2>
                </div>
                <span className="rounded-full border border-fuchsia-400/25 bg-fuchsia-400/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200">
                  Featured
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-300">
                {featuredSpot.reason}
              </p>

              <button
                type="button"
                className="mt-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.09]"
              >
                Check them out
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Creator actions
                </div>
                <div className="mt-3 grid gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    <span>Get your spot featured</span>
                    <Star size={16} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    <span>Collab with Dave</span>
                    <Mic2 size={16} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                  >
                    <span>Book a visit</span>
                    <Send size={16} />
                  </button>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0a1520] p-4 sm:p-5">
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
                  Quick profile
                </div>
                <div className="mt-3 space-y-2">
                  <div className="text-lg font-semibold text-white">
                    Big Dave Eats
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    Local food runs. No BS reviews. Just what is good, what is
                    live, and where to go next.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    <MapPin size={14} />
                    Okeechobee • PSL area
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}