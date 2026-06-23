import React, { useEffect, useState } from "react";

import { hpEvent } from "../lib/hpEvent";
export default function HomeServicesRequestPage() {
  useEffect(() => {
    hpEvent({
      event: "home_services_request_view",
      board: "homeplanet-live-pages",
      entityId: "home-services-request",
      meta: { path: window.location.pathname },
    });
  }, []);
  const [selectedService, setSelectedService] = useState(() => new URLSearchParams(window.location.search).get("service") || "");
  const [photoCount, setPhotoCount] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  return (
    <main style={page}>
      <div style={container}>
        <h1 style={title}>Tell Ridgeline What You Need</h1>

        <p style={subtitle}>
          Request an estimate for exterior cleaning, roof washing,
          driveway cleaning, window cleaning, and more.
        </p>

        <section style={section}>
          <h2 style={heading}>What Are We Looking At?</h2>

          <div style={grid}>
            {[
              "House Wash",
              "Driveway Cleaning",
              "Roof Softwash",
              "Pool Cage",
              "Gutters",
              "Other",
            ].map((service) => (
              <button
                key={service}
                style={{
                  ...card,
                  background:
                        selectedService === service
                          ? "linear-gradient(135deg, #ff8a1f, #f97316)"
                          : "linear-gradient(145deg, rgba(0,0,0,.72), rgba(18,18,20,.88))",
                  color:
                    selectedService === service
                      ? "#0d0d0f"
                      : "#ffffff",
                }}
                onClick={() => setSelectedService(service)}
              >
                {service}
              </button>
            ))}
          </div>
        </section>

        <section style={section}>
          <h2 style={heading}>Customer + Property</h2>

          <input
            style={input}
            placeholder="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            style={input}
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <input
            style={input}
            placeholder="Property Address"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
          />
        </section>

        <section style={section}>
          <h2 style={heading}>What Should The Crew Know?</h2>

          <textarea
            style={textarea}
            placeholder="Describe what needs attention..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </section>

        <section style={section}>
          <h2 style={heading}>Photos Help Us Price It Faster</h2>

          <label style={photoBox}>
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const count = e.target.files?.length || 0;
                setPhotoCount(count);
                hpEvent({
                  event: "home_services_photo_selected",
                  board: "homeplanet-live-pages",
                  entityId: "property-photos",
                  meta: { count, path: window.location.pathname },
                });
              }}
            />

            {photoCount > 0
              ? `${photoCount} Photo(s) Selected`
              : "Add Property Photos"}
          </label>

          <p style={photoText}>
            Photos are optional. In this demo, selected photos are only used to preview the flow and are not uploaded or stored.
          </p>
        </section>

        <section style={section}>
          <button
            style={submitButton}
            onClick={() => {
              hpEvent({
                event: "home_services_request_submit",
                board: "homeplanet-live-pages",
                entityId: "request-estimate",
                meta: {
                  selectedService,
                  photoCount,
                  hasName: Boolean(customerName),
                  hasPhone: Boolean(phoneNumber),
                  hasAddress: Boolean(propertyAddress),
                  hasDescription: Boolean(jobDescription),
                  path: window.location.pathname,
                },
              });

              localStorage.setItem(
                "homeServicesLead",
                JSON.stringify({
                  customerName,
                  service: selectedService,
                  address: propertyAddress,
                  description: jobDescription,
                  photoCount,
                })
              );

              window.location.href =
                "/planet/home-services/lead";
            }}
          >
            Request Estimate
          </button>
        </section>
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  color: "#fff",
  backgroundColor: "#050505",
  backgroundImage:
    "radial-gradient(circle at 18% 0%, rgba(249,115,22,.30), transparent 34%), linear-gradient(180deg, rgba(0,0,0,.48), #050505 64%), url('/images/a_dramatic_cinematic_ultra_realistic_sunset_scen_1.png')",
  backgroundSize: "cover",
  backgroundPosition: "center top",
  backgroundAttachment: "fixed",
  padding: "22px 16px",
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const container: React.CSSProperties = {
  width: "min(920px, 100%)",
  margin: "0 auto",
  display: "grid",
  gap: 18,
};

const title: React.CSSProperties = {
  margin: "12px 0 0",
  fontSize: "clamp(42px, 8vw, 76px)",
  lineHeight: ".9",
  fontWeight: 950,
  letterSpacing: "-.06em",
  textTransform: "uppercase",
  textShadow: "0 18px 50px rgba(0,0,0,.55)",
};

const subtitle: React.CSSProperties = {
  margin: "12px 0 10px",
  maxWidth: 720,
  color: "rgba(255,255,255,.72)",
  fontSize: 17,
  lineHeight: 1.55,
  fontWeight: 750,
};

const section: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,.14)",
  background:
    "linear-gradient(145deg, rgba(18,18,20,.88), rgba(5,5,5,.84))",
  borderRadius: 30,
  padding: 18,
  boxShadow: "0 24px 70px rgba(0,0,0,.48)",
  backdropFilter: "blur(18px)",
};

const heading: React.CSSProperties = {
  margin: "0 0 14px",
  color: "#fff",
  fontSize: 22,
  fontWeight: 950,
  letterSpacing: "-.03em",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
};

const card: React.CSSProperties = {
  padding: 20,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#171717",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  display: "block",
  width: "100%",
  boxSizing: "border-box",
};

const input: React.CSSProperties = {
  width: "100%",
  minHeight: 54,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(0,0,0,.64)",
  color: "#fff",
  padding: "0 16px",
  fontSize: 16,
  fontWeight: 800,
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)",
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: 135,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,.14)",
  background: "rgba(0,0,0,.64)",
  color: "#fff",
  padding: 16,
  fontSize: 16,
  fontWeight: 750,
  lineHeight: 1.45,
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)",
};

const photoBox: React.CSSProperties = {
  minHeight: 118,
  borderRadius: 22,
  border: "1px dashed rgba(249,115,22,.55)",
  background:
    "linear-gradient(145deg, rgba(249,115,22,.12), rgba(0,0,0,.72))",
  display: "grid",
  placeItems: "center",
  padding: 18,
  cursor: "pointer",
  boxSizing: "border-box",
};

const photoText: React.CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(255,255,255,.62)",
  fontSize: 14,
  fontWeight: 800,
};

const submitButton: React.CSSProperties = {
  width: "100%",
  minHeight: 64,
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,.18)",
  background: "linear-gradient(135deg, #ff8a1f, #f97316)",
  color: "#050505",
  fontSize: 15,
  fontWeight: 950,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxSizing: "border-box",
  boxShadow: "0 22px 55px rgba(249,115,22,.32)",
};
















