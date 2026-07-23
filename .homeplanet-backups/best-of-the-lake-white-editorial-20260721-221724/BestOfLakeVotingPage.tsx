import { useEffect, useMemo, useState } from "react";

type Poll = {
  id: string;
  section: string;
  question: string;
  nominees: string[];
};

const polls: Poll[] = [
  {
    id: "cleaning-company",
    section: "Home & Services",
    question: "What is the best Cleaning Company?",
    nominees: [
      "True Grit Cleaning Service",
      "Paradise Cleaning Company",
      "Nunez Quality Cleaning, LLC",
      "Lakeview Cleaning LLC",
      "Catchem Up Cleaning Services",
      "C&B Neat Services LLC",
      "Only The Essentials",
    ],
  },
  {
    id: "plumbing-service",
    section: "Home & Services",
    question: "What is the best Plumbing Service?",
    nominees: [
      "Daniels Plumbing",
      "Echols Plumbing & Air Conditioning",
      "Flow-Rite Plumbing, Inc",
      "Lonnie Price Plumbing",
      "Wise Choice Plumbing Inc",
    ],
  },
  {
    id: "pest-control",
    section: "Home & Services",
    question: "What is the best Pest Control?",
    nominees: [
      "Ace Pest Control",
      "Geno's Pest Control",
      "Highland Pest Control",
      "Perry Pest Protection",
      "Slap a Bug Pest Control",
    ],
  },
  {
    id: "heat-ac-service",
    section: "Home & Services",
    question: "What is the best Heat/AC Service?",
    nominees: [
      "AC Today",
      "Cooling Refrigeration Services",
      "Miller's Central Air",
      "Ocean Breeze Cooling and Heating",
      "Okeechobee Air Conditioning & Refrigeration",
      "AirPro Cooling & Heating",
      "Nunez Air Conditioning",
    ],
  },
  {
    id: "pizza-place",
    section: "Food & Drink",
    question: "What is the best Pizza place?",
    nominees: [
      "Joey's Pizzeria",
      "Pizza Heaven",
      "Regal Pizza & Restaurant",
    ],
  },
];

const STORAGE_KEY = "homeplanet-best-of-lake-demo-ballot-v1";

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export default function BestOfLakeVotingPage() {
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [activePollId, setActivePollId] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY);
      if (existing) {
        setVotes(JSON.parse(existing));
      }
    } catch {
      // Demo remains usable even if storage is unavailable.
    }

    const params = new URLSearchParams(window.location.search);
    const doorway = params.get("vote");

    if (doorway) {
      const needle = normalize(doorway);

      const match = polls.find(
        (poll) =>
          normalize(poll.id).includes(needle) ||
          normalize(poll.question).includes(needle) ||
          poll.nominees.some((nominee) =>
            normalize(nominee).includes(needle)
          )
      );

      if (match) {
        setActivePollId(match.id);

        const nomineeMatch = match.nominees.find((nominee) =>
          normalize(nominee).includes(needle)
        );

        if (nomineeMatch) {
          setSelected(nomineeMatch);
        }
      }
    }
  }, []);

  const activePoll =
    polls.find((poll) => poll.id === activePollId) ?? null;

  const completed = Object.keys(votes).length;
  const total = polls.length;
  const progress = Math.round((completed / total) * 100);

  const searchResults = useMemo(() => {
    const needle = normalize(query);

    if (!needle) return [];

    const results: Array<{
      poll: Poll;
      nominee?: string;
    }> = [];

    for (const poll of polls) {
      if (
        normalize(poll.question).includes(needle) ||
        normalize(poll.section).includes(needle)
      ) {
        results.push({ poll });
      }

      for (const nominee of poll.nominees) {
        if (normalize(nominee).includes(needle)) {
          results.push({ poll, nominee });
        }
      }
    }

    return results.slice(0, 10);
  }, [query]);

  function openPoll(poll: Poll, nominee?: string) {
    setActivePollId(poll.id);
    setSelected(nominee ?? votes[poll.id] ?? "");
    setSaved(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveVote() {
    if (!activePoll || !selected) return;

    const next = {
      ...votes,
      [activePoll.id]: selected,
    };

    setVotes(next);

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      // Demo vote still works in memory.
    }

    setSaved(true);
  }

  function nextPoll() {
    if (!activePoll) return;

    const index = polls.findIndex(
      (poll) => poll.id === activePoll.id
    );

    const remaining =
      polls
        .slice(index + 1)
        .find((poll) => !votes[poll.id]) ??
      polls.find((poll) => !votes[poll.id]);

    if (!remaining) {
      setActivePollId(null);
      setSelected("");
      setSaved(false);
      return;
    }

    openPoll(remaining);
  }

  if (activePoll) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-2xl px-4 pb-28 pt-5 sm:px-6">
          <button
            type="button"
            onClick={() => {
              setActivePollId(null);
              setSaved(false);
            }}
            className="min-h-11 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-bold text-white/80"
          >
            ← My ballot
          </button>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-black uppercase tracking-widest text-emerald-300">
                {activePoll.section}
              </span>

              <span className="text-sm text-white/60">
                {completed} of {total} completed
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {!saved ? (
            <>
              <p className="mt-9 text-sm font-black uppercase tracking-[0.2em] text-amber-300">
                Best of the Lake 2026
              </p>

              <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                {activePoll.question}
              </h1>

              <p className="mt-3 leading-7 text-white/60">
                Choose one. This HomePlanet concept does not submit an
                official Lake Okeechobee News vote.
              </p>

              <div className="mt-7 grid gap-3">
                {activePoll.nominees.map((nominee) => {
                  const isSelected = selected === nominee;

                  return (
                    <button
                      key={nominee}
                      type="button"
                      onClick={() => setSelected(nominee)}
                      className={[
                        "flex min-h-16 w-full items-center gap-4 rounded-2xl border p-4 text-left transition",
                        isSelected
                          ? "border-emerald-300 bg-emerald-300/15"
                          : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-sm font-black",
                          isSelected
                            ? "border-emerald-300 bg-emerald-300 text-slate-950"
                            : "border-white/25",
                        ].join(" ")}
                      >
                        {isSelected ? "✓" : ""}
                      </span>

                      <span className="text-base font-bold sm:text-lg">
                        {nominee}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/95 p-4 backdrop-blur">
                <div className="mx-auto flex max-w-2xl gap-3">
                  <button
                    type="button"
                    onClick={nextPoll}
                    className="min-h-14 rounded-2xl border border-white/15 px-5 font-bold text-white/70"
                  >
                    Skip
                  </button>

                  <button
                    type="button"
                    disabled={!selected}
                    onClick={saveVote}
                    className="min-h-14 flex-1 rounded-2xl bg-amber-300 px-5 font-black text-slate-950 disabled:opacity-40"
                  >
                    CAST MY VOTE
                  </button>
                </div>
              </div>
            </>
          ) : (
            <section className="mt-10 rounded-[2rem] border border-emerald-300/25 bg-emerald-300/10 p-7 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-300 text-3xl font-black text-slate-950">
                ✓
              </div>

              <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
                Vote saved in demo
              </p>

              <h1 className="mt-3 text-3xl font-black">
                {selected}
              </h1>

              <p className="mt-2 text-white/60">
                {activePoll.question}
              </p>

              <div className="mt-7 rounded-2xl bg-black/20 p-4 text-left">
                <div className="flex items-center justify-between text-sm">
                  <strong>Your ballot</strong>
                  <span className="text-white/60">
                    {completed} of {total} completed
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-amber-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextPoll}
                className="mt-7 min-h-14 w-full rounded-2xl bg-amber-300 px-5 font-black text-slate-950"
              >
                Next category →
              </button>

              <button
                type="button"
                onClick={() => setActivePollId(null)}
                className="mt-3 min-h-12 w-full rounded-2xl border border-white/15 font-bold text-white/75"
              >
                Back to my ballot
              </button>
            </section>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pb-20">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-2xl">
              🏆
            </div>

            <div>
              <div className="font-black uppercase tracking-[0.18em] text-amber-300">
                Best of the Lake
              </div>

              <div className="text-xs text-white/45">
                2026 voting experience concept
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Okeechobee chooses
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[0.98] sm:text-6xl">
              Vote for the people and businesses you love.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Find who you came to support, vote one category at a time,
              and keep moving without hunting through one giant page.
            </p>

            <button
              type="button"
              onClick={() => openPoll(polls[0])}
              className="mt-7 min-h-14 rounded-2xl bg-amber-300 px-7 font-black text-slate-950"
            >
              Start voting →
            </button>

            <p className="mt-5 max-w-xl text-xs leading-5 text-white/35">
              HomePlanet redesign concept. Not affiliated with or an
              official voting page of Lake Okeechobee News. Demo choices
              remain on this device only.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-3xl px-4 py-9 sm:px-6">
          <h2 className="text-2xl font-black">
            Who are you here to vote for?
          </h2>

          <p className="mt-2 text-white/55">
            Search a business, person, place or category.
          </p>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Try "Only The Essentials", "Echols", "pizza"...'
            className="mt-5 min-h-16 w-full rounded-2xl border border-white/15 bg-black/25 px-5 text-base font-semibold text-white outline-none placeholder:text-white/30 focus:border-amber-300"
          />

          {query ? (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
              {searchResults.length ? (
                searchResults.map(({ poll, nominee }, index) => (
                  <button
                    key={`${poll.id}-${nominee ?? index}`}
                    type="button"
                    onClick={() => openPoll(poll, nominee)}
                    className="flex min-h-20 w-full items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-left last:border-0 hover:bg-white/5"
                  >
                    <div>
                      <div className="font-black">
                        {nominee ?? poll.question}
                      </div>

                      <div className="mt-1 text-sm text-white/45">
                        {nominee
                          ? poll.question
                          : poll.section}
                      </div>
                    </div>

                    <span className="text-xl text-amber-300">→</span>
                  </button>
                ))
              ) : (
                <div className="p-5 text-white/50">
                  No match in this first prototype set.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {completed > 0 ? (
          <div className="mb-10 rounded-3xl border border-amber-300/20 bg-amber-300/5 p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-amber-300">
                  Your ballot
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {completed} of {total} prototype categories completed
                </h2>
              </div>

              <div className="text-3xl font-black text-amber-300">
                {progress}%
              </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-300">
          Explore the ballot
        </p>

        <h2 className="mt-2 text-3xl font-black">
          One clear choice at a time.
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {polls.map((poll) => (
            <button
              key={poll.id}
              type="button"
              onClick={() => openPoll(poll)}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/25 hover:bg-white/10"
            >
              <div className="text-xs font-black uppercase tracking-widest text-emerald-300">
                {poll.section}
              </div>

              <h3 className="mt-3 text-xl font-black">
                {poll.question}
              </h3>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-white/45">
                  {poll.nominees.length} nominees
                </span>

                {votes[poll.id] ? (
                  <span className="font-bold text-emerald-300">
                    ✓ Voted
                  </span>
                ) : (
                  <span className="font-bold text-amber-300">
                    Vote →
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm font-black uppercase tracking-widest text-white/45">
            Prototype scope
          </p>

          <p className="mt-3 max-w-3xl leading-7 text-white/60">
            This first build proves the doorway, search, guided voting,
            ballot progress and direct-category experience. Once the
            interaction is approved, the complete 2026 ballot can be
            populated without changing the voting architecture.
          </p>
        </div>
      </section>
    </main>
  );
}
