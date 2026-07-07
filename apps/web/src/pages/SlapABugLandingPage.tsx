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
    ["Wasps / Hornets", "Nests, rooflines, sheds, barns, and entry areas."],
    ["Mosquito Fogging", "Yards, shaded areas, fence lines, trees, bushes, and outdoor gathering spaces."]
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
      <style>{`
        .sab-select {
          appearance: none;
          -webkit-appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, #8fc8ff 50%),
            linear-gradient(135deg, #8fc8ff 50%, transparent 50%);
          background-position:
            calc(100% - 25px) 50%,
            calc(100% - 17px) 50%;
          background-size: 9px 9px, 9px 9px;
          background-repeat: no-repeat;
          padding-right: 3.75rem;
        }

        .sab-select option {
          background: #050b12;
          color: #ffffff;
        }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-10 pt-8 text-center sm:px-8 sm:pb-12 sm:pt-10 lg:pb-16 lg:pt-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,199,101,0.08),transparent_38%),radial-gradient(circle_at_bottom,rgba(233,41,41,0.08),transparent_34%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020706]/95 via-[#020706]/95 to-[#020706]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto w-fit rounded-[1.45rem] border border-white/10 bg-black/45 px-7 py-5 shadow-[0_0_55px_rgba(40,199,101,0.22)] sm:rounded-[1.7rem] sm:px-10 sm:py-7">
            <div className="text-3xl font-black leading-none text-[#66dc3b] sm:text-5xl">
              SLAP-A-BUG
            </div>
            <div className="mx-auto mt-3 w-fit rounded-lg bg-[#e92929] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white sm:px-6 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
              Pest Control
            </div>
          </div>

          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.34em] text-red-400 sm:mt-8 sm:text-xs sm:tracking-[0.42em]">
            Okeechobee Pest Control
          </p>

          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
            Got Bugs?
            <br />
            <span className="text-[#66dc3b]">Slap ’Em.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:mt-6 sm:text-lg sm:leading-8">
            Local pest control for homes, sheds, barns, RVs, mobile homes, and businesses around Okeechobee.
          </p>

          <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:mt-8 sm:grid-cols-3">
            <a
              href="tel:8633683628"
              className="rounded-2xl bg-[#e92929] px-7 py-4 text-center text-base font-black text-white shadow-[0_0_35px_rgba(233,41,41,0.34)] transition hover:-translate-y-0.5 hover:bg-[#ff3030] hover:shadow-[0_0_42px_rgba(233,41,41,0.44)] sm:py-5"
            >
              Call Now
            </a>

            <a
              href="sms:8633683628"
              className="rounded-2xl border border-[#1d79d6]/60 bg-[#1d79d6]/22 px-7 py-4 text-center text-base font-black text-white shadow-[0_0_32px_rgba(31,111,190,0.22)] transition hover:-translate-y-0.5 hover:border-[#58a9ff]/80 hover:bg-[#1d79d6]/34 hover:shadow-[0_0_44px_rgba(31,111,190,0.34)] sm:py-5"
            >
              Text Brad
            </a>

            <a
              href="#request"
              className="rounded-2xl bg-[#28c765] px-7 py-4 text-center text-base font-black text-black shadow-[0_0_35px_rgba(40,199,101,0.26)] transition hover:-translate-y-0.5 hover:bg-[#39df78] hover:shadow-[0_0_44px_rgba(40,199,101,0.36)] sm:py-5"
            >
              Request Estimate
            </a>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Local & Family Owned", "Free Estimates", "Homes & Businesses", "Community Connected"].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/14 bg-black/35 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] text-white/70 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.14em]"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-[0_0_95px_rgba(31,111,190,0.24)]">
            <div className="relative aspect-[4/3] min-h-[245px] sm:aspect-[16/7] sm:min-h-[300px]">
              <img
                src="/images/slap-a-bug-truck-hero.png"
                alt="Slap-A-Bug Pest Control truck in Okeechobee"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-left sm:bottom-7 sm:left-7">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                  Real Local Service
                </p>
                <h2 className="mt-2 max-w-2xl text-2xl font-black leading-tight sm:text-5xl">
                  The truck Okeechobee already knows.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PEST GRID */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-red-400">
            Start Here
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            What are you dealing with?
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            Choose the closest issue. It will carry into the request form below.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {pestOptions.filter(([title]) => title !== "Mosquito Fogging").map(([title, text]) => (
            <button
              key={title}
              onClick={() => pickPest(title)}
              className="group rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-left transition hover:-translate-y-1 hover:border-[#1d79d6]/65 hover:bg-[#061423] hover:shadow-[0_0_34px_rgba(31,111,190,0.18)] sm:p-6"
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
          className="mt-4 w-full rounded-3xl border border-[#1d79d6]/40 bg-[#1d79d6]/12 p-6 text-left transition hover:border-[#1d79d6]/75 hover:bg-[#061423] hover:shadow-[0_0_34px_rgba(31,111,190,0.18)]"
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
      <section id="request" className="mx-auto max-w-6xl px-4 pb-14 sm:px-8 sm:pb-16">
        <div className="rounded-[1.6rem] border border-[#1d79d6]/45 bg-[linear-gradient(135deg,rgba(31,111,190,0.18),rgba(0,0,0,0.72))] p-5 shadow-[0_0_70px_rgba(31,111,190,0.10)] sm:rounded-[2rem] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8fc8ff]">
                Tell Brad First
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
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
                      className="sab-select rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
                    >
                      {pestOptions.map(([pest]) => (
                        <option key={pest} className="bg-[#050b12] text-white">{pest}</option>
                      ))}
                      <option className="bg-[#050b12] text-white">Not Sure</option>
                    </select>

                    <select
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="sab-select rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
                    >
                      <option value="" className="bg-[#050b12] text-white">Where are you seeing it?</option>
                      <option className="bg-[#050b12] text-white">Inside</option>
                      <option className="bg-[#050b12] text-white">Outside</option>
                      <option className="bg-[#050b12] text-white">Both inside and outside</option>
                      <option className="bg-[#050b12] text-white">Kitchen</option>
                      <option className="bg-[#050b12] text-white">Bathroom</option>
                      <option className="bg-[#050b12] text-white">Garage</option>
                      <option className="bg-[#050b12] text-white">Shed / Barn</option>
                      <option className="bg-[#050b12] text-white">Yard</option>
                      <option className="bg-[#050b12] text-white">Business</option>
                    </select>

                    <select
                      value={form.severity}
                      onChange={(e) => updateField("severity", e.target.value)}
                      className="sab-select rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
                    >
                      <option value="" className="bg-[#050b12] text-white">How bad is it?</option>
                      <option className="bg-[#050b12] text-white">Light activity</option>
                      <option className="bg-[#050b12] text-white">Moderate activity</option>
                      <option className="bg-[#050b12] text-white">Heavy activity</option>
                      <option className="bg-[#050b12] text-white">Infestation / urgent</option>
                      <option className="bg-[#050b12] text-white">Not sure</option>
                    </select>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="sab-select rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
                      placeholder="Your name"
                      required
                    />

                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="sab-select rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
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









