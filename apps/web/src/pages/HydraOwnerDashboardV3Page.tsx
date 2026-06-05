const markers = [
  {
    name: "Treatment Plant 12A",
    type: "Asset",
    lat: 27.2434,
    lng: -80.8298,
    note: "Active project location",
  },
  {
    name: "Main Gate",
    type: "Site Access",
    lat: 27.2441,
    lng: -80.8312,
    note: "Primary crew entry",
  },
  {
    name: "Dive Entry",
    type: "Field Marker",
    lat: 27.2428,
    lng: -80.8287,
    note: "Water access point",
  },
  {
    name: "Crew Truck",
    type: "Crew Location",
    lat: 27.2199,
    lng: -80.8524,
    note: "3.2 miles away",
  },
];

function openMaps(lat: number, lng: number) {
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
}

export default function HydraOwnerDashboardV3Page() {
  const fieldMarkers = [
    { name: "North Lock", status: "Crew active", lat: "27.2431", lng: "-80.8298" },
    { name: "East Spillway", status: "Inspection pending", lat: "27.2384", lng: "-80.8212" },
    { name: "South Pump", status: "Equipment verified", lat: "27.2318", lng: "-80.8355" },
  ];

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
          Hydra Operations
        </p>

        <h1 className="mt-4 text-5xl font-black">Operations Center</h1>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-white/5 p-6">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Active Project
          </p>

          <h2 className="mt-4 text-3xl font-black">Treatment Plant 12A</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</p>
              <p className="mt-2 text-xl font-black text-cyan-300">Crew En Route</p>
            </div>

            <div className="rounded-2xl bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Lead Diver</p>
              <p className="mt-2 text-xl font-black">Xander</p>
            </div>

            <div className="rounded-2xl bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">ETA</p>
              <p className="mt-2 text-xl font-black">22 Minutes</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                Live Location Intelligence
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Crew, access points, and asset coordinates
              </h2>
            </div>

            <div className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
              Crew: 3.2 miles away
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {markers.map((marker) => (
              <button
                key={marker.name}
                onClick={() => openMaps(marker.lat, marker.lng)}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-left hover:border-cyan-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-white">{marker.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{marker.type}</p>
                  </div>

                  <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs font-black text-cyan-200">
                    Open Maps
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-300">{marker.note}</p>

                <p className="mt-3 text-xs font-bold text-slate-500">
                  {marker.lat}, {marker.lng}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                Live Field Map
              </p>
              <h2 className="mt-2 text-2xl font-black">Crew Position Awareness</h2>
            </div>
            <div className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-xs font-black text-cyan-200">
              Live
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {fieldMarkers.map((marker) => (
              <div key={marker.name} className="rounded-2xl bg-slate-950/70 p-4">
                <p className="text-sm font-black text-white">{marker.name}</p>
                <p className="mt-2 text-xs font-bold text-slate-400">{marker.status}</p>
                <p className="mt-3 text-xs font-bold text-slate-500">
                  {marker.lat}, {marker.lng}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Latest Crew Activity</h2>

            <div className="mt-5 space-y-3">
              {["Crew Assigned", "Equipment Verified", "En Route"].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-950/70 p-4 font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-black">Latest Finding</h2>

            <div className="mt-5 rounded-2xl bg-slate-950/70 p-5">
              <p className="inline-flex rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">
                Leak
              </p>

              <p className="mt-4 text-slate-200">
                Medium severity finding reported near the intake access point.
              </p>

              <p className="mt-3 text-sm font-black text-cyan-300">
                Photo attached
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
            <h2 className="text-2xl font-black">Decision Queue</h2>

            <div className="mt-5 space-y-3">
              {[
                "Approve sediment removal",
                "Approve PM88 chemical wash",
                "Schedule return dive",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-950/70 p-4 font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-green-300/20 bg-green-300/10 p-6">
            <h2 className="text-2xl font-black">Revenue Opportunity</h2>

            <div className="mt-5 rounded-2xl bg-slate-950/70 p-5">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-green-200">
                Recommended Next Work
              </p>

              <h3 className="mt-3 text-2xl font-black">PM88 Chemical Wash</h3>

              <p className="mt-3 text-slate-300">
                Inspection finding created a follow-up service opportunity.
              </p>

              <p className="mt-4 text-3xl font-black text-green-200">
                $4,200
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-black">Asset History</h2>

          <div className="mt-5 space-y-3">
            {[
              "2026 - Current inspection completed",
              "2025 - Sediment removal performed",
              "2024 - Annual inspection completed",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-950/70 p-4 font-black">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}


