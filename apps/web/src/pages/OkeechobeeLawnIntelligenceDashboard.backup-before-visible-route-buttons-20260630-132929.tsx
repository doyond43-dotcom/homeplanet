import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const LAUNCH_CUTOFF_ISO = "2026-06-29T13:10:00-04:00";

type LawnEvent = {
  id: string;
  page: string;
  event_type: string;
  session_id: string | null;
  source: string | null;
  panel: string | null;
  action: string | null;
  option_group: string | null;
  option_value: string | null;
  zone: string | null;
  payload: Record<string, string> | null;
  created_at: string;
};

type RequestSummary = {
  id: string;
  created_at: string;
  session_id: string | null;
  name: string;
  phone: string;
  zone: string;
  notes: string;
  who: string;
  help: string;
  condition: string;
  contribution: string;
  photo_count: string;
  photo_names: string;
  photo_urls: string;
  route_status: string;
  route_name: string;
  route_zone: string;
  route_day: string;
  route_time: string;
  route_updated_at: string;
};

function countWhere(events: LawnEvent[], test: (event: LawnEvent) => boolean) {
  return events.filter(test).length;
}

function topValues(events: LawnEvent[], key: keyof LawnEvent, limit = 5) {
  const counts = new Map<string, number>();

  events.forEach((event) => {
    const value = event[key];

    if (!value || typeof value !== "string") return;

    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function routeStatusRank(status: string) {
  const ranks: Record<string, number> = {
    New: 1,
    Contacted: 2,
    Scheduled: 3,
    "On Route": 4,
    Done: 5,
  };

  return ranks[status] || 0;
}

function requestDedupeKey(request: RequestSummary) {
  return [
    request.name.trim().toLowerCase(),
    request.phone.replace(/\D/g, ""),
    request.zone.trim().toLowerCase(),
  ].join("|");
}

function dedupeRequestSummaries(requests: RequestSummary[]) {
  const bestByKey = new Map<string, RequestSummary>();

  requests.forEach((request) => {
    const key = requestDedupeKey(request);
    const existing = bestByKey.get(key);

    if (!existing) {
      bestByKey.set(key, request);
      return;
    }

    const requestRank = routeStatusRank(request.route_status);
    const existingRank = routeStatusRank(existing.route_status);

    if (requestRank > existingRank) {
      bestByKey.set(key, request);
      return;
    }

    if (
      requestRank === existingRank &&
      new Date(request.created_at).getTime() >
        new Date(existing.created_at).getTime()
    ) {
      bestByKey.set(key, request);
    }
  });

  return Array.from(bestByKey.values());
}

function defaultRouteName(name: string) {
  const firstName = (name || "Route").trim().split(/\s+/)[0] || "Route";

  return firstName + "'s Route";
}

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

function buildRequestSummaries(events: LawnEvent[]): RequestSummary[] {
  const routeUpdates = new Map<string, LawnEvent>();

  events
    .filter(
      (event) =>
        event.event_type === "route_updated" &&
        Boolean(event.payload?.request_id)
    )
    .forEach((event) => {
      const requestId = event.payload?.request_id;

      if (!requestId) return;

      const existing = routeUpdates.get(requestId);

      if (
        !existing ||
        new Date(event.created_at).getTime() >
          new Date(existing.created_at).getTime()
      ) {
        routeUpdates.set(requestId, event);
      }
    });

  return events
    .filter(
      (event) =>
        event.event_type === "panel_submitted" &&
        (event.panel === "request" || event.payload?.panel === "request")
    )
    .map((event) => {
      const payload = event.payload || {};
      const routeUpdate = routeUpdates.get(event.id);
      const routePayload = routeUpdate?.payload || {};

      return {
        id: event.id,
        created_at: event.created_at,
        session_id: event.session_id,
        name: payload.name || "No name",
        phone: payload.phone || "",
        zone: payload.contact_zone || payload.zone || "No area listed",
        notes: payload.notes || "",
        who: payload.who_needs_help || "Not selected",
        help: payload.help_type || "Not selected",
        condition: payload.yard_condition || "Not selected",
        contribution: payload.contribution || "Not selected",
        photo_count: payload.photo_count || "0",
        photo_names: payload.photo_names || "",
        photo_urls: payload.photo_urls || "",
        route_status: routePayload.route_status || "New",
        route_name:
          routePayload.route_name || defaultRouteName(payload.name || "Route"),
        route_zone:
          routePayload.route_zone ||
          payload.contact_zone ||
          payload.zone ||
          "No route zone",
        route_day: routePayload.route_day || "",
        route_time: routePayload.route_time || "",
        route_updated_at: routeUpdate?.created_at || "",
      };
    });
}

export default function OkeechobeeLawnIntelligenceDashboard() {
  const [events, setEvents] = useState<LawnEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  async function loadEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("okeechobee_lawn_events")
      .select("*")
      .gte("created_at", LAUNCH_CUTOFF_ISO)
      .order("created_at", { ascending: false })
      .limit(250);

    if (error) {
      console.error("Failed to load lawn intelligence events:", error);
      setEvents([]);
    } else {
      setEvents((data || []) as LawnEvent[]);
      setLastRefresh(new Date().toLocaleTimeString());
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();

    const channel = supabase
      .channel("okeechobee-lawn-events-dashboard")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "okeechobee_lawn_events",
        },
        (payload) => {
          const event = payload.new as LawnEvent;

          if (
            new Date(event.created_at).getTime() <
            new Date(LAUNCH_CUTOFF_ISO).getTime()
          ) {
            return;
          }

          setEvents((current) => [event, ...current].slice(0, 250));
          setLastRefresh(new Date().toLocaleTimeString());
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function saveRouteUpdate(
    request: RequestSummary,
    routeStatus: string,
    routeName: string,
    routeZone: string,
    routeDay = "",
    routeTime = ""
  ) {
    const cleanName =
      routeName.trim() || request.route_name || defaultRouteName(request.name);
    const cleanZone = routeZone.trim() || request.zone || "No route zone";
    const cleanDay = routeDay.trim();
    const cleanTime = routeTime.trim();

    const { error } = await supabase.from("okeechobee_lawn_events").insert({
      page: "okeechobee_lawn_program",
      event_type: "route_updated",
      session_id: request.session_id,
      panel: "route",
      action: routeStatus,
      zone: cleanZone,
      payload: {
        panel: "route",
        request_id: request.id,
        request_name: request.name,
        request_phone: request.phone,
        request_zone: request.zone,
        route_status: routeStatus,
        route_name: cleanName,
        route_zone: cleanZone,
        route_day: cleanDay,
        route_time: cleanTime,
      },
    });

    if (error) {
      console.error("Failed to save route update:", error);
    } else {
      await loadEvents();
    }
  }

  const stats = useMemo(() => {
    const requestOpens = countWhere(
      events,
      (event) => event.event_type === "panel_opened" && event.panel === "request"
    );

    const requestSubmits = countWhere(
      events,
      (event) =>
        event.event_type === "panel_submitted" &&
        (event.panel === "request" || event.payload?.panel === "request")
    );

    const nearbyAlerts = countWhere(
      events,
      (event) =>
        event.event_type === "panel_submitted" &&
        (event.panel === "nearby_alert" ||
          event.payload?.panel === "nearby_alert")
    );

    const sponsorInterest = countWhere(
      events,
      (event) =>
        event.panel === "sponsor" ||
        event.payload?.panel === "sponsor" ||
        event.source === "Sponsor / Piggy Bank card"
    );

    const workerInterest = countWhere(
      events,
      (event) =>
        event.panel === "worker" ||
        event.payload?.panel === "worker" ||
        event.source === "I Want To Work card"
    );

    const helperInterest = countWhere(
      events,
      (event) =>
        event.panel === "helper" ||
        event.payload?.panel === "helper" ||
        event.source === "I Want To Help card"
    );

    const piggyBankNeed = countWhere(
      events,
      (event) =>
        event.option_value === "Need Piggy Bank help" ||
        event.payload?.contribution === "Need Piggy Bank help"
    );

    const requestDropOff = Math.max(requestOpens - requestSubmits, 0);

    return {
      total: events.length,
      requestOpens,
      requestSubmits,
      nearbyAlerts,
      sponsorInterest,
      workerInterest,
      helperInterest,
      piggyBankNeed,
      requestDropOff,
    };
  }, [events]);

  const topHelpTypes = useMemo(
    () =>
      topValues(
        events.filter((event) => event.option_group === "help_type"),
        "option_value"
      ),
    [events]
  );

  const topZones = useMemo(
    () =>
      topValues(
        events.filter((event) => event.option_group === "nearby_zone" || event.zone),
        "zone"
      ),
    [events]
  );

  const topSources = useMemo(
    () =>
      topValues(
        events.filter((event) => event.event_type === "panel_opened"),
        "source"
      ),
    [events]
  );

  const requestSummaries = useMemo(
    () => dedupeRequestSummaries(buildRequestSummaries(events)).slice(0, 8),
    [events]
  );

  const routePlanRequests = useMemo(
    () =>
      requestSummaries.filter((request) =>
        ["Scheduled", "Done"].includes(request.route_status)
      ),
    [requestSummaries]
  );

  const routePlanGroups = useMemo(() => {
    const groups = new Map<string, RequestSummary[]>();

    routePlanRequests.forEach((request) => {
      const routeName = request.route_name || defaultRouteName(request.name);
      groups.set(routeName, [...(groups.get(routeName) || []), request]);
    });

    return Array.from(groups.entries()).map(([routeName, requests]) => ({
      routeName,
      requests,
    }));
  }, [routePlanRequests]);

  const routeNames = useMemo(
    () => routePlanGroups.map((group) => group.routeName),
    [routePlanGroups]
  );

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-lg font-black text-green-400">
              Okeechobee Together
            </div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-white/50">
              Lawn Intelligence
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="/planet/okeechobee/lawn-program"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white"
            >
              View Live Page
            </a>

            <button
              onClick={loadEvents}
              className="rounded-full bg-green-400 px-5 py-3 text-sm font-black text-black"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black text-green-400">
                Live Lawn Program Signals
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
                What people are doing.
              </h1>

              <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-white/70">
                This dashboard shows clicks, route interest, request intent,
                Piggy Bank need, and where people are going before they message.
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.06] px-4 py-3 text-sm font-black text-green-300">
              {loading ? "Loading..." : `Last refresh: ${lastRefresh || "now"}`}
              <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-green-200/70">
                Launch Mode
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Total Signals" value={stats.total} />
          <StatCard label="Request Opens" value={stats.requestOpens} />
          <StatCard label="Requests Submitted" value={stats.requestSubmits} green />
          <StatCard label="Route Alerts" value={stats.nearbyAlerts} green />
          <StatCard label="Sponsor Interest" value={stats.sponsorInterest} gold />
          <StatCard label="Worker Interest" value={stats.workerInterest} />
          <StatCard label="Helper Interest" value={stats.helperInterest} />
          <StatCard label="Piggy Bank Need" value={stats.piggyBankNeed} gold />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <InsightPanel title="Top Help Types" items={topHelpTypes} empty="No help types yet." />
          <InsightPanel title="Top Zones" items={topZones} empty="No zones yet." />
          <InsightPanel title="Top Click Sources" items={topSources} empty="No clicks yet." />
        </section>
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black text-green-400">
                Community Replies
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Quick Replies
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/60">
                Copy common replies for Facebook shares, comments, helpers, sponsors, and follow-ups without leaving the board.
              </p>
            </div>

            <div className="rounded-2xl border border-green-400/20 bg-green-400/[0.06] px-4 py-3 text-sm font-black text-green-300">
              Copy / paste ready
            </div>
          </div>

          <details className="group mt-6">
            <summary className="cursor-pointer list-none rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-center text-sm font-black text-green-300 transition hover:bg-green-400/15">
              <span className="group-open:hidden">Show Quick Replies</span>
              <span className="hidden group-open:inline">Hide Quick Replies</span>
            </summary>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {[
                [
                  "Thank you for sharing",
                  "Thank you for sharing this. It really helps get the word out so the right neighbors, helpers, and supporters can see it. 🌱",
                ],
                [
                  "Helping spread the word",
                  "Thank you for helping spread the word. The more this gets shared, the easier it is to find the people who need help and the people who want to support it. 🌱",
                ],
                [
                  "How to help",
                  "Thank you. The best place to start is here: https://www.homeplanet.city/planet/okeechobee/lawn-program\n\nYou can choose I Want To Help, Sponsor / Piggy Bank, or Notify Me Nearby depending on how you want to be involved.",
                ],
                [
                  "We received your request",
                  "Hi, this is Daniel with Okeechobee Together. We received your lawn help request and we’re reviewing the first route now. We’ll follow up as soon as we can.",
                ],
                [
                  "We’re in the area",
                  "We’re going to be in the area today, so we can swing by and take a quick look from the outside.\n\nAfter we see it, I’ll get back with you on what we can realistically do and when we may be able to fit it into the route.",
                ],
                [
                  "Business boundary",
                  "We would really appreciate local businesses not using this as a business advertising thread.\n\nThis first round is about helping neighbors who need basic lawn help, finding real needs, and seeing if the community can organize support in a fair way.\n\nIf a business wants to help, the best place to start is by volunteering, helping cover part of a yard, offering equipment, or helping connect someone who needs it.\n\nLet’s keep this focused on the people in our community who need it most. 🌱",
                ],
                [
                  "Piggy Bank explanation",
                  "The Piggy Bank is meant to help cover the gap when someone can only pay part of the yard cost, so the worker can still be paid fairly and the neighbor can still get help.",
                ],
                [
                  "Trailer ask",
                  "We have a mower and weed eater ready to go. The main thing holding us back right now is a small trailer.\n\nIf anyone has a small trailer they would be willing to rent, lease, sell, or loan at a fair price, please message Okeechobee Together.",
                ],
              ].map(([label, message]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="text-sm font-black text-white">
                    {label}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-relaxed text-white/55">
                    {message}
                  </p>

                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(message)}
                    className="mt-4 w-full rounded-2xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-sm font-black text-green-300"
                  >
                    Copy Reply
                  </button>
                </div>
              ))}
            </div>
          </details>
        </section>
        <section className="mt-8 rounded-3xl border border-green-400/20 bg-green-400/[0.06] p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black text-green-400">
                Route Workspace
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Scheduled Routes
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/60">
                Yards only show here after they are actually added to a route. Plan by zone, day, and time so everyone can see what is coming up.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-black text-green-300">
              {routePlanRequests.length} active
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {routePlanGroups.map((group) => (
              <div
                key={group.routeName}
                className="rounded-3xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xl font-black">{group.routeName}</div>
                    <div className="mt-1 text-xs font-black text-green-300">
                      {group.requests.length} yard{group.requests.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-black text-green-300">
                    Scheduled Route
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {group.requests.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="text-sm font-black text-white">
                            {request.name}
                          </div>

                          <div className="mt-1 text-xs font-bold text-white/55">
                            {request.route_zone}
                          </div>

                          {(request.route_day || request.route_time) && (
                            <div className="mt-1 text-xs font-black text-green-300">
                              {[request.route_day, request.route_time].filter(Boolean).join(" • ")}
                            </div>
                          )}

                          <div className="mt-1 text-xs font-bold text-white/40">
                            {request.help}
                          </div>
                        </div>

                        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-black text-white/60">
                          {request.route_status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!loading && routePlanRequests.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm font-semibold text-white/60">
                No scheduled routes yet. Use Add To Route on a request card after the customer is confirmed.
              </div>
            )}
          </div>
        </section>
        <section className="mt-8 rounded-3xl border border-green-400/20 bg-green-400/[0.05] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-green-400">
                Request Summaries
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Submitted lawn requests.
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/70">
                These cards turn raw clicks into usable request intent.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-black text-green-300">
              {requestSummaries.length} shown
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            {requestSummaries.map((request) => (
              <RequestSummaryCard key={request.id} request={request} routeNames={routeNames} onRouteUpdate={saveRouteUpdate} />
            ))}

            {!loading && requestSummaries.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm font-semibold text-white/60">
                No submitted requests yet.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-yellow-300/20 bg-yellow-300/[0.06] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Drop-Off Watch
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/70">
                This shows people who opened the request flow but did not submit yet.
                It helps us see where the form may be too long, confusing, or missing something.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/30 p-5 md:min-w-[220px]">
              <div className="text-xs font-black uppercase tracking-widest text-white/50">
                Request drop-offs
              </div>
              <div className="mt-2 text-4xl font-black">
                {stats.requestDropOff}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Live Event Timeline
              </h2>
              <p className="mt-3 text-sm font-semibold text-white/60">
                Latest signals from the lawn program page.
              </p>
            </div>

            <div className="text-sm font-black text-white/40">
              {events.length} shown
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {events.slice(0, 3).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}

            {events.length > 3 && (
              <details className="group">
                <summary className="cursor-pointer list-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm font-black text-green-300 transition hover:bg-green-400/10">
                  <span className="group-open:hidden">
                    Show More Events
                  </span>
                  <span className="hidden group-open:inline">
                    Hide Extra Events
                  </span>
                </summary>

                <div className="mt-3 grid gap-3">
                  {events.slice(3, 30).map((event) => (
                    <EventRow key={event.id} event={event} />
                  ))}
                </div>
              </details>
            )}

            {!loading && events.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5 text-sm font-semibold text-white/60">
                No events yet. Click around on the live page and refresh.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  green,
  gold,
}: {
  label: string;
  value: number;
  green?: boolean;
  gold?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        green
          ? "border-green-400/30 bg-green-400/10"
          : gold
            ? "border-yellow-300/25 bg-yellow-300/10"
            : "border-white/10 bg-white/[0.03]",
      ].join(" ")}
    >
      <div className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </div>
      <div className="mt-3 text-4xl font-black">{value}</div>
    </div>
  );
}

function InsightPanel({
  title,
  items,
  empty,
}: {
  title: string;
  items: [string, number][];
  empty: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-black tracking-tight">{title}</h2>

      <div className="mt-5 grid gap-3">
        {items.map(([label, count]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <span className="text-sm font-bold text-white/75">{label}</span>
            <span className="rounded-full bg-green-400/15 px-3 py-1 text-sm font-black text-green-300">
              {count}
            </span>
          </div>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm font-semibold text-white/50">
            {empty}
          </div>
        )}
      </div>
    </div>
  );
}

function RequestSummaryCard({
  request,
  routeNames,
  onRouteUpdate,
}: {
  request: RequestSummary;
  routeNames: string[];
  onRouteUpdate: (
    request: RequestSummary,
    routeStatus: string,
    routeName: string,
    routeZone: string,
    routeDay?: string,
    routeTime?: string
  ) => void;
}) {
  const [routeNameDraft, setRouteNameDraft] = useState(
    request.route_name || defaultRouteName(request.name)
  );
  const [routeZoneDraft, setRouteZoneDraft] = useState(
    request.route_zone || request.zone || ""
  );
  const [routeDayDraft, setRouteDayDraft] = useState(request.route_day || "");
  const [routeTimeDraft, setRouteTimeDraft] = useState(request.route_time || "");
  const [routeSavingStatus, setRouteSavingStatus] = useState("");

  const rawPhone = request.phone || "";
  const digitsOnly = rawPhone.replace(/\D/g, "");
  const normalizedPhone =
    digitsOnly.length === 10
      ? `+1${digitsOnly}`
      : digitsOnly.length === 11 && digitsOnly.startsWith("1")
        ? `+${digitsOnly}`
        : rawPhone.trim();

  const displayPhone =
    digitsOnly.length === 10
      ? `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`
      : digitsOnly.length === 11 && digitsOnly.startsWith("1")
        ? `(${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`
        : rawPhone || "No phone listed";

  const quickReply = `Hi ${request.name || "there"}, this is Daniel with Okeechobee Together. We received your lawn help request.

I saw you are in ${request.zone || "Okeechobee"} and need ${request.help}. We are organizing the first lawn help route now.

What days or times usually work best, and is there anything else we should know before we come by?`;

  const smsHref = normalizedPhone
    ? `sms:${normalizedPhone}?body=${encodeURIComponent(quickReply)}`
    : "#";

  const callHref = normalizedPhone ? `tel:${normalizedPhone}` : "#";
  const mapsHref = request.zone
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${request.zone}, Okeechobee, FL`)}`
    : "#";

  const routeStatuses = ["New", "Contacted", "Done"];
  const isScheduledOnRoute = request.route_status === "Scheduled";

  async function handleRouteStatus(routeStatus: string) {
    setRouteSavingStatus(routeStatus);

    await onRouteUpdate(
      request,
      routeStatus,
      routeNameDraft,
      routeZoneDraft,
      routeDayDraft,
      routeTimeDraft
    );

    setRouteSavingStatus("");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xl font-black">
            {request.name}
          </div>

          <div className="mt-1 text-sm font-bold text-white/60">
            {request.who}
          </div>

          <div className="mt-1 text-xs font-bold text-white/40">
            Submitted {timeAgo(request.created_at)}
          </div>
        </div>

        <div className="rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1 text-xs font-black text-green-300">
          {request.route_status}
        </div>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <DetailBox label="Phone" value={displayPhone} />
        <DetailBox label="Area" value={request.zone || "No area listed"} />
      </div>

      {request.notes && (
        <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-xs font-black uppercase tracking-widest text-white/40">
            Notes
          </div>
          <div className="mt-1 whitespace-pre-wrap text-xs font-semibold leading-relaxed text-white/70">
            {request.notes}
          </div>
        </div>
      )}

      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <DetailBox label="Help needed" value={request.help} />
        <DetailBox label="Yard condition" value={request.condition} />
        <DetailBox label="Contribution" value={request.contribution} />
        <DetailBox
          label="Photos"
          value={
            Number(request.photo_count || "0") > 0
              ? `${request.photo_count} uploaded`
              : "No photos"
          }
        />
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-4">
        <a
          href={smsHref}
          className={[
            "rounded-xl px-3 py-2 text-center text-xs font-black",
            normalizedPhone
              ? "bg-green-400 text-black"
              : "pointer-events-none bg-white/10 text-white/35",
          ].join(" ")}
        >
          Text
        </a>

        <a
          href={callHref}
          className={[
            "rounded-xl border px-3 py-2 text-center text-xs font-black",
            normalizedPhone
              ? "border-white/15 bg-white/[0.04] text-white"
              : "pointer-events-none border-white/10 bg-white/[0.02] text-white/35",
          ].join(" ")}
        >
          Call
        </a>

        <a
          href={mapsHref}
          target="_blank"
          rel="noreferrer"
          className={[
            "rounded-xl border px-3 py-2 text-center text-xs font-black",
            request.zone
              ? "border-white/15 bg-white/[0.04] text-white"
              : "pointer-events-none border-white/10 bg-white/[0.02] text-white/35",
          ].join(" ")}
        >
          Navigate
        </a>

        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(quickReply)}
          className="rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs font-black text-green-300"
        >
          Copy Reply
        </button>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="text-xs font-black uppercase tracking-widest text-white/40">
          Schedule / Add To Route
        </div>

        <div className="mt-2 grid gap-2 md:grid-cols-5">
          <div>
            <input
              list="lawn-route-names"
              value={routeNameDraft}
              onChange={(event) => setRouteNameDraft(event.target.value)}
              placeholder="Route name"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-white outline-none placeholder:text-white/30 focus:border-green-400/50"
            />
            <datalist id="lawn-route-names">
              {routeNames.map((routeName) => (
                <option key={routeName} value={routeName} />
              ))}
            </datalist>
          </div>

          <input
            value={routeZoneDraft}
            onChange={(event) => setRouteZoneDraft(event.target.value)}
            placeholder="Zone"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-white outline-none placeholder:text-white/30 focus:border-green-400/50"
          />

          <select
            value={routeDayDraft}
            onChange={(event) => setRouteDayDraft(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-white outline-none focus:border-green-400/50"
          >
            <option value="">Day</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Next route">Next route</option>
          </select>

          <select
            value={routeTimeDraft}
            onChange={(event) => setRouteTimeDraft(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-bold text-white outline-none focus:border-green-400/50"
          >
            <option value="">Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Flexible">Flexible</option>
          </select>

          <button
            type="button"
            onClick={() =>
              handleRouteStatus("Scheduled")
            }
            disabled={routeSavingStatus === "Scheduled"}
            className={[
              "rounded-xl px-4 py-2 text-xs font-black transition",
              routeSavingStatus === "Scheduled"
                ? "cursor-wait bg-green-400/40 text-black/60"
                : isScheduledOnRoute
                  ? "border border-green-400/30 bg-green-400/15 text-green-200 hover:bg-green-400/20"
                  : "bg-green-400 text-black hover:bg-green-300",
            ].join(" ")}
          >
            {routeSavingStatus === "Scheduled"
              ? "Saving..."
              : isScheduledOnRoute
                ? "Update Route"
                : "Add To Route"}
          </button>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4">
          {routeStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleRouteStatus(status)}
              className={[
                "rounded-xl border px-2 py-2 text-[11px] font-black",
                request.route_status === status
                  ? "border-green-400/40 bg-green-400/15 text-green-300"
                  : "border-white/10 bg-black/30 text-white/55",
              ].join(" ")}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-xs font-black uppercase tracking-widest text-white/40">
        {label}
      </div>
      <div className="mt-1 text-xs font-black text-white">
        {value}
      </div>
    </div>
  );
}

function EventRow({ event }: { event: LawnEvent }) {
  const main =
    event.option_value ||
    event.source ||
    event.payload?.panel ||
    event.panel ||
    event.event_type;

  const sub = [
    event.event_type,
    event.panel ? `panel: ${event.panel}` : null,
    event.option_group ? `group: ${event.option_group}` : null,
    event.zone ? `zone: ${event.zone}` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-base font-black">{main}</div>
          <div className="mt-1 text-xs font-bold text-white/45">{sub}</div>
        </div>

        <div className="text-xs font-black text-green-300">
          {timeAgo(event.created_at)}
        </div>
      </div>
    </div>
  );
}



























