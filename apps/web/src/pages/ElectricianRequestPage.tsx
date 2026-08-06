import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Upload,
  User,
  Zap,
} from "lucide-react";

const serviceOptions = [
  "Electrical troubleshooting",
  "Panel upgrade or replacement",
  "Outlets or switches",
  "Lighting installation",
  "EV charger installation",
  "Home electrical project",
  "Other electrical help",
];

const urgencyOptions = [
  "Emergency or immediate safety concern",
  "As soon as possible",
  "Within the next few days",
  "Planning ahead",
];

export default function ElectricianRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [urgency, setUrgency] = useState("");
  const [details, setDetails] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const notes = [
      `Electrical service: ${serviceType}`,
      `Urgency: ${urgency}`,
      `Photos selected: ${
        selectedPhotos.length > 0
          ? selectedPhotos.map((photo) => photo.name).join(", ")
          : "None"
      }`,
      "",
      details,
    ].join("\n");

    try {
      const { error } = await supabase.from("cleaning_requests").insert({
        business_slug: "okee-dokie-electric",
        request_type: "quote",
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_address: customerAddress.trim(),
        preferred_time: urgency,
        notes,
        status: "new",
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Electrician request submission failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : "Unknown database error";

      setSubmitError(
        `Your request could not be sent. Database response: ${message}`
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#04070c] px-5 py-10 text-white">
        <div className="mx-auto max-w-2xl">
          <a
            href="/planet/demo/electrician"
            className="inline-flex items-center gap-2 text-sm font-black text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Okee Dokie Electric
          </a>

          <section className="mt-10 rounded-[2rem] border border-blue-400/25 bg-[#09101b] p-7 text-center shadow-2xl shadow-blue-950/30 sm:p-10">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300">
              <CheckCircle2 size={32} />
            </span>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-blue-400">
              Request received
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              We have your electrical request.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/60">
              Thanks{customerName ? `, ${customerName}` : ""}. Your{" "}
              {serviceType ? serviceType.toLowerCase() : "electrical service"} request
              has been captured for review.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5 text-left">
              <p className="text-sm font-black">What happens next</p>

              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-black text-blue-300">
                    1
                  </span>
                  <p className="text-sm leading-6 text-white/60">
                    The electrician reviews your description, urgency, and photos.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-black text-blue-300">
                    2
                  </span>
                  <p className="text-sm leading-6 text-white/60">
                    You receive a call or text if more information is needed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-black text-blue-300">
                    3
                  </span>
                  <p className="text-sm leading-6 text-white/60">
                    The next step is confirmed, including an estimate or service visit.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a
                href="/planet/demo/electrician"
                className="flex min-h-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-5 text-sm font-black"
              >
                Return to Live Page
              </a>

              <a
                href="/planet/demo/electrician/intelligence"
                className="flex min-h-14 items-center justify-center rounded-2xl bg-blue-500 px-5 text-sm font-black"
              >
                View Customer Intelligence
              </a>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04070c] text-white">
      <header className="border-b border-white/10 bg-[#05080d]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <a
            href="/planet/demo/electrician"
            className="flex items-center gap-2 text-sm font-black text-white/75"
          >
            <ArrowLeft size={17} />
            Back
          </a>

          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
              <Zap size={18} fill="currentColor" />
            </span>

            <div>
              <p className="text-sm font-black">Okee Dokie Electric</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                Service Request
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.18),transparent_42%)] px-5 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-400">
            Electrical Service Request
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Tell us what is happening.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/60">
            Share the electrical problem, your location, urgency, and any photos
            that help explain the work.
          </p>

          <div className="mt-6 flex gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
            <ShieldCheck className="mt-0.5 shrink-0 text-blue-300" size={20} />

            <p className="text-sm leading-6 text-blue-50/80">
              For fire, smoke, active arcing, or immediate danger, move to safety
              and contact emergency services.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-6"
        >
          <section className="rounded-3xl border border-white/10 bg-[#090d14] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <User size={19} />
              </span>

              <div>
                <h2 className="font-black">Your contact information</h2>
                <p className="text-xs text-white/45">
                  How the electrician can reach you.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white/55">
                  Name
                </span>

                <input
                  required
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-base outline-none transition focus:border-blue-400/60"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white/55">
                  Phone number
                </span>

                <input
                  required
                  type="tel"
                  value={customerPhone}
                  onChange={(event) => setCustomerPhone(event.target.value)}
                  className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-base outline-none transition focus:border-blue-400/60"
                  placeholder="Best number to call or text"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#090d14] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <MapPin size={19} />
              </span>

              <div>
                <h2 className="font-black">Property location</h2>
                <p className="text-xs text-white/45">
                  Where the electrical work is needed.
                </p>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-white/55">
                Address or area
              </span>

              <input
                required
                value={customerAddress}
                onChange={(event) => setCustomerAddress(event.target.value)}
                className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-base outline-none transition focus:border-blue-400/60"
                placeholder="Street address, neighborhood, or area"
              />
            </label>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#090d14] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <Zap size={19} />
              </span>

              <div>
                <h2 className="font-black">Electrical service needed</h2>
                <p className="text-xs text-white/45">
                  Choose the closest match.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {serviceOptions.map((service) => (
                <label
                  key={service}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                    serviceType === service
                      ? "border-blue-400/60 bg-blue-500/10"
                      : "border-white/10 bg-black/25"
                  }`}
                >
                  <input
                    required
                    type="radio"
                    name="serviceType"
                    value={service}
                    checked={serviceType === service}
                    onChange={(event) => setServiceType(event.target.value)}
                    className="h-4 w-4 accent-blue-500"
                  />

                  <span className="text-sm font-bold">{service}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#090d14] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <Clock3 size={19} />
              </span>

              <div>
                <h2 className="font-black">How urgent is it?</h2>
                <p className="text-xs text-white/45">
                  Help the electrician understand timing.
                </p>
              </div>
            </div>

            <select
              required
              value={urgency}
              onChange={(event) => setUrgency(event.target.value)}
              className="min-h-14 w-full rounded-2xl border border-white/10 bg-black/40 px-4 text-base outline-none transition focus:border-blue-400/60"
            >
              <option value="" disabled hidden>
                Select urgency
              </option>

              {urgencyOptions.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </select>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#090d14] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <AlertTriangle size={19} />
              </span>

              <div>
                <h2 className="font-black">Describe the problem or project</h2>
                <p className="text-xs text-white/45">
                  Include what happened and what you have already noticed.
                </p>
              </div>
            </div>

            <textarea
              required
              rows={6}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-base outline-none transition focus:border-blue-400/60"
              placeholder="Example: Half the house lost power after the breaker tripped. I reset it once, but the power went out again."
            />
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#090d14] p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300">
                <Camera size={19} />
              </span>

              <div>
                <h2 className="font-black">Add photos</h2>
                <p className="text-xs text-white/45">
                  Panel, breaker, outlet, fixture, or project-location photos can help.
                </p>
              </div>
            </div>

            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-blue-400/35 bg-blue-500/[0.05] px-5 text-center">
              <Upload size={24} className="text-blue-300" />

              <span className="mt-3 text-sm font-black">
                Take or upload photos
              </span>

              <span className="mt-1 text-xs text-white/45">
                {selectedPhotos.length > 0
                  ? `${selectedPhotos.length} photo${
                      selectedPhotos.length === 1 ? "" : "s"
                    } selected`
                  : "Optional — no photos selected"}
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>
                  setSelectedPhotos(Array.from(event.target.files ?? []))
                }
                className="hidden"
              />
            </label>
          </section>

          {submitError && (
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-blue-500 px-6 text-sm font-black uppercase tracking-[0.08em] shadow-[0_20px_60px_rgba(37,99,235,0.28)] transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {submitting ? "Sending Request..." : "Send Electrical Request"}
          </button>

          <p className="text-center text-xs leading-5 text-white/35">
            Your request will appear in the Okee Dokie Electric Live Board after it is accepted.
          </p>
        </form>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-black">
          <Phone size={15} className="text-blue-400" />
          Okee Dokie Electric
        </div>

        <p className="mt-2 text-xs text-white/35">
          Powered by the HomePlanet Live Page and Live Board system.
        </p>
      </footer>
    </main>
  );
}


