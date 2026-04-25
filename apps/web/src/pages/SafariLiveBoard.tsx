import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type SafariMoment = {
  id: string;
  animalSlug: string;
  animalName: string;
  animalType: string;
  emoji: string;
  title: string;
  createdAt: string;
  boardSlug: string;
  source: "qr-scan";
  unlocked: boolean;
  photoDataUrl?: string;
  photoAddedAt?: string;
};

function readFeed(): SafariMoment[] {
  try {
    const feed = JSON.parse(localStorage.getItem("hp:safari-feed") || "[]") as SafariMoment[];

    return feed.map((item) => {
      const rawFullMoment = localStorage.getItem(`hp:safari-moment:${item.id}`);
      if (!rawFullMoment) return item;

      try {
        const fullMoment = JSON.parse(rawFullMoment) as SafariMoment;
        return { ...item, ...fullMoment };
      } catch {
        return item;
      }
    });
  } catch {
    return [];
  }
}

export default function SafariLiveBoard() {
  const navigate = useNavigate();
  const [moments, setMoments] = useState<SafariMoment[]>([]);

  useEffect(() => {
    setMoments(readFeed());

    const timer = window.setInterval(() => {
      setMoments(readFeed());
    }, 1500);

    return () => window.clearInterval(timer);
  }, []);

  const total = moments.length;

  const unlocked = useMemo(
    () => moments.filter((moment) => moment.unlocked).length,
    [moments]
  );

  const withPhotos = useMemo(
    () => moments.filter((moment) => Boolean(moment.photoDataUrl)).length,
    [moments]
  );

  return (
    <main className="min-h-screen bg-[#06120d] px-4 py-6 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200/75">
                HomePlanet Live Safari Board
              </p>
              <h1 className="mt-2 text-4xl font-black md:text-6xl">
                Safari Experience Live
              </h1>
              <p className="mt-3 max-w-2xl text-white/65">
                Every guest scan becomes a timestamped animal interaction moment.
                No app. No login. Just presence captured as it happens.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 md:min-w-[420px]">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">Moments</p>
                <p className="mt-2 text-3xl font-black text-emerald-300">{total}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">Unlocked</p>
                <p className="mt-2 text-3xl font-black text-emerald-300">{unlocked}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-widest text-white/45">Photos</p>
                <p className="mt-2 text-3xl font-black text-emerald-300">{withPhotos}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate("/planet/safari/sloth")} className="rounded-2xl bg-white px-5 py-3 font-black text-[#06120d]">
              Open Sloth QR Page
            </button>

            <button onClick={() => navigate("/planet/safari/otter")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-bold">
              Open Otter QR Page
            </button>

            <button onClick={() => navigate("/planet/safari/monkey")} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-bold">
              Open Monkey QR Page
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_340px]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-black">Live Moment Feed</h2>
                <p className="text-sm text-white/50">
                  New scans, unlocks, and photo memories appear here automatically.
                </p>
              </div>

              <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-200">
                Live
              </span>
            </div>

            {moments.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center">
                <p className="text-lg font-black">No safari moments yet.</p>
                <p className="mt-2 text-sm text-white/55">
                  Open the Sloth QR page, tap Capture My Moment, then come back here.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {moments.map((moment, index) => (
                  <button
                    key={moment.id}
                    onClick={() => navigate(`/planet/safari/moment/${moment.id}`)}
                    className={`w-full rounded-2xl border p-4 text-left transition hover:bg-white/10 ${
                      index === 0
                        ? "border-[#2bbd8e]/40 bg-[#123f34]"
                        : "border-white/10 bg-black/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/10 text-3xl">
                          {moment.photoDataUrl ? (
                            <img
                              src={moment.photoDataUrl}
                              alt={`${moment.animalName} memory`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            moment.emoji
                          )}
                        </div>

                        <div>
                          <p className="text-lg font-black">{moment.title}</p>
                          <p className="mt-1 text-sm text-white/50">
                            {moment.animalType} • {moment.createdAt}
                          </p>
                          {moment.photoAddedAt && (
                            <p className="mt-1 text-xs font-bold text-emerald-300">
                              Photo added {moment.photoAddedAt}
                            </p>
                          )}
                          {index === 0 && (
                            <p className="mt-2 text-xs font-black uppercase tracking-widest text-emerald-200">
                              First live demo moment auto-created
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/55">
                        {moment.photoDataUrl
                          ? "Photo memory attached"
                          : moment.unlocked
                            ? "Memory unlocked"
                            : "Proof captured"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border border-emerald-300/15 bg-emerald-400/[0.06] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/70">
              Demo Story
            </p>

            <h3 className="mt-3 text-2xl font-black">
              Scan → moment → proof → memory
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/65">
              This board is the operator view. Each animal interaction becomes a
              visible, timestamped record without asking the guest to create an account.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                Guest scans exhibit sign
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                Moment gets timestamped
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                Staff can see live activity
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                Guest unlocks photo memory
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}