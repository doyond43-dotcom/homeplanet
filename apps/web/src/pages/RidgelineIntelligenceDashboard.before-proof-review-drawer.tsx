import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, MapPin, MessageCircle, Phone, RefreshCw, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";

type RequestRow = {
  id: string;
  created_at?: string;
  request_type?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  preferred_time?: string | null;
  notes?: string | null;
  status?: string | null;
};

type Signal = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  location: string;
  service: string;
  condition: string;
  access: string;
  preferred: string;
  preferredTech: string;
  photos: string;
  notes: string;
  status: string;
  suggestion: string;
  rawNotes: string;
};

function readLine(notes: string, label: string, fallback = "") {
  const line = notes
    .split("\n")
    .find((item) => item.toLowerCase().startsWith(label.toLowerCase() + ":"));

  return line ? line.slice(label.length + 1).trim() : fallback;
}

function buildSuggestion(signal: Signal) {
  const text = `${signal.condition} ${signal.access} ${signal.notes}`.toLowerCase();

  if (text.includes("rust") || text.includes("oxidation")) {
    return "Confirm surface type and stain expectations before quoting. Rust and oxidation may need a different approach.";
  }

  if (text.includes("heavy") || text.includes("spider")) {
    return "Ask for photos and confirm scope before final quote. This may be a heavier job.";
  }

  if (text.includes("gate") || text.includes("limited")) {
    return "Confirm access details before scheduling so the crew does not lose time on arrival.";
  }

  if (signal.preferredTech && !["Preferred Crew", "No preference"].includes(signal.preferredTech)) {
    return `Customer requested ${signal.preferredTech}. Assign that crew member if scheduling allows.`;
  }

  return "Review the address, service, photos, and preferred time. Then send the next clear reply.";
}

function mapRow(row: RequestRow): Signal {
  const rawNotes = row.notes || "";
  const service = readLine(rawNotes, "Service Type", row.request_type || "Quote Request");
  const condition = readLine(rawNotes, "Condition", "Needs review");
  const access = readLine(rawNotes, "Access Details", "Not specified");
  const preferred = readLine(rawNotes, "Preferred Time", row.preferred_time || "Not specified");
  const preferredTech = readLine(rawNotes, "Preferred Crew", "No preference");
  const photos = readLine(rawNotes, "Photos Attached", "No");
  const customerNotes = readLine(rawNotes, "Customer Notes", "");

  const signal: Signal = {
    id: row.id,
    createdAt: row.created_at || "",
    name: row.customer_name || "New Customer",
    phone: row.customer_phone || "",
    address: row.customer_address || "Address not provided",
    location: row.customer_address || "Okeechobee, FL",
    service,
    condition,
    access,
    preferred,
    preferredTech,
    photos,
    notes: customerNotes,
    status: row.status || "new",
    suggestion: "",
    rawNotes,
  };

  signal.suggestion = buildSuggestion(signal);

  return signal;
}

export default function RidgelineIntelligenceDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selected, setSelected] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [boardError, setBoardError] = useState("");

  async function loadRequests() {
    setLoading(true);
    setBoardError("");

    const { data, error } = await supabase
      .from("cleaning_requests")
      .select("id, created_at, request_type, customer_name, customer_phone, customer_address, preferred_time, notes, status")
      .eq("business_slug", "ridgeline")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Ridgeline request load failed:", error);
      setBoardError(error.message);
      setLoading(false);
      return;
    }

    setSignals((data || []).map(mapRow));
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const metrics = useMemo(() => {
    const heavy = signals.filter((s) =>
      `${s.condition} ${s.notes}`.toLowerCase().includes("heavy")
    ).length;

    const access = signals.filter((s) =>
      s.access && !["Access Details", "Open Access", "Not specified"].includes(s.access)
    ).length;

    const techRequests = signals.filter((s) =>
      s.preferredTech && !["Preferred Crew", "No preference", "Not sure"].includes(s.preferredTech)
    ).length;

    return [
      { label: "Open Requests", value: signals.length },
      { label: "Need Quote", value: signals.filter((s) => s.status === "new").length },
      { label: "Heavy Jobs", value: heavy },
      { label: "Crew Requests", value: techRequests },
      { label: "Access Notes", value: access },
    ];
  }, [signals]);

  async function deleteSignal(id: string) {
    const { error } = await supabase
      .from("cleaning_requests")
      .delete()
      .eq("id", id)
      .eq("business_slug", "ridgeline");

    if (error) {
      console.error("Ridgeline delete failed:", error);
      setBoardError(error.message);
      return;
    }

    setSignals((current) => current.filter((signal) => signal.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-4 py-6">
        <header className="rounded-[2rem] border border-amber-300/20 bg-gradient-to-br from-stone-950/70 via-zinc-950 to-black p-6">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-300">
            Customer Requests
          </p>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">
                Ridgeline
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">
                New requests, service details, access notes, photos, preferred crew, and the next clear move.
              </p>
            </div>

            <button
              type="button"
              onClick={loadRequests}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-amber-100 hover:bg-amber-500/20"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <p className="text-3xl font-black text-amber-300">{metric.value}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-zinc-400">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </header>

        {boardError && (
          <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm font-bold text-red-100">
            Board error: {boardError}
          </div>
        )}

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
                Active Requests
              </h2>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black p-6 text-sm font-bold text-zinc-300">
                Loading Ridgeline requests...
              </div>
            ) : signals.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black p-6 text-sm font-bold text-zinc-300">
                No live Ridgeline requests yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {signals.map((signal) => (
                  <article
                    key={signal.id}
                    className="rounded-2xl border border-white/10 bg-black p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button onClick={() => setSelected(signal)} className="flex-1 text-left">
                        <h2 className="text-2xl font-black">{signal.name}</h2>
                        <p className="mt-1 font-black text-amber-300">{signal.service}</p>
                        <p className="mt-1 text-sm text-zinc-400">{signal.address}</p>
                      </button>

                      <button
                        onClick={() => deleteSignal(signal.id)}
                        className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-red-200"
                        aria-label="Delete request"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <button onClick={() => setSelected(signal)} className="mt-4 w-full text-left">
                      <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                        <div>{signal.condition}</div>
                        <div>{signal.access}</div>
                        <div>{signal.preferred}</div>
                        <div>Preferred crew: {signal.preferredTech}</div>
                      </div>

                      <div className="mt-4 rounded-xl bg-amber-500/10 px-4 py-3 text-sm font-black text-amber-100">
                        Next move: {signal.suggestion}
                      </div>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-amber-300/15 bg-black p-5">
            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-amber-300">
              Owner Notes
            </h2>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-white/[0.035] p-4">
                <h3 className="font-black">Crew preference matters.</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Shows if the customer requested Roy, Brock, or whoever is available first.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.035] p-4">
                <h3 className="font-black">Job condition matters.</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Shows algae, grime, roof stains, oxidation, rust, spider webs, or heavy buildup before quoting.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.035] p-4">
                <h3 className="font-black">Access notes save time.</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Shows gate codes, limited access, animals, side yard access, or scheduling issues before arrival.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
          <aside className="ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-amber-300/20 bg-black p-5 shadow-2xl shadow-amber-950/30">
            <button
              onClick={() => setSelected(null)}
              className="ml-auto rounded-xl border border-white/10 bg-white/10 p-3"
            >
              <X size={18} />
            </button>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
              Customer Request
            </p>

            <h2 className="mt-3 text-4xl font-black">{selected.name}</h2>
            <p className="mt-1 text-xl font-black text-amber-300">{selected.service}</p>
            <p className="mt-1 text-sm text-zinc-400">{selected.address}</p>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <a
                href={selected.phone ? `tel:${selected.phone}` : "#"}
                className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black"
              >
                <Phone className="mx-auto mb-1" size={16} />
                Call
              </a>

              <a
                href={selected.phone ? `sms:${selected.phone}` : "#"}
                className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black"
              >
                <MessageCircle className="mx-auto mb-1" size={16} />
                Text
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.address)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black"
              >
                <MapPin className="mx-auto mb-1" size={16} />
                Navigate
              </a>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  Customer
                </p>
                <div className="mt-3 space-y-1 text-sm text-zinc-200">
                  <div>{selected.name}</div>
                  <div>{selected.phone || "No phone provided"}</div>
                  <div>{selected.address}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  Request
                </p>
                <div className="mt-3 space-y-1 text-sm text-zinc-200">
                  <div>Service: {selected.service}</div>
                  <div>Condition: {selected.condition}</div>
                  <div>Access: {selected.access}</div>
                  <div>Preferred Time: {selected.preferred}</div>
                  <div>Preferred Crew: {selected.preferredTech}</div>
                  <div>Photos Attached: {selected.photos}</div>
                </div>
              </div>

              {selected.notes && selected.notes !== "None" && (
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                    Customer Notes
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-200">{selected.notes}</p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  Next Move
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-200">
                  {selected.suggestion}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  Estimate
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-200">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      Status
                    </p>
                    <p className="mt-1 font-black text-white">Not Sent</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      Estimate Range
                    </p>
                    <p className="mt-1 font-black text-white">Review First</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="rounded-xl border border-amber-300/25 bg-amber-500/10 py-3 text-xs font-black uppercase text-amber-100">
                    Create Estimate
                  </button>
                  <button className="rounded-xl bg-amber-400 py-3 text-xs font-black uppercase text-black">
                    Send Estimate
                  </button>
                </div>

                <p className="mt-3 rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-black text-amber-100">
                  Next move: Review request details, photos, access, and preferred crew before sending price.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
                  Schedule
                </p>
                <p className="mt-3 text-sm text-zinc-200">
                  Preferred: {selected.preferred}
                </p>
                <button className="mt-4 w-full rounded-xl bg-amber-400 py-3 text-sm font-black text-black">
                  <CalendarCheck className="mr-2 inline" size={16} />
                  Confirm Schedule
                </button>
              </div>

              <button
                onClick={() => deleteSignal(selected.id)}
                className="w-full rounded-xl border border-red-400/30 bg-red-500/10 py-3 text-sm font-black text-red-200"
              >
                Delete Request
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}




