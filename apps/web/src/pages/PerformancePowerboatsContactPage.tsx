import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import "./PerformancePowerboatsContactPage.css";

const PERFORMANCE_PHONE = "+19548019524";
const PERFORMANCE_ADDRESS =
  "12633 Southwest Impact Drive, Indiantown, Florida";

export default function PerformancePowerboatsContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");

  function askQuestion(event: FormEvent) {
    event.preventDefault();

    const message = [
      "Hi Performance Powerboats, I have a question.",
      name ? `Name: ${name}` : "",
      phone ? `Phone: ${phone}` : "",
      question ? `Question: ${question}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href =
      `sms:${PERFORMANCE_PHONE}?&body=${encodeURIComponent(message)}`;
  }

  return (
    <main className="pp-contact-page">
      <div className="pp-contact-shell">
        <Link
          className="pp-contact-back"
          to="/planet/performance-powerboats"
        >
          ← PERFORMANCE POWERBOATS
        </Link>

        <header className="pp-contact-header">
          <div className="pp-contact-kicker">CONTACT PERFORMANCE</div>

          <h1>
            LET'S TALK
            <br />
            ABOUT YOUR BOAT.
          </h1>

          <p>
            Call, text or send Performance a quick question. Keep it simple
            and we'll point you in the right direction.
          </p>
        </header>

        <section className="pp-contact-actions">
          <a className="pp-contact-action" href={`tel:${PERFORMANCE_PHONE}`}>
            <span>CALL</span>
            <strong>CALL PERFORMANCE</strong>
            <small>Talk directly with Performance.</small>
          </a>

          <a className="pp-contact-action" href={`sms:${PERFORMANCE_PHONE}`}>
            <span>TEXT</span>
            <strong>TEXT PERFORMANCE</strong>
            <small>Send a quick message from your phone.</small>
          </a>
        </section>

        <section className="pp-contact-question">
          <div className="pp-contact-question-copy">
            <div className="pp-contact-kicker">ASK A QUESTION</div>
            <h2>NOT SURE WHERE TO START?</h2>
            <p>
              Tell us what you're trying to figure out. We'll turn it into a
              text you can send directly to Performance.
            </p>
          </div>

          <form onSubmit={askQuestion}>
            <label>
              NAME
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              PHONE
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Your phone number"
                inputMode="tel"
              />
            </label>

            <label className="pp-contact-full">
              QUESTION
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What would you like to ask Performance?"
                required
                rows={5}
              />
            </label>

            <button type="submit">ASK PERFORMANCE →</button>
          </form>
        </section>

        <section className="pp-contact-location">
          <div>
            <div className="pp-contact-kicker">INDIANTOWN, FLORIDA</div>
            <h2>VISIT PERFORMANCE.</h2>
            <p>{PERFORMANCE_ADDRESS}</p>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=12633%20Southwest%20Impact%20Drive%2C%20Indiantown%2C%20Florida"
            target="_blank"
            rel="noreferrer"
          >
            GET DIRECTIONS →
          </a>
        </section>
      </div>
    </main>
  );
}
