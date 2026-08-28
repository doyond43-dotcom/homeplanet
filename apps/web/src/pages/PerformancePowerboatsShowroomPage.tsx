import { Link } from "react-router-dom";
import "./PerformancePowerboatsShowroomPage.css";

const SHOP = "/images/performance-powerboats";
const IMAGES = "/images/performance-powerboats";

export default function PerformancePowerboatsShowroomPage() {
  return (
    <main className="pp-showroom-page">
      <section className="pp-showroom-hero">
        <div className="pp-showroom-shell">
          <Link className="pp-showroom-back" to="/planet/performance-powerboats">
            ← PERFORMANCE POWERBOATS
          </Link>

          <div className="pp-showroom-kicker">SHOWROOM</div>

          <h1>
            SEE WHAT
            <br />
            PERFORMANCE BUILDS.
          </h1>

          <p className="pp-showroom-lead">
            Finished boats, real builds and the details that bring a Performance
            together on the water.
          </p>
        </div>
      </section>

      <section className="pp-showroom-feature">
        <div className="pp-showroom-shell">
          <div className="pp-showroom-feature-image">
            <img
              src={`${IMAGES}/performance-43-on-water.webp`}
              alt="Performance Powerboats boat on the water"
            />
          </div>

          <div className="pp-showroom-copy">
            <div className="pp-showroom-kicker">BUILT FOR THE WATER</div>
            <h2>THE FINISHED PRODUCT SPEAKS FOR ITSELF.</h2>
            <p>
              The tooling, fabrication, rigging and finish work all lead here:
              a completed boat ready to leave the shop and do what it was built to do.
            </p>
          </div>
        </div>
      </section>

      <section className="pp-showroom-dark">
        <div className="pp-showroom-shell">
          <div className="pp-showroom-copy pp-showroom-copy-dark">
            <div className="pp-showroom-kicker">REAL PERFORMANCE BOATS</div>
            <h2>FROM THE SHOP TO THE WATER.</h2>
            <p>
              A look at finished and near-finished Performance builds without
              turning the showroom into a catalog.
            </p>
          </div>

          <div className="pp-showroom-gallery-main">
            <figure className="pp-showroom-photo pp-showroom-photo-large">
              <img
                src={`${IMAGES}/07-performance-43-docked.jpg`}
                alt="Performance Powerboats boat docked"
              />
            </figure>

            <figure className="pp-showroom-photo">
              <img
                src={`${SHOP}/100_0276.JPG`}
                alt="Finished Performance Powerboats hull outside the shop"
              />
            </figure>

            <figure className="pp-showroom-photo">
              <img
                src={`${SHOP}/100_0277.JPG`}
                alt="Performance Powerboats finished hull on trailer"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-showroom-details">
        <div className="pp-showroom-shell">
          <div className="pp-showroom-copy">
            <div className="pp-showroom-kicker">FINISHED DETAILS</div>
            <h2>BUILT AS A COMPLETE BOAT.</h2>
            <p>
              Hull shape, deck layout, consoles, rigging and finishing details
              come together as one finished build.
            </p>
          </div>

          <div className="pp-showroom-detail-grid">
            <figure className="pp-showroom-photo">
              <img
                src={`${SHOP}/100_0278.JPG`}
                alt="Performance Powerboats bow and deck layout"
              />
            </figure>

            <figure className="pp-showroom-photo">
              <img
                src={`${SHOP}/100_0280.JPG`}
                alt="Finished Performance Powerboats deck detail"
              />
            </figure>

            <figure className="pp-showroom-photo">
              <img
                src={`${SHOP}/100_0282.JPG`}
                alt="Finished Performance Powerboats hull and deck"
              />
            </figure>

            <figure className="pp-showroom-photo">
              <img
                src={`${SHOP}/100_0284.JPG`}
                alt="Performance Powerboats finished bow detail"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="pp-showroom-finished">
        <div className="pp-showroom-shell">
          <div className="pp-showroom-finished-card">
            <div className="pp-showroom-finished-image">
              <img
                src={`${IMAGES}/performance-finished-boat.webp`}
                alt="Finished custom powerboat"
              />
            </div>

            <div className="pp-showroom-finished-copy">
              <div className="pp-showroom-kicker">BUILT AROUND THE BOAT</div>
              <h2>NO TWO PROJECTS HAVE TO END THE SAME WAY.</h2>
              <p>
                Performance builds around how the boat will actually be used,
                with the final setup shaped by the project, equipment and owner.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-showroom-cta-section">
        <div className="pp-showroom-shell">
          <div className="pp-showroom-cta">
            <div>
              <div className="pp-showroom-kicker">FIND YOUR PERFORMANCE</div>
              <h2>START WITH THE BOAT. BUILD FROM THERE.</h2>
              <p>
                Explore the Performance lineup or tell the shop what you are
                looking to build.
              </p>
            </div>

            <div className="pp-showroom-actions">
              <Link
                className="pp-showroom-btn pp-showroom-btn-gold"
                to="/planet/performance-powerboats/models"
              >
                PERFORMANCE MODELS
              </Link>

              <Link
                className="pp-showroom-btn pp-showroom-btn-outline"
                to="/planet/performance-powerboats/start-project"
              >
                START A PROJECT
              </Link>
            </div>
          </div>

          <Link
            className="pp-showroom-home"
            to="/planet/performance-powerboats"
          >
            ← BACK TO PERFORMANCE POWERBOATS
          </Link>
        </div>
      </section>
    </main>
  );
}


