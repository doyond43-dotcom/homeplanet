export default function WhyDifferentSection() {
  const features = [
    {
      title: "Customer Self Check-In (QR)",
      desc: "Customers can check in instantly without staff involvement.",
    },
    {
      title: "Instant Receipt (Proof of Intake)",
      desc: "Every job is captured and confirmed immediately.",
    },
    {
      title: "Time-Stamped Requests",
      desc: "Every action is recorded with real-world timing.",
    },
    {
      title: "Live Job Visibility",
      desc: "Customers see their job status without calling.",
    },
    {
      title: "No App Required",
      desc: "Works directly from a simple link.",
    },
    {
      title: "Zero Paper / No Lost Tickets",
      desc: "Everything is tracked digitally in one place.",
    },
    {
      title: "Photo Upload at Intake",
      desc: "Capture condition and proof from the start.",
    },
    {
      title: "Frictionless Walk-In Flow",
      desc: "No waiting, no confusion, no lost info.",
    },
    {
      title: "Customer Trust Transparency",
      desc: "Customers see exactly what’s happening.",
    },
    {
      title: "Works From a Simple Link",
      desc: "No installs. No friction. Just open and go.",
    },
  ];

  return (
    <section className="mt-20">
      <div className="rounded-[28px] border border-blue-400/15 bg-white/[0.03] p-6 shadow-[0_0_50px_rgba(59,130,246,0.08)] backdrop-blur-sm md:p-10">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-blue-300/80">
            System shift
          </p>

          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Why HomePlanet is Different
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/65 md:text-base">
            Traditional tools manage tasks. HomePlanet connects the entire workflow
            into a real-time, presence-based system.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/10 bg-black/40 p-5 hover:border-blue-400/30 transition"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl text-blue-300">✓</div>

                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}