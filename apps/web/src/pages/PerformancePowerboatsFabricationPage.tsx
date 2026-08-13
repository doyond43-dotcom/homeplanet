import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsFabricationPage.css";

export default function PerformancePowerboatsFabricationPage() {
  const [form, setForm] = useState({
    boat: "",
    measurements: "",
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

    const request = [
      form.request.trim(),
      form.measurements.trim()
        ? `Measurements / known dimensions: ${form.measurements.trim()}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    setStatus("sending");

    const { error } = await supabase.rpc("submit_performance_powerboat_project", {
      p_project_type: "Custom Metal Fabrication",
      p_customer_name: form.name.trim(),
      p_customer_phone: form.phone.trim(),
      p_customer_email: form.email.trim() || null,
      p_boat_year: null,
      p_boat_make_model: form.boat.trim() || null,
      p_boat_length: null,
      p_boat_engines: null,
      p_boat_location: form.location.trim() || null,
      p_customer_request: request || null,
    });

    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <main className="pp-intake-page">
        <div className="pp-intake-shell pp-intake-confirmation">
          <div className="pp-intake-kicker">PROJECT RECEIVED</div>
          <h1>PERFORMANCE HAS IT.</h1>
          <p>
            Your fabrication request is now with Performance Powerboats.
            They can review the project and contact you from here.
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
          <div className="pp-intake-kicker">CUSTOM FABRICATION</div>

          <h1>
            WHAT DO YOU
            <br />
            NEED BUILT?
          </h1>

          <p>
            T-tops, metalwork, components, modifications and specialty marine
            fabrication. Give Performance enough to understand the job.
          </p>
        </header>

        <form className="pp-intake-form" onSubmit={submit}>
          <div className="pp-intake-section">
            <div className="pp-intake-section-title">ABOUT THE PROJECT</div>

            <div className="pp-intake-grid">
              <label className="pp-intake-full">
                BOAT / PROJECT
                <input
                  value={form.boat}
                  onChange={(e) => update("boat", e.target.value)}
                  placeholder="Boat make/model or describe the project"
                />
              </label>

              <label>
                KNOWN MEASUREMENTS
                <input
                  value={form.measurements}
                  onChange={(e) => update("measurements", e.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label>
                LOCATION
                <input
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  placeholder="City, Florida"
                />
              </label>

              <label className="pp-intake-full">
                WHAT DO YOU NEED FABRICATED? *
                <textarea
                  value={form.request}
                  onChange={(e) => update("request", e.target.value)}
                  placeholder="Tell Performance what you need built, modified or fabricated and how it will be used."
                  rows={7}
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
            {status === "sending" ? "SENDING..." : "SEND FABRICATION REQUEST →"}
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
