import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "hp:business-setup-form";

type FormState = {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  contactMethod: string;
  businessType: string;
  currentWebsite: string;
  facebook: string;
  instagram: string;
  goal: string;
  wants: string[];
  notes: string;
};

const initialForm: FormState = {
  businessName: "",
  ownerName: "",
  phone: "",
  email: "",
  contactMethod: "",
  businessType: "",
  currentWebsite: "",
  facebook: "",
  instagram: "",
  goal: "",
  wants: [],
  notes: "",
};

const wantOptions = [
  "Live business page",
  "Customer requests",
  "Booking/contact flow",
  "Order tracking",
  "Artwork/media uploads",
  "QR code setup",
  "Payment tracking",
  "Ongoing updates",
];

export default function BusinessSetupForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setForm(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const update = (key: keyof FormState, value: string) => {
    setSent(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleWant = (value: string) => {
    setSent(false);
    setForm((prev) => {
      const exists = prev.wants.includes(value);
      return {
        ...prev,
        wants: exists
          ? prev.wants.filter((item) => item !== value)
          : [...prev.wants, value],
      };
    });
  };

  const clearForm = () => {
    if (confirm("Clear this request?")) {
      setForm(initialForm);
      setSent(false);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const requestSummary = useMemo(() => {
    return [
      `Business: ${form.businessName || "Not provided"}`,
      `Owner: ${form.ownerName || "Not provided"}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Email: ${form.email || "Not provided"}`,
      `Best contact: ${form.contactMethod || "Not provided"}`,
      `Business type: ${form.businessType || "Not provided"}`,
      `Current website/link: ${form.currentWebsite || "Not provided"}`,
      `Facebook: ${form.facebook || "Not provided"}`,
      `Instagram: ${form.instagram || "Not provided"}`,
      `Goal: ${form.goal || "Not provided"}`,
      `Wants: ${form.wants.length ? form.wants.join(", ") : "Not selected"}`,
      `Notes: ${form.notes || "Not provided"}`,
    ].join("\n");
  }, [form]);

  const submitRequest = async () => {
    setSent(true);

    try {
      await navigator.clipboard.writeText(requestSummary);
    } catch {
      // Clipboard may be blocked by the browser. The saved confirmation still shows.
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <header className="border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/planet/start" className="text-sm font-bold tracking-[0.22em] text-white/80">
            HOMEPPLANET
          </Link>

          <div className="flex gap-2">
            <button
              onClick={clearForm}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Clear
            </button>

            <button
              onClick={() => window.print()}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Print
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/planet/charlys"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white/80"
        >
          ? Back
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section>
          <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.22em] text-cyan-300">
            LIVE BUSINESS REQUEST
          </div>

          <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-tight md:text-6xl">
            Request a Live Business System.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
            Tell us what you are building. We’ll review the details and follow
            up with the next best step for your live page, customer flow,
            tracking, QR setup, or operational board.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#111111] p-6">
            <div className="text-sm font-semibold text-white">
              Built for real business flow.
            </div>

            <p className="mt-3 text-sm leading-relaxed text-white/55">
              No bloated website setup. No confusing software maze. Just a clean
              starting point so we can understand what your business needs and
              build the right live system around it.
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-[#111111] p-6 shadow-2xl md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Business Name" value={form.businessName} onChange={(v) => update("businessName", v)} />
            <Input label="Owner Name" value={form.ownerName} onChange={(v) => update("ownerName", v)} />
            <Input label="Phone Number" value={form.phone} onChange={(v) => update("phone", v)} />
            <Input label="Email" value={form.email} onChange={(v) => update("email", v)} />
            <Select
              label="Best Contact Method"
              value={form.contactMethod}
              onChange={(v) => update("contactMethod", v)}
              options={["Call", "Text", "Facebook Messenger", "Email"]}
            />
            <Input label="Business Type" value={form.businessType} onChange={(v) => update("businessType", v)} />
            <Input label="Current Website / Link" value={form.currentWebsite} onChange={(v) => update("currentWebsite", v)} />
            <Input label="Facebook Page" value={form.facebook} onChange={(v) => update("facebook", v)} />
            <Input label="Instagram" value={form.instagram} onChange={(v) => update("instagram", v)} />
          </div>

          <Textarea
            label="What do you want this system to help with?"
            value={form.goal}
            onChange={(v) => update("goal", v)}
            placeholder="Example: booking requests, customer orders, tracking, photos, quotes, live updates..."
          />

          <CheckGroup
            label="What should be included?"
            options={wantOptions}
            selected={form.wants}
            onToggle={toggleWant}
          />

          <Textarea
            label="Special Notes / Requests"
            value={form.notes}
            onChange={(v) => update("notes", v)}
            placeholder="Anything important about your workflow, customers, photos, payments, or launch timing..."
          />

          {sent && (
            <div className="mt-5 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
              Request saved locally and copied to clipboard. Next step: send it over or connect the notification pipe.
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={submitRequest}
              className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              Send Request
            </button>

            <button
              onClick={() => navigator.clipboard.writeText(requestSummary)}
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Copy Summary
            </button>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/50"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-cyan-400/50"
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
      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
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
    <div className="mt-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/80"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

