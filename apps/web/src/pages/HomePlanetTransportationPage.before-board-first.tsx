import React, { useMemo, useState } from "react";

type TripType = "One Way" | "Round Trip";

type Ride = {
  id: number;
  time: string;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  tripType: TripType;
  notes: string;
  status: "Waiting" | "Confirmed" | "En Route" | "Picked Up" | "Completed";
};

const starterRides: Ride[] = [
  {
    id: 1,
    time: "8:00 AM",
    name: "Sample Rider",
    phone: "863-000-0000",
    pickup: "Okeechobee Walmart",
    destination: "Doctor Appointment",
    tripType: "Round Trip",
    notes: "Needs a ride back after appointment.",
    status: "Waiting",
  },
  {
    id: 2,
    time: "10:30 AM",
    name: "Sample Customer",
    phone: "863-000-0000",
    pickup: "Home",
    destination: "Pharmacy",
    tripType: "One Way",
    notes: "Call when outside.",
    status: "Confirmed",
  },
];

export default function HomePlanetTransportationPage() {
  const [rides, setRides] = useState<Ride[]>(starterRides);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    time: "",
    tripType: "One Way" as TripType,
    notes: "",
  });

  const todayStats = useMemo(() => {
    return {
      total: rides.length,
      waiting: rides.filter((r) => r.status === "Waiting").length,
      completed: rides.filter((r) => r.status === "Completed").length,
    };
  }, [rides]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitRide(e: React.FormEvent) {
    e.preventDefault();

    const nextRide: Ride = {
      id: Date.now(),
      time: form.time || "Time not set",
      name: form.name || "New Rider",
      phone: form.phone || "",
      pickup: form.pickup || "Pickup not entered",
      destination: form.destination || "Destination not entered",
      tripType: form.tripType,
      notes: form.notes,
      status: "Waiting",
    };

    setRides((current) => [nextRide, ...current]);
    setForm({
      name: "",
      phone: "",
      pickup: "",
      destination: "",
      time: "",
      tripType: "One Way",
      notes: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#050805] text-white">
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-[#08140d] via-[#071008] to-black p-5 shadow-2xl shadow-emerald-950/30">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
            HomePlanet Transportation
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
            Need a ride?
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            Local ride requests organized from calls, texts, Facebook messages,
            and real conversations.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a
              href="tel:8630000000"
              className="rounded-2xl bg-emerald-400 px-5 py-4 text-center text-sm font-black text-black"
            >
              Call Driver
            </a>
            <a
              href="sms:8630000000"
              className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-4 text-center text-sm font-black text-emerald-100"
            >
              Text Driver
            </a>
            <a
              href="#request"
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center text-sm font-black text-white"
            >
              Request Ride
            </a>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-sm text-zinc-400">Today's Trips</p>
            <p className="mt-1 text-3xl font-black">{todayStats.total}</p>
          </div>
          <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-4">
            <p className="text-sm text-yellow-100/70">Waiting</p>
            <p className="mt-1 text-3xl font-black text-yellow-100">
              {todayStats.waiting}
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-sm text-emerald-100/70">Completed</p>
            <p className="mt-1 text-3xl font-black text-emerald-100">
              {todayStats.completed}
            </p>
          </div>
        </div>

        <section id="request" className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <form
            onSubmit={submitRide}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              New Ride Request
            </p>
            <h2 className="mt-3 text-2xl font-black">Add a ride</h2>

            <div className="mt-5 grid gap-3">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Rider Name"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Phone"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
              <input
                value={form.pickup}
                onChange={(e) => updateField("pickup", e.target.value)}
                placeholder="Pickup Address"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
              <input
                value={form.destination}
                onChange={(e) => updateField("destination", e.target.value)}
                placeholder="Destination"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />
              <input
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                placeholder="Pickup Time"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />

              <select
                value={form.tripType}
                onChange={(e) => updateField("tripType", e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              >
                <option>One Way</option>
                <option>Round Trip</option>
              </select>

              <textarea
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Notes"
                rows={4}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none"
              />

              <button className="rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black">
                Add Ride To Board
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              Operator Board
            </p>
            <h2 className="mt-3 text-2xl font-black">Today's Rides</h2>

            <div className="mt-5 grid gap-4">
              {rides.map((ride) => (
                <article
                  key={ride.id}
                  className="rounded-3xl border border-white/10 bg-black/35 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-2xl font-black">{ride.time}</p>
                      <p className="mt-1 text-lg font-bold">{ride.name}</p>
                    </div>
                    <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-black text-yellow-100">
                      {ride.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <p className="text-zinc-400">Pickup</p>
                      <p className="font-bold">{ride.pickup}</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <p className="text-zinc-400">Destination</p>
                      <p className="font-bold">{ride.destination}</p>
                    </div>
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <p className="text-zinc-400">Trip</p>
                      <p className="font-bold">{ride.tripType}</p>
                    </div>
                    {ride.notes && (
                      <div className="rounded-2xl bg-white/[0.04] p-3">
                        <p className="text-zinc-400">Notes</p>
                        <p className="font-bold">{ride.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${ride.phone}`}
                      className="rounded-2xl bg-white/10 px-3 py-3 text-center text-xs font-black"
                    >
                      Call
                    </a>
                    <a
                      href={`sms:${ride.phone}`}
                      className="rounded-2xl bg-white/10 px-3 py-3 text-center text-xs font-black"
                    >
                      Text
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        ride.pickup
                      )}`}
                      className="rounded-2xl bg-emerald-400 px-3 py-3 text-center text-xs font-black text-black"
                    >
                      Navigate
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
