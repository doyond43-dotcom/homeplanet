import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type FieldJob = {
  id: string;
  customer: string;
  address: string;
  crew: string;
  phase: string;
  materialEta: string;
  permit: string;
  scheduled: string;
  nextAction: string;
  customerTruth: string;
  measurements: { name: string; location: string; measurement: string }[];
  manufacturerPo: string;
  requiredPhotos: string[];
  permitProof: string[];
  approvedScope: string;
  promisedIncluded: string[];
  notIncluded: string[];
  approvedChanges: string[];
  signedAgreement: string;
  lastConfirmed: string;
  workType?: "Project" | "Service Call";
  serviceIssue?: string;
  serviceAppointment?: string;
  status:
    | "Today"
    | "Ready to Schedule"
    | "Waiting on Material"
    | "In Progress"
    | "Problems"
    | "Upcoming"
    | "Service Calls";
};

const jobs: FieldJob[] = [
  {
    id: "PW-1048",
    customer: "Michael & Sarah Carter",
    address: "1842 Palm Ridge Dr, Wellington",
    crew: "Crew 2",
    phase: "Scheduled",
    materialEta: "Sept 14",
    permit: "Approved",
    scheduled: "Aug 28",
    nextAction: "Confirm material arrival",
    customerTruth:
      "Rear French door may require additional stucco work depending on opening condition. Preserve existing blinds. Customer prefers arrival before 9 AM.",
    measurements: [
      { name: "Window 01", location: "Master Bedroom", measurement: '36 1/4" x 62 1/2"' },
      { name: "Window 02", location: "Living Room", measurement: '48" x 60"' },
      { name: "Door 01", location: "Rear French Door", measurement: '72" x 80"' },
    ],
    manufacturerPo: "ES Windows PO 48592",
    requiredPhotos: [
      "Before condition",
      "Fasteners / screws",
      "Concrete / block opening",
      "Stucco condition",
      "Product label",
      "Installed unit",
      "Exterior overview",
    ],
    permitProof: [
      "Fastener pattern",
      "Opening condition",
      "Product label",
      "Installed unit",
      "Exterior overview",
    ],
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
    approvedChanges: [
      "Possible additional stucco work if opening condition requires it",
    ],
    signedAgreement: "Proposal PW-1048",
    lastConfirmed: "Customer scope confirmed before scheduling",
    status: "Upcoming",
  },
  {
    id: "PW-1037",
    customer: "Robert Ellis",
    address: "Palm Beach Gardens",
    crew: "Crew 2",
    phase: "Inspection",
    materialEta: "Received",
    permit: "In-progress inspection",
    scheduled: "Today",
    nextAction: "Upload inspection photos",
    customerTruth:
      "Replace 4 windows and front entry door. Customer requested protection around interior flooring and wants all removed materials hauled away.",
    measurements: [
      { name: "Window 01", location: "Front Bedroom", measurement: '35 3/4" x 61"' },
      { name: "Window 02", location: "Rear Bedroom", measurement: '36" x 60 1/2"' },
      { name: "Door 01", location: "Front Entry", measurement: '36" x 80"' },
    ],
    manufacturerPo: "ES Windows PO 48177",
    requiredPhotos: [
      "Fasteners / screws",
      "Installed window",
      "Installed entry door",
      "Product labels",
      "Exterior overview",
    ],
    permitProof: [
      "Fastener photos still required",
      "Product label photos still required",
      "Exterior installation overview required",
    ],
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
    approvedChanges: [],
    signedAgreement: "Proposal PW-1037",
    lastConfirmed: "Installation expectations confirmed before crew arrival",
    status: "Today",
  },
  {
    id: "PW-1042",
    customer: "Harbor Point Builders",
    address: "Jupiter Island - New Construction",
    crew: "Not assigned",
    phase: "Waiting",
    materialEta: "Oct 3",
    permit: "Builder handling permit",
    scheduled: "Pending material",
    nextAction: "Monitor manufacturer ETA",
    customerTruth:
      "New-construction package for builder. Installation must follow approved plans and builder sequencing. Coordinate access with superintendent before mobilizing crew.",
    measurements: [
      { name: "Opening A1", location: "First Floor", measurement: '72" x 60"' },
      { name: "Opening A2", location: "First Floor", measurement: '48" x 72"' },
      { name: "Door D1", location: "Rear Elevation", measurement: '72" x 96"' },
    ],
    manufacturerPo: "ES Windows PO 48904",
    requiredPhotos: [
      "Opening condition",
      "Delivered material",
      "Product labels",
      "Fasteners",
      "Completed elevations",
    ],
    permitProof: [
      "Builder controls permit",
      "Installation proof still required for company records",
    ],
    approvedScope: "Commercial window + door package per approved plans",
    promisedIncluded: [
      "Install according to approved builder plans",
      "Coordinate access with superintendent",
      "Provide company installation proof",
    ],
    notIncluded: [
      "Builder-controlled permit administration",
      "Work outside approved plan set",
    ],
    approvedChanges: [],
    signedAgreement: "Builder Proposal PW-1042",
    lastConfirmed: "Builder sequencing and access requirements confirmed",
    status: "Waiting on Material",
  },
  {
    id: "PW-1051",
    customer: "Angela Morris",
    address: "West Palm Beach",
    crew: "Crew 1",
    phase: "Installation",
    materialEta: "Received",
    permit: "Approved",
    scheduled: "Today",
    nextAction: "Check crew progress",
    customerTruth:
      "Impact-window installation in progress. Customer approved removal and disposal. Protect kitchen counters and keep rear entry accessible during work.",
    measurements: [
      { name: "Window 01", location: "Kitchen", measurement: '47 1/2" x 59 3/4"' },
      { name: "Window 02", location: "Living Room", measurement: '60" x 60"' },
    ],
    manufacturerPo: "ES Windows PO 48761",
    requiredPhotos: [
      "Before condition",
      "Fasteners",
      "Installed units",
      "Stucco condition",
      "After photos",
    ],
    permitProof: [
      "Fastener photos",
      "Installed-unit photos",
      "Exterior overview",
    ],
    approvedScope: "Impact window installation",
    promisedIncluded: [
      "Removal and disposal",
      "Protect kitchen counters",
      "Keep rear entry accessible during work",
    ],
    notIncluded: [
      "Interior painting",
      "Unapproved structural repairs",
    ],
    approvedChanges: [],
    signedAgreement: "Proposal PW-1051",
    lastConfirmed: "Customer access expectations confirmed before installation",
    status: "In Progress",
  },
  {
    id: "SV-021",
    customer: "Linda Ramirez",
    address: "Royal Palm Beach",
    crew: "Gio",
    phase: "Service Call",
    materialEta: "Not needed yet",
    permit: "Not required",
    scheduled: "Today - 3:30 PM",
    nextAction: "Diagnose leaking sliding door",
    customerTruth:
      "Customer reports water entering near the bottom track during heavy rain. Original installation was completed by Premier. Customer asked that Gio call before arrival.",
    measurements: [
      {
        name: "Door 01",
        location: "Rear Patio Slider",
        measurement: '72" x 80"',
      },
    ],
    manufacturerPo: "Original job record PW-0986",
    requiredPhotos: [
      "Existing condition",
      "Track / sill",
      "Exterior seal",
      "Drainage / weep area",
      "Completed repair",
    ],
    permitProof: [],
    approvedScope: "Diagnose rear sliding-door water intrusion",
    promisedIncluded: [
      "Inspect door, track, seal and drainage",
      "Document findings",
      "Complete minor adjustment or sealing if appropriate",
    ],
    notIncluded: [
      "Major structural repair without approval",
      "Replacement product unless separately approved",
    ],
    approvedChanges: [],
    signedAgreement: "Service appointment SV-021",
    lastConfirmed: "Customer confirmed service visit for today",
    workType: "Service Call",
    serviceIssue:
      "Water entering near bottom track of rear sliding door during heavy rain.",
    serviceAppointment: "Today - 3:30 PM",
    status: "Service Calls",
  },
];

const lanes = [
  "Today",
  "Ready to Schedule",
  "Waiting on Material",
  "In Progress",
  "Problems",
  "Punch-Out / Needs Attention",
  "Service Calls",
  "Upcoming",
] as const;

// premier-rj-issue-verification-v1: review an individual issue independently of installation approval.
function PremierFieldIssueReview({issueId,jobId,followups,onSaved,issues}:{issueId:string;jobId:string;followups:any[];onSaved:()=>Promise<void>;issues:any[]}) {
  const [open,setOpen]=useState(false);
  const [action,setAction]=useState('under_review');
  const [note,setNote]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [history,setHistory]=useState<any[]>([]);
  const [historyError,setHistoryError]=useState('');
  // premier-rj-review-visible-v2
  const [savedReview,setSavedReview]=useState<any|null>(null);
  const [savedReviewError,setSavedReviewError]=useState('');
  // premier-rj-duplicate-v1: independent duplicate closing, never a repair verification
  const [duplicateOpen,setDuplicateOpen]=useState(false);
  const [duplicateTarget,setDuplicateTarget]=useState('');
  const [duplicateReason,setDuplicateReason]=useState('');
  const [duplicateConfirmed,setDuplicateConfirmed]=useState(false);
  const [duplicateBusy,setDuplicateBusy]=useState(false);
  const [duplicateError,setDuplicateError]=useState('');
  const candidateIssues=issues.filter((x:any)=>x.id!==issueId);
  const closeDuplicate=async()=>{
    if(duplicateBusy||!duplicateConfirmed||!duplicateTarget||duplicateReason.trim().length<15)return;
    const token=getPremierFieldAccessToken();
    if(!token){setDuplicateError('RJ field access unavailable');return;}
    setDuplicateBusy(true);setDuplicateError('');
    try{
      const explanation='Confirmed duplicate of '+duplicateTarget+'. '+duplicateReason.trim();
      const {data,error}=await supabase.rpc('mark_premier_issue_duplicate',{
        p_access_token:token,p_issue_id:issueId,p_original_issue_id:duplicateTarget,p_note:explanation
      });
      if(error)throw error;
      if(data!==true)throw new Error('Duplicate was not recorded.');
      setDuplicateOpen(false);setDuplicateTarget('');setDuplicateReason('');setDuplicateConfirmed(false);
      await onSaved();await reloadSavedReview();
    }catch(e:any){setDuplicateError(e?.message||'Could not close duplicate report');}
    finally{setDuplicateBusy(false);}
  };
  const reloadSavedReview=async()=>{
    const token=getPremierFieldAccessToken();
    if(!token){setSavedReviewError('Review history unavailable.');return;}
    const {data,error}=await supabase.rpc('get_premier_issue_history',{p_access_token:token,p_issue_id:issueId});
    if(error){setSavedReviewError('Could not load saved review.');return;}
    setSavedReviewError('');setHistory(data??[]);setSavedReview((data??[])[0]??null);
  };
  useEffect(()=>{void reloadSavedReview()},[issueId]);
  const latest=followups.find((item:any)=>item.issue_id===issueId);
  const canVerify=latest?.action==='fix_documented';
  const openReview=async()=>{
    if(open){setOpen(false);return;}
    setOpen(true);setError('');setHistoryError('');
    const token=getPremierFieldAccessToken();
    if(!token){setHistoryError('Field access unavailable');return;}
    const {data,error:readError}=await supabase.rpc('get_premier_issue_history',{p_access_token:token,p_issue_id:issueId});
    if(readError){setHistoryError('Issue history unavailable. Refresh before verifying.');return;}
    setHistory(data??[]);
  };
  const save=async()=>{
    if(busy||note.trim().length<5)return;
    if(action==='resolved'&&!canVerify){setError('Installer must document the fix before RJ can verify resolution.');return;}
    const token=getPremierFieldAccessToken();
    if(!token){setError('Field access unavailable');return;}
    setBusy(true);setError('');
    try {
      const {data,error:saveError}=await supabase.rpc('update_premier_issue_resolution',{
        p_access_token:token,p_issue_id:issueId,p_new_status:action,p_note:note.trim()
      });
      if(saveError)throw saveError;
      if(data!==true)throw new Error('Issue status did not change. Refresh and review its current status.');
      setNote('');setOpen(false);
      await onSaved();
      await reloadSavedReview();
    } catch(e:any){setError(e?.message||'Could not save RJ review.');}
    finally{setBusy(false);}
  };
  return <div style={{marginTop:9}}>
    {savedReviewError?<div role="alert" style={{color:'#ffc7a3',fontSize:11}}>{savedReviewError}</div>:null}
    {savedReview?<div style={{marginBottom:9,padding:10,border:'1px solid #5b775f',borderRadius:8,background:'#18271f',color:'#e8f2e9'}}>
      <div style={{fontSize:11,fontWeight:900}}>RJ's Latest Review: {savedReview.new_status==='under_review'?'Under Review':savedReview.new_status==='resolved'?'Verified Resolved':savedReview.new_status==='duplicate'?'Closed as Duplicate':'Needs Follow-Up'}</div>
      <div style={{fontSize:11,marginTop:5,whiteSpace:'pre-wrap'}}>{savedReview.note}</div>
      <div style={{fontSize:10,marginTop:5,color:'#b2cbb9'}}>RJ / Office | {new Date(savedReview.changed_at).toLocaleString()}</div>
    </div>:null}
    {savedReview?.new_status!=='duplicate'?<>
      <button type="button" onClick={()=>{setDuplicateOpen(!duplicateOpen);setDuplicateError('');}} style={{marginBottom:6,marginRight:8,background:'#3f3825',border:'1px solid #8a784d',borderRadius:7,padding:'8px 10px',color:'#f4e8d0',fontSize:11,fontWeight:900,cursor:'pointer'}}> {duplicateOpen?'Cancel Duplicate Review':'Close as Duplicate'} </button>
      {duplicateOpen?<div style={{border:'1px solid #89754f',borderRadius:9,padding:11,marginTop:5,marginBottom:8,background:'#242116',display:'grid',gap:9}}>
        <strong style={{fontSize:12,color:'#fff1d6'}}>Confirm This Is the Same Issue</strong>
        <div style={{fontSize:11,color:'#f4dec0'}}>Use only after confirming both reports describe the same missing or damaged part. The original issue remains open. This does not verify a repair.</div>
        <label style={{fontSize:11,color:'#f4e5c9'}}>Original report to keep open
          <select value={duplicateTarget} onChange={e=>setDuplicateTarget(e.target.value)} style={{display:'block',marginTop:5,width:'100%',padding:9,background:'#141711',border:'1px solid #95815b',borderRadius:6,color:'#fff3dd'}}>
            <option value="">Select original issue...</option>
            {candidateIssues.map((x:any)=><option key={x.id} value={x.id}>{(x.categories??[]).join(', ')||'Reported Issue'} — {String(x.details||'').slice(0,105)} [{x.id.slice(0,8)}]</option>)}
          </select>
        </label>
        <label style={{fontSize:11,color:'#f4e5c9'}}>RJ's duplicate confirmation note
          <textarea rows={3} value={duplicateReason} onChange={e=>setDuplicateReason(e.target.value)} placeholder="How did you confirm both reports refer to the same problem?" style={{display:'block',width:'100%',boxSizing:'border-box',marginTop:5,padding:9,background:'#141711',border:'1px solid #95815b',borderRadius:6,color:'#fff3dd'}} />
        </label>
        <label style={{display:'flex',gap:7,alignItems:'start',fontSize:11,color:'#fff0d6'}}><input type="checkbox" checked={duplicateConfirmed} onChange={e=>setDuplicateConfirmed(e.target.checked)}/>I confirmed this report is a duplicate, not a separate issue. Keep the original issue open.</label>
        {duplicateError?<div role="alert" style={{color:'#ffc5aa',fontSize:11}}>{duplicateError}</div>:null}
        <button type="button" disabled={duplicateBusy||!duplicateConfirmed||!duplicateTarget||duplicateReason.trim().length<15} onClick={()=>void closeDuplicate()} style={{padding:10,border:'1px solid #b09665',borderRadius:7,color:'#fff',background:'#68502c',fontWeight:900,opacity:duplicateBusy||!duplicateConfirmed||!duplicateTarget||duplicateReason.trim().length<15?0.55:1}}>{duplicateBusy?'Saving...':'Confirm Close as Duplicate'}</button>
      </div>:null}
      <button type="button" onClick={()=>void openReview()} style={{background:'#213b30',border:'1px solid #648770',borderRadius:7,padding:'8px 10px',color:'#e3f4e8',fontSize:11,fontWeight:900,cursor:'pointer'}}>{open?'Close Review':'Review Issue'}</button>
    {open?<div style={{border:'1px solid #527460',borderRadius:9,padding:11,marginTop:8,background:'#101e19',display:'grid',gap:8}}>
      <strong style={{fontSize:12,color:'#ecf6ec'}}>RJ Issue Review</strong>
      {latest?<div style={{fontSize:11,color:'#b9d7c5'}}>Installer's latest update: {latest.action.replaceAll('_',' ')} — {latest.note||'No note'}</div>:<div style={{fontSize:11,color:'#e2b59c'}}>No installer follow-up documented.</div>}
      <label style={{fontSize:11,color:'#dce9e0'}}>Decision
        <select value={action} onChange={e=>setAction(e.target.value)} style={{display:'block',marginTop:5,width:'100%',background:'#0d1715',color:'#e8f2eb',padding:9,border:'1px solid #627f6c',borderRadius:7}}>
          <option value="needs_review">Return for More Work / Office Follow-up</option>
          <option value="under_review">Under RJ Review</option>
          <option value="resolved" disabled={!canVerify}>Verify Resolved{canVerify?'':' (fix not documented)'}</option>
        </select>
      </label>
      <label style={{fontSize:11,color:'#dce9e0'}}>RJ's Review Note (required, at least 5 characters)
        <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Record the decision and who is responsible for the next action" style={{display:'block',boxSizing:'border-box',marginTop:5,width:'100%',resize:'vertical',background:'#0d1715',color:'#e8f2eb',padding:9,border:'1px solid #627f6c',borderRadius:7}} />
      </label>
      {historyError?<div role="alert" style={{color:'#ffc7a3',fontSize:11}}>{historyError}</div>:null}
      {history.length>0?<details><summary style={{cursor:'pointer',fontSize:11}}>RJ / Office Review History ({history.length})</summary>{history.map((h:any,i:number)=><div key={i} style={{fontSize:10,color:'#c3d7cd',padding:6}}>{h.new_status} — {h.note} — {h.actor_label} — {new Date(h.changed_at).toLocaleString()}</div>)}</details>:null}
      {error?<div role="alert" style={{color:'#ffc7a3',fontSize:11}}>{error}</div>:null}
      <button type="button" disabled={busy||note.trim().length<5||Boolean(historyError)||(action==='resolved'&&!canVerify)} onClick={()=>void save()} style={{padding:10,border:'1px solid #83ad92',borderRadius:7,color:'#fff',background:'#28613f',fontWeight:900,opacity:busy||note.trim().length<5?0.55:1}}>{busy?'Saving...':'Save RJ Review'}</button>
    </div>:null}
    </>:null}
  </div>;
}

function FieldBeamComposer({ job }: { job: any }) {
  const [recipient, setRecipient] = useState<string>("Angel");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");

  const startVoiceInput = () => {
    if (listening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech-to-text is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || "";
      if (!transcript) return;

      setBody((current) =>
        current.trim() ? `${current.trim()} ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      setError("Could not capture voice message.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const sendBeam = async () => {
    if (sending) return;

    const message = body.trim();
    if (!message || !job?.id) return;

    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setError("Premier staff access token missing.");
      return;
    }

    setSending(true);
    setError("");

    const { error: sendError } = await supabase.rpc(
      "send_premier_beam_message",
      {
        p_access_token: accessToken,
        p_job_id: job.id,
        p_sender_role: "Field Ops",
        p_recipient_role: recipient,
        p_body: message,
      }
    );

    if (sendError) {
      console.error("Field Ops Beam send failed:", sendError);
      setError(sendError.message || "Could not send Beam message.");
      setSending(false);
      return;
    }

    setBody("");
    setSending(false);
  };

  return (
    <div
      style={{
        border: "1px solid #78aa88",
        borderRadius: 12,
        background: "linear-gradient(135deg, #173225 0%, #101b16 100%)",
        padding: 10,
        marginBottom: 10,
        boxShadow:
          "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          color: "#9fd3ae",
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
          marginBottom: 3,
        }}
      >
        Beam Quick Message
      </div>

      <div
        style={{
          color: "#d9e5ee",
          fontSize: 10,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        Fast job communication
      </div>

      <select
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        style={{
          width: "100%",
          minHeight: 38,
          border: "1px solid #477057",
          borderRadius: 9,
          background: "#0d1711",
          color: "#e5eee8",
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
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 46px",
          gap: 8,
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
          rows={2}
          style={{
            width: "100%",
            minHeight: 52,
            boxSizing: "border-box",
            resize: "vertical",
            border: "1px solid #477057",
            borderRadius: 9,
            background: "#0d1711",
            color: "#e5eee8",
            padding: "9px 10px",
            fontSize: 12,
          }}
        />

        <button
          type="button"
          onClick={startVoiceInput}
          disabled={listening}
          title={listening ? "Listening..." : "Talk message"}
          style={{
            border: listening
              ? "1px solid #d98778"
              : "1px solid #8fbea0",
            borderRadius: 9,
            background: listening ? "#7a2d24" : "#2f6842",
            color: "#ffffff",
            fontSize: 20,
            cursor: listening ? "wait" : "pointer",
            boxShadow: listening
              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
              : "none",
          }}
        >
          Mic
        </button>
      </div>

      {error ? (
        <div
          style={{
            color: "#d8b267",
            fontSize: 10,
            marginTop: 7,
          }}
        >
          {error}
        </div>
      ) : null}

      <button
        type="button"
        disabled={sending || !body.trim()}
        onClick={() => void sendBeam()}
        style={{
          width: "100%",
          minHeight: 38,
          marginTop: 8,
          border: "1px solid #8fbea0",
          borderRadius: 9,
          background: "#2f6842",
          color: "#ffffff",
          fontWeight: 900,
          cursor: sending || !body.trim() ? "not-allowed" : "pointer",
          opacity: sending || !body.trim() ? 0.55 : 1,
        }}
      >
        {sending ? "Sending..." : `Send to ${recipient}`}
      </button>
    </div>
  );
}

function getPremierFieldAccessToken() {
  const readStoredToken = (storage: Storage) => {
    try {
      const stored = storage.getItem("premier_staff_session");
      if (!stored) return null;

      const session = JSON.parse(stored);

      if (
        session?.expiresAt &&
        Date.now() >= new Date(session.expiresAt).getTime()
      ) {
        storage.removeItem("premier_staff_session");
        return null;
      }

      const displayName = String(session?.displayName || "").trim();
      const normalizedName = displayName.toLowerCase();

      const canUseFieldOperations =
        normalizedName === "rj" ||
        normalizedName === "gino marquez";

      if (!canUseFieldOperations) {
        return null;
      }

      const token = String(session?.accessToken || "").trim();
      return token || null;
    } catch (error) {
      console.error("Premier field session read failed:", error);
      return null;
    }
  };

  return (
    readStoredToken(window.localStorage) ||
    readStoredToken(window.sessionStorage)
  );
}

type PremierPendingReturn = {job_id:string;review_id:string;reason:string;returned_at:string;acknowledged:boolean};
export default function PremierFieldOperationsBoard() {
  // premier-return-visibility-v1: read saved latest return decision.
  const [pendingReturns,setPendingReturns]=useState<Record<string,PremierPendingReturn>>({});
  useEffect(()=>{let active=true;const token=getPremierFieldAccessToken();if(!token)return;
    void supabase.rpc('get_premier_pending_installation_returns',{p_access_token:token}).then(({data,error})=>{
      if(!active)return;if(error){console.error('RJ return status unavailable',error);return;}
      const found:Record<string,PremierPendingReturn>={};for(const item of (data??[]) as PremierPendingReturn[])found[item.job_id]=item;setPendingReturns(found);
    });return()=>{active=false};},[]);
  const [activeJobId, setActiveJobId] = useState("PW-1037");
  const [selectedFieldJobId, setSelectedFieldJobId] = useState<string | null>(null);
  const [fieldMonitoringOpen, setFieldMonitoringOpen] = useState(false);
  const [fieldMonitoringDrawerOpen, setFieldMonitoringDrawerOpen] = useState(false);
  const [fieldMonitoringJobId, setFieldMonitoringJobId] =
    useState<string | null>(null);
  const [staffGreeting, setStaffGreeting] = useState<{ headline: string; detail: string } | null>(null);
  const [fieldBeamMessages, setFieldBeamMessages] = useState<any[]>([]);
  const [fieldBeamLoading, setFieldBeamLoading] = useState(false);
  const [fieldBeamError, setFieldBeamError] = useState("");
  const [fieldBeamReplyOpenId, setFieldBeamReplyOpenId] = useState<string | null>(null);
  const [fieldBeamReplyBody, setFieldBeamReplyBody] = useState("");
  const [fieldBeamReplySending, setFieldBeamReplySending] = useState(false);
  const [fieldBeamReplyListening, setFieldBeamReplyListening] = useState(false);
  const [fieldBeamReplyError, setFieldBeamReplyError] = useState("");
  const [crewChanges, setCrewChanges] = useState<Record<string, string>>({});
  const [scheduleChanges, setScheduleChanges] = useState<Record<string, string>>({});
  const [scheduleDrawerOpen, setScheduleDrawerOpen] = useState(false);
  const [scheduleDraftDate, setScheduleDraftDate] = useState("");
  const [scheduleDraftTime, setScheduleDraftTime] = useState("");
  const [updates, setUpdates] = useState<
    { jobId: string; time: string; text: string }[]
  >([]);

  const [liveFinalMeasurements, setLiveFinalMeasurements] = useState<any[]>([]);
  const [liveFinalMeasurementsLoading, setLiveFinalMeasurementsLoading] =
    useState(false);

  const [activeFinalMeasureJobId, setActiveFinalMeasureJobId] =
    useState<string | null>(null);
  const [finalMeasureOpenings, setFinalMeasureOpenings] = useState<any[]>([]);
  const [finalMeasureOpeningsLoading, setFinalMeasureOpeningsLoading] =
    useState(false);
  const [finalOpeningType, setFinalOpeningType] = useState("Window");
  const [finalOpeningLocation, setFinalOpeningLocation] = useState("");
  const [finalOpeningWidth, setFinalOpeningWidth] = useState("");
  const [finalOpeningHeight, setFinalOpeningHeight] = useState("");
  const [finalOpeningNotes, setFinalOpeningNotes] = useState("");
  const [savingFinalOpening, setSavingFinalOpening] = useState(false);

  const [liveInstallations, setLiveInstallations] = useState<any[]>([]);
  const [rjInstallReady, setRjInstallReady] = useState<Record<string, boolean>>({});

  // premier-rj-readiness-focus-v1: new Office-to-RJ events; separate from readiness itself.
  const [rjReadinessEvents, setRjReadinessEvents] = useState<Record<string, any[]>>({});
  const [rjReadinessError, setRjReadinessError] = useState<Record<string, string>>({});
  const [rjReadinessAckSaving, setRjReadinessAckSaving] = useState<string | null>(null);
  const [installScheduleDrafts, setInstallScheduleDrafts] = useState<
    Record<string, string>
  >({});
  const [installScheduleSavingJobId, setInstallScheduleSavingJobId] =
    useState<string | null>(null);
  const [installScheduleModes, setInstallScheduleModes] = useState<Record<string, string>>({});
  const [installScheduleErrors, setInstallScheduleErrors] = useState<
    Record<string, string>
  >({});

  const [installDateTextDrafts, setInstallDateTextDrafts] = useState<
    Record<string, string>
  >({});

  const [installTimeTextDrafts, setInstallTimeTextDrafts] = useState<
    Record<string, string>
  >({});

  const formatInstallDateText = (draft: string) => {
    const datePart = (draft || "").split("T")[0] || "";
    const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return "";

    return `${match[2]}/${match[3]}/${match[1]}`;
  };

  const parseInstallDateText = (value: string) => {
    const match = value
      .trim()
      .match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);

    if (!match) return null;

    const month = Number(match[1]);
    const day = Number(match[2]);
    const year = Number(match[3]);

    const testDate = new Date(year, month - 1, day);

    if (
      testDate.getFullYear() !== year ||
      testDate.getMonth() !== month - 1 ||
      testDate.getDate() !== day
    ) {
      return null;
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const formatInstallTimeText = (draft: string) => {
    const timePart = (draft || "").includes("T")
      ? (draft || "").split("T")[1] || ""
      : "";

    const match = timePart.match(/^(\d{2}):(\d{2})$/);

    if (!match) return "";

    const hour24 = Number(match[1]);
    const minute = match[2];

    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 =
      hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;

    return `${hour12}:${minute} ${period}`;
  };

  const parseInstallTimeText = (value: string) => {
    const cleaned = value.trim().toUpperCase();

    const twelveHour = cleaned.match(
      /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/
    );

    if (twelveHour) {
      let hour = Number(twelveHour[1]);
      const minute = Number(twelveHour[2] ?? "00");
      const period = twelveHour[3];

      if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
        return null;
      }

      if (period === "AM" && hour === 12) hour = 0;
      if (period === "PM" && hour !== 12) hour += 12;

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
    }

    const twentyFourHour = cleaned.match(/^(\d{1,2}):(\d{2})$/);

    if (twentyFourHour) {
      const hour = Number(twentyFourHour[1]);
      const minute = Number(twentyFourHour[2]);

      if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return null;
      }

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
    }

    return null;
  };

  // RJ installer completion review: compact decision, full proof remains in View Activity.
  const [installationReviewReports, setInstallationReviewReports] = useState<Record<string, any[]>>({});
  const [installationReviewErrors, setInstallationReviewErrors] = useState<Record<string, string>>({});
  const [installationReviewLoading, setInstallationReviewLoading] = useState<string | null>(null);
  const [installationReviewSaving, setInstallationReviewSaving] = useState(false);
  const [installationReturnOpen, setInstallationReturnOpen] = useState(false);
  const [installationReturnReason, setInstallationReturnReason] = useState("");

  useEffect(() => {
    if (!selectedFieldJobId) return;
    const match = liveInstallations.find((item) => item.id === selectedFieldJobId);
    if (!match || match.current_stage !== "installation_complete" || match.next_action?.startsWith("RJ approved installation review.")) return;
    let active = true;
    const jobId = match.id;
    const token = getPremierFieldAccessToken();
    setInstallationReviewLoading(jobId);
    setInstallationReviewErrors((current) => ({ ...current, [jobId]: "" }));
    if (!token) {
      setInstallationReviewErrors((current) => ({ ...current, [jobId]: "Staff session missing" }));
      setInstallationReviewLoading(null);
      return;
    }
    // premier-rj-final-issue-status-v1: same saved RJ decisions Angel sees.
    void Promise.all([
      supabase.rpc("get_premier_installer_issue_reports", { p_access_token: token, p_job_id: jobId }),
      supabase.rpc("get_premier_installer_issue_decisions", { p_access_token: token, p_job_id: jobId }),
    ]).then(([reportsResult, decisionsResult]) => {
      if (!active) return;
      if (reportsResult.error || decisionsResult.error) {
        setInstallationReviewErrors((current) => ({ ...current, [jobId]: "Could not verify issue statuses. Review is paused." }));
        setInstallationReviewReports((current) => { const next = { ...current }; delete next[jobId]; return next; });
      } else {
        const decisions = (decisionsResult.data ?? []) as any[];
        const merged = (reportsResult.data ?? []).map((report: any) => {
          const decision = decisions.find((entry: any) => entry.issue_id === report.id);
          return { ...report, resolution_status: decision?.resolution_status ?? report.resolution_status ?? "needs_review" };
        });
        setInstallationReviewReports((current) => ({ ...current, [jobId]: merged }));
        setInstallationReviewErrors((current) => ({ ...current, [jobId]: "" }));
      }
      setInstallationReviewLoading(null);
    }).catch(() => {
      if (!active) return;
      setInstallationReviewErrors((current) => ({ ...current, [jobId]: "Could not verify issue statuses. Review is paused." }));
      setInstallationReviewLoading(null);
    });
    return () => { active = false; };
  }, [selectedFieldJobId, liveInstallations]);

  const submitInstallationReview = async (jobId: string, decision: "approved" | "returned") => {
    if (installationReviewSaving || installationReviewLoading === jobId || installationReviewErrors[jobId]) return;
    const selected = liveInstallations.find((item) => item.id === jobId);
    if (!selected || selected.current_stage !== "installation_complete" || selected.next_action?.startsWith("RJ approved installation review.")) return;
    if (!Object.prototype.hasOwnProperty.call(installationReviewReports, jobId)) return;
    const reason = installationReturnReason.trim();
    if (decision === "returned" && reason.length < 5) {
      setInstallationReviewErrors((current) => ({ ...current, [jobId]: "Enter a short reason for the installer." }));
      return;
    }
    const token = getPremierFieldAccessToken();
    if (!token) return;
    const openReports = (installationReviewReports[jobId] ?? []).filter((item: any) => !["resolved", "duplicate"].includes(item.resolution_status));
    const message = decision === "approved"
      ? `Approve installation review? ${openReports.length === 0 ? "No unresolved reported issues." : `${openReports.length} unresolved reported issue(s) remain for Office follow-up.`}`
      : `Send job back to installer with this reason?\n\n${reason}`;
    if (!window.confirm(message)) return;
    setInstallationReviewSaving(true);
    setInstallationReviewErrors((current) => ({ ...current, [jobId]: "" }));
    const { data, error } = await supabase.rpc("review_premier_installation", {
      p_access_token: token, p_job_id: jobId, p_decision: decision, p_reason: decision === "returned" ? reason : "",
    });
    setInstallationReviewSaving(false);
    if (error || data !== true) {
      setInstallationReviewErrors((current) => ({ ...current, [jobId]: error?.message || "Review did not save." }));
      return;
    }
    window.location.reload();
  };

  const [fieldInstallerActivityJobId, setFieldInstallerActivityJobId] =
    useState<string | null>(null);

  const [fieldInstallerProofPhotos, setFieldInstallerProofPhotos] = useState<
    Record<string, any[]>
  >({});

  const [fieldInstallerProofLoading, setFieldInstallerProofLoading] = useState<
    Record<string, boolean>
  >({});

  const [fieldInstallerProofErrors, setFieldInstallerProofErrors] = useState<
    Record<string, string>
  >({});

  const [fieldBuckingDrafts, setFieldBuckingDrafts] = useState<
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

  const [fieldSavingBuckingJobId, setFieldSavingBuckingJobId] =
    useState<string | null>(null);

  const [fieldUploadingBuckingJobId, setFieldUploadingBuckingJobId] =
    useState<string | null>(null);

  // premier-rj-followup-display-v1: saved installer issue updates, by job and issue.
  const [fieldIssueFollowups, setFieldIssueFollowups] = useState<Record<string, any[]>>({});
  const [fieldFollowupsErrors, setFieldFollowupsErrors] = useState<Record<string, string>>({});
  const renderFieldFollowup = (jobId: string, issueId: string) => {
    const entries=(fieldIssueFollowups[jobId] ?? []).filter((e:any)=>e.issue_id===issueId);
    if(!entries.length)return null;
    const latest=entries[0];
    const label: Record<string,string>={reviewed:'Reviewed',waiting_materials:'Waiting on Materials',needs_office:'Needs RJ / Office',fix_documented:'Fix Documented - Needs Verification'};
    return (
      <div style={{border:'1px solid #55745a',background:'#14241d',borderRadius:8,padding:10,marginTop:9,color:'#dcefe1',fontSize:11}}>
        <div style={{fontWeight:900,marginBottom:5}}>Latest Follow-Up: {label[latest.action] ?? latest.action}</div>
        <div style={{whiteSpace:'pre-wrap'}}>{latest.note || 'Reviewed by installer'}</div>
        <div style={{color:'#aac3b2',fontSize:10,marginTop:5}}>{latest.actor_label} - {new Date(latest.created_at).toLocaleString()}</div>
        {entries.length>1 ? <details style={{marginTop:7}}><summary style={{cursor:'pointer'}}>View follow-up history ({entries.length})</summary>{entries.map((e:any,i:number)=><div key={i} style={{borderTop:'1px solid #385347',paddingTop:6,marginTop:6}}>{label[e.action] ?? e.action}: {e.note} ({new Date(e.created_at).toLocaleString()})</div>)}</details>:null}
      </div>
    );
  };
  const [fieldIssueReports, setFieldIssueReports] = useState<
    Record<
      string,
      Array<{
        id: string;
        job_id: string;
        reporter_label: string;
        categories: string[];
        details: string;
        reported_at: string;
      }>
    >
  >({});
  const loadFieldInstallerActivity = async (jobId: string) => {
    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldInstallerProofErrors((current) => ({
        ...current,
        [jobId]: "Premier staff access is missing.",
      }));
      return;
    }

    setFieldInstallerProofLoading((current) => ({
      ...current,
      [jobId]: true,
    }));

    setFieldInstallerProofErrors((current) => ({
      ...current,
      [jobId]: "",
    }));

    const { data, error } = await supabase.functions.invoke(
      "premier-installer-proof-photo",
      {
        body: {
          action: "list",
          accessToken,
          jobId,
        },
      }
    );

    if (error) {
      console.error(
        "Premier Field Ops installer activity load failed:",
        error
      );

      setFieldInstallerProofErrors((current) => ({
        ...current,
        [jobId]: "Could not load installer activity.",
      }));

      setFieldInstallerProofLoading((current) => ({
        ...current,
        [jobId]: false,
      }));

      return;
    }

    const photos = data?.photos ?? [];

    setFieldInstallerProofPhotos((current) => ({
      ...current,
      [jobId]: photos,
    }));

    const buckingPhoto = photos.find(
      (photo: any) => photo.proof_type === "Bucking / buck inspection"
    );

    if (buckingPhoto) {
      setFieldBuckingDrafts((current) => ({
        ...current,
        [jobId]: {
          buckingNotes: buckingPhoto.bucking_notes ?? "",
          measurementNotes: buckingPhoto.measurement_notes ?? "",
          materialIssueNotes: buckingPhoto.material_issue_notes ?? "",
          needsAttention: Boolean(buckingPhoto.needs_attention),
          saved: Boolean(
            buckingPhoto.bucking_notes ||
              buckingPhoto.measurement_notes ||
              buckingPhoto.material_issue_notes ||
              buckingPhoto.needs_attention
          ),
        },
      }));
    }

    const { data: reports, error: reportsError } = await supabase.rpc(
      "get_premier_installer_issue_reports",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (reportsError) {
      console.error("Premier issue reports load failed:", reportsError);
      setFieldInstallerProofErrors((current) => ({
        ...current,
        [jobId]: "Installer photos loaded, but issue reports could not load.",
      }));
    } else {
      setFieldIssueReports((current) => ({
        ...current,
        [jobId]: reports ?? [],
      }));
    }

    const {data:followups,error:followupsError}=await supabase.rpc('get_premier_installer_issue_followups',{p_access_token:accessToken,p_job_id:jobId});
    if(followupsError){
      setFieldFollowupsErrors(current=>({...current,[jobId]:'Issue follow-ups could not load. Refresh before reviewing.'}));
      setFieldIssueFollowups(current=>({...current,[jobId]:[]}));
    } else {
      setFieldFollowupsErrors(current=>({...current,[jobId]:''}));
      setFieldIssueFollowups(current=>({...current,[jobId]:followups ?? []}));
    }
    setFieldInstallerProofLoading((current) => ({
      ...current,
      [jobId]: false,
    }));
  };
  const [liveInstallationsLoading, setLiveInstallationsLoading] =
    useState(false);
  const [crewDrafts, setCrewDrafts] = useState<Record<string, string>>({});
  const [crewSavingJobId, setCrewSavingJobId] = useState<string | null>(null);
  const [crewSaveErrors, setCrewSaveErrors] = useState<Record<string, string>>({});

  const [fieldJobDocuments, setFieldJobDocuments] =
    useState<Record<string, any[]>>({});
  const [fieldJobDocumentsLoading, setFieldJobDocumentsLoading] =
    useState<Record<string, boolean>>({});
  const [fieldJobDocumentsErrors, setFieldJobDocumentsErrors] =
    useState<Record<string, string>>({});
  const [fieldJobFileOpenId, setFieldJobFileOpenId] =
    useState<string | null>(null);

  const [fieldBuckingRecordsOpenId, setFieldBuckingRecordsOpenId] =
    useState<string | null>(null);
  const [fieldIssueFormOpenId, setFieldIssueFormOpenId] =
    useState<string | null>(null);
  const [preInstallSavedNotes, setPreInstallSavedNotes] = useState<Record<string, any[]>>({});
  const [preInstallNotesMessage, setPreInstallNotesMessage] = useState<string | null>(null);
  const loadPreInstallSavedNotes = async (jobId: string) => {
    const token = getPremierFieldAccessToken();
    if (!token) return;
    const { data, error } = await supabase.rpc("get_premier_preinstallation_notes", {
      p_access_token: token,
      p_job_id: jobId,
    });
    if (error) {
      console.error("Could not load RJ pre-installation notes:", error);
      setPreInstallNotesMessage("Could not load saved notes. Please refresh.");
      return;
    }
    setPreInstallSavedNotes((current) => ({ ...current, [jobId]: data ?? [] }));
  };
  useEffect(() => {
    if (!selectedFieldJobId) return;
    void loadPreInstallSavedNotes(selectedFieldJobId);
  }, [selectedFieldJobId]);

  const [fieldIssueCategories, setFieldIssueCategories] =
    useState<Record<string, string[]>>({});

  const [fieldIssueDetails, setFieldIssueDetails] =
    useState<Record<string, string>>({});

  const [fieldIssueSavingJobId, setFieldIssueSavingJobId] =
    useState<string | null>(null);

  const [fieldIssueListeningJobId, setFieldIssueListeningJobId] =
    useState<string | null>(null);
  const startFieldIssueVoice = (jobId: string) => {
    if (fieldIssueListeningJobId) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.alert("Speech-to-text is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setFieldIssueListeningJobId(jobId);

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() || "";

      if (!transcript) return;

      setFieldIssueDetails((current) => ({
        ...current,
        [jobId]: current[jobId]?.trim()
          ? `${current[jobId].trim()} ${transcript}`
          : transcript,
      }));
    };

    recognition.onerror = () => {
      window.alert("Could not capture voice notes.");
    };

    recognition.onend = () => setFieldIssueListeningJobId(null);
    recognition.start();
  };
  const saveFieldIssueReport = async (jobId: string) => {
    if (fieldIssueSavingJobId) return;

    const categories = fieldIssueCategories[jobId] ?? [];
    const details = (fieldIssueDetails[jobId] ?? "").trim();
    const isPreInstall = liveInstallations.some(
      (item) => item.id === jobId && item.current_stage === "scheduled"
    );
    if (isPreInstall) {
      if (categories.length === 0) {
        window.alert("Choose at least one pre-installation category.");
        return;
      }
      if (!details) {
        window.alert("Add a short note for the installer.");
        return;
      }
      const accessToken = getPremierFieldAccessToken();
      if (!accessToken) {
        window.alert("Premier staff access is missing.");
        return;
      }
      setFieldIssueSavingJobId(jobId);
      try {
        const { error } = await supabase.rpc("save_premier_preinstallation_note", {
          p_access_token: accessToken,
          p_job_id: jobId,
          p_categories: categories,
          p_details: details,
        });
        if (error) throw error;
        setFieldIssueCategories((current) => ({ ...current, [jobId]: [] }));
        setFieldIssueDetails((current) => ({ ...current, [jobId]: "" }));
        setFieldIssueFormOpenId(null);
        setPreInstallNotesMessage("Saved. The note is now in the job record.");
        await loadPreInstallSavedNotes(jobId);
      } catch (error: any) {
        console.error("RJ pre-installation note failed:", error);
        window.alert(error?.message || "Could not save pre-installation note.");
      } finally {
        setFieldIssueSavingJobId(null);
      }
      return;
    }

    if (categories.length === 0) {
      window.alert("Select at least one issue category.");
      return;
    }

    if (categories.includes("Other") && !details) {
      window.alert("Describe the issue when selecting Other.");
      return;
    }

    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) {
      window.alert("Premier staff access is missing.");
      return;
    }

    setFieldIssueSavingJobId(jobId);

    try {
      const { error } = await supabase.rpc(
        "report_premier_installer_issue",
        {
          p_access_token: accessToken,
          p_job_id: jobId,
          p_categories: categories,
          p_details: details,
        }
      );

      if (error) throw error;

      setFieldIssueCategories((current) => ({
        ...current,
        [jobId]: [],
      }));

      setFieldIssueDetails((current) => ({
        ...current,
        [jobId]: "",
      }));

      setFieldIssueFormOpenId(null);

      await loadFieldInstallerActivity(jobId);

      window.alert("Field issue reported successfully.");
    } catch (error: any) {
      console.error("RJ issue report failed:", error);
      window.alert(error?.message || "Could not save field issue.");
    } finally {
      setFieldIssueSavingJobId(null);
    }
  };

  const [liveInspections, setLiveInspections] = useState<any[]>([]);
  // Premier final-walkthrough issue statuses; read only. Original reports remain unchanged.
  const [walkthroughIssueStates, setWalkthroughIssueStates] = useState<Record<string, any[]>>({});
  const [walkthroughIssueErrors, setWalkthroughIssueErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!selectedFieldJobId || !liveInspections.some((j: any) => j.id === selectedFieldJobId)) return;
    const jobId = selectedFieldJobId;
    const token = getPremierFieldAccessToken();
    if (!token) return;
    let active = true;
    void supabase.rpc("get_premier_issue_resolution_state", { p_access_token: token, p_job_id: jobId })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setWalkthroughIssueErrors(prev => ({ ...prev, [jobId]: "Issue status unavailable. Refresh before reviewing." }));
        else {
          setWalkthroughIssueStates(prev => ({ ...prev, [jobId]: data ?? [] }));
          setWalkthroughIssueErrors(prev => ({ ...prev, [jobId]: "" }));
        }
      });
    return () => { active = false; };
  }, [selectedFieldJobId, liveInspections]);
  const [liveInspectionsLoading, setLiveInspectionsLoading] =
    useState(false);

  const [inspectionPunchItems, setInspectionPunchItems] =
    useState<Record<string, any[]>>({});
  const [inspectionPunchDrafts, setInspectionPunchDrafts] =
    useState<Record<string, string>>({});
  const [walkthroughOpening, setWalkthroughOpening] = useState<Record<string, string>>({});
  const [walkthroughIssueType, setWalkthroughIssueType] = useState<Record<string, string>>({});
  const [walkthroughListening, setWalkthroughListening] = useState<string | null>(null);
  const startWalkthroughDictation = (jobId: string) => {
    if (walkthroughListening) return;
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Recognition) { window.alert("Voice input is unavailable in this browser. You can still type notes."); return; }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setWalkthroughListening(jobId);
    recognition.onresult = (event: any) => {
      const spoken = String(event.results?.[0]?.[0]?.transcript || "").trim();
      if (spoken) setInspectionPunchDrafts((current) => ({ ...current, [jobId]: [current[jobId], spoken].filter(Boolean).join(" ") }));
    };
    recognition.onerror = () => window.alert("Could not capture voice notes. You can type instead.");
    recognition.onend = () => setWalkthroughListening(null);
    recognition.start();
  };
  const [inspectionPunchSaving, setInspectionPunchSaving] =
    useState<Record<string, boolean>>({});
  const [walkthroughSavedOnce, setWalkthroughSavedOnce] = useState<Record<string, boolean>>({});
  const [walkthroughOutcomeBusy, setWalkthroughOutcomeBusy] = useState<Record<string, boolean>>({});
  const [walkthroughOutcomeNotes, setWalkthroughOutcomeNotes] = useState<Record<string, string>>({});
  const [walkthroughOutcomeError, setWalkthroughOutcomeError] = useState<Record<string, string>>({});
  const submitWalkthroughOutcome = async (job: any, outcome: "approved" | "corrections_needed") => {
    const token = getPremierFieldAccessToken();
    if (!token || walkthroughOutcomeBusy[job.id]) return;
    const note = (walkthroughOutcomeNotes[job.id] || "").trim();
    if (outcome === "corrections_needed" && note.length < 5) {
      setWalkthroughOutcomeError(current => ({ ...current, [job.id]: "Describe the corrections or findings before sending to Office." }));
      return;
    }
    if (!window.confirm(outcome === "approved" ? "Approve this final walkthrough and notify Office for closeout?" : "Send these corrections to Office for installer coordination?")) return;
    setWalkthroughOutcomeBusy(current => ({ ...current, [job.id]: true }));
    setWalkthroughOutcomeError(current => ({ ...current, [job.id]: "" }));
    const { data, error } = await supabase.rpc("record_premier_final_walkthrough", {
      p_access_token: token, p_job_id: job.id, p_outcome: outcome, p_note: note,
    });
    if (error || data !== true) {
      setWalkthroughOutcomeError(current => ({ ...current, [job.id]: error?.message || "Could not record walkthrough outcome. Please retry." }));
    } else {
      setLiveInspections(current => current.filter(item => item.id !== job.id));
      setSelectedFieldJobId(null);
      window.alert(outcome === "approved" ? "Walkthrough approved. Office notified for final closeout." : "Corrections recorded. Office notified to coordinate installer follow-up.");
    }
    setWalkthroughOutcomeBusy(current => ({ ...current, [job.id]: false }));
  };
  const [inspectionPunchErrors, setInspectionPunchErrors] =
    useState<Record<string, string>>({});

  const [punchOuts, setPunchOuts] = useState<
    {
      id: string;
      jobId: string;
      opening: string;
      type: string;
      issue: string;
      reportedBy: string;
      reportedAt: string;
      owner: string | null;
      status: "Reported" | "Owned" | "Resolved";
    }[]
  >([
    {
      id: "PO-1048-1",
      jobId: "PW-1048",
      opening: "General / Unknown",
      type: "Damage / Scratch",
      issue: "Remove scratches before final walkthrough.",
      reportedBy: "Installer",
      reportedAt: "Aug 26 - 5:16 PM",
      owner: null,
      status: "Reported",
    },
  ]);

  const [quickAccess, setQuickAccess] = useState<
    | "Customer Notes"
    | "Measurements"
    | "Manufacturer PO"
    | "Required Photos"
    | "Permit Proof"
    | null
  >(null);

  const loadFieldJobDocuments = async (jobId: string) => {
    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldJobDocuments((current) => ({ ...current, [jobId]: [] }));
      setFieldJobDocumentsErrors((current) => ({
        ...current,
        [jobId]: "Premier staff access is missing.",
      }));
      return;
    }

    setFieldJobDocumentsLoading((current) => ({
      ...current,
      [jobId]: true,
    }));
    setFieldJobDocumentsErrors((current) => ({
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

      setFieldJobDocuments((current) => ({
        ...current,
        [jobId]: data?.documents ?? [],
      }));
    } catch (error) {
      console.error("Premier Field Ops job document list failed:", error);

      setFieldJobDocuments((current) => ({ ...current, [jobId]: [] }));
      setFieldJobDocumentsErrors((current) => ({
        ...current,
        [jobId]:
          error instanceof Error
            ? error.message
            : "Could not load job documents.",
      }));
    } finally {
      setFieldJobDocumentsLoading((current) => ({
        ...current,
        [jobId]: false,
      }));
    }
  };

  const loadFinalMeasureOpenings = async (jobId: string) => {
    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) {
      window.alert("Premier field access is missing.");
      return;
    }

    setFinalMeasureOpeningsLoading(true);

    const { data, error } = await supabase.rpc(
      "get_premier_final_measurement_openings",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
      }
    );

    if (error) {
      console.error("Premier final measurement openings failed:", error);
      window.alert("Could not load final measurements.");
      setFinalMeasureOpenings([]);
    } else {
      setFinalMeasureOpenings(data ?? []);
    }

    setFinalMeasureOpeningsLoading(false);
  };

  const saveFinalMeasureOpening = async (jobId: string) => {
    if (
      !finalOpeningType ||
      !finalOpeningLocation.trim() ||
      !finalOpeningWidth.trim() ||
      !finalOpeningHeight.trim()
    ) {
      window.alert("Enter type, location, width, and height.");
      return;
    }

    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) {
      window.alert("Premier field access is missing.");
      return;
    }

    const nextOpeningNumber =
      finalMeasureOpenings.reduce(
        (highest, opening) =>
          Math.max(highest, Number(opening.opening_number) || 0),
        0
      ) + 1;

    setSavingFinalOpening(true);

    const { error } = await supabase.rpc(
      "save_premier_final_measurement_opening",
      {
        p_access_token: accessToken,
        p_job_id: jobId,
        p_opening_id: null,
        p_opening_number: nextOpeningNumber,
        p_opening_type: finalOpeningType,
        p_location: finalOpeningLocation.trim(),
        p_width_text: finalOpeningWidth.trim(),
        p_height_text: finalOpeningHeight.trim(),
        p_notes: finalOpeningNotes.trim(),
      }
    );

    if (error) {
      console.error("Premier final measurement opening save failed:", error);
      window.alert("Could not save this final measurement opening.");
      setSavingFinalOpening(false);
      return;
    }

    setFinalOpeningWidth("");
    setFinalOpeningHeight("");
    setFinalOpeningNotes("");

    await loadFinalMeasureOpenings(jobId);
    setSavingFinalOpening(false);
  };

  useEffect(() => {
    let active = true;

    const loadFinalMeasurements = async () => {
      const accessToken =
        getPremierFieldAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveFinalMeasurements([]);
          setLiveFinalMeasurementsLoading(false);
        }
        return;
      }

      setLiveFinalMeasurementsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_final_measurement_assignments",
        {
          p_access_token: accessToken,
          p_destination: "field",
        }
      );

      if (!active) return;

      if (error) {
        console.error(
          "Premier field final measurement assignments failed:",
          error
        );
        setLiveFinalMeasurements([]);
      } else {
        setLiveFinalMeasurements(data ?? []);
      }

      setLiveFinalMeasurementsLoading(false);
    };

    void loadFinalMeasurements();

    const selectedFieldJob =
    liveFinalMeasurements.find((job) => job.id === selectedFieldJobId) ??
    liveInstallations.find((job) => job.id === selectedFieldJobId) ??
    liveInspections.find((job) => job.id === selectedFieldJobId) ??
    null;

  const selectedFieldStage =
    liveFinalMeasurements.some((job) => job.id === selectedFieldJobId)
      ? "Final Measurement"
      : liveInstallations.some((job) => job.id === selectedFieldJobId)
        ? liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage ===
          "installation_complete"
          ? "Installation Complete"
          : "Scheduled Installation"
        : liveInspections.some((job) => job.id === selectedFieldJobId)
          ? "Inspection"
          : "";
  return () => {
      active = false;
    };
  }, []);

  // Read only the selected job's readiness updates. Failed/unavailable RPCs never block the board.
  useEffect(() => {
    if (!selectedFieldJobId) return;
    let active = true;
    let busy = false;
    const jobId = selectedFieldJobId;

    const refreshReadiness = async () => {
      if (busy || !active) return;
      const accessToken = getPremierFieldAccessToken();
      if (!accessToken) return;
      busy = true;
      try {
        const { data, error } = await supabase.rpc("get_premier_rj_readiness_events", {
          p_access_token: accessToken,
          p_job_id: jobId,
        });
        if (!active) return;
        if (error) {
          // Database migration may not be installed yet; keep every existing RJ feature usable.
          setRjReadinessError((current) => ({ ...current, [jobId]: "Readiness notifications unavailable" }));
        } else {
          setRjReadinessError((current) => ({ ...current, [jobId]: "" }));
          setRjReadinessEvents((current) => ({ ...current, [jobId]: Array.isArray(data) ? data : [] }));
        }
      } catch {
        if (active) setRjReadinessError((current) => ({ ...current, [jobId]: "Readiness notifications unavailable" }));
      } finally {
        busy = false;
      }
    };

    void refreshReadiness();
    const timer = window.setInterval(() => void refreshReadiness(), 30000);
    const onFocus = () => void refreshReadiness();
    const onVisibility = () => { if (document.visibilityState === "visible") void refreshReadiness(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [selectedFieldJobId]);

  const acknowledgeRjReadinessEvent = async (jobId: string, eventId: string) => {
    const accessToken = getPremierFieldAccessToken();
    if (!accessToken || rjReadinessAckSaving) return;
    setRjReadinessAckSaving(eventId);
    try {
      const { data, error } = await supabase.rpc("acknowledge_premier_rj_readiness_event", {
        p_access_token: accessToken,
        p_job_id: jobId,
        p_event_id: eventId,
      });
      if (error || data !== true) {
        setRjReadinessError((current) => ({ ...current, [jobId]: "Could not acknowledge update. Try again." }));
        return;
      }
      setRjReadinessError((current) => ({ ...current, [jobId]: "" }));
      setRjReadinessEvents((current) => ({
        ...current,
        [jobId]: (current[jobId] ?? []).map((event) =>
          event.event_id === eventId ? { ...event, acknowledged_at: new Date().toISOString() } : event
        ),
      }));
    } catch {
      setRjReadinessError((current) => ({ ...current, [jobId]: "Could not acknowledge update. Try again." }));
    } finally {
      setRjReadinessAckSaving(null);
    }
  };
  useEffect(() => {
    let active = true;

    const loadInstallations = async () => {
      const accessToken =
        getPremierFieldAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveInstallations([]);
          setLiveInstallationsLoading(false);
        }
        return;
      }

      setLiveInstallationsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_field_installations",
        {
          p_access_token: accessToken,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Premier field installations failed:", error);
        setLiveInstallations([]);
      } else {
        setLiveInstallations(data ?? []);
      }

      setLiveInstallationsLoading(false);
    };

    void loadInstallations();

    return () => {
      active = false;
    };
  }, []);

  // Server is authoritative. Unknown/error means scheduling stays locked.
  useEffect(() => {
    if (!selectedFieldJobId) return;
    const jobId = selectedFieldJobId;
    let active = true;
    const refresh = async () => {
      const token = getPremierFieldAccessToken();
      if (!token) return;
      const { data, error } = await supabase.rpc("get_premier_rj_install_readiness", {
        p_access_token: token,
        p_job_id: jobId,
      });
      if (active) setRjInstallReady((current) => ({ ...current, [jobId]: !error && data === true }));
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => { active = false; window.clearInterval(timer); window.removeEventListener("focus", onFocus); };
  }, [selectedFieldJobId]);

  useEffect(() => {
    let active = true;

    const loadInspections = async () => {
      const accessToken =
        getPremierFieldAccessToken();

      if (!accessToken) {
        if (active) {
          setLiveInspections([]);
          setLiveInspectionsLoading(false);
        }
        return;
      }

      setLiveInspectionsLoading(true);

      const { data, error } = await supabase.rpc(
        "get_premier_field_inspections",
        {
          p_access_token: accessToken,
        }
      );

      if (!active) return;

      if (error) {
        console.error("Premier field inspections failed:", error);
        setLiveInspections([]);
      } else {
        setLiveInspections(data ?? []);
      }

      setLiveInspectionsLoading(false);
    };

    void loadInspections();

    return () => {
      active = false;
    };
  }, []);

  const loadInspectionPunchItems = async (jobId: string) => {
    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) return;

    setInspectionPunchErrors((current) => ({
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
      console.error("Premier punch items failed:", error);
      setInspectionPunchErrors((current) => ({
        ...current,
        [jobId]: "Could not load finish items.",
      }));
      return;
    }

    setInspectionPunchItems((current) => ({
      ...current,
      [jobId]: data ?? [],
    }));
  };

  const saveInspectionPunchItem = async (job: any) => {
    const notes = (inspectionPunchDrafts[job.id] || "").trim();
    const opening = (walkthroughOpening[job.id] || "").trim();
    const category = (walkthroughIssueType[job.id] || "").trim();
    const issue = [category, notes].filter(Boolean).join(": ");

    if (!opening || !category) {
      setInspectionPunchErrors((current) => ({ ...current, [job.id]: "Choose an opening/location and issue type first." }));
      return;
    }
    if (!issue) {
      setInspectionPunchErrors((current) => ({
        ...current,
        [job.id]: "Enter what needs attention.",
      }));
      return;
    }

    const accessToken = getPremierFieldAccessToken();

    if (!accessToken) return;

    setInspectionPunchSaving((current) => ({
      ...current,
      [job.id]: true,
    }));

    setInspectionPunchErrors((current) => ({
      ...current,
      [job.id]: "",
    }));

    const { data, error } = await supabase.rpc(
      "create_premier_punch_item",
      {
        p_access_token: accessToken,
        p_job_id: job.id,
        p_opening: opening,
        p_item_type: job.inspection_type === "Final Walkthrough" ? "Final Walkthrough" : "Final Inspection",
        p_issue: issue,
        p_owner: null,
      }
    );

    if (error || !data) {
      console.error("Create Premier punch item failed:", error);
      setInspectionPunchErrors((current) => ({
        ...current,
        [job.id]: "Could not save finish item.",
      }));
      setInspectionPunchSaving((current) => ({
        ...current,
        [job.id]: false,
      }));
      return;
    }

    setInspectionPunchDrafts((current) => ({ ...current, [job.id]: "" }));
    setWalkthroughOpening((current) => ({ ...current, [job.id]: "" }));
    setWalkthroughIssueType((current) => ({ ...current, [job.id]: "" }));

    setWalkthroughSavedOnce((current) => ({ ...current, [job.id]: true }));
    await loadInspectionPunchItems(job.id);

    setInspectionPunchSaving((current) => ({
      ...current,
      [job.id]: false,
    }));
  };


  useEffect(() => {
    if (!selectedFieldJobId) return;
    if (!liveInspections.some((item) => item.id === selectedFieldJobId)) return;
    void loadInspectionPunchItems(selectedFieldJobId);
  }, [selectedFieldJobId]);
  const activeJob = useMemo(
    () => jobs.find((job) => job.id === activeJobId) ?? jobs[0],
    [activeJobId]
  );

  const effectiveCrew = crewChanges[activeJob.id] ?? activeJob.crew;
  const effectiveSchedule = scheduleChanges[activeJob.id] ?? activeJob.scheduled;

  const activePunchOuts = punchOuts.filter(
    (item) => item.jobId === activeJob.id && item.status !== "Resolved"
  );

  const hasOpenPunchOut = activePunchOuts.length > 0;

  const addUpdate = (text: string) => {
    setUpdates((current) => [
      {
        jobId: activeJob.id,
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

  useEffect(() => {
    try {
      const rawSession =
        window.localStorage.getItem("premier_staff_session") ||
        window.sessionStorage.getItem("premier_staff_session");
      if (!rawSession) return;

      const session = JSON.parse(rawSession);
      const displayName = String(session?.displayName || "").trim();
      if (!displayName) return;

      const normalizedName = displayName.toLowerCase();

      const canUseFieldOperations =
        normalizedName === "rj" ||
        normalizedName === "gino marquez";

      if (!canUseFieldOperations) {
        window.location.replace("/planet/premier-window-door/staff");
        return;
      }

      const firstName = displayName.split(" ")[0];
      const hour = new Date().getHours();
      const period =
        hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

      setStaffGreeting({
        headline: `Good ${period}, ${firstName}.`,
        detail: "Here's what still needs your attention today.",
      });
    } catch (error) {
      console.error("Premier staff greeting failed:", error);
    }
  }, []);

  const loadFieldBeamInbox = async () => {
    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldBeamMessages([]);
      return;
    }

    setFieldBeamLoading(true);
    setFieldBeamError("");

    const { data, error } = await supabase.rpc(
      "get_premier_beam_inbox",
      {
        p_access_token: accessToken,
      }
    );

    if (error) {
      console.error("Premier Field Ops Beam inbox failed:", error);
      setFieldBeamMessages([]);
      setFieldBeamError("Could not load Beam.");
    } else {
      setFieldBeamMessages(data ?? []);
    }

    setFieldBeamLoading(false);
  };

  const markFieldBeamRead = async (messageId: string) => {
    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) return;

    const { data, error } = await supabase.rpc(
      "mark_my_premier_beam_read",
      {
        p_access_token: accessToken,
        p_message_id: messageId,
      }
    );

    if (error || data !== true) {
      console.error("Field Ops Beam mark read failed:", error);
      return;
    }

    const readAt = new Date().toISOString();

    setFieldBeamMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? {
              ...message,
              read_at: message.read_at ?? readAt,
            }
          : message
      )
    );
  };

  const startFieldBeamReplyVoiceInput = () => {
    if (fieldBeamReplyListening) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFieldBeamReplyError(
        "Speech-to-text is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setFieldBeamReplyListening(true);
      setFieldBeamReplyError("");
    };

    recognition.onresult = (event: any) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() || "";

      if (!transcript) return;

      setFieldBeamReplyBody((current) =>
        current.trim()
          ? `${current.trim()} ${transcript}`
          : transcript
      );
    };

    recognition.onerror = (event: any) => {
      console.error("Field Ops Beam speech recognition failed:", event);
      setFieldBeamReplyError("Could not capture voice message.");
    };

    recognition.onend = () => {
      setFieldBeamReplyListening(false);
    };

    recognition.start();
  };

  const sendFieldBeamReply = async (message: any) => {
    if (fieldBeamReplySending) return;

    const body = fieldBeamReplyBody.trim();
    if (!body) return;

    const recipient = String(message?.sender_label || "").trim();
    const allowedRecipients = [
      "Darcy",
      "Karolina",
      "Gio Richardson",
      "Gino Marquez",
      "Dennis Dillon",
      "RJ",
      "Angel",
      "Jose",
      "Obelio",
      "Joseph",
    ];

    if (!allowedRecipients.includes(recipient)) {
      setFieldBeamReplyError(
        "This Beam does not contain a replyable staff identity."
      );
      return;
    }

    const accessToken =
      getPremierFieldAccessToken();

    if (!accessToken) {
      setFieldBeamReplyError("Premier staff access token missing.");
      return;
    }

    setFieldBeamReplySending(true);
    setFieldBeamReplyError("");

    const { error } = await supabase.rpc(
      "send_premier_beam_message",
      {
        p_access_token: accessToken,
        p_job_id: message.job_id,
        p_sender_role: "Field Ops",
        p_recipient_role: recipient,
        p_body: body,
      }
    );

    if (error) {
      console.error("Field Ops Beam reply failed:", error);
      setFieldBeamReplyError(
        error.message || "Could not send Beam reply."
      );
      setFieldBeamReplySending(false);
      return;
    }

    setFieldBeamReplyBody("");
    setFieldBeamReplyOpenId(null);
    setFieldBeamReplySending(false);
  };

  useEffect(() => {
    void loadFieldBeamInbox();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111820 0%, #0b0f13 42%, #07090c 100%)",
        color: "#f5f7f5",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "20px 14px 56px",
        }}
      >
        <header style={{ marginBottom: 16 }}>
          <div
            style={{
              color: "#9db7ca",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Premier Window & Door
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(26px, 4vw, 38px)",
              lineHeight: 1,
            }}
          >
            Field Operations
          </h1>

          {staffGreeting ? (
            <div
              style={{
                marginTop: 14,
                borderLeft: "3px solid #9db7ca",
                padding: "9px 12px",
                background: "rgba(157, 183, 202, 0.06)",
                borderRadius: "0 10px 10px 0",
                maxWidth: 760,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 900 }}>
                {staffGreeting.headline}
              </div>
              <div
                style={{
                  marginTop: 3,
                  color: "#c0c7cd",
                  fontSize: 14,
                }}
              >
                {staffGreeting.detail}
              </div>
            </div>
          ) : null}

          <p
            style={{
              color: "#a8b0b7",
              margin: "10px 0 0",
              maxWidth: 760,
              fontSize: 14,
            }}
          >
            What is ready, where the crews are, what is delayed, and what needs to happen next.
          </p>
        </header>
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <button
            type="button"
            onClick={() => setFieldMonitoringOpen(false)}
            style={{
              minHeight: 38,
              border: !fieldMonitoringOpen
                ? "1px solid #6f9fbd"
                : "1px solid #3b4b56",
              borderRadius: 999,
              background: !fieldMonitoringOpen ? "#162630" : "#111820",
              color: "#ffffff",
              padding: "0 14px",
              fontSize: 11,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Field Jobs
          </button>

          <button
            type="button"
            onClick={async () => {
              setFieldMonitoringOpen(true);

              const activeFieldJobs = liveInstallations.filter(
                (item: any) =>
                  item?.crew &&
                  String(item.crew).trim().toLowerCase() !== "rj" &&
                  item?.current_stage !== "installation_complete"
              );

              await Promise.all(
                activeFieldJobs.map((item: any) =>
                  loadFieldInstallerActivity(item.id)
                )
              );
            }}
            style={{
              minHeight: 38,
              border: fieldMonitoringOpen
                ? "1px solid #6f9fbd"
                : "1px solid #3b4b56",
              borderRadius: 999,
              background: fieldMonitoringOpen ? "#162630" : "#111820",
              color: "#ffffff",
              padding: "0 14px",
              fontSize: 11,
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Field Monitoring
          </button>
        </div>
        {fieldMonitoringOpen ? (
          <section
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9500,
              background: "#0b1014",
              color: "#f3f6f8",
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                minHeight: 64,
                borderBottom: "1px solid #31495a",
                background: "#0f151b",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    color: "#8fa9bc",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Premier Window & Door
                </div>

                <div
                  style={{
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: 900,
                    marginTop: 2,
                  }}
                >
                  Field Monitoring
                </div>

                <div
                  style={{
                    color: "#8fa0ad",
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  Installer activity, proof, notes, issues, and field progress.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFieldMonitoringOpen(false)}
                style={{
                  minHeight: 40,
                  border: "1px solid #46545e",
                  borderRadius: 9,
                  background: "#151c22",
                  color: "#ffffff",
                  padding: "0 14px",
                  fontSize: 11,
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Close Monitoring
              </button>
            </div>

            <div
              style={{
                minHeight: 0,
                display: "grid",
                gridTemplateColumns: "300px minmax(0, 1fr)",
              }}
            >
              <aside
                style={{
                  minHeight: 0,
                  overflowY: "auto",
                  borderRight: "1px solid #31495a",
                  background: "#0f151b",
                  padding: 12,
                }}
              >
                <div
                  style={{
                    color: "#9db7ca",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Active Installer Jobs
                </div>

                <div
                  style={{
                    color: "#8fa0ad",
                    fontSize: 11,
                    marginBottom: 10,
                  }}
                >
                  Choose a job to monitor.
                </div>

                {liveInstallationsLoading ? (
                  <div style={{ color: "#8fa0ad", fontSize: 12 }}>
                    Loading active field jobs...
                  </div>
                ) : null}

                <div style={{ display: "grid", gap: 8 }}>
                  {liveInstallations
                    .filter(
                      (item: any) =>
                        item?.crew &&
                        String(item.crew).trim().toLowerCase() !== "rj" &&
                        item?.current_stage !== "installation_complete"
                    )
                    .map((monitorJob: any) => {
                      const customerName =
                        `${monitorJob.first_name || ""} ${
                          monitorJob.last_name || ""
                        }`.trim() || "Field Job";

                      const photos =
                        fieldInstallerProofPhotos[monitorJob.id] ?? [];

                      const reports =
                        fieldIssueReports[monitorJob.id] ?? [];

                      const needsAttention =
                        photos.some(
                          (photo: any) => photo.needs_attention
                        ) || reports.length > 0;

                      const buckReceived = photos.some(
                        (photo: any) =>
                          photo.proof_type ===
                          "Bucking / buck inspection"
                      );

                      const attentionPhoto = photos.find(
                        (photo: any) => photo.needs_attention
                      );

                      const fieldProgress =
                        monitorJob.current_stage === "installation_complete"
                          ? "Installation Complete"
                          : needsAttention
                            ? "Needs Attention"
                            : buckReceived
                              ? "Buck Inspection Received"
                              : "Awaiting Field Activity";

                      const isSelected =
                        fieldMonitoringJobId === monitorJob.id;

                      return (
                        <button
                          key={`monitor-${monitorJob.id}`}
                          type="button"
                          onClick={async () => {
                            setFieldMonitoringJobId(monitorJob.id);
                            setSelectedFieldJobId(monitorJob.id);
                            setFieldInstallerActivityJobId(monitorJob.id);
                            await loadFieldInstallerActivity(monitorJob.id);
                          }}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            border: needsAttention
                              ? "1px solid #a86b62"
                              : isSelected
                                ? "1px solid #8fc59f"
                                : "1px solid #31495a",
                            borderLeft: needsAttention
                              ? "4px solid #c17d6b"
                              : "4px solid #78aa88",
                            borderRadius: 10,
                            background: isSelected
                              ? "#17231b"
                              : "#111820",
                            color: "#f3f6f8",
                            padding: 12,
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              color: "#b7dec4",
                              fontSize: 9,
                              fontWeight: 900,
                              textTransform: "uppercase",
                              marginBottom: 5,
                            }}
                          >
                            {monitorJob.current_stage === "scheduled"
                              ? "Scheduled"
                              : monitorJob.current_stage === "installation_in_progress"
                                ? "Installation In Progress"
                                : monitorJob.current_stage === "installer_finish_back"
                                  ? "Final Finish Work"
                                  : "Installation Ready"}
                          </div>

                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 900,
                            }}
                          >
                            {customerName}
                          </div>

                          <div
                            style={{
                              color: "#aebac3",
                              fontSize: 10,
                              marginTop: 3,
                            }}
                          >
                            {monitorJob.project_address ||
                              "Address not available"}
                          </div>

                          <div
                            style={{
                              color: "#d7dde2",
                              fontSize: 10,
                              marginTop: 7,
                            }}
                          >
                            {monitorJob.crew}
                          </div>

                          {monitorJob.scheduled_for ? (
                            <div
                              style={{
                                color: "#8fa9bc",
                                fontSize: 10,
                                marginTop: 4,
                              }}
                            >
                              {new Date(
                                monitorJob.scheduled_for
                              ).toLocaleString()}
                            </div>
                          ) : (
                            <div
                              style={{
                                color: "#d7b47a",
                                fontSize: 10,
                                marginTop: 4,
                              }}
                            >
                              Install date not set
                            </div>
                          )}

                          <div
                            style={{
                              marginTop: 9,
                              paddingTop: 8,
                              borderTop: "1px solid #26323a",
                            }}
                          >
                            <div
                              style={{
                                color: needsAttention
                                  ? "#efb39a"
                                  : buckReceived
                                    ? "#b7dec4"
                                    : "#d7b47a",
                                fontSize: 10,
                                fontWeight: 900,
                              }}
                            >
                              {needsAttention
                                ? `⚠ ${fieldProgress.toUpperCase()}`
                                : `Progress: ${fieldProgress}`}
                            </div>

                            {needsAttention &&
                            attentionPhoto?.material_issue_notes ? (
                              <div
                                style={{
                                  color: "#efb39a",
                                  fontSize: 9,
                                  lineHeight: 1.4,
                                  marginTop: 4,
                                }}
                              >
                                {attentionPhoto.material_issue_notes}
                              </div>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </aside>

              <main
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  overflowY: "auto",
                  padding: 18,
                  background: "#0b1014",
                }}
              >
                {!fieldMonitoringJobId ? (
                  <div
                    style={{
                      minHeight: "70vh",
                      display: "grid",
                      placeItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 20,
                          fontWeight: 900,
                        }}
                      >
                        Select an Installer Job
                      </div>

                      <div
                        style={{
                          color: "#8fa0ad",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        Choose a card on the left to open its field activity.
                      </div>
                    </div>
                  </div>
                ) : (
                  (() => {
                    const monitorJob = liveInstallations.find(
                      (item: any) => item.id === fieldMonitoringJobId
                    );

                    if (!monitorJob) {
                      return (
                        <div style={{ color: "#8fa0ad", fontSize: 12 }}>
                          This field job is no longer active.
                        </div>
                      );
                    }

                    const photos =
                      fieldInstallerProofPhotos[monitorJob.id] ?? [];

                    const buckReceived = photos.some(
                      (photo: any) =>
                        photo.proof_type ===
                        "Bucking / buck inspection"
                    );

                    const reports =
                      fieldIssueReports[monitorJob.id] ?? [];

                    const needsAttention =
                      photos.some(
                        (photo: any) => photo.needs_attention
                      ) || reports.length > 0;

                    const customerName =
                      `${monitorJob.first_name || ""} ${
                        monitorJob.last_name || ""
                      }`.trim() || "Field Job";

                    return (
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 1100,
                          margin: "0 auto",
                          display: "grid",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            borderBottom: "1px solid #26323a",
                            paddingBottom: 12,
                          }}
                        >
                          <div
                            style={{
                              color: "#8fa9bc",
                              fontSize: 10,
                              fontWeight: 900,
                              textTransform: "uppercase",
                            }}
                          >
                            Installer Activity
                          </div>

                          <div
                            style={{
                              color: "#ffffff",
                              fontSize: 22,
                              fontWeight: 900,
                              marginTop: 3,
                            }}
                          >
                            {customerName}
                          </div>

                          <div
                            style={{
                              color: "#aebac3",
                              fontSize: 12,
                              marginTop: 3,
                            }}
                          >
                            {monitorJob.project_address}
                          </div>

                          <div
                            style={{
                              color: "#b7dec4",
                              fontSize: 12,
                              fontWeight: 900,
                              marginTop: 5,
                            }}
                          >
                            {monitorJob.crew}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFieldJobId(monitorJob.id);
                              setFieldInstallerActivityJobId(monitorJob.id);
                              setFieldMonitoringDrawerOpen(true);
                            }}
                            style={{
                              minHeight: 42,
                              marginTop: 14,
                              padding: "0 16px",
                              border: "1px solid #8fc59f",
                              borderRadius: 9,
                              background: "#234735",
                              color: "#ffffff",
                              fontSize: 12,
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            Open Full Job Workspace
                          </button>
                        </div>

                        {fieldInstallerProofLoading[monitorJob.id] ? (
                          <div style={{ color: "#8fa9bc", fontSize: 12 }}>
                            Loading installer activity...
                          </div>
                        ) : fieldInstallerProofErrors[monitorJob.id] ? (
                          <div style={{ color: "#d8a0a0", fontSize: 12 }}>
                            {fieldInstallerProofErrors[monitorJob.id]}
                          </div>
                        ) : (
                          <>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(3, minmax(0, 1fr))",
                                gap: 10,
                              }}
                            >
                              <div
                                style={{
                                  border: "1px solid #26323a",
                                  borderRadius: 10,
                                  background: "#111820",
                                  padding: 12,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#8fa9bc",
                                    fontSize: 9,
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Proof Photos
                                </div>

                                <div
                                  style={{
                                    color: "#ffffff",
                                    fontSize: 22,
                                    fontWeight: 900,
                                    marginTop: 4,
                                  }}
                                >
                                  {photos.length}
                                </div>
                              </div>

                              <div
                                style={{
                                  border: "1px solid #26323a",
                                  borderRadius: 10,
                                  background: "#111820",
                                  padding: 12,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#8fa9bc",
                                    fontSize: 9,
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Buck Inspection
                                </div>

                                <div
                                  style={{
                                    color: buckReceived
                                      ? "#b7dec4"
                                      : "#d7b47a",
                                    fontSize: 13,
                                    fontWeight: 900,
                                    marginTop: 6,
                                  }}
                                >
                                  {buckReceived
                                    ? "Received"
                                    : "Not received"}
                                </div>
                              </div>

                              <div
                                style={{
                                  border: needsAttention
                                    ? "1px solid #8a5f4a"
                                    : "1px solid #26323a",
                                  borderRadius: 10,
                                  background: needsAttention
                                    ? "#211713"
                                    : "#111820",
                                  padding: 12,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#8fa9bc",
                                    fontSize: 9,
                                    fontWeight: 900,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Field Status
                                </div>

                                <div
                                  style={{
                                    color: needsAttention
                                      ? "#efb39a"
                                      : "#b7dec4",
                                    fontSize: 13,
                                    fontWeight: 900,
                                    marginTop: 6,
                                  }}
                                >
                                  {needsAttention
                                    ? "Needs Attention"
                                    : "No issues flagged"}
                                </div>
                              </div>
                            </div>

                            {reports.length > 0 ? (
                              <div
                                style={{
                                  border: "1px solid #8a5f4a",
                                  borderRadius: 10,
                                  background: "#211713",
                                  padding: 14,
                                  display: "grid",
                                  gap: 10,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#efb39a",
                                    fontSize: 13,
                                    fontWeight: 900,
                                  }}
                                >
                                  Reported Issues ({reports.length})
                                  {fieldFollowupsErrors[monitorJob.id] ? <div role="alert" style={{fontSize:10,color:'#ffc7a3'}}>{fieldFollowupsErrors[monitorJob.id]}</div> : null}
                                </div>

                                {reports.map((report) => (
                                  <div
                                    key={report.id}
                                    style={{
                                      border: "1px solid #65483b",
                                      borderRadius: 8,
                                      background: "#172027",
                                      padding: 12,
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: "#ffffff",
                                        fontSize: 12,
                                        fontWeight: 900,
                                      }}
                                    >
                                      {(report.categories ?? []).join(", ")}
                                    </div>

                                    <div
                                      style={{
                                        color: "#b9c6ce",
                                        fontSize: 10,
                                        marginTop: 6,
                                      }}
                                    >
                                      Reported by{" "}
                                      {report.reporter_label.split(":").pop() ||
                                        report.reporter_label}
                                      {" • "}
                                      {new Date(report.reported_at).toLocaleString()}
                                    </div>

                                    {report.details ? (
                                      <div
                                        style={{
                                          color: "#f0d8c8",
                                          fontSize: 11,
                                          lineHeight: 1.5,
                                          whiteSpace: "pre-wrap",
                                          marginTop: 8,
                                        }}
                                      >
                                        {report.details}
                                        {renderFieldFollowup(report.job_id ?? monitorJob.id, report.id)}
                                        <PremierFieldIssueReview issueId={report.id} jobId={monitorJob.id} issues={fieldIssueReports[monitorJob.id] ?? []} followups={fieldIssueFollowups[monitorJob.id] ?? []} onSaved={async()=>{await loadFieldInstallerActivity(monitorJob.id)}} />
                                      </div>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {photos.length === 0 ? (
                              <div
                                style={{
                                  border: "1px solid #26323a",
                                  borderRadius: 10,
                                  background: "#111820",
                                  color: "#8fa9bc",
                                  padding: 14,
                                  fontSize: 12,
                                }}
                              >
                                No installer proof has been submitted yet.
                              </div>
                            ) : (
                              <div style={{ display: "grid", gap: 10 }}>
                                {photos.map(
                                  (photo: any, index: number) => (
                                    <div
                                      key={
                                        photo.id ??
                                        photo.storage_path ??
                                        `${monitorJob.id}-monitor-${index}`
                                      }
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                          "150px minmax(0, 1fr)",
                                        gap: 14,
                                        border: "1px solid #26323a",
                                        borderRadius: 10,
                                        background: "#111820",
                                        padding: 12,
                                      }}
                                    >
                                      {photo.url ? (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            window.open(
                                              photo.url,
                                              "_blank",
                                              "noopener,noreferrer"
                                            )
                                          }
                                          style={{
                                            width: 150,
                                            height: 110,
                                            border:
                                              "1px solid #31495a",
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            padding: 0,
                                            background: "#0a0f13",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <img
                                            src={photo.url}
                                            alt={
                                              photo.file_name ||
                                              "Installer proof"
                                            }
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              objectFit: "cover",
                                              display: "block",
                                            }}
                                          />
                                        </button>
                                      ) : (
                                        <div
                                          style={{
                                            width: 150,
                                            height: 110,
                                            border:
                                              "1px solid #31495a",
                                            borderRadius: 8,
                                            display: "grid",
                                            placeItems: "center",
                                            color: "#8fa9bc",
                                            fontSize: 10,
                                          }}
                                        >
                                          Photo unavailable
                                        </div>
                                      )}

                                      <div style={{ minWidth: 0 }}>
                                        <div
                                          style={{
                                            color: "#ffffff",
                                            fontSize: 13,
                                            fontWeight: 900,
                                          }}
                                        >
                                          {photo.proof_type ||
                                            "Installer Proof"}
                                        </div>

                                        <div
                                          style={{
                                            color: "#9ca8b2",
                                            fontSize: 11,
                                            marginTop: 3,
                                          }}
                                        >
                                          {photo.file_name ||
                                            `Photo ${index + 1}`}
                                        </div>

                                        {photo.uploaded_at ? (
                                          <div
                                            style={{
                                              color: "#72838f",
                                              fontSize: 10,
                                              marginTop: 3,
                                            }}
                                          >
                                            {new Date(
                                              photo.uploaded_at
                                            ).toLocaleString()}
                                          </div>
                                        ) : null}

                                        {photo.bucking_notes ? (
                                          <div
                                            style={{
                                              marginTop: 9,
                                              color: "#d7dde2",
                                              fontSize: 11,
                                            }}
                                          >
                                            <strong>Bucking:</strong>{" "}
                                            {photo.bucking_notes}
                                          </div>
                                        ) : null}

                                        {photo.measurement_notes ? (
                                          <div
                                            style={{
                                              marginTop: 5,
                                              color: "#d7dde2",
                                              fontSize: 11,
                                            }}
                                          >
                                            <strong>
                                              Measurements:
                                            </strong>{" "}
                                            {photo.measurement_notes}
                                          </div>
                                        ) : null}

                                        {photo.material_issue_notes ? (
                                          <div
                                            style={{
                                              marginTop: 5,
                                              color: "#efb39a",
                                              fontSize: 11,
                                            }}
                                          >
                                            <strong>
                                              Material Issue:
                                            </strong>{" "}
                                            {photo.material_issue_notes}
                                          </div>
                                        ) : null}

                                        {photo.needs_attention ? (
                                          <div
                                            style={{
                                              marginTop: 8,
                                              color: "#efb39a",
                                              fontSize: 10,
                                              fontWeight: 900,
                                            }}
                                          >
                                            NEEDS ATTENTION
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })()
                )}
              </main>
            </div>
          </section>
        ) : null}
<section
          style={{
            marginBottom: 12,
          }}
        >
          <div
            style={{
              color: "#9db7ca",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 7,
            }}
          >
            Field Status
          </div>

          <div
            className="field-status-strip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 8,
            }}
          >
            <div
              style={{
                border: "1px solid #4c4330",
                borderRadius: 11,
                background: "#121518",
                padding: "9px 11px",
              }}
            >
              <div
                style={{
                  color: "#d4b569",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Final Measurements
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                {liveFinalMeasurements.length}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #345140",
                borderRadius: 11,
                background: "#101713",
                padding: "9px 11px",
              }}
            >
              <div
                style={{
                  color: "#8fc59f",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Scheduled Installs
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                {liveInstallations.filter((job) => job.current_stage === "scheduled").length}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #4b4652",
                borderRadius: 11,
                background: "#151318",
                padding: "9px 11px",
              }}
            >
              <div
                style={{
                  color: "#b6a9c4",
                  fontSize: 9,
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Scheduled Walkthroughs / Inspections
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginTop: 3,
                }}
              >
                {liveInspections.length}
              </div>
            </div>
          </div>
        </section>
        {fieldBeamMessages.length > 0 ? (
          <section
            style={{
              border: "1px solid #78aa88",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #173225 0%, #101b16 100%)",
              padding: 12,
              marginBottom: 14,
              boxShadow:
                "0 0 0 1px rgba(139,184,154,0.08), 0 8px 24px rgba(0,0,0,0.18)",
            }}
          >
            {(() => {
              const message =
                fieldBeamMessages.find((item) => !item.read_at) ??
                fieldBeamMessages[0] ??
                null;

              if (!message) return null;

              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#9fd3ae",
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {message.read_at
                          ? <>Beam {"\u2022"} Read</>
                          : <>Beam {"\u2022"} New Message</>}
                      </div>

                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 14,
                          fontWeight: 900,
                          marginTop: 4,
                        }}
                      >
                        {message.first_name} {message.last_name}
                      </div>

                      <div
                        style={{
                          color: "#91a59a",
                          fontSize: 10,
                          marginTop: 2,
                        }}
                      >
                        {message.project_address}
                      </div>
                    </div>

                    <div
                      style={{
                        color: "#9fd3ae",
                        fontSize: 10,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                      }}
                    >
                      For you
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#8fb49b",
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    From {message.sender_label}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      border: "1px solid #294a36",
                      borderRadius: 10,
                      background: "#0d1711",
                      padding: 10,
                      color: "#e5eee8",
                      fontSize: 12,
                      lineHeight: 1.45,
                    }}
                  >
                    {message.body}
                  </div>

                  {fieldBeamReplyOpenId === message.id ? (
                    <div
                      style={{
                        marginTop: 10,
                        border: "1px solid #31533c",
                        borderRadius: 10,
                        background: "#101a13",
                        padding: 10,
                      }}
                    >
                      <div
                        style={{
                          color: "#9fd3ae",
                          fontSize: 9,
                          fontWeight: 900,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          marginBottom: 7,
                        }}
                      >
                        Reply to {message.sender_label}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1fr) 46px",
                          gap: 8,
                        }}
                      >
                        <textarea
                          value={fieldBeamReplyBody}
                          onChange={(event) =>
                            setFieldBeamReplyBody(event.target.value)
                          }
                          placeholder={
                            fieldBeamReplyListening
                              ? "Listening..."
                              : "Type or tap the mic and talk..."
                          }
                          rows={2}
                          style={{
                            width: "100%",
                            minHeight: 54,
                            boxSizing: "border-box",
                            resize: "vertical",
                            border: "1px solid #477057",
                            borderRadius: 9,
                            background: "#0d1711",
                            color: "#e5eee8",
                            padding: "9px 10px",
                            fontSize: 12,
                          }}
                        />

                        <button
                          type="button"
                          onClick={startFieldBeamReplyVoiceInput}
                          disabled={fieldBeamReplyListening}
                          title={
                            fieldBeamReplyListening
                              ? "Listening..."
                              : "Talk message"
                          }
                          aria-label={
                            fieldBeamReplyListening
                              ? "Listening..."
                              : "Talk message"
                          }
                          style={{
                            minHeight: 54,
                            border: fieldBeamReplyListening
                              ? "1px solid #d98778"
                              : "1px solid #8fbea0",
                            borderRadius: 9,
                            background: fieldBeamReplyListening
                              ? "#7a2d24"
                              : "#2f6842",
                            color: "#ffffff",
                            fontSize: 20,
                            cursor: fieldBeamReplyListening
                              ? "wait"
                              : "pointer",
                            boxShadow: fieldBeamReplyListening
                              ? "0 0 0 2px rgba(217,135,120,0.18), 0 0 18px rgba(217,135,120,0.22)"
                              : "none",
                            transition: "all 160ms ease",
                          }}
                        >
                          Mic
                        </button>
                      </div>

                      {fieldBeamReplyError ? (
                        <div
                          style={{
                            color: "#d8b267",
                            fontSize: 10,
                            marginTop: 7,
                          }}
                        >
                          {fieldBeamReplyError}
                        </div>
                      ) : null}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        <button
                          type="button"
                          disabled={
                            fieldBeamReplySending ||
                            !fieldBeamReplyBody.trim()
                          }
                          onClick={() => void sendFieldBeamReply(message)}
                          style={{
                            minHeight: 38,
                            border: "1px solid #8fbea0",
                            borderRadius: 9,
                            background: "#2f6842",
                            color: "#ffffff",
                            fontWeight: 900,
                            cursor:
                              fieldBeamReplySending ||
                              !fieldBeamReplyBody.trim()
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              fieldBeamReplySending ||
                              !fieldBeamReplyBody.trim()
                                ? 0.55
                                : 1,
                          }}
                        >
                          {fieldBeamReplySending
                            ? "Sending..."
                            : `Send to ${message.sender_label}`}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFieldBeamReplyOpenId(null);
                            setFieldBeamReplyBody("");
                            setFieldBeamReplyError("");
                          }}
                          style={{
                            minHeight: 38,
                            border: "1px solid #477057",
                            borderRadius: 9,
                            background: "#102018",
                            color: "#cce8d4",
                            padding: "0 12px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "center",
                      marginTop: 9,
                    }}
                  >
                    <div
                      style={{
                        color: "#71887a",
                        fontSize: 9,
                      }}
                    >
                      <div>
                        <div>
                          {new Date(message.created_at).toLocaleString()}
                        </div>

                        {message.read_at ? (
                          <div
                            style={{
                              marginTop: 3,
                              color: "#9fd3ae",
                              fontWeight: 800,
                            }}
                          >
                            Read by {message.recipient_role || "recipient"} {"\u2022"}{" "}
                            {new Date(message.read_at).toLocaleString()}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const nextOpen =
                            fieldBeamReplyOpenId === message.id
                              ? null
                              : message.id;

                          setFieldBeamReplyOpenId(nextOpen);
                          setFieldBeamReplyBody("");
                          setFieldBeamReplyError("");
                        }}
                        style={{
                          minHeight: 34,
                          border: "1px solid #78aa88",
                          borderRadius: 9,
                          background: "#173225",
                          color: "#cce8d4",
                          padding: "0 12px",
                          fontSize: 10,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        {fieldBeamReplyOpenId === message.id
                          ? "Close Reply"
                          : "Reply"}
                      </button>

                      {!message.read_at ? (
                        <button
                        type="button"
                        onClick={() => void markFieldBeamRead(message.id)}
                        style={{
                          minHeight: 34,
                          border: "1px solid #78aa88",
                          borderRadius: 9,
                          background: "#2f6842",
                          color: "#ffffff",
                          padding: "0 12px",
                          fontSize: 10,
                          fontWeight: 900,
                          cursor: "pointer",
                        }}
                      >
                        Mark Read
                      </button>
                      ) : null}
                    </div>
                  </div>
                </>
              );
            })()}
          </section>
        ) : fieldBeamLoading ? (
          <div
            style={{
              color: "#71887a",
              fontSize: 10,
              marginBottom: 10,
            }}
          >
            Loading Beam...
          </div>
        ) : fieldBeamError ? (
          <div
            style={{
              color: "#d8b267",
              fontSize: 10,
              marginBottom: 10,
            }}
          >
            {fieldBeamError}
          </div>
        ) : null}


        <style>{`
          .field-ops-workspace {
            display: grid;
            grid-template-columns: minmax(230px, 285px) minmax(0, 1fr);
            gap: 12px;
            align-items: start;
          }

          .field-job-rail {
            max-height: calc(100vh - 210px);
            overflow-y: auto;
            scrollbar-width: thin;
          }

          @media (max-width: 760px) {
            .field-status-strip {
              grid-template-columns: 1fr !important;
            }

            .field-ops-workspace {
              grid-template-columns: 1fr;
            }

            .field-job-rail {
              max-height: 320px;
            }
          }
        `}</style>

        <div className="field-ops-workspace">
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
                {selectedFieldJobId ? "Field Job Workspace" : "Field Job"}s
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  marginTop: 2,
                }}
              >
                Active Work
              </div>
            </div>

            <div
              className="field-job-rail"
              style={{
                display: "grid",
                gap: 8,
                padding: 8,
              }}
            >
              {liveFinalMeasurements.map((job) => (
                <button
                  key={`rail-final-${job.id}`}
                  type="button"
                  onClick={() => setSelectedFieldJobId(job.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border:
                      selectedFieldJobId === job.id
                        ? "1px solid #d4b569"
                        : "1px solid #4c4330",
                    borderLeft: "4px solid #d4b569",
                    borderRadius: 10,
                    background:
                      selectedFieldJobId === job.id
                        ? "#211e16"
                        : "#121518",
                    color: "#f5f7f5",
                    padding: 17,
                    cursor: "pointer",
                    minHeight: 118,
                  }}
                >
                  <div
                    style={{
                      color: "#d4b569",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Final Measurement
                  </div>

                  <strong style={{ fontSize: 16, lineHeight: 1.2 }}>
                    {job.first_name} {job.last_name}
                  </strong>

                  <div
                    style={{
                      color: "#87949e",
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {job.project_address}
                  </div>
                </button>
              ))}

              {liveInstallations.map((job) => (
                <button
                  key={`rail-install-${job.id}`}
                  type="button"
                  onClick={() => setSelectedFieldJobId(job.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border:
                      selectedFieldJobId === job.id
                        ? "1px solid #8fc59f"
                        : "1px solid #345140",
                    borderLeft: "4px solid #78aa88",
                    borderRadius: 10,
                    background:
                      selectedFieldJobId === job.id
                        ? "#17231b"
                        : "#101713",
                    color: "#f5f7f5",
                    padding: 17,
                    cursor: "pointer",
                    minHeight: 118,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        color: "#8fc59f",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      {job.current_stage === "installation_complete"
                        ? "Installation Complete"
                        : job.current_stage === "installation_ready"
                          ? "Installation Ready"
                          : pendingReturns[job.id] ? "Returned to Installer" : job.scheduled_for ? "Scheduled Install" : "Ready to Schedule"}
                    </div>

                    <span
                      style={{
                        color: "#9fd3ae",
                        fontSize: 10,
                        fontWeight: 900,
                      }}
                    >
                      {job.current_stage === "installation_complete"
                        ? job.next_action?.startsWith("RJ approved installation review.") ? "RJ APPROVED" : "INSPECTION PREP"
                        : job.current_stage === "installation_ready"
                          ? "WITH INSTALLER"
                          : pendingReturns[job.id] ? "NEEDS ATTENTION" : job.scheduled_for ? "SCHEDULED" : "PENDING"}
                    </span>
                  </div>

                  <strong
                    style={{
                      display: "block",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {job.first_name} {job.last_name}
                  </strong>

                  <div
                    style={{
                      color: "#87949e",
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: 1.35,
                    }}
                  >
                    {job.project_address}
                  </div>

                  <div
                    style={{
                      color: "#aeb9c1",
                      fontSize: 10,
                      marginTop: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    <div>{job.crew || "Crew not assigned"}</div>

                    <div>
                      {job.scheduled_for
                        ? new Date(job.scheduled_for).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Install date not set"}
                    </div>
                  </div>
                </button>
              ))}

              {liveInspections.map((job) => (
                <button
                  key={`rail-inspection-${job.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedFieldJobId(job.id);
                    setFieldIssueReports((current) => ({
                      ...current,
                      [job.id]: [],
                    }));
                    void loadFieldInstallerActivity(job.id);
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border:
                      selectedFieldJobId === job.id
                        ? "1px solid #b6a9c4"
                        : "1px solid #4b4652",
                    borderLeft: "4px solid #9f8fb0",
                    borderRadius: 10,
                    background:
                      selectedFieldJobId === job.id
                        ? "#201b24"
                        : "#151318",
                    color: "#f5f7f5",
                    padding: 17,
                    cursor: "pointer",
                    minHeight: 118,
                  }}
                >
                  <div
                    style={{
                      color: "#b6a9c4",
                      fontSize: 10,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {job.inspection_type === "Final Walkthrough" ? "Final Walkthrough" : "Inspection"}
                  </div>

                  <strong style={{ fontSize: 16, lineHeight: 1.2 }}>
                    {job.first_name} {job.last_name}
                  </strong>

                  <div
                    style={{
                      color: "#87949e",
                      fontSize: 12,
                      marginTop: 4,
                      lineHeight: 1.3,
                    }}
                  >
                    {job.project_address}
                  </div>
                </button>
              ))}

              {liveFinalMeasurements.length === 0 &&
              liveInstallations.length === 0 &&
              liveInspections.length === 0 ? (
                <div
                  style={{
                    color: "#69757e",
                    fontSize: 12,
                    padding: 17,
                  }}
                >
                  No active field jobs.
                </div>
              ) : null}
            </div>
          </aside>



          <div style={{ minWidth: 0 }}>
            {!selectedFieldJobId ? (
              <div
                style={{
                  minHeight: 250,
                  border: "1px dashed #31404a",
                  borderRadius: 14,
                  background: "#0d1217",
                  display: "grid",
                  placeItems: "center",
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      color: "#dbe2e7",
                      fontSize: 16,
                      fontWeight: 900,
                    }}
                  >
                    Select a field job
                  </div>

                  <div
                    style={{
                      color: "#798792",
                      fontSize: 11,
                      marginTop: 5,
                    }}
                  >
                    Choose a card from the left to open the workspace.
                  </div>
                </div>
              </div>
            ) : null}
        <section
          style={{
            display: selectedFieldJobId ? "block" : "none",
            position: fieldMonitoringDrawerOpen ? "fixed" : "static",
            top: fieldMonitoringDrawerOpen ? 0 : undefined,
            right: fieldMonitoringDrawerOpen ? 0 : undefined,
            bottom: fieldMonitoringDrawerOpen ? 0 : undefined,
            width: fieldMonitoringDrawerOpen ? "min(720px, 100vw)" : undefined,
            maxWidth: fieldMonitoringDrawerOpen ? "100vw" : undefined,
            height: fieldMonitoringDrawerOpen ? "100dvh" : undefined,
            overflowY: fieldMonitoringDrawerOpen ? "auto" : undefined,
            boxSizing: "border-box",
            zIndex: fieldMonitoringDrawerOpen ? 9600 : undefined,
            boxShadow: fieldMonitoringDrawerOpen
              ? "-20px 0 60px rgba(0,0,0,0.65)"
              : undefined,
            border: "1px solid #31495a",
            borderRadius: 16,
            background: "#0f151b",
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
              marginBottom: 12,
              paddingBottom: 10,
              borderBottom: "1px solid #26323a",
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
                }}
              >
                Field Workspace
              </div>

              <div
                style={{
                  color: "#f5f7f5",
                  fontSize: 16,
                  fontWeight: 900,
                  marginTop: 2,
                }}
              >
                {selectedFieldJobId ? "Field Job Workspace" : "Field Job"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFieldMonitoringDrawerOpen(false);
                setSelectedFieldJobId(null);
              }}
              style={{
                minHeight: 36,
                border: "1px solid #46545e",
                borderRadius: 9,
                background: "#151c22",
                color: "#d9e5ee",
                padding: "0 12px",
                fontSize: 11,
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Close Job
            </button>
          </div>
          <div
            style={{
              display: liveFinalMeasurements.some((job) => job.id === selectedFieldJobId) ? "flex" : "none",
              alignItems: "center",
              justifyContent: "space-between",
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
                Final Measurements
              </strong>
            </div>

            <span
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "#16232d",
                border: "1px solid #31495a",
                color: "#d9e5ee",
                fontSize: 12,
                fontWeight: 900,
              }}
            >
              {liveFinalMeasurements.length}
            </span>
          </div>

          {!liveFinalMeasurements.some((job) => job.id === selectedFieldJobId) ? null : liveFinalMeasurementsLoading ? (
            <div
              style={{
                color: "#8fa0ad",
                fontSize: 12,
                padding: "8px 0",
              }}
            >
              Loading final measurements...
            </div>
          ) : liveFinalMeasurements.length === 0 ? (
            <div
              style={{
                color: "#78858e",
                fontSize: 12,
                padding: "8px 0",
              }}
            >
              No final measurements assigned to Field Operations right now.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 9 }}>
              {liveFinalMeasurements.filter((job) => job.id === selectedFieldJobId).map((job) => (
                <div
                  key={job.id}
                  style={{
                    border: "1px solid #31495a",
                    borderRadius: 13,
                    background: "#111820",
                    padding: 12,
                  }}
                >
                    <FieldBeamComposer job={job} />

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
                        color: "#d8b267",
                        fontSize: 10,
                        fontWeight: 900,
                        textTransform: "uppercase",
                      }}
                    >
                      Final Measurement
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
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: "#d7dde2",
                    }}
                  >
                    <div>
                      <strong>Assigned To:</strong> {job.assigned_to}
                    </div>

                    <div>
                      <strong>Scheduled:</strong>{" "}
                      {job.scheduled_for
                        ? new Date(job.scheduled_for).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Not scheduled"}
                    </div>

                    {job.note ? (
                      <div>
                        <strong>Note:</strong> {job.note}
                      </div>
                    ) : null}
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
                    {job.next_action ||
                      "Complete final detailed measurement."}
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      if (activeFinalMeasureJobId === job.id) {
                        setActiveFinalMeasureJobId(null);
                        return;
                      }

                      setActiveFinalMeasureJobId(job.id);
                      setFinalOpeningLocation("");
                      setFinalOpeningWidth("");
                      setFinalOpeningHeight("");
                      setFinalOpeningNotes("");
                      await loadFinalMeasureOpenings(job.id);
                    }}
                    style={{
                      width: "100%",
                      minHeight: 46,
                      marginTop: 10,
                      borderRadius: 10,
                      border: "1px solid #58788e",
                      background: "#1a2a36",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {activeFinalMeasureJobId === job.id
                      ? "Close Final Measurement"
                      : "Open Final Measurement"}
                  </button>

                  {activeFinalMeasureJobId === job.id ? (
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        border: "1px solid #31495a",
                        borderRadius: 12,
                        background: "#0d1318",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 900,
                          color: "#9db7ca",
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                          marginBottom: 8,
                        }}
                      >
                        Final Detailed Measurements
                      </div>

                      {finalMeasureOpeningsLoading ? (
                        <div style={{ color: "#8fa0ad", fontSize: 12 }}>
                          Loading saved openings...
                        </div>
                      ) : finalMeasureOpenings.length > 0 ? (
                        <div style={{ display: "grid", gap: 7, marginBottom: 12 }}>
                          {finalMeasureOpenings.map((opening) => (
                            <div
                              key={opening.id}
                              style={{
                                border: "1px solid #26323a",
                                borderRadius: 9,
                                padding: 9,
                                background: "#111820",
                              }}
                            >
                              <strong style={{ fontSize: 12 }}>
                                Opening {opening.opening_number} {"\u00b7"}{" "}
                                {opening.opening_type}
                              </strong>

                              <div
                                style={{
                                  color: "#9ca8b2",
                                  fontSize: 11,
                                  marginTop: 3,
                                }}
                              >
                                {opening.location}
                              </div>

                              <div
                                style={{
                                  color: "#d9e5ee",
                                  fontSize: 13,
                                  fontWeight: 800,
                                  marginTop: 4,
                                }}
                              >
                                {opening.width_text} {"\u00d7"} {opening.height_text}
                              </div>

                              {opening.notes ? (
                                <div
                                  style={{
                                    color: "#8fa0ad",
                                    fontSize: 11,
                                    marginTop: 4,
                                  }}
                                >
                                  {opening.notes}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "#8fa0ad",
                            fontSize: 11,
                            marginBottom: 10,
                          }}
                        >
                          No final openings saved yet.
                        </div>
                      )}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 8,
                        }}
                      >
                        <select
                          value={finalOpeningType}
                          onChange={(event) => setFinalOpeningType(event.target.value)}
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        >
                          <option>Window</option>
                          <option>Door</option>
                          <option>Sliding Door</option>
                          <option>Other</option>
                        </select>

                        <input
                          value={finalOpeningLocation}
                          onChange={(event) =>
                            setFinalOpeningLocation(event.target.value)
                          }
                          placeholder="Location"
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        />

                        <input
                          value={finalOpeningWidth}
                          onChange={(event) => setFinalOpeningWidth(event.target.value)}
                          placeholder="Width"
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        />

                        <input
                          value={finalOpeningHeight}
                          onChange={(event) => setFinalOpeningHeight(event.target.value)}
                          placeholder="Height"
                          style={{
                            minHeight: 42,
                            borderRadius: 9,
                            border: "1px solid #31495a",
                            background: "#101820",
                            color: "#d9e5ee",
                            padding: "0 9px",
                          }}
                        />
                      </div>

                      <textarea
                        value={finalOpeningNotes}
                        onChange={(event) => setFinalOpeningNotes(event.target.value)}
                        placeholder="Notes"
                        rows={3}
                        style={{
                          width: "100%",
                          marginTop: 8,
                          borderRadius: 9,
                          border: "1px solid #31495a",
                          background: "#101820",
                          color: "#d9e5ee",
                          padding: 9,
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />

                      <button
                        type="button"
                        disabled={savingFinalOpening}
                        onClick={() => void saveFinalMeasureOpening(job.id)}
                        style={{
                          width: "100%",
                          minHeight: 46,
                          marginTop: 8,
                          borderRadius: 10,
                          border: "1px solid #6f91a7",
                          background: "#213543",
                          color: "#ffffff",
                          fontWeight: 900,
                          cursor: savingFinalOpening ? "wait" : "pointer",
                        }}
                      >
                        {savingFinalOpening
                          ? "Saving..."
                          : `Save Opening ${
                              finalMeasureOpenings.reduce(
                                (highest, opening) =>
                                  Math.max(
                                    highest,
                                    Number(opening.opening_number) || 0
                                  ),
                                0
                              ) + 1
                            }`}
                      </button>
                    </div>
                  ) : null}

                  <div style={{marginTop:10,padding:10,border:'1px solid #31495a',borderRadius:10,color:'#b7c9d7',fontSize:12}}>Final Measurement completion belongs to the assigned salesperson. Office reviews it before releasing the job to RJ.</div>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: liveInstallations.some((job) => job.id === selectedFieldJobId)
                ? "block"
                : "none",
              borderTop: "1px solid #26323a",
              marginTop: 14,
              paddingTop: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <strong style={{ fontSize: 16 }}>
                {liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage ===
                "installation_complete"
                  ? "Installation Complete"
                  : liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage === "installation_in_progress"
                    ? "Installation In Progress"
                    : liveInstallations.find((job) => job.id === selectedFieldJobId)?.current_stage === "installation_ready"
                      ? "Installation Ready"
                      : "Scheduled Installation"}
              </strong>
              <span style={{ fontSize: 12, fontWeight: 900, color: "#d9e5ee" }}>
                {liveInstallations.some((job) => job.id === selectedFieldJobId) ? 1 : 0}
              </span>
            </div>

            {liveInstallationsLoading ? (
              <div style={{ color: "#8fa0ad", fontSize: 12 }}>Loading scheduled installations...</div>
            ) : !liveInstallations.some((job) => job.id === selectedFieldJobId) ? (
              <div style={{ color: "#78858e", fontSize: 12 }}>No scheduled installations right now.</div>
            ) : (
              <div style={{ display: "grid", gap: 9 }}>
                {liveInstallations.filter((job) => job.id === selectedFieldJobId).map((job) => (
                  <div
  key={job.id}
  style={{
    border: (() => {
      const unread = (rjReadinessEvents[job.id] ?? []).filter((event) => !event.acknowledged_at);
      if (!unread.length) return "1px solid #557c64";
      return unread.some((event) => event.signal_type === "attention")
        ? "3px solid #d49b40"
        : "3px solid #3fbf79";
    })(),
    boxShadow: (() => {
      const unread = (rjReadinessEvents[job.id] ?? []).filter((event) => !event.acknowledged_at);
      if (!unread.length) return "none";
      return unread.some((event) => event.signal_type === "attention")
        ? "0 0 0 3px rgba(212,155,64,0.20)"
        : "0 0 0 3px rgba(63,191,121,0.20)";
    })(),
    borderRadius: 13,
    background: "#111820",
    padding: 12,
  }}
>
                    {(rjReadinessEvents[job.id] ?? []).filter((event) => !event.acknowledged_at).length > 0 ? (
                      <div style={{ display: "grid", gap: 8, marginBottom: 12 }} aria-label="New Office readiness updates">
                        {(rjReadinessEvents[job.id] ?? []).filter((event) => !event.acknowledged_at).slice(0, 5).map((event) => (
                          <div key={event.event_id} style={{ border: `1px solid ${event.signal_type === "attention" ? "#be8c3e" : "#45996b"}`, background: event.signal_type === "attention" ? "#322615" : "#102b1e", borderRadius: 10, padding: 11, display: "grid", gap: 6 }}>
                            <div style={{ fontWeight: 900, color: event.signal_type === "attention" ? "#f3cf91" : "#a9ecc3", fontSize: 12 }}>
                              {event.signal_type === "attention" ? "New issue · Needs attention" : "New positive Office update"}
                            </div>
                            <div style={{ fontSize: 12, color: "#f2f5f7" }}>{event.event_message}</div>
                            <div style={{ fontSize: 11, color: "#b8c7cf" }}>
                              {event.created_by_name || "Office"}{event.created_at ? ` · ${new Date(event.created_at).toLocaleString()}` : ""}
                            </div>
                            <button
                              type="button"
                              disabled={rjReadinessAckSaving === event.event_id}
                              onClick={() => void acknowledgeRjReadinessEvent(job.id, event.event_id)}
                              style={{ justifySelf: "start", minHeight: 36, borderRadius: 8, padding: "7px 12px", border: "1px solid #77949e", background: "#1e3440", color: "#fff", fontWeight: 800, cursor: "pointer" }}
                            >
                              {rjReadinessAckSaving === event.event_id ? "Acknowledging..." : "I've Seen This"}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {rjReadinessError[job.id] && rjReadinessError[job.id] !== "Readiness notifications unavailable" ? (
                      <div role="alert" style={{ color: "#f1c58a", fontSize: 11, marginBottom: 8 }}>{rjReadinessError[job.id]}</div>
                    ) : null}                    <FieldBeamComposer job={job} />

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                      <strong>{job.first_name} {job.last_name}</strong>
                      <span
                        style={{
                          color: "#b7dec4",
                          fontSize: 10,
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      >
                        {job.current_stage === "installation_complete"
                          ? job.next_action?.startsWith("RJ approved installation review.") ? "Approved - Office Follow-up" : "Inspection Prep"
                          : job.current_stage === "installation_in_progress"
                            ? "Installation In Progress"
                            : job.current_stage === "installation_ready"
                              ? "Installation Ready"
                              : job.scheduled_for ? "Scheduled" : job.next_action?.startsWith("RJ install plan:") ? "Pending Coordination" : "Ready to Schedule"}
                      </span>
                    </div>
                    <div style={{ color: "#9ca8b2", fontSize: 12, marginBottom: 8 }}>{job.project_address}</div>
                    {pendingReturns[job.id] ? (
                      <div role="status" style={{marginBottom:12,padding:11,border:'1px solid #cead64',borderRadius:10,background:'#32291c',color:'#ffe2a0'}}>
                        <strong>RETURNED TO INSTALLER · NEEDS ATTENTION</strong>
                        <div style={{marginTop:6,fontSize:12,whiteSpace:'pre-wrap'}}>{pendingReturns[job.id].reason}</div>
                      </div>
                    ) : null}
                    {job.current_stage === "installation_complete" && job.next_action?.startsWith("RJ approved installation review.") ? (
                      <div role="status" style={{ border: "1px solid #59846b", borderRadius: 11, background: "#12231b", padding: 12, marginBottom: 12, color: "#d6f3e0", display: "grid", gap: 5 }}>
                        <strong>Installation Approved by RJ</strong>
                        <span style={{ fontSize: 12 }}>{job.next_action}</span>
                      </div>
                    ) : job.current_stage === "installation_complete" ? (
                      <section style={{ border: "1px solid #59846b", borderRadius: 11, background: "#12231b", padding: 12, marginBottom: 12, display: "grid", gap: 9 }}>
                        <strong style={{ color: "#d6f3e0", fontSize: 14 }}>Review Installation</strong>
                        <div style={{ color: "#b8d1c1", fontSize: 12 }}>Review installer proof, notes, and issue resolutions before deciding.</div>
                        <button type="button" onClick={() => {
                          setFieldInstallerActivityJobId(job.id);
                          void loadFieldInstallerActivity(job.id);
                        }} style={{ minHeight: 38, border: "1px solid #477b60", borderRadius: 8, background: "#183927", color: "#ffffff", fontWeight: 800 }}>
                          Installer's Work Summary
                        </button>
                        {installationReviewLoading === job.id ? <span style={{ fontSize: 12 }}>Loading reported issues...</span> : null}
                        {installationReviewErrors[job.id] ? <span role="alert" style={{ color: "#ffd19d", fontSize: 12 }}>{installationReviewErrors[job.id]}</span> : null}
                        {Object.prototype.hasOwnProperty.call(installationReviewReports, job.id) ? (
                          <div style={{ display: "grid", gap: 5, borderRadius: 8, background: "#101b18", padding: 10 }}>
                            <strong style={{ fontSize: 12 }}>Reported Issues ({(installationReviewReports[job.id] ?? []).filter((r: any) => !["resolved", "duplicate"].includes(r.resolution_status)).length} open)</strong>
                            {(installationReviewReports[job.id] ?? []).length > 0 ? (
                              <div style={{ fontSize: 11, color: "#b8d1c1" }}>
                                {(installationReviewReports[job.id] ?? []).filter((r: any) => r.resolution_status === "resolved").length} verified resolved · {(installationReviewReports[job.id] ?? []).filter((r: any) => r.resolution_status === "duplicate").length} closed as duplicate
                              </div>
                            ) : null}
                            {(installationReviewReports[job.id] ?? []).filter((r: any) => !["resolved", "duplicate"].includes(r.resolution_status)).map((r: any) => (
                              <div key={r.id} style={{ fontSize: 11, color: "#e0e8e2", overflowWrap: "anywhere" }}>
                                {(r.categories ?? []).join(", ")}: {r.details}
                              </div>
                            ))}
                            {(installationReviewReports[job.id] ?? []).filter((r: any) => !["resolved", "duplicate"].includes(r.resolution_status)).length === 0 ? <span style={{ fontSize: 11, color: "#b8d1c1" }}>No unresolved issues. All reports remain in the job history.</span> : null}
                          </div>
                        ) : null}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))", gap: 8 }}>
                          <button type="button" disabled={installationReviewSaving || installationReviewLoading === job.id || !installationReviewReports[job.id] || Boolean(installationReviewErrors[job.id])} onClick={() => void submitInstallationReview(job.id, "approved")} style={{ minHeight: 44, borderRadius: 9, border: "1px solid #80b495", background: "#276443", color: "white", fontWeight: 900, opacity: installationReviewSaving ? .5 : 1 }}>Approve Installation</button>
                          <button type="button" onClick={() => { setInstallationReturnOpen((v) => !v); setInstallationReviewErrors((current) => ({ ...current, [job.id]: "" })); }} style={{ minHeight: 44, borderRadius: 9, border: "1px solid #7b8790", background: "#21303a", color: "white", fontWeight: 900 }}>Send Back to Installer</button>
                        </div>
                        {installationReturnOpen ? <div style={{ display: "grid", gap: 7 }}>
                          <label style={{ fontSize: 12 }}>Reason for installer</label>
                          <textarea rows={2} maxLength={1500} value={installationReturnReason} onChange={(e) => setInstallationReturnReason(e.target.value)} placeholder="What needs correcting?" style={{ background: "#0e171b", color: "white", border: "1px solid #566d75", borderRadius: 8, padding: 10, width: "100%", boxSizing: "border-box" }} />
                          <button type="button" disabled={installationReviewSaving || installationReviewLoading === job.id || !installationReviewReports[job.id] || Boolean(installationReviewErrors[job.id])} onClick={() => void submitInstallationReview(job.id, "returned")} style={{ minHeight: 42, borderRadius: 8, border: "1px solid #a6b3bb", background: "#304652", color: "white", fontWeight: 900 }}>Confirm Return to Installer</button>
                        </div> : null}
                      </section>
                    ) : null}
                    {job.current_stage === "scheduled" ? (
                      <div style={{ border: "1px solid #668b78", borderRadius: 12, background: "#13251d", padding: 13, marginBottom: 12, display: "grid", gap: 9 }}>
                        <strong style={{ color: "#e1f4e6", fontSize: 14 }}>RJ's Next Steps</strong>
                        <div style={{ color: "#c7e5d0", fontSize: 12 }}>1. Review Job File. Check measurements, photos, and job details.</div>
                        <button
                          type="button"
                          onClick={() => {
                            setFieldJobFileOpenId(job.id);
                            void loadFieldJobDocuments(job.id);
                            window.setTimeout(() => {
                              document.getElementById(`premier-field-job-file-${job.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 0);
                          }}
                          style={{ minHeight: 44, padding: "10px 14px", borderRadius: 9, border: "1px solid #86b99b", background: "#24543b", color: "#ffffff", fontWeight: 900, cursor: "pointer", textAlign: "left" }}
                        >
                          Review Job File
                        </button>
                        <div style={{ color: "#c7e5d0", fontSize: 12 }}>2. {rjInstallReady[job.id] === true ? "Job Ready" : "Waiting for Readiness"}</div>
                        <div style={{ border: "1px solid #547760", borderRadius: 9, padding: 10, display: "grid", gap: 5, background: "#102017" }}>
                          <div style={{ color: "#e1f4e6", fontWeight: 800, fontSize: 12 }}>{rjInstallReady[job.id] === true ? "Office Approved" : "Readiness Pending"}</div>
                          <div style={{ color: "#c7e5d0", fontSize: 12 }}>Materials: {job.material_status || "Unknown / Not confirmed"}</div>
                          <div style={{ color: "#c7e5d0", fontSize: 12 }}>Permit: {job.permit_status || "Unknown / Not confirmed"}</div>
                          <div style={{ color: "#e9cf98", fontSize: 11 }}>{rjInstallReady[job.id] === true ? "Ready for scheduling." : "Office approval and installer assignment required."}</div>
                        </div>
                        <div style={{ color: "#c7e5d0", fontSize: 12 }}>3. Schedule Installation</div>
                        <div style={{ color: "#a9c4b5", fontSize: 11 }}>Confirm the date with the customer, assign an installer, and schedule.</div>
                      </div>
                    ) : null}

                                        <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <button
                        type="button"
                        disabled={!job.phone}
                        onClick={() => {
                          if (!job.phone) return;
                          window.location.href = `tel:${job.phone}`;
                        }}
                        style={{
                          minHeight: 44,
                          border: "1px solid #6f9fbd",
                          borderRadius: 10,
                          background: "#162630",
                          color: "#ffffff",
                          fontWeight: 900,
                          fontSize: 13,
                          cursor: job.phone ? "pointer" : "not-allowed",
                          boxShadow:
                            "0 0 0 1px rgba(111,159,189,0.10), 0 0 12px rgba(111,159,189,0.08)",
                        }}
                      >
                        Call Customer
                      </button>

                      <button
                        type="button"
                        disabled={!job.project_address}
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
                        style={{
                          minHeight: 44,
                          border: "1px solid #6f9fbd",
                          borderRadius: 10,
                          background: "#162630",
                          color: "#ffffff",
                          fontWeight: 900,
                          fontSize: 13,
                          cursor: job.project_address
                            ? "pointer"
                            : "not-allowed",
                          boxShadow:
                            "0 0 0 1px rgba(111,159,189,0.10), 0 0 12px rgba(111,159,189,0.08)",
                        }}
                      >
                        Navigation
                      </button>
                    </div>
<div style={{ display: "grid", gap: 4, fontSize: 12, color: "#d7dde2" }}>
                      <div style={{ display: "grid", gap: 6 }}>
                        <strong>Assigned Installer / Crew:</strong>
                        {job.crew ? (
                          <button
                            type="button"
                            onClick={async () => {
                              if (fieldInstallerActivityJobId === job.id) {
                                setFieldInstallerActivityJobId(null);
                                return;
                              }

                              setFieldInstallerActivityJobId(job.id);
                              await loadFieldInstallerActivity(job.id);
                            }}
                            style={{
                              justifySelf: "start",
                              minHeight: 34,
                              padding: "6px 12px",
                              border: "1px solid #6f9fbd",
                              borderRadius: 999,
                              background: "#162630",
                              color: "#ffffff",
                              fontWeight: 900,
                              fontSize: 11,
                              cursor: "pointer",
                              boxShadow:
                                "0 0 0 1px rgba(111,159,189,0.10), 0 0 10px rgba(111,159,189,0.08)",
                            }}
                          >
                            {fieldInstallerActivityJobId === job.id
                              ? `Close ${job.crew} Activity`
                              : `${job.crew} - View Activity`}
                          </button>
                        ) : (
                          <div
                            style={{
                              color: "#8fa9bc",
                              fontSize: 11,
                            }}
                          >
                            No installer assigned yet.
                          </div>
                        )}
                        {job.current_stage !== "installation_complete" ? (<>
                        <select
                          value={crewDrafts[job.id] ?? job.crew ?? ""}
                          disabled={crewSavingJobId === job.id}
                          onChange={async (event) => {
                            const nextCrew = event.target.value;
                            if (!nextCrew || nextCrew === job.crew) return;

                            const previousCrew = job.crew || "";
                            const accessToken =
                              getPremierFieldAccessToken();

                            setCrewDrafts((current) => ({
                              ...current,
                              [job.id]: nextCrew,
                            }));

                            // On the first Office-to-RJ handoff, crew and date are
                            // committed together by save_premier_install_schedule.
                            // reassign_premier_install_crew does not accept production_setup.
                            if (job.current_stage === "production_setup") return;

                            setCrewSaveErrors((current) => ({
                              ...current,
                              [job.id]: "",
                            }));

                            if (!accessToken) {
                              setCrewDrafts((current) => ({
                                ...current,
                                [job.id]: previousCrew,
                              }));
                              setCrewSaveErrors((current) => ({
                                ...current,
                                [job.id]: "Premier staff access is missing.",
                              }));
                              return;
                            }

                            setCrewSavingJobId(job.id);

                            const { data, error } = await supabase.rpc(
                              "reassign_premier_install_crew",
                              {
                                p_access_token: accessToken,
                                p_job_id: job.id,
                                p_crew: nextCrew,
                              }
                            );

                            if (error || data !== true) {
                              console.error("Premier field crew reassignment failed:", error);

                              setCrewDrafts((current) => ({
                                ...current,
                                [job.id]: previousCrew,
                              }));

                              setCrewSaveErrors((current) => ({
                                ...current,
                                [job.id]: "Could not reassign crew.",
                              }));

                              setCrewSavingJobId(null);
                              return;
                            }

                            setLiveInstallations((current) =>
                              current.map((item) =>
                                item.id === job.id
                                  ? { ...item, crew: nextCrew }
                                  : item
                              )
                            );

                            setCrewDrafts((current) => {
                              const next = { ...current };
                              delete next[job.id];
                              return next;
                            });

                            setCrewSavingJobId(null);
                          }}
                          style={{
                            width: "100%",
                            minHeight: 42,
                            border: "1px solid #31495a",
                            borderRadius: 9,
                            background: "#0c1116",
                            color: "#f3f6f8",
                            padding: "0 10px",
                            fontWeight: 700,
                          }}
                        >
                          <option value="">Choose crew</option>
                          <option value="RJ">RJ</option>
                          <option value={"Exquisite Windows & Doors \u2014 Angel"}>{"Exquisite Windows & Doors \u2014 Angel"}</option>
                          <option value={"Riveras Impact Windows and Doors \u2014 Jose"}>{"Riveras Impact Windows and Doors \u2014 Jose"}</option>
                          <option value={"OGR Windows and Doors \u2014 Obelio"}>{"OGR Windows and Doors \u2014 Obelio"}</option>
                          <option value={"Elite Impact Solutions \u2014 Joseph"}>{"Elite Impact Solutions \u2014 Joseph"}</option>
                        </select>

                        {crewSavingJobId === job.id ? (
                          <span style={{ color: "#8fa9bc", fontSize: 11 }}>
                            Saving crew assignment...
                          </span>
                        ) : crewSaveErrors[job.id] ? (
                          <span style={{ color: "#d8a0a0", fontSize: 11 }}>
                            {crewSaveErrors[job.id]}
                          </span>
                        ) : null}
                        </>) : null}
                      </div>

                      {fieldInstallerActivityJobId === job.id ? (
                        <div
                          style={{
                            border: "1px solid #31495a",
                            borderRadius: 10,
                            background: "#0d1318",
                            padding: 10,
                            marginTop: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 10,
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  color: "#f3f6f8",
                                  fontSize: 12,
                                  fontWeight: 900,
                                }}
                              >
                                Installer Activity
                              </div>

                              <div
                                style={{
                                  color: "#8fa9bc",
                                  fontSize: 10,
                                  marginTop: 2,
                                }}
                              >
                                {job.crew}
                              </div>
                            </div>

                            <span
                              style={{
                                color: "#b7dec4",
                                fontSize: 10,
                                fontWeight: 900,
                                textTransform: "uppercase",
                              }}
                            >
                              {job.current_stage === "installation_complete"
                                ? "Complete"
                                : job.current_stage === "scheduled"
                                  ? "Scheduled"
                                  : "Installation Ready"}
                            </span>
                          </div>

                          {fieldInstallerProofLoading[job.id] ? (
                            <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                              Loading installer activity...
                            </div>
                          ) : fieldInstallerProofErrors[job.id] ? (
                            <div style={{ color: "#d8a0a0", fontSize: 11 }}>
                              {fieldInstallerProofErrors[job.id]}
                            </div>
                          ) : (
                            <>
                              

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                  gap: 8,
                                  marginBottom: 10,
                                }}
                              >
                                <div
                                  style={{
                                    border: "1px solid #26323a",
                                    borderRadius: 8,
                                    background: "#111820",
                                    padding: 9,
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#8fa9bc",
                                      fontSize: 9,
                                      fontWeight: 900,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Proof Photos
                                  </div>

                                  <div
                                    style={{
                                      color: "#f3f6f8",
                                      fontSize: 18,
                                      fontWeight: 900,
                                      marginTop: 3,
                                    }}
                                  >
                                    {(fieldInstallerProofPhotos[job.id] ?? []).length}
                                  </div>
                                </div>

                                <div
                                  style={{
                                    border: "1px solid #26323a",
                                    borderRadius: 8,
                                    background: "#111820",
                                    padding: 9,
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#8fa9bc",
                                      fontSize: 9,
                                      fontWeight: 900,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Buck Inspection
                                  </div>

                                  <div
                                    style={{
                                      color: (fieldInstallerProofPhotos[job.id] ?? []).some(
                                        (photo: any) =>
                                          photo.proof_type ===
                                          "Bucking / buck inspection"
                                      )
                                        ? "#b7dec4"
                                        : "#d7b47a",
                                      fontSize: 12,
                                      fontWeight: 900,
                                      marginTop: 5,
                                    }}
                                  >
                                    {(fieldInstallerProofPhotos[job.id] ?? []).some(
                                      (photo: any) =>
                                        photo.proof_type ===
                                        "Bucking / buck inspection"
                                    )
                                      ? "Received"
                                      : "Not received"}
                                  </div>
                                </div>
                              </div>

                              {(fieldIssueReports[job.id] ?? []).length > 0 ? (
                                <div
                                  style={{
                                    border: "1px solid #8a5f4a",
                                    borderRadius: 10,
                                    background: "#211713",
                                    padding: 12,
                                    marginBottom: 12,
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#efb39a",
                                      fontSize: 12,
                                      fontWeight: 900,
                                      marginBottom: 10,
                                    }}
                                  >
                                    Reported Issues ({fieldIssueReports[job.id].length})
                                    {fieldFollowupsErrors[job.id] ? <div role="alert" style={{fontSize:10,color:'#ffc7a3'}}>{fieldFollowupsErrors[job.id]}</div> : null}
                                  </div>

                                  <div style={{ display: "grid", gap: 10 }}>
                                    {fieldIssueReports[job.id].map((report) => (
                                      <div
                                        key={report.id}
                                        style={{
                                          border: "1px solid #65483b",
                                          borderRadius: 8,
                                          padding: 10,
                                          background: "#172027",
                                        }}
                                      >
                                        <div
                                          style={{
                                            color: "#ffffff",
                                            fontSize: 12,
                                            fontWeight: 900,
                                          }}
                                        >
                                          {(report.categories ?? []).join(", ")}
                                        </div>

                                        <div
                                          style={{
                                            color: "#b9c6ce",
                                            fontSize: 10,
                                            marginTop: 5,
                                          }}
                                        >
                                          Reported by{" "}
                                          {report.reporter_label.split(":").pop() ||
                                            report.reporter_label}
                                          {" • "}
                                          {new Date(report.reported_at).toLocaleString()}
                                        </div>

                                        {report.details ? (
                                          <div
                                            style={{
                                              color: "#f0d8c8",
                                              fontSize: 11,
                                              lineHeight: 1.5,
                                              marginTop: 8,
                                              whiteSpace: "pre-wrap",
                                            }}
                                          >
                                            {report.details}
                                        {renderFieldFollowup(report.job_id ?? job.id, report.id)}
                                        <PremierFieldIssueReview issueId={report.id} jobId={job.id} issues={fieldIssueReports[job.id] ?? []} followups={fieldIssueFollowups[job.id] ?? []} onSaved={async()=>{await loadFieldInstallerActivity(job.id)}} />
                                          </div>
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              {(fieldInstallerProofPhotos[job.id] ?? []).some(
                                (photo: any) => photo.needs_attention
                              ) ? (
                                <div
                                  style={{
                                    border: "1px solid #8a5f4a",
                                    borderRadius: 8,
                                    background: "#211713",
                                    color: "#efb39a",
                                    padding: "9px 10px",
                                    fontSize: 11,
                                    fontWeight: 900,
                                    marginBottom: 10,
                                  }}
                                >
                                  NEEDS ATTENTION — installer flagged a field issue.
                                </div>
                              ) : null}

                              {(fieldInstallerProofPhotos[job.id] ?? []).length === 0 ? (
                                <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                                  No installer proof has been submitted yet.
                                </div>
                              ) : (
                                <div style={{ display: "grid", gap: 8 }}>
                                  {(fieldInstallerProofPhotos[job.id] ?? []).map(
                                    (photo: any, index: number) => (
                                      <div
                                        key={
                                          photo.id ??
                                          photo.storage_path ??
                                          `${job.id}-field-proof-${index}`
                                        }
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns:
                                            "92px minmax(0, 1fr)",
                                          gap: 10,
                                          border: "1px solid #26323a",
                                          borderRadius: 9,
                                          background: "#111820",
                                          padding: 9,
                                        }}
                                      >
                                        {photo.url ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              window.open(
                                                photo.url,
                                                "_blank",
                                                "noopener,noreferrer"
                                              )
                                            }
                                            style={{
                                              width: 92,
                                              height: 76,
                                              border: "1px solid #31495a",
                                              borderRadius: 8,
                                              overflow: "hidden",
                                              padding: 0,
                                              background: "#0a0f13",
                                              cursor: "pointer",
                                            }}
                                          >
                                            <img
                                              src={photo.url}
                                              alt={
                                                photo.file_name ||
                                                "Installer proof"
                                              }
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                display: "block",
                                              }}
                                            />
                                          </button>
                                        ) : (
                                          <div
                                            style={{
                                              width: 92,
                                              height: 76,
                                              border: "1px solid #31495a",
                                              borderRadius: 8,
                                              display: "grid",
                                              placeItems: "center",
                                              color: "#8fa9bc",
                                              fontSize: 10,
                                              textAlign: "center",
                                            }}
                                          >
                                            Photo unavailable
                                          </div>
                                        )}

                                        <div style={{ minWidth: 0 }}>
                                          <div
                                            style={{
                                              color: "#f3f6f8",
                                              fontSize: 11,
                                              fontWeight: 900,
                                            }}
                                          >
                                            {photo.proof_type || "Installer Proof"}
                                          </div>

                                          <div
                                            style={{
                                              color: "#9ca8b2",
                                              fontSize: 10,
                                              marginTop: 3,
                                              overflowWrap: "anywhere",
                                            }}
                                          >
                                            {photo.file_name || `Photo ${index + 1}`}
                                          </div>

                                          {photo.uploaded_at ? (
                                            <div
                                              style={{
                                                color: "#72838f",
                                                fontSize: 9,
                                                marginTop: 3,
                                              }}
                                            >
                                              {new Date(
                                                photo.uploaded_at
                                              ).toLocaleString()}
                                            </div>
                                          ) : null}

                                          {photo.bucking_notes ? (
                                            <div
                                              style={{
                                                marginTop: 7,
                                                color: "#d7dde2",
                                                fontSize: 10,
                                              }}
                                            >
                                              <strong>Bucking:</strong>{" "}
                                              {photo.bucking_notes}
                                            </div>
                                          ) : null}

                                          {photo.measurement_notes ? (
                                            <div
                                              style={{
                                                marginTop: 4,
                                                color: "#d7dde2",
                                                fontSize: 10,
                                              }}
                                            >
                                              <strong>Measurements:</strong>{" "}
                                              {photo.measurement_notes}
                                            </div>
                                          ) : null}

                                          {photo.material_issue_notes ? (
                                            <div
                                              style={{
                                                marginTop: 4,
                                                color: "#efb39a",
                                                fontSize: 10,
                                              }}
                                            >
                                              <strong>Material Issue:</strong>{" "}
                                              {photo.material_issue_notes}
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : null}
                      {job.current_stage !== "installation_complete" ? (
                      <details open={job.current_stage !== "installation_ready"} style={{ marginTop: 8, border: "1px solid #31495a", borderRadius: 10, background: "#0c1116" }}>
                        <summary style={{ cursor: "pointer", padding: 12, fontSize: 12, fontWeight: 900, color: "#f3f6f8" }}>
                          {job.current_stage === "installation_ready" ? "Installation Ready" : job.scheduled_for ? "Installation Scheduled - View" : "Assign & Schedule Installation"}
                        </summary>
                      <div
                        style={{
                          marginTop: 8,
                          border: "1px solid #31495a",
                          borderRadius: 10,
                          background: "#0c1116",
                          padding: 10,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 900,
                            color: "#f3f6f8",
                            marginBottom: 7,
                          }}
                        >
                          Install Schedule
                        </div>

                        {job.current_stage === "installation_ready" && !job.scheduled_for ? (
                          <div style={{ color: "#e9cf98", fontSize: 11, padding: "8px 0" }}>
                            {rjInstallReady[job.id] === true ? "Office requirements verified. Installer assigned. Confirm the installation date and time with the customer, then click Schedule Install." : "Scheduling is locked until Office verifies the job requirements and an installer is assigned. Check the readiness status before scheduling."}
                          </div>
                        ) : null}

                        <div
                          style={{
                            color: "#9ca8b2",
                            fontSize: 11,
                            marginBottom: 8,
                          }}
                        >
                          {job.scheduled_for
                            ? `Currently: ${new Date(job.scheduled_for).toLocaleString()}`
                            : "No installation date scheduled yet."}
                        </div>

                        <label style={{ display: "grid", gap: 6, marginBottom: 12, color: "#dfebf5", fontSize: 12, fontWeight: 800 }}>
                          How should installation be scheduled?
                          <select
                            value={installScheduleModes[job.id] ?? (job.next_action?.startsWith("RJ install plan:") ? (job.next_action.includes("Morning Window") ? "morning" : job.next_action.includes("Afternoon Window") ? "afternoon" : "coordinate") : "specific")}
                            onChange={(event) => setInstallScheduleModes((current) => ({...current, [job.id]: event.target.value}))}
                            disabled={installScheduleSavingJobId === job.id}
                            style={{ minHeight: 44, border: "1px solid #6f9fbd", borderRadius: 9, background: "#162630", color: "white", padding: "0 10px" }}
                          >
                            <option value="coordinate">Coordinate Date With Customer — Pending</option>
                            <option value="morning">Morning Window — Proposed</option>
                            <option value="afternoon">Afternoon Window — Proposed</option>
                            <option value="specific">Specific Time — Confirmed With Customer</option>
                          </select>
                        </label>
                        {job.next_action?.startsWith("RJ install plan:") && !job.scheduled_for ? (
                          <div style={{ color: "#e9cf98", fontSize: 12, marginBottom: 10 }} role="status">
                            {job.next_action.replace("RJ install plan:", "Saved — ")}
                          </div>
                        ) : null}
                                                <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0, 1fr) auto",
                            gap: 8,
                          }}
                        >
                          {(installScheduleModes[job.id] ?? (job.next_action?.includes("Morning Window") ? "morning" : job.next_action?.includes("Afternoon Window") ? "afternoon" : job.next_action?.startsWith("RJ install plan:") ? "coordinate" : "specific")) !== "coordinate" ? (
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                              gap: 8,
                            }}
                          >
                            <div style={{ display: "grid", gap: 5 }}>
                              <label
                                style={{
                                  color: "#8fa9bc",
                                  fontSize: 10,
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Install Date
                              </label>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(0, 1fr) 46px",
                                  gap: 6,
                                }}
                              >
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  placeholder="MM/DD/YYYY"
                                  value={
                                    installDateTextDrafts[job.id] ??
                                    formatInstallDateText(
                                      installScheduleDrafts[job.id] ?? ""
                                    )
                                  }
                                  disabled={
                                    installScheduleSavingJobId === job.id
                                  }
                                  onChange={(event) => {
                                    const digits = event.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 8);

                                    let value = digits;

                                    if (digits.length > 4) {
                                      value = `${digits.slice(0, 2)}/${digits.slice(
                                        2,
                                        4
                                      )}/${digits.slice(4)}`;
                                    } else if (digits.length > 2) {
                                      value = `${digits.slice(0, 2)}/${digits.slice(
                                        2
                                      )}`;
                                    }

                                    setInstallDateTextDrafts((current) => ({
                                      ...current,
                                      [job.id]: value,
                                    }));

                                    const parsedDate =
                                      parseInstallDateText(value);

                                    if (parsedDate) {
                                      const currentDraft =
                                        installScheduleDrafts[job.id] ?? "";

                                      const currentTime =
                                        currentDraft.includes("T")
                                          ? currentDraft.split("T")[1] ?? ""
                                          : "";

                                      setInstallScheduleDrafts((current) => ({
                                        ...current,
                                        [job.id]: currentTime
                                          ? `${parsedDate}T${currentTime}`
                                          : parsedDate,
                                      }));
                                    }

                                    setInstallScheduleErrors((current) => ({
                                      ...current,
                                      [job.id]: "",
                                    }));
                                  }}
                                  style={{
                                    width: "100%",
                                    minHeight: 42,
                                    boxSizing: "border-box",
                                    border: "1px solid #31495a",
                                    borderRadius: 9,
                                    background: "#0a0f13",
                                    color: "#f3f6f8",
                                    padding: "0 10px",
                                    fontWeight: 700,
                                  }}
                                />

                                <button
                                  type="button"
                                  aria-label="Open install date calendar"
                                  onClick={() => {
                                    const picker = document.getElementById(
                                      `premier-install-date-${job.id}`
                                    ) as HTMLInputElement | null;

                                    if (!picker) return;

                                    if (typeof picker.showPicker === "function") {
                                      picker.showPicker();
                                    } else {
                                      picker.click();
                                    }
                                  }}
                                  style={{
                                    minHeight: 42,
                                    border: "1px solid #6f9fbd",
                                    borderRadius: 9,
                                    background: "#162630",
                                    color: "#ffffff",
                                    fontSize: 18,
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>
                                </button>

                                <input
                                  id={`premier-install-date-${job.id}`}
                                  type="date"
                                  tabIndex={-1}
                                  value={
                                    parseInstallDateText(
                                      installDateTextDrafts[job.id] ??
                                        formatInstallDateText(
                                          installScheduleDrafts[job.id] ?? ""
                                        )
                                    ) ?? ""
                                  }
                                  onChange={(event) => {
                                    const parsedDate = event.target.value;

                                    if (!parsedDate) return;

                                    const [year, month, day] =
                                      parsedDate.split("-");

                                    setInstallDateTextDrafts((current) => ({
                                      ...current,
                                      [job.id]: `${month}/${day}/${year}`,
                                    }));

                                    const currentDraft =
                                      installScheduleDrafts[job.id] ?? "";

                                    const currentTime =
                                      currentDraft.includes("T")
                                        ? currentDraft.split("T")[1] ?? ""
                                        : "";

                                    setInstallScheduleDrafts((current) => ({
                                      ...current,
                                      [job.id]: currentTime
                                        ? `${parsedDate}T${currentTime}`
                                        : parsedDate,
                                    }));
                                  }}
                                  style={{
                                    position: "absolute",
                                    width: 1,
                                    height: 1,
                                    opacity: 0,
                                    pointerEvents: "none",
                                  }}
                                />
                              </div>
                            </div>

                            <div style={{ display: (installScheduleModes[job.id] ?? "specific") === "specific" ? "grid" : "none", gap: 5 }}>
                              <label
                                style={{
                                  color: "#8fa9bc",
                                  fontSize: 10,
                                  fontWeight: 900,
                                  textTransform: "uppercase",
                                }}
                              >
                                Install Time
                              </label>

                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "minmax(0, 1fr) 46px",
                                  gap: 6,
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="8:05 AM"
                                  value={
                                    installTimeTextDrafts[job.id] ??
                                    formatInstallTimeText(
                                      installScheduleDrafts[job.id] ?? ""
                                    )
                                  }
                                  disabled={
                                    installScheduleSavingJobId === job.id
                                  }
                                  onChange={(event) => {
                                    const raw = event.target.value.toUpperCase();

                                    const periodKey = raw
                                      .replace(/[^AP]/g, "")
                                      .slice(-1);

                                    const digits = raw
                                      .replace(/\D/g, "")
                                      .slice(0, 4);

                                    let value = digits;

                                    if (digits.length === 3) {
                                      value = `${digits.slice(0, 1)}:${digits.slice(1)}`;
                                    } else if (digits.length === 4) {
                                      value = `${digits.slice(0, 2)}:${digits.slice(2)}`;
                                    }

                                    if (
                                      periodKey &&
                                      (digits.length === 3 || digits.length === 4)
                                    ) {
                                      value = `${value} ${
                                        periodKey === "A" ? "AM" : "PM"
                                      }`;
                                    }

                                    setInstallTimeTextDrafts((current) => ({
                                      ...current,
                                      [job.id]: value,
                                    }));

                                    const parsedTime =
                                      parseInstallTimeText(value);

                                    if (parsedTime) {
                                      const currentDraft =
                                        installScheduleDrafts[job.id] ?? "";

                                      const currentDate =
                                        currentDraft.includes("T")
                                          ? currentDraft.split("T")[0] ?? ""
                                          : currentDraft;

                                      if (currentDate) {
                                        setInstallScheduleDrafts((current) => ({
                                          ...current,
                                          [job.id]: `${currentDate}T${parsedTime}`,
                                        }));
                                      }
                                    }

                                    setInstallScheduleErrors((current) => ({
                                      ...current,
                                      [job.id]: "",
                                    }));
                                  }}
                                  style={{
                                    width: "100%",
                                    minHeight: 42,
                                    boxSizing: "border-box",
                                    border: "1px solid #31495a",
                                    borderRadius: 9,
                                    background: "#0a0f13",
                                    color: "#f3f6f8",
                                    padding: "0 10px",
                                    fontWeight: 700,
                                  }}
                                />

                                <button
                                  type="button"
                                  aria-label="Open install time picker"
                                  onClick={() => {
                                    const picker = document.getElementById(
                                      `premier-install-time-${job.id}`
                                    ) as HTMLInputElement | null;

                                    if (!picker) return;

                                    if (typeof picker.showPicker === "function") {
                                      picker.showPicker();
                                    } else {
                                      picker.click();
                                    }
                                  }}
                                  style={{
                                    minHeight: 42,
                                    border: "1px solid #6f9fbd",
                                    borderRadius: 9,
                                    background: "#162630",
                                    color: "#ffffff",
                                    fontSize: 18,
                                    cursor: "pointer",
                                  }}
                                >
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                                </button>

                                <input
                                  id={`premier-install-time-${job.id}`}
                                  type="time"
                                  tabIndex={-1}
                                  value={
                                    parseInstallTimeText(
                                      installTimeTextDrafts[job.id] ??
                                        formatInstallTimeText(
                                          installScheduleDrafts[job.id] ?? ""
                                        )
                                    ) ?? ""
                                  }
                                  onChange={(event) => {
                                    const parsedTime = event.target.value;

                                    if (!parsedTime) return;

                                    const [hourText, minute] =
                                      parsedTime.split(":");

                                    const hour24 = Number(hourText);
                                    const period =
                                      hour24 >= 12 ? "PM" : "AM";

                                    const hour12 =
                                      hour24 === 0
                                        ? 12
                                        : hour24 > 12
                                          ? hour24 - 12
                                          : hour24;

                                    setInstallTimeTextDrafts((current) => ({
                                      ...current,
                                      [job.id]: `${hour12}:${minute} ${period}`,
                                    }));

                                    const currentDraft =
                                      installScheduleDrafts[job.id] ?? "";

                                    const currentDate =
                                      currentDraft.includes("T")
                                        ? currentDraft.split("T")[0] ?? ""
                                        : currentDraft;

                                    if (currentDate) {
                                      setInstallScheduleDrafts((current) => ({
                                        ...current,
                                        [job.id]: `${currentDate}T${parsedTime}`,
                                      }));
                                    }
                                  }}
                                  style={{
                                    position: "absolute",
                                    width: 1,
                                    height: 1,
                                    opacity: 0,
                                    pointerEvents: "none",
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                        ) : null}
                          <button
                            type="button"
                            disabled={
                              (job.current_stage === "installation_ready" && rjInstallReady[job.id] !== true) ||
                              installScheduleSavingJobId === job.id ||
                              ((installScheduleModes[job.id] ?? (job.next_action?.includes("Morning Window") ? "morning" : job.next_action?.includes("Afternoon Window") ? "afternoon" : job.next_action?.startsWith("RJ install plan:") ? "coordinate" : "specific")) !== "coordinate" && !installScheduleDrafts[job.id])
                            }
                            onClick={async () => {
                              const mode = installScheduleModes[job.id] ?? (job.next_action?.includes("Morning Window") ? "morning" : job.next_action?.includes("Afternoon Window") ? "afternoon" : job.next_action?.startsWith("RJ install plan:") ? "coordinate" : "specific");
                              if (mode !== "specific") {
                                const token = getPremierFieldAccessToken();
                                const crew = (crewDrafts[job.id] ?? job.crew ?? "").trim();
                                const proposedDate = mode === "coordinate" ? null : parseInstallDateText(installDateTextDrafts[job.id] ?? formatInstallDateText(installScheduleDrafts[job.id] ?? ""));
                                if (!token || !crew || ["not assigned", "unassigned", "none", "tbd"].includes(crew.toLowerCase())) {
                                  setInstallScheduleErrors((current) => ({...current, [job.id]: "Choose an installer / crew first."})); return;
                                }
                                if (mode !== "coordinate" && !proposedDate) {
                                  setInstallScheduleErrors((current) => ({...current, [job.id]: "Choose the proposed installation date first."})); return;
                                }
                                setInstallScheduleSavingJobId(job.id);
                                const { data, error } = await supabase.rpc("save_premier_install_plan", {
                                  p_access_token: token, p_job_id: job.id, p_crew: crew,
                                  p_mode: mode, p_proposed_date: proposedDate,
                                });
                                if (error || data !== true) {
                                  setInstallScheduleErrors((current) => ({...current, [job.id]: "Could not save proposed installation plan. Check that the matching SQL function was installed."}));
                                } else {
                                  const description = mode === "coordinate" ? "Coordinate Date With Customer — pending confirmation" : `${mode === "morning" ? "Morning Window" : "Afternoon Window"} proposed for ${proposedDate} — pending confirmation`;
                                  setLiveInstallations((current) => current.map((item) => item.id === job.id ? {...item, crew, scheduled_for: null, next_action: `RJ install plan: ${description}`} : item));
                                  setInstallScheduleErrors((current) => ({...current, [job.id]: "Saved — proposed/pending only. Installer has NOT been released."}));
                                }
                                setInstallScheduleSavingJobId(null);
                                return;
                              }
                              const parsedDate = parseInstallDateText(
                                installDateTextDrafts[job.id] ??
                                  formatInstallDateText(
                                    installScheduleDrafts[job.id] ?? ""
                                  )
                              );

                              const parsedTime = parseInstallTimeText(
                                installTimeTextDrafts[job.id] ??
                                  formatInstallTimeText(
                                    installScheduleDrafts[job.id] ?? ""
                                  )
                              );

                              const draft =
                                parsedDate && parsedTime
                                  ? `${parsedDate}T${parsedTime}`
                                  : "";

                              if (
                                !draft ||
                                !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(draft)
                              ) {
                                setInstallScheduleErrors((current) => ({
                                  ...current,
                                  [job.id]: "Choose an install date and time first.",
                                }));
                                return;
                              }

                              const accessToken =
                                getPremierFieldAccessToken();

                              if (!accessToken) {
                                setInstallScheduleErrors((current) => ({
                                  ...current,
                                  [job.id]: "Premier staff access is missing.",
                                }));
                                return;
                              }

                              const scheduledFor =
                                new Date(draft).toISOString();

                              setInstallScheduleSavingJobId(job.id);
                              setInstallScheduleErrors((current) => ({
                                ...current,
                                [job.id]: "",
                              }));

                              const isFirstSchedule = job.current_stage === "production_setup";
                              const chosenCrew = (crewDrafts[job.id] ?? job.crew ?? "").trim();
                              if (isFirstSchedule && (!chosenCrew || ["not assigned", "unassigned", "none", "tbd"].includes(chosenCrew.toLowerCase()))) {
                                setInstallScheduleErrors((current) => ({ ...current, [job.id]: "Select an installation crew before scheduling." }));
                                setInstallScheduleSavingJobId(null);
                                return;
                              }
                              const { data, error } = isFirstSchedule
                                ? await supabase.rpc("save_premier_install_schedule", {
                                    p_access_token: accessToken,
                                    p_job_id: job.id,
                                    p_crew: chosenCrew,
                                    p_scheduled_for: scheduledFor,
                                  })
                                : await supabase.rpc("schedule_premier_install", {
                                    p_access_token: accessToken,
                                    p_job_id: job.id,
                                    p_scheduled_for: scheduledFor,
                                  });

                              if (error || data !== true) {
                                console.error(
                                  "Premier install scheduling failed:",
                                  error
                                );

                                setInstallScheduleErrors((current) => ({
                                  ...current,
                                  [job.id]:
                                    "Could not save the installation schedule.",
                                }));

                                setInstallScheduleSavingJobId(null);
                                return;
                              }

                              setLiveInstallations((current) =>
                                current.map((item) =>
                                  item.id === job.id
                                    ? {
                                        ...item,
                                        scheduled_for: scheduledFor,
                                        crew: isFirstSchedule ? chosenCrew : item.crew,
                                        current_stage: "scheduled",
                                        // The saved crew/date are authoritative after a successful RPC.
                                        // RJ must explicitly release the scheduled job to Installer.
                                        next_action: "RJ to verify readiness and deliberately release to Installer.",
                                      }
                                    : item
                                )
                              );

                              if (isFirstSchedule) setCrewDrafts((current) => {
                                const next = { ...current };
                                delete next[job.id];
                                return next;
                              });
                              setInstallScheduleDrafts((current) => {
                                const next = { ...current };
                                delete next[job.id];
                                return next;
                              });

                              setInstallScheduleSavingJobId(null);
                            }}
                            style={{
                              minHeight: 42,
                              padding: "0 14px",
                              border: "1px solid #6f9fbd",
                              borderRadius: 9,
                              background: "#162630",
                              color: "#ffffff",
                              fontWeight: 900,
                              fontSize: 12,
                              cursor:
                                (job.current_stage === "installation_ready" && rjInstallReady[job.id] !== true) ||
                                installScheduleSavingJobId === job.id ||
                                ((installScheduleModes[job.id] ?? (job.next_action?.includes("Morning Window") ? "morning" : job.next_action?.includes("Afternoon Window") ? "afternoon" : job.next_action?.startsWith("RJ install plan:") ? "coordinate" : "specific")) !== "coordinate" && !installScheduleDrafts[job.id])
                                  ? "not-allowed"
                                  : "pointer",
                              whiteSpace: "nowrap",
                              boxShadow:
                                "0 0 0 1px rgba(111,159,189,0.10), 0 0 12px rgba(111,159,189,0.08)",
                            }}
                          >
                            {installScheduleSavingJobId === job.id
                              ? "Saving..."
                              : job.current_stage === "installation_ready" && rjInstallReady[job.id] !== true
                                ? "Waiting on Office"
                                : job.scheduled_for
                                  ? "Saved - Change Install"
                                  : (installScheduleModes[job.id] ?? (job.next_action?.includes("Morning Window") ? "morning" : job.next_action?.includes("Afternoon Window") ? "afternoon" : job.next_action?.startsWith("RJ install plan:") ? "coordinate" : "specific")) === "specific"
                                    ? "Confirm Installation Schedule"
                                    : job.next_action?.startsWith("RJ install plan:")
                                      ? "Pending / Proposed Plan Saved - Update"
                                      : "Save Proposed / Pending Plan"}
                          </button>
                        </div>

                        {installScheduleErrors[job.id] ? (
                          <div
                            style={{
                              color: "#d8a0a0",
                              fontSize: 11,
                              marginTop: 7,
                            }}
                          >
                            {installScheduleErrors[job.id]}
                          </div>
                        ) : null}
                      </div>
                      </details>
                      ) : null}
                      <div><strong>Material:</strong> {job.material_status || "Unknown"}</div>
                      <div><strong>Permit:</strong> {job.permit_status || "Unknown"}</div>
                    </div>
                    <div style={{ borderTop: "1px solid #26323a", marginTop: 9, paddingTop: 9, fontSize: 12, color: "#d9e5ee" }}>
                      <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                      {job.current_stage === "installation_complete"
                        ? (job.next_action?.startsWith("RJ approved installation review.") ? "Installation approved by RJ. Office to coordinate inspection and final walkthrough." : "Review submitted installation proof and make the final approval or return decision.")
                        : job.current_stage === "production_setup"
                          ? "Office released this job to RJ. Review the job file, choose a crew, and coordinate the installation appointment."
                          : job.next_action || "Field Operations to prepare crew for installation."}
                    </div>

                    <div
                      id={`premier-field-job-file-${job.id}`}
                      style={{
                        border: "1px solid #31495a",
                        borderRadius: 12,
                        background: "#0d1318",
                        padding: 12,
                        marginTop: 12,
                        scrollMarginTop: 24,
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
                        Office paperwork for this sold job.
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
                          if (fieldJobFileOpenId === job.id) {
                            setFieldJobFileOpenId(null);
                            return;
                          }

                          setFieldJobFileOpenId(job.id);
                          await loadFieldJobDocuments(job.id);
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
                        {fieldJobFileOpenId === job.id
                          ? "Close Job File"
                          : "Open Job File"}
                      </button>

                      {fieldJobFileOpenId === job.id ? (
                        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                          {fieldJobDocumentsLoading[job.id] ? (
                            <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                              Loading job documents...
                            </div>
                          ) : fieldJobDocumentsErrors[job.id] ? (
                            <div style={{ color: "#d8a0a0", fontSize: 11 }}>
                              {fieldJobDocumentsErrors[job.id]}
                            </div>
                          ) : (fieldJobDocuments[job.id] ?? []).length === 0 ? (
                            <div style={{ color: "#8fa9bc", fontSize: 11 }}>
                              No job documents have been added yet.
                            </div>
                          ) : (
                            (fieldJobDocuments[job.id] ?? []).map((document) => (
                              <div
                                key={document.id}
                                style={{
                                  border: "1px solid #26323a",
                                  borderRadius: 10,
                                  background: "#111820",
                                  padding: 10,
                                  display: "grid",
                                  gridTemplateColumns: "112px minmax(0, 1fr)",
                                  gap: 12,
                                  alignItems: "start",
                                }}
                              >
                                <div>
                                  {document.url ? (
                                    <a
                                      href={document.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      title={`Open ${document.file_name || "document"}`}
                                      style={{
                                        display: "block",
                                        width: "100%",
                                        height: 92,
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        border: "1px solid #31495a",
                                        background: "#0a0f13",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {/\.(png|jpe?g|webp|gif)$/i.test(
                                        document.file_name || ""
                                      ) ? (
                                        <img
                                          src={document.url}
                                          alt={
                                            document.note ||
                                            document.file_name ||
                                            "Job document"
                                          }
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                          }}
                                        />
                                      ) : /\.pdf$/i.test(
                                          document.file_name || ""
                                        ) ? (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            overflow: "hidden",
                                            pointerEvents: "none",
                                          }}
                                        >
                                          <iframe
                                            src={`${document.url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                                            title={
                                              document.file_name ||
                                              "PDF preview"
                                            }
                                            style={{
                                              width: "calc(100% + 18px)",
                                              height: "calc(100% + 18px)",
                                              border: 0,
                                              display: "block",
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            display: "grid",
                                            placeItems: "center",
                                            color: "#8fa9bc",
                                            fontSize: 10,
                                            fontWeight: 800,
                                            textAlign: "center",
                                            padding: 8,
                                          }}
                                        >
                                          Document Preview
                                        </div>
                                      )}
                                    </a>
                                  ) : (
                                    <div
                                      style={{
                                        width: "100%",
                                        height: 92,
                                        borderRadius: 8,
                                        border: "1px solid #31495a",
                                        background: "#0a0f13",
                                        display: "grid",
                                        placeItems: "center",
                                        color: "#8fa9bc",
                                        fontSize: 10,
                                        textAlign: "center",
                                        padding: 8,
                                      }}
                                    >
                                      File unavailable
                                    </div>
                                  )}

                                  {document.url ? (
                                    <div
                                      style={{
                                        color: "#6f9fbd",
                                        fontSize: 9,
                                        marginTop: 5,
                                        textAlign: "center",
                                      }}
                                    >
                                      Click preview to open
                                    </div>
                                  ) : null}
                                </div>

                                <div style={{ minWidth: 0 }}>
                                  <div
                                    style={{
                                      color: "#8fa9bc",
                                      fontSize: 10,
                                      fontWeight: 900,
                                      letterSpacing: 0.6,
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {document.document_type ===
                                    "Final Measurement Document"
                                      ? "Supporting Document"
                                      : document.document_type || "Document"}
                                  </div>

                                  <div
                                    style={{
                                      color: "#f3f6f8",
                                      fontSize: 13,
                                      fontWeight: 900,
                                      marginTop: 4,
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    {document.note ||
                                      document.document_type ||
                                      "Document"}
                                  </div>

                                  <div
                                    style={{
                                      color: "#9ca8b2",
                                      fontSize: 11,
                                      lineHeight: 1.4,
                                      marginTop: 5,
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    {document.file_name || "Attached file"}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFieldIssueFormOpenId((current) =>
                          current === job.id ? null : job.id
                        )
                      }
                      style={{
                        display: job.current_stage === "installation_ready" ? "none" : undefined,
                        width: "100%",
                        minHeight: 42,
                        border: "1px solid #b77a5f",
                        borderRadius: 9,
                        background: "#39241e",
                        color: "#ffe1d0",
                        fontWeight: 900,
                        fontSize: 12,
                        cursor: "pointer",
                        marginBottom: 10,
                      }}
                    >
                      {fieldIssueFormOpenId === job.id
                        ? (job.current_stage === "scheduled" ? "Close Pre-Installation Notes & Concerns" : "Close Report Field Issue")
                        : (job.current_stage === "scheduled" ? "Pre-Installation Notes & Concerns" : "Report Field Issue")}
                    </button>

                    {job.current_stage === "scheduled" && (preInstallSavedNotes[job.id]?.length || preInstallNotesMessage) ? (
                      <div style={{ marginBottom: 10, padding: 12, background: "#11291f", border: "1px solid #397e56", borderRadius: 10, display: "grid", gap: 8 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: "#9fdfb2" }}>
                          Saved Pre-Installation Notes ({preInstallSavedNotes[job.id]?.length ?? 0})
                        </div>
                        {preInstallNotesMessage ? <div style={{ fontSize: 12, color: "#d4edda" }}>{preInstallNotesMessage}</div> : null}
                        {(preInstallSavedNotes[job.id] ?? []).map((note: any) => (
                          <div key={note.id} style={{ borderTop: "1px solid #315e46", paddingTop: 8, fontSize: 12, color: "#ffffff", display: "grid", gap: 4 }}>
                            <div style={{ fontWeight: 800 }}>{Array.isArray(note.categories) ? note.categories.join(", ") : "Pre-installation note"}</div>
                            <div style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{note.details}</div>
                            <div style={{ color: "#acbcb0", fontSize: 11 }}>{note.created_at ? new Date(note.created_at).toLocaleString() : "Saved"}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {fieldIssueFormOpenId === job.id && job.current_stage !== "installation_ready" ? (
                      <div
                        style={{
                          border: "1px solid #8a5f4a",
                          borderRadius: 10,
                          background: "#211713",
                          padding: 12,
                          display: "grid",
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            color: "#ffe1d0",
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {job.current_stage === "scheduled" ? "What should the installer know before arriving?" : "What needs attention?"}
                        </div>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                          {(job.current_stage === "scheduled"
                            ? [
                                "Access / Parking",
                                "Customer Request",
                                "Special Instructions",
                                "Materials to Check",
                                "Known Existing Conditions",
                                "Other",
                              ]
                            : [
                                "Scratches / Damage",
                                "Brake Metal",
                                "Broken Glass",
                                "Missing Parts",
                                "Wrong Measurement",
                                "Installation / Fit",
                                "Other",
                              ]).map((category) => {
                            const selected = (
                              fieldIssueCategories[job.id] ?? []
                            ).includes(category);

                            return (
                              <button
                                key={category}
                                type="button"
                                onClick={() =>
                                  setFieldIssueCategories((current) => {
                                    const existing = current[job.id] ?? [];

                                    return {
                                      ...current,
                                      [job.id]: selected
                                        ? existing.filter((item) => item !== category)
                                        : [...existing, category],
                                    };
                                  })
                                }
                                style={{
                                  minHeight: 34,
                                  padding: "6px 10px",
                                  border: selected
                                    ? "1px solid #e5ab8d"
                                    : "1px solid #65483b",
                                  borderRadius: 8,
                                  background: selected ? "#754333" : "#172027",
                                  color: "#ffffff",
                                  fontSize: 11,
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                {selected ? "✓ " : ""}
                                {category}
                              </button>
                            );
                          })}
                        </div>

                        <textarea
                          value={fieldIssueDetails[job.id] ?? ""}
                          onChange={(event) =>
                            setFieldIssueDetails((current) => ({
                              ...current,
                              [job.id]: event.target.value,
                            }))
                          }
                          placeholder={job.current_stage === "scheduled" ? "What should the installer know before arriving?" : "Describe what you found during the walkthrough..."}
                          rows={3}
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            minHeight: 80,
                            border: "1px solid #65483b",
                            borderRadius: 9,
                            background: "#101820",
                            color: "#ffffff",
                            padding: 10,
                            fontSize: 12,
                            resize: "vertical",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => startFieldIssueVoice(job.id)}
                          disabled={fieldIssueListeningJobId !== null}
                          style={{
                            minHeight: 38,
                            border: "1px solid #8fbea0",
                            borderRadius: 9,
                            background:
                              fieldIssueListeningJobId === job.id
                                ? "#7a2d24"
                                : "#2f6842",
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 900,
                            cursor:
                              fieldIssueListeningJobId !== null
                                ? "wait"
                                : "pointer",
                          }}
                        >
                          {fieldIssueListeningJobId === job.id
                            ? "Listening..."
                            : "Mic - Speak Notes"}
                        </button>
                        <button
                          type="button"
                          disabled={fieldIssueSavingJobId === job.id}
                          onClick={() => void saveFieldIssueReport(job.id)}
                          style={{
                            minHeight: 42,
                            border: "1px solid #e5ab8d",
                            borderRadius: 9,
                            background: "#754333",
                            color: "#ffffff",
                            fontSize: 12,
                            fontWeight: 900,
                            cursor:
                              fieldIssueSavingJobId === job.id
                                ? "wait"
                                : "pointer",
                          }}
                        >
                          {fieldIssueSavingJobId === job.id
                            ? (job.current_stage === "scheduled" ? "Saving Note..." : "Saving Issue...")
                            : (job.current_stage === "scheduled" ? "Save Pre-Installation Concern" : "Save & Report Issue")}
                        </button>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={() =>
                        setFieldBuckingRecordsOpenId((current) =>
                          current === job.id ? null : job.id
                        )
                      }
                      style={{
                        display: ["scheduled", "installation_ready"].includes(job.current_stage) ? "none" : undefined,
                        width: "100%",
                        minHeight: 42,
                        border: "1px solid #405565",
                        borderRadius: 9,
                        background: "#1a2a36",
                        color: "#ffffff",
                        fontWeight: 900,
                        fontSize: 12,
                        cursor: "pointer",
                        marginBottom:
                          fieldBuckingRecordsOpenId === job.id ? 10 : 0,
                      }}
                    >
                      {fieldBuckingRecordsOpenId === job.id
                        ? "Close Bucking Records"
                        : "Open Bucking Records"}
                    </button>

                    {fieldBuckingRecordsOpenId === job.id && !["scheduled", "installation_ready"].includes(job.current_stage) ? (
                      <>


                    <div
                                style={{
                                  border: "1px solid #31495a",
                                  borderRadius: 10,
                                  background: "#111820",
                                  padding: 10,
                                  marginBottom: 10,
                                  display: "grid",
                                  gap: 9,
                                }}
                              >
                                <div
                                  style={{
                                    color: "#f3f6f8",
                                    fontSize: 12,
                                    fontWeight: 900,
                                  }}
                                >
                                  Bucking / Field Record
                                </div>

                                <label
                                  style={{
                                    minHeight: 42,
                                    border: "1px solid #6f9fbd",
                                    borderRadius: 9,
                                    background: "#162630",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "0 12px",
                                    fontSize: 12,
                                    fontWeight: 900,
                                    cursor:
                                      fieldUploadingBuckingJobId === job.id
                                        ? "wait"
                                        : "pointer",
                                  }}
                                >
                                  {fieldUploadingBuckingJobId === job.id
                                    ? "Uploading Bucking Photo..."
                                    : "Take / Upload Bucking Photo"}

                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    capture="environment"
                                    hidden
                                    disabled={
                                      fieldUploadingBuckingJobId === job.id
                                    }
                                    onChange={async (event) => {
                                      const file =
                                        event.target.files?.[0] ?? null;

                                      event.currentTarget.value = "";

                                      if (!file) return;

                                      if (
                                        ![
                                          "image/jpeg",
                                          "image/png",
                                          "image/webp",
                                        ].includes(file.type)
                                      ) {
                                        window.alert(
                                          "Please use a JPG, PNG, or WEBP photo."
                                        );
                                        return;
                                      }

                                      const accessToken =
                                        getPremierFieldAccessToken();

                                      if (!accessToken) {
                                        window.alert(
                                          "Premier staff access is missing."
                                        );
                                        return;
                                      }

                                      setFieldUploadingBuckingJobId(job.id);

                                      try {
                                        const proofType =
                                          "Bucking / buck inspection";

                                        const {
                                          data: uploadAccess,
                                          error: accessError,
                                        } =
                                          await supabase.functions.invoke(
                                            "premier-installer-proof-photo",
                                            {
                                              body: {
                                                action: "create-upload",
                                                accessToken,
                                                jobId: job.id,
                                                proofType,
                                                fileName:
                                                  file.name ||
                                                  "bucking-proof.jpg",
                                                mimeType:
                                                  file.type || "image/jpeg",
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
                                            .from(
                                              "premier-installer-proof-photos"
                                            )
                                            .uploadToSignedUrl(
                                              uploadAccess.path,
                                              uploadAccess.token,
                                              file,
                                              {
                                                contentType:
                                                  file.type || "image/jpeg",
                                              }
                                            );

                                        if (uploadError) {
                                          throw uploadError;
                                        }

                                        const {
                                          data: finalizeData,
                                          error: finalizeError,
                                        } =
                                          await supabase.functions.invoke(
                                            "premier-installer-proof-photo",
                                            {
                                              body: {
                                                action: "finalize",
                                                accessToken,
                                                jobId: job.id,
                                                proofType,
                                                path: uploadAccess.path,
                                                fileName:
                                                  file.name ||
                                                  "bucking-proof.jpg",
                                                mimeType:
                                                  file.type || "image/jpeg",
                                              },
                                            }
                                          );

                                        if (
                                          finalizeError ||
                                          !finalizeData?.photo
                                        ) {
                                          throw new Error(
                                            finalizeError?.message ||
                                              "Could not save bucking proof."
                                          );
                                        }

                                        await loadFieldInstallerActivity(
                                          job.id
                                        );
                                      } catch (error: any) {
                                        console.error(
                                          "RJ bucking proof upload failed:",
                                          error
                                        );

                                        window.alert(
                                          error?.message ||
                                            "Could not upload bucking photo."
                                        );
                                      } finally {
                                        setFieldUploadingBuckingJobId(null);
                                      }
                                    }}
                                  />
                                </label>

                                <textarea
                                  value={
                                    fieldBuckingDrafts[job.id]?.buckingNotes ??
                                    ""
                                  }
                                  onChange={(event) => {
                                    const current =
                                      fieldBuckingDrafts[job.id];

                                    setFieldBuckingDrafts((drafts) => ({
                                      ...drafts,
                                      [job.id]: {
                                        buckingNotes: event.target.value,
                                        measurementNotes:
                                          current?.measurementNotes ?? "",
                                        materialIssueNotes:
                                          current?.materialIssueNotes ?? "",
                                        needsAttention:
                                          current?.needsAttention ?? false,
                                        saved: false,
                                      },
                                    }));
                                  }}
                                  placeholder="Bucking / buck inspection notes"
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    borderRadius: 9,
                                    border: "1px solid #405565",
                                    background: "#0a0f13",
                                    color: "#d9e5ee",
                                    padding: "10px 11px",
                                    fontSize: 12,
                                    resize: "vertical",
                                  }}
                                />

                                <textarea
                                  value={
                                    fieldBuckingDrafts[job.id]
                                      ?.measurementNotes ?? ""
                                  }
                                  onChange={(event) => {
                                    const current =
                                      fieldBuckingDrafts[job.id];

                                    setFieldBuckingDrafts((drafts) => ({
                                      ...drafts,
                                      [job.id]: {
                                        buckingNotes:
                                          current?.buckingNotes ?? "",
                                        measurementNotes:
                                          event.target.value,
                                        materialIssueNotes:
                                          current?.materialIssueNotes ?? "",
                                        needsAttention:
                                          current?.needsAttention ?? false,
                                        saved: false,
                                      },
                                    }));
                                  }}
                                  placeholder="Measurement notes"
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    borderRadius: 9,
                                    border: "1px solid #405565",
                                    background: "#0a0f13",
                                    color: "#d9e5ee",
                                    padding: "10px 11px",
                                    fontSize: 12,
                                    resize: "vertical",
                                  }}
                                />

                                <textarea
                                  value={
                                    fieldBuckingDrafts[job.id]
                                      ?.materialIssueNotes ?? ""
                                  }
                                  onChange={(event) => {
                                    const current =
                                      fieldBuckingDrafts[job.id];

                                    setFieldBuckingDrafts((drafts) => ({
                                      ...drafts,
                                      [job.id]: {
                                        buckingNotes:
                                          current?.buckingNotes ?? "",
                                        measurementNotes:
                                          current?.measurementNotes ?? "",
                                        materialIssueNotes:
                                          event.target.value,
                                        needsAttention:
                                          current?.needsAttention ?? false,
                                        saved: false,
                                      },
                                    }));
                                  }}
                                  placeholder="Material issue notes"
                                  rows={3}
                                  style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    borderRadius: 9,
                                    border: "1px solid #405565",
                                    background: "#0a0f13",
                                    color: "#d9e5ee",
                                    padding: "10px 11px",
                                    fontSize: 12,
                                    resize: "vertical",
                                  }}
                                />

                                <label
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    minHeight: 38,
                                    color: "#d9e5ee",
                                    fontSize: 12,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      fieldBuckingDrafts[job.id]
                                        ?.needsAttention ?? false
                                    }
                                    onChange={(event) => {
                                      const current =
                                        fieldBuckingDrafts[job.id];

                                      setFieldBuckingDrafts((drafts) => ({
                                        ...drafts,
                                        [job.id]: {
                                          buckingNotes:
                                            current?.buckingNotes ?? "",
                                          measurementNotes:
                                            current?.measurementNotes ?? "",
                                          materialIssueNotes:
                                            current?.materialIssueNotes ?? "",
                                          needsAttention:
                                            event.target.checked,
                                          saved: false,
                                        },
                                      }));
                                    }}
                                  />
                                  Needs Attention
                                </label>

                                <button
                                  type="button"
                                  disabled={
                                    fieldSavingBuckingJobId === job.id
                                  }
                                  onClick={async () => {
                                    const accessToken =
                                      getPremierFieldAccessToken();

                                    if (!accessToken) {
                                      window.alert(
                                        "Premier staff access is missing."
                                      );
                                      return;
                                    }

                                    const draft =
                                      fieldBuckingDrafts[job.id] ?? {
                                        buckingNotes: "",
                                        measurementNotes: "",
                                        materialIssueNotes: "",
                                        needsAttention: false,
                                        saved: false,
                                      };

                                    setFieldSavingBuckingJobId(job.id);

                                    try {
                                      const { data, error } =
                                        await supabase.rpc(
                                          "save_premier_installer_bucking_details",
                                          {
                                            p_access_token: accessToken,
                                            p_job_id: job.id,
                                            p_bucking_notes:
                                              draft.buckingNotes,
                                            p_measurement_notes:
                                              draft.measurementNotes,
                                            p_material_issue_notes:
                                              draft.materialIssueNotes,
                                            p_needs_attention:
                                              draft.needsAttention,
                                          }
                                        );

                                      if (error) {
                                        throw error;
                                      }

                                      if (data === true) {
                                        setFieldBuckingDrafts(
                                          (drafts) => ({
                                            ...drafts,
                                            [job.id]: {
                                              ...draft,
                                              saved: true,
                                            },
                                          })
                                        );

                                        await loadFieldInstallerActivity(
                                          job.id
                                        );
                                      }
                                    } catch (error: any) {
                                      console.error(
                                        "RJ save bucking details failed:",
                                        error
                                      );

                                      window.alert(
                                        error?.message ||
                                          "Could not save bucking details."
                                      );
                                    } finally {
                                      setFieldSavingBuckingJobId(null);
                                    }
                                  }}
                                  style={{
                                    minHeight: 42,
                                    border: "1px solid #6f9fbd",
                                    borderRadius: 9,
                                    background: "#162630",
                                    color: "#ffffff",
                                    fontWeight: 900,
                                    fontSize: 12,
                                    cursor:
                                      fieldSavingBuckingJobId === job.id
                                        ? "wait"
                                        : "pointer",
                                  }}
                                >
                                  {fieldSavingBuckingJobId === job.id
                                    ? "Saving Bucking Record..."
                                    : fieldBuckingDrafts[job.id]?.saved
                                      ? "Bucking Record Saved"
                                      : "Save Bucking Record"}
                                </button>
                              </div>
                      </>
                    ) : null}


                    {job.current_stage === "installation_ready" ? (
                      <div style={{ border: "1px solid #67ae83", borderRadius: 12, background: "#11291e", padding: 16, marginTop: 12, marginBottom: 10, display: "grid", gap: 10 }}>
                        <div style={{ color: "#b7dec4", fontSize: 11, fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase" }}>HANDOFF COMPLETE</div>
                        <div style={{ color: "#f2fff5", fontSize: 18, fontWeight: 900 }}>Job Sent to {job.crew || "Installer"}</div>
                        <div style={{ color: "#9fdfb2", fontSize: 12, fontWeight: 800 }}>Installation Ready</div>
                        <div style={{ color: "#d7e5dc", fontSize: 12 }}>Installation handoff recorded. Installer receipt or acknowledgement has not yet been verified.</div>
                        <div style={{ color: "#f3f6f8", fontSize: 12 }}>Scheduled: {job.scheduled_for ? new Date(job.scheduled_for).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "Date pending"}</div>
                        <div style={{ borderTop: "1px solid #39694c", paddingTop: 10, color: "#e3f0e7", fontSize: 12 }}>
                          <strong>RJ's Next Action:</strong> Monitor installation progress, photos, and issues reported by the installer in Field Monitoring.
                        </div>
                      </div>
                    ) : null}
                    <div
                      style={{
                        display: job.current_stage === "scheduled" ? "block" : "none",
                        border: "1px solid #557c64",
                        borderRadius: 12,
                        background: "#111c18",
                        padding: 12,
                        marginTop: 12,
                        marginBottom: 10,
                      }}
                    >
                      <div
                        style={{
                          color: "#b7dec4",
                          fontSize: 11,
                          fontWeight: 900,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        Next Action
                      </div>
                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 16,
                          fontWeight: 900,
                          marginBottom: 10,
                        }}
                      >
                        Send Job to {job.crew || "Installer"}
                      </div>
                      <div style={{ color: "#d7dde2", fontSize: 12, lineHeight: 1.6 }}>
                        <div>
                          Installation scheduled for{" "}
                          {job.scheduled_for
                            ? new Date(job.scheduled_for).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })
                            : "date pending"}.
                        </div>
                        <div>
                          Installer assigned. Materials and permit cleared.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        const accessToken =
                          getPremierFieldAccessToken();

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "relay_premier_installation_ready",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Installation Ready relay failed:", error);
                          return;
                        }

                        if (data === true) {
                          setLiveInstallations((current) =>
                            current.map((item) =>
                              item.id === job.id
                                ? {
                                    ...item,
                                    current_stage: "installation_ready",
                                    next_action:
                                      "Installer to begin installation and upload required proof.",
                                  }
                                : item
                            )
                          );
                        }
                      }}
                      style={{
                        display: job.current_stage === "scheduled" ? "block" : "none",
                        width: "100%",
                        minHeight: 46,
                        marginTop: 10,
                        borderRadius: 10,
                        border: "1px solid #78bb91",
                        background: "#204b35",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Send Job to {job.crew || "Installer"} →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: liveInspections.some((job) => job.id === selectedFieldJobId)
                ? "block"
                : "none",
              borderTop: "1px solid #26323a",
              marginTop: 14,
              paddingTop: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <strong style={{ fontSize: 16 }}>Scheduled Walkthroughs / Inspections</strong>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#d9e5ee",
                }}
              >
                {liveInspections.length}
              </span>
            </div>

            {liveInspectionsLoading ? (
              <div style={{ color: "#8fa0ad", fontSize: 12 }}>
                Loading scheduled inspections...
              </div>
            ) : liveInspections.length === 0 ? (
              <div style={{ color: "#78858e", fontSize: 12 }}>
                No scheduled inspections right now.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 9 }}>
                {liveInspections.filter((job) => job.id === selectedFieldJobId).map((job) => (
                  <div
                    key={job.id}
                    style={{
                      border: "1px solid #80682f",
                      borderRadius: 13,
                      background: "#111820",
                      padding: 12,
                    }}
                  >
                    <FieldBeamComposer job={job} />

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
                          color: "#e1c477",
                          fontSize: 10,
                          fontWeight: 900,
                          textTransform: "uppercase",
                        }}
                      >
                        {job.inspection_status || "Scheduled"}
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
                        gap: 4,
                        fontSize: 12,
                        color: "#d7dde2",
                      }}
                    >
                      <div>
                        <strong>Type:</strong>{" "}
                        {job.inspection_type || "Inspection"}
                      </div>
                      <div>
                        <strong>Assigned:</strong>{" "}
                        {job.inspection_assigned_to || "Not assigned"}
                      </div>
                      <div>
                        <strong>{job.inspection_type === "Final Walkthrough" ? "Final Walkthrough:" : "Final Inspection:"}</strong>{" "}
                        {job.inspection_scheduled_date
                          ? `${new Date(
                              `${job.inspection_scheduled_date}T12:00:00`
                            ).toLocaleDateString()}  - ${
                              job.inspection_window || "Time TBD"
                            }`
                          : job.inspection_scheduled_for
                            ? new Date(
                                job.inspection_scheduled_for
                              ).toLocaleString()
                            : "Not scheduled"}
                      </div>
                    </div>

                    <div
                      style={{
                        borderTop: "1px solid #26323a",
                        marginTop: 9,
                        paddingTop: 9,
                        fontSize: 12,
                        color: "#d9e5ee",
                      }}
                    >
                      <span style={{ color: "#8fa9bc" }}>Next:</span>{" "}
                      {job.next_action ||
                        (job.inspection_type === "Final Walkthrough" ? "Complete customer walkthrough and record its outcome." : "Field Operations to complete inspection.")}
                    </div>
                    <div
                      style={{
                        border: "1px solid #3f5564",
                        borderRadius: 12,
                        background: "#0d1318",
                        padding: 12,
                        marginTop: 12,
                      }}
                    >
                      <div
                        style={{
                          color: "#f3f6f8",
                          fontSize: 12,
                          fontWeight: 900,
                          marginBottom: 6,
                        }}
                      >
                        What needs attention?
                      </div>

                      <div style={{
                        border: "1px solid #5a4831",
                        borderRadius: 10,
                        background: "#1b1916",
                        padding: 11,
                        marginBottom: 12
                      }}>
                        <strong>Existing Field Reports</strong>

                        {fieldInstallerProofLoading[job.id] ? (
                          <div>Loading reported issues...</div>
                        ) : fieldInstallerProofErrors[job.id] || walkthroughIssueErrors[job.id] ? (
                          <div role="alert" style={{ color: "#f0aaaa" }}>
                            {fieldInstallerProofErrors[job.id] || walkthroughIssueErrors[job.id]}
                          </div>
                        ) : !Object.prototype.hasOwnProperty.call(fieldIssueReports, job.id) || !Object.prototype.hasOwnProperty.call(walkthroughIssueStates, job.id) ? (
                          <div>Loading issue statuses...</div>
                        ) : (fieldIssueReports[job.id] || []).length === 0 ? (
                          <div>No field reports found.</div>
                        ) : (() => {
                          const statusById = new Map<string, string>((walkthroughIssueStates[job.id] || []).map((s: any) => [String(s.issue_id), String(s.resolution_status)]));
                          const reports = fieldIssueReports[job.id] || [];
                          const open = reports.filter((r: any) => !["resolved", "duplicate"].includes(statusById.get(String(r.id)) || "needs_review"));
                          const closed = reports.filter((r: any) => ["resolved", "duplicate"].includes(statusById.get(String(r.id)) || ""));
                          return <div style={{ display: "grid", gap: 9, marginTop: 9 }}>
                            <strong>{open.length} Open Issues {"\u00B7"} {closed.length} Handled Reports</strong>
                            {open.length === 0 ? <div style={{ color: "#a5e4b9" }}>No unresolved issues.</div> : open.map((report: any) => <div key={report.id} style={{ borderTop: "1px solid #514536", paddingTop: 8 }}>
                              <strong>{(report.categories || []).join(", ") || "Field Issue"}</strong>
                              <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{report.details || "No description provided."}</div>
                            </div>)}
                            {closed.length > 0 && <details><summary style={{ cursor: "pointer" }}>Work History {"\u2014"} Handled Reports ({closed.length})</summary>
                              {closed.map((report: any) => <div key={report.id} style={{ borderTop: "1px solid #514536", paddingTop: 8 }}>
                                <strong>{(report.categories || []).join(", ") || "Field Issue"} - {statusById.get(String(report.id)) === "duplicate" ? "Closed as Duplicate" : "Verified Resolved"}</strong>
                                <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{report.details || "No description provided."}</div>
                              </div>)}
                            </details>}
                            <div style={{ fontSize: 11, color: "#d5bd80" }}>Original reports remain saved. Record only new walkthrough findings as finish items.</div>
                          </div>;
                        })()}
                      </div>

                      {job.inspection_type === "Final Walkthrough" && (
                        <div style={{ display: "grid", gap: 9, marginBottom: 10 }}>
                          <strong style={{ fontSize: 13 }}>Add Walkthrough Finding</strong>
                          <label style={{ fontSize: 12 }}>Opening / location
                            <input
                              autoComplete="off"
                              value={walkthroughOpening[job.id] || ""}
                              onChange={(event) => setWalkthroughOpening((current) => ({ ...current, [job.id]: event.target.value }))}
                              placeholder="e.g. Kitchen W3, Sliding Door D1"
                              style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 10, marginTop: 4, borderRadius: 8, border: "1px solid #415563", background: "#0a0f13", color: "#f3f6f8" }}
                            />
                          </label>
                          <label style={{ fontSize: 12 }}>What needs attention?
                            <select
                              value={walkthroughIssueType[job.id] || ""}
                              onChange={(event) => setWalkthroughIssueType((current) => ({ ...current, [job.id]: event.target.value }))}
                              style={{ display: "block", width: "100%", padding: 10, marginTop: 4, borderRadius: 8, border: "1px solid #415563", background: "#0a0f13", color: "#f3f6f8" }}
                            >
                              <option value="">Select issue</option>
                              <option>Missing Part</option><option>Damage</option><option>Operation Issue</option>
                              <option>Finish / Trim</option><option>Caulking / Seal</option><option>Cleaning</option><option>Other</option>
                            </select>
                          </label>
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12 }}>Additional details (optional)</span>
                        <button type="button" onClick={() => startWalkthroughDictation(job.id)} disabled={Boolean(walkthroughListening)}
                          style={{ border: "1px solid #557c64", borderRadius: 9, padding: "8px 14px", background: "#173225", color: "#eaf5ee", cursor: "pointer" }}>
                          {walkthroughListening === job.id ? "Listening..." : "\uD83C\uDFA4 Mic"}
                        </button>
                      </div>
                      <textarea
                        value={inspectionPunchDrafts[job.id] || ""}
                        onFocus={() => {
                          if (!inspectionPunchItems[job.id]) {
                            void loadInspectionPunchItems(job.id);
                          }
                        }}
                        onChange={(event) =>
                          setInspectionPunchDrafts((current) => ({
                            ...current,
                            [job.id]: event.target.value,
                          }))
                        }
                        placeholder="Optional: Describe what needs correction, or tap Mic to dictate."
                        style={{
                          width: "100%",
                          minHeight: 86,
                          resize: "vertical",
                          border: "1px solid #31495a",
                          borderRadius: 9,
                          background: "#0a0f13",
                          color: "#f3f6f8",
                          padding: 10,
                          fontSize: 12,
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />

                      <button
                        type="button"
                        disabled={inspectionPunchSaving[job.id] === true}
                        onClick={() => void saveInspectionPunchItem(job)}
                        style={{
                          width: "100%",
                          minHeight: 42,
                          marginTop: 8,
                          borderRadius: 9,
                          border: "1px solid #557c64",
                          background: "#173225",
                          color: "#eaf5ee",
                          fontWeight: 900,
                          cursor:
                            inspectionPunchSaving[job.id] === true
                              ? "wait"
                              : "pointer",
                          opacity:
                            inspectionPunchSaving[job.id] === true ? 0.7 : 1,
                        }}
                      >
                        {inspectionPunchSaving[job.id] === true
                          ? "Saving..."
                          : (job.inspection_type === "Final Walkthrough" ? (walkthroughSavedOnce[job.id] ? "Add Another Finding" : "Save Walkthrough Finding") : "Add Finish Item")}
                      </button>

                      {inspectionPunchErrors[job.id] ? (
                        <div
                          style={{
                            color: "#e6a7a7",
                            fontSize: 11,
                            marginTop: 7,
                          }}
                        >
                          {inspectionPunchErrors[job.id]}
                        </div>
                      ) : null}

                      {(inspectionPunchItems[job.id] || []).length > 0 ? (
                        <div
                          style={{
                            display: "grid",
                            gap: 7,
                            marginTop: 10,
                          }}
                        >
                          {(inspectionPunchItems[job.id] || []).map(
                            (item: any) => (
                              <div
                                key={item.id}
                                style={{
                                  border: "1px solid #263846",
                                  borderRadius: 9,
                                  background: "#101820",
                                  padding: 9,
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
                                    color: "#8fa0ad",
                                    fontSize: 10,
                                    marginTop: 4,
                                  }}
                                >
                                  {item.status || "Reported"}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : null}
                    </div>

                    {job.inspection_type === "Final Walkthrough" ? (
                      <div style={{ display: "grid", gap: 9, marginTop: 13 }}>
                        <strong style={{ color: "#d9e5ee", fontSize: 14 }}>Final Walkthrough Outcome</strong>
                        <textarea
                          rows={3}
                          value={walkthroughOutcomeNotes[job.id] || ""}
                          onChange={event => setWalkthroughOutcomeNotes(current => ({ ...current, [job.id]: event.target.value }))}
                          placeholder="Optional approval note, or describe corrections needed"
                          style={{ background: "#101820", border: "1px solid #41505d", borderRadius: 9, color: "#fff", padding: 10, width: "100%", boxSizing: "border-box" }}
                        />
                        <button type="button" disabled={!!walkthroughOutcomeBusy[job.id]}
                          onClick={() => void submitWalkthroughOutcome(job, "approved")}
                          style={{ minHeight: 44, background: "#286d45", border: "1px solid #7ac394", borderRadius: 9, color: "white", fontWeight: 900 }}>
                          Walkthrough Approved - Notify Office
                        </button>
                        <button type="button" disabled={!!walkthroughOutcomeBusy[job.id]}
                          onClick={() => void submitWalkthroughOutcome(job, "corrections_needed")}
                          style={{ minHeight: 44, background: "#47341d", border: "1px solid #b5945d", borderRadius: 9, color: "white", fontWeight: 900 }}>
                          Corrections Needed - Notify Office
                        </button>
                        {walkthroughOutcomeError[job.id] ? <div style={{ color: "#e8a6a6", fontSize: 12 }}>{walkthroughOutcomeError[job.id]}</div> : null}
                        <div style={{ color: "#a5b6c4", fontSize: 11 }}>Approval is blocked if any saved walkthrough findings are unresolved. Office handles closeout; this does not close the job.</div>
                      </div>
                    ) : (
                    <button
                      type="button"
                      disabled={job.inspection_type === "Final Walkthrough"}
                      onClick={async () => {
                        // The existing RPC always returns the job for installer finish work.
                        // Do not use it to certify a customer Final Walkthrough.
                        if (job.inspection_type === "Final Walkthrough") return;
                        const proceed = window.confirm(
                          "Complete this Final Inspection and send the job to installer finish work? Existing damage reports will remain open until their repairs are confirmed."
                        );
                        if (!proceed) return;

const accessToken =
                          getPremierFieldAccessToken();

                        if (!accessToken) return;

                        const { data, error } = await supabase.rpc(
                          "complete_premier_inspection",
                          {
                            p_access_token: accessToken,
                            p_job_id: job.id,
                          }
                        );

                        if (error) {
                          console.error("Complete Inspection failed:", error);
                          return;
                        }

                        if (data === true) {
                          setLiveInspections((current) =>
                            current.filter((item) => item.id !== job.id)
                          );
                        }
                      }}
                      style={{
                        width: "100%",
                        minHeight: 46,
                        marginTop: 10,
                        borderRadius: 10,
                        border: "1px solid #557c64",
                        background: "#16232d",
                        color: "#d9e5ee",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      {job.inspection_type === "Final Walkthrough" ? "Final Walkthrough Completion - Pending Verification" : "Complete Inspection"}
                    </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .field-layout {
            grid-template-columns: 1fr !important;
          }

          .field-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 620px) {
          .field-action-grid,
          .field-main-grid,
          .field-quick-grid,
          .agreement-grid {
            grid-template-columns: 1fr !important;
          }

          .field-summary-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}





























