import React from "react";

export default function VZProfessionalLawncareLanding() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/10">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(76,255,80,.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(255,214,10,.10),transparent_45%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-14 px-6 py-20 lg:flex-row lg:items-center lg:justify-between">

          <div className="max-w-2xl">

            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-green-500/40 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_12px_#4ade80]" />
              LIVE â€¢ V&Z PROFESSIONAL LAWNCARE LLC
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Professional
              <span className="block text-green-400">
                Lawn Care.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-300">
              Mowing, edging, trimming, mulch installation, gutter
              cleaning, roof cleaning, window cleaning and more.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="tel:8635328123"
                className="rounded-xl bg-green-500 px-7 py-4 font-bold text-black transition hover:scale-105"
              >
                Call
              </a>

              <a
                href="sms:8635328123"
                className="rounded-xl border border-green-500 px-7 py-4 font-bold transition hover:bg-green-500/10"
              >
                Text
              </a>

              <button
                className="rounded-xl bg-yellow-400 px-7 py-4 font-bold text-black transition hover:scale-105"
              >
                Get My Quote
              </button>

            </div>

          </div>

          <div className="flex-1">

            <div className="overflow-hidden rounded-[32px] border border-green-500/30 bg-zinc-900 shadow-[0_0_60px_rgba(34,197,94,.18)]">

              <div className="aspect-[4/5] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">

                <div className="w-full max-w-md rounded-3xl border border-green-400/30 bg-black/70 p-8 backdrop-blur">

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold tracking-widest text-green-300">
                    â— NOW BOOKING
                  </div>

                  <h2 className="text-4xl font-black leading-tight">
                    V&Z
                  </h2>

                  <p className="mt-2 text-green-400 font-semibold">
                    Professional Lawncare LLC
                  </p>

                  <div className="mt-8 space-y-3 text-zinc-300">

                    <div>âœ“ Lawn Mowing</div>
                    <div>âœ“ Edging & Trimming</div>
                    <div>âœ“ Mulch Installation</div>
                    <div>âœ“ Gutter Cleaning</div>
                    <div>âœ“ Window Cleaning</div>
                    <div>âœ“ Roof Cleaning</div>

                  </div>

                  <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4">

                    <p className="text-sm font-semibold text-yellow-300">
                      Fast Quotes â€¢ Professional Service â€¢ Reliable Scheduling
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


      {/* =========================
          SERVICES
      ========================= */}

      <section className="border-t border-white/5 bg-zinc-950 py-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <div className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-bold tracking-wide text-green-300">
              OUR SERVICES
            </div>

            <h2 className="mt-6 text-4xl font-black md:text-5xl">
              Everything Your Property Needs
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg text-zinc-400">
              Professional exterior property maintenance from one dependable company.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {[
              ["🌱","Lawn Mowing"],
              ["📏","Edging"],
              ["✂️","Trimming"],
              ["🌿","Mulch Installation"],
              ["🏠","Gutter Cleaning"],
              ["🪟","Window Cleaning"],
              ["🧼","Roof Cleaning"],
              ["⭐","More Exterior Services"]
            ].map(([icon,title]) => (

              <div
                key={title}
                className="group rounded-3xl border border-white/10 bg-zinc-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:bg-zinc-800"
              >

                <div className="mb-5 text-5xl">
                  {icon}
                </div>

                <h3 className="text-2xl font-bold">
                  {title}
                </h3>

                <p className="mt-3 text-zinc-400">
                  Professional workmanship with dependable scheduling and communication.
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}
