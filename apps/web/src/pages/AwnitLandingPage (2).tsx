// AwnitLandingPage.tsx
import { useMemo, useRef, useState } from "react";

/**
 * AWNIT — One-Page Landing (HomePlanet vibe)
 * - Taylor Creek-style top header (planet icon + planet pill + gold tier pill)
 * - Hero has human-life image (src/assets/awnit/hero.webp)
 * - NO customer-facing "View Demo" anywhere
 * - Pills + service cards clickable -> preselect + smooth scroll to Quote
 * - Quote: mailto if BUSINESS.email set; otherwise SMS fallback
 */

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function digitsPhone(s?: string) {
  const raw = (s || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw.replace(/[^\d+]/g, "");
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 12 && digits.length <= 15) return `+${digits}`;
  return digits;
}

function mapsHref(address: string) {
  const a = (address || "").trim();
  if (!a) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
}

function smsHref(phone: string, body: string) {
  const p = digitsPhone(phone);
  if (!p) return "";
  return `sms:${p}?&body=${encodeURIComponent(body || "")}`;
}

function mailtoHref(email: string, subject: string, body: string) {
  const e = (email || "").trim();
  if (!e) return "";
  return `mailto:${e}?subject=${encodeURIComponent(subject || "")}&body=${encodeURIComponent(body || "")}`;
}

type ProjectType =
  | "Impact Windows"
  | "Hurricane Shutters"
  | "Door Installations"
  | "Screen Repair"
  | "Trim + Caulk Finish"
  | "Custom Storm Solutions";

function toProjectType(label: string): ProjectType {
  const v = (label || "").toLowerCase().trim();
  if (v.includes("impact")) return "Impact Windows";
  if (v.includes("shutter")) return "Hurricane Shutters";
  if (v.includes("door")) return "Door Installations";
  if (v.includes("screen")) return "Screen Repair";
  if (v.includes("trim") || v.includes("caulk")) return "Trim + Caulk Finish";
  return "Custom Storm Solutions";
}

export default function AwnitLandingPage() {
  // ---- HARD-LOCKED BUSINESS INFO (edit here only) ----
  const BUSINESS = useMemo(
    () => ({
      name: "AWNIT",
      tagline: "Storm & Impact Specialists",

      // Taylor Creek style:
      planetLabel: "Planet: Storm & Impact Services",
      tierLabel: "Gold Tier • Public Proof Enabled",
      locationLine: "Okeechobee, Florida • HomePlanet Verified Node",

      phoneDisplay: "(863) 634-3100",
      phoneDial: "8636343100",
      email: "", // <-- set real email when you have it
      address: "3169 US-441, Okeechobee, FL 34974",
      hours: "Mon–Fri 8am–5pm",
      serviceArea: "Okeechobee + surrounding areas",
    }),
    []
  );

  // local hero image (already on disk)
  const heroImgSrc = useMemo(() => new URL("../assets/awnit/hero.webp", import.meta.url).toString(), []);

  const [quote, setQuote] = useState({
    name: "",
    phone: "",
    address: "",
    projectType: "Impact Windows" as ProjectType,
    notes: "",
  });

  const quoteRef = useRef<HTMLDivElement | null>(null);

  const heroBadges = useMemo(() => ["Impact Windows", "Hurricane Shutters", "Door Installations", "Screen Repair"], []);

  const services = useMemo(
    () => [
      { title: "Hurricane Shutters", desc: "Install, replacement, upgrades, and storm-ready securing." },
      { title: "Impact Windows", desc: "Precise measurements, clean fitment, and professional finish." },
      { title: "Door Installations", desc: "Entry doors, sliders, patio doors — installed clean and aligned." },
      { title: "Screen Repair", desc: "Rescreening, spline, enclosures, and fast repairs." },
      { title: "Trim + Caulk Finish", desc: "Detail work that makes installs look right and last longer." },
      { title: "Custom Storm Solutions", desc: "When the job is unique — we plan it and execute it." },
    ],
    []
  );

  const trustPills = useMemo(
    () => ["Accurate measurements", "Clean job sites", "Clear communication", "On-time scheduling", "Professional finish", "No surprises"],
    []
  );

  const processStages = useMemo(() => ["Scheduled", "Measured", "Estimate Sent", "Ordered", "Installed", "Done"], []);

  const quoteEmailSubject = `${BUSINESS.name} Quote Request — ${quote.projectType}`;
  const quoteEmailBody = [
    `${BUSINESS.name} — Quote Request`,
    ``,
    `Name: ${quote.name || "-"}`,
    `Phone: ${quote.phone || "-"}`,
    `Address: ${quote.address || "-"}`,
    `Project Type: ${quote.projectType || "-"}`,
    ``,
    `Notes:`,
    `${(quote.notes || "").trim() || "-"}`,
    ``,
    `Sent from landing page.`,
  ].join("\n");

  const mailto = mailtoHref(BUSINESS.email, quoteEmailSubject, quoteEmailBody);
  const callHref = `tel:${digitsPhone(BUSINESS.phoneDial) || digitsPhone(BUSINESS.phoneDisplay) || ""}`;
  const directionsHref = mapsHref(BUSINESS.address);

  // If no email configured, “Send Request” should still work via SMS.
  const quickTextBody = [
    `${BUSINESS.name} — Quote Request`,
    `Project: ${quote.projectType || "-"}`,
    `Name: ${quote.name || "-"}`,
    `Phone: ${quote.phone || "-"}`,
    `Address: ${quote.address || "-"}`,
    ``,
    `Notes:`,
    `${(quote.notes || "").trim() || "-"}`,
  ].join("\n");
  const textHref = smsHref(BUSINESS.phoneDisplay, quickTextBody);

  function goToQuote(projectLabel?: string) {
    if (projectLabel) {
      const pt = toProjectType(projectLabel);
      setQuote((p) => ({ ...p, projectType: pt }));
    }
    requestAnimationFrame(() => {
      quoteRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="min-h-screen bg-[#070d18] text-white">
      {/* Soft background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute top-64 left-1/4 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Taylor Creek-style system header */}
      <header className="relative z-20 border-b border-white/10 bg-[#070d18]/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center font-extrabold">
              A
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {/* Orbit planet icon (Taylor Creek style) */}
                <span className="relative inline-flex h-5 w-5 items-center justify-center" title="HomePlanet" aria-label="HomePlanet">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  <span className="absolute h-4 w-7 rounded-full border border-amber-300/60 rotate-[-20deg]" />
                </span>

                <div className="font-extrabold truncate">{BUSINESS.name}</div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/70">
                  {BUSINESS.planetLabel}
                </span>
              </div>

              <div className="text-xs text-white/55 truncate">{BUSINESS.locationLine}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[11px] font-extrabold text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              {BUSINESS.tierLabel}
            </span>

            <a href={callHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10">
              Call
            </a>
            <a href={directionsHref} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10">
              Maps
            </a>
            <button
              type="button"
              onClick={() => goToQuote()}
              className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-extrabold text-black hover:bg-emerald-400"
            >
              Request a Quote
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-10 md:px-6 md:pb-14">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70">
            Florida-ready installs • clean finishes • structured process
          </div>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left hero copy */}
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                Florida <span className="text-emerald-300">Storm & Impact</span> Specialists
              </h1>

              <p className="mt-3 max-w-xl text-base text-white/70 md:text-lg">
                Precision installs. Clear communication. No confusion.{" "}
                <span className="font-bold text-white/85">Built right the first time.</span>
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {heroBadges.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => goToQuote(b)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-white/70 hover:bg-white/10"
                    title={`Request a quote for ${b}`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Credibility strip */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { t: "Accurate Measurements", d: "No guesswork at install time." },
                  { t: "Clean Job Sites", d: "Professional finish work." },
                  { t: "No Surprises", d: "Clear scheduling + follow-ups." },
                ].map((x) => (
                  <div key={x.t} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                    <div className="text-sm font-extrabold">{x.t}</div>
                    <div className="mt-1 text-xs text-white/60">{x.d}</div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={callHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                  Call {BUSINESS.phoneDisplay}
                </a>

                <button
                  type="button"
                  onClick={() => goToQuote()}
                  className="rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black hover:bg-emerald-400"
                >
                  Request a Quote
                </button>

                <a href={textHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                  Text
                </a>

                <a href={directionsHref} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                  Directions
                </a>
              </div>

              <div className="mt-3 text-xs text-white/50">
                {BUSINESS.hours} • {BUSINESS.serviceArea}
              </div>
            </div>

            {/* Right: CLEAN IMAGE */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 md:p-5">
                <div className="relative overflow-hidden rounded-3xl border border-white/10">
                  <img src={heroImgSrc} alt="AWNIT install work" className="h-[320px] w-full object-cover" loading="lazy" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/0" />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-bold text-white/60">Structured process</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {processStages.map((s, i) => (
                      <span
                        key={s}
                        className={cn(
                          "rounded-full border px-3 py-1 text-[11px] font-extrabold",
                          i === 1 ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-black/20 text-white/65"
                        )}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div>
          <div className="text-xs font-extrabold tracking-widest text-emerald-300/80">SERVICES</div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Built for Florida Weather</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/65">Impact protection, clean installs, and a process you can trust — from measure to finish.</p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => goToQuote(s.title)}
              className="text-left rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10"
              title={`Request a quote for ${s.title}`}
            >
              <div className="text-sm font-extrabold">{s.title}</div>
              <div className="mt-2 text-sm text-white/65">{s.desc}</div>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-200/90">
                Request quote <span className="text-emerald-300">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <div className="text-xs font-extrabold tracking-widest text-emerald-300/80">TRUST</div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Why Homeowners Trust AWNIT</h2>
        <p className="mt-2 text-sm text-white/65">You’re paying for accuracy, professionalism, and an install that holds up.</p>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-extrabold">Operational Discipline</div>
            <div className="mt-1 text-sm text-white/65">Every job is measured, tracked, and executed with accountability — so nothing gets missed.</div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {trustPills.map((p) => (
                <div key={p} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <span className="text-emerald-300">✓</span>
                  <span className="text-sm font-bold text-white/80">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-extrabold">Service Info</div>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-bold text-white/60">Location</div>
                <div className="mt-1 text-sm font-bold">{BUSINESS.address}</div>
                <a href={directionsHref} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-extrabold text-emerald-300 hover:text-emerald-200">
                  Open in Google Maps →
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-bold text-white/60">Hours</div>
                <div className="mt-1 text-sm font-bold">{BUSINESS.hours}</div>
                <div className="mt-2 text-xs text-white/55">{BUSINESS.serviceArea}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs font-bold text-white/60">Contact</div>
                <div className="mt-1 text-sm font-bold">{BUSINESS.phoneDisplay}</div>
                <div className="mt-1 text-sm text-white/70">{BUSINESS.email || "Email coming soon"}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={callHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10">
                    Call
                  </a>
                  <a href={textHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-extrabold hover:bg-white/10">
                    Text
                  </a>
                  <button
                    type="button"
                    onClick={() => goToQuote()}
                    className="rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-extrabold text-black hover:bg-emerald-400"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section ref={quoteRef} className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-extrabold tracking-widest text-emerald-300/80">{BUSINESS.name}</div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Request a Quote</h2>
              <p className="mt-2 text-sm text-white/65">
                Fill this out and it opens a pre-written email with your details (or a text if email isn’t set). Fast. No back-and-forth.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={callHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                Call
              </a>
              <a href={directionsHref} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                Maps
              </a>
              <a
                href={mailto || textHref || "#"}
                className={cn(
                  "rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black hover:bg-emerald-400",
                  !mailto && !textHref && "opacity-60 pointer-events-none"
                )}
                title={!mailto && !textHref ? "Set BUSINESS.phoneDisplay / BUSINESS.email" : "Open request draft"}
              >
                Request Quote
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 md:p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-bold text-white/60">Name</div>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                    placeholder="Your name"
                    value={quote.name}
                    onChange={(e) => setQuote((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div>
                  <div className="text-xs font-bold text-white/60">Phone</div>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                    placeholder="(555) 123-4567"
                    value={quote.phone}
                    onChange={(e) => setQuote((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="text-xs font-bold text-white/60">Address</div>
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                    placeholder="Project address"
                    value={quote.address}
                    onChange={(e) => setQuote((p) => ({ ...p, address: e.target.value }))}
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="text-xs font-bold text-white/60">Project Type</div>
                  <select
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none focus:border-emerald-400/30"
                    value={quote.projectType}
                    onChange={(e) => setQuote((p) => ({ ...p, projectType: e.target.value as ProjectType }))}
                  >
                    <option value="Impact Windows">Impact Windows</option>
                    <option value="Hurricane Shutters">Hurricane Shutters</option>
                    <option value="Door Installations">Door Installations</option>
                    <option value="Screen Repair">Screen Repair</option>
                    <option value="Trim + Caulk Finish">Trim + Caulk Finish</option>
                    <option value="Custom Storm Solutions">Custom Storm Solutions</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <div className="text-xs font-bold text-white/60">Notes</div>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm outline-none placeholder:text-white/30 focus:border-emerald-400/30"
                    placeholder="Tell us what you’re looking to do."
                    rows={6}
                    value={quote.notes}
                    onChange={(e) => setQuote((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={mailto || textHref || "#"}
                  className={cn(
                    "rounded-xl bg-emerald-500/90 px-5 py-3 text-sm font-extrabold text-black hover:bg-emerald-400",
                    !mailto && !textHref && "opacity-60 pointer-events-none"
                  )}
                  title={!mailto && !textHref ? "Set BUSINESS.phoneDisplay / BUSINESS.email" : mailto ? "Open email draft" : "Open text draft"}
                >
                  Send Request
                </a>

                <a
                  href={textHref || "#"}
                  className={cn(
                    "rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-extrabold hover:bg-white/10",
                    !textHref && "opacity-60 pointer-events-none"
                  )}
                >
                  Text Instead
                </a>
              </div>

              <div className="mt-3 text-xs text-white/45">No backend required — this opens your email or text app with a prefilled message.</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-5 md:p-6">
              <div className="text-sm font-extrabold">What happens next</div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {[
                  { n: "1", t: "We schedule", d: "You get a time slot. No guessing." },
                  { n: "2", t: "We measure", d: "Accurate measurements so the install is clean." },
                  { n: "3", t: "Clear estimate", d: "You know exactly what you’re getting." },
                  { n: "4", t: "Installed", d: "Professional finish. Done right." },
                ].map((x) => (
                  <div key={x.n} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-extrabold">
                      <span className="text-emerald-300">{x.n})</span> {x.t}
                    </div>
                    <div className="mt-1 text-sm text-white/65">{x.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <a href={callHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                  Call
                </a>
                <a href={directionsHref} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                  Maps
                </a>
              </div>
            </div>
          </div>

          <div className="hidden">{JSON.stringify(quote)}</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm">
              <div className="font-extrabold">{BUSINESS.name}</div>
              <div className="mt-1 text-xs text-white/55">{BUSINESS.address}</div>
              <div className="mt-1 text-xs text-white/55">{BUSINESS.phoneDisplay}</div>
              <div className="mt-2 text-[11px] text-white/40">
                © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={callHref} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                Call
              </a>
              <a href={directionsHref} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-extrabold hover:bg-white/10">
                Maps
              </a>
              <button
                type="button"
                onClick={() => goToQuote()}
                className="rounded-xl bg-emerald-500/90 px-4 py-3 text-sm font-extrabold text-black hover:bg-emerald-400"
              >
                Request a Quote
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}