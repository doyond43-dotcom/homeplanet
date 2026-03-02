import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type DbProjectType = "Awnings" | "Windows" | "Doors" | "Repair" | "Other";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function LiveAwnitIntake() {
  const BUSINESS = useMemo(
    () => ({
      name: "AWNIT",
      phoneDisplay: "(863) 634-3100",
      address: "3169 US-441, Okeechobee, FL 34974",
    }),
    []
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    project_type: "Awnings" as DbProjectType,
    best_time: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function submit() {
    setOkMsg(null);
    setErrMsg(null);

    const name = (form.name || "").trim();
    if (!name) {
      setErrMsg("Please enter your name.");
      return;
    }

    setSaving(true);
    try {
      const stampLines = [
        "Auto-Captured via /live/awnit",
        `Captured At: ${new Date().toISOString()}`,
        `User Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "-"}`,
      ];

      const payload = {
        name,
        phone: (form.phone || "").trim() || null,
        email: (form.email || "").trim() || null,
        address: (form.address || "").trim() || null,
        project_type: form.project_type,
        best_time: (form.best_time || "").trim() || null,
        notes: [
          ...stampLines,
          "",
          (form.notes || "").trim(),
        ]
          .join("\n")
          .trim() || null,
        // status defaults to 'New' in DB
        // created_at defaults now()
        // photo_urls defaults []
      };

      const { error } = await supabase.from("awnit_leads").insert([payload]);
      if (error) throw error;

      setOkMsg("Saved ✅ — AWNIT received your request. We’ll follow up soon.");
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
        project_type: "Awnings",
        best_time: "",
        notes: "",
      });
    } catch (err: any) {
      setErrMsg(err?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070d18] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-64 left-1/4 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <header className="relative z-20 border-b border-white/10 bg-[#070d18]/70 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 md:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center font-extrabold">
              A
            </div>
            <div className="min-w-0">
              <div className="font-extrabold truncate">{BUSINESS.name} — Live Intake</div>
              <div className="text-xs text-white/55 truncate">
                Quick capture while we’re on a job • No voicemail needed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${BUSINESS.phoneDisplay.replace(/[^\d]/g, "")}`}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10"
            >
              Call
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs font-extrabold tracking-widest text-emerald-300/80">LIVE INTAKE</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">Request a Quote</h1>
          <p className="mt-2 text-sm text-white/65">
            Fill this out in 30 seconds. It saves instantly so we can follow up safely after the job.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-bold text-white/60">Name *</div>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            <div>
              <div className="text-xs font-bold text-white/60">Phone</div>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                placeholder="(863) 555-1234"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-bold text-white/60">Email (optional)</div>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                placeholder="you@example.com"
                inputMode="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-bold text-white/60">Address</div>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                placeholder="Project address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-bold text-white/60">Project Type</div>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none focus:border-emerald-400/30"
                value={form.project_type}
                onChange={(e) => setForm((p) => ({ ...p, project_type: e.target.value as DbProjectType }))}
              >
                <option value="Awnings">Awnings</option>
                <option value="Windows">Windows</option>
                <option value="Doors">Doors</option>
                <option value="Repair">Repair</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-bold text-white/60">Best time to reach you</div>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                placeholder="Morning / Afternoon / After 5pm"
                value={form.best_time}
                onChange={(e) => setForm((p) => ({ ...p, best_time: e.target.value }))}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-bold text-white/60">Notes</div>
              <textarea
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                placeholder="What are you looking to do?"
                rows={6}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </div>

          {errMsg && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errMsg}
            </div>
          )}
          {okMsg && (
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              {okMsg}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className={cn(
                "rounded-xl bg-emerald-500/90 px-5 py-3 text-sm font-extrabold text-black hover:bg-emerald-400",
                saving && "opacity-70 cursor-not-allowed"
              )}
            >
              {saving ? "Saving..." : "Submit Request"}
            </button>

            <div className="text-xs text-white/50">
              Location: <span className="text-white/70">{BUSINESS.address}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
