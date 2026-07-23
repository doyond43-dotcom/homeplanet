import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  ClipboardList,
  House,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

type HomeServiceRequest = {
  service: string;
  jobType: string;
  timing: string;
  propertyArea: string;
  name: string;
  phone: string;
  notes: string;
  createdAt: string;
  status: string;
};

const serviceQuestions: Record<string, string[]> = {
  "Lawn & Yard Care": [
    "Mowing",
    "Trimming / Weed Eating",
    "Yard Cleanup",
    "Overgrown Property",
    "Not Sure",
  ],
  "Pressure Cleaning": [
    "Driveway / Walkway",
    "Patio / Pool Area",
    "House Exterior",
    "Fence",
    "Other Surface",
  ],
  "Handyman / Repairs": [
    "Small Repair",
    "Installation",
    "Assembly",
    "Exterior Repair",
    "Not Sure Yet",
  ],
  "Exterior Cleaning": [
    "House Exterior",
    "Windows",
    "Fence",
    "Outdoor Area",
    "General Cleanup",
  ],
  "Property Maintenance": [
    "Routine Upkeep",
    "Recurring Service",
    "Property Check",
    "Cleanup",
    "Multiple Tasks",
  ],
  "Other Home Service": [
    "I Know What I Need",
    "I Need Help Figuring It Out",
    "Multiple Things",
    "Something Else",
  ],
};
const serviceOptions = [
  {
    name: "Lawn & Yard Care",
    summary: "Mowing, trimming, cleanup, and overgrown property help.",
    detail:
      "Good for regular mowing, edging, trim work, light cleanup, and general yard attention.",
  },
  {
    name: "Pressure Cleaning",
    summary: "Driveways, walkways, patios, and exterior surface cleaning.",
    detail:
      "Good for concrete, pavers, patios, sidewalks, pool decks, and other outdoor surfaces that need a visible refresh.",
  },
  {
    name: "Handyman / Repairs",
    summary: "Small fixes, install help, and general repair work.",
    detail:
      "Good for smaller jobs that need attention without a long contractor process or a confusing intake form.",
  },
  {
    name: "Exterior Cleaning",
    summary: "House exteriors, fences, outdoor areas, and property cleanup.",
    detail:
      "Good for jobs where appearance, buildup, dirt, or outdoor presentation needs attention.",
  },
  {
    name: "Property Maintenance",
    summary: "Recurring upkeep and general property support.",
    detail:
      "Good for routine property needs that come up repeatedly and benefit from a simple organized request flow.",
  },
  {
    name: "Other Home Service",
    summary: "Not sure yet? Start the request anyway.",
    detail:
      "The customer does not need to perfectly classify the work first. The system can still collect the right basics and move it forward.",
  },
];

export default function DemoHomeServicesLandingPage() {
  const [selectedService, setSelectedService] = useState("Pressure Cleaning");
  const [showMoreTrust, setShowMoreTrust] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [requestForm, setRequestForm] = useState({
    jobType: "",
    timing: "",
    propertyArea: "",
    name: "",
    phone: "",
    notes: "",
  });


  const activeService = useMemo(() => {
    return (
      serviceOptions.find((service) => service.name === selectedService) ||
      serviceOptions[1]
    );
  }, [selectedService]);
  const activeJobTypes =
    serviceQuestions[selectedService] || serviceQuestions["Other Home Service"];

  function chooseService(service: string) {
    setSelectedService(service);
    setRequestOpen(false);
    setSubmitted(false);
    setRequestForm((current) => ({
      ...current,
      jobType: "",
    }));
  }

  function updateRequestField(
    field: keyof typeof requestForm,
    value: string,
  ) {
    setRequestForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startRequestFromHero() {
    document
      .getElementById("home-services-next")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openRequestForm() {
    setRequestOpen(true);
    setSubmitted(false);

    window.setTimeout(() => {
      document
        .getElementById("home-service-request")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function closeRequestForm() {
    setRequestOpen(false);

    window.setTimeout(() => {
      document
        .getElementById("home-services-next")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  function submitHomeServiceRequest(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const request: HomeServiceRequest = {
      service: selectedService,
      ...requestForm,
      createdAt: new Date().toISOString(),
      status: "New Request",
    };

    const storageKey = "hp-demo-home-services-requests";
    const existing = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    ) as HomeServiceRequest[];

    localStorage.setItem(
      storageKey,
      JSON.stringify([request, ...existing]),
    );

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020706] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.055),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-[1120px] px-5 pb-16 pt-6 sm:px-8 lg:px-10 lg:pt-8">
        {/* BRAND / HEADER */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <a
            href="/planet/demo/home-services"
            aria-label="Okee Dokie Home Services home"
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#80df00]/55 bg-[#80df00]/10 shadow-[0_0_26px_rgba(126,224,0,0.10)]">
              <House
                className="h-6 w-6 text-[#80df00]"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate text-lg font-black tracking-[-0.025em] sm:text-xl">
                OKEE DOKIE
              </div>
              <div className="truncate text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00] sm:text-xs">
                Home Services
              </div>
            </div>
          </a>

          <a
            href="tel:+18635550147"
            className="flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl border border-[#80df00]/40 bg-[#80df00]/10 px-4 text-sm font-black transition hover:border-[#80df00]/80 hover:bg-[#80df00]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
          >
            <Phone className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </header>

        {/* HERO */}
        <section className="pt-12 text-center sm:pt-16 lg:pt-20">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
            Local Home Service Demo
          </p>

          <h1 className="mx-auto mt-5 max-w-[900px] text-[clamp(3.25rem,10vw,6.9rem)] font-black leading-[0.88] tracking-[-0.065em]">
            One place for
            <span className="mt-2 block text-[#80df00]">
              the work your home needs.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[680px] text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Yard care, exterior cleaning, repairs, maintenance, and everyday
            property services without the runaround.
          </p>

          <div className="mx-auto mt-8 grid max-w-[680px] gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={startRequestFromHero}
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b7ff59] focus-visible:ring-offset-2 focus-visible:ring-offset-[#020706]"
            >
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
              Tell Us What You Need
            </button>

            <a
              href="tel:+18635550147"
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#80df00]/35 bg-black/70 px-6 font-black text-white transition hover:-translate-y-0.5 hover:border-[#80df00]/75 hover:bg-[#80df00]/10 hover:shadow-[0_0_30px_rgba(126,224,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
            >
              <Phone className="h-5 w-5 text-[#80df00]" aria-hidden="true" />
              Call Okee Dokie
            </a>
          </div>

          <div className="mx-auto mt-5 flex max-w-[860px] flex-wrap justify-center gap-2">
            {[
              {
                label: "Local Home Service",
                icon: House,
              },
              {
                label: "Simple Requests",
                icon: ClipboardList,
              },
              {
                label: "Clear Follow-Up",
                icon: ShieldCheck,
              },
            ].map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-[42px] items-center gap-2 rounded-full border border-white/16 bg-white/[0.025] px-4 text-[10px] font-black uppercase tracking-[0.13em] text-white/78"
              >
                <Icon className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto mt-10 max-w-[1040px] overflow-hidden rounded-[2rem] border border-[#80df00]/25 bg-[#06100a] shadow-[0_24px_90px_rgba(0,0,0,0.55),0_0_50px_rgba(126,224,0,0.06)] sm:mt-12">
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_62%,rgba(2,7,6,0.82)_100%)]" />

            <img
                src="/images/okee-dokie-home-services-hero-1600.jpg"
                srcSet="/images/okee-dokie-home-services-hero-900.jpg 900w, /images/okee-dokie-home-services-hero-1600.jpg 1600w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.34)_52%,rgba(0,0,0,0.10)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#80df00] text-black shadow-[0_0_34px_rgba(126,224,0,0.26)] transition group-hover:scale-105">
                  <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                  Meet The Crew
                </p>

                <h3 className="mt-2 max-w-[420px] text-3xl font-black tracking-[-0.04em]">
                  Know who is showing up before the work starts.
                </h3>

                <p className="mt-3 max-w-[480px] text-sm leading-6 text-white/70">
                  A short welcome video can introduce the business, explain how
                  service works, and make the first contact feel human.
                </p>
              </div>
            </button>

            {/* VIDEO CARD 2 */}
            <button
              type="button"
              className="group relative min-h-[370px] overflow-hidden rounded-[2rem] border border-white/12 bg-black text-left shadow-[0_24px_70px_rgba(0,0,0,0.42)] transition hover:-translate-y-1 hover:border-[#80df00]/55 hover:shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_34px_rgba(126,224,0,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
              aria-label="Play job walkthrough demo video"
            >
              <img
                src="/images/okee-dokie-mosquito-fogging-trust-1200.jpg"
                srcSet="/images/okee-dokie-mosquito-fogging-trust-700.jpg 700w, /images/okee-dokie-mosquito-fogging-trust-1200.jpg 1200w"
                sizes="(max-width: 768px) 100vw, 50vw"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.34)_52%,rgba(0,0,0,0.10)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#80df00] text-black shadow-[0_0_34px_rgba(126,224,0,0.26)] transition group-hover:scale-105">
                  <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                  See The Work
                </p>

                <h3 className="mt-2 max-w-[420px] text-3xl font-black tracking-[-0.04em]">
                  Show the job instead of just describing it.
                </h3>

                <p className="mt-3 max-w-[480px] text-sm leading-6 text-white/70">
                  Before-and-after proof, walkthroughs, and real work clips help
                  customers understand what they are hiring.
                </p>
              </div>
            </button>
          </div>

          {/* TRUST SIGNALS */}
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Clear Expectations",
                copy: "Customers can understand the service and next step before anyone arrives.",
              },
              {
                icon: MessageCircle,
                title: "Direct Communication",
                copy: "Requests, follow-up, scheduling, and updates stay connected.",
              },
              {
                icon: Star,
                title: "Real Proof",
                copy: "Reviews, photos, completed work, and follow-up can live together.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.028] p-5 transition hover:border-[#80df00]/35 hover:bg-[#80df00]/[0.035]"
              >
                <Icon className="h-7 w-7 text-[#80df00]" aria-hidden="true" />

                <h3 className="mt-4 text-xl font-black">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/60">
                  {copy}
                </p>
              </article>
            ))}
          </div>

          {/* EXPANDABLE TRUST */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowMoreTrust((current) => !current)}
              aria-expanded={showMoreTrust}
              className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-[#80df00]/25 bg-[#80df00]/[0.035] px-5 text-sm font-black transition hover:border-[#80df00]/55 hover:bg-[#80df00]/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
            >
              {showMoreTrust ? (
                <>
                  Show Less
                  <ChevronUp className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
                </>
              ) : (
                <>
                  See More From Okee Dokie
                  <ChevronDown className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
                </>
              )}
            </button>

            {showMoreTrust && (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <article className="rounded-[1.75rem] border border-[#80df00]/20 bg-[linear-gradient(135deg,rgba(7,15,10,0.95),rgba(0,5,3,0.96))] p-6 sm:p-7">
                  <p className="text-lg tracking-[0.14em] text-[#80df00]">
                    ★★★★★
                  </p>

                  <blockquote className="mt-4 text-xl font-bold leading-8 text-white/88">
                    “Easy to reach, clear about what was being done, and the
                    whole process was simple from beginning to end.”
                  </blockquote>

                  <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#80df00]">
                    Demo Customer Review
                  </p>
                </article>

                <article className="rounded-[1.75rem] border border-[#80df00]/20 bg-[linear-gradient(135deg,rgba(7,15,10,0.95),rgba(0,5,3,0.96))] p-6 sm:p-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                    Built Into The Workflow
                  </p>

                  <h3 className="mt-4 text-3xl font-black tracking-[-0.04em]">
                    Trust does not stop at the landing page.
                  </h3>

                  <p className="mt-4 text-base leading-7 text-white/66">
                    The same job can carry its request details, estimate,
                    approval, schedule, communication, payment, before-and-after
                    proof, and customer follow-up underneath.
                  </p>

                  <a
                    href="/planet/demo/home-services/board"
                    className="mt-6 inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#80df00] px-5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_30px_rgba(126,224,0,0.18)]"
                  >
                    See the Working Side
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
