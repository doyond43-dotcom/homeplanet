import React from "react";
import { Link } from "react-router-dom";

export default function SlapABugLandingPage() {
  const services = [
    ["Ant Control", "Trails, kitchens, bathrooms, porches, and entry points."],
    ["Roach Control", "Inside activity, kitchens, bathrooms, garages, and urgent issues."],
    ["Rodent Control", "Sheds, barns, garages, feed rooms, RVs, and storage areas."],
    ["Spider Treatments", "Porches, corners, garages, lanais, and exterior web activity."],
    ["Fleas / Ticks", "Yards, pets areas, rental resets, and repeat activity."],
    ["Wasps / Hornets", "Nests, rooflines, sheds, barns, and entry areas."],
    ["Mosquitoes", "Yard, perimeter, standing water, and outdoor living areas."],
    ["Not Sure", "Send Brad what you’re seeing and where it’s happening."]
  ];

  return (
    <main className="min-h-screen bg-[#020609] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(25,118,210,0.34),transparent_32%),radial-gradient(circle_at_60%_45%,rgba(34,197,94,0.16),transparent_38%),radial-gradient(circle_at_bottom,rgba(239,35,35,0.20),transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06101d]/70 via-[#031009]/90 to-[#020609]" />

        <div className="relative mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-7 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-[0_0_50px_rgba(32,130,255,0.25)]">
              <div className="text-center">
                <div className="text-4xl font-black text-[#63d83f]">BUG</div>
                <div className="-mt-1 text-xs font-black tracking-[0.25em] text-red-400">SLAP-A</div>
              </div>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.42em] text-red-400">
              Okeechobee Pest Control
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-tight sm:text-7xl">
              Got Bugs?
              <br />
              Slap ’Em.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/74">
              Local pest control for homes, sheds, barns, RVs, mobile homes and businesses
              around Okeechobee.
            </p>

            <div className="mx-auto mt-8 grid max-w-xl gap-3">
              <a
                href="tel:8633683628"
                className="rounded-2xl bg-[#e92929] px-7 py-5 text-center text-lg font-black text-white shadow-[0_0_35px_rgba(233,41,41,0.35)]"
              >
                Call Now
              </a>

              <Link
                to="/planet/slap-a-bug/request"
                className="rounded-2xl bg-[#28c765] px-7 py-5 text-center text-lg font-black text-black shadow-[0_0_35px_rgba(40,199,101,0.28)]"
              >
                Request Free Estimate
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/75">
                Local & Family Owned
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/75">
                Free Estimates
              </span>
              <span className="rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/75">
                Homes & Businesses
              </span>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] border border-[#1d79d6]/40 bg-[#07182a] shadow-[0_0_60px_rgba(29,121,214,0.22)]">
            <div className="aspect-[16/7] bg-[linear-gradient(135deg,rgba(29,121,214,0.35),rgba(2,6,9,0.95)),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_25%)]">
              <div className="flex h-full items-center justify-center px-6 text-center">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.36em] text-red-300">
                    Meet Brad
                  </p>
                  <h2 className="mt-3 text-4xl font-black">Welcome Video</h2>
                  <p className="mx-auto mt-3 max-w-xl text-white/70">
                    Watch this first, then tap the option that best matches what you’re seeing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-red-400">
            Tap To Request
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            What kind of pest issue?
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {services.map(([title, text]) => (
            <Link
              key={title}
              to={`/planet/slap-a-bug/request?issue=${encodeURIComponent(title)}`}
              className="group rounded-3xl border border-white/10 bg-black/45 p-5 transition hover:border-[#28c765]/60 hover:bg-[#082013]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black">{title}</h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/38">
                    Tap to request
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/62">{text}</p>
                </div>
                <span className="rounded-full bg-[#e92929] px-3 py-1 text-xs font-black text-white opacity-0 transition group-hover:opacity-100">
                  GO
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="rounded-[2rem] border border-red-500/30 bg-[linear-gradient(135deg,rgba(233,41,41,0.15),rgba(0,0,0,0.45))] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-red-300">
            Rodent Awareness
          </p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/82">
            With all the recent talk about rodents and hantavirus, now is a good time
            to protect garages, sheds, barns, feed rooms, RVs, and storage spaces before
            a small problem becomes a bigger one.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-5 py-8 sm:px-8 lg:grid-cols-4">
        {[
          ["1", "Tell Brad what you’re seeing"],
          ["2", "Send the details first"],
          ["3", "Brad reviews the issue"],
          ["4", "Schedule service or follow-up"]
        ].map(([num, text]) => (
          <div key={num} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1d79d6] text-lg font-black">
              {num}
            </div>
            <p className="mt-4 text-lg font-black">{text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-[#28c765]">
            Community Proof
          </p>
          <h2 className="mt-3 text-3xl font-black">A local brand people remember.</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/70">
            Slap A Bug already has the hard part — a name people notice, a truck people
            recognize, and a brand that sticks. This page gives that brand a cleaner way
            to collect requests, organize details, follow up, schedule work, and turn
            completed jobs into proof.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8 text-center sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.42em] text-white/45">
          Call or Text Today
        </p>
        <a
          href="tel:8633683628"
          className="mt-4 block text-4xl font-black text-[#28c765] sm:text-5xl"
        >
          (863) 368-3628
        </a>

        <Link
          to="/planet/slap-a-bug/request"
          className="mt-8 inline-flex rounded-2xl bg-[#e92929] px-8 py-5 text-lg font-black text-white"
        >
          Request Free Estimate
        </Link>
      </section>
    </main>
  );
}
