import { useEffect, useMemo, useState } from "react";
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

type StarterPayload = {
  boardSlug?: string;
  businessName?: string;
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

function readStarterPayload(): StarterPayload {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("hp_starter_payload");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StarterPayload;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function BeautySalonLiveBoard() {
  const { boardSlug: routeBoardSlug } = useParams();
  const location = useLocation();
  const locationState = (location.state as LiveBoardLocationState | null) ?? {};
  const starterPayload = useMemo(() => readStarterPayload(), []);

  const boardSlug = useMemo(() => {
    if (routeBoardSlug?.trim()) return routeBoardSlug.trim();

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const boardFromQuery = params.get("board")?.trim();
      if (boardFromQuery) return boardFromQuery;
    }

    if (locationState.boardSlug?.trim()) return locationState.boardSlug.trim();
    if (starterPayload.boardSlug?.trim()) return starterPayload.boardSlug.trim();

    return FALLBACK_BOARD_SLUG;
  }, [routeBoardSlug, locationState.boardSlug, starterPayload.boardSlug]);

  const boardTitle = useMemo(() => {
    const nameFromState = locationState.businessName?.trim();
    if (nameFromState) return nameFromState;

    const nameFromStarter = starterPayload.businessName?.trim();
    if (nameFromStarter) return nameFromStarter;

    return "Beauty Live Board";
  }, [locationState.businessName, starterPayload.businessName]);

  const defaultPaymentMemo = useMemo(() => `${boardTitle} appointment`, [boardTitle]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("125.00");
  const [paymentMemo, setPaymentMemo] = useState(defaultPaymentMemo);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

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
  }

  function clearPaymentSelection() {
    setSelectedAppointmentId(null);
    setPaymentAmount("125.00");
    setPaymentMemo(defaultPaymentMemo);
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

                          return (
                            <article
                              key={appt.id}
                              onClick={() => selectAppointmentForPayment(appt)}
                              className={`cursor-pointer rounded-2xl border p-4 transition ${
                                isSelected
                                  ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(52,211,153,0.08)]"
                                  : "border-neutral-800 bg-black/50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="text-base font-semibold">{appt.customer_name}</h3>
                                  <p className="mt-1 text-sm text-neutral-400">
                                    {formatDate(appt.appointment_date)} ·{" "}
                                    {formatTime(appt.appointment_time)}
                                  </p>
                                </div>
                                <div className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                                  {appt.service}
                                </div>
                              </div>

                              <div className="mt-3 space-y-1 text-sm text-neutral-300">
                                <div>Phone: {appt.phone}</div>
                                {appt.stylist ? <div>Stylist: {appt.stylist}</div> : null}
                                {appt.notes ? (
                                  <div className="text-neutral-400">Notes: {appt.notes}</div>
                                ) : null}
                              </div>

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
                                    updateStatus(appt.id, "scheduled");
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
                                    updateStatus(appt.id, "in-progress");
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
                                    updateStatus(appt.id, "done");
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

          <aside className="sticky top-3 h-fit rounded-[28px] border border-cyan-900/60 bg-[linear-gradient(180deg,rgba(12,30,36,0.96)_0%,rgba(8,14,20,0.98)_100%)] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.06)]">
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
                      {selectedAppointment.service} ·{" "}
                      {formatDate(selectedAppointment.appointment_date)} ·{" "}
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
                    {copiedLabel === "Cash App link"
                      ? "Copied Cash App Link"
                      : "Copy Cash App Link"}
                  </button>
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