import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  CircleCheck,
  LoaderCircle,
  Send,
  Truck,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL as string | undefined;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env missing for JME rental setup.");
}

const jmeSetupSupabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);

type EquipmentStatus =
  | "available"
  | "coming-soon"
  | "not-for-rental"
  | "not-sure";

type EquipmentItem = {
  id: string;
  label: string;
  detail?: string;
  defaultStatus?: EquipmentStatus;
};

const equipment: EquipmentItem[] = [
  {
    id: "bobcat-t66",
    label: "2022 Bobcat T66",
  },
  {
    id: "bobcat-mt100",
    label: "2021 Bobcat MT100",
  },
  {
    id: "haulotte-3632t",
    label: "2018 Haulotte 3632T",
  },
  {
    id: "big-tex-equipment-trailer",
    label: "18 ft Big Tex equipment trailer",
    detail: "Dovetail, can also haul cars",
  },
  {
    id: "big-tex-dump-trailer",
    label: "2026 Big Tex dump trailer",
    detail: "10-yard, 7x14x4",
  },
  {
    id: "gooseneck-40ft",
    label: "40 ft gooseneck",
    detail: "25k",
  },
  {
    id: "jlg-scissor-lift",
    label: "JLG scissor lift",
  },
  {
    id: "pressure-washer-4400",
    label: "4400 PSI pressure washer",
    detail: "Can connect with the Haulotte man lift",
  },
  {
    id: "commercial-mower",
    label: "Commercial lawn mower",
    detail: "You mentioned this is being added soon",
    defaultStatus: "coming-soon",
  },
  {
    id: "weed-eaters",
    label: "Weed eaters",
  },
  {
    id: "chainsaws",
    label: "Chainsaws",
  },
  {
    id: "hedge-trimmers",
    label: "Hedge trimmers",
  },
  {
    id: "blowers",
    label: "Blowers",
  },
];

const statusOptions: Array<{
  value: EquipmentStatus;
  label: string;
}> = [
  { value: "available", label: "Available now" },
  { value: "coming-soon", label: "Coming soon" },
  { value: "not-for-rental", label: "Not for rental" },
  { value: "not-sure", label: "Not sure" },
];

const rentalPeriods = [
  "Hourly",
  "Half-day",
  "Daily",
  "Weekend",
  "Weekly",
  "Other",
];

const pickupDelivery = [
  "Customer pickup",
  "Delivery",
  "Both",
];

const attachmentOptions = [
  "Bucket",
  "Forks",
  "Grapple",
  "Auger",
  "Brush cutter",
  "Trencher",
  "Other",
];

export default function JmeRentalSetupPage() {
  const initialEquipmentStatus = useMemo(() => {
    return equipment.reduce<Record<string, EquipmentStatus>>(
      (result, item) => {
        result[item.id] =
          item.defaultStatus ?? "not-sure";

        return result;
      },
      {},
    );
  }, []);

  const [equipmentStatus, setEquipmentStatus] =
    useState<Record<string, EquipmentStatus>>(
      initialEquipmentStatus,
    );

  const [selectedPeriods, setSelectedPeriods] =
    useState<string[]>([]);

  const [rentalPeriodNotes, setRentalPeriodNotes] =
    useState("");

  const [selectedPickupDelivery, setSelectedPickupDelivery] =
    useState<string[]>([]);

  const [deliveryPricingMethod, setDeliveryPricingMethod] =
    useState("");

  const [deliveryNotes, setDeliveryNotes] =
    useState("");

  const [depositRequirement, setDepositRequirement] =
    useState("");

  const [agreementRequired, setAgreementRequired] =
    useState("");

  const [attachments, setAttachments] =
    useState<string[]>([]);

  const [attachmentNotes, setAttachmentNotes] =
    useState("");

  const [additionalNotes, setAdditionalNotes] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [error, setError] =
    useState("");

  function toggleArrayValue(
    value: string,
    current: string[],
    setter: (next: string[]) => void,
  ) {
    if (current.includes(value)) {
      setter(
        current.filter(
          (item) => item !== value,
        ),
      );

      return;
    }

    setter([...current, value]);
  }

  async function submitSetup() {
    setError("");
    setSubmitting(true);

    try {
      const { error: submitError } =
        await jmeSetupSupabase
          .from("jme_rental_setup_responses")
          .insert({
            equipment_status: equipmentStatus,
            rental_periods: selectedPeriods,
            rental_period_notes:
              rentalPeriodNotes.trim() || null,
            pickup_delivery:
              selectedPickupDelivery,
            delivery_pricing_method:
              deliveryPricingMethod || null,
            delivery_notes:
              deliveryNotes.trim() || null,
            deposit_requirement:
              depositRequirement || null,
            agreement_required:
              agreementRequired || null,
            bobcat_attachments: attachments,
            attachment_notes:
              attachmentNotes.trim() || null,
            additional_notes:
              additionalNotes.trim() || null,
          });

      if (submitError) {
        throw submitError;
      }

      const equipmentLabels =
        equipment.reduce<Record<string, string>>(
          (result, item) => {
            result[item.id] = item.label;
            return result;
          },
          {},
        );

      const {
        error: emailError,
      } =
        await jmeSetupSupabase.functions.invoke(
          "send-jme-rental-setup-email",
          {
            body: {
              equipment_status:
                equipmentStatus,
              equipment_labels:
                equipmentLabels,
              rental_periods:
                selectedPeriods,
              rental_period_notes:
                rentalPeriodNotes.trim() ||
                null,
              pickup_delivery:
                selectedPickupDelivery,
              delivery_pricing_method:
                deliveryPricingMethod ||
                null,
              delivery_notes:
                deliveryNotes.trim() ||
                null,
              deposit_requirement:
                depositRequirement ||
                null,
              agreement_required:
                agreementRequired ||
                null,
              bobcat_attachments:
                attachments,
              attachment_notes:
                attachmentNotes.trim() ||
                null,
              additional_notes:
                additionalNotes.trim() ||
                null,
            },
          },
        );

      if (emailError) {
        throw emailError;
      }

      setSubmitted(true);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submitError) {
      console.error(
        "JME rental setup submission failed",
        submitError,
      );

      setError(
        "Something did not save. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="jme-setup-page">
        <style>{styles}</style>

        <div className="jme-setup-shell">
          <section className="jme-setup-success">
            <div className="jme-setup-success-icon">
              <CircleCheck
                size={42}
                aria-hidden="true"
              />
            </div>

            <div className="jme-setup-kicker">
              JME RENTAL SETUP
            </div>

            <h1>Got it.</h1>

            <p>
              Your rental setup information was saved.
              This gives us what we need to structure the
              next JME rental build around how you actually
              operate.
            </p>

            <div className="jme-setup-success-note">
              You can always send anything you forgot later.
              We can add it without rebuilding the whole
              system.
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="jme-setup-page">
      <style>{styles}</style>

      <div className="jme-setup-shell">
        <header className="jme-setup-header">
          <div className="jme-setup-brand-row">
            <div className="jme-setup-mark">
              JME
            </div>

            <div>
              <div className="jme-setup-kicker">
                JONES EQUIPMENT RENTAL & REPAIR
              </div>

              <div className="jme-setup-small">
                Rental system setup
              </div>
            </div>
          </div>

          <h1>
            Quick rental setup.
          </h1>

          <p>
            Tap through what applies. This is just enough
            information to build the rental system around
            how JME actually works.
          </p>
        </header>

        <section className="jme-setup-section">
          <div className="jme-setup-section-head">
            <span className="jme-setup-step">
              01
            </span>

            <div>
              <h2>
                What is actually available to rent?
              </h2>

              <p>
                Set the current status for each item.
              </p>
            </div>
          </div>

          <div className="jme-equipment-list">
            {equipment.map((item) => (
              <article
                className="jme-equipment-row"
                key={item.id}
              >
                <div className="jme-equipment-copy">
                  <strong>{item.label}</strong>

                  {item.detail ? (
                    <span>{item.detail}</span>
                  ) : null}
                </div>

                <select
                  aria-label={`${item.label} rental status`}
                  value={equipmentStatus[item.id]}
                  onChange={(event) =>
                    setEquipmentStatus(
                      (current) => ({
                        ...current,
                        [item.id]:
                          event.target
                            .value as EquipmentStatus,
                      }),
                    )
                  }
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>

          <label className="jme-setup-field">
            <span>
              Missing equipment or something you forgot?
            </span>

            <textarea
              value={additionalNotes}
              onChange={(event) =>
                setAdditionalNotes(
                  event.target.value,
                )
              }
              placeholder="Add anything else here..."
              rows={4}
            />
          </label>
        </section>

        <section className="jme-setup-section">
          <div className="jme-setup-section-head">
            <span className="jme-setup-step">
              02
            </span>

            <div>
              <h2>
                How do you normally rent equipment?
              </h2>

              <p>
                Choose every rental period you offer.
              </p>
            </div>
          </div>

          <div className="jme-choice-grid">
            {rentalPeriods.map((period) => {
              const selected =
                selectedPeriods.includes(period);

              return (
                <button
                  className={`jme-choice ${
                    selected
                      ? "jme-choice-selected"
                      : ""
                  }`}
                  key={period}
                  type="button"
                  onClick={() =>
                    toggleArrayValue(
                      period,
                      selectedPeriods,
                      setSelectedPeriods,
                    )
                  }
                >
                  <span>{period}</span>

                  {selected ? (
                    <Check
                      size={19}
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <label className="jme-setup-field">
            <span>
              Pricing notes, if you want to add them now
            </span>

            <textarea
              value={rentalPeriodNotes}
              onChange={(event) =>
                setRentalPeriodNotes(
                  event.target.value,
                )
              }
              placeholder="Example: Most equipment is daily or weekly. Rates depend on machine."
              rows={3}
            />
          </label>
        </section>

        <section className="jme-setup-section">
          <div className="jme-setup-section-head">
            <span className="jme-setup-step">
              03
            </span>

            <div>
              <h2>
                Pickup or delivery?
              </h2>

              <p>
                Tell us how customers normally get the
                equipment.
              </p>
            </div>
          </div>

          <div className="jme-choice-grid">
            {pickupDelivery.map((choice) => {
              const selected =
                selectedPickupDelivery.includes(
                  choice,
                );

              return (
                <button
                  className={`jme-choice ${
                    selected
                      ? "jme-choice-selected"
                      : ""
                  }`}
                  key={choice}
                  type="button"
                  onClick={() =>
                    toggleArrayValue(
                      choice,
                      selectedPickupDelivery,
                      setSelectedPickupDelivery,
                    )
                  }
                >
                  <span>{choice}</span>

                  {selected ? (
                    <Check
                      size={19}
                      aria-hidden="true"
                    />
                  ) : (
                    <Truck
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <label className="jme-setup-field">
            <span>
              How do you price delivery?
            </span>

            <select
              value={deliveryPricingMethod}
              onChange={(event) =>
                setDeliveryPricingMethod(
                  event.target.value,
                )
              }
            >
              <option value="">
                Select one
              </option>

              <option value="flat-fee">
                Flat fee
              </option>

              <option value="mileage">
                Mileage
              </option>

              <option value="depends">
                Depends on equipment / location
              </option>

              <option value="included">
                Included in some rentals
              </option>

              <option value="not-sure">
                Not sure / varies
              </option>
            </select>
          </label>

          <label className="jme-setup-field">
            <span>
              Delivery notes
            </span>

            <textarea
              value={deliveryNotes}
              onChange={(event) =>
                setDeliveryNotes(
                  event.target.value,
                )
              }
              placeholder="Anything we should know about delivery area, pricing, or pickup."
              rows={3}
            />
          </label>
        </section>

        <section className="jme-setup-section">
          <div className="jme-setup-section-head">
            <span className="jme-setup-step">
              04
            </span>

            <div>
              <h2>
                Deposit and rental agreement
              </h2>

              <p>
                Just the basic rule for now.
              </p>
            </div>
          </div>

          <label className="jme-setup-field">
            <span>
              Do you normally require a deposit?
            </span>

            <select
              value={depositRequirement}
              onChange={(event) =>
                setDepositRequirement(
                  event.target.value,
                )
              }
            >
              <option value="">
                Select one
              </option>

              <option value="yes">
                Yes
              </option>

              <option value="no">
                No
              </option>

              <option value="depends">
                Depends on equipment / customer
              </option>

              <option value="not-sure">
                Not sure yet
              </option>
            </select>
          </label>

          <label className="jme-setup-field">
            <span>
              Do you use a rental agreement?
            </span>

            <select
              value={agreementRequired}
              onChange={(event) =>
                setAgreementRequired(
                  event.target.value,
                )
              }
            >
              <option value="">
                Select one
              </option>

              <option value="yes">
                Yes
              </option>

              <option value="no">
                No
              </option>

              <option value="sometimes">
                Sometimes
              </option>

              <option value="need-one">
                Need to create one
              </option>
            </select>
          </label>
        </section>

        <section className="jme-setup-section">
          <div className="jme-setup-section-head">
            <span className="jme-setup-step">
              05
            </span>

            <div>
              <h2>
                What Bobcat attachments do you have?
              </h2>

              <p>
                Select everything that applies.
              </p>
            </div>
          </div>

          <div className="jme-choice-grid">
            {attachmentOptions.map((attachment) => {
              const selected =
                attachments.includes(attachment);

              return (
                <button
                  className={`jme-choice ${
                    selected
                      ? "jme-choice-selected"
                      : ""
                  }`}
                  key={attachment}
                  type="button"
                  onClick={() =>
                    toggleArrayValue(
                      attachment,
                      attachments,
                      setAttachments,
                    )
                  }
                >
                  <span>{attachment}</span>

                  {selected ? (
                    <Check
                      size={19}
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronRight
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <label className="jme-setup-field">
            <span>
              Attachment notes
            </span>

            <textarea
              value={attachmentNotes}
              onChange={(event) =>
                setAttachmentNotes(
                  event.target.value,
                )
              }
              placeholder="Add attachment details or anything not listed."
              rows={3}
            />
          </label>
        </section>

        {error ? (
          <div
            className="jme-setup-error"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <div className="jme-setup-submit-wrap">
          <button
            className="jme-setup-submit"
            type="button"
            disabled={submitting}
            onClick={() => void submitSetup()}
          >
            {submitting ? (
              <>
                <LoaderCircle
                  className="jme-spin"
                  size={21}
                  aria-hidden="true"
                />

                Saving...
              </>
            ) : (
              <>
                <Send
                  size={21}
                  aria-hidden="true"
                />

                Send JME Setup
              </>
            )}
          </button>

          <p>
            You do not have to have every detail figured
            out today. This gives us the structure. We can
            add the smaller rules later.
          </p>
        </div>
      </div>
    </main>
  );
}

const styles = `
  .jme-setup-page {
    min-height: 100vh;
    background:
      radial-gradient(
        circle at top,
        rgba(235, 181, 42, 0.08),
        transparent 30%
      ),
      #080b0d;
    color: #f4f2ec;
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .jme-setup-shell {
    width: min(760px, calc(100% - 28px));
    margin: 0 auto;
    padding: 28px 0 64px;
  }

  .jme-setup-header {
    padding: 22px 0 28px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .jme-setup-brand-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
  }

  .jme-setup-mark {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border: 1px solid rgba(235,181,42,0.55);
    background: #11171a;
    color: #efbb3d;
    font-weight: 950;
    letter-spacing: -0.05em;
  }

  .jme-setup-kicker {
    color: #efbb3d;
    font-size: 0.72rem;
    font-weight: 900;
    letter-spacing: 0.16em;
  }

  .jme-setup-small {
    margin-top: 4px;
    color: #94a0a7;
    font-size: 0.86rem;
  }

  .jme-setup-header h1 {
    margin: 0;
    max-width: 620px;
    font-size: clamp(2.2rem, 7vw, 4rem);
    line-height: 0.96;
    letter-spacing: -0.055em;
  }

  .jme-setup-header > p {
    margin: 18px 0 0;
    max-width: 620px;
    color: #aab3b8;
    font-size: 1rem;
    line-height: 1.65;
  }

  .jme-setup-section {
    padding: 30px 0;
    border-bottom: 1px solid rgba(255,255,255,0.09);
  }

  .jme-setup-section-head {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 14px;
    align-items: start;
    margin-bottom: 20px;
  }

  .jme-setup-step {
    display: grid;
    place-items: center;
    min-height: 38px;
    border: 1px solid rgba(235,181,42,0.35);
    color: #efbb3d;
    font-size: 0.73rem;
    font-weight: 900;
    letter-spacing: 0.08em;
  }

  .jme-setup-section h2 {
    margin: 0;
    font-size: clamp(1.25rem, 4vw, 1.75rem);
    line-height: 1.08;
    letter-spacing: -0.035em;
  }

  .jme-setup-section-head p {
    margin: 7px 0 0;
    color: #8f9ba1;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .jme-equipment-list {
    display: grid;
    gap: 8px;
  }

  .jme-equipment-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(145px, 190px);
    gap: 12px;
    align-items: center;
    padding: 13px;
    border: 1px solid rgba(255,255,255,0.1);
    background: #0d1215;
  }

  .jme-equipment-copy {
    min-width: 0;
  }

  .jme-equipment-copy strong {
    display: block;
    font-size: 0.98rem;
  }

  .jme-equipment-copy span {
    display: block;
    margin-top: 4px;
    color: #87949a;
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .jme-equipment-row select,
  .jme-setup-field select,
  .jme-setup-field textarea {
    width: 100%;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 0;
    background: #080b0d;
    color: #f4f2ec;
    font: inherit;
    outline: none;
  }

  .jme-equipment-row select,
  .jme-setup-field select {
    min-height: 44px;
    padding: 0 11px;
  }

  .jme-setup-field textarea {
    padding: 12px;
    resize: vertical;
    line-height: 1.5;
  }

  .jme-equipment-row select:focus,
  .jme-setup-field select:focus,
  .jme-setup-field textarea:focus {
    border-color: #efbb3d;
    box-shadow: 0 0 0 2px rgba(239,187,61,0.12);
  }

  .jme-setup-field {
    display: grid;
    gap: 8px;
    margin-top: 18px;
  }

  .jme-setup-field > span {
    font-size: 0.84rem;
    font-weight: 800;
    color: #c9ced1;
  }

  .jme-choice-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }

  .jme-choice {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 52px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,0.1);
    background: #0d1215;
    color: #f4f2ec;
    font: inherit;
    font-weight: 800;
    text-align: left;
    cursor: pointer;
  }

  .jme-choice-selected {
    border-color: rgba(239,187,61,0.72);
    background: rgba(239,187,61,0.1);
    color: #f7cf6c;
  }

  .jme-setup-error {
    margin-top: 22px;
    padding: 14px;
    border: 1px solid rgba(248,113,113,0.4);
    background: rgba(127,29,29,0.18);
    color: #fecaca;
  }

  .jme-setup-submit-wrap {
    padding-top: 30px;
  }

  .jme-setup-submit {
    display: inline-flex;
    width: 100%;
    min-height: 58px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid #efbb3d;
    background: #efbb3d;
    color: #090b0c;
    font: inherit;
    font-size: 1rem;
    font-weight: 950;
    cursor: pointer;
  }

  .jme-setup-submit:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  .jme-setup-submit-wrap p {
    margin: 12px auto 0;
    max-width: 600px;
    color: #7f8b91;
    font-size: 0.82rem;
    line-height: 1.5;
    text-align: center;
  }

  .jme-setup-success {
    max-width: 620px;
    margin: 80px auto 0;
    padding: 34px;
    border: 1px solid rgba(239,187,61,0.32);
    background: #0d1215;
  }

  .jme-setup-success-icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: 24px;
    border: 1px solid rgba(239,187,61,0.5);
    color: #efbb3d;
  }

  .jme-setup-success h1 {
    margin: 10px 0 0;
    font-size: clamp(2.5rem, 8vw, 4.5rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  .jme-setup-success > p {
    margin: 18px 0 0;
    color: #aab3b8;
    line-height: 1.65;
  }

  .jme-setup-success-note {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.09);
    color: #87949a;
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .jme-spin {
    animation: jme-spin 0.8s linear infinite;
  }

  @keyframes jme-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 620px) {
    .jme-setup-shell {
      width: min(100% - 20px, 760px);
      padding-top: 12px;
    }

    .jme-setup-header {
      padding-top: 14px;
    }

    .jme-setup-brand-row {
      margin-bottom: 24px;
    }

    .jme-equipment-row {
      grid-template-columns: 1fr;
      gap: 9px;
    }

    .jme-choice-grid {
      grid-template-columns: 1fr;
    }

    .jme-setup-success {
      margin-top: 34px;
      padding: 24px;
    }
  }
`;