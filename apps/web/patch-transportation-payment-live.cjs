const fs = require("fs");
const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

if (!text.includes("paymentMode, setPaymentMode")) {
  text = text.replace(
    '  const [drawerOpen, setDrawerOpen] = useState(false);',
    '  const [drawerOpen, setDrawerOpen] = useState(false);\n  const [paymentMode, setPaymentMode] = useState<"link" | "qr" | "tap" | "cash">("qr");'
  );
}

function liveButton(label, mode) {
  const re = new RegExp(
    `<button onClick=\\{\\(\\) => updateStatus\\(selectedRide\\.id, "Collect Payment"\\)\\} className="rounded-3xl border[^"]*p-5 text-left">\\s*<div className="text-lg font-black[^"]*">${label}<\\/div>`,
    "s"
  );

  text = text.replace(
    re,
    `<button onClick={() => { setPaymentMode("${mode}"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-3xl border p-5 text-left \${paymentMode === "${mode}" ? "border-emerald-400/60 bg-emerald-400/15" : "border-white/10 bg-black/40"}\`}>\n      <div className="text-lg font-black text-white">${label}</div>`
  );
}

liveButton("SEND PAYMENT LINK", "link");
liveButton("SHOW QR CODE", "qr");
liveButton("TAP TO PAY", "tap");
liveButton("CASH", "cash");

const blockRe = /<div className="mt-4 rounded-3xl border border-white\/10 bg-black\/50 p-4 text-center">[\s\S]*?<p className="mt-3 text-sm text-zinc-300">[\s\S]*?<\/p>\s*<\/div>\s*<button onClick=\{\(\) => updateStatus\(selectedRide\.id, "Paid"\)/;

const liveBlock = `{paymentMode === "link" ? (
  <div className="mt-4 rounded-3xl border border-white/10 bg-black/50 p-4">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Payment Link</p>
    <p className="mt-2 text-lg font-black text-emerald-300">Ready to text rider</p>
    <div className="mt-3 rounded-2xl bg-white/[0.05] p-3 text-sm text-zinc-200">
      Your ride payment link is ready: https://cash.app/$YourCashApp
    </div>
  </div>
) : paymentMode === "tap" ? (
  <div className="mt-4 rounded-3xl border border-white/10 bg-black/50 p-4 text-center">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Tap To Pay</p>
    <p className="mt-2 text-2xl font-black text-emerald-300">Ready on device</p>
    <p className="mt-3 text-sm text-zinc-300">Accept card payment on phone/device.</p>
  </div>
) : paymentMode === "cash" ? (
  <div className="mt-4 rounded-3xl border border-white/10 bg-black/50 p-4 text-center">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Cash Payment</p>
    <p className="mt-2 text-2xl font-black text-emerald-300">Cash received by driver</p>
    <p className="mt-3 text-sm text-zinc-300">Confirm once cash is in hand.</p>
  </div>
) : (
  <div className="mt-4 rounded-3xl border border-white/10 bg-black/50 p-4 text-center">
    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Scan-To-Pay</p>
    <p className="mt-2 text-2xl font-black text-emerald-300">$YourCashApp</p>
    <div className="mx-auto mt-4 grid h-40 w-40 grid-cols-5 grid-rows-5 gap-1 rounded-2xl bg-white p-3">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={i % 2 === 0 || i === 7 || i === 13 || i === 19 ? "bg-black" : "bg-white"} />
      ))}
    </div>
    <p className="mt-3 text-sm text-zinc-300">Customer scans this to pay.</p>
  </div>
)}

<button onClick={() => updateStatus(selectedRide.id, "Paid")`;

const next = text.replace(blockRe, liveBlock);

if (next === text) {
  console.log("Payment output block not found. No changes made.");
  process.exit(1);
}

fs.writeFileSync(path, next);
console.log("Payment Workspace cards are live.");
