const fs = require("fs");
const path = "src/pages/HomePlanetTransportationPage.tsx";
let text = fs.readFileSync(path, "utf8");

const start = text.indexOf("  const RideWorkspace = ({ mobile = false }");
const end = text.indexOf("  return (", start);

if (start === -1 || end === -1) {
  console.log("RideWorkspace block not found. No changes made.");
  process.exit(1);
}

const replacement = `  const rideStages = ["Waiting", "En Route", "Picked Up", "Arrived", "Paid"] as RideStatus[];

  function rideStageIndex(status: RideStatus) {
    if (status === "Completed") return rideStages.length - 1;
    const index = rideStages.indexOf(status);
    return index === -1 ? 0 : index;
  }

  const RideWorkspace = ({ mobile = false }: { mobile?: boolean }) => {
    if (!selectedRide) return null;

    const nextAction = getNextRideAction(selectedRide.status);
    const currentIndex = rideStageIndex(selectedRide.status);
    const markerLeft = \`\${(currentIndex / (rideStages.length - 1)) * 100}%\`;
    const showPaymentWorkspace =
      selectedRide.status === "Arrived" ||
      selectedRide.status === "Collect Payment";
    const showCompleteRide = selectedRide.status === "Paid";

    return (
      <article className={\`\${mobile ? "" : "hidden lg:block"} rounded-[2rem] border border-emerald-400/20 bg-black/35 p-5\`}>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
          Ride Workspace
        </p>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black">{selectedRide.name}</h2>
            <p className="mt-1 text-zinc-400">{selectedRide.time}</p>
          </div>
          <span className={\`rounded-full border px-3 py-1 text-xs font-black \${statusClass(selectedRide.status)}\`}>
            {selectedRide.status}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl bg-white/[0.05] p-4">
            <p className="text-sm text-zinc-400">Pickup</p>
            <p className="text-lg font-bold">{selectedRide.pickup}</p>
          </div>

          <div className="rounded-2xl bg-white/[0.05] p-4">
            <p className="text-sm text-zinc-400">Destination</p>
            <p className="text-lg font-bold">{selectedRide.destination}</p>
          </div>

          <div className="rounded-2xl bg-white/[0.05] p-4">
            <p className="text-sm text-zinc-400">Trip</p>
            <p className="text-lg font-bold">{selectedRide.tripType}</p>
          </div>

          {selectedRide.notes && (
            <div className="rounded-2xl bg-white/[0.05] p-4">
              <p className="text-sm text-zinc-400">Notes</p>
              <p className="text-lg font-bold">{selectedRide.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <a href={\`tel:\${selectedRide.phone}\`} className="rounded-2xl bg-white/10 px-3 py-4 text-center text-xs font-black">
            Call
          </a>
          <a href={\`sms:\${selectedRide.phone}\`} className="rounded-2xl bg-white/10 px-3 py-4 text-center text-xs font-black">
            Text
          </a>
          <a href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(selectedRide.pickup)}\`} className="rounded-2xl bg-emerald-400 px-3 py-4 text-center text-xs font-black text-black">
            Navigate
          </a>
        </div>

        <div className="mt-5 rounded-[2rem] border border-white/10 bg-black/40 p-4">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            Ride Progress
          </p>

          <div className="mt-4 flex justify-between text-[10px] font-black uppercase text-zinc-500">
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
        </div>

        {!showPaymentWorkspace && !showCompleteRide && nextAction ? (
          <div className="mt-4">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              Next Action
            </p>
            <button
              onClick={() => updateStatus(selectedRide.id, nextAction.next)}
              className="w-full rounded-2xl bg-emerald-400 px-5 py-4 text-sm font-black text-black"
            >
              {nextAction.label}
            </button>
          </div>
        ) : null}

        {showPaymentWorkspace ? (
          <div className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              Payment Workspace
            </p>

            <p className="mt-3 text-sm text-zinc-300">
              Choose how to collect payment.
            </p>

            <div className="mt-4 grid gap-3">
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
            </div>

            {paymentMode === "link" ? (
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

            <button onClick={() => updateStatus(selectedRide.id, "Paid")} className="mt-4 w-full rounded-2xl bg-emerald-400 px-4 py-4 text-sm font-black text-black">
              Payment Received
            </button>
          </div>
        ) : null}

        {showCompleteRide ? (
          <div className="mt-4 rounded-[2rem] border border-emerald-400/20 bg-white/[0.04] p-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
              Ride Paid
            </p>
            <button onClick={() => updateStatus(selectedRide.id, "Completed")} className="mt-3 w-full rounded-2xl bg-white px-4 py-4 text-sm font-black text-black">
              Complete Ride
            </button>
          </div>
        ) : null}
      </article>
    );
  };

`;

const next = text.slice(0, start) + replacement + text.slice(end);
fs.writeFileSync(path, next);
console.log("RideWorkspace rewritten with horizontal progress.");
