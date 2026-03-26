import React, { useEffect, useMemo, useState } from "react";

type ActivityType = "buy" | "reserve" | "watch" | "sold";

type ActivityItem = {
  id: number;
  name: string;
  city: string;
  state: string;
  action: string;
  model: string;
  time: string;
  type: ActivityType;
};

type ProductItem = {
  id: string;
  name: string;
  tag: string;
  price: string;
  stock: number;
  watching: number;
  soldToday: number;
  topSpeed: string;
  hull: string;
  motor: string;
  note: string;
  featured?: boolean;
  status: "LIVE" | "LOW STOCK" | "RESERVED" | "READY TO SHIP";
};

type ProofEvent = {
  id: number;
  label: string;
  detail: string;
  time: string;
};

const LIVE_POSTER_URL = "/images/boats/live-main.jpg";

/**
 * Recommended first video from the links you sent:
 * Terrys G2 Modified Flat Bottom Speed Run
 *
 * Swap this ID later if you want:
 * fcZ7w0MpH2o
 * -v0iJvVyQtk
 * BVPdBURMhP8
 * TduR6QJc7Y4
 * nXDnMvIDXGk
 */
const YOUTUBE_VIDEO_ID = "BVPdBURMhP8";
const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&modestbranding=1&rel=0`;

const baseActivity: ActivityItem[] = [
  {
    id: 1,
    name: "Amy",
    city: "Wilmington",
    state: "North Carolina",
    action: "just bought",
    model: "Marsh Runner 42",
    time: "8s ago",
    type: "buy",
  },
  {
    id: 2,
    name: "Justin",
    city: "Dallas",
    state: "Texas",
    action: "reserved",
    model: "River Cut 38",
    time: "19s ago",
    type: "reserve",
  },
  {
    id: 3,
    name: "Caleb",
    city: "Palm Bay",
    state: "Florida",
    action: "started watching",
    model: "Marsh Runner 42",
    time: "31s ago",
    type: "watch",
  },
  {
    id: 4,
    name: "Trina",
    city: "Savannah",
    state: "Georgia",
    action: "just bought",
    model: "Fast Tide 36",
    time: "1m ago",
    type: "buy",
  },
  {
    id: 5,
    name: "Mason",
    city: "Tulsa",
    state: "Oklahoma",
    action: "claimed the last slot for",
    model: "Bay Ghost 40",
    time: "2m ago",
    type: "sold",
  },
  {
    id: 6,
    name: "Eli",
    city: "Tampa",
    state: "Florida",
    action: "reserved",
    model: "Marsh Runner 42",
    time: "4m ago",
    type: "reserve",
  },
];

const incomingActivity: ActivityItem[] = [
  {
    id: 101,
    name: "Derek",
    city: "Lafayette",
    state: "Louisiana",
    action: "just bought",
    model: "Marsh Runner 42",
    time: "now",
    type: "buy",
  },
  {
    id: 102,
    name: "Heather",
    city: "Ocala",
    state: "Florida",
    action: "reserved",
    model: "Fast Tide 36",
    time: "now",
    type: "reserve",
  },
  {
    id: 103,
    name: "Brandon",
    city: "Mobile",
    state: "Alabama",
    action: "started watching",
    model: "River Cut 38",
    time: "now",
    type: "watch",
  },
  {
    id: 104,
    name: "Luke",
    city: "Jacksonville",
    state: "Florida",
    action: "just bought",
    model: "Bay Ghost 40",
    time: "now",
    type: "buy",
  },
];

const products: ProductItem[] = [
  {
    id: "MR-42",
    name: "Marsh Runner 42",
    tag: "Featured live build",
    price: "$1,495",
    stock: 2,
    watching: 34,
    soldToday: 5,
    topSpeed: "42+ mph",
    hull: "Custom marsh-cut aluminum hull",
    motor: "Brushless high-thrust setup",
    note: "Fast live seller. Tight stock. Builder can demo handling live before purchase.",
    featured: true,
    status: "LOW STOCK",
  },
  {
    id: "FT-36",
    name: "Fast Tide 36",
    tag: "Ready to ship",
    price: "$1,195",
    stock: 3,
    watching: 18,
    soldToday: 3,
    topSpeed: "36+ mph",
    hull: "Lightweight river-run layout",
    motor: "Balanced speed / runtime tuning",
    note: "Clean all-around package for speed and control.",
    status: "READY TO SHIP",
  },
  {
    id: "RC-38",
    name: "River Cut 38",
    tag: "Custom order slot open",
    price: "$1,325",
    stock: 1,
    watching: 22,
    soldToday: 2,
    topSpeed: "38+ mph",
    hull: "Shallow-water cut profile",
    motor: "High response brushless setup",
    note: "Popular with buyers who want live walkaround before locking it in.",
    status: "LOW STOCK",
  },
  {
    id: "BG-40",
    name: "Bay Ghost 40",
    tag: "Built for punch",
    price: "$1,575",
    stock: 0,
    watching: 12,
    soldToday: 4,
    topSpeed: "40+ mph",
    hull: "Aggressive race-ready frame",
    motor: "Torque-heavy tuned system",
    note: "This one usually goes reserved during the live.",
    status: "RESERVED",
  },
];

const proofEvents: ProofEvent[] = [
  {
    id: 1,
    label: "Current media",
    detail: "Front running shot confirmed by builder",
    time: "2:14 PM",
  },
  {
    id: 2,
    label: "Previous media",
    detail: "Wrong image posted first — corrected live",
    time: "2:12 PM",
  },
  {
    id: 3,
    label: "Correction event",
    detail: 'Builder note: "wrong pic, one moment"',
    time: "2:12 PM",
  },
  {
    id: 4,
    label: "Live proof state",
    detail: "Current image now pinned as active listing state",
    time: "2:14 PM",
  },
];

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function StatPill({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "live" | "warn";
}) {
  const toneClass =
    tone === "live"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      : tone === "warn"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : "border-white/10 bg-white/5 text-zinc-200";

  return (
    <div
      className={clsx(
        "rounded-2xl border px-3 py-2 backdrop-blur-sm",
        toneClass,
      )}
    >
      <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-[28px] border border-white/10 bg-[#151515] shadow-[0_20px_80px_rgba(0,0,0,0.28)]",
        className,
      )}
    >
      <div className="flex flex-col gap-3 border-b border-white/8 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-sm text-zinc-300">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div>{right}</div> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function LiveVideoPanel({
  watchingNow,
}: {
  watchingNow: number;
}) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const hasEmbed = !embedFailed && Boolean(YOUTUBE_VIDEO_ID.trim());
  const hasPoster = Boolean(LIVE_POSTER_URL.trim());

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1011]">
      <div className="aspect-[16/9] w-full">
        {hasEmbed ? (
          <>
            <iframe
              className="absolute inset-0 h-full w-full"
              src={YOUTUBE_EMBED_URL}
              title="Live RC boat demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onError={() => setEmbedFailed(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.05)_30%,rgba(0,0,0,0.4))]" />
          </>
        ) : hasPoster ? (
          <>
            <img
              src={LIVE_POSTER_URL}
              alt="Featured live RC boat demo"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.14)_35%,rgba(0,0,0,0.58))]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(135deg,#202226_0%,#121315_55%,#0c0d0e_100%)]" />
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.05)_35%,transparent_65%)]" />
          </>
        )}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-red-500/30 bg-red-500/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-200">
              Live
            </span>
            <span className="text-xs text-zinc-200">
              Marsh Runner 42 walkaround + throttle demo
            </span>
          </div>
          <div className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-xs text-zinc-200">
            {watchingNow} watching
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-[88px] flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/35 text-3xl text-white/90 backdrop-blur-sm">
            ▶
          </div>

          <div className="max-w-2xl">
            <div className="text-lg font-semibold text-white sm:text-2xl">
              {hasEmbed
                ? "Live boat demo in motion"
                : hasPoster
                  ? "Live boat walkaround"
                  : "Live boat demo panel"}
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-200 sm:text-[15px]">
              {hasEmbed
                ? "Embedded running clip loaded. This gives the page real motion now without needing local video setup first."
                : hasPoster
                  ? "Live poster loaded. This can later become a muted loop or true live stream without changing the board structure."
                  : "Builder is showing the actual hull, setup, trim, and performance live while buyers reserve and purchase directly from the same page."}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 grid gap-2 border-t border-white/8 bg-black/35 p-3 sm:grid-cols-3 sm:p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Live angle
            </div>
            <div className="mt-1 text-sm text-zinc-200">
              Front deck + prop clearance
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Builder note
            </div>
            <div className="mt-1 text-sm text-zinc-200">
              Running current tuned setup
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Sale state
            </div>
            <div className="mt-1 text-sm text-zinc-200">
              Buy now or reserve before live ends
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RcAirboatsLiveDemo() {
  const featured = useMemo(
    () => products.find((item) => item.featured) ?? products[0],
    [],
  );

  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(baseActivity);
  const [incomingIndex, setIncomingIndex] = useState(0);
  const [watchingNow, setWatchingNow] = useState(86);

  useEffect(() => {
    const activityTimer = window.setInterval(() => {
      setActivityFeed((prev) => {
        const nextItem = incomingActivity[incomingIndex % incomingActivity.length];
        const inserted: ActivityItem = {
          ...nextItem,
          id: Date.now(),
          time: "now",
        };
        return [inserted, ...prev].slice(0, 7);
      });

      setIncomingIndex((prev) => (prev + 1) % incomingActivity.length);
      setWatchingNow((prev) => {
        const shift = Math.random() > 0.5 ? 1 : -1;
        const next = prev + shift * (Math.random() > 0.65 ? 2 : 1);
        return Math.max(72, Math.min(98, next));
      });
    }, 3500);

    return () => window.clearInterval(activityTimer);
  }, [incomingIndex]);

  const soldToday = products.reduce((sum, item) => sum + item.soldToday, 0);
  const lowStockCount = products.filter((item) => item.stock <= 2).length;

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-4 rounded-[28px] border border-white/10 bg-[#121213] px-4 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Live Presence Commerce
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  HomePlanet
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                RC Live Selling Board
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-[15px]">
                Don’t list your product. Show it live. Sell it live. This board
                turns a real builder, a real boat, and real-time buyer activity
                into a live trust layer instead of another flat product page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatPill label="Status" value="Live now" tone="live" />
              <StatPill label="Watching now" value={String(watchingNow)} />
              <StatPill label="Sold today" value={String(soldToday)} />
              <StatPill
                label="Low stock"
                value={String(lowStockCount)}
                tone="warn"
              />
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1.55fr_0.95fr]">
          <SectionCard
            title="Live video"
            subtitle="The builder goes live, shows the boat in real time, and buyers act while they are seeing the real thing."
            right={
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
                <span className="text-xs font-medium text-emerald-200">
                  Streaming
                </span>
              </div>
            }
          >
            <div className="grid gap-4">
              <LiveVideoPanel watchingNow={watchingNow} />

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Why this feels different
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Not a catalog. Not a marketplace. A real seller showing a
                    real product live while buyer proof appears in the same
                    space.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    Hot item pressure
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Watching count, low stock, reserve actions, and sold events
                    create urgency without feeling fake or gimmicky.
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    HomePlanet angle
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Presence-first selling. The proof of what is current, what
                    changed, and who acted becomes part of the board itself.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Featured model"
            subtitle="The main live-selling card keeps the decision clear and fast."
            right={
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                Hot item
              </span>
            }
          >
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0f1011] p-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-white/10">
                  <img
                    src="/images/boats/featured-detail.jpg"
                    alt="Featured RC boat"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.1))]" />

                  <div className="absolute inset-0 flex h-full flex-col justify-between p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                          {featured.tag}
                        </div>
                        <div className="mt-2 text-xl font-semibold text-white">
                          {featured.name}
                        </div>
                      </div>
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200 backdrop-blur-sm">
                        {featured.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur-sm">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                          Top speed
                        </div>
                        <div className="mt-1 text-sm font-medium text-zinc-100">
                          {featured.topSpeed}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/35 p-3 backdrop-blur-sm">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                          Stock
                        </div>
                        <div className="mt-1 text-sm font-medium text-zinc-100">
                          {featured.stock} remaining
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#111214] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Live sale details
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      {featured.price}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {featured.note}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-right">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Watching
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">
                      {featured.watching}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Hull
                    </div>
                    <div className="mt-1 text-sm text-zinc-200">
                      {featured.hull}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Motor
                    </div>
                    <div className="mt-1 text-sm text-zinc-200">
                      {featured.motor}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Sold today
                    </div>
                    <div className="mt-1 text-sm text-zinc-200">
                      {featured.soldToday} this model family
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
                  >
                    Buy now — {featured.price}
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.08]"
                  >
                    Reserve this build slot
                  </button>
                </div>

                <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/8 px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-amber-100">
                      Low stock pressure: only{" "}
                      <span className="font-semibold">{featured.stock}</span>{" "}
                      available in this live cycle.
                    </div>
                    <div className="text-xs uppercase tracking-[0.18em] text-amber-200">
                      Reserve before live ends
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionCard
            title="Live activity"
            subtitle="The board shows real buyer movement, not just static inventory."
            right={
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Real-time feel
              </span>
            }
          >
            <div className="space-y-3">
              {activityFeed.map((item, index) => {
                const tone =
                  item.type === "buy"
                    ? "border-emerald-500/20 bg-emerald-500/8"
                    : item.type === "reserve"
                      ? "border-amber-500/20 bg-amber-500/8"
                      : item.type === "sold"
                        ? "border-rose-500/20 bg-rose-500/8"
                        : "border-white/10 bg-white/[0.03]";

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={clsx(
                      "flex flex-col gap-3 rounded-[22px] border p-4 sm:flex-row sm:items-center sm:justify-between",
                      tone,
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-sm text-zinc-100">
                        <span className="font-semibold text-white">
                          {item.name}
                        </span>{" "}
                        from <span className="text-zinc-300">{item.city}</span>,{" "}
                        <span className="text-zinc-300">{item.state}</span>{" "}
                        <span className="text-zinc-200">{item.action}</span>{" "}
                        <span className="font-semibold text-white">
                          {item.model}
                        </span>
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                        Live board activity
                      </div>
                    </div>

                    <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      {item.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Board signals"
            subtitle="Operational signals make the live page feel active, trusted, and decision-ready."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Watching now
                </div>
                <div className="mt-2 text-3xl font-semibold text-white">
                  {watchingNow}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Live watchers create visible pressure while the builder is on
                  camera showing the actual product.
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Sold today
                </div>
                <div className="mt-2 text-3xl font-semibold text-white">
                  {soldToday}
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  The board shows movement and momentum instead of making the
                  seller feel isolated.
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Reserve-ready
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  Hold the spot without losing the buyer
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Reserve becomes a bridge between interest and payment during a
                  live session.
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-[#111214] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Low stock signal
                </div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {lowStockCount} models need attention
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Stock state becomes part of the live story instead of hiding
                  behind a dead product page.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-4">
          <SectionCard
            title="Proof / media state"
            subtitle="HomePlanet should understand what the current correct media is, what came before it, and how the state changed."
            right={
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                Current vs previous
              </span>
            }
          >
            <div className="grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[24px] border border-white/10 bg-[#101113] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  Friction point validated
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Wrong image first. Corrected live.
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  In the real world, the engraver sent the wrong image first and
                  then corrected it. The system should not leave that as messy
                  ambiguity. It should clearly show what is current, what is
                  previous, and the timeline of correction.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      Current
                    </div>
                    <div className="mt-1 text-sm text-emerald-50">
                      Correct live image pinned
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                      Previous
                    </div>
                    <div className="mt-1 text-sm text-zinc-200">
                      Earlier mistaken upload preserved in timeline
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {proofEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col gap-3 rounded-[22px] border border-white/10 bg-[#111214] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        {event.label}
                      </div>
                      <div className="mt-1 text-sm text-zinc-100">
                        {event.detail}
                      </div>
                    </div>
                    <div className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                      {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mt-4">
          <SectionCard
            title="More live models"
            subtitle="Additional products stay operational and clean, not catalog-heavy."
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {products.map((item) => {
                const statusTone =
                  item.status === "LOW STOCK"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                    : item.status === "RESERVED"
                      ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                      : item.status === "LIVE"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-white/10 bg-white/5 text-zinc-300";

                const modelImage =
                  item.id === "FT-36"
                    ? "/images/boats/model-speed.jpg"
                    : item.id === "MR-42"
                      ? "/images/boats/model-wood.jpg"
                      : item.id === "RC-38"
                        ? "/images/boats/model-wood.jpg"
                        : "/images/boats/model-speed.jpg";

                return (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-white/10 bg-[#111214] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          {item.tag}
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-white">
                          {item.name}
                        </h3>
                      </div>
                      <span
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
                          statusTone,
                        )}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="relative mt-4 overflow-hidden rounded-[20px] border border-white/10">
                      <img
                        src={modelImage}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="relative bg-black/60 p-4">
                        <div className="text-2xl font-semibold text-white">
                          {item.price}
                        </div>
                        <div className="mt-2 text-sm text-zinc-300">
                          {item.note}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Stock
                        </div>
                        <div className="mt-1 text-sm text-zinc-100">
                          {item.stock}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Watching
                        </div>
                        <div className="mt-1 text-sm text-zinc-100">
                          {item.watching}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                        <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                          Sold
                        </div>
                        <div className="mt-1 text-sm text-zinc-100">
                          {item.soldToday}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.08]"
                      >
                        View live details
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/[0.05]"
                      >
                        Reserve / inquire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-[#121213] p-5 sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Not just ecommerce
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Live presence commerce
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              A real person sells a real product live while buyers watch,
              reserve, purchase, and create visible momentum.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#121213] p-5 sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Stronger trust layer
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Current state matters
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              The board should know what media is current, what changed, and
              when it changed so buyers are not left guessing.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#121213] p-5 sm:p-6">
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              Builder advantage
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Show the product. Close the sale.
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Instead of fighting dead product listings, the craftsman can go
              live, answer questions, and sell from one operational board.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}