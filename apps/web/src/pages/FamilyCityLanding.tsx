import { Link } from "react-router-dom";

const tools = [
  { title: "Guardian Pet", detail: "Pet rescue pages, finder flow, QR recovery, and care visibility.", href: "/planet/guardian-pet" },
  { title: "Guardian Household", detail: "Family and household safety board for people, pets, and daily trust.", href: "/planet/guardian-household" },
  { title: "Care Timeline", detail: "Timeline-style layer for family moments, care checks, and updates.", href: "/planet/guardian-pet/timeline" },
];

export default function FamilyCityLanding() {
  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <Link to="/city" className="text-sm font-bold text-emerald-200/80 hover:text-emerald-100">? Back to Cities</Link>
        <div className="mt-8 rounded-[34px] border border-emerald-400/15 bg-white/[0.04] p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-emerald-100/50">FAMILY CITY</div>
          <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight md:text-7xl">Family systems that keep people, pets, and care moments connected.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Family City connects Guardian tools, pet recovery, household boards, and care-style timelines into one simple place for the people and pets that matter most.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.href} className="rounded-[28px] border border-white/10 bg-[#0c1824] p-6 text-white no-underline transition hover:border-emerald-300/30 hover:bg-emerald-400/10">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100/45">LIVE TOOL</div>
              <h2 className="mt-3 text-2xl font-black">{tool.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{tool.detail}</p>
              <div className="mt-6 inline-flex rounded-full bg-emerald-300 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#071019]">Open Tool</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
