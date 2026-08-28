import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const SELLER_TYPE = "Live Meat Market Seller";
const QUESTION_BOARD = "okeechobee-live-meat-market";

export default function OkeechobeeMeatMarketCommandPanel() {
  const [listings, setListings] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      const [listingResult, questionResult] = await Promise.all([
        supabase
          .from("okeechobee_events")
          .select("id,status")
          .eq("type", SELLER_TYPE),

        supabase
          .from("homeplanet_leads")
          .select("id")
          .eq("board_slug", QUESTION_BOARD),
      ]);

      setListings(listingResult.data || []);
      setQuestions(questionResult.data || []);
      setLoading(false);
    }

    loadSummary();
  }, []);

  const pending = useMemo(
    () =>
      listings.filter(
        (item) =>
          String(item.status || "").toLowerCase() === "pending review"
      ).length,
    [listings]
  );

  const live = useMemo(
    () =>
      listings.filter(
        (item) => String(item.status || "").toLowerCase() === "active"
      ).length,
    [listings]
  );

  const paused = useMemo(
    () =>
      listings.filter(
        (item) => String(item.status || "").toLowerCase() === "paused"
      ).length,
    [listings]
  );

  return (
    <section style={section}>
      <div style={topRow}>
        <div>
          <div style={eyebrow}>Okeechobee Live Meat Market</div>

          <h2 style={title}>Live Meat Market</h2>

          <p style={subtitle}>
            Seller listings, buyer requests, availability, and market activity.
          </p>
        </div>

        <Link
          to="/planet/okeechobee/meat-market/command"
          style={openButton}
        >
          Open Market Command Center
        </Link>
      </div>

      <div style={stats}>
        <div style={stat}>
          <span>Buyer Requests</span>
          <strong>{loading ? "-" : questions.length}</strong>
        </div>

        <div style={stat}>
          <span>Pending</span>
          <strong>{loading ? "-" : pending}</strong>
        </div>

        <div style={stat}>
          <span>Live</span>
          <strong>{loading ? "-" : live}</strong>
        </div>

        <div style={stat}>
          <span>Paused / Sold Out</span>
          <strong>{loading ? "-" : paused}</strong>
        </div>

        <div style={stat}>
          <span>Total Listings</span>
          <strong>{loading ? "-" : listings.length}</strong>
        </div>
      </div>
    </section>
  );
}

const section: React.CSSProperties = {
  marginBottom: 34,
  padding: 22,
  borderRadius: 22,
  background: "#101713",
  border: "1px solid rgba(218,183,111,.22)",
};

const topRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 18,
};

const eyebrow: React.CSSProperties = {
  color: "#d9b76f",
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: ".12em",
  textTransform: "uppercase",
};

const title: React.CSSProperties = {
  margin: "5px 0 5px",
  color: "#fff",
  fontSize: 24,
};

const subtitle: React.CSSProperties = {
  margin: 0,
  color: "#9fa9a2",
  lineHeight: 1.5,
};

const openButton: React.CSSProperties = {
  display: "inline-flex",
  minHeight: 44,
  alignItems: "center",
  justifyContent: "center",
  padding: "10px 16px",
  borderRadius: 11,
  background: "#d9b76f",
  color: "#142018",
  textDecoration: "none",
  fontWeight: 900,
};

const stats: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 10,
  marginTop: 18,
};

const stat: React.CSSProperties = {
  display: "grid",
  gap: 5,
  padding: 13,
  borderRadius: 13,
  background: "#17211b",
  border: "1px solid rgba(255,255,255,.07)",
  color: "#9fa9a2",
  fontSize: 12,
};