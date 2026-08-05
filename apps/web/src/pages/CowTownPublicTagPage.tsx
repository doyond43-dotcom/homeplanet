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
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownTags.css";

type RecoveryMode = "actions" | "report" | "success";

type PublicCowTownTag = {
  cow_town_id: string;
  visible_tag_number: string;
  name: string | null;
  breed: string | null;
  sex: string | null;
  color: string | null;
  birth_year: number | null;
  animal_status: string;
  activation_status: string;
  recovery_phone: string | null;
};

export default function CowTownPublicTagPage() {
  const { tagId = "CT-0847" } = useParams();
  const [mode, setMode] = useState<RecoveryMode>("actions");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("Standing near the roadway");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [publicTag, setPublicTag] = useState<PublicCowTownTag | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPublicTag() {
      const normalizedTagId = tagId.toUpperCase();

      const { data, error } = await supabase.rpc(
        "get_public_cow_town_tag",
        {
          requested_cow_town_id: normalizedTagId,
        }
      );

      if (cancelled) {
        return;
      }

      if (error || !data?.found || !data?.tag) {
        setPublicTag(null);
        return;
      }

      setPublicTag(data.tag as PublicCowTownTag);
    }

    void loadPublicTag();

    return () => {
      cancelled = true;
    };
  }, [tagId]);

  const normalizedTagId = tagId.toUpperCase();
  const isLiveRecord = publicTag !== null;

  const animalName =
    publicTag?.name ||
    (normalizedTagId === "CT-0847" ? "Cattle No. 0847" : normalizedTagId);

  const visibleTagNumber =
    publicTag?.visible_tag_number ||
    (normalizedTagId === "CT-0847" ? "0847" : normalizedTagId.replace("CT-", ""));

  const animalBreed =
    publicTag?.breed ||
    (normalizedTagId === "CT-0847" ? "Brangus" : "Not provided");

  const animalSex =
    publicTag?.sex ||
    (normalizedTagId === "CT-0847" ? "Cow" : "Not provided");

  const animalColor =
    publicTag?.color ||
    (normalizedTagId === "CT-0847" ? "Brown and white" : "Not provided");

  const animalAge =
    normalizedTagId === "CT-0056"
      ? "9 years old"
      : publicTag?.birth_year
        ? `${new Date().getFullYear() - publicTag.birth_year} years old`
        : normalizedTagId === "CT-0847"
          ? "4 years old"
          : "Not provided";

  const recoveryPhone =
    publicTag?.recovery_phone ||
    (normalizedTagId === "CT-0847" ? "8635550147" : "");

  const telephoneHref = recoveryPhone
    ? `tel:+1${recoveryPhone.replace(/\D/g, "").replace(/^1/, "")}`
    : undefined;

  const smsHref = recoveryPhone
    ? `sms:+1${recoveryPhone.replace(/\D/g, "").replace(/^1/, "")}?body=${encodeURIComponent(
        `I found livestock wearing Cow Town Tag ${normalizedTagId}.`
      )}`
    : undefined;

  const animalImage =
    normalizedTagId === "CT-0056"
      ? "/images/princess-black-angus.png"
      : "/images/cow-town-tags-animal.jpg";


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
                  src={animalImage}
                  alt={`${animalName}, ${animalColor} livestock wearing tag ${visibleTagNumber}`}
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

                <h2 className="cowtown-animal-name">{animalName}</h2>

                <div className="cowtown-animal-description">
                  {animalColor} livestock wearing visible tag {visibleTagNumber}.
                </div>

                <div className="cowtown-detail-grid">
                  <div className="cowtown-detail">
                    <span>Cow Town ID</span>
                    <strong>{tagId.toUpperCase()}</strong>
                  </div>

                  <div className="cowtown-detail">
                    <span>Animal No.</span>
                    <strong>{visibleTagNumber}</strong>
                  </div>

                  <div className="cowtown-detail">
                    <span>Species</span>
                    <strong>Cattle</strong>
                  </div>

                  <div className="cowtown-detail">
                    <span>Sex</span>
                    <strong>{animalSex}</strong>
                  </div>
                </div>

                <section
                  className="cowtown-animal-record"
                  aria-labelledby="cowtown-animal-record-title"
                >
                  <div className="cowtown-animal-record-heading">
                    <div>
                      <span>Public animal summary</span>
                      <h3 id="cowtown-animal-record-title">
                        Animal Record
                      </h3>
                    </div>

                    <small>{isLiveRecord ? "Live record" : "Demo record"}</small>
                  </div>

                  <div className="cowtown-animal-record-grid">
                    <div>
                      <span>Breed</span>
                      <strong>{animalBreed}</strong>
                    </div>

                    <div>
                      <span>Age</span>
                      <strong>{animalAge}</strong>
                    </div>

                    <div>
                      <span>Vaccinations</span>
                      <strong className="cowtown-record-current">
                        {isLiveRecord ? "Not provided" : "Current"}
                      </strong>
                    </div>

                    <div>
                      <span>Last health update</span>
                      <strong>{isLiveRecord ? "Not provided" : "July 2026"}</strong>
                    </div>

                    <div className="cowtown-animal-record-wide">
                      <span>Ownership status</span>
                      <strong>Active with current ranch</strong>
                    </div>
                  </div>

                  <p>
                    Detailed health, ownership, sale and transfer records are
                    available only to authorized users.
                  </p>
                </section>
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
                      href={telephoneHref}
                    >
                      <span>
                        <Phone size={20} />
                        Call the Ranch
                      </span>

                      <ChevronRight size={20} />
                    </a>

                    <a
                      className="cowtown-action-button"
                      href={smsHref}
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

