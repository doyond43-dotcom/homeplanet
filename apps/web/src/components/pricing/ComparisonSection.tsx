export default function ComparisonSection() {
  const rows = [
    {
      label: "Scheduling",
      serviceTitan: "yes",
      jobberA: "yes",
      jobberB: "yes",
      companyCam: "yes",
      homePlanet: "yes",
    },
    {
      label: "Dispatch",
      serviceTitan: "yes",
      jobberA: "yes",
      jobberB: "partial",
      companyCam: "partial",
      homePlanet: "yes",
    },
    {
      label: "Invoices",
      serviceTitan: "yes",
      jobberA: "partial",
      jobberB: "partial",
      companyCam: "yes",
      homePlanet: "yes",
    },
    {
      label: "Customer updates",
      serviceTitan: "yes",
      jobberA: "partial",
      jobberB: "partial",
      companyCam: "no",
      homePlanet: "yes",
    },
    {
      label: "Photo proof",
      serviceTitan: "partial",
      jobberA: "no",
      jobberB: "no",
      companyCam: "no",
      homePlanet: "yes",
    },
    {
      label: "Live job timeline",
      serviceTitan: "no",
      jobberA: "no",
      jobberB: "no",
      companyCam: "no",
      homePlanet: "yes",
    },
    {
      label: "Real-time customer visibility",
      serviceTitan: "no",
      jobberA: "no",
      jobberB: "no",
      companyCam: "no",
      homePlanet: "yes",
    },
    {
      label: "One-screen workflow clarity",
      serviceTitan: "no",
      jobberA: "no",
      jobberB: "no",
      companyCam: "no",
      homePlanet: "yes",
    },
    {
      label: "Proof of what happened, when it happened",
      serviceTitan: "no",
      jobberA: "no",
      jobberB: "no",
      companyCam: "no",
      homePlanet: "yes",
    },
    {
      label: "Still requires texts / callbacks / status chasing",
      serviceTitan: "partial",
      jobberA: "partial",
      jobberB: "partial",
      companyCam: "no",
      homePlanet: "built",
    },
  ] as const;

  function cell(value: string) {
    if (value === "yes") {
      return <span className="text-2xl font-bold text-cyan-300">✓</span>;
    }

    if (value === "partial") {
      return <span className="text-sm font-semibold text-amber-300">Partial</span>;
    }

    if (value === "built") {
      return (
        <span className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          Built to reduce it
        </span>
      );
    }

    return <span className="text-2xl font-light text-white/35">✕</span>;
  }

  return (
    <section className="mt-16">
      <div className="rounded-[28px] border border-cyan-400/15 bg-white/[0.03] p-5 shadow-[0_0_40px_rgba(34,211,238,0.06)] backdrop-blur-sm md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
            Competitive reality
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            What You’re Paying For vs. What You’re Still Missing
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-white/65 md:text-base">
            Most software handles pieces of the workflow. HomePlanet is built to connect intake,
            visibility, proof, updates, and real-world service flow in one living system.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
            <thead>
              <tr>
                <th className="rounded-tl-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left text-sm font-semibold text-white/85 md:px-5">
                  What You’re Paying For
                </th>
                <th className="border border-white/10 bg-white/[0.03] px-4 py-4 text-center text-sm font-semibold text-white/85 md:px-5">
                  ServiceTitan
                </th>
                <th className="border border-white/10 bg-white/[0.03] px-4 py-4 text-center text-sm font-semibold text-white/85 md:px-5">
                  Jobber
                </th>
                <th className="border border-white/10 bg-white/[0.03] px-4 py-4 text-center text-sm font-semibold text-white/85 md:px-5">
                  Housecall Pro
                </th>
                <th className="border border-white/10 bg-white/[0.03] px-4 py-4 text-center text-sm font-semibold text-white/85 md:px-5">
                  CompanyCam
                </th>
                <th className="rounded-tr-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-4 text-center text-sm font-semibold text-emerald-100 md:px-5">
                  HomePlanet
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={row.label}>
                  <td
                    className={`border border-white/10 px-4 py-4 text-sm font-medium text-white/88 md:px-5 ${
                      index === rows.length - 1 ? "rounded-bl-2xl" : ""
                    }`}
                  >
                    {row.label}
                  </td>

                  <td className="border border-white/10 px-4 py-4 text-center">{cell(row.serviceTitan)}</td>
                  <td className="border border-white/10 px-4 py-4 text-center">{cell(row.jobberA)}</td>
                  <td className="border border-white/10 px-4 py-4 text-center">{cell(row.jobberB)}</td>
                  <td className="border border-white/10 px-4 py-4 text-center">{cell(row.companyCam)}</td>
                  <td
                    className={`border border-emerald-300/20 bg-emerald-400/[0.06] px-4 py-4 text-center ${
                      index === rows.length - 1 ? "rounded-br-2xl" : ""
                    }`}
                  >
                    {cell(row.homePlanet)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/65">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-cyan-300">✓</span>
            <span>Full support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-amber-300">Partial</span>
            <span>Partial support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-light text-white/35">✕</span>
            <span>Not core / still missing</span>
          </div>
        </div>
      </div>
    </section>
  );
}