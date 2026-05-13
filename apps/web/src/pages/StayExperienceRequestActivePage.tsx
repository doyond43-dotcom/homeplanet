export default function StayExperienceRequestActivePage() {
  return (
    <main className="min-h-screen bg-[#071019] text-white">
      <section
        className="relative overflow-hidden border-b border-cyan-400/20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(7,16,25,0.72), rgba(7,16,25,0.94)), url('/images/stay-showcase-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex min-h-[72vh] max-w-5xl flex-col justify-center px-6 py-20">
          <div className="mb-4 inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
            EXPERIENCE REQUEST ACTIVE
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Your Lake Okeechobee experience has started.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
            Your stay request and fishing interest were received successfully.
            Planning details are now organized so the experience can move
            forward cleanly without scattered messages or missing information.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              "Stay request received",
              "Fishing add-on interest logged",
              "Planning coordination started",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-5"
              >
                <div className="text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
                  ? {item}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="/planet/demo/stay-experience-preview"
              className="rounded-full bg-cyan-300 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-[#071019] transition hover:scale-[1.02]"
            >
              Return To Experience
            </a>

            <a
              href="/planet/demo/trip-memory-preview"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              View Example Trip Memory
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Organized from the beginning",
              text: "Basic details are captured before planning calls happen so communication stays clean.",
            },
            {
              title: "Connected stay + fishing flow",
              text: "The guest experience stays connected instead of bouncing between disconnected systems.",
            },
            {
              title: "Memory-ready experiences",
              text: "Trips can later become shareable memories, reviews, and future rebooking opportunities.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[32px] border border-white/10 bg-[#0c1824] p-7"
            >
              <div className="text-2xl font-black">{item.title}</div>

              <p className="mt-4 text-sm leading-7 text-white/70">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}





