import { useNavigate } from "react-router-dom";

export default function GreenBasketBrandKitPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1110] px-5 py-6 text-white md:px-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        &larr; Back
      </button>

      <main className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[2rem] border border-lime-400/20 bg-black shadow-2xl shadow-black/50">
          <img
            src="/images/greenbasket-brand-direction-board.png"
            alt="GreenBasket brand direction board"
            className="h-auto w-full object-contain"
          />
        </section>
      </main>
    </div>
  );
}
