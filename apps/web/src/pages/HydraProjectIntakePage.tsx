import { Link, useSearchParams } from "react-router-dom";

const issues = ["Inspection", "Sediment Removal", "Leak Detection", "Structural Repair", "Mixer Installation", "Chemical Wash", "Emergency Response"];

export default function HydraProjectIntakePage() {
  const [searchParams] = useSearchParams();
  const selectedAsset = searchParams.get("asset") || "Not selected";
  const selectedPriority = searchParams.get("priority") || "";

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link to="/planet/hydra/assets" className="text-sm text-cyan-300">? Asset Selector</Link>
        <h1 className="mt-6 text-5xl font-black">Project Intake</h1>
        <p className="mt-3 text-slate-300">A faster way for municipalities, plants, and utility teams to submit real infrastructure needs.</p>

        <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Request For</p>
          <div className="mt-2 text-3xl font-black">{selectedAsset}</div>
          <p className="mt-2 text-sm text-slate-300">This project request will stay attached to the selected infrastructure asset.</p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {["Company Name", "Contact Name", "Phone", "Email", "Facility Location"].map((label) => (
              <label key={label} className="grid gap-2 text-sm font-bold text-slate-300">
                {label}
                <input className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder={label} />
              </label>
            ))}

            <label className="grid gap-2 text-sm font-bold text-slate-300">
              Asset Type
              <input className="rounded-2xl border border-cyan-300/30 bg-slate-950 px-4 py-3 text-cyan-100 outline-none" value={selectedAsset} readOnly />
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-slate-300">Issue Type</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {issues.map((issue) => (
                <button key={issue} className="rounded-2xl border border-white/10 bg-slate-950 p-3 text-left font-bold hover:border-cyan-300">
                  {issue}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {["Normal", "Urgent", "Emergency"].map((p) => (
              <button key={p} className={`rounded-2xl border p-4 font-black hover:border-cyan-300 ${selectedPriority === p ? "border-red-300 bg-red-400/20 text-red-100" : "border-white/10 bg-slate-950"}`}>
                {p}
              </button>
            ))}
          </div>

          <label className="mt-5 grid gap-2 text-sm font-bold text-slate-300">
            Notes
            <textarea className="min-h-32 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none" placeholder="Describe the issue, access points, urgency, or known conditions." />
          </label>

          <div className="mt-5 rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-300/5 p-6 text-center">
            Photo Upload Placeholder
          </div>

          <Link to={`/planet/hydra/report?asset=${encodeURIComponent(selectedAsset)}`} className="mt-6 inline-flex rounded-full bg-cyan-300 px-7 py-3 font-black text-slate-950">
            Submit Project HYD-2026-001
          </Link>
        </div>
      </div>
    </main>
  );
}
