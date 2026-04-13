import React, { useMemo, useState } from "react";

/* =========================
   TYPES
========================= */

type Stage =
  | "New Order"
  | "Deposit Needed"
  | "In Progress"
  | "Ready"
  | "Awaiting Pickup"
  | "Complete";

type PaymentStatus =
  | "none"
  | "deposit-requested"
  | "deposit-paid"
  | "payment-requested"
  | "paid-in-full";

type PaymentMethod =
  | "cash-app"
  | "zelle"
  | "cash"
  | "other"
  | null;

type PaymentRecord = {
  status: PaymentStatus;
  depositRequired: boolean;
  depositAmount: number | null;
  totalAmount: number | null;
  paidAmount: number;
  remainingAmount: number | null;
  method: PaymentMethod;
  paidAt?: string | null;
};

type Job = {
  id: string;
  customer: string;
  service: string;
  stage: Stage;
  createdAt: string;
  payment: PaymentRecord;
};

/* =========================
   HELPERS
========================= */

function getRemaining(total: number | null, paid: number) {
  if (total == null) return null;
  return Math.max(total - paid, 0);
}

function isDepositSatisfied(p: PaymentRecord) {
  if (!p.depositRequired) return true;
  return p.status === "deposit-paid" || p.status === "paid-in-full";
}

function canMove(job: Job, next: Stage) {
  if (next === "In Progress" && !isDepositSatisfied(job.payment)) return false;
  if (next === "Complete" && job.payment.status !== "paid-in-full") return false;
  return true;
}

/* =========================
   COMPONENT
========================= */

export default function ColorMeCrazyLiveBoard() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "1",
      customer: "Jessica R.",
      service: "Custom Tumbler",
      stage: "New Order",
      createdAt: new Date().toISOString(),
      payment: {
        status: "none",
        depositRequired: false,
        depositAmount: null,
        totalAmount: 55,
        paidAmount: 0,
        remainingAmount: 55,
        method: null,
        paidAt: null,
      },
    },
  ]);

  const stages: Stage[] = [
    "New Order",
    "Deposit Needed",
    "In Progress",
    "Ready",
    "Awaiting Pickup",
    "Complete",
  ];

  function updateJob(updated: Job) {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  }

  function moveJob(job: Job, next: Stage) {
    if (!canMove(job, next)) return;
    updateJob({ ...job, stage: next });
  }

  /* =========================
     PAYMENT ACTIONS
  ========================= */

  function requestDeposit(job: Job) {
    updateJob({
      ...job,
      stage: "Deposit Needed",
      payment: {
        ...job.payment,
        depositRequired: true,
        depositAmount: 25,
        status: "deposit-requested",
      },
    });
  }

  function markDepositPaid(job: Job) {
    const paid = job.payment.paidAmount + 25;
    updateJob({
      ...job,
      stage: "In Progress",
      payment: {
        ...job.payment,
        paidAmount: paid,
        remainingAmount: getRemaining(job.payment.totalAmount, paid),
        method: "cash-app",
        status: "deposit-paid",
        paidAt: new Date().toISOString(),
      },
    });
  }

  function requestFinal(job: Job) {
    updateJob({
      ...job,
      stage: "Awaiting Pickup",
      payment: {
        ...job.payment,
        status: "payment-requested",
        remainingAmount: getRemaining(
          job.payment.totalAmount,
          job.payment.paidAmount
        ),
      },
    });
  }

  function markPaid(job: Job) {
    const total = job.payment.totalAmount ?? job.payment.paidAmount;
    updateJob({
      ...job,
      stage: "Complete",
      payment: {
        ...job.payment,
        paidAmount: total,
        remainingAmount: 0,
        method: "zelle",
        status: "paid-in-full",
        paidAt: new Date().toISOString(),
      },
    });
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="p-6 text-white bg-[#0b0b0f] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Color Me Crazy — Live Board
      </h1>

      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div key={stage} className="bg-white/5 rounded-xl p-3">
            <h2 className="text-sm font-semibold mb-3 opacity-70">
              {stage}
            </h2>

            <div className="space-y-3">
              {jobs
                .filter((j) => j.stage === stage)
                .map((job) => (
                  <div
                    key={job.id}
                    className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm"
                  >
                    <div className="font-semibold">{job.customer}</div>
                    <div className="opacity-70 text-xs mb-2">
                      {job.service}
                    </div>

                    {/* PAYMENT BLOCK */}
                    <div className="text-xs border border-white/10 rounded-lg p-2 bg-black/30 mb-2">
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="font-semibold">
                          {job.payment.status === "deposit-requested" &&
                            "DEPOSIT NEEDED"}
                          {job.payment.status === "deposit-paid" &&
                            "DEPOSIT PAID"}
                          {job.payment.status === "payment-requested" &&
                            "FINAL DUE"}
                          {job.payment.status === "paid-in-full" && "PAID"}
                          {job.payment.status === "none" && "—"}
                        </span>
                      </div>

                      {job.payment.depositAmount && (
                        <div className="flex justify-between">
                          <span>Deposit</span>
                          <span>${job.payment.depositAmount}</span>
                        </div>
                      )}

                      {job.payment.totalAmount && (
                        <div className="flex justify-between">
                          <span>Total</span>
                          <span>${job.payment.totalAmount}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Paid</span>
                        <span>${job.payment.paidAmount}</span>
                      </div>

                      {job.payment.remainingAmount !== null && (
                        <div className="flex justify-between">
                          <span>Remaining</span>
                          <span>${job.payment.remainingAmount}</span>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <button
                        onClick={() => requestDeposit(job)}
                        className="bg-yellow-500/20 p-1 rounded"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => markDepositPaid(job)}
                        className="bg-green-500/20 p-1 rounded"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() => requestFinal(job)}
                        className="bg-blue-500/20 p-1 rounded"
                      >
                        Final
                      </button>
                      <button
                        onClick={() => markPaid(job)}
                        className="bg-purple-500/20 p-1 rounded"
                      >
                        Complete
                      </button>
                    </div>

                    {/* MOVE */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {stages.map((s) => (
                        <button
                          key={s}
                          onClick={() => moveJob(job, s)}
                          className="text-[9px] px-1 py-[2px] bg-white/10 rounded"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}