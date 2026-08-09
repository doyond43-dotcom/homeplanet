import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsLandingPage.css";

type ProjectType =
  | "New Build"
  | "Boat Repair"
  | "Restoration & Refit"
  | "Marine Service"
  | null;

export default function PerformancePowerboatsLandingPage() {
  const [projectType, setProjectType] = useState<ProjectType>(null);
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

  const scrollToStart = () => {
    document
      .getElementById("start-project")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const chooseProject = (type: Exclude<ProjectType, null>) => {
    setProjectType(type);
    setIntakeStep("details");
    setForm({
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
      <section className="pp-hero" style={{ backgroundImage: 'url("/images/performance-powerboats/speeding_white_powerboat_at_the_marina.png")' }}>
        <div className="pp-hero-shade" />

        <div className="pp-topbar">
          <div className="pp-brand">
            <span className="pp-brand-main">PERFORMANCE</span>
            <span className="pp-brand-sub">POWERBOATS</span>
          </div>

          <div className="pp-location">INDIANTOWN, FL</div>
        </div>

        <div className="pp-hero-content">
          <div className="pp-eyebrow">PERFORMANCE POWERBOATS</div>

          <h1>
            BUILT HERE.
            <br />
            RUN HARD.
            <br />
            <span>MADE FOR THE WATER.</span>
          </h1>

          <p>
            Custom powerboats backed by real marine experience,
            craftsmanship and years of hands-on work on the water.
          </p>

          <div className="pp-actions">
            <button
              className="pp-btn pp-btn-gold"
              onClick={() =>
                document
                  .getElementById("boats")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              SEE THE BOATS
            </button>

            <button className="pp-btn pp-btn-dark" onClick={scrollToStart}>
              START A PROJECT
            </button>
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
            src="/images/performance-powerboats/17-performance-powerboats-new-facility.jpg"
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
            The page should show the work, not just talk about it.
          </p>
        </div>

        <div className="pp-build-story">
          <article className="pp-build-feature">
            <div className="pp-real-image pp-build-feature-image">
              <img
                src="/images/performance-powerboats/10-large-hull-inside-shop.jpg"
                alt="Performance Powerboats hull being built inside the shop"
              />
            </div>

            <div className="pp-build-feature-copy">
              <span className="pp-build-step">01</span>
              <div>
                <div className="pp-kicker">BUILDING IT</div>
                <h3>IT STARTS WITH THE HULL.</h3>
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
                  src="/images/performance-powerboats/06-rigging-triple-yamaha.jpg"
                  alt="Performance Powerboats engine rigging"
                />
              </div>

              <div className="pp-build-feature-copy">
                <span className="pp-build-step">02</span>
                <div>
                  <div className="pp-kicker">RIGGING IT</div>
                  <h3>POWER. SYSTEMS. SETUP.</h3>
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
                  src="/images/performance-powerboats/08-performance-43-on-water.jpg"
                  alt="Performance Powerboats finished boat on the water"
                />
              </div>

              <div className="pp-build-feature-copy">
                <span className="pp-build-step">03</span>
                <div>
                  <div className="pp-kicker">PUTTING IT ON THE WATER</div>
                  <h3>THIS IS WHAT ALL THE WORK BECOMES.</h3>
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

      <section className="pp-section pp-start" id="start-project">
        <div className="pp-center-heading">
          <div className="pp-kicker">START A PROJECT</div>
          <h2>READY TO TALK ABOUT YOUR BOAT?</h2>
          <p>Choose what you need and tell Performance Powerboats what you're working on.</p>
        </div>

        {!projectType ? (
          <div className="pp-door-grid">
            <button
              className="pp-door"
              onClick={() => chooseProject("New Build")}
            >
              <span className="pp-door-title">NEW BUILD</span>
              <span className="pp-door-copy">
                I'm interested in a new Performance Powerboat.
              </span>
              <span className="pp-door-arrow">→</span>
            </button>

            <button
              className="pp-door"
              onClick={() => chooseProject("Boat Repair")}
            >
              <span className="pp-door-title">BOAT REPAIR</span>
              <span className="pp-door-copy">
                Something needs to be fixed.
              </span>
              <span className="pp-door-arrow">→</span>
            </button>

            <button
              className="pp-door"
              onClick={() => chooseProject("Restoration & Refit")}
            >
              <span className="pp-door-title">RESTORATION & REFIT</span>
              <span className="pp-door-copy">
                Rebuild, restore, repower or upgrade.
              </span>
              <span className="pp-door-arrow">→</span>
            </button>

            <button
              className="pp-door"
              onClick={() => chooseProject("Marine Service")}
            >
              <span className="pp-door-title">MARINE SERVICE</span>
              <span className="pp-door-copy">
                Service, engines, rigging, diagnostics or maintenance.
              </span>
              <span className="pp-door-arrow">→</span>
            </button>
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
                <h3>TELL US ABOUT YOUR BOAT.</h3>

                <div className="pp-form-grid">
                  <label>
                    Year
                    <input
                      value={form.year}
                      onChange={(event) => updateForm("year", event.target.value)}
                      placeholder="2012"
                    />
                  </label>

                  <label>
                    Make / Model
                    <input
                      value={form.makeModel}
                      onChange={(event) => updateForm("makeModel", event.target.value)}
                      placeholder="SeaCraft"
                    />
                  </label>

                  <label>
                    Length
                    <input
                      value={form.length}
                      onChange={(event) => updateForm("length", event.target.value)}
                      placeholder="25 ft"
                    />
                  </label>

                  <label>
                    Engines
                    <input
                      value={form.engines}
                      onChange={(event) => updateForm("engines", event.target.value)}
                      placeholder="Twin Yamaha"
                    />
                  </label>

                  <label className="pp-full">
                    Boat Location
                    <input
                      value={form.location}
                      onChange={(event) => updateForm("location", event.target.value)}
                      placeholder="Stuart, FL"
                    />
                  </label>

                  <label className="pp-full">
                    What are you looking to have done?
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(event) => updateForm("description", event.target.value)}
                      placeholder="Tell us what you're working on..."
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

      <section className="pp-story">
        <div className="pp-story-inner">
          <div className="pp-kicker">THE STORY</div>

          <h2>THIS DIDN'T START IN A SHOWROOM.</h2>

          <p>
            It started with boats, tools, repairs, rebuilds and years of
            figuring out what works on the water.
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
            <span>NOW</span>
            <strong>WE BUILD THEM.</strong>
          </div>

          <div className="pp-real-image pp-story-payoff">
            <img
              src="/images/performance-powerboats/mntdataluxury_yacht_cruising_a_palm_lined_marina.png"
              alt="Performance Powerboats finished boat cruising through a palm-lined marina"
            />
          </div>
        </div>
      </section>

      <footer className="pp-footer">
        <div className="pp-shell pp-footer-inner">
          <div className="pp-footer-brand">
            <div className="pp-footer-kicker">PERFORMANCE POWERBOATS</div>
            <h2>BUILT HERE. MADE FOR THE WATER.</h2>
            <p>
              Indiantown, Florida · New build · Boat repair · Restoration & refit · Marine service
            </p>
          </div>

          <div className="pp-footer-cta">
            <a className="pp-footer-button" href="#start-project">START A PROJECT</a>
          </div>
        </div>

        <div className="pp-footer-bottom">
          <span>Powered by HomePlanet</span>
        </div>
      </footer>
    </main>
  );
}



