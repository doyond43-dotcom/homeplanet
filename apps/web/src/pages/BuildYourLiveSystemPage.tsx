import { Link } from "react-router-dom";

const demos = [
  {
    title: "Request Center",
    eyebrow: "Step 01",
    body: "A customer request comes in with the job details, notes, priority, contact information, and location already connected.",
    href: "/planet/live-system/request",
    cta: "Open Request Demo",
    preview: ["Customer info captured", "Photos and notes attached", "Location ready"],
  },
  {
    title: "Dispatch Desk",
    eyebrow: "Step 02",
    body: "Assign the right person, tap to call, tap to text, open maps, and send the job details without copying information around.",
    href: "/planet/live-system/dispatch",
    cta: "Open Dispatch Demo",
    preview: ["Assigned to crew", "Tap call / text / maps", "Job details sent"],
  },
  {
    title: "Live Command View",
    eyebrow: "Step 03",
    body: "Watch the work move from request to action to completion with photos, reports, status updates, and history connected.",
    href: "/planet/live-system/operations",
    cta: "Open Live Demo",
    preview: ["Live status visible", "Photos and reports connected", "Completion history saved"],
  },
];

export default function BuildYourLiveSystemPage() {
  return (
    <main className="min-h-screen bg-[#050812] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link to="/planet/home" className="text-sm font-black text-emerald-300">
          Back to HomePlanet
        </Link>

        <section className="mt-8 rounded-[2rem] bg-gradient-to-br from-emerald-400/15 via-white/5 to-cyan-400/10 p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">
            Build Your Live System
          </p>

          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
            Turn your website into the system that runs the work.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            HomePlanet connects the request, the crew, the customer, and the
            owner into one live workflow.
          </p>
        </section>

        <section className="mt-10 space-y-8">
          {demos.map((demo) => (
            <section
              key={demo.title}
              className="grid gap-6 rounded-[2rem] bg-white/[0.04] p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
            >
              <div className="rounded-[1.75rem] bg-black/35 p-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
                  {demo.eyebrow}
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                  {demo.title}
                </h2>

                <p className="mt-4 text-lg leading-8 text-slate-300">
                  {demo.body}
                </p>

                <Link
                  to={demo.href}
                  className="mt-7 inline-flex rounded-full bg-emerald-300 px-6 py-3 font-black text-slate-950 transition hover:bg-white"
                >
                  {demo.cta}
                </Link>
              </div>

              <div className="min-h-[260px] rounded-[1.75rem] bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6">
                <div className="rounded-2xl bg-white/5 p-5">
                  <div className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                    Live System Preview
                  </div>
                  <div className="mt-4 text-2xl font-black">{demo.title}</div>
                  <div className="mt-4 space-y-3">
                    {demo.preview.map((item) => (
                      <div key={item} className="rounded-xl bg-black/35 p-4 text-sm font-black text-slate-300">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] bg-emerald-300/10 p-8">
          <h2 className="text-4xl font-black leading-tight md:text-5xl">
            More than a website.
          </h2>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Most websites stop when a customer submits a form. HomePlanet keeps
            the workflow moving.
          </p>

          <div className="mt-6 text-2xl font-black text-emerald-300">
            Request - Assign - Track - Complete
          </div>
        </section>
      </div>
    </main>
  );
}



