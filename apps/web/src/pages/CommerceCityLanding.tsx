import { Link } from "react-router-dom";

const tools = [
  { title: "Lake Experience Showcase", detail: "Fishing, vacation, pontoon, outdoor tourism, booking, and memory flow.", href: "/planet/demo/lake-showcase" },
  { title: "Auto Repair Live Board", detail: "Work order flow, status updates, proof, payment, and customer trust.", href: "/planet/live/smiths-creek-auto-repair" },
  { title: "Print Shop Flow", detail: "Custom apparel ordering, artwork upload, tracking, and live customer updates.", href: "/planet/printshop" },
];

export default function CommerceCityLanding() {
  return (
    <main className="min-h-screen bg-[#071019] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <Link to="/city" className="text-sm font-bold text-amber-200/80 hover:text-amber-100">? Back to Cities</Link>
        <div className="mt-8 rounded-[34px] border border-amber-300/15 bg-white/[0.04] p-8">
          <div className="text-xs font-black uppercase tracking-[0.24em] text-amber-100/50">COMMERCE CITY</div>
          <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight md:text-7xl">Live business systems for service, orders, payments, and customer flow.</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">Commerce City is where business pages become live systems. Customers can request, book, upload, follow, pay, and stay connected without downloading another app.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.title} to={tool.href} className="rounded-[28px] border border-white/10 bg-[#0c1824] p-6 text-white no-underline transition hover:border-amber-300/30 hover:bg-amber-400/10">
              <div className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/45">LIVE SYSTEM</div>
              <h2 className="mt-3 text-2xl font-black">{tool.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">{tool.detail}</p>
              <div className="mt-6 inline-flex rounded-full bg-amber-300 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#071019]">Open System</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
