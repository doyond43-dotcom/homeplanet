import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../lib/supabase";

type CleaningRequest = {
  id: string;
  created_at: string;
  business_slug: string;
  request_type: "book" | "question" | "reschedule" | "notes" | string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  preferred_time: string | null;
  notes: string | null;
  status: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  book: "Booking",
  question: "Question",
  reschedule: "Reschedule",
  notes: "Job Notes",
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OnlyTheEssentialsBoard() {
  const supabase = useMemo(() => getSupabase(), []);
  const [requests, setRequests] = useState<CleaningRequest[]>([]);
  const [active, setActive] = useState<CleaningRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadRequests() {
    setErr(null);

    const { data, error } = await supabase
      .from("cleaning_requests")
      .select("*")
      .eq("business_slug", "only-the-essentials")
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      setErr(error.message || "Could not load cleaning requests.");
      return;
    }

    const rows = (data || []) as CleaningRequest[];
    setRequests(rows);
    setActive((current) => current ?? rows[0] ?? null);
  }

  useEffect(() => {
    loadRequests();

    const channel = supabase
      .channel("cleaning-requests:only-the-essentials")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cleaning_requests",
          filter: "business_slug=eq.only-the-essentials",
        },
        () => loadRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const newRequests = requests.filter((r) => (r.status || "new") === "new");
  const activeRequests = requests.filter((r) => (r.status || "new") !== "done");

  return (
    <main className="min-h-screen bg-black px-5 py-6 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6">
          <div className="text-xs font-black uppercase tracking-[0.28em] text-rose-300/80">
            Only The Essentials
          </div>
          <h1 className="mt-3 text-3xl font-black">Live Organizer Board</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            Customer bookings, questions, reschedules, and job notes flow here from the public request page.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Total</div>
            <div className="mt-2 text-3xl font-black">{requests.length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">New</div>
            <div className="mt-2 text-3xl font-black">{newRequests.length}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Active</div>
            <div className="mt-2 text-3xl font-black">{activeRequests.length}</div>
          </div>
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-rose-100/70">Live</div>
            <div className="mt-2 text-3xl font-black">On</div>
          </div>
        </div>

        {err ? (
          <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
            {err}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black">Incoming Requests</h2>
              <button
                onClick={loadRequests}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/5"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-sm text-white/50">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-sm text-white/50">
                No cleaning requests yet.
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => {
                  const selected = active?.id === request.id;
                  return (
                    <button
                      key={request.id}
                      type="button"
                      onClick={() => setActive(request)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-rose-300/50 bg-rose-400/10"
                          : "border-white/10 bg-white/[0.04] hover:border-rose-300/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-black uppercase tracking-[0.18em] text-rose-300/70">
                            {TYPE_LABELS[request.request_type] || request.request_type}
                          </div>
                          <h3 className="mt-2 text-lg font-black">
                            {request.customer_name || "Unnamed customer"}
                          </h3>
                          <p className="mt-1 text-sm text-white/55">
                            {request.preferred_time || "No preferred time yet"}
                          </p>
                        </div>

                        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white/60">
                          {request.status || "new"}
                        </div>
                      </div>

                      <p className="mt-3 line-clamp-2 text-sm text-white/60">
                        {request.notes || request.customer_address || "No notes yet."}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-6 lg:h-fit">
            <div className="text-xs font-black uppercase tracking-[0.22em] text-rose-300/80">
              Request Drawer
            </div>

            {active ? (
              <>
                <h2 className="mt-3 text-2xl font-black">
                  {active.customer_name || "Unnamed customer"}
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  {TYPE_LABELS[active.request_type] || active.request_type} • {formatTime(active.created_at)}
                </p>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Phone</div>
                    <div className="mt-1 font-bold">{active.customer_phone || "Not provided"}</div>

                    {active.customer_phone ? (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <a
                          href={`tel:${active.customer_phone}`}
                          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-sm font-bold text-white/80 hover:border-rose-300/40 hover:bg-rose-400/5"
                        >
                          Call Customer
                        </a>
                        <a
                          href={`sms:${active.customer_phone}`}
                          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center text-sm font-bold text-white/80 hover:border-rose-300/40 hover:bg-rose-400/5"
                        >
                          Text Customer
                        </a>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Address / Area</div>
                    <div className="mt-1 text-white/75">{active.customer_address || "Not provided"}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Preferred Time</div>
                    <div className="mt-1 text-white/75">{active.preferred_time || "Not provided"}</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/35">Notes</div>
                    <div className="mt-1 whitespace-pre-wrap text-white/75">
                      {active.notes || "No notes provided."}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm text-white/50">Select a request.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

