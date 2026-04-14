import React, { useMemo } from "react";

type InvoiceJob = {
  roNumber: string;
  customer: string;
  vehicle: string;
  concern: string;
  notes: string;
  phone: string;
};

type PaymentProfile = {
  cashAppCashtag: string;
  zelleValue: string;
};

type AutoRepairInvoicePanelProps = {
  businessName: string;
  presenceId: string;
  boardSlug: string;
  job: InvoiceJob;
  paymentAmount: string;
  paymentMemo: string;
  paymentProfile: PaymentProfile;
  onCopy: (label: string, text: string) => void;
};

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function openTextMessage(phone: string, text: string) {
  const cleanedPhone = sanitizePhone(phone);
  const encoded = encodeURIComponent(text);
  const href = cleanedPhone
    ? `sms:${cleanedPhone}?body=${encoded}`
    : `sms:?body=${encoded}`;
  window.location.href = href;
}

function buildInvoiceText(args: {
  businessName: string;
  presenceId: string;
  boardSlug: string;
  job: InvoiceJob;
  amount: string;
  memo: string;
  paymentProfile: PaymentProfile;
}) {
  const lines = [
    `INVOICE — ${args.businessName}`,
    "",
    `RO: ${args.job.roNumber || "N/A"}`,
    `Customer: ${args.job.customer || "N/A"}`,
    `Vehicle / Job: ${args.job.vehicle || "N/A"}`,
    "",
    "Service:",
    args.job.concern || "Service details pending",
  ];

  if ((args.job.notes || "").trim()) {
    lines.push("", "Notes:", args.job.notes.trim());
  }

  lines.push(
    "",
    `Amount Due: $${args.amount || "0.00"}`,
    `Memo: ${args.memo || args.job.roNumber || "N/A"}`,
    "",
    "Pay here:",
    args.paymentProfile.cashAppCashtag
      ? `Cash App: $${args.paymentProfile.cashAppCashtag}`
      : "Cash App: Not set",
    args.paymentProfile.zelleValue
      ? `Zelle: ${args.paymentProfile.zelleValue}`
      : "Zelle: Not set",
    "",
    `Board: ${args.boardSlug}`,
    `Presence ID: ${args.presenceId}`,
    "— HomePlanet Live Board",
  );

  return lines.join("\n");
}

export default function AutoRepairInvoicePanel({
  businessName,
  presenceId,
  boardSlug,
  job,
  paymentAmount,
  paymentMemo,
  paymentProfile,
  onCopy,
}: AutoRepairInvoicePanelProps) {
  const invoiceText = useMemo(
    () =>
      buildInvoiceText({
        businessName,
        presenceId,
        boardSlug,
        job,
        amount: paymentAmount,
        memo: paymentMemo,
        paymentProfile,
      }),
    [
      boardSlug,
      businessName,
      job,
      paymentAmount,
      paymentMemo,
      paymentProfile,
      presenceId,
    ],
  );

  const emailSubject = `Invoice ${job.roNumber || ""}`.trim();

  return (
    <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
            Invoice
          </div>
          <div className="mt-2 text-sm leading-6 text-cyan-50">
            Generate, send, and share the invoice directly from this job without leaving the board.
          </div>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">
          Send / Share
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-white/10 bg-[#070d1a] p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Invoice header
            </div>
            <div className="mt-2 text-sm font-semibold text-white">{businessName}</div>
            <div className="mt-1 text-sm text-slate-400">{job.roNumber || "RO pending"}</div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Amount due
            </div>
            <div className="mt-2 text-sm font-semibold text-white">
              ${paymentAmount || "0.00"}
            </div>
            <div className="mt-1 text-sm text-slate-400">
              Memo: {paymentMemo || job.roNumber || "N/A"}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
            {invoiceText}
          </pre>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCopy("Invoice", invoiceText)}
            className="rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
          >
            Copy Invoice
          </button>

          <button
            type="button"
            onClick={() => openTextMessage(job.phone, invoiceText)}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Text Invoice
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = `mailto:?subject=${encodeURIComponent(
                emailSubject,
              )}&body=${encodeURIComponent(invoiceText)}`;
            }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Email Invoice
          </button>

          <button
            type="button"
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({
                  title: emailSubject,
                  text: invoiceText,
                });
                return;
              }

              onCopy("Invoice", invoiceText);
            }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            Share Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
