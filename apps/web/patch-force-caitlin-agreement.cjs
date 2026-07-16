const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-force-agreement-hourly", raw);

// Ensure hourly estimate function is correct
raw = raw.replace(
/function buildEstimateText\(signal: Signal[\s\S]*?\n}\n\nfunction buildScheduleText\(/,
`function buildEstimateText(signal: Signal, hourlyRate = "40", estimatedLowHours = "4", estimatedHighHours = "6") {
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
}

function buildScheduleText(`
);

// Add agreement function before schedule function
if (!raw.includes("function buildAgreementText(")) {
  raw = raw.replace(
/\nfunction buildScheduleText\(/,
`

function buildAgreementText(signal: Signal, hourlyRate = "40", estimatedLowHours = "4", estimatedHighHours = "6") {
  const lowTotal = moneyFromHours(hourlyRate, estimatedLowHours);
  const highTotal = moneyFromHours(hourlyRate, estimatedHighHours);

  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Before I schedule the job, please reply YES to confirm the cleaning agreement:

Service: \${signal.service}
Home: \${signal.home}
Rate: $\${hourlyRate}/hr
Estimated time: \${estimatedLowHours}-\${estimatedHighHours} hours
Estimated total: \${lowTotal}-\${highTotal}
Preferred time: \${signal.preferred}

By replying YES, you confirm the cleaning details, hourly rate, estimated time, and that payment is due when the job is complete.

Thank you.\`;
}

function buildScheduleText(`
  );
}

const agreementCard = `              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  AGREEMENT / JOB APPROVAL
                </p>

                <p className="mt-2 text-sm text-zinc-300">
                  Send the customer a simple confirmation before scheduling the job. Their YES reply becomes the approval record.
                </p>

                <div className="mt-4 rounded-xl border border-pink-300/20 bg-pink-400/10 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Rate</span>
                    <span className="font-bold text-white">\${hourlyRate}/hr</span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-zinc-400">Estimated Time</span>
                    <span className="font-bold text-white">{estimatedLowHours}-{estimatedHighHours} hrs</span>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-zinc-400">Estimated Total</span>
                    <span className="font-bold text-pink-100">{moneyFromHours(hourlyRate, estimatedLowHours)}-{moneyFromHours(hourlyRate, estimatedHighHours)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => copyText("Agreement text copied", buildAgreementText(selected, hourlyRate, estimatedLowHours, estimatedHighHours))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Agreement Text
                  </button>

                  <a
                    href={smsBody(selected.phone, buildAgreementText(selected, hourlyRate, estimatedLowHours, estimatedHighHours))}
                    className="rounded-xl bg-pink-400 py-3 text-center text-sm font-black text-black"
                  >
                    Send Agreement Text
                  </a>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-100">
                  Next Move: Wait for the customer to reply YES before confirming the schedule.
                </div>
              </div>

`;

// Insert before visible Schedule card
if (!raw.includes("AGREEMENT / JOB APPROVAL")) {
  const scheduleIndex = raw.indexOf("                  SCHEDULE");
  if (scheduleIndex === -1) throw new Error("Could not find SCHEDULE label.");

  const cardStart = raw.lastIndexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', scheduleIndex);
  if (cardStart === -1) throw new Error("Could not find Schedule card start.");

  raw = raw.slice(0, cardStart) + agreementCard + raw.slice(cardStart);
}

fs.writeFileSync(path, raw);
