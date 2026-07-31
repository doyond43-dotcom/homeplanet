import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CowTownOwnershipTransfer.css";

type TransferPreview = {
  transfer_id: string;
  status: string;
  transfer_method: string;
  auction_name: string | null;
  auction_lot_number: string | null;
  buyer_ranch_name: string;
  buyer_contact_name: string;
  expires_at: string;
  initiated_at: string;
  animal: {
    cow_town_id: string;
    visible_tag_number: string;
    name: string | null;
    breed: string | null;
    sex: string | null;
    color: string | null;
  };
  current_ranch: {
    ranch_name: string;
  };
};

type AcceptedTransfer = {
  cow_town_id: string;
  management_access_token: string;
  status: string;
};

export default function CowTownOwnershipAcceptPage() {
  const { acceptanceToken = "" } = useParams();

  const [transfer, setTransfer] =
    useState<TransferPreview | null>(null);
  const [accepted, setAccepted] =
    useState<AcceptedTransfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenCopied, setTokenCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadTransfer() {
      try {
        const { data, error } = await supabase.rpc(
          "get_cow_town_ownership_transfer",
          {
            requested_acceptance_token: acceptanceToken,
          },
        );

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Ownership transfer not found.");
        }

        if (active) {
          setTransfer(data as TransferPreview);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "We could not load this ownership transfer.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadTransfer();

    return () => {
      active = false;
    };
  }, [acceptanceToken]);

  async function copyManagementToken() {
    if (!accepted?.management_access_token) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        accepted.management_access_token,
      );

      setTokenCopied(true);

      window.setTimeout(() => {
        setTokenCopied(false);
      }, 2500);
    } catch {
      setErrorMessage(
        "The token could not be copied automatically.",
      );
    }
  }

  async function acceptTransfer() {
    if (isAccepting) {
      return;
    }

    setIsAccepting(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.rpc(
        "accept_cow_town_ownership_transfer",
        {
          requested_acceptance_token: acceptanceToken,
        },
      );

      if (error) {
        throw error;
      }

      const result = data as AcceptedTransfer | null;

      if (!result?.management_access_token) {
        throw new Error(
          "The transfer completed, but ranch access was not returned.",
        );
      }

      setAccepted(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not accept this ownership transfer.",
      );
      setIsAccepting(false);
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
          <strong>Buyer acceptance</strong>
        </div>
      </header>

      <section className="ct-transfer-shell">
        <section className="ct-transfer-card">
          {isLoading ? (
            <div className="ct-transfer-state">
              <h1>Loading transfer...</h1>
            </div>
          ) : null}

          {!isLoading && errorMessage && !transfer ? (
            <div className="ct-transfer-state">
              <h1>Transfer unavailable.</h1>
              <p>{errorMessage}</p>
            </div>
          ) : null}

          {transfer && !accepted ? (
            <>
              <div className="ct-transfer-heading">
                <p>Review before accepting</p>
                <h1>Confirm animal ownership.</h1>
                <span>
                  Accepting completes the transfer and creates a
                  private management token for the receiving ranch.
                </span>
              </div>

              <div className="ct-transfer-summary">
                <article>
                  <span>Cow Town ID</span>
                  <strong>{transfer.animal.cow_town_id}</strong>
                </article>

                <article>
                  <span>Visible tag</span>
                  <strong>
                    {transfer.animal.visible_tag_number}
                  </strong>
                </article>

                <article>
                  <span>Current ranch</span>
                  <strong>
                    {transfer.current_ranch.ranch_name}
                  </strong>
                </article>

                <article>
                  <span>Receiving ranch</span>
                  <strong>{transfer.buyer_ranch_name}</strong>
                </article>

                <article>
                  <span>Transfer method</span>
                  <strong>
                    {transfer.transfer_method.replaceAll("-", " ")}
                  </strong>
                </article>

                <article>
                  <span>Auction</span>
                  <strong>
                    {transfer.auction_name || "Not applicable"}
                  </strong>
                </article>
              </div>

              {errorMessage ? (
                <div className="ct-transfer-error" role="alert">
                  <strong>Transfer could not be accepted.</strong>
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              <div className="ct-transfer-actions">
                <button
                  type="button"
                  onClick={acceptTransfer}
                  disabled={
                    isAccepting || transfer.status !== "pending"
                  }
                >
                  {isAccepting
                    ? "Completing transfer..."
                    : transfer.status === "pending"
                      ? "Accept Ownership"
                      : "Transfer No Longer Pending"}
                </button>
              </div>
            </>
          ) : null}

          {accepted ? (
            <div className="ct-transfer-success">
              <p>Transfer completed</p>
              <h1>Ownership is now verified.</h1>

              <span>
                Save this private ranch management token. It is
                required to start future ownership transfers.
              </span>

              <div className="ct-transfer-security-warning">
                <strong>Private ranch access</strong>
                <span>
                  This token can start future ownership transfers.
                  Do not share it, post it, or include it in screenshots.
                </span>
              </div>

              <div className="ct-transfer-token">
                <small>Private management token</small>

                <code aria-label="Masked private management token">
                  XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
                </code>

                <button
                  type="button"
                  onClick={copyManagementToken}
                >
                  {tokenCopied
                    ? "Token Copied"
                    : "Copy Private Token"}
                </button>
              </div>

              <Link
                to={`/planet/cow-town-tags/tag/${accepted.cow_town_id}`}
              >
                Open Animal Page
              </Link>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
