import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

type OperationalJob = {
  id: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  notes: string;
  stage: string;
  paymentStatus: "not-ready" | "invoice-ready" | "paid";
  beforePhotos: string[];
  afterPhotos: string[];
  timeline: string[];
  crewStatus?: string;
};

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function jobsKey(boardSlug: string) {
  return `hp-operational-board:${boardSlug}:jobs`;
}

function readJobs(boardSlug: string): OperationalJob[] {
  try {
    const raw = localStorage.getItem(jobsKey(boardSlug));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveJobs(boardSlug: string, jobs: OperationalJob[]) {
  try {
    localStorage.setItem(jobsKey(boardSlug), JSON.stringify(jobs));
  } catch {}
}

export default function OperationalStaffBoard() {
  const params = useParams();
  const boardSlug = params.boardSlug || params.slug || "business";
  const businessName = titleFromSlug(boardSlug);

  const beforeRef = useRef<HTMLInputElement | null>(null);
  const afterRef = useRef<HTMLInputElement | null>(null);

  const [jobs, setJobs] = useState<OperationalJob[]>(() => readJobs(boardSlug));
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);

  const selected = useMemo(
    () => jobs.find((job) => job.id === selectedId) || jobs[0] || null,
    [jobs, selectedId]
  );

  useEffect(() => {
    saveJobs(boardSlug, jobs);
  }, [boardSlug, jobs]);

  useEffect(() => {
    const refresh = () => setJobs(readJobs(boardSlug));
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [boardSlug]);

  function updateJob(jobId: string, patch: Partial<OperationalJob>, note?: string) {
    setJobs((current) => {
      const next = current.map((job) => {
        if (job.id !== jobId) return job;

        const lastNote = job.timeline[job.timeline.length - 1];
        const timeline = note && lastNote !== note ? [...job.timeline, note] : job.timeline;

        return { ...job, ...patch, timeline };
      });

      saveJobs(boardSlug, next);
      return next;
    });
  }

  function addPhoto(kind: "before" | "after", fileName: string) {
    if (!selected) return;

    if (kind === "before") {
      updateJob(
        selected.id,
        { beforePhotos: [...selected.beforePhotos, fileName] },
        `Staff uploaded before photo: ${fileName}`
      );
    } else {
      updateJob(
        selected.id,
        { afterPhotos: [...selected.afterPhotos, fileName] },
        `Staff uploaded after photo: ${fileName}`
      );
    }
  }

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 12% 8%, rgba(56,189,248,0.16), transparent 30%), radial-gradient(circle at 90% 10%, rgba(16,185,129,0.12), transparent 28%), #07111f",
    color: "white",
    padding: 18,
  };

  const card: React.CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.055)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.32)",
    padding: 16,
  };

  const button: React.CSSProperties = {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    padding: "11px 12px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
  };

  const primaryButton: React.CSSProperties = {
    ...button,
    border: "1px solid rgba(16,185,129,0.35)",
    background: "rgba(16,185,129,0.16)",
    color: "#d1fae5",
  };

  return (
    <main style={page}>
      <button
        type="button"
        onClick={() => window.location.assign("/planet/zands-light-xand")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          borderRadius: 999,
          border: "1px solid rgba(56,189,248,0.35)",
          background: "rgba(15,23,42,0.90)",
          color: "white",
          padding: "10px 16px",
          fontWeight: 900,
          cursor: "pointer",
          boxShadow: "0 0 24px rgba(56,189,248,0.18)",
        }}
      >
        ? Back to Liveboard
      </button>

      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ ...card, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 950, color: "#bae6fd", letterSpacing: 1.2 }}>
            FIELD CREW BOARD
          </div>
          <h1 style={{ margin: "8px 0 4px", fontSize: 38 }}>{businessName}</h1>
          <div style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>
            Today’s route, crew notes, live updates, and proof.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 390px", gap: 14, alignItems: "start" }}>
          <section style={{ ...card, display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 950, fontSize: 18 }}>Today’s Route</div>

            {jobs.length ? (
              jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setSelectedId(job.id)}
                  style={{
                    textAlign: "left",
                    borderRadius: 20,
                    border:
                      selected?.id === job.id
                        ? "1px solid rgba(34,211,238,0.55)"
                        : "1px solid rgba(255,255,255,0.10)",
                    background:
                      selected?.id === job.id ? "rgba(34,211,238,0.12)" : "rgba(0,0,0,0.22)",
                    color: "white",
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 950 }}>{job.customer}</div>
                  <div style={{ marginTop: 5, color: "rgba(255,255,255,0.68)", fontSize: 13 }}>
                    {job.service}
                  </div>
                  <div style={{ marginTop: 5, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                    {job.address || "No address listed"}
                  </div>
                  <div style={{ marginTop: 8, color: "#bae6fd", fontSize: 12, fontWeight: 950 }}>
                    Owner Status: {job.stage}
                    <br />
                    Crew Status: {job.crewStatus || "Not started"}
                  </div>
                </button>
              ))
            ) : (
              <div style={{ color: "rgba(255,255,255,0.55)" }}>
                No jobs yet. Customer requests will show here when they land on the live board.
              </div>
            )}
          </section>

          <aside style={{ ...card, position: "sticky", top: 16 }}>
            {selected ? (
              <>
                <div style={{ fontSize: 12, fontWeight: 950, color: "#86efac", letterSpacing: 1.1 }}>
                  JOB ACTIONS
                </div>

                <h2 style={{ margin: "8px 0 4px" }}>{selected.customer}</h2>
                <div style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  {selected.address || "No address listed"}
                  <br />
                  {selected.phone || "No phone listed"}
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                  <button
                    style={primaryButton}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selected.address)}`,
                        "_blank"
                      )
                    }
                  >
                    Open Maps
                  </button>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button style={button} onClick={() => selected.phone && window.open(`tel:${selected.phone}`)}>
                      Call
                    </button>
                    <button style={button} onClick={() => selected.phone && window.open(`sms:${selected.phone}`)}>
                      Text
                    </button>
                  </div>

                  <div style={{ borderRadius: 16, border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.10)", padding: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(167,243,208,0.8)" }}>
                      FIELD STATUS
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 950, color: "#d1fae5" }}>
                      {selected.crewStatus || "Not started"}
                    </div>
                  </div>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(255,255,255,0.45)" }}>
                      CREW NOTES
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{selected.notes}</p>
                  </div>

                  <input
                    ref={beforeRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) addPhoto("before", file.name);
                      event.currentTarget.value = "";
                    }}
                  />

                  <input
                    ref={afterRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) addPhoto("after", file.name);
                      event.currentTarget.value = "";
                    }}
                  />

                  <div
                    style={{
                      borderRadius: 24,
                      border: "1px solid rgba(34,211,238,0.24)",
                      background:
                        "radial-gradient(circle at top left, rgba(16,185,129,0.22), transparent 34%), linear-gradient(135deg, rgba(255,255,255,0.10), rgba(6,78,59,0.18), rgba(8,47,73,0.14))",
                      boxShadow: "0 0 45px rgba(34,211,238,0.10), inset 0 1px 0 rgba(255,255,255,0.14)",
                      padding: 14,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.16em", textTransform: "uppercase", color: "#86efac" }}>
                      Photo Proof & Workflow
                    </div>

                    <div style={{ marginTop: 6, fontSize: 20, fontWeight: 950, letterSpacing: "-0.03em", color: "white" }}>
                      Show the work. Build trust.
                    </div>

                    <div style={{ marginTop: 4, fontSize: 12, lineHeight: 1.45, color: "rgba(255,255,255,0.68)" }}>
                      Add before photos, after photos, and proof customers can understand.
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 34px 1fr", gap: 10, alignItems: "center", marginTop: 14 }}>
                      <button
                        type="button"
                        onClick={() => beforeRef.current?.click()}
                        style={{
                          minHeight: 132,
                          borderRadius: 18,
                          border: "1px dashed rgba(125,211,252,0.38)",
                          background: "rgba(0,0,0,0.28)",
                          color: "white",
                          padding: 12,
                          cursor: "pointer",
                          boxShadow: selected.beforePhotos.length ? "0 0 28px rgba(16,185,129,0.16)" : "none",
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.1em", color: "#a7f3d0" }}>BEFORE</div>
                        <div style={{ marginTop: 16, fontSize: 28 }}>??</div>
                        <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.35, color: "rgba(255,255,255,0.78)" }}>
                          Drop before photos here or click to upload
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                          {selected.beforePhotos.length} uploaded
                        </div>
                      </button>

                      <div
                        style={{
                          height: 34,
                          width: 34,
                          borderRadius: 999,
                          display: "grid",
                          placeItems: "center",
                          background: "rgba(16,185,129,0.16)",
                          border: "1px solid rgba(52,211,153,0.32)",
                          color: "#6ee7b7",
                          boxShadow: "0 0 24px rgba(16,185,129,0.18)",
                          fontWeight: 950,
                        }}
                      >
                        ?
                      </div>

                      <button
                        type="button"
                        onClick={() => afterRef.current?.click()}
                        style={{
                          minHeight: 132,
                          borderRadius: 18,
                          border: "1px dashed rgba(125,211,252,0.38)",
                          background: "rgba(0,0,0,0.28)",
                          color: "white",
                          padding: 12,
                          cursor: "pointer",
                          boxShadow: selected.afterPhotos.length ? "0 0 28px rgba(16,185,129,0.16)" : "none",
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: "0.1em", color: "#a7f3d0" }}>AFTER</div>
                        <div style={{ marginTop: 16, fontSize: 28 }}>??</div>
                        <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.35, color: "rgba(255,255,255,0.78)" }}>
                          Drop after photos here or click to upload
                        </div>
                        <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                          {selected.afterPhotos.length} uploaded
                        </div>
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 12 }}>
                      {[
                        ["Live Updates", "Customers see every step"],
                        ["Build Trust", "Before / after speaks loud"],
                        ["Job Proof", "Photos locked to job"],
                      ].map(([title, desc]) => (
                        <div
                          key={title}
                          style={{
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(0,0,0,0.22)",
                            padding: 10,
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 950, color: "#d1fae5" }}>{title}</div>
                          <div style={{ marginTop: 3, fontSize: 11, lineHeight: 1.3, color: "rgba(255,255,255,0.58)" }}>{desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    style={selected.crewStatus === "Arrived" ? primaryButton : button}
                    onClick={() => updateJob(selected.id, { crewStatus: "Arrived" }, "Crew arrived on site")}
                  >
                    Mark Arrived
                  </button>

                  <button
                    style={selected.crewStatus === "Work Started" ? primaryButton : button}
                    onClick={() => updateJob(selected.id, { crewStatus: "Work Started" }, "Work started")}
                  >
                    Start Work
                  </button>

                  <button
                    style={selected.crewStatus === "Issue Reported" ? primaryButton : button}
                    onClick={() => updateJob(selected.id, { crewStatus: "Issue Reported" }, "Issue reported by field crew")}
                  >
                    Report Issue
                  </button>

                  <button
                    style={selected.crewStatus === "Work Complete" ? primaryButton : button}
                    onClick={() => updateJob(selected.id, { crewStatus: "Work Complete" }, "Field crew marked work complete")}
                  >
                    Work Complete
                  </button>

                  <div style={{ borderRadius: 16, background: "rgba(0,0,0,0.25)", padding: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 950, color: "rgba(255,255,255,0.45)" }}>
                      PROOF TIMELINE
                    </div>
                    <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                      {selected.timeline.map((item, index) => (
                        <div key={`${item}-${index}`} style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: "rgba(255,255,255,0.55)" }}>Select a job.</div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}











