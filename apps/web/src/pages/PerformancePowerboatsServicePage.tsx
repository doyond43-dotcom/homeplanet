import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsServicePage.css";

export default function PerformancePowerboatsServicePage() {
  const [form, setForm] = useState({
    year: "",
    makeModel: "",
    length: "",
    engines: "",
    location: "",
    request: "",
    name: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.request.trim()) {
      return;
    }

    setStatus("sending");

    const { error } = await supabase.rpc("submit_performance_powerboat_project", {
      p_project_type: "Service & Repair",
      p_customer_name: form.name.trim(),
      p_customer_phone: form.phone.trim(),
      p_customer_email: form.email.trim() || null,
      p_boat_year: form.year.trim() || null,
      p_boat_make_model: form.makeModel.trim() || null,
      p_boat_length: form.length.trim() || null,
      p_boat_engines: form.engines.trim() || null,
      p_boat_location: form.location.trim() || null,
      p_customer_request: form.request.trim() || null,
    });

    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <main className="pp-intake-page">
        <div className="pp-intake-shell pp-intake-confirmation">
          <div className="pp-intake-kicker">REQUEST RECEIVED</div>
          <h1>PERFORMANCE HAS IT.</h1>
          <p>
            Your service request is now with Performance Powerboats.
            They can review it and contact you from here.
          </p>

          <Link to="/planet/performance-powerboats">
            BACK TO PERFORMANCE →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pp-intake-page">
      <div className="pp-intake-shell">
        <Link className="pp-intake-back" to="/planet/performance-powerboats/start-project">
          ← START A PROJECT
        </Link>

        <header className="pp-intake-header">
          <div className="pp-intake-kicker">SERVICE · REPAIR · REPOWER</div>

          <h1>
            WHAT DOES
            <br />
            YOUR BOAT NEED?
          </h1>

          <p>
            Give Performance the basics. Photos, measurements and additional
            details can be added once the project is underway.
          </p>
        </header>

        <form className="pp-intake-form" onSubmit={submit}>
          <div className="pp-intake-section">
            <div className="pp-intake-section-title">ABOUT THE BOAT</div>

            <div className="pp-intake-grid">
              <label>
                YEAR
                <input
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="2018"
                />
              </label>

              <label>
                MAKE / MODEL
                <input
                  value={form.makeModel}
                  onChange={(e) => update("makeModel", e.target.value)}
                  placeholder="SeaCraft"
                />
              </label>

              <label>
                LENGTH
                <input
                  value={form.length}
                  onChange={(e) => update("length", e.target.value)}
                  placeholder="25 ft"
                />
              </label>

              <label>
                ENGINES
                <input
                  value={form.engines}
                  onChange={(e) => update("engines", e.target.value)}
                  placeholder="Twin Yamaha"
                />
              </label>

              <label className="pp-intake-full">
                BOAT LOCATION
                <input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="City, Florida"
                />
              </label>

              <label className="pp-intake-full">
                WHAT DOES THE BOAT NEED? *
                <textarea
                  value={form.request}
                  onChange={(e) => update("request", e.target.value)}
                  placeholder="Service, repair, repower, rigging, electrical, gel coat or anything else you want Performance to look at."
                  rows={6}
                  required
                />
              </label>
            </div>
          </div>

          <div className="pp-intake-section">
            <div className="pp-intake-section-title">HOW SHOULD PERFORMANCE REACH YOU?</div>

            <div className="pp-intake-grid">
              <label>
                NAME *
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Your name"
                  required
                />
              </label>

              <label>
                PHONE *
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="Your phone number"
                  inputMode="tel"
                  required
                />
              </label>

              <label className="pp-intake-full">
                EMAIL
                <input
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Optional"
                  type="email"
                />
              </label>
            </div>
          </div>

          <button className="pp-intake-submit" disabled={status === "sending"}>
            {status === "sending" ? "SENDING..." : "SEND SERVICE REQUEST →"}
          </button>

          {status === "error" && (
            <p className="pp-intake-error">
              Something went wrong sending the request. Please try again.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
