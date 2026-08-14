import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileCheck2,
  Wrench,
} from "lucide-react";

const story = [
  {
    eyebrow: "CUSTOMER",
    title: "A customer needs something.",
    text: "They open the Live Page and send a request.",
    icon: ClipboardList,
  },
  {
    eyebrow: "BUSINESS",
    title: "The board reacts.",
    text: "The new request appears where the owner can actually act on it.",
    icon: CheckCircle2,
  },
  {
    eyebrow: "WORK DRAWER",
    title: "The job opens.",
    text: "Customer, photos, estimate, notes, next action, and history stay together.",
    icon: Wrench,
  },
  {
    eyebrow: "WORK",
    title: "The work moves.",
    text: "Updates, field notes, photos, and completion proof flow back into the same job.",
    icon: FileCheck2,
  },
  {
    eyebrow: "OUTCOME",
    title: "Money and proof stay connected.",
    text: "Payment, completion, proof, follow-up, and history finish the same story.",
    icon: CreditCard,
  },
];

const builds = [
  {
    name: "Only The Essentials",
    type: "Cleaning operating system",
  },
  {
    name: "Performance Powerboats",
    type: "Marine sales + production system",
  },
  {
    name: "Electrician System",
    type: "Service-business workflow",
  },
  {
    name: "Cow Town Tags",
    type: "Livestock recovery + ranch system",
  },
  {
    name: "Guardian Pet Tags",
    type: "Pet recovery system",
  },
  {
    name: "Okeechobee Together",
    type: "Community coordination system",
  },
];

export default function HomePlanetFrontDoorV2() {
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setScene((current) => {
        if (current >= story.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1350);

    return () => window.clearInterval(timer);
  }, [playing]);

  const CurrentIcon = story[scene].icon;

  function playStory() {
    setScene(0);
    setPlaying(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020504] text-white">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(65,255,126,0.15),transparent_38rem),radial-gradient(circle_at_90%_70%,rgba(35,115,255,0.08),transparent_30rem)]" />

        <img
          src="/images/homeplanet-hero-earth-glow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[68%] object-cover object-right opacity-95 lg:block"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#020504] via-[#020504]/70 to-transparent lg:block" />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24">
          <header className="flex items-center justify-between">
            <div className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
              HomePlanet
            </div>

            <Link
              to="/planet/custom-systems"
              className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300 transition hover:text-white"
            >
              Start a Project
            </Link>
          </header>

          <div className="pt-20 sm:pt-28">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-emerald-300">
              Systems {"\u2022"} Workflows {"\u2022"} Intelligence
            </p>

            <h1 className="mt-5 max-w-5xl text-6xl font-black leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-[8rem]">
              See What
              <span className="block text-emerald-300">I Build.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              HomePlanet connects the customer, the work, the money, and the proof
              into one working system.
            </p>

            <button
              onClick={playStory}
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-emerald-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:scale-[1.02]"
            >
              Watch The Work Move
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
            One connected story
          </p>

          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            A customer asks. The business moves.
          </h2>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
          <div className="grid min-h-[420px] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-between border-b border-white/10 p-7 lg:border-b-0 lg:border-r lg:p-10">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
                  <CurrentIcon size={26} />
                </div>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
                  {story[scene].eyebrow}
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-tight">
                  {story[scene].title}
                </h3>

                <p className="mt-4 max-w-md text-base leading-7 text-zinc-300">
                  {story[scene].text}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-2">
                {story.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPlaying(false);
                      setScene(index);
                    }}
                    aria-label={`Open scene ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === scene
                        ? "w-10 bg-emerald-300"
                        : "w-2.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center p-6 sm:p-10">
              <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-black/40 p-5 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-zinc-500">
                      Active Work
                    </p>
                    <p className="mt-1 font-black">Sarah Mitchell</p>
                  </div>

                  <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.18em] text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    "Request received",
                    "Estimate ready",
                    "Job scheduled",
                    "Work completed",
                    "Payment + proof",
                  ].map((label, index) => {
                    const active = index <= scene;

                    return (
                      <div
                        key={label}
                        className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition ${
                          active
                            ? "border-emerald-300/20 bg-emerald-300/[0.06]"
                            : "border-white/[0.06] bg-white/[0.02]"
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                            active
                              ? "bg-emerald-300 text-black"
                              : "bg-white/10 text-zinc-500"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <span
                          className={`font-semibold ${
                            active ? "text-white" : "text-zinc-600"
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-zinc-500">
                    Next Action
                  </p>
                  <p className="mt-2 font-bold text-white">
                    {scene < story.length - 1
                      ? story[scene + 1].title
                      : "Outcome complete. History saved."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-7 text-center text-lg font-bold text-zinc-400">
          This is not a website sitting still. This is the work moving.
        </p>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
            From request to review
          </p>

          <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            One job. One connected story.
          </h2>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ["01", "Request", "Customer asks"],
              ["02", "Work Drawer", "Everything together"],
              ["03", "Tech Pad", "Work gets done"],
              ["04", "Payment", "Get paid"],
              ["05", "Proof", "Outcome captured"],
              ["06", "Review", "Follow-up closes"],
            ].map(([number, title, text]) => (
              <div
                key={title}
                className="rounded-[1.35rem] border border-white/10 bg-black/35 p-5"
              >
                <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-emerald-300">
                  {number}
                </p>

                <h3 className="mt-4 text-lg font-black text-white">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400">
            Nothing gets handed off into another disconnected app. The request,
            the work, the payment, the proof, and the customer history stay together.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
          Systems we build
        </p>

        <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
          Operating systems for how you actually work.
        </h2>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              title: "Electrician System",
              text: "Requests, estimates, scheduling, field work, photos, payment, and proof.",
            },
            {
              title: "Sales & Showroom",
              text: "Leads, products, proposals, deposits, builds, documents, and delivery.",
            },
            {
              title: "Cleaning & Services",
              text: "Quotes, customers, recurring work, schedules, photos, payments, and reviews.",
            },
            {
              title: "Product Systems",
              text: "Products, orders, activation, fulfillment, shipping, customers, and history.",
            },
            {
              title: "Organization Systems",
              text: "People, projects, communication, responsibilities, documents, and outcomes.",
            },
          ].map((system, index) => (
            <article
              key={system.title}
              className="group rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-6 transition hover:border-emerald-300/25 hover:bg-emerald-300/[0.025]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] text-sm font-black text-emerald-300">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mt-7 text-xl font-black leading-tight">
                {system.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {system.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
            Real systems in action
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Real products. Real purpose. Real systems.
          </h2>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Guardian Pet Tags",
                type: "Pet recovery system",
                image: "/images/bella-demo.jpg",
                href: "/planet/guardian-pet",
              },
              {
                name: "Cow Town Tags",
                type: "Livestock recovery + ranch system",
                image: "/images/cow-town-tag-main.png",
                href: "/planet/cow-town-tags",
              },
              {
                name: "Only The Essentials",
                type: "Cleaning operating system",
                image: "/images/kaitlin-cleaning-profile.jpg",
                href: "/onlytheessentials",
              },
              {
                name: "Performance Powerboats",
                type: "Marine sales + production system",
                image: "/images/homeplanet-performance-powerboats-system.png",
                href: "/planet/performance-powerboats",
              },
              {
                name: "Electrician System",
                type: "Service-business operating system",
                image: "/images/homeplanet-electrician-system.png",
                href: "/planet/demo/electrician",
              },
              {
                name: "Okeechobee Together",
                type: "Community coordination system",
                image: "/images/homeplanet-okeechobee-together-system.png",
                href: "/planet/okeechobee",
              },
            ].map((build) => (
              <Link
                key={build.name}
                to={build.href}
                className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/35 transition hover:-translate-y-1 hover:border-emerald-300/25"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#07100b]">
                  <img
                    src={build.image}
                    alt=""
                    className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="h-1.5 w-10 rounded-full bg-emerald-300" />

                  <h3 className="mt-5 text-xl font-black">
                    {build.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {build.type}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Open System
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-28">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
          Daniel's Custom Systems
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">
          Have something you need to make work?
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
          Bring me the problem. We build the system around how the work actually
          happens.
        </p>

        <Link
          to="/planet/custom-systems"
          className="mt-9 inline-flex items-center gap-3 rounded-full bg-emerald-300 px-8 py-4 text-sm font-black uppercase tracking-[0.18em] text-black"
        >
          Start Your System
          <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">
          <div>
            <p className="text-lg font-black text-white">
              HomePlanet
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              Systems {"\u2022"} Workflows {"\u2022"} Intelligence
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-zinc-400">
            <Link to="/planet/builds" className="transition hover:text-white">
              Real Builds
            </Link>

            <Link to="/planet/custom-systems" className="transition hover:text-white">
              Daniel's Custom Systems
            </Link>

            <Link to="/planet/custom-systems" className="transition hover:text-white">
              Start a Project
            </Link>
          </div>

          <p className="text-xs leading-5 text-zinc-600">
            {"\u00A9"} 2026 HomePlanet
            <br />
            Built in Okeechobee, Florida
          </p>
        </div>
      </footer>
    </main>
  );
}
