import { Rocket, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreatorLaunchSequencePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const boardSlug = query.get("boardSlug") || "starter-board";
  const businessName = query.get("businessName") || "Your Creator System";

  const redirectTo =
    (location.state as any)?.redirectTo ||
    `/planet/creator/${boardSlug}/moment`;

  const liveBoardRoute = `/planet/live/${boardSlug}`;

  return (
    <main className="min-h-screen bg-[#020817] px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-cyan-400/20 bg-[#07111f] shadow-[0_0_90px_rgba(34,211,238,0.14)]">
        <div className="p-8 text-center md:p-12">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.24em] text-cyan-100">
            <Rocket className="h-4 w-4" />
            Creator Build Launch Sequence
          </div>

          <h1 className="mt-8 text-5xl font-black tracking-tight md:text-7xl">
            Initializing your <span className="text-cyan-300">Creator City</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Turning {businessName} into a real, living business system.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["3", "Preparing Systems", "Calibrating your business blueprint"],
              ["2", "Building Infrastructure", "Deploying the operational backbone"],
              ["1", "Activating Live Board", "Bringing your system to life"],
            ].map(([num, title, detail]) => (
              <div
                key={num}
                className="rounded-[28px] border border-cyan-300/15 bg-black/20 p-7"
              >
                <div className="text-6xl font-black text-white">{num}</div>
                <div className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  {title}
                </div>
                <p className="mt-3 text-sm text-white/62">{detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-y border-cyan-300/15 py-8">
            <div className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              Launch Status
            </div>
            <div className="mt-3 text-4xl font-black">SYSTEM ONLINE</div>

            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm font-bold text-white/70">
              {["Blueprint Loaded", "Infrastructure Deployed", "Live Board Activated"].map((item) => (
                <div key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-400/15 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_35%),#030712] px-8 py-12 text-center">
          <div className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
            Your Creator City is live
          </div>

          <h2 className="mt-4 text-4xl font-black tracking-tight">
            Holy shit. You built something real.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/70">
            You didn’t just fill out a form. You built a system. Your business is now structured, connected, and ready to grow.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate(liveBoardRoute)}
              className="rounded-full bg-cyan-300 px-10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#020817] transition hover:scale-[1.02]"
            >
              Enter Your Live Board
            </button>

            <button
              onClick={() => navigate(redirectTo)}
              className="rounded-full border border-white/15 bg-white/[0.04] px-10 py-4 text-sm font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            >
              View Creator Moment
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
