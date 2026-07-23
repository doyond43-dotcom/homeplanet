import { useState } from "react";
import {
  CalendarCheck,
  Heart,
  Home,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { hpEvent } from "../lib/hpEvent";

export default function OnlyTheEssentialsCustomerLanding() {
  const phone = "8638013179";

  function kaitlinSmsHref(message: string) {
    return `sms:${phone}?&body=${encodeURIComponent(message)}`;
  }
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [kaitlinNotifyText, setKaitlinNotifyText] = useState("");

  async function handleQuoteSubmit() {
    const section = document.getElementById("only-essentials-quote");
    if (!section) return;

    const selects = Array.from(section.querySelectorAll("select")) as HTMLSelectElement[];
    const inputs = Array.from(section.querySelectorAll("input")) as HTMLInputElement[];

    const serviceType = selects[0]?.value || "";
    const bedrooms = selects[1]?.value || "";
    const bathrooms = selects[2]?.value || "";
    const pets = selects[3]?.value || "";
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
      `Bedrooms: ${bedrooms}`,
      `Bathrooms: ${bathrooms}`,
      `Pets: ${pets}`,
      `Condition: ${condition}`,
      `Preferred Time: ${preferredTime}`,
      `Street Address: ${streetAddress}`,
      `Photos Attached: ${photoCount > 0 ? "Yes" : "No"}`,
      "Source: Only The Essentials V2 landing page quote form",
    ].join("\n");

    setQuoteSubmitting(true);
    setQuoteError("");

    try {
      const { error } = await supabase.from("cleaning_requests").insert({
        business_slug: "only-the-essentials",
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

      hpEvent("only-the-essentials", "quote_request_submitted", {
        source: "OnlyTheEssentialsLandingV2",
        serviceType,
        bedrooms,
        bathrooms,
        pets,
        condition,
        preferredTime,
        name,
        phone: phoneNumber,
        streetAddress,
        photoCount,
      });

      try {
        const notifyResponse = await fetch("/api/notify-kaitlin-cleaning-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone: phoneNumber,
            address: streetAddress,
            preferredTime,
            serviceType,
            bedrooms,
            bathrooms,
            pets,
            condition,
            notes,
          }),
        });

        const notifyResult = await notifyResponse.json().catch(() => null);

        if (!notifyResponse.ok || notifyResult?.ok === false) {
          console.warn("Kaitlin SMS notification did not send:", notifyResult);
        }
      } catch (notifyError) {
        console.warn("Kaitlin SMS notification request failed:", notifyError);
      }

      setQuoteSubmitted(true);
    } catch (error) {
      console.error("Only The Essentials quote request failed:", error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      setQuoteError(`Submit error: ${message}`);
    } finally {
      setQuoteSubmitting(false);
    }
  }

  function resetQuoteForm() {
    const section = document.getElementById("only-essentials-quote");

    if (section) {
      const selects = Array.from(section.querySelectorAll("select")) as HTMLSelectElement[];
      const inputs = Array.from(section.querySelectorAll("input")) as HTMLInputElement[];
      const textareas = Array.from(section.querySelectorAll("textarea")) as HTMLTextAreaElement[];

      selects.forEach((select) => {
        select.selectedIndex = 0;
      });

      inputs.forEach((input) => {
        if (input.type === "checkbox") {
          input.checked = false;
        } else {
          input.value = "";
        }
      });

      textareas.forEach((textarea) => {
        textarea.value = "";
      });
    }

    setQuoteSubmitted(false);
    setQuoteError("");
    setKaitlinNotifyText("");
  }

  const services = [
    {
      icon: Home,
      title: "Standard Cleaning",
      text: "Residential cleaning and house cleaning in Okeechobee for fresh, comfortable homes.",
    },
    {
      icon: Sparkles,
      title: "Deep Cleaning",
      text: "Deep cleaning for Okeechobee homes that need extra attention.",
    },
    {
      icon: ShieldCheck,
      title: "Move-In / Move-Out",
      text: "Move-in / move-out cleaning for homes, rentals, and transitions in Okeechobee.",
    },
    {
      icon: CalendarCheck,
      title: "Weekly / Biweekly",
      text: "Simple recurring cleaning that fits your schedule.",
    },
    {
      icon: Home,
      title: "Vacation Reset",
      text: "Rental and Airbnb refresh cleaning for guest stays, rentals, and busy weeks.",
    },
    {
      icon: Heart,
      title: "Simple Home Help",
      text: "Extra help to make life feel a little easier.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#07080d] text-white">
      <section className="relative border-b border-pink-300/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(236,72,153,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.18),transparent_32%),linear-gradient(135deg,#080914_0%,#120813_55%,#05060a_100%)]" />
        <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-300/30 bg-pink-300/10 text-pink-200">
                <Heart size={22} />
              </div>
              <div>
                <p className="text-lg font-black leading-none">Only The Essentials</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.35em] text-pink-200">
                  Cleaning
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-pink-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black shadow-lg shadow-pink-500/25"
              >
                <Phone size={15} />
                Call Kaitlin
              </a>
              <a
                href={kaitlinSmsHref(kaitlinNotifyText || "New Only The Essentials quote request submitted. Please check the HomePlanet dashboard.")}
                className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Kaitlin
              </a>
            </div>
          </header>

          <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr] lg:py-24">
            <div>
              <p className="font-serif text-2xl italic text-pink-200">
                Local. Reliable. Friendly.
              </p>

              <h1 className="mt-6 max-w-3xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Only The <span className="text-pink-400">Essentials</span>
                <span className="block font-serif italic text-white">Cleaning {"\u2661"}</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-200">
                Simple, high-quality cleaning for your home. Less stress, more time
                for what matters.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#only-essentials-quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black shadow-lg shadow-pink-500/20 transition hover:-translate-y-0.5 hover:bg-pink-300"
                >
                  <CalendarCheck size={16} />
                  Get My Cleaning Quote
                </a>

                <a
                  href="#cleaning-services"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white transition hover:-translate-y-0.5 hover:border-pink-300/40 hover:bg-white/10"
                >
                  View Services
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-6 text-xs font-bold text-zinc-300">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} className="text-pink-300" />
                  Trusted local service
                </span>
                <span className="inline-flex items-center gap-2">
                  <Heart size={15} className="text-pink-300" />
                  Friendly communication
                </span>
              </div>
            </div>


            <div className="mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
              <div className="rounded-[2.25rem] border border-pink-300/20 bg-white/5 p-5 shadow-2xl shadow-pink-950/40">
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-black">
                  <img
                    src="/images/kaitlin-cleaning-profile-768.jpg"
                    srcSet="/images/kaitlin-cleaning-profile-480.jpg 480w, /images/kaitlin-cleaning-profile-768.jpg 768w"
                    sizes="(max-width: 640px) calc(100vw - 72px), 448px"
                    width={768}
                    height={1152}
                    alt="Only The Essentials Cleaning"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-[520px] w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cleaning-services" className="mx-auto max-w-7xl scroll-mt-6 px-5 py-16 sm:px-8 lg:px-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-pink-300">
            Services
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Cleaning made simple. {"\u2661"}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
            Only The Essentials Cleaning helps Okeechobee homes with residential cleaning, deep cleaning, move-in / move-out cleaning, recurring cleaning, and rental refreshes.
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-300/25 bg-pink-400/15 text-pink-200">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight">{service.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-300">{service.text}</p>
              </article>
            );
          })}
        </div>        <section id="only-essentials-quote" className="mt-14 rounded-[2rem] border border-pink-300/20 bg-pink-950/20 p-6 shadow-2xl shadow-pink-950/25 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-pink-300">
            Get My Cleaning Quote
          </p>

          <h2 className="mt-4 font-serif text-4xl italic leading-tight text-pink-100 sm:text-5xl">
            Tell us about your home and what you need help with.
          </h2>

          <p className="mt-4 text-base leading-7 text-zinc-200">
            The more details you share, the better we can tailor your quote.
          </p>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#120813] text-white">Deep Cleaning</option>
              <option className="bg-[#120813] text-white">Standard Cleaning</option>
              <option className="bg-[#120813] text-white">Move-In / Move-Out</option>
              <option className="bg-[#120813] text-white">Weekly / Biweekly</option>
              <option className="bg-[#120813] text-white">Vacation Rental Reset</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#120813] text-white">Bedrooms</option>
              <option className="bg-[#120813] text-white">1 Bedroom</option>
              <option className="bg-[#120813] text-white">2 Bedrooms</option>
              <option className="bg-[#120813] text-white">3 Bedrooms</option>
              <option className="bg-[#120813] text-white">4+ Bedrooms</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#120813] text-white">Bathrooms</option>
              <option className="bg-[#120813] text-white">1 Bathroom</option>
              <option className="bg-[#120813] text-white">2 Bathrooms</option>
              <option className="bg-[#120813] text-white">3 Bathrooms</option>
              <option className="bg-[#120813] text-white">4+ Bathrooms</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#120813] text-white">Pets</option>
              <option className="bg-[#120813] text-white">No Pets</option>
              <option className="bg-[#120813] text-white">Cats</option>
              <option className="bg-[#120813] text-white">Dogs</option>
              <option className="bg-[#120813] text-white">Multiple Animals</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#120813] text-white">Condition</option>
              <option className="bg-[#120813] text-white">Light Cleaning</option>
              <option className="bg-[#120813] text-white">Average</option>
              <option className="bg-[#120813] text-white">Needs Extra Attention</option>
              <option className="bg-[#120813] text-white">Heavy Deep Clean</option>
            </select>

            <select className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]">
              <option className="bg-[#120813] text-white">Preferred Time</option>
              <option className="bg-[#120813] text-white">Mornings</option>
              <option className="bg-[#120813] text-white">Afternoons</option>
              <option className="bg-[#120813] text-white">Evenings</option>
              <option className="bg-[#120813] text-white">Flexible</option>
            </select>

            <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark] lg:col-span-1" placeholder="Your Name" />

            <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark] lg:col-span-2" placeholder="Phone Number" />

            <div className="grid gap-3 rounded-2xl border border-dashed border-pink-300/30 bg-black/30 p-4 text-sm text-zinc-300 lg:col-span-3 lg:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-pink-200">Upload Photos</span>
                <p className="mb-3 text-xs leading-5 text-zinc-400">Optional — show problem areas, rooms, pets, or mess level.</p>
                <input type="file" multiple className="block w-full text-xs text-zinc-400" />
              </label>

              <label className="block lg:col-span-2">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-pink-200">Street Address</span>
                <input className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-sm text-white outline-none [color-scheme:dark]" placeholder="Street Address" autoComplete="street-address" />
              </label>
            </div>

            <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-zinc-300 lg:col-span-3">
              <input type="checkbox" className="mt-1" />
              I understand final pricing depends on home size, condition, pets, and requested services.
            </label>

            {quoteError && (
              <p className="rounded-2xl border border-pink-300/25 bg-black/30 px-4 py-3 text-sm font-semibold text-pink-100 lg:col-span-3">
                {quoteError}
              </p>
            )}

            <button type="button" onClick={handleQuoteSubmit} disabled={quoteSubmitting} className="rounded-2xl bg-pink-400 py-4 text-sm font-black uppercase tracking-[0.22em] text-black lg:col-span-3 disabled:cursor-not-allowed disabled:opacity-70">
              {quoteSubmitting ? "Sending..." : "Request My Quote"}
            </button>
          </div>
        </section>
        <section
          id="only-essentials-trust"
          aria-labelledby="only-essentials-trust-heading"
          className="relative mt-14 overflow-hidden rounded-[2rem] border border-pink-300/15 bg-white/[0.035] p-6 shadow-2xl shadow-black/30 sm:p-8 lg:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(244,114,182,0.13),transparent_34%),radial-gradient(circle_at_90%_100%,rgba(236,72,153,0.09),transparent_32%)]" />

          <div className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.36em] text-pink-300">
                Trusted In Okeechobee
              </p>

              <h2
                id="only-essentials-trust-heading"
                className="mt-4 font-serif text-4xl italic leading-tight text-pink-100 sm:text-5xl"
              >
                Real words from local customers.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                Real experiences from customers who trusted Kaitlin inside their homes.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                "Locally Trusted",
                "Verified Recommendations",
                "Real Local Customers",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-pink-300/20 bg-pink-300/[0.07] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-pink-100"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-black/25 p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-pink-300/25 sm:p-8">
                <p
                  aria-label="Five-star customer recommendation"
                  className="text-3xl font-black leading-none tracking-[0.14em] text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.22)] sm:text-4xl"
                >
                  ★★★★★
                </p>

                <blockquote className="mt-6 flex-1 font-serif text-2xl italic leading-9 text-white sm:text-[1.7rem]">
                  “Highly recommend! Kaitlyn did a great job helping us get back on
                  track. From the ceiling to the floor she knocked it out of the
                  park!”
                </blockquote>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="font-black text-pink-100">Celia Atkinson</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Customer Recommendation
                  </p>
                </div>
              </article>

              <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-black/25 p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-pink-300/25 sm:p-8">
                <p
                  aria-label="Five-star customer recommendation"
                  className="text-3xl font-black leading-none tracking-[0.14em] text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.22)] sm:text-4xl"
                >
                  ★★★★★
                </p>

                <blockquote className="mt-6 flex-1 font-serif text-2xl italic leading-9 text-white sm:text-[1.7rem]">
                  “I came home to super clean floors, sparkling bathrooms, beds made,
                  sinks cleaned... Everything back in order! Highly recommend.”
                </blockquote>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="font-black text-pink-100">Amanda Carames</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Customer Recommendation
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

<div className="mt-14 grid gap-8 rounded-[2rem] border border-pink-300/20 bg-pink-950/25 p-8 sm:p-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <h2 className="font-serif text-5xl italic leading-tight text-pink-200">
            Let&apos;s make life a little easier. {"\u2661"}
          </h2>

          <div>
            <p className="text-base leading-7 text-zinc-200">
              Call, text, or send a request. Kaitlin is here to help with simple
              scheduling, friendly communication, and reliable house cleaning in Okeechobee.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-400 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-black"
              >
                <Phone size={16} />
                Call Kaitlin
              </a>
              <a
                href={kaitlinSmsHref(kaitlinNotifyText || "New Only The Essentials quote request submitted. Please check the HomePlanet dashboard.")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-300/30 bg-white/5 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <MessageCircle size={16} />
                Text Kaitlin
              </a>
              <a
                href="/planet/only-the-essentials/request?type=book"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/20 px-7 py-4 text-xs font-black uppercase tracking-[0.24em] text-white"
              >
                <CalendarCheck size={16} />
                Request Cleaning
              </a>
            </div>
          </div>
        </div>

        <footer className="py-12 text-center">
  <p className="font-serif text-3xl italic text-pink-200">
    Only The Essentials Cleaning
  </p>
  <p className="mt-3 text-sm font-semibold text-zinc-300">
    House cleaning in Okeechobee, Florida
  </p>
  <p className="mt-6 text-xs text-zinc-500">
    &copy; 2026 Only The Essentials Cleaning
  </p>
  <p className="mt-2 text-[11px] text-zinc-600">
    Made with HomePlanet
  </p>
</footer>
      </section>

      {quoteSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] border border-pink-300/25 bg-[#160713] p-7 text-center shadow-2xl shadow-pink-950/50 sm:p-9">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-pink-300/30 bg-pink-400/15 text-pink-200">
              <Heart size={26} />
            </div>

            <p className="mt-5 text-xs font-black uppercase tracking-[0.32em] text-pink-300">
              Request Received
            </p>

            <h2 className="mt-4 font-serif text-4xl italic leading-tight text-pink-100">
              Thank you.
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-200">
              Your cleaning quote request has been received. Kaitlin will review the details and be in touch shortly.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pink-400 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-black"
              >
                <Phone size={15} />
                Call Kaitlin
              </a>

              <a
                href={kaitlinSmsHref(kaitlinNotifyText || "New Only The Essentials quote request submitted. Please check the HomePlanet dashboard.")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-pink-300/30 bg-white/5 px-6 py-3 text-xs font-black uppercase tracking-[0.22em] text-white"
              >
                <MessageCircle size={15} />
                Text Kaitlin
              </a>
            </div>

            <button
              type="button"
              onClick={() => resetQuoteForm()}
              className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-pink-200 underline-offset-4 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

























