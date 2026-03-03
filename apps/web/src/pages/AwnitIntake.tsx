import { useMemo, useState } from "react";

/**
 * AWNIT Intake (Create Job)
 * - You will paste the full intake UI here.
 * - This file exists so routes/imports can point to it cleanly.
 */

export default function AwnitIntake() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [summary, setSummary] = useState("");

  const canSubmit = useMemo(() => {
    return customerName.trim().length > 0 && summary.trim().length > 0;
  }, [customerName, summary]);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          <div className="text-2xl font-extrabold">AWNIT — Intake</div>
          <div className="mt-1 text-sm text-white/60">
            Create a new job request (customer + address + notes).
          </div>

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
              onClick={() => alert("Stub: wire submit to Supabase + navigate back to board.")}
              title="Submit request"
            >
              Submit Request (stub)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
