import { Link, useLocation, useParams } from "react-router-dom";

const OWNER_PHONE = "8635320683";

const FOUND_TYPES: Record<string, any> = {
  tools: {
    icon: "🔧",
    label: "Tool Found Layer",
    title: "Found a tool or piece of work gear?",
    detail: "Scan the tag, contact the owner, and return it fast without guessing who it belongs to.",
    image: "/images/found-layer/drill.jpg",
    action: "Contact owner",
    href: `sms:${OWNER_PHONE}?body=Hi, I found your tool or work gear. I can help get it back to you.`,
  },
  bikes: {
    icon: "🚲",
    label: "Bike Recovery Layer",
    title: "Found a bike or scooter?",
    detail: "A direct owner contact path for bikes, scooters, and ride gear.",
    image: "/images/found-layer/bike.jpg",
    action: "Report found ride",
    href: `sms:${OWNER_PHONE}?body=Hi, I found your bike or scooter. I can help get it back to you.`,
  },
  vehicles: {
    icon: "🚗",
    label: "Vehicle Contact Layer",
    title: "Need to contact a vehicle owner?",
    detail: "For parked vehicle issues, quick contact, towing risk, or emergency notes.",
    image: "/images/found-layer/car.jpg",
    action: "Contact vehicle owner",
    href: `sms:${OWNER_PHONE}?body=Hi, I need to contact you about your vehicle.`,
  },
  items: {
    icon: "👕",
    label: "Lost Item Layer",
    title: "Found a jacket, shoes, bag, or school item?",
    detail: "Useful for kids, camps, schools, travel, events, and everyday belongings.",
    image: "/images/found-layer/jacket.jpg",
    action: "Report found item",
    href: `sms:${OWNER_PHONE}?body=Hi, I found your item. I can help get it back to you.`,
  },
  all: {
    icon: "📦",
    label: "Universal Found Layer",
    title: "A live found page for anything important.",
    detail: "If someone finds it, they know what to do instantly.",
    image: "/images/found-layer/box.jpg",
    action: "Create found layer",
    href: `sms:${OWNER_PHONE}?body=Hi, I want to create a found layer for something important.`,
  },
};

export default function FoundItemPage() {
  const { type } = useParams();
  const location = useLocation();
const isReporting = location.pathname.endsWith("/report");
  const foundType = type || "all";
  const found = FOUND_TYPES[foundType] || FOUND_TYPES.all;

  return (
    <main className="min-h-screen bg-[#05070d] p-4 text-white sm:p-8">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-cyan-300/14 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_34%),rgba(255,255,255,0.045)]">
        <div className="grid lg:grid-cols-[1fr_0.9fr]">
          <div className="p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              {found.icon} {found.label}
            </div>

            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
              {found.title}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              {found.detail}
            </p>

            <div className="mt-6 rounded-[24px] border border-emerald-300/16 bg-emerald-400/10 p-5">
              <p className="text-sm font-semibold text-emerald-100">
                What happens next:
              </p>
              <p className="mt-2 text-xl font-black">
                The finder gets clear action. The owner gets contacted. The moment becomes visible.
              </p>
            </div>

            {isReporting ? (
              <div className="mt-6 rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-100">
                  Found report started
                </p>
                <p className="mt-3 text-sm leading-6 text-white/75">
                  Add note, photo, and location next. This report is tied to this found layer:{" "}
                  <span className="font-bold text-white">{found.label}</span>.
                </p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/70">
                  Timestamp ready � item type locked � owner contact available
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={found.href}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
              >
                {found.action}
              </a>

              <Link
                to={`/planet/found/${foundType}/report`}
                className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-100"
              >
                Report Found
              </Link>

              <Link
                to="/planet/found-layer"
                className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white"
              >
                Back to Found Layer
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] border-t border-cyan-300/10 lg:border-l lg:border-t-0">
            <img
              src={found.image}
              alt={found.label}
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/25 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}

