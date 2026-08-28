import { Link } from "react-router-dom";
import "./PerformancePowerboatsMoldsToolingPage.css";

const SHOP = "/images/performance-powerboats";

export default function PerformancePowerboatsMoldsToolingPage() {
  return (
    <main className="pp-molds-page">
      <header className="pp-molds-hero">
        <div className="pp-molds-shell">
          <Link
            className="pp-molds-back"
            to="/planet/performance-powerboats"
          >
            ← PERFORMANCE POWERBOATS
          </Link>

          <div className="pp-molds-kicker">MOLDS & TOOLING</div>

          <h1>
            THE FOUNDATION
            <br />
            BEHIND THE BUILD.
          </h1>

          <p className="pp-molds-lead">
            Before a finished boat ever reaches the water, the work starts here.
            Molds, tooling and components shape what comes next.
          </p>
        </div>
      </header>

      <section className="pp-molds-feature">
        <div className="pp-molds-shell">
          <div className="pp-molds-feature-image">
            <img
              src={`${SHOP}/100_0265.JPG`}
              alt="Large Performance Powerboats hull tooling inside the Indiantown shop"
            />
          </div>

          <div className="pp-molds-feature-copy">
            <div className="pp-molds-kicker">THE STARTING POINT</div>
            <h2>THIS IS WHERE A PERFORMANCE STARTS.</h2>
            <p>
              Large hull tooling and production molds give the build its shape
              long before rigging, electronics, metalwork and finishing begin.
            </p>
          </div>
        </div>
      </section>

      <section className="pp-molds-scale">
        <div className="pp-molds-shell">
          <div className="pp-molds-section-heading">
            <div className="pp-molds-kicker">BUILT AT SCALE</div>
            <h2>THE TOOLING BEHIND THE HULL.</h2>
            <p>
              Real production tooling from inside the Performance Powerboats
              operation in Indiantown.
            </p>
          </div>

          <div className="pp-molds-scale-grid">
            <figure className="pp-molds-photo pp-molds-photo-tall">
              <img
                src={`${SHOP}/100_0268.JPG`}
                alt="Bow view of large hull tooling at Performance Powerboats"
              />
            </figure>

            <figure className="pp-molds-photo">
              <img
                src={`${SHOP}/100_0383.JPG`}
                alt="Long hull mold and tooling inside the Performance Powerboats shop"
              />
            </figure>

            <figure className="pp-molds-photo">
              <img
                src={`${SHOP}/100_0384.JPG`}
                alt="Large Performance Powerboats tooling structure in the shop"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-molds-components">
        <div className="pp-molds-shell">
          <div className="pp-molds-section-heading">
            <div className="pp-molds-kicker">MORE THAN THE HULL</div>
            <h2>FROM THE HULL TO THE DETAILS.</h2>
            <p>
              Smaller molds and components are part of the same build process,
              giving Performance control over more of what goes into the boat.
            </p>
          </div>

          <div className="pp-molds-component-grid">
            <figure className="pp-molds-photo">
              <img
                src={`${SHOP}/100_0270.JPG`}
                alt="Smaller molded boat component at Performance Powerboats"
              />
            </figure>

            <figure className="pp-molds-photo">
              <img
                src={`${SHOP}/100_0271.JPG`}
                alt="Finished molded component inside the Performance Powerboats shop"
              />
            </figure>

            <figure className="pp-molds-photo">
              <img
                src={`${SHOP}/100_0370.JPG`}
                alt="Group of smaller production molds at Performance Powerboats"
              />
            </figure>

            <figure className="pp-molds-photo">
              <img
                src={`${SHOP}/100_0373.JPG`}
                alt="Curved fiberglass mold and component tooling"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-molds-end">
        <div className="pp-molds-shell">
          <div className="pp-molds-end-card">
            <div>
              <div className="pp-molds-kicker">FROM TOOLING TO WATER</div>
              <h2>THE MOLD IS ONLY THE BEGINNING.</h2>
              <p>
                Explore the boats, builds and custom work that come out of the
                Performance Powerboats operation.
              </p>
            </div>

            <div className="pp-molds-actions">
              <Link
                className="pp-molds-btn pp-molds-btn-gold"
                to="/planet/performance-powerboats/models"
              >
                EXPLORE MODELS
              </Link>

              <Link
                className="pp-molds-btn pp-molds-btn-outline"
                to="/planet/performance-powerboats/start-project"
              >
                START A PROJECT
              </Link>
            </div>
          </div>

          <Link
            className="pp-molds-home"
            to="/planet/performance-powerboats"
          >
            ← BACK TO PERFORMANCE POWERBOATS
          </Link>
        </div>
      </section>
    </main>
  );
}


