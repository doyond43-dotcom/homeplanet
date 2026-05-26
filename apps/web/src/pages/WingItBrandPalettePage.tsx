import React from "react";
import {
  ArrowLeft,
  Flame,
  Circle,
  Type,
  Package,
  Network,
  ShoppingBag,
  Truck,
  Users,
  Store,
  Box,
  Trophy,
  Utensils,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const boardImage = "/images/wingit-brand-direction-board.png";

const palette = [
  { name: "Warm Orange", hex: "#FF8A00", note: "Primary" },
  { name: "Hot Sauce Red", hex: "#E74C2A", note: "Secondary" },
  { name: "Citrus Gold", hex: "#FFC107", note: "Accent" },
  { name: "Charcoal Black", hex: "#161616", note: "Base / Light" },
  { name: "Clean White", hex: "#F5F5F5", note: "Text / Light" },
  { name: "Warm Cream", hex: "#F6E9D7", note: "Surface" },
];

const pillars = [
  { title: "Bold flavor", text: "Hot wings, craveable meals, and a brand people remember." },
  { title: "Fast service", text: "Pickup, delivery, group orders, and game-day movement." },
  { title: "Community first", text: "Built for local nights, shared meals, and everyday wins." },
  { title: "Experience anchor", text: "WingIt becomes a restaurant layer inside the ecosystem." },
];

const surfaces = [
  { title: "Menu boards", icon: Utensils },
  { title: "Packaging", icon: Box },
  { title: "Delivery fleet", icon: Truck },
  { title: "Pickup counter", icon: Store },
  { title: "Group orders", icon: Users },
  { title: "Game day", icon: Trophy },
  { title: "Takeout bag", icon: ShoppingBag },
  { title: "Rewards", icon: Flame },
];

const ecosystem = [
  "Residents",
  "GreenBasket",
  "WingIt",
  "Delivery",
  "Events",
  "Community",
  "Hubs",
];

export default function WingItBrandPalettePage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0b0b0a] text-[#f6e9d7]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_16%_6%,rgba(255,138,0,0.13),transparent_27%),radial-gradient(circle_at_82%_20%,rgba(231,76,42,0.16),transparent_30%),linear-gradient(180deg,#0b0b0a_0%,#120d0a_42%,#090807_100%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-8 lg:px-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>

        <section className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="mb-7 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">
                WingIt identity system
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
                WingIt visual system at a glance.
              </h1>
            </div>

            <p className="max-w-xl text-sm leading-6 text-white/50 lg:justify-self-end lg:pt-12">
              A single board view of the logo system, palette, typography,
              usage examples, icon language, and ecosystem restaurant connection.
            </p>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/45 p-3 shadow-2xl shadow-black/40">
            <img
              src={boardImage}
              alt="WingIt full visual direction board"
              className="w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Primary", "Warm Orange", "#ff8a00"],
            ["Secondary", "Charcoal Black", "#27211d"],
            ["Accent", "Hot Sauce Red", "#e74c2a"],
            ["Energy", "Fast + Local", "#ffc107"],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5">
              <div className="mb-5 h-1.5 w-full rounded-full" style={{ backgroundColor: color }} />
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">{label}</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">Logo system</p>
            <div className="mt-10 flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#ff8a00]/30 bg-[#ff8a00]/10">
                <Flame className="h-12 w-12 text-[#ff8a00]" />
              </div>
              <div>
                <div className="text-5xl font-semibold italic tracking-[-0.07em] text-[#ff8a00]">WingIt</div>
                <div className="mt-2 text-xs uppercase tracking-[0.38em] text-white/45">Hot wings. Local energy.</div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <Flame className="mb-8 h-8 w-8 text-[#ff8a00]" />
                <p className="text-lg font-semibold">Primary mark</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-[#f6e9d7] p-5 text-[#161616]">
                <Flame className="mb-8 h-8 w-8 text-[#e74c2a]" />
                <p className="text-lg font-semibold">Badge mark</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">Brand mood</p>
            <h2 className="mt-10 text-4xl font-semibold tracking-[-0.06em]">Warm + Fast</h2>
            <p className="mt-4 text-base leading-7 text-white/55">
              Big flavor energy. Fast, confident, social, and always exciting.
            </p>
            <div className="mt-12 h-24 rounded-full bg-[radial-gradient(circle,rgba(255,138,0,0.42),transparent_38%),linear-gradient(90deg,transparent,rgba(231,76,42,0.48),rgba(255,193,7,0.28),transparent)] blur-sm" />
            <div className="mt-8 flex flex-wrap gap-3">
              {["Bold", "Energetic", "Social", "Confident"].map((item) => (
                <span key={item} className="rounded-full border border-[#ff8a00]/25 bg-[#ff8a00]/10 px-4 py-2 text-xs font-semibold text-[#ffb35c]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">Brand role</p>
            <h2 className="mt-10 text-4xl font-semibold tracking-[-0.06em]">Restaurant Experience Anchor</h2>
            <p className="mt-4 text-base leading-7 text-white/55">
              Drives energy. Brings people together. Powers moments across the ecosystem.
            </p>

            <div className="relative mt-9 min-h-[230px] rounded-[1.6rem] border border-white/10 bg-black/25">
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ff8a00]/45 bg-[#ff8a00]/12">
                <Flame className="h-10 w-10 text-[#ff8a00]" />
              </div>
              {["Residents", "Delivery", "Events", "Community"].map((item, i) => (
                <div
                  key={item}
                  className={`absolute rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-semibold text-white/75 ${
                    i === 0 ? "left-5 top-7" : i === 1 ? "right-5 top-10" : i === 2 ? "bottom-8 left-7" : "bottom-7 right-5"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">Color palette</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Hot, clean, craveable — without turning into a fast-food cartoon.
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-6">
              {palette.map((color) => {
                const light = color.hex === "#F5F5F5" || color.hex === "#F6E9D7" || color.hex === "#FFC107";
                return (
                  <div
                    key={color.name}
                    className="min-h-[230px] rounded-2xl border border-white/10 p-4"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className={`flex h-full flex-col justify-between ${light ? "text-[#161616]" : "text-[#f6e9d7]"}`}>
                      <Circle className="h-4 w-4" />
                      <div>
                        <p className="text-base font-semibold tracking-[-0.03em]">{color.name}</p>
                        <p className="mt-2 text-xs opacity-65">{color.hex}</p>
                        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] opacity-60">{color.note}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="h-8 rounded-full bg-[linear-gradient(90deg,#ff8a00,#e74c2a,#ffc107,#161616,#f6e9d7)]" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">
              <Package className="h-4 w-4" />
              Brand in action
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Built for packaging, pickup, game day, and social momentum.
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {surfaces.map(({ title, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-5">
                  <Icon className="mb-10 h-7 w-7 text-[#ff8a00]" />
                  <p className="text-lg font-semibold tracking-[-0.04em]">{title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.6fr_1.4fr_0.7fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">
              <Type className="h-4 w-4" />
              Typography
            </p>
            <h2 className="mt-10 text-5xl font-semibold tracking-[-0.07em]">
              More than <span className="text-[#ff8a00]">wings.</span>
            </h2>
            <p className="mt-4 text-base leading-7 text-white/55">
              Local energy. Big flavor. Group momentum.
            </p>
            <div className="mt-8 space-y-4">
              <div className="text-6xl font-semibold tracking-[-0.08em] text-[#ff8a00]">Aa</div>
              <div className="text-5xl font-semibold tracking-[-0.07em] text-[#f6e9d7]">Aa</div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">
              <Network className="h-4 w-4" />
              Ecosystem connection
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {ecosystem.map((item, index) => (
                <React.Fragment key={item}>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#ff8a00]/25 bg-[#ff8a00]/10 text-center text-xs font-semibold text-white/78">
                    {item}
                  </div>
                  {index < ecosystem.length - 1 && (
                    <div className="hidden h-px w-8 bg-[#ff8a00]/45 sm:block" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#ff8a00]">Why it matters</p>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
              WingIt brings bold flavor, fast service, and community energy to everyday life.
            </h2>
            <div className="mt-7 space-y-3">
              {["Craveable food", "Fast & reliable", "Group friendly", "Community driven"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-full border border-[#ff8a00]/20 bg-[#ff8a00]/5 px-4 py-3 text-sm text-white/75">
                  <CheckCircle2 className="h-4 w-4 text-[#ff8a00]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 pb-24 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-7">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#ff8a00]">Brand pillar</p>
              <h3 className="mt-9 text-3xl font-semibold tracking-[-0.05em]">{pillar.title}</h3>
              <p className="mt-5 text-sm leading-6 text-white/52">{pillar.text}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
