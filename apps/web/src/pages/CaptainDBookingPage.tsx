import { useState } from "react";

export default function CaptainDBookingPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              CHARTER REQUEST
            </div>
            <h1 className="text-4xl font-black md:text-6xl">Book Your Charter</h1>
            <p className="mt-4 max-w-3xl text-white/70">
              Send a simple trip request for guided fishing, pontoon tours, family trips, or Lake Okeechobee experiences.
            </p>
          </div>

          <a
            href="/planet/demo/captain-d-charters"
            className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] hover:bg-white/10"
          >
            Back To Charter Page
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_0.75fr]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-[34px] border border-white/10 bg-[#0c1824] p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Name", "John Smith"],
                ["Phone", "863-555-0123"],
                ["Preferred Date", "Saturday morning"],
                ["Trip Type", "Guided fishing trip"],
                ["Guests", "2 adults, 1 child"],
                ["Experience Goal", "Big bass / family memory"],
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
                  Notes
                </span>
                <textarea
                  rows={5}
                  placeholder="First time fishing Lake Okeechobee. Would love a family-friendly morning trip."
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-cyan-300 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.01]"
            >
              Send Charter Request
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                BUSINESS NOTIFICATION
              </div>
              <h2 className="mt-3 text-2xl font-black">
                {submitted ? "Request received." : "What happens next?"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {submitted
                  ? "Captain D would receive the request details so they can call, text, confirm availability, and turn the trip into a live memory experience."
                  : "When a customer sends a request, the business gets the trip details in one clean place instead of chasing messages across Facebook, texts, and memory."}
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
                BOOKING FLOW
              </div>
              <div className="mt-4 space-y-3 text-sm font-bold text-white">
                <div>? Customer sends trip request</div>
                <div>? Business gets clean details</div>
                <div>? Trip can become a live board</div>
                <div>? Photos become a memory page</div>
                <div>? Review + share flow after trip</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
