import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GUARDIAN_PHONE = "8635320683";
const GUARDIAN_DISPLAY_PHONE = "(863) 532-0683";

export default function GuardianBellaPreview() {
  const navigate = useNavigate();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-black text-white px-4 py-10">
      <section className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <p className="text-xs tracking-[0.35em] text-white/40 uppercase">
            HomePlanet Guardian
          </p>
          <h1 className="text-4xl font-black mt-2">Bella</h1>
          <p className="text-white/50 text-sm mt-2">
            Presence verified • Guardian protected
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 text-center shadow-2xl">
          <div className="w-28 h-28 mx-auto rounded-full bg-white/10 flex items-center justify-center text-4xl">
            🐶
          </div>

          <h2 className="mt-4 text-2xl font-black">Bella</h2>
          <p className="text-white/50 text-sm">Golden Retriever • Friendly</p>

          <div className="mt-6 space-y-2 text-sm text-white/70">
            <p>✔ Vaccinated</p>
            <p>✔ Microchipped</p>
            <p>✔ Safe with children</p>
          </div>

          {/* CONTACT */}
          <button
            onClick={() => setContactOpen(true)}
            className="mt-6 w-full rounded-2xl bg-white text-black py-4 font-black"
          >
            Contact Guardian
          </button>

          {/* SALES BUTTON */}
          <button
            onClick={() => navigate("/planet/guardian-pet")}
            className="mt-3 w-full rounded-2xl border border-white/20 bg-white/5 py-3 text-sm font-bold text-white/80 hover:bg-white/10"
          >
            Get a tag like Bella →
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-xl font-black">About Bella</h3>
          <p className="mt-3 text-white/60 leading-relaxed">
            Bella is part of a Guardian-protected household. Every scan creates a
            verified presence moment tied to her identity. If found, her timeline
            and owner connection are instantly accessible.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-xl font-black">Recent Activity</h3>

          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl bg-black/30 p-3">
              Scanned at park • 10:42 AM
            </div>
            <div className="rounded-xl bg-black/30 p-3">
              At home • Safe • 9:15 AM
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/planet/guardian")}
            className="rounded-2xl border border-white/20 px-6 py-3 text-white/70"
          >
            Back to Guardian
          </button>
        </div>
      </section>

      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 px-4 pb-4 md:items-center md:pb-0">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
                  Guardian Contact
                </p>
                <h2 className="mt-2 text-2xl font-black">You found Bella?</h2>
              </div>

              <button
                onClick={() => setContactOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-white/60 leading-relaxed">
              Please contact Bella’s guardian right away. Even a quick message
              helps the owner know where she was seen.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Guardian phone
              </p>
              <p className="mt-1 text-xl font-black">{GUARDIAN_DISPLAY_PHONE}</p>
            </div>

            <div className="mt-5 grid gap-3">
              <a
                href={`tel:${GUARDIAN_PHONE}`}
                className="rounded-2xl bg-white px-5 py-4 text-center font-black text-black"
              >
                Call Guardian
              </a>

              <a
                href={`sms:${GUARDIAN_PHONE}?body=Hi, I found Bella. I have her safe. Here is my location: `}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center font-black text-white"
              >
                Text Guardian
              </a>
            </div>

            <p className="mt-4 text-center text-xs text-white/40">
              No app. No login. Just connect and help Bella get home.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}