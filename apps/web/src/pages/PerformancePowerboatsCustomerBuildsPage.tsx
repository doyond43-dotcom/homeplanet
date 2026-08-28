import { Link } from "react-router-dom";
import "./PerformancePowerboatsCustomerBuildsPage.css";

const SHOP = "/images/performance-powerboats";
const IMAGES = "/images/performance-powerboats";

export default function PerformancePowerboatsCustomerBuildsPage() {
  return (
    <main className="pp-customer-builds-page">
      <section className="pp-customer-builds-hero">
        <div className="pp-customer-builds-shell">
          <Link
            className="pp-customer-builds-back"
            to="/planet/performance-powerboats"
          >
            ← PERFORMANCE POWERBOATS
          </Link>

          <div className="pp-customer-builds-kicker">CUSTOMER BUILDS</div>

          <h1>
            REAL BOATS.
            <br />
            REAL WORK.
          </h1>

          <p className="pp-customer-builds-lead">
            New builds, restorations, repairs and custom work moving through the
            Performance Powerboats shop.
          </p>
        </div>
      </section>

      <section className="pp-customer-builds-feature">
        <div className="pp-customer-builds-shell">
          <div className="pp-customer-builds-feature-grid">
            <div className="pp-customer-builds-feature-image">
              <img
                src={`${IMAGES}/10-large-hull-inside-shop.jpg`}
                alt="Large boat hull inside the Performance Powerboats shop"
              />
            </div>

            <div className="pp-customer-builds-feature-copy">
              <div className="pp-customer-builds-kicker">IN THE SHOP</div>
              <h2>THE BUILD IS THE STORY.</h2>
              <p>
                Before a project becomes a finished boat, there is structure,
                fiberglass, fabrication, rigging, fitting, repair and detail work
                happening behind the scenes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-customer-builds-dark">
        <div className="pp-customer-builds-shell">
          <div className="pp-customer-builds-heading pp-customer-builds-heading-dark">
            <div className="pp-customer-builds-kicker">THE WORK IN BETWEEN</div>
            <h2>NOT EVERY PROJECT STARTS CLEAN.</h2>
            <p>
              Some boats come in needing repair, restoration or a complete rethink.
              The work in the middle is what turns them into something worth putting
              back on the water.
            </p>
          </div>

          <div className="pp-customer-builds-process-grid">
            <figure className="pp-customer-builds-photo pp-customer-builds-photo-large">
              <img
                src={`${IMAGES}/02-restoration-top-removal.jpg`}
                alt="Boat restoration project during top removal"
              />
            </figure>

            <figure className="pp-customer-builds-photo">
              <img
                src={`${IMAGES}/04-restoration-stripped-interior.jpg`}
                alt="Stripped boat interior during restoration"
              />
            </figure>

            <figure className="pp-customer-builds-photo">
              <img
                src={`${SHOP}/100_0363.JPG`}
                alt="Fiberglass component work in progress at Performance Powerboats"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-customer-builds-progress">
        <div className="pp-customer-builds-shell">
          <div className="pp-customer-builds-heading">
            <div className="pp-customer-builds-kicker">BUILDING IT BACK</div>
            <h2>STRUCTURE. FIT. FINISH.</h2>
            <p>
              The middle of a project is where the boat starts becoming whole again.
            </p>
          </div>

          <div className="pp-customer-builds-progress-grid">
            <figure className="pp-customer-builds-photo">
              <img
                src={`${SHOP}/100_0320.JPG`}
                alt="Boat top and structure during fabrication"
              />
            </figure>

            <figure className="pp-customer-builds-photo">
              <img
                src={`${SHOP}/100_0324.JPG`}
                alt="Rigging and helm work during a Performance Powerboats project"
              />
            </figure>

            <figure className="pp-customer-builds-photo">
              <img
                src={`${SHOP}/100_0342.JPG`}
                alt="Boat interior rigging and systems work"
              />
            </figure>

            <figure className="pp-customer-builds-photo">
              <img
                src={`${SHOP}/100_0349.JPG`}
                alt="Finished boat structure and rigging detail"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-customer-builds-finished">
        <div className="pp-customer-builds-shell">
          <div className="pp-customer-builds-heading">
            <div className="pp-customer-builds-kicker">BACK ON THE WATER</div>
            <h2>FROM PROJECT TO FINISHED BOAT.</h2>
            <p>
              The goal is simple: take the work all the way through to something
              finished, functional and ready to use.
            </p>
          </div>

          <div className="pp-customer-builds-finished-grid">
            <figure className="pp-customer-builds-photo">
              <img
                src={`${IMAGES}/performance-43-on-water.webp`}
                alt="Finished Performance Powerboats boat on the water"
              />
            </figure>

            <figure className="pp-customer-builds-photo">
              <img
                src={`${IMAGES}/performance-finished-boat.webp`}
                alt="Finished custom Performance Powerboats build"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-customer-builds-cta-section">
        <div className="pp-customer-builds-shell">
          <div className="pp-customer-builds-cta">
            <div>
              <div className="pp-customer-builds-kicker">YOUR BOAT. YOUR PROJECT.</div>
              <h2>EVERY BOAT HAS A STARTING POINT.</h2>
              <p>
                New build, restoration, repair or custom work — tell Performance
                what you are working with and where you want to take it.
              </p>
            </div>

            <div className="pp-customer-builds-actions">
              <Link
                className="pp-customer-builds-btn pp-customer-builds-btn-gold"
                to="/planet/performance-powerboats/start-project"
              >
                START A PROJECT
              </Link>

              <Link
                className="pp-customer-builds-btn pp-customer-builds-btn-outline"
                to="/planet/performance-powerboats/showroom"
              >
                VIEW SHOWROOM
              </Link>
            </div>
          </div>

          <Link
            className="pp-customer-builds-home"
            to="/planet/performance-powerboats"
          >
            ← BACK TO PERFORMANCE POWERBOATS
          </Link>
        </div>
      </section>
    </main>
  );
}


