import React from "react";
import { Link } from "react-router-dom";

export default function PrintShopArtworkPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/planet/printshop" className="text-sm font-bold tracking-wide">
            LIVE PRINT STUDIO
          </Link>
          <Link to="/planet/printshop" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          ARTWORK UPLOAD
        </div>

        <h1 className="text-5xl font-black tracking-tight">Upload Your Artwork</h1>
        <p className="mt-4 max-w-2xl text-white/60">
          Send the logo, design, mockup, or reference image for your print job. This keeps artwork review tied to the order flow.
        </p>

        <section className="mt-10 rounded-[32px] border border-dashed border-cyan-400/30 bg-cyan-400/5 p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400 text-2xl font-black text-black">
            +
          </div>
          <h2 className="text-2xl font-bold">Drop artwork here</h2>
          <p className="mt-3 text-sm text-white/50">
            PNG, JPG, PDF, SVG, AI, or mockup image. Upload wiring comes next.
          </p>
          <button className="mt-7 rounded-full bg-cyan-400 px-7 py-3 font-bold text-black hover:scale-[1.02]">
            Choose File
          </button>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {["Order / Customer Name", "Artwork Notes", "Print Placement", "Colors Needed"].map((label) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-[#111111] p-5">
              <label className="text-sm font-semibold text-white/70">{label}</label>
              <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/35">
                Enter {label.toLowerCase()}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
