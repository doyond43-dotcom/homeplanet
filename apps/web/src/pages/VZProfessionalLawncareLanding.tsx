import { useEffect } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const phone = "8634477915";
const formattedPhone = "(863) 447-7915";

const services = [
  {
    number: "01",
    title: "Lawn Maintenance",
    text: "Reliable mowing and routine property care that keeps the yard clean and manageable.",
  },
  {
    number: "02",
    title: "Edging & Trimming",
    text: "Clean edges, trimmed growth, and detail work around walkways, landscaping, and structures.",
  },
  {
    number: "03",
    title: "Mulch Installation",
    text: "Fresh mulch installation for beds, trees, and landscaped areas around the property.",
  },
  {
    number: "04",
    title: "Gutter Cleaning",
    text: "Removal of leaves, buildup, and debris to help keep gutters flowing properly.",
  },
  {
    number: "05",
    title: "Window Cleaning",
    text: "Exterior window cleaning that helps the whole property look brighter and better maintained.",
  },
  {
    number: "06",
    title: "Roof Cleaning",
    text: "Exterior roof-cleaning service based on the roof condition and property requirements.",
  },
  {
    number: "07",
    title: "Additional Property Care",
    text: "Have something else outside that needs attention? Tell Eric what needs to be handled.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Choose the service, describe the property, and include the address and timing.",
  },
  {
    number: "02",
    title: "Eric reviews the request",
    text: "V&Z looks over the details and follows up directly about the work and estimate.",
  },
  {
    number: "03",
    title: "Confirm the service",
    text: "Once the details are clear, the work can be scheduled and handled.",
  },
];

export default function VZProfessionalLawncareLanding() {
  useEffect(() => {
    const previousTitle = document.title;
    const existingDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    const previousDescription = existingDescription?.content ?? "";
    const descriptionMeta =
      existingDescription ?? document.createElement("meta");

    document.title =
      "V&Z Professional Lawncare | Lawn Care in Okeechobee, FL";

    descriptionMeta.setAttribute("name", "description");
    descriptionMeta.setAttribute(
      "content",
      "V&Z Professional Lawncare provides mowing, edging, trimming, mulch installation, gutter cleaning, window cleaning, roof cleaning, and exterior property care in Okeechobee, Florida."
    );

    if (!existingDescription) {
      document.head.appendChild(descriptionMeta);
    }

    return () => {
      document.title = previousTitle;

      if (existingDescription) {
        existingDescription.content = previousDescription;
      } else {
        descriptionMeta.remove();
      }
    };
  }, []);

  const handleEstimateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const customerPhone = String(form.get("phone") || "").trim();
    const service = String(form.get("service") || "").trim();
    const condition = String(form.get("condition") || "").trim();
    const address = String(form.get("address") || "").trim();
    const timing = String(form.get("timing") || "").trim();
    const details = String(form.get("details") || "").trim();

    const message = [
      "Hi Eric, I would like an estimate from V&Z Professional Lawncare.",
      "",
      `Name: ${name}`,
      `Phone: ${customerPhone}`,
      `Service: ${service}`,
      `Property condition: ${condition}`,
      `Address: ${address}`,
      `Preferred timing: ${timing}`,
      `Details: ${details || "No additional details provided."}`,
    ].join("\n");

    window.location.href = `sms:${phone}?&body=${encodeURIComponent(message)}`;
  };

  return (
    <main className="min-h-screen bg-[#090b09] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0D0D0D]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/images/vz-eric-trimming-hero.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-[68%_center] lg:object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0D0D0D_0%,#0D0D0D_28%,rgba(13,13,13,0.96)_40%,rgba(13,13,13,0.58)_56%,rgba(13,13,13,0.12)_78%,rgba(13,13,13,0.04)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.08)_0%,transparent_48%,rgba(13,13,13,0.32)_100%)]" />
        </div>
        <div className="relative mx-auto grid min-h-[620px] max-w-[1380px] items-center px-5 py-12 sm:min-h-[660px] sm:px-8 sm:py-16 lg:min-h-[700px] lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-24">
          <div className="max-w-[820px]">
            <p className="text-[2.35rem] font-black leading-none tracking-[-0.055em] text-[#FFD000] sm:text-[3.4rem] lg:text-[clamp(2.7rem,4.6vw,5rem)]">
              V&amp;Z
            </p>

            <h1 className="mt-3 max-w-[820px] text-[3.15rem] font-black leading-[0.91] tracking-[-0.055em] text-white sm:text-[4.5rem] lg:text-[clamp(3.5rem,6.8vw,7rem)] lg:leading-[0.9] lg:tracking-[-0.06em]">
              Professional
              <span className="block">Lawncare</span>
            </h1>

            <p className="mt-5 text-[1.1rem] font-extrabold leading-tight tracking-[-0.025em] text-[#7CFC00] sm:mt-6 sm:text-[1.35rem] lg:mt-7 lg:text-[clamp(1.35rem,2.2vw,2rem)]">
              Lawn and exterior property care in Okeechobee, Florida.
            </p>

            <p className="mt-5 max-w-[720px] text-base leading-7 text-white/70 sm:text-lg sm:leading-8 lg:mt-6 lg:text-xl">
              Mowing, edging, trimming, mulch installation, gutter cleaning,
              window cleaning, roof cleaning, and additional exterior services.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-xl bg-[#FFD000] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#0D0D0D] transition hover:bg-[#ffe04a]"
              >
                <Phone size={18} />
                Call Eric
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-xl border border-[#7CFC00]/45 bg-[#0D0D0D]/45 px-7 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-[#7CFC00] hover:bg-[#087F23]/20"
              >
                <MessageCircle size={18} />
                Text Eric
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-white/10 pt-5 text-[9px] font-black uppercase tracking-[0.15em] text-white/60 sm:gap-x-8 sm:text-[10px] sm:tracking-[0.18em] lg:mt-10 lg:pt-6">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-[#7CFC00]" />
                Local service
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-[#FFD000]" />
                Free estimates
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-[#7CFC00]" />
                Direct communication
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="hidden min-h-[500px] lg:block"
          />
        </div>
      </section>

      <section
        id="services"
        className="relative scroll-mt-6 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_32%,rgba(8,127,35,0.16),transparent_34%),linear-gradient(180deg,#0c0f0c_0%,#0a0d0a_100%)]"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
                Services
              </p>

              <h2 className="mt-4 max-w-[520px] text-3xl font-black leading-[0.96] tracking-[-0.04em] sm:text-4xl lg:text-6xl lg:leading-[0.94] lg:tracking-[-0.045em]">
                <span className="block text-white">Property care</span>
                <span className="mt-1 block text-[#7CFC00]">
                  without the runaround.
                </span>
              </h2>

              <p className="mt-6 max-w-[520px] text-base leading-7 text-white/55">
                Start with the work you need. Eric can review the property
                details, condition, access, timing, and any photos you send.
              </p>
            </div>

            <div className="border-t border-[#087F23]/35">
              {services.map((service) => (
                <article
                  key={service.number}
                  className="group relative grid grid-cols-[44px_1fr] gap-x-3 gap-y-2 border-b border-[#087F23]/30 py-5 pl-4 transition duration-300 before:absolute before:bottom-4 before:left-0 before:top-4 before:w-[2px] before:bg-[#7CFC00] before:opacity-60 before:transition group-hover:border-[#7CFC00]/35 group-hover:bg-[#087F23]/[0.08] group-hover:before:opacity-100 sm:grid-cols-[70px_0.7fr_1.3fr] sm:items-start sm:gap-4 sm:py-7 sm:pl-5 sm:before:bottom-5 sm:before:top-5 sm:before:opacity-0"
                >
                  <p className="flex items-center gap-3 text-xs font-black tracking-[0.18em] text-[#FFD000]">
                    <span className="h-4 w-[2px] shrink-0 bg-[#7CFC00]" />
                    {service.number}
                  </p>

                  <h3 className="text-lg font-black uppercase tracking-[-0.02em] text-white transition group-hover:text-[#7CFC00] sm:text-xl">
                    {service.title}
                  </h3>

                  <p className="col-start-2 text-sm leading-6 text-white/65 transition group-hover:text-white/75 sm:col-start-auto sm:text-base">
                    {service.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

            <section
        id="estimate"
        className="relative scroll-mt-6 overflow-hidden border-b border-white/10 bg-[#090b09]"
      >
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/images/vz-estimate-grass-background.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,11,9,0.72)_0%,rgba(9,11,9,0.52)_32%,rgba(9,11,9,0.20)_56%,rgba(9,11,9,0.04)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,9,0.03)_0%,transparent_52%,rgba(9,11,9,0.06)_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-[1380px] gap-8 px-5 py-14 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12 lg:px-10 lg:py-24">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
              Request an estimate
            </p>

            <h2 className="mt-4 max-w-[560px] text-3xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-4xl lg:text-6xl lg:leading-[0.94] lg:tracking-[-0.045em]">
              <span className="block text-white">Show Eric</span>
              <span className="block text-white">what needs</span>
              <span className="block text-[#7CFC00]">attention.</span>
            </h2>

            <p className="mt-6 max-w-[540px] text-base leading-7 text-white/80 sm:text-lg">
              Choose the service, share the property details, and tell Eric what
              needs attention.
            </p>

            <div className="mt-9 space-y-4">
              <p className="flex items-center gap-3 text-sm font-bold text-white sm:text-base">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FFD000]/70 bg-black/35">
                  <Check size={14} className="text-[#7CFC00]" />
                </span>
                No account or login required
              </p>

              <p className="flex items-center gap-3 text-sm font-bold text-white sm:text-base">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FFD000]/70 bg-black/35">
                  <Check size={14} className="text-[#7CFC00]" />
                </span>
                Direct contact with Eric
              </p>

              <p className="flex items-center gap-3 text-sm font-bold text-white sm:text-base">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#FFD000]/70 bg-black/35">
                  <Check size={14} className="text-[#7CFC00]" />
                </span>
                Photos can be added to the text message
              </p>
            </div>
          </div>

          <form
            onSubmit={handleEstimateSubmit}
            className="grid gap-3 rounded-[1.5rem] border border-[#FFD000]/45 bg-[#0b1b0f]/90 p-4 shadow-2xl shadow-black/50 ring-1 ring-[#7CFC00]/20 backdrop-blur-md sm:grid-cols-2 sm:gap-4 sm:rounded-[2rem] sm:p-8"
          >
            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-white">
                Your name
              </span>
              <input
                name="name"
                required
                autoComplete="name"
                className="min-h-14 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-medium text-[#0D0D0D] outline-none transition placeholder:text-zinc-500 focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
                placeholder="Full name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-white">
                Phone number
              </span>
              <input
                name="phone"
                required
                type="tel"
                autoComplete="tel"
                className="min-h-14 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-medium text-[#0D0D0D] outline-none transition placeholder:text-zinc-500 focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
                placeholder="Best number to reach you"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-white">
                Service needed
              </span>
              <select
                name="service"
                required
                defaultValue=""
                className="min-h-14 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-medium text-[#0D0D0D] outline-none transition focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
              >
                <option value="" disabled>
                  Choose a service
                </option>
                <option>Lawn Maintenance</option>
                <option>Edging &amp; Trimming</option>
                <option>Mulch Installation</option>
                <option>Gutter Cleaning</option>
                <option>Window Cleaning</option>
                <option>Roof Cleaning</option>
                <option>Additional Property Care</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-white">
                Property condition
              </span>
              <select
                name="condition"
                required
                defaultValue=""
                className="min-h-14 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-medium text-[#0D0D0D] outline-none transition focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
              >
                <option value="" disabled>
                  Choose the condition
                </option>
                <option>Routine maintenance</option>
                <option>Needs attention</option>
                <option>Overgrown / heavy cleanup</option>
                <option>Not sure</option>
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white">
                <MapPin size={15} className="text-[#7CFC00]" />
                Property address
              </span>
              <input
                name="address"
                required
                autoComplete="street-address"
                className="min-h-14 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-medium text-[#0D0D0D] outline-none transition placeholder:text-zinc-500 focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
                placeholder="Street address or general location"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em] text-white">
                <CalendarDays size={15} className="text-[#7CFC00]" />
                Preferred timing
              </span>
              <input
                name="timing"
                required
                className="min-h-14 w-full rounded-xl border border-black/15 bg-white px-4 text-base font-medium text-[#0D0D0D] outline-none transition placeholder:text-zinc-500 focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
                placeholder="As soon as possible, this week, flexible..."
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-[0.16em] text-white">
                Property details
              </span>
              <textarea
                name="details"
                rows={5}
                className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-4 text-base font-medium leading-6 text-[#0D0D0D] outline-none transition placeholder:text-zinc-500 focus:border-[#7CFC00] focus:ring-2 focus:ring-[#7CFC00]/30"
                placeholder="Describe the yard, access, problem areas, or anything Eric should know."
              />
            </label>

            <button
              type="submit"
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-xl bg-[#FFD000] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#0D0D0D] transition hover:bg-[#ffe04a] sm:col-span-2"
            >
              Request My Estimate
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>
      </section>
<section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_82%_24%,rgba(8,127,35,0.16),transparent_30%),linear-gradient(180deg,#0c0f0c_0%,#091009_100%)]">
        <div className="mx-auto max-w-[1380px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
          <div className="max-w-[760px]">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
              How it works
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-[0.96] tracking-[-0.04em] sm:text-4xl lg:text-5xl lg:leading-[0.94] lg:tracking-[-0.045em]">
              <span className="text-white">A clear path from request to </span>
              <span className="text-[#7CFC00]">service.</span>
            </h2>
          </div>

          <div className="relative mt-8 grid border-t border-[#087F23]/35 sm:mt-10 md:grid-cols-3 md:before:absolute md:before:left-[16.66%] md:before:right-[16.66%] md:before:top-[3.25rem] md:before:h-px md:before:bg-[linear-gradient(90deg,#FFD000_0%,#7CFC00_50%,#FFD000_100%)] md:before:opacity-55 lg:mt-12">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="relative border-b border-[#087F23]/25 py-6 sm:py-7 md:border-b-0 md:border-r md:border-[#087F23]/25 md:px-8 md:py-8 md:first:pl-0 md:last:border-r-0"
              >
                <p className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#7CFC00]/55 bg-[#0D0D0D] text-xs font-black tracking-[0.12em] text-[#FFD000] shadow-[0_0_0_6px_rgba(12,15,12,0.92)]">
                  {step.number}
                </p>
                <h3 className="mt-4 text-lg font-black uppercase text-white sm:mt-5 sm:text-xl md:mt-6">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/68 sm:mt-4 sm:text-base">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="vz-trust"
        aria-labelledby="vz-trust-heading"
        className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_14%_10%,rgba(255,208,0,0.08),transparent_30%),radial-gradient(circle_at_88%_90%,rgba(8,127,35,0.16),transparent_34%),linear-gradient(180deg,#090b09_0%,#0c100c_100%)]"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
              Trusted in Okeechobee
            </p>

            <h2
              id="vz-trust-heading"
              className="mt-4 text-3xl font-black leading-[0.96] tracking-[-0.04em] text-white sm:text-4xl"
            >
              Real words from
              <span className="block text-[#7CFC00]">
                local customers.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/68">
              Real recommendations from people who trusted V&amp;Z with their
              yards and properties.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-2">
            <article className="flex h-full flex-col rounded-[1.4rem] border border-[#087F23]/35 bg-[#0D0D0D]/80 p-4 shadow-2xl shadow-black/30 ring-1 ring-[#7CFC00]/[0.06] transition duration-300 hover:-translate-y-1 hover:border-[#FFD000]/35 sm:rounded-[1.75rem] sm:p-6">
              <p
                aria-label="Five-star customer recommendation"
                className="text-xl tracking-[0.1em] text-[#FFD000] sm:text-2xl sm:tracking-[0.12em]"
              >
                ★★★★★
              </p>

              <blockquote className="mt-4 flex-1 text-base font-bold leading-6 text-white sm:mt-5 sm:text-xl sm:leading-8">
                “Hard working, very dedicated to the job, has good prices, and
                he gets the job done the first time the right way. Highly
                recommend him for anything yard work related.”
              </blockquote>

              <div className="mt-6 border-t border-[#087F23]/35 pt-4">
                <p className="font-black text-[#7CFC00]">
                  Lucas Mahoney
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/42">
                  Customer Recommendation
                </p>
              </div>
            </article>

            <article className="flex h-full flex-col rounded-[1.4rem] border border-[#087F23]/35 bg-[#0D0D0D]/80 p-4 shadow-2xl shadow-black/30 ring-1 ring-[#7CFC00]/[0.06] transition duration-300 hover:-translate-y-1 hover:border-[#FFD000]/35 sm:rounded-[1.75rem] sm:p-6">
              <p
                aria-label="Five-star customer recommendation"
                className="text-xl tracking-[0.1em] text-[#FFD000] sm:text-2xl sm:tracking-[0.12em]"
              >
                ★★★★★
              </p>

              <blockquote className="mt-4 flex-1 text-base font-bold leading-6 text-white sm:mt-5 sm:text-xl sm:leading-8">
                “These young gentlemen came to clean my yard up and brought my
                garden back to life and did a phenomenal job. I’d definitely
                give these guys my money ☺️”
              </blockquote>

              <div className="mt-6 border-t border-[#087F23]/35 pt-4">
                <p className="font-black text-[#7CFC00]">
                  Frankie Dave
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-white/42">
                  Customer Recommendation
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
            <section className="relative overflow-hidden bg-[#090b09]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_46%,rgba(8,127,35,0.18),transparent_34%),radial-gradient(circle_at_20%_78%,rgba(124,252,0,0.05),transparent_28%),linear-gradient(180deg,#090b09_0%,#0a0f0a_100%)]" />

        <div className="relative mx-auto max-w-[1380px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-[#087F23]/50 bg-[linear-gradient(115deg,rgba(8,127,35,0.16),rgba(13,13,13,0.88)_48%,rgba(8,127,35,0.10))] px-5 py-7 shadow-2xl shadow-black/30 ring-1 ring-[#7CFC00]/[0.06] sm:rounded-[2rem] sm:px-9 sm:py-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-[700px]">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
                Ready to get started?
              </p>

              <h2 className="mt-4 text-2xl font-black leading-[0.98] tracking-[-0.035em] sm:text-4xl lg:text-5xl lg:leading-[0.95] lg:tracking-[-0.04em]">
                <span className="block text-white">
                  Ready to get the property handled?
                </span>
                <span className="mt-2 block text-[#7CFC00]">
                  Talk directly with Eric.
                </span>
              </h2>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-[60px] items-center justify-center gap-3 rounded-xl bg-[#FFD000] px-7 text-[#0D0D0D] transition hover:bg-[#ffe04a]"
              >
                <Phone size={18} />

                <span className="text-left">
                  <span className="block text-sm font-black uppercase tracking-[0.12em]">
                    Call Eric
                  </span>
                  <span className="mt-1 block text-[10px] font-black tracking-[0.12em] opacity-65">
                    {formattedPhone}
                  </span>
                </span>
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-[60px] items-center justify-center gap-3 rounded-xl border border-[#7CFC00]/45 bg-[#0D0D0D]/55 px-7 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-[#7CFC00] hover:bg-[#087F23]/20"
              >
                <MessageCircle size={18} />
                Text Eric
              </a>
            </div>
          </div>
        </div>
      </section>
<footer className="border-t border-white/10 bg-[#060706]">
        <div className="mx-auto max-w-[1380px] px-5 py-7 text-center sm:px-8 sm:py-8 lg:px-10 lg:py-9">
          <p className="font-black text-white">
            V&amp;Z Professional Lawncare
          </p>

          <p className="mt-2 text-sm text-white/50">
            Lawn care and exterior property services in Okeechobee, Florida
          </p>

          <div className="mx-auto mt-6 h-px max-w-xs bg-[linear-gradient(90deg,transparent,#FFD000,#7CFC00,transparent)] opacity-45" />

          <p className="mt-6 text-xs text-white/35">
            © 2026 V&amp;Z Professional Lawncare
          </p>

          <p className="mt-2 text-xs text-white/30">
            Made with HomePlanet
          </p>
        </div>
      </footer>
    </main>
  );
}