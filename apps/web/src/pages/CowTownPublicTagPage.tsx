import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CowTownTags.css";

type RecoveryMode = "actions" | "report" | "success";

export default function CowTownPublicTagPage() {
  const { tagId = "CT-0847" } = useParams();
  const [mode, setMode] = useState<RecoveryMode>("actions");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("Standing near the roadway");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");

  function submitReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMode("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="cowtown-page">
      <header className="cowtown-header">
        <div className="cowtown-shell cowtown-header-inner">
          <Link className="cowtown-brand" to="/planet/cow-town-tags">
            <span className="cowtown-brand-mark">CT</span>

            <span className="cowtown-brand-copy">
              <strong>Cow Town Tags</strong>
              <span>Public Livestock Recovery</span>
            </span>
          </Link>

          <Link
            className="cowtown-header-action"
            to="/planet/cow-town-tags"
          >
            <ArrowLeft size={15} />
            Cow Town Home
          </Link>
        </div>
      </header>

      <main className="cowtown-recovery-main">
        <div className="cowtown-shell">
          <div className="cowtown-alert">
            <ShieldAlert size={20} />

            <div>
              <strong>Approach livestock carefully.</strong>{" "}
              Do not enter private property, chase the animal or place yourself
              between livestock and an open escape route.
            </div>
          </div>

          <div className="cowtown-recovery-grid">
            <aside className="cowtown-card cowtown-animal-card">
              <div className="cowtown-animal-photo">
                <img
                  src="/images/cow-town-tags-animal.jpg"
                  alt="Brown-and-white demo cow wearing yellow Cow Town ear tag 0847"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: "inherit",
                  }}
                />
              </div>

              <div className="cowtown-animal-meta">
                <span className="cowtown-status">
                  <CheckCircle2 size={15} />
                  Active Cow Town Tag
                </span>

                <h2 className="cowtown-animal-name">Cattle No. 0847</h2>

                <div className="cowtown-animal-description">
                  Brown-and-white cow wearing yellow ear tag 0847.
                </div>

                <div className="cowtown-detail-grid">
                  <div className="cowtown-detail">
                    <span>Cow Town ID</span>
                    <strong>{tagId.toUpperCase()}</strong>
                  </div>

                  <div className="cowtown-detail">
                    <span>Animal No.</span>
                    <strong>0847</strong>
                  </div>

                  <div className="cowtown-detail">
                    <span>Species</span>
                    <strong>Cattle</strong>
                  </div>

                  <div className="cowtown-detail">
                    <span>Sex</span>
                    <strong>Cow</strong>
                  </div>
                </div>
              </div>
            </aside>

            <section className="cowtown-recovery-panel">
              {mode === "actions" && (
                <>
                  <div className="cowtown-kicker">
                    Tag confirmed: {tagId.toUpperCase()}
                  </div>

                  <h1>Have you found this animal?</h1>

                  <p>
                    Your report can help the ranch find and recover this animal
                    quickly. You do not need an account or an app.
                  </p>

                  <div className="cowtown-action-stack">
                    <button
                      className="cowtown-action-button cowtown-action-button-primary"
                      type="button"
                      onClick={() => setMode("report")}
                    >
                      <span>
                        <MapPin size={20} />
                        Report Current Location
                      </span>

                      <ChevronRight size={20} />
                    </button>

                    <button
                      className="cowtown-action-button"
                      type="button"
                      onClick={() => setMode("report")}
                    >
                      <span>
                        <Camera size={20} />
                        I Saw This Animal Earlier
                      </span>

                      <ChevronRight size={20} />
                    </button>

                    <a
                      className="cowtown-action-button"
                      href="tel:+18635550147"
                    >
                      <span>
                        <Phone size={20} />
                        Call the Ranch
                      </span>

                      <ChevronRight size={20} />
                    </a>

                    <a
                      className="cowtown-action-button"
                      href="sms:+18635550147?body=I%20found%20livestock%20wearing%20Cow%20Town%20Tag%20CT-0847."
                    >
                      <span>
                        <MessageCircle size={20} />
                        Text the Ranch
                      </span>

                      <ChevronRight size={20} />
                    </a>
                  </div>

                  <div className="cowtown-safety-box">
                    <strong>Keep a safe distance.</strong>

                    <p>
                      Share the location and direction of travel. Do not attempt
                      to load, rope, corner or transport livestock unless the
                      owner or an appropriate professional directs you.
                    </p>
                  </div>
                </>
              )}

              {mode === "report" && (
                <>
                  <button
                    className="cowtown-button cowtown-button-secondary"
                    type="button"
                    onClick={() => setMode("actions")}
                  >
                    <ArrowLeft size={17} />
                    Back
                  </button>

                  <div style={{ marginTop: 24 }}>
                    <div className="cowtown-kicker">
                      Public found-livestock report
                    </div>

                    <h1>Where did you see the animal?</h1>

                    <p>
                      Give the ranch enough information to act without putting
                      yourself in danger.
                    </p>
                  </div>

                  <form className="cowtown-form" onSubmit={submitReport}>
                    <div className="cowtown-form-field">
                      <label htmlFor="cowtown-location">
                        Location or nearby landmark
                      </label>

                      <input
                        id="cowtown-location"
                        className="cowtown-input"
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Road, intersection, gate or landmark"
                        required
                      />
                    </div>

                    <div className="cowtown-form-field">
                      <label htmlFor="cowtown-condition">
                        What is happening?
                      </label>

                      <select
                        id="cowtown-condition"
                        className="cowtown-select"
                        value={condition}
                        onChange={(event) => setCondition(event.target.value)}
                      >
                        <option>Standing near the roadway</option>
                        <option>Walking along the roadway</option>
                        <option>Inside another pasture or property</option>
                        <option>Mixed with other livestock</option>
                        <option>Contained in a safe area</option>
                        <option>Appears injured or in danger</option>
                        <option>I only saw the animal briefly</option>
                      </select>
                    </div>

                    <div className="cowtown-form-field">
                      <label htmlFor="cowtown-notes">
                        Direction of travel or helpful details
                      </label>

                      <textarea
                        id="cowtown-notes"
                        className="cowtown-textarea"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Which direction was it moving? Is it near traffic, fencing, water or other animals?"
                      />
                    </div>

                    <div className="cowtown-form-field">
                      <label htmlFor="cowtown-phone">
                        Your phone number, optional
                      </label>

                      <input
                        id="cowtown-phone"
                        className="cowtown-input"
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="Only used if the ranch needs clarification"
                      />
                    </div>

                    <button
                      className="cowtown-button cowtown-button-primary"
                      type="submit"
                    >
                      Send Report to Ranch
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </>
              )}

              {mode === "success" && (
                <div className="cowtown-success">
                  <CheckCircle2 size={36} />

                  <h2>Report received.</h2>

                  <p>
                    Your sighting for {tagId.toUpperCase()} has been added to the
                    active recovery timeline. The ranch can now review the
                    location and begin the correct next action.
                  </p>

                  <p>
                    You do not need to remain near the animal unless it is safe
                    and you choose to do so.
                  </p>

                  <button
                    className="cowtown-button cowtown-button-secondary"
                    type="button"
                    onClick={() => setMode("actions")}
                  >
                    Return to Animal Page
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="cowtown-footer">
        <div className="cowtown-shell cowtown-footer-inner">
          <span>Cow Town Tags</span>
          <span>Public access requires no app or account.</span>
        </div>
      </footer>
    </div>
  );
}

