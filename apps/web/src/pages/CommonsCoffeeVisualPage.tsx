import { useNavigate } from "react-router-dom";

export default function CommonsCoffeeVisualPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <button
          onClick={() => navigate("/planet/commons-coffee")}
          className="mb-6 text-left text-sm text-zinc-400 transition hover:text-white"
        >
          ← Back to Commons Coffee
        </button>

        <img
          src="/images/HomePlanet-CommonsCoffee-ReasonsToShowUp-Evening-v1.png"
          alt="Commons Coffee gathering anchor concept"
          className="w-full rounded-3xl border border-white/10"
        />
      </div>
    </div>
  );
}