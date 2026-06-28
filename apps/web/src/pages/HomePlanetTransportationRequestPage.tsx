import React, { useState } from "react";

export default function HomePlanetTransportationRequestPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    time: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();

    const ride = {
      id: Date.now(),
      time: form.time || "ASAP",
      name: form.name || "New Rider",
      phone: form.phone,
      pickup: form.pickup,
      destination: form.destination,
      tripType: "One Way",
      notes: form.notes,
      status: "Waiting",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("hp_transportation_requests") || "[]");
    localStorage.setItem("hp_transportation_requests", JSON.stringify([ride, ...existing]));

    setSent(true);
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-[#050805] px-4 py-10 text-white">
        <section className="mx-auto max-w-md rounded-[2rem] border border-emerald-400/20 bg-white/[0.04] p-6 text-center">
          <p className="text-5xl">?</p>
          <h1 className="mt-4 text-3xl font-black">Ride Request Sent</h1>
          <p className="mt-3 text-zinc-300">
            Sherry will call or text you shortly.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050805] px-4 py-6 text-white">
      <section className="mx-auto max-w-md">
        <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-[#08140d] via-[#071008] to-black p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
            Local Ride Request
          </p>
          <h1 className="mt-4 text-4xl font-black">Need a ride?</h1>
          <p className="mt-3 text-zinc-300">
            Tell Sherry where you are and where you need to go.
          </p>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
          <input value={form.pickup} onChange={(e) => update("pickup", e.target.value)} placeholder="Pickup location" autoComplete="street-address" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none" />
          <input value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="Where are you going?" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none" />
          <input value={form.time} onChange={(e) => update("time", e.target.value)} placeholder="When do you need the ride?" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none" />
          <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" autoComplete="name" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none" />
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone number" autoComplete="tel" inputMode="tel" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none" />
          <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything Sherry should know? Optional" rows={3} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 outline-none" />

          <button className="rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black">
            Request Ride
          </button>
        </form>
      </section>
    </main>
  );
}

