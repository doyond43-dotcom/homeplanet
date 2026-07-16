import { MessageCircle, Phone } from "lucide-react";

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050705] text-white">
      <section className="relative min-h-screen overflow-hidden bg-[#08792b]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_10%,rgba(182,255,52,0.18),transparent_28%),linear-gradient(135deg,#0a8b32_0%,#08772a_48%,#04551d_100%)]" />

        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full border-[58px] border-white/[0.045]" />

        <div className="relative z-20 mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <header className="flex min-h-[78px] items-center justify-between gap-5">
            <a href="/vz" className="flex items-center gap-3 text-white">
              <div className="flex items-center text-3xl font-black tracking-[-0.1em]">
                V
                <span className="mx-1 text-lg text-lime-300">&amp;</span>
                Z
              </div>

              <div className="hidden leading-none sm:block">
                <p className="text-xs font-black uppercase tracking-[0.22em]">
                  Professional
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.24em] text-lime-300">
                  Lawncare LLC
                </p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <a
                href={`sms:${phone}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/25 bg-black/10 px-4 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm"
              >
                <MessageCircle size={15} />
                <span className="hidden sm:inline">Text Eric</span>
                <span className="sm:hidden">Text</span>
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-yellow-400 px-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-lg shadow-black/15"
              >
                <Phone size={15} />
                <span className="hidden sm:inline">Free Estimate</span>
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </header>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-78px)] max-w-7xl items-center px-5 pb-32 pt-10 sm:px-8 sm:pb-40 lg:px-12 lg:pb-44">
          <div className="w-full max-w-5xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-yellow-300 sm:text-sm">
              Professional lawn and exterior property care
            </p>

            <div className="mt-7 flex items-center text-[6.5rem] font-black leading-[0.76] tracking-[-0.12em] sm:text-[9rem] lg:text-[13rem]">
              V
              <span className="mx-2 text-[0.45em] text-lime-300">&amp;</span>
              Z
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-2xl font-black uppercase tracking-[0.16em] sm:text-3xl lg:text-4xl">
                Professional
              </p>

              <h1 className="mt-2 text-4xl font-black uppercase leading-[0.94] tracking-[-0.04em] text-yellow-300 sm:text-6xl lg:text-7xl">
                Lawncare LLC
              </h1>

              <p className="mt-7 max-w-2xl text-base font-semibold leading-7 text-white/85 sm:text-lg">
                Mowing, edging, trimming, mulch installation, gutter cleaning,
                window cleaning, roof cleaning, and additional exterior
                property services.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 text-sm font-black uppercase tracking-[0.18em] text-black shadow-xl shadow-black/20"
                >
                  <Phone size={17} />
                  Get Free Estimate
                </a>

                <a
                  href={`sms:${phone}`}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/30 bg-black/10 px-7 text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm"
                >
                  <MessageCircle size={17} />
                  Text Eric
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-36 -left-[12%] right-[-12%] z-[2] h-[300px] rotate-[-5deg] rounded-[50%_50%_0_0] bg-[#050705]" />
        <div className="absolute bottom-[128px] -left-[10%] right-[-10%] z-[3] h-[14px] rotate-[-5deg] rounded-full bg-yellow-400" />
        <div className="absolute bottom-[113px] -left-[10%] right-[-10%] z-[4] h-[5px] rotate-[-5deg] rounded-full bg-lime-300" />

        <div className="absolute bottom-7 left-0 right-0 z-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8 lg:px-12">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white">
              Professional · Reliable · Detail Driven
            </p>

            <a
              href={`tel:${phone}`}
              className="text-2xl font-black tracking-[-0.03em] text-yellow-300 sm:text-3xl"
            >
              (863) 532-8123
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}