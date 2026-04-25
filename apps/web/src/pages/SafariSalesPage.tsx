import { useNavigate } from "react-router-dom";

export default function SafariSalesPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#051b16] via-[#03120f] to-[#020807] text-white px-4 py-10">
      <section className="mx-auto max-w-6xl space-y-10">
        {/* HERO */}
        <div className="text-center space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
            HomePlanet Safari System
          </p>

          <h1 className="text-4xl md:text-6xl font-black">
            Turn every guest interaction into
            <br />
            <span className="text-emerald-300">proof + memory + revenue</span>
          </h1>

          <p className="max-w-2xl mx-auto text-white/65">
            No apps. No logins. Guests scan → moment gets timestamped → 
            staff can attach photos → guest unlocks memories instantly.
          </p>

          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button
              onClick={() => navigate("/planet/safari/sloth")}
              className="rounded-2xl bg-white px-6 py-4 font-black text-[#06120d]"
            >
              Try Live Demo
            </button>

            <button
              onClick={() => navigate("/planet/live/safari-demo")}
              className="rounded-2xl border border-white/20 px-6 py-4 font-bold"
            >
              View Live Board
            </button>

            <button
              onClick={() => navigate("/planet/creator/start")}
              className="rounded-2xl bg-[#2bbd8e] hover:bg-[#34d399] px-6 py-4 font-black text-black"
            >
              Get this for my business
            </button>
          </div>
        </div>

        {/* FLOW */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            "Guest scans QR at exhibit",
            "Moment gets timestamped instantly",
            "Staff attaches photo memory",
            "Guest unlocks paid memory"
          ].map((step, i) => (
            <div key={i} className="rounded-2xl border border-[#24483f] p-5 bg-[#0b1714]">
              <p className="text-xs text-white/40">STEP {i + 1}</p>
              <p className="mt-2 font-bold">{step}</p>
            </div>
          ))}
        </div>

        {/* WHO THIS IS FOR */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
            <p className="font-black">Zoos & Animal Parks</p>
            <p className="mt-1 text-xs text-white/50">Monetize every guest interaction</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
            <p className="font-black">Camps</p>
            <p className="mt-1 text-xs text-white/50">Capture moments parents actually value</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
            <p className="font-black">Skate Zones</p>
            <p className="mt-1 text-xs text-white/50">Turn sessions into proof + memories</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
            <p className="font-black">Events</p>
            <p className="mt-1 text-xs text-white/50">Create instant take-home experiences</p>
          </div>
        </div>

        {/* PROOF SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-[2rem] border border-[#1b3f36] p-6 bg-[#08120f]">
            <h2 className="text-2xl font-black">Real-time operator visibility</h2>
            <p className="mt-3 text-white/60">
              Staff sees every interaction live. No confusion. No missing moments.
              Every guest interaction becomes a visible timeline event.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#1b3f36] p-6 bg-[#08120f]">
            <h2 className="text-2xl font-black">Built-in monetization</h2>
            <p className="mt-3 text-white/60">
              Photo memories, VIP add-ons, feeding experiences — tied directly
              to the exact moment they happened.
            </p>
            <div className="mt-6 rounded-2xl border border-[#2bbd8e] bg-[#123f34] p-5 shadow-[0_0_20px_rgba(43,189,142,0.12)]">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/80">
                Real Example
              </p>

              <h3 className="mt-2 text-2xl font-black">
                1,000 guests = $5,000+ in photo memories
              </h3>

              <p className="mt-2 text-sm text-white/70">
                If just 20% of guests unlock a $5 memory, that is instant revenue tied to real interactions.
                No staff chasing payments. No missed opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS FOR YOUR BUSINESS */}
        <div className="rounded-[2rem] border border-[#1b3f36] bg-[#08120f] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/70">
            How it works for your business
          </p>

          <h2 className="mt-3 text-3xl font-black">
            You place the signs. Staff uses a phone. Guests unlock the memories.
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              "We generate your QR signs",
              "You place them at exhibits or stations",
              "Staff attaches photos from their phone",
              "Guests unlock memories instantly"
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#24483f] bg-[#0b1714] p-4">
                <p className="text-xs text-white/40">BUSINESS STEP {i + 1}</p>
                <p className="mt-2 font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NO BULLSHIT SECTION */}
        <div className="rounded-[2rem] border border-[#1c6b58] bg-[#0a3a31] p-6 text-center">
          <h2 className="text-2xl font-black">
            No apps. No accounts. No friction.
          </h2>
          <p className="mt-2 text-white/65">
            Guests don’t sign up. They don’t download anything.
            They just scan and the system works.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h3 className="text-3xl font-black">
            See it happen live
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/planet/safari/sloth")}
              className="rounded-2xl bg-[#2bbd8e] hover:bg-[#34d399] px-8 py-5 font-black text-black text-lg"
            >
              Start Demo
            </button>

            <button
              onClick={() => navigate("/planet/creator/start")}
              className="rounded-2xl border border-white/20 bg-black/25 px-8 py-5 font-black text-white text-lg"
            >
              Get this for my business
            </button>
          </div>
        </div>

        {/* TALK TO US */}
        <div className="rounded-[2rem] border border-[#2bbd8e] bg-[#123f34] p-6 text-center shadow-[0_0_20px_rgba(43,189,142,0.12)]">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200/80">
            Ready to use this at your location?
          </p>

          <h2 className="mt-3 text-3xl font-black">
            We can turn your real guest moments into a live proof system.
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Safari parks, camps, skate zones, events, and experience businesses can use this same system
            without forcing guests into apps or accounts.
          </p>

          <button
            onClick={() => navigate("/planet/creator/start")}
            className="mt-6 rounded-2xl bg-white px-8 py-5 text-lg font-black text-[#06120d]"
          >
            Talk to us about my business
          </button>
        </div>
      </section>
    </main>
  );
}