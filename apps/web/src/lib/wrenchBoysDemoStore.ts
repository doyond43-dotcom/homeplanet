import type { JobStage, Row } from "../routes/WorkOrderDrawer";

const STORAGE_KEY = "hp-wrench-boys-demo-jobs";
const CHANGE_EVENT = "hp:wrench-boys-demo-jobs-changed";

export const WRENCH_BOYS_DEMO_ROWS: Row[] = [
  {
    id: "wb-11111111-1111-4111-8111-111111111111",
    created_at: new Date().toISOString(),
    slug: "wrench-boys",
    current_stage: "diagnosing",
    payload: {
      name: "Sample Customer",
      phone: "Demo only",
      vehicle: "2014 Honda Civic",
      service: "Tires",
      service_choice: "Tires",
      checkIn: "Waiting Here",
      checkin_mode: "Waiting Here",
      message: "Tires • Waiting Here • 2014 Honda Civic",
      receipt: "WB-DEMO-1001",
      receipt_id: "WB-DEMO-1001",
    },
  },
  {
    id: "wb-22222222-2222-4222-8222-222222222222",
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    slug: "wrench-boys",
    current_stage: "waiting_parts",
    payload: {
      name: "Demo Walk-In",
      phone: "Demo only",
      vehicle: "2004 Dodge Ram 1500",
      service: "Brakes",
      service_choice: "Brakes",
      checkIn: "Dropping Off",
      checkin_mode: "Dropping Off",
      message: "Brake concern • Dropping Off • 2004 Dodge Ram 1500",
      receipt: "WB-DEMO-1002",
      receipt_id: "WB-DEMO-1002",
    },
  },
  {
    id: "wb-33333333-3333-4333-8333-333333333333",
    created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    slug: "wrench-boys",
    current_stage: "repairing",
    payload: {
      name: "Test Customer",
      phone: "Demo only",
      vehicle: "2018 Ford F-250",
      service: "Check Engine",
      service_choice: "Check Engine",
      checkIn: "Dropped Off",
      checkin_mode: "Dropped Off",
      message: "Check engine light and rough idle • 2018 Ford F-250",
      receipt: "WB-DEMO-1003",
      receipt_id: "WB-DEMO-1003",
    },
  },
  {
    id: "wb-44444444-4444-4444-8444-444444444444",
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    slug: "wrench-boys",
    current_stage: "diagnosing",
    payload: {
      name: "Fleet Demo",
      phone: "Demo only",
      vehicle: "2021 Chevy Silverado 2500HD",
      service: "Preventative Maintenance",
      service_choice: "Preventative Maintenance",
      checkIn: "Fleet Drop-Off",
      checkin_mode: "Fleet Drop-Off",
      message: "Fleet maintenance inspection • 2021 Chevy Silverado 2500HD",
      receipt: "WB-DEMO-1004",
      receipt_id: "WB-DEMO-1004",
    },
  },
];

function cloneRows(rows: Row[]) {
  return rows.map((row) => ({
    ...row,
    payload: { ...(row.payload || {}) },
  }));
}

export function readWrenchBoysJobs(): Row[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const seeded = cloneRows(WRENCH_BOYS_DEMO_ROWS);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid Wrench Boys demo job store.");
    }

    return parsed as Row[];
  } catch {
    return cloneRows(WRENCH_BOYS_DEMO_ROWS);
  }
}

export function saveWrenchBoysJobs(rows: Row[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function updateWrenchBoysJobStage(
  rowId: string,
  stage: JobStage,
  employeeCode: string
): Row[] {
  const now = new Date().toISOString();

  const nextRows = readWrenchBoysJobs().map((row) =>
    row.id === rowId
      ? {
          ...row,
          current_stage: stage,
          stage_updated_at: now,
          stage_updated_by_employee_code: employeeCode,
          handled_by_employee_code: employeeCode,
        }
      : row
  );

  saveWrenchBoysJobs(nextRows);
  return nextRows;
}

export function addWrenchBoysJob(input: {
  name: string;
  phone: string;
  vehicle: string;
  service: string;
  location: string;
  message: string;
  customerReported?: string;
  contactMethod?: string;
}) {
  const now = new Date();
  const receiptId = `WB-${now.getTime().toString().slice(-8)}`;

  const newRow: Row = {
    id: crypto.randomUUID(),
    created_at: now.toISOString(),
    slug: "wrench-boys",
    current_stage: "diagnosing",
    payload: {
      name: input.name || "New Customer",
      phone: input.phone || "",
      vehicle: input.vehicle || "Vehicle",
      service: input.service || "Service Request",
      service_choice: input.service || "Service Request",
      checkIn: input.location || "Not specified",
      checkin_mode: input.location || "Not specified",
      message: input.message || input.service || "New service request",
      customer_reported: input.customerReported || input.message || input.service || "",
      contact_method: input.contactMethod || "",
      receipt: receiptId,
      receipt_id: receiptId,
    },
  };

  const nextRows = [newRow, ...readWrenchBoysJobs()];
  saveWrenchBoysJobs(nextRows);

  return newRow;
}

export function resetWrenchBoysDemoJobs() {
  const seeded = cloneRows(WRENCH_BOYS_DEMO_ROWS);
  saveWrenchBoysJobs(seeded);
  return seeded;
}

export function subscribeToWrenchBoysJobs(callback: () => void) {
  const handleCustomChange = () => callback();

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(CHANGE_EVENT, handleCustomChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(CHANGE_EVENT, handleCustomChange);
    window.removeEventListener("storage", handleStorage);
  };
}

