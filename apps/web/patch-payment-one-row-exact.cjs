const fs = require("fs");

const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const start = text.indexOf('  <div className="mt-4 grid gap-3">');
const end = text.indexOf('  {paymentMode === "link" ? (', start);

if (start === -1 || end === -1) {
  console.log("Payment action button block not found. No changes made.");
  process.exit(1);
}

const replacement = `  <div className="mt-4 grid grid-cols-4 gap-2">
    <button onClick={() => { setPaymentMode("link"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-2xl border px-2 py-3 text-center text-[11px] font-black uppercase \${paymentMode === "link" ? "border-emerald-400/60 bg-emerald-400 text-black" : "border-white/10 bg-black/40 text-zinc-300"}\`}>
      Text
    </button>

    <button onClick={() => { setPaymentMode("qr"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-2xl border px-2 py-3 text-center text-[11px] font-black uppercase \${paymentMode === "qr" ? "border-emerald-400/60 bg-emerald-400 text-black" : "border-white/10 bg-black/40 text-zinc-300"}\`}>
      QR
    </button>

    <button onClick={() => { setPaymentMode("tap"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-2xl border px-2 py-3 text-center text-[11px] font-black uppercase \${paymentMode === "tap" ? "border-emerald-400/60 bg-emerald-400 text-black" : "border-white/10 bg-black/40 text-zinc-300"}\`}>
      Tap
    </button>

    <button onClick={() => { setPaymentMode("cash"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-2xl border px-2 py-3 text-center text-[11px] font-black uppercase \${paymentMode === "cash" ? "border-emerald-400/60 bg-emerald-400 text-black" : "border-white/10 bg-black/40 text-zinc-300"}\`}>
      Cash
    </button>
  </div>

`;

text = text.slice(0, start) + replacement + text.slice(end);

fs.writeFileSync(path, text);
console.log("Payment actions are now one horizontal row.");
