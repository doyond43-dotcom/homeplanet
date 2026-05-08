import React from "react";
import { Link } from "react-router-dom";

const liveSteps = [
  "Quote Received",
  "Artwork Approved",
  "Printing",
  "Ready For Pickup",
  "Delivered",
];

const products = [
  "T-Shirts",
  "Hats",
  "Banners",
  "Decals",
  "Embroidery",
  "Promo Items",
];

export default function PrintShopLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold tracking-wide">
            LIVE PRINT STUDIO
          </div>

          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <a href="#products" className="transition hover:text-white">Apparel</a>
            <a href="#products" className="transition hover:text-white">Hats</a>
            <a href="#products" className="transition hover:text-white">Banners</a>
            <Link to="/planet/printshop/track" className="transition hover:text-white">Track Order</Link>
          </nav>

          <Link
            to="/planet/printshop/order"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
          >
            Start Order
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-medium tracking-[0.2em] text-cyan-300">
            LIVE ORDER FLOW
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Custom Apparel.
            <br />
            Fast Turnaround.
            <br />
            Live Tracking.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/65">
            Shirts, hats, banners, decals, embroidery, and rush production
            handled through one clean live-flow system.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/planet/printshop/order"
              className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Start Your Order
            </Link>

            <Link
              to="/planet/printshop/artwork"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Upload Artwork
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 bg-[#121212]">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
              alt="Print shop"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-5 left-6 rounded-2xl border border-white/10 bg-black/80 px-4 py-3 backdrop-blur">
            <div className="text-xs tracking-[0.2em] text-cyan-300">
              ACTIVE NOW
            </div>

            <div className="mt-1 text-sm font-semibold">
              12 Orders In Production
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 text-sm font-semibold tracking-[0.2em] text-white/40">
          LIVE PRODUCTION FLOW
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {liveSteps.map((step) => (
            <div
              key={step}
              className="rounded-3xl border border-white/10 bg-[#111111] p-5"
            >
              <div className="mb-3 h-2 w-2 rounded-full bg-cyan-400" />

              <div className="text-sm font-medium text-white/85">
                {step}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="products" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-sm font-semibold tracking-[0.2em] text-white/40">
              PRODUCTS
            </div>

            <h2 className="mt-3 text-3xl font-bold">
              Built for local businesses, creators, teams, and events.
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {products.map((product) => (
            <div
              key={product}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]"
            >
              <div className="aspect-[16/10] bg-white/5" />

              <div className="p-6">
                <div className="text-xl font-semibold">
                  {product}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  High-quality production with clean turnaround
                  and live customer coordination.
                </p>

                <Link
                  to="/planet/printshop/order"
                  className="mt-6 inline-block text-sm font-semibold text-cyan-300"
                >
                  Start ?
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
