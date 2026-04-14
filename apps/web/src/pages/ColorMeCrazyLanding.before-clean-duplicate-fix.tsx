import { useMemo } from "react";

type StoredPayload = {
  businessName?: string;
  boardSlug?: string;
  city?: string;
};

function readStoredPayload(): StoredPayload {
  try {
    const raw = window.localStorage.getItem("hp_onboarding_payload");
    if (!raw) return {};
    return JSON.parse(raw) as StoredPayload;
  } catch {
    return {};
  }
}

function readBoardSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("board") || "").trim();
}

function makeLiveBoardHref(boardSlug: string) {
  return boardSlug ? `/planet/live/${boardSlug}` : "/planet/creator/start";
}

export default function ColorMeCrazyLanding() {

  const businessName = "Color Me Crazy";
  const stored = useMemo(() => readStoredPayload(), []);
  const queryBoardSlug = useMemo(() => readBoardSlugFromQuery(), []);
  const params = new URLSearchParams(window.location.search);
const boardSlug = params.get("board") || "color-me-crazy-demo";
  const liveBoardHref = makeLiveBoardHref(boardSlug);

  const businessName = "Color Me Crazy";
  const city = stored.city?.trim() || "Okeechobee, Florida";

  const ctaLabel = boardSlug ? "View Live Board" : "Build My Live Demo";
  const ctaHref = liveBoardHref;

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4 rounded-xl border border-cyan-400/20 bg-[#061226] px-4 py-3 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
          <div className="flex flex-col gap-3 text-xs md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-cyan-200">
              <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Beauty Live
              </span>
              <span className="opacity-60">City:</span>
              <span className="font-medium text-white">{city}</span>
              <span className="opacity-30">|</span>
              <span className="opacity-60">Board:</span>
              <span className="font-mono text-cyan-300">
                {boardSlug || "connect after live demo build"}
              </span>
            </div>

            <div className="text-right text-[11px] uppercase tracking-[0.18em] text-white/40">
              Presence-first Â· Live service flow
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 shadow-[0_0_80px_rgba(34,211,238,0.10)]">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-10">
            <div>
              <div className="inline-flex items-center rounded-full border border-pink-400/25 bg-pink-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-pink-200">
                Salon live system
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
                Color Me Crazy
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Book appointments, keep clients updated, send invoices, and get
                paid instantly from one clean live board instead of bouncing
                between messages, notes, and payment apps.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={ctaHref}
                  className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  {ctaLabel}
                </a>

                <a
                  href={liveBoardHref}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Book Now
                </a>

                <a
                  href={liveBoardHref}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/15"
                >
                  Instant Pay
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Appointments
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    See who is coming in and what they need.
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Client updates
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    Text straight from the board instead of digging through messages.
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Fast payment
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">
                    Invoice, scan, tap, pay, done.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                What happens today
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-[22px] border border-cyan-400/20 bg-cyan-400/10 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">
                    1 Â· Build live demo
                  </div>
                  <div className="mt-2 text-sm leading-6 text-cyan-50">
                    We answer a few real business questions and generate a live
                    board right in front of you.
                  </div>
                </div>

                <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-400/10 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-200/70">
                    2 Â· Turn on payment
                  </div>
                  <div className="mt-2 text-sm leading-6 text-emerald-50">
                    Cash App and Zelle connect directly into the board so you can
                    invoice and collect payment fast.
                  </div>
                </div>

                <div className="rounded-[22px] border border-pink-400/20 bg-pink-400/10 px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-pink-200/70">
                    3 Â· Wrap the landing page around it
                  </div>
                  <div className="mt-2 text-sm leading-6 text-pink-50">
                    This page becomes the clean front door. The live board stays
                    the real engine behind it.
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-[#070d1a] p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Todayâ€™s outcome
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-300">
                  You walk out with a real live system, not a fake mockup. Your
                  board handles appointments, service flow, invoice sending, and
                  instant payment from one place.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[30px] border border-white/10 bg-[#081122] p-6">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Why this hits different
            </div>

            <h2 className="mt-3 text-3xl font-semibold text-white">
              This is not just a beauty page.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
              Most salon pages stop at â€œcall usâ€ or â€œmessage us.â€ This one can
              point directly into the live operating board. That means your page
              is no longer pretending the business works well. It shows the
              business is actually organized.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">
                  Fewer delays
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Client name, service, invoice, and payment live together.
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">
                  Better trust
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Clients can feel when a business is smooth and ready.
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">
                  Faster payment
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Send the invoice from the job and let the client pay right then.
                </div>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">
                  Real foundation
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Landing page first looks nice. Live board first actually works.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-cyan-400/20 bg-cyan-400/10 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                  Live board connection
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  One click into the real system
                </h2>
              </div>

              <div className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                {boardSlug ? "Connected" : "Ready to connect"}
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-white/10 bg-[#070d1a] p-5">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Connected board slug
              </div>
              <div className="mt-2 break-all font-mono text-sm text-cyan-300">
                {boardSlug || "no board slug yet"}
              </div>

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
                <div>â€¢ Send clients directly into the booking / live flow</div>
                <div>â€¢ Collect payment through the real job, not a separate mess</div>
                <div>â€¢ Keep updates, invoice, and payment all tied together</div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={liveBoardHref}
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  {ctaLabel}
                </a>

                <a
                  href="/planet/creator/start"
                  className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                >
                  Open Creator City
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[30px] border border-white/10 bg-[#081122] p-6 md:p-8">
          <div className="max-w-4xl">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Final close
            </div>

            <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
              Ready to see something most people would take months to build?
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300">
              We can build the live demo first, connect payment, and wrap the
              landing page around the real system right in front of you.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={ctaHref}
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
              >
                {ctaLabel}
              </a>

              <a
                href={liveBoardHref}
                className="rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
              >
                See The Live Flow
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}






