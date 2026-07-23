import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ImagePlus,
  MapPin,
  MessageCircle,
  Truck,
  Wrench,
  X,
} from "lucide-react";

export type JmeRequestFlow = "rental" | "repair";

type JmeGuidedRequestDrawerProps = {
  flow: JmeRequestFlow | null;
  onClose: () => void;
};

type RentalRequest = {
  equipmentNeed: string;
  startDate: string;
  endDate: string;
  movementPreference: string;
  projectDetails: string;
  location: string;
  name: string;
  phone: string;
};

type RepairRequest = {
  equipmentType: string;
  brandModel: string;
  problem: string;
  currentCondition: string;
  servicePreference: string;
  location: string;
  photoNames: string[];
  name: string;
  phone: string;
};

const phoneDigits = "6156021524";

const initialRental: RentalRequest = {
  equipmentNeed: "",
  startDate: "",
  endDate: "",
  movementPreference: "",
  projectDetails: "",
  location: "",
  name: "",
  phone: "",
};

const initialRepair: RepairRequest = {
  equipmentType: "",
  brandModel: "",
  problem: "",
  currentCondition: "",
  servicePreference: "",
  location: "",
  photoNames: [],
  name: "",
  phone: "",
};

const rentalSteps = [
  "Equipment",
  "Dates",
  "Movement",
  "Project",
  "Location",
  "Contact",
  "Review",
];

const repairSteps = [
  "Equipment",
  "Problem",
  "Condition",
  "Service",
  "Photos",
  "Location",
  "Contact",
  "Review",
];

function OptionButton({
  selected,
  title,
  text,
  onClick,
}: {
  selected: boolean;
  title: string;
  text?: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`jme-guide-option${selected ? " is-selected" : ""}`}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="jme-guide-option-check">
        {selected ? <Check size={18} aria-hidden="true" /> : null}
      </span>

      <span>
        <strong>{title}</strong>
        {text ? <small>{text}</small> : null}
      </span>
    </button>
  );
}

export default function JmeGuidedRequestDrawer({
  flow,
  onClose,
}: JmeGuidedRequestDrawerProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [rental, setRental] = useState<RentalRequest>(initialRental);
  const [repair, setRepair] = useState<RepairRequest>(initialRepair);

  const steps = flow === "repair" ? repairSteps : rentalSteps;
  const isRental = flow === "rental";
  const isRepair = flow === "repair";
  const isFinalStep = step === steps.length - 1;

  useEffect(() => {
    if (!flow) {
      return;
    }

    setStep(0);
    setError("");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [flow, onClose]);

  const progress = useMemo(() => {
    if (!flow) {
      return 0;
    }

    return ((step + 1) / steps.length) * 100;
  }, [flow, step, steps.length]);

  if (!flow) {
    return null;
  }

  function validateCurrentStep() {
    if (isRental) {
      if (step === 0 && !rental.equipmentNeed.trim()) {
        return "Tell JME what kind of equipment you need.";
      }

      if (step === 1 && (!rental.startDate || !rental.endDate)) {
        return "Choose the requested start and return dates.";
      }

      if (
        step === 1 &&
        rental.startDate &&
        rental.endDate &&
        rental.endDate < rental.startDate
      ) {
        return "The return date cannot be before the start date.";
      }

      if (step === 2 && !rental.movementPreference) {
        return "Choose how you would like to discuss moving the equipment.";
      }

      if (step === 3 && !rental.projectDetails.trim()) {
        return "Give JME a quick description of the job or project.";
      }

      if (step === 4 && !rental.location.trim()) {
        return "Enter the location where the equipment will be used.";
      }

      if (
        step === 5 &&
        (!rental.name.trim() || !rental.phone.trim())
      ) {
        return "Enter your name and phone number.";
      }
    }

    if (isRepair) {
      if (step === 0 && !repair.equipmentType.trim()) {
        return "Identify the equipment that needs service.";
      }

      if (step === 1 && !repair.problem.trim()) {
        return "Describe what the equipment is doing.";
      }

      if (step === 2 && !repair.currentCondition) {
        return "Choose the machine's current condition.";
      }

      if (step === 3 && !repair.servicePreference) {
        return "Choose how you would like to discuss getting the equipment reviewed.";
      }

      if (step === 5 && !repair.location.trim()) {
        return "Enter the equipment's current location.";
      }

      if (
        step === 6 &&
        (!repair.name.trim() || !repair.phone.trim())
      ) {
        return "Enter your name and phone number.";
      }
    }

    return "";
  }

  function goNext() {
    const validationError = validateCurrentStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  function sendRentalRequest() {
    const message = [
      "Hi, I would like to start a rental request with JME.",
      "",
      `Equipment needed: ${rental.equipmentNeed}`,
      `Requested dates: ${rental.startDate} through ${rental.endDate}`,
      `Pickup or delivery discussion: ${rental.movementPreference}`,
      `Project: ${rental.projectDetails}`,
      `Project location: ${rental.location}`,
      `Name: ${rental.name}`,
      `Phone: ${rental.phone}`,
    ].join("\n");

    window.location.href =
      `sms:${phoneDigits}?body=${encodeURIComponent(message)}`;
  }

  function sendRepairRequest() {
    const message = [
      "Hi, I would like to start an equipment repair request with JME.",
      "",
      `Equipment: ${repair.equipmentType}`,
      `Brand / model: ${repair.brandModel || "Not provided"}`,
      `Problem: ${repair.problem}`,
      `Current condition: ${repair.currentCondition}`,
      `Service discussion: ${repair.servicePreference}`,
      `Equipment location: ${repair.location}`,
      `Photos selected: ${
        repair.photoNames.length > 0
          ? repair.photoNames.join(", ")
          : "None selected"
      }`,
      `Name: ${repair.name}`,
      `Phone: ${repair.phone}`,
    ].join("\n");

    window.location.href =
      `sms:${phoneDigits}?body=${encodeURIComponent(message)}`;
  }

  function submitRequest() {
    if (isRental) {
      sendRentalRequest();
      return;
    }

    sendRepairRequest();
  }

  function handleRepairPhotos(files: FileList | null) {
    if (!files) {
      setRepair((current) => ({
        ...current,
        photoNames: [],
      }));
      return;
    }

    setRepair((current) => ({
      ...current,
      photoNames: Array.from(files).map((file) => file.name),
    }));
  }

  function renderRentalStep() {
    if (step === 0) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <Truck size={28} aria-hidden="true" />
          </div>

          <h3>What kind of equipment do you need?</h3>

          <p className="jme-guide-help">
            Jones is confirming the current rental inventory. Describe the
            machine or equipment needed for your job.
          </p>

          <label className="jme-guide-field">
            <span>Equipment needed</span>
            <input
              type="text"
              value={rental.equipmentNeed}
              onChange={(event) =>
                setRental((current) => ({
                  ...current,
                  equipmentNeed: event.target.value,
                }))
              }
              placeholder="Example: mini excavator, lift, trailer, or other equipment"
              autoComplete="off"
            />
          </label>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <CalendarDays size={28} aria-hidden="true" />
          </div>

          <h3>When do you need it?</h3>

          <p className="jme-guide-help">
            These are requested dates. JME will review availability before
            anything is confirmed.
          </p>

          <div className="jme-guide-date-grid">
            <label className="jme-guide-field">
              <span>Requested start date</span>
              <div className="jme-guide-date-wrap">
                <input
                  type="date"
                  value={rental.startDate}
                  onChange={(event) =>
                    setRental((current) => ({
                      ...current,
                      startDate: event.target.value,
                    }))
                  }
                />
              </div>
            </label>

            <label className="jme-guide-field">
              <span>Requested return date</span>
              <div className="jme-guide-date-wrap">
                <input
                  type="date"
                  value={rental.endDate}
                  onChange={(event) =>
                    setRental((current) => ({
                      ...current,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>
            </label>
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <Truck size={28} aria-hidden="true" />
          </div>

          <h3>How should moving the equipment be discussed?</h3>

          <p className="jme-guide-help">
            This is only a request preference. Jones will confirm the actual
            pickup or delivery options.
          </p>

          <div className="jme-guide-options">
            <OptionButton
              selected={rental.movementPreference === "I can pick it up"}
              title="I can pick it up"
              text="I want to ask about customer pickup."
              onClick={() =>
                setRental((current) => ({
                  ...current,
                  movementPreference: "I can pick it up",
                }))
              }
            />

            <OptionButton
              selected={
                rental.movementPreference === "I need to ask about delivery"
              }
              title="I need to ask about delivery"
              text="I want JME to review the location and delivery possibility."
              onClick={() =>
                setRental((current) => ({
                  ...current,
                  movementPreference: "I need to ask about delivery",
                }))
              }
            />

            <OptionButton
              selected={rental.movementPreference === "I am not sure yet"}
              title="I am not sure yet"
              text="Jones can help determine the right next step."
              onClick={() =>
                setRental((current) => ({
                  ...current,
                  movementPreference: "I am not sure yet",
                }))
              }
            />
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <h3>What are you using the equipment for?</h3>

          <p className="jme-guide-help">
            A quick explanation helps Jones understand the job and whether the
            requested equipment makes sense.
          </p>

          <label className="jme-guide-field">
            <span>Job or project details</span>
            <textarea
              value={rental.projectDetails}
              onChange={(event) =>
                setRental((current) => ({
                  ...current,
                  projectDetails: event.target.value,
                }))
              }
              placeholder="Tell JME what work you are trying to complete."
              rows={6}
            />
          </label>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <MapPin size={28} aria-hidden="true" />
          </div>

          <h3>Where will the equipment be used?</h3>

          <label className="jme-guide-field">
            <span>Project or job-site location</span>
            <input
              type="text"
              value={rental.location}
              onChange={(event) =>
                setRental((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="Address, road, town, or general location"
              autoComplete="street-address"
            />
          </label>
        </>
      );
    }

    if (step === 5) {
      return (
        <>
          <h3>How should JME contact you?</h3>

          <div className="jme-guide-field-stack">
            <label className="jme-guide-field">
              <span>Your name</span>
              <input
                type="text"
                value={rental.name}
                onChange={(event) =>
                  setRental((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Full name"
                autoComplete="name"
              />
            </label>

            <label className="jme-guide-field">
              <span>Phone number</span>
              <input
                type="tel"
                value={rental.phone}
                onChange={(event) =>
                  setRental((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Best call or text number"
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="jme-guide-question-icon">
          <Check size={28} aria-hidden="true" />
        </div>

        <h3>Review your rental request.</h3>

        <p className="jme-guide-help">
          Nothing is reserved yet. This opens a prepared text message so Jones
          can review the equipment, dates, and next step with you.
        </p>

        <dl className="jme-guide-review">
          <div>
            <dt>Equipment</dt>
            <dd>{rental.equipmentNeed}</dd>
          </div>

          <div>
            <dt>Requested dates</dt>
            <dd>
              {rental.startDate} through {rental.endDate}
            </dd>
          </div>

          <div>
            <dt>Movement preference</dt>
            <dd>{rental.movementPreference}</dd>
          </div>

          <div>
            <dt>Project</dt>
            <dd>{rental.projectDetails}</dd>
          </div>

          <div>
            <dt>Location</dt>
            <dd>{rental.location}</dd>
          </div>

          <div>
            <dt>Customer</dt>
            <dd>
              {rental.name} · {rental.phone}
            </dd>
          </div>
        </dl>
      </>
    );
  }

  function renderRepairStep() {
    if (step === 0) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <Wrench size={28} aria-hidden="true" />
          </div>

          <h3>What equipment needs repair?</h3>

          <div className="jme-guide-field-stack">
            <label className="jme-guide-field">
              <span>Equipment type</span>
              <input
                type="text"
                value={repair.equipmentType}
                onChange={(event) =>
                  setRepair((current) => ({
                    ...current,
                    equipmentType: event.target.value,
                  }))
                }
                placeholder="Example: excavator, tractor, loader, lift, or other machine"
                autoComplete="off"
              />
            </label>

            <label className="jme-guide-field">
              <span>Brand and model, if available</span>
              <input
                type="text"
                value={repair.brandModel}
                onChange={(event) =>
                  setRepair((current) => ({
                    ...current,
                    brandModel: event.target.value,
                  }))
                }
                placeholder="Brand, model, or serial details"
                autoComplete="off"
              />
            </label>
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <h3>What is the equipment doing?</h3>

          <p className="jme-guide-help">
            Describe the problem, warning, sound, leak, loss of power, or other
            symptom you noticed.
          </p>

          <label className="jme-guide-field">
            <span>Problem description</span>
            <textarea
              value={repair.problem}
              onChange={(event) =>
                setRepair((current) => ({
                  ...current,
                  problem: event.target.value,
                }))
              }
              placeholder="Tell JME what happened and what the machine is doing now."
              rows={7}
            />
          </label>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <h3>What condition is the machine in now?</h3>

          <div className="jme-guide-options">
            <OptionButton
              selected={repair.currentCondition === "Starts and moves"}
              title="Starts and moves"
              text="The machine can currently operate or move."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  currentCondition: "Starts and moves",
                }))
              }
            />

            <OptionButton
              selected={repair.currentCondition === "Starts but will not move"}
              title="Starts but will not move"
              text="The engine runs, but the machine cannot travel normally."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  currentCondition: "Starts but will not move",
                }))
              }
            />

            <OptionButton
              selected={repair.currentCondition === "Will not start"}
              title="Will not start"
              text="The machine is currently down."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  currentCondition: "Will not start",
                }))
              }
            />

            <OptionButton
              selected={repair.currentCondition === "Not safe to operate"}
              title="Not safe to operate"
              text="The equipment should not be moved or used."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  currentCondition: "Not safe to operate",
                }))
              }
            />

            <OptionButton
              selected={repair.currentCondition === "Not sure"}
              title="Not sure"
              text="Jones can review the details with you."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  currentCondition: "Not sure",
                }))
              }
            />
          </div>
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <h3>How would you like to discuss getting it reviewed?</h3>

          <p className="jme-guide-help">
            These are request preferences only. JME will confirm what is
            available for this machine and location.
          </p>

          <div className="jme-guide-options">
            <OptionButton
              selected={repair.servicePreference === "I can bring it in"}
              title="I can bring it in"
              text="I want to ask about bringing the equipment to JME."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  servicePreference: "I can bring it in",
                }))
              }
            />

            <OptionButton
              selected={
                repair.servicePreference === "I need to ask about pickup"
              }
              title="I need to ask about pickup"
              text="I want Jones to review whether pickup is possible."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  servicePreference: "I need to ask about pickup",
                }))
              }
            />

            <OptionButton
              selected={
                repair.servicePreference ===
                "I need to ask about mobile service"
              }
              title="I need to ask about mobile service"
              text="I want Jones to review the machine's field location."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  servicePreference:
                    "I need to ask about mobile service",
                }))
              }
            />

            <OptionButton
              selected={repair.servicePreference === "I am not sure"}
              title="I am not sure"
              text="JME can help determine the correct next step."
              onClick={() =>
                setRepair((current) => ({
                  ...current,
                  servicePreference: "I am not sure",
                }))
              }
            />
          </div>
        </>
      );
    }

    if (step === 4) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <ImagePlus size={28} aria-hidden="true" />
          </div>

          <h3>Do you have photos?</h3>

          <p className="jme-guide-help">
            Photos are optional in this first demo. Selecting them records the
            filenames in the prepared request. Direct image delivery will be
            connected later.
          </p>

          <label className="jme-guide-upload">
            <ImagePlus size={25} aria-hidden="true" />

            <span>
              <strong>Select equipment photos</strong>
              <small>Equipment, model plate, damage, leak, or problem area</small>
            </span>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) =>
                handleRepairPhotos(event.target.files)
              }
            />
          </label>

          {repair.photoNames.length > 0 ? (
            <div className="jme-guide-file-list">
              {repair.photoNames.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          ) : null}
        </>
      );
    }

    if (step === 5) {
      return (
        <>
          <div className="jme-guide-question-icon">
            <MapPin size={28} aria-hidden="true" />
          </div>

          <h3>Where is the equipment now?</h3>

          <label className="jme-guide-field">
            <span>Current equipment location</span>
            <input
              type="text"
              value={repair.location}
              onChange={(event) =>
                setRepair((current) => ({
                  ...current,
                  location: event.target.value,
                }))
              }
              placeholder="Address, job site, farm, business, road, or general location"
              autoComplete="street-address"
            />
          </label>
        </>
      );
    }

    if (step === 6) {
      return (
        <>
          <h3>How should JME contact you?</h3>

          <div className="jme-guide-field-stack">
            <label className="jme-guide-field">
              <span>Your name</span>
              <input
                type="text"
                value={repair.name}
                onChange={(event) =>
                  setRepair((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Full name"
                autoComplete="name"
              />
            </label>

            <label className="jme-guide-field">
              <span>Phone number</span>
              <input
                type="tel"
                value={repair.phone}
                onChange={(event) =>
                  setRepair((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Best call or text number"
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="jme-guide-question-icon">
          <Check size={28} aria-hidden="true" />
        </div>

        <h3>Review your repair request.</h3>

        <p className="jme-guide-help">
          This opens a prepared text message to JME. Diagnosis, pricing, pickup,
          mobile service, and repair acceptance are not confirmed until Jones
          reviews the request.
        </p>

        <dl className="jme-guide-review">
          <div>
            <dt>Equipment</dt>
            <dd>{repair.equipmentType}</dd>
          </div>

          <div>
            <dt>Brand or model</dt>
            <dd>{repair.brandModel || "Not provided"}</dd>
          </div>

          <div>
            <dt>Problem</dt>
            <dd>{repair.problem}</dd>
          </div>

          <div>
            <dt>Current condition</dt>
            <dd>{repair.currentCondition}</dd>
          </div>

          <div>
            <dt>Service preference</dt>
            <dd>{repair.servicePreference}</dd>
          </div>

          <div>
            <dt>Location</dt>
            <dd>{repair.location}</dd>
          </div>

          <div>
            <dt>Photos selected</dt>
            <dd>
              {repair.photoNames.length > 0
                ? repair.photoNames.join(", ")
                : "None"}
            </dd>
          </div>

          <div>
            <dt>Customer</dt>
            <dd>
              {repair.name} · {repair.phone}
            </dd>
          </div>
        </dl>
      </>
    );
  }

  return (
    <div className="jme-guide-layer" role="presentation">
      <button
        className="jme-guide-backdrop"
        type="button"
        onClick={onClose}
        aria-label="Close request workspace"
      />

      <aside
        className="jme-guide-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="jme-guide-title"
      >
        <style>{`
          .jme-guide-layer {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            justify-content: flex-end;
          }

          .jme-guide-backdrop {
            position: absolute;
            inset: 0;
            width: 100%;
            border: 0;
            background: rgba(0, 0, 0, 0.74);
            backdrop-filter: blur(5px);
            cursor: pointer;
          }

          .jme-guide-drawer {
            position: relative;
            z-index: 1;
            width: min(600px, 100%);
            min-height: 100%;
            display: flex;
            flex-direction: column;
            background:
              radial-gradient(circle at top right, rgba(19, 143, 232, 0.16), transparent 24rem),
              #0a0e14;
            border-left: 1px solid rgba(91, 188, 255, 0.3);
            color: white;
            overflow-y: auto;
          }

          .jme-guide-header {
            position: sticky;
            top: 0;
            z-index: 3;
            padding: 20px 22px 18px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.18);
            background: rgba(10, 14, 20, 0.94);
            backdrop-filter: blur(14px);
          }

          .jme-guide-header-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
          }

          .jme-guide-kicker {
            margin: 0;
            color: #5bbcff;
            font-size: 0.76rem;
            font-weight: 900;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }

          .jme-guide-header h2 {
            margin: 7px 0 0;
            font-size: clamp(1.45rem, 4vw, 2rem);
            line-height: 1.05;
            letter-spacing: -0.035em;
          }

          .jme-guide-close {
            width: 46px;
            height: 46px;
            flex: 0 0 46px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 13px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            background: rgba(255, 255, 255, 0.03);
            color: white;
            cursor: pointer;
          }

          .jme-guide-progress-meta {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-top: 18px;
            color: #9ba8b8;
            font-size: 0.82rem;
            font-weight: 800;
          }

          .jme-guide-progress-track {
            height: 7px;
            margin-top: 9px;
            overflow: hidden;
            border-radius: 999px;
            background: rgba(148, 163, 184, 0.16);
          }

          .jme-guide-progress-fill {
            height: 100%;
            border-radius: inherit;
            background: #138fe8;
            transition: width 180ms ease;
          }

          .jme-guide-body {
            flex: 1;
            padding: 30px 22px 40px;
          }

          .jme-guide-question-icon {
            width: 58px;
            height: 58px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            border: 1px solid rgba(91, 188, 255, 0.36);
            background: rgba(19, 143, 232, 0.13);
            color: #5bbcff;
          }

          .jme-guide-body h3 {
            margin: 20px 0 0;
            font-size: clamp(2rem, 6vw, 3.25rem);
            line-height: 0.98;
            letter-spacing: -0.05em;
          }

          .jme-guide-help {
            margin: 17px 0 0;
            color: #aeb9c8;
            font-size: 1rem;
            line-height: 1.65;
          }

          .jme-guide-field-stack,
          .jme-guide-options {
            display: grid;
            gap: 13px;
            margin-top: 26px;
          }

          .jme-guide-field {
            display: grid;
            gap: 9px;
            margin-top: 26px;
          }

          .jme-guide-field-stack .jme-guide-field {
            margin-top: 0;
          }

          .jme-guide-field > span {
            font-size: 0.88rem;
            font-weight: 850;
            color: #d8e1ec;
          }

          .jme-guide-field input,
          .jme-guide-field textarea {
            width: 100%;
            min-width: 0;
            border-radius: 14px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            background: #111821;
            color: white;
            padding: 15px 16px;
            font: inherit;
            line-height: 1.45;
            outline: none;
          }

          .jme-guide-field input:focus,
          .jme-guide-field textarea:focus {
            border-color: #5bbcff;
            box-shadow: 0 0 0 3px rgba(19, 143, 232, 0.14);
          }

          .jme-guide-field textarea {
            resize: vertical;
          }

          .jme-guide-date-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 13px;
          }

          .jme-guide-date-wrap {
            width: 100%;
            min-width: 0;
            border-radius: 14px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            background: #111821;
            padding: 15px 16px;
          }

          .jme-guide-date-wrap input {
            display: block;
            width: 100%;
            min-width: 0;
            border: 0;
            padding: 0;
            background: transparent;
            color: white;
            font: inherit;
            color-scheme: dark;
          }

          .jme-guide-option {
            width: 100%;
            display: grid;
            grid-template-columns: 28px minmax(0, 1fr);
            gap: 13px;
            padding: 17px;
            text-align: left;
            border-radius: 15px;
            border: 1px solid rgba(148, 163, 184, 0.25);
            background: #111821;
            color: white;
            cursor: pointer;
          }

          .jme-guide-option:hover,
          .jme-guide-option.is-selected {
            border-color: rgba(91, 188, 255, 0.8);
            background: rgba(19, 143, 232, 0.11);
          }

          .jme-guide-option-check {
            width: 26px;
            height: 26px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 1px solid rgba(91, 188, 255, 0.45);
            color: #5bbcff;
          }

          .jme-guide-option strong,
          .jme-guide-option small {
            display: block;
          }

          .jme-guide-option strong {
            font-size: 1rem;
          }

          .jme-guide-option small {
            margin-top: 5px;
            color: #9daaba;
            font-size: 0.86rem;
            line-height: 1.45;
          }

          .jme-guide-upload {
            position: relative;
            display: flex;
            align-items: center;
            gap: 15px;
            margin-top: 26px;
            padding: 20px;
            border-radius: 16px;
            border: 1px dashed rgba(91, 188, 255, 0.5);
            background: rgba(19, 143, 232, 0.08);
            color: #dce7f3;
            cursor: pointer;
          }

          .jme-guide-upload input {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
          }

          .jme-guide-upload strong,
          .jme-guide-upload small {
            display: block;
          }

          .jme-guide-upload small {
            margin-top: 5px;
            color: #9daaba;
          }

          .jme-guide-file-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 14px;
          }

          .jme-guide-file-list span {
            padding: 7px 10px;
            border-radius: 999px;
            background: rgba(19, 143, 232, 0.12);
            color: #bdddff;
            font-size: 0.8rem;
          }

          .jme-guide-review {
            display: grid;
            gap: 0;
            margin: 27px 0 0;
            border-top: 1px solid rgba(148, 163, 184, 0.2);
          }

          .jme-guide-review div {
            padding: 17px 0;
            border-bottom: 1px solid rgba(148, 163, 184, 0.18);
          }

          .jme-guide-review dt {
            color: #7fbff0;
            font-size: 0.75rem;
            font-weight: 900;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .jme-guide-review dd {
            margin: 7px 0 0;
            color: #e5edf6;
            line-height: 1.55;
            overflow-wrap: anywhere;
          }

          .jme-guide-footer {
            position: sticky;
            bottom: 0;
            z-index: 3;
            padding: 16px 22px 20px;
            border-top: 1px solid rgba(148, 163, 184, 0.18);
            background: rgba(10, 14, 20, 0.96);
            backdrop-filter: blur(14px);
          }

          .jme-guide-error {
            margin: 0 0 12px;
            color: #ffb4b4;
            font-size: 0.9rem;
            font-weight: 800;
          }

          .jme-guide-actions {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            gap: 11px;
          }

          .jme-guide-back,
          .jme-guide-next {
            min-height: 56px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;
            border-radius: 14px;
            font-weight: 900;
            cursor: pointer;
          }

          .jme-guide-back {
            min-width: 118px;
            border: 1px solid rgba(148, 163, 184, 0.3);
            background: rgba(255, 255, 255, 0.025);
            color: white;
          }

          .jme-guide-next {
            border: 1px solid #138fe8;
            background: #138fe8;
            color: #03111d;
          }

          .jme-guide-back:disabled {
            opacity: 0.42;
            cursor: default;
          }

          @media (max-width: 640px) {
            .jme-guide-layer {
              align-items: flex-end;
            }

            .jme-guide-drawer {
              width: 100%;
              min-height: 94%;
              max-height: 100%;
              border-left: 0;
              border-top: 1px solid rgba(91, 188, 255, 0.35);
              border-radius: 22px 22px 0 0;
            }

            .jme-guide-header {
              padding: 17px 16px 15px;
            }

            .jme-guide-body {
              padding: 25px 16px 36px;
            }

            .jme-guide-footer {
              padding: 14px 16px 18px;
            }

            .jme-guide-date-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 390px) {
            .jme-guide-actions {
              grid-template-columns: 1fr;
            }

            .jme-guide-back {
              order: 2;
            }
          }
        `}</style>

        <header className="jme-guide-header">
          <div className="jme-guide-header-row">
            <div>
              <p className="jme-guide-kicker">
                {isRental ? "Rental workspace" : "Repair workspace"}
              </p>

              <h2 id="jme-guide-title">
                {isRental
                  ? "Request equipment"
                  : "Start a repair request"}
              </h2>
            </div>

            <button
              className="jme-guide-close"
              type="button"
              onClick={onClose}
              aria-label="Close request workspace"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="jme-guide-progress-meta">
            <span>
              Step {step + 1} of {steps.length}
            </span>
            <span>{steps[step]}</span>
          </div>

          <div
            className="jme-guide-progress-track"
            aria-label={`Step ${step + 1} of ${steps.length}`}
          >
            <div
              className="jme-guide-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="jme-guide-body">
          {isRental ? renderRentalStep() : renderRepairStep()}
        </div>

        <footer className="jme-guide-footer">
          {error ? (
            <p className="jme-guide-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="jme-guide-actions">
            <button
              className="jme-guide-back"
              type="button"
              onClick={goBack}
              disabled={step === 0}
            >
              <ArrowLeft size={19} aria-hidden="true" />
              Back
            </button>

            <button
              className="jme-guide-next"
              type="button"
              onClick={isFinalStep ? submitRequest : goNext}
            >
              {isFinalStep ? (
                <>
                  <MessageCircle size={20} aria-hidden="true" />
                  Open request text
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={20} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
