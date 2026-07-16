const fs = require("fs");
const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const start = text.indexOf('{(() => {');
const end = text.indexOf('<div className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-4">', start);

if (start === -1 || end === -1) {
  console.log("Could not find action section.");
  process.exit(1);
}

const newSection = `{(() => {
  const steps = [
    { status: "Waiting", label: "I'm on my way", next: "En Route" },
    { status: "En Route", label: "Rider is with me", next: "Picked Up" },
    { status: "Picked Up", label: "We're at the destination", next: "Arrived" },
  ] as const;

  const currentStepIndex = steps.findIndex((step) => step.status === selectedRide.status);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        Ride Journey
      </p>

      <div className="mt-4 grid gap-2">
        {steps.map((step, index) => {
          const isDone = currentStepIndex === -1 || index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <button
              key={step.status}
              disabled={!isCurrent}
              onClick={() => updateStatus(selectedRide.id, step.next)}
              className={\`w-full rounded-2xl border px-4 py-4 text-left text-sm font-black transition \${isDone ? "border-emerald-400/20 bg-emerald-950/40 text-emerald-200" : isCurrent ? "border-emerald-300/70 bg-emerald-400 text-black shadow-lg shadow-emerald-500/20" : "border-white/10 bg-white/[0.03] text-zinc-500"}\`}
            >
              {isDone ? "? " : ""}{step.label}
            </button>
          );
        })}
      </div>
    </div>
  );
})()}


`;

text = text.slice(0, start) + newSection + text.slice(end);

text = text.replace(
  '<div className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-4">',
  '<div style={{ display: selectedRide.status === "Arrived" || selectedRide.status === "Collect Payment" || selectedRide.status === "Paid" ? undefined : "none" }} className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-4">'
);

text = text.replace(
  '<button onClick={() => updateStatus(selectedRide.id, "Completed")} className="mt-3 rounded-2xl bg-white px-4 py-4 text-sm font-black text-black">',
  '<button style={{ display: selectedRide.status === "Paid" ? undefined : "none" }} onClick={() => updateStatus(selectedRide.id, "Completed")} className="mt-3 rounded-2xl bg-white px-4 py-4 text-sm font-black text-black">'
);

fs.writeFileSync(path, text);
console.log("Ride Journey cards installed.");
