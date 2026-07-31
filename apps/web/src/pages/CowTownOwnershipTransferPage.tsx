import { FormEvent, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownOwnershipTransfer.css";

type TransferMethod =
  | "livestock-auction"
  | "private-sale"
  | "ranch-transfer"
  | "inheritance"
  | "other";

export default function CowTownOwnershipTransferPage() {
  const { managementToken = "" } = useParams();
  const navigate = useNavigate();

  const [cowTownId, setCowTownId] = useState("CT-0847");
  const [buyerRanchName, setBuyerRanchName] = useState("");
  const [buyerContactName, setBuyerContactName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [transferMethod, setTransferMethod] =
    useState<TransferMethod>("livestock-auction");
  const [auctionName, setAuctionName] = useState("");
  const [auctionLotNumber, setAuctionLotNumber] = useState("");
  const [transferNotes, setTransferNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function submitTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const { data, error } = await supabase.rpc(
        "initiate_cow_town_ownership_transfer",
        {
          requested_management_token: managementToken,
          requested_payload: {
            cow_town_id: cowTownId,
            buyer_ranch_name: buyerRanchName,
            buyer_contact_name: buyerContactName,
            buyer_email: buyerEmail,
            buyer_phone: buyerPhone,
            transfer_method: transferMethod,
            auction_name:
              transferMethod === "livestock-auction"
                ? auctionName
                : null,
            auction_lot_number:
              transferMethod === "livestock-auction"
                ? auctionLotNumber || null
                : null,
            transfer_notes: transferNotes || null,
          },
        },
      );

      if (error) {
        throw error;
      }

      const result = data as {
        accept_path?: string;
      } | null;

      if (!result?.accept_path) {
        throw new Error(
          "The transfer was created, but the acceptance link was not returned.",
        );
      }

      navigate(result.accept_path);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We could not start the ownership transfer.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="ct-transfer-page">
      <header className="ct-transfer-header">
        <Link to="/planet/cow-town-tags" className="ct-transfer-back">
          Back to Cow Town Tags
        </Link>

        <div>
          <p>Cow Town Tags</p>
          <strong>Verified ownership transfer</strong>
        </div>
      </header>

      <section className="ct-transfer-shell">
        <form className="ct-transfer-card" onSubmit={submitTransfer}>
          <div className="ct-transfer-heading">
            <p>Seller or current ranch</p>
            <h1>Start an ownership transfer.</h1>
            <span>
              The buyer must accept before the animal record changes
              ownership. The prior ownership record remains preserved.
            </span>
          </div>

          <div className="ct-transfer-form">
            <label className="ct-transfer-field ct-transfer-wide">
              <span>Cow Town ID</span>
              <input
                value={cowTownId}
                onChange={(event) =>
                  setCowTownId(event.target.value.toUpperCase())
                }
                placeholder="CT-0847"
                required
              />
            </label>

            <label className="ct-transfer-field ct-transfer-wide">
              <span>Transfer method</span>
              <select
                value={transferMethod}
                onChange={(event) =>
                  setTransferMethod(
                    event.target.value as TransferMethod,
                  )
                }
              >
                <option value="livestock-auction">
                  Livestock auction
                </option>
                <option value="private-sale">Private sale</option>
                <option value="ranch-transfer">
                  Ranch transfer
                </option>
                <option value="inheritance">Inheritance</option>
                <option value="other">Other</option>
              </select>
            </label>

            {transferMethod === "livestock-auction" ? (
              <>
                <label className="ct-transfer-field">
                  <span>Auction name</span>
                  <input
                    value={auctionName}
                    onChange={(event) =>
                      setAuctionName(event.target.value)
                    }
                    placeholder="Okeechobee Livestock Market"
                    required
                  />
                </label>

                <label className="ct-transfer-field">
                  <span>Auction lot number</span>
                  <input
                    value={auctionLotNumber}
                    onChange={(event) =>
                      setAuctionLotNumber(event.target.value)
                    }
                    placeholder="Optional"
                  />
                </label>
              </>
            ) : null}

            <label className="ct-transfer-field ct-transfer-wide">
              <span>Receiving ranch or operation</span>
              <input
                value={buyerRanchName}
                onChange={(event) =>
                  setBuyerRanchName(event.target.value)
                }
                placeholder="Buyer ranch name"
                required
              />
            </label>

            <label className="ct-transfer-field">
              <span>Buyer contact</span>
              <input
                value={buyerContactName}
                onChange={(event) =>
                  setBuyerContactName(event.target.value)
                }
                placeholder="Full name"
                required
              />
            </label>

            <label className="ct-transfer-field">
              <span>Buyer phone</span>
              <input
                value={buyerPhone}
                onChange={(event) =>
                  setBuyerPhone(event.target.value)
                }
                placeholder="Best number"
                required
              />
            </label>

            <label className="ct-transfer-field ct-transfer-wide">
              <span>Buyer email</span>
              <input
                type="email"
                value={buyerEmail}
                onChange={(event) =>
                  setBuyerEmail(event.target.value)
                }
                placeholder="Acceptance link recipient"
                required
              />
            </label>

            <label className="ct-transfer-field ct-transfer-wide">
              <span>Transfer notes</span>
              <textarea
                rows={5}
                value={transferNotes}
                onChange={(event) =>
                  setTransferNotes(event.target.value)
                }
                placeholder="Sale details, pickup notes, condition, or other private transfer information."
              />
            </label>
          </div>

          {submitError ? (
            <div className="ct-transfer-error" role="alert">
              <strong>Transfer could not be started.</strong>
              <span>{submitError}</span>
            </div>
          ) : null}

          <div className="ct-transfer-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Creating transfer..."
                : "Create Buyer Acceptance Link"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
