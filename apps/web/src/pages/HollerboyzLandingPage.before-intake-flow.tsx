import React, { useState } from "react";

export default function HollerboyzLandingPage() {
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center text-center px-6"
        style={{
          backgroundImage:
            "url('/images/hollerboyz-cover-photo-v1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-wide">
            HOLLERBOYZ
          </h1>

          <p className="text-xl md:text-2xl text-orange-500 font-bold mt-2">
            AUTO & DIESEL
          </p>

          <h2 className="text-3xl md:text-5xl font-bold mt-8">
            KEEPING OKEECHOBEE MOVING
          </h2>

          <p className="mt-6 text-lg text-zinc-300">
            Mobile Auto & Diesel Repair
          </p>

          <p className="mt-2 text-zinc-400">
            Preventative Maintenance • Roadside Service • Fleet Support
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4 rounded-xl">
              STUCK?
            </button>

            <button className="border border-white px-8 py-4 rounded-xl">
              CALL NOW
            </button>
          </div>
        </div>
      </section>

      {/* MOMENT OF TRUTH */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-16">
            WHAT'S GOING ON?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "WON'T START",
              "MAKING NOISE",
              "CHECK ENGINE LIGHT",
              "BROKE DOWN",
              "NEED MAINTENANCE",
              "SOMETHING ELSE",
            ].map((item) => (
              <div
                key={item}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center hover:border-orange-500 transition"
              >
                <h3 className="text-xl font-bold">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEEPING OKEECHOBEE MOVING */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-8">
            KEEPING OKEECHOBEE MOVING
          </h2>

          <p className="text-xl text-zinc-300">
            Helping families.
            Helping work trucks.
            Helping businesses.
            Helping neighbors.
            Helping people stay ahead of breakdowns.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src="/images/hollerboyz-hb-profile-v1.png"
            alt="Hollerboyz"
            className="w-24 h-24 mx-auto mb-6"
          />

          <h3 className="text-2xl font-black">
            HOLLERBOYZ AUTO & DIESEL
          </h3>

          <p className="text-zinc-400 mt-2">
            Keeping Okeechobee Moving
          </p>
        </div>
      </footer>
    </div>
  );
}

