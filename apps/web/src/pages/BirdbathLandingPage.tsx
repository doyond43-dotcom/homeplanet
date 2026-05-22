export default function BirdbathLandingPage() {
  const useCases = ["Truck", "Gym", "Camp", "Work", "Travel", "Fishing", "Beach", "Emergency Kits"];

  const products = [
    { name: "Original", tone: "Cream / Navy", text: "The everyday full-body wipe for real life." },
    { name: "Feminine", tone: "Blush / Rose", text: "Soft, clean, purse-ready freshness." },
    { name: "Outdoors", tone: "Olive / Sand", text: "Built for camping, fishing, boats, and heat." },
    { name: "Heavy Duty", tone: "Charcoal / Steel", text: "For work crews, long shifts, and messy days." },
  ];

  return (
    <main className="min-h-screen bg-[#f5ecd9] text-[#12233d]">
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-2 md:items-center md:px-8 md:py-14">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.35em] text-[#b24c63]">Coming Soon</p>
          <h1 className="text-6xl font-black tracking-tight md:text-8xl">BIRDBATH</h1>
          <p className="mt-4 text-2xl font-bold">When a shower isn’t an option.</p>
          <p className="mt-4 max-w-xl text-lg text-[#44516a]">Extra-large full-body cleansing wipes made for trucks, gyms, travel, work, boats, beach days, and real life.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#waitlist" className="rounded-full bg-[#12233d] px-6 py-3 text-sm font-black uppercase tracking-wide text-white">Join Early Access</a>
            <a href="#product" className="rounded-full border border-[#12233d]/20 bg-white/50 px-6 py-3 text-sm font-black uppercase tracking-wide">See Product</a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#12233d]/10 bg-white/40 p-3 shadow-2xl">
          <img
            src="/images/Birdbath-Hero-TruckConsole-V1.png"
            alt="Birdbath wipe pack in a truck console"
            className="h-full w-full rounded-[1.5rem] object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="rounded-[2rem] bg-[#12233d] p-6 text-white md:p-10">
          <h2 className="text-3xl font-black md:text-5xl">Feel human again. Anywhere.</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {useCases.map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <img
            src="/images/Birdbath-ProductShot-Cream-FlatLay-V1.png"
            alt="Birdbath product flat lay"
            className="rounded-[2rem] border border-[#12233d]/10 shadow-xl"
          />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#b24c63]">The Core Product</p>
            <h2 className="mt-3 text-4xl font-black md:text-6xl">Thin. Square. Ready.</h2>
            <p className="mt-4 text-lg text-[#44516a]">A 12x12 extra-large wipe in a thin, individually wrapped pack. Easy to keep in a truck, purse, gym bag, backpack, boat, or emergency kit.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["XL 12x12 wipe", "No rinse needed", "Individually wrapped", "Full body clean"].map((item) => (
                <div key={item} className="rounded-2xl bg-white/60 p-4 font-bold shadow-sm">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <h2 className="text-4xl font-black md:text-5xl">Product Lineup</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {products.map((product) => (
            <div key={product.name} className="rounded-[1.5rem] bg-white/60 p-5 shadow-sm">
              <h3 className="text-2xl font-black">{product.name}</h3>
              <p className="mt-1 text-sm font-bold text-[#b24c63]">{product.tone}</p>
              <p className="mt-4 text-sm text-[#44516a]">{product.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-10 md:grid-cols-2 md:px-8">
        <img src="/images/Birdbath-Hero-Purse-Feminine-V1.png" alt="Birdbath feminine purse hero" className="rounded-[2rem] shadow-xl" />
        <img src="/images/Birdbath-Hero-GymBag-V1.png" alt="Birdbath gym bag hero" className="rounded-[2rem] shadow-xl" />
      </section>

      <section id="waitlist" className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8">
        <h2 className="text-4xl font-black md:text-6xl">Get on the early list.</h2>
        <p className="mt-4 text-lg text-[#44516a]">Birdbath is coming soon. Join early access and be first to know when it launches.</p>
        <div className="mt-8 grid gap-3 rounded-[2rem] bg-white/60 p-4 shadow-xl md:grid-cols-[1fr_1fr_auto]">
          <input className="rounded-full border border-[#12233d]/10 px-5 py-3" placeholder="Name" />
          <input className="rounded-full border border-[#12233d]/10 px-5 py-3" placeholder="Email" />
          <button className="rounded-full bg-[#12233d] px-6 py-3 font-black text-white">Join</button>
        </div>
      </section>
    </main>
  );
}
