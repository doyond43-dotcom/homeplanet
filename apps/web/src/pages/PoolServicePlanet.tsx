import { useState } from "react";

type RequestType = "cleaning" | "question" | "issue" | "reschedule";

export default function PoolServicePlanet() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<RequestType>("cleaning");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  function submit() {
    const payload = {
      id: Date.now(),
      status: "New Request",
      name:
        type === "cleaning"
          ? "Pool Cleaning Request"
          : type === "question"
          ? "Customer Question"
          : type === "issue"
          ? "Pool Issue Report"
          : "Reschedule Request",
      detail: details || "No details provided",
      time: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem("pool-demo-jobs") || "[]");
    localStorage.setItem(
      "pool-demo-jobs",
      JSON.stringify([payload, ...existing])
    );

    setOpen(false);
    setName("");
    setDetails("");
    alert("Request sent (demo)");
  }

  function openForm(t: RequestType) {
    setType(t);
    setOpen(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <section className="mx-auto max-w-5xl rounded-3xl border border-cyan-300/20 bg-white/10 p-8 shadow-2xl">
        <div className="mb-6 inline-flex rounded-full bg-cyan-300 px-4 py-1 text-sm font-black text-slate-950">
          POOL SERVICE FRONT DOOR
        </div>

        <h1 className="text-4xl font-black md:text-6xl">
          No missed pool visits. No scattered texts. No guessing.
        </h1>

        <p className="mt-5 text-lg text-slate-200">
          Request service, ask questions, or report an issue — everything gets captured
          and organized instantly.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <button onClick={() => openForm("cleaning")} className="rounded-2xl bg-white p-5 text-slate-950 text-left hover:scale-[1.02] transition">
            <div className="font-black">Request pool cleaning</div>
            <p className="text-sm text-slate-600 mt-2">Book service instantly</p>
          </button>

          <button onClick={() => openForm("question")} className="rounded-2xl bg-white p-5 text-slate-950 text-left hover:scale-[1.02] transition">
            <div className="font-black">Ask a question</div>
            <p className="text-sm text-slate-600 mt-2">No more waiting on texts</p>
          </button>

          <button onClick={() => openForm("issue")} className="rounded-2xl bg-white p-5 text-slate-950 text-left hover:scale-[1.02] transition">
            <div className="font-black">Report an issue</div>
            <p className="text-sm text-slate-600 mt-2">Green pool? Let us know</p>
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <a href="/planet/demo/pool-service" className="rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950">
            View Demo Live Board
          </a>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-black mb-4">New Request</h2>

            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2 border rounded"
            />

            <textarea
              placeholder="Details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex gap-2">
              <button onClick={submit} className="bg-cyan-500 text-white px-4 py-2 rounded">
                Submit
              </button>
              <button onClick={() => setOpen(false)} className="border px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}