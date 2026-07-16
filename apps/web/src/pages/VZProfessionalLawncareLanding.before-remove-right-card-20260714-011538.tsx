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
          className="absolute inset-0 opacity-[0.24]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(116deg, #172015 0px, #172015 78px, #0d130c 78px, #0d130c 156px)",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#070907_0%,rgba(7,9,7,0.96)_38%,rgba(7,9,7,0.58)_68%,rgba(7,9,7,0.82)_100%)]" />

        <div className="absolute right-[-8rem] top-[8%] hidden h-[42rem] w-[42rem] rounded-full border-[6rem] border-[#8ae649]/[0.055] lg:block" />

        <div className="absolute bottom-0 left-0 right-0 h-[7px] bg-[#f5d20a]" />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-78px)] max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-20">
          <div className="max-w-[780px]">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[3px] w-12 bg-[#f5d20a]" />
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d4dbd0]">
                Local lawn service • Direct contact • Free estimates
              </p>
            </div>

            <p className="text-[clamp(1.8rem,4vw,4.25rem)] font-black uppercase leading-none tracking-[-0.055em] text-[#f5d20a]">
              V&amp;Z
            </p>

            <h1 className="mt-2 max-w-[850px] text-[clamp(3.7rem,8.8vw,8.9rem)] font-black uppercase leading-[0.78] tracking-[-0.085em]">
              Professional
              <span className="block text-[#8fe850]">Lawncare.</span>
            </h1>

            <p className="mt-8 max-w-[650px] text-lg font-medium leading-8 text-[#b7beb3] sm:text-xl">
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

          <div className="relative hidden min-h-[620px] lg:block">
            <div className="absolute bottom-[5%] right-[3%] top-[4%] w-[82%] overflow-hidden rounded-[2rem] border border-white/10 bg-[#10150f] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(132deg, #284222 0px, #284222 62px, #1b3118 62px, #1b3118 124px)",
                }}
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,7,0.08),rgba(7,9,7,0.7))]" />

              <div className="absolute left-[-14%] top-[24%] h-[52%] w-[112%] rotate-[-11deg] border-y-[26px] border-[#f5d20a]/95 bg-black/80 shadow-2xl">
                <div className="flex h-full items-center px-16">
                  <div>
                    <p className="text-[5.8rem] font-black uppercase leading-[0.78] tracking-[-0.1em] text-white">
                      V&amp;Z
                    </p>
                    <p className="mt-5 text-xl font-black uppercase tracking-[0.16em] text-[#f5d20a]">
                      Professional Lawncare
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between border-t border-white/20 pt-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                    Call or text Eric
                  </p>
                  <p className="mt-2 text-xl font-black">{formattedPhone}</p>
                </div>

                <div className="rounded-lg bg-[#8fe850] px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                  Free estimates
                </div>
              </div>
            </div>

            <div className="absolute left-[4%] top-[12%] flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full border-[10px] border-[#f5d20a] bg-[#070907] text-center text-[10px] font-black uppercase leading-4 tracking-[0.08em] text-white shadow-2xl">
              Local
              <br />
              Service
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