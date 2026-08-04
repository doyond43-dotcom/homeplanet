import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  Eye,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
} from "lucide-react";
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
  estimate_started: "Estimate form started",
  estimate_request_submitted: "Estimate request submitted",
  call_clicked: "Call Eric clicked",
  text_clicked: "Text Eric clicked",
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

  const preferredKeys = [
    "location",
    "trigger",
    "service",
    "condition",
    "timing",
    "referrer",
    "path",
  ];

  return preferredKeys
    .filter(
      (key) =>
        meta[key] !== undefined &&
        meta[key] !== null &&
        meta[key] !== "",
    )
    .map((key) => `${key}: ${String(meta[key])}`)
    .join(" • ");
}

export default function VZProfessionalLawncareLiveActivity() {
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
      .eq("board", "vz-professional-lawncare")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Could not load V&Z Live Activity:", error);
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
    const estimateStarts = count("estimate_started");
    const submissions = count("estimate_request_submitted");
    const calls = count("call_clicked");
    const texts = count("text_clicked");

    return {
      pageViews,
      estimateStarts,
      submissions,
      calls,
      texts,
      conversionRate:
        pageViews > 0 ? Math.round((submissions / pageViews) * 100) : 0,
      topActions: [...actionCounts.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [events]);

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] border border-[#7CFC00]/20 bg-gradient-to-br from-[#102313] via-[#080b08] to-black p-6 shadow-2xl shadow-black/50 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#7CFC00]">
            Live Activity
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            What customers are doing.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
            See page opens, estimate starts, calls, texts, and completed
            estimate requests from the last 30 days.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/planet/vz-professional-lawncare/intelligence"
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl bg-[#FFD000] px-6 text-sm font-black uppercase tracking-[0.16em] text-black"
            >
              Open Customer Board
            </a>

            <button
              type="button"
              onClick={() => void loadActivity()}
              disabled={loading}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-[#7CFC00]/30 bg-[#7CFC00]/10 px-6 text-sm font-black uppercase tracking-[0.16em] text-[#C8FF98] disabled:opacity-60"
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

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={<Eye size={20} />}
            label="Page Opens"
            value={intelligence.pageViews}
            detail="Customer Live Page visits"
          />

          <StatCard
            icon={<Activity size={20} />}
            label="Estimate Starts"
            value={intelligence.estimateStarts}
            detail="People who entered the form"
          />

          <StatCard
            icon={<Send size={20} />}
            label="Requests Sent"
            value={intelligence.submissions}
            detail={`${intelligence.conversionRate}% visit conversion`}
          />

          <StatCard
            icon={<Phone size={20} />}
            label="Call Clicks"
            value={intelligence.calls}
            detail="Tapped to call Eric"
          />

          <StatCard
            icon={<MessageCircle size={20} />}
            label="Text Clicks"
            value={intelligence.texts}
            detail="Tapped to text Eric"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#7CFC00]">
              Top Actions
            </p>

            <h2 className="mt-2 text-2xl font-black">What people clicked</h2>

            <div className="mt-5 space-y-3">
              {intelligence.topActions.length === 0 ? (
                <p className="text-sm text-white/40">
                  No customer activity has been recorded yet.
                </p>
              ) : (
                intelligence.topActions.map(([label, count]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 px-4 py-4"
                  >
                    <span className="text-sm font-bold text-white/75">
                      {label}
                    </span>

                    <span className="rounded-full bg-[#7CFC00]/15 px-3 py-1 text-sm font-black text-[#C8FF98]">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#7CFC00]">
              Activity Feed
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Latest customer activity
            </h2>

            <div className="mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-white/40">Loading activity…</p>
              ) : events.length === 0 ? (
                <p className="text-sm text-white/40">
                  No V&Z customer events found in the last 30 days.
                </p>
              ) : (
                events.map((item) => {
                  const details = metaText(item.meta);

                  return (
                    <article
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-black/35 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white">
                            {eventLabel(item.event)}
                          </p>

                          {details ? (
                            <p className="mt-1 break-words text-xs font-semibold leading-5 text-white/35">
                              {details}
                            </p>
                          ) : null}
                        </div>

                        <time className="shrink-0 text-right text-xs font-bold text-white/35">
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
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center gap-2 text-[#7CFC00]">
        {icon}

        <p className="text-xs font-black uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-4 text-4xl font-black">{value}</p>
      <p className="mt-2 text-sm text-white/40">{detail}</p>
    </article>
  );
}