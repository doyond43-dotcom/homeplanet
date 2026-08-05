import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  DollarSign,
  Gamepad2,
  Gift,
  MapPin,
  Megaphone,
  PartyPopper,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type BoardView =
  | "live"
  | "checkin"
  | "payments"
  | "events";

type BookingStatus =
  | "Needs attention"
  | "Arriving soon"
  | "Checked in"
  | "Ready"
  | "Balance due";

type BookingRecord = {
  id: string;
  customer: string;
  experience: string;
  time: string;
  guests: string;
  status: BookingStatus;
  balance: string;
  phone: string;
  notes: string;
  nextAction: string;
  timeline: string[];
};

const records: BookingRecord[] = [
  {
    id: "CJ-2048",
    customer: "Martinez Birthday Party",
    experience: "Captain's Party",
    time: "2:30 PM",
    guests: "14 guests",
    status: "Needs attention",
    balance: "$185 due",
    phone: "(863) 555-0142",
    notes:
      "Birthday child is turning 9. Family requested a shaded table and extra arcade cards.",
    nextAction: "Confirm final guest count",
    timeline: [
      "Party request submitted",
      "Captain's Party selected",
      "$100 deposit recorded",
      "Final guest count still needed",
    ],
  },
  {
    id: "CJ-2051",
    customer: "Lakeview Youth Group",
    experience: "Mini Golf + Arcade",
    time: "4:00 PM",
    guests: "22 guests",
    status: "Balance due",
    balance: "$320 due",
    phone: "(863) 555-0168",
    notes:
      "Church youth group. One bus expected. Group leader requested a single payment.",
    nextAction: "Collect remaining balance",
    timeline: [
      "Group request received",
      "Date approved",
      "Arrival instructions sent",
      "Remaining balance due today",
    ],
  },
  {
    id: "CJ-2054",
    customer: "Wilson Family",
    experience: "18-Hole Mini Golf",
    time: "5:15 PM",
    guests: "5 players",
    status: "Arriving soon",
    balance: "Paid",
    phone: "(863) 555-0177",
    notes:
      "Family round. No special requests.",
    nextAction: "Check in on arrival",
    timeline: [
      "Round selected",
      "Preferred time confirmed",
      "Payment recorded",
      "Arrival reminder sent",
    ],
  },
  {
    id: "CJ-2057",
    customer: "Harbor Realty Team",
    experience: "Private Group Event",
    time: "6:30 PM",
    guests: "18 guests",
    status: "Ready",
    balance: "Paid",
    phone: "(863) 555-0193",
    notes:
      "Team outing with mini golf and arcade cards. Manager will arrive early.",
    nextAction: "Prepare group welcome",
    timeline: [
      "Private group request submitted",
      "Package approved",
      "Payment completed",
      "Staff preparation confirmed",
    ],
  },
];

const promotions = [
  {
    title: "Sunset Family Round",
    detail: "Mini golf offer after 5:00 PM",
    status: "Active",
  },
  {
    title: "Birthday Bonus Arcade Cards",
    detail: "Included with selected party packages",
    status: "Active",
  },
  {
    title: "Captain Jack's Photo Wall",
    detail: "Guest QR photo experience",
    status: "Coming soon",
  },
];

const logo =
  "/images/captain-jacks/captain-jacks-logo-transparent.png";

function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`cj-board-status cj-board-status-${status
        .toLowerCase()
        .replaceAll(" ", "-")}`}
    >
      {status}
    </span>
  );
}

function ActiveDrawer({
  record,
  close,
}: {
  record: BookingRecord;
  close: () => void;
}) {
  const [checkedIn, setCheckedIn] = useState(
    record.status === "Checked in"
  );
  const [paid, setPaid] = useState(record.balance === "Paid");
  const [completed, setCompleted] = useState(false);

  return (
    <div className="cj-board-drawer-shell">
      <button
        className="cj-board-drawer-backdrop"
        onClick={close}
        aria-label="Close active record"
      />

      <aside className="cj-board-drawer">
        <div className="cj-board-drawer-handle" />

        <div className="cj-board-drawer-header">
          <div>
            <span>ACTIVE RECORD · {record.id}</span>
            <h2>{record.customer}</h2>
            <p>{record.experience}</p>
          </div>

          <button onClick={close} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>

        <div className="cj-board-drawer-summary">
          <div>
            <Clock3 size={18} />
            <span>
              <small>ARRIVAL</small>
              <strong>{record.time}</strong>
            </span>
          </div>

          <div>
            <Users size={18} />
            <span>
              <small>GROUP SIZE</small>
              <strong>{record.guests}</strong>
            </span>
          </div>

          <div>
            <WalletCards size={18} />
            <span>
              <small>BALANCE</small>
              <strong>{paid ? "Paid" : record.balance}</strong>
            </span>
          </div>
        </div>

        <section className="cj-board-drawer-section">
          <span>CUSTOMER & VISIT</span>

          <div className="cj-board-detail-row">
            <Phone size={17} />
            <div>
              <small>PHONE</small>
              <strong>{record.phone}</strong>
            </div>
          </div>

          <div className="cj-board-detail-row">
            <MapPin size={17} />
            <div>
              <small>NEXT ACTION</small>
              <strong>{record.nextAction}</strong>
            </div>
          </div>

          <p>{record.notes}</p>
        </section>

        <section className="cj-board-drawer-section">
          <span>TODAY'S ACTIONS</span>

          <div className="cj-board-action-grid">
            <button
              className={checkedIn ? "complete" : ""}
              onClick={() => setCheckedIn((current) => !current)}
            >
              <CheckCircle2 size={18} />
              {checkedIn ? "Checked In" : "Check In"}
            </button>

            <button
              className={paid ? "complete" : ""}
              onClick={() => setPaid((current) => !current)}
            >
              <CreditCard size={18} />
              {paid ? "Payment Received" : "Receive Payment"}
            </button>
          </div>

          <button
            className={`cj-board-complete ${
              completed ? "complete" : ""
            }`}
            onClick={() => setCompleted(true)}
          >
            <Check size={18} />
            {completed
              ? "Visit Completed"
              : "Complete Visit"}
          </button>
        </section>

        <section className="cj-board-drawer-section">
          <span>LIVE TRUTH CHAIN</span>

          <div className="cj-board-timeline">
            {record.timeline.map((event, index) => (
              <div key={event}>
                <i />
                <span>
                  <small>STEP {index + 1}</small>
                  <strong>{event}</strong>
                </span>
              </div>
            ))}

            {checkedIn && (
              <div>
                <i />
                <span>
                  <small>LIVE ACTION</small>
                  <strong>Guest checked in</strong>
                </span>
              </div>
            )}

            {paid && record.balance !== "Paid" && (
              <div>
                <i />
                <span>
                  <small>LIVE ACTION</small>
                  <strong>Remaining balance received</strong>
                </span>
              </div>
            )}

            {completed && (
              <div>
                <i />
                <span>
                  <small>OUTCOME</small>
                  <strong>Visit marked complete</strong>
                </span>
              </div>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}

export default function CaptainJacksLiveBoard() {
  const [view, setView] = useState<BoardView>("live");
  const [selected, setSelected] =
    useState<BookingRecord | null>(null);

  const needsAttention = useMemo(
    () =>
      records.filter(
        (record) =>
          record.status === "Needs attention" ||
          record.status === "Balance due"
      ).length,
    []
  );

  return (
    <main className="cj-board-page">
      <header className="cj-board-topbar">
        <a href="/planet/demo/captain-jacks">
          <ArrowLeft size={18} />
          Public Page
        </a>

        <img src={logo} alt="Captain Jack's Putt & Play" />

        <button onClick={() => setSelected(records[0])}>
          Open Active Drawer
        </button>
      </header>

      <section className="cj-board-hero">
        <div>
          <span>CAPTAIN JACK'S PUTT & PLAY</span>
          <h1>Live Board</h1>
          <p>
            Today's arrivals, check-ins, balances, events, and
            anything that needs attention.
          </p>
        </div>

        <div className="cj-board-live-pill">
          <i />
          Demo operation is live
        </div>
      </section>

      <nav className="cj-board-nav">
        <button
          className={view === "live" ? "active" : ""}
          onClick={() => setView("live")}
        >
          <Sparkles size={17} />
          Live Board
        </button>

        <button
          className={view === "checkin" ? "active" : ""}
          onClick={() => setView("checkin")}
        >
          <CheckCircle2 size={17} />
          Today's Check-In
        </button>

        <button
          className={view === "payments" ? "active" : ""}
          onClick={() => setView("payments")}
        >
          <DollarSign size={17} />
          Payments & Balances
        </button>

        <button
          className={view === "events" ? "active" : ""}
          onClick={() => setView("events")}
        >
          <Megaphone size={17} />
          Events & Promotions
        </button>
      </nav>

      {view === "live" && (
        <>
          <section className="cj-board-metrics">
            <article>
              <CalendarDays size={21} />
              <span>Today's Visits</span>
              <strong>12</strong>
              <small>Reservations and groups</small>
            </article>

            <article>
              <AlertTriangle size={21} />
              <span>Needs Attention</span>
              <strong>{needsAttention}</strong>
              <small>Action required before arrival</small>
            </article>

            <article>
              <PartyPopper size={21} />
              <span>Parties & Groups</span>
              <strong>4</strong>
              <small>Scheduled today</small>
            </article>

            <article>
              <DollarSign size={21} />
              <span>Balances Due</span>
              <strong>$505</strong>
              <small>Across two reservations</small>
            </article>
          </section>

          <section className="cj-board-section">
            <div className="cj-board-section-heading">
              <div>
                <span>ACTIVE AWARENESS</span>
                <h2>Today's Operation</h2>
              </div>

              <button onClick={() => setView("checkin")}>
                Open Check-In
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="cj-board-records">
              {records.map((record) => (
                <button
                  key={record.id}
                  className="cj-board-record"
                  onClick={() => setSelected(record)}
                >
                  <div className="cj-board-record-time">
                    <strong>{record.time}</strong>
                    <small>{record.id}</small>
                  </div>

                  <div className="cj-board-record-main">
                    <span>{record.experience}</span>
                    <h3>{record.customer}</h3>
                    <p>{record.guests}</p>
                  </div>

                  <div className="cj-board-record-end">
                    <StatusPill status={record.status} />
                    <strong>{record.balance}</strong>
                    <ChevronRight size={18} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="cj-board-split">
            <article>
              <div className="cj-board-card-heading">
                <AlertTriangle size={20} />
                <div>
                  <span>LIVE SUGGESTIONS</span>
                  <h3>Handle These Next</h3>
                </div>
              </div>

              <button onClick={() => setSelected(records[0])}>
                Confirm Martinez party guest count
                <ChevronRight size={17} />
              </button>

              <button onClick={() => setSelected(records[1])}>
                Collect Lakeview remaining balance
                <ChevronRight size={17} />
              </button>
            </article>

            <article>
              <div className="cj-board-card-heading">
                <ShieldCheck size={20} />
                <div>
                  <span>OPERATION STATUS</span>
                  <h3>Ready for the Day</h3>
                </div>
              </div>

              <div className="cj-board-check">
                <Check size={17} />
                Mini-golf stations ready
              </div>

              <div className="cj-board-check">
                <Check size={17} />
                Party area prepared
              </div>

              <div className="cj-board-check">
                <Check size={17} />
                Arcade cards stocked
              </div>
            </article>
          </section>
        </>
      )}

      {view === "checkin" && (
        <section className="cj-board-section">
          <div className="cj-board-section-heading">
            <div>
              <span>TODAY'S OPERATION</span>
              <h2>Arrival & Check-In</h2>
            </div>
          </div>

          <div className="cj-board-checkin-grid">
            <article>
              <span>ARRIVING SOON</span>
              <strong>5</strong>
              <small>Next arrival at 2:30 PM</small>
            </article>

            <article>
              <span>CHECKED IN</span>
              <strong>7</strong>
              <small>Guests currently on site</small>
            </article>

            <article>
              <span>WAIVER NEEDED</span>
              <strong>1</strong>
              <small>Lakeview Youth Group</small>
            </article>

            <article>
              <span>PARTY AREA</span>
              <strong>Ready</strong>
              <small>Next party at 2:30 PM</small>
            </article>
          </div>

          <div className="cj-board-records">
            {records.map((record) => (
              <button
                key={record.id}
                className="cj-board-record"
                onClick={() => setSelected(record)}
              >
                <div className="cj-board-record-time">
                  <strong>{record.time}</strong>
                  <small>{record.id}</small>
                </div>

                <div className="cj-board-record-main">
                  <span>{record.experience}</span>
                  <h3>{record.customer}</h3>
                  <p>{record.nextAction}</p>
                </div>

                <div className="cj-board-record-end">
                  <StatusPill status={record.status} />
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {view === "payments" && (
        <section className="cj-board-section">
          <div className="cj-board-section-heading">
            <div>
              <span>MONEY AWARENESS</span>
              <h2>Payments & Balances</h2>
            </div>
          </div>

          <div className="cj-board-payment-grid">
            <article>
              <WalletCards size={22} />
              <span>Collected Today</span>
              <strong>$1,240</strong>
              <small>Deposits and completed payments</small>
            </article>

            <article>
              <DollarSign size={22} />
              <span>Remaining Balances</span>
              <strong>$505</strong>
              <small>Two reservations</small>
            </article>

            <article>
              <Gift size={22} />
              <span>Add-Ons</span>
              <strong>$185</strong>
              <small>Arcade cards and party extras</small>
            </article>
          </div>

          <div className="cj-board-records">
            {records.map((record) => (
              <button
                key={record.id}
                className="cj-board-record"
                onClick={() => setSelected(record)}
              >
                <div className="cj-board-record-time">
                  <CreditCard size={22} />
                  <small>{record.id}</small>
                </div>

                <div className="cj-board-record-main">
                  <span>{record.experience}</span>
                  <h3>{record.customer}</h3>
                  <p>{record.time}</p>
                </div>

                <div className="cj-board-record-end">
                  <strong>{record.balance}</strong>
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {view === "events" && (
        <section className="cj-board-section">
          <div className="cj-board-section-heading">
            <div>
              <span>EXPERIENCE CONTROL</span>
              <h2>Events & Promotions</h2>
            </div>
          </div>

          <div className="cj-board-promotion-grid">
            {promotions.map((promotion, index) => (
              <article key={promotion.title}>
                <div>
                  {index === 0 && <Sparkles size={22} />}
                  {index === 1 && <PartyPopper size={22} />}
                  {index === 2 && <Gamepad2 size={22} />}
                </div>

                <span>{promotion.status}</span>
                <h3>{promotion.title}</h3>
                <p>{promotion.detail}</p>

                <button>
                  View Promotion
                  <ChevronRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <footer className="cj-board-footer">
        <img src={logo} alt="" />
        <span>Captain Jack's Live Board · Powered by HomePlanet</span>
      </footer>

      {selected && (
        <ActiveDrawer
          record={selected}
          close={() => setSelected(null)}
        />
      )}

      <style>{`
        :root {
          --cj-board-navy: #071d32;
          --cj-board-blue: #0d3150;
          --cj-board-gold: #f1c64c;
          --cj-board-green: #2f9b63;
          --cj-board-coral: #ef7459;
          --cj-board-white: #fffdf8;
          --cj-board-text: #eaf3f8;
          --cj-board-muted: rgba(234, 243, 248, .62);
          --cj-board-border: rgba(255, 255, 255, .1);
        }

        * {
          box-sizing: border-box;
        }

        .cj-board-page {
          min-height: 100vh;
          padding-bottom: 40px;
          background:
            radial-gradient(
              circle at 15% 0%,
              rgba(241, 198, 76, .11),
              transparent 25%
            ),
            linear-gradient(
              180deg,
              #092740 0%,
              var(--cj-board-navy) 48%,
              #041522 100%
            );
          color: var(--cj-board-text);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            sans-serif;
        }

        button,
        a {
          font: inherit;
        }

        .cj-board-topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
          min-height: 78px;
          padding: 10px 28px;
          border-bottom: 1px solid var(--cj-board-border);
          background: rgba(4, 21, 34, .88);
          backdrop-filter: blur(18px);
        }

        .cj-board-topbar img {
          width: 95px;
          height: 58px;
          object-fit: contain;
        }

        .cj-board-topbar a,
        .cj-board-topbar button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          min-height: 42px;
          padding: 0 14px;
          border: 1px solid var(--cj-board-border);
          border-radius: 12px;
          background: rgba(255, 255, 255, .05);
          color: white;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }

        .cj-board-topbar button {
          justify-self: end;
          border: 0;
          background: linear-gradient(
            180deg,
            #f6d86b,
            #dfa82d
          );
          color: #193043;
        }

        .cj-board-hero,
        .cj-board-nav,
        .cj-board-metrics,
        .cj-board-section,
        .cj-board-split,
        .cj-board-footer {
          width: min(1120px, calc(100% - 36px));
          margin-right: auto;
          margin-left: auto;
        }

        .cj-board-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          padding: 54px 0 28px;
        }

        .cj-board-hero span,
        .cj-board-section-heading span,
        .cj-board-card-heading span,
        .cj-board-drawer-header span,
        .cj-board-drawer-section > span {
          color: var(--cj-board-gold);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .cj-board-hero h1 {
          margin: 8px 0 0;
          font-family: Georgia, serif;
          font-size: clamp(44px, 7vw, 76px);
          line-height: .95;
        }

        .cj-board-hero p {
          max-width: 650px;
          margin: 17px 0 0;
          color: var(--cj-board-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .cj-board-live-pill {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 14px;
          border: 1px solid rgba(47, 155, 99, .32);
          border-radius: 999px;
          background: rgba(47, 155, 99, .1);
          color: #bdebcf;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .cj-board-live-pill i {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #58dc91;
          box-shadow: 0 0 14px rgba(88, 220, 145, .8);
        }

        .cj-board-nav {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          padding: 8px;
          border: 1px solid var(--cj-board-border);
          border-radius: 17px;
          background: rgba(255, 255, 255, .04);
        }

        .cj-board-nav button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 49px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: var(--cj-board-muted);
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .cj-board-nav button.active {
          background:
            linear-gradient(
              180deg,
              rgba(241, 198, 76, .2),
              rgba(241, 198, 76, .1)
            );
          color: white;
          box-shadow:
            inset 0 0 0 1px rgba(241, 198, 76, .24);
        }

        .cj-board-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .cj-board-metrics article,
        .cj-board-payment-grid article,
        .cj-board-checkin-grid article {
          padding: 19px;
          border: 1px solid var(--cj-board-border);
          border-radius: 17px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, .07),
              rgba(255, 255, 255, .035)
            );
        }

        .cj-board-metrics svg,
        .cj-board-payment-grid svg {
          color: var(--cj-board-gold);
        }

        .cj-board-metrics span,
        .cj-board-metrics strong,
        .cj-board-metrics small,
        .cj-board-payment-grid span,
        .cj-board-payment-grid strong,
        .cj-board-payment-grid small,
        .cj-board-checkin-grid span,
        .cj-board-checkin-grid strong,
        .cj-board-checkin-grid small {
          display: block;
        }

        .cj-board-metrics span,
        .cj-board-payment-grid span,
        .cj-board-checkin-grid span {
          margin-top: 15px;
          color: var(--cj-board-muted);
          font-size: 10px;
          font-weight: 850;
        }

        .cj-board-metrics strong,
        .cj-board-payment-grid strong,
        .cj-board-checkin-grid strong {
          margin-top: 5px;
          font-family: Georgia, serif;
          font-size: 30px;
        }

        .cj-board-metrics small,
        .cj-board-payment-grid small,
        .cj-board-checkin-grid small {
          margin-top: 5px;
          color: rgba(234, 243, 248, .42);
          font-size: 9px;
          line-height: 1.4;
        }

        .cj-board-section {
          margin-top: 18px;
          padding: 22px;
          border: 1px solid var(--cj-board-border);
          border-radius: 20px;
          background: rgba(255, 255, 255, .035);
        }

        .cj-board-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .cj-board-section-heading h2 {
          margin: 5px 0 0;
          font-family: Georgia, serif;
          font-size: 29px;
        }

        .cj-board-section-heading button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 40px;
          padding: 0 13px;
          border: 1px solid var(--cj-board-border);
          border-radius: 11px;
          background: rgba(255, 255, 255, .05);
          color: white;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .cj-board-records {
          display: grid;
          gap: 9px;
        }

        .cj-board-record {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          align-items: center;
          gap: 18px;
          width: 100%;
          padding: 15px;
          border: 1px solid var(--cj-board-border);
          border-radius: 15px;
          background: rgba(255, 255, 255, .04);
          color: white;
          text-align: left;
          cursor: pointer;
          transition:
            border-color .18s ease,
            transform .18s ease;
        }

        .cj-board-record:hover {
          border-color: rgba(241, 198, 76, .35);
          transform: translateY(-1px);
        }

        .cj-board-record-time strong,
        .cj-board-record-time small,
        .cj-board-record-main span,
        .cj-board-record-main h3,
        .cj-board-record-main p {
          display: block;
        }

        .cj-board-record-time strong {
          font-size: 14px;
        }

        .cj-board-record-time small {
          margin-top: 5px;
          color: rgba(234, 243, 248, .38);
          font-size: 8px;
        }

        .cj-board-record-main span {
          color: var(--cj-board-gold);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .1em;
        }

        .cj-board-record-main h3 {
          margin: 5px 0 0;
          font-size: 13px;
        }

        .cj-board-record-main p {
          margin: 4px 0 0;
          color: var(--cj-board-muted);
          font-size: 10px;
        }

        .cj-board-record-end {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 11px;
        }

        .cj-board-record-end > strong {
          color: rgba(255, 255, 255, .76);
          font-size: 10px;
        }

        .cj-board-status {
          padding: 7px 9px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 950;
          white-space: nowrap;
        }

        .cj-board-status-needs-attention,
        .cj-board-status-balance-due {
          background: rgba(239, 116, 89, .14);
          color: #ffb5a5;
        }

        .cj-board-status-arriving-soon {
          background: rgba(241, 198, 76, .13);
          color: #ffe49b;
        }

        .cj-board-status-ready,
        .cj-board-status-checked-in {
          background: rgba(47, 155, 99, .15);
          color: #a9e9c3;
        }

        .cj-board-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 18px;
        }

        .cj-board-split article {
          padding: 21px;
          border: 1px solid var(--cj-board-border);
          border-radius: 18px;
          background: rgba(255, 255, 255, .035);
        }

        .cj-board-card-heading {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          margin-bottom: 15px;
        }

        .cj-board-card-heading svg {
          color: var(--cj-board-gold);
        }

        .cj-board-card-heading h3 {
          margin: 5px 0 0;
          font-family: Georgia, serif;
          font-size: 22px;
        }

        .cj-board-split article > button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          min-height: 47px;
          margin-top: 8px;
          padding: 0 12px;
          border: 1px solid var(--cj-board-border);
          border-radius: 11px;
          background: rgba(255, 255, 255, .04);
          color: white;
          font-size: 10px;
          font-weight: 800;
          text-align: left;
          cursor: pointer;
        }

        .cj-board-check {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 42px;
          color: var(--cj-board-muted);
          font-size: 11px;
        }

        .cj-board-check svg {
          color: #5dda91;
        }

        .cj-board-checkin-grid,
        .cj-board-payment-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
          margin-bottom: 18px;
        }

        .cj-board-payment-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .cj-board-promotion-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
        }

        .cj-board-promotion-grid article {
          padding: 21px;
          border: 1px solid var(--cj-board-border);
          border-radius: 17px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, .07),
              rgba(255, 255, 255, .03)
            );
        }

        .cj-board-promotion-grid article > div {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border-radius: 13px;
          background: rgba(241, 198, 76, .12);
          color: var(--cj-board-gold);
        }

        .cj-board-promotion-grid article > span {
          display: block;
          margin-top: 17px;
          color: var(--cj-board-gold);
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .cj-board-promotion-grid h3 {
          margin: 7px 0 0;
          font-family: Georgia, serif;
          font-size: 21px;
        }

        .cj-board-promotion-grid p {
          min-height: 42px;
          margin: 10px 0 0;
          color: var(--cj-board-muted);
          font-size: 10px;
          line-height: 1.5;
        }

        .cj-board-promotion-grid button {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 16px;
          padding: 0;
          border: 0;
          background: transparent;
          color: white;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .cj-board-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 26px;
          padding-top: 24px;
          border-top: 1px solid var(--cj-board-border);
          color: rgba(255, 255, 255, .38);
          font-size: 9px;
        }

        .cj-board-footer img {
          width: 48px;
          height: 36px;
          object-fit: contain;
        }

        .cj-board-drawer-shell {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          justify-content: flex-end;
        }

        .cj-board-drawer-backdrop {
          position: absolute;
          inset: 0;
          border: 0;
          background: rgba(1, 8, 14, .76);
          backdrop-filter: blur(7px);
        }

        .cj-board-drawer {
          position: relative;
          z-index: 1;
          width: min(520px, 100%);
          height: 100%;
          padding: 14px 20px 30px;
          overflow-y: auto;
          background: #f9f5eb;
          color: #163047;
          box-shadow: -20px 0 60px rgba(0, 0, 0, .42);
        }

        .cj-board-drawer-handle {
          display: none;
        }

        .cj-board-drawer-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(22, 48, 71, .1);
        }

        .cj-board-drawer-header h2 {
          margin: 7px 0 0;
          color: #0b2b46;
          font-family: Georgia, serif;
          font-size: 31px;
          line-height: 1;
        }

        .cj-board-drawer-header p {
          margin: 7px 0 0;
          color: rgba(22, 48, 71, .62);
          font-size: 11px;
        }

        .cj-board-drawer-header button {
          display: grid;
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          place-items: center;
          border: 1px solid rgba(22, 48, 71, .11);
          border-radius: 11px;
          background: white;
          color: #163047;
          cursor: pointer;
        }

        .cj-board-drawer-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 16px;
        }

        .cj-board-drawer-summary > div {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          border: 1px solid rgba(22, 48, 71, .1);
          border-radius: 12px;
          background: white;
        }

        .cj-board-drawer-summary svg {
          flex: 0 0 auto;
          color: #a97518;
        }

        .cj-board-drawer-summary small,
        .cj-board-drawer-summary strong {
          display: block;
        }

        .cj-board-drawer-summary small,
        .cj-board-detail-row small,
        .cj-board-timeline small {
          color: rgba(22, 48, 71, .46);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: .08em;
        }

        .cj-board-drawer-summary strong {
          margin-top: 4px;
          font-size: 10px;
        }

        .cj-board-drawer-section {
          margin-top: 15px;
          padding: 17px;
          border: 1px solid rgba(22, 48, 71, .1);
          border-radius: 15px;
          background: white;
        }

        .cj-board-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 13px;
        }

        .cj-board-detail-row svg {
          color: #a97518;
        }

        .cj-board-detail-row small,
        .cj-board-detail-row strong {
          display: block;
        }

        .cj-board-detail-row strong {
          margin-top: 3px;
          font-size: 11px;
        }

        .cj-board-drawer-section > p {
          margin: 14px 0 0;
          color: rgba(22, 48, 71, .66);
          font-size: 11px;
          line-height: 1.55;
        }

        .cj-board-action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 14px;
        }

        .cj-board-action-grid button,
        .cj-board-complete {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 48px;
          border: 1px solid rgba(22, 48, 71, .11);
          border-radius: 11px;
          background: #f7f3e9;
          color: #163047;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .cj-board-action-grid button.complete,
        .cj-board-complete.complete {
          border-color: rgba(47, 155, 99, .24);
          background: #e3f4e9;
          color: #276744;
        }

        .cj-board-complete {
          width: 100%;
          margin-top: 8px;
          border: 0;
          background:
            linear-gradient(
              180deg,
              #f4cf59,
              #dfa72a
            );
        }

        .cj-board-timeline {
          display: grid;
          gap: 13px;
          margin-top: 15px;
        }

        .cj-board-timeline > div {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .cj-board-timeline i {
          width: 9px;
          height: 9px;
          margin-top: 4px;
          border: 2px solid #d9a72f;
          border-radius: 50%;
          background: white;
        }

        .cj-board-timeline small,
        .cj-board-timeline strong {
          display: block;
        }

        .cj-board-timeline strong {
          margin-top: 3px;
          font-size: 10px;
        }

        @media (max-width: 820px) {
          .cj-board-topbar {
            grid-template-columns: 1fr auto;
          }

          .cj-board-topbar img {
            display: none;
          }

          .cj-board-hero {
            align-items: flex-start;
            flex-direction: column;
          }

          .cj-board-nav {
            grid-template-columns: 1fr 1fr;
          }

          .cj-board-metrics,
          .cj-board-checkin-grid {
            grid-template-columns: 1fr 1fr;
          }

          .cj-board-split,
          .cj-board-payment-grid,
          .cj-board-promotion-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 590px) {
          .cj-board-topbar {
            min-height: 68px;
            padding: 10px 14px;
          }

          .cj-board-topbar a,
          .cj-board-topbar button {
            padding: 0 11px;
            font-size: 9px;
          }

          .cj-board-hero,
          .cj-board-nav,
          .cj-board-metrics,
          .cj-board-section,
          .cj-board-split,
          .cj-board-footer {
            width: min(100% - 24px, 1120px);
          }

          .cj-board-hero {
            padding-top: 38px;
          }

          .cj-board-nav {
            grid-template-columns: 1fr;
          }

          .cj-board-metrics,
          .cj-board-checkin-grid {
            grid-template-columns: 1fr 1fr;
          }

          .cj-board-section {
            padding: 15px;
          }

          .cj-board-section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .cj-board-record {
            grid-template-columns: 70px 1fr;
            gap: 12px;
          }

          .cj-board-record-end {
            grid-column: 1 / -1;
            justify-content: flex-start;
            padding-top: 10px;
            border-top: 1px solid var(--cj-board-border);
          }

          .cj-board-drawer-shell {
            align-items: flex-end;
          }

          .cj-board-drawer {
            width: 100%;
            height: auto;
            max-height: 91vh;
            border-radius: 24px 24px 0 0;
          }

          .cj-board-drawer-handle {
            display: block;
            width: 43px;
            height: 5px;
            margin: 0 auto 15px;
            border-radius: 999px;
            background: rgba(22, 48, 71, .17);
          }

          .cj-board-drawer-summary,
          .cj-board-action-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
