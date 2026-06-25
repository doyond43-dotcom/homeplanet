import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";

type Lead = {
  id: string;
  createdAt: string;
  businessName: string;
  contactName: string;
  phone: string;
  businessType: string;
  needs: string[];
  notes: string;
  status: string;
  reviewLink?: string;
  paymentLink?: string;
};

const storageKey = "hp-live-page-leads";

const statuses = [
  "Message received",
  "Info confirmed",
  "First version building",
  "Ready for review",
  "Approved and live",
];

const displayStatus = (status: string) =>
  status === "Approved and live" ? "Approved / Activate" : status;

function readLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "[]") as Lead[];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]) {
  localStorage.setItem(storageKey, JSON.stringify(leads));
}

export default function LivePagesLeadBoard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviewDrafts, setReviewDrafts] = useState<Record<string, string>>({});
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const loaded = readLeads();
    setLeads(loaded);

    const reviewLinks: Record<string, string> = {};
    const paymentLinks: Record<string, string> = {};

    loaded.forEach((lead) => {
      reviewLinks[lead.id] = lead.reviewLink || "";
      paymentLinks[lead.id] = lead.paymentLink || "";
    });

    setReviewDrafts(reviewLinks);
    setPaymentDrafts(paymentLinks);
  }, []);

  const counts = useMemo(() => {
    return statuses.map((status) => ({
      status,
      count: leads.filter((lead) => lead.status === status).length,
    }));
  }, [leads]);

  const saveLeads = (next: Lead[]) => {
    setLeads(next);
    writeLeads(next);
  };

  const moveLead = (leadId: string, nextStatus: string) => {
    const next = leads.map((lead) =>
      lead.id === leadId ? { ...lead, status: nextStatus } : lead
    );
    saveLeads(next);
  };

  const deleteLead = (leadId: string) => {
    const next = leads.filter((lead) => lead.id !== leadId);
    saveLeads(next);
  };

  const saveReviewLink = (leadId: string) => {
    const link = (reviewDrafts[leadId] || "").trim();
    const next = leads.map((lead) =>
      lead.id === leadId ? { ...lead, reviewLink: link } : lead
    );
    saveLeads(next);
  };

  const savePaymentLink = (leadId: string) => {
    const link = (paymentDrafts[leadId] || "").trim();
    const next = leads.map((lead) =>
      lead.id === leadId ? { ...lead, paymentLink: link } : lead
    );
    saveLeads(next);
  };

  const copyText = async (text: string) => {
    if (!text.trim()) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy this link:", text);
    }
  };

  const page: CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 50% 0%, rgba(52,211,153,0.12), transparent 30%), linear-gradient(180deg, #050505 0%, #090909 52%, #050505 100%)",
    color: "#f8fafc",
    padding: "24px 18px 72px",
  };

  const wrap: CSSProperties = {
    width: "min(1500px, 100%)",
    margin: "0 auto",
  };

  const nav: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    marginBottom: 34,
  };

  const back: CSSProperties = {
    color: "#a7f3d0",
    textDecoration: "none",
    fontWeight: 950,
  };

  const pill: CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    color: "#e5e7eb",
    padding: "10px 13px",
    textDecoration: "none",
    fontWeight: 950,
    fontSize: 15,
  };

  const eyebrow: CSSProperties = {
    color: "#34d399",
    fontSize: 15,
    fontWeight: 950,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginBottom: 12,
  };

  const h1: CSSProperties = {
    margin: 0,
    fontSize: "clamp(42px, 7vw, 78px)",
    lineHeight: 0.95,
    letterSpacing: "-0.075em",
  };

  const sub: CSSProperties = {
    marginTop: 14,
    color: "#94a3b8",
    lineHeight: 1.55,
    fontSize: 17,
    maxWidth: 760,
  };

  const countGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 10,
    marginTop: 24,
  };

  const countCard: CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(12,12,12,0.84)",
    padding: 16,
  };

  const board: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(310px, 1fr))",
    gap: 12,
    marginTop: 22,
    overflowX: "auto",
    paddingBottom: 8,
  };

  const column: CSSProperties = {
    minWidth: 310,
    borderRadius: 26,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(10,10,10,0.82)",
    padding: 16,
  };

  const leadCard: CSSProperties = {
    marginTop: 10,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.09)",
    background:
      "linear-gradient(135deg, rgba(17,17,17,0.96), rgba(5,5,5,0.96))",
    padding: 18,
  };

  const chipWrap: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  };

  const chip: CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(52,211,153,0.18)",
    background: "rgba(52,211,153,0.08)",
    color: "#bbf7d0",
    padding: "7px 9px",
    fontSize: 15,
    fontWeight: 850,
  };

  const smallBtn: CSSProperties = {
    width: "100%",
    border: "1px solid rgba(52,211,153,0.22)",
    background: "rgba(52,211,153,0.12)",
    color: "#bbf7d0",
    borderRadius: 14,
    padding: "13px 14px",
    fontWeight: 950,
    marginTop: 10,
    cursor: "pointer",
    display: "block",
  };

  const secondaryBtn: CSSProperties = {
    ...smallBtn,
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.52)",
    color: "#e5e7eb",
  };

  const dangerBtn: CSSProperties = {
    ...smallBtn,
    border: "1px solid rgba(248,113,113,0.20)",
    background: "rgba(127,29,29,0.18)",
    color: "#fecaca",
  };

  const input: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.42)",
    color: "#f8fafc",
    padding: "13px 14px",
    fontSize: 14,
    outline: "none",
    marginTop: 9,
  };

  const reviewBox: CSSProperties = {
    marginTop: 10,
    borderRadius: 18,
    border: "1px solid rgba(34,211,238,0.18)",
    background: "rgba(8,47,73,0.22)",
    padding: 14,
  };

  const paymentBox: CSSProperties = {
    marginTop: 10,
    borderRadius: 18,
    border: "1px solid rgba(52,211,153,0.22)",
    background: "rgba(6,78,59,0.20)",
    padding: 14,
  };

  return (
    <main style={page}>
      <div style={wrap}>
        <nav style={nav}>
          <Link to="/planet/live-pages" style={back}>
            Back to Live Pages offer
          </Link>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/planet/get-live" style={pill}>
              Open Intake
            </Link>
            <Link to="/planet/live-pages" style={pill}>
              Offer Page
            </Link>
          </div>
        </nav>

        <div style={eyebrow}>LIVE PAGE LEADS</div>
        <h1 style={h1}>Build queue board.</h1>
        <p style={sub}>
          Every $47/month Live Page request lands here first. Move each business from message received
          to approved and live without losing track of the workflow.
        </p>

        <section style={countGrid}>
          {counts.map((item, index) => (
            <article key={item.status} style={countCard}>
              <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950 }}>
                0{index + 1}
              </div>
              <div style={{ marginTop: 8, fontWeight: 950 }}>{displayStatus(item.status)}</div>
              <div style={{ marginTop: 10, fontSize: 34, fontWeight: 950, color: "#34d399" }}>
                {item.count}
              </div>
            </article>
          ))}
        </section>

        <section style={board}>
          {statuses.map((status, columnIndex) => {
            const columnLeads = leads.filter((lead) => lead.status === status);
            const nextStatus = statuses[columnIndex + 1];
            const previousStatus = statuses[columnIndex - 1];

            return (
              <article key={status} style={column}>
                <div style={{ color: "#34d399", fontSize: 12, fontWeight: 950, letterSpacing: "0.12em" }}>
                  0{columnIndex + 1}
                </div>
                <h2 style={{ margin: "8px 0 0", fontSize: 22, letterSpacing: "-0.04em" }}>
                  {displayStatus(status)}
                </h2>

                {columnLeads.length === 0 ? (
                  <div
                    style={{
                      marginTop: 12,
                      borderRadius: 18,
                      border: "1px dashed rgba(255,255,255,0.10)",
                      color: "#64748b",
                      padding: 18,
                      fontWeight: 850,
                    }}
                  >
                    No requests here yet.
                  </div>
                ) : null}

                {columnLeads.map((lead) => (
                  <div key={lead.id} style={leadCard}>
                    <div style={{ fontSize: 18, fontWeight: 950, color: "#f8fafc" }}>
                      {lead.businessName}
                    </div>

                    <div style={{ marginTop: 5, color: "#94a3b8", fontSize: 13 }}>
                      {lead.businessType}
                    </div>

                    <div style={{ marginTop: 10, color: "#cbd5e1", fontSize: 13, lineHeight: 1.45 }}>
                      <strong>{lead.contactName}</strong>
                      <br />
                      {lead.phone}
                    </div>

                    {lead.needs.length ? (
                      <div style={chipWrap}>
                        {lead.needs.map((need) => (
                          <span key={need} style={chip}>
                            {need}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {lead.notes ? (
                      <div
                        style={{
                          marginTop: 10,
                          borderRadius: 18,
                          background: "rgba(255,255,255,0.035)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          padding: 14,
                          color: "#cbd5e1",
                          fontSize: 14,
                          lineHeight: 1.4,
                        }}
                      >
                        {lead.notes}
                      </div>
                    ) : null}

                    <div style={{ marginTop: 10, color: "#64748b", fontSize: 11 }}>
                      {new Date(lead.createdAt).toLocaleString()}
                    </div>

                    {lead.status === "Ready for review" ? (
                      <div style={reviewBox}>
                        <div style={{ color: "#67e8f9", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em" }}>
                          REVIEW STEP
                        </div>
                        <input
                          style={input}
                          value={reviewDrafts[lead.id] || ""}
                          onChange={(event) =>
                            setReviewDrafts((current) => ({
                              ...current,
                              [lead.id]: event.target.value,
                            }))
                          }
                          placeholder="Paste review link here"
                        />
                        <button type="button" style={smallBtn} onClick={() => saveReviewLink(lead.id)}>
                          Save review link
                        </button>
                        {lead.reviewLink ? (
                          <>
                            <button type="button" style={secondaryBtn} onClick={() => window.open(lead.reviewLink, "_blank")}>
                              Open review page
                            </button>
                            <button type="button" style={secondaryBtn} onClick={() => copyText(lead.reviewLink || "")}>
                              Copy review link
                            </button>
                          </>
                        ) : (
                          <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 }}>
                            Add the customer review URL when the first version is ready.
                          </div>
                        )}
                      </div>
                    ) : null}

                    {lead.status === "Approved and live" ? (
                      <div style={paymentBox}>
                        <div style={{ color: "#34d399", fontSize: 11, fontWeight: 950, letterSpacing: "0.12em" }}>
                          PAYMENT ACTIVATION
                        </div>
                        <div style={{ marginTop: 7, color: "#bbf7d0", fontWeight: 950 }}>
                          $47/month after approval
                        </div>
                        <input
                          style={input}
                          value={paymentDrafts[lead.id] || ""}
                          onChange={(event) =>
                            setPaymentDrafts((current) => ({
                              ...current,
                              [lead.id]: event.target.value,
                            }))
                          }
                          placeholder="Paste Stripe, Square, Cash App, PayPal, invoice, or activation link"
                        />
                        <button type="button" style={smallBtn} onClick={() => savePaymentLink(lead.id)}>
                          Save payment link
                        </button>
                        {lead.paymentLink ? (
                          <>
                            <button type="button" style={secondaryBtn} onClick={() => window.open(lead.paymentLink, "_blank")}>
                              Open payment link
                            </button>
                            <button type="button" style={secondaryBtn} onClick={() => copyText(lead.paymentLink || "")}>
                              Copy payment link
                            </button>
                          </>
                        ) : (
                          <div style={{ marginTop: 8, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 }}>
                            Add the payment or activation link after the customer approves the Live Page System.
                          </div>
                        )}
                      </div>
                    ) : null}

                    {previousStatus ? (
                      <button type="button" style={smallBtn} onClick={() => moveLead(lead.id, previousStatus)}>
                        Move back one step
                      </button>
                    ) : null}

                    {nextStatus ? (
                      <button type="button" style={smallBtn} onClick={() => moveLead(lead.id, nextStatus)}>
                        Move to {displayStatus(nextStatus)}
                      </button>
                    ) : null}

                    <button type="button" style={dangerBtn} onClick={() => deleteLead(lead.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}


