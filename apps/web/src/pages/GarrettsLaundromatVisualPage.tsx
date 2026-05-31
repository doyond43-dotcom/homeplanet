import { useNavigate } from "react-router-dom";

export default function GarrettsLaundromatVisualPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <button
          onClick={() => navigate("/planet/garretts-laundromat")}
          className="mb-6 text-left text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to Garrett&apos;s Laundromat
        </button>

        <img
          src="/images/HomePlanet-GarrettsLaundromat-ServiceInfrastructure-Evening-v1.png"
          alt="Garrett&apos;s Laundromat service infrastructure concept"
          className="w-full rounded-3xl border border-white/10"
        />
      </div>
    </div>
  );
}