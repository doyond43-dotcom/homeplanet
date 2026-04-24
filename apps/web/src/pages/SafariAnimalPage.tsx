import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

type SafariAnimal = {
  slug: string;
  name: string;
  type: string;
  emoji: string;
  headline: string;
  subline: string;
  momentTitle: string;
  accent: string;
};

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
};

const SAFARI_BOARD_SLUG = "safari-demo";

const ANIMALS: SafariAnimal[] = [
  {
    slug: "sloth",
    name: "Luna",
    type: "Sloth Encounter",
    emoji: "🦥",
    headline: "You are moments away from meeting Luna.",
    subline:
      "Scan-based proof for your sloth encounter. No app. No login. Just capture the moment.",
    momentTitle: "Guest met Luna the Sloth",
    accent: "from-emerald-500/25 to-lime-300/10",
  },
  {
    slug: "otter",
    name: "Otto",
    type: "Otter Splash",
    emoji: "🦦",
    headline: "Otto is ready for your splash moment.",
    subline:
      "Capture the interaction, lock the timestamp, and keep the memory connected to the visit.",
    momentTitle: "Guest met Otto the Otter",
    accent: "from-sky-500/25 to-cyan-300/10",
  },
  {
    slug: "monkey",
    name: "Milo",
    type: "Monkey Walkthrough",
    emoji: "🐒",
    headline: "Milo’s walkthrough moment starts here.",
    subline:
      "One scan turns the animal interaction into a live HomePlanet moment.",
    momentTitle: "Guest met Milo the Monkey",
    accent: "from-amber-500/25 to-orange-300/10",
  },
];

function makeMomentId() {
  return `safari-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatStamp(date: Date) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getAnimal(slug?: string) {
  return ANIMALS.find((animal) => animal.slug === slug) ?? ANIMALS[0];
}

function readFeed(): SafariMoment[] {
  try {
    return JSON.parse(localStorage.getItem("hp:safari-feed") || "[]");
  } catch {
    return [];
  }
}

export default function SafariAnimalPage() {
  const navigate = useNavigate();
  const { animalSlug } = useParams();

  const animal = useMemo(() => getAnimal(animalSlug), [animalSlug]);

  function captureMoment() {
    const now = new Date();

    const moment: SafariMoment = {
      id: makeMomentId(),
      animalSlug: animal.slug,
      animalName: animal.name,
      animalType: animal.type,
      emoji: animal.emoji,
      title: animal.momentTitle,
      createdAt: formatStamp(now),
      boardSlug: SAFARI_BOARD_SLUG,
      source: "qr-scan",
      unlocked: false,
    };

    localStorage.setItem(`hp:safari-moment:${moment.id}`, JSON.stringify(moment));

    const feed = readFeed();
    localStorage.setItem(
      "hp:safari-feed",
      JSON.stringify([moment, ...feed].slice(0, 25))
    );

    navigate(`/planet/safari/moment/${moment.id}`);
  }

  return (
    <main className="min-h-screen bg-[#07120d] px-4 py-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-5xl flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl md:p-8">
        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-200/80">
                HomePlanet Safari Moment
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
                {animal.type}
              </h1>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/25 px-4 py-3 text-center">
              <div className="text-4xl">{animal.emoji}</div>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-white/50">
                QR Ready
              </p>
            </div>
          </div>

          <div
            className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${animal.accent} p-6 md:p-10`}
          >
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/60">
              Scan detected
            </p>

            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              {animal.headline}
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
              {animal.subline}
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/45">
                  Step 1
                </p>
                <p className="mt-2 font-bold">Guest scans animal sign</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/45">
                  Step 2
                </p>
                <p className="mt-2 font-bold">Moment gets timestamped</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/45">
                  Step 3
                </p>
                <p className="mt-2 font-bold">Live board updates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/25 p-4 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <p className="text-sm font-bold text-emerald-200">
              No apps. No logins. No customer account.
            </p>
            <p className="mt-1 text-sm text-white/55">
              This creates a local demo moment now. Supabase can replace storage later.
            </p>
          </div>

          <button
            onClick={captureMoment}
            className="mt-4 w-full rounded-2xl bg-white px-6 py-4 text-base font-black text-[#07120d] shadow-xl transition hover:scale-[1.01] active:scale-[0.99] md:mt-0 md:w-auto"
          >
            Capture My Moment
          </button>
        </div>
      </section>
    </main>
  );
}