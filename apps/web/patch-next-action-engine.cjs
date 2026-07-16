const fs = require("fs");

const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

// Add helper if it doesn't exist
if (!text.includes("function getNextRideAction")) {
  const marker = "function updateStatus(id: number, status: RideStatus) {";

  const helper = `
function getNextRideAction(status: RideStatus): { label: string; next: RideStatus } | null {
  switch (status) {
    case "Waiting":
      return { label: "Driver En Route", next: "En Route" };

    case "En Route":
      return { label: "Passenger Picked Up", next: "Picked Up" };

    case "Picked Up":
      return { label: "Arrived", next: "Arrived" };

    case "Paid":
      return { label: "Complete Ride", next: "Completed" };

    default:
      return null;
  }
}

`;

  text = text.replace(marker, helper + marker);
}

// Replace the old status buttons block
const buttonBlock =
/<button[\s\S]*?Driver En Route[\s\S]*?<\/button>[\s\S]*?<button[\s\S]*?Passenger Picked Up[\s\S]*?<\/button>[\s\S]*?<button[\s\S]*?Arrived[\s\S]*?<\/button>/;

const replacement = `
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

text = text.replace(buttonBlock, replacement);

fs.writeFileSync(path, text);

console.log("Next Action engine installed.");
