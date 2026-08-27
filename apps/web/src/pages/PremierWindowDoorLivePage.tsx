import { useState } from "react";

type Door = "quote" | "issue" | null;

export default function PremierWindowDoorLivePage() {
  const [door, setDoor] = useState<Door>(null);
  const [submitted, setSubmitted] = useState<Door>(null);

  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quoteAddress, setQuoteAddress] = useState("");
  const [quoteType, setQuoteType] = useState("Windows");
  const [quoteDetails, setQuoteDetails] = useState("");

  const [issueName, setIssueName] = useState("");
  const [issuePhone, setIssuePhone] = useState("");
  const [issueAddress, setIssueAddress] = useState("");
  const [issueType, setIssueType] = useState("Missing Part");
  const [issueDetails, setIssueDetails] = useState("");

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d7d6d2",
    borderRadius: 12,
    background: "#fff",
    color: "#11151a",
    padding: "12px 13px",
    font: "inherit",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "grid",
    gap: 6,
    color: "#42484e",
    fontSize: 12,
    fontWeight: 800,
  };

  const resetForms = () => {
    setDoor(null);
    setSubmitted(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f2ef",
        color: "#11151a",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <header
        style={{
          background: "rgba(7, 10, 14, .96)",
          color: "#fff",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                color: "#9db7ca",
                fontSize: 10,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 1.4,
              }}
            >
              Premier
            </div>

            <strong style={{ fontSize: 17 }}>
              Window & Door Design
            </strong>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitted(null);
              setDoor("quote");
              setTimeout(
                () =>
                  document
                    .getElementById("premier-action")
                    ?.scrollIntoView({ behavior: "smooth" }),
                10
              );
            }}
            style={{
              border: "1px solid rgba(157,183,202,.38)",
              borderRadius: 999,
              background: "rgba(157,183,202,.12)",
              color: "#fff",
              padding: "9px 14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Request a Quote
          </button>
        </div>
      </header>

      <main>
        <section
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,8,10,.88) 0%, rgba(5,8,10,.72) 38%, rgba(5,8,10,.28) 67%, rgba(5,8,10,.12) 100%), url('/images/modern_tropical_home_at_sunset.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: "#fff",
          }}
        >
          <div
            className="premier-hero"
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              padding: "clamp(70px, 10vw, 130px) 18px",
              display: "grid",
              gridTemplateColumns: "minmax(0, 720px)",
              gap: 42,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#9db7ca",
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 14,
                }}
              >
                Windows · Doors · New Construction
              </div>

              <h1
                style={{
                  margin: 0,
                  maxWidth: 760,
                  fontSize: "clamp(42px, 5.5vw, 68px)",
                  lineHeight: 0.94,
                  letterSpacing: "-0.055em",
                }}
              >
                Windows and doors done with precision.
              </h1>

              <p
                style={{
                  maxWidth: 660,
                  margin: "22px 0 0",
                  color: "#b9c1c9",
                  lineHeight: 1.65,
                  fontSize: "clamp(15px, 2vw, 18px)",
                }}
              >
                Impact windows, doors, sliders and new-construction packages —
                measured, ordered, installed and followed through to completion.
              </p>

              <div
                className="premier-hero-actions"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 28,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setDoor("quote");
                    setTimeout(
                      () =>
                        document
                          .getElementById("premier-action")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      10
                    );
                  }}
                  style={{
                    minHeight: 48,
                    border: "1px solid rgba(255,255,255,.78)",
                    borderRadius: 12,
                    background: "#f4f1ea",
                    color: "#0d1116",
                    padding: "11px 18px",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Request a Quote
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setDoor("issue");
                    setTimeout(
                      () =>
                        document
                          .getElementById("premier-action")
                          ?.scrollIntoView({ behavior: "smooth" }),
                      10
                    );
                  }}
                  style={{
                    minHeight: 48,
                    border: "1px solid rgba(255,255,255,.18)",
                    borderRadius: 12,
                    background: "rgba(255,255,255,.04)",
                    color: "#fff",
                    padding: "11px 18px",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  Existing project? Get help →
                </button>
              </div>
            </div>

            </div>
        </section>

        <section
          style={{
            background: "#f4f2ed",
            borderBottom: "1px solid #d8d4cc",
          }}
        >
          <div
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              padding: "clamp(58px, 8vw, 96px) 18px",
            }}
          >
            <div
              style={{
                maxWidth: 720,
                marginBottom: 44,
              }}
            >
              <div
                style={{
                  color: "#73736f",
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 12,
                }}
              >
                What Premier Does
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 5vw, 54px)",
                  lineHeight: 1,
                  letterSpacing: "-0.045em",
                  fontWeight: 700,
                }}
              >
                Built around the opening.
              </h2>
            </div>

            <div
              className="premier-service-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                borderTop: "1px solid #c9c5bc",
                borderBottom: "1px solid #c9c5bc",
              }}
            >
              {[
                [
                  "Replacement Windows",
                  "Impact and replacement window systems for existing homes.",
                ],
                [
                  "Doors & Sliders",
                  "Entry doors, French doors and large sliding systems.",
                ],
                [
                  "New Construction",
                  "Complete window and door packages from plans through installation.",
                ],
              ].map(([title, text], index) => (
                <div
                  key={title}
                  style={{
                    padding: "30px 24px 32px",
                    borderLeft:
                      index === 0 ? "none" : "1px solid #c9c5bc",
                  }}
                >
                  <div
                    style={{
                      color: "#8b8881",
                      fontSize: 11,
                      fontWeight: 800,
                      marginBottom: 18,
                    }}
                  >
                    0{index + 1}
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: 20,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {title}
                  </h3>

                  <p
                    style={{
                      margin: "10px 0 0",
                      color: "#686963",
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#101419",
            color: "#fff",
          }}
        >
          <div
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              padding: "clamp(62px, 8vw, 96px) 18px",
            }}
          >
            <div style={{ maxWidth: 760 }}>
              <div
                style={{
                  color: "#969fa5",
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  marginBottom: 12,
                }}
              >
                From sale to finish
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(34px, 5vw, 54px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.045em",
                  fontWeight: 700,
                }}
              >
                Your project doesn't disappear after the sale.
              </h2>

              <p
                style={{
                  maxWidth: 650,
                  margin: "18px 0 0",
                  color: "#adb4b8",
                  lineHeight: 1.65,
                  fontSize: 15,
                }}
              >
                The measurement, approval, order, installation and final
                completion stay connected to the same project.
              </p>
            </div>

            <div
              className="premier-process-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                marginTop: 44,
                borderTop: "1px solid rgba(255,255,255,.16)",
              }}
            >
              {[
                "Request",
                "Measure",
                "Approve",
                "Order",
                "Install",
                "Final",
              ].map((step, index) => (
                <div
                  key={step}
                  style={{
                    padding: "18px 12px 8px 0",
                  }}
                >
                  <div
                    style={{
                      color: "#727d84",
                      fontSize: 10,
                      fontWeight: 900,
                      marginBottom: 7,
                    }}
                  >
                    0{index + 1}
                  </div>

                  <strong style={{ fontSize: 14 }}>{step}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="premier-action"
          style={{
            maxWidth: 980,
            margin: "0 auto",
            padding: "clamp(58px, 8vw, 92px) 18px",
          }}
        >
          {!door ? (
            <div
              className="premier-cta"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: 28,
                alignItems: "center",
                borderTop: "1px solid #cbc8c1",
                borderBottom: "1px solid #cbc8c1",
                padding: "28px 0",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#777a78",
                    fontSize: 11,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: 1.4,
                  }}
                >
                  Start your project
                </div>

                <h2
                  style={{
                    margin: "8px 0 0",
                    fontSize: "clamp(34px, 4.5vw, 50px)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Ready when you are.
                </h2>
              </div>

              <div
                className="premier-cta-actions"
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setDoor("quote");
                  }}
                  style={{
                    minHeight: 54,
                    border: "1px solid #111820",
                    borderRadius: 6,
                    background: "#111820",
                    color: "#fff",
                    padding: "13px 22px",
                    fontWeight: 900,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Request a Quote
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setDoor("issue");
                  }}
                  style={{
                    minHeight: 54,
                    border: 0,
                    background: "transparent",
                    color: "#34393c",
                    padding: "13px 4px",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "none",
                  }}
                >
                  Already working with Premier? Get help →
                </button>
              </div>
            </div>
          ) : null}
          {door === "quote" ? (
            <div
              style={{
                border: "1px solid #deddd9",
                borderRadius: 22,
                background: "#fff",
                padding: "clamp(20px, 5vw, 34px)",
              }}
            >
              {submitted === "quote" ? (
                <div style={{ textAlign: "center", padding: "25px 5px" }}>
                  <div
                    style={{
                      color: "#557087",
                      fontSize: 11,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Request received
                  </div>

                  <h2 style={{ margin: "10px 0 8px" }}>
                    Thank you, {quoteName || "we've got it"}.
                  </h2>

                  <p style={{ color: "#687169", lineHeight: 1.6 }}>
                    Your request is ready to enter Premier's sales workflow for
                    assignment and measurement follow-up.
                  </p>

                  <button
                    type="button"
                    onClick={resetForms}
                    style={{
                      border: "1px solid #22384b",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #0c1823, #172a3a)",
                      color: "#fff",
                      padding: "10px 16px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                      marginBottom: 22,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#557087",
                          fontSize: 10,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        New project
                      </div>

                      <h2 style={{ margin: "7px 0 0", fontSize: 28 }}>
                        Request a Quote
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={resetForms}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: "#657068",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div
                    className="premier-form-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <label style={labelStyle}>
                      Name
                      <input
                        style={fieldStyle}
                        value={quoteName}
                        onChange={(e) => setQuoteName(e.target.value)}
                      />
                    </label>

                    <label style={labelStyle}>
                      Phone
                      <input
                        style={fieldStyle}
                        value={quotePhone}
                        onChange={(e) => setQuotePhone(e.target.value)}
                      />
                    </label>

                    <label style={labelStyle}>
                      Email
                      <input
                        style={fieldStyle}
                        type="email"
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                      />
                    </label>

                    <label style={labelStyle}>
                      Project Address
                      <input
                        style={fieldStyle}
                        value={quoteAddress}
                        onChange={(e) => setQuoteAddress(e.target.value)}
                      />
                    </label>
                  </div>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    Project Type
                    <select
                      style={fieldStyle}
                      value={quoteType}
                      onChange={(e) => setQuoteType(e.target.value)}
                    >
                      <option>Windows</option>
                      <option>Doors</option>
                      <option>Windows + Doors</option>
                      <option>New Construction</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    What are you looking to have done?
                    <textarea
                      style={{
                        ...fieldStyle,
                        resize: "vertical",
                      }}
                      rows={4}
                      value={quoteDetails}
                      onChange={(e) => setQuoteDetails(e.target.value)}
                    />
                  </label>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    Photos
                    <input
                      style={fieldStyle}
                      type="file"
                      multiple
                      accept="image/*"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={
                      !quoteName.trim() ||
                      !quotePhone.trim() ||
                      !quoteAddress.trim()
                    }
                    onClick={() => setSubmitted("quote")}
                    style={{
                      width: "100%",
                      minHeight: 50,
                      marginTop: 18,
                      border: "1px solid #22384b",
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #0c1823, #172a3a)",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 15,
                      cursor: "pointer",
                      opacity:
                        !quoteName.trim() ||
                        !quotePhone.trim() ||
                        !quoteAddress.trim()
                          ? 0.45
                          : 1,
                    }}
                  >
                    Send My Request
                  </button>
                </>
              )}
            </div>
          ) : null}

          {door === "issue" ? (
            <div
              style={{
                border: "1px solid #deddd9",
                borderRadius: 22,
                background: "#fff",
                padding: "clamp(20px, 5vw, 34px)",
              }}
            >
              {submitted === "issue" ? (
                <div style={{ textAlign: "center", padding: "25px 5px" }}>
                  <div
                    style={{
                      color: "#8b5d28",
                      fontSize: 11,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Issue documented
                  </div>

                  <h2 style={{ margin: "10px 0 8px" }}>
                    Your issue has been recorded.
                  </h2>

                  <p style={{ color: "#687169", lineHeight: 1.6 }}>
                    In the connected system this creates a Needs Attention item
                    on the existing job so it can be owned, followed through,
                    and resolved.
                  </p>

                  <button
                    type="button"
                    onClick={resetForms}
                    style={{
                      border: "1px solid #22384b",
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #0c1823, #172a3a)",
                      color: "#fff",
                      padding: "10px 16px",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                      marginBottom: 22,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#8b5d28",
                          fontSize: 10,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        Existing project
                      </div>

                      <h2 style={{ margin: "7px 0 0", fontSize: 28 }}>
                        Report an Issue
                      </h2>

                      <div
                        style={{
                          color: "#687169",
                          fontSize: 13,
                          marginTop: 7,
                        }}
                      >
                        Put the issue directly on the project instead of relying
                        on a phone call or text being remembered.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetForms}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: "#657068",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div
                    className="premier-form-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <label style={labelStyle}>
                      Customer Name
                      <input
                        style={fieldStyle}
                        value={issueName}
                        onChange={(e) => setIssueName(e.target.value)}
                      />
                    </label>

                    <label style={labelStyle}>
                      Phone
                      <input
                        style={fieldStyle}
                        value={issuePhone}
                        onChange={(e) => setIssuePhone(e.target.value)}
                      />
                    </label>
                  </div>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    Project Address
                    <input
                      style={fieldStyle}
                      value={issueAddress}
                      onChange={(e) => setIssueAddress(e.target.value)}
                    />
                  </label>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    What type of issue?
                    <select
                      style={fieldStyle}
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                    >
                      <option>Missing Part</option>
                      <option>Damage / Scratch</option>
                      <option>Adjustment</option>
                      <option>Leak / Water</option>
                      <option>Touch-Up</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    Tell us what needs attention
                    <textarea
                      style={{
                        ...fieldStyle,
                        resize: "vertical",
                      }}
                      rows={4}
                      value={issueDetails}
                      onChange={(e) => setIssueDetails(e.target.value)}
                    />
                  </label>

                  <label
                    style={{
                      ...labelStyle,
                      marginTop: 12,
                    }}
                  >
                    Add Photos
                    <input
                      style={fieldStyle}
                      type="file"
                      multiple
                      accept="image/*"
                    />
                  </label>

                  <button
                    type="button"
                    disabled={
                      !issueName.trim() ||
                      !issuePhone.trim() ||
                      !issueAddress.trim() ||
                      !issueDetails.trim()
                    }
                    onClick={() => setSubmitted("issue")}
                    style={{
                      width: "100%",
                      minHeight: 50,
                      marginTop: 18,
                      border: "1px solid #765224",
                      borderRadius: 12,
                      background: "#6a461e",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 15,
                      cursor: "pointer",
                      opacity:
                        !issueName.trim() ||
                        !issuePhone.trim() ||
                        !issueAddress.trim() ||
                        !issueDetails.trim()
                          ? 0.45
                          : 1,
                    }}
                  >
                    Submit Issue
                  </button>
                </>
              )}
            </div>
          ) : null}
        </section>
      </main>

      <footer
        style={{
          background: "#0e1216",
          color: "#fff",
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            padding: "38px 18px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <strong style={{ fontSize: 17 }}>
              Premier Window & Door Design
            </strong>

            <div
              style={{
                marginTop: 7,
                color: "#949ca2",
                fontSize: 12,
              }}
            >
              Windows · Doors · New Construction
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 9,
                justifyItems: "start",
              }}
            >
              <div
                style={{
                  color: "#7f888e",
                  fontSize: 10,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 1.3,
                  marginBottom: 2,
                }}
              >
                Contact Premier
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(null);
                  setDoor("quote");
                  setTimeout(
                    () =>
                      document
                        .getElementById("premier-action")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    10
                  );
                }}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#e0e3e5",
                  padding: 0,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "none",
                }}
              >
                Ask us a question →
              </button>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(null);
                  setDoor("issue");
                  setTimeout(
                    () =>
                      document
                        .getElementById("premier-action")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    10
                  );
                }}
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#aab1b6",
                  padding: 0,
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "none",
                }}
              >
                Existing project? Get help →
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              padding: "16px 18px 20px",
              color: "#737a80",
              fontSize: 11,
              textAlign: "center",
            }}
          >
            © 2026 Premier Window & Door Design. All rights reserved.
          </div>
        </div>
      </footer>

      <style>{`
        button {
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease,
            background 160ms ease,
            filter 160ms ease;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
          filter: brightness(1.045);
          box-shadow: 0 10px 26px rgba(0,0,0,.12);
        }

        button:not(:disabled):active {
          transform: translateY(0);
        }

        input,
        select,
        textarea {
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #7d9bb2 !important;
          box-shadow: 0 0 0 3px rgba(101,139,168,.12);
        }

        @media (max-width: 720px) {
          .premier-hero,
          .premier-service-grid,
          .premier-door-grid,
          .premier-form-grid {
            grid-template-columns: 1fr !important;
          }

          .premier-hero {
            gap: 25px !important;
          }

          .premier-hero-actions {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}







