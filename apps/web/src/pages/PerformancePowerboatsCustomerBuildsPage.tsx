import { Link } from "react-router-dom";
import "./PerformancePowerboatsCustomerBuildsPage.css";

export default function PerformancePowerboatsCustomerBuildsPage() {
  return (
    <main className="pp-doorway-page">
      <div className="pp-doorway-shell">
        <Link className="pp-doorway-back" to="/planet/performance-powerboats">
          ← PERFORMANCE POWERBOATS
        </Link>

        <div className="pp-doorway-kicker">CUSTOMER BUILDS</div>

        <h1>
          REAL BOATS.
          <br />
          REAL WORK.
        </h1>

        <p className="pp-doorway-lead">
          A closer look at customer boats built, restored, rigged and customized
          by Performance Powerboats.
        </p>

        <div className="pp-doorway-coming">
          <span>CUSTOMER BUILDS COMING SOON</span>
          <p>
            Build photos, project stories and completed boats are being added.
          </p>
        </div>

        <Link className="pp-doorway-button" to="/planet/performance-powerboats">
          BACK TO PERFORMANCE →
        </Link>
      </div>
    </main>
  );
}
