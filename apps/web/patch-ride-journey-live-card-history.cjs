const fs = require("fs");

const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const start = text.indexOf("{(() => {");
const end = text.indexOf('<div style={{ display: selectedRide.status === "Arrived"', start);

if (start === -1 || end === -1) {
  console.log("Ride Journey block not found. No changes made.");
  process.exit(1);
}

const replacement = `{(() => {
  const steps = [
    { status: "Waiting", label: "I'm on my way", next: "En Route" },
    { status: "En Route", label: "Rider is with me", next: "Picked Up" },
    { status: "Picked Up", label: "We're at the destination", next: "Arrived" },
  ] as const;

  const completedCount =
    selectedRide.status === "Waiting" ? 0 :
    selectedRide.status === "En Route" ? 1 :
    selectedRide.status === "Picked Up" ? 2 :
    3;

  const current = steps.find((s) => s.status === selectedRide.status);
  const completedSteps = steps.slice(0, completedCount);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        Ride Journey
      </p>

      {current ? (
        <button
          onClick={() => updateStatus(selectedRide.id, current.next)}
          className="mt-4 w-full rounded-3xl bg-emerald-400 px-6 py-6 text-left text-xl font-black text-black shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98]"
        >
          {current.label}
        </button>
      ) : null}

      {completedSteps.length > 0 ? (
        <div className="mt-3 grid gap-2">
          {completedSteps.map((step) => (
            <div
              key={step.status}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-950/40 px-5 py-4 text-sm font-black text-emerald-100"
            >
              ? {step.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
})()}

`;

text = text.substring(0, start) + replacement + text.substring(end);

fs.writeFileSync(path, text);

console.log("Ride Journey changed to one live card with completed steps underneath.");
