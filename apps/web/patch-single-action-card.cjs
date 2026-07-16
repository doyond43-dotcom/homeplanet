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

  const current = steps.find((s) => s.status === selectedRide.status);

  if (!current) return null;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        Ride Journey
      </p>

      <button
        onClick={() => updateStatus(selectedRide.id, current.next)}
        className="mt-4 w-full rounded-3xl bg-emerald-400 px-6 py-6 text-left text-xl font-black text-black transition-all duration-200 active:scale-[0.98]"
      >
        {current.label}
      </button>
    </div>
  );
})()}

`;

text =
  text.substring(0, start) +
  replacement +
  text.substring(end);

fs.writeFileSync(path, text);

console.log("Single living action card installed.");
