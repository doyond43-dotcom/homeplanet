import { Link } from "react-router-dom";
import "./PerformancePowerboatsGalleryPage.css";

const galleryImages = [
  {
    src: "/images/performance-powerboats/01-hero-running-boat.jpg",
    alt: "Performance Powerboats boat running on the water",
    className: "ppg-wide",
    position: "center 78%",
  },
  {
    src: "/images/performance-powerboats/07-performance-43-docked.jpg",
    alt: "Performance 43 docked on the water",
    position: "center 58%",
  },
  {
    src: "/images/performance-powerboats/08-performance-43-on-water.jpg",
    alt: "Performance 43 on the water",
    position: "center 58%",
  },
  {
    src: "/images/performance-powerboats/finished-white-boat-dock-front-angle.jpg",
    alt: "Finished white Performance boat docked on the water",
    className: "ppg-wide",
    position: "center 56%",
  },
  {
    src: "/images/performance-powerboats/performance-finished-boat.webp",
    alt: "Finished Performance Powerboats boat",
    position: "center 58%",
  },
  {
    src: "/images/performance-powerboats/sunny_seacraft_marina_escape.png",
    alt: "Finished boat at the marina",
    position: "center 58%",
  },
  {
    src: "/images/performance-powerboats/finished-boat-deck-interior-garmin.jpg",
    alt: "Finished boat deck and interior with Garmin electronics",
    position: "center 55%",
  },
  {
    src: "/images/performance-powerboats/finished-boat-helm-simrad-controls.jpg",
    alt: "Finished helm with Simrad display and controls",
    position: "center 50%",
  },
  {
    src: "/images/performance-powerboats/boat_shed_maintenance_with_twin_yamaha_150s.png",
    alt: "Finished boat with twin Yamaha 150 outboards",
    className: "ppg-wide",
    position: "center 58%",
  },
];

export default function PerformancePowerboatsGalleryPage() {
  return (
    <main className="ppg-page">
      <section className="ppg-hero">
        <div className="ppg-shell">
          <Link
            className="ppg-back"
            to="/planet/performance-powerboats"
          >
            ← PERFORMANCE POWERBOATS
          </Link>

          <div className="ppg-kicker">THE GALLERY</div>

          <h1>
            THE WORK.
            <br />
            THE BOATS.
            <br />
            THE WATER.
          </h1>

          <p>
            Finished boats, on-water Performance, custom details and the final
            result of the work behind every build.
          </p>
        </div>
      </section>

      <section className="ppg-gallery-section">
        <div className="ppg-shell">
          <div className="ppg-grid">
            {galleryImages.map((image) => (
              <figure
                key={image.src}
                className={`ppg-image ${image.className ?? ""}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  style={{ objectPosition: image.position ?? "center" }}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="ppg-cta">
        <div className="ppg-shell ppg-cta-inner">
          <div>
            <div className="ppg-kicker">PERFORMANCE POWERBOATS</div>

            <h2>
              SEE SOMETHING
              <br />
              THAT STARTS AN IDEA?
            </h2>
          </div>

          <div className="ppg-actions">
            <Link
              className="ppg-primary"
              to="/planet/performance-powerboats/start-project"
            >
              START A PROJECT →
            </Link>

            <Link
              className="ppg-secondary"
              to="/planet/performance-powerboats/showroom"
            >
              VIEW SHOWROOM
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}



