import { useMemo, useState } from "react";

type ShuttleStatus = "Waiting" | "En Route" | "Arrived" | "Pickup Complete" | "Delayed";
type DaycareStatus = "Checked In" | "Classroom Active" | "Lunch" | "Pickup Pending" | "Checked Out";
type MaintenanceStatus = "Reported" | "Assigned" | "Working" | "Completed";
type WorkforceStatus = "Available" | "Assigned" | "Active" | "Completed";
type AlertSeverity = "success" | "warning" | "info";

type Alert = {
  title: string;
  detail: string;
  severity: AlertSeverity;
  time: string;
};

type Shuttle = {
  id: string;
  driver: string;
  route: string;
  passengers: number;
  status: ShuttleStatus;
  eta: string;
  linkedChild?: string;
};

type DaycareEntry = {
  child: string;
  classroom: string;
  status: DaycareStatus;
  pickup: string;
  shuttle: string;
};

type MaintenanceTask = {
  task: string;
  assigned: string;
  status: MaintenanceStatus;
};

type WorkforcePerson = {
  name: string;
  role: string;
  status: WorkforceStatus;
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function HubOperationsBoardMVP() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      title: "Shuttle Delay",
      detail: "West Loop running 6 minutes behind schedule.",
      severity: "warning",
      time: "4:18 PM",
    },
    {
      title: "Pickup Verified",
      detail: "Emma successfully checked out from daycare.",
      severity: "success",
      time: "4:12 PM",
    },
  ]);

  const [shuttles, setShuttles] = useState<Shuttle[]>([
    {
      id: "SH-12",
      driver: "Marcus",
      route: "Daycare Loop A",
      passengers: 6,
      status: "En Route",
      eta: "4 min",
      linkedChild: "Luca",
    },
    {
      id: "SH-07",
      driver: "Haley",
      route: "Resident West Loop",
      passengers: 4,
      status: "Arrived",
      eta: "On Site",
      linkedChild: "Emma",
    },
  ]);

  const [daycare, setDaycare] = useState<DaycareEntry[]>([
    {
      child: "Emma",
      classroom: "Sun Room",
      status: "Checked In",
      pickup: "5:00 PM",
      shuttle: "SH-07",
    },
    {
      child: "Luca",
      classroom: "Ocean Room",
      status: "Pickup Pending",
      pickup: "4:30 PM",
      shuttle: "SH-12",
    },
  ]);

  const [maintenance, setMaintenance] = useState<MaintenanceTask[]>([
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
  ]);

  const [workforce, setWorkforce] = useState<WorkforcePerson[]>([
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
  ]);

  const addAlert = (title: string, detail: string, severity: AlertSeverity = "info") => {
    setAlerts((current) => [
      { title, detail, severity, time: now() },
      ...current,
    ].slice(0, 5));
  };

  const nextShuttleStatus = (status: ShuttleStatus): ShuttleStatus => {
    if (status === "Waiting") return "En Route";
    if (status === "En Route") return "Arrived";
    if (status === "Arrived") return "Pickup Complete";
    if (status === "Delayed") return "En Route";
    return "Waiting";
  };

  const advanceShuttle = (id: string) => {
    setShuttles((current) =>
      current.map((shuttle) => {
        if (shuttle.id !== id) return shuttle;
        const next = nextShuttleStatus(shuttle.status);
        addAlert(
          `Shuttle ${next}`,
          `${shuttle.route} updated to ${next}.`,
          next === "Delayed" ? "warning" : "success"
        );
        return {
          ...shuttle,
          status: next,
          eta: next === "Arrived" || next === "Pickup Complete" ? "On Site" : "4 min",
        };
      })
    );
  };

  const delayShuttle = (id: string) => {
    setShuttles((current) =>
      current.map((shuttle) =>
        shuttle.id === id
          ? { ...shuttle, status: "Delayed", eta: "8 min" }
          : shuttle
      )
    );
    const shuttle = shuttles.find((item) => item.id === id);
    addAlert("Delay Logged", `${shuttle?.route || "Shuttle"} marked delayed.`, "warning");
  };

  const nextDaycareStatus = (status: DaycareStatus): DaycareStatus => {
    if (status === "Checked In") return "Classroom Active";
    if (status === "Classroom Active") return "Lunch";
    if (status === "Lunch") return "Pickup Pending";
    if (status === "Pickup Pending") return "Checked Out";
    return "Checked In";
  };

  const advanceDaycare = (child: string) => {
    setDaycare((current) =>
      current.map((entry) => {
        if (entry.child !== child) return entry;
        const next = nextDaycareStatus(entry.status);
        addAlert(
          next === "Checked Out" ? "Pickup Verified" : "Daycare Updated",
          `${entry.child} updated to ${next}.`,
          next === "Pickup Pending" ? "warning" : "success"
        );
        return { ...entry, status: next };
      })
    );
  };

  const nextMaintenanceStatus = (status: MaintenanceStatus): MaintenanceStatus => {
    if (status === "Reported") return "Assigned";
    if (status === "Assigned") return "Working";
    if (status === "Working") return "Completed";
    return "Reported";
  };

  const advanceMaintenance = (task: string) => {
    setMaintenance((current) =>
      current.map((item) => {
        if (item.task !== task) return item;
        const next = nextMaintenanceStatus(item.status);
        addAlert("Maintenance Updated", `${item.task} moved to ${next}.`, next === "Completed" ? "success" : "info");
        return { ...item, status: next };
      })
    );
  };

  const nextWorkforceStatus = (status: WorkforceStatus): WorkforceStatus => {
    if (status === "Available") return "Assigned";
    if (status === "Assigned") return "Active";
    if (status === "Active") return "Completed";
    return "Available";
  };

  const advanceWorkforce = (name: string) => {
    setWorkforce((current) =>
      current.map((person) => {
        if (person.name !== name) return person;
        const next = nextWorkforceStatus(person.status);
        addAlert("Workforce Updated", `${person.name} is now ${next}.`, "info");
        return { ...person, status: next };
      })
    );
  };

  const runParentFlow = () => {
    setShuttles((current) =>
      current.map((shuttle) =>
        shuttle.id === "SH-12"
          ? { ...shuttle, status: "Pickup Complete", eta: "On Site" }
          : shuttle
      )
    );

    setDaycare((current) =>
      current.map((entry) =>
        entry.child === "Luca"
          ? { ...entry, status: "Checked Out" }
          : entry
      )
    );

    addAlert(
      "Parent Flow Complete",
      "Luca pickup verified, shuttle route updated, parent notified.",
      "success"
    );
  };

  const snapshot = useMemo(() => {
    return {
      activeShuttles: shuttles.filter((item) => item.status !== "Waiting").length,
      daycareActive: daycare.filter((item) => item.status !== "Checked Out").length,
      maintenanceOpen: maintenance.filter((item) => item.status !== "Completed").length,
      workforceActive: workforce.filter((item) => item.status === "Active" || item.status === "Assigned").length,
      alerts: alerts.length,
    };
  }, [alerts.length, daycare, maintenance, shuttles, workforce]);

  const alertStyle = (severity: string) => {
    if (severity === "success") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }

    if (severity === "warning") {
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    }

    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  };

  const statusStyle = (status: string) => {
    if (
      status.includes("Active") ||
      status.includes("Working") ||
      status.includes("Checked") ||
      status.includes("Arrived") ||
      status.includes("En Route") ||
      status.includes("Complete")
    ) {
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    }

    if (status.includes("Pending") || status.includes("Assigned") || status.includes("Delayed")) {
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    }

    return "bg-zinc-700 text-zinc-200 border border-zinc-600";
  };

  const ActionButton = ({ children, onClick, tone = "light" }: { children: React.ReactNode; onClick: () => void; tone?: "light" | "green" | "amber" }) => {
    const styles =
      tone === "green"
        ? "bg-emerald-500 text-black"
        : tone === "amber"
        ? "bg-amber-400 text-black"
        : "bg-white text-black";

    return (
      <button onClick={onClick} className={`rounded-xl px-3 py-2 text-xs font-semibold ${styles}`}>
        {children}
      </button>
    );
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
                <div className="text-xs text-zinc-500 uppercase">System Status</div>
                <div className="text-emerald-300 font-semibold mt-1">Operational</div>
              </div>

              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3">
                <div className="text-xs text-zinc-500 uppercase">Live Time</div>
                <div className="font-semibold mt-1">{now()}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <ActionButton onClick={runParentFlow} tone="green">
              Run Parent + Shuttle Flow
            </ActionButton>
            <ActionButton onClick={() => addAlert("Manual Check", "Hub operator confirmed all systems visible.", "info")}>
              Add Operator Note
            </ActionButton>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["Shuttles", `${snapshot.activeShuttles} Active`],
            ["Daycare", `${snapshot.daycareActive} Active`],
            ["Maintenance", `${snapshot.maintenanceOpen} Open Tasks`],
            ["Workforce", `${snapshot.workforceActive} Active`],
            ["Alerts", `${snapshot.alerts} Live`],
          ].map(([title, value]) => (
            <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="text-zinc-500 text-xs uppercase tracking-wide">{title}</div>
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
            {alerts.map((alert, index) => (
              <div key={`${alert.title}-${index}`} className={`rounded-2xl border p-4 ${alertStyle(alert.severity)}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold">{alert.title}</div>
                  <div className="text-xs opacity-70">{alert.time}</div>
                </div>
                <div className="text-sm opacity-80 mt-2">{alert.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Transportation Operations</h2>
              <ActionButton onClick={() => addAlert("Shuttle Dispatched", "A new shuttle was added to the pickup queue.", "success")}>
                Dispatch Shuttle
              </ActionButton>
            </div>

            {shuttles.map((shuttle) => (
              <div key={shuttle.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{shuttle.route}</div>
                    <div className="text-zinc-400 text-sm mt-1">Driver: {shuttle.driver}</div>
                    <div className="text-zinc-400 text-sm">Passengers: {shuttle.passengers}</div>
                    {shuttle.linkedChild && <div className="text-zinc-500 text-xs mt-2">Linked daycare pickup: {shuttle.linkedChild}</div>}
                  </div>

                  <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(shuttle.status)}`}>
                    {shuttle.status}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-zinc-500">ETA</span>
                  <span className="font-medium">{shuttle.eta}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton onClick={() => advanceShuttle(shuttle.id)} tone="green">Advance</ActionButton>
                  <ActionButton onClick={() => delayShuttle(shuttle.id)} tone="amber">Delay</ActionButton>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Daycare Presence</h2>
              <ActionButton onClick={() => addAlert("New Check-In", "Daycare desk started a new child check-in.", "info")}>
                New Check-In
              </ActionButton>
            </div>

            {daycare.map((entry) => (
              <div key={entry.child} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{entry.child}</div>
                    <div className="text-zinc-400 text-sm mt-1">{entry.classroom}</div>
                    <div className="text-zinc-400 text-sm">Pickup: {entry.pickup}</div>
                    <div className="text-zinc-500 text-xs mt-2">Assigned shuttle: {entry.shuttle}</div>
                  </div>

                  <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(entry.status)}`}>
                    {entry.status}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton onClick={() => advanceDaycare(entry.child)} tone="green">Advance</ActionButton>
                  <ActionButton onClick={() => addAlert("Parent Notified", `${entry.child}'s parent received a live update.`, "success")}>
                    Notify Parent
                  </ActionButton>
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Maintenance Operations</h2>
              <ActionButton onClick={() => addAlert("Task Created", "New maintenance task added to Hub queue.", "info")} tone="green">
                Create Task
              </ActionButton>
            </div>

            {maintenance.map((item) => (
              <div key={item.task} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{item.task}</div>
                    <div className="text-zinc-400 text-sm mt-1">Assigned: {item.assigned}</div>
                  </div>

                  <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(item.status)}`}>
                    {item.status}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton onClick={() => advanceMaintenance(item.task)} tone="green">Advance</ActionButton>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Workforce Coordination</h2>
              <ActionButton onClick={() => addAlert("Role Assignment", "Hub opened the workforce assignment drawer.", "info")}>
                Assign Role
              </ActionButton>
            </div>

            {workforce.map((person) => (
              <div key={person.name} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{person.name}</div>
                    <div className="text-zinc-400 text-sm mt-1">{person.role}</div>
                  </div>

                  <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(person.status)}`}>
                    {person.status}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton onClick={() => advanceWorkforce(person.name)} tone="green">Advance</ActionButton>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

