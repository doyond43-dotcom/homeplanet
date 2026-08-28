import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const BOARD = "okeechobee-live-meat-market";

export default function OkeechobeeMeatMarketContactPage() {
  const [searchParams] = useSearchParams();

  const initialMode =
    searchParams.get("mode") === "question"
      ? "question"
      : searchParams.get("mode") === "order"
        ? "order"
        : "buy";

  const orderSeller = searchParams.get("seller")?.trim() || "Local Seller";
  const orderProduct = searchParams.get("product")?.trim() || "";
  const orderPrice = searchParams.get("price")?.trim() || "";
  const orderListingId = searchParams.get("listingId")?.trim() || "";
  const orderFulfillment =
    searchParams.get("fulfillment")?.trim() || "Either";

  const [mode, setMode] = useState<"buy" | "question" | "order">(initialMode);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState(orderProduct);
  const [quantity, setQuantity] = useState("");
  const [fulfillment, setFulfillment] = useState(
    orderFulfillment.toLowerCase().includes("pickup") &&
    !orderFulfillment.toLowerCase().includes("delivery")
      ? "Pickup"
      : orderFulfillment.toLowerCase().includes("delivery") &&
          !orderFulfillment.toLowerCase().includes("pickup")
        ? "Delivery"
        : "Either"
  );
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [sellerEmailSent, setSellerEmailSent] = useState(false);
  const [error, setError] = useState("");

  const heading = useMemo(() => {
    if (mode === "order") return `Order from ${orderSeller}.`;
    if (mode === "buy") return "Find local food.";
    return "Ask about the market.";
  }, [mode, orderSeller]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanMessage = message.trim();

    if (
      !cleanName ||
      !cleanContact ||
      (mode !== "order" && !cleanMessage)
    ) {
      setError("Please fill in the required fields.");
      return;
    }

    if (mode === "order" && !quantity.trim()) {
      setError("Please add the quantity or amount you want.");
      return;
    }

    setSaving(true);
    setError("");

    const leadId = crypto.randomUUID();

    const savedMessage =
      mode === "order"
        ? [
            "Market Order Request",
            `Seller: ${orderSeller}`,
            `Listing ID: ${orderListingId || "Not provided"}`,
            `Item: ${orderProduct || cleanMessage}`,
            `Price shown: ${orderPrice || "Contact seller"}`,
            `Quantity / Amount: ${quantity.trim()}`,
            `Pickup / Delivery: ${fulfillment}`,
          ].join("\n")
        : mode === "buy"
          ? `Buyer Request\nLooking for: ${cleanMessage}\nPickup / Delivery: ${fulfillment}`
          : `Market Question\n${cleanMessage}`;

    const { error: insertError } = await supabase
      .from("homeplanet_leads")
      .insert({
        id: leadId,
        name: cleanName,
        contact: cleanContact,
        message: savedMessage,
        selected_operation:
          mode === "order"
            ? "Okeechobee Live Meat Market Order"
            : mode === "buy"
              ? "Okeechobee Live Meat Market Buyer Request"
              : "Okeechobee Live Meat Market Question",
        business_name: mode === "order" ? orderSeller : "",
        board_slug: BOARD,
      });

    if (insertError) {
      console.error(insertError);
      setError("Could not send this right now. Please try again.");
      setSaving(false);
      return;
    }

    try {
      const notifyResponse = await fetch("/api/homeplanet-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: mode === "order" ? "okeechobee-meat-market-order" : "homeplanet-contact",
          requestId: leadId,
        }),
      });

      const notifyResult = await notifyResponse.json().catch(() => null);

      if (!notifyResponse.ok || !notifyResult?.accepted) {
        console.warn(
          "[okeechobee-meat-market] email notification was not accepted:",
          notifyResult
        );
      } else if (mode === "order") {
        setSellerEmailSent(true);
      }
    } catch (notifyError) {
      console.warn(
        "[okeechobee-meat-market] email notification failed:",
        notifyError
      );
    }

    setDone(true);
    setSaving(false);
  }

  if (done) {
    return (
      <main style={page}>
        <div style={shell}>
          <div style={card}>
            <div style={eyebrow}>Okeechobee Live Meat Market</div>
            <h1 style={title}>Got it.</h1>
            <p style={subtitle}>
              {mode === "order"
                ? sellerEmailSent
                  ? `Order sent to ${orderSeller}. They'll confirm availability and pickup or delivery details with you.`
                  : `Your order was received, but delivery to ${orderSeller} could not be confirmed.`
                : mode === "buy"
                  ? "Your local food request was sent."
                  : "Your question was sent."}
            </p>

            <Link to="/planet/okeechobee/meat-market" style={primaryButton}>
              Back to the Market
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={shell}>
        <Link to="/planet/okeechobee/meat-market" style={back}>
          Back to Live Meat Market
        </Link>

        <div style={eyebrow}>Okeechobee Live Meat Market</div>
        <h1 style={title}>{heading}</h1>

        {mode !== "order" ? (
          <div style={modeSwitch}>
            <button
              type="button"
              style={mode === "buy" ? activeMode : modeButton}
              onClick={() => setMode("buy")}
            >
              I Want To Buy
            </button>

            <button
              type="button"
              style={mode === "question" ? activeMode : modeButton}
              onClick={() => setMode("question")}
            >
              I Have A Question
            </button>
          </div>
        ) : null}

        <form onSubmit={submit} style={card}>
          {mode === "order" ? (
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "rgba(255,255,255,.06)",
                display: "grid",
                gap: "6px",
              }}
            >
              <strong style={{ fontSize: "18px" }}>{orderSeller}</strong>
              <span>{orderProduct || "Local product"}</span>
              {orderPrice ? (
                <strong style={{ color: "#d9b76f" }}>{orderPrice}</strong>
              ) : null}
            </div>
          ) : null}

          {mode !== "order" ? (
            <label style={label}>
              {mode === "buy"
                ? "What are you looking for?"
                : "What's your question?"}

              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  mode === "buy"
                    ? "Example: 10 lbs ground beef, 2 dozen eggs..."
                    : "Example: How do I list what I sell?"
                }
                style={textarea}
              />
            </label>
          ) : null}

          {mode === "order" ? (
            <label style={label}>
              Quantity or amount
              <input
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Example: 2 dozen, 10 lbs, 1 beef share"
                style={input}
              />
            </label>
          ) : null}

          {mode === "buy" || mode === "order" ? (
            <>
              <div style={label}>Pickup or delivery?</div>

              <div style={choices}>
                {(mode === "order"
                  ? orderFulfillment.toLowerCase().includes("pickup") &&
                    !orderFulfillment.toLowerCase().includes("delivery")
                    ? ["Pickup"]
                    : orderFulfillment.toLowerCase().includes("delivery") &&
                        !orderFulfillment.toLowerCase().includes("pickup")
                      ? ["Delivery"]
                      : ["Pickup", "Delivery", "Either"]
                  : ["Pickup", "Delivery", "Either"]
                ).map((item) => (
                  <button
                    key={item}
                    type="button"
                    style={fulfillment === item ? activeChoice : choice}
                    onClick={() => setFulfillment(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <label style={label}>
            Your name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              style={input}
            />
          </label>

          <label style={label}>
            {mode === "order" ? "Phone number" : "Best contact"}
            <input
              type={mode === "order" ? "tel" : "text"}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder={
                mode === "order"
                  ? "Example: 863-555-1234"
                  : "Phone or email"
              }
              style={input}
            />
          </label>

          {mode === "order" ? (
            <div
              style={{
                fontSize: "12px",
                lineHeight: 1.5,
                opacity: 0.72,
                marginTop: "-4px",
              }}
            >
              We do not sell or give your information to third parties.
            </div>
          ) : null}

          {error ? <div style={errorStyle}>{error}</div> : null}

          <button type="submit" disabled={saving} style={primaryButton}>
            {saving
              ? "Sending..."
              : mode === "order"
                ? "Place Order"
                : mode === "buy"
                  ? "Find It Locally"
                  : "Send Question"}
          </button>

          {mode !== "order" ? (
            <Link
              to="/planet/okeechobee/meat-market/sell"
              style={sellerLink}
            >
              Want to sell something? Add What I Have
            </Link>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 8,
              fontSize: 13,
            }}
          >
            <Link
              to="/privacy"
              style={{ color: "#d9b76f", fontWeight: 800 }}
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              style={{ color: "#d9b76f", fontWeight: 800 }}
            >
              Terms of Use
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#07100b",
  color: "#ffffff",
  padding: "34px 16px 80px",
};

const shell: React.CSSProperties = {
  width: "min(680px, 100%)",
  margin: "0 auto",
};

const back: React.CSSProperties = {
  color: "#d9b76f",
  textDecoration: "none",
  fontWeight: 800,
};

const eyebrow: React.CSSProperties = {
  marginTop: 28,
  color: "#d9b76f",
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: ".12em",
  textTransform: "uppercase",
};

const title: React.CSSProperties = {
  margin: "7px 0 22px",
  fontSize: "clamp(36px, 7vw, 56px)",
};

const modeSwitch: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 16,
  flexWrap: "wrap",
};

const modeButton: React.CSSProperties = {
  minHeight: 42,
  padding: "8px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#152019",
  color: "#ffffff",
  fontWeight: 850,
  cursor: "pointer",
};

const activeMode: React.CSSProperties = {
  ...modeButton,
  background: "#d9b76f",
  color: "#142018",
};

const card: React.CSSProperties = {
  display: "grid",
  gap: 18,
  padding: 22,
  borderRadius: 22,
  background: "#111914",
  border: "1px solid rgba(217,183,111,.22)",
};

const label: React.CSSProperties = {
  display: "grid",
  gap: 8,
  fontWeight: 850,
};

const input: React.CSSProperties = {
  minHeight: 50,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#09100c",
  color: "#ffffff",
  fontSize: 16,
};

const textarea: React.CSSProperties = {
  minHeight: 110,
  padding: 14,
  resize: "vertical",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.12)",
  background: "#09100c",
  color: "#ffffff",
  fontSize: 16,
  fontFamily: "inherit",
};

const choices: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const choice: React.CSSProperties = {
  ...modeButton,
};

const activeChoice: React.CSSProperties = {
  ...choice,
  background: "#d9b76f",
  color: "#142018",
};

const primaryButton: React.CSSProperties = {
  minHeight: 52,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 18px",
  border: 0,
  borderRadius: 12,
  background: "#d9b76f",
  color: "#142018",
  textDecoration: "none",
  fontWeight: 950,
  fontSize: 16,
  cursor: "pointer",
};

const sellerLink: React.CSSProperties = {
  textAlign: "center",
  color: "#d9b76f",
  textDecoration: "none",
  fontWeight: 800,
};

const subtitle: React.CSSProperties = {
  color: "#bac3bd",
  lineHeight: 1.6,
};

const errorStyle: React.CSSProperties = {
  color: "#ffb4b4",
};