import { Link } from "react-router-dom";
import "./PerformancePowerboatsModelsPage.css";

const models = [
  {
    name: "PERFORMANCE 43",
    description:
      "The flagship Performance platform, built for serious offshore capability and custom configuration. Set it up for private performance use, fishing, island running, or a purpose-built multi-passenger tour operation.",
    available: true,
    image: "/images/performance-powerboats/performance-43-blue-water.jpeg",
    imageAlt: "Performance 43 finished and docked on the water",
  },
  {
    name: "PERFORMANCE 34",
    description:
      "A versatile Performance platform shown here in concept-rendering form. Built around the same custom approach as the larger models, with layout, power and final configuration tailored around how the boat will actually be used.",
    available: true,
    image: "/images/performance-powerboats/minimalist_performance_boat_rendering.png",
    imageAlt: "Minimal performance powerboat pencil sketch rendering",
  },
  {
    name: "PERFORMANCE 19",
    description:
      "A smaller, more nimble Performance platform built for shallow water, coastal running and everyday use. Compact, simple and customizable without giving up the hands-on Performance build approach.",
    available: true,
    image: "/images/performance-powerboats/tropical_skiff_in_crystal_waters.png",
    imageAlt: "Finished white Performance 19 skiff in tropical coastal water",
  },

];

export default function PerformancePowerboatsModelsPage() {
  return (
    <main className="pp-models-page">
      <div className="pp-models-shell">
        <Link className="pp-models-back" to="/planet/performance-powerboats">
          BACK TO PERFORMANCE POWERBOATS
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
                      ? "CONCEPT RENDERING - DETAILS COMING"
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
                    START A BUILD
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



