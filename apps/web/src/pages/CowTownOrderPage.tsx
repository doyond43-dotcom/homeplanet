import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  cowTownPlans,
  cowTownProducts,
  cowTownShipping,
  formatCowTownMoney,
  type CowTownPlanId,
} from "../config/cowTownPricing";
import "./CowTownOrderPage.css";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
type ProductChoice = "full-tag" | "sticker-upgrade" | "both";
type BatchMethod = "sequence" | "enter-now" | "upload-later";

type RanchDetails = {
  ranchName: string;
  contactName: string;
  phone: string;
  email: string;
  recoveryPhone: string;
};

type ShippingDetails = {
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
};

const emptyRanchDetails: RanchDetails = {
  ranchName: "",
  contactName: "",
  phone: "",
  email: "",
  recoveryPhone: "",
};

const emptyShippingDetails: ShippingDetails = {
  address: "",
  city: "",
  state: "FL",
  zip: "",
  notes: "",
};

const stepLabels = [
  "Plan",
  "Products",
  "Batch",
  "Ranch",
  "Shipping",
  "Review",
];

export default function CowTownOrderPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [planId, setPlanId] = useState<CowTownPlanId>("working-ranch");
  const [productChoice, setProductChoice] =
    useState<ProductChoice>("full-tag");
  const [fullTagQuantity, setFullTagQuantity] = useState(25);
  const [stickerQuantity, setStickerQuantity] = useState(0);
  const [batchMethod, setBatchMethod] = useState<BatchMethod>("sequence");
  const [startingNumber, setStartingNumber] = useState("1001");
  const [animalNumbers, setAnimalNumbers] = useState("");
  const [ranch, setRanch] =
    useState<RanchDetails>(emptyRanchDetails);
  const [shippingDetails, setShippingDetails] =
    useState<ShippingDetails>(emptyShippingDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const selectedPlan = cowTownPlans.find((plan) => plan.id === planId)!;
  const fullTag = cowTownProducts.find(
    (product) => product.id === "full-tag",
  )!;
  const sticker = cowTownProducts.find(
    (product) => product.id === "sticker-upgrade",
  )!;

  const effectiveFullTagQuantity =
    productChoice === "sticker-upgrade" ? 0 : fullTagQuantity;

  const effectiveStickerQuantity =
    productChoice === "full-tag" ? 0 : stickerQuantity;

  const totalQuantity =
    effectiveFullTagQuantity + effectiveStickerQuantity;

  const fullTagTotal =
    effectiveFullTagQuantity * fullTag.unitPrice;

  const stickerTotal =
    effectiveStickerQuantity * sticker.unitPrice;

  const merchandiseTotal = fullTagTotal + stickerTotal;

  const shippingCost =
    merchandiseTotal === 0 ||
    merchandiseTotal >= cowTownShipping.freeThreshold
      ? 0
      : cowTownShipping.flatRate;

  const oneTimeTotal = merchandiseTotal + shippingCost;
  const monthlyTotal = selectedPlan.monthlyPrice ?? 0;

  const endingNumber = useMemo(() => {
    const start = Number.parseInt(startingNumber, 10);

    if (!Number.isFinite(start) || totalQuantity < 1) {
      return "";
    }

    return String(start + totalQuantity - 1);
  }, [startingNumber, totalQuantity]);

  const enteredNumberCount = useMemo(() => {
    return animalNumbers
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean).length;
  }, [animalNumbers]);

  function nextStep() {
    setStep((current) =>
      Math.min(6, current + 1) as Step,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function previousStep() {
    setStep((current) =>
      Math.max(1, current - 1) as Step,
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function updateRanch<K extends keyof RanchDetails>(
    key: K,
    value: RanchDetails[K],
  ) {
    setRanch((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateShipping<K extends keyof ShippingDetails>(
    key: K,
    value: ShippingDetails[K],
  ) {
    setShippingDetails((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function chooseProduct(choice: ProductChoice) {
    setProductChoice(choice);

    if (choice === "full-tag") {
      setStickerQuantity(0);

      if (fullTagQuantity < 1) {
        setFullTagQuantity(1);
      }
    }

    if (choice === "sticker-upgrade") {
      setFullTagQuantity(0);

      if (stickerQuantity < 1) {
        setStickerQuantity(1);
      }
    }

    if (choice === "both") {
      if (fullTagQuantity < 1) {
        setFullTagQuantity(1);
      }

      if (stickerQuantity < 1) {
        setStickerQuantity(1);
      }
    }
  }

  const canContinueProducts = totalQuantity > 0;

  const canContinueRanch =
    ranch.ranchName.trim() &&
    ranch.contactName.trim() &&
    ranch.phone.trim() &&
    ranch.email.trim();

  const canContinueShipping =
    shippingDetails.address.trim() &&
    shippingDetails.city.trim() &&
    shippingDetails.state.trim() &&
    shippingDetails.zip.trim();

  async function placeCowTownOrder() {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const parsedAnimalNumbers = animalNumbers
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);

    try {
      const { data, error } = await supabase.rpc(
        "create_cow_town_order",
        {
          requested_payload: {
            plan_id: planId,
            full_tag_quantity: effectiveFullTagQuantity,
            sticker_quantity: effectiveStickerQuantity,
            batch_method: batchMethod,
            starting_number:
              batchMethod === "sequence" ? startingNumber : null,
            ending_number:
              batchMethod === "sequence" ? endingNumber : null,
            animal_numbers:
              batchMethod === "enter-now"
                ? parsedAnimalNumbers
                : [],
            ranch_name: ranch.ranchName,
            contact_name: ranch.contactName,
            phone: ranch.phone,
            email: ranch.email,
            recovery_phone: ranch.recoveryPhone || null,
            shipping_address: shippingDetails.address,
            shipping_city: shippingDetails.city,
            shipping_state: shippingDetails.state,
            shipping_zip: shippingDetails.zip,
            shipping_notes: shippingDetails.notes || null,
          },
        },
      );

      if (error) {
        throw error;
      }

      const result = data as {
        customer_access_token?: string;
        order_number?: string;
      } | null;

      if (!result?.customer_access_token) {
        throw new Error(
          "The order was created, but the receipt link was not returned.",
        );
      }

      navigate(
        `/planet/cow-town-tags/receipt/${result.customer_access_token}`,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not create the Cow Town order.";

      setSubmitError(message);
      setIsSubmitting(false);
    }
  }
  return (
    <main className="ct-wizard-page">
      <header className="ct-wizard-header">
        <a href="/planet/cow-town-tags" className="ct-wizard-back">
          ← Back to Cow Town Tags
        </a>

        <div className="ct-wizard-brand">
          <p>Cow Town Tags</p>
          <strong>Build your first ranch batch</strong>
        </div>
      </header>

      <section className="ct-progress-shell">
        <div className="ct-progress-top">
          <span>Step {step} of 6</span>
          <strong>{stepLabels[step - 1]}</strong>
        </div>

        <div className="ct-progress-track">
          <div
            className="ct-progress-fill"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        <div className="ct-progress-labels">
          {stepLabels.map((label, index) => (
            <span
              key={label}
              className={index + 1 <= step ? "is-active" : ""}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="ct-wizard-shell">
        {step === 1 ? (
          <section className="ct-step-card">
            <div className="ct-step-heading">
              <p>Ranch capacity</p>
              <h1>How many active animals do you manage?</h1>
              <span>
                Choose the closest fit. Sold and archived animals
                will keep their history without counting against
                your active limit.
              </span>
            </div>

            <div className="ct-choice-list">
              {cowTownPlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={
                    plan.id === planId ? "is-selected" : ""
                  }
                  onClick={() => setPlanId(plan.id)}
                >
                  <div>
                    <strong>
                      {plan.animalLimit === null
                        ? "More than 1,500"
                        : `Up to ${plan.animalLimit.toLocaleString()}`}
                    </strong>
                    <span>{plan.name}</span>
                  </div>

                  <div className="ct-choice-price">
                    {plan.monthlyPrice === null
                      ? "Custom"
                      : `${formatCowTownMoney(plan.monthlyPrice)}/mo`}
                  </div>
                </button>
              ))}
            </div>

            <div className="ct-wizard-actions">
              <button
                type="button"
                className="ct-primary-action"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="ct-step-card">
            <div className="ct-step-heading">
              <p>Physical products</p>
              <h1>What do you need for your first batch?</h1>
              <span>
                Choose complete new tags, upgrades for your existing
                tags, or a mixture of both.
              </span>
            </div>

            <div className="ct-product-choice-grid">
              <button
                type="button"
                className={
                  productChoice === "full-tag"
                    ? "is-selected"
                    : ""
                }
                onClick={() => chooseProduct("full-tag")}
              >
                <img
                  src="/images/cow-town-tag-main.png"
                  alt="Full Cow Town livestock tag"
                />
                <strong>Full Cow Town Tags</strong>
                <span>A brand-new oversized cattle ear tag with the animal number, FOUND? SCAN ME, a unique Cow Town ID, and a permanent scannable QR code laser-marked directly into the tag.</span>
              </button>

              <button
                type="button"
                className={
                  productChoice === "sticker-upgrade"
                    ? "is-selected"
                    : ""
                }
                onClick={() =>
                  chooseProduct("sticker-upgrade")
                }
              >
                <img
                  src="/images/cow-town-tag-retrofit.png"
                  alt="Cow Town sticker upgrade"
                />
                <strong>Sticker Upgrades</strong>
                <span>A durable weather-resistant QR sticker for an existing numbered cattle ear tag. It adds the Cow Town recovery system without replacing the ranch's current tag.</span>
              </button>

              <button
                type="button"
                className={
                  productChoice === "both"
                    ? "is-selected"
                    : ""
                }
                onClick={() => chooseProduct("both")}
              >
                <div className="ct-both-visual">
                  <img
                    src="/images/cow-town-tag-main.png"
                    alt=""
                  />
                  <img
                    src="/images/cow-town-tag-retrofit.png"
                    alt=""
                  />
                </div>
                <strong>Both</strong>
                <span>Order full Cow Town tags for some animals and serialized sticker upgrades for the cattle tags already in use.</span>
              </button>
            </div>

            <div className="ct-quantity-panel">
              {productChoice !== "sticker-upgrade" ? (
                <label>
                  <span>Full tags</span>
                  <div>
                    <strong>
                      {formatCowTownMoney(fullTag.unitPrice)} each
                    </strong>
                    <input
                      type="number"
                      min="1"
                      value={fullTagQuantity}
                      onChange={(event) =>
                        setFullTagQuantity(
                          Math.max(
                            1,
                            Number(event.target.value) || 1,
                          ),
                        )
                      }
                    />
                  </div>
                </label>
              ) : null}

              {productChoice !== "full-tag" ? (
                <label>
                  <span>Sticker upgrades</span>
                  <div>
                    <strong>
                      {formatCowTownMoney(sticker.unitPrice)} each
                    </strong>
                    <input
                      type="number"
                      min="1"
                      value={stickerQuantity}
                      onChange={(event) =>
                        setStickerQuantity(
                          Math.max(
                            1,
                            Number(event.target.value) || 1,
                          ),
                        )
                      }
                    />
                  </div>
                </label>
              ) : null}

              <div className="ct-simple-total">
                <span>First batch</span>
                <strong>{totalQuantity} assignments</strong>
              </div>
            </div>

            <div className="ct-wizard-actions">
              <button
                type="button"
                className="ct-secondary-action"
                onClick={previousStep}
              >
                Back
              </button>

              <button
                type="button"
                className="ct-primary-action"
                onClick={nextStep}
                disabled={!canContinueProducts}
              >
                Continue
              </button>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="ct-step-card">
            <div className="ct-step-heading">
              <p>First batch</p>
              <h1>How should we create your animal assignments?</h1>
              <span>
                We can generate a clean number sequence, use your
                existing numbers, or let you submit the full list
                later.
              </span>
            </div>

            <div className="ct-choice-list ct-batch-list">
              <button
                type="button"
                className={
                  batchMethod === "sequence"
                    ? "is-selected"
                    : ""
                }
                onClick={() => setBatchMethod("sequence")}
              >
                <div>
                  <strong>Generate numbers in order</strong>
                  <span>Fastest for a new numbered batch.</span>
                </div>
              </button>

              <button
                type="button"
                className={
                  batchMethod === "enter-now"
                    ? "is-selected"
                    : ""
                }
                onClick={() => setBatchMethod("enter-now")}
              >
                <div>
                  <strong>Enter existing numbers now</strong>
                  <span>Best for a smaller hand-picked group.</span>
                </div>
              </button>

              <button
                type="button"
                className={
                  batchMethod === "upload-later"
                    ? "is-selected"
                    : ""
                }
                onClick={() =>
                  setBatchMethod("upload-later")
                }
              >
                <div>
                  <strong>Upload or send the list later</strong>
                  <span>Best for large ranch spreadsheets.</span>
                </div>
              </button>
            </div>

            {batchMethod === "sequence" ? (
              <div className="ct-reveal-panel">
                <label className="ct-simple-field">
                  <span>Starting number</span>
                  <input
                    value={startingNumber}
                    onChange={(event) =>
                      setStartingNumber(event.target.value)
                    }
                    inputMode="numeric"
                    placeholder="1001"
                  />
                </label>

                <div className="ct-range-result">
                  <span>Generated range</span>
                  <strong>
                    {endingNumber
                      ? `${startingNumber} through ${endingNumber}`
                      : "Add a starting number"}
                  </strong>
                  <small>{totalQuantity} assignments</small>
                </div>
              </div>
            ) : null}

            {batchMethod === "enter-now" ? (
              <div className="ct-reveal-panel ct-stack-panel">
                <label className="ct-simple-field">
                  <span>One animal number per line</span>
                  <textarea
                    rows={8}
                    value={animalNumbers}
                    onChange={(event) =>
                      setAnimalNumbers(event.target.value)
                    }
                    placeholder={"0847\n0848\n0849\n0850"}
                  />
                </label>

                <div className="ct-count-line">
                  <strong>{enteredNumberCount}</strong>
                  <span>numbers entered</span>
                </div>
              </div>
            ) : null}

            {batchMethod === "upload-later" ? (
              <div className="ct-reveal-panel ct-info-panel">
                <strong>
                  Your ranch account and order can be created first.
                </strong>
                <p>
                  After checkout, you will be able to download the
                  Cow Town import template and upload a CSV or Excel
                  file with your animal numbers.
                </p>
              </div>
            ) : null}

            <div className="ct-wizard-actions">
              <button
                type="button"
                className="ct-secondary-action"
                onClick={previousStep}
              >
                Back
              </button>

              <button
                type="button"
                className="ct-primary-action"
                onClick={nextStep}
              >
                Continue
              </button>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="ct-step-card">
            <div className="ct-step-heading">
              <p>Ranch account</p>
              <h1>Tell us about your ranch.</h1>
              <span>
                This creates the account that owns and manages the
                animal records.
              </span>
            </div>

            <div className="ct-simple-form">
              <label className="ct-simple-field ct-wide">
                <span>Ranch or operation name</span>
                <input
                  value={ranch.ranchName}
                  onChange={(event) =>
                    updateRanch("ranchName", event.target.value)
                  }
                  placeholder="Miller Ranch"
                />
              </label>

              <label className="ct-simple-field">
                <span>Primary contact</span>
                <input
                  value={ranch.contactName}
                  onChange={(event) =>
                    updateRanch("contactName", event.target.value)
                  }
                  placeholder="Full name"
                />
              </label>

              <label className="ct-simple-field">
                <span>Phone</span>
                <input
                  value={ranch.phone}
                  onChange={(event) =>
                    updateRanch("phone", event.target.value)
                  }
                  placeholder="Best number"
                />
              </label>

              <label className="ct-simple-field">
                <span>Email</span>
                <input
                  type="email"
                  value={ranch.email}
                  onChange={(event) =>
                    updateRanch("email", event.target.value)
                  }
                  placeholder="Order and ranch updates"
                />
              </label>

              <label className="ct-simple-field">
                <span>Recovery contact phone</span>
                <input
                  value={ranch.recoveryPhone}
                  onChange={(event) =>
                    updateRanch(
                      "recoveryPhone",
                      event.target.value,
                    )
                  }
                  placeholder="Optional"
                />
              </label>
            </div>

            <div className="ct-wizard-actions">
              <button
                type="button"
                className="ct-secondary-action"
                onClick={previousStep}
              >
                Back
              </button>

              <button
                type="button"
                className="ct-primary-action"
                onClick={nextStep}
                disabled={!canContinueRanch}
              >
                Continue to Shipping
              </button>
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section className="ct-step-card">
            <div className="ct-step-heading">
              <p>Shipping</p>
              <h1>Where should we send the order?</h1>
              <span>
                Tracking will appear on the living Cow Town order
                page after shipment.
              </span>
            </div>

            <div className="ct-simple-form">
              <label className="ct-simple-field ct-wide">
                <span>Shipping address</span>
                <input
                  value={shippingDetails.address}
                  onChange={(event) =>
                    updateShipping(
                      "address",
                      event.target.value,
                    )
                  }
                  placeholder="Street address"
                />
              </label>

              <label className="ct-simple-field">
                <span>City</span>
                <input
                  value={shippingDetails.city}
                  onChange={(event) =>
                    updateShipping("city", event.target.value)
                  }
                />
              </label>

              <label className="ct-simple-field">
                <span>State</span>
                <input
                  value={shippingDetails.state}
                  onChange={(event) =>
                    updateShipping("state", event.target.value)
                  }
                  maxLength={2}
                />
              </label>

              <label className="ct-simple-field">
                <span>ZIP code</span>
                <input
                  value={shippingDetails.zip}
                  onChange={(event) =>
                    updateShipping("zip", event.target.value)
                  }
                  inputMode="numeric"
                />
              </label>

              <label className="ct-simple-field ct-wide">
                <span>Delivery or production notes</span>
                <textarea
                  rows={5}
                  value={shippingDetails.notes}
                  onChange={(event) =>
                    updateShipping("notes", event.target.value)
                  }
                  placeholder="Gate instructions, tag colors, herd groups, special numbering, or anything else we should know."
                />
              </label>
            </div>

            <div className="ct-wizard-actions">
              <button
                type="button"
                className="ct-secondary-action"
                onClick={previousStep}
              >
                Back
              </button>

              <button
                type="button"
                className="ct-primary-action"
                onClick={nextStep}
                disabled={!canContinueShipping}
              >
                Review Order
              </button>
            </div>
          </section>
        ) : null}

        {step === 6 ? (
          <section className="ct-step-card">
            <div className="ct-step-heading">
              <p>Order review</p>
              <h1>Review your first Cow Town batch.</h1>
              <span>
                Review everything below. Placing the order securely
                creates your ranch draft, first batch, and living
                Cow Town receipt. Nothing is charged yet.
              </span>
            </div>

            <div className="ct-review-grid">
              <article>
                <span>Ranch plan</span>
                <strong>{selectedPlan.name}</strong>
                <small>
                  {selectedPlan.animalLimit === null
                    ? "Enterprise capacity"
                    : `Up to ${selectedPlan.animalLimit.toLocaleString()} active animals`}
                </small>
                <b>
                  {selectedPlan.monthlyPrice === null
                    ? "Custom monthly pricing"
                    : `${formatCowTownMoney(selectedPlan.monthlyPrice)}/month`}
                </b>
              </article>

              <article>
                <span>First batch</span>
                <strong>{totalQuantity} assignments</strong>
                <small>
                  {effectiveFullTagQuantity > 0
                    ? `${effectiveFullTagQuantity} full tags`
                    : ""}
                  {effectiveFullTagQuantity > 0 &&
                  effectiveStickerQuantity > 0
                    ? " + "
                    : ""}
                  {effectiveStickerQuantity > 0
                    ? `${effectiveStickerQuantity} sticker upgrades`
                    : ""}
                </small>
                <b>
                  {batchMethod === "sequence"
                    ? `${startingNumber} through ${endingNumber}`
                    : batchMethod === "enter-now"
                      ? `${enteredNumberCount} numbers entered`
                      : "Animal list submitted later"}
                </b>
              </article>

              <article>
                <span>Ranch</span>
                <strong>{ranch.ranchName}</strong>
                <small>{ranch.contactName}</small>
                <b>{ranch.email}</b>
              </article>

              <article>
                <span>Shipping</span>
                <strong>
                  {shippingDetails.city},{" "}
                  {shippingDetails.state}
                </strong>
                <small>{shippingDetails.address}</small>
                <b>
                  {shippingCost === 0
                    ? "Tracked shipping included"
                    : `${formatCowTownMoney(shippingCost)} tracked shipping`}
                </b>
              </article>
            </div>

            <div className="ct-final-total">
              <div>
                <span>Physical products</span>
                <strong>
                  {formatCowTownMoney(merchandiseTotal)}
                </strong>
              </div>

              <div>
                <span>Shipping</span>
                <strong>
                  {shippingCost === 0
                    ? "Included"
                    : formatCowTownMoney(shippingCost)}
                </strong>
              </div>

              <div className="ct-total-emphasis">
                <span>One-time order</span>
                <strong>
                  {formatCowTownMoney(oneTimeTotal)}
                </strong>
              </div>

              <div className="ct-total-emphasis">
                <span>Monthly ranch plan</span>
                <strong>
                  {selectedPlan.monthlyPrice === null
                    ? "Custom"
                    : formatCowTownMoney(monthlyTotal)}
                </strong>
              </div>
            </div>

            <div className="ct-wizard-actions">
              <button
                type="button"
                className="ct-secondary-action"
                onClick={previousStep}
              >
                Back
              </button>

              <button
                type="button"
                className="ct-primary-action"
                onClick={placeCowTownOrder}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating Your Cow Town Order..."
                  : "Place Cow Town Order"}
              </button>
            </div>

            {submitError ? (
              <div className="ct-submit-error" role="alert">
                <strong>We could not place the order.</strong>
                <span>{submitError}</span>
                <small>
                  Nothing was charged. Check the information above
                  and try again.
                </small>
              </div>
            ) : null}

            <p className="ct-final-note">
              Your secure order record, first batch, and living
              receipt are created together. Payment will connect
              from the receipt in the next phase.
            </p>
          </section>
        ) : null}
      </section>
    </main>
  );
}

