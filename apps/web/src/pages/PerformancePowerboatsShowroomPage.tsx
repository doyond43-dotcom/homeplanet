import { Link } from "react-router-dom";
import "./PerformancePowerboatsShowroomPage.css";

export default function PerformancePowerboatsShowroomPage() {
  return (
    <main className="pp-doorway-page">
      <div className="pp-doorway-shell">
        <Link className="pp-doorway-back" to="/planet/performance-powerboats">
          ← PERFORMANCE POWERBOATS
        </Link>

        <div className="pp-doorway-kicker">SHOWROOM</div>

        <h1>
          SEE WHAT
          <br />
          PERFORMANCE BUILDS.
        </h1>

        <p className="pp-doorway-lead">
          Finished Performance boats, models, details and options are being
          gathered here.
        </p>

        <div className="pp-doorway-coming">
          <span>SHOWROOM COMING SOON</span>
          <p>
            More finished boats, model photography and build details are on the way.
          </p>
        </div>

        <Link className="pp-doorway-button" to="/planet/performance-powerboats/build">
          EXPLORE PERFORMANCE MODELS →
        </Link>
      </div>
    </main>
  );
}
