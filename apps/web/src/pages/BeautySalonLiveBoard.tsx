import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type AppointmentStatus = "scheduled" | "in-progress" | "done";

type Appointment = {
  id: string;
  board_slug: string;
  customer_name: string;
  phone: string;
  service: string;
  stylist: string | null;
  appointment_date: string;
  appointment_time: string;
  notes: string | null;
  status: AppointmentStatus;
  created_at: string;
};

const BOARD_SLUG = "color-me-crazy";

const STAGES: Array<{
  key: AppointmentStatus;
  title: string;
  subtitle: string;
}> = [
  { key: "scheduled", title: "Scheduled", subtitle: "Booked and waiting" },
  { key: "in-progress", title: "In Progress", subtitle: "Client in chair" },
  { key: "done", title: "Done", subtitle: "Finished and complete" },
];

function formatDate(value: string) {
  if (!value) return "No date";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value: string) {
  if (!value) return "No time";
  const [hours, minutes] = value.split(":");
  const h = Number(hours);
  const m = Number(minutes);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;

  const date = new Date();
  date.setHours(h, m, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BeautySalonLiveBoard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("salon_appointments")
      .select("*")
      .eq("board_slug", BOARD_SLUG)
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("salon_appointments fetch failed:", error);
      setLoading(false);
      return;
    }

    setAppointments((data as Appointment[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    setUpdatingId(id);

    const previous = appointments;

    setAppointments((current) =>
      current.map((appt) => (appt.id === id ? { ...appt, status } : appt))
    );

    const { error } = await supabase
      .from("salon_appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("salon_appointments update failed:", error);
      setAppointments(previous);
      alert(`Status update failed: ${error.message}`);
    }

    setUpdatingId(null);
  }

  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel("beauty-salon-live-board")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "salon_appointments",
        },
        (payload) => {
          const newRow = payload.new as Appointment;
          if (newRow.board_slug !== BOARD_SLUG) return;

          setAppointments((current) => {
            const exists = current.some((appt) => appt.id === newRow.id);
            if (exists) return current;
            return [...current, newRow].sort((a, b) => {
              const dateCompare = a.appointment_date.localeCompare(b.appointment_date);
              if (dateCompare !== 0) return dateCompare;
              const timeCompare = a.appointment_time.localeCompare(b.appointment_time);
              if (timeCompare !== 0) return timeCompare;
              return a.created_at.localeCompare(b.created_at);
            });
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "salon_appointments",
        },
        (payload) => {
          const updatedRow = payload.new as Appointment;
          if (updatedRow.board_slug !== BOARD_SLUG) return;

          setAppointments((current) =>
            current.map((appt) => (appt.id === updatedRow.id ? updatedRow : appt))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const groupedAppointments = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      items: appointments.filter((appt) => (appt.status || "scheduled") === stage.key),
    }));
  }, [appointments]);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="rounded-[28px] border border-neutral-800 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,#171717_0%,#0a0a0a_100%)] p-6">
            <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Live Salon Board
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Color Me Crazy</h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-300">
              Booking hits the board live. Move each appointment through the chair.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/planet/beauty/color-me-crazy/start"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
            >
              View Landing Page
            </a>
            <a
              href="/planet/beauty/color-me-crazy/book"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
            >
              + New Appointment
            </a>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-neutral-400">
            Loading appointments...
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-3">
            {groupedAppointments.map((stage) => (
              <section
                key={stage.key}
                className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-4"
              >
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{stage.title}</h2>
                    <p className="mt-1 text-sm text-neutral-500">{stage.subtitle}</p>
                  </div>
                  <div className="rounded-full border border-neutral-700 bg-black px-3 py-1 text-xs font-semibold text-neutral-300">
                    {stage.items.length}
                  </div>
                </div>

                {stage.items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-neutral-800 bg-black/40 p-6 text-center text-sm text-neutral-500">
                    No appointments here yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stage.items.map((appt) => (
                      <article
                        key={appt.id}
                        className="rounded-2xl border border-neutral-800 bg-black/50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold">{appt.customer_name}</h3>
                            <p className="mt-1 text-sm text-neutral-400">
                              {formatDate(appt.appointment_date)} · {formatTime(appt.appointment_time)}
                            </p>
                          </div>
                          <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                            {appt.service}
                          </div>
                        </div>

                        <div className="mt-3 space-y-1 text-sm text-neutral-300">
                          <div>Phone: {appt.phone}</div>
                          {appt.stylist ? <div>Stylist: {appt.stylist}</div> : null}
                          {appt.notes ? <div className="text-neutral-400">Notes: {appt.notes}</div> : null}
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => updateStatus(appt.id, "scheduled")}
                            disabled={updatingId === appt.id}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                              appt.status === "scheduled"
                                ? "border-white bg-white text-black"
                                : "border-neutral-700 bg-neutral-950 text-neutral-300"
                            }`}
                          >
                            Scheduled
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(appt.id, "in-progress")}
                            disabled={updatingId === appt.id}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                              appt.status === "in-progress"
                                ? "border-white bg-white text-black"
                                : "border-neutral-700 bg-neutral-950 text-neutral-300"
                            }`}
                          >
                            In Progress
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStatus(appt.id, "done")}
                            disabled={updatingId === appt.id}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                              appt.status === "done"
                                ? "border-white bg-white text-black"
                                : "border-neutral-700 bg-neutral-950 text-neutral-300"
                            }`}
                          >
                            Done
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}