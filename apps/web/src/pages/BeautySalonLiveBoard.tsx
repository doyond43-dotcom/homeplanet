import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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

type AppointmentDraft = {
  customer_name: string;
  phone: string;
  service: string;
  stylist: string;
  notes: string;
  appointment_date: string;
  appointment_time: string;
};

type LiveBoardLocationState = {
  boardSlug?: string;
  businessName?: string;
};

const FALLBACK_BOARD_SLUG = "color-me-crazy-demo";
const CASH_APP_CASHTAG = "$YourRealCashtag";
const ZELLE_CONTACT = "your@email.com";

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

function buildCashAppUrl(amount: string, memo: string) {
  const cashtag = CASH_APP_CASHTAG.replace("$", "");
  const params = new URLSearchParams();

  if (amount) params.set("amount", amount);
  if (memo) params.set("note", memo);

  return `https://cash.app/$${cashtag}${params.toString() ? `?${params.toString()}` : ""}`;
}

function buildZelleCopy(amount: string, memo: string) {
  return `Send ${amount ? `$${amount}` : "payment"} to ${ZELLE_CONTACT}${memo ? ` | Memo: ${memo}` : ""}`;
}

function buildAppointmentMemo(appt: Appointment) {
  const service = appt.service?.trim() || "appointment";
  const customer = appt.customer_name?.trim() || "client";
  return `${service} - ${customer}`;
}

function guessAmountFromService(service: string) {
  const normalized = service.toLowerCase();

  if (normalized.includes("highlight")) return "165.00";
  if (normalized.includes("full color")) return "145.00";
  if (normalized.includes("color")) return "125.00";
  if (normalized.includes("cut")) return "45.00";
  if (normalized.includes("haircut")) return "45.00";
  if (normalized.includes("style")) return "55.00";
  if (normalized.includes("blowout")) return "55.00";
  if (normalized.includes("treatment")) return "65.00";

  return "125.00";
}

export default function BeautySalonLiveBoard() {
  const { boardSlug: routeBoardSlug } = useParams();
  const location = useLocation();
  const locationState = (location.state as LiveBoardLocationState | null) ?? {};

  const boardSlug = useMemo(() => {
    if (routeBoardSlug?.trim()) return routeBoardSlug.trim();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const boardFromQuery = params.get("board")?.trim();
      if (boardFromQuery) return boardFromQuery;
    }

    if (locationState.boardSlug?.trim()) return locationState.boardSlug.trim();

    return FALLBACK_BOARD_SLUG;
  }, [routeBoardSlug, locationState.boardSlug]);

  const boardTitle = useMemo(() => {
    const nameFromState = locationState.businessName?.trim();
    if (nameFromState) return nameFromState;
    return "Color Me Crazy";
  }, [locationState.businessName]);

  const defaultPaymentMemo = useMemo(() => `${boardTitle} appointment`, [boardTitle]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("125.00");
  const [paymentMemo, setPaymentMemo] = useState(defaultPaymentMemo);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [paymentPulse, setPaymentPulse] = useState(false);
  const paymentPanelRef = useRef<HTMLElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<AppointmentDraft | null>(null);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("salon_appointments")
      .select("*")
      .eq("board_slug", boardSlug)
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
      current.map((appt) => (appt.id === id ? { ...appt, status } : appt)),
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

  function startEditing(appt: Appointment) {
    setEditingId(appt.id);
    setEditDraft({
      customer_name: appt.customer_name || "",
      phone: appt.phone || "",
      service: appt.service || "",
      stylist: appt.stylist || "",
      notes: appt.notes || "",
      appointment_date: appt.appointment_date || "",
      appointment_time: appt.appointment_time || "",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setEditDraft(null);
  }

  function updateEditDraft<K extends keyof AppointmentDraft>(field: K, value: AppointmentDraft[K]) {
    setEditDraft((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  }

  async function saveAppointmentEdit(id: string) {
    if (!editDraft) return;

    const payload = {
      customer_name: editDraft.customer_name.trim(),
      phone: editDraft.phone.trim(),
      service: editDraft.service.trim(),
      stylist: editDraft.stylist.trim() || null,
      notes: editDraft.notes.trim() || null,
      appointment_date: editDraft.appointment_date,
      appointment_time: editDraft.appointment_time,
    };

    const previous = appointments;

    setAppointments((current) =>
      current.map((appt) =>
        appt.id === id
          ? {
              ...appt,
              ...payload,
              stylist: payload.stylist,
              notes: payload.notes,
            }
          : appt,
      ),
    );

    if (selectedAppointmentId === id) {
      setPaymentAmount(guessAmountFromService(payload.service || ""));
      setPaymentMemo(
        buildAppointmentMemo({
          ...(previous.find((appt) => appt.id === id) || {
            id,
            board_slug: boardSlug,
            customer_name: payload.customer_name,
            phone: payload.phone,
            service: payload.service,
            stylist: payload.stylist,
            appointment_date: payload.appointment_date,
            appointment_time: payload.appointment_time,
            notes: payload.notes,
            status: "scheduled" as AppointmentStatus,
            created_at: new Date().toISOString(),
          }),
          customer_name: payload.customer_name,
          phone: payload.phone,
          service: payload.service,
          stylist: payload.stylist,
          appointment_date: payload.appointment_date,
          appointment_time: payload.appointment_time,
          notes: payload.notes,
        }),
      );
    }

    const { error } = await supabase
      .from("salon_appointments")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("salon_appointments edit failed:", error);
      setAppointments(previous);
      alert(`Save failed: ${error.message}`);
      return;
    }

    setEditingId(null);
    setEditDraft(null);
  }

  async function markSelectedAppointmentPaid() {
    if (!selectedAppointment) return;

    const targetId = selectedAppointment.id;
    const previous = appointments;

    setAppointments((current) =>
      current.map((appt) =>
        appt.id === targetId ? { ...appt, status: "done" } : appt,
      ),
    );

    const { error } = await supabase
      .from("salon_appointments")
      .update({ status: "done" })
      .eq("id", targetId);

    if (error) {
      console.error("salon_appointments mark paid failed:", error);
      setAppointments(previous);
      alert(`Mark paid failed: ${error.message}`);
      return;
    }

    setSelectedAppointmentId(null);
    setPaymentAmount("125.00");
    setPaymentMemo(defaultPaymentMemo);
    setPaymentPulse(false);
  }

  async function deleteAppointment(id: string) {
    const target = appointments.find((appt) => appt.id === id) || null;
    const label = target?.customer_name?.trim() || "this appointment";

    const confirmed = window.confirm(`Delete ${label}?`);
    if (!confirmed) return;

    const previous = appointments;
    setAppointments((current) => current.filter((appt) => appt.id !== id));

    if (selectedAppointmentId === id) {
      setSelectedAppointmentId(null);
      setPaymentAmount("125.00");
      setPaymentMemo(defaultPaymentMemo);
      setPaymentPulse(false);
    }

    const { error } = await supabase
      .from("salon_appointments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("salon_appointments delete failed:", error);
      setAppointments(previous);
      alert(`Delete failed: ${error.message}`);
    }
  }

  async function copyText(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(null), 1600);
    } catch (error) {
      console.error(`Failed to copy ${label}:`, error);
      alert(`Could not copy ${label}.`);
    }
  }

  function selectAppointmentForPayment(appt: Appointment) {
    setSelectedAppointmentId(appt.id);
    setPaymentAmount(guessAmountFromService(appt.service || ""));
    setPaymentMemo(buildAppointmentMemo(appt));
    setPaymentPulse(true);

    window.setTimeout(() => {
      setPaymentPulse(false);
    }, 1400);

    window.requestAnimationFrame(() => {
      paymentPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function clearPaymentSelection() {
    setSelectedAppointmentId(null);
    setPaymentAmount("125.00");
    setPaymentMemo(defaultPaymentMemo);
    setPaymentPulse(false);
  }

  useEffect(() => {
    setPaymentMemo(defaultPaymentMemo);
  }, [defaultPaymentMemo]);

  useEffect(() => {
    fetchAppointments();

    const channel = supabase
      .channel(`beauty-salon-live-board-${boardSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "salon_appointments",
        },
        (payload) => {
          const newRow = payload.new as Appointment;
          if (newRow.board_slug !== boardSlug) return;

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
        },
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
          if (updatedRow.board_slug !== boardSlug) return;

          setAppointments((current) =>
            current.map((appt) => (appt.id === updatedRow.id ? updatedRow : appt)),
          );
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "salon_appointments",
        },
        (payload) => {
          const deletedRow = payload.old as Appointment;
          if (deletedRow.board_slug !== boardSlug) return;

          setAppointments((current) => current.filter((appt) => appt.id !== deletedRow.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardSlug]);

  const groupedAppointments = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      items: appointments.filter((appt) => (appt.status || "scheduled") === stage.key),
    }));
  }, [appointments]);

  const selectedAppointment = useMemo(
    () => appointments.find((appt) => appt.id === selectedAppointmentId) || null,
    [appointments, selectedAppointmentId],
  );

  const cashAppUrl = useMemo(
    () => buildCashAppUrl(paymentAmount, paymentMemo),
    [paymentAmount, paymentMemo],
  );

  const zelleCopyText = useMemo(
    () => buildZelleCopy(paymentAmount, paymentMemo),
    [paymentAmount, paymentMemo],
  );

  return (
    <div className="min-h-screen bg-black px-4 py-3 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <div className="min-w-0">
            <div className="rounded-[28px] border border-neutral-800 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,#171717_0%,#0a0a0a_100%)] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Live Salon Board
                </div>
                <div className="rounded-full border border-neutral-700 bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Board: {boardSlug}
                </div>
              </div>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{boardTitle}</h1>
              <p className="mt-1 max-w-2xl text-xs text-neutral-400">
                Booking hits the board live. Move each appointment through the chair, then take
                payment from the same flow without bouncing into a separate app mess.
              </p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a
                  href={`/planet/beauty/color-me-crazy/home?board=${encodeURIComponent(boardSlug)}`}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
                >
                  View Landing Page
                </a>
                <a
                  href={`/planet/beauty/color-me-crazy/book?board=${encodeURIComponent(boardSlug)}`}
                  className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
                >
                  + New Appointment
                </a>
              </div>
            </div>

            {loading ? (
              <div className="mt-3 rounded-3xl border border-neutral-800 bg-neutral-950 p-8 text-neutral-400">
                Loading appointments...
              </div>
            ) : (
              <div className="mt-3 grid gap-3 xl:grid-cols-3">
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
                        {stage.items.map((appt) => {
                          const isSelected = appt.id === selectedAppointmentId;
                          const isEditing = appt.id === editingId;
                          const formValue = isEditing && editDraft ? editDraft : null;

                          return (
                            <article
                              key={appt.id}
                              onClick={() => {
                                if (!isEditing) selectAppointmentForPayment(appt);
                              }}
                              className={`cursor-pointer rounded-2xl border p-4 transition ${
                                isSelected
                                  ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(52,211,153,0.08)]"
                                  : "border-neutral-800 bg-black/50"
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    {isEditing && formValue ? (
                                      <input
                                        type="text"
                                        value={formValue.customer_name}
                                        onChange={(event) =>
                                          updateEditDraft("customer_name", event.target.value)
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-base font-semibold text-white outline-none"
                                        autoFocus
                                      />
                                    ) : (
                                      <h3 className="text-base font-semibold">{appt.customer_name}</h3>
                                    )}
                                  </div>
                                </div>

                                {!isEditing ? (
                                  <p className="text-sm text-neutral-400">
                                    {formatDate(appt.appointment_date)} · {formatTime(appt.appointment_time)}
                                  </p>
                                ) : null}

                                <div className="flex flex-wrap items-center gap-2">
                                  {isEditing && formValue ? (
                                    <input
                                      type="text"
                                      value={formValue.service}
                                      onChange={(event) =>
                                        updateEditDraft("service", event.target.value)
                                      }
                                      onClick={(event) => event.stopPropagation()}
                                      className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300 outline-none"
                                    />
                                  ) : (
                                    <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                                      {appt.service}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2">
                                    {isEditing ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            void saveAppointmentEdit(appt.id);
                                          }}
                                          className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            cancelEditing();
                                          }}
                                          className="rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] text-neutral-300"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            startEditing(appt);
                                          }}
                                          className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-300"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            void deleteAppointment(appt.id);
                                          }}
                                          className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-300"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 space-y-2 text-sm text-neutral-300">
                                {isEditing && formValue ? (
                                  <>
                                    <input
                                      type="text"
                                      value={formValue.phone}
                                      onChange={(event) => updateEditDraft("phone", event.target.value)}
                                      onClick={(event) => event.stopPropagation()}
                                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none"
                                      placeholder="Phone"
                                    />
                                    <input
                                      type="text"
                                      value={formValue.stylist}
                                      onChange={(event) => updateEditDraft("stylist", event.target.value)}
                                      onClick={(event) => event.stopPropagation()}
                                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none"
                                      placeholder="Stylist"
                                    />
                                    <div className="grid gap-2 sm:grid-cols-2">
                                      <input
                                        type="date"
                                        value={formValue.appointment_date}
                                        onChange={(event) =>
                                          updateEditDraft("appointment_date", event.target.value)
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none"
                                      />
                                      <input
                                        type="time"
                                        value={formValue.appointment_time}
                                        onChange={(event) =>
                                          updateEditDraft("appointment_time", event.target.value)
                                        }
                                        onClick={(event) => event.stopPropagation()}
                                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none"
                                      />
                                    </div>
                                    <textarea
                                      value={formValue.notes}
                                      onChange={(event) => updateEditDraft("notes", event.target.value)}
                                      onClick={(event) => event.stopPropagation()}
                                      className="min-h-[88px] w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white outline-none"
                                      placeholder="Notes"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <div>Phone: {appt.phone}</div>
                                    {appt.stylist ? <div>Stylist: {appt.stylist}</div> : null}
                                    {appt.notes ? (
                                      <div className="text-neutral-400">Notes: {appt.notes}</div>
                                    ) : null}
                                  </>
                                )}
                              </div>

                              {!isEditing ? (
                                <>
                                  <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                      {isSelected ? "Payment selected" : "Click to load payment"}
                                    </div>
                                  </div>

                                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void updateStatus(appt.id, "scheduled");
                                      }}
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
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void updateStatus(appt.id, "in-progress");
                                      }}
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
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void updateStatus(appt.id, "done");
                                      }}
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
                                </>
                              ) : null}
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>

          <aside
            ref={paymentPanelRef}
            className={`sticky top-3 h-fit rounded-[28px] border border-cyan-900/60 bg-[linear-gradient(180deg,rgba(12,30,36,0.96)_0%,rgba(8,14,20,0.98)_100%)] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.06)] transition-all duration-500 ${
              paymentPulse
                ? "ring-2 ring-cyan-300/70 shadow-[0_0_0_1px_rgba(34,211,238,0.16),0_0_28px_rgba(34,211,238,0.18)]"
                : ""
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/80">
                  Payment Layer
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Take payment fast</h2>
              </div>
              <div className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                {selectedAppointment ? "Job Selected" : "Ready"}
              </div>
            </div>

            <p className="mt-2 text-sm text-neutral-300">
              Click any appointment card to auto-fill payment for that client and service.
            </p>

            {selectedAppointment ? (
              <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      Selected Appointment
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {selectedAppointment.customer_name}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-200">
                      {selectedAppointment.service} · {formatDate(selectedAppointment.appointment_date)} ·{" "}
                      {formatTime(selectedAppointment.appointment_time)}
                    </p>
                    <p className="mt-1 text-sm text-neutral-300">
                      {selectedAppointment.stylist
                        ? `Stylist: ${selectedAppointment.stylist}`
                        : "Stylist not set"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={clearPaymentSelection}
                    className="rounded-xl border border-neutral-700 bg-black/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-neutral-800 bg-black/30 p-4 text-sm text-neutral-400">
                No appointment selected yet. Click a client card below to load payment details.
              </div>
            )}

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  Payment Amount
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  placeholder="125.00"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                  Payment Memo
                </span>
                <input
                  type="text"
                  value={paymentMemo}
                  onChange={(event) => setPaymentMemo(event.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-black/60 px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  placeholder="Color + haircut"
                />
              </label>

              <button
                type="button"
                onClick={() => void markSelectedAppointmentPaid()}
                disabled={!selectedAppointment}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  selectedAppointment
                    ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-50 hover:bg-emerald-500/25"
                    : "cursor-not-allowed border-neutral-800 bg-neutral-900 text-neutral-500"
                }`}
              >
                Mark Paid
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Cash App</p>
                    <p className="mt-1 text-xs text-neutral-400">{CASH_APP_CASHTAG}</p>
                  </div>
                  <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Tap Ready
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-300">
                  Amount: <span className="font-semibold text-white">${paymentAmount || "0.00"}</span>
                  <br />
                  Memo: <span className="font-semibold text-white">{paymentMemo || "No memo"}</span>
                </div>

                <div className="mt-3 grid gap-2">
                  <a
                    href={cashAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-black"
                  >
                    Open Cash App
                  </a>
                  <button
                    type="button"
                    onClick={() => copyText(cashAppUrl, "Cash App link")}
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
                  >
                    {copiedLabel === "Cash App link" ? "Copied Cash App Link" : "Copy Cash App Link"}
                  </button>

                  <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                    Demo payment QR (not real)
                    <img
                      src="/payment/cashapp-demo-qr.png"
                      alt="Demo Cash App QR"
                      className="mt-2 h-28 w-28 rounded-md border border-white/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-black/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Zelle</p>
                    <p className="mt-1 text-xs text-neutral-400">{ZELLE_CONTACT}</p>
                  </div>
                  <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                    Memo Ready
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-300">
                  Send to: <span className="font-semibold text-white">{ZELLE_CONTACT}</span>
                  <br />
                  Memo: <span className="font-semibold text-white">{paymentMemo || "No memo"}</span>
                </div>

                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(paymentMemo, "memo")}
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
                  >
                    {copiedLabel === "memo" ? "Copied Memo" : "Copy Memo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(zelleCopyText, "Zelle payment details")}
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white"
                  >
                    {copiedLabel === "Zelle payment details"
                      ? "Copied Zelle Details"
                      : "Copy Zelle Details"}
                  </button>

                  <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-white/60">
                    Demo payment QR (not real)
                    <img
                      src="/payment/zelle-demo-qr.png"
                      alt="Demo Zelle QR"
                      className="mt-2 h-28 w-28 rounded-md border border-white/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-neutral-800 bg-black/40 p-4 text-xs leading-6 text-neutral-400">
              Click a client card to turn that appointment into a payment-ready moment. Swap in the
              real Cash App cashtag and Zelle contact whenever you are ready.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}







