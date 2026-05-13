import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LazyLunkerBookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              STAY + FISH REQUEST
            </div>
            <h1 className="text-4xl font-black md:text-6xl">Plan Your Stay</h1>
            <p className="mt-4 max-w-3xl text-white/70">
              Start with the basic details first so the stay, fishing add-ons, and planning call stay organized from the beginning.
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
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Name", "John Smith"],
                ["Phone", "863-555-0123"],
                ["Email", "guest@email.com"],
                ["Dates Interested In", "Weekend in March"],
                ["Group Size", "4 adults, 2 kids"],
                ["Package Interest", "Stay + fishing charter"],
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
                  What are you trying to plan?
                </span>
                <textarea
                  rows={5}
                  placeholder="We want a family weekend stay with a guided fishing trip, maybe a cookout night, and easy local recommendations."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-cyan-300 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.01]"
            >
              Submit Stay Request
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                PLANNING CALL
              </div>

              <h2 className="mt-3 text-2xl font-black">
                {submitted ? "Planning call unlocked." : "Basic info first."}
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                {submitted
                  ? "Now that the basic stay details are captured, the customer can schedule a call without the business having to chase missing information."
                  : "The customer submits the important details first. Then the planning call becomes useful instead of scattered across messages."}
              </p>

              {submitted ? (
                <a
                  href="tel:8635550123"
                  className="mt-5 inline-flex w-full justify-center rounded-full bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-[#071019]"
                >
                  Book Planning Call
                </a>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-bold text-white/50">
                  Planning call unlocks after request is submitted.
                </div>
              )}
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
                EXPERIENCE FLOW
              </div>
              <div className="mt-4 space-y-3 text-sm font-bold text-white">
                <div>? Stay request captured</div>
                <div>? Fishing charter interest noted</div>
                <div>? Group size + dates organized</div>
                <div>? Planning call unlocked after details</div>
                <div>? Guest experience can become shareable later</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}




