import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type TechJob = {
  id: string;
  customer: string;
  address: string;
  arrival: string;
  scope: string;
  status: string;
  crew: string;
  customerTruth: string;
  approvedScope: string;
  promisedIncluded: string[];
  notIncluded: string[];
  measurements: { name: string; location: string; measurement: string }[];
  requiredPhotos: string[];
  supplier: string;
  manufacturerPo: string;
  materialStatus: string;
};

const jobs: TechJob[] = [
  {
    id: "PW-1048",
    customer: "Michael & Sarah Carter",
    address: "1842 Palm Ridge Dr, Wellington",
    arrival: "8:00 AM",
    scope: "8 impact windows + rear French door",
    status: "Scheduled",
    crew: "Crew 2",
    customerTruth:
      "Rear door may require additional stucco work depending on opening condition. Preserve existing blinds. Customer prefers arrival before 9 AM.",
    approvedScope: "8 impact windows + rear French door",
    promisedIncluded: [
      "Remove and dispose of existing units",
      "White frames",
      "Preserve existing blinds where possible",
    ],
    notIncluded: [
      "Interior painting",
      "Hidden structural repair unless approved",
    ],
    measurements: [
      { name: "Window 01", location: "Master Bedroom", measurement: '36 1/4" x 62 1/2"' },
      { name: "Window 02", location: "Living Room", measurement: '48" x 60"' },
      { name: "Door 01", location: "Rear French Door", measurement: '72" x 80"' },
    ],
    requiredPhotos: [
      "Before condition",
      "Fasteners / screws",
      "Bucking / buck inspection",
      "Concrete / block opening",
      "Stucco condition",
      "Product label",
      "Installed unit",
      "Exterior overview",
    ],
    supplier: "ES Windows",
    manufacturerPo: "48592",
    materialStatus: "Expected Sept 14",
  },
  {
    id: "PW-1037",
    customer: "Robert Ellis",
    address: "Palm Beach Gardens",
    arrival: "1:00 PM",
    scope: "4 windows + front entry door",
    status: "Inspection",
    crew: "Crew 2",
    customerTruth:
      "Replace 4 windows and front entry door. Customer requested protection around interior flooring and wants all removed materials hauled away.",
    approvedScope: "4 windows + front entry door",
    promisedIncluded: [
      "Protect interior flooring",
      "Remove and haul away old materials",
      "Standard installation cleanup",
    ],
    notIncluded: [
      "Interior painting",
      "Repairs outside approved installation scope",
    ],
    measurements: [
      { name: "Window 01", location: "Front Bedroom", measurement: '35 3/4" x 61"' },
      { name: "Window 02", location: "Rear Bedroom", measurement: '36" x 60 1/2"' },
      { name: "Door 01", location: "Front Entry", measurement: '36" x 80"' },
    ],
    requiredPhotos: [
      "Fasteners / screws",
      "Bucking / buck inspection",
      "Installed window",
      "Installed entry door",
      "Product labels",
      "Exterior overview",
    ],
    supplier: "ES Windows",
    manufacturerPo: "48177",
    materialStatus: "Received",
  },
];

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      style={{
        border: "1px solid #27333b",
        borderRadius: 16,
        background: "#10151a",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: "100%",
          border: 0,
          background: "transparent",
          color: "#f5f7f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <strong>{title}</strong>
        <span style={{ color: "#8fa9bc", fontSize: 18 }}>
          {open ? "-" : "+"}
        </span>
      </button>

      {open ? (
        <div style={{ padding: "0 16px 16px" }}>{children}</div>
      ) : null}
    </section>
  );
}

function getPremierInstallerAccessToken() {
  const readStoredToken = (storage: Storage) => {
    try {
      const raw = storage.getItem("premier_staff_session");
      if (!raw) return null;

      const session = JSON.parse(raw);

      if (
        session?.expiresAt &&
        Date.now() >= new Date(session.expiresAt).getTime()
      ) {
        storage.removeItem("premier_staff_session");
        return null;
      }

      const token = String(session?.accessToken || "").trim();
      return token || null;
    } catch {
      return null;
    }
  };

  return (
    readStoredToken(window.localStorage) ||
    readStoredToken(window.sessionStorage)
  );
}

function InstallerBeamCard({ jobId, defaultRecipient = "Gino Marquez" }: { jobId: string; defaultRecipient?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [recipient, setRecipient] =
    useState<string>(defaultRecipient);
  useEffect(() => {
    setRecipient(defaultRecipient);
  }, [jobId, defaultRecipient]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  const loadMessages = async () => {
    const accessToken =
      getPremierInstallerAccessToken();

    if (!accessToken) {
      setError("Premier staff access is missing.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: loadError } = await supabase.rpc(
      "get_premier_installer_beam_messages",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (loadError) {
      console.error("Installer Beam load failed:", loadError);
      setError("Could not load Beam messages.");
      setMessages([]);
    } else {
      setMessages(data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadMessages();
  }, [jobId]);

  const sendMessage = async () => {
    const message = body.trim();

    if (!message || sending) return;

    const accessToken =
      getPremierInstallerAccessToken();

    if (!accessToken) {
      setError("Premier staff access is missing.");
      return;
    }

    setSending(true);
    setError("");

    const { error: sendError } = await supabase.rpc(
      "send_premier_beam_message",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
        p_sender_role: "Installer/Tech",
        p_recipient_role: recipient,
        p_body: message,
      }
    );

    if (sendError) {
      console.error("Installer Beam send failed:", sendError);
      setError("Could not send Beam message.");
      setSending(false);
      return;
    }

    setBody("");
    await loadMessages();
    setSending(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice typing is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setError("");
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Could not hear that. Please try again.");
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) return;

      setBody((current) =>
        current
          ? `${current}${current.endsWith(" ") ? "" : " "}${transcript}`
          : transcript
      );
    };

    recognition.start();
  };

  const quickActions = [
    "Material needed: ",
    "Need office call: ",
    "Job issue: ",
    "Running behind: ",
    "Ready for inspection: ",
  ];

  return (
    <div
      style={{
        border: "1px solid #78aa88",
        borderRadius: 14,
        background:
          "linear-gradient(135deg, #173225 0%, #101b16 100%)",
        boxShadow:
          "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
        marginTop: 12,
        padding: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ color: "#d9e5ee", fontSize: 12, fontWeight: 900 }}>
            Beam Quick Message
          </div>
          <div style={{ color: "#7f94a3", fontSize: 10, marginTop: 2 }}>
            Fast job communication
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadMessages()}
          disabled={loading}
          style={{
            border: "1px solid #31495a",
            borderRadius: 8,
            background: "#101820",
            color: "#a9bac6",
            padding: "6px 9px",
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          maxHeight: 170,
          overflowY: "auto",
          display: "grid",
          gap: 6,
          marginBottom: 9,
          border: "1px solid #294a36",
          borderRadius: 10,
          background: "#0d1711",
          padding: 8,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#78858e", fontSize: 11 }}>
            No Beam messages yet.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                border: "1px solid #273944",
                borderRadius: 8,
                background: "#0d141a",
                padding: 8,
              }}
            >
              <div style={{ color: "#8fa9bc", fontSize: 9, marginBottom: 4 }}>
                {message.sender_label} → {message.recipient_role}
              </div>

              <div style={{ color: "#d9e5ee", fontSize: 11 }}>
                {message.body}
              </div>
            </div>
          ))
        )}
      </div>

      
      <select
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        style={{
          width: "100%",
          minHeight: 40,
          border: "1px solid #31495a",
          borderRadius: 9,
          background: "#101820",
          color: "#d9e5ee",
          padding: "0 9px",
          fontSize: 11,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        <option value="Darcy">Darcy</option>
        <option value="Karolina">Karolina</option>
        <option value="Gio Richardson">Gio Richardson</option>
        <option value="Gino Marquez">Gino Marquez</option>
        <option value="Dennis Dillon">Dennis Dillon</option>
        <option value="RJ">RJ</option>
        <option value="Angel">Angel</option>
        <option value="Jose">Jose</option>
        <option value="Obelio">Obelio</option>
        <option value="Joseph">Joseph</option>
      </select>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 8,
        }}
      >
        {quickActions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => setBody(action)}
            style={{
              border: "1px solid #31495a",
              borderRadius: 999,
              background: "#101820",
              color: "#b8c8d3",
              padding: "6px 8px",
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            {action.replace(": ", "")}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 46px",
          gap: 8,
          alignItems: "stretch",
        }}
      >
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            listening
              ? "Listening..."
              : "Type or tap the mic and talk..."
          }
          rows={3}
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #31495a",
            borderRadius: 9,
            background: "#0d141a",
            color: "#d9e5ee",
            padding: 9,
            fontSize: 11,
            resize: "vertical",
          }}
        />

        <button
          type="button"
          onClick={startVoiceInput}
          disabled={listening}
          title="Talk message"
          aria-label="Talk message"
          style={{
            border: listening
              ? "1px solid #d98778"
              : "1px solid #31495a",
            borderRadius: 9,
            background: listening ? "#7a2d24" : "#2f6842",
            boxShadow: listening
              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
              : "none",
            color: "#d9e5ee",
            fontSize: 20,
            cursor: listening ? "wait" : "pointer",
          }}
        >
          🎤
        </button>
      </div>

      {error ? (
        <div style={{ color: "#d8b267", fontSize: 10, marginTop: 6 }}>
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void sendMessage()}
        disabled={sending || !body.trim()}
        style={{
          width: "100%",
          minHeight: 40,
          marginTop: 8,
          border: "1px solid #8fbea0",
          borderRadius: 9,
          background: "#2f6842",
          color: "#d9e5ee",
          fontWeight: 900,
          opacity: sending || !body.trim() ? 0.6 : 1,
        }}
      >
        {sending ? "Sending..." : `Send to ${recipient}`}
      </button>
    </div>
  );
}

function InstallerPreinstallationNotes({ jobId }: { jobId: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(false);
      const token = getPremierInstallerAccessToken();
      if (!token) {
        if (active) { setError(true); setLoading(false); }
        return;
      }
      const result = await supabase.rpc("get_premier_preinstallation_notes", {
        p_access_token: token,
        p_job_id: jobId,
      });
      if (!active) return;
      setNotes(result.error ? [] : (result.data ?? []));
      setError(Boolean(result.error));
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [jobId]);

  return (
    <div style={{ border: "1px solid #796346", borderRadius: 10, background: "#211b15", padding: 12, marginTop: 10 }}>
      <strong style={{ color: "#f3dfb5", fontSize: 13 }}>Job Notes from RJ</strong>
      <div style={{ color: "#ccbfae", fontSize: 11, marginTop: 4 }}>What RJ wants you to know before arriving.</div>
      {loading ? <div style={{ color: "#cfbfa9", marginTop: 8, fontSize: 12 }}>Loading notes...</div>
        : error ? <div role="alert" style={{ color: "#ffcf9d", marginTop: 8, fontSize: 12 }}>Notes could not load. Refresh before starting.</div>
        : notes.length === 0 ? <div style={{ color: "#cfbfa9", marginTop: 8, fontSize: 12 }}>No pre-installation notes recorded.</div>
        : <div style={{ display: "grid", gap: 8, marginTop: 9 }}>
            {notes.map((item) => (
              <div key={item.id} style={{ padding: 10, borderRadius: 8, background: "#30271c", border: "1px solid #635139" }}>
                <div style={{ color: "#f1cd8e", fontWeight: 800, fontSize: 11 }}>{(item.categories ?? []).join(" / ")}</div>
                <div style={{ color: "#f5f1e8", marginTop: 5, fontSize: 12, whiteSpace: "pre-wrap" }}>{item.details}</div>
                <div style={{ color: "#c0b29c", fontSize: 10, marginTop: 5 }}>{new Date(item.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>}
    </div>
  );
}
function InstallerMaterialAttention({ jobId, children }: { jobId: string; children?: React.ReactNode }) {
  const choices = ["Snap Covers", "Brake Metal", "Glass", "Door Hardware", "Other"];
  const [materialFormOpen, setMaterialFormOpen] = useState(false);
  const [materials, setMaterials] = useState<string[]>([]);
  const [condition, setCondition] = useState("Missing");
  const [openingType, setOpeningType] = useState("Window");
  const [opening, setOpening] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    setReports([]);
    setNotice("");
    const token = getPremierInstallerAccessToken();
    if (!token) return;
    void supabase.rpc("get_premier_installer_issue_reports", {
      p_access_token: token, p_job_id: jobId,
    }).then(({ data, error }) => {
      if (!active) return;
      if (error) setNotice("Could not load previous reports.");
      else setReports((data ?? []).filter((r: any) => String(r.details || "").startsWith("Material report | ")));
    });
    return () => { active = false; };
  }, [jobId]);
  const save = async () => {
    if (busy) return;
    if (!materials.length) { setNotice("Select at least one material."); return; }
    if (!opening.trim()) { setNotice("Enter the affected window or door location/number."); return; }
    if (materials.includes("Other") && !note.trim()) { setNotice("Describe the other material."); return; }
    const token = getPremierInstallerAccessToken();
    if (!token) { setNotice("Staff session missing. Sign in again."); return; }
    const details = `Material report | ${condition} | ${openingType}: ${opening.trim()}${note.trim() ? ` | ${note.trim()}` : ""}`;
    setBusy(true);
    setNotice("");
    try {
      const { data, error } = await supabase.rpc("report_premier_installer_issue", {
        p_access_token: token, p_job_id: jobId,
        p_categories: materials, p_details: details,
      });
      if (error || !data) throw error ?? new Error("Not saved");
      setNotice("Saved! RJ can review this material report.");
      setReports((current) => [{ id: String(data), categories: materials, details, reported_at: new Date().toISOString() }, ...current]);
      setMaterials([]); setOpening(""); setNote("");
    } catch (error) {
      console.error("Installer material report failed:", error);
      setNotice("Could not save. Please try again.");
    } finally { setBusy(false); }
  };
  const fieldStyle = { width: "100%", minHeight: 42, boxSizing: "border-box" as const, border: "1px solid #526b60", borderRadius: 9, background: "#0d141a", color: "#f3f6f8", padding: 9 };
  return (
    <section style={{ marginTop: 10, padding: 12, border: "1px solid #354840", borderRadius: 12, background: "#121b1b", color: "#f5f7f5" }}>
      <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 7 }}>Material Reports</div>
      {notice && <div role="status" style={{ color: "#e9d0ae", marginTop: 9, fontSize: 12 }}>{notice}</div>}
      {reports.length > 0 && <details style={{marginTop:10,border:"1px solid #354840",borderRadius:9,padding:9}}><summary style={{cursor:"pointer",fontWeight:800,fontSize:12,color:"#c8d9d0"}}>Work History — Material Reports ({reports.length})</summary><div style={{marginTop:10,display:"grid",gap:7}}><strong style={{fontSize:12}}>Saved Material Reports ({reports.length})</strong>{reports.map((r: any) => <div key={r.id} style={{ border: "1px solid #6e5445", background: "#161c20", borderRadius: 8, padding: 9, fontSize: 11 }}><strong>{(r.categories || []).join(", ")}</strong><div style={{ marginTop: 4 }}>{r.details}</div><div style={{ color: "#9faab2", marginTop: 4 }}>{new Date(r.reported_at).toLocaleString()}</div></div>)}</div></details>}
      <details style={{ marginTop: 12, border: "1px solid #557c64", borderRadius: 10, background: "#14221a", padding: 11 }}>
        <summary style={{ color: "#e0f0e4", fontWeight: 900, fontSize: 13, cursor: "pointer", minHeight: 30 }}>+ Report a Problem</summary>
        <div style={{ color: "#afc0b6", fontSize: 11, margin: "8px 0 12px" }}>Choose material or another field problem. Existing reports remain visible above.</div>
        <div style={{ border: "1px solid #385446", borderRadius: 9, padding: 10, marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 12, marginBottom: 8 }}>Material Problem</div>
      <button
        type="button"
        aria-expanded={materialFormOpen}
        onClick={() => setMaterialFormOpen((open) => !open)}
        style={{ width: "100%", minHeight: 42, border: "1px solid #8c735b", borderRadius: 9, background: "#16232a", color: "#f5f7f5", fontWeight: 900, cursor: "pointer", marginBottom: 10 }}
      >
        {materialFormOpen ? "Close Material Report" : "+ Report Another Material Issue"}
      </button>
      {materialFormOpen && (
        <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 12 }}>
        {choices.map((material) => <button key={material} type="button" onClick={() => setMaterials((current) => current.includes(material) ? current.filter((x) => x !== material) : [...current, material])} aria-pressed={materials.includes(material)} style={{ padding: "9px 12px", borderRadius: 9, border: materials.includes(material) ? "1px solid #e9bf91" : "1px solid #6e5445", background: materials.includes(material) ? "#805440" : "#151d22", color: "#fff", fontWeight: 800, cursor: "pointer" }}>{materials.includes(material) ? "✓ " : ""}{material}</button>)}
      </div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginBottom: 5 }}>What's wrong?</label>
      <select value={condition} onChange={(e) => setCondition(e.target.value)} style={{ ...fieldStyle, marginBottom: 12 }}>
        {["Missing", "Cracked / Damaged", "Not Delivered", "Wrong Size", "Other Issue"].map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginBottom: 5 }}>Affected opening</label>
      <div style={{ display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)", gap: 8, marginBottom: 12 }}>
        <select value={openingType} onChange={(e) => setOpeningType(e.target.value)} style={fieldStyle}><option>Window</option><option>Door</option></select>
        <input value={opening} onChange={(e) => setOpening(e.target.value)} placeholder="e.g. Kitchen W3 / Front D1" maxLength={120} style={fieldStyle} />
      </div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 800, marginBottom: 5 }}>Details (optional unless Other)</label>
      <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything RJ should know?" style={{ ...fieldStyle, resize: "vertical" }} />
      <button type="button" onClick={() => void save()} disabled={busy} style={{ width: "100%", minHeight: 46, marginTop: 10, borderRadius: 9, border: "1px solid #8fbea0", background: "#286743", color: "#fff", fontWeight: 900, opacity: busy ? 0.7 : 1 }}>{busy ? "Saving..." : "Save Material Report"}</button>
        </div>
      )}
        </div>
        {children}
      </details>
    </section>
  );
}

function getPremierInstallerGreeting() {
  try {
    const rawSession =
      window.localStorage.getItem("premier_staff_session") ||
      window.sessionStorage.getItem("premier_staff_session");
    if (!rawSession) return "";

    const session = JSON.parse(rawSession);
    const displayName = String(session?.displayName || "").trim();
    if (!displayName) return "";

    const firstName = displayName.split(" ")[0];
    const hour = new Date().getHours();
    const period =
      hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

    return `Good ${period}, ${firstName}.`;
  } catch {
    return "";
  }
}

function hasPremierInstallerAccess() {
  try {
    const rawSession =
      window.localStorage.getItem("premier_staff_session") ||
      window.sessionStorage.getItem("premier_staff_session");

    if (!rawSession) return false;

    const session = JSON.parse(rawSession);
    const roles = Array.isArray(session?.roles) ? session.roles : [];

    return roles.includes("installer");
  } catch {
    return false;
  }
}

type PremierPendingReturn = {job_id:string;review_id:string;reason:string;returned_at:string;acknowledged:boolean};

// premier-issue-followup-v1: timestamped, independent updates to original issue records.
function InstallerIssueFollowUp({jobId}:{jobId:string}) {
  const [reports,setReports]=useState<any[]>([]);
  // premier-angel-rj-decisions-v1: read-only RJ/Office decisions on each issue
  const [decisions,setDecisions]=useState<any[]>([]);
  const [events,setEvents]=useState<any[]>([]);
  const [open,setOpen]=useState<string|null>(null);
  const [actions,setActions]=useState<Record<string,string>>({});
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const load=async()=>{
    const token=getPremierInstallerAccessToken();
    if(!token){setError('Installer session missing. Sign in again.');setLoading(false);return;}
    setLoading(true);setError('');
    const [r,e,d]=await Promise.all([
      supabase.rpc('get_premier_installer_issue_reports',{p_access_token:token,p_job_id:jobId}),
      supabase.rpc('get_premier_installer_issue_followups',{p_access_token:token,p_job_id:jobId}),
      supabase.rpc('get_premier_installer_issue_decisions',{p_access_token:token,p_job_id:jobId})
    ]);
    if(r.error||e.error||d.error){setError(r.error?.message||e.error?.message||d.error?.message||'Could not load issue updates');}
    else{setReports(r.data??[]);setEvents(e.data??[]);setDecisions(d.data??[]);}
    setLoading(false);
  };
  useEffect(()=>{void load();},[jobId]);
  const save=async(issueId:string)=>{
    const action=actions[issueId]||'reviewed';
    const note=(notes[issueId]||'').trim();
    if(action==='needs_office'&&note.length<5){setError('Please explain what help you need.');return;}
    const token=getPremierInstallerAccessToken();
    if(!token){setError('Installer session missing.');return;}
    setBusy(issueId);setError('');setNotice('');
    const {data,error:saveError}=await supabase.rpc('update_premier_installer_issue_followup',{
      p_access_token:token,p_issue_id:issueId,p_action:action,p_note:note
    });
    setBusy(null);
    if(saveError||data!==true){setError(saveError?.message||'Could not save the issue update.');return;}
    setNotice('Update saved. RJ and Office can review the timestamped record.');
    setOpen(null);setNotes(current=>({...current,[issueId]:''}));await load();
  };
  const quickSave=async(issueId:string,action:string)=>{
    const token=getPremierInstallerAccessToken();
    if(!token){setError('Installer session missing. Sign in again.');return;}
    const note=action==='needs_office'?(notes[issueId]||'').trim():'';
    if(action==='needs_office'&&note.length<5){setError('Please describe the help you need.');return;}
    setBusy(issueId);setError('');setNotice('');
    const {data,error:saveError}=await supabase.rpc('update_premier_installer_issue_followup',{p_access_token:token,p_issue_id:issueId,p_action:action,p_note:note});
    setBusy(null);
    if(saveError||data!==true){setError(saveError?.message||'Could not save update.');return;}
    setNotice(action==='materials_received'?'Materials received. Finish the work when ready.':action==='fix_documented'?'Sent to RJ for verification.':'Message saved for RJ / Office.');
    setOpen(null);setNotes(v=>({...v,[issueId]:''}));await load();
  };
  // premier-work-history-collapse-v1: active issues visible; closed records remain accessible.
  const renderIssue=(report:any)=>{
      const latest=events.find((event:any)=>event.issue_id===report.id);
      // premier-basic-issue-actions-v1: show only the next relevant action
      const issueEvents=events.filter((event:any)=>event.issue_id===report.id);
      const waitingEvent=issueEvents.find((event:any)=>event.action==='waiting_materials');
      const receivedEvent=issueEvents.find((event:any)=>event.action==='materials_received');
      const waitingForMaterials=!!waitingEvent&&(!receivedEvent||new Date(waitingEvent.created_at)>new Date(receivedEvent.created_at));
      const decision=decisions.find((entry:any)=>entry.issue_id===report.id);
      const sentForVerification=latest?.action==='fix_documented'&&(!decision?.resolution_updated_at||new Date(latest.created_at)>new Date(decision.resolution_updated_at));
      const closed=decision?.resolution_status==='duplicate'||decision?.resolution_status==='resolved';
      const duplicate=decision?.resolution_status==='duplicate';
      const verified=decision?.resolution_status==='resolved';
      const status=duplicate?'Closed as Duplicate':verified?'Verified Resolved':sentForVerification?'Waiting for RJ to Check':waitingForMaterials?'Waiting for Parts':latest?.action==='materials_received'?'Parts Received':latest?.action==='needs_office'?'Needs RJ / Office':'Open';
      return <div key={report.id} style={{padding:10,border:'1px solid #554d43',borderRadius:9,background:'#121b1e',marginTop:8}}>
        <div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}><strong style={{fontSize:12}}>{(report.categories||[]).join(', ')||'Other Issue'}</strong><span style={{fontSize:10,color:verified?'#a5e4b9':'#f2d19b'}}>{status}</span></div>
        <div style={{fontSize:12,marginTop:5,whiteSpace:'pre-wrap'}}>{report.details}</div>
        {latest?<div style={{fontSize:11,color:'#b5c9d2',marginTop:7}}>Angel's Latest: {latest.note||'Reviewed'} ({new Date(latest.created_at).toLocaleString()})</div>:null}
        {decision?.resolution_updated_at?<div style={{marginTop:8,padding:9,border:'1px solid #4c6959',borderRadius:8,background:'#193027',fontSize:11}}>
          <strong>RJ / Office Latest Decision: {duplicate?'Closed as Duplicate':verified?'Verified Resolved':decision.resolution_status==='under_review'?'Under Review':'Needs Review'}</strong>
          <div style={{whiteSpace:'pre-wrap',marginTop:5}}>{decision.resolution_note||'No review note provided.'}</div>
          {duplicate&&decision.duplicate_of_issue_id?<div style={{marginTop:5,color:'#cde4d2'}}>Original report still tracked: {decisions.find((item:any)=>item.issue_id===decision.duplicate_of_issue_id)?.issue_id===decision.duplicate_of_issue_id?(reports.find((item:any)=>item.id===decision.duplicate_of_issue_id)?.categories||[]).join(', ')||'Original issue':'Original issue'} (ID {decision.duplicate_of_issue_id.slice(0,8)})</div>:null}
          <div style={{marginTop:5,color:'#bfccbF'}}>{(decision.resolution_updated_by||'RJ / Office').includes(':RJ')?'RJ':'RJ / Office'} · {new Date(decision.resolution_updated_at).toLocaleString()}</div>
          {duplicate?<div style={{marginTop:6,color:'#d5e7d8'}}>This duplicate report is closed. Follow the linked original issue; no separate repair update is required here.</div>:null}
        </div>:null}
        {!closed&&!sentForVerification?<div style={{marginTop:9,display:'grid',gap:8}}>
          {waitingForMaterials?
            <button type="button" disabled={busy===report.id} onClick={()=>{setActions(v=>({...v,[report.id]:'materials_received'}));void quickSave(report.id,'materials_received');}} style={{padding:11,background:'#286743',color:'#fff',border:'1px solid #8fbea0',borderRadius:8,fontWeight:900}}>{busy===report.id?'Saving...':'I Have the Materials'}</button>
            :<button type="button" disabled={busy===report.id} onClick={()=>void quickSave(report.id,'fix_documented')} style={{padding:11,background:'#286743',color:'#fff',border:'1px solid #8fbea0',borderRadius:8,fontWeight:900}}>{busy===report.id?'Saving...':'I Fixed It — Send to RJ'}</button>}
          <button type="button" onClick={()=>{setOpen(open===report.id?null:report.id);setError('');}} style={{padding:8,background:'#273c3a',border:'1px solid #6f928a',borderRadius:8,color:'#fff'}}>{open===report.id?'Cancel':'Need Help from RJ / Office'}</button>
          {open===report.id?<div style={{display:'grid',gap:8}}>
            <textarea rows={2} value={notes[report.id]||''} onChange={e=>setNotes(v=>({...v,[report.id]:e.target.value}))} placeholder="What do you need help with?" style={{background:'#101820',color:'#fff',border:'1px solid #536c61',borderRadius:8,padding:9,resize:'vertical'}} />
            <button type="button" disabled={busy===report.id} onClick={()=>void quickSave(report.id,'needs_office')} style={{padding:10,background:'#286743',color:'#fff',border:'1px solid #8fbea0',borderRadius:8,fontWeight:900}}>Send to RJ / Office</button>
          </div>:null}
        </div>:null}
        {!closed&&sentForVerification?<div style={{fontSize:11,color:'#b5e1bf',marginTop:8}}>Sent to RJ for verification. No more action needed here unless RJ returns it.</div>:null}
      </div>;
  };
  return <section style={{border:'1px solid #756447',borderRadius:12,background:'#1d1d19',padding:12,marginTop:12,color:'#f5f7f5'}}>
    <strong style={{fontSize:14}}>Job Issues &amp; Follow-Up</strong>
    <div style={{fontSize:11,color:'#d1c8b9',marginTop:4,marginBottom:10}}>Open each issue. Document repairs, missing materials, or the next action. RJ / Office verifies closure.</div>
    {loading?<p>Loading issues...</p>:error?<p role="alert" style={{color:'#ffd2a1'}}>{error}</p>:reports.length===0?<p style={{fontSize:12}}>No reported issues.</p>:null}
    {reports.filter((report:any)=>!['resolved','duplicate'].includes(decisions.find((d:any)=>d.issue_id===report.id)?.resolution_status)).map(renderIssue)}
    {reports.some((report:any)=>['resolved','duplicate'].includes(decisions.find((d:any)=>d.issue_id===report.id)?.resolution_status))?<details style={{marginTop:10,border:'1px solid #465d50',borderRadius:9,padding:10,background:'#14201a'}}>
      <summary style={{cursor:'pointer',fontSize:12,fontWeight:900,color:'#cde5d3'}}>Work History — Completed Issues ({reports.filter((report:any)=>['resolved','duplicate'].includes(decisions.find((d:any)=>d.issue_id===report.id)?.resolution_status)).length})</summary>
      {reports.filter((report:any)=>['resolved','duplicate'].includes(decisions.find((d:any)=>d.issue_id===report.id)?.resolution_status)).map(renderIssue)}
    </details>:null}
    {notice?<div role="status" style={{color:'#b5e1bf',marginTop:8,fontSize:12}}>{notice}</div>:null}
    {error&&!loading&&reports.length>0?<div role="alert" style={{color:'#ffd2a1',marginTop:8,fontSize:12}}>{error}</div>:null}
  </section>;
}

// premier-current-next-v1: latest documented issue action, without modifying the job stage or return history.
function PremierInstallerCurrentNext({jobId,fallback,returned}:{jobId:string;fallback:string;returned:boolean}) {
 const [label,setLabel]=useState<string|null>(null);
 useEffect(()=>{
  let active=true;const token=getPremierInstallerAccessToken();if(!token)return;
  void Promise.all([
   supabase.rpc('get_premier_installer_issue_followups',{p_access_token:token,p_job_id:jobId}),
   supabase.rpc('get_premier_installer_issue_decisions',{p_access_token:token,p_job_id:jobId})
  ]).then(([followups,decisions])=>{
   if(!active||followups.error||decisions.error)return;
   const events=(followups.data??[]) as Array<{issue_id:string;action:string;created_at:string}>;
   const issues=(decisions.data??[]) as Array<{issue_id:string;resolution_status:string}>;
   const open=issues.filter(x=>x.resolution_status!=='duplicate'&&x.resolution_status!=='resolved');
   // premier-final-next-after-issues-v1: all known issues cleared, installation still awaiting final handoff.
   if(issues.length>0&&open.length===0){setLabel('Complete Installation and Send to RJ for Final Review.');return;}
   const needRJ=open.every(issue=>{
    const latest=events.filter(e=>e.issue_id===issue.issue_id).sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime())[0];
    return latest?.action==='fix_documented';
   });
   if(needRJ)setLabel('Waiting for RJ to check the reported fix.');
  }).catch(()=>{});
  return()=>{active=false;};
 },[jobId]);
 return <>{returned&&label?label:fallback}</>;
}

export default function PremierInstallerTechBoard() {
  const installerGreeting = getPremierInstallerGreeting();
  const installerAccessAllowed = hasPremierInstallerAccess();

  useEffect(() => {
    if (!installerAccessAllowed) {
      window.location.replace("/planet/premier-window-door/staff");
    }
  }, [installerAccessAllowed]);
  // premier-return-visibility-v1: latest durable RJ review decision, not text matching.
  const [pendingReturns,setPendingReturns]=useState<Record<string,PremierPendingReturn>>({});
  useEffect(()=>{let active=true;const token=getPremierInstallerAccessToken();if(!token)return;
    void supabase.rpc('get_premier_pending_installation_returns',{p_access_token:token}).then(({data,error})=>{
      if(!active)return;if(error){console.error('RJ return status unavailable',error);return;}
      const found:Record<string,PremierPendingReturn>={};for(const item of (data??[]) as PremierPendingReturn[])found[item.job_id]=item;setPendingReturns(found);
    });return()=>{active=false};},[]);
  const [completionConfirmJobId, setCompletionConfirmJobId] =
    useState<string | null>(null);
  // premier-flowtest-submit-v1: explicit simulated submission for the single named test job.
  const [flowTestAcknowledged, setFlowTestAcknowledged] = useState(false);
  const [completionAcknowledged, setCompletionAcknowledged] = useState(false);
  const [returnAcknowledged,setReturnAcknowledged]=useState(false);
  // premier-completion-status-v1
  const [completionIssues, setCompletionIssues] = useState<any[]>([]);
  const [completionDecisions,setCompletionDecisions] = useState<any[]>([]);
  const completionOpenCount=completionIssues.filter((issue:any)=>{
    const d=completionDecisions.find((x:any)=>x.issue_id===issue.id);
    return !d||!['resolved','duplicate'].includes(d.resolution_status);
  }).length;
  const [completionIssuesLoading, setCompletionIssuesLoading] = useState(false);
  const [completionIssuesError, setCompletionIssuesError] = useState("");
  const [completionIssuesAcknowledged, setCompletionIssuesAcknowledged] = useState(false);
  const [completionSubmitting, setCompletionSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState("PW-1048");
  const [note, setNote] = useState("");
  const [updates, setUpdates] = useState<
    { time: string; text: string }[]
  >([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionMode, setCompletionMode] = useState<
    "clean" | "issue" | null
  >(null);
  const [punchOutOpening, setPunchOutOpening] = useState("");
  const [punchOutType, setPunchOutType] = useState("Missing Part");
  const [punchOutIssue, setPunchOutIssue] = useState("");
  const [punchOuts, setPunchOuts] = useState<
    {
      id: string;
      jobId: string;
      opening: string;
      type: string;
      issue: string;
      time: string;
      resolved: boolean;
    }[]
  >([]);

  const [liveInstallerJobs, setLiveInstallerJobs] = useState<any[]>([]);
  const [installerJobDocuments, setInstallerJobDocuments] =
    useState<Record<string, any[]>>({});
  const [installerJobDocumentsLoading, setInstallerJobDocumentsLoading] =
    useState<Record<string, boolean>>({});
  const [installerJobDocumentsErrors, setInstallerJobDocumentsErrors] =
    useState<Record<string, string>>({});
  const [installerJobFileOpenId, setInstallerJobFileOpenId] =
    useState<string | null>(null);

  const [installerBuckingOpenId, setInstallerBuckingOpenId] =
    useState<string | null>(null);

  const [selectedInstallerJobId, setSelectedInstallerJobId] =
    useState<string | null>(null);
  const [installerCompletionNotice, setInstallerCompletionNotice] =
    useState<string | null>(null);
  const [liveInstallerJobsLoading, setLiveInstallerJobsLoading] =
    useState(false);

  const [installerPunchItems, setInstallerPunchItems] =
    useState<Record<string, any[]>>({});
  const [installerPunchLoading, setInstallerPunchLoading] =
    useState<Record<string, boolean>>({});
  const [installerPunchResolving, setInstallerPunchResolving] =
    useState<Record<string, boolean>>({});
  const [installerPunchErrors, setInstallerPunchErrors] =
    useState<Record<string, string>>({});

  const [installerProofPhotos, setInstallerProofPhotos] = useState<
    Record<string, any[]>
  >({});

  const [uploadingInstallerProofJobId, setUploadingInstallerProofJobId] =
    useState<string | null>(null);

  const [buckingDrafts, setBuckingDrafts] = useState<
    Record<
      string,
      {
        buckingNotes: string;
        measurementNotes: string;
        materialIssueNotes: string;
        needsAttention: boolean;
        saved: boolean;
      }
    >
  >({});

  const [newBuckingNotes, setNewBuckingNotes] = useState<
    Record<string, { inspection: string; measurement: string }>
  >({});

  const [savingBuckingJobId, setSavingBuckingJobId] =
    useState<string | null>(null);

  const [installerIssueCategories, setInstallerIssueCategories] = useState<
    Record<string, string[]>
  >({});

  const [installerIssueListeningJobId, setInstallerIssueListeningJobId] =
    useState<string | null>(null);
  const [installerIssueSavingJobId, setInstallerIssueSavingJobId] =
    useState<string | null>(null);
  const startInstallerIssueVoice = (jobId: string) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert("Voice typing is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setInstallerIssueListeningJobId(jobId);
    recognition.onend = () => setInstallerIssueListeningJobId(null);
    recognition.onerror = () => {
      setInstallerIssueListeningJobId(null);
      window.alert("Could not hear that. Please try again.");
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (!transcript) return;

      setBuckingDrafts((current) => {
        const previous = current[jobId];
        const existing = previous?.materialIssueNotes ?? "";

        return {
          ...current,
          [jobId]: {
            buckingNotes: previous?.buckingNotes ?? "",
            measurementNotes: previous?.measurementNotes ?? "",
            materialIssueNotes: existing
              ? `${existing}${existing.endsWith(" ") ? "" : " "}${transcript}`
              : transcript,
            needsAttention: previous?.needsAttention ?? false,
            saved: false,
          },
        };
      });
    };

    recognition.start();
  };

  useEffect(() => {
    let active = true;

    const loadInstallerJobs = async () => {
      const accessToken =
        getPremierInstallerAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveInstallerJobs([]);
          setLiveInstallerJobsLoading(false);
        }
        return;
      }

      setLiveInstallerJobsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_installer_jobs",
        {
          p_access_token: accessToken,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Premier installer jobs failed:", error);
        setLiveInstallerJobs([]);
      } else {
        const jobsData = data ?? [];
        setLiveInstallerJobs(jobsData);

        const proofEntries = await Promise.all(
          jobsData.map(async (job: any) => {
            const { data: proofData, error: proofError } =
              await supabase.functions.invoke(
                "premier-installer-proof-photo",
                {
                  body: {
                    action: "list",
                    accessToken,
                    jobId: job.id,
                  },
                }
              );

            if (proofError) {
              console.error(
                `Premier installer proof load failed for ${job.id}:`,
                proofError
              );

              return [job.id, []] as const;
            }

            return [job.id, proofData?.photos ?? []] as const;
          })
        );

        if (active) {
          const proofMap = Object.fromEntries(proofEntries);

          setInstallerProofPhotos(proofMap);

          const nextBuckingDrafts: Record<
            string,
            {
              buckingNotes: string;
              measurementNotes: string;
              materialIssueNotes: string;
              needsAttention: boolean;
              saved: boolean;
            }
          > = {};

          for (const job of jobsData) {
            // Bucking notes are saved on the newest bucking proof photo.
            // Do not read the first/oldest photo when multiple photos exist.
            const buckingPhoto = (proofMap[job.id] ?? [])
              .filter((photo: any) => photo.proof_type === "Bucking / buck inspection")
              .sort((a: any, b: any) =>
                new Date(b.uploaded_at ?? 0).getTime() -
                new Date(a.uploaded_at ?? 0).getTime()
              )[0];

            if (buckingPhoto) {
              nextBuckingDrafts[job.id] = {
                buckingNotes: buckingPhoto.bucking_notes ?? "",
                measurementNotes: buckingPhoto.measurement_notes ?? "",
                materialIssueNotes:
                  buckingPhoto.material_issue_notes ?? "",
                needsAttention: Boolean(buckingPhoto.needs_attention),
                saved: Boolean(
                  buckingPhoto.bucking_notes ||
                    buckingPhoto.measurement_notes ||
                    buckingPhoto.material_issue_notes ||
                    buckingPhoto.needs_attention
                ),
              };
            }
          }

          const nextIssueCategories: Record<string, string[]> = {};
          const allowedIssueCategories = [
            "Scratches / Damage",
            "Brake Metal",
            "Broken Glass",
            "Missing Parts",
            "Wrong Measurement",
            "Installation / Fit",
            "Other",
          ];

          for (const [jobId, draft] of Object.entries(nextBuckingDrafts)) {
            const storedNotes = draft.materialIssueNotes;
            const match = storedNotes.match(
              /^Issues: ([^\r\n]+)(?:\r?\nDetails: ([\s\S]*))?$/
            );

            if (match) {
              const categories = match[1]
                .split(", ")
                .filter((category) =>
                  allowedIssueCategories.includes(category)
                );

              if (categories.length > 0) {
                nextIssueCategories[jobId] = categories;
                draft.materialIssueNotes = match[2] ?? "";
              }
            }
          }

          setInstallerIssueCategories(nextIssueCategories);
          setBuckingDrafts(nextBuckingDrafts);
        }
      }

      setLiveInstallerJobsLoading(false);
    };

    void loadInstallerJobs();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSelectedInstallerJobId((current) => {
      if (current && liveInstallerJobs.some((job) => job.id === current)) {
        return current;
      }

      if (installerCompletionNotice) {
        return null;
      }

      return null;
    });
  }, [liveInstallerJobs, installerCompletionNotice]);

  const [installerRepairNotes, setInstallerRepairNotes] =
    useState<Record<string, string>>({});
  const [installerRepairFiles, setInstallerRepairFiles] =
    useState<Record<string, File | null>>({});
  const [installerRepairSaving, setInstallerRepairSaving] =
    useState<Record<string, boolean>>({});
  const [installerRepairErrors, setInstallerRepairErrors] =
    useState<Record<string, string>>({});
  const [installerFinishReports, setInstallerFinishReports] =
    useState<Record<string, any[]>>({});

  const loadInstallerPunchItems = async (jobId: string) => {
    const accessToken =
      getPremierInstallerAccessToken() ||
      (() => {
        try {
          const stored = sessionStorage.getItem("premier_staff_session");
          if (!stored) return null;
          const session = JSON.parse(stored);
          return session?.accessToken || null;
        } catch (error) {
          console.error("Premier installer session read failed:", error);
          return null;
        }
      })();

    if (!accessToken) return;

    setInstallerPunchLoading((current) => ({
      ...current,
      [jobId]: true,
    }));

    setInstallerPunchErrors((current) => ({
      ...current,
      [jobId]: "",
    }));

    const { data, error } = await supabase.rpc(
      "get_premier_punch_items",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (error) {
      console.error("Premier installer punch items failed:", error);

      setInstallerPunchErrors((current) => ({
        ...current,
        [jobId]: "Could not load final finish items.",
      }));

      setInstallerPunchLoading((current) => ({
        ...current,
        [jobId]: false,
      }));

      return;
    }

    setInstallerPunchItems((current) => ({
      ...current,
      [jobId]: data ?? [],
    }));

    const { data: reports, error: reportsError } = await supabase.rpc(
      "get_premier_installer_finish_issues",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (reportsError) {
      console.error("Final finish reports failed:", reportsError);
      setInstallerPunchErrors((current) => ({
        ...current,
        [jobId]: "Could not load existing damage reports. Refresh and try again.",
      }));
      setInstallerFinishReports((current) => {
        const next = { ...current };
        delete next[jobId];
        return next;
      });
    } else {
      setInstallerFinishReports((current) => ({
        ...current,
        [jobId]: reports ?? [],
      }));
    }

    setInstallerPunchLoading((current) => ({
      ...current,
      [jobId]: false,
    }));
  };

  useEffect(() => {
    if (!selectedInstallerJobId) return;
    const job = liveInstallerJobs.find(
      (item: any) => item.id === selectedInstallerJobId
    );
    if (job?.current_stage === "installer_finish_back") {
      void loadInstallerPunchItems(job.id);
    }
  }, [selectedInstallerJobId]);

  const resolveInstallerFinishIssue = async (
    jobId: string,
    issueId: string
  ) => {
    const accessToken = getPremierInstallerAccessToken();
    if (!accessToken) {
      window.alert("Installer session missing. Please sign in again.");
      return;
    }

    if (!window.confirm("Mark this repair resolved?")) return;

    setInstallerRepairSaving((s) => ({ ...s, [issueId]: true }));
    setInstallerRepairErrors((s) => ({ ...s, [issueId]: "" }));

    try {
      const file = installerRepairFiles[issueId];

      if (file) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ) {
          throw new Error("Choose a JPG, PNG, or WEBP repair photo.");
        }

        const proofType = `Repair / ${issueId}`;

        const { data: upload, error: createError } =
          await supabase.functions.invoke("premier-installer-proof-photo", {
            body: {
              action: "create-upload",
              accessToken,
              jobId,
              proofType,
              fileName: file.name,
              mimeType: file.type,
            },
          });

        if (createError || !upload?.path || !upload?.token) {
          throw new Error(createError?.message || "Could not prepare repair photo.");
        }

        const { error: storageError } = await supabase.storage
          .from("premier-installer-proof-photos")
          .uploadToSignedUrl(upload.path, upload.token, file, {
            contentType: file.type,
          });

        if (storageError) throw storageError;

        const { error: finalizeError } =
          await supabase.functions.invoke("premier-installer-proof-photo", {
            body: {
              action: "finalize",
              accessToken,
              jobId,
              proofType,
              path: upload.path,
              fileName: file.name,
              mimeType: file.type,
            },
          });

        if (finalizeError) throw finalizeError;

        setInstallerRepairFiles((s) => ({ ...s, [issueId]: null }));
      }

      const { data, error } = await supabase.rpc(
        "resolve_premier_installer_finish_issue",
        {
          p_access_token: accessToken,
          p_issue_id: issueId,
          p_note: installerRepairNotes[issueId] || "",
        }
      );

      if (error) throw error;
      if (data !== true) {
        throw new Error("Issue was not changed. Refresh and review its status.");
      }

      const { data: reports, error: refreshError } = await supabase.rpc(
        "get_premier_installer_finish_issues",
        { p_access_token: accessToken, p_job_id: jobId }
      );

      if (refreshError) throw refreshError;

      setInstallerFinishReports((s) => ({
        ...s,
        [jobId]: reports ?? [],
      }));
      setInstallerRepairNotes((s) => ({ ...s, [issueId]: "" }));
    } catch (error: any) {
      const message = error?.message || "Could not resolve this issue.";
      setInstallerRepairErrors((s) => ({
        ...s,
        [issueId]: message,
      }));
      window.alert(message);
    } finally {
      setInstallerRepairSaving((s) => ({
        ...s,
        [issueId]: false,
      }));
    }
  };
  const resolveInstallerPunchItem = async (
    jobId: string,
    itemId: string
  ) => {
    const accessToken =
      getPremierInstallerAccessToken() ||
      (() => {
        try {
          const stored = sessionStorage.getItem("premier_staff_session");
          if (!stored) return null;
          const session = JSON.parse(stored);
          return session?.accessToken || null;
        } catch (error) {
          console.error("Premier installer session read failed:", error);
          return null;
        }
      })();

    if (!accessToken) return;

    setInstallerPunchResolving((current) => ({
      ...current,
      [itemId]: true,
    }));

    setInstallerPunchErrors((current) => ({
      ...current,
      [jobId]: "",
    }));

    const { data, error } = await supabase.rpc(
      "resolve_premier_punch_item",
      {
        p_access_token: accessToken,
        p_item_id: itemId,
      }
    );

    if (error || data !== true) {
      console.error("Resolve Premier punch item failed:", error);

      setInstallerPunchErrors((current) => ({
        ...current,
        [jobId]: "Could not mark that finish item complete.",
      }));

      setInstallerPunchResolving((current) => ({
        ...current,
        [itemId]: false,
      }));

      return;
    }

    await loadInstallerPunchItems(jobId);

    setInstallerPunchResolving((current) => ({
      ...current,
      [itemId]: false,
    }));
  };

  const loadInstallerJobDocuments = async (jobId: string) => {
    const accessToken =
      getPremierInstallerAccessToken() ||
      (() => {
        try {
          const stored = sessionStorage.getItem("premier_staff_session");
          if (!stored) return null;
          const session = JSON.parse(stored);
          return session?.accessToken || null;
        } catch (error) {
          console.error("Premier installer session read failed:", error);
          return null;
        }
      })();

    if (!accessToken) {
      setInstallerJobDocuments((current) => ({
        ...current,
        [jobId]: [],
      }));
      setInstallerJobDocumentsErrors((current) => ({
        ...current,
        [jobId]: "Premier staff access is missing.",
      }));
      return;
    }

    setInstallerJobDocumentsLoading((current) => ({
      ...current,
      [jobId]: true,
    }));
    setInstallerJobDocumentsErrors((current) => ({
      ...current,
      [jobId]: "",
    }));

    try {
      const { data, error } = await supabase.functions.invoke(
        "premier-job-document",
        {
          body: {
            action: "list",
            accessToken,
            jobId,
          },
        }
      );

      if (error || data?.error) {
        throw new Error(
          data?.error || error?.message || "Could not load job documents."
        );
      }

      setInstallerJobDocuments((current) => ({
        ...current,
        [jobId]: data?.documents ?? [],
      }));
    } catch (error) {
      console.error("Premier installer job document list failed:", error);

      setInstallerJobDocuments((current) => ({
        ...current,
        [jobId]: [],
      }));
      setInstallerJobDocumentsErrors((current) => ({
        ...current,
        [jobId]:
          error instanceof Error
            ? error.message
            : "Could not load job documents.",
      }));
    } finally {
      setInstallerJobDocumentsLoading((current) => ({
        ...current,
        [jobId]: false,
      }));
    }
  };

  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? jobs[0],
    [activeJobId]
  );

  const activePunchOuts = punchOuts.filter(
    (item) => item.jobId === activeJob.id && !item.resolved
  );

  const hasOpenPunchOut = activePunchOuts.length > 0;

  const addUpdate = (text: string) => {
    setUpdates((current) => [
      {
        time: new Date().toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        text,
      },
      ...current,
    ]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111820 0%, #0b0f13 45%, #07090c 100%)",
        color: "#f5f7f5",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "22px 14px 70px",
        }}
      >
        <header style={{ marginBottom: 20 }}>
          <div
            style={{
              color: "#9db7ca",
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: 1.3,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Premier Window & Door
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(28px, 8vw, 42px)",
              lineHeight: 1,
            }}
          >
            Installer Tech Board
          </h1>

          {installerGreeting ? (
            <div
              style={{
                marginTop: 8,
                color: "#b7dec4",
                fontSize: 15,
                fontWeight: 800,
              }}
            >
              {installerGreeting}
            </div>
          ) : null}

          <p
            style={{
              color: "#a8b0a9",
              margin: "9px 0 0",
              fontSize: 14,
            }}
          >
            Today's jobs, what was promised, what to measure, what proof is needed, and what happens next.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 12,
              alignItems: "center",
            }}
          >

            <span
              style={{
                border: "1px solid #405c6d",
                borderRadius: 999,
                background: "#1a2a36",
                color: "#e0e9ef",
                padding: "7px 11px",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              Installer
            </span>

          </div>
        </header>

        <section
          style={{
            border: "1px solid #31495a",
            borderRadius: 16,
            background: "#10151a",
            padding: 14,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  color: "#9db7ca",
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Live Relay
              </div>

              <strong style={{ fontSize: 16 }}>
                Live Installer Jobs
              </strong>
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: "#d9e5ee",
              }}
            >
              {liveInstallerJobs.length}
            </span>
          </div>

          {liveInstallerJobsLoading ? (
            <div style={{ color: "#8fa0ad", fontSize: 12 }}>
              Loading installer jobs...
            </div>
          ) : liveInstallerJobs.length === 0 ? (
            <div style={{ color: "#78858e", fontSize: 12 }}>
              No jobs currently ready for Installer Tech.
            </div>
          ) : (
            <div className="installer-workspace-layout">
              <aside
                style={{
                  border: "1px solid #29343c",
                  borderRadius: 14,
                  background: "#0d1217",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "11px 12px",
                    borderBottom: "1px solid #26323a",
                  }}
                >
                  <div
                    style={{
                      color: "#9db7ca",
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Installer Jobs
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, marginTop: 2 }}>
                    Assigned Jobs
                  </div>
                </div>

                <div className="installer-job-rail">
                  {liveInstallerJobs.map((job) => (
                    <button
                      key={`installer-rail-${job.id}`}
                      type="button"
                      onClick={() => {
                        setInstallerCompletionNotice(null);
                        setSelectedInstallerJobId(job.id);
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border:
                          selectedInstallerJobId === job.id
                            ? "1px solid #8fc59f"
                            : "1px solid #345140",
                        borderLeft: "4px solid #78aa88",
                        borderRadius: 10,
                        background:
                          selectedInstallerJobId === job.id
                            ? "#17231b"
                            : "#101713",
                        color: "#f5f7f5",
                        padding: 13,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            color: "#8fc59f",
                            fontSize: 9,
                            fontWeight: 900,
                            textTransform: "uppercase",
                          }}
                        >
                          {pendingReturns[job.id] ? "Returned by RJ" : job.current_stage === "installer_finish_back"
                            ? "Final Finish Work"
                            : job.current_stage === "installation_in_progress"
                            ? "Installation In Progress"
                            : job.current_stage === "scheduled"
                            ? "Scheduled"
                            : "Installation Ready"}
                        </span>

                        <span
                          style={{
                            color: "#9fd3ae",
                            fontSize: 9,
                            fontWeight: 900,
                          }}
                        >
                          {pendingReturns[job.id] ? "NEEDS ATTENTION" : job.current_stage === "installer_finish_back"
                            ? "FINAL FINISH"
                            : job.current_stage === "installation_in_progress"
                            ? "WORKING"
                            : job.current_stage === "scheduled"
                            ? "SCHEDULED"
                            : "READY"}
                        </span>
                      </div>

                      <strong style={{ display: "block", fontSize: 13, marginTop: 5 }}>
                        {job.first_name} {job.last_name}
                      </strong>

                      <div style={{ color: "#87949e", fontSize: 11, marginTop: 4 }}>
                        {job.project_address}
                      </div>

                      <div
                        style={{
                          color: "#aeb9c1",
                          fontSize: 10,
                          marginTop: 6,
                        }}
                      >
                        {job.scheduled_for
                          ? new Date(job.scheduled_for).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "Install date not set"}
                      </div>
                    </button>
                  ))}
                </div>
              </aside>

              <div
                style={{
                  minWidth: 0,
                  border: "1px solid #29343c",
                  borderRadius: 14,
                  background: "#0d1217",
                  padding: 12,
                }}
              >
                <div
                  style={{
                    paddingBottom: 10,
                    marginBottom: 10,
                    borderBottom: "1px solid #26323a",
                  }}
                >
                  <div
                    style={{
                      color: "#9db7ca",
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    Installer Workspace
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, marginTop: 2 }}>
                    {selectedInstallerJobId
                      ? "Installer Job Workspace"
                      : installerCompletionNotice
                        ? "Installation Completed"
                        : "Select a Job"}
                  </div>
                </div>

                {!selectedInstallerJobId ? (
                  <div
                    style={{
                      minHeight: 220,
                      display: "grid",
                      placeItems: "center",
                      color: "#78858e",
                      fontSize: 12,
                      textAlign: "center",
                      padding: 20,
                    }}
                  >
                    {installerCompletionNotice ? (
                      <div>
                        <div
                          style={{
                            color: "#b7dec4",
                            fontSize: 14,
                            fontWeight: 900,
                          }}
                        >
                          Installation Completed
                        </div>

                        <div
                          style={{
                            marginTop: 7,
                            color: "#9db0bc",
                            lineHeight: 1.5,
                          }}
                        >
                          {installerCompletionNotice} has been completed and moved
                          to the next stage.
                        </div>

                        <div
                          style={{
                            marginTop: 7,
                            color: "#78858e",
                          }}
                        >
                          Select another assigned job when you're ready.
                        </div>
                      </div>
                    ) : (
                      "Choose an assigned job from the left."
                    )}
                  </div>
                ) : null}

                {liveInstallerJobs
                  .filter((job) => job.id === selectedInstallerJobId)
                  .map((job) => (
                <div
                  key={job.id}
                  style={{
                    border: "1px solid #557c64",
                    borderRadius: 13,
                    background: "#111820",
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <strong>
                      {job.first_name} {job.last_name}
                    </strong>

                    <span
                      style={{
                        color: "#b7dec4",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {job.current_stage === "installer_finish_back"
                            ? "Final Finish Work"
                            : job.current_stage === "installation_in_progress"
                            ? "Installation In Progress"
                            : job.current_stage === "scheduled"
                            ? "Scheduled"
                            : "Installation Ready"}
                    </span>
                  </div>

                  <div
                    style={{
                      color: "#9ca8b2",
                      fontSize: 12,
                      marginBottom: 8,
                    }}
                  >
                    {job.project_address}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const phone = String((job as any).phone || "").trim();
                        if (!phone) return;
                        window.location.href = `tel:${phone}`;
                      }}
                      disabled={!String((job as any).phone || "").trim()}
                      style={{
                        minHeight: 44,
                        border: "1px solid #6f9fbd",
                        borderRadius: 10,
                        background: "#162630",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: String((job as any).phone || "").trim()
                          ? "pointer"
                          : "not-allowed",
                        opacity: String((job as any).phone || "").trim()
                          ? 1
                          : 0.55,
                      }}
                    >
                      Call Customer
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!job.project_address) return;

                        const destination = encodeURIComponent(
                          job.project_address
                        );

                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${destination}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      disabled={!job.project_address}
                      style={{
                        minHeight: 44,
                        border: "1px solid #6f9fbd",
                        borderRadius: 10,
                        background: "#162630",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: job.project_address
                          ? "pointer"
                          : "not-allowed",
                        opacity: job.project_address ? 1 : 0.55,
                      }}
                    >
                      Navigation
                    </button>
                  </div>


                  <InstallerBeamCard
                    jobId={job.id}
                    defaultRecipient={
                      job.current_stage === "installer_finish_back"
                        ? "RJ"
                        : "Gino Marquez"
                    }
                  />

                  <div
                    style={{
                      display: "grid",
                      gap: 4,
                      fontSize: 12,
                      color: "#d7dde2",
                    }}
                  >
                    <div>
                      <strong>Crew:</strong>{" "}
                      {job.crew || "Not assigned"}
                    </div>

                    <div>
                      <strong>Install:</strong>{" "}
                      {job.scheduled_for
                        ? new Date(job.scheduled_for).toLocaleString()
                        : "Not scheduled"}
                    </div>

                    <div>
                      <strong>Material:</strong>{" "}
                      {job.material_status || "Unknown"}
                    </div>

                    <div>
                      <strong>Permit:</strong>{" "}
                      {job.permit_status || "Unknown"}
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: "1px solid #26323a",
                      marginTop: 9,
                      paddingTop: 9,
                      color: "#d9e5ee",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                    {job.current_stage === "scheduled"
                      ? "Installer to begin the scheduled installation. Add photos or notes if needed."
                      : <PremierInstallerCurrentNext jobId={job.id} returned={Boolean(pendingReturns[job.id])} fallback={job.next_action || "Installer to begin installation. Add photos or notes if needed."} />}
                  </div>



                  <div style={{ color: "#dce9f0", fontSize: 13, fontWeight: 900, marginTop: 14, marginBottom: 4 }}>Job Notes & Materials</div>
                  {job.current_stage === "installation_ready" ? (
                    <div style={{ border: "1px solid #557c64", borderRadius: 12, background: "#111c18", padding: 12, marginTop: 12, marginBottom: 12 }}>
                      <div style={{ color: "#b7dec4", fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>Your Next Steps</div>
                      <div style={{ color: "#f3f6f8", fontSize: 13, fontWeight: 800 }}>1. Review Job File</div>
                      <div style={{ color: "#b5c6bb", fontSize: 12, marginTop: 3 }}>Measurements, documents, and installation details.</div>
                      <InstallerPreinstallationNotes jobId={job.id} />
                      <div style={{ color: "#f3f6f8", fontSize: 13, fontWeight: 800, marginTop: 12 }}>2. Start Installation</div>
                      <div style={{ color: "#b5c6bb", fontSize: 12, marginTop: 3 }}>Begin work when you are ready.</div>
                    </div>
                  ) : job.current_stage === "installation_in_progress" ? (
                    <div style={{ marginTop: 12, marginBottom: 12 }}>
                      <details style={{border:'1px solid #3e5550',borderRadius:10,padding:10,background:'#13201d'}}>
                        <summary style={{cursor:'pointer',fontSize:12,fontWeight:800,color:'#d1dfda'}}>Work History — Earlier Job Notes</summary>
                        <InstallerPreinstallationNotes jobId={job.id} />
                      </details>
                    </div>
                  ) : null}                  {job.current_stage === "installation_in_progress" ? (
                    <>
                    <InstallerMaterialAttention jobId={job.id}>
                      <details style={{ border: "1px solid #775a41", borderRadius: 10, background: "#231b17", padding: 12, marginBottom: 12 }}>
                        <summary style={{ color: "#ffffff", fontWeight: 900, cursor: "pointer", minHeight: 28 }}>
                          Other Field Issue
                        </summary>
                        <div style={{ color: "#d6bca5", fontSize: 11, marginTop: 6, marginBottom: 10 }}>
                          For site damage, measurement concerns, or installation problems. Use the material form above for missing or damaged parts.
                        </div>
<div style={{ border: "1px solid #526c53", borderRadius: 10, padding: 12, background: "#122019" }}>
  <strong style={{ display: "block", marginBottom: 8, color: "#ffffff" }}>
    General Field Issue
  </strong>
  <div style={{ fontSize: 11, color: "#b9c6ce", marginBottom: 9 }}>
    Select all issues that apply.
  </div>
  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 9 }}>
    {["Scratches / Damage", "Brake Metal", "Broken Glass", "Missing Parts", "Wrong Measurement", "Installation / Fit", "Other"].map((issue) => (
      <label key={issue} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: "#d9e5ee" }}>
        <input
          type="checkbox"
          checked={(installerIssueCategories[job.id] ?? []).includes(issue)}
          onChange={(event) => {
            setInstallerIssueCategories((current) => {
              const previous = current[job.id] ?? [];
              return {
                ...current,
                [job.id]: event.target.checked
                  ? [...previous, issue]
                  : previous.filter((value) => value !== issue),
              };
            });
            setBuckingDrafts((current) => ({
              ...current,
              [job.id]: {
                buckingNotes: current[job.id]?.buckingNotes ?? "",
                measurementNotes: current[job.id]?.measurementNotes ?? "",
                materialIssueNotes: current[job.id]?.materialIssueNotes ?? "",
                needsAttention: true,
                saved: false,
              },
            }));
          }}
        />
        {issue}
      </label>
    ))}
  </div>
  <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginTop: 12 }}>
    <textarea
      value={buckingDrafts[job.id]?.materialIssueNotes ?? ""}
      onChange={(event) => {
        const value = event.target.value;
        setBuckingDrafts((current) => ({
          ...current,
          [job.id]: {
            buckingNotes: current[job.id]?.buckingNotes ?? "",
            measurementNotes: current[job.id]?.measurementNotes ?? "",
            materialIssueNotes: value,
            needsAttention: true,
            saved: false,
          },
        }));
      }}
      placeholder="Add details or use the mic..."
      rows={2}
      style={{ width: "100%", boxSizing: "border-box", borderRadius: 8, border: "1px solid #405565", background: "#111820", color: "#ffffff", padding: 9, resize: "vertical" }}
    />
    <button
      type="button"
      onClick={() => startInstallerIssueVoice(job.id)}
      style={{ minWidth: 62, borderRadius: 8, border: "1px solid #567765", background: "#193c2b", color: "#ffffff", fontWeight: 900, cursor: "pointer" }}
    >
      {installerIssueListeningJobId === job.id ? "Listening..." : "Mic"}
    </button>
  </div>
  <button
    type="button"
    disabled={installerIssueSavingJobId === job.id}
    onClick={async () => {
      const categories = installerIssueCategories[job.id] ?? [];
      const details = buckingDrafts[job.id]?.materialIssueNotes?.trim() ?? "";

      if (!categories.length) {
        window.alert("Select at least one issue.");
        return;
      }

      if (categories.includes("Other") && !details) {
        window.alert("Please explain the Other issue.");
        return;
      }

      const accessToken = getPremierInstallerAccessToken();

      if (!accessToken) {
        window.alert("Installer access is missing. Please sign in again.");
        return;
      }

      setInstallerIssueSavingJobId(job.id);

      try {
        const { data, error } = await supabase.rpc(
          "report_premier_installer_issue",
          {
            p_access_token: accessToken,
            p_job_id: job.id,
            p_categories: categories,
            p_details: details,
          }
        );

        if (error || !data) {
          console.error("Premier issue report failed:", error);
          window.alert("Issue report could not be saved.");
          return;
        }

        window.alert("Issue report saved successfully.");
      } catch (error) {
        console.error("Premier issue report failed:", error);
        window.alert("Issue report could not be saved.");
      } finally {
        setInstallerIssueSavingJobId(null);
      }
    }}
    style={{
      width: "100%",
      minHeight: 44,
      marginTop: 12,
      borderRadius: 9,
      border: "1px solid #628f73",
      background: "#193c2b",
      color: "#ffffff",
      fontWeight: 900,
      cursor: "pointer",
      opacity: installerIssueSavingJobId === job.id ? 0.65 : 1,
    }}
  >
    {installerIssueSavingJobId === job.id
      ? "Reporting Issue..."
      : "Save & Report Issue"}
  </button>
  <div style={{ fontSize: 10, color: "#aebbc4", marginTop: 8 }}>
    Report an issue immediately. No Bucking photo required.
  </div>
</div>

                      </details>
                    </InstallerMaterialAttention>
                    <InstallerIssueFollowUp key={job.id} jobId={job.id} />
                    </>
                  ) : null}                  <div
                    style={{
                      border: "1px solid #31495a",
                      borderRadius: 12,
                      background: "#0d1318",
                      padding: 12,
                      marginTop: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "#f3f6f8",
                        fontSize: 13,
                        fontWeight: 900,
                        marginBottom: 4,
                      }}
                    >
                      Job File
                    </div>

                    <div
                      style={{
                        color: "#8fa9bc",
                        fontSize: 11,
                        lineHeight: 1.45,
                        marginBottom: 10,
                      }}
                    >
                      Measurements, floor plans, order paperwork, permit documents, and other files for this installation.
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        if (installerJobFileOpenId === job.id) {
                          setInstallerJobFileOpenId(null);
                          return;
                        }

                        setInstallerJobFileOpenId(job.id);
                        await loadInstallerJobDocuments(job.id);
                      }}
                      style={{
                        width: "100%",
                        minHeight: 42,
                        borderRadius: 9,
                        border: "1px solid #58788e",
                        background: "#1a2a36",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      {installerJobFileOpenId === job.id
                        ? "Close Job File"
                        : "Open Job File"}
                    </button>

                    {installerJobFileOpenId === job.id ? (
                      <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                        {installerJobDocumentsLoading[job.id] ? (
                          <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                            Loading job documents...
                          </div>
                        ) : installerJobDocumentsErrors[job.id] ? (
                          <div style={{ color: "#d8a0a0", fontSize: 11 }}>
                            {installerJobDocumentsErrors[job.id]}
                          </div>
                        ) : (installerJobDocuments[job.id] ?? []).length === 0 ? (
                          <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                            No job documents have been added yet.
                          </div>
                        ) : (
                          (installerJobDocuments[job.id] ?? []).map((document) => (
                            <div
                              key={document.id}
                              style={{
                                border: "1px solid #26323a",
                                borderRadius: 9,
                                background: "#111820",
                                padding: 10,
                              }}
                            >
                              <div
                                style={{
                                  color: "#f3f6f8",
                                  fontSize: 12,
                                  fontWeight: 900,
                                }}
                              >
                                {document.document_type || "Document"}
                              </div>

                              <div
                                style={{
                                  color: "#9ca8b2",
                                  fontSize: 11,
                                  marginTop: 3,
                                  overflowWrap: "anywhere",
                                }}
                              >
                                {document.file_name || "Attached file"}
                              </div>

                              {document.note ? (
                                <div
                                  style={{
                                    color: "#8fa9bc",
                                    fontSize: 11,
                                    marginTop: 4,
                                  }}
                                >
                                  {document.note}
                                </div>
                              ) : null}

                              {document.url ? (
                                <a
                                  href={document.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: 36,
                                    marginTop: 8,
                                    padding: "0 14px",
                                    borderRadius: 8,
                                    border: "1px solid #557c64",
                                    color: "#b7dec4",
                                    fontSize: 11,
                                    fontWeight: 900,
                                    textDecoration: "none",
                                  }}
                                >
                                  Open Document →
                                </a>
                              ) : (
                                <div
                                  style={{
                                    color: "#8fa9bc",
                                    fontSize: 11,
                                    marginTop: 6,
                                  }}
                                >
                                  File link unavailable.
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>


                  
                  {job.current_stage === "installation_in_progress" ? (
                  <div
                    style={{
                      borderTop: "1px solid #26323a",
                      marginTop: 10,
                      paddingTop: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        color: "#8fa9bc",
                        textTransform: "uppercase",
                        marginBottom: 7,
                      }}
                    >
                      Photos & Inspection Notes (Optional)
                    </div>




                      <button
                        type="button"
                        onClick={() => setInstallerBuckingOpenId((current) => current === job.id ? null : job.id)}
                        style={{ width: "100%", minHeight: 42, marginBottom: 8, borderRadius: 9, border: "1px solid #557c64", background: "#16232d", color: "#d9e5ee", fontWeight: 900, cursor: "pointer" }}
                      >
                        {installerBuckingOpenId === job.id ? "Close Bucking Inspection" : "Open Bucking Inspection"}
                        {installerBuckingOpenId !== job.id && (installerProofPhotos[job.id] ?? []).some((photo: any) => photo.proof_type === "Bucking / buck inspection") ? " · Photo received" : ""}
                      </button>
                    {installerProofPhotos[job.id]?.some(

                      (photo) =>
                        photo.proof_type === "Bucking / buck inspection"
                    ) || installerBuckingOpenId === job.id ? (
                      <div
                        style={{
                          border: "1px solid #557c64",
                          borderRadius: 10,
                          background: "#16232d",
                          padding: "10px 12px",
                        }}
                      >
                        {installerProofPhotos[job.id]?.some(
                          (photo) =>
                            photo.proof_type === "Bucking / buck inspection"
                        ) && (
                          <div
                            style={{
                              minHeight: 28,
                              color: "#b7dec4",
                              display: "flex",
                              alignItems: "center",
                              fontWeight: 900,
                              fontSize: 12,
                            }}
                          >
                            Bucking / buck inspection proof saved
                          </div>
                        )}

{installerBuckingOpenId === job.id ? (
                          <>

                        <div
                          style={{
                            display: "grid",
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          {(installerProofPhotos[job.id] ?? [])
                            .filter(
                              (photo: any) =>
                                photo.proof_type ===
                                "Bucking / buck inspection"
                            )
                            .map((photo: any, index: number) => (
                              <div
                                key={
                                  photo.id ??
                                  photo.path ??
                                  `${job.id}-bucking-${index}`
                                }
                                style={{
                                  border: "1px solid #334753",
                                  borderRadius: 9,
                                  background: "#111820",
                                  padding: 9,
                                  display: "grid",
                                  gridTemplateColumns:
                                    "72px minmax(0, 1fr) auto",
                                  gap: 10,
                                  alignItems: "center",
                                }}
                              >
                                {photo?.url ? (
                                  <img
                                    src={photo.url}
                                    alt={`Bucking proof photo ${index + 1}`}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    style={{
                                      display: "block",
                                      width: 72,
                                      height: 72,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                      border: "1px solid #334753",
                                      background: "#0d141a",
                                    }}
                                  />
                                ) : (
                                  <div
                                    aria-label="Photo preview unavailable"
                                    style={{
                                      width: 72,
                                      height: 72,
                                      borderRadius: 8,
                                      border: "1px solid #334753",
                                      background: "#0d141a",
                                    }}
                                  />
                                )}
                                <div
                                  style={{
                                    minWidth: 0,
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#d9e5ee",
                                      fontSize: 12,
                                      fontWeight: 900,
                                    }}
                                  >
                                    Photo {index + 1}
                                  </div>

                                  <div
                                    style={{
                                      marginTop: 2,
                                      color: "#8094a3",
                                      fontSize: 10,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {photo.file_name ??
                                      "Bucking proof photo"}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!photo?.url) {
                                      window.alert(
                                        "Saved proof photo is unavailable."
                                      );
                                      return;
                                    }

                                    window.open(
                                      photo.url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }}
                                  style={{
                                    minHeight: 34,
                                    borderRadius: 8,
                                    border:
                                      "1px solid #557c64",
                                    background: "#16232d",
                                    color: "#d9e5ee",
                                    padding: "7px 11px",
                                    fontWeight: 900,
                                    fontSize: 11,
                                    cursor: "pointer",
                                  }}
                                >
                                  View Photo
                                </button>
                              </div>
                            ))}
                        </div>
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "1px solid #334753",
                            display: "grid",
                            gap: 10,
                          }}
                        >
                          
                        <div
                          style={{
                            marginTop: 10,
                          }}
                        >
<label
                        style={{
                          minHeight: 46,
                          border: "1px dashed #557c64",
                          borderRadius: 10,
                          background: "#111820",
                          color: "#b7dec4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 12px",
                          fontWeight: 900,
                          fontSize: 12,
                          cursor:
                            uploadingInstallerProofJobId === job.id
                              ? "wait"
                              : "pointer",
                        }}
                      >
                        {uploadingInstallerProofJobId === job.id
                          ? "Uploading Bucking Proof..."
                          : (installerProofPhotos[job.id] ?? []).some((photo: any) => photo.proof_type === "Bucking / buck inspection")
                          ? "+ Add Another Bucking Photo" : "Take / Upload Bucking Photo"}

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          capture="environment"
                          hidden
                          disabled={uploadingInstallerProofJobId === job.id}
                          onChange={async (event) => {
                            const file = event.target.files?.[0] ?? null;
                            event.currentTarget.value = "";

                            if (!file) return;

                            const accessToken = getPremierInstallerAccessToken();

                            if (!accessToken) {
                              window.alert("Premier installer access is missing.");
                              return;
                            }

                            if (
                              !["image/jpeg", "image/png", "image/webp"].includes(
                                file.type
                              )
                            ) {
                              window.alert("Please use a JPG, PNG, or WEBP photo.");
                              return;
                            }

                            setUploadingInstallerProofJobId(job.id);

                            try {
                              const proofType = "Bucking / buck inspection";

                              const { data: uploadAccess, error: accessError } =
                                await supabase.functions.invoke(
                                  "premier-installer-proof-photo",
                                  {
                                    body: {
                                      action: "create-upload",
                                      accessToken,
                                      jobId: job.id,
                                      proofType,
                                      fileName: file.name || "bucking-proof.jpg",
                                      mimeType: file.type || "image/jpeg",
                                    },
                                  }
                                );

                              if (
                                accessError ||
                                !uploadAccess?.path ||
                                !uploadAccess?.token
                              ) {
                                throw new Error(
                                  accessError?.message ||
                                    "Could not prepare bucking proof upload."
                                );
                              }

                              const { error: uploadError } =
                                await supabase.storage
                                  .from("premier-installer-proof-photos")
                                  .uploadToSignedUrl(
                                    uploadAccess.path,
                                    uploadAccess.token,
                                    file,
                                    {
                                      contentType: file.type || "image/jpeg",
                                    }
                                  );

                              if (uploadError) throw uploadError;

                              const { data: finalizeData, error: finalizeError } =
                                await supabase.functions.invoke(
                                  "premier-installer-proof-photo",
                                  {
                                    body: {
                                      action: "finalize",
                                      accessToken,
                                      jobId: job.id,
                                      proofType,
                                      path: uploadAccess.path,
                                      fileName: file.name || "bucking-proof.jpg",
                                      mimeType: file.type || "image/jpeg",
                                    },
                                  }
                                );

                              if (finalizeError || !finalizeData?.photo) {
                                throw new Error(
                                  finalizeError?.message ||
                                    "Could not save bucking proof."
                                );
                              }

                              setInstallerProofPhotos((current) => ({
                                ...current,
                                [job.id]: [
                                  ...(current[job.id] ?? []),
                                  finalizeData.photo,
                                ],
                              }));
                            } catch (error) {
                              console.error(
                                "Premier bucking proof upload failed:",
                                error
                              );

                              window.alert(
                                error instanceof Error
                                  ? error.message
                                  : "Could not upload bucking proof."
                              );
                            } finally {
                              setUploadingInstallerProofJobId(null);
                            }
                          }}
                        />
                      </label>
                        </div>
<div
                            style={{
                              fontSize: 11,
                              fontWeight: 900,
                              color: "#8fa9bc",
                              textTransform: "uppercase",
                            }}
                          >
                            Bucking Inspection
                          </div>

                          {(buckingDrafts[job.id]?.buckingNotes || buckingDrafts[job.id]?.measurementNotes) ? (
                            <div style={{ border: "1px solid #3a504a", borderRadius: 9, background: "#121d20", padding: 10, display: "grid", gap: 8 }}>
                              <strong style={{ fontSize: 12, color: "#d9e5ee" }}>Saved Bucking Notes</strong>
                              {buckingDrafts[job.id]?.buckingNotes ? (
                                <div>
                                  <div style={{ fontSize: 10, color: "#9db7ca", fontWeight: 900 }}>Inspection Notes</div>
                                  <div style={{ fontSize: 12, whiteSpace: "pre-wrap", marginTop: 3 }}>{buckingDrafts[job.id].buckingNotes}</div>
                                </div>
                              ) : null}
                              {buckingDrafts[job.id]?.measurementNotes ? (
                                <div>
                                  <div style={{ fontSize: 10, color: "#9db7ca", fontWeight: 900 }}>Measurement Notes</div>
                                  <div style={{ fontSize: 12, whiteSpace: "pre-wrap", marginTop: 3 }}>{buckingDrafts[job.id].measurementNotes}</div>
                                </div>
                              ) : null}
                            </div>
                          ) : null}

                          <strong style={{ fontSize: 12, color: "#d9e5ee" }}>Add Notes</strong>
                          <label style={{ fontSize: 11, color: "#9db7ca", fontWeight: 800 }}>Inspection Notes
                            <textarea
                              value={newBuckingNotes[job.id]?.inspection ?? ""}
                              onChange={(event) => setNewBuckingNotes((current) => ({
                                ...current,
                                [job.id]: { inspection: event.target.value, measurement: current[job.id]?.measurement ?? "" },
                              }))}
                              placeholder="Inspection notes"
                              rows={2}
                              style={{ display: "block", width: "100%", boxSizing: "border-box", borderRadius: 9, border: "1px solid #405565", background: "#111820", color: "#d9e5ee", padding: "9px 11px", fontSize: 12, resize: "vertical", marginTop: 5 }}
                            />
                          </label>
                          <label style={{ fontSize: 11, color: "#9db7ca", fontWeight: 800 }}>Measurement Notes
                            <textarea
                              value={newBuckingNotes[job.id]?.measurement ?? ""}
                              onChange={(event) => setNewBuckingNotes((current) => ({
                                ...current,
                                [job.id]: { inspection: current[job.id]?.inspection ?? "", measurement: event.target.value },
                              }))}
                              placeholder="Measurement notes"
                              rows={2}
                              style={{ display: "block", width: "100%", boxSizing: "border-box", borderRadius: 9, border: "1px solid #405565", background: "#111820", color: "#d9e5ee", padding: "9px 11px", fontSize: 12, resize: "vertical", marginTop: 5 }}
                            />
                          </label>

                          <button
                            type="button"
                            disabled={savingBuckingJobId === job.id || !(newBuckingNotes[job.id]?.inspection?.trim() || newBuckingNotes[job.id]?.measurement?.trim())}
                            onClick={async () => {
                              const accessToken = getPremierInstallerAccessToken();

                              if (!accessToken) return;

                              const draft = buckingDrafts[job.id] ?? {
                                buckingNotes: "",
                                measurementNotes: "",
                                materialIssueNotes: "",
                                needsAttention: false,
                                saved: false,
                              };

                              const savedIssueNotes = draft.materialIssueNotes;
                              const incoming = newBuckingNotes[job.id];
                              const inspection = (incoming?.inspection ?? "").trim();
                              const measurement = (incoming?.measurement ?? "").trim();
                              if (!inspection && !measurement) return;
                              const stamped = new Date().toLocaleString();
                              const combinedInspection = inspection
                                ? [draft.buckingNotes, `${stamped} - ${inspection}`].filter(Boolean).join("\n\n")
                                : draft.buckingNotes;
                              const combinedMeasurement = measurement
                                ? [draft.measurementNotes, `${stamped} - ${measurement}`].filter(Boolean).join("\n\n")
                                : draft.measurementNotes;

                              setSavingBuckingJobId(job.id);

                              try {
                                const { data, error } = await supabase.rpc(
                                  "save_premier_installer_bucking_details",
                                  {
                                    p_access_token: accessToken,
                                    p_job_id: job.id,
                                    p_bucking_notes: combinedInspection,
                                    p_measurement_notes:
                                      combinedMeasurement,
                                    p_material_issue_notes:
                                      savedIssueNotes,
                                    p_needs_attention:
                                      draft.needsAttention,
                                  }
                                );

                                if (error) {
                                  console.error(
                                    "Save Bucking details failed:",
                                    error
                                  );
                                  window.alert(
                                    "Could not save Bucking details."
                                  );
                                  return;
                                }

                                if (data === true) {
                                  setBuckingDrafts((drafts) => ({
                                    ...drafts,
                                    [job.id]: {
                                      ...draft,
                                      buckingNotes: combinedInspection,
                                      measurementNotes: combinedMeasurement,
                                      saved: true,
                                    },
                                  }));
                                  setNewBuckingNotes((current) => ({
                                    ...current,
                                    [job.id]: { inspection: "", measurement: "" },
                                  }));
                                }
                              } finally {
                                setSavingBuckingJobId(null);
                              }
                            }}
                            style={{
                              width: "100%",
                              minHeight: 42,
                              borderRadius: 9,
                              border: "1px solid #557c64",
                              background: "#16232d",
                              color: "#d9e5ee",
                              fontWeight: 900,
                              cursor:
                                savingBuckingJobId === job.id
                                  ? "wait"
                                  : "pointer",
                              opacity:
                                savingBuckingJobId === job.id ? 0.7 : 1,
                            }}
                          >
                            {savingBuckingJobId === job.id
                              ? "Saving Notes..."
                              : "Save Notes"}
                          </button>
                        </div>
                          </>
                        ) : null}

                      </div>
                    ) : null}
                  </div>
                  ) : null}

                  {pendingReturns[job.id] ? (
                    <details style={{margin:'12px 0',padding:11,border:'1px solid #3e5550',borderRadius:10,background:'#13201d',color:'#d1dfda'}}>
                      <summary style={{cursor:'pointer',fontWeight:800,fontSize:12}}>Work History — Previous RJ Instructions</summary>
                      <div style={{marginTop:8,fontSize:12,whiteSpace:'pre-wrap'}}>{pendingReturns[job.id].reason}</div>
                    </details>
                  ) : null}
                  {["installation_ready", "scheduled"].includes(
                    job.current_stage
                  ) ? (
                    <button
                      type="button"
                      onClick={async () => {
                        const accessToken =
                          getPremierInstallerAccessToken();

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "start_premier_installation",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Start Installation failed:", error);
                          window.alert("Could not start installation. Please refresh and try again.");
                          return;
                        }
                        if (data !== true) {
                          window.alert("Installation was not started. Check the job readiness with RJ.");
                          return;
                        }

                        if (data === true) {
                          setLiveInstallerJobs((current) =>
                            current.map((item) =>
                              item.id === job.id
                                ? {
                                    ...item,
                                    current_stage: "installation_in_progress",
                                    next_action:
                                      "Installer to complete installation and document any outstanding issues.",
                                  }
                                : item
                            )
                          );
                        }
                      }}
                      style={{
                        width: "100%",
                        minHeight: 46,
                        marginTop: 10,
                        borderRadius: 10,
                        border: "1px solid #8fc59f",
                        background: "#24583b",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Start Installation
                    </button>
                  ) : job.current_stage === "installer_finish_back" ? (
                    <>
                      <div
                        style={{
                          border: "1px solid #557c64",
                          borderRadius: 10,
                          background: "#111c18",
                          padding: 12,
                          marginTop: 12,
                        }}
                      >
                        <div
                          style={{
                            color: "#9fd3ae",
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 0.9,
                            textTransform: "uppercase",
                          }}
                        >
                          FINAL FINISH WORK
                        </div>

                        <div
                          style={{
                            color: "#d7dde2",
                            fontSize: 12,
                            lineHeight: 1.45,
                            marginTop: 5,
                          }}
                        >
                          Final inspection is complete. Return to the job and
                          complete the remaining finish work, including covers,
                          interior caulking, and any remaining punch items.
                        </div>
                      </div>
                      <div
                        style={{
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          background: "#0d141a",
                          padding: 12,
                          marginTop: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              color: "#d9e5ee",
                              fontSize: 11,
                              fontWeight: 900,
                            }}
                          >
                            Final Finish Items
                          </div>

                          <button
                            type="button"
                            onClick={() => void loadInstallerPunchItems(job.id)}
                            disabled={installerPunchLoading[job.id] === true}
                            style={{
                              border: "1px solid #31495a",
                              borderRadius: 8,
                              background: "#101820",
                              color: "#a9bac6",
                              padding: "6px 9px",
                              fontSize: 10,
                              fontWeight: 800,
                              cursor:
                                installerPunchLoading[job.id] === true
                                  ? "wait"
                                  : "pointer",
                            }}
                          >
                            {installerPunchLoading[job.id] === true
                              ? "Loading..."
                              : "Refresh Items"}
                          </button>
                        </div>

                        {!installerPunchItems[job.id] &&
                        installerPunchLoading[job.id] !== true ? (
                          <button
                            type="button"
                            onClick={() => void loadInstallerPunchItems(job.id)}
                            style={{
                              width: "100%",
                              minHeight: 40,
                              borderRadius: 9,
                              border: "1px solid #557c64",
                              background: "#16232d",
                              color: "#d9e5ee",
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            Load Final Finish Items
                          </button>
                        ) : null}

                        {installerPunchErrors[job.id] ? (
                          <div
                            style={{
                              color: "#e6a7a7",
                              fontSize: 11,
                              marginTop: 7,
                            }}
                          >
                            {installerPunchErrors[job.id]}
                          </div>
                        ) : null}

                        {installerPunchLoading[job.id] === true ? (
                          <div
                            style={{
                              color: "#8fa9bc",
                              fontSize: 11,
                              marginTop: 8,
                            }}
                          >
                            Loading final finish items...
                          </div>
                        ) : null}

                        <div
                          style={{
                            border: "1px solid #795c39",
                            borderRadius: 10,
                            padding: 12,
                            marginTop: 10,
                            background: "#201b16",
                            color: "#f3f6f8",
                          }}
                        >
                          <strong>Reported Problems To Address</strong>

                          {installerPunchLoading[job.id] ? (
                            <div style={{ marginTop: 8 }}>
                              Loading reported problems...
                            </div>
                          ) : installerPunchErrors[job.id] ? (
                            <div style={{ color: "#f0aaaa", marginTop: 8 }}>
                              Check the loading error above before continuing.
                            </div>
                          ) : !Object.prototype.hasOwnProperty.call(
                              installerFinishReports,
                              job.id
                            ) ? (
                            <div style={{ marginTop: 8 }}>
                              Loading problem records. Use Refresh Items if needed.
                            </div>
                          ) : (installerFinishReports[job.id] || []).length === 0 ? (
                            <div style={{ marginTop: 8 }}>
                              No damage reports recorded.
                            </div>
                          ) : (
                            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                              {(installerFinishReports[job.id] || []).map(
                                (report: any) => (
                                  <div
                                    key={report.id}
                                    style={{
                                      borderTop: "1px solid #665039",
                                      paddingTop: 9,
                                    }}
                                  >
                                    <strong>
                                      {(report.categories || []).join(", ") ||
                                        "Reported Problem"}
                                    </strong>
                                    <div style={{
                                      marginTop: 5,
                                      whiteSpace: "pre-wrap",
                                      fontSize: 12,
                                    }}>
                                      {report.details || "No description provided."}
                                    </div>
                                    <div style={{
                                      marginTop: 5,
                                      fontSize: 11,
                                      color: "#d3baa0",
                                    }}>
                                      Reported by {
                                        report.reporter_label?.split(":").pop() ||
                                        "Staff"
                                      }
                                    </div>
                                    <div style={{ marginTop: 8 }}>
                                      <div style={{
                                        color: report.resolution_status === "resolved"
                                          ? "#9fd3ae"
                                          : "#e4c78e",
                                        fontWeight: 900,
                                        fontSize: 11,
                                      }}>
                                        {report.resolution_status === "resolved"
                                          ? "Resolved"
                                          : "Needs Repair"}
                                      </div>

                                      {report.resolution_status === "resolved" ? (
                                        <div style={{ fontSize: 11, marginTop: 5 }}>
                                          Resolved by {report.resolution_updated_by || "Staff"}
                                          {report.resolution_note
                                            ? `: ${report.resolution_note}`
                                            : ""}
                                        </div>
                                      ) : (
                                        <>
                                          <textarea
                                            value={installerRepairNotes[report.id] || ""}
                                            onChange={(event) =>
                                              setInstallerRepairNotes((s) => ({
                                                ...s,
                                                [report.id]: event.target.value,
                                              }))
                                            }
                                            placeholder="Repair notes (optional)"
                                            style={{
                                              width: "100%",
                                              minHeight: 64,
                                              boxSizing: "border-box",
                                              marginTop: 8,
                                              padding: 9,
                                              borderRadius: 8,
                                              border: "1px solid #665039",
                                              background: "#101820",
                                              color: "#ffffff",
                                              fontFamily: "inherit",
                                            }}
                                          />

                                          <label style={{
                                            display: "block",
                                            marginTop: 10,
                                            fontSize: 12,
                                            fontWeight: 800,
                                          }}>
                                            Take / Upload Repair Photo (optional)
                                            <input
                                              type="file"
                                              accept="image/jpeg,image/png,image/webp"
                                              capture="environment"
                                              disabled={installerRepairSaving[report.id] === true}
                                              onChange={(event) =>
                                                setInstallerRepairFiles((s) => ({
                                                  ...s,
                                                  [report.id]:
                                                    event.target.files?.[0] || null,
                                                }))
                                              }
                                              style={{
                                                display: "block",
                                                width: "100%",
                                                marginTop: 6,
                                              }}
                                            />
                                          </label>

                                          {installerRepairFiles[report.id] ? (
                                            <div style={{
                                              fontSize: 11,
                                              marginTop: 6,
                                            }}>
                                              Photo selected: {installerRepairFiles[report.id]?.name}
                                            </div>
                                          ) : null}

                                          {installerRepairErrors[report.id] ? (
                                            <div style={{
                                              color: "#f0aaaa",
                                              marginTop: 7,
                                              fontSize: 11,
                                            }}>
                                              {installerRepairErrors[report.id]}
                                            </div>
                                          ) : null}

                                          <button
                                            type="button"
                                            disabled={installerRepairSaving[report.id] === true}
                                            onClick={() =>
                                              void resolveInstallerFinishIssue(
                                                job.id,
                                                report.id
                                              )
                                            }
                                            style={{
                                              width: "100%",
                                              minHeight: 42,
                                              marginTop: 10,
                                              borderRadius: 9,
                                              border: "1px solid #557c64",
                                              background: "#173225",
                                              color: "#eaf5ee",
                                              fontWeight: 900,
                                              cursor: "pointer",
                                            }}
                                          >
                                            {installerRepairSaving[report.id]
                                              ? "Saving Repair..."
                                              : "Mark Resolved"}
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                              <div style={{ fontSize: 11, color: "#e4c78e" }}>
                                These are existing damage reports, not additional
                                punch items. Complete the repairs and contact RJ or
                                Office for verification. RJ or Office can review and reopen repairs. Angel can
                                mark each repair resolved here.
                              </div>
                            </div>
                          )}
                        </div>

                        {installerPunchItems[job.id] &&
                        installerPunchItems[job.id].length === 0 ? (
                          <div
                            style={{
                              color: "#8fa0ad",
                              fontSize: 11,
                              marginTop: 8,
                            }}
                          >
                            No additional inspection punch items were recorded. Complete the
                            remaining final finish work before marking this job
                            100% Complete.
                          </div>
                        ) : null}

                        {(installerPunchItems[job.id] || []).length > 0 ? (
                          <div
                            style={{
                              display: "grid",
                              gap: 8,
                              marginTop: 8,
                            }}
                          >
                            {(installerPunchItems[job.id] || []).map(
                              (item: any) => {
                                const resolved = item.status === "Resolved";

                                return (
                                  <div
                                    key={item.id}
                                    style={{
                                      border: resolved
                                        ? "1px solid #355d42"
                                        : "1px solid #3a4e5c",
                                      borderRadius: 9,
                                      background: resolved
                                        ? "#101b14"
                                        : "#111820",
                                      padding: 10,
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: "#f3f6f8",
                                        fontSize: 12,
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {item.issue}
                                    </div>

                                    <div
                                      style={{
                                        color: resolved
                                          ? "#9fd3ae"
                                          : "#8fa9bc",
                                        fontSize: 10,
                                        fontWeight: 900,
                                        marginTop: 5,
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {resolved ? "Resolved" : "Needs Attention"}
                                    </div>

                                    {!resolved ? (
                                      <button
                                        type="button"
                                        disabled={
                                          installerPunchResolving[item.id] ===
                                          true
                                        }
                                        onClick={() =>
                                          void resolveInstallerPunchItem(
                                            job.id,
                                            item.id
                                          )
                                        }
                                        style={{
                                          width: "100%",
                                          minHeight: 38,
                                          marginTop: 8,
                                          borderRadius: 8,
                                          border: "1px solid #557c64",
                                          background: "#173225",
                                          color: "#eaf5ee",
                                          fontWeight: 900,
                                          cursor:
                                            installerPunchResolving[item.id] ===
                                            true
                                              ? "wait"
                                              : "pointer",
                                          opacity:
                                            installerPunchResolving[item.id] ===
                                            true
                                              ? 0.7
                                              : 1,
                                        }}
                                      >
                                        {installerPunchResolving[item.id] ===
                                        true
                                          ? "Saving..."
                                          : "Mark Item Complete"}
                                      </button>
                                    ) : null}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          const confirmed = window.confirm(
                            "Mark this job 100% Complete? Confirm all final finish work, covers, interior caulking, and remaining punch items are complete."
                          );

                          if (!confirmed) return;

                          const accessToken =
                            getPremierInstallerAccessToken();

                          if (!accessToken) return;

                          const { data, error } = await supabase.rpc(
                            "complete_premier_finish_back",
                            {
                              p_access_token: accessToken,
                              p_job_id: job.id,
                            }
                          );

                          if (error) {
                            console.error("100% Complete failed:", error);
                            window.alert(
                              error.message ||
                                "Could not mark this job 100% Complete."
                            );
                            return;
                          }

                          if (data === true) {
                            setSelectedInstallerJobId(null);
                            setInstallerJobFileOpenId(null);

                            setLiveInstallerJobs((current) =>
                              current.filter((item) => item.id !== job.id)
                            );
                          }
                        }}
                        style={{
                          width: "100%",
                          minHeight: 46,
                          marginTop: 12,
                          borderRadius: 10,
                          border: "1px solid #557c64",
                          background: "#173225",
                          color: "#eaf5ee",
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        Mark 100% Complete
                      </button>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          border: "1px solid #557c64",
                          borderRadius: 10,
                          background: "#111c18",
                          padding: 12,
                          marginTop: 12,
                        }}
                      >
                        <div
                          style={{
                            color: "#9fd3ae",
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 0.9,
                            textTransform: "uppercase",
                          }}
                        >
                          INSTALLATION IN PROGRESS
                        </div>

                        <div
                          style={{
                            color: "#d7dde2",
                            fontSize: 12,
                            lineHeight: 1.45,
                            marginTop: 5,
                          }}
                        >
                          Work is active. Add photos or notes if applicable, and report
                          outstanding issues before submitting the installation.
                        </div>
                      </div>

                    <button
                      type="button"
                      onClick={async () => {
                        setCompletionAcknowledged(false);
                        setCompletionIssuesAcknowledged(false);
                        setCompletionIssues([]);
                        setCompletionDecisions([]);
                        setCompletionIssuesError("");
                        setCompletionIssuesLoading(true);
                        setCompletionConfirmJobId(job.id);
                        setFlowTestAcknowledged(false);
                        const token = getPremierInstallerAccessToken();
                        if (!token) {
                          setCompletionIssuesError("Staff session missing. Sign in again.");
                          setCompletionIssuesLoading(false);
                          return;
                        }
                        const [result,statusResult]=await Promise.all([
                          supabase.rpc("get_premier_installer_issue_reports",{p_access_token:token,p_job_id:job.id}),
                          supabase.rpc("get_premier_installer_issue_decisions",{p_access_token:token,p_job_id:job.id})
                        ]);
                        if(result.error||statusResult.error)setCompletionIssuesError("Could not check job issue status. Try again.");
                        else{setCompletionIssues(result.data??[]);setCompletionDecisions(statusResult.data??[]);}
                        setCompletionIssuesLoading(false);
                      }}
                      style={{
                        width: "100%",
                        minHeight: 46,
                        marginTop: 12,
                        borderRadius: 10,
                        border: "1px solid #9a6d58",
                        background: "#2a1d19",
                        color: "#f4e4dc",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Complete Installation
                    </button>

                    {completionConfirmJobId === job.id ? (
                      <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Confirm installation completion"
                        style={{
                          position: "fixed",
                          inset: 0,
                          zIndex: 10000,
                          background: "rgba(0,0,0,0.75)",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <section style={{
                          width: "min(480px, 100vw)",
                          height: "100dvh",
                          overflowY: "auto",
                          boxSizing: "border-box",
                          background: "#10191d",
                          color: "#edf4f0",
                          padding: 22,
                          borderLeft: "1px solid #557c64",
                        }}>
                          <h2 style={{ marginTop: 0 }}>Complete Installation</h2>
                          {job.id === 'e426d508-dfa1-4d60-9484-df5b546bc725' && String(job.first_name || '').trim() === 'Premier' && String(job.last_name || '').trim() === 'FlowTest' ? (
                            <div style={{ border: '1px solid #e3be79', borderRadius: 10, background: '#332817', padding: 12, marginBottom: 12 }}>
                              <strong style={{ color: '#ffe5a1' }}>TEST ONLY — Simulated Installation</strong>
                              <p style={{ fontSize: 12, margin: '8px 0' }}>No real installation, physical repair, or inspection is being certified. This advances Premier FlowTest through the actual RJ review workflow for software testing only.</p>
                              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12 }}>
                                <input type="checkbox" checked={flowTestAcknowledged} onChange={e => setFlowTestAcknowledged(e.target.checked)} style={{ width: 20, height: 20, flexShrink: 0 }} />
                                I understand this is a simulated test submission, not verified field work.
                              </label>
                            </div>
                          ) : null}
                          <strong>{job.first_name} {job.last_name}</strong>
                          <p>{job.project_address}</p>
                          <p>Assigned crew: {job.crew || "Not assigned"}</p>

                          <div style={{
                            border: "1px solid #557c64",
                            borderRadius: 10,
                            padding: 14,
                            margin: "18px 0",
                          }}>
                            <strong>Before submitting, confirm:</strong>
                            <p>Installation work is complete.</p>
                            <p>Photos and inspection notes have been added if applicable.</p>
                            <p>Missing, damaged, or unfinished items have been reported.</p>
                            <p>Any remaining issues are documented for RJ and Office.</p>
                          </div>

                          <div style={{ marginBottom: 16, padding: 12, borderRadius: 10, border: "1px solid #496153", background: "#14201c" }}>
                            <strong>Reported Job Issues</strong>
                            {completionIssuesLoading ? <p>Checking existing reports...</p> : completionIssuesError ? (
                              <p role="alert" style={{ color: "#ffc39b" }}>{completionIssuesError}</p>
                            ) : completionIssues.length ? (
                              <>
                                <p style={{margin:'8px 0',color:completionOpenCount?'#f3d5af':'#b9e7c5'}}>{completionOpenCount?completionOpenCount+' open issue(s) for RJ and Office follow-up.':completionIssues.length+' reports handled. No unresolved issues. Records remain in Work History.'}</p>
                                <details style={{margin:'9px 0'}}><summary style={{cursor:'pointer',fontSize:12}}>View Report History ({completionIssues.length})</summary>
                                {completionIssues.map((issue:any)=>{
                                  const d=completionDecisions.find((x:any)=>x.issue_id===issue.id);
                                  const status=d?.resolution_status==='resolved'?'Verified Resolved':d?.resolution_status==='duplicate'?'Closed as Duplicate':'Still Open';
                                  return <div key={issue.id} style={{padding:'8px 0',borderTop:'1px solid #33433b',fontSize:12}}><strong>{(issue.categories??[]).join(', ')} — {status}</strong><div style={{whiteSpace:'pre-wrap',marginTop:3}}>{issue.details}</div></div>;
                                })}</details>
                                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12, lineHeight: 1.4 }}>
                                  <input type="checkbox" checked={completionIssuesAcknowledged} onChange={(e) => setCompletionIssuesAcknowledged(e.target.checked)} style={{ width: 20, height: 20, flexShrink: 0 }} />
                                  {completionOpenCount?'I have reported the remaining issues for RJ and Office follow-up.':'I understand these handled reports remain in the job history.'}
                                </label>
                              </>
                            ) : <p style={{ margin: "8px 0 0" }}>No reported issues found.</p>}
                          </div>

                          <label style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 12,
                            marginBottom: 22,
                            lineHeight: 1.5,
                          }}>
                            <input
                              type="checkbox"
                              checked={completionAcknowledged}
                              onChange={(e) => setCompletionAcknowledged(e.target.checked)}
                              style={{ width: 22, height: 22, flexShrink: 0 }}
                            />
                            I confirm the installation work is complete and any outstanding issues have been reported.
                          </label>

                          {pendingReturns[job.id] ? (

                            <label style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:18,color:'#ffe2a0'}}>

                              <input type="checkbox" checked={returnAcknowledged} onChange={e=>setReturnAcknowledged(e.target.checked)} style={{width:22,height:22,flexShrink:0}} />

                              I have reviewed RJ's earlier return instructions and completed the required follow-up.

                            </label>

                          ) : null}

                          <button
                            type="button"
                            disabled={!((job.id === 'e426d508-dfa1-4d60-9484-df5b546bc725' && String(job.first_name || '').trim() === 'Premier' && String(job.last_name || '').trim() === 'FlowTest') ? flowTestAcknowledged : (completionAcknowledged && (!pendingReturns[job.id] || returnAcknowledged))) || completionSubmitting || completionIssuesLoading || Boolean(completionIssuesError) || (completionIssues.length > 0 && !completionIssuesAcknowledged)}
                            onClick={async () => {
                              if (!((job.id === 'e426d508-dfa1-4d60-9484-df5b546bc725' && String(job.first_name || '').trim() === 'Premier' && String(job.last_name || '').trim() === 'FlowTest') ? flowTestAcknowledged : (completionAcknowledged && (!pendingReturns[job.id] || returnAcknowledged))) || completionSubmitting || completionIssuesLoading || completionIssuesError || (completionIssues.length > 0 && !completionIssuesAcknowledged)) return;
                              setCompletionSubmitting(true);
                              try {
                                const accessToken = getPremierInstallerAccessToken();
                                if (!accessToken) {
                                  window.alert("Installer session required.");
                                  return;
                                }
                                const recheck = await supabase.rpc("get_premier_installer_issue_reports", {
                                  p_access_token: accessToken, p_job_id: job.id,
                                });
                                if (recheck.error) {
                                  window.alert("Could not verify reported issues. Completion stopped.");
                                  return;
                                }
                                if ((recheck.data ?? []).length !== completionIssues.length) {
                                  setCompletionIssues(recheck.data ?? []);
                                  setCompletionIssuesAcknowledged(false);
                                  window.alert("Reported issues changed. Review them before submitting.");
                                  return;
                                }
                                if (pendingReturns[job.id]) {
                                  const {data:ackData,error:ackError}=await supabase.rpc('acknowledge_premier_installation_return',{
                                    p_access_token:accessToken,p_job_id:job.id,p_review_id:pendingReturns[job.id].review_id,
                                  });
                                  if(ackError || ackData!==true){window.alert(ackError?.message || 'Could not acknowledge RJ return. Refresh and try again.');return;}
                                }
                                const { data, error } = await supabase.rpc(
                                  "complete_premier_installation",
                                  { p_access_token: accessToken, p_job_id: job.id }
                                );
                                if (error || data !== true) {
                                  window.alert(error?.message || "Completion blocked. Review the job status and any outstanding follow-up.");
                                  return;
                                }
                                const completedJobName =
                                  `${job.first_name ?? ""} ${job.last_name ?? ""}`.trim() ||
                                  "This installation";
                                setInstallerCompletionNotice(completedJobName);
                                setCompletionConfirmJobId(null);
                                setCompletionAcknowledged(false);
                                setFlowTestAcknowledged(false);
                                setReturnAcknowledged(false);
                                setSelectedInstallerJobId(null);
                                setInstallerJobFileOpenId(null);
                                setLiveInstallerJobs((current) =>
                                  current.filter((item) => item.id !== job.id)
                                );
                              } finally {
                                setCompletionSubmitting(false);
                              }
                            }}
                            style={{
                              width: "100%",
                              minHeight: 50,
                              borderRadius: 10,
                              border: "1px solid #78aa88",
                              background: ((job.id === 'e426d508-dfa1-4d60-9484-df5b546bc725' && String(job.first_name || '').trim() === 'Premier' && String(job.last_name || '').trim() === 'FlowTest') ? flowTestAcknowledged : (completionAcknowledged && (!pendingReturns[job.id] || returnAcknowledged))) ? "#285a3a" : "#27332d",
                              color: "#ffffff",
                              fontWeight: 900,
                              opacity: !((job.id === 'e426d508-dfa1-4d60-9484-df5b546bc725' && String(job.first_name || '').trim() === 'Premier' && String(job.last_name || '').trim() === 'FlowTest') ? flowTestAcknowledged : (completionAcknowledged && (!pendingReturns[job.id] || returnAcknowledged))) || completionSubmitting ? 0.6 : 1,
                              cursor: completionSubmitting ? "wait" : "pointer",
                            }}
                          >
                            {completionSubmitting ? "Submitting..." : (job.id === 'e426d508-dfa1-4d60-9484-df5b546bc725' && String(job.first_name || '').trim() === 'Premier' && String(job.last_name || '').trim() === 'FlowTest') ? "Submit TEST Job to RJ" : "Confirm & Submit Installation"}
                          </button>

                          <button
                            type="button"
                            disabled={completionSubmitting}
                            onClick={() => {
                              setCompletionConfirmJobId(null);
                              setCompletionAcknowledged(false);
                              setFlowTestAcknowledged(false);
                            }}
                            style={{
                              width: "100%",
                              marginTop: 12,
                              minHeight: 44,
                              border: "1px solid #46545e",
                              borderRadius: 10,
                              background: "#182128",
                              color: "#ffffff",
                              cursor: "pointer",
                            }}
                          >
                            Cancel — Keep Working
                          </button>
                        </section>
                      </div>
                    ) : null}
                    </>
                  )}
                </div>
                  ))}
              </div>
            </div>
          )}
        </section>


      </div>
      <style>{`
        .installer-workspace-layout {
          display: grid;
          grid-template-columns: minmax(230px, 285px) minmax(0, 1fr);
          gap: 12px;
          align-items: start;
        }

        .installer-job-rail {
          display: grid;
          gap: 8px;
          padding: 8px;
          max-height: calc(100vh - 250px);
          overflow-y: auto;
          scrollbar-width: thin;
        }

        @media (max-width: 760px) {
          .installer-workspace-layout {
            grid-template-columns: 1fr;
          }

          .installer-job-rail {
            max-height: 320px;
          }
        }

        @media (max-width: 560px) {
          .tech-quick-grid,
          .tech-action-grid,
          .tech-agreement-grid,
          .tech-completion-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}







