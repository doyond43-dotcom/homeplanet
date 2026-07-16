import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Camera, CreditCard, FileText, MapPin, MessageCircle, Phone, RefreshCw, Share2, Star, Trash2, X } from "lucide-react";
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


function smsBody(phone: string, body: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized =
    digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits.startsWith("1") ? `+${digits}` : digits;

  return normalized ? `sms:${normalized}?body=${encodeURIComponent(body)}` : "#";
}

function buildFirstReplyText(signal: Signal) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash. We received your request and I’m looking it over now.

I’ll reply here with the next step.`;
}

async function copyToClipboard(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  } catch (error) {
    console.error("Copy failed:", error);
  }
}

function buildEstimateText(signal: Signal) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash. We reviewed your ${signal.service} request for ${signal.address}.

Before we send a final price, we want to confirm the job details:

Service: ${signal.service}
Condition: ${signal.condition}
Access: ${signal.access}
Preferred time: ${signal.preferred}
Preferred crew: ${signal.preferredTech}
Photos attached: ${signal.photos}

Next step: we’ll review the photos/details and send a clean estimate for approval.`;
}

function buildAgreementText(signal: Signal) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash.

We reviewed your ${signal.service} request for ${signal.address}.

Before we lock the job in, please confirm you approve the scope and final job price once we send it.

Service: ${signal.service}
Condition: ${signal.condition}
Access: ${signal.access}
Preferred time: ${signal.preferred}
Photos attached: ${signal.photos}

Once approved, we can schedule the job.`;
}

function buildWorkPhotoText(signal: Signal) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash. We are keeping before and after photos attached to your ${signal.service} job so the work is documented clearly from start to finish.`;
}

function buildProofText(signal: Signal) {
  return `Hi ${signal.name}, thank you for choosing Ridgeline Pro Wash. Your ${signal.service} job is complete. We can send the finished photos/proof here, and if you are happy with the work, a quick review would help a local business a lot.`;
}

function buildScheduleText(signal: Signal) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash. We have your ${signal.service} request for ${signal.address}. Does ${signal.preferred} still work as your preferred time window?`;
}

function buildPaymentText(signal: Signal) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash. Here is the payment link for your ${signal.service} job. You can also pay in person by scanning the QR code when the crew arrives.`;
}

function buildReviewText(signal: Signal) {
  return `Hi ${signal.name}, thank you for choosing Ridgeline Pro Wash. If you were happy with the ${signal.service}, would you mind leaving us a quick review? It helps a local business a lot.`;
}

function buildSocialPost(signal: Signal) {
  return `Another ${signal.service} request completed in Okeechobee. Photos, job notes, and customer follow-up stayed attached to the same job from start to finish.`;
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

const sampleSignal: Signal = {
  id: "sample-ridgeline-request",
  createdAt: "Sample Request",
  name: "Sample Customer",
  phone: "8630000000",
  address: "Sample Okeechobee Property",
  location: "Sample Okeechobee Property",
  service: "House Wash",
  condition: "Moderate algae / grime",
  access: "Open access",
  preferred: "Mornings preferred",
  preferredTech: "No preference",
  photos: "Yes",
  notes: "Customer wants the outside of the home cleaned up and wants to know the next step.",
  status: "sample",
  suggestion: "Send a simple first reply, review the photos/details, then create the estimate draft.",
  rawNotes: "",
};

export default function RidgelineIntelligenceDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selected, setSelected] = useState<Signal | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showEstimatePreview, setShowEstimatePreview] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [boardError, setBoardError] = useState("");
  const sampleMode = new URLSearchParams(window.location.search).get("sample") === "1";
  const visibleSignals = sampleMode ? [sampleSignal] : signals;

  async function handleCopy(label: string, value: string) {
    await copyToClipboard(value);
    setCopiedNotice(label);
    window.setTimeout(() => setCopiedNotice(""), 1800);
  }

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
            ) : visibleSignals.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black p-6 text-sm font-bold text-zinc-300">
                No live Ridgeline requests yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {visibleSignals.map((signal) => (
                  <article
                    key={signal.id}
                    className="rounded-2xl border border-white/10 bg-black p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button onClick={() => {
                          setSelected(signal);
                          setShowContactDetails(false);
                          setShowEstimatePreview(false);
                        }} className="flex-1 text-left">
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

                    <button onClick={() => {
                        setSelected(signal);
                        setShowContactDetails(false);
                        setShowEstimatePreview(false);
                      }} className="mt-4 w-full text-left">
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
          <aside className="relative ml-auto flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-amber-300/20 bg-black p-5 shadow-2xl shadow-amber-950/30">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.28),rgba(120,53,15,0.12)_36%,transparent_72%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/60 to-transparent" />
            <div className="relative z-10">
              <button
                onClick={() => {
                  setSelected(null);
                  setShowContactDetails(false);
                  setShowEstimatePreview(false);
                }}
                className="ml-auto flex rounded-xl border border-white/10 bg-white/10 p-3 hover:bg-white/15"
              >
                <X size={18} />
              </button>

              <div className="mt-4 inline-flex rounded-full border border-orange-300/35 bg-orange-500/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-orange-100 shadow-[0_0_28px_rgba(249,115,22,0.12)]">
                Active Workspace • Pressure Cleaning Job
              </div>

              {copiedNotice ? (
                <div className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-100">
                  OK — {copiedNotice}
                </div>
              ) : null}

              <div className="mt-5 rounded-[1.6rem] border border-amber-300/20 bg-gradient-to-br from-stone-950/80 via-zinc-950 to-black p-4 shadow-[0_0_34px_rgba(249,115,22,0.08)]">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">
                  Active Workspace
                </p>
                <h2 className="mt-3 text-4xl font-black">{selected.name}</h2>
                <p className="mt-1 text-xl font-black text-amber-300">{selected.service}</p>
                <p className="mt-1 text-sm text-zinc-400">{selected.address}</p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <a
                    href={selected.phone ? `tel:${selected.phone}` : "#"}
                    className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black"
                  >
                    <Phone className="mx-auto mb-1" size={16} />
                    Call
                  </a>

                  <a
                    href={smsBody(selected.phone, buildFirstReplyText(selected))}
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
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">
                    Contact / Details
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-zinc-200">
                    <div>{selected.name}</div>
                    <div>{selected.phone || "No phone provided"}</div>
                    <div>{selected.address}</div>
                    <div>Service: {selected.service}</div>
                    <div>Condition: {selected.condition}</div>
                    <div>Access: {selected.access}</div>
                    <div>Preferred Time: {selected.preferred}</div>
                    <div>Preferred Crew: {selected.preferredTech}</div>
                    <div>Photos Attached: {selected.photos}</div>
                  </div>

                  {selected.notes && selected.notes !== "None" ? (
                    <div className="mt-4 rounded-xl border border-yellow-300/20 bg-yellow-500/10 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-200">
                        Customer Notes
                      </p>
                      <p className="mt-2 text-sm leading-6 text-zinc-200">{selected.notes}</p>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-orange-300/20 bg-orange-500/10 p-4 shadow-[0_0_35px_rgba(249,115,22,0.06)]">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-200">
                    Intelligence
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-200">
                    {selected.suggestion}
                  </p>
                  <div className="mt-3 rounded-xl border border-white/10 bg-black/35 p-3 text-xs font-bold leading-5 text-orange-100">
                    Watch for surface condition, oxidation, rust, algae, access limits, water source, and whether the job needs a site review before final price.
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-300/20 bg-zinc-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-200">
                    Estimate
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-200">
                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                        Status
                      </p>
                      <p className="mt-1 font-black text-white">
                        {showEstimatePreview ? "Draft Ready" : "Not Sent"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                        Approved Job Price
                      </p>
                      <p className="mt-1 font-black text-white">Review First</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowEstimatePreview((current) => !current)}
                      className="rounded-xl border border-amber-300/25 bg-amber-500/10 py-3 text-xs font-black uppercase text-amber-100"
                    >
                      Create Estimate
                    </button>

                    <a
                      href={smsBody(selected.phone, buildEstimateText(selected))}
                      className="rounded-xl bg-orange-500 py-3 text-center text-xs font-black uppercase text-black"
                    >
                      Send Estimate Text
                    </a>
                  </div>

                  {showEstimatePreview ? (
                    <div className="mt-4 rounded-2xl border border-amber-300/25 bg-black/45 p-4 text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-200">
                        Draft Estimate Preview
                      </p>

                      <div className="mt-3 space-y-2 text-sm text-zinc-200">
                        <div><span className="font-black text-white">Service:</span> {selected.service}</div>
                        <div><span className="font-black text-white">Property:</span> {selected.address}</div>
                        <div><span className="font-black text-white">Condition:</span> {selected.condition}</div>
                        <div><span className="font-black text-white">Access:</span> {selected.access}</div>
                        <div><span className="font-black text-white">Preferred Time:</span> {selected.preferred}</div>
                        <div><span className="font-black text-white">Preferred Crew:</span> {selected.preferredTech}</div>
                        <div><span className="font-black text-white">Photos Attached:</span> {selected.photos}</div>
                      </div>

                      <div className="mt-4 rounded-xl bg-amber-500/10 px-3 py-3 text-sm font-bold leading-6 text-amber-100">
                        Suggested next step: review photos/details, set a flat job price, then send for customer approval.
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy("estimate draft copied", buildEstimateText(selected))}
                        className="mt-3 w-full rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-xs font-black uppercase text-amber-100"
                      >
                        Copy Estimate Draft
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-sky-300/20 bg-sky-500/10 p-4 shadow-[0_0_35px_rgba(56,189,248,0.06)]">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                    Agreement / Job Approval
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-200">
                    Send the approved scope and flat job price before scheduling so both sides agree to the work.
                  </p>
                  <a
                    href={smsBody(selected.phone, buildAgreementText(selected))}
                    className="mt-4 block rounded-xl bg-sky-300 py-3 text-center text-xs font-black uppercase text-black"
                  >
                    Send Approval Text
                  </a>
                </div>

                <div className="rounded-2xl border border-orange-300/20 bg-zinc-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-200">
                    Schedule
                  </p>
                  <p className="mt-3 text-sm text-zinc-200">
                    Preferred: {selected.preferred}
                  </p>
                  <a
                    href={smsBody(selected.phone, buildScheduleText(selected))}
                    className="mt-4 block w-full rounded-xl bg-orange-500 py-3 text-center text-sm font-black text-black shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                  >
                    <CalendarCheck className="mr-2 inline" size={16} />
                    Confirm Schedule Text
                  </a>
                </div>

                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-4 shadow-[0_0_35px_rgba(34,211,238,0.06)]">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-200">
                    Work / Photos
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-200">
                    Keep before and after proof attached to the same job. This is where Ridgeline documents the surface before work and the finished result after cleaning.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button type="button" className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 py-3 text-xs font-black uppercase text-cyan-100">
                      Take Before
                    </button>
                    <button type="button" className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 py-3 text-xs font-black uppercase text-cyan-100">
                      Upload Before
                    </button>
                    <button type="button" className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 py-3 text-xs font-black uppercase text-cyan-100">
                      Take After
                    </button>
                    <button type="button" className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 py-3 text-xs font-black uppercase text-cyan-100">
                      Upload After
                    </button>
                  </div>

                  <a
                    href={smsBody(selected.phone, buildWorkPhotoText(selected))}
                    className="mt-4 block rounded-xl border border-cyan-300/25 bg-black/35 py-3 text-center text-xs font-black uppercase text-cyan-100"
                  >
                    Send Photo Update Text
                  </a>
                </div>

                <div className="rounded-2xl border border-lime-300/20 bg-lime-500/10 p-4 shadow-[0_0_35px_rgba(132,204,22,0.06)]">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-lime-200">
                    <CreditCard size={15} />
                    Payment
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-200">
                    <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-200">
                        Amount Due
                      </p>
                      <p className="mt-1 font-black text-white">Approved price</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/35 p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-200">
                        Method
                      </p>
                      <p className="mt-1 font-black text-white">Card / Cash / App</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-lime-300/20 bg-black/35 p-3 text-sm text-zinc-200">
                    Payment link / QR is sent after the approved job price is confirmed.
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-lime-300/20 bg-black/45 p-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-200">
                        QR Preview
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">Ready after approval</p>
                    </div>
                    <div className="grid h-16 w-16 place-items-center rounded-xl border border-lime-300/25 bg-lime-300/10 text-[10px] font-black text-lime-100">
                      QR
                    </div>
                  </div>

                  <a
                    href={smsBody(selected.phone, buildPaymentText(selected))}
                    className="mt-4 block rounded-xl bg-lime-300 py-3 text-center text-xs font-black uppercase text-black"
                  >
                    Send Payment Link Text
                  </a>
                </div>

                <div className="rounded-2xl border border-yellow-300/20 bg-yellow-500/10 p-4 shadow-[0_0_35px_rgba(234,179,8,0.07)]">
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-yellow-200">
                    <Star size={15} />
                    Proof / Review
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-200">
                    When the job is done, turn the work into proof: before/after photos, customer update, review request, or social post.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <a
                      href={smsBody(selected.phone, buildProofText(selected))}
                      className="rounded-xl bg-yellow-400 py-3 text-center text-xs font-black uppercase text-black"
                    >
                      Send Proof Text
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy("post copied", buildSocialPost(selected))}
                      className="rounded-xl border border-yellow-300/25 bg-yellow-500/10 py-3 text-xs font-black uppercase text-yellow-100"
                    >
                      <Share2 className="mr-1 inline" size={14} />
                      Copy Post
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-300">
                    Timeline
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-zinc-300">
                    <div>1. Request received</div>
                    <div>2. Details reviewed</div>
                    <div>3. Flat job price drafted</div>
                    <div>4. Customer approval sent</div>
                    <div>5. Schedule confirmed</div>
                    <div>6. Before photos captured</div>
                    <div>7. Work completed</div>
                    <div>8. After photos captured</div>
                    <div>9. Payment collected</div>
                    <div>10. Proof / review requested</div>
                  </div>
                </div>

                <button
                  onClick={() => deleteSignal(selected.id)}
                  className="w-full rounded-xl border border-red-400/20 bg-red-950/30 py-3 text-sm font-black text-red-200"
                >
                  Delete Request
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
}


















