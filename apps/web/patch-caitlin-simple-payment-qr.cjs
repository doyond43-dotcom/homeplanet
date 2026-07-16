const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-simple-payment-link-qr", raw);

// Add payment method/link state after actualHours
raw = raw.replace(
`const [actualHours, setActualHours] = useState("5");`,
`const [actualHours, setActualHours] = useState("5");
  const [paymentMethod, setPaymentMethod] = useState("Cash App");
  const [paymentLink, setPaymentLink] = useState("https://cash.app/$OnlyTheEssentials");`
);

// Reset payment fields when selecting a request
raw = raw.replaceAll(
`setActualHours("5");`,
`setActualHours("5");
                      setPaymentMethod("Cash App");
                      setPaymentLink("https://cash.app/$OnlyTheEssentials");`
);

// Make estimate message say "to" instead of dash for hours
raw = raw.replaceAll(
`Estimated time: \${estimatedLowHours}-\${estimatedHighHours} hours`,
`Estimated time: \${estimatedLowHours} to \${estimatedHighHours} hours`
);

raw = raw.replaceAll(
`Estimated hours: \${estimatedLowHours}-\${estimatedHighHours} hours`,
`Estimated hours: \${estimatedLowHours} to \${estimatedHighHours} hours`
);

// Make agreement message say "to" instead of dash for hours
raw = raw.replaceAll(
`Estimated time: \${estimatedLowHours}-\${estimatedHighHours} hours`,
`Estimated time: \${estimatedLowHours} to \${estimatedHighHours} hours`
);

// Update payment text function to include payment method/link
const paymentStart = raw.indexOf("function buildPaymentText(");
const paymentEnd = raw.indexOf("\n\nfunction buildProofText(", paymentStart);

if (paymentStart === -1 || paymentEnd === -1) {
  throw new Error("Could not find buildPaymentText block.");
}

const newPaymentFunction = `function buildPaymentText(signal: Signal, hourlyRate = "40", actualHours = "5", paymentMethod = "Cash App", paymentLink = "") {
  const finalAmount = moneyFromHours(hourlyRate, actualHours);
  const payLine = paymentLink.trim()
    ? \`Payment link: \${paymentLink.trim()}\`
    : "I can send the payment link here once everything is confirmed.";

  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Your cleaning is complete and ready for payment.

Rate: $\${hourlyRate}/hr
Actual hours worked: \${actualHours} hours
Amount due: \${finalAmount}
Payment method: \${paymentMethod}

\${payLine}

Thank you.\`;
}`;

raw = raw.slice(0, paymentStart) + newPaymentFunction + raw.slice(paymentEnd);

// Update payment calls
raw = raw.replaceAll(
`buildPaymentText(selected, hourlyRate, actualHours)`,
`buildPaymentText(selected, hourlyRate, actualHours, paymentMethod, paymentLink)`
);

// Clean visible estimate labels
raw = raw.replaceAll("Hourly Rate / Estimated Hours", "Hourly Rate");
raw = raw.replaceAll("{estimatedLowHours}-{estimatedHighHours} hrs", "{estimatedLowHours} to {estimatedHighHours} hrs");

// Replace the compact estimate input row with clearer labels
raw = raw.replace(
`<span className="text-zinc-400">Hourly Rate</span>
      <div className="flex items-center gap-2">
        <input
          value={hourlyRate}
          onChange={(event) => setHourlyRate(event.target.value)}
          className="w-16 rounded-lg border border-pink-300/25 bg-black px-2 py-2 text-right font-bold text-white outline-none"
        />
        <span className="text-xs font-bold text-zinc-400">/hr</span>
        <input
          value={estimatedLowHours}
          onChange={(event) => setEstimatedLowHours(event.target.value)}
          className="w-12 rounded-lg border border-pink-300/25 bg-black px-2 py-2 text-right font-bold text-white outline-none"
        />
        <span className="text-zinc-500">-</span>
        <input
          value={estimatedHighHours}
          onChange={(event) => setEstimatedHighHours(event.target.value)}
          className="w-12 rounded-lg border border-pink-300/25 bg-black px-2 py-2 text-right font-bold text-white outline-none"
        />
        <span className="text-xs font-bold text-zinc-400">hrs</span>
      </div>`,
`<span className="text-zinc-400">Hourly Rate</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-zinc-400">$</span>
        <input
          value={hourlyRate}
          onChange={(event) => setHourlyRate(event.target.value)}
          className="w-16 rounded-lg border border-pink-300/25 bg-black px-2 py-2 text-right font-bold text-white outline-none"
        />
        <span className="text-xs font-bold text-zinc-400">/hr</span>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between gap-3">
      <span className="text-zinc-400">Estimated Hours</span>
      <div className="flex items-center gap-2">
        <input
          value={estimatedLowHours}
          onChange={(event) => setEstimatedLowHours(event.target.value)}
          className="w-12 rounded-lg border border-pink-300/25 bg-black px-2 py-2 text-right font-bold text-white outline-none"
        />
        <span className="text-xs font-bold text-zinc-400">to</span>
        <input
          value={estimatedHighHours}
          onChange={(event) => setEstimatedHighHours(event.target.value)}
          className="w-12 rounded-lg border border-pink-300/25 bg-black px-2 py-2 text-right font-bold text-white outline-none"
        />
        <span className="text-xs font-bold text-zinc-400">hrs</span>
      </div>

    </div>

    <div className="mt-3 flex items-center justify-between">
      <span className="text-zinc-400">Estimated Total</span>
      <span className="font-black text-pink-100">{moneyFromHours(hourlyRate, estimatedLowHours)}-{moneyFromHours(hourlyRate, estimatedHighHours)}</span>`
);

// Insert payment method/link fields before payment buttons
const paymentButtons = `                <div className="mt-4 grid gap-2">
                  <a
                    href={smsBody(selected.phone, buildPaymentText(selected, hourlyRate, actualHours, paymentMethod, paymentLink))}`;

const paymentFields = `                <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                  <label className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                    Payment Method
                  </label>
                  <input
                    value={paymentMethod}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    placeholder="Cash App, Zelle, Venmo, etc."
                    className="mt-2 w-full rounded-lg border border-green-300/25 bg-black px-3 py-2 text-sm font-bold text-white outline-none"
                  />

                  <label className="mt-4 block text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
                    Payment Link
                  </label>
                  <input
                    value={paymentLink}
                    onChange={(event) => setPaymentLink(event.target.value)}
                    placeholder="https://cash.app/$YourName or Zelle note"
                    className="mt-2 w-full rounded-lg border border-green-300/25 bg-black px-3 py-2 text-sm font-bold text-white outline-none"
                  />

                  {paymentLink.trim() ? (
                    <div className="mt-4 flex items-center gap-4 rounded-xl bg-white p-3 text-black">
                      <img
                        src={\`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=\${encodeURIComponent(paymentLink.trim())}\`}
                        alt="Payment QR code"
                        className="h-28 w-28 rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-black">Payment QR Code</p>
                        <p className="mt-1 text-xs font-bold text-zinc-600">Updates from the payment link field.</p>
                      </div>
                    </div>
                  ) : null}
                </div>

` + paymentButtons;

if (!raw.includes("Payment QR Code")) {
  raw = raw.replace(paymentButtons, paymentFields);
}

fs.writeFileSync(path, raw);
