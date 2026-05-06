import { useState } from "react";

export default function CaptainDTripMemoryPage() {
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  const [reviewText, setReviewText] = useState(
    "Best fishing trip we’ve had on Lake Okeechobee. The catch, the photos, and the memory page made it feel even bigger.",
  );

  const memoryUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "https://www.homeplanet.city/planet/demo/captain-d-memory";

  const timeline = [
    { time: "6:42 AM", title: "Trip started", detail: "Guests checked in and headed out on Lake Okeechobee." },
    { time: "7:18 AM", title: "Morning bite active", detail: "Water looked good and the first strikes started early." },
    { time: "8:04 AM", title: "Big bass landed", detail: "A memory catch worth sharing with family and friends." },
    { time: "10:35 AM", title: "Trip wrapped", detail: "Photos saved, memory page created, and review ready." },
  ];

  async function handleShareTrip() {
    const shareData = {
      title: "Big Bass Memory",
      text: "Check out this Lake Okeechobee fishing trip memory.",
      url: memoryUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(memoryUrl);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy Link"), 1600);
    } catch (error) {
      console.error("Unable to share trip memory.", error);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(memoryUrl);
      setCopyStatus("Copied");
      window.setTimeout(() => setCopyStatus("Copy Link"), 1600);
    } catch (error) {
      console.error("Unable to copy trip memory link.", error);
    }
  }

  function handleLeaveReview() {
    const section = document.getElementById("trip-review");
    section?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              SHAREABLE TRIP MEMORY
            </div>
            <h1 className="text-4xl font-black md:text-6xl">Big Bass Memory</h1>
            <p className="mt-3 max-w-2xl text-white/70">
              A real trip recap customers can save, share, review, and come back to after the day on the water.
            </p>
          </div>

          <a
            href="/planet/demo/captain-d-charters"
            className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] hover:bg-white/10"
          >
            Back To Charter Page
          </a>
        </div>

        <div className="mb-8 rounded-[30px] border border-cyan-400/20 bg-cyan-400/10 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                TRIP COMPLETE
              </div>
              <h2 className="mt-2 text-2xl font-black">
                Your memory page is ready.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                Share the catch, copy the trip link, leave a review, or book the next day on the water.
                The memory is shareable without exposing private fishing spots.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleShareTrip}
                className="rounded-full bg-cyan-300 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
              >
                Share Trip Memory
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                {copyStatus}
              </button>

              <button
                type="button"
                onClick={handleLeaveReview}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                Leave Review
              </button>

              <a
                href="/planet/demo/captain-d-charters"
                className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
              >
                Book Again
              </a>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#0c1824]">
          <div
            className="min-h-[520px] bg-cover bg-center"
            style={{ backgroundImage: "url('/images/captain-d-big-bass-memory.jpg')" }}
          />

          <div className="grid gap-6 p-8 md:grid-cols-[1fr_0.65fr]">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
                LAKE OKEECHOBEE TRIP
              </div>

              <h2 className="mt-2 text-3xl font-black">A catch worth remembering.</h2>

              <p className="mt-4 text-sm leading-7 text-white/70">
                This is the kind of trip memory page that turns a fishing charter into something customers can share.
                The experience can show the story, the catch, the review, and the memory without exposing private fishing spots.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Big catch landed", "Spot kept private", "Review ready"].map((item) => (
                  <div key={item} className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4 text-sm font-black">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div id="trip-review" className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6">
              <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
                CUSTOMER REVIEW
              </div>

              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                rows={6}
                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-lg font-black leading-8 text-white outline-none transition focus:border-cyan-300/40"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full bg-cyan-300 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#071019]"
                >
                  Save Review
                </button>

                <button
                  type="button"
                  onClick={handleShareTrip}
                  className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-white/10"
                >
                  Share After Review
                </button>
              </div>

              <p className="mt-4 text-sm text-white/60">Ready for customer review + share.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[0.7fr_1fr]">
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0c1824]">
            <div
              className="min-h-[360px] bg-cover bg-center"
              style={{ backgroundImage: "url('/images/captain-d-kids-first-catch.jpg')" }}
            />
            <div className="p-6">
              <h3 className="text-2xl font-black">Family moments matter.</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">
                First catches, big smiles, sunrise runs, and family photos become part of the trip story.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              TRIP TIMELINE
            </div>
            <div className="mt-5 space-y-4">
              {timeline.map((item) => (
                <div key={item.time} className="rounded-2xl border border-white/10 bg-[#0c1824] p-4">
                  <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/50">{item.time}</div>
                  <h4 className="mt-2 text-lg font-black">{item.title}</h4>
                  <p className="mt-1 text-sm leading-6 text-white/65">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
