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
  "Highly recommended demo service brand",
  "Family-owned style positioning",
  "Fast response when customers need help",
  "Professional, fair-priced, and easy to trust",
];

const reviewHighlights = [
  {
    name: "Demo customer",
    quote:
      "Excellent response time. Came out quickly, handled the issue cleanly, and made the whole process easy.",
  },
  {
    name: "Coastal homeowner",
    quote:
      "Easy to deal with, trustworthy, and professional from start to finish. Fair pricing and solid work.",
  },
  {
    name: "Enclosure customer",
    quote:
      "Friendly, professional, and highly recommended. The kind of service page that makes people want to call.",
  },
];

const serviceAreas = [
  "Coastal Service Area",
  "Residential Repairs",
  "Patio & Porch Work",
  "Pool Enclosure Service",
  "Screen Door Repairs",
  "Homeowner Support",
  "Fast Local Response",
];

const phoneDisplay = "(555) 010-2400";
const phoneHref = "tel:5550102400";

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
                  Screen Repair Demo
                </div>

                <h1 className="max-w-4xl text-[34px] font-semibold tracking-tight text-white md:text-[48px]">
                  Harbor Service Demo
                </h1>

                <p className="mt-3 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
                  Simple, trusted screen repair for porches, patios, pool enclosures,
                  and screen doors. A clean demo page showing how a service business
                  can look clear, credible, and easy to contact.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/15 px-5 py-3 text-lg font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                  >
                    Call Demo Line {phoneDisplay}
                  </a>

                  <a
                    href={phoneHref}
                    className="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-lg font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    Request Estimate
                  </a>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>Highly Rated Demo</Badge>
                  <Badge>Fast Response</Badge>
                  <Badge>Family-Owned Feel</Badge>
                  <Badge>Screen Repair Flow</Badge>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#0c1623] p-4 shadow-xl shadow-black/20">
                <div className="rounded-[22px] border border-cyan-400/15 bg-[#0a1320] p-4">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                    Quick View
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <QuickStat label="Recommend" value="Strong" accent="text-cyan-100" />
                    <QuickStat label="Trust" value="High" accent="text-emerald-100" />
                    <QuickStat label="Service" value="Screen" accent="text-amber-100" />
                    <QuickStat label="Response" value="Fast" accent="text-fuchsia-100" />
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                      Why this page works
                    </div>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-white/80">
                      <div>• service is understood in seconds</div>
                      <div>• trust signals show up immediately</div>
                      <div>• direct click-to-call action is obvious</div>
                      <div>• demo feels real without exposing a real business</div>
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
                Why People Choose Harbor Service Demo
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
                text="People notice when a business responds quickly and makes it easy to get help."
              />
              <FeatureCard
                title="Professional Work"
                text="Trust builds fast when the work feels clean, organized, and handled right."
              />
              <FeatureCard
                title="Fair Pricing"
                text="Clear and reasonable pricing makes the page feel safe to act on."
              />
              <FeatureCard
                title="Local Trust Feel"
                text="That family-owned, neighbor-trust feeling still matters in service businesses."
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
                  Reach out directly and keep it simple. This demo page is built to
                  show how a service company can help customers understand the offer
                  quickly, trust it quickly, and take action quickly.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-[#0c1623] p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
                  Contact
                </div>

                <div className="mt-3 text-3xl font-semibold text-white">{phoneDisplay}</div>
                <div className="mt-2 text-base text-white/65">Demo Service Line</div>
                <div className="mt-1 text-base text-white/65">Public-facing sample page</div>

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