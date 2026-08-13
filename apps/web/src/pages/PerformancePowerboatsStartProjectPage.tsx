import { Link } from "react-router-dom";
import "./PerformancePowerboatsStartProjectPage.css";

export default function PerformancePowerboatsStartProjectPage() {
  return (
    <main className="pp-start-page">
      <div className="pp-start-shell">
        <Link className="pp-start-back" to="/planet/performance-powerboats">
          ← PERFORMANCE POWERBOATS
        </Link>

        <header className="pp-start-header">
          <div className="pp-start-kicker">START A PROJECT</div>

          <h1>
            WHAT ARE
            <br />
            WE WORKING ON?
          </h1>

          <p>
            Choose the direction that fits your project. We’ll take you to the
            right place without making you dig through the site.
          </p>
        </header>

        <section className="pp-start-grid">
          <Link
            className="pp-start-card"
            to="/planet/performance-powerboats/models"
          >
            <span>01</span>
            <div>
              <div className="pp-start-label">BUILD</div>
              <h2>BUILD A PERFORMANCE.</h2>
              <p>
                Start with a Performance model and build around how you plan
                to use the boat.
              </p>
              <strong>VIEW PERFORMANCE MODELS →</strong>
            </div>
          </Link>

          <a
            className="pp-start-card"
            href="/planet/performance-powerboats/service"
          >
            <span>02</span>
            <div>
              <div className="pp-start-label">SERVICE</div>
              <h2>SERVICE. REPAIR. REPOWER.</h2>
              <p>
                Tell Performance what boat you have, what it needs and where
                you want to start.
              </p>
              <strong>START A SERVICE REQUEST →</strong>
            </div>
          </a>

          <a
            className="pp-start-card"
            href="/planet/performance-powerboats/fabrication"
          >
            <span>03</span>
            <div>
              <div className="pp-start-label">CUSTOM</div>
              <h2>CUSTOM FABRICATION.</h2>
              <p>
                T-tops, metalwork, custom components, modifications and
                specialty marine fabrication.
              </p>
              <strong>START A FABRICATION PROJECT →</strong>
            </div>
          </a>
        </section>

        <div className="pp-start-contact">
          <span>NOT SURE WHICH ONE?</span>
          <Link to="/planet/performance-powerboats/contact">
            CONTACT PERFORMANCE →
          </Link>
        </div>
      </div>
    </main>
  );
}



