import { useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  Droplets,
  Fence,
  Home,
  Image,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";

type SoftwashRequest = {
  service: string;
  size: string;
  access: string;
  condition: string;
  name: string;
  phone: string;
  notes: string;
  createdAt: string;
  status: string;
};

const PHONE_DIGITS = "8635320683";
const PHONE_DISPLAY = "(863) 532-0683";

const services = [
  {
    name: "House Wash",
    copy: "Siding, trim, soffits, and exterior buildup around the home.",
    icon: Home,
  },
  {
    name: "Driveway / Walkway",
    copy: "Concrete, entry areas, sidewalks, and weather-stained surfaces.",
    icon: Waves,
  },
  {
    name: "Roof Softwash",
    copy: "Dark streaks, algae, staining, and organic roof buildup.",
    icon: Droplets,
  },
  {
    name: "Pool Cage",
    copy: "Screens, frames, surrounding concrete, and outdoor living areas.",
    icon: ShieldCheck,
  },
  {
    name: "Patio / Fence",
    copy: "Outdoor surfaces, fences, seating areas, and property edges.",
    icon: Fence,
  },
  {
    name: "Not Sure Yet",
    copy: "Show us the property and tell us what you want cleaned.",
    icon: Camera,
  },
];

const trustItems = [
  "Photo-Based Estimates",
  "Direct Communication",
  "Flexible Scheduling",
  "Before & After Proof",
];

export default function OkieDokieSoftwashPage() {
  const [form, setForm] = useState({
    service: "Not Sure Yet",
    size: "",
    access: "",
    condition: "",
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

  function selectService(service: string) {
    setForm((current) => ({
      ...current,
      service,
    }));

    document
      .getElementById("estimate")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const request: SoftwashRequest = {
      ...form,
      createdAt: new Date().toISOString(),
      status: "New Request",
    };

    const storageKey = "hp-okie-dokie-softwash-requests";
    const existing = JSON.parse(
      localStorage.getItem(storageKey) || "[]",
    ) as SoftwashRequest[];

    localStorage.setItem(
      storageKey,
      JSON.stringify([request, ...existing]),
    );

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#030807] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.07),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        {/* HERO */}
        <section className="text-center">
          <div className="mx-auto flex w-fit items-center gap-4 rounded-[1.5rem] border border-emerald-400/45 bg-black/75 px-6 py-4 shadow-[0_0_34px_rgba(16,185,129,0.12)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/50 bg-emerald-400/10">
              <Droplets className="h-8 w-8 text-emerald-400" />
            </div>

            <div className="text-left">
              <div className="text-2xl font-black tracking-tight sm:text-3xl">
                OKIE DOKIE
              </div>
              <div className="text-sm font-black tracking-[0.2em] text-emerald-400 sm:text-base">
                SOFTWASH
              </div>
            </div>
          </div>

          <p className="mt-5 text-[11px] font-black uppercase tracking-[0.34em] text-emerald-400">
            Okeechobee Exterior Cleaning
          </p>

          <h1 className="mx-auto mt-5 max-w-[820px] text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Dirty Outside?
            <span className="mt-2 block text-emerald-400">
              We Make It Look New Again.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-[670px] text-base leading-7 text-white/72 sm:text-lg">
            House washing, driveways, roof softwashing, pool cages, patios,
            fences, and exterior cleaning around Okeechobee.
          </p>

          <div className="mx-auto mt-8 grid max-w-[760px] gap-3 sm:grid-cols-3">
            <a
              href={`tel:+1${PHONE_DIGITS}`}
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_0_36px_rgba(52,211,153,0.28)]"
            >
              <Phone className="h-5 w-5" />
              Call
            </a>

            <a
              href={`sms:+1${PHONE_DIGITS}`}
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl border border-emerald-400/35 bg-black/70 px-6 font-black text-white transition hover:-translate-y-0.5 hover:border-emerald-400/75 hover:bg-emerald-400/10"
            >
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              Text
            </a>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("estimate")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex min-h-[62px] items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-6 font-black text-black transition hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-[0_0_36px_rgba(52,211,153,0.28)]"
            >
              Get My Estimate
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mx-auto mt-5 flex max-w-[900px] flex-wrap justify-center gap-2">
            {trustItems.map((item) => (
              <div
                key={item}
                className="flex min-h-[42px] items-center gap-2 rounded-full border border-emerald-400/20 bg-white/[0.025] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white/80"
              >
                <Check className="h-4 w-4 text-emerald-400" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* HERO IMAGE */}
        <section className="mt-10 overflow-hidden rounded-[2rem] border border-emerald-400/30 bg-black shadow-[0_0_48px_rgba(16,185,129,0.08)]">
          <div className="relative min-h-[390px] sm:min-h-[500px]">
            <img
              src="/images/okie-dokie-softwash-hero.png"
              alt="Exterior pressure cleaning on a residential driveway in Okeechobee, Florida"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.82))]" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                The Difference Should Be Obvious
              </p>

              <h2 className="mt-3 max-w-[680px] text-3xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl">
                Clean you can see before we leave.
              </h2>

              <p className="mt-4 max-w-[620px] text-sm leading-6 text-white/76 sm:text-base">
                Show us the surface, tell us the condition, and let us see the
                property before we build the estimate.
              </p>
            </div>
          </div>
        </section>

        {/* SERVICE OPTIONS */}
        <section className="mt-16">
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-emerald-400">
              Start Here
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] sm:text-4xl">
              What needs cleaning?
            </h2>

            <p className="mt-3 text-sm text-white/55">
              Pick the closest service. You can explain the rest in the estimate request.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {services.map(({ name, copy, icon: Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => selectService(name)}
                className="group rounded-[1.5rem] border border-[rgba(45,212,191,0.18)] bg-white/[0.035] p-6 text-left transition hover:-translate-y-1 hover:border-[rgba(45,212,191,0.68)] hover:bg-teal-400/[0.055] hover:shadow-[0_0_32px_rgba(45,212,191,0.09)]"
              >
                <div className="flex gap-4">
                  <Icon className="mt-1 h-9 w-9 shrink-0 text-emerald-400" />

                  <div>
                    <h3 className="text-xl font-black">{name}</h3>

                    <p className="mt-2 min-h-[66px] text-sm leading-6 text-white/68">
                      {copy}
                    </p>

                    <span className="mt-4 inline-block text-[11px] font-black uppercase tracking-[0.16em] text-emerald-400">
                      Select Service
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* WORKFLOW / TRUST */}
        <section className="mt-16 rounded-[2rem] border border-[rgba(45,212,191,0.28)] bg-[linear-gradient(135deg,rgba(5,17,17,0.98),rgba(1,7,7,0.98))] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Built Around The Job
              </p>

              <h2 className="mt-3 text-4xl font-black leading-[0.96] tracking-[-0.045em] sm:text-5xl">
                Exterior cleaning.
                <span className="mt-2 block text-emerald-400">
                  Clear communication.
                </span>
              </h2>

              <p className="mt-5 max-w-[460px] text-base leading-7 text-white/68">
                The estimate starts with the property details so we can spend
                less time repeating questions and more time figuring out the
                right next step.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Camera,
                  title: "Show The Property",
                  copy: "Photos help us see the surface and buildup before follow-up.",
                },
                {
                  icon: MessageCircle,
                  title: "Direct Follow-Up",
                  copy: "Questions, estimate details, and scheduling stay clear.",
                },
                {
                  icon: Image,
                  title: "Before & After Proof",
                  copy: "The finished work should be visible, documented, and easy to share.",
                },
                {
                  icon: Sparkles,
                  title: "Clean Finish",
                  copy: "The goal is simple: a visible difference when the work is done.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rounded-[1.5rem] border border-[rgba(45,212,191,0.14)] bg-black/35 p-5 transition hover:border-[rgba(45,212,191,0.38)] hover:bg-teal-400/[0.025]"
                >
                  <Icon className="h-8 w-8 text-emerald-400" />
                  <h3 className="mt-4 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ESTIMATE FORM */}
        <section
          id="estimate"
          className="mt-16 rounded-[2rem] border border-[rgba(45,212,191,0.35)] bg-[linear-gradient(135deg,rgba(5,15,15,0.98),rgba(0,6,6,0.98))] p-6 shadow-[0_0_50px_rgba(45,212,191,0.05)] sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400">
                Get My Estimate
              </p>

              <h2 className="mt-3 text-4xl font-black leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                Show us what needs cleaning.
              </h2>

              <p className="mt-5 max-w-[430px] text-base leading-7 text-white/70">
                Pick the service, tell us about the property, and send the
                details before we follow up.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  "Choose the cleaning service",
                  "Tell us about the property",
                  "Send photos and project details",
                  "We review it and follow up",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-2xl border border-[rgba(45,212,191,0.14)] bg-black/35 px-4 py-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400 font-black text-black">
                      {index + 1}
                    </div>
                    <div className="font-bold text-white/88">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={submitRequest} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={form.service}
                  onChange={(event) =>
                    updateField("service", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-emerald-400/65 focus:border-emerald-400"
                >
                  <option>Not Sure Yet</option>
                  <option>House Wash</option>
                  <option>Driveway / Walkway</option>
                  <option>Roof Softwash</option>
                  <option>Pool Cage</option>
                  <option>Patio / Fence</option>
                  <option>Gutters / Exterior Cleanup</option>
                </select>

                <select
                  value={form.size}
                  onChange={(event) =>
                    updateField("size", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-emerald-400/65 focus:border-emerald-400"
                >
                  <option value="">Project size</option>
                  <option>Small area</option>
                  <option>Average home / project</option>
                  <option>Large property / multiple areas</option>
                  <option>Not sure</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={form.access}
                  onChange={(event) =>
                    updateField("access", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-emerald-400/65 focus:border-emerald-400"
                >
                  <option value="">Access / gate</option>
                  <option>Open access</option>
                  <option>Gate access</option>
                  <option>Pets on property</option>
                  <option>Need to coordinate access</option>
                </select>

                <select
                  value={form.condition}
                  onChange={(event) =>
                    updateField("condition", event.target.value)
                  }
                  className="cursor-pointer rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-emerald-400/65 focus:border-emerald-400"
                >
                  <option value="">Condition</option>
                  <option>Light buildup</option>
                  <option>Moderate buildup</option>
                  <option>Heavy buildup / staining</option>
                  <option>Needs site review</option>
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder="Your name"
                  className="rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400"
                />

                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Phone number"
                  className="rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400"
                />
              </div>

              <button
                type="button"
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-xl border border-emerald-400/28 bg-black/55 px-5 font-black text-white transition hover:border-emerald-400/70 hover:bg-emerald-400/10"
              >
                <Camera className="h-5 w-5 text-emerald-400" />
                Add Property Photos
              </button>

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField("notes", event.target.value)
                }
                placeholder="What needs cleaning? Tell us what you're seeing."
                className="min-h-[145px] w-full resize-y rounded-xl border border-emerald-400/22 bg-black/65 px-4 py-4 text-white outline-none transition placeholder:text-white/40 focus:border-emerald-400"
              />

              <button
                type="submit"
                className="min-h-[60px] w-full rounded-xl bg-emerald-400 px-6 text-lg font-black text-black transition hover:bg-emerald-300 hover:shadow-[0_0_36px_rgba(52,211,153,0.24)]"
              >
                Request My Estimate
              </button>

              {submitted && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-400/35 bg-emerald-400/10 px-4 py-4 text-sm font-bold text-emerald-200">
                  <Check className="h-5 w-5" />
                  Request received. We'll review the details and follow up.
                </div>
              )}
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pb-4 pt-14 text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-emerald-400">
            Okeechobee Exterior Cleaning
          </p>

          <a
            href={`tel:+1${PHONE_DIGITS}`}
            className="mt-3 block text-3xl font-black tracking-tight text-emerald-400 sm:text-4xl"
          >
            {PHONE_DISPLAY}
          </a>

          <p className="mt-6 text-xs text-white/32">
            Built by HomePlanet
          </p>
        </footer>
      </div>
    </main>
  );
}