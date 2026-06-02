import { useNavigate } from "react-router-dom";

export default function CommunityPulseRainyEveningVisualPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <button
          onClick={() => navigate("/planet/community-pulse")}
          className="mb-6 text-sm text-zinc-400 hover:text-white"
        >
          ? Back to Community Pulse
        </button>

        <img
          src="/images/HomePlanet-CommunityPulse-RainyEveningAwareness-v1.png"
          alt="Community Pulse rainy evening awareness kiosk"
          className="w-full rounded-3xl border border-white/10"
        />
      </div>
    </div>
  );
}
