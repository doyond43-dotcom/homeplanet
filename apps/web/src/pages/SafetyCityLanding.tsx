import { Link } from "react-router-dom";

const tools = [
  { title: "Guardian Panic", detail: "Emergency panic flow, live safety status, and fast action access.", href: "/planet/guardian-panic" },
  { title: "Wearable Panic", detail: "Wearable-style safety concept for fast alerts and family visibility.", href: "/planet/guardian-wearable-panic" },
  { title: "Household Safety", detail: "Household-level safety visibility for families, seniors, and care situations.", href: "/planet/guardian-household" },
];

export default function SafetyCityLanding() {
  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <Link to="/city" className="text-sm font-bold text-cyan-200/80 hover:text-cyan-100">? Back to Cities</Link>
        <div className="mt-8 rounded-[34px] border border-cyan-400/15 bg-white/[0.04] p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/50">SAFETY CITY</div>
          <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight md:text-7xl">Emergency tools built around presence, timing, and trust.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Safety City brings Guardian-style tools together so panic flows, family safety, wearable alerts, and household visibility can live under one clear system.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.href} className="rounded-[28px] border border-white/10 bg-[#0c1824] p-6 text-white no-underline transition hover:border-cyan-300/30 hover:bg-cyan-400/10">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-cyan-100/45">LIVE TOOL</div>
              <h2 className="mt-3 text-2xl font-black">{tool.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{tool.detail}</p>
              <div className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#071019]">Open Tool</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
