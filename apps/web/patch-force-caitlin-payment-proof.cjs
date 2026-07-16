const fs = require("fs");

const path = "./src/pages/OnlyTheEssentialsIntelligenceDashboard.tsx";
let raw = fs.readFileSync(path, "utf8");

fs.writeFileSync(path + ".before-force-insert-payment-proof", raw);

if (!raw.includes("function buildProofText")) {
  raw = raw.replace(
`function buildReviewText(signal: Signal) {
  return \`Hi \${signal.name}, thank you for choosing Only The Essentials Cleaning.

If you were happy with the cleaning, I’d really appreciate a quick review. It helps a local business more than you know.\`;
}`,
`function buildReviewText(signal: Signal) {
  return \`Hi \${signal.name}, thank you for choosing Only The Essentials Cleaning.

If you were happy with the cleaning, I’d really appreciate a quick review. It helps a local business more than you know.\`;
}

function buildProofText(signal: Signal, beforePhotos: CleaningPhoto[], afterPhotos: CleaningPhoto[]) {
  const beforeLinks = beforePhotos.map((photo, index) => \`Before \${index + 1}: \${photo.public_url}\`).join("\\n");
  const afterLinks = afterPhotos.map((photo, index) => \`After \${index + 1}: \${photo.public_url}\`).join("\\n");

  return \`Hi \${signal.name}, this is Kaitlin with Only The Essentials Cleaning.

Your cleaning is complete.

\${beforeLinks ? \`Before photos:\\n\${beforeLinks}\\n\\n\` : ""}\${afterLinks ? \`After photos:\\n\${afterLinks}\\n\\n\` : ""}Thank you again for choosing Only The Essentials Cleaning.\`;
}`
  );
}

const timelineStart = raw.indexOf('              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">', raw.indexOf("TIMELINE"));

if (timelineStart === -1) {
  throw new Error("Could not find TIMELINE section.");
}

if (!raw.includes("PROOF / REVIEW")) {
  const finishSections = `              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  PAYMENT
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Status</span>
                    <span className="font-bold text-yellow-300">Not Sent</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href={smsBody(selected.phone, buildPaymentText(selected))}
                    className="rounded-xl border border-green-400/40 bg-green-500/10 py-3 text-center text-sm font-black text-green-100"
                  >
                    Send Payment Link Text
                  </a>

                  <button
                    type="button"
                    onClick={() => copyText("Payment note copied", buildPaymentText(selected))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Payment Note
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
                  Next Move: Send payment link after the job is complete.
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.35em] text-pink-200">
                  PROOF / REVIEW
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Proof Photos</span>
                    <span className="font-bold">{beforePhotos.length + afterPhotos.length ? \`\${beforePhotos.length + afterPhotos.length} Saved\` : "Not Added"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Review</span>
                    <span className="font-bold text-yellow-300">Not Requested</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <a
                    href={smsBody(selected.phone, buildProofText(selected, beforePhotos, afterPhotos))}
                    className="rounded-xl bg-pink-400 py-3 text-center text-sm font-black text-black"
                  >
                    Send Completion / Proof Text
                  </a>

                  <button
                    type="button"
                    onClick={() => copyText("Proof message copied", buildProofText(selected, beforePhotos, afterPhotos))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    Copy Proof Message
                  </button>

                  <a
                    href={smsBody(selected.phone, buildReviewText(selected))}
                    className="rounded-xl bg-pink-400 py-3 text-center text-sm font-black text-black"
                  >
                    Send Review Text
                  </a>

                  <button
                    type="button"
                    onClick={() => copyText("Post copied", buildSocialPost(selected))}
                    className="rounded-xl border border-white/10 py-3 text-sm font-black"
                  >
                    <Share2 className="mr-1 inline" size={14} />
                    Copy Proof Post
                  </button>
                </div>

                <div className="mt-4 rounded-xl bg-yellow-500/10 p-3 text-sm font-bold text-yellow-200">
                  Next Move: Turn finished work into proof, review, and shareable media.
                </div>
              </div>

`;

  raw = raw.slice(0, timelineStart) + finishSections + raw.slice(timelineStart);
}

fs.writeFileSync(path, raw);
