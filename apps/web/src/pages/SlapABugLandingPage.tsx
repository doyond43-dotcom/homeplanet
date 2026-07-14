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

type CustomerReview = {
  name: string;
  source: "Google" | "Facebook";
  text: string;
};

const customerReviews: CustomerReview[] = [
  {
    name: "Dee Paris",
    source: "Google",
    text: "Brad deserves 5 stars. He actually answers his calls. He comes on schedule to do treatments and comes quickly when you need additional service. He is very knowledgeable and answers any questions you have."
  },
  {
    name: "Jimmy Hank Spivey",
    source: "Google",
    text: "Slap A Bug was great. Brad really knows his stuff. He came in and took care of the problem. He was very knowledgeable and affordable and we will use him for our bimonthly services going forward."
  },
  {
    name: "Bryan Martinez",
    source: "Google",
    text: "Brad showed up on time, he was very professional and relatable. You can tell he's not just here to get your money and do a job, he genuinely wants to help. Hands down 5 star service."
  },
  {
    name: "Alex",
    source: "Google",
    text: "If you want an honest pest inspection and treatment this is your guy. Fast same day service, no pushy sales tactics, very reasonable pricing, and good customer service."
  },
  {
    name: "Greg McCranie",
    source: "Google",
    text: "Brad and Ashley are great people to do business with for all your pest control needs. Very responsive and explains everything that will be done to get rid of any pests you may have. Highly recommend them."
  },
  {
    name: "Kristi Cupelli",
    source: "Google",
    text: "We couldn't be happier with the service. Brad was professional, knowledgeable, and truly went the extra mile to help us with our ant problem. He was very prompt, thorough, and made sure all of our concerns were addressed."
  },
  {
    name: "Nicole Hulen",
    source: "Google",
    text: "Slap A Bug has been a huge help with our fruit fly issue. Brad is so knowledgeable and gets to the root of the problem. They don't pressure you into contracts like the big name companies and treat you like family."
  },
  {
    name: "Tommy Barroso",
    source: "Google",
    text: "Slap A Bug was awesome, super prompt to answer, and steered me away from services I did not need even though he could have billed me for it. Can't recommend them enough."
  },
  {
    name: "Martin Gallagher",
    source: "Google",
    text: "I've had Slap A Bug address my fire ant problem. They showed up to my house promptly, addressed the problem, gave me a solution, and now we are totally ant free."
  },
  {
    name: "Clare Little",
    source: "Google",
    text: "Brad's customer service is outstanding and we can tell he genuinely cares about his customers. Brad is super prompt, thorough, friendly, knowledgeable and professional. We have had no issues with ants or any other pests since we switched to Slap A Bug."
  },
  {
    name: "Victoria Parks",
    source: "Google",
    text: "Brad and his wife made a special trip out to my house after business hours because of the urgency. I would highly recommend their company for pest control."
  },
  {
    name: "Joseph Hennessey",
    source: "Google",
    text: "Slap A Bug is an exceptional service. Brad and Ashley go above and beyond and always answer the phones. Couldn't be more happy with my service. 10 out of 10 recommend their service."
  },
  {
    name: "Leslie Fennell",
    source: "Google",
    text: "Responded right away. Very professional and educated me on pest control. Affordable and they work with you on how to treat best."
  },
  {
    name: "Lake Okeechobee RV Park",
    source: "Google",
    text: "Have been doing an amazing job with our pest control. Highly recommend for your home or business. Very professional and responsive."
  },
  {
    name: "David Winter",
    source: "Google",
    text: "Slap A Bug is the best pest control company we have ever had. Brad is prompt, thorough, very knowledgeable, and we never have a problem. I highly recommend this company to anyone."
  },
  {
    name: "Johnnie Felix",
    source: "Google",
    text: "Very professional and courteous, willing to also educate in regards to the type of bugs and the type of chemicals being used to destroy the bugs."
  },
  {
    name: "Francis Becker",
    source: "Facebook",
    text: "We work with Brad at Slap-A-Bug. He handles all our pest issues, is very knowledgeable, and explains everything to us. He has been a blessing. If there is a better pest control company in Okeechobee I haven't found them."
  },
  {
    name: "Jimmy Spivey Jr.",
    source: "Facebook",
    text: "Competitive prices, easy to work with, and the owner is friendly and really cares about the customer's concerns. Brad worked with us and will continue to take great care of the home going forward."
  },
  {
    name: "Les Fennell",
    source: "Facebook",
    text: "They responded right away. Very professional and they educate on how to treat best. Affordable. We are very pleased."
  },
  {
    name: "Lara Weight Loss Journey",
    source: "Facebook",
    text: "I can't recommend this company enough. They are super responsible, always on time, and go the extra mile to help you with every problem. They take care of my business and also my house."
  },
  {
    name: "Francesca Heath",
    source: "Facebook",
    text: "Awesome company, very helpful, and works with you not against you to get your pest issues under control. 10 out of 10 recommend."
  },
  {
    name: "Anais Diaz",
    source: "Facebook",
    text: "Yes, I would 100% recommend. They were friendly and professional. Will definitely use them again."
  },
  {
    name: "Maria Rodriguez",
    source: "Facebook",
    text: "They are such wonderful people. They took care of my parents' place and my niece's place. They are reasonably priced. My family no longer has a problem with any pest."
  },
  {
    name: "David Almazan",
    source: "Facebook",
    text: "Professional and thorough in their work, impressively knowledgeable in their craft and reasonably priced. Overall great experience, highly recommended."
  },
  {
    name: "Stephanie Burnham",
    source: "Facebook",
    text: "They came in at a reasonable price and got the bug problem under control. They are there when you need them and I still currently use them."
  },
  {
    name: "Clint Howell",
    source: "Facebook",
    text: "Slap A Bug Pest Control offers premier customer service that puts them miles ahead of their competitors. Their family first mentality makes you feel like they are treating their own homes with care and professionalism."
  }
];

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
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviewSource, setReviewSource] = useState<"All" | "Google" | "Facebook">("All");

  const visibleReviews =
    reviewSource === "All"
      ? customerReviews
      : customerReviews.filter((review) => review.source === reviewSource);

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
          background-position: calc(100% - 26px) 50%, calc(100% - 16px) 50%;
          background-size: 10px 10px, 10px 10px;
          background-repeat: no-repeat;
          padding-right: 3.75rem; cursor: pointer;
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

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-8 sm:pb-12">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8fc8ff]">
            Local Trust
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            What Okeechobee customers say.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_0_34px_rgba(31,111,190,0.08)] sm:p-7">
            <p className="text-lg tracking-[0.18em] text-[#ffd76a]">
              ★★★★★
            </p>

            <p className="mt-5 text-sm leading-7 text-white/72">
              “We work with Brad at Slap-A-Bug. He handles all our pest issues,
              is very knowledgeable, and explains everything to us. He also does
              exterior pest control for spiders at my mother's home. He has been
              a blessing. If there is a better pest control company in
              Okeechobee, I haven't found them. Slap-A-Bug's service and
              professionalism are unbeatable. 5 stars!”
            </p>

            <p className="mt-5 text-sm font-black text-white">
              Francis Becker
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_0_34px_rgba(31,111,190,0.08)] sm:p-7">
            <p className="text-lg tracking-[0.18em] text-[#ffd76a]">
              ★★★★★
            </p>

            <p className="mt-5 text-sm leading-7 text-white/72">
              “Competitive prices, easy to work with, and the owner is friendly
              and really cares about the customer's concerns. This is our rental
              home and we don't live in the same town. Brad worked with us and
              will continue taking great care of the home going forward. I would
              highly recommend Slap-A-Bug.”
            </p>

            <p className="mt-5 text-sm font-black text-white">
              Jimmy Spivey Jr.
            </p>
          </article>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm font-black text-white">
            <span className="text-[#ffd76a]">5.0 ★</span>
            <span className="text-white/45"> · </span>
            110 Google reviews
            <span className="text-white/45"> · </span>
            More customer recommendations on Facebook
          </p>

          <button
            type="button"
            onClick={() => setReviewsOpen(true)}
            className="mt-4 rounded-2xl border border-[#1d79d6]/55 bg-[#1d79d6]/16 px-6 py-3 text-sm font-black text-[#9dceff] transition hover:border-[#58a9ff]/80 hover:bg-[#1d79d6]/28 hover:text-white"
          >
            View customer reviews →
          </button>
        </div>
      </section>

      {reviewsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setReviewsOpen(false)}
        >
          <section
            className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] border border-white/12 bg-[#050b12] shadow-[0_0_90px_rgba(31,111,190,0.24)] sm:max-h-[86vh] sm:rounded-[2rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-white/10 px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-[#8fc8ff]">
                    Customer Reviews
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Real customer trust.
                  </h2>

                  <p className="mt-2 text-sm text-white/55">
                    5.0 on Google · 110 Google reviews · Facebook recommendations
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReviewsOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-xl text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close reviews"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {(["All", "Google", "Facebook"] as const).map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setReviewSource(source)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                      reviewSource === source
                        ? "bg-[#28c765] text-black"
                        : "border border-white/12 bg-white/[0.05] text-white/65 hover:text-white"
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7">
              <div className="grid gap-3 md:grid-cols-2">
                {visibleReviews.map((review) => (
                  <article
                    key={`${review.source}-${review.name}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-white">
                        {review.name}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                          review.source === "Google"
                            ? "bg-[#1d79d6]/18 text-[#9dceff]"
                            : "bg-[#28c765]/15 text-[#7eefab]"
                        }`}
                      >
                        {review.source}
                      </span>
                    </div>

                    <p className="mt-3 text-sm tracking-[0.15em] text-[#ffd76a]">
                      ★★★★★
                    </p>

                    <p className="mt-4 text-sm leading-7 text-white/68">
                      “{review.text}”
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

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
                      className="sab-select rounded-2xl border border-[#1d79d6]/30 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-[#58a9ff]/65 hover:bg-[#061423] focus:border-[#58a9ff]/80 focus:shadow-[0_0_24px_rgba(31,111,190,0.20)]"
                    >
                      {pestOptions.map(([pest]) => (
                        <option key={pest} className="bg-[#050b12] text-white">{pest}</option>
                      ))}
                      <option className="bg-[#050b12] text-white">Not Sure</option>
                    </select>

                    <select
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      className="sab-select rounded-2xl border border-[#1d79d6]/30 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-[#58a9ff]/65 hover:bg-[#061423] focus:border-[#58a9ff]/80 focus:shadow-[0_0_24px_rgba(31,111,190,0.20)]"
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
                      className="sab-select rounded-2xl border border-[#1d79d6]/30 bg-black/65 px-4 py-4 text-white outline-none transition hover:border-[#58a9ff]/65 hover:bg-[#061423] focus:border-[#58a9ff]/80 focus:shadow-[0_0_24px_rgba(31,111,190,0.20)]"
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
                      className="rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
                      placeholder="Your name"
                      required
                    />

                    <input
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="rounded-2xl border border-[#1d79d6]/25 bg-black/65 px-4 py-4 text-white outline-none transition focus:border-[#1d79d6]/70 focus:shadow-[0_0_24px_rgba(31,111,190,0.16)]"
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










