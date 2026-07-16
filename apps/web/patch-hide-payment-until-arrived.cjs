const fs = require("fs");
const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const start = text.indexOf('          <div className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-4">');
const endMarker = '<button onClick={() => updateStatus(selectedRide.id, "Completed")} className="mt-3 rounded-2xl bg-white px-4 py-4 text-sm font-black text-black">';
const endStart = text.indexOf(endMarker, start);

if (start === -1 || endStart === -1) {
  console.log("Payment Workspace block not found. No changes made.");
  process.exit(1);
}

const buttonEnd = text.indexOf("</button>", endStart) + "</button>".length;
const paymentBlock = text.slice(start, buttonEnd);

const wrapped = `          {(selectedRide.status === "Arrived" || selectedRide.status === "Collect Payment" || selectedRide.status === "Paid") ? (
${paymentBlock}
          ) : null}`;

const next = text.slice(0, start) + wrapped + text.slice(buttonEnd);

fs.writeFileSync(path, next);
console.log("Payment Workspace hidden until Arrived.");
