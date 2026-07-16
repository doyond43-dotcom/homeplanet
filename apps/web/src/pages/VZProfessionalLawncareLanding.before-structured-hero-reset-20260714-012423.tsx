import { ArrowDown, MessageCircle, Phone } from "lucide-react";

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";
  const formattedPhone = "(863) 532-8123";

  return (
    <main className="min-h-screen bg-[#070907] text-white">
      <header className="relative z-30 border-b border-white/10 bg-[#070907]">
        <div className="mx-auto flex min-h-[78px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a href="/vz" className="min-w-0 text-white no-underline">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#f5d20a] text-[17px] font-black tracking-[-0.08em] text-black">
                VZ
              </div>

              <div className="min-w-0">
                <p className="truncate text-[14px] font-black uppercase tracking-[0.02em] sm:text-base">
                  V&amp;Z Professional Lawncare
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.28em] text-[#8f978c]">
                  Lawn &amp; Exterior Property Care
                </p>
              </div>
            </div>
          </a>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`sms:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#8ae649] hover:text-[#a9ff6b] sm:px-4"
            >
              <MessageCircle size={15} />
              <span className="hidden sm:inline">Text Eric</span>
              <span className="sm:hidden">Text</span>
            </a>

            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#f5d20a] px-3 text-[10px] font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ffe23b] sm:px-4"
            >
              <Phone size={15} />
              Call
            </a>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-78px)] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(116deg, #182317 0px, #182317 88px, #0d140c 88px, #0d140c 176px)",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070907_0%,rgba(7,9,7,0.98)_42%,rgba(7,9,7,0.82)_67%,rgba(7,9,7,0.48)_100%)]" />



        <div className="absolute bottom-0 left-0 right-0 h-[7px] bg-[#f5d20a]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-78px)] max-w-[1440px] items-center px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="w-full max-w-[980px]">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[3px] w-12 bg-[#f5d20a]" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d4dbd0]">
                Local lawn service â€¢ Direct contact â€¢ Free estimates
              </p>
            </div>

            <p className="text-[clamp(1.8rem,4vw,4.25rem)] font-black uppercase leading-none tracking-[-0.055em] text-[#f5d20a]">
              V&amp;Z
            </p>

            <h1 className="mt-2 max-w-[1100px] text-[clamp(3.7rem,9vw,9rem)] font-black uppercase leading-[0.78] tracking-[-0.085em]">
              Professional
              <span className="block text-[#8fe850]">Lawncare.</span>
            </h1>

            <p className="mt-8 max-w-[690px] text-lg font-medium leading-8 text-[#b7beb3] sm:text-xl">
              Mowing, edging, trimming, mulch installation, property cleanup,
              and exterior care handled with clear communication and attention
              to detail.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-[60px] items-center justify-center gap-3 rounded-lg bg-[#f5d20a] px-7 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffe23b]"
              >
                <Phone size={19} />
                Call Eric
                <span className="text-black/65">{formattedPhone}</span>
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-[60px] items-center justify-center gap-3 rounded-lg border border-white/20 bg-black/30 px-7 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:border-[#8fe850]"
              >
                <MessageCircle size={19} />
                Text for an estimate
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6">
              {[
                "Lawn mowing",
                "Edging",
                "Trimming",
                "Mulch",
                "Property cleanup",
              ].map((service) => (
                <span
                  key={service}
                  className="text-[10px] font-black uppercase tracking-[0.18em] text-[#92998f]"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 xl:flex">
            <span className="text-[9px] font-black uppercase tracking-[0.26em] text-white/40">
              Services below
            </span>
            <ArrowDown size={17} className="text-[#f5d20a]" />
          </div>
        </div>
      </section>
    </main>
  );
}