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
      <section className="relative overflow-hidden border-b border-white/10">
<div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,#090b09_0%,#0b100a_52%,#10180d_100%)]" />
          <div className="absolute right-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-[#91e84d]/[0.08] blur-[120px]" />
          <div className="absolute bottom-[-15rem] left-[35%] h-[30rem] w-[30rem] rounded-full bg-[#91e84d]/[0.04] blur-[130px]" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
        </div>

        <div className="relative mx-auto flex min-h-[720px] max-w-[1380px] items-center px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="max-w-[980px]">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[3px] w-12 bg-[#91e84d]" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/55">
                Local exterior property care
              </p>
            </div>

            <h1 className="max-w-[1100px] text-[clamp(3.5rem,7.6vw,7.8rem)] font-black uppercase leading-[0.84] tracking-[-0.075em]">
              V&amp;Z Professional
              <span className="block">Lawncare</span>
              <span className="mt-4 block text-[0.48em] leading-[0.95] tracking-[-0.045em] text-[#91e84d]">
                Professional property care.
              </span>
            </h1>

            <p className="mt-8 max-w-[760px] text-lg leading-8 text-white/65 sm:text-xl">
              Mowing, edging, trimming, mulch installation, gutter cleaning,
              window cleaning, roof cleaning, and additional exterior services
              from one local team.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#estimate"
                className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-[#91e84d] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#10140d] transition hover:bg-[#a8f56b]"
              >
                Request an Estimate
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="#services"
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.03] px-7 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-white/40 hover:bg-white/[0.07]"
              >
                View Services
                <ChevronRight size={17} />
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-[#91e84d]" />
                Local service
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-[#91e84d]" />
                Free estimates
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={14} className="text-[#91e84d]" />
                Direct communication
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="scroll-mt-6 border-b border-white/10 bg-[#0c0f0c]"
      >
        <div className="mx-auto max-w-[1380px] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#91e84d]">
                Services
              </p>

              <h2 className="mt-4 max-w-[520px] text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Property care without the runaround.
              </h2>

              <p className="mt-6 max-w-[520px] text-base leading-7 text-white/55">
                Start with the work you need. Eric can review the property
                details, condition, access, timing, and any photos you send.
              </p>
            </div>

            <div className="border-t border-white/10">
              {services.map((service) => (
                <article
                  key={service.number}
                  className="grid gap-4 border-b border-white/10 py-7 transition hover:border-[#91e84d]/40 sm:grid-cols-[70px_0.7fr_1.3fr] sm:items-start"
                >
                  <p className="text-xs font-black tracking-[0.18em] text-[#91e84d]">
                    {service.number}
                  </p>

                  <h3 className="text-xl font-black uppercase tracking-[-0.02em]">
                    {service.title}
                  </h3>

                  <p className="text-sm leading-6 text-white/50 sm:text-base">
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
        className="scroll-mt-6 border-b border-white/10 bg-[#090b09]"
      >
        <div className="mx-auto grid max-w-[1380px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#91e84d]">
              Request an estimate
            </p>

            <h2 className="mt-4 max-w-[560px] text-4xl font-black uppercase leading-[0.94] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Tell Eric what needs to be handled.
            </h2>

            <p className="mt-6 max-w-[540px] text-base leading-7 text-white/55">
              Submit the property details below. Your phone will open a
              prefilled text message so the request goes directly to Eric.
            </p>

            <div className="mt-9 space-y-4">
              <p className="flex items-center gap-3 text-sm font-bold text-white/70">
                <Check size={17} className="text-[#91e84d]" />
                No account or login required
              </p>
              <p className="flex items-center gap-3 text-sm font-bold text-white/70">
                <Check size={17} className="text-[#91e84d]" />
                Direct contact with Eric
              </p>
              <p className="flex items-center gap-3 text-sm font-bold text-white/70">
                <Check size={17} className="text-[#91e84d]" />
                Photos can be added to the text message
              </p>
            </div>
          </div>

          <form
            onSubmit={handleEstimateSubmit}
            className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30 sm:grid-cols-2 sm:p-8"
          >
            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Your name
              </span>
              <input
                name="name"
                required
                autoComplete="name"
                className="min-h-14 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#91e84d]/60"
                placeholder="Full name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Phone number
              </span>
              <input
                name="phone"
                required
                type="tel"
                autoComplete="tel"
                className="min-h-14 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#91e84d]/60"
                placeholder="Best number to reach you"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Service needed
              </span>
              <select
                name="service"
                required
                defaultValue=""
                className="min-h-14 w-full rounded-xl border border-white/10 bg-[#0b0e0b] px-4 text-sm text-white outline-none transition focus:border-[#91e84d]/60"
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
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Property condition
              </span>
              <select
                name="condition"
                required
                defaultValue=""
                className="min-h-14 w-full rounded-xl border border-white/10 bg-[#0b0e0b] px-4 text-sm text-white outline-none transition focus:border-[#91e84d]/60"
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
              <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                <MapPin size={13} />
                Property address
              </span>
              <input
                name="address"
                required
                autoComplete="street-address"
                className="min-h-14 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#91e84d]/60"
                placeholder="Street address or general location"
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                <CalendarDays size={13} />
                Preferred timing
              </span>
              <input
                name="timing"
                required
                className="min-h-14 w-full rounded-xl border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#91e84d]/60"
                placeholder="As soon as possible, this week, flexible..."
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                Property details
              </span>
              <textarea
                name="details"
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-[#91e84d]/60"
                placeholder="Describe the yard, access, problem areas, or anything Eric should know."
              />
            </label>

            <button
              type="submit"
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-[#91e84d] px-7 text-sm font-black uppercase tracking-[0.12em] text-[#10140d] transition hover:bg-[#a8f56b] sm:col-span-2"
            >
              Text My Estimate Request
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