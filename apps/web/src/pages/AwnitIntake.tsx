import { useMemo, useState } from "react";
import { awnitCreateJob } from "../lib/awnitJobsApi";

/**
 * AWNIT Intake (Create Job)
 * Fixes:
 * - Placeholders are DOTS (not fake real text)
 * - Clear errors when typing
 * - Always send NOT-NULL-safe defaults: scope_items: [], materials: [], tech_notes: "", meta: {}
 */
export default function AwnitIntake() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [summary, setSummary] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return customerName.trim().length > 0 && summary.trim().length > 0 && !submitting;
  }, [customerName, summary, submitting]);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none " +
    "placeholder:text-white/25 placeholder:tracking-widest focus:border-emerald-400/40";

  const textareaClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none " +
    "placeholder:text-white/25 placeholder:tracking-widest focus:border-emerald-400/40";

  function clearErr() {
    if (err) setErr(null);
  }

  async function handleSubmit() {
    if (!canSubmit) return;

    const name = customerName.trim();
    const notes = summary.trim();

    if (!name || !notes) {
      setErr("Customer name and request/notes are required.");
      return;
    }

    try {
      setSubmitting(true);
      setErr(null);

      const payload = {
        customer_name: name,
        customer_phone: phone.trim() || null,
        customer_address: address.trim() || null,
        customer_email: null,

        title: notes.slice(0, 48) || "Job",
        summary: notes,
        stage: "Scheduled",

        appt_date: null,
        appt_time: null,
        crew: null,

        scope_items: [],
        materials: [],
        tech_notes: "",

        // IMPORTANT: NOT NULL-safe object
        meta: {},
      };

      console.log("[AWNIT intake] submit payload:", payload);

      await awnitCreateJob(payload as any);

      window.location.assign("/planet/vehicles/awnit-demo");
    } catch (e: any) {
      setErr(e?.message || "Submit failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="text-2xl font-extrabold">AWNIT Intake</div>
          <div className="mt-1 text-sm text-white/60">Create a new job request.</div>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-3">
            <label className="text-sm font-bold text-white/70">
              Customer Name <span className="text-red-300">*</span>
              <input
                className={inputClass}
                value={customerName}
                onChange={(e) => {
                  clearErr();
                  setCustomerName(e.target.value);
                }}
                placeholder="                  "
              />
            </label>

            <label className="text-sm font-bold text-white/70">
              Phone
              <input
                className={inputClass}
                value={phone}
                onChange={(e) => {
                  clearErr();
                  setPhone(e.target.value);
                }}
                placeholder="                  "
              />
            </label>

            <label className="text-sm font-bold text-white/70">
              Address
              <input
                className={inputClass}
                value={address}
                onChange={(e) => {
                  clearErr();
                  setAddress(e.target.value);
                }}
                placeholder="                  "
              />
            </label>

            <label className="text-sm font-bold text-white/70">
              Request / Notes <span className="text-red-300">*</span>
              <textarea
                className={textareaClass}
                value={summary}
                onChange={(e) => {
                  clearErr();
                  setSummary(e.target.value);
                }}
                placeholder="                                  "
                rows={6}
              />
            </label>

            <button
              type="button"
              className="mt-2 rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold text-white/80 hover:bg-white/10"
              onClick={() => window.location.assign("/planet/vehicles/awnit-demo")}
            >
              Back to Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}