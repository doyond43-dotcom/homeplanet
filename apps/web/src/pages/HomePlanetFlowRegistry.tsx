import React from "react";

type FlowStatus = "ACTIVE" | "TESTING" | "REBUILD" | "ARCHIVE";

type FlowEntry = {
  name: string;
  buildRoute: string;
  status: FlowStatus;
  problem: string;
  users: string;
  mainFlow: string[];
  uniqueMechanism: string;
  truthChain: string;
  protectableNotes: string[];
};

type RebuildCandidate = {
  name: string;
  whyItMatters: string;
  rebuildDirection: string;
  futureStatus: string;
};

const flows: FlowEntry[] = [
  {
    name: "Restaurant Table Awareness System",
    buildRoute: "/planet/restaurant-awareness/crew",
    status: "ACTIVE",
    problem:
      "Restaurants lose awareness between table, server, kitchen, drinks, owner, and payment status.",
    users: "Servers, kitchen staff, drink station, owner, and live awareness board.",
    mainFlow: [
      "Table becomes an active operational node.",
      "Server adds food, drinks, modifiers, and table state.",
      "Kitchen receives the food work.",
      "Drink board receives the drink work.",
      "Live board shows operational status across the floor.",
      "The table state keeps moving until service is complete.",
    ],
    uniqueMechanism:
      "The table is treated like a live operational object instead of just a static order ticket.",
    truthChain:
      "Table action → server order → kitchen/drink work → ready status → live awareness → customer outcome.",
    protectableNotes: [
      "Separated food, drink, crew, and live board layers tied to one table state.",
      "Table-first awareness model instead of menu-first ordering.",
      "Operational restaurant status shown as live workflow, not just POS data.",
    ],
  },
  {
    name: "Home Services Live Job Chain",
    buildRoute: "/planet/home-services",
    status: "TESTING",
    problem:
      "Small service businesses lose jobs inside calls, messages, photos, estimates, payments, and scattered notes.",
    users: "Customer, owner, estimator, crew, and payment follow-up.",
    mainFlow: [
      "Customer starts through a simple request flow.",
      "Lead becomes reviewable before work starts.",
      "Estimate captures service details and modifiers.",
      "Job workspace carries customer, tools, photos, notes, messages, and payment.",
      "Before/after proof and payment close the loop.",
    ],
    uniqueMechanism:
      "The page becomes the operational path from customer request to proof and payment.",
    truthChain:
      "Request → lead review → estimate → scheduled work → photos/proof → payment → completed job history.",
    protectableNotes: [
      "Service live page that turns intake into structured operations.",
      "Estimate modifiers capture hidden labor, friction, and real-world conditions.",
      "Proof chain connects photos, payment, and job status into one operational record.",
    ],
  },
  {
    name: "Live Pages Build Queue System",
    buildRoute: "/planet/live-pages",
    status: "ACTIVE",
    problem:
      "Businesses ask for websites but actually need intake, organization, customer clarity, proof, and operational awareness.",
    users: "HomePlanet, local business owners, leads, and internal build operators.",
    mainFlow: [
      "Business enters through Live Pages offer/intake.",
      "Lead lands in a reviewable system.",
      "Build queue tracks who is waiting and what stage they are in.",
      "Event board tracks clicks, shares, messages, and funnel movement.",
      "Finished build graduates into the build directory.",
    ],
    uniqueMechanism:
      "HomePlanet sells the live operational layer, not a generic website package.",
    truthChain:
      "Message/intake → lead review → build queue → live page → event tracking → finished build directory.",
    protectableNotes: [
      "First-come, first-served local live page queue tied to operational build status.",
      "Business intake connected directly to a build board and event tracking.",
      "Finished systems graduate into a verified internal build registry.",
    ],
  },
  {
    name: "Okeechobee Together Public Awareness / Private Control",
    buildRoute: "/planet/okeechobee",
    status: "ACTIVE",
    problem:
      "Community help gets scattered across comments, screenshots, posts, messages, and unverified public submissions.",
    users: "Community viewers, internal organizers, helpers, coordinators, and local project leads.",
    mainFlow: [
      "Public sees approved community needs and stories.",
      "Creation stays internal or admin-controlled.",
      "Projects can have helpers, materials, tasks, and updates.",
      "Public awareness stays separate from operational control.",
      "Finished outcomes become visible community proof.",
    ],
    uniqueMechanism:
      "Public awareness is separated from public creation so community energy does not become uncontrolled chaos.",
    truthChain:
      "Need/story → internal review → public awareness → helper coordination → project work → outcome proof.",
    protectableNotes: [
      "Read-only public community board with private creation and coordination controls.",
      "Community project workflow tied to helpers, materials, tasks, and public story.",
      "Local trust system that avoids open public posting while still creating visibility.",
    ],
  },
  {
    name: "Hollerboyz Problem-First Local Service Flow",
    buildRoute: "/planet/hollerboyz",
    status: "TESTING",
    problem:
      "Local service sites overload people with generic sections instead of helping them say what is actually wrong.",
    users: "Customer, shop owner, mechanic, diesel/auto service operator.",
    mainFlow: [
      "Strong brand-first hero.",
      "Customer chooses the real problem they are dealing with.",
      "The page directs them toward a simple intake/action path.",
      "The business gets clearer context before the conversation starts.",
    ],
    uniqueMechanism:
      "The page starts with the real-world customer problem instead of a generic website pitch.",
    truthChain:
      "Customer problem → selected service direction → intake context → shop action → operational follow-up.",
    protectableNotes: [
      "Problem-button-first local service entry flow.",
      "Brand-first page structure with minimal sections and high readability.",
      "Customer issue classification before manual conversation begins.",
    ],
  },
];

const rebuildCandidates: RebuildCandidate[] = [
  {
    name: "Pet Tag / Guardian Pet",
    whyItMatters:
      "Pet identity, care, lost-and-found, sitter, rescue, vet, and family support can all become one trusted record.",
    rebuildDirection:
      "Rebuild as a clean guardian profile with public/private modes and care-event history.",
    futureStatus: "Candidate for Guardian / Pet Care system.",
  },
  {
    name: "Experience Planet",
    whyItMatters:
      "Tours, escape rooms, zoos, petting zoos, airboat rides, and attractions need memory pages, booking flow, and visit proof.",
    rebuildDirection:
      "Rebuild as a guest experience system: check-in, moments, photos, shareable memory, and return interest.",
    futureStatus: "Candidate for Experience / Attraction system.",
  },
  {
    name: "Mechanic / Taylor Creek Layer",
    whyItMatters:
      "The auto repair flow has strong operational bones: intake, drawers, work order, invoice, board, and customer clarity.",
    rebuildDirection:
      "Duplicate without Taylor Creek branding as a generic auto repair/mechanic demo.",
    futureStatus: "Candidate for Auto Repair / Mechanic system.",
  },
  {
    name: "Lake / Airboat / Tour Memory Pages",
    whyItMatters:
      "A local trip should not end when the boat ride ends. The memory can become the follow-up, share, and referral layer.",
    rebuildDirection:
      "Connect trip request, visit moments, photo proof, guide notes, and memory page.",
    futureStatus: "Candidate for Tour / Outdoor Experience system.",
  },
  {
    name: "Community Workforce / Helper Board",
    whyItMatters:
      "Local students, helpers, trades, and community projects need a safe way to connect work, experience, proof, and trust.",
    rebuildDirection:
      "Rebuild around internal approval, helper matching, project tasks, proof, and community outcome.",
    futureStatus: "Candidate for Workforce / Community Support system.",
  },
];

const statusClass: Record<FlowStatus, string> = {
  ACTIVE: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  TESTING: "border-yellow-300/40 bg-yellow-300/10 text-yellow-100",
  REBUILD: "border-blue-300/40 bg-blue-300/10 text-blue-100",
  ARCHIVE: "border-zinc-500/50 bg-zinc-500/10 text-zinc-300",
};

export default function HomePlanetFlowRegistry() {
  return (
    <main className="min-h-screen bg-[#020604] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-emerald-400/20 bg-white/[0.04] p-5 shadow-2xl shadow-emerald-950/30 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">
                HomePlanet Internal
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                Flow Registry
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300 sm:text-lg">
                The build directory shows what exists. This registry explains why the flow matters,
                what makes it HomePlanet, and what may be worth protecting or documenting further.
              </p>
            </div>

            <a
              href="/planet/builds"
              className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-3 text-center text-sm font-black uppercase tracking-[0.18em] text-emerald-200 transition hover:bg-emerald-400/20"
            >
              Build Directory
            </a>
          </div>
        </header>

        <section className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm leading-6 text-zinc-300">
          <strong className="text-white">Internal note:</strong> This is invention memory and flow documentation.
          It does not claim anything has been legally filed, granted, or patented. Use it as prep material for later legal review.
        </section>

        <section>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Active Flow DNA
          </h2>
          <div className="mt-2 h-px w-full bg-gradient-to-r from-emerald-400/50 via-white/10 to-transparent" />
        </section>

        <div className="grid grid-cols-1 gap-5">
          {flows.map((flow) => (
            <article
              key={flow.name}
              className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5 shadow-xl shadow-black/30 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                    {flow.name}
                  </h2>
                  <a
                    href={flow.buildRoute}
                    className="mt-3 inline-block break-all text-sm font-bold text-emerald-300 hover:text-emerald-200"
                  >
                    {flow.buildRoute}
                  </a>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full border px-3 py-1 text-[11px] font-black tracking-[0.18em] ${statusClass[flow.status]}`}
                >
                  {flow.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Problem
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{flow.problem}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Users
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{flow.users}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Main Flow
                </p>
                <ol className="mt-3 space-y-2 pl-5 text-sm leading-6 text-zinc-300">
                  {flow.mainFlow.map((item) => (
                    <li key={item} className="list-decimal">
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Unique Mechanism
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {flow.uniqueMechanism}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                    Truth Chain
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{flow.truthChain}</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                  Protectable / Review Notes
                </p>
                <ul className="mt-3 space-y-2 pl-5 text-sm leading-6 text-zinc-200">
                  {flow.protectableNotes.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-4">
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Rebuild Candidates
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-300">
            Old boards, buried demos, and unfinished gold live here until they are rebuilt,
            tested, and worthy of the official build directory.
          </p>
          <div className="mt-2 h-px w-full bg-gradient-to-r from-blue-300/50 via-white/10 to-transparent" />
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rebuildCandidates.map((candidate) => (
            <article
              key={candidate.name}
              className="rounded-[24px] border border-blue-300/20 bg-blue-300/[0.045] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-black text-white">{candidate.name}</h3>
                <span className="rounded-full border border-blue-300/40 bg-blue-300/10 px-3 py-1 text-[11px] font-black tracking-[0.18em] text-blue-100">
                  REBUILD
                </span>
              </div>

              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                Why It Matters
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{candidate.whyItMatters}</p>

              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                Rebuild Direction
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{candidate.rebuildDirection}</p>

              <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm font-bold text-zinc-200">
                {candidate.futureStatus}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
