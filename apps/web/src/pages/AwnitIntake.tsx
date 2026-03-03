import { useMemo, useState } from "react";
import { awnitCreateJob } from "../lib/awnitJobsApi";

/**
 * AWNIT Intake (Create Job) — Supabase-backed
 * Single source of truth: public.awnit_jobs
 *
 * This creates a real job row and then routes back to:
 *   /planet/vehicles/awnit-demo
 *
 * NOTE: Column naming
 * This file sends fields like: customer, apptDate, apptTime, meta
 * If your DB uses snake_case (customer_name, appt_date, etc),
 * adjust the payload keys here to match your real table.
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

  async function handleSubmit() {
    if (!canSubmit) return;

    setSubmitting(true);
    setErr(null);

    try {
      const payload = {
        // minimal required (you can evolve later)
        title: `${customerName.trim()} — Request`,
        summary: summary.trim(),
        stage: "Scheduled",

        // DB lock-in columns
        scope_items: [],
        materials: [],
        tech_notes: "",

        // customer object per your architecture lock-in
        customer: {
          name: customerName.trim(),
          phone: phone.trim() || null,
          address: address.trim() || null,
        },

        // appointment fields (optional here; can be added to intake later)
        // Keeping them present as null so the shape is consistent.
        apptDate: null,
        apptTime: null,

        meta: {
          source: "awnit-intake",
          createdAt: new Date().toISOString(),
        },
      };

      const created = await awnitCreateJob(payload);

      // Route back to the board (no react-router dependency required)
      // Optional: include selection param if you want to auto-open created job later.
      window.location.assign(`/planet/vehicles/awnit-demo?job=${encodeURIComponent(created.id)}`);
    } catch (e: any) {
      setErr(e?.message || "Create job failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="text-2xl font-extrabold">AWNIT — Intake</div>
          <div className="mt-1 text-sm text-white/60">Create a new job request (customer + address + notes).</div>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">
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
              disabled={!canSubmit}
              onClick={handleSubmit}
              title="Submit request"
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </button>

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10"
              onClick={() => window.location.assign("/planet/vehicles/awnit-demo")}
              title="Back to board"
            >
              Back to Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}