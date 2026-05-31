import { useNavigate } from "react-router-dom";

export default function EcosystemAtlasPage() {
  const navigate = useNavigate();

  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: { label: string; path: string }[];
  }) => (
    <section className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>

      <div className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-left text-zinc-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">

        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            HomePlanet
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Ecosystem Atlas
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Simple navigation through the ecosystem.
          </p>
        </div>

        <div className="space-y-6">

          <Section
            title="Infrastructure / Identity Pages"
            items={[
              { label: "GreenBasket", path: "/planet/greenbasket" },
              { label: "WingIt", path: "/planet/wingit" },
              { label: "Delaney's Gym", path: "/planet/delaneys-gym" },
              { label: "Garrett's Laundromat", path: "/planet/garretts-laundromat" },
              { label: "Commons Coffee", path: "/planet/commons-coffee" },
            ]}
          />

          <Section
            title="Philosophy Pieces"
            items={[
              { label: "Community Pulse", path: "/planet/community-pulse" },
              { label: "Reasons To Show Up", path: "/planet/reasons-to-show-up" },
              { label: "Human Circulation", path: "/planet/human-circulation" },
            ]}
          />

          <Section
            title="Awareness Layer"
            items={[
              { label: "Awareness Layer", path: "/planet/awareness-layer" },
              
            ]}
          />

        </div>
      </div>
    </div>
  );
}

