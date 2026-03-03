import { useMemo, useState } from "react";
import { awnitCreateJob } from "../lib/awnitJobsApi";

/**
 * AWNIT Intake (Create Job)
 * - Creates a job in public.awnit_jobs
 * - Then navigates back to the board
 */

export default function AwnitIntake() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [summary, setSummary] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return customerName.trim().length > 0 && summary.trim().length > 0;
  }, [customerName, summary]);

  async function handleSubmit() {
    if (!canSubmit || submitting) return;

    try {
      setErr(null);
      setSubmitting(true);

      // Minimal schema-safe payload
      // IMPORTANT: api maps apptDate->appt_date if you add later
      await awnitCreateJob({
        title: summary.trim().slice(0, 48),
        summary: summary.trim(),
        stage: "Scheduled",
        customer: {
          name: customerName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
      });

      window.location.assign("/planet/vehicles/awnit-demo");
    } catch (e: any) {
      setErr(e?.message || "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="text-2xl font-extrabold">AWNIT — Intake</div>
          <div className="mt-1 text-sm text-white/60">
            Create a new job request (customer + address + notes).
          </div>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-1 gap-3">
            <label className="text-sm font-bold text-white/70">
              Customer Name
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Smith"
              />
            </label>

            <label className="text-sm font-bold text-white/70">
              Phone
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 555-5555"
              />
            </label>

            <label className="text-sm font-bold text-white/70">
              Address
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Okeechobee, FL"
              />
            </label>

            <label className="text-sm font-bold text-white/70">
              Request / Notes
              <textarea
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="What do they need? Any measurements, photos, access notes…"
                rows={6}
              />
            </label>

            <button
              type="button"
              className="mt-2 rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black disabled:opacity-50"
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
              title="Submit request"
            >
              {submitting ? "Submitting…" : "Submit Request"}
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
