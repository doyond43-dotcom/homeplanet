import { useState } from "react";
import {
  CalendarCheck,
  House,
  Leaf,
  MessageCircle,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  TreePine,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { hpEvent } from "../lib/hpEvent";

export default function VZProfessionalLawncareLanding() {
  const phone = "8635328123";

  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  async function handleQuoteSubmit() {
    const section = document.getElementById("vz-quote");
    if (!section) return;

    const selects = Array.from(
      section.querySelectorAll("select"),
    ) as HTMLSelectElement[];

    const inputs = Array.from(
      section.querySelectorAll("input"),
    ) as HTMLInputElement[];

    const serviceType = selects[0]?.value || "";
    const propertyType = selects[1]?.value || "";
    const propertySize = selects[2]?.value || "";
    const accessDetails = selects[3]?.value || "";
    const condition = selects[4]?.value || "";
    const preferredTime = selects[5]?.value || "";

    const textInputs = inputs.filter(
      (input) => input.type !== "file" && input.type !== "checkbox",
    );

    const fileInput = inputs.find((input) => input.type === "file");
    const agreementInput = inputs.find((input) => input.type === "checkbox");

    const name = textInputs[0]?.value?.trim() || "";
    const phoneNumber = textInputs[1]?.value?.trim() || "";
    const streetAddress = textInputs[2]?.value?.trim() || "";

    const photoCount = fileInput?.files?.length || 0;
    const agreementChecked = Boolean(agreementInput?.checked);

    if (!name || !phoneNumber || !streetAddress) {
      setQuoteError(
        "Please add your name, phone number, and street address before sending your estimate request.",
      );
      return;
    }

    if (!agreementChecked) {
      setQuoteError(
        "Please confirm the pricing note before sending your estimate request.",
      );
      return;
    }

    const quoteDetails = [
      `Service Type: ${serviceType}`,
      `Property Type: ${propertyType}`,
      `Property Size: ${propertySize}`,
      `Access Details: ${accessDetails}`,
      `Property Condition: ${condition}`,
      `Preferred Time: ${preferredTime}`,
      `Street Address: ${streetAddress}`,
      `Photos Attached: ${photoCount > 0 ? "Yes" : "No"}`,
      "Source: V&Z Professional Lawncare landing page estimate form",
    ].join("\n");

    setQuoteSubmitting(true);
    setQuoteError("");

    try {
      const { error } = await supabase.from("cleaning_requests").insert({
        business_slug: "vz-professional-lawncare",
        request_type: "estimate",
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

      hpEvent("vz-professional-lawncare", "estimate_request_submitted", {
        source: "VZProfessionalLawncareLanding",
        serviceType,
        propertyType,
        propertySize,
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
      console.error("V&Z estimate request failed:", error);

      const message =
        error instanceof Error ? error.message : JSON.stringify(error);

      setQuoteError(`Submit error: ${message}`);
    } finally {
      setQuoteSubmitting(false);
    }
  }

  const services = [
    {
      icon: Leaf,
      title: "Mowing",
      text: "Routine lawn mowing that keeps residential and commercial properties looking clean and cared for.",
    },
    {
      icon: Scissors,
      title: "Edging & Trimming",
      text: "Sharp edges and detailed trimming around driveways, walkways, beds, fences, and landscaping.",
    },
    {
      icon: TreePine,
      title: "Mulch Installation",
      text: "Fresh mulch installation that improves curb appeal and gives landscape beds a clean finish.",
    },
    {
      icon: House,
      title: "Gutter Cleaning",
      text: "Leaves and debris removed to help gutters drain properly and protect the outside of the property.",
    },
    {
      icon: Sparkles,
      title: "Window Cleaning",
      text: "Exterior window cleaning for a brighter, cleaner appearance around homes and businesses.",
    },
    {
      icon: ShieldCheck,
      title: "Roof Cleaning",
      text: "Careful roof and exterior cleaning based on the surface, buildup, access, and property condition.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050706] text-white">
      <section className="relative border-b border-lime-300/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,197,94,0.24),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(250,204,21,0.14),transparent_30%),linear-gradient(135deg,#050706_0%,#062b12_55%,#020403_100%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between gap-4">
            <a href="/vz" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-lime-300/30 bg-lime-300/10 text-lime-200">
                <Leaf size={22} />
              </div>

              <div>
                <p className="text-lg font-black leading-none">
                  V&amp;Z
                </p>

                <p className="mt-1 text-xs font-black uppercase tracking-[0.28em] text-lime-300">
                  Professional Lawncare
                </p>
              </div>
            </a>

            <div className="hidden items-center gap-3 sm:flex">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black shadow-lg shadow-yellow-500/20"
              >
                <Phone size={15} />
                Call Eric
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-lime-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Eric
              </a>
            </div>
          </header>

          <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-lime-300">
                Professional property care
              </p>

              <h1 className="mt-6 max-w-3xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Clean work.
                <span className="block text-lime-400">
                  Strong curb appeal.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-200">
                Professional mowing, edging, trimming, mulch installation,
                gutter cleaning, window cleaning, roof cleaning, and exterior
                property care around Okeechobee.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black shadow-lg shadow-yellow-500/20"
                >
                  <Phone size={16} />
                  Call Eric
                </a>

                <a
                  href={`sms:${phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-lime-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <MessageCircle size={16} />
                  Text Eric
                </a>

                <a
                  href="#vz-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
                >
                  <CalendarCheck size={16} />
                  Free Estimate
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-6 text-xs font-bold text-zinc-300">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-lime-300" />
                  Local property service
                </span>

                <span className="inline-flex items-center gap-2">
                  <Sparkles size={15} className="text-yellow-300" />
                  Photos help quote faster
                </span>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[2.25rem] border border-lime-300/20 bg-white/5 p-5 shadow-2xl shadow-green-950/50">
                <div className="relative flex h-[520px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_75%_15%,rgba(163,230,53,0.18),transparent_30%),linear-gradient(145deg,#0b8b34,#075c24_55%,#031d0c)]">
                  <div className="absolute -bottom-28 -left-20 -right-20 h-64 rotate-[-7deg] rounded-[50%] bg-[#050706]" />
                  <div className="absolute bottom-[112px] -left-16 -right-16 h-3 rotate-[-7deg] rounded-full bg-yellow-400" />

                  <div className="relative z-10 px-8 text-center">
                    <p className="text-7xl font-black tracking-[-0.09em] sm:text-8xl">
                      V<span className="mx-1 text-4xl text-lime-300">&amp;</span>Z
                    </p>

                    <p className="mt-6 text-xs font-black uppercase tracking-[0.34em] text-lime-200">
                      Professional
                    </p>

                    <h2 className="mt-3 text-4xl font-black leading-tight">
                      Lawncare
                      <span className="block text-yellow-300">LLC</span>
                    </h2>

                    <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-white/80">
                      Professional · Reliable · Detail Driven
                    </p>

                    <p className="mt-20 text-2xl font-black tracking-tight">
                      (863) 532-8123
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
          <p className="text-xs font-black uppercase tracking-[0.4em] text-lime-300">
            Services
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Property care made simple.
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
            V&amp;Z helps Okeechobee property owners with routine lawn
            maintenance, detailed trimming, mulch installation, gutter
            cleaning, window cleaning, roof cleaning, and additional exterior
            work.
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-300/25 bg-lime-400/10 text-lime-200">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-xl font-black leading-tight">
                  {service.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {service.text}
                </p>
              </article>
            );
          })}
        </div>

        <section
          id="vz-quote"
          className="mt-14 rounded-[2rem] border border-lime-300/20 bg-green-950/25 p-6 shadow-2xl shadow-green-950/30 sm:p-8"
        >
          <p className="text-xs font-black uppercase tracking-[0.32em] text-lime-300">
            Get My Free Estimate
          </p>

          <h2 className="mt-4 text-4xl font-black leading-tight text-lime-100 sm:text-5xl">
            Tell Eric what your property needs.
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-200">
            Choose the service, share the address and property condition, and
            add photos when they help show the yard, landscaping, roof,
            gutters, windows, or access areas.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#062b12] text-white">
                Service Needed
              </option>
              <option className="bg-[#062b12] text-white">Mowing</option>
              <option className="bg-[#062b12] text-white">
                Edging / Trimming
              </option>
              <option className="bg-[#062b12] text-white">
                Mulch Installation
              </option>
              <option className="bg-[#062b12] text-white">
                Gutter Cleaning
              </option>
              <option className="bg-[#062b12] text-white">
                Window Cleaning
              </option>
              <option className="bg-[#062b12] text-white">
                Roof Cleaning
              </option>
              <option className="bg-[#062b12] text-white">
                Multiple Services / Other
              </option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#062b12] text-white">
                Property Type
              </option>
              <option className="bg-[#062b12] text-white">
                Single Family Home
              </option>
              <option className="bg-[#062b12] text-white">
                Mobile Home
              </option>
              <option className="bg-[#062b12] text-white">
                Rental Property
              </option>
              <option className="bg-[#062b12] text-white">
                Commercial Property
              </option>
              <option className="bg-[#062b12] text-white">
                Vacant Property
              </option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#062b12] text-white">
                Property Size
              </option>
              <option className="bg-[#062b12] text-white">
                Small Yard
              </option>
              <option className="bg-[#062b12] text-white">
                Average Yard
              </option>
              <option className="bg-[#062b12] text-white">
                Large Yard
              </option>
              <option className="bg-[#062b12] text-white">
                Multiple Lots / Large Property
              </option>
              <option className="bg-[#062b12] text-white">
                Needs Site Review
              </option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#062b12] text-white">
                Access Details
              </option>
              <option className="bg-[#062b12] text-white">
                Open Access
              </option>
              <option className="bg-[#062b12] text-white">
                Gate Code Needed
              </option>
              <option className="bg-[#062b12] text-white">
                Customer Must Be Home
              </option>
              <option className="bg-[#062b12] text-white">
                Pets in Yard
              </option>
              <option className="bg-[#062b12] text-white">
                Limited Access
              </option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#062b12] text-white">
                Property Condition
              </option>
              <option className="bg-[#062b12] text-white">
                Routine Maintenance
              </option>
              <option className="bg-[#062b12] text-white">
                Grass Is Tall
              </option>
              <option className="bg-[#062b12] text-white">
                Overgrown
              </option>
              <option className="bg-[#062b12] text-white">
                Heavy Trimming Needed
              </option>
              <option className="bg-[#062b12] text-white">
                Debris / Cleanup Needed
              </option>
              <option className="bg-[#062b12] text-white">
                Needs Site Review
              </option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#062b12] text-white">
                Preferred Time
              </option>
              <option className="bg-[#062b12] text-white">Mornings</option>
              <option className="bg-[#062b12] text-white">
                Afternoons
              </option>
              <option className="bg-[#062b12] text-white">Evenings</option>
              <option className="bg-[#062b12] text-white">Flexible</option>
            </select>

            <input
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark] lg:col-span-1"
              placeholder="Your Name"
              autoComplete="name"
            />

            <input
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark] lg:col-span-2"
              placeholder="Phone Number"
              autoComplete="tel"
            />

            <div className="grid gap-3 rounded-2xl border border-dashed border-lime-300/30 bg-black/30 p-4 text-sm text-zinc-300 lg:col-span-3 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-lime-200">
                  Upload Photos
                </span>

                <p className="mb-3 text-xs leading-5 text-zinc-400">
                  Optional — show the yard, tall grass, landscaping, gutters,
                  windows, roof, debris, or access areas.
                </p>

                <input
                  type="file"
                  multiple
                  className="block w-full text-xs text-zinc-400"
                />
              </label>

              <label className="block lg:col-span-2">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-lime-200">
                  Street Address
                </span>

                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]"
                  placeholder="Street Address"
                  autoComplete="street-address"
                />
              </label>
            </div>

            <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-zinc-300 lg:col-span-3">
              <input type="checkbox" className="mt-1" />

              I understand final pricing depends on the requested services,
              property size, grass height, condition, access, debris, roof or
              gutter condition, and the amount of work required.
            </label>

            {quoteError && (
              <p className="rounded-2xl border border-yellow-300/25 bg-black/30 px-4 py-3 text-sm font-semibold text-yellow-100 lg:col-span-3">
                {quoteError}
              </p>
            )}

            <button
              type="button"
              onClick={handleQuoteSubmit}
              disabled={quoteSubmitting}
              className="rounded-2xl bg-yellow-400 py-4 text-sm font-black uppercase tracking-[0.22em] text-black lg:col-span-3 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {quoteSubmitting
                ? "Sending..."
                : "Request My Free Estimate"}
            </button>
          </div>
        </section>

        <div className="mt-14 grid gap-8 rounded-[2rem] border border-lime-300/20 bg-green-950/30 p-8 sm:p-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <h2 className="text-5xl font-black leading-tight text-lime-200">
            Better curb appeal starts with a clear request.
          </h2>

          <div>
            <p className="text-base leading-7 text-zinc-200">
              Call, text, or send an estimate request. Eric can review the
              service, address, photos, property condition, access, and next
              move from one organized request.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black"
              >
                <Phone size={16} />
                Call Eric
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-lime-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <MessageCircle size={16} />
                Text Eric
              </a>

              <a
                href="#vz-quote"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/20 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <CalendarCheck size={16} />
                Free Estimate
              </a>
            </div>
          </div>
        </div>

        <footer className="py-12 text-center">
          <p className="text-3xl font-black text-lime-200">
            V&amp;Z Professional Lawncare LLC
          </p>

          <p className="mt-3 text-sm font-semibold text-zinc-300">
            Lawn care and exterior property services in Okeechobee, Florida
          </p>

          <p className="mt-6 text-xs text-zinc-500">
            &copy; 2026 V&amp;Z Professional Lawncare LLC
          </p>

          <p className="mt-2 text-[11px] text-zinc-600">
            Made with HomePlanet
          </p>
        </footer>
      </section>

      {quoteSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-lime-300/25 bg-[#062b12] p-7 text-center shadow-2xl shadow-green-950/60 sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-lime-300/30 bg-lime-400/10 text-lime-200">
              <Leaf size={26} />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.32em] text-lime-300">
              Request Received
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight text-lime-100">
              Thank you.
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-200">
              Your V&amp;Z estimate request has been received. The service,
              address, property condition, and notes are now ready for Eric to
              review.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black"
              >
                <Phone size={15} />
                Call Eric
              </a>

              <a
                href={`sms:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-lime-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Eric
              </a>
            </div>

            <button
              type="button"
              onClick={() => setQuoteSubmitted(false)}
              className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-lime-200 underline-offset-4 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}