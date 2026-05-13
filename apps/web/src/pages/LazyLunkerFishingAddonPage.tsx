import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LazyLunkerFishingAddonPage() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              FISHING ADD-ON
            </div>
            <h1 className="text-4xl font-black md:text-6xl">Add Fishing To Your Stay</h1>
            <p className="mt-4 max-w-3xl text-white/70">
              Add a guided Lake Okeechobee fishing experience to your stay without leaving the vacation planning flow.
            </p>
          </div>

          <a
            href="/planet/demo/stay-experience-preview"
            className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] hover:bg-white/10"
          >
            Back To Experience
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_0.75fr]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
              navigate("/planet/demo/stay-experience-preview-request-active");
            }}
            className="rounded-[34px] border border-white/10 bg-[#0c1824] p-7"
          >
            <div className="mb-6 overflow-hidden rounded-[28px] border border-cyan-400/15">
              <div
                className="min-h-[260px] bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/captain-d-double-bass.jpg')",
                }}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Guest Name", "John Smith"],
                ["Phone", "863-555-0123"],
                ["Stay Dates", "March 15-17"],
                ["Fishing Preference", "Guided bass trip"],
                ["Guest Count", "2 adults, 1 child"],
                ["Experience Goal", "Big bass / kids first catch"],
              ].map(([label, placeholder]) => (
                <label key={label} className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/50">
                    {label}
                  </span>
                  <input
                    placeholder={placeholder}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                  />
                </label>
              ))}

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/50">
                  Fishing Notes
                </span>
                <textarea
                  rows={5}
                  placeholder="We are staying for the weekend and would like to add a morning fishing trip. One child is fishing for the first time."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-cyan-300 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.01]"
            >
              Send Fishing Add-On Request
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                CONNECTED REQUEST
              </div>

              <h2 className="mt-3 text-2xl font-black">
                {submitted ? "Fishing add-on received." : "Stay first. Fishing added cleanly."}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                {submitted
                  ? "The stay request and fishing interest can stay connected so nobody has to chase missing details across texts, calls, or Facebook messages."
                  : "Guests can add fishing as part of the same Lake Okeechobee experience, while the business keeps the request organized from the start."}
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
                WHY THIS WORKS
              </div>
              <div className="mt-4 space-y-3 text-sm font-bold text-white">
                <div>? Fishing interest stays tied to the stay</div>
                <div>? Guide coordination becomes easier</div>
                <div>? Trip goals are captured early</div>
                <div>? Family moments can become memories</div>
                <div>? Private fishing spots stay protected</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0c1824]">
              <div
                className="min-h-[260px] bg-cover bg-center"
                style={{
                  backgroundImage: "url('/images/captain-d-big-bass-memory.jpg')",
                }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-black">Memory-ready trip.</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  After the experience, the catch can become a shareable trip memory with review, photos, and rebooking.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}




