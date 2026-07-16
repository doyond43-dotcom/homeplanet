import { useState } from "react";
import {
  Bug,
  CalendarDays,
  Check,
  ClipboardList,
  Heart,
  MessageCircle,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

type PestRequest = {
  service: string;
  location: string;
  severity: string;
  name: string;
  phone: string;
  notes: string;
  createdAt: string;
  status: string;
};

const pestOptions = [
  {
    name: "Ants",
    copy: "Trails, kitchens, bathrooms, pantries, and entry points.",
    icon: Bug,
  },
  {
    name: "Roaches",
    copy: "Kitchens, bathrooms, garages, and inside activity.",
    icon: Bug,
  },
  {
    name: "Rodents",
    copy: "Sheds, barns, garages, food rooms, RVs, and storage spaces.",
    icon: Bug,
  },
  {
    name: "Spiders",
    copy: "Porches, garages, corners, laundry areas, and exterior webs.",
    icon: Bug,
  },
  {
    name: "Fleas / Ticks",
    copy: "Yards, pet areas, rentals, and repeat activity.",
    icon: Bug,
  },
  {
    name: "Wasps / Hornets",
    copy: "Nests, rooflines, sheds, barns, and entry areas.",
    icon: Bug,
  },
];

const reviews = [
  {
    quote:
      "Great service, quick response, and they explained everything. Highly recommend!",
    name: "M. Beasley",
  },
  {
    quote:
      "Reliable, friendly, and very knowledgeable. Best pest control company we've used.",
    name: "J. Carter",
  },
  {
    quote:
      "Solved our ant and roach problem fast. Affordable and professional. 5 stars all day.",
    name: "D. Simmons",
  },
];

const trustItems = [
  { label: "Local & Family Owned", icon: Users },
  { label: "Free Estimates", icon: Check },
  { label: "Homes & Businesses", icon: ShieldCheck },
  { label: "Community Focused", icon: Heart },
];

const requestSteps = [
  "Pick the pest issue",
  "Tell us where and what you're seeing",
  "Request goes to our work board",
  "Our team follows up and gets it handled",
];

export default function DemoPestControlLandingPage() {
  const [form, setForm] = useState({
    service: "Not Sure",
    location: "",
    severity: "",
    name: "",
    phone: "",
    notes: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function selectPest(service: string) {
    setForm((current) => ({
      ...current,
      service,
    }));

    document
      .getElementById("pest-request")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request: PestRequest = {
      ...form,
      createdAt: new Date().toISOString(),
      status: "New Request",
    };

    const storageKey = "hp-demo-pest-control-requests";
    const existing = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    ) as PestRequest[];

    localStorage.setItem(
      storageKey,
      JSON.stringify([request, ...existing]),
    );

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020706] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(126,224,0,0.055),transparent_32%)]" />

      <div className="relative mx-auto w-full max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        {/* HERO */}
        <section className="text-center">
          <div className="mx-auto flex w-fit items-center gap-4 rounded-[1.5rem] border border-[#80df00]/60 bg-black/80 px-6 py-4 shadow-[0_0_34px_rgba(126,224,0,0.12)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#80df00]/60 bg-[#80df00]/10">
              <ShieldCheck className="h-8 w-8 text-[#80df00]" />
            </div>

            <div className="text-left">
              <div className="text-2xl font-black tracking-tight sm:text-3xl">
                OKIE DOKIE
              </div>
              <div className="text-sm font-black tracking-[0.2em] text-[#80df00] sm:text-base">
                PEST CONTROL
              </div>
            </div>
          </div>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-[#80df00]">
            Local Pest Control Demo
          </p>

          <h1 className="mx-auto mt-5 max-w-[760px] text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Pest Problems?
            <span className="mt-2 block text-[#80df00]">
              We Handle 'Em.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[620px] text-base leading-7 text-white/72 sm:text-lg">
            Fast, local pest control for homes, rentals, businesses, yards,
            garages, sheds, and outdoor spaces.
          </p>

          <div className="mx-auto mt-8 grid max-w-[760px] gap-3 sm:grid-cols-3">
            <a
              href="tel:+18635550147"
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.3)]"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>

            <a
              href="sms:+18635550147"
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl border border-[#80df00]/35 bg-black/70 px-6 font-black text-white transition hover:-translate-y-0.5 hover:border-[#80df00]/75 hover:bg-[#80df00]/10 hover:shadow-[0_0_30px_rgba(126,224,0,0.14)]"
            >
              <MessageCircle className="h-5 w-5 text-[#80df00]" />
              Text Us
            </a>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("pest-request")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-[#80df00] px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.3)]"
            >
              <ClipboardList className="h-5 w-5" />
              Request Estimate
            </button>
          </div>

          <div className="mx-auto mt-5 flex max-w-[850px] flex-wrap justify-center gap-2">
            {trustItems.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-[42px] items-center gap-2 rounded-full border border-white/20 bg-white/[0.025] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white/80"
              >
                <Icon className="h-4 w-4 text-[#80df00]" />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* LOCAL SERVICE PANEL */}
        <section className="mt-10 rounded-[2rem] border border-[#80df00]/30 bg-[linear-gradient(135deg,rgba(7,15,10,0.96),rgba(0,5,3,0.96))] p-6 shadow-[0_0_45px_rgba(126,224,0,0.06)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[220px_1fr]">
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(126,224,0,0.18),transparent_68%)]">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-[#80df00]/60 bg-[#80df00]/15">
                <Bug className="h-16 w-16 text-[#80df00]" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black uppercase leading-tight tracking-[-0.035em] sm:text-4xl">
                Local Pest Control
              </h2>

              <p className="mt-2 text-2xl font-black uppercase leading-tight text-[#80df00] sm:text-3xl">
                Fast Response. Real Results.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Trusted",
                    copy: "Local Team",
                  },
                  {
                    icon: CalendarDays,
                    title: "Flexible",
                    copy: "Scheduling",
                  },
                  {
                    icon: MessageCircle,
                    title: "Direct",
                    copy: "Communication",
                  },
                ].map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="flex items-center gap-3">
                    <Icon className="h-8 w-8 shrink-0 text-[#80df00]" />
                    <div className="text-left">
                      <div className="font-black">{title}</div>
                      <div className="text-sm text-white/72">{copy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PEST OPTIONS */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#80df00]">
              Start Here
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              What are you dealing with?
            </h2>
            <p className="mt-3 text-sm text-white/55">
              Choose the closest issue. We'll get you to the right help fast.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {pestOptions.map(({ name, copy, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => selectPest(name)}
                className="group rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-6 text-left transition hover:-translate-y-1 hover:border-[#80df00]/65 hover:bg-[#80df00]/[0.055] hover:shadow-[0_0_32px_rgba(126,224,0,0.08)]"
              >
                <div className="flex gap-4">
                  <Icon className="mt-1 h-9 w-9 shrink-0 text-[#80df00]" />
                  <div>
                    <h3 className="text-xl font-black">{name}</h3>
                    <p className="mt-2 min-h-[66px] text-sm leading-6 text-white/68">
                      {copy}
                    </p>
                    <span className="mt-4 inline-block text-[11px] font-black uppercase tracking-[0.16em] text-[#80df00]">
                      Select Issue
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => selectPest("Not Sure")}
            className="mt-4 flex w-full items-center justify-between gap-5 rounded-[1.5rem] border border-white/12 bg-white/[0.025] px-6 py-5 text-left transition hover:border-[#80df00]/65 hover:bg-[#80df00]/[0.05]"
          >
            <div className="flex items-center gap-4">
              <MessageCircle className="h-8 w-8 text-[#80df00]" />
              <div>
                <div className="text-xl font-black">Not sure what it is?</div>
                <div className="mt-1 text-sm text-white/60">
                  Tell us what you're seeing and where it's happening.
                </div>
              </div>
            </div>

            <span className="hidden text-[11px] font-black uppercase tracking-[0.2em] text-[#80df00] sm:block">
              Start Request
            </span>
          </button>
        </section>

        {/* REVIEWS */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#80df00]">
              Local Trust
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              What our customers say.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-[1.5rem] border border-white/12 bg-white/[0.035] p-6"
              >
                <div className="text-lg tracking-[0.14em] text-[#80df00]">
                  ★★★★★
                </div>
                <p className="mt-4 text-base leading-7 text-white/84">
                  "{review.quote}"
                </p>
                <p className="mt-5 font-black text-[#80df00]">
                  - {review.name}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 text-center">
            <p className="font-black text-[#80df00]">
              5.0 ★★★★★{" "}
              <span className="font-medium text-white/60">
                based on local customer feedback
              </span>
            </p>

            <button
              type="button"
              className="mt-5 rounded-full border border-[#80df00]/35 px-5 py-3 text-sm font-black transition hover:border-[#80df00]/75 hover:bg-[#80df00]/10"
            >
              View more reviews →
            </button>
          </div>
        </section>

        {/* REQUEST FORM */}
        <section
          id="pest-request"
          className="mt-16 rounded-[2rem] border border-[#80df00]/35 bg-[linear-gradient(135deg,rgba(5,13,8,0.98),rgba(0,5,3,0.98))] p-6 shadow-[0_0_50px_rgba(126,224,0,0.05)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#80df00]">
                Tell Us First
              </p>

              <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                Let's get the details first.
              </h2>

              <p className="mt-5 max-w-[430px] text-base leading-7 text-white/70">
                Pick the issue, tell us where it is, and send your info. We'll
                follow up fast with the next step.
              </p>

              <div className="mt-7 space-y-3">
                {requestSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#80df00] font-black text-black">
                      {index + 1}
                    </div>
                    <div className="font-bold text-white/88">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={submitRequest} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={form.service}
                  onChange={(event) =>
                    updateField("service", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-white/20 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-[#80df00]/65 focus:border-[#80df00]"
                >
                  <option>Not Sure</option>
                  <option>Ants</option>
                  <option>Roaches</option>
                  <option>Rodents</option>
                  <option>Spiders</option>
                  <option>Fleas / Ticks</option>
                  <option>Wasps / Hornets</option>
                  <option>Mosquito Fogging</option>
                </select>

                <select
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-white/20 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-[#80df00]/65 focus:border-[#80df00]"
                >
                  <option value="">Where are you?</option>
                  <option>Inside</option>
                  <option>Outside</option>
                  <option>Both inside and outside</option>
                  <option>Kitchen</option>
                  <option>Bathroom</option>
                  <option>Garage</option>
                  <option>Shed / Barn</option>
                  <option>Yard</option>
                  <option>Business</option>
                </select>

                <select
                  value={form.severity}
                  onChange={(event) =>
                    updateField("severity", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-white/20 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-[#80df00]/65 focus:border-[#80df00]"
                >
                  <option value="">How bad is it?</option>
                  <option>Light activity</option>
                  <option>Moderate activity</option>
                  <option>Heavy activity</option>
                  <option>Infestation / urgent</option>
                  <option>Not sure</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="Your name"
                  className="rounded-xl border border-white/20 bg-black/65 px-4 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-[#80df00]"
                />

                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Phone number"
                  className="rounded-xl border border-white/20 bg-black/65 px-4 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-[#80df00]"
                />
              </div>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField("notes", event.target.value)
                }
                placeholder="Notes: what are you seeing, where, and when did it start?"
                className="min-h-[150px] w-full resize-y rounded-xl border border-white/20 bg-black/65 px-4 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-[#80df00]"
              />

              <button
                type="submit"
                className="min-h-[60px] w-full rounded-xl bg-[#80df00] px-6 text-lg font-black text-black transition hover:bg-[#9cff19] hover:shadow-[0_0_36px_rgba(126,224,0,0.25)]"
              >
                Send Pest Request
              </button>

              {submitted && (
                <div className="flex items-center gap-3 rounded-xl border border-[#80df00]/35 bg-[#80df00]/10 px-4 py-4 text-sm font-bold text-[#b7ff59]">
                  <Check className="h-5 w-5" />
                  Request received. Our team will follow up with the next step.
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 text-sm text-white/44">
                <ShieldCheck className="h-4 w-4 text-[#80df00]" />
                Your information is never shared.
              </div>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pb-4 pt-14 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#80df00]">
            Call or Text Today
          </p>

          <a
            href="tel:+18635550147"
            className="mt-3 block text-3xl font-black tracking-tight text-[#80df00] sm:text-4xl"
          >
            (863) 555-0147
          </a>

          <p className="mt-6 text-xs text-white/32">
            Demo system built by HomePlanet
          </p>
        </footer>
      </div>
    </main>
  );
}