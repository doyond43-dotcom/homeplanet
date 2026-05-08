import React from "react";
import { Link } from "react-router-dom";

export default function PrintShopOrderPage() {
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
          START ORDER
        </div>

        <h1 className="text-5xl font-black tracking-tight">Start Your Print Order</h1>
        <p className="mt-4 max-w-2xl text-white/60">
          Tell us what you need printed. Shirts, hats, banners, decals, embroidery, rush jobs, or full business/event packages.
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {["Name / Business", "Phone Number", "Email", "Product Type", "Quantity", "Needed By Date"].map((label) => (
            <div key={label} className="rounded-3xl border border-white/10 bg-[#111111] p-5">
              <label className="text-sm font-semibold text-white/70">{label}</label>
              <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/35">
                Enter {label.toLowerCase()}
              </div>
            </div>
          ))}
        </section>

        <div className="mt-6 rounded-3xl border border-white/10 bg-[#111111] p-5">
          <label className="text-sm font-semibold text-white/70">Order Notes</label>
          <div className="mt-3 min-h-32 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/35">
            Sizes, colors, artwork notes, event details, rush instructions...
          </div>
        </div>

        <button className="mt-8 rounded-full bg-cyan-400 px-7 py-3 font-bold text-black hover:scale-[1.02]">
          Submit Order Request
        </button>
      </main>
    </div>
  );
}
