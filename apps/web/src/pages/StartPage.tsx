import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between px-4 py-6">

      {/* HEADER */}
      <div className="w-full max-w-md text-center mt-6">
        <h1 className="text-3xl font-bold tracking-tight">
          HomePlanet
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Presence-first. Real systems. No dead ends.
        </p>
      </div>

      {/* ACTION GRID */}
      <div className="w-full max-w-md flex flex-col gap-4 mt-10">

        {/* PRIMARY ACTION */}
        <button
          onClick={() => navigate("/planet/creator")}
          className="w-full bg-white text-black font-semibold py-4 rounded-2xl text-lg active:scale-[0.98]"
        >
          Launch Creator City
        </button>

        {/* START BUILD */}
        <button
          onClick={() => navigate("/planet/creator/start")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98]"
        >
          Start a Business Board
        </button>

        {/* LIVE DEMO */}
        <button
          onClick={() => navigate("/planet/live/peggies-diner")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98]"
        >
          View Live Boards
        </button>

        {/* GUARDIAN / PET */}
        <button
          onClick={() => navigate("/planet/guardian-pet")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98]"
        >
          Pet / Guardian Demo
        </button>

        {/* PAYMENTS */}
        <button
          onClick={() => navigate("/planet/payments/no-screenshot")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98]"
        >
          Payments Demo
        </button>

      </div>

      {/* FOOTER */}
      <div className="text-xs text-gray-600 text-center mb-4">
        No accounts. No tracking. Just real systems.
      </div>

    </div>
  );
}