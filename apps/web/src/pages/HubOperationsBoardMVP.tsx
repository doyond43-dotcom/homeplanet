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

type TimelineEvent = {
  id: string;
  time: string;
  title: string;
  detail: string;
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function HubOperationsBoardMVP() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: "TL-1",
      time: "4:12 PM",
      title: "Daycare Check-In",
      detail: "Emma checked into Sun Room.",
    },
    {
      id: "TL-2",
      time: "4:18 PM",
      title: "Shuttle Route Started",
      detail: "SH-12 started Daycare Loop A.",
    },
  ]);

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

  const addTimelineEvent = (title: string, detail: string) => {
    setTimeline((current) => [
      {
        id: crypto.randomUUID(),
        time: now(),
        title,
        detail,
      },
      ...current,
    ].slice(0, 8));
  };

  const addAlert = (title: string, detail: string, severity: AlertSeverity = "info") => {
    addTimelineEvent(title, detail);

    setAlerts((current) => [
      { title, detail, severity, time: now() },
      ...current,
    ].slice(0, 5));
  };

  const createMaintenanceTask = () => {
    const nextNumber = maintenance.length + 1;
    const task = `Resident Service Request ${nextNumber}`;

    setMaintenance((current) => [
      {
        task,
        assigned: "Hub Queue",
        status: "Reported",
      },
      ...current,
    ]);

    addAlert("Task Created", `${task} added to maintenance queue.`, "info");
  };

  const assignWorkforceRole = () => {
    const nextNumber = workforce.length + 1;
    const name = `Team Member ${nextNumber}`;

    setWorkforce((current) => [
      {
        name,
        role: "Floating Support",
        status: "Assigned",
      },
      ...current,
    ]);

    addAlert("Role Assigned", `${name} assigned to Floating Support.`, "success");
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

    addAlert(
      "Delay Logged",
      `${shuttle?.route || "Shuttle"} marked delayed.`,
      "warning"
    );
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

        addAlert(
          "Maintenance Updated",
          `${item.task} moved to ${next}.`,
          next === "Completed" ? "success" : "info"
        );

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

        addAlert(
          "Workforce Updated",
          `${person.name} is now ${next}.`,
          "info"
        );

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
      workforceActive: workforce.filter(
        (item) => item.status === "Active" || item.status === "Assigned"
      ).length,
      alerts: alerts.length,
    };
  }, [alerts.length, daycare, maintenance, shuttles, workforce]);

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

    if (
      status.includes("Pending") ||
      status.includes("Assigned") ||
      status.includes("Delayed")
    ) {
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    }

    return "bg-zinc-700 text-zinc-200 border border-zinc-600";
  };

  const ActionButton = ({
    children,
    onClick,
    tone = "light",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    tone?: "light" | "green" | "amber";
  }) => {
    const styles =
      tone === "green"
        ? "bg-emerald-400 text-black"
        : tone === "amber"
        ? "bg-amber-400 text-black"
        : "bg-white text-black";

    return (
      <button
        onClick={onClick}
        className={`rounded-xl px-3 py-2 text-xs font-black transition hover:opacity-90 ${styles}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        <section className="overflow-hidden rounded-[36px] border border-zinc-800 bg-zinc-950">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

            <div className="border-b border-zinc-800 p-8 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-300">
                Hub Operations
              </div>

              <h1 className="mt-8 text-5xl md:text-6xl font-black leading-none tracking-tight">
                The ecosystem nervous system.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
                The Hub watches transportation, daycare, maintenance,
                workforce, alerts, and resident circulation as one
                connected operational system.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <ActionButton onClick={runParentFlow} tone="green">
                  Run Parent + Shuttle Flow
                </ActionButton>

                <ActionButton
                  onClick={() =>
                    addAlert(
                      "Operator Note",
                      "Hub operator confirmed ecosystem visibility.",
                      "info"
                    )
                  }
                >
                  Add Operator Note
                </ActionButton>
              </div>
            </div>

            <div className="relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_40%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_35%)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                      Live Flow Chain
                    </div>

                    <h2 className="mt-3 text-4xl font-black leading-tight">
                      One connected operational flow.
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                      Operational
                    </div>
                    <div className="mt-1 text-xl font-black">{now()}</div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {[
                    ["Transport", `${snapshot.activeShuttles} live`],
                    ["Daycare", `${snapshot.daycareActive} present`],
                    ["Maintenance", `${snapshot.maintenanceOpen} open`],
                    ["Workforce", `${snapshot.workforceActive} active`],
                    ["Alerts", `${snapshot.alerts} live`],
                  ].map(([title, value]) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-zinc-800 bg-black/40 p-4"
                    >
                      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                        {title}
                      </div>

                      <div className="mt-2 text-2xl font-black">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 grid-cols-2">
                  {[
                    {
                      title: "Parent Pickup",
                      detail:
                        "Child, shuttle, parent, and driver movement stay connected.",
                    },
                    {
                      title: "Workforce",
                      detail:
                        "Staff can shift dynamically into support and circulation roles.",
                    },
                    {
                      title: "Maintenance",
                      detail:
                        "Resident issues become visible operational work instantly.",
                    },
                    {
                      title: "Truth Chain",
                      detail:
                        "Every movement creates a timestamped operational record.",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-zinc-800 bg-black/35 p-5"
                    >
                      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                        System Layer
                      </div>

                      <div className="mt-3 text-2xl font-black">
                        {item.title}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-zinc-400">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Live Ecosystem Timeline
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Real operational movement happening across the ecosystem.
                </p>
              </div>

              <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Presence Log
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{event.title}</div>

                      <div className="mt-1 text-sm text-zinc-400">
                        {event.detail}
                      </div>
                    </div>

                    <div className="text-xs text-zinc-500 whitespace-nowrap">
                      {event.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Needs Attention
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Operational pressure points and ecosystem awareness.
                </p>
              </div>

              <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Alerts
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={`${alert.title}-${index}`}
                  className={`rounded-2xl border p-4 ${
                    alert.severity === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : alert.severity === "warning"
                      ? "border-amber-500/30 bg-amber-500/10"
                      : "border-sky-500/30 bg-sky-500/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{alert.title}</div>

                    <div className="text-xs opacity-70">
                      {alert.time}
                    </div>
                  </div>

                  <div className="mt-2 text-sm opacity-80">
                    {alert.detail}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[36px] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-sky-300">
                Parent + Shuttle + Daycare Flow
              </div>

              <h2 className="mt-3 text-4xl font-black">
                Pickup is one connected chain.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-zinc-500">
              Child presence, shuttle timing, workforce awareness,
              parent notification, and verified pickup all move together
              through the Hub.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Transportation</h3>

                <ActionButton
                  onClick={() =>
                    addAlert(
                      "Shuttle Dispatched",
                      "A new shuttle entered the circulation queue.",
                      "success"
                    )
                  }
                >
                  Dispatch Shuttle
                </ActionButton>
              </div>

              {shuttles.map((shuttle) => (
                <div
                  key={shuttle.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-black">
                        {shuttle.route}
                      </div>

                      <div className="mt-2 text-sm text-zinc-400">
                        Driver: {shuttle.driver}
                      </div>

                      <div className="text-sm text-zinc-400">
                        Passengers: {shuttle.passengers}
                      </div>

                      {shuttle.linkedChild && (
                        <div className="mt-3 text-xs text-sky-300">
                          Connected daycare pickup: {shuttle.linkedChild}
                        </div>
                      )}
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        shuttle.status
                      )}`}
                    >
                      {shuttle.status}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="text-sm text-zinc-500">
                      ETA
                    </div>

                    <div className="font-black">
                      {shuttle.eta}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton
                      onClick={() => advanceShuttle(shuttle.id)}
                      tone="green"
                    >
                      Advance
                    </ActionButton>

                    <ActionButton
                      onClick={() => delayShuttle(shuttle.id)}
                      tone="amber"
                    >
                      Delay
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">
                  Daycare Presence
                </h3>

                <ActionButton
                  onClick={() =>
                    addAlert(
                      "New Check-In",
                      "Daycare desk started a new child check-in.",
                      "info"
                    )
                  }
                >
                  New Check-In
                </ActionButton>
              </div>

              {daycare.map((entry) => (
                <div
                  key={entry.child}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-black">
                        {entry.child}
                      </div>

                      <div className="mt-2 text-sm text-zinc-400">
                        {entry.classroom}
                      </div>

                      <div className="text-sm text-zinc-400">
                        Pickup: {entry.pickup}
                      </div>

                      <div className="mt-3 text-xs text-sky-300">
                        Assigned shuttle: {entry.shuttle}
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        entry.status
                      )}`}
                    >
                      {entry.status}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <ActionButton
                      onClick={() => advanceDaycare(entry.child)}
                      tone="green"
                    >
                      Advance
                    </ActionButton>

                    <ActionButton
                      onClick={() =>
                        addAlert(
                          "Parent Notified",
                          `${entry.child}'s parent received a live update.`,
                          "success"
                        )
                      }
                    >
                      Notify Parent
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[36px] border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                Resident Support + Workforce Flow
              </div>

              <h2 className="mt-3 text-4xl font-black">
                Requests become assigned work.
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-zinc-500">
              Maintenance and workforce coordination stay connected because
              the Hub watches availability, support load, and active response.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Maintenance</h3>

                <ActionButton onClick={createMaintenanceTask} tone="green">
                  Create Task
                </ActionButton>
              </div>

              {maintenance.map((item) => (
                <div
                  key={item.task}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-black">
                        {item.task}
                      </div>

                      <div className="mt-2 text-sm text-zinc-400">
                        Assigned: {item.assigned}
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </div>
                  </div>

                  <div className="mt-5">
                    <ActionButton
                      onClick={() => advanceMaintenance(item.task)}
                      tone="green"
                    >
                      Advance
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">
                  Workforce
                </h3>

                <ActionButton onClick={assignWorkforceRole}>
                  Assign Role
                </ActionButton>
              </div>

              {workforce.map((person) => (
                <div
                  key={person.name}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xl font-black">
                        {person.name}
                      </div>

                      <div className="mt-2 text-sm text-zinc-400">
                        {person.role}
                      </div>
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        person.status
                      )}`}
                    >
                      {person.status}
                    </div>
                  </div>

                  <div className="mt-5">
                    <ActionButton
                      onClick={() => advanceWorkforce(person.name)}
                      tone="green"
                    >
                      Advance
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

