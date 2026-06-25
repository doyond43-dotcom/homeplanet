import { useState } from "react";

const needOptions = [
  "Live Page",
  "Booking",
  "Payments",
  "Photo Gallery",
  "Customer Requests",
  "Live Updates",
  "Not Sure Yet",
];

export default function GetBusinessLivePage() {
  const [businessName, setBusinessName] = useState("");
  const [yourName, setYourName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  const toggleNeed = (need: string) => {
    setSelectedNeeds((current) =>
      current.includes(need) ? current.filter((item) => item !== need) : [...current, need]
    );
  };

  const body = encodeURIComponent(
    `Get Your Business Live Request

Business Name: ${businessName}
Your Name: ${yourName}
Phone: ${phone}
Business Type: ${businessType}

Needs:
${selectedNeeds.length ? selectedNeeds.join(", ") : "Not selected yet"}`
  );

  return (
    <main className="min-h-screen bg-black px-5 py-8 text-white">
      <section className="mx-auto max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">HomePlanet</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">Get Your Business Live</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Simple live pages for local businesses. Booking, payments, photos, customer requests, and real-time updates.
        </p>

        <div className="mt-8 rounded-3xl border border-white/15 bg-zinc-950 p-5">
          <div className="grid gap-3">
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business name" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
            <input value={yourName} onChange={(e) => setYourName(e.target.value)} placeholder="Your name" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
            <input value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Business type" className="rounded-2xl border border-white/10 bg-black px-4 py-4 text-sm outline-none" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/45">What do you need?</p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {needOptions.map((need) => {
              const active = selectedNeeds.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  onClick={() => toggleNeed(need)}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    active ? "bg-emerald-500 text-black" : "border border-white/10 bg-white/5 text-white"
                  }`}
                >
                  {need}
                </button>
              );
            })}
          </div>

          <a
            href={`mailto:dannyscandys@gmail.com?subject=${encodeURIComponent("Get Your Business Live Request")}&body=${body}`}
            className="mt-6 flex w-full items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-black text-black"
          >
            Send Request
          </a>
        </div>
      </section>
    </main>
  );
}
