import React from "react";
import { useNavigate } from "react-router-dom";

const items = [
  {
    icon: "🐾",
    label: "Pets",
    title: "Bella-style rescue page",
    detail: "Scan the tag, contact the owner, report found location.",
    image: "/images/found-layer/pet.jpg",
    to: "/planet/guardian-pet",
  },
  {
    icon: "🔧",
    label: "Tools",
    title: "Work gear owner page",
    detail: "Found drill, ladder, toolbox, or equipment? Scan and return it fast.",
    image: "/images/found-layer/drill.jpg",
    to: "/planet/found/tools",
  },
  {
    icon: "🚲",
    label: "Bikes + scooters",
    title: "Ride recovery page",
    detail: "A found bike or scooter gets a direct owner contact path.",
    image: "/images/found-layer/bike.jpg",
    to: "/planet/found/bikes",
  },
  {
    icon: "🚗",
    label: "Vehicles",
    title: "Owner contact layer",
    detail: "For parked vehicle issues or quick owner contact.",
    image: "/images/found-layer/car.jpg",
    to: "/planet/found/vehicles",
  },
  {
    icon: "👕",
    label: "Jackets + shoes",
    title: "Lost item page",
    detail: "Kids, camps, schools, travel, events, and everyday belongings.",
    image: "/images/found-layer/jacket.jpg",
    to: "/planet/found/items",
  },
  {
    icon: "📦",
    label: "Anything important",
    title: "Universal found layer",
    detail: "If someone finds it, they know what to do instantly.",
    image: "/images/found-layer/box.jpg",
    to: "/planet/found/all",
  },
];

export default function FoundLayer() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#05070d] p-4 text-white sm:p-8">
      <section className="mx-auto max-w-6xl rounded-[32px] border border-cyan-300/14 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(16,185,129,0.10),transparent_30%),rgba(255,255,255,0.045)] p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              ▦ Found Layer
            </div>

            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              A live “if found” layer for almost anything.
            </h1>

            <p className="mt-4 text-base leading-7 text-white/70">
              The same QR system behind Bella can go on pets, tools, bikes,
              jackets, shoes, vehicles, gear, or anything someone might need
              to return or respond to quickly.
            </p>

            <div className="mt-6 rounded-[24px] border border-emerald-300/16 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),rgba(34,211,238,0.055))] p-5">
              <p className="text-sm font-semibold text-emerald-100">
                Simple truth:
              </p>
              <p className="mt-2 text-xl font-black">
                If someone finds it, they know what to do instantly.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.label}
                onClick={() => navigate(item.to)}
                className="group cursor-pointer overflow-hidden rounded-[24px] border border-cyan-300/12 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_42%),rgba(255,255,255,0.045)] transition hover:bg-cyan-400/10"
              >
                <div className="relative h-32 overflow-hidden border-b border-cyan-300/10 bg-black/30">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full object-cover opacity-75 transition duration-300 group-hover:scale-105 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/20 to-transparent" />
                  <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 backdrop-blur">
                    {item.icon}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-cyan-200">
                      {item.label}
                    </p>
                    <span className="text-white/40 transition group-hover:text-cyan-100">
                      →
                    </span>
                  </div>

                  <h3 className="mt-3 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}