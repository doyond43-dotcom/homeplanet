export default function CaptainDPrivacyPage() {
  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
              PRIVACY + CONTROL
            </div>
            <h1 className="text-4xl font-black md:text-6xl">Trip Privacy Settings</h1>
            <p className="mt-4 max-w-3xl text-white/70">
              Built for fishing guides, families, and guests who want the memory without exposing private details.
            </p>
          </div>

          <a
            href="/planet/demo/lake-experience-preview"
            className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] hover:bg-white/10"
          >
            Back To Charter Page
          </a>
        </div>

        <div className="grid gap-6">
          <article className="rounded-[30px] border border-cyan-400/20 bg-cyan-400/10 p-7">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/60">
              01
            </div>
            <h2 className="mt-3 text-2xl font-black">Fishing spots stay private.</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Trip memories can show catches, smiles, weather, water conditions, and the story of the day without showing exact GPS locations, private routes, or sensitive fishing areas.
            </p>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              02
            </div>
            <h2 className="mt-3 text-2xl font-black">The business controls what becomes public.</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Photos, reviews, trip notes, customer names, and share links can be approved before being shown publicly. The guide stays in control of the customer experience.
            </p>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
            <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">
              03
            </div>
            <h2 className="mt-3 text-2xl font-black">Customers can keep memories private.</h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              A trip memory can be shared with family, saved as a private recap, or used for a public review only when the customer and business are comfortable with it.
            </p>
          </article>
        </div>

        <div className="mt-8 rounded-[30px] border border-white/10 bg-[#0c1824] p-7">
          <h2 className="text-2xl font-black">Simple rule</h2>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Share the experience. Protect the private details. Keep the guide, the customer, and the business in control.
          </p>
        </div>
      </section>
    </main>
  );
}



