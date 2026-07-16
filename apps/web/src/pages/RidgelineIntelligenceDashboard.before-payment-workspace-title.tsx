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

function buildRidgelineEstimateText(signal: Signal, approvedJobPrice: string) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash.

I reviewed your pressure cleaning request.

Service: ${signal.service}
Property: ${signal.address}
Condition: ${signal.condition}
Access: ${signal.access}
Preferred time: ${signal.preferred}
Photos attached: ${signal.photos}

Estimated flat job price: $${approvedJobPrice}

If this looks good, reply YES and we can lock in the job approval before scheduling.`;
}

function buildRidgelineApprovalText(signal: Signal, approvedJobPrice: string) {
  return `Hi ${signal.name}, this is Ridgeline Pro Wash.

Before we schedule the job, please reply YES to confirm the pressure cleaning approval:

Service: ${signal.service}
Property: ${signal.address}
Approved job price: $${approvedJobPrice}
Access: ${signal.access}
Preferred time: ${signal.preferred}

By replying YES, you confirm the scope, approved flat job price, and that payment is due when the job is complete.

Thank you.`;
}

function buildRidgelinePaymentText(signal: Signal, approvedJobPrice: string, paymentMethod: string, paymentLink: string) {
  const payLine = paymentLink.trim()
    ? `Payment link: ${paymentLink.trim()}`
    : "We can send the payment link here once everything is confirmed.";

  return `Hi ${signal.name}, this is Ridgeline Pro Wash.

Your pressure cleaning job is complete and ready for payment.

Service: ${signal.service}
Approved job price: $${approvedJobPrice}
Amount due: $${approvedJobPrice}
Payment method: ${paymentMethod}

${payLine}

Thank you.`;
}

function buildRidgelineProofText(signal: Signal, beforePhotos: RidgelinePhoto[], afterPhotos: RidgelinePhoto[]) {
  const beforeLinks = beforePhotos.map((photo, index) => `Before ${index + 1}: ${photo.public_url}`).join("\n");
  const afterLinks = afterPhotos.map((photo, index) => `After ${index + 1}: ${photo.public_url}`).join("\n");

  return `Hi ${signal.name}, this is Ridgeline Pro Wash.

Your ${signal.service} job is complete.

${beforeLinks ? `Before photos:\n${beforeLinks}\n\n` : ""}${afterLinks ? `After photos:\n${afterLinks}\n\n` : ""}Thank you again for choosing Ridgeline Pro Wash.`;
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

type RidgelinePhoto = {
  id: string;
  photo_type: "before" | "after";
  public_url: string;
  name: string;
};

export default function RidgelineIntelligenceDashboard() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [selected, setSelected] = useState<Signal | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showEstimatePreview, setShowEstimatePreview] = useState(false);
  const [showHeaderDetails, setShowHeaderDetails] = useState(false);
  const [approvedJobPrice, setApprovedJobPrice] = useState("325");
  const [paymentMethod, setPaymentMethod] = useState("Card / Cash App");
  const [paymentLink, setPaymentLink] = useState("https://www.homeplanet.city/pay/ridgeline");
  const [beforePhotos, setBeforePhotos] = useState<RidgelinePhoto[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<RidgelinePhoto[]>([]);
  const [uploadingPhotoType, setUploadingPhotoType] = useState<"before" | "after" | null>(null);
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

  function handleRidgelinePhotoUpload(type: "before" | "after", fileList: FileList | null) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setUploadingPhotoType(type);

    const mapped = files.map((file) => ({
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      photo_type: type,
      public_url: URL.createObjectURL(file),
      name: file.name,
    }));

    if (type === "before") {
      setBeforePhotos((current) => [...current, ...mapped]);
    } else {
      setAfterPhotos((current) => [...current, ...mapped]);
    }

    window.setTimeout(() => setUploadingPhotoType(null), 350);
  }

  function removeRidgelinePhoto(photo: RidgelinePhoto) {
    if (photo.photo_type === "before") {
      setBeforePhotos((current) => current.filter((item) => item.id !== photo.id));
    } else {
      setAfterPhotos((current) => current.filter((item) => item.id !== photo.id));
    }

    try {
      URL.revokeObjectURL(photo.public_url);
    } catch {
      // local preview cleanup only
    }
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
                          setShowHeaderDetails(false);
                          setApprovedJobPrice("325");
                          setPaymentMethod("Card / Cash App");
                          setPaymentLink("https://www.homeplanet.city/pay/ridgeline");
                          setBeforePhotos([]);
                          setAfterPhotos([]);
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
                        setShowHeaderDetails(false);
                        setApprovedJobPrice("325");
                        setPaymentMethod("Card / Cash App");
                        setPaymentLink("https://www.homeplanet.city/pay/ridgeline");
                        setBeforePhotos([]);
                        setAfterPhotos([]);
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
          <aside className="ml-auto flex h-full w-full max-w-md flex-col border-l border-amber-300/20 bg-black p-5 shadow-2xl shadow-orange-950/40">
            <div className="relative rounded-2xl border border-amber-300/20 bg-orange-500/10 p-4 pr-16 shadow-[0_0_34px_rgba(249,115,22,0.08)]">
              <button
                onClick={() => {
                  setSelected(null);
                  setShowContactDetails(false);
                  setShowHeaderDetails(false);
                }}
                className="absolute right-4 top-4 rounded-xl border border-white/10 bg-white/10 p-3 hover:bg-white/15"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>

              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300">
                Active Workspace
              </p>

              <button
                type="button"
                onClick={() => setShowHeaderDetails((current) => !current)}
                className="mt-3 w-full text-left"
              >
                <h2 className="truncate whitespace-nowrap text-4xl font-black leading-tight">
                  {selected.name}
                </h2>
                <p className="mt-1 truncate text-xl font-black text-amber-300">{selected.service}</p>
                <p className="mt-1 truncate text-sm font-bold text-zinc-400">{selected.address}</p>
                <div className="mt-3 inline-flex rounded-full border border-amber-300/25 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
                  {showHeaderDetails ? "Hide Workspace Details" : "Show Workspace Details"}
                </div>
              </button>

              {showHeaderDetails ? (
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                  <a href={selected.phone ? `tel:${selected.phone}` : "#"} className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black">
                    <Phone className="mx-auto mb-1" size={16} />
                    Call
                  </a>
                  <a href={smsBody(selected.phone, buildFirstReplyText(selected))} className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black">
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
              ) : null}
            </div>

            <div className="mt-5 space-y-4 overflow-auto pb-6">
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <button
                  type="button"
                  onClick={() => setShowContactDetails((current) => !current)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-amber-200">
                      CONTACT / DETAILS
                    </p>
                    <p className="mt-2 text-sm font-bold text-zinc-300">
                      {selected.phone || "No phone"} • {selected.condition} • {selected.preferred}
                    </p>
                  </div>
                  <span className="rounded-full border border-amber-300/25 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
                    {showContactDetails ? "Hide" : "Show"}
                  </span>
                </button>

                {showContactDetails ? (
                  <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                    <div className="space-y-1 text-sm text-zinc-200">
                      <div>{selected.name}</div>
                      <div>{selected.phone || "No phone number provided"}</div>
                      <div>{selected.address}</div>
                    </div>

                    <div className="space-y-1 text-sm text-zinc-200">
                      <div>Service: {selected.service}</div>
                      <div>Condition: {selected.condition}</div>
                      <div>Access: {selected.access}</div>
                      <div>Preferred Time: {selected.preferred}</div>
                      <div>Preferred Crew: {selected.preferredTech}</div>
                      <div>Photos Attached: {selected.photos}</div>
                    </div>

                    {selected.notes && selected.notes !== "None" ? (
                      <div className="rounded-xl border border-yellow-300/20 bg-yellow-500/10 p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-200">
                          Customer Notes
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-200">{selected.notes}</p>
                      </div>
                    ) : null}

                    <div className="grid grid-cols-3 gap-2">
                      <a href={selected.phone ? `tel:${selected.phone}` : "#"} className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black">
                        <Phone className="mx-auto mb-1" size={16} />
                        Call
                      </a>
                      <a href={smsBody(selected.phone, buildFirstReplyText(selected))} className="rounded-xl border border-amber-300/30 bg-amber-500/10 py-3 text-center text-xs font-black">
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
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-orange-200">
                  INTELLIGENCE
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-200">
                  {selected.suggestion}
                </p>
                <div className="mt-4 rounded-xl border border-orange-300/20 bg-orange-500/10 p-3 text-sm font-bold leading-6 text-orange-100">
                  Pressure cleaning check: surface type, algae/grime level, oxidation risk, rust stains, water access, gate access, and whether photos are enough for a flat job price.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-amber-200">
                  ESTIMATE
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="font-bold text-yellow-300">Not Sent</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-400">Approved Job Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-400">$</span>
                      <input
                        value={approvedJobPrice}
                        onChange={(event) => setApprovedJobPrice(event.target.value)}
                        className="w-24 rounded-lg border border-amber-300/25 bg-black px-3 py-2 text-right font-black text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-zinc-400">Price Type</span>
                    <span className="font-black text-amber-100">Flat job price</span>
                  </div>
                </div>

                <a
                  href={smsBody(selected.phone, `Hi ${selected.name}, this is Ridgeline Pro Wash. Can you send a few clear photos of the areas you want cleaned? This helps us confirm the surface condition, access, and final flat job price before scheduling.`)}
                  className="mt-4 block rounded-xl bg-orange-500 py-3 text-center text-sm font-black text-black"
                >
                  Request Photos Text
                </a>

                <div className="mt-4 grid gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy("estimate draft copied", buildRidgelineEstimateText(selected, approvedJobPrice))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Estimate Draft
                  </button>

                  <a
                    href={smsBody(selected.phone, buildRidgelineEstimateText(selected, approvedJobPrice))}
                    className="rounded-xl bg-orange-500 py-3 text-center text-sm font-black text-black"
                  >
                    Send Estimate Text
                  </a>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
                  Next Move: Confirm photos/details, set the flat job price, then send estimate for approval.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-sky-200">
                  AGREEMENT / JOB APPROVAL
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Send the customer a simple confirmation before scheduling. Their YES reply becomes the approval record for the scope and flat job price.
                </p>

                <div className="mt-4 rounded-xl border border-sky-300/20 bg-sky-400/10 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Approved Price</span>
                    <span className="font-bold text-white">${approvedJobPrice}</span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-zinc-400">Price Type</span>
                    <span className="font-bold text-white">Flat job price</span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-zinc-400">Approval Needed</span>
                    <span className="font-bold text-sky-100">Customer YES</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy("approval text copied", buildRidgelineApprovalText(selected, approvedJobPrice))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Approval Text
                  </button>

                  <a
                    href={smsBody(selected.phone, buildRidgelineApprovalText(selected, approvedJobPrice))}
                    className="rounded-xl bg-sky-300 py-3 text-center text-sm font-black text-black"
                  >
                    Send Approval Text
                  </a>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-100">
                  Next Move: Wait for YES before confirming schedule.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-orange-200">
                  SCHEDULE
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="font-bold text-yellow-300">Not Scheduled</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Preferred</span>
                    <span className="font-bold">{selected.preferred}</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href={smsBody(selected.phone, buildScheduleText(selected))}
                    className="rounded-xl bg-orange-500 py-3 text-center text-sm font-black text-black"
                  >
                    Confirm Schedule Text
                  </a>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
                  Next Move: Book the job only after approval is confirmed.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-200">
                  WORK / PHOTOS
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Work Status</span>
                    <span className="font-bold text-yellow-300">Not Started</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Before Photos</span>
                    <span className="font-bold">{beforePhotos.length ? `${beforePhotos.length} Saved` : "Not Added"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">After Photos</span>
                    <span className="font-bold">{afterPhotos.length ? `${afterPhotos.length} Saved` : "Not Added"}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <label className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 py-3 text-center text-sm font-black text-cyan-100">
                    {uploadingPhotoType === "before" ? "Uploading..." : "Take Before"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(event) => {
                        handleRidgelinePhotoUpload("before", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <label className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 py-3 text-center text-sm font-black text-cyan-100">
                    Upload Before
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        handleRidgelinePhotoUpload("before", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <label className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 py-3 text-center text-sm font-black text-cyan-100">
                    {uploadingPhotoType === "after" ? "Uploading..." : "Take After"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(event) => {
                        handleRidgelinePhotoUpload("after", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <label className="rounded-xl border border-cyan-300/25 bg-cyan-400/10 py-3 text-center text-sm font-black text-cyan-100">
                    Upload After
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(event) => {
                        handleRidgelinePhotoUpload("after", event.target.files);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Before Photos</p>
                    {beforePhotos.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {beforePhotos.map((photo) => (
                          <div key={photo.id} className="overflow-hidden rounded-xl border border-white/10 bg-black">
                            <img src={photo.public_url} alt="Before pressure cleaning" className="h-28 w-full object-cover" />
                            <div className="grid grid-cols-3 gap-1 p-2 text-[10px] font-black">
                              <a href={photo.public_url} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 py-2 text-center">View</a>
                              <button type="button" onClick={() => handleCopy("photo link copied", photo.public_url)} className="rounded-lg bg-white/10 py-2">Copy</button>
                              <button type="button" onClick={() => removeRidgelinePhoto(photo)} className="rounded-lg bg-red-500/20 py-2 text-red-200">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-3 text-sm font-bold text-zinc-400">No before photos saved yet.</div>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">After Photos</p>
                    {afterPhotos.length ? (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {afterPhotos.map((photo) => (
                          <div key={photo.id} className="overflow-hidden rounded-xl border border-white/10 bg-black">
                            <img src={photo.public_url} alt="After pressure cleaning" className="h-28 w-full object-cover" />
                            <div className="grid grid-cols-3 gap-1 p-2 text-[10px] font-black">
                              <a href={photo.public_url} target="_blank" rel="noreferrer" className="rounded-lg bg-white/10 py-2 text-center">View</a>
                              <button type="button" onClick={() => handleCopy("photo link copied", photo.public_url)} className="rounded-lg bg-white/10 py-2">Copy</button>
                              <button type="button" onClick={() => removeRidgelinePhoto(photo)} className="rounded-lg bg-red-500/20 py-2 text-red-200">Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-3 text-sm font-bold text-zinc-400">No after photos saved yet.</div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-cyan-400/10 p-3 text-sm font-bold text-cyan-100">
                  Next Move: Capture before and after photos so the job proof stays with the request.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-green-200">
                  PAYMENT
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="font-bold text-yellow-300">Not Sent</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Amount Due</span>
                    <span className="font-bold">${approvedJobPrice}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-green-300/20 bg-green-500/10 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-zinc-300">Approved Job Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-400">$</span>
                      <input
                        value={approvedJobPrice}
                        onChange={(event) => setApprovedJobPrice(event.target.value)}
                        className="w-24 rounded-lg border border-green-300/25 bg-black px-3 py-2 text-right font-black text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-300">Final Amount Due</span>
                    <span className="text-2xl font-black text-green-200">${approvedJobPrice}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                  <label className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                    Payment Method
                  </label>
                  <input
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    placeholder="Card, Cash App, cash, etc."
                    className="mt-2 w-full rounded-lg border border-green-300/25 bg-black px-3 py-2 text-sm font-bold text-white outline-none"
                  />

                  <label className="mt-4 block text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                    Payment Link
                  </label>
                  <input
                    value={paymentLink}
                    onChange={(event) => setPaymentLink(event.target.value)}
                    placeholder="Payment link"
                    className="mt-2 w-full rounded-lg border border-green-300/25 bg-black px-3 py-2 text-sm font-bold text-white outline-none"
                  />

                  {paymentLink.trim() ? (
                    <div className="mt-4 flex items-center gap-4 rounded-xl bg-white p-3 text-black">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(paymentLink.trim())}`}
                        alt="Payment QR code"
                        className="h-28 w-28 rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-black">Payment QR Code</p>
                        <p className="mt-1 text-xs font-bold text-zinc-600">Updates from the payment link field.</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href={smsBody(selected.phone, buildRidgelinePaymentText(selected, approvedJobPrice, paymentMethod, paymentLink))}
                    className="rounded-xl border border-green-400/40 bg-green-500/10 py-3 text-center text-sm font-black text-green-100"
                  >
                    Send Payment Link Text
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy("payment note copied", buildRidgelinePaymentText(selected, approvedJobPrice, paymentMethod, paymentLink))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Payment Note
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
                  Next Move: Send payment link after the job is complete.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-yellow-200">
                  PROOF / REVIEW
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Proof Photos</span>
                    <span className="font-bold">{beforePhotos.length + afterPhotos.length ? `${beforePhotos.length + afterPhotos.length} Saved` : "Not Added"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Review</span>
                    <span className="font-bold text-yellow-300">Not Requested</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href={smsBody(selected.phone, buildRidgelineProofText(selected, beforePhotos, afterPhotos))}
                    className="rounded-xl bg-yellow-400 py-3 text-center text-sm font-black text-black"
                  >
                    Send Completion / Proof Text
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy("proof message copied", buildRidgelineProofText(selected, beforePhotos, afterPhotos))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Proof Message
                  </button>

                  <a
                    href={smsBody(selected.phone, buildReviewText(selected))}
                    className="rounded-xl bg-yellow-400 py-3 text-center text-sm font-black text-black"
                  >
                    Send Review Text
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy("post copied", buildSocialPost(selected))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    <Share2 className="mr-1 inline" size={14} />
                    Copy Proof Post
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
                  Next Move: Turn finished work into proof, review, and shareable media.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-zinc-300">
                  TIMELINE
                </p>

                <div className="mt-4 space-y-3 text-sm text-zinc-300">
                  <div>1. Request received</div>
                  <div>2. Details reviewed</div>
                  <div>3. Photos requested or reviewed</div>
                  <div>4. Flat job price sent</div>
                  <div>5. Customer approval received</div>
                  <div>6. Schedule confirmed</div>
                  <div>7. Before photos captured</div>
                  <div>8. Work completed</div>
                  <div>9. After photos captured</div>
                  <div>10. Payment sent / collected</div>
                  <div>11. Proof and review requested</div>
                </div>

                <button
                  onClick={() => deleteSignal(selected.id)}
                  className="mt-4 w-full rounded-xl border border-red-400/30 bg-red-500/10 py-3 text-sm font-black text-red-200"
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



















