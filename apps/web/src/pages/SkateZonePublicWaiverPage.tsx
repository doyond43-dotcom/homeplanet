import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type Child = {
  id: string;
  name: string;
  dob: string;
  rental: boolean;
  firstTime: boolean;
};

const demoChildren: Child[] = [
  {
    id: "child-1",
    name: "Nick Smith",
    dob: "04-26-2011",
    rental: true,
    firstTime: true,
  },
  {
    id: "child-2",
    name: "Jane Smith",
    dob: "03-22-2013",
    rental: true,
    firstTime: true,
  },
];

function formatTimestamp(date: Date) {
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SkateZonePublicWaiverPage() {
  const { waiverId } = useParams();

  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState("Jim Smith");

  const [submitted, setSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const waiverToken = waiverId ?? "demo-waiver-token";

  const summary = useMemo(() => {
    const rentals = demoChildren.filter((child) => child.rental).length;
    const firstTimers = demoChildren.filter((child) => child.firstTime).length;

    return {
      rentals,
      firstTimers,
      skaters: demoChildren.length,
    };
  }, []);

  function handleSubmit() {
    if (submitted) return; // 🔒 hard block
    if (!agreed || !signature.trim()) return;

    setSubmittedAt(formatTimestamp(new Date()));
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-6">
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold">Skate Zone Waiver</h1>
          <div className="mt-1 text-sm text-white/60">
            Parent phone check-in
          </div>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5 shadow-[0_0_24px_rgba(16,185,129,0.18)]">
            <div className="text-xl font-bold text-emerald-300">
              ✅ Waiver Submitted
            </div>

            <p className="mt-3 text-sm leading-6 text-white/80">
              Thank you. Your family waiver has been completed successfully.
              The front desk can now see your signed status on the live board.
            </p>

            {/* CONFIRMATION */}
            <div className="mt-4 rounded-xl border border-white/10 bg-[#0b142d] p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Confirmation
              </div>

              <div className="mt-2 text-sm">
                Waiver ID:{" "}
                <span className="break-all text-white/70">
                  {waiverToken}
                </span>
              </div>

              <div className="mt-1 text-sm">
                Signed by:{" "}
                <span className="text-white/90">{signature}</span>
              </div>

              <div className="mt-1 text-sm">
                Submitted:{" "}
                <span className="text-white/90">{submittedAt}</span>
              </div>
            </div>

            {/* 🔒 LOCK MESSAGE */}
            <div className="mt-3 text-center text-xs text-white/40">
              This waiver has already been completed.
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* INTRO */}
            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4">
              <div className="text-sm font-semibold text-sky-300">
                Family skating waiver
              </div>

              <p className="mt-2 text-sm leading-6 text-white/80">
                Please review the covered skaters below, confirm that you are
                the parent or guardian, and complete the waiver before heading
                onto the ice.
              </p>
            </div>

            {/* SKATERS */}
            <div className="rounded-2xl border border-white/10 bg-[#081129] p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Covered skaters
              </div>

              <div className="mt-3 space-y-3">
                {demoChildren.map((child) => (
                  <div
                    key={child.id}
                    className="rounded-xl border border-white/5 bg-[#020817] p-3"
                  >
                    <div className="font-semibold">{child.name}</div>

                    <div className="mt-1 text-sm text-white/60">
                      {child.dob}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {child.rental && (
                        <span className="rounded-md bg-green-600/20 px-2 py-1 text-xs text-green-300">
                          🎿 Rental
                        </span>
                      )}

                      {child.firstTime && (
                        <span className="rounded-md bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
                          🟡 First Time
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-white/10 bg-[#081129] p-4">
              <div className="text-xs uppercase tracking-wide text-white/45">
                Waiver summary
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/65">Skaters</span>
                  <span>{summary.skaters}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/65">Rentals</span>
                  <span>{summary.rentals}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/65">
                    First-Time Skaters
                  </span>
                  <span>{summary.firstTimers}</span>
                </div>
              </div>
            </div>

            {/* RISK */}
            <div className="rounded-2xl border border-white/10 bg-[#081129] p-4">
              <div className="text-sm font-semibold">
                Risk acknowledgment
              </div>

              <p className="mt-3 text-sm leading-6 text-white/80">
                I understand that skating activities may involve slips,
                falls, collisions, equipment-related incidents, and other
                ordinary risks associated with participation on or around
                the ice. I confirm that I am responsible for the children
                listed in this waiver and agree to the rink participation
                waiver for this family check-in.
              </p>
            </div>

            {/* SIGN */}
            <div className="rounded-2xl border border-white/10 bg-[#081129] p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-[#020817]"
                />

                <span className="text-sm leading-6 text-white/85">
                  I confirm that I am the parent or guardian for the covered
                  skaters and agree to the skating waiver.
                </span>
              </label>

              <div className="mt-4">
                <div className="mb-2 text-sm font-medium">
                  Parent signature
                </div>

                <input
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Type full name to sign"
                  className="w-full rounded-xl border border-transparent bg-[#020817] px-3 py-3 text-white placeholder:text-white/35 outline-none focus:border-blue-400"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitted || !agreed || !signature.trim()}
                className={`mt-4 w-full rounded-xl px-4 py-3 font-bold transition ${
                  agreed && signature.trim()
                    ? "bg-green-600 hover:bg-green-500"
                    : "cursor-not-allowed bg-white/10 text-white/35"
                }`}
              >
                Sign & Submit Waiver
              </button>
            </div>

            {/* FOOTER */}
            <div className="pb-4 text-center text-xs text-white/35">
              Waiver ID: {waiverToken}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}