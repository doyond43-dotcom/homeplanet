export default function BirdbathProductsPage() {
  const products = [
    {
      name: "Original",
      tone: "Cream / Navy",
      text: "The everyday Birdbath wipe built for trucks, travel, work, and real life.",
    },
    {
      name: "Feminine",
      tone: "Blush / Rose",
      text: "Soft, clean, purse-ready freshness for daily carry and travel.",
    },
    {
      name: "Outdoors",
      tone: "Olive / Sand",
      text: "Made for fishing trips, beach days, camping, and Florida heat.",
    },
    {
      name: "Heavy Duty",
      tone: "Charcoal / Steel",
      text: "For long shifts, sweat, dirt, grease, and hard-working days.",
    },
    {
      name: "Sensitive",
      tone: "Soft Cream",
      text: "Fragrance-free comfort for sensitive skin and daily refresh.",
    },
  ];

  const locations = [
    "Truck Console",
    "Gym Bag",
    "Beach Tote",
    "Backpack",
    "Purse",
    "Emergency Kit",
    "Tackle Box",
    "Work Truck",
  ];

  return (
    <main className="min-h-screen bg-[#f5ecd9] text-[#12233d]">
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b24c63]">
          Birdbath Products
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          Built for real life.
        </h1>

        <p className="mt-5 max-w-3xl text-lg text-[#44516a] md:text-xl">
          Birdbath wipes are designed for the moments where a shower isn’t possible —
          work, travel, fishing, gym sessions, beach days, camping trips, and everything in between.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.name}
              className="rounded-[2rem] bg-white/70 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">{product.name}</h2>
                <span className="rounded-full bg-[#12233d]/5 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#b24c63]">
                  {product.tone}
                </span>
              </div>

              <p className="mt-5 text-[#44516a]">
                {product.text}
              </p>

              <div className="mt-6 rounded-2xl border border-[#12233d]/10 bg-[#f8f2e5] p-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span>Birdbath XL</span>
                  <span>12 x 12</span>
                </div>

                <div className="mt-3 h-3 rounded-full bg-[#12233d]/10">
                  <div className="h-3 w-[85%] rounded-full bg-[#12233d]" />
                </div>

                <p className="mt-3 text-xs uppercase tracking-wide text-[#44516a]">
                  Individually wrapped • Full body clean
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b24c63]">
          Built for the real places life happens
        </p>

        <h2 className="mt-4 text-4xl font-black md:text-6xl">
          Truck. Gym. Beach. Outdoors.
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { label: "Truck", src: "/images/Birdbath-Lifestyle-Truck-V1.png" },
            { label: "Gym", src: "/images/Birdbath-Lifestyle-Gym-V1.png" },
            { label: "Beach", src: "/images/Birdbath-Lifestyle-Beach-V1.png" },
            { label: "Outdoors", src: "/images/Birdbath-Lifestyle-Outdoors-V1.png" },
          ].map((item) => (
            <div key={item.label} className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-xl">
              <img src={item.src} alt={`Birdbath lifestyle ${item.label}`} className="h-56 w-full object-cover" />
              <div className="p-4">
                <p className="font-black">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[#12233d] py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#f1c7d0]">
            Where Birdbath Lives
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-6xl">
            Keep one everywhere.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
              >
                <p className="text-lg font-black">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b24c63]">
              Why Birdbath
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-6xl">
              Thin. Portable. Ready.
            </h2>

            <p className="mt-5 text-lg text-[#44516a]">
              Birdbath was designed around one simple idea:
              create a wipe people actually want to carry every day.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Thin square profile",
                "Fits glove boxes and gym bags",
                "Easy everyday carry",
                "Full body refresh",
                "No rinse needed",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white/70 p-4 font-bold shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <img
            src="/images/Birdbath-ProductShot-Cream-FlatLay-V1.png"
            alt="Birdbath product shot"
            className="rounded-[2rem] border border-[#12233d]/10 shadow-2xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-20 text-center md:px-8">
        <div className="rounded-[2.5rem] bg-white/70 p-8 shadow-2xl md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#b24c63]">
            Early Access
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-6xl">
            Be part of the launch.
          </h2>

          <p className="mt-5 text-lg text-[#44516a]">
            Join the Birdbath early access list and follow the launch as the brand grows.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              className="rounded-full border border-[#12233d]/10 px-5 py-4"
              placeholder="Name"
            />

            <input
              className="rounded-full border border-[#12233d]/10 px-5 py-4"
              placeholder="Email"
            />

            <button className="rounded-full bg-[#12233d] px-7 py-4 font-black text-white">
              Join
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

