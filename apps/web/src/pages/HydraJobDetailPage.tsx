import { useState } from "react";

const statuses = ["Assigned", "En Route", "Arrived", "Inspection In Progress", "Completed"];

type Finding = {
  type: string;
  severity: string;
  notes: string;
  photo?: string;
};

export default function HydraJobDetailPage() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [showFindingBox, setShowFindingBox] = useState(false);
  const [findingType, setFindingType] = useState("Sediment");
  const [severity, setSeverity] = useState("Medium");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState("");
  const [findings, setFindings] = useState<Finding[]>([]);

  const status = statuses[statusIndex];

  const advanceStatus = () => {
    setStatusIndex((current) =>
      current < statuses.length - 1 ? current + 1 : current
    );
  };

  const completeJob = () => {
    setStatusIndex(statuses.length - 1);
  };

  const saveFinding = () => {
    if (!notes.trim()) return;

    setFindings((current) => [
      ...current,
      {
        type: findingType,
        severity,
        notes,
        photo,
      },
    ]);

    setNotes("");
    setPhoto("");
    setFindingType("Sediment");
    setSeverity("Medium");
    setShowFindingBox(false);
  };

  return (
    <main className="min-h-screen bg-[#071427] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-5xl font-black">Treatment Plant 12A</h1>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="font-bold text-cyan-300">Status: {status}</p>

          <div className="mt-6 space-y-2 text-slate-300">
            <p>Technician: Mike Rodriguez</p>
            <p>Priority: High</p>
            <p>Location: Okeechobee Water District</p>
            <p>Last Inspection: 89 Days Ago</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={advanceStatus}
              disabled={status === "Completed"}
              className="rounded-full bg-cyan-300 px-5 py-3 font-black text-slate-950 disabled:opacity-40"
            >
              Advance Status
            </button>

            <button
              onClick={() => setShowFindingBox(true)}
              className="rounded-full border border-white/15 px-5 py-3 font-black"
            >
              Add Finding
            </button>

            <button
              onClick={completeJob}
              className="rounded-full border border-white/15 px-5 py-3 font-black"
            >
              Complete Job
            </button>
          </div>

          {showFindingBox && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-cyan-300">Finding Type</span>
                  <select
                    value={findingType}
                    onChange={(e) => setFindingType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                  >
                    <option>Sediment</option>
                    <option>Leak</option>
                    <option>Structural Concern</option>
                    <option>Valve Issue</option>
                    <option>Water Quality Concern</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-cyan-300">Severity</span>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </label>
              </div>

              <label className="mt-4 block">
                <span className="text-sm font-bold text-cyan-300">Notes</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe finding..."
                  className="mt-2 h-32 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-white"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-sm font-bold text-cyan-300">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPhoto(URL.createObjectURL(file));
                  }}
                  className="mt-2 block w-full text-sm text-slate-300"
                />
              </label>

              {photo && (
                <img
                  src={photo}
                  alt="Finding preview"
                  className="mt-4 h-44 w-full rounded-2xl object-cover"
                />
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={saveFinding}
                  className="rounded-full bg-cyan-300 px-5 py-3 font-black text-slate-950"
                >
                  Save Finding
                </button>

                <button
                  onClick={() => setShowFindingBox(false)}
                  className="rounded-full border border-white/15 px-5 py-3 font-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {findings.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-black">Findings</h2>

              <div className="space-y-4">
                {findings.map((finding, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="rounded-full bg-cyan-300 px-3 py-1 text-sm font-black text-slate-950">
                        {finding.type}
                      </p>
                      <p className="rounded-full border border-white/15 px-3 py-1 text-sm font-black">
                        {finding.severity}
                      </p>
                    </div>

                    <p className="mt-4 text-slate-200">{finding.notes}</p>

                    {finding.photo && (
                      <img
                        src={finding.photo}
                        alt="Finding"
                        className="mt-4 h-44 w-full rounded-2xl object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}