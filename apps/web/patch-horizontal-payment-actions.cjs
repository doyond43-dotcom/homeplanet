const fs = require("fs");
const path = "./src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const oldBlock = `<div className="mt-4 grid gap-3">
    <button onClick={() => { setPaymentMode("link"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-3xl border p-5 text-left \${paymentMode === "link" ? "border-emerald-400/60 bg-emerald-400/15" : "border-white/10 bg-black/40"}\`}>
      <div className="text-lg font-black text-white">SEND PAYMENT LINK</div>
      <div className="mt-1 text-sm text-zinc-400">Text rider a payment link.</div>
    </button>

    <button onClick={() => { setPaymentMode("qr"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-3xl border p-5 text-left \${paymentMode === "qr" ? "border-emerald-400/60 bg-emerald-400/15" : "border-white/10 bg-black/40"}\`}>
      <div className="text-lg font-black text-white">SHOW QR CODE</div>
      <div className="mt-1 text-sm text-emerald-100/70">Customer scans your phone.</div>
    </button>

    <button onClick={() => { setPaymentMode("tap"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-3xl border p-5 text-left \${paymentMode === "tap" ? "border-emerald-400/60 bg-emerald-400/15" : "border-white/10 bg-black/40"}\`}>
      <div className="text-lg font-black text-white">TAP TO PAY</div>
      <div className="mt-1 text-sm text-zinc-400">Accept card payment on device.</div>
    </button>

    <button onClick={() => { setPaymentMode("cash"); updateStatus(selectedRide.id, "Collect Payment"); }} className={\`rounded-3xl border p-5 text-left \${paymentMode === "cash" ? "border-emerald-400/60 bg-emerald-400/15" : "border-white/10 bg-black/40"}\`}>
      <div className="text-lg font-black text-white">CASH</div>
      <div className="mt-1 text-sm text-zinc-400">Confirm cash received.</div>
    </button>
  </div>`;

const newBlock = `<div className="mt-4 grid grid-cols-4 gap-2">
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
  </div>`;

if (!text.includes(oldBlock)) {
  console.log("Payment button block not found. No changes made.");
  process.exit(1);
}

text = text.replace(oldBlock, newBlock);
fs.writeFileSync(path, text);
console.log("Payment actions changed to one-line row.");
