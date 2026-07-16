import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type PestRequest = {
  name: string;
  phone: string;
  address: string;
  issue: string;
  severity: string;
  seenAround: string;
  insideOutside: string;
  petsChildren: string;
  preferredTime: string;
  notes: string;
  createdAt: string;
  status: string;
};

const storageKey = "hp-slap-a-bug-requests";

export default function SlapABugRequestPage() {
  const [params] = useSearchParams();

  const [form, setForm] = useState<PestRequest>({
    name: "",
    phone: "",
    address: "",
    issue: params.get("issue") || "Not Sure",
    severity: "Moderate activity",
    seenAround: "Multiple areas",
    insideOutside: "Not sure",
    petsChildren: "",
    preferredTime: "",
    notes: "",
    createdAt: "",
    status: "New Request"
  });

  const [submitted, setSubmitted] = useState(false);

  const textMessage = useMemo(() => {
    return `Hey Brad, I submitted a pest request through your Slap A Bug page. I’m seeing ${form.issue} around ${form.seenAround}. My name is ${form.name || "[name]"}.`;
  }, [form.issue, form.seenAround, form.name]);

  function updateField(field: keyof PestRequest, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submitRequest(event: React.FormEvent) {
    event.preventDefault();

    const nextRequest = {
      ...form,
      createdAt: new Date().toISOString(),
      status: "New Request"
    };

    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([nextRequest, ...existing]));
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/planet/slap-a-bug" className="text-sm font-bold text-red-300">
          ← Back to Slap A Bug
        </Link>

        <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-300">
            Pest Request
          </p>
          <h1 className="mt-3 text-4xl font-black">Tell Brad What’s Going On</h1>
          <p className="mt-4 text-white/70">
            Send the pest details first so Brad can follow up without you explaining everything twice.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-3xl border border-green-500/25 bg-green-500/10 p-5">
              <h2 className="text-2xl font-black text-green-200">Request received.</h2>
              <p className="mt-3 text-white/75">
                Brad now has the details and can follow up with you.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/45">
                  Auto text direction
                </p>
                <p className="mt-3 text-sm leading-6 text-white/75">{textMessage}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link to="/planet/slap-a-bug/board" className="rounded-2xl bg-red-500 px-5 py-3 text-center font-black">
                  View Board
                </Link>
                <Link to="/planet/slap-a-bug" className="rounded-2xl border border-white/15 px-5 py-3 text-center font-black">
                  Back To Page
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submitRequest} className="mt-8 grid gap-4">
              <input className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 outline-none" placeholder="Name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
              <input className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 outline-none" placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} required />
              <input className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 outline-none" placeholder="Address / Area" value={form.address} onChange={(e) => updateField("address", e.target.value)} />

              <select className="rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none" value={form.issue} onChange={(e) => updateField("issue", e.target.value)}>
                {["Ants", "Roaches", "Spiders", "Fleas / Ticks", "Wasps / Hornets", "Rodents", "Mosquitoes", "General Pest Issue", "Not Sure"].map((item) => <option key={item}>{item}</option>)}
              </select>

              <select className="rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none" value={form.severity} onChange={(e) => updateField("severity", e.target.value)}>
                {["Light activity", "Moderate activity", "Heavy activity", "Infestation / urgent", "Not sure"].map((item) => <option key={item}>{item}</option>)}
              </select>

              <select className="rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none" value={form.seenAround} onChange={(e) => updateField("seenAround", e.target.value)}>
                {["Kitchen", "Bathroom", "Bedroom", "Garage", "Yard", "Porch / Entry", "Business / Office", "Multiple areas", "Other"].map((item) => <option key={item}>{item}</option>)}
              </select>

              <select className="rounded-2xl border border-white/10 bg-black px-4 py-4 outline-none" value={form.insideOutside} onChange={(e) => updateField("insideOutside", e.target.value)}>
                {["Inside", "Outside", "Both", "Not sure"].map((item) => <option key={item}>{item}</option>)}
              </select>

              <input className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 outline-none" placeholder="Pets or children in the home?" value={form.petsChildren} onChange={(e) => updateField("petsChildren", e.target.value)} />
              <input className="rounded-2xl border border-white/10 bg-black/45 px-4 py-4 outline-none" placeholder="Preferred time" value={form.preferredTime} onChange={(e) => updateField("preferredTime", e.target.value)} />
              <textarea className="min-h-32 rounded-2xl border border-white/10 bg-black/45 px-4 py-4 outline-none" placeholder="Notes optional" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />

              <button className="rounded-2xl bg-red-500 px-6 py-4 font-black text-white shadow-[0_0_30px_rgba(239,68,68,0.28)]">
                Send Pest Request
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
