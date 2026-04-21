import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type BookingForm = {
  name: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  notes: string;
};

type StarterPayload = {
  boardSlug?: string;
  businessName?: string;
  businessType?: string;
};

const FALLBACK_BOARD_SLUG = "color-me-crazy-demo";

const INITIAL_FORM: BookingForm = {
  name: "",
  phone: "",
  service: "",
  stylist: "",
  date: "",
  time: "",
  notes: "",
};

function readStarterPayload(): StarterPayload {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem("hp_starter_payload");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StarterPayload;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function resolveServiceOptions(businessName: string, businessType: string) {
  const combined = `${businessName} ${businessType}`.toLowerCase();

  if (
    combined.includes("trash") ||
    combined.includes("garbage") ||
    combined.includes("bin cleaning") ||
    combined.includes("can cleaning") ||
    combined.includes("clean cans")
  ) {
    return [
      "One-Time Can Cleaning",
      "Monthly Can Cleaning",
      "Two Can Cleaning",
      "Three Can Cleaning",
      "HOA / Multi-Home Service",
      "Quote Request",
    ];
  }

  if (
    combined.includes("salon") ||
    combined.includes("beauty") ||
    combined.includes("hair") ||
    combined.includes("stylist") ||
    combined.includes("color me crazy")
  ) {
    return [
      "Haircut",
      "Color",
      "Blowout",
      "Highlights",
      "Balayage",
      "Treatment",
    ];
  }

  return [
    "Standard Service",
    "Priority Service",
    "Recurring Service",
    "Consultation",
    "Quote Request",
    "Custom Request",
  ];
}

export default function BeautySalonBookingPage() {
  const starterPayload = useMemo(() => readStarterPayload(), []);

const boardSlug = useMemo(() => {
  if (typeof window === "undefined") return FALLBACK_BOARD_SLUG;
  const params = new URLSearchParams(window.location.search);
  return params.get("board") || FALLBACK_BOARD_SLUG;
}, []);

const businessName = "Color Me Crazy";
const businessType = "beauty salon";

  const serviceOptions = useMemo(
    () => resolveServiceOptions("Color Me Crazy", "beauty salon"),
    [businessName, businessType]
  );

  const [form, setForm] = useState<BookingForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    const payload = {
      board_slug: boardSlug,
      customer_name: form.name.trim(),
      phone: form.phone.trim(),
      service: form.service.trim(),
      stylist: form.stylist.trim() || null,
      appointment_date: form.date,
      appointment_time: form.time,
      notes: form.notes.trim() || null,
      status: "scheduled",
    };

    const { error } = await supabase.from("salon_appointments").insert([payload]);

    setLoading(false);

    if (error) {
      console.error("salon_appointments insert failed:", error);
      alert(`Booking failed: ${error.message}`);
      return;
    }

    setSuccess(true);
    setForm(INITIAL_FORM);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-[28px] border border-emerald-700/40 bg-neutral-950 p-8 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <div className="mx-auto mb-4 inline-flex rounded-full border border-emerald-600/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Appointment received
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">You're booked in.</h1>
            <p className="mt-3 text-sm text-neutral-400">
              The request is now on the {businessName} live board.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={`/planet/beauty/color-me-crazy?board=${encodeURIComponent(boardSlug)}`}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm font-semibold text-white"
              >
                View Live Board
              </a>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[30px] border border-neutral-800 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.07),transparent_30%),linear-gradient(180deg,#161616_0%,#0a0a0a_100%)] p-8 lg:p-10">
            <div className="inline-flex rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-300">
              {businessName}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Book your appointment.
            </h1>
            <p className="mt-4 max-w-lg text-base text-neutral-300">
              Clean. Fast. No phone tag. Drop your request and it hits the live board.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Step 1</div>
                <div className="mt-2 text-sm font-semibold">Choose service</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Step 2</div>
                <div className="mt-2 text-sm font-semibold">Pick date & time</div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Step 3</div>
                <div className="mt-2 text-sm font-semibold">It hits live</div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-neutral-800 bg-neutral-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold tracking-tight">Appointment Request</h2>
              <p className="mt-2 text-sm text-neutral-400">
                Fill this out and send it straight to the board.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
              />

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:border-white focus:outline-none"
              >
                <option value="">Select Service</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>

              <input
                name="stylist"
                placeholder="Preferred Contact or Tech (optional)"
                value={form.stylist}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:border-white focus:outline-none"
                />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white focus:border-white focus:outline-none"
                />
              </div>

              <textarea
                name="notes"
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-xl border border-neutral-700 bg-black px-4 py-3 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-70"
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

