import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";

type OperationalJob = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  notes: string;
  stage: string;
  paymentStatus: "not-ready" | "invoice-ready" | "paid";
  beforePhotos: string[];
  afterPhotos: string[];
  timeline: string[];
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function jobsKey(boardSlug: string) {
  return `hp-operational-board:${boardSlug}:jobs`;
}

function readJobs(boardSlug: string): OperationalJob[] {
  try {
    const raw = localStorage.getItem(jobsKey(boardSlug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveJobs(boardSlug: string, jobs: OperationalJob[]) {
  try {
    localStorage.setItem(jobsKey(boardSlug), JSON.stringify(jobs));
  } catch {}
}

export default function OperationalCustomerRequestPage() {
  const { boardSlug = "business" } = useParams();
  const businessName = titleFromSlug(boardSlug);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    email: "",
    address: "",
    service: "",
    notes: "",
  });

  function submit(event: FormEvent) {
    event.preventDefault();

    const job: OperationalJob = {
      id: `job-${Date.now()}`,
      customer: form.customer.trim() || "New Customer",
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      service: form.service.trim() || "New service request",
      notes: form.notes.trim() || "Customer submitted a new request.",
      stage: "New Request",
      paymentStatus: "not-ready",
      beforePhotos: [],
      afterPhotos: [],
      timeline: ["Customer request submitted"],
    };

    const current = readJobs(boardSlug);
    saveJobs(boardSlug, [job, ...current]);
    setSubmitted(true);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 12% 8%, rgba(56,189,248,0.16), transparent 30%), radial-gradient(circle at 88% 10%, rgba(16,185,129,0.14), transparent 28%), #07111f",
        color: "white",
        padding: 18,
      }}
    >
      <section
        style={{
          maxWidth: 760,
          margin: "0 auto",
          borderRadius: 30,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.38)",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: 999,
            border: "1px solid rgba(125,211,252,0.24)",
            background: "rgba(14,165,233,0.12)",
            color: "#e0f2fe",
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          CUSTOMER FRONT DOOR
        </div>

        <h1 style={{ margin: "14px 0 8px", fontSize: 42, lineHeight: 1 }}>
          {businessName}
        </h1>

        <p style={{ margin: 0, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>
          Request service, ask a question, or send job details. Your request goes straight to the live board.
        </p>

        {submitted ? (
          <div
            style={{
              marginTop: 22,
              borderRadius: 22,
              border: "1px solid rgba(16,185,129,0.28)",
              background: "rgba(16,185,129,0.12)",
              padding: 18,
            }}
          >
            <h2 style={{ margin: 0 }}>Request received.</h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.6 }}>
              Your request has been added to the live board.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                padding: "11px 14px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ marginTop: 22, display: "grid", gap: 12 }}>
            {[
              ["customer", "Name"],
              ["phone", "Phone"],
              ["email", "Email"],
              ["address", "Service address"],
              ["service", "What do you need?"],
            ].map(([key, label]) => (
              <label key={key} style={{ display: "grid", gap: 6, fontWeight: 900 }}>
                {label}
                <input
                  value={(form as any)[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  style={{
                    height: 44,
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(0,0,0,0.28)",
                    color: "white",
                    padding: "0 12px",
                    outline: "none",
                  }}
                />
              </label>
            ))}

            <label style={{ display: "grid", gap: 6, fontWeight: 900 }}>
              Notes / photos / details
              <textarea
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                style={{
                  minHeight: 110,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(0,0,0,0.28)",
                  color: "white",
                  padding: 12,
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                marginTop: 8,
                borderRadius: 18,
                border: "1px solid rgba(16,185,129,0.35)",
                background: "rgba(16,185,129,0.18)",
                color: "#d1fae5",
                padding: "14px 16px",
                fontWeight: 950,
                cursor: "pointer",
              }}
            >
              Send Request
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
