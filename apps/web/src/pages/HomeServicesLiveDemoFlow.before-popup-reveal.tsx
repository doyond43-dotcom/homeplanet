import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Camera,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { hpEvent } from "../lib/hpEvent";

const phone = "8638013179";

const problems = [
  { label: "HOUSE WASH", service: "House Wash" },
  { label: "DRIVEWAY CLEANING", service: "Driveway Cleaning" },
  { label: "ROOF SOFTWASH", service: "Roof Softwash" },
  { label: "POOL CAGE", service: "Pool Cage" },
  { label: "FENCE / PATIO", service: "Fence / Patio" },
  { label: "NOT SURE YET", service: "Not Sure Yet" },
];

export default function HomeServicesLiveDemoFlow() {
  const [selectedService, setSelectedService] = useState("House Wash");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  function openEstimate(service: string) {
    setSelectedService(service);

    setTimeout(() => {
      document.getElementById("ridgeline-estimate")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  async function handleQuoteSubmit() {
    const section = document.getElementById("ridgeline-estimate");
    if (!section) return;

    const selects = Array.from(section.querySelectorAll("select")) as HTMLSelectElement[];
    const inputs = Array.from(section.querySelectorAll("input")) as HTMLInputElement[];
    const textarea = section.querySelector("textarea") as HTMLTextAreaElement | null;

    const serviceType = selects[0]?.value || selectedService;
    const condition = selects[1]?.value || "";
    const accessDetails = selects[2]?.value || "";
    const preferredTime = selects[3]?.value || "";
    const preferredTech = selects[4]?.value || "";

    const textInputs = inputs.filter((input) => input.type !== "file" && input.type !== "checkbox");
    const fileInput = inputs.find((input) => input.type === "file");
    const agreementInput = inputs.find((input) => input.type === "checkbox");

    const name = textInputs[0]?.value?.trim() || "";
    const phoneNumber = textInputs[1]?.value?.trim() || "";
    const streetAddress = textInputs[2]?.value?.trim() || "";
    const notes = textarea?.value?.trim() || "";
    const photoCount = fileInput?.files?.length || 0;
    const agreementChecked = Boolean(agreementInput?.checked);

    if (!name || !phoneNumber || !streetAddress) {
      setQuoteError("Please add your name, phone number, and street address before sending your estimate request.");
      return;
    }

    if (!agreementChecked) {
      setQuoteError("Please confirm the pricing note before sending your estimate request.");
      return;
    }

    const quoteDetails = [
      `Service Type: ${serviceType}`,
      `Condition: ${condition}`,
      `Access Details: ${accessDetails}`,
      `Preferred Time: ${preferredTime}`,
      `Preferred Tech / Crew: ${preferredTech}`,
      `Street Address: ${streetAddress}`,
      `Photos Attached: ${photoCount > 0 ? "Yes" : "No"}`,
      notes ? `Customer Notes: ${notes}` : "Customer Notes: None",
      "Source: Ridgeline Build-Off customer front door",
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

      hpEvent({
        event: "ridgeline_quote_request_submitted",
        board: "ridgeline",
        entityId: phoneNumber || name || "unknown-customer",
        meta: {
          source: "HomeServicesLiveDemoFlow",
          serviceType,
          condition,
          accessDetails,
          preferredTime,
          preferredTech,
          name,
          phone: phoneNumber,
          streetAddress,
          photoCount,
        },
      });

      setQuoteSubmitted(true);
    } catch (error) {
      console.error("Ridgeline estimate request failed:", error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      setQuoteError(`Submit error: ${message}`);
    } finally {
      setQuoteSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section
        className="relative min-h-[455px] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,.74), rgba(0,0,0,.22), rgba(0,0,0,.66)), url('/images/a_dramatic_cinematic_ultra_realistic_sunset_scen_1.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/72" />

        <div className="relative mx-auto flex min-h-[455px] max-w-6xl flex-col items-center justify-center px-4 py-8 text-center">
          <h1 className="text-5xl font-black tracking-[0.02em] text-white sm:text-6xl lg:text-7xl">
            RIDGELINE
          </h1>

          <p className="mt-1 text-lg font-black uppercase tracking-wide text-orange-500 sm:text-xl">
            Pro Wash
          </p>

          <div className="mt-3 h-[2px] w-72 max-w-full bg-white/70" />

          <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
            Keeping Okeechobee Clean
          </h2>

          <p className="mt-3 max-w-2xl text-xs font-semibold text-white/70 sm:text-sm">
            House washing • Driveways • Roof softwash • Pool cages • Gutters • Property cleanup
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => openEstimate("House Wash")}
              className="rounded-xl bg-orange-500 px-7 py-3 text-xs font-black uppercase text-black shadow-[0_0_30px_rgba(249,115,22,.38)] hover:bg-orange-400"
            >
              Get Estimate
            </button>

            <a
              href={`sms:${phone}`}
              className="rounded-xl border border-white/45 bg-black/40 px-7 py-3 text-xs font-black uppercase text-white hover:bg-white/10"
            >
              Text Ridgeline
            </a>
          </div>
        </div>
      </section>

      <section className="bg-black px-4 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
            What&apos;s Going On?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/60">
            Pick the closest problem. The estimate request will open underneath with that service already selected.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem) => (
              <button
                type="button"
                key={problem.label}
                onClick={() => openEstimate(problem.service)}
                className={`rounded-2xl border px-6 py-7 text-base font-black uppercase shadow-[0_18px_40px_rgba(0,0,0,.35)] transition ${
                  selectedService === problem.service
                    ? "border-orange-500 bg-orange-500 text-black"
                    : "border-white/10 bg-[#1b1b1d] text-white hover:border-orange-500/70 hover:bg-orange-500 hover:text-black"
                }`}
              >
                {problem.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="ridgeline-estimate" className="bg-[#050505] px-4 py-14">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-orange-500/25 bg-[linear-gradient(145deg,rgba(18,18,20,.92),rgba(5,5,5,.96))] p-6 shadow-[0_28px_80px_rgba(0,0,0,.55)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-orange-400">
                Estimate Request
              </p>

              <h2 className="mt-4 text-4xl font-black uppercase leading-tight sm:text-5xl">
                Send Ridgeline the details.
              </h2>

              <p className="mt-5 text-base font-semibold leading-7 text-white/65">
                Address, service type, photos, condition, access notes, and preferred tech all land in one organized request.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/35 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-300">
                  Selected Service
                </p>
                <p className="mt-2 text-2xl font-black text-white">{selectedService}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]"
              >
                {problems.map((problem) => (
                  <option key={problem.service} className="bg-[#111111] text-white">
                    {problem.service}
                  </option>
                ))}
              </select>

              <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
                <option className="bg-[#111111] text-white">Condition</option>
                <option className="bg-[#111111] text-white">Light Buildup</option>
                <option className="bg-[#111111] text-white">Moderate Algae / Grime</option>
                <option className="bg-[#111111] text-white">Heavy Algae / Spider Webs</option>
                <option className="bg-[#111111] text-white">Rust / Oxidation / Waterfront Grime</option>
                <option className="bg-[#111111] text-white">Needs Site Review</option>
              </select>

              <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
                <option className="bg-[#111111] text-white">Access Details</option>
                <option className="bg-[#111111] text-white">Open Access</option>
                <option className="bg-[#111111] text-white">Gate Code Needed</option>
                <option className="bg-[#111111] text-white">Customer Must Be Home</option>
                <option className="bg-[#111111] text-white">Limited Access</option>
              </select>

              <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
                <option className="bg-[#111111] text-white">Preferred Time</option>
                <option className="bg-[#111111] text-white">Mornings</option>
                <option className="bg-[#111111] text-white">Afternoons</option>
                <option className="bg-[#111111] text-white">Evenings</option>
                <option className="bg-[#111111] text-white">Flexible</option>
              </select>

              <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
                <option className="bg-[#111111] text-white">Preferred Tech / Crew</option>
                <option className="bg-[#111111] text-white">No preference</option>
                <option className="bg-[#111111] text-white">Roy</option>
                <option className="bg-[#111111] text-white">Brock</option>
                <option className="bg-[#111111] text-white">Whoever is available first</option>
                <option className="bg-[#111111] text-white">Not sure</option>
              </select>

              <div className="grid gap-3 sm:grid-cols-3">
                <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]" placeholder="Your Name" />
                <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]" placeholder="Phone Number" />
                <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]" placeholder="Street Address" autoComplete="street-address" />
              </div>

              <div className="rounded-2xl border border-dashed border-orange-400/35 bg-black/30 p-4">
                <div className="flex items-start gap-3">
                  <Camera size={18} className="mt-1 text-orange-300" />
                  <div className="flex-1">
                    <span className="block text-xs font-black uppercase tracking-[0.2em] text-orange-300">
                      Upload Photos
                    </span>
                    <p className="mt-2 text-xs leading-5 text-white/50">
                      Optional — show algae, rust, oxidation, spider webs, roof stains, driveway buildup, or access areas.
                    </p>
                    <input type="file" multiple className="mt-4 block w-full text-xs text-zinc-400" />
                  </div>
                </div>
              </div>

              <textarea
                className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]"
                placeholder="Anything else Ridgeline should know?"
              />

              <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-white/60">
                <input type="checkbox" className="mt-1" />
                I understand final pricing depends on surface type, size, access, condition, stains, algae, oxidation, rust, and requested services.
              </label>

              {quoteError && (
                <p className="rounded-2xl border border-orange-300/25 bg-black/30 px-4 py-3 text-sm font-semibold text-orange-100">
                  {quoteError}
                </p>
              )}

              <button
                type="button"
                onClick={handleQuoteSubmit}
                disabled={quoteSubmitting}
                className="rounded-2xl bg-orange-500 py-4 text-sm font-black uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(249,115,22,.22)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {quoteSubmitting ? "Sending..." : "Send Estimate Request"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-zinc-950/70 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-400">
                Okeechobee Pressure Washing
              </p>

              <h2 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-6xl">
                Exterior cleaning for Okeechobee homes and properties.
              </h2>

              <p className="mt-6 text-lg leading-8 text-zinc-300">
                Ridgeline Pro Wash helps homeowners and property owners keep exterior surfaces clean,
                safer to walk on, and easier to maintain.
              </p>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                House washing, driveway cleaning, roof softwashing, pool cages, fences, patios,
                gutters, and property cleanup can all start with one clear request.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "House Washing",
                "Driveways & Walkways",
                "Roof Softwashing",
                "Pool Cages",
                "Fences & Patios",
                "Gutters & Property Cleanup",
              ].map((service) => (
                <div
                  key={service}
                  className="rounded-2xl border border-white/10 bg-black/60 p-5 text-sm font-black uppercase tracking-[0.14em] text-zinc-100"
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                Photos
              </p>
              <h3 className="mt-3 text-2xl font-black">Show the condition.</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Photos help Ridgeline see algae, grime, roof streaks, rust, oxidation, spider webs,
                buildup, and surface condition before quoting.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                Access
              </p>
              <h3 className="mt-3 text-2xl font-black">Avoid wasted trips.</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Gate codes, locked areas, pets, side yard access, parking notes, and water access
                help the crew know what to expect.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/50 p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-400">
                Timing
              </p>
              <h3 className="mt-3 text-2xl font-black">Make scheduling easier.</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Preferred time and crew requests help Ridgeline review the job and send the next
                clear reply.
              </p>
            </div>
          </div>

          <div className="mt-14 rounded-[2rem] border border-orange-400/20 bg-orange-500/10 p-6 text-center">
            <h2 className="text-3xl font-black uppercase sm:text-5xl">
              Ready to clean it up?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
              Send the service, address, photos, condition, access notes, preferred time, and crew
              request so Ridgeline can review the job clearly.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#ridgeline-estimate"
                className="rounded-xl bg-orange-500 px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black"
              >
                Get Estimate
              </a>
              <a
                href={`sms:${phone}`}
                className="rounded-xl border border-white/15 bg-black px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                Text Ridgeline
              </a>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-black px-4 pb-20 pt-12 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-400/30 bg-orange-500/10 text-orange-300">
            <ShieldCheck size={22} />
          </div>

          <h2 className="mt-7 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Ridgeline Pro Wash
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Pressure washing and exterior cleaning in Okeechobee, Florida.
          </p>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-zinc-500">
            House washing, driveways, roof softwashing, pool cages, patios, gutters, fences,
            and exterior property cleanup.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#ridgeline-estimate"
              className="rounded-xl bg-orange-500 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-black shadow-lg shadow-orange-950/30"
            >
              Get Estimate
            </a>

            <a
              href={`sms:${phone}`}
              className="rounded-xl border border-white/15 bg-white/[0.04] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white"
            >
              Text Ridgeline
            </a>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-700">
              Powered by HomePlanet
            </p>

            <a
              href="/planet/build-your-live-system"
              className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:border-orange-400/30 hover:text-orange-200"
            >
              Get something like this
            </a>
          </div>
        </div>
      </footer>

      {quoteSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-orange-400/25 bg-[#120b04] p-7 text-center shadow-2xl shadow-orange-950/50 sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-400/30 bg-orange-500/15 text-orange-200">
              <Sparkles size={26} />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.32em] text-orange-300">
              Request Received
            </p>

            <h2 className="mt-4 text-4xl font-black uppercase leading-tight text-white">
              You&apos;re on the board.
            </h2>

            <p className="mt-4 text-base leading-7 text-white/70">
              Ridgeline has your address, service type, notes, preferred time, and preferred tech request ready for review.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`sms:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black"
              >
                <MessageCircle size={15} />
                Text Ridgeline
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <Phone size={15} />
                Talk To Ridgeline
              </a>
            </div>

            <button
              type="button"
              onClick={() => setQuoteSubmitted(false)}
              className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-orange-200 underline-offset-4 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}





