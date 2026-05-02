import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type HpEventRow = {
  id: string;
  event: string;
  board: string | null;
  entity_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
};

function formatTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function HomePlanetEventsBoard() {
  const [events, setEvents] = useState<HpEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const boardFilter = new URLSearchParams(window.location.search).get("board");

  async function loadEvents() {
    setLoading(true);

    const { data, error } = await supabase
      .from("hp_events")
      .select("id,event,board,entity_id,meta,created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("HomePlanet events load error:", error);
      setEvents([]);
    } else {
      setEvents((data || []) as HpEventRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const visibleEvents = useMemo(() => {
    return boardFilter ? events.filter((item) => item.board === boardFilter) : events;
  }, [events, boardFilter]);

  const counts = useMemo(() => {
    return visibleEvents.reduce<Record<string, number>>((acc, item) => {
      acc[item.event] = (acc[item.event] || 0) + 1;
      return acc;
    }, {});
  }, [visibleEvents]);

  const requestOpened = counts.request_page_opened || 0;
  const requestSubmitted = counts.request_submitted || 0;
  const requestRate = requestOpened > 0 ? Math.round((requestSubmitted / requestOpened) * 100) : 0;

const messagesOpened = counts.messages_page_opened || 0;
const followUpRate = requestSubmitted > 0 ? Math.round((messagesOpened / requestSubmitted) * 100) : 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_10%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(244,114,182,0.10),transparent_28%),#050509] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[34px] border border-white/12 bg-white/5 p-6 sm:p-8">
          <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-100">
            HomePlanet Events Board
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
                Real work happening.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/65 sm:text-base">
                This board shows actual HomePlanet moments: request page opens, submitted requests, opened messages, and other live system actions.
                {boardFilter ? ` Filtered view: ${boardFilter}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={loadEvents}
              className="rounded-2xl border border-white/15 bg-white/90 px-5 py-3 text-sm font-bold text-black hover:bg-white"
            >
              Refresh Events
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(counts).map(([event, count]) => (
            <div key={event} className="rounded-[26px] border border-white/12 bg-black/35 p-5">
              <div className="text-3xl font-black">{count}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                {event}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-[30px] border border-cyan-300/15 bg-cyan-400/[0.045] p-5">
          <div className="mb-4">
            <h2 className="text-2xl font-black">Request flow</h2>
            <p className="mt-1 text-sm text-white/55">
              This shows whether people are moving from interest to action.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-3xl font-black">{requestOpened}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Page opened
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-3xl font-black">{requestSubmitted}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Request submitted
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-3xl font-black">{requestRate}%</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Action rate
              </div>
            </div>
          
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-3xl font-black">{messagesOpened}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Follow-up opened
              </div>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-300"
              style={{ width: `${Math.min(requestRate, 100)}%` }}
            />
          </div>
        </section>

        <section className="mt-6 rounded-[30px] border border-white/12 bg-black/35 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black">Latest events</h2>
            <span className="text-xs text-white/40">{visibleEvents.length} loaded</span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/55">
              Loading events...
            </div>
          ) : (
            <div className="space-y-3">
              {visibleEvents.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm md:grid-cols-[1.2fr_1fr_1fr_1fr]"
                >
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Event</div>
                    <div className="mt-1 font-bold text-cyan-100">{item.event}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Board</div>
                    <div className="mt-1 font-bold text-white">{item.board || "unknown"}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Entity</div>
                    <div className="mt-1 text-white/65">{item.entity_id || "none"}</div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Time</div>
                    <div className="mt-1 text-white/65">{formatTime(item.created_at)}</div>
                  </div>
                </div>
              ))}

              {!events.length && (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-white/45">
                  No events yet.
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-white/40">
          HomePlanet © 2026 — track real work, not people.
        </footer>
      </div>
    </main>
  );
}



