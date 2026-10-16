
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type Inquiry = {
  id: string;
  name: string;
  contact: string;
  request: string;
  createdAt: string;
  status: string;
};

export default function OkeechobeeMeatMarketSellerInboxPage() {
  const { slug } = useParams();
  const [token] = useState(() =>
    window.location.hash.replace(/^#/, "").trim()
  );
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (!slug || !token) {
      setError("Open this inbox from your private seller dashboard.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadInbox() {
      try {
        const response = await fetch(
          "/api/okeechobee-meat-market?route=seller-manage",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "load",
              slug,
              token,
            }),
            signal: controller.signal,
          }
        );

        const result = await response.json();

        if (!response.ok || result.ok !== true) {
          throw new Error(result.error || "Could not load inbox.");
        }

        const rows: Inquiry[] = Array.isArray(result.inquiries)
          ? result.inquiries
          : [];

        setInquiries(rows);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Could not load inbox."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadInbox();
    return () => controller.abort();
  }, [slug, token]);

  async function updateInquiryStatus(
    inquiryId: string,
    status: "New" | "Contacted" | "Completed"
  ) {
    if (!slug || !token || savingId) return;

    setSavingId(inquiryId);
    setStatusError("");

    try {
      const response = await fetch(
        "/api/okeechobee-meat-market?route=seller-manage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-inquiry-status",
            slug,
            token,
            inquiryId,
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || "Could not save customer status.");
      }

      if (result.inquiryId !== inquiryId || result.status !== status) {
        throw new Error("Unexpected status save response.");
      }

      setInquiries((current) =>
        current.map((item) =>
          item.id === inquiryId ? { ...item, status } : item
        )
      );
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : "Could not save customer status."
      );
    } finally {
      setSavingId("");
    }
  }

  const filtered = inquiries.filter((item) =>
    `${item.name} ${item.contact} ${item.request}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const selected =
    filtered.find((item) => item.id === selectedId) || null;

  const card: React.CSSProperties = {
    background: "#fffdf8",
    border: "1px solid #d6cebd",
    borderRadius: 14,
    padding: 18,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f2e8",
        color: "#17231b",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "24px 16px 70px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <Link
          to={`/planet/okeechobee/meat-market/seller/setup/${slug}#${token}`}
          style={{ color: "#193c2b", textDecoration: "none", fontWeight: 700 }}
        >
          ← Back to Seller Dashboard
        </Link>

        <header style={{ margin: "28px 0" }}>
          <div
            style={{
              color: "#8a6a38", fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            OKEECHOBEE LIVE MARKET
          </div>

          <h1 style={{ fontSize: 32, margin: "12px 0 8px" }}>
            Customer Inbox
          </h1>

          <p style={{ color: "#59665d" }}>
            {inquiries.length} customer requests
          </p>
        </header>

        {loading && <p>Loading customer inquiries...</p>}

        {error && (
          <p role="alert" style={{ color: "#a32828" }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <input
              aria-label="Search inquiries"
              placeholder="Search customers or requests..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: 15,
                borderRadius: 12,
                border: "1px solid #d6cebd",
                background: "#fffdf8", color: "#17231b",
                fontSize: 15,
                marginBottom: 20,
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
                gap: 16,
                alignItems: "start",
              }}
            >
              <section style={{ display: "grid", gap: 10 }}>
                {filtered.length === 0 && (
                  <div style={card}>No matching inquiries.</div>
                )}

                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(item.id);
                      setStatusError("");
                    }}
                    style={{
                      ...card,
                      textAlign: "left", color: "#17231b",
                      cursor: "pointer",
                      borderColor:
                        selectedId === item.id
                          ? "#dab85e"
                          : "#d6cebd",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <strong>{item.name || "Customer"}</strong>
                      <span style={{ color: "#dab85e" }}>
                        {item.status || "New"}
                      </span>
                    </div>

                    <p
                      style={{
                        color: "#59665d",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        marginBottom: 0,
                      }}
                    >
                      {item.request || "No details provided"}
                    </p>
                  </button>
                ))}
              </section>

              <section style={card}>
                {!selected ? (
                  <p style={{ color: "#59665d" }}>
                    Select a customer request to view details.
                  </p>
                ) : (
                  <>
                    <h2>{selected.name || "Customer"}</h2>

                    <div
                      aria-label="Customer inquiry status"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        margin: "14px 0 18px",
                      }}
                    >
                      {(["New", "Contacted", "Completed"] as const).map(
                        (status) => {
                          const active =
                            (selected.status || "New") === status;

                          return (
                            <button
                              key={status}
                              type="button"
                              disabled={Boolean(savingId)}
                              aria-pressed={active}
                              onClick={() =>
                                void updateInquiryStatus(selected.id, status)
                              }
                              style={{
                                padding: "10px 14px",
                                borderRadius: 10,
                                border: active
                                  ? "2px solid #dab85e"
                                  : "1px solid #cbd5cb",
                                background: active
                                  ? "#dab85e"
                                  : "#edf3ed",
                                color: "#193c2b",
                                fontWeight: 700,
                                cursor: savingId ? "wait" : "pointer",
                                opacity: savingId ? 0.7 : 1,
                              }}
                            >
                              {status}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {savingId === selected.id && (
                      <p role="status">Saving status...</p>
                    )}

                    {statusError && (
                      <p role="alert" style={{ color: "#a32828" }}>
                        {statusError}
                      </p>
                    )}

                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        lineHeight: 1.7,
                      }}
                    >
                      {selected.request}
                    </p>

                    <p
                      style={{
                        color: "#59665d",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {selected.contact}
                    </p>

                    {selected.createdAt &&
                      !Number.isNaN(Date.parse(selected.createdAt)) && (
                        <p style={{ color: "#59665d" }}>
                          {new Date(selected.createdAt).toLocaleString()}
                        </p>
                      )}

                    {(() => {
                      const contact = selected.contact.trim();
                      const isEmail =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
                      const phone = contact.replace(/[^0-9+]/g, "");
                      const href = isEmail
                        ? `mailto:${contact}`
                        : /^\+?[0-9]{7,15}$/.test(phone)
                          ? `tel:${phone}`
                          : "";

                      return href ? (
                        <a
                          href={href}
                          style={{
                            display: "inline-block",
                            marginTop: 12,
                            background: "#dab85e",
                            color: "#17231b",
                            padding: "13px 20px",
                            borderRadius: 10,
                            textDecoration: "none",
                            fontWeight: 800,
                          }}
                        >
                          {isEmail ? "Email Customer" : "Call Customer"}
                        </a>
                      ) : null;
                    })()}
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
