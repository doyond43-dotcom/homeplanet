import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Stage =
  | "scheduled"
  | "arrived"
  | "working"
  | "before-uploaded"
  | "issue-reported"
  | "after-uploaded"
  | "payment-collected"
  | "complete";

type TimelineItem = {
  id: string;
  label: string;
  time: string;
};

const stageLabels: Record<Stage, string> = {
  scheduled: "Scheduled",
  arrived: "Arrived",
  working: "Work Started",
  "before-uploaded": "Before Proof Added",
  "issue-reported": "Issue Reported",
  "after-uploaded": "After Proof Added",
  "payment-collected": "Payment Collected",
  complete: "Complete",
};

export default function CrewTeamBoard() {
  const [searchParams] = useSearchParams();

  const activeJob = useMemo(() => {
    const jobId = searchParams.get("job");

    try {
      const raw = localStorage.getItem("hp-operational-board:okee-soft-wash:jobs");
      const jobs = raw ? JSON.parse(raw) : [];

      const found = jobs.find((job: any) => job.id === jobId);

      if (found) {
        return {
          customer: found.customer || "Customer",
          address: found.address || "No address",
          amount: "$185.00",
        };
      }
    } catch {}

    return {
      customer: "Customer",
      address: "No address",
      amount: "$185.00",
    };
  }, [searchParams]);
  const [stage, setStage] = useState<Stage>("scheduled");
  const [paid, setPaid] = useState(false);
  const [timeline, setTimeline] = useState<TimelineItem[]>([
    {
      id: "created",
      label: "Job loaded on Crew Team Board",
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    },
  ]);

  const paymentState = paid ? "PAID" : "PAYMENT PENDING";

  const nextAction = useMemo(() => {
    if (stage === "scheduled") return { label: "Arrived", next: "arrived" as Stage };
    if (stage === "arrived") return { label: "Start Work", next: "working" as Stage };
    if (stage === "working") return { label: "Upload Before Proof", next: "before-uploaded" as Stage };
    if (stage === "before-uploaded") return { label: "Upload After Proof", next: "after-uploaded" as Stage };
    if (stage === "after-uploaded" && !paid) return { label: "Collect Payment", next: "payment-collected" as Stage };
    if ((stage === "payment-collected" || paid) && stage !== "complete") return { label: "Complete Job", next: "complete" as Stage };
    return null;
  }, [stage, paid]);

  function addTimeline(label: string) {
    setTimeline((items) => [
      {
        id: `${Date.now()}`,
        label,
        time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      },
      ...items,
    ]);
  }

  function moveStage(next: Stage) {
    setStage(next);
    addTimeline(stageLabels[next]);

    if (next === "payment-collected") {
      setPaid(true);
    }
  }

  function reportIssue() {
    setStage("issue-reported");
    addTimeline("Issue reported from property");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-5 text-white">
      <div className="mx-auto max-w-md space-y-4">
        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">Crew Team Board</p>
          <h1 className="mt-2 text-2xl font-black">{activeJob.customer}</h1>
          <p className="mt-1 text-sm text-white/60">{activeJob.address}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-emerald-500 px-3 py-2 text-center text-xs font-black uppercase text-black">
              {stageLabels[stage]}
            </div>
            <div className={`rounded-2xl px-3 py-2 text-center text-xs font-black uppercase ${paid ? "bg-emerald-500 text-black" : "bg-amber-400 text-black"}`}>
              {paymentState}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-3 text-sm font-bold text-white/70">Next Field Action</p>

          {nextAction ? (
            <button
              onClick={() => moveStage(nextAction.next)}
              className="w-full rounded-2xl bg-white px-4 py-5 text-lg font-black text-black"
            >
              {nextAction.label}
            </button>
          ) : (
            <div className="rounded-2xl bg-emerald-500/15 px-4 py-5 text-center text-lg font-black text-emerald-300">
              Job Complete
            </div>
          )}

          <button
            onClick={reportIssue}
            className="mt-3 w-full rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-4 font-black text-amber-200"
          >
            Report Issue
          </button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm font-bold text-white/70">Payment</p>
          <div className="mt-3 rounded-2xl bg-white p-6 text-center text-black">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-xl border-4 border-black text-sm font-black">
              QR PAYMENT
            </div>
            <p className="mt-3 text-2xl font-black">{activeJob.amount}</p>
          </div>

          <button
            onClick={() => {
              setPaid(true);
              moveStage("payment-collected");
            }}
            className="mt-3 w-full rounded-2xl bg-emerald-500 px-4 py-4 font-black text-black"
          >
            Mark Paid
          </button>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-3 text-sm font-bold text-white/70">Live Truth Timeline</p>

          <div className="space-y-2">
            {timeline.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-3">
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-xs text-white/45">{item.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}



