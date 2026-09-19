import React, { useState } from "react";
import { supabase } from "../lib/supabase";

type IntakeForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  projectAddress: string;
  notes: string;
};

const emptyForm: IntakeForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  projectAddress: "",
  notes: "",
};

export default function PremierQuickIntakePage() {
  const [form, setForm] = useState<IntakeForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof IntakeForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const phone = form.phone.trim();
    const projectAddress = form.projectAddress.trim();

    if (!firstName || !lastName || !phone || !projectAddress) {
      setError("First name, last name, phone number, and project address are required.");
      return;
    }

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase
      .from("premier_jobs")
      .insert({
        source: "office_call",
        status: "new",
        current_stage: "new_lead",
        next_action: "Salesperson to contact customer and schedule measurement.",
        first_name: firstName,
        last_name: lastName,
        phone,
        email: form.email.trim() || null,
        project_address: projectAddress,
        intake_notes: form.notes.trim() || null,
        needs_attention: false,
      });

    setSaving(false);

    if (insertError) {
      console.error("Premier intake save failed:", insertError);
      setError("Could not save this customer. Please try again.");
      return;
    }

    setSaved(true);
  };

  const startAnother = () => {
    setForm(emptyForm);
    setSaved(false);
    setError("");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 52,
    borderRadius: 10,
    border: "1px solid #31495a",
    background: "#101419",
    color: "#f3f6f8",
    padding: "12px 14px",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "#a9b7c2",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 7,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #16232d 0%, #0b0f13 46%, #07090c 100%)",
        color: "#f3f6f8",
        padding: "24px 16px 48px",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              color: "#8fa9bc",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Premier Window & Door
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 6vw, 42px)",
              lineHeight: 1.05,
            }}
          >
            New Customer
          </h1>

          <p
            style={{
              margin: "9px 0 0",
              color: "#9ca8b2",
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            Quick phone intake. Save the customer and keep moving.
          </p>
        </div>

        <section
          style={{
            border: "1px solid #26323a",
            background: "rgba(16, 20, 25, 0.94)",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
          }}
        >
          {saved ? (
            <div style={{ padding: "12px 2px 4px" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  background: "#16232d",
                  border: "1px solid #486578",
                  color: "#9db7ca",
                  fontSize: 24,
                  marginBottom: 16,
                }}
              >
                ✓
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: 25,
                }}
              >
                Customer saved
              </h2>

              <p
                style={{
                  color: "#a8b0b7",
                  lineHeight: 1.5,
                  margin: "0 0 22px",
                }}
              >
                {form.firstName.trim()} {form.lastName.trim()} is now in the Premier workflow.
              </p>

              <button
                type="button"
                onClick={startAnother}
                style={{
                  width: "100%",
                  minHeight: 54,
                  border: "1px solid #486578",
                  borderRadius: 10,
                  background: "#1a2a36",
                  color: "#f3f6f8",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Start Another Call
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 14,
                }}
              >
                <label>
                  <span style={labelStyle}>First Name</span>
                  <input
                    value={form.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                    autoComplete="given-name"
                    style={inputStyle}
                  />
                </label>

                <label>
                  <span style={labelStyle}>Last Name</span>
                  <input
                    value={form.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                    autoComplete="family-name"
                    style={inputStyle}
                  />
                </label>
              </div>

              <div style={{ height: 14 }} />

              <label>
                <span style={labelStyle}>Phone Number</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  style={inputStyle}
                />
              </label>

              <div style={{ height: 14 }} />

              <label>
                <span style={labelStyle}>Email <span style={{ color: "#6f7d88" }}>(optional)</span></span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  style={inputStyle}
                />
              </label>

              <div style={{ height: 14 }} />

              <label>
                <span style={labelStyle}>Project Address</span>
                <input
                  value={form.projectAddress}
                  onChange={(event) =>
                    updateField("projectAddress", event.target.value)
                  }
                  autoComplete="street-address"
                  style={inputStyle}
                />
              </label>

              <div style={{ height: 14 }} />

              <label>
                <span style={labelStyle}>What are they looking to have done?</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder='Example: "Sliding glass door and about 8 windows."'
                  rows={4}
                  style={{
                    ...inputStyle,
                    minHeight: 110,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
              </label>

              {error ? (
                <div
                  style={{
                    marginTop: 14,
                    padding: "11px 12px",
                    borderRadius: 9,
                    border: "1px solid #684c30",
                    background: "#1d160f",
                    color: "#e6c99f",
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  minHeight: 56,
                  marginTop: 18,
                  border: "1px solid #486578",
                  borderRadius: 10,
                  background: saving ? "#16232d" : "#1a2a36",
                  color: "#f3f6f8",
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: saving ? "wait" : "pointer",
                  opacity: saving ? 0.75 : 1,
                }}
              >
                {saving ? "Saving..." : "Save New Customer"}
              </button>
            </form>
          )}
        </section>

        <div
          style={{
            color: "#6f7d88",
            fontSize: 12,
            textAlign: "center",
            marginTop: 14,
          }}
        >
          Premier internal quick intake
        </div>
      </div>
    </main>
  );
}
