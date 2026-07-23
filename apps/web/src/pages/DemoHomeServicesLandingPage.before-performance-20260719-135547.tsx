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
              src="/images/okee-dokie-home-services-hero.png"
              alt="Okee Dokie Home Services crew providing multiple residential property services"
              width="1600"
              height="900"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="aspect-[16/10] w-full object-cover object-center sm:aspect-[16/9]"
            />

            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-left sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#80df00]/35 bg-black/70 px-4 py-2 backdrop-blur-sm">
                <Wrench className="h-4 w-4 text-[#80df00]" aria-hidden="true" />
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/88">
                  One request. A clear next step.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="home-services-next" className="pt-16 sm:pt-20">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
              Start Here
            </p>

            <h2 className="mx-auto mt-4 max-w-[760px] text-3xl font-black tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              What can we help with?
            </h2>

            <p className="mx-auto mt-4 max-w-[640px] text-base leading-7 text-white/60">
              Choose the closest fit. The system is designed to collect the
              right details without making the customer fight through a giant
              contact form.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceOptions.map((service) => {
              const isActive = selectedService === service.name;

              return (
                <button
                  key={service.name}
                  type="button"
                  onClick={() => chooseService(service.name)}
                  className={`rounded-[1.5rem] border p-6 text-left transition ${
                    isActive
                      ? "border-[#80df00]/65 bg-[#80df00]/[0.07] shadow-[0_0_36px_rgba(126,224,0,0.08)]"
                      : "border-white/10 bg-white/[0.03] hover:-translate-y-1 hover:border-[#80df00]/45 hover:bg-[#80df00]/[0.045]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                        Service Type
                      </div>

                      <h3 className="mt-3 text-2xl font-black tracking-[-0.03em]">
                        {service.name}
                      </h3>
                    </div>

                    <div
                      className={`mt-1 h-3.5 w-3.5 rounded-full border ${
                        isActive
                          ? "border-[#80df00] bg-[#80df00]"
                          : "border-white/25 bg-transparent"
                      }`}
                    />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-white/66">
                    {service.summary}
                  </p>

                  <span className="mt-5 inline-block text-[11px] font-black uppercase tracking-[0.16em] text-white/42">
                    {isActive ? "Selected" : "Tap to select"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-[2rem] border border-[#80df00]/25 bg-[linear-gradient(135deg,rgba(6,14,10,0.96),rgba(1,5,4,0.96))] p-6 shadow-[0_0_40px_rgba(126,224,0,0.04)] sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#80df00]">
                  Selected Service
                </p>

                <h3 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  {activeService.name}
                </h3>

                <p className="mt-4 max-w-[680px] text-base leading-7 text-white/68">
                  {activeService.detail}
                </p>

                <button
                  type="button"
                  onClick={openRequestForm}
                  className="mt-6 flex min-h-[56px] w-full items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_32px_rgba(126,224,0,0.22)] sm:w-fit"
                >
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                  Start {activeService.name} Request
                </button>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                  What happens next
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    "Customer chooses the kind of help they need",
                    "The page asks only the most relevant questions",
                    "The request becomes organized follow-up underneath",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#80df00] font-black text-black">
                        {index + 1}
                      </div>

                      <p className="text-sm leading-6 text-white/74">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GUIDED CUSTOMER REQUEST */}
        {requestOpen && (
        <section
          id="home-service-request"
          className="pt-16 sm:pt-20"
        >
          <div className="overflow-hidden rounded-[2rem] border border-[#80df00]/30 bg-[linear-gradient(135deg,rgba(6,14,9,0.98),rgba(0,5,3,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_50px_rgba(126,224,0,0.045)]"
        >
            <div className="flex items-center justify-between gap-4 border-b border-[#80df00]/20 bg-[#80df00]/[0.035] px-5 py-4 sm:px-7">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#80df00]">
                  Active Request
                </p>
                <p className="mt-1 text-sm font-bold text-white/72">
                  Your {selectedService} request
                </p>
              </div>

              <button
                type="button"
                onClick={closeRequestForm}
                className="min-h-[44px] rounded-xl border border-white/14 bg-black/35 px-4 text-xs font-black uppercase tracking-[0.12em] text-white/68 transition hover:border-[#80df00]/45 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
              >
                Close
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
              {/* REQUEST EXPLANATION */}
              <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#80df00]">
                  Start Your Request
                </p>

                <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                  Tell us what you need.
                </h2>

                <p className="mt-5 max-w-[460px] text-base leading-7 text-white/66">
                  You already chose the service. Now answer a few simple
                  questions so the request arrives organized instead of as a
                  vague contact form message.
                </p>

                <div className="mt-7 rounded-[1.5rem] border border-[#80df00]/25 bg-[#80df00]/[0.045] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#80df00]">
                    Selected Service
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {selectedService}
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Choose the closest type of work",
                    "Tell us when and where",
                    "Add contact details and notes",
                    "Request moves into the work system",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#80df00] text-sm font-black text-black">
                        {index + 1}
                      </div>

                      <span className="text-sm font-bold text-white/78">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* REQUEST FORM */}
              <form
                onSubmit={submitHomeServiceRequest}
                className="p-6 sm:p-8"
              >
                <fieldset>
                  <legend className="text-[11px] font-black uppercase tracking-[0.26em] text-[#80df00]">
                    What kind of {selectedService.toLowerCase()} help?
                  </legend>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {activeJobTypes.map((jobType) => {
                      const active = requestForm.jobType === jobType;

                      return (
                        <button
                          key={jobType}
                          type="button"
                          onClick={() =>
                            updateRequestField("jobType", jobType)
                          }
                          className={`min-h-[54px] rounded-2xl border px-4 py-3 text-left text-sm font-black transition ${
                            active
                              ? "border-[#80df00]/75 bg-[#80df00]/12 text-white shadow-[0_0_24px_rgba(126,224,0,0.08)]"
                              : "border-white/14 bg-black/35 text-white/78 hover:border-[#80df00]/45 hover:bg-[#80df00]/[0.05]"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-3">
                            {jobType}

                            {active && (
                              <Check
                                className="h-4 w-4 shrink-0 text-[#80df00]"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      How Soon?
                    </span>

                    <select
                      value={requestForm.timing}
                      onChange={(event) =>
                        updateRequestField("timing", event.target.value)
                      }
                      className="min-h-[56px] w-full cursor-pointer rounded-2xl border border-white/16 bg-black/50 px-4 text-white outline-none transition hover:border-[#80df00]/45 focus:border-[#80df00]"
                    >
                      <option value="">Choose timing</option>
                      <option>As soon as possible</option>
                      <option>This week</option>
                      <option>Within 2 weeks</option>
                      <option>Flexible</option>
                      <option>Just getting an estimate</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Where On The Property?
                    </span>

                    <select
                      value={requestForm.propertyArea}
                      onChange={(event) =>
                        updateRequestField(
                          "propertyArea",
                          event.target.value,
                        )
                      }
                      className="min-h-[56px] w-full cursor-pointer rounded-2xl border border-white/16 bg-black/50 px-4 text-white outline-none transition hover:border-[#80df00]/45 focus:border-[#80df00]"
                    >
                      <option value="">Choose area</option>
                      <option>Front yard / front exterior</option>
                      <option>Back yard / back exterior</option>
                      <option>Driveway / walkway</option>
                      <option>Inside the home</option>
                      <option>Whole property</option>
                      <option>Multiple areas</option>
                      <option>Not sure</option>
                    </select>
                  </label>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Your Name
                    </span>

                    <input
                      value={requestForm.name}
                      onChange={(event) =>
                        updateRequestField("name", event.target.value)
                      }
                      placeholder="Name"
                      required
                      autoComplete="name"
                      className="min-h-[56px] w-full rounded-2xl border border-white/16 bg-black/50 px-4 text-white outline-none transition placeholder:text-white/32 hover:border-[#80df00]/45 focus:border-[#80df00]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                      Phone Number
                    </span>

                    <input
                      value={requestForm.phone}
                      onChange={(event) =>
                        updateRequestField("phone", event.target.value)
                      }
                      placeholder="Phone"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      className="min-h-[56px] w-full rounded-2xl border border-white/16 bg-black/50 px-4 text-white outline-none transition placeholder:text-white/32 hover:border-[#80df00]/45 focus:border-[#80df00]"
                    />
                  </label>
                </div>

                <label className="mt-3 block">
                  <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-white/48">
                    Anything Else We Should Know?
                  </span>

                  <textarea
                    value={requestForm.notes}
                    onChange={(event) =>
                      updateRequestField("notes", event.target.value)
                    }
                    placeholder="Describe the job, condition, access, measurements, or anything else that may help."
                    className="min-h-[140px] w-full resize-y rounded-2xl border border-white/16 bg-black/50 px-4 py-4 text-white outline-none transition placeholder:text-white/32 hover:border-[#80df00]/45 focus:border-[#80df00]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={!requestForm.jobType}
                  className="mt-4 min-h-[62px] w-full rounded-2xl bg-[#80df00] px-6 text-lg font-black text-black transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#9cff19] enabled:hover:shadow-[0_0_36px_rgba(126,224,0,0.24)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send My Organized Request
                </button>

                {submitted && (
                  <div
                    role="status"
                    className="mt-4 rounded-2xl border border-[#80df00]/40 bg-[#80df00]/10 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#80df00] text-black">
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </div>

                      <div>
                        <p className="font-black text-[#b7ff59]">
                          Request received.
                        </p>

                        <p className="mt-1 text-sm leading-6 text-white/68">
                          Your service, job details, timing, property area,
                          contact information, and notes are now grouped into
                          one request ready for review.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-white/38">
                  <ShieldCheck
                    className="h-4 w-4 text-[#80df00]"
                    aria-hidden="true"
                  />
                  Demo request data stays in this browser only.
                </div>
              </form>
            </div>
          </div>
        </section>
        )}
        {/* TRUST / VIDEO PROOF */}
        <section className="pt-16 sm:pt-20">
          <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
                Local Trust
              </p>

              <h2 className="mt-4 max-w-[580px] text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                See the people.
                <span className="mt-1 block text-[#80df00]">
                  See the work.
                </span>
              </h2>
            </div>

            <p className="max-w-[620px] text-base leading-7 text-white/62 lg:justify-self-end">
              Customers should not have to guess who is coming to their home or
              what the work actually looks like. A HomePlanet page can put real
              introductions, job videos, customer proof, and completed work
              directly into the same experience.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* VIDEO CARD 1 */}
            <button
              type="button"
              className="group relative min-h-[370px] overflow-hidden rounded-[2rem] border border-white/12 bg-black text-left shadow-[0_24px_70px_rgba(0,0,0,0.42)] transition hover:-translate-y-1 hover:border-[#80df00]/55 hover:shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_34px_rgba(126,224,0,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80df00]"
              aria-label="Play meet the crew demo video"
            >
              <img
                src="/images/okee-dokie-home-services-hero.png"
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
                src="/images/okee-dokie-mosquito-fogging-trust.png"
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




