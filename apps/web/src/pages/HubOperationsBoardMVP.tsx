export default function HubOperationsBoardMVP() {
  const alerts = [
    {
      title: "Shuttle Delay",
      detail: "West Loop running 6 minutes behind schedule.",
      severity: "warning",
    },
    {
      title: "Pickup Verified",
      detail: "Emma successfully checked out from daycare.",
      severity: "success",
    },
  ];
  const shuttles = [
    {
      id: "SH-12",
      driver: "Marcus",
      route: "Daycare Loop A",
      passengers: 6,
      status: "En Route",
      eta: "4 min",
    },
    {
      id: "SH-07",
      driver: "Haley",
      route: "Resident West Loop",
      passengers: 4,
      status: "Arrived",
      eta: "On Site",
    },
  ];

  const daycare = [
    {
      child: "Emma",
      classroom: "Sun Room",
      status: "Checked In",
      pickup: "5:00 PM",
    },
    {
      child: "Luca",
      classroom: "Ocean Room",
      status: "Pickup Pending",
      pickup: "4:30 PM",
    },
  ];

  const maintenance = [
    {
      task: "Playground Gate",
      assigned: "Trevor",
      status: "Working",
    },
    {
      task: "Laundry Water Line",
      assigned: "Nina",
      status: "Assigned",
    },
  ];

  const workforce = [
    {
      name: "Jordan",
      role: "Shuttle Driver",
      status: "Active",
    },
    {
      name: "Sofia",
      role: "Daycare Support",
      status: "Available",
    },
  ];

  const alertStyle = (severity: string) => {
    if (severity === "success") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }

    if (severity === "warning") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-zinc-700 bg-zinc-900 text-zinc-200";
  };

  const statusStyle = (status: string) => {
    if (
      status.includes("Active") ||
      status.includes("Working") ||
      status.includes("Checked") ||
      status.includes("Arrived") ||
      status.includes("En Route")
    ) {
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    }

    if (status.includes("Pending") || status.includes("Assigned")) {
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    }

    return "bg-zinc-700 text-zinc-200 border border-zinc-600";
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-zinc-400 text-sm tracking-[0.3em] uppercase">
                Coordinated Living Ecosystem
              </p>
              <h1 className="text-3xl font-bold mt-2">The Hub</h1>
              <p className="text-zinc-400 mt-2 max-w-2xl">
                Live operations for transportation, daycare, maintenance,
                workforce coordination, and resident flow.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3">
                <div className="text-xs text-zinc-500 uppercase">
                  System Status
                </div>
                <div className="text-emerald-300 font-semibold mt-1">
                  Operational
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3">
                <div className="text-xs text-zinc-500 uppercase">
                  Active Shuttles
                </div>
                <div className="font-semibold mt-1">8</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["Shuttles", "8 Active"],
            ["Daycare", "42 Checked In"],
            ["Maintenance", "5 Open Tasks"],
            ["Workforce", "31 Active"],
            ["Alerts", "2 Pending"],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="text-zinc-500 text-xs uppercase tracking-wide">
                {title}
              </div>
              <div className="text-xl font-semibold mt-2">{value}</div>
            </div>
          ))}
        </div>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Alerts</h2>
            <div className="text-sm text-zinc-500">Operational Feed</div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`rounded-2xl border p-4 ${alertStyle(
                  alert.severity
                )}`}
              >
                <div className="font-semibold">{alert.title}</div>
                <div className="text-sm opacity-80 mt-2">
                  {alert.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Transportation Operations
              </h2>
              <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">
                Dispatch Shuttle
              </button>
            </div>

            {shuttles.map((shuttle) => (
              <div
                key={shuttle.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {shuttle.route}
                    </div>
                    <div className="text-zinc-400 text-sm mt-1">
                      Driver: {shuttle.driver}
                    </div>
                    <div className="text-zinc-400 text-sm">
                      Passengers: {shuttle.passengers}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                      shuttle.status
                    )}`}
                  >
                    {shuttle.status}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-zinc-500">ETA</span>
                  <span className="font-medium">{shuttle.eta}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Daycare Presence</h2>
              <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">
                New Check-In
              </button>
            </div>

            {daycare.map((entry) => (
              <div
                key={entry.child}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {entry.child}
                    </div>
                    <div className="text-zinc-400 text-sm mt-1">
                      {entry.classroom}
                    </div>
                    <div className="text-zinc-400 text-sm">
                      Pickup: {entry.pickup}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                      entry.status
                    )}`}
                  >
                    {entry.status}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Maintenance Operations
              </h2>
              <button className="rounded-xl bg-emerald-500 text-black px-4 py-2 text-sm font-medium">
                Create Task
              </button>
            </div>

            {maintenance.map((item) => (
              <div
                key={item.task}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{item.task}</div>
                    <div className="text-zinc-400 text-sm mt-1">
                      Assigned: {item.assigned}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Workforce Coordination
              </h2>
              <button className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">
                Assign Role
              </button>
            </div>

            {workforce.map((person) => (
              <div
                key={person.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">
                      {person.name}
                    </div>
                    <div className="text-zinc-400 text-sm mt-1">
                      {person.role}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                      person.status
                    )}`}
                  >
                    {person.status}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
