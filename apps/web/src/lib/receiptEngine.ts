export type ReceiptSource =
  | "manual"
  | "camera-scan"
  | "email"
  | "sms"
  | "cash-app"
  | "zelle"
  | "square"
  | "stripe"
  | "pos"
  | "import";

export type ReceiptDestinationType =
  | "presence-ledger"
  | "job"
  | "board"
  | "business"
  | "personal"
  | "home"
  | "vehicle"
  | "guardian"
  | "pet"
  | "custom";

export type ReceiptStatus =
  | "captured"
  | "parsed"
  | "linked"
  | "archived"
  | "flagged";

export type ReceiptPaymentMethod =
  | "cash"
  | "card"
  | "cash-app"
  | "zelle"
  | "apple-pay"
  | "google-pay"
  | "bank-transfer"
  | "unknown";

export type ReceiptLineItem = {
  id: string;
  label: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
  category?: string;
};

export type ReceiptDestination = {
  type: ReceiptDestinationType;
  id?: string;
  label?: string;
};

export type ReceiptAttachment = {
  kind: "image" | "pdf" | "text" | "url";
  url?: string;
  name?: string;
  mimeType?: string;
  text?: string;
};

export type ReceiptRecord = {
  id: string;
  presenceId?: string;
  source: ReceiptSource;
  status: ReceiptStatus;
  vendorName: string;
  vendorId?: string;
  locationLabel?: string;
  amountSubtotal?: number;
  amountTax?: number;
  amountTip?: number;
  amountTotal: number;
  currency: string;
  paymentMethod: ReceiptPaymentMethod;
  receiptNumber?: string;
  transactionAt: string;
  capturedAt: string;
  notes?: string;
  rawText?: string;
  lineItems: ReceiptLineItem[];
  destinations: ReceiptDestination[];
  attachments: ReceiptAttachment[];
  boardSlug?: string;
  jobId?: string;
  customerName?: string;
  tags: string[];
  isReturn?: boolean;
  isVoid?: boolean;
  flags: string[];
  metadata: Record<string, string | number | boolean | null>;
};

export type ReceiptDraftInput = {
  presenceId?: string;
  source?: ReceiptSource;
  vendorName?: string;
  vendorId?: string;
  locationLabel?: string;
  amountSubtotal?: number | string;
  amountTax?: number | string;
  amountTip?: number | string;
  amountTotal?: number | string;
  currency?: string;
  paymentMethod?: ReceiptPaymentMethod;
  receiptNumber?: string;
  transactionAt?: string;
  capturedAt?: string;
  notes?: string;
  rawText?: string;
  lineItems?: Array<Partial<ReceiptLineItem>>;
  destinations?: ReceiptDestination[];
  attachments?: ReceiptAttachment[];
  boardSlug?: string;
  jobId?: string;
  customerName?: string;
  tags?: string[];
  isReturn?: boolean;
  isVoid?: boolean;
  metadata?: Record<string, string | number | boolean | null>;
};

export type ReceiptParseResult = {
  vendorName?: string;
  amountTotal?: number;
  amountSubtotal?: number;
  amountTax?: number;
  receiptNumber?: string;
  transactionAt?: string;
  paymentMethod?: ReceiptPaymentMethod;
  lineItems?: ReceiptLineItem[];
  flags?: string[];
};

export type ReceiptSummary = {
  totalReceipts: number;
  totalSpend: number;
  flaggedCount: number;
  byPaymentMethod: Record<string, number>;
  byVendor: Record<string, number>;
};

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeText(value?: string | null) {
  return (value || "").trim();
}

function normalizeLower(value?: string | null) {
  return normalizeText(value).toLowerCase();
}

function toNumber(value?: number | string | null) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = normalizeText(String(value ?? "")).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function inferCurrency(value?: string) {
  const normalized = normalizeText(value).toUpperCase();
  return normalized || "USD";
}

function inferCapturedAt(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function inferTransactionAt(value?: string, capturedAt?: string) {
  const date = value ? new Date(value) : new Date(capturedAt || Date.now());
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

function normalizeLineItems(
  items?: Array<Partial<ReceiptLineItem>>,
): ReceiptLineItem[] {
  return (items || [])
    .map((item) => {
      const quantity =
        typeof item.quantity === "number" && Number.isFinite(item.quantity)
          ? item.quantity
          : undefined;

      const unitPrice =
        typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice)
          ? roundMoney(item.unitPrice)
          : undefined;

      const total =
        typeof item.total === "number" && Number.isFinite(item.total)
          ? roundMoney(item.total)
          : quantity && unitPrice
            ? roundMoney(quantity * unitPrice)
            : undefined;

      return {
        id: normalizeText(item.id) || createId("receipt_line"),
        label: normalizeText(item.label) || "Unnamed item",
        quantity,
        unitPrice,
        total,
        category: normalizeText(item.category) || undefined,
      };
    })
    .filter((item) => item.label);
}

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => normalizeText(value)).filter(Boolean)),
  );
}

function inferFlags(record: Omit<ReceiptRecord, "flags">) {
  const flags: string[] = [];

  if (!record.vendorName) {
    flags.push("missing-vendor");
  }

  if (!record.amountTotal || record.amountTotal <= 0) {
    flags.push("missing-total");
  }

  if (!record.destinations.length) {
    flags.push("missing-destination");
  }

  if (!record.attachments.length && !record.rawText) {
    flags.push("missing-proof");
  }

  if (!record.presenceId) {
    flags.push("missing-presence");
  }

  if (record.jobId && !record.boardSlug) {
    flags.push("job-without-board");
  }

  if (record.amountSubtotal && record.amountSubtotal > record.amountTotal) {
    flags.push("subtotal-exceeds-total");
  }

  return uniqueStrings(flags);
}

export function createReceiptRecord(input: ReceiptDraftInput): ReceiptRecord {
  const capturedAt = inferCapturedAt(input.capturedAt);
  const transactionAt = inferTransactionAt(input.transactionAt, capturedAt);

  const amountSubtotal = roundMoney(toNumber(input.amountSubtotal));
  const amountTax = roundMoney(toNumber(input.amountTax));
  const amountTip = roundMoney(toNumber(input.amountTip));

  let amountTotal = roundMoney(toNumber(input.amountTotal));

  if (!amountTotal) {
    amountTotal = roundMoney(amountSubtotal + amountTax + amountTip);
  }

  const recordWithoutFlags: Omit<ReceiptRecord, "flags"> = {
    id: createId("receipt"),
    presenceId: normalizeText(input.presenceId) || undefined,
    source: input.source || "manual",
    status: "captured",
    vendorName: normalizeText(input.vendorName) || "Unknown Vendor",
    vendorId: normalizeText(input.vendorId) || undefined,
    locationLabel: normalizeText(input.locationLabel) || undefined,
    amountSubtotal: amountSubtotal || undefined,
    amountTax: amountTax || undefined,
    amountTip: amountTip || undefined,
    amountTotal,
    currency: inferCurrency(input.currency),
    paymentMethod: input.paymentMethod || "unknown",
    receiptNumber: normalizeText(input.receiptNumber) || undefined,
    transactionAt,
    capturedAt,
    notes: normalizeText(input.notes) || undefined,
    rawText: normalizeText(input.rawText) || undefined,
    lineItems: normalizeLineItems(input.lineItems),
    destinations: input.destinations || [],
    attachments: input.attachments || [],
    boardSlug: normalizeText(input.boardSlug) || undefined,
    jobId: normalizeText(input.jobId) || undefined,
    customerName: normalizeText(input.customerName) || undefined,
    tags: uniqueStrings(input.tags || []),
    isReturn: Boolean(input.isReturn),
    isVoid: Boolean(input.isVoid),
    metadata: input.metadata || {},
  };

  return {
    ...recordWithoutFlags,
    flags: inferFlags(recordWithoutFlags),
  };
}

export function attachReceiptToJob(
  record: ReceiptRecord,
  args: {
    boardSlug: string;
    jobId: string;
    customerName?: string;
    label?: string;
  },
): ReceiptRecord {
  const nextDestinations = [
    ...record.destinations,
    {
      type: "job" as const,
      id: args.jobId,
      label: args.label || args.customerName || args.jobId,
    },
    {
      type: "board" as const,
      id: args.boardSlug,
      label: args.boardSlug,
    },
  ];

  return refreshReceiptFlags({
    ...record,
    boardSlug: args.boardSlug,
    jobId: args.jobId,
    customerName: normalizeText(args.customerName) || record.customerName,
    destinations: dedupeDestinations(nextDestinations),
    status: "linked",
  });
}

export function attachReceiptToPresence(
  record: ReceiptRecord,
  presenceId: string,
): ReceiptRecord {
  const nextDestinations = [
    ...record.destinations,
    {
      type: "presence-ledger" as const,
      id: presenceId,
      label: presenceId,
    },
  ];

  return refreshReceiptFlags({
    ...record,
    presenceId,
    destinations: dedupeDestinations(nextDestinations),
    status: "linked",
  });
}

export function addReceiptDestination(
  record: ReceiptRecord,
  destination: ReceiptDestination,
): ReceiptRecord {
  return refreshReceiptFlags({
    ...record,
    destinations: dedupeDestinations([...record.destinations, destination]),
  });
}

export function addReceiptAttachment(
  record: ReceiptRecord,
  attachment: ReceiptAttachment,
): ReceiptRecord {
  return refreshReceiptFlags({
    ...record,
    attachments: [...record.attachments, attachment],
  });
}

export function archiveReceipt(record: ReceiptRecord): ReceiptRecord {
  return {
    ...record,
    status: "archived",
  };
}

export function flagReceipt(record: ReceiptRecord, flag: string): ReceiptRecord {
  return {
    ...record,
    status: "flagged",
    flags: uniqueStrings([...record.flags, flag]),
  };
}

export function refreshReceiptFlags(record: ReceiptRecord): ReceiptRecord {
  const refreshed = inferFlags({
    ...record,
    flags: undefined as never,
  });

  return {
    ...record,
    flags: uniqueStrings([...record.flags.filter(Boolean), ...refreshed]),
  };
}

function dedupeDestinations(destinations: ReceiptDestination[]) {
  const seen = new Set<string>();

  return destinations.filter((destination) => {
    const key = [
      normalizeLower(destination.type),
      normalizeLower(destination.id),
      normalizeLower(destination.label),
    ].join("::");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function parseReceiptText(rawText: string): ReceiptParseResult {
  const text = normalizeText(rawText);
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const result: ReceiptParseResult = {};

  if (!lines.length) {
    return result;
  }

  result.vendorName = lines[0];

  const totalMatch =
    text.match(/total[:\s]*\$?\s*([0-9]+(?:\.[0-9]{2})?)/i) ||
    text.match(/\$([0-9]+(?:\.[0-9]{2})?)\s*$/m);

  if (totalMatch) {
    result.amountTotal = roundMoney(Number(totalMatch[1]));
  }

  const subtotalMatch = text.match(/subtotal[:\s]*\$?\s*([0-9]+(?:\.[0-9]{2})?)/i);
  if (subtotalMatch) {
    result.amountSubtotal = roundMoney(Number(subtotalMatch[1]));
  }

  const taxMatch = text.match(/tax[:\s]*\$?\s*([0-9]+(?:\.[0-9]{2})?)/i);
  if (taxMatch) {
    result.amountTax = roundMoney(Number(taxMatch[1]));
  }

  const receiptNumberMatch =
    text.match(/receipt\s*(?:#|number)?[:\s]*([A-Z0-9-]+)/i) ||
    text.match(/order\s*(?:#|number)?[:\s]*([A-Z0-9-]+)/i);

  if (receiptNumberMatch) {
    result.receiptNumber = receiptNumberMatch[1];
  }

  if (/cash app/i.test(text)) {
    result.paymentMethod = "cash-app";
  } else if (/zelle/i.test(text)) {
    result.paymentMethod = "zelle";
  } else if (/apple pay/i.test(text)) {
    result.paymentMethod = "apple-pay";
  } else if (/google pay/i.test(text)) {
    result.paymentMethod = "google-pay";
  } else if (/visa|mastercard|debit|credit/i.test(text)) {
    result.paymentMethod = "card";
  }

  const flags: string[] = [];
  if (!result.amountTotal) {
    flags.push("parse-missing-total");
  }
  if (!result.vendorName) {
    flags.push("parse-missing-vendor");
  }

  result.flags = flags;
  return result;
}

export function mergeReceiptParseResult(
  input: ReceiptDraftInput,
  parsed: ReceiptParseResult,
): ReceiptDraftInput {
  return {
    ...input,
    vendorName: input.vendorName || parsed.vendorName,
    amountTotal:
      input.amountTotal !== undefined ? input.amountTotal : parsed.amountTotal,
    amountSubtotal:
      input.amountSubtotal !== undefined
        ? input.amountSubtotal
        : parsed.amountSubtotal,
    amountTax:
      input.amountTax !== undefined ? input.amountTax : parsed.amountTax,
    receiptNumber: input.receiptNumber || parsed.receiptNumber,
    transactionAt: input.transactionAt || parsed.transactionAt,
    paymentMethod: input.paymentMethod || parsed.paymentMethod,
    lineItems:
      input.lineItems && input.lineItems.length
        ? input.lineItems
        : parsed.lineItems,
    tags: uniqueStrings([...(input.tags || []), ...(parsed.flags || [])]),
  };
}

export function summarizeReceipts(records: ReceiptRecord[]): ReceiptSummary {
  const byPaymentMethod: Record<string, number> = {};
  const byVendor: Record<string, number> = {};

  let totalSpend = 0;
  let flaggedCount = 0;

  for (const record of records) {
    totalSpend += record.amountTotal || 0;

    if (record.flags.length) {
      flaggedCount += 1;
    }

    byPaymentMethod[record.paymentMethod] =
      (byPaymentMethod[record.paymentMethod] || 0) + 1;

    const vendor = record.vendorName || "Unknown Vendor";
    byVendor[vendor] = (byVendor[vendor] || 0) + 1;
  }

  return {
    totalReceipts: records.length,
    totalSpend: roundMoney(totalSpend),
    flaggedCount,
    byPaymentMethod,
    byVendor,
  };
}

export function getReceiptsForBoard(
  records: ReceiptRecord[],
  boardSlug: string,
): ReceiptRecord[] {
  return records.filter((record) => record.boardSlug === boardSlug);
}

export function getReceiptsForJob(
  records: ReceiptRecord[],
  jobId: string,
): ReceiptRecord[] {
  return records.filter((record) => record.jobId === jobId);
}

export function getReceiptsForPresence(
  records: ReceiptRecord[],
  presenceId: string,
): ReceiptRecord[] {
  return records.filter((record) => record.presenceId === presenceId);
}

export function sortReceiptsNewestFirst(
  records: ReceiptRecord[],
): ReceiptRecord[] {
  return [...records].sort((a, b) => {
    return (
      new Date(b.transactionAt).getTime() - new Date(a.transactionAt).getTime()
    );
  });
}

export function buildReceiptStorageKey(scope: {
  presenceId?: string;
  boardSlug?: string;
}) {
  if (scope.boardSlug) {
    return `hp_receipts_board_${scope.boardSlug}`;
  }

  if (scope.presenceId) {
    return `hp_receipts_presence_${scope.presenceId}`;
  }

  return "hp_receipts_global";
}

export function readStoredReceipts(storageKey: string): ReceiptRecord[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReceiptRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeStoredReceipts(
  storageKey: string,
  records: ReceiptRecord[],
) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
  } catch {
    // ignore write failure
  }
}

export function upsertStoredReceipt(
  storageKey: string,
  record: ReceiptRecord,
): ReceiptRecord[] {
  const existing = readStoredReceipts(storageKey);
  const next = [...existing.filter((item) => item.id !== record.id), record];
  const sorted = sortReceiptsNewestFirst(next);
  writeStoredReceipts(storageKey, sorted);
  return sorted;
}