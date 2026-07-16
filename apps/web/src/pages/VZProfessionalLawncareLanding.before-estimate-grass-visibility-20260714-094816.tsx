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

const phone = "8635328123";
const formattedPhone = "(863) 532-8123";

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
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0D0D0D_0%,#0D0D0D_28%,rgba(13,13,13,0.96)_40%,rgba(13,13,13,0.58)_56%,rgba(13,13,13,0.12)_78%,rgba(13,13,13,0.04)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0.08)_0%,transparent_48%,rgba(13,13,13,0.32)_100%)]" />
        </div>
        <div className="relative mx-auto grid min-h-[700px] max-w-[1380px] items-center px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-24">
          <div className="max-w-[820px]">
            <p className="text-[clamp(2.7rem,4.6vw,5rem)] font-black leading-none tracking-[-0.055em] text-[#FFD000]">
              V&amp;Z
            </p>

            <h1 className="mt-3 max-w-[820px] text-[clamp(3.5rem,6.8vw,7rem)] font-black leading-[0.9] tracking-[-0.06em] text-white">
              Professional
              <span className="block">Lawncare</span>
            </h1>

            <p className="mt-7 text-[clamp(1.35rem,2.2vw,2rem)] font-extrabold leading-tight tracking-[-0.025em] text-[#7CFC00]">
              Lawn and exterior property care.
            </p>

            <p className="mt-6 max-w-[720px] text-lg leading-8 text-white/65 sm:text-xl">
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

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
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
        <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
                Services
              </p>

              <h2 className="mt-4 max-w-[520px] text-4xl font-black leading-[0.94] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
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
                  className="group relative grid gap-4 border-b border-[#087F23]/30 py-7 pl-4 transition duration-300 before:absolute before:bottom-5 before:left-0 before:top-5 before:w-[2px] before:bg-[#7CFC00] before:opacity-0 before:transition group-hover:border-[#7CFC00]/35 group-hover:bg-[#087F23]/[0.08] group-hover:before:opacity-100 sm:grid-cols-[70px_0.7fr_1.3fr] sm:items-start sm:pl-5"
                >
                  <p className="flex items-center gap-3 text-xs font-black tracking-[0.18em] text-[#FFD000]">
                    <span className="h-4 w-[2px] shrink-0 bg-[#7CFC00]" />
                    {service.number}
                  </p>

                  <h3 className="text-xl font-black uppercase tracking-[-0.02em] text-white transition group-hover:text-[#7CFC00]">
                    {service.title}
                  </h3>

                  <p className="text-sm leading-6 text-white/60 transition group-hover:text-white/75 sm:text-base">
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

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,11,9,0.96)_0%,rgba(9,11,9,0.90)_34%,rgba(9,11,9,0.62)_58%,rgba(9,11,9,0.34)_100%)]" />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,9,0.18)_0%,rgba(9,11,9,0.06)_50%,rgba(9,11,9,0.40)_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-[1380px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-10 lg:py-24">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#FFD000]">
              Request an estimate
            </p>

            <h2 className="mt-4 max-w-[560px] text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
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
            className="grid gap-4 rounded-[2rem] border border-[#FFD000]/45 bg-[#0b1b0f]/90 p-5 shadow-2xl shadow-black/50 ring-1 ring-[#7CFC00]/20 backdrop-blur-md sm:grid-cols-2 sm:p-8"
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
<section className="border-b border-white/10 bg-[#0c0f0c]">
        <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[760px]">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#91e84d]">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-5xl">
              A clear path from request to service.
            </h2>
          </div>

          <div className="mt-12 grid border-t border-white/10 md:grid-cols-3">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
              >
                <p className="text-xs font-black tracking-[0.18em] text-[#91e84d]">
                  {step.number}
                </p>
                <h3 className="mt-5 text-xl font-black uppercase">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/50">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#090b09]">
        <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="rounded-[2rem] border border-[#91e84d]/30 bg-[#91e84d]/[0.055] px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#91e84d]">
                Ready to get started?
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em] sm:text-4xl">
                Get the outside of your property handled.
              </h2>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#91e84d] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#10140d] transition hover:bg-[#a8f56b]"
              >
                <Phone size={17} />
                {formattedPhone}
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-white/20 px-7 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-white/40"
              >
                <MessageCircle size={17} />
                Text Eric
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#070807]">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-5 px-5 py-8 text-sm text-white/45 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="font-black text-white">
              V&amp;Z Professional Lawncare
            </p>
            <p className="mt-1">Lawn &amp; Exterior Property Care</p>
          </div>

          <div className="md:text-right">
            <a
              href={`tel:${phone}`}
              className="font-bold text-white transition hover:text-[#91e84d]"
            >
              {formattedPhone}
            </a>
            <p className="mt-1">Local property service</p>
          </div>
        </div>
      </footer>
    </main>
  );
}