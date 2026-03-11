import React from "react";

const services = [
  {
    title: "Screen Repair",
    text: "Fast repair for torn, loose, or damaged screens on porches, patios, and enclosures.",
  },
  {
    title: "Pool Enclosures",
    text: "Clean, professional repair and replacement work for pool and lanai screen structures.",
  },
  {
    title: "Patio & Porch Screens",
    text: "Screened porch and patio work that keeps the space usable, clean, and protected.",
  },
  {
    title: "Screen Doors",
    text: "Replacement and repair for screen doors, entry screens, and everyday wear-and-tear issues.",
  },
];

const trustPoints = [
  "100% recommend based on 10 reviews",
  "Family owned and operated",
  "Fast response times when customers need help",
  "Professional, fair-priced, and trusted locally",
];

const reviewHighlights = [
  {
    name: "Local customer",
    quote:
      "Excellent response time. Came out ASAP to help with an emergency and did an excellent job.",
  },
  {
    name: "Treasure Coast homeowner",
    quote:
      "Easy to deal with, trustworthy, and did a great job. Professional and fair on price.",
  },
  {
    name: "Screen enclosure customer",
    quote:
      "Wonderful owners that care. Family-owned, professional, and highly recommended.",
  },
];

const serviceAreas = [
  "Fort Pierce",
  "Jensen Beach",
  "Port St. Lucie",
  "St. Lucie County",
  "Martin County",
  "Palm Beach County",
  "Okeechobee County",
];

const phoneDisplay = "(772) 209-8910";
const phoneHref = "tel:7722098910";

export default function WildingLandingPage() {
  return (
    <div className="min-h-screen bg-[#07111b] text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.10),_transparent_28%)]" />

        <div className="relative mx-auto max-w-[1400px] px-4 py-5 md:px-6 md:py-6">
          <section className="mb-5 rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur md:p-7">
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
              <div>
                <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Treasure Coast Screen Repair
                </div>

                <h1 className="max-w-4xl text-[34px] font-semibold tracking-tight text-white md:text-[48px]">
                  Wilding Enterprises Screen Repair LLC
                </h1>

                <p className="mt-3 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
                  Simple, trusted screen repair for porches, patios, pool enclosures,
                  and screen doors across the Treasure Coast. Family owned, highly
                  recommended, and easy to call when you need help fast.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Call Now {phoneDisplay}
                  </a>

                  <a
                    href={phoneHref}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-lg font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    Request Estimate
                  </a>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>100% Recommend</Badge>
                  <Badge>10 Reviews</Badge>
                  <Badge>Family Owned</Badge>
                  <Badge>Fort Pierce, FL</Badge>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0c1623] p-4 shadow-xl shadow-black/20">
                <div className="rounded-[22px] border border-cyan-400/15 bg-[#0a1320] p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                    Quick View
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <QuickStat label="Recommend" value="100%" accent="text-cyan-100" />
                    <QuickStat label="Reviews" value="10" accent="text-emerald-100" />
                    <QuickStat label="Service Area" value="TC" accent="text-amber-100" />
                    <QuickStat label="Call / Text" value="Fast" accent="text-fuchsia-100" />
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Why this page works
                    </div>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-white/80">
                      <div>• local company people can trust quickly</div>
                      <div>• services are clear in seconds</div>
                      <div>• direct click-to-call action</div>
                      <div>• social proof right up front</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-5">
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
              Services
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur"
                >
                  <div className="mb-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    Service
                  </div>

                  <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
                  <p className="mt-3 text-base leading-7 text-white/70">{service.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
                Why People Choose Wilding
              </div>

              <div className="space-y-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-white/10 bg-[#0c1623] px-4 py-4 text-lg font-medium text-white/90"
                  >
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/75">
                  Service Area
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-100"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
                Review Highlights
              </div>

              <div className="grid gap-4">
                {reviewHighlights.map((review) => (
                  <div
                    key={review.quote}
                    className="rounded-[24px] border border-white/10 bg-[#0c1623] p-5"
                  >
                    <div className="mb-2 inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                      Recommended
                    </div>

                    <p className="text-lg leading-8 text-white/90">“{review.quote}”</p>
                    <div className="mt-3 text-sm font-medium text-white/55">{review.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-5 rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur">
            <div className="mb-3 text-[11px] uppercase tracking-[0.24em] text-white/45">
              What Customers Care About
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <FeatureCard
                title="Fast Response"
                text="People mentioned quick response and getting help when they needed it."
              />
              <FeatureCard
                title="Professional Work"
                text="Customers repeatedly described the work as clean, professional, and done right."
              />
              <FeatureCard
                title="Fair Pricing"
                text="Trust grows fast when people feel the pricing is honest and reasonable."
              />
              <FeatureCard
                title="Family Owned"
                text="That local, family-owned feeling matters. It gives the company warmth and trust."
              />
            </div>
          </section>

          <section className="rounded-[30px] border border-cyan-400/20 bg-cyan-500/[0.06] p-5 shadow-xl shadow-black/20 backdrop-blur md:p-6">
            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
              <div>
                <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
                  Call or Text Today
                </div>

                <h2 className="text-[30px] font-semibold tracking-tight text-white md:text-[40px]">
                  Need screen repair or enclosure work?
                </h2>

                <p className="mt-3 max-w-3xl text-base leading-7 text-white/75 md:text-lg">
                  Reach out directly and keep it simple. This page is built to help
                  customers understand the company quickly, trust it quickly, and call
                  quickly.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-[#0c1623] p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Contact
                </div>

                <div className="mt-3 text-3xl font-semibold text-white">{phoneDisplay}</div>
                <div className="mt-2 text-base text-white/65">Fort Pierce, Florida</div>
                <div className="mt-1 text-base text-white/65">Serving the Treasure Coast</div>

                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Tap to Call
                  </a>

                  <a
                    href={phoneHref}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-lg font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    Request Estimate
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white/85">
      {children}
    </span>
  );
}

function QuickStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className={`mt-1 text-3xl font-semibold ${accent}`}>{value}</div>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0c1623] p-5">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-white/70">{text}</p>
    </div>
  );
}