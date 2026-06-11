import React, { useState } from "react";

export default function HollerboyzLandingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section
        className="relative min-h-[70vh] flex items-center justify-center text-center px-6"
        style={{
          backgroundImage:
            "url('/images/hollerboyz-hero-image-v1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >


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
            <button
              onClick={() => {
                document
                  .getElementById("intake")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4 rounded-xl"
            >
              STUCK?
            </button>

            <button className="border border-white px-8 py-4 rounded-xl">
              CALL NOW
            </button>
          </div>
        </div>
      </section>

      {/* INTAKE FLOW */}
      <section id="intake" className="pt-16 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {step === 1 && (
            <>
              <h2 className="text-5xl font-black text-center mb-16">
                WHAT'S GOING ON?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  "WON'T START",
                  "MAKING NOISE",
                  "CHECK ENGINE",
                  "STRANDED",
                  "SERVICE",
                  "OTHER",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setStep(2)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center hover:border-orange-500 transition"
                  >
                    <h3 className="text-xl font-bold">{item}</h3>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-5xl font-black text-center mb-16">
                WHERE'S IT AT?
              </h2>

              <div className="grid md:grid-cols-5 gap-6">
                {["HOME", "WORK", "FARM", "ROADSIDE", "OTHER"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setStep(3)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-5xl font-black text-center mb-16">
                WHAT ARE WE LOOKING AT?
              </h2>

              <div className="grid md:grid-cols-4 gap-6">
                {["CAR", "TRUCK", "DIESEL", "EQUIPMENT"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setStep(4)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-5xl font-black text-center mb-16">
                SHOW US
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  "SNAP A PHOTO",
                  "LEAVE A VOICE MESSAGE",
                  "TYPE IT OUT",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setStep(5)}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 font-bold hover:border-orange-500"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <h2 className="text-5xl font-black text-center mb-10">
                BEST NUMBER TO REACH YOU?
              </h2>

              <div className="max-w-md mx-auto">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700"
                />

                <button className="w-full mt-4 bg-orange-500 text-black font-black p-4 rounded-xl">
                  SEND IT
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* KEEPING OKEECHOBEE MOVING */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-8">
            KEEPING OKEECHOBEE MOVING
          </h2>

          <p className="text-xl text-zinc-300">
            Helping families. Helping work trucks. Helping businesses.
            Helping neighbors. Helping people stay ahead of breakdowns.
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




