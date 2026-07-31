import { useEffect, useMemo, useState } from "react";
import { Activity, Eye, MessageCircle, Phone, Play, RefreshCw, Send } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

type ActivityEvent = {
  id: string;
  event: string;
  board: string;
  entity_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

const EVENT_LABELS: Record<string, string> = {
  landing_page_opened: "Landing page opened",
  quote_started: "Quote form started",
  quote_request_submitted: "Quote request submitted",
  call_clicked: "Call button clicked",
  text_clicked: "Text button clicked",
  request_cleaning_clicked: "Request Cleaning clicked",
  video_played: "Cleaning video played",
};

function eventLabel(eventName: string) {
  return EVENT_LABELS[eventName] ?? eventName.replaceAll("_", " ");
}

function formatTime(value: string) {
  const date = new Date(value);

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function metaText(meta: Record<string, unknown> | null) {
  if (!meta) return "";

  const preferredKeys = ["location", "trigger", "video", "serviceType", "path"];

  return preferredKeys
    .filter((key) => meta[key] !== undefined && meta[key] !== null && meta[key] !== "")
    .map((key) => `${key}: ${String(meta[key])}`)
    .join(" • ");
}

export default function OnlyTheEssentialsLiveActivity() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadActivity() {
    setLoading(true);
    setErrorMessage("");

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data, error } = await supabase
      .from("hp_events")
      .select("id, event, board, entity_id, meta, created_at")
      .eq("board", "only-the-essentials")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Could not load Only The Essentials activity:", error);
      setErrorMessage(error.message);
      setEvents([]);
    } else {
      setEvents((data ?? []) as ActivityEvent[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadActivity();
  }, []);

  const intelligence = useMemo(() => {
    const count = (eventName: string) =>
      events.filter((item) => item.event === eventName).length;

    const actionCounts = new Map<string, number>();

    events.forEach((item) => {
      if (item.event !== "landing_page_opened") {
        const label = eventLabel(item.event);
        actionCounts.set(label, (actionCounts.get(label) ?? 0) + 1);
      }
    });

    const pageViews = count("landing_page_opened");
    const quoteStarts = count("quote_started");
    const submissions = count("quote_request_submitted");
    const calls = count("call_clicked");
    const texts = count("text_clicked");
    const requestClicks = count("request_cleaning_clicked");
    const videoPlays = count("video_played");

    return {
      pageViews,
      quoteStarts,
      submissions,
      calls,
      texts,
      requestClicks,
      videoPlays,
      conversionRate:
        pageViews > 0 ? Math.round((submissions / pageViews) * 100) : 0,
      topActions: [...actionCounts.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [events]);

  return (
    <main className="min-h-screen bg-[#07080d] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-950/35 via-zinc-950 to-black p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
            Live Activity
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-6xl">
            What people are doing.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
            See page visits, quote starts, calls, texts, video plays, cleaning
            requests, and completed quote submissions from the last 30 days.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/planet/only-the-essentials/intelligence"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-pink-400 px-6 text-sm font-black uppercase tracking-[0.16em] text-black"
            >
              Open Cleaning Board
            </a>

            <button
              type="button"
              onClick={() => void loadActivity()}
              disabled={loading}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-6 text-sm font-black uppercase tracking-[0.16em] text-cyan-100 disabled:opacity-60"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh Activity
            </button>
          </div>
        </header>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-bold text-red-100">
            Could not load activity: {errorMessage}
          </div>
        ) : null}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Eye size={20} />}
            label="Page Opens"
            value={intelligence.pageViews}
            detail="Landing page visits"
          />

          <StatCard
            icon={<Activity size={20} />}
            label="Quote Starts"
            value={intelligence.quoteStarts}
            detail="People who began"
          />

          <StatCard
            icon={<Send size={20} />}
            label="Requests Sent"
            value={intelligence.submissions}
            detail={`${intelligence.conversionRate}% visit conversion`}
          />

          <StatCard
            icon={<Play size={20} />}
            label="Video Plays"
            value={intelligence.videoPlays}
            detail="Proof viewed"
          />
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Phone size={20} />}
            label="Call Clicks"
            value={intelligence.calls}
            detail="Tapped to call Kaitlin"
          />

          <StatCard
            icon={<MessageCircle size={20} />}
            label="Text Clicks"
            value={intelligence.texts}
            detail="Tapped to send a text"
          />

          <StatCard
            icon={<Send size={20} />}
            label="Cleaning Clicks"
            value={intelligence.requestClicks}
            detail="Request Cleaning buttons"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              Top Actions
            </p>

            <h2 className="mt-2 text-2xl font-black">What people clicked</h2>

            <div className="mt-5 space-y-3">
              {intelligence.topActions.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No activity has been recorded yet.
                </p>
              ) : (
                intelligence.topActions.map(([label, count]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                  >
                    <span className="text-sm font-bold text-zinc-200">
                      {label}
                    </span>

                    <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-sm font-black text-cyan-200">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
              Activity Feed
            </p>

            <h2 className="mt-2 text-2xl font-black">Latest customer activity</h2>

            <div className="mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-zinc-500">Loading activity…</p>
              ) : events.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No Only The Essentials events found in the last 30 days.
                </p>
              ) : (
                events.map((item) => {
                  const details = metaText(item.meta);

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white">
                            {eventLabel(item.event)}
                          </p>

                          {details ? (
                            <p className="mt-1 break-words text-xs font-semibold leading-5 text-zinc-500">
                              {details}
                            </p>
                          ) : null}
                        </div>

                        <time className="shrink-0 text-right text-xs font-bold text-zinc-500">
                          {formatTime(item.created_at)}
                        </time>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-4 text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{detail}</p>
    </article>
  );
}
