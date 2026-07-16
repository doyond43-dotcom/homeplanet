const fs = require("fs");
const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("const rideStages =")) {
  text = text.replace(
    "  const RideWorkspace = ({ mobile = false }: { mobile?: boolean }) => {",
    `  const rideStages = ["Waiting", "En Route", "Picked Up", "Arrived", "Paid"] as RideStatus[];

  function rideStageIndex(status: RideStatus) {
    if (status === "Completed") return rideStages.length - 1;
    if (status === "Collect Payment") return 3;
    const index = rideStages.indexOf(status);
    return index === -1 ? 0 : index;
  }

  const RideWorkspace = ({ mobile = false }: { mobile?: boolean }) => {`
  );
}

const oldBlock = `
{(() => {
  const nextAction = getNextRideAction(selectedRide.status);

  if (!nextAction) return null;

  return (
    <button
      onClick={() => updateStatus(selectedRide.id, nextAction.next)}
      className="w-full rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black"
    >
      {nextAction.label}
    </button>
  );
})()}
`;

const newBlock = `
{(() => {
  const nextAction = getNextRideAction(selectedRide.status);
  const currentIndex = rideStageIndex(selectedRide.status);
  const markerLeft = \`\${(currentIndex / (rideStages.length - 1)) * 100}%\`;

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/40 p-4">
      <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
        {rideStages.map((stage) => (
          <span key={stage}>{stage}</span>
        ))}
      </div>

      <div className="relative mt-4 h-7">
        <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-white/10" />
        <div
          className="absolute left-0 top-3 h-1 rounded-full bg-emerald-400 transition-all duration-200"
          style={{ width: markerLeft }}
        />
        <div
          className="absolute top-0 h-7 w-7 -translate-x-1/2 rounded-full border border-emerald-300 bg-emerald-400 shadow-lg shadow-emerald-500/30 transition-all duration-200"
          style={{ left: markerLeft }}
        />
      </div>

      <p className="mt-2 text-center text-sm font-black text-white">
        Current: {selectedRide.status}
      </p>

      {nextAction ? (
        <button
          onClick={() => updateStatus(selectedRide.id, nextAction.next)}
          className="mt-4 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black"
        >
          {nextAction.label}
        </button>
      ) : null}
    </div>
  );
})()}
`;

if (!text.includes(oldBlock.trim())) {
  console.log("Next Action block not found. No changes made.");
  process.exit(1);
}

text = text.replace(oldBlock, newBlock);
fs.writeFileSync(path, text);
console.log("Horizontal progress added above Next Action.");
