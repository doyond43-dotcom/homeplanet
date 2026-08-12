import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsBuildPage.css";

type ModelChoice =
  | "Performance 43"
  | "Performance 19"
  | "Flats Boat"
  | "Performance 34"
  | "Not Sure Yet"
  | null;

type UseChoice =
  | "Recreational"
  | "Tour / Commercial"
  | "Fishing / Offshore"
  | "Other"
  | null;

const models = [
  {
    name: "Performance 43" as const,
    eyebrow: "PERFORMANCE 43",
    title: "43",
    copy: "Start with the larger Performance platform.",
  },
  {
    name: "Performance 19" as const,
    eyebrow: "PERFORMANCE 19",
    title: "19",
    copy: "Start with the proven smaller Performance platform.",
  },
  {
    name: "Flats Boat" as const,
    eyebrow: "PRODUCTION PLATFORM",
    title: "FLATS",
    copy: "A lighter, economical production direction.",
  },
  {
    name: "Performance 34" as const,
    eyebrow: "COMING LATER",
    title: "34",
    copy: "The Performance 34 is coming.",
    comingSoon: true,
  },
  {
    name: "Not Sure Yet" as const,
    eyebrow: "NEED SOME DIRECTION?",
    title: "NOT SURE",
    copy: "Tell Performance how you want to use the boat and start there.",
  },
];

const uses: UseChoice[] = [
  "Recreational",
  "Tour / Commercial",
  "Fishing / Offshore",
  "Other",
];

const setupGroups = [
  {
    key: "power",
    label: "POWER",
    options: ["Discuss With Performance", "Single", "Twin", "Triple", "Other"],
  },
  {
    key: "top",
    label: "TOP / METALWORK",
    options: ["No Selection Yet", "T-Top", "Tour / Commercial Top", "Custom"],
  },
  {
    key: "electronics",
    label: "ELECTRONICS",
    options: ["Keep It Simple", "Full Electronics", "Custom Setup"],
  },
  {
    key: "finish",
    label: "FINISH",
    options: ["Choose Later", "Performance Direction", "Custom Color / Finish"],
  },
] as const;

export default function PerformancePowerboatsBuildPage() {
  const navigate = useNavigate();

  const [model, setModel] = useState<ModelChoice>(null);
  const [use, setUse] = useState<UseChoice>(null);
  const [setup, setSetup] = useState<Record<string, string>>({
    power: "",
    top: "",
    electronics: "",
    finish: "",
  });

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selections = useMemo(
    () =>
      setupGroups
        .map((group) => ({
          label: group.label,
          value: setup[group.key],
        }))
        .filter((item) => item.value),
    [setup]
  );

  const readyForSummary = Boolean(model && use);

  function selectSetup(key: string, value: string) {
    setSetup((current) => ({
      ...current,
      [key]: current[key] === value ? "" : value,
    }));
  }

  function scrollTo(id: string) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function chooseModel(choice: ModelChoice) {
    if (choice === "Performance 34") return;
    setModel(choice);
    setTimeout(() => scrollTo("build-use"), 80);
  }

  async function submitBuild() {
    if (
      !model ||
      !use ||
      !contact.name.trim() ||
      !contact.phone.trim() ||
      submitting
    ) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    const requestSummary = [
      "BUILD YOUR PERFORMANCE",
      `Model: ${model}`,
      `Use: ${use}`,
      `Power: ${setup.power || "Not selected"}`,
      `Top / Metalwork: ${setup.top || "Not selected"}`,
      `Electronics: ${setup.electronics || "Not selected"}`,
      `Finish: ${setup.finish || "Not selected"}`,
    ].join("\n");

    const { error } = await supabase.rpc(
      "submit_performance_powerboat_project",
      {
        p_project_type: "Build a Performance",
        p_customer_name: contact.name.trim(),
        p_customer_phone: contact.phone.trim(),
        p_customer_email: contact.email.trim() || null,
        p_boat_year: null,
        p_boat_make_model: model,
        p_boat_length: null,
        p_boat_engines: setup.power || null,
        p_boat_location: null,
        p_customer_request: requestSummary,
      }
    );

    setSubmitting(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    setSubmitted(true);
  }

  return (
    <main className="ppb-page">
      <header className="ppb-topbar">
        <button
          className="ppb-brand"
          type="button"
          onClick={() => navigate("/planet/performance-powerboats")}
        >
          PERFORMANCE POWERBOATS
        </button>

        <button
          className="ppb-back"
          type="button"
          onClick={() => navigate("/planet/performance-powerboats")}
        >
          ← BACK TO PERFORMANCE
        </button>
      </header>

      <section className="ppb-hero">
        <div className="ppb-hero-inner">
          <span className="ppb-kicker">BUILD YOUR PERFORMANCE</span>

          <h1>
            START WITH
            <br />
            THE BOAT.
          </h1>

          <p>
            Choose your Performance, tell us how you want to use it, and start
            shaping the build around you.
          </p>

          <button
            className="ppb-primary"
            type="button"
            onClick={() => scrollTo("build-model")}
          >
            START MY BUILD ↓
          </button>
        </div>
      </section>

      <section className="ppb-section" id="build-model">
        <div className="ppb-heading">
          <span className="ppb-kicker">STEP 01</span>
          <h2>CHOOSE YOUR PERFORMANCE.</h2>
          <p>Start with the platform. We’ll shape the rest from there.</p>
        </div>

        <div className="ppb-model-grid">
          {models.map((item) => {
            const active = model === item.name;

            return (
              <button
                key={item.name}
                type="button"
                disabled={item.comingSoon}
                className={`ppb-model-card ${active ? "is-active" : ""} ${
                  item.comingSoon ? "is-coming" : ""
                }`}
                onClick={() => chooseModel(item.name)}
              >
                <span className="ppb-model-eyebrow">{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <p>{item.copy}</p>

                <span className="ppb-model-action">
                  {item.comingSoon
                    ? "COMING LATER"
                    : active
                    ? "SELECTED ✓"
                    : "SELECT →"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="ppb-section ppb-section-alt" id="build-use">
        <div className="ppb-heading">
          <span className="ppb-kicker">STEP 02</span>
          <h2>HOW WILL YOU USE IT?</h2>
          <p>
            The right boat starts with what you actually need it to do.
          </p>
        </div>

        <div className="ppb-choice-grid">
          {uses.map((choice) => (
            <button
              key={choice}
              type="button"
              className={`ppb-choice ${use === choice ? "is-active" : ""}`}
              onClick={() => {
                setUse(choice);
                setTimeout(() => scrollTo("build-setup"), 80);
              }}
            >
              <strong>{choice}</strong>
              <span>{use === choice ? "SELECTED ✓" : "CHOOSE →"}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ppb-section" id="build-setup">
        <div className="ppb-heading">
          <span className="ppb-kicker">STEP 03</span>
          <h2>START SHAPING THE BUILD.</h2>
          <p>
            You don’t need every answer today. Choose what matters now and
            leave the rest for Performance.
          </p>
        </div>

        <div className="ppb-setup">
          {setupGroups.map((group) => (
            <div className="ppb-setup-row" key={group.key}>
              <div className="ppb-setup-label">{group.label}</div>

              <div className="ppb-option-list">
                {group.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      setup[group.key] === option ? "is-active" : ""
                    }
                    onClick={() => selectSetup(group.key, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ppb-summary-section" id="build-summary">
        <div className="ppb-summary">
          <div className="ppb-summary-copy">
            <span className="ppb-kicker">YOUR PERFORMANCE</span>

            <h2>
              {model ? model.toUpperCase() : "YOUR BUILD STARTS HERE."}
            </h2>

            {!readyForSummary ? (
              <p>
                Choose a model and how you plan to use it. Your build summary
                will come together here.
              </p>
            ) : (
              <p>
                This is the beginning of your Performance — not a locked order.
                Performance Powerboats will review the direction with you
                before anything is finalized.
              </p>
            )}

            <div className="ppb-price-note">
              <span>ESTIMATED BUILD RANGE</span>
              <strong>COMING SOON</strong>
              <p>
                Pricing will be added when Performance’s real model and option
                pricing is connected.
              </p>
            </div>
          </div>

          <div className="ppb-summary-card">
            <div className="ppb-summary-line">
              <span>MODEL</span>
              <strong>{model || "Not selected"}</strong>
            </div>

            <div className="ppb-summary-line">
              <span>USE</span>
              <strong>{use || "Not selected"}</strong>
            </div>

            {selections.map((item) => (
              <div className="ppb-summary-line" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}

            {!submitted ? (
              <>
                <div className="ppb-contact">
                  <div className="ppb-contact-heading">
                    <span>SEND THIS BUILD</span>
                    <strong>Where should Performance reach you?</strong>
                  </div>

                  <div className="ppb-contact-grid">
                    <label>
                      <span>NAME</span>
                      <input
                        value={contact.name}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </label>

                    <label>
                      <span>PHONE</span>
                      <input
                        value={contact.phone}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                        placeholder="Your phone number"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </label>

                    <label className="ppb-contact-full">
                      <span>EMAIL <em>OPTIONAL</em></span>
                      <input
                        value={contact.email}
                        onChange={(event) =>
                          setContact((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        placeholder="Your email"
                        inputMode="email"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                </div>

                {submitError && (
                  <div className="ppb-submit-error">{submitError}</div>
                )}

                <button
                  className="ppb-send"
                  type="button"
                  disabled={
                    !readyForSummary ||
                    !contact.name.trim() ||
                    !contact.phone.trim() ||
                    submitting
                  }
                  onClick={submitBuild}
                >
                  {submitting
                    ? "SENDING TO PERFORMANCE..."
                    : "SEND MY BUILD TO PERFORMANCE →"}
                </button>

                <small>
                  Your build direction goes directly into Performance
                  Powerboats' Live Board for review.
                </small>
              </>
            ) : (
              <div className="ppb-build-sent">
                <div className="ppb-build-sent-check">✓</div>
                <span>BUILD RECEIVED</span>
                <strong>YOUR PERFORMANCE IS NOW WITH THE SHOP.</strong>
                <p>
                  Performance Powerboats has your build direction and contact
                  information. They can review it with you before anything is
                  finalized.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

