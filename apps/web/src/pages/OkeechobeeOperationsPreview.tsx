import { Link } from "react-router-dom";

const pendingNeeds = [
  {
    title: "Roof repair for small leak",
    category: "Home Repair",
    urgency: "When someone is available",
    status: "Pending Review",
  },
  {
    title: "Accessibility help needed",
    category: "Home Access",
    urgency: "This week",
    status: "Pending Review",
  },
];

const activeProjects = [
  {
    title: "Roof repair for local resident",
    helpers: 2,
    status: "Active",
  },
  {
    title: "Accessibility and tree help",
    helpers: 3,
    status: "Active",
  },
];

export default function OkeechobeeOperationsPreview() {
  return (
    <main className="min-h-screen bg-[#030806] px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="rounded-[30px] border border-emerald-300/15 bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,0.10),transparent_34%),rgba(0,0,0,0.34)] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-emerald-300">
                Okeechobee Together
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Community Operations Center
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                A local need comes in. It gets reviewed, organized, connected
                with the right people, and followed through to an outcome.
              </p>
            </div>

            <Link
              to="/planet/okeechobee"
              className="w-fit rounded-full border border-emerald-300/20 px-5 py-3 text-sm font-black text-emerald-200 transition hover:border-emerald-300/45 hover:text-white"
            >
              View Public Community Page
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Active Projects", "2"],
              ["Total Helpers", "5"],
              ["Total Views", "69"],
              ["Total Shares", "0"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-white/10 bg-black/35 p-5"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                  {label}
                </p>

                <p className="mt-2 text-4xl font-black text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <section className="rounded-[28px] border border-amber-300/15 bg-amber-300/[0.025] p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-300">
              Incoming Requests
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Needs Waiting for Review
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Review first. Make public only when the need is clear, safe, and ready.
            </p>

            <div className="mt-5 grid gap-3">
              {pendingNeeds.map((need) => (
                <article
                  key={need.title}
                  className="rounded-[22px] border border-white/10 bg-black/30 p-5"
                >
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
                    {need.status}
                  </span>

                  <h3 className="mt-4 text-xl font-black">
                    {need.title}
                  </h3>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">
                        Category
                      </p>
                      <p className="mt-1 text-sm font-bold text-zinc-300">
                        {need.category}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">
                        Urgency
                      </p>
                      <p className="mt-1 text-sm font-bold text-zinc-300">
                        {need.urgency}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-emerald-300/15 bg-emerald-300/[0.025] p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
              Public Projects
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Active Projects
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Once active, the community can see the need, follow progress, and understand where help is going.
            </p>

            <div className="mt-5 grid gap-3">
              {activeProjects.map((project) => (
                <article
                  key={project.title}
                  className="rounded-[22px] border border-white/10 bg-black/30 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black">
                        {project.title}
                      </h3>

                      <p className="mt-2 text-sm text-zinc-500">
                        {project.helpers} helpers joined
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
                      {project.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-zinc-600">
                      Public Story
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Need identified → helpers connected → work organized → progress remains visible.
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-[28px] border border-yellow-300/20 bg-yellow-300/[0.05] p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src="/images/homeplanet-green-piggy-bank-transparent.png?v=20260629-105940"
              alt=""
              aria-hidden="true"
              className="h-20 w-20 shrink-0 object-contain"
            />

            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300">
                Money Accountability
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Community Piggy Bank
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 sm:text-base">
                Some neighbors can pay. Some can pay a little. Some need help.
                The Piggy Bank can cover the gap so the work still happens and
                the worker can still be paid fairly.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Fair worker pay", "$50"],
              ["Resident contribution", "$30"],
              ["Piggy Bank", "$20"],
              ["Worker paid", "$50"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[20px] border border-white/10 bg-black/30 p-5"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  {label}
                </p>

                <p className="mt-2 text-3xl font-black text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-2">
            {[
              "Money In",
              "Assigned Need",
              "Work",
              "Worker Paid",
              "Proof",
              "Outcome",
            ].map((step, index, steps) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-yellow-300/15 bg-yellow-300/[0.04] px-4 py-2 text-xs font-black text-white">
                  {step}
                </span>

                {index < steps.length - 1 ? (
                  <span className="text-yellow-300/35">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-4xl text-lg font-black leading-8 text-white">
            Support stays attached to what it was meant to accomplish.
            <span className="text-yellow-300">
              {" "}No black hole.
            </span>
          </p>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
            Accountability
          </p>

          <h2 className="mt-3 max-w-4xl text-3xl font-black tracking-[-0.03em] sm:text-4xl">
            Help should lead to a visible outcome.
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              "Need",
              "Review",
              "Helpers / Resources",
              "Active Project",
              "Work",
              "Proof",
              "Outcome",
            ].map((step, index, steps) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.04] px-4 py-2 text-xs font-black text-white">
                  {step}
                </span>

                {index < steps.length - 1 ? (
                  <span className="text-emerald-300/35">→</span>
                ) : null}
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-4xl text-base leading-7 text-zinc-400">
            The public story is the need, the response, the work, and what the support accomplished.
          </p>
        </section>
      </section>
    </main>
  );
}