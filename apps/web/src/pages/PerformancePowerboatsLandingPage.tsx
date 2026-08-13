import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsLandingPage.css";

type ProjectType =
  | "Build a Performance"
  | "Service & Repair"
  | "Custom Metal Fabrication"
  | null;

const PROJECT_COPY = {
  "Build a Performance": {
    heading: "TELL US WHAT YOU WANT TO BUILD.",
    descriptionLabel: "What are you looking for in your Performance boat?",
    descriptionPlaceholder: "Tell us about the model, size, use and setup you have in mind...",
  },
  "Service & Repair": {
    heading: "TELL US ABOUT YOUR BOAT.",
    descriptionLabel: "What does the boat need?",
    descriptionPlaceholder: "Service, repair, repower, rigging, gel coat or other work...",
  },
  "Custom Metal Fabrication": {
    heading: "TELL US WHAT YOU NEED FABRICATED.",
    descriptionLabel: "Describe the fabrication project",
    descriptionPlaceholder: "Tell us what you need built, how it will be used and any measurements you know...",
  },
} as const;

const PERFORMANCE_SEO_TITLE =
  "Performance Powerboats | Custom Boats, Service & Marine Fabrication";
const PERFORMANCE_SEO_DESCRIPTION =
  "Performance Powerboats in Indiantown, Florida. Explore Performance models, custom builds, service, repair, repowers, rigging and marine fabrication.";
const PERFORMANCE_SEO_URL =
  "https://www.homeplanet.city/planet/performance-powerboats";
const PERFORMANCE_SEO_IMAGE =
  "https://www.homeplanet.city/images/performance-powerboats/performance-hero-boat.webp";
export default function PerformancePowerboatsLandingPage() {
  useEffect(() => {
    document.title = PERFORMANCE_SEO_TITLE;

    const setMeta = (
      selector: string,
      attrName: "property" | "name",
      attrValue: string,
      value: string
    ) => {
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", value);
    };

    setMeta(
      "meta[name='description']",
      "name",
      "description",
      PERFORMANCE_SEO_DESCRIPTION
    );

    setMeta("meta[property='og:title']", "property", "og:title", PERFORMANCE_SEO_TITLE);
    setMeta(
      "meta[property='og:description']",
      "property",
      "og:description",
      PERFORMANCE_SEO_DESCRIPTION
    );
    setMeta("meta[property='og:url']", "property", "og:url", PERFORMANCE_SEO_URL);
    setMeta("meta[property='og:image']", "property", "og:image", PERFORMANCE_SEO_IMAGE);
    setMeta("meta[property='og:type']", "property", "og:type", "website");

    setMeta("meta[name='twitter:title']", "name", "twitter:title", PERFORMANCE_SEO_TITLE);
    setMeta(
      "meta[name='twitter:description']",
      "name",
      "twitter:description",
      PERFORMANCE_SEO_DESCRIPTION
    );
    setMeta("meta[name='twitter:image']", "name", "twitter:image", PERFORMANCE_SEO_IMAGE);

    let canonical = document.head.querySelector(
      "link[rel='canonical']"
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = PERFORMANCE_SEO_URL;
  }, []);
  const [projectType, setProjectType] = useState<ProjectType>(null);
  const [openDoor, setOpenDoor] = useState<ProjectType>(null);
  const [intakeStep, setIntakeStep] = useState<"details" | "contact" | "done">("details");
  const [form, setForm] = useState({
    year: "",
    makeModel: "",
    length: "",
    engines: "",
    location: "",
    description: "",
    name: "",
    phone: "",
    email: "",
  });
  const isFabrication = projectType === "Custom Metal Fabrication";
  const projectCopy = projectType ? PROJECT_COPY[projectType] : null;

  const scrollToStart = () => {
    document
      .getElementById("start-project")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openPerformanceModels = () => {
    setProjectType(null);
    setOpenDoor("Build a Performance");

    window.setTimeout(() => {
      document
        .getElementById("start-project")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const chooseProject = (
    type: Exclude<ProjectType, null>,
    starter = "",
    model = ""
  ) => {
    setProjectType(type);
    setOpenDoor(null);
    setIntakeStep("details");
    setForm({
      year: "",
      makeModel: model,
      length: "",
      engines: "",
      location: "",
      description: starter,
      name: "",
      phone: "",
      email: "",
    });

    window.setTimeout(() => {
      document
        .getElementById("start-project")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };


  const finishRequest = async () => {
    if (!projectType || !form.name.trim() || !form.phone.trim()) return;

    const { error } = await supabase.rpc("submit_performance_powerboat_project", {
      p_project_type: projectType,
      p_customer_name: form.name.trim(),
      p_customer_phone: form.phone.trim(),
      p_customer_email: form.email.trim() || null,
      p_boat_year: form.year.trim() || null,
      p_boat_make_model: form.makeModel.trim() || null,
      p_boat_length: form.length.trim() || null,
      p_boat_engines: form.engines.trim() || null,
      p_boat_location: form.location.trim() || null,
      p_customer_request: form.description.trim() || null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setIntakeStep("done");
  };

  return (
    <main className="pp-page">
      <section className="pp-hero" style={{ backgroundImage: 'url("/images/performance-powerboats/performance-hero-boat.webp")' }}>
        <div className="pp-hero-shade" />

        <div className="pp-topbar">
          <div className="pp-location pp-location-top">INDIANTOWN, FL</div>

          <nav className="pp-nav" aria-label="Performance navigation">
            <a href="/planet/performance-powerboats/showroom">SHOWROOM</a>
            <a href="/planet/performance-powerboats/customer-builds">CUSTOMER BUILDS</a>
            <a href="/planet/performance-powerboats/start-project" className="pp-nav-cta">START A PROJECT</a>
          </nav>
        </div>

        <div className="pp-hero-content">
          <div className="pp-brand pp-brand-hero">
            <span className="pp-brand-main">PERFORMANCE</span>
            <span className="pp-brand-sub">POWERBOATS</span>
          </div>

          <h1 className="pp-hero-headline pp-hero-headline-top">
            <span>DECADES OF</span>
            <span><strong>PERFORMANCE.</strong></span>
          </h1>

          <div className="pp-hero-middle">
            <p>
              Built on decades of hands-on marine experience, craftsmanship,
              restoration, rigging and real performance on the water.
            </p>

            <div className="pp-actions">
              <button
                className="pp-btn pp-btn-gold"
                onClick={() => window.location.href = "/planet/performance-powerboats/models"}
              >
                VIEW PERFORMANCE MODELS
              </button>

              <button
                className="pp-btn pp-btn-dark"
                onClick={() => window.location.href = "/planet/performance-powerboats/contact"}
              >
                CONTACT PERFORMANCE
              </button>
            </div>
          </div>

          <h1 className="pp-hero-headline pp-hero-headline-bottom">
            <span>BUILT STRONG</span>
            <span>SINCE THE <strong>'80s.</strong></span>
          </h1>
        </div>
      </section>

      <section className="pp-service-bridge">
        <div className="pp-service-bridge-inner">
          <div className="pp-kicker">BUILT HERE. SERVICED HERE.</div>

          <h2>THE WORK DOESN'T STOP WHEN THE BOAT LEAVES THE SHOP.</h2>
          <p className="pp-service-bridge-copy">
            From routine service and rigging to repowers, electrical work and repairs.
          </p>


        </div>
      </section>
      <section className="pp-section pp-start" id="start-project">
        <div className="pp-center-heading">
          <div className="pp-kicker">SERVICE &amp; REPAIR</div>
          <h2>WHAT DOES YOUR BOAT NEED?</h2>
          <p>
            Choose what you need help with, send a quick request, or call Performance directly.
          </p>

          <div className="pp-service-direct-call">
            <a href="tel:+19548019524">CALL PERFORMANCE</a>
          </div>
        </div>

        {!projectType ? (
          <div className="pp-door-grid pp-service-grid">
            {[
              {
                title: "MOTOR / ENGINE",
                copy: "Running issues, diagnostics, maintenance or engine problems.",
                starter: "I need help with a motor or engine issue.",
              },
              {
                title: "ELECTRICAL / WIRING",
                copy: "Electrical problems, wiring, switches, batteries and onboard systems.",
                starter: "I need help with an electrical or wiring issue.",
              },
              {
                title: "RIGGING",
                copy: "Controls, steering, engines, systems and boat setup.",
                starter: "I need help with rigging or boat setup.",
              },
              {
                title: "REPOWER",
                copy: "Talk through engine replacement, power options and setup.",
                starter: "I want to discuss repowering my boat.",
              },
              {
                title: "GEL COAT / REFINISH",
                copy: "Gel coat repair, refinishing and related restoration work.",
                starter: "I need gel coat or refinishing work.",
              },
              {
                title: "GENERAL SERVICE / REPAIR",
                copy: "Not sure where it fits? Tell Performance what the boat is doing.",
                starter: "I need service or repair work on my boat.",
              },
            ].map((service) => (
              <button
                key={service.title}
                type="button"
                className="pp-door pp-service-choice"
                onClick={() =>
                  chooseProject("Service & Repair", service.starter)
                }
              >
                <span className="pp-door-title">{service.title}</span>
                <span className="pp-door-copy">{service.copy}</span>
                <span className="pp-door-arrow">→</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="pp-intake">
            {intakeStep !== "done" && (
              <div className="pp-intake-top">
                <button
                  className="pp-back"
                  onClick={() => {
                    if (intakeStep === "details") {
                      setProjectType(null);
                    } else {
                      setIntakeStep("details");
                    }
                  }}
                >
                  ← BACK
                </button>

                <span className="pp-selected">{projectType}</span>
              </div>
            )}

            {intakeStep === "details" && (
              <div className="pp-intake-step">
                <div className="pp-intake-label">YOUR PROJECT</div>
                <h3>{projectCopy?.heading}</h3>

                <div className="pp-form-grid">
                  {!isFabrication && (
                  <>
                  <label>
                    {projectType === "Build a Performance" ? "Target Year" : "Year"}
                    <input
                      value={form.year}
                      onChange={(event) => updateForm("year", event.target.value)}
                      placeholder="2012"
                    />
                  </label>

                  <label>
                    {projectType === "Build a Performance" ? "Performance Model / Boat Interest" : "Make / Model"}
                    <input
                      value={form.makeModel}
                      onChange={(event) => updateForm("makeModel", event.target.value)}
                      placeholder={projectType === "Build a Performance" ? "Performance 43 or not sure yet" : "SeaCraft"}
                    />
                  </label>

                  <label>
                    {projectType === "Build a Performance" ? "Target Length" : "Length"}
                    <input
                      value={form.length}
                      onChange={(event) => updateForm("length", event.target.value)}
                      placeholder="25 ft"
                    />
                  </label>

                  <label>
                    {projectType === "Build a Performance" ? "Engine / Power Preference" : "Engines"}
                    <input
                      value={form.engines}
                      onChange={(event) => updateForm("engines", event.target.value)}
                      placeholder={projectType === "Build a Performance" ? "Tell us what you have in mind" : "Twin Yamaha"}
                    />
                  </label>
                  </>
                  )}

                  {!isFabrication && (
                    <label className="pp-full">
                      {projectType === "Build a Performance"
                        ? "Where will the boat be used or delivered?"
                        : "Boat Location"}
                      <input
                        value={form.location}
                        onChange={(event) => updateForm("location", event.target.value)}
                        placeholder="Stuart, FL"
                      />
                    </label>
                  )}

                  <label className="pp-full">
                    {projectCopy?.descriptionLabel}
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(event) => updateForm("description", event.target.value)}
                      placeholder={projectCopy?.descriptionPlaceholder}
                    />
                  </label>
                </div>

                <button
                  className="pp-submit"
                  type="button"
                  onClick={() => setIntakeStep("contact")}
                >
                  CONTINUE
                </button>
              </div>
            )}

            {intakeStep === "contact" && (
              <div className="pp-intake-step">
                <div className="pp-intake-label">HOW SHOULD WE REACH YOU?</div>
                <h3>LET'S GET THIS IN FRONT OF MAX.</h3>

                <p className="pp-intake-intro">
                  Send the request now. Photos, measurements and other project details can be added to the same work order later.
                </p>

                <div className="pp-form-grid">
                  <label>
                    Name *
                    <input
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      placeholder="Your name"
                    />
                  </label>

                  <label>
                    Phone *
                    <input
                      value={form.phone}
                      onChange={(event) => updateForm("phone", event.target.value)}
                      placeholder="Your phone"
                      inputMode="tel"
                    />
                  </label>

                  <label className="pp-full">
                    Email
                    <input
                      value={form.email}
                      onChange={(event) => updateForm("email", event.target.value)}
                      placeholder="Your email"
                      inputMode="email"
                    />
                  </label>
                </div>

                <button
                  className="pp-submit"
                  type="button"
                  disabled={!form.name.trim() || !form.phone.trim()}
                  onClick={finishRequest}
                >
                  SEND TO PERFORMANCE POWERBOATS
                </button>
              </div>
            )}

            {intakeStep === "done" && (
              <div className="pp-confirmation">
                <div className="pp-confirmation-check">✓</div>
                <div className="pp-kicker">REQUEST RECEIVED</div>
                <h3>GOT IT.</h3>

                <p>
                  Your project is now with Performance Powerboats.
                  Max's team can review it, contact you and keep the work organized from here.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="pp-section pp-production-engine" id="custom-builds">
        <div className="pp-production-engine-grid">
          <div className="pp-production-engine-copy">
            <div className="pp-kicker">THE PRODUCTION ENGINE</div>

            <h2>
              MOLDS. TOOLING.
              <br />
              <span>BUILT TO KEEP MOVING.</span>
            </h2>

            <p className="pp-production-lead">
              Performance Powerboats uses established molds and dedicated tooling
              to produce proven hulls, consoles, compartments and components
              with consistency from build to build.
            </p>

            <div className="pp-production-points">
              <div className="pp-production-point">
                <strong>HULL &amp; MODEL TOOLING</strong>
                <span>
                  The foundation behind proven Performance hulls and repeatable production.
                </span>
              </div>

              <div className="pp-production-point">
                <strong>CONSOLES &amp; COMPARTMENTS</strong>
                <span>
                  Dedicated tooling creates components engineered specifically for the boats they were built for.
                </span>
              </div>

              <div className="pp-production-point">
                <strong>CONSISTENCY BY DESIGN</strong>
                <span>
                  Proven molds and tooling carry Performance standards from one build to the next.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="pp-production-cta"
              onClick={() => window.location.href = "/planet/performance-powerboats/molds-tooling"}
            >
              EXPLORE MOLDS &amp; TOOLING →
            </button>
          </div>

          <div className="pp-real-image pp-production-engine-image">
            <img
              src="/images/performance-powerboats/performance-hull-inside-shop.webp"
              alt="Performance Powerboats production work inside the shop"
            />
          </div>
        </div>
      </section>
      <section className="pp-section pp-facility">
        <div className="pp-copy-block">
          <div className="pp-kicker">THE NEXT CHAPTER</div>

          <h2>
            THE NEW HOME OF
            <br />
            <span>PERFORMANCE POWERBOATS.</span>
          </h2>

          <p>
            A new facility built for what comes next. More room to build,
            rig, restore and grow.
          </p>
        </div>

        <div className="pp-real-image pp-facility-image">
          <img
            src="/images/performance-powerboats/performance-new-facility.webp"
            alt="Performance Powerboats new facility in Indiantown, Florida"
          />
        </div>
      </section>

      <section className="pp-section pp-process" id="boats">
        <div className="pp-center-heading">
          <div className="pp-kicker">THE BUILD</div>
          <h2>
            FROM <span>HULL TO WATER.</span>
          </h2>
          <p>
            Built in stages. Finished with purpose.
          </p>
        </div>

        <div className="pp-build-story">
          <article className="pp-build-feature">
            <div className="pp-real-image pp-build-feature-image">
              <img
                src="/images/performance-powerboats/performance-hull-inside-shop.webp"
                alt="Performance Powerboats hull being built inside the shop"
              />
            </div>

            <div className="pp-build-feature-copy">
              <span className="pp-build-step">01</span>
              <div>
                <div className="pp-kicker">THE HULL</div>
                <h3>WHERE PERFORMANCE TAKES SHAPE.</h3>
                <p>
                  The structure comes first. This is where the boat begins
                  taking shape.
                </p>
              </div>
            </div>
          </article>

          <div className="pp-build-stack">
            <article className="pp-build-feature">
              <div className="pp-real-image pp-build-feature-image">
                <img
                  src="/images/performance-powerboats/performance-rigging-triple-yamaha.webp"
                  alt="Performance Powerboats engine rigging"
                />
              </div>

              <div className="pp-build-feature-copy">
                <span className="pp-build-step">02</span>
                <div>
                  <div className="pp-kicker">RIGGING & SYSTEMS</div>
                  <h3>POWERED. RIGGED. DIALED IN.</h3>
                  <p>
                    Engines, controls and systems come together before the
                    boat ever touches the water.
                  </p>
                </div>
              </div>
            </article>

            <article className="pp-build-feature">
              <div className="pp-real-image pp-build-feature-image">
                <img
                  src="/images/performance-powerboats/performance-43-on-water.webp"
                  alt="Performance Powerboats finished boat on the water"
                />
              </div>

              <div className="pp-build-feature-copy">
                <span className="pp-build-step">03</span>
                <div>
                  <div className="pp-kicker">THE WATER</div>
                  <h3>BUILT TO DO WHAT IT WAS MADE TO DO.</h3>
                  <p>
                    Finished, rigged and ready to be used for what it was built
                    to do.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>


      </section>

      <section className="pp-story" id="showroom">
        <div className="pp-story-inner">
          <div className="pp-kicker">THE STORY</div>

          <h2>THIS DIDN'T START IN A SHOWROOM.</h2>

          <p>
            It started with boats, tools, repairs, rebuilds and years of
            learning what holds up on the water.
          </p>

          <div className="pp-story-gallery">
            <div className="pp-real-image pp-story-photo">
              <img
                src="/images/performance-powerboats/02-restoration-top-removal.jpg"
                alt="Early boat restoration work"
              />
            </div>

            <div className="pp-real-image pp-story-photo">
              <img
                src="/images/performance-powerboats/03-restoration-gutted-boat.jpg"
                alt="Boat restoration stripped for rebuild"
              />
            </div>

            <div className="pp-real-image pp-story-photo">
              <img
                src="/images/performance-powerboats/05-restoration-refinished-hull.jpg"
                alt="Restored hull after refinishing"
              />
            </div>
          </div>

          <div className="pp-now">
            <span>BUILT. RESTORED. RIGGED.</span>
            <strong>CUSTOMIZED.</strong>
          </div>

          <p className="pp-story-support">
            From service and repair to full custom builds, Performance has spent
            decades doing the work — not just selling the idea.
          </p>

          <div className="pp-real-image pp-story-payoff">
            <img
              src="/images/performance-powerboats/performance-finished-boat.webp"
              alt="Performance Powerboats finished boat cruising through a palm-lined marina"
            />
          </div>
        </div>
      </section>

      <section className="pp-final-build-cta-section">
        <div className="pp-shell">        <div className="pp-build-cta">
          <div className="pp-build-cta-copy">
            <div className="pp-kicker">READY TO BUILD?</div>
            <h2>START YOUR PERFORMANCE BUILD.</h2>
            <p>
              Tell us what you’re looking to build, how you’ll use it and where
              you want to start. We’ll take it from there.
            </p>
          </div>

          <div className="pp-build-cta-actions">
            <a className="pp-btn pp-btn-gold" href="/planet/performance-powerboats/build">
              START YOUR BUILD
            </a>
            <a className="pp-build-cta-link" href="/planet/performance-powerboats/models">
              EXPLORE PERFORMANCE MODELS →
            </a>
          </div>
        </div>        </div>
      </section>

      <footer className="pp-footer pp-footer-defined">
        <div className="pp-shell pp-footer-grid">
          <div className="pp-footer-about">
            <div className="pp-footer-kicker">PERFORMANCE POWERBOATS</div>

            <h2>
              DECADES OF PERFORMANCE.
              <span> BUILT FOR WHAT'S NEXT.</span>
            </h2>

            <p>
              Indiantown, Florida · Since the 1980s
            </p>
          </div>

          <div className="pp-footer-column">
            <div className="pp-footer-heading">EXPLORE</div>
            <a href="/planet/performance-powerboats/showroom">Showroom</a>
            <a href="#showroom">Gallery</a>
            <a href="/planet/performance-powerboats/models">Performance Models</a>
            <a href="#custom-builds">Custom Builds</a>
          </div>

          <div className="pp-footer-column">
            <div className="pp-footer-heading">WORK WITH US</div>
            <a href="#start-project">Service &amp; Repair</a>
            <a href="#start-project">Start a Project</a>
            <a href="sms:+19548019524">Ask Us a Question</a>
          </div>

          <div className="pp-footer-column pp-footer-contact">
            <div className="pp-footer-heading">CONTACT</div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=12633%20Southwest%20Impact%20Drive%2C%20Indiantown%2C%20Florida"
              target="_blank"
              rel="noreferrer"
            >
              12633 Southwest Impact Drive<br />
              Indiantown, Florida
            </a>

            <a className="pp-footer-call" href="tel:+19548019524">
              CALL PERFORMANCE
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=12633%20Southwest%20Impact%20Drive%2C%20Indiantown%2C%20Florida"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions →
            </a>
          </div>
        </div>

        <div className="pp-footer-bottom pp-footer-defined-bottom">
          <span>PERFORMANCE POWERBOATS · INDIANTOWN, FLORIDA</span>
          <span>Built by HomePlanet</span>
        </div>
      </footer>
    </main>
  );
}





































