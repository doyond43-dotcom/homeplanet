import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import { hpEvent } from "../lib/hpEvent";

type RequestType = "book" | "question" | "reschedule" | "notes";

const labels: Record<RequestType, string> = {
  book: "Request Service",
  question: "Ask a Question",
  reschedule: "Reschedule / Update",
  notes: "Leave Job Notes",
};

export default function RidgelineRequestV2() {
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = useMemo(() => getSupabase(), []);

  useEffect(() => {
    if (window.__hp_request_opened) return;
    window.__hp_request_opened = true;

    hpEvent({
      event: "request_page_opened",
      board: "ridgeline"
    });
  }, []);

  const requestType = useMemo<RequestType>(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("type");
    if (t === "question" || t === "reschedule" || t === "notes") return t;
    return "book";
  }, [location.search]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [serviceType, setServiceType] = useState("");
  const [projectSize, setProjectSize] = useState("");
  const [accessGate, setAccessGate] = useState("");
  const [condition, setCondition] = useState("");
  const [accessDetails, setAccessDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);

    const formattedNotes = `
SERVICE TYPE
${serviceType}

PROJECT SIZE
${projectSize}

ACCESS / GATE
${accessGate}

CONDITION
${condition}

ACCESS DETAILS
${accessDetails}

CUSTOMER NOTES
${notes}
`.trim();


    const { error } = await supabase.from("cleaning_requests").insert({
      business_slug: "ridgeline",
      request_type: requestType,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_address: address.trim(),
      preferred_time: date.trim(),
      notes: formattedNotes,
      status: "new",
    });

    setBusy(false);

    if (error) {
      setErr(error.message || "Could not send request.");
      return;
    }

    const smsBody = encodeURIComponent(
  `New Ridgeline request\n\nType: ${labels[requestType]}\nName: ${name.trim()}\nPhone: ${phone.trim()}\nAddress: ${address.trim()}\nPreferred: ${date.trim()}\nNotes: ${notes.trim()}`
);

try {
  sessionStorage.setItem("ote:lastSmsLink", `sms:8638013179?body=${smsBody}`);
} catch {}

setSubmitted(true);

    hpEvent({
      event: "request_submitted",
      board: "ridgeline"
    });
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <section className="mx-auto max-w-xl rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
          <div className="text-xs uppercase tracking-[0.28em] text-amber-300/80">
            Request received
          </div>
          <h1 className="mt-3 text-3xl font-black">You're on the board.</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Your request was sent to Ridgeline and is ready for the organizer board.
          </p>
          <a
            href={sessionStorage.getItem("ote:lastSmsLink") || "sms:8638013179"}
            className="mt-6 block w-full rounded-2xl bg-white py-4 text-center font-bold text-black"
          >
            Text Ridgeline Now
          </a>

          <button
            onClick={() => navigate("/planet/ridgeline")}
            className="mt-3 w-full rounded-2xl border border-white/10 py-4 font-bold text-white/80"
          >
            Back to Ridgeline
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <section className="mx-auto max-w-xl">
        <button
          onClick={() => navigate("/planet/ridgeline")}
          className="mb-6 text-sm text-white/50 hover:text-white"
        >
          ? Back
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs uppercase tracking-[0.28em] text-amber-300/80">
            Ridgeline
          </div>
          <h1 className="mt-3 text-3xl font-black">{labels[requestType]}</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Tell us what you need. This sends a clean request into the live workflow.
          </p>

          {err ? (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100">
              {err}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address / area" className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white" />
            <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Preferred day / time" className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white" />
            <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white">
  <option value="">Select Service Type</option>
  <option>Pressure Washing</option>
  <option>Soft Wash / Exterior Cleaning</option>
  <option>Driveway / Walkway</option>
  <option>Patio / Screen Enclosure</option>
  <option>Recurring Maintenance</option>
  <option>Exterior Detail / Other</option>

</select>

<div className="grid grid-cols-2 gap-3">
  <input value={projectSize} onChange={(e) => setProjectSize(e.target.value)} placeholder="Project Size" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 outline-none focus:border-amber-300/40" />
  <input value={accessGate} onChange={(e) => setAccessGate(e.target.value)} placeholder="Access / Gate" className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 outline-none focus:border-amber-300/40" />
</div>

<select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white">
  <option value="">Current Condition</option>
  <option>Light Buildup</option>
  <option>Moderate Buildup</option>
  <option>Needs Site Review</option>
  <option>Heavy Buildup</option>
</select>

<select value={accessDetails} onChange={(e) => setAccessDetails(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-4 text-white outline-none focus:border-amber-300/40 [&>option]:bg-zinc-950 [&>option]:text-white">
  <option value="">Access Details</option>
  <option>Open Access</option>
  <option>Gate Code Needed</option>
  <option>Customer Must Be Home</option>
  <option>Limited Access</option>
</select>

<div className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-4 text-sm">
  <div className="font-bold text-amber-100">
    Most work is quoted after the request details are reviewed.
  </div>
  <div className="mt-1 text-white/70">
    Final pricing depends on size, condition, and requested services.
  </div>
</div>

<textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes, photos, access details, gate code, surface condition, or what changed" className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 outline-none focus:border-amber-300/40" />

            <button
              onClick={submit}
              disabled={busy}
              className="w-full rounded-2xl bg-white py-4 text-lg font-bold text-black disabled:opacity-60"
            >
              {busy ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}






















