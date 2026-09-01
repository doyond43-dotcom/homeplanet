import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { markMeatMarketBrowserInternal } from "../lib/meatMarketAnalytics";

type MeatMarketEvent = {
  id: string;
  page: string;
  event_type: string;
  session_id: string | null;
  seller_id: string | null;
  seller_slug: string | null;
  product_id: string | null;
  product_name: string | null;
  source: string | null;
  destination: string | null;
  referrer: string | null;
  payload: Record<string, unknown> | null;
  verified: boolean;
  created_at: string;
};

type BuyerWorkflow = {
  id?: string;
  status?: string;
  matched_seller_name?: string | null;
  matched_seller_slug?: string | null;
};

function timeAgo(value: string) {
  const date = new Date(value);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function dedupePassiveViews(events: MeatMarketEvent[]) {
  const sorted = [...events].sort(
    (a, b) =>
      new Date(a.created_at).getTime() -
      new Date(b.created_at).getTime()
  );

  const lastSeen = new Map<string, number>();

  return sorted.filter((event) => {
    if (
      event.event_type !== "market_view" &&
      event.event_type !== "seller_view"
    ) {
      return true;
    }

    const key = [
      event.session_id || "anonymous",
      event.event_type,
      event.seller_slug || "market",
    ].join("|");

    const timestamp = new Date(event.created_at).getTime();
    const previous = lastSeen.get(key) || 0;

    lastSeen.set(key, timestamp);

    return timestamp - previous >= 2000;
  });
}

function rankValues(
  events: MeatMarketEvent[],
  getValue: (event: MeatMarketEvent) => string | null,
  limit = 6
) {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const value = getValue(event)?.trim();

    if (!value) return;

    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function sellerLabel(slug: string) {
  if (slug === "farm-folks") return "Farm Folks LLC";
  if (slug === "lollis-beef") return "Lollis Beef";

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function eventLabel(event: MeatMarketEvent) {
  switch (event.event_type) {
    case "market_view":
      return "Viewed Live Meat Market";
    case "seller_view":
      return `Viewed ${sellerLabel(event.seller_slug || "seller")}`;
    case "product_order_click":
      return `Clicked ${event.product_name || "product"}`;
    case "seller_link_click":
      return `Opened ${sellerLabel(event.seller_slug || "seller")} website`;
    case "buyer_request":
      return "Buyer request received";
    case "seller_match":
      return "Buyer matched to seller";
    case "confirmed_sale":
      return "Confirmed sale";
    default:
      return event.event_type.replace(/_/g, " ");
  }
}

export default function OkeechobeeMeatMarketIntelligenceDashboard() {
  const [events, setEvents] = useState<MeatMarketEvent[]>([]);
  const [buyers, setBuyers] = useState<BuyerWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState("");

  async function loadIntelligence() {
    setLoading(true);

    const { data, error } = await supabase
      .from("okeechobee_meat_market_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Could not load Meat Market intelligence:", error);
      setEvents([]);
    } else {
      setEvents((data || []) as MeatMarketEvent[]);
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Admin session not available.");
      }

      const response = await fetch("/api/okeechobee-command-center", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json().catch(() => null);

      setBuyers(
        response.ok && Array.isArray(result?.meatMarketBuyers)
          ? result.meatMarketBuyers
          : []
      );
    } catch (error) {
      console.error("Could not load Meat Market buyer workflow:", error);
      setBuyers([]);
    }

    setLastRefresh(new Date().toLocaleTimeString());
    setLoading(false);
  }

  useEffect(() => {
    markMeatMarketBrowserInternal();

    void loadIntelligence();

    const channel = supabase
      .channel("okeechobee-meat-market-intelligence")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "okeechobee_meat_market_events",
        },
        (payload) => {
          setEvents((current) => [
            payload.new as MeatMarketEvent,
            ...current,
          ].slice(0, 1000));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const cleanEvents = useMemo(
    () => dedupePassiveViews(events),
    [events]
  );

  const marketViews = useMemo(
    () =>
      cleanEvents.filter((event) => event.event_type === "market_view")
        .length,
    [cleanEvents]
  );

  const sellerViews = useMemo(
    () =>
      cleanEvents.filter((event) => event.event_type === "seller_view")
        .length,
    [cleanEvents]
  );

  const productClicks = useMemo(
    () =>
      cleanEvents.filter(
        (event) => event.event_type === "product_order_click"
      ).length,
    [cleanEvents]
  );

  const sellerLinkClicks = useMemo(
    () =>
      cleanEvents.filter(
        (event) => event.event_type === "seller_link_click"
      ).length,
    [cleanEvents]
  );

  const uniqueShoppers = useMemo(
    () =>
      new Set(
        cleanEvents
          .map((event) => event.session_id)
          .filter(Boolean)
      ).size,
    [cleanEvents]
  );

  const buyerRequests = useMemo(
    () => buyers.length,
    [buyers]
  );

  const sellerMatches = useMemo(
    () =>
      buyers.filter((buyer) =>
        [
          "seller_found",
          "buyer_contacted",
          "complete",
        ].includes(String(buyer.workflow_status || "").toLowerCase())
      ).length,
    [buyers]
  );

  const confirmedSales = useMemo(
    () =>
      cleanEvents.filter(
        (event) =>
          event.event_type === "confirmed_sale" &&
          event.verified === true
      ).length,
    [cleanEvents]
  );

  const topSellers = useMemo(
    () =>
      rankValues(
        cleanEvents.filter(
          (event) => event.event_type === "seller_view"
        ),
        (event) =>
          event.seller_slug
            ? sellerLabel(event.seller_slug)
            : null
      ),
    [cleanEvents]
  );

  const topProducts = useMemo(
    () =>
      rankValues(
        cleanEvents.filter(
          (event) => event.event_type === "product_order_click"
        ),
        (event) => event.product_name
      ),
    [cleanEvents]
  );

  const topSources = useMemo(
    () =>
      rankValues(
        cleanEvents,
        (event) => event.source
      ),
    [cleanEvents]
  );

  const recentActivity = useMemo(
    () =>
      [...cleanEvents]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
        .slice(0, 18),
    [cleanEvents]
  );

  const conversionToSeller = marketViews
    ? Math.round((sellerViews / marketViews) * 100)
    : 0;

  const conversionToProduct = sellerViews
    ? Math.round((productClicks / sellerViews) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#07100a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              HomePlanet Intelligence
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Okeechobee Live Meat Market
            </h1>

            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/60 md:text-base">
              See how shoppers move through the market, which sellers
              they visit, which products they click, and where buyer
              demand turns into seller matches.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/planet/okeechobee/meat-market"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/80"
            >
              Live Market
            </Link>

            <Link
              to="/planet/okeechobee/meat-market/command"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/80"
            >
              Command Center
            </Link>

            <button
              type="button"
              onClick={() => void loadIntelligence()}
              className="rounded-xl bg-green-400 px-4 py-3 text-sm font-black text-black"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Market Views"
            value={marketViews}
            note="Deduped page visits"
          />
          <MetricCard
            label="Unique Shoppers"
            value={uniqueShoppers}
            note="Unique Meat Market sessions"
          />
          <MetricCard
            label="Seller Views"
            value={sellerViews}
            note={`${sellerViews} seller visits from ${uniqueShoppers} shopper${uniqueShoppers === 1 ? "" : "s"}`}
          />
          <MetricCard
            label="Product Order Clicks"
            value={productClicks}
            note={`${productClicks} product clicks from ${sellerViews} seller visits`}
          />
          <MetricCard
            label="Seller Site Clicks"
            value={sellerLinkClicks}
            note="External seller handoffs"
          />
          <MetricCard
            label="Buyer Requests"
            value={buyerRequests}
            note="Recorded buyer demand"
          />
          <MetricCard
            label="Seller Matches"
            value={sellerMatches}
            note="Requests connected to supply"
          />
          <MetricCard
            label="Confirmed Sales"
            value={confirmedSales}
            note="Verified outcomes only"
            verified
          />
        </section>

        <section className="mt-7 grid gap-4 lg:grid-cols-3">
          <RankPanel
            title="Top Sellers"
            subtitle="Seller storefront views"
            rows={topSellers}
            empty="No seller views yet."
          />

          <RankPanel
            title="Top Products"
            subtitle="Products shoppers clicked to order"
            rows={topProducts}
            empty="No product clicks yet."
          />

          <RankPanel
            title="Activity Sources"
            subtitle="Where tracked actions happened"
            rows={topSources}
            empty="No source data yet."
          />
        </section>

        <section className="mt-7 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
          <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-5 md:flex-row md:items-end md:justify-between md:px-7">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-green-400">
                Live Activity
              </div>
              <h2 className="mt-2 text-2xl font-black">
                Recent Shopper Activity
              </h2>
              <p className="mt-1 text-sm font-semibold text-white/50">
                Views are deduped. Product and seller-link clicks remain
                individual actions.
              </p>
            </div>

            <div className="text-xs font-bold text-white/40">
              {loading
                ? "Loading..."
                : lastRefresh
                  ? `Updated ${lastRefresh}`
                  : "Ready"}
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {recentActivity.map((event) => (
              <div
                key={event.id}
                className="grid gap-2 px-5 py-4 md:grid-cols-[150px_1fr_220px] md:items-center md:px-7"
              >
                <div className="text-xs font-black text-white/40">
                  {timeAgo(event.created_at)}
                </div>

                <div>
                  <div className="text-sm font-black text-white">
                    {eventLabel(event)}
                  </div>

                  <div className="mt-1 text-xs font-semibold text-white/45">
                    {event.session_id
                      ? `Session ${event.session_id.slice(0, 8)}`
                      : "No session"}
                    {event.source ? ` · ${event.source}` : ""}
                  </div>
                </div>

                <div className="truncate text-xs font-semibold text-white/45 md:text-right">
                  {event.destination || event.seller_slug || "HomePlanet"}
                </div>
              </div>
            ))}

            {!loading && recentActivity.length === 0 && (
              <div className="px-7 py-10 text-sm font-semibold text-white/50">
                No Meat Market activity has been recorded yet.
              </div>
            )}
          </div>
        </section>

        <section className="mt-7 rounded-3xl border border-green-400/20 bg-green-400/[0.06] p-5 md:p-7">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-green-400">
            Truth Rule
          </div>

          <p className="mt-3 max-w-4xl text-sm font-bold leading-6 text-white/70">
            A product click is interest, not a sale. A seller handoff is
            traffic, not revenue. Confirmed Sales stays separate until
            HomePlanet has proof that the transaction actually happened.
          </p>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  note,
  verified = false,
}: {
  label: string;
  value: number;
  note: string;
  verified?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-[0.13em] text-white/45">
          {label}
        </div>

        {verified && (
          <div className="rounded-full border border-green-400/20 bg-green-400/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-green-300">
            Verified
          </div>
        )}
      </div>

      <div className="mt-4 text-4xl font-black tracking-tight">
        {value}
      </div>

      <div className="mt-2 text-xs font-semibold text-white/45">
        {note}
      </div>
    </div>
  );
}

function RankPanel({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: Array<[string, number]>;
  empty: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <div className="text-xl font-black">{title}</div>
      <div className="mt-1 text-xs font-semibold text-white/45">
        {subtitle}
      </div>

      <div className="mt-5 space-y-3">
        {rows.map(([label, count], index) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="text-[10px] font-black text-green-400">
                #{index + 1}
              </div>
              <div className="truncate text-sm font-black">
                {label}
              </div>
            </div>

            <div className="text-xl font-black">{count}</div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-5 text-sm font-semibold text-white/40">
            {empty}
          </div>
        )}
      </div>
    </div>
  );
}
