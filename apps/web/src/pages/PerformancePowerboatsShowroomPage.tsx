import "./PerformancePowerboatsShowroomPage.css";

const showroomImages = [

  {
    src: "/images/performance-powerboats/showroom-performance-wide-running.jpeg",
    alt: "Performance Powerboats finished boat running on the water",
    layout: "wide",
  },
  {
    src: "/images/performance-powerboats/07-performance-43-docked.jpg",
    alt: "Performance 43 finished and docked",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/08-performance-43-on-water.jpg",
    alt: "Performance 43 on the water",
    layout: "standard",
  },

  {
    src: "/images/performance-powerboats/performance-finished-boat-side-dock.webp",
    alt: "Finished Performance Powerboats boat dockside",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/performance-finished-boat-dock-sunset.webp",
    alt: "Finished Performance Powerboats boat at sunset",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/finished-white-boat-dock-front-angle.jpg",
    alt: "Finished white Performance boat at the dock",
    layout: "wide",
  },
  {
    src: "/images/performance-powerboats/showroom-finished-running-boat-screenshot.jpeg",
    alt: "Finished boat running on the water",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/01-hero-running-boat.jpg",
    alt: "Performance Powerboats boat running offshore",
    layout: "wide",
  },
  {
    src: "/images/performance-powerboats/performance-43-on-water.webp",
    alt: "Performance boat on the water",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/performance-finished-boat.webp",
    alt: "Finished Performance Powerboats build",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/showroom-performance-43-docked-vertical.jpeg",
    alt: "Finished Performance 43 dockside",
    layout: "tall",
  },
  {
    src: "/images/performance-powerboats/showroom-performance-43-docked-blackbars.jpeg",
    alt: "Performance 43 with triple outboards",
    layout: "tall",
  },
  {
    src: "/images/performance-powerboats/11-finished-powerboat-on-trailer.jpg",
    alt: "Finished Performance Powerboats boat on trailer",
    layout: "wide",
  },
  {
    src: "/images/performance-powerboats/boat_shed_maintenance_with_twin_yamaha_150s.png",
    alt: "Finished boat with twin Yamaha outboards",
    layout: "standard",
  },
  {
    src: "/images/performance-powerboats/sunny_seacraft_marina_escape.png",
    alt: "Finished center console boat at the marina",
    layout: "standard",
  },

  {
    src: "/images/performance-powerboats/mntdataluxury_yacht_cruising_a_palm_lined_marina.png",
    alt: "Finished boat cruising through the marina",
    layout: "wide",
  },

  {
    src: "/images/performance-powerboats/showroom-finished-deck.jpeg",
    alt: "Finished custom deck, seating and helm layout",
    layout: "tall",
  },
  {
    src: "/images/performance-powerboats/finished-boat-deck-interior-garmin.jpg",
    alt: "Finished custom boat deck and Garmin electronics",
    layout: "tall",
  },

  {
    src: "/images/performance-powerboats/finished-boat-helm-simrad-controls.jpg",
    alt: "Finished Performance Powerboats helm and controls",
    layout: "standard",
  },
];

export default function PerformancePowerboatsShowroomPage() {
  return (
    <main className="pps-page">
      <section className="pps-hero">
        <div className="pps-hero-image">
          <img
            src="/images/performance-powerboats/showroom-finished-black-tower-waterfront.jpeg"
            alt="Finished Performance Powerboats custom boat on the water"
          />
          <div className="pps-hero-shade" />
        </div>

        <div className="pps-shell pps-hero-content">
          <a
            className="pps-back"
            href="/planet/performance-powerboats"
          >
            ← PERFORMANCE POWERBOATS
          </a>

          <span className="pps-kicker">SHOWROOM</span>

          <h1>
            FINISHED BOATS.
            <br />
            REAL PERFORMANCE.
          </h1>

          <p>
            Completed boats, custom details and finished Performance work
            where it belongs: on the water.
          </p>

          <div className="pps-actions">
            <a
              className="pps-button pps-button-gold"
              href="/planet/performance-powerboats/start-project"
            >
              START A PROJECT
            </a>

            <a
              className="pps-button pps-button-ghost"
              href="/planet/performance-powerboats/models"
            >
              VIEW MODELS
            </a>
          </div>
        </div>
      </section>

      <section className="pps-intro">
        <div className="pps-shell">
          <span className="pps-kicker">THE FINISHED PRODUCT</span>

          <h2>
            BUILT TO BE SEEN.
            <br />
            BUILT TO BE USED.
          </h2>

          <p>
            This is the finished side of Performance Powerboats: completed
            boats, custom layouts, rigging, towers, electronics and the final
            result of the work that happens inside the shop.
          </p>
        </div>
      </section>

      <section className="pps-gallery-section">
        <div className="pps-shell">
          <div className="pps-gallery">
            {showroomImages.map((image, index) => (
              <figure
                className={`pps-card pps-card-${image.layout}`}
                key={`${image.src}-${index}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index < 4 ? "eager" : "lazy"}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="pps-close">
        <div className="pps-shell">
          <div className="pps-close-card">
            <div>
              <span className="pps-kicker">YOUR BOAT STARTS HERE</span>

              <h2>
                SEE SOMETHING
                <br />
                THAT STARTS AN IDEA?
              </h2>

              <p>
                Start with the boat, the work or the idea. Performance can take
                it from there.
              </p>
            </div>

            <div className="pps-close-actions">
              <a
                className="pps-button pps-button-gold"
                href="/planet/performance-powerboats/start-project"
              >
                START A PROJECT
              </a>

              <a
                className="pps-button pps-button-dark"
                href="/planet/performance-powerboats/contact"
              >
                CONTACT PERFORMANCE
              </a>
            </div>
          </div>

          <a
            className="pps-footer-back"
            href="/planet/performance-powerboats"
          >
            ← BACK TO PERFORMANCE POWERBOATS
          </a>
        </div>
      </section>
    </main>
  );
}



