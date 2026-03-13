import { useNavigate } from "react-router-dom";

export default function JeanettesLanding() {
  const navigate = useNavigate();

  function scrollToEstimate() {
    const el = document.getElementById("estimate-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.hash = "#estimate-form";
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* TOP CONTACT BAR */}
      <section className="border-b border-white/10 bg-black/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm text-white/80">
          <div className="font-medium">
            Okeechobee Showroom • Flooring • Cabinets • Tile • Remodeling
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+18633567550"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-semibold text-white/90 hover:bg-white/10"
            >
              (863) 356-7550
            </a>

            <a
              href="https://maps.google.com/?q=818+S+Parrott+Ave+Okeechobee+FL"
              className="rounded-full border border-[#2f6df6]/40 bg-[#2f6df6]/15 px-4 py-1.5 font-semibold text-blue-100 hover:bg-[#2f6df6]/25"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="relative w-full h-[520px] flex items-center justify-center text-center overflow-hidden">
        <img
          src="/images/jeanettes-showroom.webp"
          alt="Jeanette's Interiors showroom"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-[#0f172a]/35 to-[#0f172a]/70" />

        <div className="relative z-10 max-w-4xl px-6">
          <div className="mb-4 inline-flex items-center rounded-full border border-[#2f6df6]/30 bg-[#2f6df6]/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100">
            Showroom + Live Project System
          </div>

          <h1 className="text-5xl font-bold mb-6">Jeanette&apos;s Interiors</h1>

          <p className="text-xl text-gray-200 mb-2">
            Flooring • Cabinets • Tile • Remodeling
          </p>

          <p className="mx-auto mb-8 max-w-2xl text-sm text-white/70 md:text-base">
            Clear estimates, simple project intake, and a cleaner path from showroom visit to live project tracking.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={scrollToEstimate}
              className="bg-[#2f6df6] hover:bg-[#1f4ed8] px-8 py-4 rounded-lg text-lg font-semibold shadow-lg shadow-[#2f6df6]/20"
            >
              Book Measurement
            </button>

            <a
              href="https://maps.google.com/?q=818+S+Parrott+Ave+Okeechobee+FL"
              className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold"
            >
              Visit Showroom
            </a>
          </div>
        </div>
      </section>

      {/* FEATURE IMAGE */}
      <section className="w-full bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <img
            src="/images/jeanettes-showroom.webp"
            alt="Jeanette's Interiors featured flooring showroom"
            className="w-full h-[360px] md:h-[460px] object-cover rounded-2xl shadow-2xl shadow-black/30"
          />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-white/10 bg-[#111c34]">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 text-center md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Showroom
            </div>
            <div className="mt-1 text-base font-semibold text-white">
              Okeechobee, FL
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Measurement
            </div>
            <div className="mt-1 text-base font-semibold text-white">
              Free In-Home Estimate Request
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              Visibility
            </div>
            <div className="mt-1 text-base font-semibold text-white">
              Live Project Tracking Built In
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE OPTIONS */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800 rounded-xl p-8 text-center border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Flooring Installation</h3>
          <p className="text-gray-300 mb-6">
            Luxury Vinyl, Tile, Carpet, Hardwood
          </p>

          <button
            onClick={scrollToEstimate}
            className="bg-[#2f6df6] hover:bg-[#1f4ed8] px-6 py-3 rounded-lg"
          >
            Get Estimate
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 text-center border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Free Measurement</h3>
          <p className="text-gray-300 mb-6">
            Schedule an in-home measurement
          </p>

          <button
            onClick={scrollToEstimate}
            className="bg-[#2f6df6] hover:bg-[#1f4ed8] px-6 py-3 rounded-lg"
          >
            Book Measurement
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 text-center border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Kitchen &amp; Bath</h3>
          <p className="text-gray-300 mb-6">
            Cabinets, countertops, tile remodeling
          </p>

          <button
            onClick={scrollToEstimate}
            className="bg-[#2f6df6] hover:bg-[#1f4ed8] px-6 py-3 rounded-lg"
          >
            Start Project
          </button>
        </div>
      </section>

      {/* LIVE PROJECTS */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-3 text-center">Projects In Progress</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-white/60 md:text-base">
            A cleaner way to show customers that work is active, moving, and professionally managed.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-lg border border-white/5">
              <h4 className="font-semibold mb-2">Luxury Vinyl Install</h4>
              <p className="text-gray-400">SE 8th Street</p>
              <p className="text-green-400 text-sm">Installing Tomorrow</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-white/5">
              <h4 className="font-semibold mb-2">Kitchen Tile Remodel</h4>
              <p className="text-gray-400">Lake Okeechobee Blvd</p>
              <p className="text-yellow-400 text-sm">Estimate Sent</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg border border-white/5">
              <h4 className="font-semibold mb-2">Carpet Installation</h4>
              <p className="text-gray-400">SW 5th Ave</p>
              <p className="text-blue-400 text-sm">Measuring Today</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ESTIMATE */}
      <section
        id="estimate-form"
        className="max-w-4xl mx-auto px-6 py-16 text-center"
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 shadow-xl shadow-black/20">
          <h2 className="text-3xl font-bold mb-3">Request A Free Estimate</h2>
          <p className="mb-8 text-sm text-white/60 md:text-base">
            Tell us what you&apos;re planning and we&apos;ll guide you to the right next step.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Name" className="p-4 rounded bg-slate-800" />

            <input placeholder="Phone" className="p-4 rounded bg-slate-800" />

            <input
              placeholder="Address"
              className="p-4 rounded bg-slate-800 md:col-span-2"
            />

            <select className="p-4 rounded bg-slate-800 md:col-span-2">
              <option>Project Type</option>
              <option>Luxury Vinyl</option>
              <option>Tile</option>
              <option>Carpet</option>
              <option>Cabinets</option>
            </select>
          </div>

          <button
            onClick={() => navigate("/planet/vehicles/awnit-demo")}
            className="mt-6 bg-[#2f6df6] hover:bg-[#1f4ed8] px-10 py-4 rounded-lg text-lg shadow-lg shadow-[#2f6df6]/20"
          >
            Submit Request
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-10 text-center text-gray-400">
        <p>Jeanette&apos;s Interiors</p>
        <p>818 S Parrott Ave • Okeechobee FL</p>
        <p>(863) 356-7550</p>
      </footer>
    </div>
  );
}