import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

const demoRequests: PestRequest[] = [
  {
    name: "Maria Lopez",
    phone: "863-555-0144",
    address: "Okeechobee",
    issue: "Roaches",
    severity: "Infestation / urgent",
    seenAround: "Kitchen",
    insideOutside: "Inside",
    petsChildren: "Two dogs",
    preferredTime: "Tomorrow morning",
    notes: "Seeing them mostly at night near the sink.",
    createdAt: new Date().toISOString(),
    status: "New Request"
  },
  {
    name: "Tom Jenkins",
    phone: "863-555-0198",
    address: "Taylor Creek",
    issue: "Ants",
    severity: "Moderate activity",
    seenAround: "Porch / Entry",
    insideOutside: "Both",
    petsChildren: "No pets",
    preferredTime: "Friday afternoon",
    notes: "Trail coming in by the front door.",
    createdAt: new Date().toISOString(),
    status: "Needs Review"
  }
];

export default function SlapABugBoardPage() {
  const requests = useMemo<PestRequest[]>(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return saved.length ? saved : demoRequests;
  }, []);

  const [active, setActive] = useState<PestRequest | null>(requests[0] || null);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="border-b border-white/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/planet/slap-a-bug" className="text-sm font-bold text-red-300">← Public Page</Link>
            <h1 className="mt-2 text-3xl font-black">Slap A Bug Board</h1>
            <p className="text-sm text-white/55">Awareness cards on the left. Active drawer on the right.</p>
          </div>
          <Link to="/planet/slap-a-bug/intelligence" className="rounded-2xl border border-white/15 px-5 py-3 text-center font-black">
            Intelligence
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[390px_1fr]">
        <div className="grid gap-4">
          {requests.map((request, index) => (
            <button
              key={`${request.name}-${index}`}
              onClick={() => setActive(request)}
              className={`rounded-3xl border p-5 text-left transition ${
                active === request ? "border-red-400/60 bg-red-500/10" : "border-white/10 bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{request.name || "New Customer"}</h2>
                  <p className="mt-1 text-sm text-white/55">{request.address || "Area not added"}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/65">
                  {request.status}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-white/70">
                <p><span className="text-white/40">Issue:</span> {request.issue}</p>
                <p><span className="text-white/40">Severity:</span> {request.severity}</p>
                <p><span className="text-white/40">Seen:</span> {request.seenAround} · {request.insideOutside}</p>
                <p><span className="text-white/40">Preferred:</span> {request.preferredTime || "Not set"}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          {active ? (
            <>
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-300">Active Drawer</p>
                  <h2 className="mt-2 text-3xl font-black">{active.name || "New Customer"}</h2>
                  <p className="mt-1 text-white/55">{active.issue} · {active.severity}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${active.phone}`} className="rounded-2xl bg-red-500 px-4 py-3 text-sm font-black">Call</a>
                  <a href={`sms:${active.phone}`} className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-black">Text</a>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {[
                  ["Customer Info", `${active.phone || "No phone"} · ${active.address || "No address"}`],
                  ["Pest Details", `${active.issue} · ${active.severity} · ${active.seenAround} · ${active.insideOutside}`],
                  ["Photos", "Photo upload placeholder for customer proof before visit."],
                  ["Estimate / Service Plan", "Build the visit plan, service recommendation, or recurring option here."],
                  ["Schedule", active.preferredTime || "Preferred time not set yet."],
                  ["Messages / Auto Text", `Hey Brad, I submitted a pest request through your Slap A Bug page. I’m seeing ${active.issue} around ${active.seenAround}. My name is ${active.name}.`],
                  ["Payment", "Send payment link, mark cash, or complete payment after service."],
                  ["Notes", active.notes || "No notes yet."],
                  ["Timeline", "New Request → Needs Review → Estimate Sent → Scheduled → In Progress → Follow-Up Needed → Completed"]
                ].map(([title, body]) => (
                  <section key={title} className="rounded-3xl border border-white/10 bg-black/35 p-5">
                    <h3 className="text-lg font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/65">{body}</p>
                  </section>
                ))}
              </div>
            </>
          ) : (
            <p>No request selected.</p>
          )}
        </div>
      </section>
    </main>
  );
}
