const fs = require("fs");
const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const rideStart = text.indexOf("  const RideWorkspace =");
const target = "    if (!selectedRide) return null;";
const insertAt = text.indexOf(target, rideStart);

if (rideStart === -1 || insertAt === -1) {
  console.log("RideWorkspace target not found. No changes made.");
  process.exit(1);
}

const rideSlice = text.slice(rideStart, text.indexOf("  return (", rideStart));

if (!rideSlice.includes("const cashAppDisplay")) {
  const insert = `    if (!selectedRide) return null;

    const cashAppHandle = driverSettings.cashApp.replace(/^\\$/, "") || "YourCashApp";
    const cashAppDisplay = \`$\${cashAppHandle}\`;
    const cashAppLink = \`https://cash.app/$\${cashAppHandle}\`;
    const paymentText = driverSettings.paymentMessage
      .replace("{{businessName}}", driverSettings.businessName)
      .replace("{{paymentLink}}", cashAppLink);
    const paymentSmsLink = \`sms:\${selectedRide.phone}?&body=\${encodeURIComponent(paymentText)}\`;`;

  text = text.slice(0, insertAt) + insert + text.slice(insertAt + target.length);
}

fs.writeFileSync(path, text);
console.log("cashAppDisplay fixed inside RideWorkspace.");
