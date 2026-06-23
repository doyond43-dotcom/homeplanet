import { useState } from "react";

type Barber = {
  name: string;
  status: string;
  specialty: string;
};

type FreshCut = {
  title: string;
  image: string;
  slug: string;
  barber: string;
  posted: string;
};

const barbers: Barber[] = [
  { name: "Miguel", status: "Booked till 4:30 • 1 waiting", specialty: "Fades + designs" },
  { name: "Carlos", status: "Next opening 1:15 • Walk-ins open • 2 in queue", specialty: "Clean cuts + lineups" },
  { name: "Angel", status: "Walk-ins open • 2 in queue", specialty: "Kids cuts + quick cuts" },
  { name: "Junior", status: "Finishing current cut • Chair active", specialty: "Beards + detail work" },
];

const freshCuts: FreshCut[] = [
  { title: "Sharp fade + design", image: "/images/all-clean-cuts-fade-design-01.jpg", slug: "sharp-fade-design", barber: "Miguel", posted: "Posted 12 min ago" },
  { title: "Meet the shop", image: "/images/all-clean-cuts-boxing-pose.jpg", slug: "meet-the-shop", barber: "Carlos", posted: "Fresh shop moment" },
  { title: "Okeechobee shop energy", image: "/images/all-clean-cuts-red-truck.jpg", slug: "okeechobee-shop-energy", barber: "All Clean Cuts", posted: "Local favorite" },
  { title: "Community cuts", image: "/images/all-clean-cuts-family-party.jpg", slug: "community-cuts", barber: "The crew", posted: "Community memory" },
];

export default function AllCleanCutsFrontDoor() {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedCut, setSelectedCut] = useState<FreshCut | null>(null);
  const [walkInOpen, setWalkInOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cutType, setCutType] = useState("Fresh cut");
  const [timeWanted, setTimeWanted] = useState("Next available");

  function sendBookingRequest() {
    if (!selectedBarber) return;

    const message = `All Clean Cuts booking request:
Barber: ${selectedBarber.name}
Name: ${customerName || "Customer"}
Phone: ${customerPhone || "Not added"}
Cut: ${cutType}
Time: ${timeWanted}`;

    window.location.href = `sms:8636234490?&body=${encodeURIComponent(message)}`;
  }

  return (
    <main style={page}>
      <section style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div style={stripeGlow} />

        <header style={hero}>
          <img src="/images/all-clean-cuts-team.jpg" alt="All Clean Cuts team" style={heroImage} />
          <div style={heroShade} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={badge}>ALL CLEAN CUTS - EST. 2017 - LIVE BARBER FLOW</div>

            <h1 style={heroTitle}>All Clean Cuts Live</h1>

            <p style={heroText}>Sharp fades. Clean lines. Real Okeechobee barbershop energy.</p>

            <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={primaryButton} onClick={() => setSelectedBarber(barbers[0])}>
                Book Your Barber
              </button>
              <button
              onMouseEnter={(e) => {
                if (e.currentTarget.innerText.includes("Book Your Barber")) return;
                e.currentTarget.style.border = "1px solid rgba(96,165,250,0.72)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.24)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))";
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget.innerText.includes("Book Your Barber")) return;
                e.currentTarget.style.border = "1px solid rgba(96,165,250,0.22)";
                e.currentTarget.style.boxShadow = "0 0 0 rgba(59,130,246,0)";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.background = "rgba(2,6,23,0.72)";
              }}
              style={button} onClick={() => (window.location.href = "tel:8636234490")}>
                Call The Shop
              </button>
              <button
              onMouseEnter={(e) => {
                if (e.currentTarget.innerText.includes("Book Your Barber")) return;
                e.currentTarget.style.border = "1px solid rgba(96,165,250,0.72)";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.24)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))";
              }}
              onMouseLeave={(e) => {
                if (e.currentTarget.innerText.includes("Book Your Barber")) return;
                e.currentTarget.style.border = "1px solid rgba(96,165,250,0.22)";
                e.currentTarget.style.boxShadow = "0 0 0 rgba(59,130,246,0)";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.background = "rgba(2,6,23,0.72)";
              }}
              style={button} onClick={() => setWalkInOpen(true)}>
                Walk-In Check-In
              </button>
              <button
                style={button}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(96,165,250,0.72)";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(59,130,246,0.24)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(148,163,184,0.24)";
                  e.currentTarget.style.boxShadow = "0 0 0 rgba(59,130,246,0)";
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.background = "rgba(15,23,42,0.62)";
                }}
                onClick={() => document.getElementById("fresh-cut-wall")?.scrollIntoView({ behavior: "smooth" })}
              >
                Fresh Cut Wall
              </button>
            </div>
          </div>
        </header>

        <section style={mainGrid}>
          <div style={panel}>
            <h2 style={sectionTitle}>Choose Your Barber</h2>

            <div style={{ display: "grid", gap: 12 }}>
              {barbers.map((barber) => (
                <div key={barber.name} style={barberCard}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 950 }}>{barber.name}</div>
                    <div style={{ color: "rgba(226,232,240,0.62)", marginTop: 5 }}>{barber.status}</div>
                    <div style={{ color: "#93c5fd", marginTop: 6, fontWeight: 850 }}>{barber.specialty}</div>
                  </div>

                  <button style={smallButton} onClick={() => setSelectedBarber(barber)}>
                    Book
                  </button>
                </div>
              ))}
            </div>

            <div style={shopInfoCard}>
              <div style={{ fontWeight: 950, fontSize: 18 }}>All Clean Cuts Barber Shop</div>
              <div style={{ marginTop: 8, color: "rgba(226,232,240,0.68)" }}>
                416 NE Park Street, Okeechobee, FL 34972
              </div>
              <div style={{ marginTop: 6, color: "rgba(226,232,240,0.68)" }}>(863) 623-4490</div>
              <div style={{ marginTop: 10, color: "#93c5fd", fontWeight: 900 }}>
                100% recommended - Est. 2017
              </div>
            </div>
          </div>

          <div style={panel} id="fresh-cut-wall">
            <h2 style={sectionTitle}>Fresh Cut Wall</h2>

            <div style={{ display: "grid", gap: 12 }}>
              {freshCuts.map((item) => (
                <button key={item.title} style={freshCardButton} onClick={() => window.location.assign(`/planet/all-clean-cuts/fresh-cut/${item.slug}`)}>
                  <div style={{ position: "relative" }}>
                    <img src={item.image} alt={item.title} style={freshImage} />
                    <div style={{
                      position: "absolute",
                      left: 12,
                      top: 12,
                      borderRadius: 999,
                      background: "rgba(2,6,23,0.78)",
                      border: "1px solid rgba(239,68,68,0.28)",
                      color: "white",
                      padding: "7px 10px",
                      fontSize: 11,
                      fontWeight: 950,
                      letterSpacing: 1,
                    }}>
                      FRESH CUT
                    </div>
                  </div>
                  <div style={{ fontWeight: 950 }}>{item.title}</div>
                  <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 10, color: "#93c5fd", fontSize: 12, fontWeight: 900 }}>
                    <span>Cut by {item.barber}</span>
                    <span>{item.posted}</span>
                  </div>
                  <div style={{ color: "rgba(226,232,240,0.58)", marginTop: 5 }}>
                    Snap photo - Share cut - Tag barber
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </section>

      {selectedBarber ? (
        <div style={overlay} onClick={() => setSelectedBarber(null)}>
          <div style={drawer} onClick={(event) => event.stopPropagation()}>
            <div style={badge}>BOOK YOUR BARBER</div>
            <h2 style={{ fontSize: 36, margin: "14px 0 8px" }}>{selectedBarber.name}</h2>
            <div style={{ color: "#93c5fd", fontWeight: 900 }}>{selectedBarber.status}</div>

            <input style={field} placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <input style={field} placeholder="Your phone number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            <input style={field} placeholder="Cut type" value={cutType} onChange={(e) => setCutType(e.target.value)} />
            <input style={field} placeholder="Preferred time" value={timeWanted} onChange={(e) => setTimeWanted(e.target.value)} />

            <button style={{ ...primaryButton, width: "100%", marginTop: 14 }} onClick={sendBookingRequest}>
              Text Booking Request
            </button>

            <button style={{ ...button, width: "100%", marginTop: 10 }} onClick={() => setSelectedBarber(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {selectedCut ? (
        <div style={overlay} onClick={() => setSelectedCut(null)}>
          <div style={drawer} onClick={(event) => event.stopPropagation()}>
            <img src={selectedCut.image} alt={selectedCut.title} style={{ width: "100%", borderRadius: 22, maxHeight: 460, objectFit: "cover" }} />
            <h2 style={{ fontSize: 30, margin: "16px 0 6px" }}>{selectedCut.title}</h2>
            <div style={{ color: "rgba(226,232,240,0.68)" }}>Fresh cut moment ready to share.</div>

            <button
              style={{ ...primaryButton, width: "100%", marginTop: 16 }}
              onClick={() => {
                const shareUrl = `${window.location.origin}/planet/all-clean-cuts/fresh-cut/${selectedCut.slug}`;
                const message = `Check out this fresh cut from All Clean Cuts: ${shareUrl}`;
                window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
              }}
            >
              Share This Cut
            </button>

            <button style={{ ...button, width: "100%", marginTop: 10 }} onClick={() => setSelectedCut(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
          {walkInOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.82)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              borderRadius: 28,
              border: "1px solid rgba(96,165,250,0.24)",
              background:
                "linear-gradient(160deg, rgba(8,47,73,0.96), rgba(2,6,23,0.96))",
              padding: 28,
              boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            }}
          >
            <div style={eyebrow}>WALK-IN CHECK-IN</div>

            <h2 style={{ marginTop: 18, fontSize: 38, fontWeight: 1000 }}>
              Join the waitlist
            </h2>

            <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
              <input placeholder="Your name" style={input} />
              <input placeholder="Phone number" style={input} />

              <select style={input}>
                <option>Choose barber</option>
                <option>Miguel</option>
                <option>Carlos</option>
                <option>Angel</option>
                <option>Junior</option>
              </select>

              <select style={input}>
                <option>Fresh fade</option>
                <option>Kids cut</option>
                <option>Beard detail</option>
                <option>Design work</option>
              </select>

              <button
                onClick={() => {
                  window.alert("Walk-in added to live waitlist.");
                  setWalkInOpen(false);
                }}
                style={heroButton}
              >
                Join Waitlist
              </button>

              <button
                onClick={() => setWalkInOpen(false)}
                style={secondaryButton}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 15% 10%, rgba(59,130,246,0.22), transparent 34%), radial-gradient(circle at 85% 16%, rgba(239,68,68,0.20), transparent 30%), #030712",
  color: "white",
  padding: 24,
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const stripeGlow: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  background:
    "linear-gradient(120deg, transparent 0%, transparent 42%, rgba(37,99,235,0.10) 43%, rgba(37,99,235,0.10) 46%, transparent 47%), linear-gradient(120deg, transparent 0%, transparent 50%, rgba(239,68,68,0.10) 51%, rgba(239,68,68,0.10) 54%, transparent 55%)",
  opacity: 0.75,
};

const hero: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 32,
  border: "1px solid rgba(96,165,250,0.24)",
  background: "linear-gradient(145deg, rgba(15,23,42,0.82), rgba(2,6,23,0.92))",
  padding: 34,
  boxShadow: "0 30px 100px rgba(0,0,0,0.38)",
};

const heroImage: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.18,
};

const heroShade: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(90deg, rgba(2,6,23,0.92), rgba(2,6,23,0.50), rgba(2,6,23,0.78))",
};

const badge: React.CSSProperties = {
  display: "inline-flex",
  borderRadius: 999,
  border: "1px solid rgba(239,68,68,0.35)",
  background: "rgba(239,68,68,0.18)",
  padding: "8px 14px",
  fontWeight: 950,
  letterSpacing: 1.4,
  color: "#ffffff",
  fontSize: 12,
};

const heroTitle: React.CSSProperties = {
  margin: "18px 0 10px",
  fontSize: 68,
  lineHeight: 0.9,
  letterSpacing: -2.5,
  textTransform: "uppercase",
};

const heroText: React.CSSProperties = {
  margin: 0,
  color: "rgba(226,232,240,0.78)",
  fontSize: 21,
  maxWidth: 760,
  fontWeight: 700,
};

const mainGrid: React.CSSProperties = {
  marginTop: 22,
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 22,
};

const panel: React.CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(96,165,250,0.18)",
  background: "linear-gradient(160deg, rgba(8,47,73,0.30), rgba(2,6,23,0.78))",
  padding: 24,
  boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 18px",
  fontSize: 26,
  letterSpacing: -0.5,
};

const barberCard: React.CSSProperties = {
  borderRadius: 22,
  border: "1px solid rgba(96,165,250,0.18)",
  background: "rgba(15,23,42,0.58)",
  padding: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 14,
};

const freshCardButton: React.CSSProperties = {
  textAlign: "left",
  borderRadius: 20,
  border: "1px solid rgba(96,165,250,0.20)",
  background: "linear-gradient(145deg, rgba(37,99,235,0.16), rgba(239,68,68,0.10), rgba(15,23,42,0.62))",
  padding: 18,
  color: "white",
  cursor: "pointer",
  transition: "all 180ms ease",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 rgba(59,130,246,0)",
  transition: "transform 160ms ease, box-shadow 160ms ease, border 160ms ease",
};

const freshImage: React.CSSProperties = {
  width: "100%",
  height: 260,
  objectFit: "cover",
  objectPosition: "center 35%",
  borderRadius: 16,
  marginBottom: 14,
};

const primaryButton: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(239,68,68,0.55)",
  background: "linear-gradient(135deg, rgba(239,68,68,0.28), rgba(37,99,235,0.18))",
  color: "white",
  padding: "14px 22px",
  fontWeight: 950,
  cursor: "pointer",
  transition: "all 180ms ease",
  boxShadow: "0 0 26px rgba(239,68,68,0.16)",
};

const button: React.CSSProperties = {
  ...primaryButton,
  border: "1px solid rgba(148,163,184,0.24)",
  background: "rgba(15,23,42,0.62)",
};

const smallButton: React.CSSProperties = {
  ...primaryButton,
  padding: "10px 16px",
};

const shopInfoCard: React.CSSProperties = {
  marginTop: 18,
  borderRadius: 22,
  border: "1px solid rgba(96,165,250,0.18)",
  background: "linear-gradient(145deg, rgba(37,99,235,0.12), rgba(239,68,68,0.08), rgba(15,23,42,0.62))",
  padding: 18,
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  background: "rgba(2,6,23,0.74)",
  backdropFilter: "blur(12px)",
  display: "grid",
  placeItems: "center",
  padding: 20,
};

const drawer: React.CSSProperties = {
  width: "min(560px, 100%)",
  borderRadius: 30,
  border: "1px solid rgba(96,165,250,0.24)",
  background: "linear-gradient(160deg, rgba(8,47,73,0.92), rgba(2,6,23,0.96))",
  padding: 24,
  boxShadow: "0 30px 100px rgba(0,0,0,0.55)",
};

const field: React.CSSProperties = {
  marginTop: 12,
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(148,163,184,0.20)",
  background: "rgba(2,6,23,0.62)",
  color: "white",
  padding: "13px 14px",
  fontWeight: 800,
  outline: "none",
};










