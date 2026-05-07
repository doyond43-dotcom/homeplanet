import { useEffect, useState } from "react";

const STORAGE_KEY = "hp:business-setup-form";

type FormState = {
  businessName: string;
  ownerName: string;
  phone: string;
  contactMethod: string;
  email: string;
  facebook: string;
  instagram: string;
  services: string;
  serviceArea: string;
  hours: string;
  payments: string[];
  wants: string[];
  difference: string;
  notes: string;
  photosSent: string;
  paymentStatus: string;
  amountReceived: string;
  date: string;
};

const initialForm: FormState = {
  businessName: "",
  ownerName: "",
  phone: "",
  contactMethod: "",
  email: "",
  facebook: "",
  instagram: "",
  services: "",
  serviceArea: "",
  hours: "",
  payments: [],
  wants: [],
  difference: "",
  notes: "",
  photosSent: "",
  paymentStatus: "",
  amountReceived: "",
  date: new Date().toLocaleDateString(),
};

const paymentOptions = ["Cash", "Cash App", "Zelle", "Venmo", "Card", "Other"];
const wantOptions = [
  "Booking Requests",
  "Customer Messages",
  "Live Updates",
  "QR Codes",
  "Before/After Photos",
  "Payment Tracking",
  "Print Receipts/Tickets",
];

export default function BusinessSetupForm() {
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setForm(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleList = (key: "payments" | "wants", value: string) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists ? prev[key].filter((v) => v !== value) : [...prev[key], value],
      };
    });
  };

  const resetForm = () => {
    if (confirm("Clear this form?")) {
      setForm(initialForm);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 px-4 py-6 text-zinc-950 print:bg-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-5 shadow-xl print:border-none print:shadow-none">
        <div className="mb-5 flex flex-col gap-3 border-b border-rose-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-500">
              HomePlanet Setup
            </p>
            <h1 className="text-2xl font-black tracking-tight">
              Live Page + Business Intake
            </h1>
            <p className="text-sm text-zinc-600">
              Fill this out, screenshot it, print it, or text it over.
            </p>
          </div>

          <div className="flex gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-bold text-white"
            >
              Print
            </button>
            <button
              onClick={resetForm}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-bold"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input label="Business Name" value={form.businessName} onChange={(v) => update("businessName", v)} />
          <Input label="Owner Name" value={form.ownerName} onChange={(v) => update("ownerName", v)} />
          <Input label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} />
          <Input label="Email" value={form.email} onChange={(v) => update("email", v)} />
          <Input label="Facebook Page" value={form.facebook} onChange={(v) => update("facebook", v)} />
          <Input label="Instagram" value={form.instagram} onChange={(v) => update("instagram", v)} />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Select
            label="Best Contact Method"
            value={form.contactMethod}
            onChange={(v) => update("contactMethod", v)}
            options={["Call", "Text", "Facebook Messenger", "Email"]}
          />
          <Input label="Business Hours" value={form.hours} onChange={(v) => update("hours", v)} />
        </div>

        <Textarea label="Business Type / Services" value={form.services} onChange={(v) => update("services", v)} />
        <Textarea label="Service Area / Cities" value={form.serviceArea} onChange={(v) => update("serviceArea", v)} />

        <CheckGroup
          label="Payment Methods Accepted"
          options={paymentOptions}
          selected={form.payments}
          onToggle={(v) => toggleList("payments", v)}
        />

        <CheckGroup
          label="What Do You Want Included?"
          options={wantOptions}
          selected={form.wants}
          onToggle={(v) => toggleList("wants", v)}
        />

        <Textarea
          label="What Makes Your Business Different?"
          value={form.difference}
          onChange={(v) => update("difference", v)}
        />

        <Textarea
          label="Special Notes / Requests"
          value={form.notes}
          onChange={(v) => update("notes", v)}
        />
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function CheckGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs font-black uppercase tracking-wide text-zinc-500">{label}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
