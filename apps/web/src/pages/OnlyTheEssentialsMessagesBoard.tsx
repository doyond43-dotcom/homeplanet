import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type CleaningRequest = {
  id: string;
  created_at?: string;
  name?: string;
  customer_name?: string;
  phone?: string;
  phone_number?: string;
  customer_phone?: string;
  customerPhone?: string;
  email?: string;
  address?: string;
  request_type?: string;
  type?: string;
  preferred_time?: string;
  message?: string;
  notes?: string;
  status?: string;
};

function getCustomerPhone(request?: CleaningRequest | null) {
  if (!request) return "";
  return (
    request.phone ||
    request.phone_number ||
    request.customer_phone ||
    request.customerPhone ||
    ""
  );
}

function cleanPhone(phone?: string) {
  return (phone || "").replace(/[^\d]/g, "");
}

function displayDate(value?: string) {
  if (!value) return "No time";
  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function OnlyTheEssentialsMessagesBoard() {
  const [requests, setRequests] = useState<CleaningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CleaningRequest | null>(null);
  const [scheduledFor, setScheduledFor] = useState("");

  async function loadRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from("cleaning_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Only The Essentials messages load error:", error);
      setRequests([]);
    } else {
      setRequests((data || []) as CleaningRequest[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const grouped = useMemo(() => {
    const out = {
      book: [] as CleaningRequest[],
      question: [] as CleaningRequest[],
      reschedule: [] as CleaningRequest[],
      notes: [] as CleaningRequest[],
      other: [] as CleaningRequest[],
    };

    for (const request of requests) {
      const kind = (request.request_type || request.type || "other").toLowerCase();

      if (kind.includes("book")) out.book.push(request);
      else if (kind.includes("question")) out.question.push(request);
      else if (kind.includes("reschedule")) out.reschedule.push(request);
      else if (kind.includes("note")) out.notes.push(request);
      else out.other.push(request);
    }

    return out;
  }, [requests]);

  const rawSelectedPhone = getCustomerPhone(selected);
  const selectedPhone = cleanPhone(rawSelectedPhone);
  const selectedName = selected?.customer_name || selected?.name || "Customer";
  const selectedMessage = selected?.message || selected?.notes || "";

  const textBody = encodeURIComponent(
    `Hi ${selectedName}, this is Only The Essentials Cleaning. I received your request and wanted to confirm the details with you.`
  );

  const confirmTextBody = encodeURIComponent(
    `Hi ${selectedName}, this is Only The Essentials Cleaning. We have you scheduled for ${scheduledFor || "your confirmed appointment time"}. Reply here if anything changes.`
  );

  function RequestColumn({
    title,
    items,
  }: {
    title: string;
    items: CleaningRequest[];
  }) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {items.length}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((request) => {
            const name = request.customer_name || request.name || "New customer";
            const msg = request.message || request.notes || "No message added yet.";
            const phone = getCustomerPhone(request) || "No phone";

            return (
              <button
                key={request.id}
                onClick={() => {
                  setSelected(request);
                  setScheduledFor("");
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-left transition hover:border-rose-200/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{name}</p>
                    <p className="mt-1 text-sm text-white/55">{phone}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-rose-200/15 px-3 py-1 text-xs font-medium text-rose-100">
                    {displayDate(request.created_at)}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/70">
                  {msg}
                </p>
              </button>
            );
          })}

          {!items.length && (
            <div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/40">
              No requests here right now.
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-black via-[#130d10] to-[#2b141d] p-6 shadow-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-rose-100/70">
            Only The Essentials
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Customer Requests / Messages
              </h1>

              <div className="mt-4">
                <a
                  href="/planet/demo/only-the-essentials"
                  className="inline-flex rounded-full border border-white/15 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-rose-50"
                >
                  Live Board
                </a>
              </div>
              <p className="mt-3 max-w-3xl text-base leading-7 text-white/70">
                New bookings, questions, reschedules, and notes land here first.
                Staff confirms the real appointment before anything becomes live work.
              </p>
            </div>

            <button
              onClick={loadRequests}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
            >
              Refresh requests
            </button>
          </div>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
            Loading requests...
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-4">
            <RequestColumn title="Booking Requests" items={grouped.book} />
            <RequestColumn title="Questions" items={grouped.question} />
            <RequestColumn title="Reschedule" items={grouped.reschedule} />
            <RequestColumn title="Notes" items={grouped.notes.concat(grouped.other)} />
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm">
          <div className="ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#100c0e] shadow-2xl">
            <div className="border-b border-white/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-rose-100/60">
                    Request detail
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white">
                    {selectedName}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    Submitted {displayDate(selected.created_at)}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-5"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-sm font-semibold text-white">Customer message</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/70">
                  {selectedMessage || "No message added."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Phone
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    {rawSelectedPhone || "Not provided"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Email
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    {selected.email || "Not provided"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Address
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    {selected.address || "Not provided"}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/35">
                    Customer preferred time
                  </p>
                  <p className="mt-2 text-sm text-white/75">
                    {selected.preferred_time || "No preferred time listed"}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/40">
                    This is only the customer request. Staff confirms the real schedule.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <label className="text-sm font-semibold text-white">
                  Staff Scheduled For
                </label>
                <input
                  value={scheduledFor}
                  onChange={(event) => setScheduledFor(event.target.value)}
                  placeholder="Example: Friday at 10:30 AM"
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-rose-100/40"
                />
                <p className="mt-2 text-xs leading-5 text-white/45">
                  Staff-only note for confirming the real appointment after talking/texting.
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedPhone) {
                      alert("No customer phone number was saved with this request.");
                      return;
                    }
                    window.location.href = `tel:${selectedPhone}`;
                  }}
                  className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-rose-50"
                >
                  Call Customer
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedPhone) {
                      alert("No customer phone number was saved with this request.");
                      return;
                    }
                    window.location.href = `sms:${selectedPhone}?&body=${textBody}`;
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                  Text Customer
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!selectedPhone) {
                      alert("No customer phone number was saved with this request.");
                      return;
                    }
                    window.location.href = `sms:${selectedPhone}?&body=${confirmTextBody}`;
                  }}
                  className="rounded-full border border-white/10 bg-white/[0.08] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/12 sm:col-span-2">
                  Confirm Scheduled + Text Customer
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-white/35">
                Confirming here does not replace the live operations board.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}









