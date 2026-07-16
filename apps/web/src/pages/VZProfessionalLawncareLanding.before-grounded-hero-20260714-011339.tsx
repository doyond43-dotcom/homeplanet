import {
  ArrowRight,
  Check,
  Leaf,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Lawn Mowing",
    description:
      "Reliable mowing that keeps your property looking clean, even, and professionally maintained.",
  },
  {
    number: "02",
    title: "Edging",
    description:
      "Sharp, defined edges around driveways, walkways, landscaping, and property lines.",
  },
  {
    number: "03",
    title: "Trimming",
    description:
      "Careful trimming around fences, trees, structures, and the areas your mower cannot reach.",
  },
  {
    number: "04",
    title: "Mulch Installation",
    description:
      "Fresh mulch installation that improves curb appeal and gives landscape beds a finished look.",
  },
  {
    number: "05",
    title: "Property Cleanup",
    description:
      "Seasonal cleanup, debris removal, and detail work that helps restore an overgrown property.",
  },
  {
    number: "06",
    title: "Exterior Property Care",
    description:
      "Additional outdoor property services available based on the condition and needs of your home.",
  },
];

const standards = [
  "Clear communication",
  "Dependable local service",
  "Attention to the small details",
  "Straightforward estimates",
];

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";
  const formattedPhone = "(863) 532-8123";

  return (
    <main className="min-h-screen overflow-hidden bg-[#090b09] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-18rem] top-[-16rem] h-[38rem] w-[38rem] rounded-full bg-[#8dff45]/[0.07] blur-[120px]" />
        <div className="absolute right-[-20rem] top-[18rem] h-[42rem] w-[42rem] rounded-full bg-[#f0c94c]/[0.05] blur-[140px]" />
      </div>

      <header className="relative z-20 border-b border-white/[0.08] bg-[#090b09]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[78px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a href="/vz" className="min-w-0 text-white no-underline">
            <p className="truncate text-[15px] font-black uppercase tracking-[-0.02em] sm:text-lg">
              V&amp;Z Professional Lawncare
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#9ca39b]">
              Local Property Care
            </p>
          </a>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`sms:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3 text-[11px] font-black uppercase tracking-[0.12em] text-white transition hover:border-[#a7ff6a]/50 hover:bg-[#a7ff6a]/10 sm:px-4"
            >
              <MessageCircle size={15} />
              <span className="hidden sm:inline">Text Eric</span>
              <span className="sm:hidden">Text</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#b7ff75] px-3 text-[11px] font-black uppercase tracking-[0.12em] text-[#10150d] transition hover:bg-[#c8ff99] sm:px-4"
            >
              <Phone size={15} />
              Call
            </a>
          </div>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:gap-16 lg:px-12 lg:pb-28 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a7ff6a]/20 bg-[#a7ff6a]/[0.07] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#a7ff6a] shadow-[0_0_18px_rgba(167,255,106,0.9)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#cbffad]">
                Professional lawn and property care
              </span>
            </div>

            <h1 className="max-w-4xl text-[clamp(3.35rem,9vw,7.4rem)] font-black leading-[0.86] tracking-[-0.075em]">
              Clean work.
              <span className="mt-2 block text-[#b7ff75]">Strong curb appeal.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#b4bab2] sm:text-xl">
              Dependable lawn maintenance and exterior property care from
              V&amp;Z Professional Lawncare LLC.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${phone}`}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#b7ff75] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#10150d] transition hover:bg-[#c8ff99]"
              >
                <Phone size={18} />
                Call {formattedPhone}
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-white/30 hover:bg-white/[0.08]"
              >
                <MessageCircle size={18} />
                Text Eric
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-[#9ca39b]">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#b7ff75]" />
                Free estimates
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#b7ff75]" />
                Local service
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-[#b7ff75]" />
                Simple communication
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-[2.2rem] border border-[#b7ff75]/10 bg-[#b7ff75]/[0.03]" />

            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#111411] p-6 shadow-2xl shadow-black/40 sm:p-8">
              <div className="absolute right-[-6rem] top-[-6rem] h-52 w-52 rounded-full bg-[#b7ff75]/10 blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#828a80]">
                      Property care
                    </p>
                    <p className="mt-2 text-2xl font-black tracking-[-0.04em]">
                      Done the right way.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#b7ff75]/20 bg-[#b7ff75]/10 text-[#b7ff75]">
                    <Leaf size={27} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {standards.map((standard) => (
                    <div
                      key={standard}
                      className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 px-4 py-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b7ff75] text-[#10150d]">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <span className="font-bold text-[#e5e8e3]">
                        {standard}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-[#e5c65a]/20 bg-[#e5c65a]/[0.07] p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles
                      size={20}
                      className="mt-0.5 shrink-0 text-[#f3d96d]"
                    />
                    <div>
                      <p className="font-black text-[#fff2bb]">
                        Need more than mowing?
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#bdb79e]">
                        Tell us what the property needs. We will let you know
                        what can be handled and provide a straightforward
                        estimate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="relative z-10 border-y border-white/[0.07] bg-white/[0.018]"
      >
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#b7ff75]">
              Services
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">
              Property care without the runaround.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#9da49b]">
              Start with the work your property needs. V&amp;Z will help
              determine the right service and next step.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.number}
                className="group min-h-[250px] rounded-[1.75rem] border border-white/[0.09] bg-[#101310] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b7ff75]/30 hover:bg-[#131713]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black tracking-[0.22em] text-[#697067]">
                    {service.number}
                  </span>
                  <ArrowRight
                    size={18}
                    className="text-[#697067] transition group-hover:translate-x-1 group-hover:text-[#b7ff75]"
                  />
                </div>

                <h3 className="mt-14 text-2xl font-black tracking-[-0.04em]">
                  {service.title}
                </h3>
                <p className="mt-4 leading-7 text-[#969d94]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#111411] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[340px] overflow-hidden bg-[#b7ff75] p-8 text-[#10150d] sm:p-10 lg:min-h-[520px] lg:p-12">
              <div className="absolute bottom-[-8rem] right-[-8rem] h-80 w-80 rounded-full border-[70px] border-black/[0.06]" />
              <div className="absolute right-10 top-10 h-24 w-24 rounded-full border-[22px] border-black/[0.05]" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10150d] text-[#b7ff75]">
                  <ShieldCheck size={31} />
                </div>

                <div className="mt-20">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-black/55">
                    V&amp;Z standard
                  </p>
                  <h2 className="mt-4 max-w-md text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                    Your property should look cared for.
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#b7ff75]">
                Request an estimate
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                Tell Eric what needs attention.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#9da49b]">
                Call or text with the property location and the work you need.
                Photos can help make the estimate faster and more accurate.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`sms:${phone}`}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#b7ff75] px-6 text-sm font-black uppercase tracking-[0.12em] text-[#10150d] transition hover:bg-[#c8ff99]"
                >
                  <MessageCircle size={18} />
                  Text Eric
                </a>

                <a
                  href={`tel:${phone}`}
                  className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/15 px-6 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-white/30 hover:bg-white/[0.05]"
                >
                  <Phone size={18} />
                  {formattedPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <p className="font-black">V&amp;Z Professional Lawncare LLC</p>
            <p className="mt-1 text-sm text-[#737a71]">
              Professional lawn and exterior property care.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
            <a
              href={`tel:${phone}`}
              className="text-white transition hover:text-[#b7ff75]"
            >
              {formattedPhone}
            </a>
            <span className="text-white/20">•</span>
            <a
              href={`sms:${phone}`}
              className="text-white transition hover:text-[#b7ff75]"
            >
              Text Eric
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}