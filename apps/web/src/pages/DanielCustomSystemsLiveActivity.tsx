import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabase";

type ActivityEvent = {
  id: string;
  event_name: string;
  page_path: string;
  session_id: string;
  visitor_id: string;
  source: string | null;
  referrer: string | null;
  label: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page viewed",
  start_here_click: "Start Here clicked",
  show_need_click: "Show Me What I Need clicked",
  how_it_works_click: "How It Works clicked",
  problem_selected: "Problem selected",
  request_opened: "Request opened",
  request_started: "Request started",
  request_submitted: "Request submitted",
};

const FUNNEL = [
  { event: "page_view", label: "Visited the page" },
  { event: "request_opened", label: "Opened the request" },
  { event: "request_started", label: "Started the form" },
  { event: "request_submitted", label: "Submitted a request" },
];

function readableSource(source: string | null) {
  if (!source) return "Unknown";
  if (source === "direct") return "Direct";
  if (source === "facebook") return "Facebook";
  if (source === "google") return "Google";
  if (source === "localhost") return "Local testing";

  return source;
}

function formatActivityTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DanielCustomSystemsLiveActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadActivity() {
    setLoading(true);
    setErrorMessage("");

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await supabase
      .from("custom_systems_activity_events")
      .select(
        "id, event_name, page_path, session_id, visitor_id, source, referrer, label, metadata, created_at",
      )
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setEvents((data ?? []) as ActivityEvent[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadActivity();
  }, []);

  const intelligence = useMemo(() => {
    const uniqueVisitors = new Set(events.map((event) => event.visitor_id)).size;
    const pageViews = events.filter(
      (event) => event.event_name === "page_view",
    ).length;

    const sourceCounts = new Map<string, number>();
    const actionCounts = new Map<string, number>();

    for (const event of events) {
      const source = readableSource(event.source);
      sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);

      if (event.event_name !== "page_view") {
        const action = EVENT_LABELS[event.event_name] ?? event.event_name;
        actionCounts.set(action, (actionCounts.get(action) ?? 0) + 1);
      }
    }

    return {
      uniqueVisitors,
      pageViews,
      sources: [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]),
      actions: [...actionCounts.entries()].sort((a, b) => b[1] - a[1]),
      funnel: FUNNEL.map((step) => ({
        ...step,
        count: events.filter((event) => event.event_name === step.event).length,
      })),
    };
  }, [events]);

  return (
    <main className="min-h-screen bg-[#070b09] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.08),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9ae93c]">
                HomePlanet · Daniel / Custom Systems
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Live Activity
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62 sm:text-base">
                What people are doing on the Custom Systems page, where they
                came from, and whether they are moving toward a request.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/planet/custom-systems/board"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.045] px-5 py-3 text-sm font-black transition hover:border-[#7ee000]/55 hover:bg-[#7ee000]/10"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Live Board
              </a>

              <a
                href="/planet/custom-systems"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.045] px-5 py-3 text-sm font-black transition hover:border-[#7ee000]/55 hover:bg-[#7ee000]/10"
              >
                View Live Page
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={() => void loadActivity()}
                disabled={loading}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#7ee000]/40 bg-[#7ee000]/10 px-5 py-3 text-sm font-black text-[#b8ff68] transition hover:border-[#7ee000]/75 hover:bg-[#7ee000]/15 disabled:cursor-wait disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {errorMessage && (
          <div className="mt-5 rounded-[22px] border border-red-400/25 bg-red-400/[0.08] px-5 py-4 text-sm font-semibold text-red-100">
            Live Activity error: {errorMessage}
          </div>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Visitors
            </p>
            <p className="mt-3 text-4xl font-black text-[#b8ff68]">
              {intelligence.uniqueVisitors}
            </p>
            <p className="mt-2 text-sm text-white/48">Unique people · 30 days</p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Page Views
            </p>
            <p className="mt-3 text-4xl font-black text-white">
              {intelligence.pageViews}
            </p>
            <p className="mt-2 text-sm text-white/48">Custom Systems live page</p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
              Form Starts
            </p>
            <p className="mt-3 text-4xl font-black text-white">
              {
                events.filter((event) => event.event_name === "request_started")
                  .length
              }
            </p>
            <p className="mt-2 text-sm text-white/48">First form interaction</p>
          </article>

          <article className="rounded-[24px] border border-[#7ee000]/25 bg-[#7ee000]/[0.07] p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b8ff68]/70">
              Requests
            </p>
            <p className="mt-3 text-4xl font-black text-[#b8ff68]">
              {
                events.filter(
                  (event) => event.event_name === "request_submitted",
                ).length
              }
            </p>
            <p className="mt-2 text-sm text-white/52">Submitted through the page</p>
          </article>
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          <article className="rounded-[26px] border border-white/10 bg-[#0c120f]/92 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ae93c]">
              Request Funnel
            </p>
            <h2 className="mt-2 text-xl font-black">How far people got</h2>

            <div className="mt-5 space-y-3">
              {intelligence.funnel.map((step, index) => {
                const previous =
                  index === 0 ? step.count : intelligence.funnel[index - 1].count;

                const percentage =
                  previous > 0
                    ? Math.round((step.count / previous) * 100)
                    : 0;

                return (
                  <div
                    key={step.event}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-black text-white/78">
                        {step.label}
                      </p>
                      <p className="text-2xl font-black text-white">
                        {step.count}
                      </p>
                    </div>

                    {index > 0 && (
                      <p className="mt-2 text-xs font-bold text-white/38">
                        {percentage}% continued from the previous step
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-[26px] border border-white/10 bg-[#0c120f]/92 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ae93c]">
              Traffic Sources
            </p>
            <h2 className="mt-2 text-xl font-black">Where activity came from</h2>

            <div className="mt-5 space-y-3">
              {intelligence.sources.length === 0 ? (
                <p className="text-sm text-white/40">No source activity yet.</p>
              ) : (
                intelligence.sources.slice(0, 8).map(([source, count]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <p className="truncate text-sm font-black text-white/72">
                      {source}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-white/65">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-[26px] border border-white/10 bg-[#0c120f]/92 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ae93c]">
              Top Actions
            </p>
            <h2 className="mt-2 text-xl font-black">What people clicked</h2>

            <div className="mt-5 space-y-3">
              {intelligence.actions.length === 0 ? (
                <p className="text-sm text-white/40">No click activity yet.</p>
              ) : (
                intelligence.actions.slice(0, 8).map(([action, count]) => (
                  <div
                    key={action}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <p className="text-sm font-black text-white/72">{action}</p>
                    <span className="rounded-full border border-[#7ee000]/20 bg-[#7ee000]/[0.07] px-3 py-1 text-xs font-black text-[#b8ff68]">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-[26px] border border-white/10 bg-[#0c120f]/92 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9ae93c]">
            Recent Activity
          </p>
          <h2 className="mt-2 text-xl font-black">What happened most recently</h2>

          <div className="mt-5 divide-y divide-white/8">
            {loading ? (
              <p className="py-6 text-sm font-semibold text-white/45">
                Loading Live Activity...
              </p>
            ) : events.length === 0 ? (
              <p className="py-6 text-sm font-semibold text-white/45">
                No activity has been recorded yet.
              </p>
            ) : (
              events.slice(0, 30).map((event) => (
                <div
                  key={event.id}
                  className="grid gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white/78">
                      {EVENT_LABELS[event.event_name] ?? event.event_name}
                    </p>

                    <p className="mt-1 truncate text-xs font-semibold text-white/38">
                      {readableSource(event.source)}
                      {event.label ? ` · ${event.label}` : ""}
                    </p>
                  </div>

                  <p className="text-xs font-bold text-white/38">
                    {formatActivityTime(event.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <footer className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.025] px-5 py-4 text-sm leading-6 text-white/46">
          Live Activity shows anonymous behavior and request movement. It does
          not expose private Build Records or customer request details.
        </footer>
      </div>
    </main>
  );
}