import { Link } from "react-router-dom";
import "./PerformancePowerboatsMoldsToolingPage.css";

export default function PerformancePowerboatsMoldsToolingPage() {
  return (
    <main className="pp-molds-page">
      <div className="pp-molds-shell">
        <Link
          className="pp-molds-back"
          to="/planet/performance-powerboats"
        >
          ← PERFORMANCE POWERBOATS
        </Link>

        <div className="pp-molds-kicker">MOLDS & TOOLING</div>

        <h1>
          THE FOUNDATION
          <br />
          BEHIND THE BUILD.
        </h1>

        <p className="pp-molds-lead">
          A closer look at the molds, tooling, components and production process
          behind Performance Powerboats.
        </p>

        <div className="pp-molds-coming">
          <span>COMING SOON</span>
          <p>
            We’re documenting the molds, tooling and build process now.
            More photos and details are on the way.
          </p>
        </div>

        <Link
          className="pp-molds-home"
          to="/planet/performance-powerboats"
        >
          BACK TO PERFORMANCE →
        </Link>
      </div>
    </main>
  );
}
