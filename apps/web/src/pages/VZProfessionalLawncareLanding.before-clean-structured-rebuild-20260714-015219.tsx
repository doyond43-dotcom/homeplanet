import {
  ArrowRight,
  Check,
  Image as ImageIcon,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";
  const formattedPhone = "(863) 532-8123";

  return (
    <main className="min-h-screen bg-[#090b09] text-white">
      <header className="border-b border-white/10 bg-[#090b09]">
        <div className="mx-auto flex min-h-[78px] max-w-[1380px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <a href="/vz" className="flex min-w-0 items-center gap-3 text-white no-underline">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#f5d20a] text-base font-black text-black">
              VZ
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black uppercase tracking-[0.02em] sm:text-base">
                V&amp;Z Professional Lawncare
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.24em] text-white/45">
                Lawn &amp; exterior property care
              </p>
            </div>
          </a>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`sms:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-[10px] font-black uppercase tracking-[0.13em] text-white transition hover:border-white/30 sm:px-4"
            >
              <MessageCircle size={15} />
              <span className="hidden sm:inline">Text Eric</span>
              <span className="sm:hidden">Text</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#f5d20a] px-3 text-[10px] font-black uppercase tracking-[0.13em] text-black transition hover:bg-[#ffe33c] sm:px-4"
            >
              <Phone size={15} />
              Call
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-78px)] max-w-[1380px] gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14 lg:px-10 lg:py-16">
          <div className="relative z-10 max-w-[660px]">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[3px] w-10 bg-[#f5d20a]" />
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/55">
                Local lawn and property care
              </p>
            </div>

            <h1 className="text-[clamp(3.45rem,7.2vw,7.2rem)] font-black uppercase leading-[0.82] tracking-[-0.075em]">
              Clean yards.
              <span className="mt-2 block text-[#91e84d]">
                Reliable work.
              </span>
            </h1>

            <p className="mt-7 max-w-[590px] text-lg leading-8 text-white/65 sm:text-xl">
              Mowing, edging, trimming, mulch installation, cleanup, and
              exterior property care from V&amp;Z Professional Lawncare.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${phone}`}
                className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-md bg-[#f5d20a] px-6 text-sm font-black uppercase tracking-[0.11em] text-black transition hover:bg-[#ffe33c]"
              >
                <Phone size={18} />
                Call Eric
                <span className="text-black/60">{formattedPhone}</span>
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-md border border-white/18 px-6 text-sm font-black uppercase tracking-[0.11em] text-white transition hover:border-[#91e84d]/60"
              >
                <MessageCircle size={18} />
                Text for estimate
              </a>
            </div>

            <div className="mt-8 grid max-w-[560px] gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
              {[
                "Free estimates",
                "Direct contact",
                "Local service",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/45"
                >
                  <Check size={14} className="text-[#91e84d]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 border border-white/[0.04]" />

            <div className="relative min-h-[430px] overflow-hidden border border-white/10 bg-[#111611] sm:min-h-[560px] lg:min-h-[650px]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#151b14_0%,#0d110d_62%,#171b11_100%)]" />

              <div className="absolute inset-x-0 bottom-0 h-1 bg-[#f5d20a]" />

              <div className="absolute left-6 top-6 z-10 rounded-md border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                  V&amp;Z in action
                </p>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-[300px] px-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/35">
                    <ImageIcon size={24} />
                  </div>

                  <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-white/45">
                    Hero image area
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/30">
                    The finished lawn-care image will fill this entire frame
                    without changing the structure of the hero.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
                    Call or text
                  </p>
                  <p className="mt-2 text-lg font-black">{formattedPhone}</p>
                </div>

                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#91e84d]">
                  Free estimates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}