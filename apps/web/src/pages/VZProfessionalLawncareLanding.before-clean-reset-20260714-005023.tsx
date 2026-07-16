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

          <div className="relative hidden min-h-[560px] items-center justify-center lg:flex">
            <div className="relative z-10 w-full max-w-[470px] pl-12">
              <div className="flex items-end gap-3">
                <span className="text-[8rem] font-black leading-[0.74] tracking-[-0.12em] text-white">
                  V
                </span>

                <span className="pb-3 text-5xl font-black text-lime-300">
                  &amp;
                </span>

                <span className="text-[8rem] font-black leading-[0.74] tracking-[-0.12em] text-white">
                  Z
                </span>
              </div>

              <p className="mt-10 text-sm font-black uppercase tracking-[0.28em] text-white">
                Professional
              </p>

              <p className="mt-3 text-4xl font-black uppercase leading-none tracking-[-0.03em] text-yellow-300">
                Lawncare LLC
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-extrabold text-white/90">
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

              <a
                href={`tel:${phone}`}
                className="mt-12 inline-block text-3xl font-black tracking-[-0.035em] text-white"
              >
                (863) 532-8123
              </a>
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