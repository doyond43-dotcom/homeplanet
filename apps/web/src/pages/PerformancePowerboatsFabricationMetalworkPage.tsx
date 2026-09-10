import { Link } from "react-router-dom";
import "./PerformancePowerboatsFabricationMetalworkPage.css";

const weldDetailImages = [
  "/images/performance-powerboats/100_0298.JPG",
  "/images/performance-powerboats/100_0299.JPG",
  "/images/performance-powerboats/100_0301.JPG",
];

const topWorkImages = [
  {
    src: "/images/performance-powerboats/performance-fabrication-frame-before.webp",
    alt: "Raw custom aluminum fabrication frame",
    label: "RAW FABRICATION",
  },
  {
    src: "/images/performance-powerboats/performance-fabrication-installed-shop.webp",
    alt: "Finished white fabricated top installed on the boat",
    label: "INSTALLED TOP & FINISH",
  },
  {
    src: "/images/performance-powerboats/performance-finished-boat-side-dock.webp",
    alt: "Finished Performance Powerboats boat on the water",
    label: "ON THE WATER",
  },
  {
    src: "/images/performance-powerboats/performance-finished-boat-ramp.webp",
    alt: "Finished boat ready to head back onto the water",
    label: "READY FOR MORE",
  },
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
              src="/images/performance-powerboats/performance-finished-boat-side-dock.webp"
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
            <img
              src="/images/performance-powerboats/100_0297.JPG"
              alt="Full custom polished tower fabrication inside the Performance Powerboats shop"
            />
            <img
              src="/images/performance-powerboats/100_0302.JPG"
              alt="Custom fabricated tower and rod-holder structure"
            />
            <img
              src="/images/performance-powerboats/100_0320.JPG"
              alt="Finished white T-top and rod holder structure installed on a Performance Powerboats build"
            />
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
            {topWorkImages.map((image) => (
              <figure className="pp-fab-finish-card" key={image.src}>
                <img
                  src={image.src}
                  alt={image.alt}
                />
                <figcaption>{image.label}</figcaption>
              </figure>
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























