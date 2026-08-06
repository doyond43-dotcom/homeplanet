import { useEffect } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Camera,
  CheckCircle2,
  CircuitBoard,
  Clock3,
  House,
  LampCeiling,
  MessageCircle,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

const PHONE_DISPLAY = "(863) 555-0147";
const PHONE_HREF = "+18635550147";

const services = [
  {
    title: "Electrical Troubleshooting",
    description:
      "Breaker problems, partial power loss, flickering lights, faulty outlets, and electrical issues that need a clear answer.",
    icon: Wrench,
  },
  {
    title: "Panel Upgrades",
    description:
      "Older panels, limited breaker space, service upgrades, replacements, and safer electrical capacity.",
    icon: CircuitBoard,
  },
  {
    title: "Outlets & Switches",
    description:
      "Dead outlets, damaged receptacles, GFCI protection, switches, dimmers, and new electrical locations.",
    icon: Zap,
  },
  {
    title: "Lighting Installation",
    description:
      "Interior lighting, exterior lighting, ceiling fixtures, recessed lights, security lights, and upgrades.",
    icon: LampCeiling,
  },
  {
    title: "EV Charger Installation",
    description:
      "Home charging circuits and Level 2 EV charger installations planned around your panel and garage.",
    icon: BatteryCharging,
  },
  {
    title: "Home Electrical Help",
    description:
      "Electrical improvements, safety concerns, additions, repairs, and everyday residential electrical work.",
    icon: House,
  },
];

const reviews = [
  {
    name: "Homeowner Review",
    text:
      "Clear communication, professional work, and everything was explained before the project moved forward.",
  },
  {
    name: "Local Customer",
    text:
      "The request process was simple, the follow-up was fast, and we always knew what the next step was.",
  },
  {
    name: "Residential Customer",
    text:
      "Professional from the first message through the completed electrical work.",
  },
];

export default function ElectricianLandingPage() {
  useEffect(() => {
    const canonicalUrl =
      "https://www.homeplanet.city/planet/demo/electrician";

    const title =
      "Electrician Live Page & Business Operating System | HomePlanet";

    const description =
      "Explore a working electrician Live Page, customer request flow, Operator Live Board, customer intelligence, quick replies, and Truth Chain built by HomePlanet.";

    const previousTitle = document.title;

    const descriptionTag =
      document.querySelector<HTMLMetaElement>('meta[name="description"]');

    const previousDescription =
      descriptionTag?.getAttribute("content") ?? null;

    let canonicalTag =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    const canonicalWasCreated = !canonicalTag;
    const previousCanonical =
      canonicalTag?.getAttribute("href") ?? null;

    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }

    document.title = title;

    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    } else {
      const createdDescription = document.createElement("meta");
      createdDescription.setAttribute("name", "description");
      createdDescription.setAttribute("content", description);
      createdDescription.setAttribute(
        "data-electrician-description",
        "true",
      );
      document.head.appendChild(createdDescription);
    }

    canonicalTag.setAttribute("href", canonicalUrl);

    return () => {
      document.title = previousTitle;

      const createdDescription = document.querySelector(
        'meta[data-electrician-description="true"]',
      );

      createdDescription?.remove();

      if (descriptionTag) {
        if (previousDescription === null) {
          descriptionTag.removeAttribute("content");
        } else {
          descriptionTag.setAttribute(
            "content",
            previousDescription,
          );
        }
      }

      if (canonicalWasCreated) {
        canonicalTag?.remove();
      } else if (canonicalTag) {
        if (previousCanonical === null) {
          canonicalTag.removeAttribute("href");
        } else {
          canonicalTag.setAttribute(
            "href",
            previousCanonical,
          );
        }
      }
    };
  }, []);

  const textMessage =
    "Hi, I found Okee Dokie Electric through HomePlanet and need help with an electrical project.";

  return (
    <main className="min-h-screen bg-[#04070c] pb-20 text-white sm:pb-0">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05080d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <a
            href="/planet/demo/electrician"
            className="flex items-center gap-3"
            aria-label="Okee Dokie Electric home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/35 bg-blue-500/10 text-blue-300 shadow-[0_0_28px_rgba(59,130,246,0.16)]">
              <Zap size={22} fill="currentColor" />
            </span>

            <div>
              <p className="text-base font-black tracking-tight">
                Okee Dokie Electric
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-400">
                Electrical Service
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={`tel:${PHONE_HREF}`}
              className="flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.08em] text-blue-100 transition hover:bg-blue-500/20"
            >
              <Phone size={15} />
              Call Now
            </a>

            <a
              href={`sms:${PHONE_HREF}?&body=${encodeURIComponent(textMessage)}`}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.08em] transition hover:border-blue-400/35"
            >
              <MessageCircle size={15} />
              Text Us
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_38%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.12),transparent_34%),linear-gradient(135deg,#05080d_0%,#071120_48%,#030508_100%)]" />

        <div className="relative mx-auto grid min-h-[680px] max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-300">
              <ShieldCheck size={15} />
              Local electrical help
            </div>

            <p className="mb-4 text-lg font-semibold italic text-blue-200/80">
              Safe. Clear. Dependable.
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Electrical help without the{" "}
              <span className="text-blue-400">runaround.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
              Professional residential electrical service with a clear request
              process, dependable communication, and one simple place to get
              started.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#request-electrical-service"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 text-sm font-black uppercase tracking-[0.08em] shadow-[0_18px_50px_rgba(37,99,235,0.3)] transition hover:bg-blue-400"
              >
                Request Electrical Service
                <ArrowRight size={18} />
              </a>

              <a
                href={`tel:${PHONE_HREF}`}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-6 text-sm font-black uppercase tracking-[0.08em] transition hover:border-blue-400/40 hover:bg-blue-500/10"
              >
                <Phone size={17} />
                Call {PHONE_DISPLAY}
              </a>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold text-white/55">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-blue-400" />
                Residential electrical service
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-blue-400" />
                Clear estimate requests
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-blue-400" />
                Safety-first communication
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-blue-500/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-blue-300/20 bg-[#0a101a] p-3 shadow-2xl shadow-blue-950/40">
              <img
                src="/images/electrician-hero.webp"
                alt="Professional electrician beside a modern electrical panel"
                className="h-[500px] w-full rounded-[1.45rem] object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="electrical-services"
        className="border-b border-white/10 px-5 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">
              Electrical Services
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Start with what you need.
            </h2>

            <p className="mt-4 text-base leading-7 text-white/55">
              Choose the service that best matches your electrical issue or
              upcoming project.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <a
                  key={service.title}
                  href="#request-electrical-service"
                  className="group rounded-3xl border border-white/10 bg-[#090d14] p-6 transition hover:-translate-y-1 hover:border-blue-400/35 hover:bg-blue-500/[0.06]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 text-blue-300 transition group-hover:bg-blue-500/20">
                    <Icon size={22} />
                  </span>

                  <h3 className="mt-5 text-xl font-black">{service.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {service.description}
                  </p>

                  <span className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-blue-400">
                    Request help
                    <ArrowRight size={15} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070b11] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">
                Professional From Start To Finish
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                A better customer experience before the work even begins.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
                Customers should be able to understand the services, see the
                quality of the business, and know exactly how to request help
                without chasing down scattered information.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Clear service information",
                  "Real project photos",
                  "Customer video updates",
                  "Simple estimate requests",
                  "Reviews and trust",
                  "Direct call and text access",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-blue-400"
                    />
                    <span className="text-sm font-bold text-white/75">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="sm:col-span-2 rounded-[2rem] border border-blue-400/25 bg-[linear-gradient(135deg,rgba(37,99,235,0.18),rgba(5,8,13,0.95))] p-6 shadow-xl shadow-blue-950/20">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                      Featured Project
                    </p>
                    <h3 className="mt-3 text-2xl font-black">
                      Electrical panel upgrade
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">
                      A polished project feature can show the customer what was
                      needed, what was completed, and the finished result.
                    </p>
                  </div>

                  <CircuitBoard
                    size={42}
                    className="shrink-0 text-blue-300"
                  />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Before",
                      image: "/images/electrician-panel-before.webp",
                      alt: "Older electrical panel before an upgrade",
                    },
                    {
                      label: "Work",
                      image: "/images/electrician-panel-work.webp",
                      alt: "Electrician completing an electrical panel upgrade",
                    },
                    {
                      label: "Finished",
                      image: "/images/electrician-panel-finished.webp",
                      alt: "Completed modern electrical panel installation",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="group relative min-h-28 overflow-hidden rounded-2xl border border-white/10 bg-black/30"
                    >
                      <img
                        src={item.image}
                        alt={item.alt}
                        className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-3">
                        <span className="inline-flex rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/90 backdrop-blur">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#090d14] p-6">
                <Camera size={28} className="text-blue-300" />
                <h3 className="mt-5 text-xl font-black">Project Gallery</h3>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  Finished work, installations, repairs, and before-and-after
                  results presented cleanly.
                </p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-[#090d14] p-6">
                <MessageCircle size={28} className="text-blue-300" />
                <h3 className="mt-5 text-xl font-black">
                  Clear Communication
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/50">
                  Customers always know how to ask questions, request service,
                  and understand what happens next.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[2rem] border border-blue-400/20 bg-[radial-gradient(circle_at_70%_20%,rgba(59,130,246,0.2),transparent_35%),linear-gradient(135deg,#0a111d,#05080d)] p-8 shadow-2xl shadow-blue-950/20 sm:p-10">
              <div className="flex min-h-[360px] flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-blue-300">
                    Project Video
                  </span>

                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white">
                    <Play size={20} fill="currentColor" />
                  </span>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-300">
                    See The Finished Work
                  </p>
                  <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-5xl">
                    Let customers see the quality for themselves.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-white/55">
                    A professional video section gives the business a place to
                    show completed work, explain the project, and build trust
                    before the customer ever calls.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">
                What Customers Want To Know
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    icon: Camera,
                    title: "What does the finished work look like?",
                  },
                  {
                    icon: Clock3,
                    title: "What happens after I submit a request?",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Can I trust the business with my property?",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#090d14] p-5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                        <Icon size={20} />
                      </span>

                      <p className="font-black text-white/80">{item.title}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070b11] px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">
              Customer Reviews
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              Trust built through real customer experiences.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-3xl border border-white/10 bg-[#090d14] p-6"
              >
                <div className="flex gap-1 text-blue-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={17} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-5 text-base leading-7 text-white/70">
                  “{review.text}”
                </p>

                <p className="mt-6 text-sm font-black">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-5 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">
              Safety Comes First
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              Some electrical problems should not wait.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/60">
              Sparking outlets, burning smells, exposed wiring, hot panels, and
              repeated breaker trips can signal a serious electrical concern.
            </p>

            <div className="mt-7 rounded-3xl border border-blue-400/25 bg-blue-500/10 p-5">
              <div className="flex gap-3">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-blue-300"
                  size={22}
                />

                <p className="text-sm leading-6 text-blue-50/85">
                  Do not touch exposed wiring. Turn off the affected circuit
                  only when it is safe to do so. Call emergency services when
                  there is fire, smoke, or immediate danger.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              "Clear communication before work begins",
              "Safety concerns taken seriously",
              "Photos can be included with the request",
              "Simple request and follow-up process",
            ].map((point) => (
              <article
                key={point}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#090d14] p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                  <CheckCircle2 size={20} />
                </span>

                <p className="font-bold text-white/80">{point}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="request-electrical-service" className="px-5 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-blue-400/25 bg-[linear-gradient(135deg,rgba(37,99,235,0.2),rgba(5,8,13,0.98)_55%)] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-300">
                <Sparkles size={18} />
                <p className="text-xs font-black uppercase tracking-[0.22em]">
                  Ready To Get Started?
                </p>
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Tell us about your electrical project.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
                Share what is happening, the property location, when you need
                help, and any photos that help explain the work.
              </p>
            </div>

            <div className="flex min-w-[260px] flex-col gap-3">
              <a
                href="/planet/demo/electrician/request"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 text-sm font-black uppercase tracking-[0.08em] transition hover:bg-blue-400"
              >
                Request Service
                <ArrowRight size={18} />
              </a>

              <a
                href={`tel:${PHONE_HREF}`}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-6 text-sm font-black uppercase tracking-[0.08em] transition hover:border-blue-400/40"
              >
                <Phone size={17} />
                Call Now
              </a>

              <a
                href={`sms:${PHONE_HREF}?&body=${encodeURIComponent(textMessage)}`}
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.05] px-6 text-sm font-black uppercase tracking-[0.08em] transition hover:border-blue-400/40"
              >
                <MessageCircle size={17} />
                Text Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-12 text-center">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
              <Zap size={20} fill="currentColor" />
            </span>

            <p className="text-lg font-black">Okee Dokie Electric</p>
          </div>

          <p className="mt-3 text-sm text-white/45">
            Customer-facing Live Page powered by HomePlanet.
          </p>

          <a
            href="/planet/demo/electrician/intelligence"
            className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-blue-400"
          >
            View The Engine Underneath
            <ArrowRight size={14} />
          </a>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#05080d]/95 p-3 backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={`tel:${PHONE_HREF}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] text-xs font-black"
          >
            <Phone size={15} />
            Call
          </a>

          <a
            href={`sms:${PHONE_HREF}?&body=${encodeURIComponent(textMessage)}`}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] text-xs font-black"
          >
            <MessageCircle size={15} />
            Text
          </a>

          <a
            href="#request-electrical-service"
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 text-xs font-black"
          >
            <Zap size={15} />
            Request
          </a>
        </div>
      </div>
    </main>
  );
}







