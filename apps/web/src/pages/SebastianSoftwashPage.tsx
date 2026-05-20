import React from "react";
import { ArrowRight, Droplets, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";

export default function SebastianSoftwashPage() {
  return (
    <main className="min-h-screen bg-[#05070d] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-5">
        <div className="mb-4 rounded-[2rem] border border-blue-500/20 bg-white/5 p-4 shadow-2xl shadow-blue-950/40">
          <div className="mb-3 flex items-center justify-between">
            <div className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
              Okeechobee Summer Work
            </div>
            <div className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-200">
              Sebastian
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.06]">
            <img
              src="/images/sebastian-softwash-hero.jpg"
              alt="Sebastian pressure washing"
              className="h-80 w-full object-cover object-top"
            />
          </div>

          <div className="pt-5">
            <h1 className="text-4xl font-black leading-none tracking-tight">
              Sebastian's Summer Softwash
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Helping local families around Okeechobee with pressure washing,
              outdoor cleanup, and summer Pressure washing and outdoor cleanup.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-4">
            <p className="text-sm font-black text-blue-100">
              No square footage headaches.
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Just upload or text a photo of what you need cleaned up and I’ll give you a fair price.
            </p>
          </div>

            <a
              href="sms:+18635320683"
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-blue-500/20"
            >
              <MessageCircle size={18} />
              Message
            </a>
            <a
              href="tel:+18635320683"
              className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-4 text-sm font-black text-white shadow-lg shadow-red-500/20"
            >
              <Phone size={18} />
              Call
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <section className="rounded-[1.6rem] border border-white/10 bg-white/[0.06] p-5">
            <div className="mb-3 flex items-center gap-2 text-blue-200">
              <Sparkles size={18} />
              <p className="text-sm font-black uppercase tracking-wide">About</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              Hey guys — My name is Sebastian. I’m looking to stay busy this
              summer and earn some extra money helping people around Okeechobee
              with pressure washing and outdoor cleanup jobs.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-3">
            {[
              "Driveways",
              "Sidewalks",
              "Patios",
              "Outdoor Cleanup",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-white/10 bg-white/[0.06] p-4"
              >
                <Droplets className="mb-3 text-blue-300" size={21} />
                <p className="font-black">{item}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Simple local cleanup work.
                </p>
              </div>
            ))}
          </section>
          <section className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <p className="text-sm font-black uppercase tracking-wide text-blue-200">
                Recent Work
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "/images/sebastian-softwash-action-1.jpg",
                "/images/sebastian-softwash-action-2.jpg",
                "/images/sebastian-softwash-surface-cleaner-final.jpg",
                "/images/sebastian-softwash-driveway-detail.jpg",
              ].map((image) => (
                <div
                  key={image}
                  className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black shadow-lg shadow-black/40"
                >
                  <img
                    src={image}
                    alt="Sebastian pressure washing"
                    className="h-80 w-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </section>


          <section className="rounded-[1.6rem] border border-blue-400/20 bg-blue-500/10 p-5">
            <div className="mb-3 flex items-center gap-2 text-blue-200">
              <ShieldCheck size={18} />
              <p className="text-sm font-black uppercase tracking-wide">
                Why I’m Doing This
              </p>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">
              Trying to stay productive this summer, work hard, save money, and
              help people out at the same time while working hard and staying productive.
            </p>
          </section>
          <div className="rounded-[1.5rem] border border-blue-400/20 bg-blue-500/10 p-4">
            <p className="text-sm font-black text-blue-100">
              No square footage headaches.
            </p>

            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              Just upload or text a photo of what you need cleaned up and I’ll give you a fair price.
            </p>
          </div>


          <a
            href="sms:+18635320683"
            className="flex items-center justify-between rounded-[1.5rem] bg-white px-5 py-5 text-base font-black text-black"
          >
            Request a Wash
            <ArrowRight size={20} />
          </a>

          <p className="pb-5 pt-2 text-center text-xs text-slate-500">
            Powered by HomePlanet
          </p>
        </div>
      </section>
    </main>
  );
}
















