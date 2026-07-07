import React, { useEffect, useState } from "react";

type PestForm = {
  service: string;
  location: string;
  severity: string;
  name: string;
  phone: string;
  notes: string;
};

const storageKey = "hp-slap-a-bug-requests";

function setMeta(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

function setPropertyMeta(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
}

export default function SlapABugLandingPage() {
  useEffect(() => {
    const title = "Slap-A-Bug Pest Control | Okeechobee Pest Control & Mosquito Fogging";
    const description =
      "Slap-A-Bug Pest Control helps Okeechobee homes, sheds, barns, RVs, mobile homes, and businesses with pest control, mosquito fogging, roaches, ants, rodents, spiders, fleas, ticks, wasps, and more.";

    document.title = title;

    setMeta("description", description);
    setMeta(
      "keywords",
      "Slap-A-Bug Pest Control, Okeechobee pest control, mosquito fogging Okeechobee, roach control Okeechobee, ant control Okeechobee, rodent control Okeechobee, spider treatment Okeechobee, flea tick pest control, wasp hornet pest control"
    );

    setPropertyMeta("og:title", title);
    setPropertyMeta("og:description", description);
    setPropertyMeta("og:type", "website");
    setPropertyMeta("og:url", "https://www.homeplanet.city/planet/slap-a-bug");
    setPropertyMeta("og:image", "https://www.homeplanet.city/images/slap-a-bug-truck-hero.png");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", "https://www.homeplanet.city/images/slap-a-bug-truck-hero.png");
  }, []);

  const pestOptions = [
    ["Ants", "Trails, kitchens, bathrooms, porches, and entry points."],
    ["Roaches", "Kitchens, bathrooms, garages, and inside activity."],
    ["Rodents", "Sheds, barns, garages, feed rooms, RVs, and storage spaces."],
    ["Spiders", "Porches, garages, corners, lanais, and exterior webs."],
    ["Fleas / Ticks", "Yards, pet areas, rentals, and repeat activity."],
    ["Wasps / Hornets", "Nests, rooflines, sheds, barns, and entry areas."]
  ];

  const [form, setForm] = useState<PestForm>({
    service: "Not Sure",
    location: "",
    severity: "",
    name: "",
    phone: "",
    notes: ""
  });

  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof PestForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function pickPest(service: string) {
    setForm((current) => ({ ...current, service }));
    document.getElementById("request")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function submitRequest(event: React.FormEvent) {
    event.preventDefault();

    const request = {
      ...form,
      status: "New Request",
      createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([request, ...existing]));
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#020706] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-12 pt-10 text-center sm:px-8 lg:pb-16 lg:pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,105,190,0.30),transparent_34%),radial-gradient(circle_at_center,rgba(40,199,101,0.18),transparent_36%),radial-gradient(circle_at_bottom,rgba(233,41,41,0.13),transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06131e]/70 via-[#031009]/90 to-[#020706]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto w-fit rounded-[1.7rem] border border-white/10 bg-black/45 px-10 py-7 shadow-[0_0_55px_rgba(40,199,101,0.22)]">
            <div className="text-5xl font-black leading-none text-[#66dc3b]">
              SLAP-A-BUG
            </div>
            <div className="mx-auto mt-3 w-fit rounded-lg bg-[#e92929] px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
              Pest Control
            </div>
          </div>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.42em] text-red-400">
            Okeechobee Pest Control
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            Got Bugs?
            <br />
            <span className="text-[#66dc3b]">Slap ’Em.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
            Local pest control for homes, sheds, barns, RVs, mobile homes, and businesses around Okeechobee.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <a
              href="tel:8633683628"
              className="rounded-2xl bg-[#e92929] px-7 py-5 text-center text-base font-black text-white shadow-[0_0_35px_rgba(233,41,41,0.34)]"
            >
              Call Now
            </a>

            <a
              href="sms:8633683628"
              className="rounded-2xl border border-white/14 bg-white/[0.05] px-7 py-5 text-center text-base font-black text-white"
            >
              Text Brad
            </a>

            <a
              href="#request"
              className="rounded-2xl bg-[#28c765] px-7 py-5 text-center text-base font-black text-black shadow-[0_0_35px_rgba(40,199,101,0.26)]"
            >
              Request Estimate
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Local & Family Owned", "Free Estimates", "Homes & Businesses", "Community Backed"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/14 bg-black/35 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/70"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_0_90px_rgba(31,111,190,0.16)]">
            <div className="relative aspect-[16/7] min-h-[300px]">
              <img
                src="/images/slap-a-bug-truck-hero.png"
                alt="Slap-A-Bug Pest Control truck in Okeechobee"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-left sm:bottom-7 sm:left-7">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                  Real Local Service
                </p>
                <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
                  The truck people already notice.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PEST GRID */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-red-400">
            Start Here
          </p>
          <h2 className="mt-3 text-4xl font-black">
            What are you dealing with?
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Choose the closest issue. It will carry into the request form below.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pestOptions.map(([title, text]) => (
            <button
              key={title}
              onClick={() => pickPest(title)}
              className="group rounded-3xl border border-white/10 bg-white/[0.045] p-6 text-left transition hover:-translate-y-1 hover:border-[#28c765]/55 hover:bg-[#07190f]"
            >
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/62">{text}</p>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#66dc3b]">
                Select Issue
              </p>
            </button>
          ))}
        </div>

        <button
          onClick={() => pickPest("Not Sure")}
          className="mt-4 w-full rounded-3xl border border-[#1d79d6]/30 bg-[#1d79d6]/10 p-6 text-left transition hover:border-[#1d79d6]/60"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-black">Not sure what it is?</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Tell Brad what you’re seeing and where it’s happening.
              </p>
            </div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#8fc8ff]">
              Start Request
            </span>
          </div>
        </button>
      </section>

      {/* REQUEST FORM */}
      <section id="request" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="rounded-[2rem] border border-[#1d79d6]/32 bg-[linear-gradient(135deg,rgba(31,111,190,0.18),rgba(0,0,0,0.72))] p-6 shadow-[0_0_70px_rgba(31,111,190,0.10)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8fc8ff]">
                Tell Brad First
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Send the details before the visit.
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/66">
                Pick the issue, tell Brad where it is, and send your contact info so he can follow up without you explaining everything twice.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  ["1", "Pick the pest issue"],
                  ["2", "Tell Brad where you’re seeing it"],
                  ["3", "Request goes into his work board"],
                  ["4", "Brad follows up with the next step"]
                ].map(([num, text]) => (
                  <div
                    key={num}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/35 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#28c765] text-sm font-black text-black">
                      {num}
                    </div>
                    <p className="text-sm font-black">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {submitted ? (
                <div className="rounded-2xl border border-[#28c765]/30 bg-[#28c765]/10 p-6">
                  <h3 className="text-2xl font-black text-[#28c765]">Request received.</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Brad now has the details and can follow up with you.
                  </p>
                </div>
              ) : (
                <form onSubmit={submitRequest} className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <select
                      value={form.service}
                      onChange={(e) => updateField("service", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-white outline-none"
                    >
                      {pestOptions.map(([pest]) => (
                        <option key={pest}>{pest}</option>
                      ))}
                      <option>Not Sure</option>
                    </select>

                    <select
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-white outline-none"
                    >
                      <option value="">Where are you seeing it?</option>
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
                      onChange={(e) => updateField("severity", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-white outline-none"
                    >
                      <option value="">How bad is it?</option>
                      <option>Light activity</option>
                      <option>Moderate activity</option>
                      <option>Heavy activity</option>
                      <option>Infestation / urgent</option>
                      <option>Not sure</option>
                    </select>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-white outline-none"
                      placeholder="Your name"
                      required
                    />

                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-white outline-none"
                      placeholder="Phone number"
                      required
                    />
                  </div>

                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="min-h-28 rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-white outline-none"
                    placeholder="Notes — what are you seeing, where, and when did it start?"
                  />

                  <button className="rounded-2xl bg-[#28c765] px-6 py-4 text-base font-black text-black">
                    Send Pest Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto max-w-6xl px-5 pb-14 text-center sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.38em] text-white/40">
          Call or Text Today
        </p>

        <a
          href="tel:8633683628"
          className="mt-4 block text-4xl font-black text-[#28c765]"
        >
          (863) 368-3628
        </a>

        <p className="mt-8 text-xs text-white/35">
          Made with HomePlanet
        </p>
      </footer>
    </main>
  );
}
