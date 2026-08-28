import { Link } from "react-router-dom";
import "./PerformancePowerboatsFabricationMetalworkPage.css";

const weldDetailImages = [
  "/images/performance-powerboats/100_0298.JPG",
  "/images/performance-powerboats/100_0299.JPG",
  "/images/performance-powerboats/100_0301.JPG",
];

const fabricationImages = [
  "/images/performance-powerboats/100_0302.JPG",
  "/images/performance-powerboats/100_0303.JPG",
  "/images/performance-powerboats/100_0304.JPG",
];

const topWorkImages = [
  "/images/performance-powerboats/100_0320.JPG",
  "/images/performance-powerboats/100_0321.JPG",
  "/images/performance-powerboats/100_0322.JPG",
  "/images/performance-powerboats/100_0339.JPG",
];

export default function PerformancePowerboatsFabricationMetalworkPage() {
  return (
    <main className="pp-fab-page">
      <section className="pp-fab-hero">
        <div className="pp-fab-shell">
          <Link className="pp-fab-back" to="/planet/performance-powerboats">
            ← PERFORMANCE POWERBOATS
          </Link>

          <div className="pp-fab-kicker">FABRICATION & METALWORK</div>

          <h1>
            STRENGTH,
            <br />
            STRUCTURE
            <br />
            AND FINISH.
          </h1>

          <p className="pp-fab-lead">
            Before the final rigging and launch, the build takes shape through
            fabrication, welded structure, tops, frames and in-house detail work.
          </p>
        </div>
      </section>

      <section className="pp-fab-feature">
        <div className="pp-fab-shell">
          <div className="pp-fab-feature-image-wrap">
            <img
              src="/images/performance-powerboats/100_0302.JPG"
              alt="Performance Powerboats metal fabrication inside the shop"
              className="pp-fab-feature-image"
            />
          </div>

          <div className="pp-fab-copy">
            <span>BUILT IN HOUSE</span>
            <h2>
              FABRICATION THAT
              <br />
              FITS THE BOAT.
            </h2>
            <p>
              Stainless fabrication and structural work are part of the real
              build process inside the Performance Powerboats shop, not an
              afterthought added later.
            </p>
          </div>
        </div>
      </section>

      <section className="pp-fab-dark">
        <div className="pp-fab-shell">
          <div className="pp-fab-copy pp-fab-copy--dark">
            <span>PRECISION DETAILS</span>
            <h2>
              THE METALWORK
              <br />
              BEHIND THE BUILD.
            </h2>
            <p>
              Close-up fabrication details show the tubing, joints and welded
              structure that help bring each build together.
            </p>
          </div>

          <div className="pp-fab-weld-grid">
            {weldDetailImages.map((src) => (
              <img key={src} src={src} alt="Performance Powerboats welded tubing detail" />
            ))}
          </div>

          <div className="pp-fab-three-grid">
            {fabricationImages.map((src) => (
              <img key={src} src={src} alt="Performance Powerboats fabrication work in shop" />
            ))}
          </div>
        </div>
      </section>

      <section className="pp-fab-light">
        <div className="pp-fab-shell">
          <div className="pp-fab-copy">
            <span>TOPS, FRAMES & FINISH WORK</span>
            <h2>
              FROM RAW STRUCTURE
              <br />
              TO FINISHED FORM.
            </h2>
            <p>
              Canopies, tops and framework turn fabrication into something
              functional, clean and ready to become part of the finished boat.
            </p>
          </div>

          <div className="pp-fab-four-grid">
            {topWorkImages.map((src) => (
              <img key={src} src={src} alt="Performance Powerboats top and frame fabrication" />
            ))}
          </div>
        </div>
      </section>

      <section className="pp-fab-cta-wrap">
        <div className="pp-fab-shell">
          <div className="pp-fab-cta">
            <div>
              <span>FROM FABRICATION TO WATER</span>
              <h2>
                THE DETAILS MATTER
                <br />
                JUST AS MUCH AS THE HULL.
              </h2>
              <p>
                Explore the boats, builds and custom work that come out of the
                Performance Powerboats operation.
              </p>
            </div>

            <div className="pp-fab-cta-actions">
              <Link className="pp-fab-button pp-fab-button--gold" to="/planet/performance-powerboats">
                EXPLORE BOATS
              </Link>
              <Link className="pp-fab-button pp-fab-button--ghost" to="/planet/performance-powerboats/fabrication/request">
                START A PROJECT
              </Link>
            </div>
          </div>

          <Link className="pp-fab-footer-back" to="/planet/performance-powerboats">
            ← BACK TO PERFORMANCE POWERBOATS
          </Link>
        </div>
      </section>
    </main>
  );
}





