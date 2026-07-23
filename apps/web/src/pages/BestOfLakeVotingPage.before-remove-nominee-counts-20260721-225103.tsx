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
      // The demo remains usable if local storage is unavailable.
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
      // Keep the current demo session usable.
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
      <main className="min-h-screen bg-[#f7f6f1] text-[#17212b]">
        <header className="border-b border-[#d9ddd9] bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setActivePollId(null);
                  setSaved(false);
                }}
                className="min-h-11 text-sm font-bold text-[#176f72] hover:underline"
              >
                ← Back to my ballot
              </button>

              <div className="text-right">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-[#176f72]">
                  Best of the Lake
                </div>
                <div className="text-xs text-[#68737b]">
                  2026 Readers' Choice
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
          <section className="border-b border-[#d8ddd9] pb-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#176f72]">
                {activePoll.section}
              </span>

              <span className="text-sm text-[#68737b]">
                {completed} of {total} completed
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e7e9e5]">
              <div
                className="h-full rounded-full bg-[#176f72] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>

          {!saved ? (
            <>
              <div className="pt-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b18a20]">
                  2026 Readers' Choice Awards
                </p>

                <h1
                  className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] text-[#17212b] sm:text-5xl"
                  style={{
                    fontFamily:
                      'Georgia, "Times New Roman", serif',
                  }}
                >
                  {activePoll.question}
                </h1>

                <p className="mt-4 text-base leading-7 text-[#5e6971]">
                  Choose one nominee below.
                </p>
              </div>

              <section className="mt-8 overflow-hidden rounded-xl border border-[#d8ddd9] bg-white shadow-sm">
                {activePoll.nominees.map((nominee, index) => {
                  const isSelected = selected === nominee;

                  return (
                    <button
                      key={nominee}
                      type="button"
                      onClick={() => setSelected(nominee)}
                      className={[
                        "flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left transition",
                        index !== activePoll.nominees.length - 1
                          ? "border-b border-[#e4e6e2]"
                          : "",
                        isSelected
                          ? "bg-[#e7f4f1]"
                          : "bg-white hover:bg-[#f8f8f5]",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-sm font-black",
                          isSelected
                            ? "border-[#176f72] bg-[#176f72] text-white"
                            : "border-[#aeb7b6] bg-white",
                        ].join(" ")}
                      >
                        {isSelected ? "✓" : ""}
                      </span>

                      <span
                        className={[
                          "text-base sm:text-lg",
                          isSelected
                            ? "font-bold text-[#115d60]"
                            : "font-semibold text-[#27333c]",
                        ].join(" ")}
                      >
                        {nominee}
                      </span>
                    </button>
                  );
                })}
              </section>

              <p className="mt-5 text-xs leading-5 text-[#7b858b]">
                HomePlanet redesign concept. This prototype does not submit
                an official Lake Okeechobee News vote.
              </p>

              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d8ddd9] bg-white/95 p-4 backdrop-blur">
                <div className="mx-auto flex max-w-3xl gap-3">
                  <button
                    type="button"
                    onClick={nextPoll}
                    className="min-h-14 rounded-lg border border-[#c8ceca] bg-white px-5 font-bold text-[#4f5d64] hover:bg-[#f5f5f2]"
                  >
                    Skip
                  </button>

                  <button
                    type="button"
                    disabled={!selected}
                    onClick={saveVote}
                    className="min-h-14 flex-1 rounded-lg bg-[#176f72] px-5 font-black text-white transition hover:bg-[#115d60] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    CAST MY VOTE
                  </button>
                </div>
              </div>
            </>
          ) : (
            <section className="mt-10 rounded-xl border border-[#c9ddd8] bg-white p-7 text-center shadow-sm sm:p-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#176f72] text-3xl font-black text-white">
                ✓
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#176f72]">
                Vote saved in this demo
              </p>

              <h1
                className="mt-3 text-3xl font-bold text-[#17212b] sm:text-4xl"
                style={{
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                }}
              >
                {selected}
              </h1>

              <p className="mt-3 text-[#68737b]">
                {activePoll.question}
              </p>

              <div className="mx-auto mt-8 max-w-md border-y border-[#e0e3df] py-5 text-left">
                <div className="flex items-center justify-between text-sm">
                  <strong className="text-[#27333c]">
                    Your ballot progress
                  </strong>

                  <span className="text-[#68737b]">
                    {completed} of {total}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7e9e5]">
                  <div
                    className="h-full rounded-full bg-[#176f72]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={nextPoll}
                className="mt-8 min-h-14 w-full rounded-lg bg-[#176f72] px-5 font-black text-white hover:bg-[#115d60]"
              >
                Continue to next category →
              </button>

              <button
                type="button"
                onClick={() => setActivePollId(null)}
                className="mt-3 min-h-12 w-full text-sm font-bold text-[#176f72] hover:underline"
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
    <main className="min-h-screen bg-[#f7f6f1] text-[#17212b]">
      <header className="border-b-[5px] border-[#176f72] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-[#d3ad3b] bg-[#f7cf58] text-xl">
                ★
              </div>

              <div>
                <div
                  className="text-xl font-bold leading-none text-[#17212b]"
                  style={{
                    fontFamily:
                      'Georgia, "Times New Roman", serif',
                  }}
                >
                  Best of the Lake
                </div>

                <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#176f72]">
                  2026 Readers' Choice Awards
                </div>
              </div>
            </div>

            <div className="hidden text-right sm:block">
              <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#68737b]">
                Okeechobee
              </div>
              <div className="mt-1 text-xs text-[#8a9397]">
                Community Favorites
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e2e5e1] bg-[#fafaf8]">
          <div className="mx-auto flex max-w-6xl items-center gap-x-5 overflow-x-auto px-4 py-2.5 text-xs font-bold text-[#536168] sm:px-6">
            <span className="whitespace-nowrap">Okeechobee</span>
            <span className="whitespace-nowrap">Belle Glade</span>
            <span className="whitespace-nowrap">Clewiston</span>
            <span className="whitespace-nowrap">LaBelle</span>
            <span className="whitespace-nowrap text-[#176f72]">Best of the Lake</span>
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#176f72]">
              Best of the Lake 2026
            </p>

            <h1
              className="mt-4 max-w-4xl text-5xl font-bold leading-[0.98] text-[#17212b] sm:text-7xl"
              style={{
                fontFamily:
                  'Georgia, "Times New Roman", serif',
              }}
            >
              Vote for your Okeechobee favorites.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6b72]">
              Celebrate the businesses, people and places that make
              Okeechobee special. Find who you came to support and move
              through your ballot one clear choice at a time.
            </p>

            <button
              type="button"
              onClick={() => openPoll(polls[0])}
              className="mt-8 min-h-14 rounded-lg bg-[#176f72] px-7 font-black text-white shadow-sm transition hover:bg-[#115d60]"
            >
              START MY BALLOT →
            </button>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e1e4df] pt-5 text-sm text-[#68747a]">
              <strong className="text-[#27343b]">
                Voting open through August 15, 2026
              </strong>
              <span className="hidden text-[#b7bfbb] sm:inline">|</span>
              <button
                type="button"
                className="font-bold text-[#176f72] hover:underline"
              >
                Voting rules
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#dce0dc] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <div className="flex min-h-20 items-center justify-center rounded border border-[#dfe2de] bg-[#fafaf8] px-5 text-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9aa39f]">
                Advertisement
              </div>
              <div className="mt-1 text-sm font-semibold text-[#707b80]">
                Sponsor message or local advertisement
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce0dc] bg-[#eef4f1]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#176f72]">
            Find your favorite
          </p>

          <h2
            className="mt-2 text-3xl font-bold text-[#17212b] sm:text-4xl"
            style={{
              fontFamily:
                'Georgia, "Times New Roman", serif',
            }}
          >
            Who are you here to vote for?
          </h2>

          <p className="mt-3 text-[#627077]">
            Search a business, person, place or category and go straight
            to the right ballot.
          </p>

          <div className="relative mt-6">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#7c888d]">
              ⌕
            </span>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search "Only The Essentials", "Echols", "Pizza Heaven"...'
              className="min-h-16 w-full rounded-lg border-2 border-[#cfd7d3] bg-white py-3 pl-14 pr-5 text-base font-semibold text-[#17212b] shadow-sm outline-none placeholder:text-[#929b9f] focus:border-[#176f72]"
            />
          </div>

          {query ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-[#d5dad6] bg-white shadow-sm">
              {searchResults.length ? (
                searchResults.map(({ poll, nominee }, index) => (
                  <button
                    key={`${poll.id}-${nominee ?? index}`}
                    type="button"
                    onClick={() => openPoll(poll, nominee)}
                    className="flex min-h-20 w-full items-center justify-between gap-4 border-b border-[#e4e7e3] px-5 py-4 text-left last:border-0 hover:bg-[#f6f8f5]"
                  >
                    <div>
                      <div className="font-bold text-[#202d35]">
                        {nominee ?? poll.question}
                      </div>

                      <div className="mt-1 text-sm text-[#68757b]">
                        {nominee
                          ? poll.question
                          : poll.section}
                      </div>
                    </div>

                    <span className="text-xl font-bold text-[#176f72]">
                      →
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-5 text-[#68757b]">
                  No match in this first prototype set.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-[#f7f6f1]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">

          <div className="mb-10 flex min-h-20 items-center justify-center rounded border border-[#d9ddd8] bg-white px-5 text-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9aa39f]">
                Advertisement
              </div>
              <div className="mt-1 text-sm font-semibold text-[#707b80]">
                Local business or event sponsor
              </div>
            </div>
          </div>
          {completed > 0 ? (
            <div className="mb-12 border-y border-[#d5d9d5] py-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.17em] text-[#176f72]">
                    Your ballot
                  </p>

                  <h2
                    className="mt-2 text-2xl font-bold"
                    style={{
                      fontFamily:
                        'Georgia, "Times New Roman", serif',
                    }}
                  >
                    {completed} of {total} prototype categories completed
                  </h2>
                </div>

                <div className="text-2xl font-black text-[#176f72]">
                  {progress}%
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dedfda]">
                <div
                  className="h-full rounded-full bg-[#176f72]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className="border-b-2 border-[#17212b] pb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#176f72]">
              Explore the ballot
            </p>

            <h2
              className="mt-2 text-4xl font-bold text-[#17212b]"
              style={{
                fontFamily:
                  'Georgia, "Times New Roman", serif',
              }}
            >
              Choose a category.
            </h2>
          </div>

          <div className="divide-y divide-[#d8ddd9]">
            {polls.map((poll) => (
              <button
                key={poll.id}
                type="button"
                onClick={() => openPoll(poll)}
                className="group flex min-h-28 w-full items-center justify-between gap-5 py-6 text-left"
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.15em] text-[#176f72]">
                    {poll.section}
                  </div>

                  <h3
                    className="mt-2 text-2xl font-bold text-[#17212b] group-hover:text-[#176f72]"
                    style={{
                      fontFamily:
                        'Georgia, "Times New Roman", serif',
                    }}
                  >
                    {poll.question}
                  </h3>

                  <div className="mt-2 text-sm text-[#737e83]">
                    {poll.nominees.length} nominees
                    {votes[poll.id]
                      ? ` · You voted for ${votes[poll.id]}`
                      : ""}
                  </div>
                </div>

                <div className="shrink-0">
                  {votes[poll.id] ? (
                    <span className="font-black text-[#176f72]">
                      ✓ Voted
                    </span>
                  ) : (
                    <span className="font-black text-[#b18a20]">
                      Vote →
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-14 border-t border-[#d8ddd9] pt-6 text-sm leading-6 text-[#737d82]">
            <strong className="text-[#4f5b61]">
              HomePlanet redesign concept.
            </strong>{" "}
            This prototype is not affiliated with or an official voting
            page of Lake Okeechobee News. Demo selections remain on this
            device only.
          </div>
        </div>
      </section>

      <footer className="border-t-[5px] border-[#176f72] bg-[#17212b] text-white">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <div
                className="text-2xl font-bold"
                style={{
                  fontFamily:
                    'Georgia, "Times New Roman", serif',
                }}
              >
                Best of the Lake
              </div>
              <div className="mt-2 text-sm text-white/60">
                Celebrating Okeechobee's favorite local businesses,
                people and places.
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-[#7fc4c1]">
                Lake Okeechobee News
              </div>
              <div className="mt-2 text-sm text-white/60">
                Okeechobee · Clewiston · Belle Glade · LaBelle
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/15 pt-5 text-xs text-white/45">
            Concept experience by HomePlanet. Sample ballot shown for presentation purposes.
          </div>
        </div>
      </footer>
    </main>
  );
}

