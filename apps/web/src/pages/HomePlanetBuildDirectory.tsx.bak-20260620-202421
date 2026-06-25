import React from "react";

type BuildStatus = "OFFICIAL" | "TESTING" | "ARCHIVE";

type BuildLink = {
  name: string;
  href: string;
  description: string;
  status: BuildStatus;
};

type BuildSection = {
  title: string;
  builds: BuildLink[];
};

const sections: BuildSection[] = [
  {
    title: "Restaurant Systems",
    builds: [
      {
        name: "Crew / Server Ordering Board",
        href: "/planet/restaurant-awareness/crew",
        description: "Server-side table ordering board for food, modifiers, drinks, and active table flow.",
        status: "OFFICIAL",
      },
      {
        name: "Kitchen Board",
        href: "/planet/restaurant-awareness/kitchen",
        description: "Kitchen awareness board for incoming table orders and ready status.",
        status: "OFFICIAL",
      },
      {
        name: "Drinks Board",
        href: "/planet/restaurant-awareness/drinks",
        description: "Drink station board for Sprite, Pepsi, water, lemon, lime, and table drink flow.",
        status: "OFFICIAL",
      },
      {
        name: "Live Board",
        href: "/planet/restaurant-awareness/live",
        description: "Live restaurant awareness view showing table activity and operational status.",
        status: "OFFICIAL",
      },
    ],
  },
  {
    title: "Home Services",
    builds: [
      {
        name: "Live Pages Funnel",
        href: "/planet/live-pages",
        description: "HomePlanet Live Pages sales/intake funnel for showing businesses the live system model.",
        status: "OFFICIAL",
      },
      {
        name: "Home Services Demo",
        href: "/planet/home-services",
        description: "Home services demo landing page showing the customer-facing service experience.",
        status: "OFFICIAL",
      },
      {
        name: "Request Flow",
        href: "/planet/home-services/request",
        description: "Customer request flow for collecting job details without the mess.",
        status: "OFFICIAL",
      },
      {
        name: "Lead Review",
        href: "/planet/home-services/lead",
        description: "Internal lead review page for seeing what came in before action is taken.",
        status: "TESTING",
      },
      {
        name: "Estimate Builder",
        href: "/planet/home-services/estimate",
        description: "Estimate builder flow for service pricing, project details, and quote structure.",
        status: "TESTING",
      },
    ],
  },
  {
    title: "Live Pages / HomePlanet",
    builds: [
      {
        name: "Get Live Intake",
        href: "/planet/get-live",
        description: "Entry intake for businesses that want to get a live operational page built.",
        status: "OFFICIAL",
      },
      {
        name: "Build Queue Board",
        href: "/planet/live-pages/board",
        description: "Internal build queue board for tracking HomePlanet Live Page work.",
        status: "OFFICIAL",
      },
      {
        name: "Event Tracking Board",
        href: "/planet/demo/events?board=homeplanet-live-pages",
        description: "Internal event tracking board for clicks, shares, intake, and live page activity.",
        status: "TESTING",
      },
    ],
  },
  {
    title: "Local / Client Builds",
    builds: [
      {
        name: "Slap-A-Bug",
        href: "/planet/slap-a-bug/impulse-v2",
        description: "Impulse pest-control funnel built around simple problem-first intake.",
        status: "OFFICIAL",
      },
      {
        name: "ICE Construction",
        href: "/planet/ice-construction",
        description: "Construction concept build with active project awareness and idea sharing.",
        status: "TESTING",
      },
      {
        name: "Only The Essentials",
        href: "/planet/only-the-essentials-cleaning",
        description: "Cleaning service live page and request flow for local customer intake.",
        status: "OFFICIAL",
      },
      {
        name: "Swamp Life",
        href: "/planet/swamp-life",
        description: "Local airboat / experience build for moments, trips, and customer-facing presentation.",
        status: "TESTING",
      },
      {
        name: "Hydra",
        href: "/planet/hydra",
        description: "Commercial diving and water infrastructure demo with assets, reports, and dashboard flow.",
        status: "TESTING",
      },
      {
        name: "Smith Property Care",
        href: "/planet/smith-property-care",
        description: "Property care live build with service presentation and job awareness direction.",
        status: "TESTING",
      },
      {
        name: "Okeechobee Together",
        href: "/planet/okeechobee",
        description: "Community board layer for local needs, offers, projects, events, and people helping people.",
        status: "OFFICIAL",
      },
      {
        name: "Guardian Pet",
        href: "/planet/guardian-pet",
        description: "Pet/family care concept for rescue, sitter, veterinarian, lost-and-found, and community support modes.",
        status: "ARCHIVE",
      },
      {
        name: "Hollerboyz",
        href: "/planet/hollerboyz",
        description: "Auto and diesel local build direction for Hollerboyz brand presentation.",
        status: "TESTING",
      },
      {
        name: "Print Shop / Charly’s",
        href: "/planet/charlys",
        description: "Charly’s print shop flow for custom orders, artwork upload, order tracking, and owner review.",
        status: "TESTING",
      },
    ],
  },
];

const statusClass: Record<BuildStatus, string> = {
  OFFICIAL: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  TESTING: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100",
  ARCHIVE: "border-zinc-500/50 bg-zinc-500/10 text-zinc-300",
};

export default function HomePlanetBuildDirectory() {
  return (
    <main className="min-h-screen bg-[#020604] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-emerald-400/20 bg-white/[0.04] p-5 shadow-2xl shadow-emerald-950/30 sm:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
            HomePlanet Internal
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Build Directory
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
            One clean place for live builds, demos, testing boards, and archived routes.
            No hunting. No duplicate confusion. Tap a card and open the build.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {sections.map((section) => (
            <section key={section.title} className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {section.title}
                </h2>
                <div className="mt-2 h-px w-full bg-gradient-to-r from-emerald-400/50 via-white/10 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.builds.map((build) => (
                  <a
                    key={`${section.title}-${build.name}`}
                    href={build.href}
                    className="group block rounded-[24px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/30 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-black leading-tight text-white">
                        {build.name}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-black tracking-[0.18em] ${statusClass[build.status]}`}
                      >
                        {build.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                      {build.description}
                    </p>

                    <p className="mt-4 break-all rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm font-semibold text-emerald-200">
                      https://www.homeplanet.city{build.href}
                    </p>

                    <div className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-emerald-300 transition group-hover:text-emerald-200">
                      Open build →
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

