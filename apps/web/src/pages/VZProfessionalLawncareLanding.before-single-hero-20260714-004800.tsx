import {
  Check,
  ChevronDown,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050605] text-white">
      <section className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(8,127,35,0.16),transparent_31rem),radial-gradient(circle_at_10%_90%,rgba(127,207,0,0.06),transparent_25rem),linear-gradient(135deg,#050605_0%,#070a07_55%,#030403_100%)]" />

        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden lg:block">
          <div className="absolute inset-y-[-10%] left-[8%] right-[-18%] rotate-[7deg] rounded-l-[8rem] border-l border-lime-300/15 bg-[linear-gradient(145deg,#0a8a32_0%,#076923_43%,#034015_100%)] shadow-[-30px_0_100px_rgba(0,0,0,0.52)]" />

          <div className="absolute right-[-11rem] top-[-8rem] h-[29rem] w-[29rem] rounded-full border-[4.5rem] border-white/[0.045]" />

          <div className="absolute bottom-[18%] left-[-4%] right-[-20%] h-[9px] rotate-[-7deg] rounded-full bg-yellow-400" />

          <div className="absolute bottom-[16.6%] left-[-4%] right-[-20%] h-[3px] rotate-[-7deg] rounded-full bg-lime-300" />
        </div>

        <div className="relative z-20 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="flex min-h-[80px] items-center justify-between gap-5 border-b border-white/[0.07]">
            <a href="/vz" className="flex items-center gap-3 text-white">
              <div className="flex items-center text-3xl font-black tracking-[-0.1em]">
                V
                <span className="mx-1 text-lg text-lime-300">&amp;</span>
                Z
              </div>

              <div className="leading-none">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  Professional
                </p>

                <p className="mt-1 text-[9px] font-black uppercase tracking-[0.22em] text-yellow-300">
                  Lawncare LLC
                </p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <a
                href={`sms:${phone}`}
                className="hidden min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.035] px-5 text-[11px] font-black uppercase tracking-[0.17em] text-white transition hover:border-lime-300/45 hover:bg-lime-300/[0.06] sm:inline-flex"
              >
                <MessageCircle size={15} />
                Text Eric
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 text-[11px] font-black uppercase tracking-[0.17em] text-black shadow-lg shadow-yellow-500/10 transition hover:-translate-y-0.5"
              >
                <Phone size={15} />
                Free Estimate
              </a>
            </div>
          </header>
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:px-12 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-lime-300">
              <span className="h-2 w-2 rounded-full bg-yellow-400 shadow-[0_0_0_5px_rgba(250,204,21,0.08)]" />
              Lawn and exterior property care
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-[5.6rem]">
              Clean work that makes your
              <span className="block text-lime-300">
                property stand out.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              Professional mowing, edging, trimming, mulch installation,
              gutter cleaning, window cleaning, roof cleaning, and exterior
              property care around Okeechobee.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 text-xs font-black uppercase tracking-[0.19em] text-black shadow-xl shadow-yellow-500/10 transition hover:-translate-y-0.5"
              >
                <Phone size={17} />
                Get Free Estimate
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-lime-300/30 bg-lime-300/[0.055] px-7 text-xs font-black uppercase tracking-[0.19em] text-white transition hover:border-lime-300/60 hover:bg-lime-300/[0.09]"
              >
                <MessageCircle size={17} />
                Text Eric
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-yellow-300" />
                Free estimates
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-yellow-300" />
                Reliable service
              </span>

              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-yellow-300" />
                Detail driven
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto">
            <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#0b0e0b] p-5 shadow-[0_35px_100px_rgba(0,0,0,0.55)] sm:p-6">
              <div className="relative min-h-[430px] overflow-hidden rounded-[1.65rem] bg-[linear-gradient(145deg,#0b8b34_0%,#076a27_52%,#034116_100%)] px-8 py-9 sm:min-h-[500px] sm:px-10 sm:py-11">
                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[3.4rem] border-white/[0.05]" />

                <div className="relative z-10">
                  <div className="flex items-end gap-2">
                    <div className="text-[5.6rem] font-black leading-[0.76] tracking-[-0.11em] text-white sm:text-[7.2rem]">
                      V
                    </div>

                    <div className="pb-2 text-4xl font-black text-lime-300 sm:text-5xl">
                      &amp;
                    </div>

                    <div className="text-[5.6rem] font-black leading-[0.76] tracking-[-0.11em] text-white sm:text-[7.2rem]">
                      Z
                    </div>
                  </div>

                  <p className="mt-9 text-sm font-black uppercase tracking-[0.24em] text-white">
                    Professional
                  </p>

                  <p className="mt-2 text-3xl font-black uppercase leading-none tracking-[-0.025em] text-yellow-300 sm:text-4xl">
                    Lawncare LLC
                  </p>

                  <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-3 text-sm font-extrabold text-white/90">
                    <span className="inline-flex items-center gap-2">
                      <Check size={15} className="text-yellow-300" />
                      Mowing
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Check size={15} className="text-yellow-300" />
                      Gutter Cleaning
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Check size={15} className="text-yellow-300" />
                      Edging
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Check size={15} className="text-yellow-300" />
                      Window Cleaning
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Check size={15} className="text-yellow-300" />
                      Trimming
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Check size={15} className="text-yellow-300" />
                      Roof Cleaning
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-20 -left-24 right-[-7rem] h-52 rotate-[-8deg] rounded-[50%] bg-[#050605]" />

                <div className="absolute bottom-[92px] -left-20 right-[-7rem] h-[8px] rotate-[-8deg] rounded-full bg-yellow-400" />

                <div className="absolute bottom-[79px] -left-20 right-[-7rem] h-[3px] rotate-[-8deg] rounded-full bg-lime-300" />

                <a
                  href={`tel:${phone}`}
                  className="absolute bottom-7 left-8 z-20 text-xl font-black tracking-[-0.025em] text-white sm:left-10 sm:text-2xl"
                >
                  (863) 532-8123
                </a>
              </div>
            </div>
          </div>
        </div>

        <a
          href="#vz-next"
          aria-label="Continue down the page"
          className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500 lg:flex"
        >
          Explore services
          <ChevronDown size={15} />
        </a>
      </section>

      <div id="vz-next" />
    </main>
  );
}