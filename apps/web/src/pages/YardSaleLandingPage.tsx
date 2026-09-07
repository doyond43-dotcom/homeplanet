import { Link } from "react-router-dom";

export default function YardSaleLandingPage() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-10">
          <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            Free early access
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                Yard Sale by HomePlanet
              </p>

              <h1 className="max-w-3xl text-4xl font-black leading-[0.98] sm:text-6xl">
                Turn your yard sale into a live sale.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
                Create one simple page for your sale, add your featured items,
                and share one link so people can see what you have before they
                drive over.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/yard-sale/start?new=1"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-6 text-base font-black text-black transition hover:bg-white/90"
                >
                  Create My Free Yard Sale
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-6 text-base font-bold text-white transition hover:bg-white/[0.08]"
                >
                  See How It Works
                </a>
              </div>

              <p className="mt-4 text-sm text-white/45">
                No listing fee. No subscription. Seller keeps the sale.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/40 p-5">
              <div className="rounded-[24px] border border-white/10 bg-[#121212] p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                      Live Yard Sale
                    </p>
                    <h2 className="mt-1 text-2xl font-black">
                      Your Sale Name
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    LIVE
                  </span>
                </div>

                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src="/images/yard-sale-landing-hero.png"
                    alt="Example live yard sale"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/[0.04] p-4">
                    <p className="text-xs text-white/40">Location</p>
                    <p className="mt-1 font-bold">Your area</p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] p-4">
                    <p className="text-xs text-white/40">Sale Date</p>
                    <p className="mt-1 font-bold">Your date</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="how-it-works" className="py-14 sm:py-20">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/45">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Four simple steps.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["01", "Create your sale", "Add the basics: name, date, area and contact info."],
              ["02", "Add your items", "Feature the stuff people are most likely to come for."],
              ["03", "Publish your page", "Your yard sale gets its own live shareable link."],
              ["04", "Share it anywhere", "Post it to Facebook, Messenger, text or anywhere else."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm font-black text-white/30">{number}</p>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7 text-center sm:p-10">
          <h2 className="text-3xl font-black sm:text-4xl">
            Ready to put your sale online?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-white/55">
            Build the page, share the link, and make it easier for local buyers
            to see what is still available.
          </p>

          <Link
            to="/yard-sale/start?new=1"
            className="mt-7 inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-7 text-base font-black text-black transition hover:bg-white/90"
          >
            Start My Free Yard Sale
          </Link>
        </section>
      </section>
    </main>
  );
}

