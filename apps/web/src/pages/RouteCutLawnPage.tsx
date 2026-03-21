import { useMemo, useState } from "react";
import { addWalkOnStop } from "../lib/routecutLiveStore";

export default function RouteCutLawnPage() {
  const routeSteps = useMemo(
    () => [
      { title: "27th St active", body: "Crew is already working nearby." },
      { title: "2 cuts remaining", body: "Only a couple stops left." },
      { title: "Your yard = next", body: "You become the next stop." },
    ],
    []
  );

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLockMySpot = () => {
    if (isSubmitting) return;

    const cleanName = name.trim();
    const cleanAddress = address.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanAddress || !cleanPhone) {
      window.alert("Please fill out your name, address, and phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const stopId = addWalkOnStop({
        customer: cleanName,
        address: cleanAddress,
        phone: cleanPhone,
        notes: "Submitted from public live route page.",
      });

      window.location.href = `/planet/routecut/live?stopId=${stopId}`;
    } catch {
      setIsSubmitting(false);
      window.alert("Something went wrong while locking your spot.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 px-6 py-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              Live Route Page
            </div>
            <div className="text-lg font-semibold">RouteCut Lawn Co. by Johnny</div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-cyan-300/30 px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live Route Active
          </div>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* LIVE OPENING */}
          <div className="space-y-6 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#0B1220] to-[#0A1A2F] p-6">
            <div className="text-xs uppercase tracking-widest text-cyan-300/70">
              Live Opening
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
              Next opening available now.
            </h1>

            <p className="font-medium text-green-300">You’re next in line.</p>

            <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              Johnny is finishing nearby. Claim this now and skip the usual
              back-and-forth.
            </p>

            <div className="space-y-3">
              {routeSteps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4"
                >
                  <div className="mb-1 text-xs uppercase tracking-[0.2em] text-cyan-300/60">
                    Stop {i + 1}
                  </div>
                  <div className="font-medium text-white">{step.title}</div>
                  <div className="mt-1 text-sm text-white/50">{step.body}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToId("form")}
                className="rounded-xl bg-green-400 px-5 py-3 font-semibold text-black transition hover:bg-green-300"
              >
                Claim This Spot
              </button>

              <button
                type="button"
                onClick={() => scrollToId("how")}
                className="rounded-xl border border-cyan-400/30 px-5 py-3 text-white/85 transition hover:bg-cyan-400/10"
              >
                See How It Flows
              </button>
            </div>
          </div>

          {/* LIVE REQUEST */}
          <div
            id="form"
            className="space-y-4 rounded-3xl border border-cyan-400/20 bg-[#08111f] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-widest text-cyan-300/70">
                Live Request
              </div>
              <div className="rounded-full border border-cyan-300/30 px-2 py-1 text-xs text-white/80">
                Fast confirm
              </div>
            </div>

            <h2 className="text-xl font-semibold sm:text-2xl">Lock this opening</h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-cyan-400/20 bg-[#0D1728] p-3 outline-none placeholder:text-white/30"
              placeholder="Your name"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-cyan-400/20 bg-[#0D1728] p-3 outline-none placeholder:text-white/30"
              placeholder="Street address"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-cyan-400/20 bg-[#0D1728] p-3 outline-none placeholder:text-white/30"
              placeholder="Best number"
            />

            <button
              type="button"
              onClick={handleLockMySpot}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-green-400 py-3 font-semibold text-black transition hover:bg-green-300 disabled:opacity-70"
            >
              {isSubmitting ? "Locking..." : "Lock My Spot"}
            </button>
          </div>
        </div>

        {/* ROUTE FLOW */}
        <div className="space-y-6 rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6">
          <div className="text-xs uppercase tracking-widest text-cyan-300/70">
            Route Flow
          </div>

          <h2 className="text-2xl font-semibold sm:text-3xl">
            Catch the route while it’s moving.
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
              27th St active
              <br />
              2 cuts remaining
              <br />
              Your yard next
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
              Confirm → Cut → Done
            </div>

            <div className="rounded-xl bg-green-400 p-4 font-semibold text-black">
              $80
              <br />
              Most homes
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
              Route keeps moving
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div
          id="how"
          className="space-y-6 rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6"
        >
          <div className="text-xs uppercase tracking-widest text-cyan-300/70">
            How It Works
          </div>

          <h2 className="text-2xl font-semibold sm:text-3xl">
            No scheduling. Just catch it.
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
              Route goes live
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
              Opening appears
            </div>

            <div className="rounded-xl bg-green-400 p-4 font-semibold text-black">
              You claim it
            </div>

            <div className="rounded-xl border border-cyan-400/20 bg-[#0D1728]/50 p-4">
              We pull up
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="rounded-xl border border-cyan-400/20 bg-[#0B1220]/60 p-4 text-center text-sm text-white/50">
          HomePlanet Node • RouteCut Lawn
          <br />
          © 2026 HomePlanet
        </div>
      </div>
    </div>
  );
}