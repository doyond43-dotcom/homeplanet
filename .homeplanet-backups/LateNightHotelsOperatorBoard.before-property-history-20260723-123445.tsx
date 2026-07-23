import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock3,
  MapPin,
  MessageSquareText,
  Phone,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type RequestStatus =
  | "Needs Confirmation"
  | "Contacting Property"
  | "Confirmed"
  | "Declined"
  | "Matching Another Property";

type LateNightRequest = {
  id: string;
  createdAt: string;
  travelerName: string;
  phone: string;
  location: string;
  timing: string;
  intent: string;
  propertyName: string;
  quotedPrice: string;
  status: RequestStatus;
};

type LateNightRequestRow = {
  id: string;
  created_at: string;
  traveler_name: string;
  traveler_phone: string;
  location: string;
  timing: string;
  intent: string;
  requested_property: string;
  current_property: string;
  quoted_price: string | null;
  status: RequestStatus;
  confirmed_property: string | null;
  confirmed_rate: string | null;
  confirmed_at: string | null;
  declined_at: string | null;
  closed_at: string | null;
  outcome: string | null;
};

function toLateNightRequest(row: LateNightRequestRow): LateNightRequest {
  return {
    id: row.id,
    createdAt: row.created_at,
    travelerName: row.traveler_name,
    phone: row.traveler_phone,
    location: row.location,
    timing: row.timing,
    intent: row.intent,
    propertyName: row.current_property || row.requested_property,
    quotedPrice: row.quoted_price || "",
    status: row.status,
  };
}

function formatRequestTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusClasses(status: RequestStatus) {
  switch (status) {
    case "Confirmed":
      return "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200";

    case "Declined":
      return "border-rose-400/25 bg-rose-400/[0.08] text-rose-200";

    case "Matching Another Property":
      return "border-sky-400/25 bg-sky-400/[0.08] text-sky-200";

    case "Contacting Property":
      return "border-amber-300/25 bg-amber-300/[0.08] text-amber-100";

    default:
      return "border-[#f0b65d]/30 bg-[#f0b65d]/[0.08] text-[#f6cf8e]";
  }
}

function LateNightHotelsOperatorBoard() {
  const [requests, setRequests] = useState<LateNightRequest[]>([]);
  const [activeRequestId, setActiveRequestId] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [boardError, setBoardError] = useState("");
  const [nextPropertyName, setNextPropertyName] = useState("");
  const [nextPropertyRate, setNextPropertyRate] = useState("");
  const [assigningProperty, setAssigningProperty] = useState(false);

  const activeRequest = useMemo(
    () =>
      requests.find((request) => request.id === activeRequestId) ?? null,
    [requests, activeRequestId],
  );

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setBoardError("");

    const { data, error } = await supabase
      .from("late_night_hotel_requests")
      .select(
        "id, created_at, traveler_name, traveler_phone, location, timing, intent, requested_property, current_property, quoted_price, status, confirmed_property, confirmed_rate, confirmed_at, declined_at, closed_at, outcome"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Late-night hotel requests load failed:", error);
      setBoardError("Unable to load room requests.");
      setLoading(false);
      return;
    }

    setRequests(
      ((data ?? []) as LateNightRequestRow[]).map(toLateNightRequest)
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function updateStatus(id: string, status: RequestStatus) {
    setBoardError("");

    const patch: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "Confirmed") {
      const current = requests.find((request) => request.id === id);
      patch.confirmed_property = current?.propertyName ?? null;
      patch.confirmed_rate = current?.quotedPrice || null;
      patch.confirmed_at = new Date().toISOString();
      patch.outcome = "Confirmed";
    }

    if (status === "Declined") {
      patch.declined_at = new Date().toISOString();
      patch.outcome = "Declined";
    }

    if (status === "Matching Another Property") {
      patch.outcome = null;
    }

    const { error } = await supabase
      .from("late_night_hotel_requests")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error("Late-night request status update failed:", error);
      setBoardError("Unable to update this request.");
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );
  }


  async function assignNextProperty(id: string) {
    const propertyName = nextPropertyName.trim();
    const propertyRate = nextPropertyRate.trim();

    if (!propertyName) {
      setBoardError("Enter the next property before assigning it.");
      return;
    }

    setBoardError("");
    setAssigningProperty(true);

    const { error } = await supabase
      .from("late_night_hotel_requests")
      .update({
        current_property: propertyName,
        quoted_price: propertyRate || null,
        status: "Needs Confirmation",
        outcome: null,
        declined_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Next property assignment failed:", error);
      setBoardError("Unable to assign the next property.");
      setAssigningProperty(false);
      return;
    }

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              propertyName,
              quotedPrice: propertyRate,
              status: "Needs Confirmation",
            }
          : request
      )
    );

    setNextPropertyName("");
    setNextPropertyRate("");
    setAssigningProperty(false);
  }

  const openCount = requests.filter(
    (request) =>
      request.status !== "Confirmed" &&
      request.status !== "Declined",
  ).length;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="mx-auto min-h-screen w-full max-w-6xl pt-4 sm:pt-5">
        <header className="border-b border-white/10 bg-[#0b1626]">
          <div className="px-4 py-5 sm:px-6">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f3c57d]">
              Late Night Hotels
            </div>

            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  Tonight&apos;s Requests
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
                  See what needs attention right now, open one request,
                  and move it forward.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center">
                <div className="text-2xl font-black">{openCount}</div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  Open
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="px-4 pb-6 pt-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-white/40">
                Incoming Now
              </div>

              <h2 className="mt-1 text-2xl font-black">
                Needs attention
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm font-black">
              {openCount}
            </div>
          </div>

          {boardError && (
            <div className="mt-5 rounded-2xl border border-rose-400/25 bg-rose-400/[0.07] p-4 text-sm font-bold text-rose-200">
              {boardError}
            </div>
          )}

          {loading ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-[#0d1a2b] p-6 text-white/55">
              Loading tonight&apos;s requests...
            </div>
          ) : requests.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-[#0d1a2b] p-6">
              <div className="font-black">No incoming requests yet.</div>
              <div className="mt-2 text-sm leading-6 text-white/50">
                New traveler requests will appear here automatically.
              </div>
            </div>
          ) : (
          <div className="mt-4 grid gap-4">
            {requests.map((request) => (
              <button
                type="button"
                key={request.id}
                onClick={() => setActiveRequestId(request.id)}
                className="w-full rounded-3xl border border-white/10 bg-[#0d1a2b] p-5 text-left transition hover:border-white/20 hover:bg-[#101f33]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.16em] text-[#f3c57d]">
                      {formatRequestTime(request.createdAt)}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-lg font-black">
                      <MapPin className="h-5 w-5 text-white/45" />
                      {request.location}
                    </div>
                  </div>

                  <ChevronRight className="mt-1 h-5 w-5 text-white/35" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Needed
                    </div>

                    <div className="mt-1 font-black">
                      {request.timing}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Priority
                    </div>

                    <div className="mt-1 font-black">
                      {request.intent}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                    Requested Property
                  </div>

                  <div className="mt-1 text-lg font-black">
                    {request.propertyName}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-black ${statusClasses(
                      request.status,
                    )}`}
                  >
                    {request.status.toUpperCase()}
                  </span>

                  <span className="text-sm font-black text-white/65">
                    Open Request
                  </span>
                </div>
              </button>
            ))}
          </div>
          )}
        </section>
      </div>

      {activeRequest && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Late-night hotel request workspace"
            className="max-h-[95dvh] w-full overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#0d1a2b] text-white shadow-2xl sm:max-w-xl sm:rounded-[30px]"
          >
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0d1a2b]/95 px-4 pb-4 pt-3 backdrop-blur">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRequestId(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close request"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="min-w-0 flex-1 text-center">
                  <div className="truncate text-xs font-black uppercase tracking-[0.14em] text-white/40">
                    {activeRequest.location} · {activeRequest.timing}
                  </div>

                  <div className="mt-1 text-sm font-bold text-white/60">
                    Active Request
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveRequestId(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 pb-8 sm:p-6">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-black ${statusClasses(
                  activeRequest.status,
                )}`}
              >
                {activeRequest.status.toUpperCase()}
              </span>

              <h2 className="mt-4 text-3xl font-black tracking-tight">
                {activeRequest.propertyName}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/55">
                One traveler request. Everything needed to move it forward
                stays here.
              </p>

              <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  Traveler
                </div>

                <div className="mt-4 grid gap-4">
                  <div className="flex items-center gap-3">
                    <UserRound className="h-5 w-5 text-[#f3c57d]" />

                    <div>
                      <div className="font-black">
                        {activeRequest.travelerName}
                      </div>

                      <div className="text-sm text-white/45">
                        Traveler
                      </div>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeRequest.phone}`}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.08]"
                  >
                    <Phone className="h-5 w-5 text-[#f3c57d]" />

                    <div>
                      <div className="font-black">
                        {activeRequest.phone}
                      </div>

                      <div className="text-sm text-white/45">
                        Tap to call
                      </div>
                    </div>
                  </a>
                </div>
              </section>

              <section className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  What they need
                </div>

                <div className="mt-4 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-white/45">
                      Location
                    </span>

                    <span className="text-right font-black">
                      {activeRequest.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                    <span className="text-white/45">
                      Timing
                    </span>

                    <span className="text-right font-black">
                      {activeRequest.timing}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/45">
                      Priority
                    </span>

                    <span className="text-right font-black">
                      {activeRequest.intent}
                    </span>
                  </div>
                </div>
              </section>

              <section className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  Requested Property
                </div>

                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xl font-black">
                      {activeRequest.propertyName}
                    </div>

                    <div className="mt-1 text-sm text-white/45">
                      Requested late-night match
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                      Shown Rate
                    </div>

                    <div className="text-2xl font-black">
                      {activeRequest.quotedPrice}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={activeRequest.status === "Contacting Property"}
                  onClick={() =>
                    updateStatus(
                      activeRequest.id,
                      "Contacting Property",
                    )
                  }
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black transition ${
                    activeRequest.status === "Contacting Property"
                      ? "border border-amber-300/30 bg-amber-300/[0.10] text-amber-100"
                      : "bg-[#f0b65d] text-[#142033] hover:bg-[#f4c573]"
                  }`}
                >
                  <MessageSquareText className="h-5 w-5" />
                  {activeRequest.status === "Contacting Property"
                    ? "CONTACTING PROPERTY"
                    : "CONTACT PROPERTY"}
                </button>
              </section>

              <section className="mt-4">
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white/40">
                  Property Response
                </div>

                <div className="mt-3 grid gap-3">
                  <button
                    type="button"
                    disabled={activeRequest.status === "Confirmed"}
                    onClick={() =>
                      updateStatus(activeRequest.id, "Confirmed")
                    }
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-black transition ${
                      activeRequest.status === "Confirmed"
                        ? "border-emerald-300/40 bg-emerald-400/[0.18] text-emerald-100"
                        : "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200 hover:bg-emerald-400/[0.13]"
                    }`}
                  >
                    <Check className="h-5 w-5" />
                    {activeRequest.status === "Confirmed"
                      ? "ROOM CONFIRMED"
                      : "CONFIRMED"}
                  </button>

                  <button
                    type="button"
                    disabled={activeRequest.status === "Declined"}
                    onClick={() =>
                      updateStatus(activeRequest.id, "Declined")
                    }
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-black transition ${
                      activeRequest.status === "Declined"
                        ? "border-rose-300/40 bg-rose-400/[0.18] text-rose-100"
                        : "border-rose-400/25 bg-rose-400/[0.08] text-rose-200 hover:bg-rose-400/[0.13]"
                    }`}
                  >
                    <X className="h-5 w-5" />
                    {activeRequest.status === "Declined"
                      ? "PROPERTY DECLINED"
                      : "DECLINED"}
                  </button>

                  <button
                    type="button"
                    disabled={
                      activeRequest.status === "Matching Another Property"
                    }
                    onClick={() => {
                      setNextPropertyName("");
                      setNextPropertyRate("");
                      void updateStatus(
                        activeRequest.id,
                        "Matching Another Property",
                      );
                    }}
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border px-4 py-4 font-black transition ${
                      activeRequest.status === "Matching Another Property"
                        ? "border-sky-300/40 bg-sky-400/[0.18] text-sky-100"
                        : "border-sky-400/25 bg-sky-400/[0.08] text-sky-200 hover:bg-sky-400/[0.13]"
                    }`}
                  >
                    <RefreshCw className="h-5 w-5" />
                    {activeRequest.status === "Matching Another Property"
                      ? "MATCHING ANOTHER PROPERTY"
                      : "TRY ANOTHER PROPERTY"}
                  </button>

                  {activeRequest.status === "Matching Another Property" && (
                    <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.05] p-4">
                      <div className="text-[11px] font-black uppercase tracking-[0.16em] text-sky-200/70">
                        Next Property
                      </div>

                      <div className="mt-3 grid gap-3">
                        <label className="grid gap-2">
                          <span className="text-xs font-bold text-white/55">
                            Property name
                          </span>
                          <input
                            type="text"
                            value={nextPropertyName}
                            onChange={(event) =>
                              setNextPropertyName(event.target.value)
                            }
                            placeholder="Enter hotel or motel"
                            className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-base font-bold text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40"
                          />
                        </label>

                        <label className="grid gap-2">
                          <span className="text-xs font-bold text-white/55">
                            Rate, optional
                          </span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={nextPropertyRate}
                            onChange={(event) =>
                              setNextPropertyRate(event.target.value)
                            }
                            placeholder="Example: 109"
                            className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-base font-bold text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40"
                          />
                        </label>

                        <button
                          type="button"
                          disabled={
                            assigningProperty || !nextPropertyName.trim()
                          }
                          onClick={() =>
                            void assignNextProperty(activeRequest.id)
                          }
                          className="flex min-h-14 items-center justify-center rounded-2xl bg-sky-300 px-4 py-4 font-black text-[#102033] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {assigningProperty
                            ? "ASSIGNING..."
                            : "ASSIGN THIS PROPERTY"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-white/50">
                Operator actions are saved to the request record and remain
                after refresh. Traveler-facing status updates will be connected
                as the next workflow layer.
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default LateNightHotelsOperatorBoard;
