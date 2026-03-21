import { useMemo, useState } from "react";
import { addWalkOnStop } from "../lib/RouteCutLiveStore";

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
      <div className="max-w-7xl mx-auto px-5 py-6 space-y-8">
        {/* HEADER */}
        <div className="rounded-2xl border border-cyan-400/20 bg-[#0B1220]/80 px-6 py-4 flex justify-between items-center">
          <div>
            <div className="text-xs text-cyan-300/70 uppercase tracking-widest">
              Live Route Page
            </div>
            <div className="font-semibold text-lg">RouteCut Lawn Co. by Johnny</div>
          </div>

          <div className="text-xs border border-cyan-300/30 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live Route Active
          </div>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* LIVE OPENING */}
          <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#0B1220] to-[#0A1A2F] p-6 space-y-6">
            <div className="text-xs text-cyan-300/70 uppercase tracking-widest">
              Live Opening
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight max-w-3xl">
              Next opening available now.
            </h1>

            <p className="text-green-300 font-medium">You’re next in line.</p>

            <p className="text-white/70 max-w-2xl text-sm sm:text-base leading-7">
              Johnny is finishing nearby. Claim this now and skip the usual
              back-and-forth.
            </p>

            <div className="space-y-3">
              {routeSteps.map((step, i) => (
                <div
                  key={step.title}
                  className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50"
                >
                  <div className="text-xs text-cyan-300/60 uppercase tracking-[0.2em] mb-1">
                    Stop {i + 1}
                  </div>
                  <div className="font-medium text-white">{step.title}</div>
                  <div className="text-white/50 text-sm mt-1">{step.body}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => scrollToId("form")}
                className="px-5 py-3 bg-green-400 text-black rounded-xl font-semibold hover:bg-green-300 transition"
              >
                Claim This Spot
              </button>

              <button
                type="button"
                onClick={() => scrollToId("how")}
                className="px-5 py-3 border border-cyan-400/30 rounded-xl text-white/85 hover:bg-cyan-400/10 transition"
              >
                See How It Flows
              </button>
            </div>
          </div>

          {/* LIVE REQUEST */}
          <div
            id="form"
            className="rounded-3xl border border-cyan-400/20 bg-[#08111f] p-6 space-y-4"
          >
            <div className="flex justify-between items-center gap-3">
              <div className="text-xs text-cyan-300/70 uppercase tracking-widest">
                Live Request
              </div>
              <div className="text-xs border border-cyan-300/30 px-2 py-1 rounded-full text-white/80">
                Fast confirm
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold">
              Lock this opening
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0D1728] border border-cyan-400/20 outline-none placeholder:text-white/30"
              placeholder="Your name"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0D1728] border border-cyan-400/20 outline-none placeholder:text-white/30"
              placeholder="Street address"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0D1728] border border-cyan-400/20 outline-none placeholder:text-white/30"
              placeholder="Best number"
            />

            <button
              type="button"
              onClick={handleLockMySpot}
              disabled={isSubmitting}
              className="w-full py-3 bg-green-400 text-black rounded-xl font-semibold hover:bg-green-300 transition disabled:opacity-70"
            >
              {isSubmitting ? "Locking..." : "Lock My Spot"}
            </button>
          </div>
        </div>

        {/* ROUTE FLOW */}
        <div className="rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6 space-y-6">
          <div className="text-xs text-cyan-300/70 uppercase tracking-widest">
            Route Flow
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold">
            Catch the route while it’s moving.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50">
              27th St active
              <br />
              2 cuts remaining
              <br />
              Your yard next
            </div>

            <div className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50">
              Confirm → Cut → Done
            </div>

            <div className="bg-green-400 text-black rounded-xl p-4 font-semibold">
              $80
              <br />
              Most homes
            </div>

            <div className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50">
              Route keeps moving
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div
          id="how"
          className="rounded-3xl border border-cyan-400/20 bg-[#0B1220]/80 p-6 space-y-6"
        >
          <div className="text-xs text-cyan-300/70 uppercase tracking-widest">
            How It Works
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold">
            No scheduling. Just catch it.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50">
              Route goes live
            </div>

            <div className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50">
              Opening appears
            </div>

            <div className="bg-green-400 text-black rounded-xl p-4 font-semibold">
              You claim it
            </div>

            <div className="border border-cyan-400/20 rounded-xl p-4 bg-[#0D1728]/50">
              We pull up
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-white/50 text-sm border border-cyan-400/20 rounded-xl p-4 bg-[#0B1220]/60">
          HomePlanet Node • RouteCut Lawn
          <br />
          © 2026 HomePlanet
        </div>
      </div>
    </div>
  );
}