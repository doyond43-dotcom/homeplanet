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
  {
    title: "T-Shirts",
    image: "/images/printshop-custom-shirts.jpg",
    description: "Custom cotton tees, business shirts, event shirts, and fast local promo runs.",
  },
  {
    title: "Hats",
    image: "/images/printshop-custom-hats.jpg",
    description: "Custom hats with bold color, sharp stitching, and brand-ready presentation.",
  },
  {
    title: "Banners",
    image: "/images/printshop-custom-banners.jpg",
    description: "Big impact banners for events, openings, sales, real estate, and business promos.",
  },
  {
    title: "Decals",
    image: "/images/printshop-custom-decals.jpg",
    description: "Full-color stickers and decals for branding, packaging, events, and giveaways.",
  },
  {
    title: "Embroidery",
    image: "/images/printshop-custom-embroidery.jpg",
    description: "Premium embroidery for hats, shirts, jackets, bags, teams, and local businesses.",
  },
  {
    title: "Promo Items",
    image: "/images/printshop-promo-items.jpg",
    description: "Koozies, lanyards, drinkware, bags, pens, keychains, and business promo gear.",
  },
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

          <div className="flex items-center gap-2">
            <Link
              to="/planet/printshop/track"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 md:hidden"
            >
              Track
            </Link>

            <Link
              to="/planet/printshop/order"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Start Order
            </Link>
          </div>
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
              src="/images/printshop-hero-charlys.jpg"
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
              key={product.title}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-[#121212]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-white/5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>

              <div className="p-6">
                <div className="text-xl font-semibold">
                  {product.title}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {product.description}
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

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[32px] border border-white/10 bg-[#121212] p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="text-2xl font-semibold text-white">
                Need help before ordering?
              </div>

              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Request a call or send a quick question. We’ll help guide the
                next step, artwork setup, pricing questions, production flow,
                or custom order planning.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/planet/charlys/order"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Request a Call
              </Link>

              <Link
                to="/planet/charlys/artwork"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ask a Question
              </Link>

              <Link
                to="/planet/charlys/track"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
