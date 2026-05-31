import { useNavigate } from "react-router-dom";

export default function PredictiveParkingPage() {
  const navigate = useNavigate();

  const items = [
    "Arrival Awareness",
    "Parking Guidance",
    "Reduced Confusion",
    "Less Circling",
    "Calmer Movement",
    "Better Circulation",
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 md:px-6">
        <button onClick={() => navigate("/planet/atlas")} className="mb-6 text-left text-sm text-zinc-400 transition hover:text-white">
          ? Back to Atlas
        </button>

        <div className="flex-1 rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-blue-400">Awareness Layer</div>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Predictive Parking</h1>

          <p className="mt-4 max-w-4xl text-lg text-zinc-400">
            Parking becomes part of circulation. The environment helps people move before confusion, congestion, and stress build up.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {items.map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-black/40 p-6">
                <div className="text-lg font-medium text-white">{item}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => navigate("/planet/before-awareness")} className="rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
              View Before Awareness
            </button>

            <button onClick={() => navigate("/planet/after-awareness")} className="rounded-2xl border border-white/10 bg-blue-400 px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]">
              View After Awareness
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
