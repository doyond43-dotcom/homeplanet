const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-hourly-caitlin-workflow", raw);

raw = raw.replace(
`function buildEstimateText(signal: Signal, estimateRange = signal.value) {
  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

I reviewed your cleaning request:

Service: \${signal.service}
Home: \${signal.home}
Condition: \${signal.condition}
Pets: \${signal.pets}
Preferred time: \${signal.preferred}
Estimate: \${estimateRange}

I can help with this. I’ll confirm the final price based on the home details, condition, and any photos/notes you sent.\`;
}`,
`function moneyFromHours(rate: string, hours: string) {
  const rateNumber = Number.parseFloat(rate || "0");
  const hoursNumber = Number.parseFloat(hours || "0");
  if (!Number.isFinite(rateNumber) || !Number.isFinite(hoursNumber)) return "$0";
  return \`$\${Math.round(rateNumber * hoursNumber)}\`;
}

function buildEstimateText(signal: Signal, hourlyRate = "40", estimatedLowHours = "4", estimatedHighHours = "6") {
  const lowTotal = moneyFromHours(hourlyRate, estimatedLowHours);
  const highTotal = moneyFromHours(hourlyRate, estimatedHighHours);

  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

I reviewed your cleaning request:

Service: \${signal.service}
Home: \${signal.home}
Condition: \${signal.condition}
Pets: \${signal.pets}
Preferred time: \${signal.preferred}

My rate is $\${hourlyRate}/hr.
Estimated time: \${estimatedLowHours}-\${estimatedHighHours} hours
Estimated total: \${lowTotal}-\${highTotal}

I can help with this. I’ll confirm the final time based on the home details, condition, and any photos/notes you sent.\`;
}`
);

raw = raw.replace(
`function buildPaymentText(signal: Signal, estimateRange = signal.value) {
  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Your cleaning is complete and ready for payment.

Amount due: \${estimateRange}

I can send the payment link here once everything is confirmed.\`;
}`,
`function buildPaymentText(signal: Signal, hourlyRate = "40", actualHours = "5") {
  const finalAmount = moneyFromHours(hourlyRate, actualHours);

  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Your cleaning is complete and ready for payment.

Rate: $\${hourlyRate}/hr
Actual time: \${actualHours} hours
Amount due: \${finalAmount}

I can send the payment link here once everything is confirmed.\`;
}`
);

raw = raw.replace(
`const [estimateRange, setEstimateRange] = useState("$160-$240");`,
`const [hourlyRate, setHourlyRate] = useState("40");
  const [estimatedLowHours, setEstimatedLowHours] = useState("4");
  const [estimatedHighHours, setEstimatedHighHours] = useState("6");
  const [actualHours, setActualHours] = useState("5");`
);

raw = raw.replaceAll(
`setEstimateRange(signal.value && signal.value !== "Needs quote" ? signal.value.replace(" est.", "") : "$160-$240");`,
`setHourlyRate("40");
                      setEstimatedLowHours("4");
                      setEstimatedHighHours("6");
                      setActualHours("5");`
);

raw = raw.replace(
`<span className="text-zinc-400">Range</span>
      <input
        value={estimateRange}
        onChange={(event) => setEstimateRange(event.target.value)}
        className="w-32 rounded-lg border border-pink-300/25 bg-black px-3 py-2 text-right font-bold text-white outline-none"
      />`,
`<span className="text-zinc-400">Rate / Est. Hours</span>
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
      </div>`
);

raw = raw.replaceAll(
`buildEstimateText(selected, estimateRange)`,
`buildEstimateText(selected, hourlyRate, estimatedLowHours, estimatedHighHours)`
);

raw = raw.replaceAll(
`buildPaymentText(selected, estimateRange)`,
`buildPaymentText(selected, hourlyRate, actualHours)`
);

raw = raw.replace(
`<p className="mt-2 text-sm text-zinc-300">
                  Send a clean payment note when the job is complete. Payment link / QR can be added when Caitlin is ready.
                </p>`,
`<p className="mt-2 text-sm text-zinc-300">
                  Final payment is based on actual hours worked.
                </p>

                <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-zinc-400">Actual Hours</span>
                    <input
                      value={actualHours}
                      onChange={(event) => setActualHours(event.target.value)}
                      className="w-20 rounded-lg border border-green-300/25 bg-black px-3 py-2 text-right font-black text-white outline-none"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-400">Final Amount Due</span>
                    <span className="text-xl font-black text-green-200">{moneyFromHours(hourlyRate, actualHours)}</span>
                  </div>
                </div>`
);

fs.writeFileSync(path, raw);
