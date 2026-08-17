import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Doorway = {
  label: string;
  route: string;
  access?: "public" | "working" | "protected";
};

type AtlasSystem = {
  id: string;
  name: string;
  description: string;
  contact?: string;
  status?: string;
  doorways: Doorway[];
  quickReply?: string;
};

type AtlasSection = {
  id: string;
  title: string;
  description: string;
  systems: AtlasSystem[];
};

const PUBLIC_ORIGIN = "https://www.homeplanet.city";

function liveUrl(route: string) {
  if (/^https?:\/\//i.test(route)) return route;
  return `${PUBLIC_ORIGIN}${route}`;
}

function buildReply(system: AtlasSystem) {
  const firstPublic =
    system.doorways.find((doorway) => doorway.access === "public") ??
    system.doorways[0];

  const link = liveUrl(firstPublic.route);
  const arrows = String.fromCodePoint(0x1f447).repeat(3);

  const message =
    system.quickReply ??
    `Here is the working page for ${system.name}. Everything is organized in one place.`;

  return `${message}\n\n${arrows}\n\n${link}`;
}

const sections: AtlasSection[] = [
  {
    id: "businesses",
    title: "Active Businesses",
    description:
      "One card per business. Public pages, boards, intelligence, messages, and internal tools stay together.",
    systems: [
      {
        id: "only-the-essentials",
        name: "Only The Essentials Cleaning",
        contact: "Kaitlin",
        status: "Active HomePlanet business",
        description:
          "Kaitlin's complete customer and operating system, grouped in one place.",
        quickReply:
          "Only The Essentials Cleaning may be able to help. Kaitlin has a simple page where you can review the service and send your cleaning details directly.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/only-the-essentials-cleaning",
            access: "public",
          },
          {
            label: "Request Flow",
            route: "/planet/only-the-essentials/request-v2",
            access: "public",
          },
          {
            label: "Intelligence",
            route: "/planet/only-the-essentials/intelligence",
            access: "working",
          },
          {
            label: "Live Activity",
            route: "/planet/only-the-essentials/live-activity",
            access: "working",
          },
          {
            label: "Messages",
            route: "/planet/only-the-essentials/messages",
            access: "working",
          },
          {
            label: "Impulse",
            route: "/planet/only-the-essentials/impulse",
            access: "working",
          },
          {
            label: "Events",
            route: "/planet/demo/events?board=only-the-essentials",
            access: "working",
          },
        ],
      },
      {
        id: "florida-cooling",
        name: "Florida Cooling",
        contact: "Uriel Manzone and Victor Pineda",
        status: "Trusted provider",
        description:
          "The customer-facing HVAC page and the operating board underneath it.",
        quickReply:
          "Florida Cooling may be able to help. Uriel and Victor handle residential and commercial HVAC work in Okeechobee.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/florida-cooling",
            access: "public",
          },
          {
            label: "Live Board",
            route: "/planet/florida-cooling/board",
            access: "working",
          },
        ],
      },
      {
        id: "vz",
        name: "V&Z Professional Lawncare",
        contact: "Eric Villalobos",
        status: "Trusted provider",
        description:
          "Eric's customer-facing lawn-care page and direct recommendation doorway.",
        quickReply:
          "V&Z Professional Lawncare may be able to help. Eric does strong work on his own route and alongside community projects.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/vz-professional-lawncare",
            access: "public",
          },
          {
            label: "Events",
            route: "/planet/demo/events?board=vz-professional-lawncare",
            access: "working",
          },
        ],
      },
      {
        id: "jones-equipment",
        name: "Jones Equipment Rental & Repair",
        contact: "Daron Jones",
        status: "Active HomePlanet business",
        description:
          "Customer requests, operator work, and rental setup grouped into one system.",
        quickReply:
          "Jones Equipment Rental & Repair has a direct page for equipment rentals and repair requests.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/jones-equipment-rental-repair",
            access: "public",
          },
          {
            label: "Operator Board",
            route: "/planet/jones-equipment-rental-repair/board",
            access: "working",
          },
          {
            label: "Rental Setup",
            route: "/jme/rental-setup",
            access: "working",
          },
        ],
      },
      {
        id: "performance-powerboats",
        name: "Performance Powerboats",
        contact: "Max Soto",
        status: "Active HomePlanet business",
        description:
          "Custom boat builds, repowers, rigging, repairs, and the operating system being built underneath the work.",
        quickReply:
          "Here is the Performance Powerboats page where you can see the work and start a project.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/performance-powerboats",
            access: "public",
          },
        ],
      },
      {
        id: "echols-water",
        name: "Echols Water Testing",
        status: "Working page",
        description:
          "The customer-facing doorway for water-testing information and service.",
        quickReply:
          "Echols Water Testing has a direct page where you can review the service and take the next step.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/echols-water-testing",
            access: "public",
          },
        ],
      },
    ],
  },
  {
    id: "systems",
    title: "HomePlanet Systems",
    description:
      "The main HomePlanet overview, community systems, products, and connected operating systems.",
    systems: [
      {
        id: "homeplanet-overview",
        name: "HomePlanet Systems Overview",
        status: "Start here",
        description:
          "The main visual explanation of how HomePlanet connects needs, people, money, work, proof, and outcomes.",
        doorways: [
          {
            label: "Open Overview",
            route: "/city",
            access: "public",
          },
        ],
      },
      {
        id: "daniel",
        name: "Daniel — Building HomePlanet",
        status: "Founder page",
        description:
          "Daniel's founder story, system-building approach, and working proof.",
        doorways: [
          {
            label: "Founder Page",
            route: "/planet/custom-systems",
            access: "public",
          },
          {
            label: "Live Activity",
            route: "/planet/custom-systems/activity",
            access: "protected",
          },
        ],
      },
      {
        id: "build-system",
        name: "Build Your Live System",
        description:
          "A guided doorway for identifying the business problem and the system needed underneath it.",
        doorways: [
          {
            label: "Start Here",
            route: "/planet/build-your-live-system",
            access: "public",
          },
        ],
      },
      {
        id: "okeechobee-together",
        name: "Okeechobee Together",
        status: "Community system",
        description:
          "Community needs, helpers, local businesses, project outcomes, and the Lawn Program.",
        quickReply:
          "Okeechobee Together connects real local needs with people, businesses, and resources that can help.",
        doorways: [
          {
            label: "Community Page",
            route: "/planet/okeechobee",
            access: "public",
          },
          {
            label: "Command Center",
            route: "/planet/okeechobee/command",
            access: "working",
          },
          {
            label: "Lawn Program",
            route: "/planet/okeechobee/lawn-program",
            access: "public",
          },
        ],
      },
      {
        id: "guardian-pet",
        name: "HomePlanet Guardian Pet Tags",
        status: "Product system",
        description:
          "Pet-tag ordering, finder communication, owner privacy, recovery, and fulfillment.",
        quickReply:
          "HomePlanet Guardian Pet Tags help someone contact the owner quickly without exposing private information.",
        doorways: [
          {
            label: "Product Page",
            route: "/planet/guardian-pet",
            access: "public",
          },
          {
            label: "Bella Demo",
            route: "/planet/guardian-pet/pet/bella-demo",
            access: "public",
          },
          {
            label: "Fulfillment",
            route: "/planet/guardian-pet/fulfillment",
            access: "protected",
          },
        ],
      },
      {
        id: "cow-town",
        name: "Cow Town Tags",
        status: "Product system",
        description:
          "Livestock identification, public QR recovery pages, ranch records, and tag ordering.",
        quickReply:
          "Cow Town Tags connects a visible livestock ear tag to a public recovery page so the right ranch can be reached faster.",
        doorways: [
          {
            label: "Product Page",
            route: "/planet/cow-town-tags",
            access: "public",
          },
          {
            label: "Order Tags",
            route: "/planet/cow-town-tags/order",
            access: "public",
          },
        ],
      },
      {
        id: "transportation",
        name: "HomePlanet Transportation",
        status: "Working system",
        description:
          "A transportation doorway with a connected request flow.",
        doorways: [
          {
            label: "Transportation Page",
            route: "/planet/transportation",
            access: "public",
          },
          {
            label: "Request Transportation",
            route: "/planet/transportation/request",
            access: "public",
          },
        ],
      },
    ],
  },
  {
    id: "demos",
    title: "Working Demos",
    description:
      "Customer-facing examples and the operating experiences underneath them.",
    systems: [
      {
        id: "home-services-demo",
        name: "Okee Dokie Home Services",
        description:
          "The primary general home-services demonstration with a connected Live Board.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/demo/home-services",
            access: "public",
          },
          {
            label: "Live Board",
            route: "/planet/demo/home-services/board",
            access: "working",
          },
        ],
      },
      {
        id: "pest-control-demo",
        name: "Okee Dokie Pest Control",
        description:
          "A pest-control customer request experience with a connected demonstration board.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/demo/pest-control",
            access: "public",
          },
          {
            label: "Live Board",
            route: "/planet/demo/pest-control/board",
            access: "working",
          },
        ],
      },
      {
        id: "ridgeline",
        name: "Ridgeline Home Services",
        description:
          "A production-style home-services flow with requests and intelligence.",
        doorways: [
          {
            label: "Live Page",
            route: "/planet/ridgeline",
            access: "public",
          },
          {
            label: "Request",
            route: "/planet/ridgeline/request",
            access: "public",
          },
          {
            label: "Intelligence",
            route: "/planet/ridgeline/intelligence",
            access: "working",
          },
        ],
      },
      {
        id: "taylor-creek",
        name: "Taylor Creek Demo",
        description:
          "A staff-facing live-work demonstration.",
        doorways: [
          {
            label: "Staff Experience",
            route: "/live/taylor-creek-demo/staff",
            access: "working",
          },
        ],
      },
      {
        id: "captain-jacks",
        name: "Captain Jack's Putt & Play",
        status: "Working demo",
        description:
          "A guest-facing entertainment experience and operating-system demonstration for Captain Jack's Putt & Play.",
        doorways: [
          {
            label: "Live Demo",
            route: "/planet/demo/captain-jacks",
            access: "public",
          },
        ],
      },
      {
        id: "restaurant-awareness",
        name: "Restaurant Awareness",
        description:
          "One restaurant system with separate live, kitchen, drinks, and crew doorways.",
        doorways: [
          {
            label: "Live Overview",
            route: "/planet/restaurant-awareness/live",
            access: "public",
          },
          {
            label: "Kitchen",
            route: "/planet/restaurant-awareness/kitchen",
            access: "working",
          },
          {
            label: "Drinks",
            route: "/planet/restaurant-awareness/drinks",
            access: "working",
          },
          {
            label: "Crew",
            route: "/planet/restaurant-awareness/crew",
            access: "working",
          },
        ],
      },
    ],
  },
  {
    id: "tools",
    title: "Internal Tools",
    description:
      "Fast operational doorways that should not clutter the public systems above.",
    systems: [
      {
        id: "notepad",
        name: "HomePlanet Notepad",
        description:
          "Quick customer capture and working notes.",
        doorways: [
          {
            label: "Add Customer",
            route: "/planet/notepad#add-customer",
            access: "working",
          },
        ],
      },
      {
        id: "unverified",
        name: "Unverified Local Leads",
        status: "Reference only",
        description:
          "Local provider names retained for follow-up before they become trusted Atlas businesses.",
        doorways: [],
      },
    ],
  },
];

const foundationLinks = [
  { label: "GreenBasket", route: "/planet/greenbasket" },
  { label: "WingIt", route: "/planet/wingit" },
  { label: "Delaney's Gym", route: "/planet/delaneys-gym" },
  { label: "Garrett's Laundromat", route: "/planet/garretts-laundromat" },
  { label: "Commons Coffee", route: "/planet/commons-coffee" },
  { label: "Community Pulse", route: "/planet/community-pulse" },
  { label: "Reasons To Show Up", route: "/planet/reasons-to-show-up" },
  { label: "Human Circulation", route: "/planet/human-circulation" },
  { label: "Awareness Layer", route: "/planet/awareness-layer" },
];

export default function EcosystemAtlasV2Page() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState<string[]>([
    "businesses",
    "systems",
  ]);
  const [openSystem, setOpenSystem] = useState<string | null>(null);
  const [copiedSystem, setCopiedSystem] = useState<string | null>(null);
  const [globalRepliesOpen, setGlobalRepliesOpen] = useState(false);

  const filteredSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return sections;

    return sections
      .map((section) => ({
        ...section,
        systems: section.systems.filter((system) => {
          const searchable = [
            system.name,
            system.contact,
            system.status,
            system.description,
            ...system.doorways.map((doorway) => doorway.label),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchable.includes(normalized);
        }),
      }))
      .filter((section) => section.systems.length > 0);
  }, [query]);

  function toggleSection(id: string) {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function openLocal(route: string) {
    navigate(route);
  }

  function openLive(route: string) {
    window.location.assign(liveUrl(route));
  }

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedSystem(id);

    window.setTimeout(() => {
      setCopiedSystem((current) => (current === id ? null : current));
    }, 1600);
  }

  const arrows = String.fromCodePoint(0x1f447).repeat(3);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <header className="rounded-[2rem] border border-lime-400/20 bg-zinc-950 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.4)] md:p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-lime-400">
            HomePlanet Atlas
          </div>

          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[0.98] md:text-6xl">
            Everything has a place.
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
            Businesses stay together. Systems stay together. Public pages,
            boards, intelligence, replies, and internal tools are grouped under
            the work they belong to.
          </p>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search business, system, person, page, board..."
            className="mt-6 w-full rounded-2xl border border-white/10 bg-black px-4 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-600 focus:border-lime-400/60"
          />
        </header>

        <section className="mt-5 rounded-3xl border border-lime-400/25 bg-gradient-to-br from-lime-400/[0.08] to-transparent p-5 md:p-7">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-lime-400">
            Start Here
          </div>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">
                HomePlanet Systems Overview
              </h2>

              <p className="mt-2 max-w-2xl leading-7 text-zinc-400">
                See the main visual explanation of how real needs become
                organized action, visible money, working systems, proof, and
                outcomes.
              </p>
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => openLocal("/city")}
                className="rounded-xl bg-lime-400 px-4 py-3 text-sm font-black text-black"
              >
                Open Local
              </button>

              <button
                type="button"
                onClick={() => openLive("/city")}
                className="rounded-xl border border-lime-400/30 bg-lime-400/10 px-4 py-3 text-sm font-black text-lime-300"
              >
                Open Live
              </button>

              <button
                type="button"
                onClick={() => openLocal("/planet/demo/events")}
                className="col-span-2 rounded-xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm font-black text-sky-200 sm:col-span-1"
              >
                Global Events
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950">
          <button
            type="button"
            onClick={() => setGlobalRepliesOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
          >
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-lime-400">
                Global Quick Replies
              </div>
              <div className="mt-1 text-xl font-black">
                General replies and follow-ups
              </div>
            </div>

            <span className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm font-black">
              {globalRepliesOpen ? "Close" : "Open"}
            </span>
          </button>

          {globalRepliesOpen ? (
            <div className="grid gap-3 border-t border-white/10 p-5 md:grid-cols-2 md:p-6">
              {[
                {
                  id: "working-page",
                  title: "Send Working Page",
                  text: `Here is the working page where you can see everything and take the next step:\n\n${arrows}\n\nPASTE LINK HERE`,
                },
                {
                  id: "request-received",
                  title: "Request Received",
                  text: "Hi, this is Daniel with HomePlanet. We received your request and are reviewing the details now. We will follow up as soon as we can.",
                },
                {
                  id: "checking-back",
                  title: "Checking Back",
                  text: "Hi, this is Daniel checking back with you. I wanted to make sure you received the page and see whether you still need help.",
                },
                {
                  id: "how-to-help",
                  title: "How To Help",
                  text: `Thank you for wanting to help. The best place to start is right here:\n\n${arrows}\n\nPASTE LINK HERE`,
                },
              ].map((reply) => (
                <article
                  key={reply.id}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <h3 className="font-black">{reply.title}</h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-400">
                    {reply.text}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyText(reply.id, reply.text)}
                    className="mt-4 w-full rounded-xl border border-lime-400/25 bg-lime-400/10 px-3 py-3 text-sm font-black text-lime-300"
                  >
                    {copiedSystem === reply.id ? "Copied" : "Copy Reply"}
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <main className="mt-6 space-y-5">
          {filteredSections.map((section) => {
            const sectionOpen =
              query.trim().length > 0 || openSections.includes(section.id);

            return (
              <section
                key={section.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center justify-between gap-5 p-5 text-left md:p-7"
                >
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-lime-400">
                      {section.systems.length} grouped systems
                    </div>

                    <h2 className="mt-2 text-2xl font-black md:text-3xl">
                      {section.title}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                      {section.description}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-xl border border-white/10 bg-black px-4 py-2 text-sm font-black">
                    {sectionOpen ? "Close" : "Open"}
                  </span>
                </button>

                {sectionOpen ? (
                  <div className="grid gap-4 border-t border-white/10 p-4 md:grid-cols-2 md:p-6">
                    {section.systems.map((system) => {
                      const replyOpen = openSystem === system.id;

                      return (
                        <article
                          key={system.id}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-black/35"
                        >
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                {system.status ? (
                                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-lime-400">
                                    {system.status}
                                  </div>
                                ) : null}

                                <h3 className="mt-1 text-xl font-black">
                                  {system.name}
                                </h3>

                                {system.contact ? (
                                  <p className="mt-1 text-sm font-bold text-zinc-500">
                                    {system.contact}
                                  </p>
                                ) : null}
                              </div>

                              <span className="rounded-full border border-white/10 bg-zinc-950 px-2.5 py-1 text-xs font-black text-zinc-400">
                                {system.doorways.length}{" "}
                                {system.doorways.length === 1
                                  ? "doorway"
                                  : "doorways"}
                              </span>
                            </div>

                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                              {system.description}
                            </p>

                            {system.doorways.length > 0 ? (
                              <div className="mt-4 grid grid-cols-2 gap-2">
                                {system.doorways.map((doorway) => (
                                  <div
                                    key={`${system.id}-${doorway.route}`}
                                    className="rounded-xl border border-white/10 bg-zinc-950 p-3"
                                  >
                                    <div className="text-xs font-black text-white">
                                      {doorway.label}
                                    </div>

                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-600">
                                      {doorway.access ?? "working"}
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openLocal(doorway.route)
                                        }
                                        className="rounded-lg border border-white/10 px-2 py-2 text-xs font-black"
                                      >
                                        Local
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          openLive(doorway.route)
                                        }
                                        className="rounded-lg border border-lime-400/25 bg-lime-400/10 px-2 py-2 text-xs font-black text-lime-300"
                                      >
                                        Live
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3 text-sm text-amber-200">
                                Bosch Well & Septic and Scott's Drilling remain
                                unverified references until their details are
                                confirmed.
                              </div>
                            )}

                            {system.quickReply ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenSystem(
                                    replyOpen ? null : system.id
                                  )
                                }
                                className="mt-4 w-full rounded-xl border border-lime-400/25 bg-lime-400/10 px-3 py-3 text-sm font-black text-lime-300"
                              >
                                {replyOpen
                                  ? "Close Quick Reply"
                                  : "Quick Reply"}
                              </button>
                            ) : null}
                          </div>

                          {replyOpen ? (
                            <div className="border-t border-lime-400/15 bg-lime-400/[0.035] p-4">
                              <div className="text-xs font-black uppercase tracking-[0.16em] text-lime-400">
                                Prepared Reply
                              </div>

                              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-300">
                                {buildReply(system)}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  copyText(
                                    `${system.id}-reply`,
                                    buildReply(system)
                                  )
                                }
                                className="mt-4 w-full rounded-xl bg-lime-400 px-3 py-3 text-sm font-black text-black"
                              >
                                {copiedSystem === `${system.id}-reply`
                                  ? "Reply Copied"
                                  : "Copy Reply"}
                              </button>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}

          <section className="rounded-3xl border border-white/10 bg-zinc-950 p-5 md:p-7">
            <button
              type="button"
              onClick={() =>
                setOpenSections((current) =>
                  current.includes("foundation")
                    ? current.filter((item) => item !== "foundation")
                    : [...current, "foundation"]
                )
              }
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                  Preserved
                </div>
                <h2 className="mt-2 text-2xl font-black">
                  Foundation & Concept Pages
                </h2>
              </div>

              <span className="rounded-xl border border-white/10 bg-black px-4 py-2 text-sm font-black">
                {openSections.includes("foundation") ? "Close" : "Open"}
              </span>
            </button>

            {openSections.includes("foundation") ? (
              <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {foundationLinks.map((item) => (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => openLocal(item.route)}
                    className="rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-left text-sm font-black text-zinc-300"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}