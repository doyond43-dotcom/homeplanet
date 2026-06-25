import { useState } from "react";
import {
  CalendarCheck,
  Droplets,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { hpEvent } from "../lib/hpEvent";

export default function RidgelineLandingV2() {
  const phone = "8638013179";
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  async function handleQuoteSubmit() {
    const section = document.getElementById("ridgeline-quote");
    if (!section) return;

    const selects = Array.from(section.querySelectorAll("select")) as HTMLSelectElement[];
    const inputs = Array.from(section.querySelectorAll("input")) as HTMLInputElement[];

    const serviceType = selects[0]?.value || "";
    const propertyType = selects[1]?.value || "";
    const surfaceType = selects[2]?.value || "";
    const accessDetails = selects[3]?.value || "";
    const condition = selects[4]?.value || "";
    const preferredTime = selects[5]?.value || "";

    const textInputs = inputs.filter((input) => input.type !== "file" && input.type !== "checkbox");
    const fileInput = inputs.find((input) => input.type === "file");
    const agreementInput = inputs.find((input) => input.type === "checkbox");

    const name = textInputs[0]?.value?.trim() || "";
    const phoneNumber = textInputs[1]?.value?.trim() || "";
    const streetAddress = textInputs[2]?.value?.trim() || "";
    const photoCount = fileInput?.files?.length || 0;
    const agreementChecked = Boolean(agreementInput?.checked);

    if (!name || !phoneNumber || !streetAddress) {
      setQuoteError("Please add your name, phone number, and street address before sending your quote request.");
      return;
    }

    if (!agreementChecked) {
      setQuoteError("Please confirm the pricing note before sending your quote request.");
      return;
    }

    const quoteDetails = [
      `Service Type: ${serviceType}`,
      `Property Type: ${propertyType}`,
      `Surface Type: ${surfaceType}`,
      `Access Details: ${accessDetails}`,
      `Condition: ${condition}`,
      `Preferred Time: ${preferredTime}`,
      `Street Address: ${streetAddress}`,
      `Photos Attached: ${photoCount > 0 ? "Yes" : "No"}`,
      "Source: Ridgeline Pressure Cleaning landing page quote form",
    ].join("\n");

    setQuoteSubmitting(true);
    setQuoteError("");

    try {
      const { error } = await supabase.from("cleaning_requests").insert({
        business_slug: "ridgeline",
        request_type: "quote",
        customer_name: name,
        customer_phone: phoneNumber,
        customer_address: streetAddress,
        preferred_time: preferredTime,
        notes: quoteDetails,
        status: "new",
      });

      if (error) {
        throw error;
      }

      hpEvent("ridgeline", "quote_request_submitted", {
        source: "RidgelineLandingV2",
        serviceType,
        propertyType,
        surfaceType,
        accessDetails,
        condition,
        preferredTime,
        name,
        phone: phoneNumber,
        streetAddress,
        photoCount,
      });

      setQuoteSubmitted(true);
    } catch (error) {
      console.error("Ridgeline quote request failed:", error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      setQuoteError(`Submit error: ${message}`);
    } finally {
      setQuoteSubmitting(false);
    }
  }

  const services = [
    {
      icon: Droplets,
      title: "Pressure Washing",
      text: "Driveways, sidewalks, concrete, and exterior surfaces cleaned for Okeechobee homes and properties.",
    },
    {
      icon: Home,
      title: "House Washing",
      text: "Soft washing for siding, trim, exterior walls, soffits, and everyday buildup around the home.",
    },
    {
      icon: ShieldCheck,
      title: "Roof Washing",
      text: "Careful exterior cleaning for roof stains, algae, and grime with the right approach for the surface.",
    },
    {
      icon: Sparkles,
      title: "Driveways & Walkways",
      text: "Clean curb appeal for concrete, entryways, parking areas, patios, and walk paths.",
    },
    {
      icon: Waves,
      title: "Patios & Fences",
      text: "Outdoor living spaces, fences, screened areas, and backyard surfaces refreshed and cleaned.",
    },
    {
      icon: CalendarCheck,
      title: "Maintenance Cleaning",
      text: "Recurring exterior cleaning for homes, rentals, waterfront properties, and busy seasonal schedules.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#07080d] text-white">
      <section className="relative border-b border-amber-300/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(245,158,11,0.24),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.16),transparent_32%),linear-gradient(135deg,#07080d_0%,#1b1208_55%,#05060a_100%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-200">
                <Droplets size={22} />
              </div>
              <div>
                <p className="text-lg font-black leading-none">Ridgeline</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.35em] text-amber-200">
                  Pressure Cleaning
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black shadow-lg shadow-amber-500/25"
              >
                <Phone size={15} />
                Call Ridgeline
              </a>
              <a
                href={`sms:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Ridgeline
              </a>
            </div>
          </header>

          <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
            <div>
              <p className="font-serif text-2xl italic text-amber-200">
                Exterior cleaning for Okeechobee homes.
              </p>

              <h1 className="mt-6 max-w-3xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Ridgeline <span className="text-amber-400">Pressure</span>
                <span className="block font-serif italic text-white">Cleaning</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-200">
                Pressure washing, soft washing, driveway cleaning, house washing, roof washing, patios, fences, and exterior cleanup for properties around Okeechobee.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black shadow-lg shadow-amber-500/25"
                >
                  <Phone size={16} />
                  Call Ridgeline
                </a>
                <a
                  href={`sms:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <MessageCircle size={16} />
                  Text Ridgeline
                </a>
                <a
                  href="#ridgeline-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <CalendarCheck size={16} />
                  Request Quote
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-6 text-xs font-bold text-zinc-300">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-amber-300" />
                  Local exterior cleaning
                </span>
                <span className="inline-flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-300" />
                  Photos help price faster
                </span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[2.25rem] border border-amber-300/20 bg-white/5 p-5 shadow-2xl shadow-amber-950/40">
                <div className="flex h-[520px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.22),transparent_34%),linear-gradient(145deg,rgba(15,23,42,0.96),rgba(3,7,18,0.98))]">
                  <div className="px-8 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/25 bg-amber-400/10 text-amber-200">
                      <Droplets size={38} />
                    </div>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-amber-200">
                      Ridgeline
                    </p>
                    <h2 className="mt-4 text-4xl font-black leading-tight">
                      Clean exterior.
                      <span className="block font-serif italic text-amber-200">Clear next move.</span>
                    </h2>
                    <p className="mt-5 text-sm leading-6 text-zinc-300">
                      Send the address, choose the service, add photos, and Ridgeline can review the job from one organized request.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-amber-300">
            Services
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Exterior cleaning made simple.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
            Ridgeline Pressure Cleaning helps Okeechobee homeowners with pressure washing, soft washing, driveway cleaning, house washing, roof washing, patios, fences, and exterior grime removal.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 text-center shadow-xl shadow-black/20"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/15 text-amber-200">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight">{service.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-300">{service.text}</p>
              </article>
            );
          })}
        </div>

        <section id="ridgeline-quote" className="mt-14 rounded-[2rem] border border-amber-300/20 bg-amber-950/20 p-6 shadow-2xl shadow-amber-950/25 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-amber-300">
            Get My Exterior Cleaning Quote
          </p>

          <h2 className="mt-4 font-serif text-4xl italic leading-tight text-amber-100 sm:text-5xl">
            Tell us what needs cleaned and where the job is.
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-200">
            Photos help Ridgeline see algae, oxidation, rust, spider webs, waterfront grime, access issues, and surface condition before quoting.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#1b1208] text-white">Pressure Washing</option>
              <option className="bg-[#1b1208] text-white">Soft Wash / House Washing</option>
              <option className="bg-[#1b1208] text-white">Driveway / Walkway Cleaning</option>
              <option className="bg-[#1b1208] text-white">Roof Washing</option>
              <option className="bg-[#1b1208] text-white">Patio / Fence Cleaning</option>
              <option className="bg-[#1b1208] text-white">Exterior Detail / Other</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#1b1208] text-white">Property Type</option>
              <option className="bg-[#1b1208] text-white">Single Family Home</option>
              <option className="bg-[#1b1208] text-white">Mobile Home</option>
              <option className="bg-[#1b1208] text-white">Rental Property</option>
              <option className="bg-[#1b1208] text-white">Commercial Property</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#1b1208] text-white">Surface Type</option>
              <option className="bg-[#1b1208] text-white">Concrete / Driveway</option>
              <option className="bg-[#1b1208] text-white">Siding / Exterior Walls</option>
              <option className="bg-[#1b1208] text-white">Roof</option>
              <option className="bg-[#1b1208] text-white">Fence / Patio / Screen Area</option>
              <option className="bg-[#1b1208] text-white">Multiple Areas</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#1b1208] text-white">Access Details</option>
              <option className="bg-[#1b1208] text-white">Open Access</option>
              <option className="bg-[#1b1208] text-white">Gate Code Needed</option>
              <option className="bg-[#1b1208] text-white">Customer Must Be Home</option>
              <option className="bg-[#1b1208] text-white">Limited Access</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#1b1208] text-white">Condition</option>
              <option className="bg-[#1b1208] text-white">Light Buildup</option>
              <option className="bg-[#1b1208] text-white">Moderate Algae / Grime</option>
              <option className="bg-[#1b1208] text-white">Heavy Algae / Spider Webs</option>
              <option className="bg-[#1b1208] text-white">Rust / Oxidation / Waterfront Grime</option>
              <option className="bg-[#1b1208] text-white">Needs Site Review</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#1b1208] text-white">Preferred Time</option>
              <option className="bg-[#1b1208] text-white">Mornings</option>
              <option className="bg-[#1b1208] text-white">Afternoons</option>
              <option className="bg-[#1b1208] text-white">Evenings</option>
              <option className="bg-[#1b1208] text-white">Flexible</option>
            </select>

            <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark] lg:col-span-1" placeholder="Your Name" />

            <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark] lg:col-span-2" placeholder="Phone Number" />

            <div className="grid gap-3 rounded-2xl border border-dashed border-amber-300/30 bg-black/30 p-4 text-sm text-zinc-300 lg:col-span-3 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-amber-200">Upload Photos</span>
                <p className="mb-3 text-xs leading-5 text-zinc-400">Optional — show algae, rust, oxidation, spider webs, roof stains, driveway buildup, or access areas.</p>
                <input type="file" multiple className="block w-full text-xs text-zinc-400" />
              </label>

              <label className="block lg:col-span-2">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-amber-200">Street Address</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]" placeholder="Street Address" autoComplete="street-address" />
              </label>
            </div>

            <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-zinc-300 lg:col-span-3">
              <input type="checkbox" className="mt-1" />
              I understand final pricing depends on surface type, size, access, condition, stains, algae, oxidation, rust, and requested services.
            </label>

            {quoteError && (
              <p className="rounded-2xl border border-amber-300/25 bg-black/30 px-4 py-3 text-sm font-semibold text-amber-100 lg:col-span-3">
                {quoteError}
              </p>
            )}

            <button type="button" onClick={handleQuoteSubmit} disabled={quoteSubmitting} className="rounded-2xl bg-amber-400 py-4 text-sm font-black uppercase tracking-[0.22em] text-black lg:col-span-3 disabled:cursor-not-allowed disabled:opacity-70">
              {quoteSubmitting ? "Sending..." : "Request My Quote"}
            </button>
          </div>
        </section>

        <div className="mt-14 grid gap-8 rounded-[2rem] border border-amber-300/20 bg-amber-950/25 p-8 sm:p-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <h2 className="font-serif text-5xl italic leading-tight text-amber-200">
            Clean curb appeal starts with a clear request.
          </h2>

          <div>
            <p className="text-base leading-7 text-zinc-200">
              Call, text, or send a quote request. Ridgeline can review the service type, address, photos, surface condition, and next move from one organized intake.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black"
              >
                <Phone size={16} />
                Call Ridgeline
              </a>
              <a
                href={`sms:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <MessageCircle size={16} />
                Text Ridgeline
              </a>
              <a
                href="#ridgeline-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/20 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <CalendarCheck size={16} />
                Request Quote
              </a>
            </div>
          </div>
        </div>

        <footer className="py-12 text-center">
          <p className="font-serif text-3xl italic text-amber-200">
            Ridgeline Pressure Cleaning
          </p>
          <p className="mt-3 text-sm font-semibold text-zinc-300">
            Pressure washing and exterior cleaning in Okeechobee, Florida
          </p>
          <p className="mt-6 text-xs text-zinc-500">
            &copy; 2026 Ridgeline Pressure Cleaning
          </p>
          <p className="mt-2 text-[11px] text-zinc-600">
            Made with HomePlanet
          </p>
        </footer>
      </section>

      {quoteSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-amber-300/25 bg-[#181006] p-7 text-center shadow-2xl shadow-amber-950/50 sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/15 text-amber-200">
              <Droplets size={26} />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.32em] text-amber-300">
              Request Received
            </p>

            <h2 className="mt-4 font-serif text-4xl italic leading-tight text-amber-100">
              Thank you.
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-200">
              Your Ridgeline quote request has been received. The details, address, service type, and notes are now ready for review.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black"
              >
                <Phone size={15} />
                Call Ridgeline
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Ridgeline
              </a>
            </div>

            <button
              type="button"
              onClick={() => setQuoteSubmitted(false)}
              className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-amber-200 underline-offset-4 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
