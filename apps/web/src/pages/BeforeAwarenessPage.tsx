import { useNavigate } from "react-router-dom";

export default function BeforeAwarenessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <button onClick={() => navigate("/planet/predictive-parking")} className="mb-6 text-sm text-zinc-400 hover:text-white">
          ? Back to Predictive Parking
        </button>

        <img
          src="/images/HomePlanet-PredictiveParking-OverflowCongestion-BeforeAwareness-v1.png"
          alt="Before awareness overflow congestion"
          className="w-full rounded-3xl border border-white/10"
        />
      </div>
    </div>
  );
}
