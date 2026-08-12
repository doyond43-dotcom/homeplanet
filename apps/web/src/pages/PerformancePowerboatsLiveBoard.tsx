import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import "./PerformancePowerboatsLiveBoard.css";

type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  project_type: string;
  status: string;
  priority: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_access_token: string;
  boat_year: string | null;
  boat_make_model: string | null;
  boat_length: string | null;
  boat_engines: string | null;
  boat_location: string | null;
  customer_request: string | null;
  current_milestone: string;
  next_action: string;
  assigned_to: string | null;
  next_date: string | null;
  waiting_on: string | null;
  max_observed: string | null;
  team_found: string | null;
  recommended_work: string | null;
  work_performed: string | null;
  internal_notes: string | null;
  estimate_number: string | null;
  estimate_total: number | null;
  estimate_notes: string | null;
  estimate_status: string | null;
  estimate_sent_at: string | null;
  estimate_approved_at: string | null;
  proof_photos: any[];
  labor: any[];
  parts: any[];
  timeline: any[];
};

type IntelligenceItem = {
  kind: "missing" | "waiting" | "next" | "risk" | "opportunity";
  title: string;
  text: string;
};

type PhotoRequestDraft = {
  message: string;
  smsUrl: string;
};

const MILESTONES = [
  "New Request",
  "Reviewing Project",
  "Waiting on Customer",
  "Inspection / Scope",
  "Estimate",
  "Approved",
  "Scheduled",
  "Work Underway",
  "Water Test / Final Check",
  "Ready",
  "Closed",
];

function boatLabel(project: Project) {
  return [
    project.boat_year,
    project.boat_make_model,
    project.boat_length,
    project.boat_engines,
  ]
    .filter(Boolean)
    .join(" · ");
}

function scheduleDateValue(value: string | null | undefined) {
  if (!value) return "";

  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  return match?.[0] ?? "";
}

function scheduleDateLabel(value: string | null | undefined) {
  const dateOnly = scheduleDateValue(value);
  if (!dateOnly) return "Date scheduled";

  const date = new Date(`${dateOnly}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Date scheduled";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function sentence(value: string) {
  const clean = value.trim().replace(/[.!?]+$/, "");
  return clean ? `${clean}.` : "";
}

function normalizeUsPhoneForAction(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;

  return value.trim();
}

function normalizeDrawerWording(project: Project): Project {
  const hasCustomerPhotos = (project.proof_photos?.length ?? 0) > 0;
  const waitingOn = hasCustomerPhotos && project.waiting_on
    ? project.waiting_on
        .replace(/customer photos\s*[,/|]?\s*/i, "")
        .replace(/^[-–—:\s]+/, "")
        .trim() || null
    : project.waiting_on;

  return {
    ...project,
    waiting_on: waitingOn,
    next_action:
      project.next_action === "Review customer photos when received"
        ? "Review customer photos once received"
        : project.next_action,
    timeline: (project.timeline ?? []).map((event) => ({
      ...event,
      label:
        event?.label === "Photos requested from customer"
          ? "Photo request opened in messaging app."
          : event?.label,
    })),
  };
}

function buildPhotoRequestDraft(project: Project): PhotoRequestDraft {
  const projectUrl = `https://www.homeplanet.city/planet/performance-powerboats/project/${project.id}?token=${project.customer_access_token}`;
  const message = `Hi ${project.customer_name}, this is Performance Powerboats. When you get a chance, use this private link to add photos of your boat or project: ${projectUrl}`;
  const phone = normalizeUsPhoneForAction(project.customer_phone);
  const separator = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)
    ? "&"
    : "?";

  return {
    message,
    smsUrl: `sms:${phone}${separator}body=${encodeURIComponent(message)}`,
  };
}

function buildIntelligence(project: Project): IntelligenceItem[] {
  const items: IntelligenceItem[] = [];
  const isFabrication = project.project_type === "Custom Metal Fabrication";
  const isService = ["Service & Repair", "Boat Repair", "Restoration & Refit", "Marine Service"].includes(project.project_type);

  const missing: string[] = [];
  if (!isFabrication) {
    if (isService && !project.boat_year) missing.push("boat year");
    if (!project.boat_make_model) missing.push(project.project_type === "Build a Performance" ? "model / boat interest" : "make / model");
    if (isService && !project.boat_engines) missing.push("engine information");
    if (!project.boat_location) missing.push(project.project_type === "Build a Performance" ? "use or delivery location" : "boat location");
  } else if (!project.customer_request) {
    missing.push("fabrication project details");
  }

  if (missing.length) {
    items.push({
      kind: "missing",
      title: "Missing Information",
      text: `Still need ${missing.join(", ")}.`,
    });
  }

  if (
    (project.proof_photos?.length ?? 0) === 0 &&
    project.waiting_on !== "Customer photos"
  ) {
    items.push({
      kind: "next",
      title: "Possible Next Move",
      text: "Photos may help Max understand the project before an inspection.",
    });
  } else if ((project.proof_photos?.length ?? 0) > 0) {
    items.push({
      kind: "next",
      title: "Customer Update",
      text: `${project.proof_photos.length} customer photo${project.proof_photos.length === 1 ? "" : "s"} received. Review them and decide whether an inspection is needed.`,
    });
  }

  if (project.waiting_on) {
    items.push({
      kind: "waiting",
      title: "Waiting On",
      text: project.waiting_on,
    });
  }

  if (
    project.current_milestone === "Estimate" &&
    !project.max_observed &&
    !project.team_found
  ) {
    items.push({
      kind: "risk",
      title: "Project Risk",
      text: "An estimate is being prepared without documented inspection findings.",
    });
  }

  const request = (project.customer_request || "").toLowerCase();
  if (
    request.includes("repower") ||
    request.includes("electronics") ||
    request.includes("upgrade")
  ) {
    items.push({
      kind: "opportunity",
      title: "Opportunity",
      text: "The customer mentioned upgrade work. There may be additional scope worth discussing.",
    });
  }

  if (!items.some((item) => item.kind === "next")) {
    items.push({
      kind: "next",
      title: "Next Move",
      text: project.next_action || "Review the project and decide the next action.",
    });
  }

  return items.slice(0, 5);
}

export default function PerformancePowerboatsLiveBoard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPreparedParts, setEditingPreparedParts] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [filter, setFilter] = useState("open");
  const [photoRequestDraft, setPhotoRequestDraft] = useState<PhotoRequestDraft | null>(null);
  const [photoRequestStatus, setPhotoRequestStatus] = useState("");

  const selected = projects.find((project) => project.id === selectedId) ?? null;

  async function loadProjects() {
    setLoading(true);

    const { data, error } = await supabase
      .from("performance_powerboat_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setProjects([]);
    } else {
      setProjects(((data ?? []) as Project[]).map(normalizeDrawerWording));
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProjects();

    const channel = supabase
      .channel("performance-powerboats-live-board")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "performance_powerboat_projects",
        },
        () => loadProjects()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return projects;
    if (filter === "closed") {
      return projects.filter((project) => project.current_milestone === "Closed");
    }

    return projects.filter((project) => project.current_milestone !== "Closed");
  }, [projects, filter]);

  async function updateProject(patch: Partial<Project>, timelineLabel?: string) {
    if (!selected) return;

    setSaving(true);

    const nextTimeline = timelineLabel
      ? [
          ...(selected.timeline ?? []),
          {
            at: new Date().toISOString(),
            label: timelineLabel,
          },
        ]
      : selected.timeline ?? [];

    const payload = {
      ...patch,
      timeline: nextTimeline,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("performance_powerboat_projects")
      .update(payload)
      .eq("id", selected.id);

    if (error) {
      alert(error.message);
    } else {
      await loadProjects();
    }

    setSaving(false);
  }

  async function createEstimate() {
    if (!selected) return;

    const estimateNumber =
      selected.estimate_number ||
      `PP-${selected.id.slice(0, 8).toUpperCase()}`;

    await updateProject(
      {
        estimate_number: estimateNumber,
        estimate_status: "draft",
        current_milestone: "Estimate",
        next_action: "Prepare and send estimate",
        waiting_on: null,
      },
      "Estimate created"
    );
  }

  async function sendEstimate() {
    if (!selected || !selected.estimate_number) return;

    const total = Number(selected.estimate_total);

    if (!Number.isFinite(total) || total <= 0) {
      alert("Add the estimate total before sending it.");
      return;
    }

    const estimateUrl =
      `${window.location.origin}/planet/performance-powerboats/estimate/${selected.id}` +
      `?token=${selected.customer_access_token}`;

    const message =
      `Hi ${selected.customer_name}, your Performance Powerboats estimate ` +
      `${selected.estimate_number} is ready. Review it here: ${estimateUrl}`;

    const phone = normalizeUsPhoneForAction(selected.customer_phone);

    const separator =
      /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)
        ? "&"
        : "?";

    const smsUrl =
      `sms:${phone}${separator}body=${encodeURIComponent(message)}`;

    await updateProject(
      {
        estimate_total: selected.estimate_total,
        estimate_notes: selected.estimate_notes,
        estimate_status: "sent",
        estimate_sent_at: new Date().toISOString(),
        current_milestone: "Estimate",
        next_action: "Waiting for customer approval",
        waiting_on: "Customer approval",
      },
      "Estimate sent"
    );

    window.location.href = smsUrl;
  }
  async function savePreparationParts() {
    if (!selected) return;

    const cleanParts = (selected.parts ?? [])
      .filter((part: any) =>
        String(part?.description || part?.name || "").trim()
      )
      .map((part: any) => ({
        id:
          part?.id ||
          globalThis.crypto?.randomUUID?.() ||
          `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        description: String(
          part?.description || part?.name || ""
        ).trim(),
        quantity: Math.max(1, Number(part?.quantity) || 1),
        status: part?.status || "planned",
      }));

    if (!cleanParts.length) {
      alert("Add at least one part or material.");
      return;
    }

    await updateProject(
      {
        parts: cleanParts,
        next_action:
          selected.current_milestone === "Scheduled"
            ? "Start the work"
            : "Schedule the work",
        waiting_on: null,
      },
      `Parts / materials prepared (${cleanParts.length} item${
        cleanParts.length === 1 ? "" : "s"
      })`
    );

    setEditingPreparedParts(false);
  }
  async function saveWorkSchedule() {
    if (!selected) return;

    const startDate = String(selected.next_date || "").trim();
    const assignedTo = String(selected.assigned_to || "").trim();

    if (!startDate) {
      alert("Choose a start date.");
      return;
    }

    if (!assignedTo) {
      alert("Choose who this job is assigned to.");
      return;
    }

    const readableDate = new Date(
      `${startDate}T12:00:00`
    ).toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    await updateProject(
      {
        assigned_to: assignedTo,
        next_date: startDate,
        current_milestone: "Scheduled",
        next_action: "Start the work",
        waiting_on: null,
      },
      `Work scheduled for ${readableDate} — ${assignedTo}`
    );

    setEditingSchedule(false);
  }
  async function startProjectWork() {
    if (!selected) return;

    await updateProject(
      {
        current_milestone: "Work Underway",
        next_action: "Begin inspection and document findings",
        waiting_on: null,
      },
      "Work started"
    );
  }
  async function sendPhotoRequest() {
    if (!selected) return;

    const draft = buildPhotoRequestDraft(selected);
    setPhotoRequestDraft(draft);
    setPhotoRequestStatus("Message ready with secure upload link.");

    const alreadyWaiting =
      selected.waiting_on === "Customer photos" &&
      selected.current_milestone === "Waiting on Customer";

    if (!alreadyWaiting) {
      await updateProject(
        {
          waiting_on: "Customer photos",
          current_milestone: "Waiting on Customer",
          next_action: "Waiting for customer photos",
        },
        "Photo request opened in messaging app."
      );
    }

    window.location.href = draft.smsUrl;
  }

  async function copyPhotoRequest() {
    if (!photoRequestDraft) return;
    try {
      await navigator.clipboard.writeText(photoRequestDraft.message);
      setPhotoRequestStatus("Customer message copied.");
    } catch {
      setPhotoRequestStatus("Copy was blocked. Select the message below and copy it manually.");
    }
  }

  const intelligence = selected ? buildIntelligence(selected) : [];

  return (
    <main className="ppb-board-page">
      <header className="ppb-header">
        <div>
          <div className="ppb-kicker">PERFORMANCE POWERBOATS</div>
          <h1>LIVE BOARD</h1>
          <p>What needs attention. What changed. What happens next.</p>
        </div>

        <a href="/planet/performance-powerboats" className="ppb-public-link">
          OPEN LIVE PAGE
        </a>
      </header>

      <section className="ppb-board-shell">
        <div className="ppb-toolbar">
          <div className="ppb-tabs">
            <button
              className={filter === "open" ? "active" : ""}
              onClick={() => setFilter("open")}
            >
              OPEN
            </button>
            <button
              className={filter === "closed" ? "active" : ""}
              onClick={() => setFilter("closed")}
            >
              CLOSED
            </button>
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              ALL
            </button>
          </div>

          <div className="ppb-count">
            {visible.length} project{visible.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading ? (
          <div className="ppb-empty">Loading projects...</div>
        ) : visible.length === 0 ? (
          <div className="ppb-empty">
            <strong>NO PROJECTS WAITING.</strong>
            <span>
              New customer requests will appear here as soon as they are submitted.
            </span>
          </div>
        ) : (
          <div className="ppb-project-list">
            {visible.map((project) => {
              const intelligenceCount = buildIntelligence(project).length;

              return (
                <button
                  key={project.id}
                  className="ppb-project-card"
                  onClick={() => {
                    setSelectedId(project.id);
                    setPhotoRequestDraft(null);
                    setPhotoRequestStatus("");
                  }}
                >
                  <div className="ppb-card-top">
                    <span className="ppb-status">{project.current_milestone}</span>
                    <span className="ppb-time">
                      {new Date(project.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h2>{project.customer_name}</h2>
                  <div className="ppb-project-type">{project.project_type}</div>

                  {boatLabel(project) && (
                    <div className="ppb-boat-line">{boatLabel(project)}</div>
                  )}

                  <p>{project.customer_request || "No project description yet."}</p>

                  <div className="ppb-card-bottom">
                    <span>{project.next_action}</span>
                    <strong>{intelligenceCount} SIGNALS →</strong>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {selected && (
        <div className="ppb-overlay" onClick={() => setSelectedId(null)}>
          <aside className="ppb-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="ppb-drawer-head">
              <div>
                <div className="ppb-kicker">ACTIVE WORK ORDER</div>
                <h2>{selected.customer_name}</h2>
                <span>{selected.project_type}</span>
              </div>

              <button className="ppb-close" onClick={() => setSelectedId(null)}>
                ×
              </button>
            </div>

            <section className="ppb-intelligence">
              <div className="ppb-section-title">
                <div>
                  <span>INTELLIGENCE LAYER</span>
                  <h3>WHAT NEEDS ATTENTION</h3>
                </div>
              </div>

              <div className="ppb-intelligence-grid">
                {intelligence.map((item, index) => (
                  <article className={`ppb-signal ${item.kind}`} key={`${item.kind}-${index}`}>
                    <span>{item.title}</span>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="ppb-drawer-section">
              <div className="ppb-section-title">
                <h3>{selected.project_type === "Custom Metal Fabrication" ? "CUSTOMER + PROJECT TRUTH" : "CUSTOMER + BOAT TRUTH"}</h3>
              </div>

              <div className="ppb-truth-grid">
                <div>
                  <span>Name</span>
                  <strong>{selected.customer_name}</strong>
                </div>
                <div>
                  <span>Phone</span>
                  <a href={`tel:${normalizeUsPhoneForAction(selected.customer_phone)}`}>{selected.customer_phone}</a>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{selected.customer_email || "Not provided"}</strong>
                </div>
                <div>
                  <span>Project</span>
                  <strong>{selected.project_type}</strong>
                </div>
                {selected.project_type !== "Custom Metal Fabrication" && (
                  <div>
                    <span>Boat</span>
                    <strong>{boatLabel(selected) || "Not fully identified yet"}</strong>
                  </div>
                )}
                <div>
                  <span>{selected.project_type === "Custom Metal Fabrication" ? "Project Location" : "Location"}</span>
                  <strong>{selected.boat_location || "Not provided"}</strong>
                </div>
              </div>

              <div className="ppb-original-request">
                <span>CUSTOMER REPORTED</span>
                <p>{selected.customer_request || "No message provided."}</p>
              </div>
            </section>

            <section className="ppb-drawer-section">
              <div className="ppb-section-title">
                <h3>CURRENT MILESTONE</h3>
              </div>

              <div className="ppb-milestone-row">
                <select
                  value={selected.current_milestone}
                  onChange={(event) =>
                    updateProject(
                      {
                        current_milestone: event.target.value,
                      },
                      `Milestone changed to ${event.target.value}`
                    )
                  }
                >
                  {MILESTONES.map((milestone) => (
                    <option key={milestone}>{milestone}</option>
                  ))}
                </select>

                <input
                  value={selected.next_action || ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setProjects((current) =>
                      current.map((project) =>
                        project.id === selected.id
                          ? { ...project, next_action: value }
                          : project
                      )
                    );
                  }}
                  onBlur={() =>
                    updateProject({
                      next_action: selected.next_action,
                    })
                  }
                  placeholder="What happens next?"
                />
              </div>
            </section>

            <section className="ppb-next-action">
              <div>
                <span>NEXT ACTION</span>
                <strong>{selected.waiting_on === "Customer photos" && (selected.proof_photos?.length ?? 0) === 0 ? "Waiting for customer photos" : selected.next_action || "Decide what happens next."}</strong>
              </div>

              <div className="ppb-next-actions">
                <a href={`tel:${normalizeUsPhoneForAction(selected.customer_phone)}`}>CALL</a>

                {(selected.proof_photos?.length ?? 0) === 0 && (
                  <button
                    type="button"
                    onClick={sendPhotoRequest}
                    disabled={saving}
                  >
                    SEND PHOTO REQUEST
                  </button>
                )}
              </div>

              {photoRequestDraft && (
                <div className="ppb-message-ready" role="status">
                  <strong>PHOTO REQUEST READY</strong>
                  <p>{photoRequestStatus}</p>
                  <textarea readOnly value={photoRequestDraft.message} aria-label="Customer photo request message" />
                  <div>
                    <a href={photoRequestDraft.smsUrl}>OPEN MESSAGES</a>
                    <button type="button" onClick={copyPhotoRequest}>COPY MESSAGE</button>
                  </div>
                </div>
              )}
            </section>

            {["Inspection / Scope", "Estimate", "Approved", "Scheduled", "Work Underway", "Water Test / Final Check", "Ready", "Closed"].includes(selected.current_milestone) && (
            <section className="ppb-drawer-section">
              <div className="ppb-section-title">
                <h3>PROJECT STORY</h3>
              </div>

              {[
                ["MAX OBSERVED", "max_observed", "What Max learned from the call or inspection..."],
                ["TEAM FOUND", "team_found", "What was actually found during inspection or teardown..."],
                ["RECOMMENDED WORK", "recommended_work", "What should be done..."],
                ["WORK PERFORMED", "work_performed", "What was actually completed..."],
              ].map(([label, key, placeholder]) => (
                <label className="ppb-story-field" key={key}>
                  <span>{label}</span>
                  <textarea
                    value={(selected as any)[key] || ""}
                    placeholder={placeholder}
                    onChange={(event) => {
                      const value = event.target.value;
                      setProjects((current) =>
                        current.map((project) =>
                          project.id === selected.id
                            ? { ...project, [key]: value }
                            : project
                        )
                      );
                    }}
                    onBlur={() =>
                      updateProject({
                        [key]: (selected as any)[key],
                      } as Partial<Project>)
                    }
                  />
                </label>
              ))}

              <div className="ppb-stitched">
                <span>STITCHED PROJECT SUMMARY</span>
                <p>
                  {[
                    selected.customer_request
                      ? `Customer reported: ${sentence(selected.customer_request)}`
                      : "",
                    selected.max_observed
                      ? `Max observed: ${sentence(selected.max_observed)}`
                      : "",
                    selected.team_found
                      ? `Team found: ${sentence(selected.team_found)}`
                      : "",
                    selected.recommended_work
                      ? `Recommended work: ${sentence(selected.recommended_work)}`
                      : "",
                    selected.work_performed
                      ? `Work performed: ${sentence(selected.work_performed)}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              </div>
            </section>
            )}

            {(selected.current_milestone === "Estimate" ||
              !!selected.estimate_number) && (
              <section className="ppb-drawer-section ppb-estimate-workspace">
                <div className="ppb-section-title">
                  <div>
                    <h3>ESTIMATE</h3>
                    <span>Build it here. The customer receives the finished estimate page.</span>
                  </div>
                </div>

                {!selected.estimate_number ? (
                  <button
                    type="button"
                    className="ppb-estimate-create"
                    onClick={createEstimate}
                    disabled={saving}
                  >
                    CREATE ESTIMATE
                  </button>
                ) : (
                  <>
                    <div className="ppb-estimate-summary">
                      <div>
                        <span>ESTIMATE</span>
                        <strong>{selected.estimate_number}</strong>
                      </div>

                      <div>
                        <span>STATUS</span>
                        <strong>
                          {(selected.estimate_status || "draft").toUpperCase()}
                        </strong>
                      </div>
                    </div>

                    <label className="ppb-estimate-total">
                      <span>ESTIMATED TOTAL</span>
                      <div>
                        <b>$</b>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={selected.estimate_total ?? ""}
                          placeholder="0.00"
                          onChange={(event) => {
                            const value = event.target.value;

                            setProjects((current) =>
                              current.map((project) =>
                                project.id === selected.id
                                  ? {
                                      ...project,
                                      estimate_total:
                                        value === ""
                                          ? null
                                          : Number(value),
                                    }
                                  : project
                              )
                            );
                          }}

                        />
                      </div>
                    </label>

                    <label className="ppb-estimate-notes">
                      <span>ESTIMATE NOTES</span>
                      <textarea
                        value={selected.estimate_notes || ""}
                        placeholder="Only add what the customer needs to know..."
                        onChange={(event) => {
                          const value = event.target.value;

                          setProjects((current) =>
                            current.map((project) =>
                              project.id === selected.id
                                ? {
                                    ...project,
                                    estimate_notes: value,
                                  }
                                : project
                            )
                          );
                        }}

                      />
                    </label>

                    <div className="ppb-estimate-actions">
                      {selected.estimate_status === "approved" ? (
                        <strong className="ppb-estimate-approved">
                          ✓ CUSTOMER APPROVED
                        </strong>
                      ) : (
                        <button
                          type="button"
                          onClick={sendEstimate}
                          disabled={saving}
                        >
                          SEND ESTIMATE
                        </button>
                      )}
                    </div>
                  </>
                )}
              </section>
            )}
            {["Approved", "Scheduled", "Work Underway"].includes(selected.current_milestone) && (
              <section className="ppb-drawer-section ppb-prepare-job">
                {(selected.parts?.length ?? 0) > 0 &&
                !editingPreparedParts ? (
                  <>
                    <div className="ppb-parts-ready">
                      <div className="ppb-parts-ready-check">✓</div>

                      <div className="ppb-parts-ready-copy">
                        <h3>PARTS READY</h3>
                        <span>
                          {selected.parts?.length ?? 0} item
                          {(selected.parts?.length ?? 0) === 1 ? "" : "s"} prepared
                          for this job.
                        </span>
                      </div>

                      <button
                        type="button"
                        className="ppb-edit-parts"
                        onClick={() => setEditingPreparedParts(true)}
                      >
                        EDIT PARTS
                      </button>
                    </div>

                    {selected.current_milestone === "Approved" && (
                      <div className="ppb-next-step-card">
                        <span>NEXT STEP</span>
                        <strong>Schedule the work</strong>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="ppb-section-title">
                      <div>
                        <h3>PREPARE THE JOB</h3>
                        <span>
                          Build the parts + materials list for this approved work.
                        </span>
                      </div>
                    </div>

                    <div className="ppb-approved-scope">
                      <span>APPROVED SCOPE</span>
                      <p>
                        {selected.recommended_work ||
                          selected.customer_request ||
                          "Approved project"}
                      </p>
                    </div>

                    <div className="ppb-prep-parts">
                      {(selected.parts ?? []).map(
                        (part: any, index: number) => (
                          <div
                            className="ppb-prep-part"
                            key={part.id || index}
                          >
                            <input
                              value={part.description || part.name || ""}
                              placeholder="Part or material"
                              onChange={(event) => {
                                const value = event.target.value;

                                setProjects((current) =>
                                  current.map((project) =>
                                    project.id === selected.id
                                      ? {
                                          ...project,
                                          parts: (
                                            project.parts ?? []
                                          ).map(
                                            (
                                              item: any,
                                              itemIndex: number
                                            ) =>
                                              itemIndex === index
                                                ? {
                                                    ...item,
                                                    description: value,
                                                  }
                                                : item
                                          ),
                                        }
                                      : project
                                  )
                                );
                              }}
                            />

                            <label>
                              <span>QTY</span>

                              <input
                                type="number"
                                min="1"
                                inputMode="numeric"
                                value={part.quantity || 1}
                                onChange={(event) => {
                                  const quantity = Math.max(
                                    1,
                                    Number(event.target.value) || 1
                                  );

                                  setProjects((current) =>
                                    current.map((project) =>
                                      project.id === selected.id
                                        ? {
                                            ...project,
                                            parts: (
                                              project.parts ?? []
                                            ).map(
                                              (
                                                item: any,
                                                itemIndex: number
                                              ) =>
                                                itemIndex === index
                                                  ? {
                                                      ...item,
                                                      quantity,
                                                    }
                                                  : item
                                            ),
                                          }
                                        : project
                                    )
                                  );
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              aria-label="Remove part"
                              onClick={() =>
                                setProjects((current) =>
                                  current.map((project) =>
                                    project.id === selected.id
                                      ? {
                                          ...project,
                                          parts: (
                                            project.parts ?? []
                                          ).filter(
                                            (
                                              _: any,
                                              itemIndex: number
                                            ) => itemIndex !== index
                                          ),
                                        }
                                      : project
                                  )
                                )
                              }
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      className="ppb-add-prep-part"
                      onClick={() =>
                        setProjects((current) =>
                          current.map((project) =>
                            project.id === selected.id
                              ? {
                                  ...project,
                                  parts: [
                                    ...(project.parts ?? []),
                                    {
                                      id:
                                        globalThis.crypto
                                          ?.randomUUID?.() ||
                                        `${Date.now()}-${Math.random()
                                          .toString(16)
                                          .slice(2)}`,
                                      description: "",
                                      quantity: 1,
                                      status: "planned",
                                    },
                                  ],
                                }
                              : project
                          )
                        )
                      }
                    >
                      + ADD PART / MATERIAL
                    </button>

                    <button
                      type="button"
                      className="ppb-prep-save"
                      disabled={
                        saving ||
                        !(selected.parts ?? []).some((part: any) =>
                          String(
                            part?.description || part?.name || ""
                          ).trim()
                        )
                      }
                      onClick={savePreparationParts}
                    >
                      SAVE & CONTINUE
                    </button>
                  </>
                )}
              </section>
            )}
            {(
              (selected.current_milestone === "Approved" &&
                selected.next_action === "Schedule the work") ||
              ["Scheduled", "Work Underway"].includes(selected.current_milestone)
            ) && (
              <section className="ppb-drawer-section ppb-schedule-work">
                {["Scheduled", "Work Underway"].includes(selected.current_milestone) &&
                !editingSchedule ? (
                  <>
                    <div className="ppb-scheduled-ready">
                      <div className="ppb-scheduled-check">✓</div>

                      <div className="ppb-scheduled-copy">
                        <h3>SCHEDULED</h3>
                        <span>
                          {scheduleDateLabel(selected.next_date)}
                          {selected.assigned_to
                            ? ` · ${selected.assigned_to}`
                            : ""}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="ppb-edit-schedule"
                        onClick={() => setEditingSchedule(true)}
                      >
                        EDIT SCHEDULE
                      </button>
                    </div>

                    {selected.current_milestone === "Scheduled" && (
                      <div className="ppb-next-step-card">
                        <span>NEXT STEP</span>
                        <strong>Start the work</strong>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="ppb-section-title">
                      <div>
                        <h3>SCHEDULE THE WORK</h3>
                        <span>
                          Set when the approved job begins and who owns it.
                        </span>
                      </div>
                    </div>

                    <div className="ppb-schedule-fields">
                      <label>
                        <span>START DATE</span>

                        <input
                          type="date"
                          value={scheduleDateValue(selected.next_date)}
                          onChange={(event) => {
                            const value = event.target.value;

                            setProjects((current) =>
                              current.map((project) =>
                                project.id === selected.id
                                  ? {
                                      ...project,
                                      next_date: value,
                                    }
                                  : project
                              )
                            );
                          }}
                        />
                      </label>

                      <label>
                        <span>ASSIGNED TO</span>

                        <input
                          value={selected.assigned_to || ""}
                          placeholder="Max / technician"
                          onChange={(event) => {
                            const value = event.target.value;

                            setProjects((current) =>
                              current.map((project) =>
                                project.id === selected.id
                                  ? {
                                      ...project,
                                      assigned_to: value,
                                    }
                                  : project
                              )
                            );
                          }}
                        />
                      </label>
                    </div>

                    <button
                      type="button"
                      className="ppb-schedule-save"
                      disabled={
                        saving ||
                        !String(selected.next_date || "").trim() ||
                        !String(selected.assigned_to || "").trim()
                      }
                      onClick={saveWorkSchedule}
                    >
                      SAVE & CONTINUE
                    </button>
                  </>
                )}
              </section>
            )}
            {["Scheduled", "Work Underway"].includes(
              selected.current_milestone
            ) && (
              <section className="ppb-drawer-section ppb-start-work">
                {selected.current_milestone === "Work Underway" ? (
                  <>
                    <div className="ppb-work-started">
                      <div className="ppb-work-started-check">✓</div>

                      <div className="ppb-work-started-copy">
                        <h3>WORK STARTED</h3>
                        <span>
                          {selected.assigned_to
                            ? `${selected.assigned_to} · Work underway`
                            : "Work underway"}
                        </span>
                      </div>
                    </div>

                    <div className="ppb-live-work-piece">
                      <span>NEXT LIVE WORK</span>
                      <strong>Begin inspection + document findings</strong>
                      <p>
                        The technician now works from the Tech Pad.
                        Findings, parts, photos, and progress stay connected
                        to this project.
                      </p>

                      <a
                        className="ppb-open-tech-pad"
                        href={`/planet/performance-powerboats/tech/${selected.id}`}
                      >
                        OPEN TECH PAD
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ppb-section-title">
                      <div>
                        <h3>START THE WORK</h3>
                        <span>
                          Everything is prepared. Begin the scheduled job.
                        </span>
                      </div>
                    </div>

                    <div className="ppb-start-work-summary">
                      <div>
                        <span>ASSIGNED TO</span>
                        <strong>
                          {selected.assigned_to || "Not assigned"}
                        </strong>
                      </div>

                      <div>
                        <span>SCHEDULED</span>
                        <strong>
                          {scheduleDateLabel(selected.next_date)}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ppb-start-work-button"
                      disabled={saving}
                      onClick={startProjectWork}
                    >
                      START WORK
                    </button>
                  </>
                )}
              </section>
            )}
            <section className="ppb-drawer-section">
              <div className="ppb-section-title ppb-section-action">
                <div>
                  <h3>PHOTOS + PROOF</h3>
                  <span>
                    Beginning, inspection, damage, parts, progress, completion, water test.
                  </span>
                </div>
              </div>

              {(selected.proof_photos?.length ?? 0) === 0 ? (
                <div className="ppb-proof-empty">
                  No project photos attached yet.
                </div>
              ) : (
                <div className="ppb-proof-grid">
                  {(
                    selected.customer_email === "dannyscandys@gmail.com" &&
                    selected.project_type === "Restoration & Refit"
                      ? [
                          {
                            url: "/images/performance-powerboats/seacraft_boat_workshop.png",
                          },
                          {
                            url: "/images/performance-powerboats/boat_shed_maintenance_with_twin_yamaha_150s.png",
                          },
                        ]
                      : selected.proof_photos
                  ).map((photo: any, index: number) => (
                    <img
                      key={index}
                      src={photo.url}
                      alt={
                        selected.customer_email === "dannyscandys@gmail.com" &&
                        selected.project_type === "Restoration & Refit"
                          ? `SeaCraft project reference ${index + 1}`
                          : ""
                      }
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="ppb-drawer-section">
              <div className="ppb-section-title">
                <h3>ASSIGNMENT + TIMING</h3>
              </div>

              <div className="ppb-form-grid">
                <label>
                  <span>Assigned To</span>
                  <input
                    value={selected.assigned_to || ""}
                    onChange={(event) =>
                      setProjects((current) =>
                        current.map((project) =>
                          project.id === selected.id
                            ? { ...project, assigned_to: event.target.value }
                            : project
                        )
                      )
                    }
                    onBlur={() =>
                      updateProject({
                        assigned_to: selected.assigned_to,
                      })
                    }
                    placeholder="Max / technician"
                  />
                </label>

                <label>
                  <span>Priority</span>
                  <select
                    value={selected.priority}
                    onChange={(event) =>
                      updateProject(
                        { priority: event.target.value },
                        `Priority changed to ${event.target.value}`
                      )
                    }
                  >
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                </label>

                <label className="ppb-full">
                  <span>Waiting On</span>
                  <input
                    value={selected.waiting_on || ""}
                    onChange={(event) =>
                      setProjects((current) =>
                        current.map((project) =>
                          project.id === selected.id
                            ? { ...project, waiting_on: event.target.value }
                            : project
                        )
                      )
                    }
                    onBlur={() =>
                      updateProject({
                        waiting_on: selected.waiting_on,
                      })
                    }
                    placeholder={(selected.proof_photos?.length ?? 0) > 0 ? "" : "Customer photos, inspection, parts, approval..."}
                  />
                </label>

              </div>
            </section>

            {((selected.labor?.length ?? 0) > 0 || (selected.parts?.length ?? 0) > 0) && (
            <section className="ppb-drawer-section">
              <div className="ppb-section-title">
                <h3>LABOR + PARTS / MATERIALS</h3>
              </div>

              <div className="ppb-cost-placeholder">
                <div>
                  <span>LABOR</span>
                  <strong>
                    {selected.labor?.length ?? 0} line
                    {(selected.labor?.length ?? 0) === 1 ? "" : "s"}
                  </strong>
                </div>
                <div>
                  <span>PARTS / MATERIALS</span>
                  <strong>
                    {selected.parts?.length ?? 0} line
                    {(selected.parts?.length ?? 0) === 1 ? "" : "s"}
                  </strong>
                </div>
              </div>
            </section>
            )}

            <section className="ppb-drawer-section">
              <div className="ppb-section-title">
                <h3>TRUTH CHAIN</h3>
                <span>Permanent project history.</span>
              </div>

              <div className="ppb-timeline">

                {(selected.timeline ?? []).map((event: any, index: number) => (
                  <div key={`${event.at}-${index}`}>
                    <i />
                    <span>
                      <strong>{event.label}</strong>
                      {event.at ? new Date(event.at).toLocaleString() : ""}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="ppb-drawer-footer">
              <span>{saving ? "Saving..." : "Live sync active"}</span>
              <strong>{selected.current_milestone}</strong>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}











