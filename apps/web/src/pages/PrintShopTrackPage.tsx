import React from "react";
import { Link } from "react-router-dom";

const steps = [
  "Quote Received",
  "Artwork Review",
  "Customer Approval",
  "Printing",
  "Ready For Pickup",
];

export default function PrintShopTrackPage() {
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
          TRACK ORDER
        </div>

        <h1 className="text-5xl font-black tracking-tight">Track Your Print Job</h1>
        <p className="mt-4 max-w-2xl text-white/60">
          Enter your order number or phone number to see where your job is in the live production flow.
        </p>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-[#111111] p-6">
          <label className="text-sm font-semibold text-white/70">Order Number or Phone Number</label>
          <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white/35">
            Example: #LP-1024 or 863-555-0000
          </div>

          <button className="mt-6 rounded-full bg-cyan-400 px-7 py-3 font-bold text-black hover:scale-[1.02]">
            Track Order
          </button>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-[#111111] p-5">
              <div className={index < 3 ? "mb-3 h-2 w-2 rounded-full bg-cyan-400" : "mb-3 h-2 w-2 rounded-full bg-white/25"} />
              <div className="text-sm font-semibold text-white/85">{step}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
