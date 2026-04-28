import { type ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HomePlanetFooter from "../components/HomePlanetFooter";

type PetStatus = "missing" | "safe" | "traveling";

type DemoPet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  color: string;
  photoUrl: string;
  ownerName: string;
  callNumber: string;
  textNumber: string;
  emergencyNote: string;
  temperament: string;
  lastSeen: string;
  rewardText: string;
  status: PetStatus;
};

type FinderFormState = {
  finderName: string;
  callbackNumber: string;
  foundLocation: string;
  message: string;
};

type RadarEvent = {
  time: string;
  title: string;
  detail: string;
};

type CareEventType =
  | "fed"
  | "water"
  | "walked"
  | "potty"
  | "medication"
  | "groomed"
  | "vet"
  | "service";

type CareTimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
  type: CareEventType;
  proof?: string;
};

const PET_BASE_PATH = "/planet/guardian-pet";

const FIRST_PET_SETUP = 25;
const FIRST_PET_MONTHLY = 5;
const EXTRA_PET_SETUP = 15;
const EXTRA_PET_MONTHLY = 3;

const DEMO_PET: DemoPet = {
  id: "bella-demo",
  name: "Bella",
  type: "Dog",
  breed: "Golden Retriever",
  age: "3 years old",
  color: "Golden",
  photoUrl: "/images/bella-demo.jpg",
  ownerName: "Dan",
  callNumber: "863-532-0683",
  textNumber: "863-532-0683",
  emergencyNote:
    "If Bella is safe with you, please tap Report Found Location so we can respond quickly.",
  temperament:
    "Friendly and gentle. May be nervous if scared. Responds to Bella. Loves treats and a calm voice.",
  lastSeen: "Near Taylor Creek / neighborhood park area",
  rewardText: "Reward available upon safe return.",
  status: "missing",
};

const VAMP_PET: DemoPet = {
  id: "vamp",
  name: "Vamp",
  type: "Cat",
  breed: "Domestic Long Hair",
  age: "3 years old",
  color: "Black",
  photoUrl: "/images/bella-demo.jpg",
  ownerName: "HAYLEY",
  callNumber: "903-246-6394",
  textNumber: "903-246-6394",
  emergencyNote:
    "If Vamp is safe with you, please tap Report Found Location so we can respond quickly.",
  temperament:
    "Friendly and gentle. May be nervous if scared. Responds to Vamp. Loves treats and a calm voice.",
  lastSeen: "Near Taylor Creek / neighborhood park area",
  rewardText: "Reward available upon safe return.",
  status: "missing",
};

const RADAR_EVENTS: RadarEvent[] = [
  {
    time: "8:42 AM",
    title: "Vamp marked missing",
    detail: "Owner activated Planet Guardian Rescue Radar.",
  },
  {
    time: "8:55 AM",
    title: "Tag scanned near Taylor Creek",
    detail: "The public rescue page was opened from the collar tag.",
  },
  {
    time: "9:02 AM",
    title: "Finder opened rescue page",
    detail: "Immediate actions became available: call, text, or report found.",
  },
  {
    time: "9:04 AM",
    title: "Finder report started",
    detail: "Location and notes can now flow into the rescue timeline.",
  },
];

const Vamp_CARE_TIMELINE: CareTimelineEvent[] = [
  {
    id: "care-1",
    time: "6:52 AM",
    title: "Breakfast logged",
    detail: "Vamp finished morning meal. Appetite looked normal.",
    type: "fed",
    proof: "Bowl check captured",
  },
  {
    id: "care-2",
    time: "7:08 AM",
    title: "Water refreshed",
    detail: "Fresh water added and bowl level confirmed.",
    type: "water",
  },
  {
    id: "care-3",
    time: "7:24 AM",
    title: "Morning potty break",
    detail: "Bathroom break completed before neighborhood walk.",
    type: "potty",
  },
  {
    id: "care-4",
    time: "7:42 AM",
    title: "Walk completed",
    detail: "18-minute walk logged. Calm pace. No issues noted.",
    type: "walked",
    proof: "Walk route / duration ready",
  },
  {
    id: "care-5",
    time: "1:20 PM",
    title: "Medication confirmed",
    detail: "Midday dose recorded by caregiver.",
    type: "medication",
  },
  {
    id: "care-6",
    time: "4:10 PM",
    title: "Service visit recorded",
    detail:
      "Dog walker / pet service demo: service provider scanned the tag, opened Vamp's timeline, and logged the visit.",
    type: "service",
    proof: "Presence-ready service event",
  },
  {
    id: "care-7",
    time: "5:35 PM",
    title: "Vet follow-up note",
    detail: "Reminder added for checkup and activity monitoring.",
    type: "vet",
  },
];

const INITIAL_FINDER_FORM: FinderFormState = {
  finderName: "",
  callbackNumber: "",
  foundLocation: "",
  message: "",
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function currency(value: number) {
  return `$${value}`;
}

function getPricing(petCount: number) {
  const extraPets = Math.max(0, petCount - 1);
  return {
    petCount,
    extraPets,
    setupTotal: FIRST_PET_SETUP + extraPets * EXTRA_PET_SETUP,
    monthlyTotal: FIRST_PET_MONTHLY + extraPets * EXTRA_PET_MONTHLY,
  };
}

function getStatusPill(status: PetStatus) {
  switch (status) {
    case "missing":
      return {
        label: "Missing",
        classes:
          "border-rose-400/40 bg-rose-500/15 text-rose-200 shadow-[0_0_28px_rgba(244,63,94,0.18)]",
      };
    case "safe":
      return {
        label: "Safe at Home",
        classes:
          "border-emerald-400/40 bg-emerald-500/15 text-emerald-200 shadow-[0_0_28px_rgba(16,185,129,0.18)]",
      };
    case "traveling":
      return {
        label: "Traveling",
        classes:
          "border-sky-400/40 bg-sky-500/15 text-sky-200 shadow-[0_0_28px_rgba(56,189,248,0.18)]",
      };
    default:
      return {
        label: "Unknown",
        classes: "border-white/20 bg-white/10 text-white",
      };
  }
}

function buildSmsHref(number: string, body: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `sms:${cleanNumber}&body=${encodeURIComponent(body)}`;
}

function buildTelHref(number: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `tel:${cleanNumber}`;
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/65">{label}</div>
    </div>
  );
}

function InfoPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-white/78">{body}</p>
    </div>
  );
}

function StepCard({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/5 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
        {index}
      </div>
      <h4 className="mt-3 text-lg font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-white/70">{body}</p>
    </div>
  );
}

function RadarPanel({
  title = "Neighborhood Rescue Radar",
  subtitle = "Each scan and report helps build a clearer recovery timeline.",
  events,
}: {
  title?: string;
  subtitle?: string;
  events: RadarEvent[];
}) {
  return (
    <div className="rounded-[32px] border border-cyan-300/15 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-white/72">{subtitle}</p>

      <div className="mt-6 space-y-4">
        {events.map((event, index) => (
          <div
            key={`${event.time}-${event.title}-${index}`}
            className="flex gap-4 rounded-[22px] border border-white/10 bg-white/5 p-4"
          >
            <div className="flex flex-col items-center">
              <div className="mt-1 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
              {index < events.length - 1 ? (
                <div className="mt-2 h-full min-h-[32px] w-px bg-white/12" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                  {event.time}
                </span>
                <h4 className="text-sm font-semibold text-white sm:text-base">
                  {event.title}
                </h4>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/68">
                {event.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCareTypePill(type: CareEventType) {
  switch (type) {
    case "fed":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
    case "water":
      return "border-sky-400/30 bg-sky-400/10 text-sky-100";
    case "walked":
      return "border-cyan-400/30 bg-cyan-400/10 text-cyan-100";
    case "potty":
      return "border-amber-400/30 bg-amber-400/10 text-amber-100";
    case "medication":
      return "border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-100";
    case "groomed":
      return "border-violet-400/30 bg-violet-400/10 text-violet-100";
    case "vet":
      return "border-rose-400/30 bg-rose-400/10 text-rose-100";
    case "service":
      return "border-white/20 bg-white/10 text-white";
    default:
      return "border-white/20 bg-white/10 text-white";
  }
}

function careTypeLabel(type: CareEventType) {
  switch (type) {
    case "fed":
      return "Fed";
    case "water":
      return "Water";
    case "walked":
      return "Walked";
    case "potty":
      return "Potty";
    case "medication":
      return "Medication";
    case "groomed":
      return "Groomed";
    case "vet":
      return "Vet";
    case "service":
      return "Service Visit";
    default:
      return "Event";
  }
}

function PetCareTimelinePreview({
  events,
}: {
  events: CareTimelineEvent[];
}) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Vamp's care timeline
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            More than a lost pet page
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
            This same tag can later support pet walkers, pooper-scooper companies,
            groomers, sitters, and vet staff. Each visit can become a presence-ready
            care event with proof, timing, and service notes.
          </p>
        </div>

        <div className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          Presence-ready
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <MetricCard value={`${events.length}`} label="recent care events" />
          <MetricCard value="1 tag" label="lost pet + care history" />
          <MetricCard value="Service-ready" label="walkers, vets, groomers" />
        </div>

        <div className="space-y-4">
          {events.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="rounded-[24px] border border-white/10 bg-[#08101f] p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                    getCareTypePill(event.type)
                  )}
                >
                  {careTypeLabel(event.type)}
                </span>
                <span className="text-xs text-white/55">{event.time}</span>
              </div>

              <h4 className="mt-3 text-base font-semibold text-white">
                {event.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {event.detail}
              </p>

              {event.proof ? (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                  {event.proof}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuardianShell({
  children,
  pet,
}: {
  children: ReactNode;
  pet: DemoPet;
}) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-60px] h-[320px] w-[320px] rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute right-[-90px] top-[140px] h-[320px] w-[320px] rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute bottom-[-100px] left-[20%] h-[280px] w-[280px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Planet Guardian Pet
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Live rescue pages for lost pets
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">
                Pet Guardian stays separate from the main Guardian landing for now.
                This page is the dedicated pet tag demo, sales flow, and finder flow.
              </p>
            </div>

            <nav className="flex flex-wrap gap-2">
              <Link
                to={PET_BASE_PATH}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
              >
                Sales Page
              </Link>
              <Link
                to={`${PET_BASE_PATH}/pet/${pet.id}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
              >
                Public QR Demo
              </Link>
              <Link
                to={`${PET_BASE_PATH}/found/${pet.id}`}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/85 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
              >
                Finder Report
              </Link>
              <Link
                to="/planet/guardian"
                className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/18"
              >
                Main Guardian
              </Link>
            </nav>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <HomePlanetFooter />
      </div>
    </div>
  );
}

function GuardianSalesPage({ pet }: { pet: DemoPet }) {
  const scanDemoLink = `${PET_BASE_PATH}/pet/vamp`;
  const [petCount, setPetCount] = useState(1);
  const pricing = getPricing(petCount);

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
            Pet Guardian demo
          </div>

          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            From dumb pet tags to live rescue pages.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            When a pet gets lost, every minute matters. Pet Guardian gives every pet a
            QR-powered rescue page with live status, one-tap owner contact, a fast
            finder report flow, and a neighborhood rescue timeline that feels like a
            real recovery system.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MetricCard value="$25 + $5/mo" label="first pet" />
            <MetricCard value="$15 + $3/mo" label="each extra pet" />
            <MetricCard value="multi-pet ready" label="single or household flow" />
          </div>

          <div className="mt-6 rounded-[24px] border border-emerald-300/20 bg-emerald-400/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              Live pricing
            </p>

            <div className="mt-4 space-y-3 text-sm text-white/85">
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3">
                <span>First pet</span>
                <span>{currency(FIRST_PET_SETUP)} setup + {currency(FIRST_PET_MONTHLY)}/month</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#08101f] px-4 py-3">
                <span>Extra pets</span>
                <span>{currency(EXTRA_PET_SETUP)} setup + {currency(EXTRA_PET_MONTHLY)}/month each</span>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                Choose pet count
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPetCount(count)}
                    className={cn(
                      "rounded-2xl border px-4 py-4 text-left transition",
                      petCount === count
                        ? "border-cyan-300/35 bg-cyan-400/15"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                  >
                    <div className="text-base font-semibold text-white">
                      {count} {count === 1 ? "pet" : "pets"}
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      {count === 1 ? "Single-pet setup" : `${count - 1} extra pet${count - 1 > 1 ? "s" : ""}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#08101f] px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55">setup total</div>
                <div className="mt-2 text-2xl font-semibold text-white">{currency(pricing.setupTotal)}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#08101f] px-4 py-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/55">monthly total</div>
                <div className="mt-2 text-2xl font-semibold text-white">{currency(pricing.monthlyTotal)}/month</div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to={`/planet/guardian-join?item=pet-tag&pets=${petCount}`}
                className="rounded-2xl border border-cyan-300/35 bg-cyan-400/18 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/26"
              >
                Start tag order
              </Link>
              <Link
                to={scanDemoLink}
                className="rounded-2xl border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                Scan Vamp's live rescue page
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`${PET_BASE_PATH}/found/${pet.id}`}
              className="rounded-2xl border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Open finder report page
            </Link>
          </div>

          <p className="mt-6 text-sm leading-6 text-white/68">
            Designed for pet owners, shelters, rescues, vets, groomers, walkers, sitters,
            and neighborhoods.
          </p>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/6 backdrop-blur-xl">
          <div className="relative h-full min-h-[380px]">
            <img src="/images/pet-tag-sales.jpg" alt={`${pet.name} demo pet`}
              className="h-[68vh] w-full object-cover object-center lg:h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/35 to-transparent" />
            <div className="hidden md:block absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <div className="rounded-[24px] border border-white/15 bg-black/35 p-5 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200/90">
                      Demo pet profile
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">
                      {pet.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">
                      {pet.breed} • {pet.age}
                    </p>
                  </div>

                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                      getStatusPill(pet.status).classes
                    )}
                  >
                    {getStatusPill(pet.status).label}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/75">
                  "If I'm lost, please scan." The tag becomes a live rescue page with
                  owner contact, rescue radar activity, notes, and a finder report flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <InfoPanel
          title="The problem"
          body="Most pet tags only show a phone number. If the number is old, unreadable, or unanswered, the rescue stalls fast."
        />
        <InfoPanel
          title="The solution"
          body="Pet Guardian turns a pet tag into a live page that opens instantly when scanned, with clear actions for the person helping."
        />
        <InfoPanel
          title="The bigger play"
          body="The same tag can later support walkers, pooper-scooper services, groomers, sitters, and vets with presence-ready care logging."
        />
      </section>

      <RadarPanel
        subtitle="When a pet is marked missing, Pet Guardian activates a live awareness ring. Each scan and report becomes part of the recovery story."
        events={RADAR_EVENTS}
      />

      <PetCareTimelinePreview events={Vamp_CARE_TIMELINE} />

      <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              How it works
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              A simple flow people understand immediately
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-white/70">
            Keep the hardware simple. Sell the page experience, the recovery speed, and
            the fact that the system creates a real rescue timeline.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StepCard
            index="01"
            title="Owner creates profile"
            body="Pet name, photo, contact number, and rescue notes."
          />
          <StepCard
            index="02"
            title="QR tag goes on collar"
            body="Printed plastic tag, flat square, hole punch, clip, done."
          />
          <StepCard
            index="03"
            title="Finder scans"
            body="The public pet page opens instantly with the next best action."
          />
          <StepCard
            index="04"
            title="Finder reports"
            body="Call, text, or send a found-location report in seconds."
          />
          <StepCard
            index="05"
            title="Pet gets home faster"
            body="A real rescue system instead of hoping a phone number works."
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Prototype tag wording
          </p>
          <div className="mt-5 rounded-[28px] border border-dashed border-cyan-300/35 bg-[#071325] p-6 shadow-[inset_0_0_40px_rgba(34,211,238,0.05)]">
            <div className="mx-auto flex max-w-[320px] flex-col items-center rounded-[28px] border border-white/10 bg-[#0b1020] px-6 py-8 text-center">
              <div className="rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Planet Guardian Pet
              </div>
              <h4 className="mt-4 text-xl font-semibold text-white">
                If I'm lost, please scan
              </h4>
              <div className="mt-5 grid h-36 w-36 place-items-center rounded-2xl border border-white/15 bg-white">
                <div className="grid h-24 w-24 grid-cols-6 gap-[2px] rounded-md bg-white p-[6px]">
                  {Array.from({ length: 36 }).map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "rounded-[1px]",
                        index % 2 === 0 || index % 5 === 0 || index % 7 === 0
                          ? "bg-black"
                          : "bg-white"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-sm text-white/75">HomePlanet.city</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Quick brochure copy
          </p>

          <div className="mt-5 space-y-4 text-sm leading-7 text-white/78 sm:text-[15px]">
            <p>
              <span className="font-semibold text-white">Pet Guardian</span> helps
              lost pets get home faster by turning a pet tag into a live rescue page.
            </p>
            <p>
              When someone scans the tag, they immediately see the pet's name, photo,
              status, owner contact options, and a simple way to report where the pet
              was found.
            </p>
            <p>
              Rescue Radar adds a live awareness layer by turning scans and reports into
              recovery activity the owner, shelter, or rescue can follow.
            </p>
            <p>
              The same tag can later support care visits, dog walking, poop pickup,
              grooming, and vet logs as timestamped pet service events.
            </p>
            <p className="font-semibold text-cyan-100">
              Powered by HomePlanet - a real-world safety layer built for faster reunions
              and trustworthy pet care records.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={scanDemoLink}
              className="rounded-2xl border border-cyan-300/35 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/22"
            >
              Open Vamp's live rescue page
            </Link>
            <Link
              to={`${PET_BASE_PATH}/found/${pet.id}`}
              className="rounded-2xl border border-white/15 bg-white/6 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              Open demo finder form
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function GuardianPetPage({ pet }: { pet: DemoPet }) {
  const smsBody = `Hi ${pet.ownerName}, I found ${pet.name}. I scanned the Planet Guardian pet tag.`;
  const callHref = buildTelHref(pet.callNumber);
  const smsHref = buildSmsHref(pet.textNumber, smsBody);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/6 backdrop-blur-xl">
          <div className="relative min-h-[360px]">
            <img
              src={pet.photoUrl}
              alt={pet.name}
              className="h-[68vh] w-full object-cover object-center lg:h-full"
            />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/30 to-transparent" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Immediate actions
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <a
                href={callHref}
                className="rounded-[22px] border border-emerald-300/30 bg-emerald-400/15 px-4 py-4 text-center text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/22"
              >
                Call Owner
              </a>
              <a
                href={smsHref}
                className="rounded-[22px] border border-sky-300/30 bg-sky-400/15 px-4 py-4 text-center text-sm font-semibold text-sky-100 transition hover:bg-sky-400/22"
              >
                Text Owner
              </a>
              <Link
                to={`${PET_BASE_PATH}/found/${pet.id}`}
                className="rounded-[22px] border border-cyan-300/30 bg-cyan-400/15 px-4 py-4 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/22"
              >
                Report Found Location
              </Link>
            </div>

            <div className="mt-6 rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100/90">
              {pet.emergencyNote}
            </div>

            <div className="mt-4">
              <Link
                to="/planet/guardian-join?item=pet-tag&pets=1"
                className="block rounded-[22px] border border-cyan-300/30 bg-cyan-400/15 px-4 py-4 text-center text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/22"
              >
                Create Your Pet Tag
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InfoPanel title="Owner" body={`${pet.ownerName} • ${pet.callNumber}`} />
            <InfoPanel title="Last seen" body={pet.lastSeen} />
            <InfoPanel title="Temperament" body={pet.temperament} />
            <InfoPanel title="Reward" body={pet.rewardText} />
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Why this works
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <MetricCard value="Fast" label="clear next action" />
              <MetricCard value="Human" label="thank-you rescue tone" />
              <MetricCard value="Live" label="better than number-only tags" />
              <MetricCard value="Community" label="nearby scans create awareness" />
            </div>
          </div>
        </section>
      </div>

      <PetCareTimelinePreview events={Vamp_CARE_TIMELINE} />

      <RadarPanel
        subtitle="Every scan, page open, and report can become part of the live recovery timeline."
        events={RADAR_EVENTS}
      />
    </div>
  );
}

function GuardianFoundPage({ pet }: { pet: DemoPet }) {
  const [form, setForm] = useState<FinderFormState>(INITIAL_FINDER_FORM);
  const [submitted, setSubmitted] = useState(false);

  const summary = useMemo(() => {
    return [
      form.finderName ? `Finder: ${form.finderName}` : null,
      form.callbackNumber ? `Callback: ${form.callbackNumber}` : null,
      form.foundLocation ? `Found at: ${form.foundLocation}` : null,
      form.message ? `Message: ${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }, [form]);

  function updateField<K extends keyof FinderFormState>(
    field: K,
    value: FinderFormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
            Finder report
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Report where you found {pet.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            Keep this quick and simple. The goal is speed. If {pet.name} is safe with
            you, send the location and a short note so the owner can respond fast.
          </p>

          <div className="mt-6 grid gap-3">
            <InfoPanel title="Pet" body={`${pet.name} • ${pet.breed}`} />
            <InfoPanel title="Owner contact" body={`${pet.ownerName} • ${pet.callNumber}`} />
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">
                Your first name
              </span>
              <input
                value={form.finderName}
                onChange={(event) => updateField("finderName", event.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500 focus:border-cyan-300/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">
                Callback number
              </span>
              <input
                value={form.callbackNumber}
                onChange={(event) => updateField("callbackNumber", event.target.value)}
                placeholder="Optional phone number"
                className="w-full rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500 focus:border-cyan-300/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">
                Where did you find {pet.name}?
              </span>
              <input
                value={form.foundLocation}
                onChange={(event) => updateField("foundLocation", event.target.value)}
                placeholder="Street, park, neighborhood, landmark"
                className="w-full rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500 focus:border-cyan-300/50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/85">
                Message
              </span>
              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                placeholder="Vamp is safe with me. I found her near..."
                rows={5}
                className="w-full rounded-2xl border border-white/12 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-gray-500 focus:border-cyan-300/50"
              />
            </label>

            <button
              type="submit"
              className="rounded-2xl border border-cyan-300/35 bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/22"
            >
              Send Report
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Live preview
            </p>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-[#08101f] p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-white/78">
                {summary || "Your finder report preview will appear here."}
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Status
            </p>
            <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
              {submitted ? (
                <div>
                  <h3 className="text-xl font-semibold text-emerald-200">
                    Report captured
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    This is the demo state for today's pitch. Later we can save reports
                    into Supabase and notify the owner live.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Ready to submit
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Fill the form and press Send Report to demonstrate the rescue flow.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard value="Simple" label="low-friction finder flow" />
            <MetricCard value="Sellable" label="good enough for today" />
          </div>
        </section>
      </div>

      <RadarPanel
        title="Live Rescue Timeline"
        subtitle="Finder actions can become timestamped presence events in the Guardian recovery flow."
        events={RADAR_EVENTS}
      />
    </div>
  );
}

export default function GuardianPetTagDemo() {
  const location = useLocation();
  const isVampRoute = location.pathname.includes("/vamp");
  const pet = isVampRoute ? VAMP_PET : DEMO_PET;

  const currentStep = useMemo(() => {
    if (location.pathname.includes("/guardian-pet/found/")) return "found";
    if (location.pathname.includes("/guardian-pet/pet/")) return "pet";
    return "sales";
  }, [location.pathname]);

  return (
    <GuardianShell pet={pet}>
      <div className="mb-6 flex flex-wrap gap-2">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            currentStep === "sales"
              ? "border-cyan-300/35 bg-cyan-400/15 text-cyan-100"
              : "border-white/12 bg-white/5 text-white/60"
          )}
        >
          Sales
        </span>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            currentStep === "pet"
              ? "border-cyan-300/35 bg-cyan-400/15 text-cyan-100"
              : "border-white/12 bg-white/5 text-white/60"
          )}
        >
          QR Landing
        </span>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
            currentStep === "found"
              ? "border-cyan-300/35 bg-cyan-400/15 text-cyan-100"
              : "border-white/12 bg-white/5 text-white/60"
          )}
        >
          Finder Report
        </span>
      </div>

      {currentStep === "sales" && <GuardianSalesPage pet={pet} />}
      {currentStep === "pet" && <GuardianPetPage pet={pet} />}
      {currentStep === "found" && <GuardianFoundPage pet={pet} />}
    </GuardianShell>
  );
}


































