import React, { useMemo, useState } from "react";

type TripType = "One Way" | "Round Trip";
type RideStatus = "Waiting" | "Confirmed" | "En Route" | "Picked Up" | "Completed";

type Ride = {
  id: number;
  time: string;
  name: string;
  phone: string;
  pickup: string;
  destination: string;
  tripType: TripType;
  notes: string;
  status: RideStatus;
};

const starterRides: Ride[] = [
  {
    id: 1,
    time: "8:00 AM",
    name: "Sample Rider",
    phone: "8630000000",
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
    phone: "8630000000",
    pickup: "Home",
    destination: "Pharmacy",
    tripType: "One Way",
    notes: "Call when outside.",
    status: "Confirmed",
  },
];

export default function HomePlanetTransportationPage() {
  const [rides, setRides] = useState<Ride[]>(starterRides);
  const [openForm, setOpenForm] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(starterRides[0]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    destination: "",
    time: "",
    tripType: "One Way" as TripType,
    notes: "",
  });

  const stats = useMemo(
    () => ({
      total: rides.length,
      waiting: rides.filter((r) => r.status === "Waiting").length,
      completed: rides.filter((r) => r.status === "Completed").length,
    }),
    [rides]
  );

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
    setSelectedRide(nextRide);
    setOpenForm(false);
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

  function updateStatus(id: number, status: RideStatus) {
    setRides((current) =>
      current.map((ride) => (ride.id === id ? { ...ride, status } : ride))
    );

    setSelectedRide((current) =>
      current && current.id === id ? { ...current, status } : current
    );
  }

  return (
    <main className="min-h-screen bg-[#050805] text-white">
      <section className="mx-auto max-w-5xl px-4 py-5">
        <div className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-[#08140d] via-[#071008] to-black p-5 shadow-2xl shadow-emerald-950/30">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
            HomePlanet Transportation
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Today's Rides
          </h1>

          <p className="mt-3 text-zinc-300">
            Your paper, just organized on your phone.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
              <p className="text-xs text-zinc-400">Trips</p>
              <p className="text-2xl font-black">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-3">
              <p className="text-xs text-yellow-100/70">Waiting</p>
              <p className="text-2xl font-black text-yellow-100">{stats.waiting}</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3">
              <p className="text-xs text-emerald-100/70">Done</p>
              <p className="text-2xl font-black text-emerald-100">{stats.completed}</p>
            </div>
          </div>

          <button
            onClick={() => setOpenForm((current) => !current)}
            className="mt-5 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black"
          >
            + New Ride
          </button>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
              Driver Day Planner
            </p>

            <div className="mt-4 grid gap-3">
              {rides.map((ride) => (
                <button
                  key={ride.id}
                  onClick={() => setSelectedRide(ride)}
                  className={`w-full rounded-3xl border p-4 text-left ${
                    selectedRide?.id === ride.id
                      ? "border-emerald-400/50 bg-emerald-400/10"
                      : "border-white/10 bg-black/35"
                  }`}
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

                  <p className="mt-3 text-sm text-zinc-400">Pickup</p>
                  <p className="font-bold">{ride.pickup}</p>

                  <p className="mt-2 text-sm text-zinc-400">Destination</p>
                  <p className="font-bold">{ride.destination}</p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <a href={`tel:${ride.phone}`} className="rounded-2xl bg-white/10 px-3 py-3 text-center text-xs font-black">
                      Call
                    </a>
                    <a href={`sms:${ride.phone}`} className="rounded-2xl bg-white/10 px-3 py-3 text-center text-xs font-black">
                      Text
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ride.pickup)}`}
                      className="rounded-2xl bg-emerald-400 px-3 py-3 text-center text-xs font-black text-black"
                    >
                      Navigate
                    </a>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-4">
            {openForm && (
              <form
                onSubmit={submitRide}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  New Ride
                </p>
                <h2 className="mt-3 text-2xl font-black">Add from paper</h2>

                <div className="mt-5 grid gap-3">
                  <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Rider Name" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Phone" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={form.pickup} onChange={(e) => updateField("pickup", e.target.value)} placeholder="Pickup Address" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={form.destination} onChange={(e) => updateField("destination", e.target.value)} placeholder="Destination" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />
                  <input value={form.time} onChange={(e) => updateField("time", e.target.value)} placeholder="Pickup Time" className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />

                  <select value={form.tripType} onChange={(e) => updateField("tripType", e.target.value)} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none">
                    <option>One Way</option>
                    <option>Round Trip</option>
                  </select>

                  <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Notes" rows={4} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none" />

                  <button className="rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black">
                    Add Ride
                  </button>
                </div>
              </form>
            )}

            {selectedRide && (
              <article className="rounded-[2rem] border border-emerald-400/20 bg-black/35 p-5">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  Ride Workspace
                </p>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-black">{selectedRide.name}</h2>
                    <p className="mt-1 text-zinc-400">{selectedRide.time}</p>
                  </div>
                  <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-black text-yellow-100">
                    {selectedRide.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <p className="text-sm text-zinc-400">Pickup</p>
                    <p className="text-lg font-bold">{selectedRide.pickup}</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <p className="text-sm text-zinc-400">Destination</p>
                    <p className="text-lg font-bold">{selectedRide.destination}</p>
                  </div>
                  <div className="rounded-2xl bg-white/[0.05] p-4">
                    <p className="text-sm text-zinc-400">Trip</p>
                    <p className="text-lg font-bold">{selectedRide.tripType}</p>
                  </div>
                  {selectedRide.notes && (
                    <div className="rounded-2xl bg-white/[0.05] p-4">
                      <p className="text-sm text-zinc-400">Notes</p>
                      <p className="text-lg font-bold">{selectedRide.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <a href={`tel:${selectedRide.phone}`} className="rounded-2xl bg-white/10 px-3 py-4 text-center text-xs font-black">
                    Call
                  </a>
                  <a href={`sms:${selectedRide.phone}`} className="rounded-2xl bg-white/10 px-3 py-4 text-center text-xs font-black">
                    Text
                  </a>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRide.pickup)}`} className="rounded-2xl bg-emerald-400 px-3 py-4 text-center text-xs font-black text-black">
                    Navigate
                  </a>
                </div>

                <div className="mt-5 grid gap-2">
                  <button onClick={() => updateStatus(selectedRide.id, "En Route")} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black">
                    Driver En Route
                  </button>
                  <button onClick={() => updateStatus(selectedRide.id, "Picked Up")} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-black">
                    Passenger Picked Up
                  </button>
                  <button onClick={() => updateStatus(selectedRide.id, "Completed")} className="rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-black">
                    Complete Ride
                  </button>
                </div>
              </article>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
