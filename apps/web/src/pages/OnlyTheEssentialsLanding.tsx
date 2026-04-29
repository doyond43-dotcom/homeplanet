import { useNavigate } from "react-router-dom";

export default function OnlyTheEssentialsLanding() {
  const navigate = useNavigate();

  function go(type: "book" | "question" | "reschedule" | "notes") {
    navigate(`/planet/only-the-essentials/request?type=${type}`);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl text-center mt-6">
        <div className="text-xs uppercase tracking-[0.28em] text-rose-300/80">
          Only The Essentials
        </div>

        <h1 className="text-3xl font-bold tracking-tight mt-3">
          Cleaning that keeps life moving.

        <div className="mt-5 flex justify-center">
          
        </div>
        </h1>

        <p className="text-sm text-gray-400 mt-3 leading-6">
          Book, ask a question, reschedule, or leave job notes. Your request goes
          straight into the live organizer board so nothing gets lost.
        </p>
      </div>

      <div className="w-full max-w-xl mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
        Simple, reliable cleaning help for the things that actually need done.
        No app confusion. No back and forth.
      </div>

      <div className="w-full max-w-xl flex flex-col gap-4 mt-6">
        <button
          onClick={() => go("book")}
          className="w-full bg-white text-black font-semibold py-4 rounded-2xl text-lg active:scale-[0.98] shadow-[0_0_0_1px_rgba(244,114,182,0.25),0_8px_30px_rgba(244,114,182,0.15)]"
        >
          Book a Cleaning
        </button>

        <button
          onClick={() => go("question")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-400/5"
        >
          Ask a Question
        </button>

        <button
          onClick={() => go("reschedule")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-400/5"
        >
          Reschedule / Update
        </button>

        <button
          onClick={() => go("notes")}
          className="w-full border border-gray-700 py-4 rounded-2xl text-lg active:scale-[0.98] hover:border-rose-400/40 hover:bg-rose-400/5"
        >
          Leave Job Notes
        </button>
      </div>

      <div className="w-full max-w-xl mt-8 grid grid-cols-1 gap-3 text-sm text-gray-400">
        <div className="rounded-2xl border border-gray-800 p-4">
          House cleaning, touch-ups, reminders, supplies, notes, and schedule changes in one place.
        </div>
        <div className="rounded-2xl border border-gray-800 p-4">
          Built for real work, not corporate fluff.
        </div>
      </div>

      <div className="text-xs text-gray-600 text-center mt-10">
        No apps. No confusion. Just real work.
      </div>
    </div>
  );
}





