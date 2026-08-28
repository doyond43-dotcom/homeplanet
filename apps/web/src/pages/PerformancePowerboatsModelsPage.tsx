import { Link } from "react-router-dom";
import "./PerformancePowerboatsModelsPage.css";

const models = [
  {
    name: "PERFORMANCE 43",
    description:
      "The larger Performance platform built for serious capability, customization and time on the water.",
    available: true,
    image: "/images/performance-powerboats/07-performance-43-docked.jpg",
    imageAlt: "Performance 43 finished and docked on the water",
  },
  {
    name: "PERFORMANCE 34",
    description:
      "A new Performance model joining the lineup. More details are coming.",
    available: false,
    image: null,
  },
  {
    name: "PERFORMANCE 19",
    description:
      "A smaller Performance platform built around the same hands-on approach to setup and use.",
    available: true,
    image: "/images/performance-powerboats/100_0278.JPG",
    imageAlt: "Finished Performance Powerboats shallow-water build",
  },
  {
    name: "FLATS BOAT",
    description:
      "A shallow-water Performance platform. Official model details and photography are coming.",
    available: true,
    image: "/images/performance-powerboats/100_0282.JPG",
    imageAlt: "Finished Performance Powerboats shallow-water boat",
  },
];

export default function PerformancePowerboatsModelsPage() {
  return (
    <main className="pp-models-page">
      <div className="pp-models-shell">
        <Link className="pp-models-back" to="/planet/performance-powerboats">
          ← PERFORMANCE POWERBOATS
        </Link>

        <header className="pp-models-header">
          <div className="pp-models-kicker">PERFORMANCE MODELS</div>

          <h1>
            BUILT TO BECOME
            <br />
            YOUR PERFORMANCE.
          </h1>

          <p>
            Start with a proven Performance platform, then build around how
            you actually plan to use the boat.
          </p>
        </header>

        <section className="pp-models-grid">
          {models.map((model) => (
            <article className="pp-model-card" key={model.name}>
              {model.image ? (
                <div className="pp-model-image">
                  <img src={model.image} alt={model.imageAlt} />
                </div>
              ) : (
                <div className="pp-model-image-placeholder">
                  <span>
                    {model.name === "PERFORMANCE 34"
                      ? "NEW MODEL • DETAILS COMING"
                      : "MODEL PHOTOGRAPHY COMING SOON"}
                  </span>
                </div>
              )}

              <div className="pp-model-card-copy">
                <div className="pp-model-label">PERFORMANCE POWERBOATS</div>
                <h2>{model.name}</h2>
                <p>{model.description}</p>

                {model.available ? (
                  <Link
                    className="pp-model-action"
                    to="/planet/performance-powerboats/build"
                  >
                    START A BUILD →
                  </Link>
                ) : (
                  <span className="pp-model-coming">COMING LATER</span>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

