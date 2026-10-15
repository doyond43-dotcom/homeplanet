import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

type Person = { id: string; owner_id: string; name: string; lane: string; source: string; status: string; notes: string; phone: string | null; email: string | null; created_at: string };
type Opportunity = { is_test: boolean; id: string; person_id: string; title: string; description: string; status: string; outcome: string | null; created_at: string };
type Action = { id: string; person_id: string; opportunity_id: string | null; title: string; status: string; due_at: string | null; created_at: string; completed_at?: string | null };
type Interaction = { id: string; person_id: string; kind: string; summary: string; source_type: string; occurred_at: string | null; created_at: string };
type Tab = "people" | "actions" | "opportunities";
const base: React.CSSProperties = { background: "#0b1019", minHeight: "100vh", color: "#eff3f9", fontFamily: "system-ui, sans-serif", padding: "22px 14px" };
const panel: React.CSSProperties = { border: "1px solid #2b3648", background: "#151c29", padding: 16, borderRadius: 14 };
const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "#0e1521", border: "1px solid #39475c", borderRadius: 10, padding: 12, color: "#fff", font: "inherit" };
const btn: React.CSSProperties = { border: "1px solid #40516a", borderRadius: 10, background: "#222f40", color: "white", padding: "10px 13px", font: "inherit", cursor: "pointer" };
const green: React.CSSProperties = { ...btn, background: "#23604c", borderColor: "#348062" };
const small: React.CSSProperties = { color: "#a7b7cc", fontSize: 13 };
const starter = [
  { key: "randy", name: "Randy Roberts", lane: "Business Development", source: "Longtime friendship", status: "active", notes: "Longtime friend. Interested in helping HomePlanet grow. Tagged social contacts. Mentioned Byron, restaurants, ranch/agriculture, Cheney Brothers, wildlife management contracts, and securing digital accounts.", next: "Confirm call and lunch outcomes; identify first introduction.", opp: ["Restaurant introductions", "Ranch and agriculture contacts", "Cheney Brothers connection", "Byron introduction", "Wildlife management contracts"], summary: "Interested in helping HomePlanet grow; discussed connections and business development directions.", source_type: "memory" },
  { key: "michelle", name: "Michelle Watson", lane: "Funding and Partnerships", source: "Okeechobee Together", status: "active", notes: "Okeechobee Together helped move piles and level her yard. Works for Okeechobee County Board of County Commissioners as Grants Manager and oversees Affordable Housing. She reached out about fundraising and grant-writing support; no partnership or funding is confirmed.", next: "Arrange meeting to learn about potential collaboration.", opp: ["Grant research", "Fundraising strategy", "Community partnerships", "Program development"], summary: "Reached out expressing interest in helping HomePlanet grow and proposed meeting to discuss her fundraising and grant-writing skills.", source_type: "direct" },
  { key: "lorenzi", name: "Lorenzi R Marcos", lane: "Human Behavior and Guidance", source: "Local HomePlanet conversation", status: "active", notes: "The Digital Habitat; near Okeechobee airport. Background discussed: nutrition, personal training, counseling/therapy, and books. Phone +1 (754) 256-7911. He connected HomePlanet's next-action problem to his experiences helping people navigate decisions; not offering a formal branding role.", next: "Document call insights and consider a focused HomePlanet walkthrough.", opp: ["User comprehension", "Next-action guidance", "Trust and communication", "Workflow feedback"], summary: "October 9, 2026 phone call: discussed business owners juggling fragmented apps and not knowing the next step. Lorenzi recognized analogous coaching challenges. Reconstructed from memory; call not recorded.", source_type: "memory" },
];
const errorText = (e: unknown) => e instanceof Error ? e.message : String(e);

function isSystemHistory(item: Interaction): boolean {
  const text = item.summary || "";
  return (
    text.startsWith("Opportunity status changed:") ||
    text.startsWith("Marked as TEST:") ||
    text.startsWith("Restored from TEST:") ||
    text.startsWith("Completed next action:")
  );
}

export default function HomePlanetGrowthBoard() {
  const { user, loading: authLoading } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("people");
  const [showTestRecords, setShowTestRecords] = useState(false);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<"person" | "interaction" | "opportunity" | "action" | "edit" | null>(null);
  const [personName, setPersonName] = useState("");
  const [personLane, setPersonLane] = useState("");
  const [personSource, setPersonSource] = useState("");
  const [personNotes, setPersonNotes] = useState("");
  const [personPhone, setPersonPhone] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entryType, setEntryType] = useState("note");
  const [sourceType, setSourceType] = useState("memory");
  const [dueDate, setDueDate] = useState("");
  const [opportunityId, setOpportunityId] = useState("");
  const [simpleNote, setSimpleNote] = useState("");
  const [simpleNext, setSimpleNext] = useState("");
  const [simpleDue, setSimpleDue] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const [p, o, a, i] = await Promise.all([
        supabase.from("hp_growth_people").select("*").order("created_at", { ascending: true }),
        supabase.from("hp_growth_opportunities").select("*").order("created_at", { ascending: false }),
        supabase.from("hp_growth_actions").select("*").order("created_at", { ascending: false }),
        supabase.from("hp_growth_interactions").select("*").order("created_at", { ascending: false }),
      ]);
      for (const result of [p,o,a,i]) if (result.error) throw result.error;
      setPeople((p.data || []) as Person[]); setOpps((o.data || []) as Opportunity[]);
      setActions((a.data || []) as Action[]); setInteractions((i.data || []) as Interaction[]);
    } catch(e) { setError("Could not load Growth Board: " + errorText(e)); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { void refresh(); }, [refresh]);
  const person = people.find(p => p.id === activeId) || null;
  const shown = useMemo(() => people.filter(p => `${p.name} ${p.lane} ${p.source} ${p.notes}`.toLowerCase().includes(search.toLowerCase())), [people,search]);
  const nameOf = (id: string) => people.find(p => p.id === id)?.name || "Unknown person";
  const visibleOpps = useMemo(
    () => opps.filter(o => showTestRecords || !o.is_test),
    [opps, showTestRecords]
  );
  const visibleActions = useMemo(
    () => actions.filter(a =>
      !a.opportunity_id ||
      !opps.some(o => o.id === a.opportunity_id && o.is_test) ||
      showTestRecords
    ),
    [actions, opps, showTestRecords]
  );
  const openActions = useMemo(() => visibleActions.filter(a => a.status === "open").sort((a,b) => (a.due_at ? new Date(a.due_at).getTime() : Number.MAX_SAFE_INTEGER) - (b.due_at ? new Date(b.due_at).getTime() : Number.MAX_SAFE_INTEGER)),[visibleActions]);
  const actionTiming = (a: Action) => {
    if (!a.due_at) return "No date set";
    const day = new Date(a.due_at).toLocaleDateString();
    const d = new Date(a.due_at); const now = new Date();
    const today = new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const dueDay = new Date(d.getFullYear(),d.getMonth(),d.getDate());
    return dueDay < today ? `Overdue · ${day}` : dueDay.getTime() === today.getTime() ? `Today · ${day}` : `Due ${day}`;
  };
  function startForm(type: typeof form, p: Person | null = null) {
    if (p) setActiveId(p.id);
    setForm(type); setEntryText(""); setEntryType(type === "interaction" ? "note" : "");
    setSourceType("memory"); setDueDate(""); setOpportunityId("");
    setPersonName(p?.name || ""); setPersonLane(p?.lane || ""); setPersonSource(p?.source || "");
    setPersonNotes(p?.notes || ""); setPersonPhone(p?.phone || ""); setPersonEmail(p?.email || "");
  }
  async function work(run: () => Promise<void>, success: string) {
    setBusy(true); setError(""); setMessage("");
    try { await run(); await refresh(); setForm(null); setMessage(success); }
    catch (e) { setError(errorText(e)); }
    finally { setBusy(false); }
  }
  async function savePerson() {
    if (!personName.trim()) return setError("Person name is required.");
    await work(async () => {
      const record = { name: personName.trim(), lane: personLane.trim(), source: personSource.trim(), notes: personNotes.trim(), phone: personPhone.trim() || null, email: personEmail.trim() || null };
      const result = form === "edit" && person
        ? await supabase.from("hp_growth_people").update(record).eq("id",person.id)
        : await supabase.from("hp_growth_people").insert({ ...record, owner_id: user!.id });
      if (result.error) throw result.error;
    }, "Person saved.");
  }
  async function saveEntry() {
    if (!activeId || !entryText.trim()) return setError("Choose a person and enter details.");
    await work(async () => {
      let result;
      if (form === "interaction") result = await supabase.from("hp_growth_interactions").insert({ owner_id: user!.id, person_id: activeId, summary: entryText.trim(), kind: entryType, source_type: sourceType });
      else if (form === "opportunity") result = await supabase.from("hp_growth_opportunities").insert({ owner_id: user!.id, person_id: activeId, title: entryText.trim(), status: "exploring" });
      else result = await supabase.from("hp_growth_actions").insert({ owner_id: user!.id, person_id: activeId, opportunity_id: opportunityId || null, title: entryText.trim(), due_at: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : null });
      if (result.error) throw result.error;
    }, "Record saved to Supabase.");
  }
  function choosePerson(id: string) {
    if (id === activeId) return;
    if ((simpleNote.trim() || simpleNext.trim()) && !window.confirm("You have an unsaved update. Switch people and discard this draft?")) return;
    setActiveId(id);
    setSimpleNote(""); setSimpleNext(""); setSimpleDue("");
    setAdvancedOpen(false); setDetailsOpen(false);
    setError(""); setMessage("");
  }

  async function saveSimpleUpdate() {
    if (!user || !person) return setError("Select a person first.");
    const note = simpleNote.trim();
    const next = simpleNext.trim();
    if (!note && !next) return setError("Write what happened or enter a next step.");
    setBusy(true); setError(""); setMessage("");
    let noteSaved = false;
    try {
      if (note) {
        const { error: noteError } = await supabase.from("hp_growth_interactions")
          .insert({ owner_id: user.id, person_id: person.id, summary: note, kind: "note", source_type: "direct" });
        if (noteError) throw noteError;
        noteSaved = true;
        setSimpleNote("");
      }
      if (next) {
        const { error: actionError } = await supabase.from("hp_growth_actions")
          .insert({ owner_id: user.id, person_id: person.id, title: next,
            due_at: simpleDue ? new Date(`${simpleDue}T12:00:00`).toISOString() : null });
        if (actionError) throw actionError;
        setSimpleNext(""); setSimpleDue("");
      }
      await refresh();
      setMessage(note && next ? "Note saved to history and follow-up added." : note ? "Note saved to history." : "Follow-up added.");
    } catch (e) {
      setError((noteSaved ? "Your note was saved, but the follow-up was NOT saved. " : "Could not save. ") + errorText(e));
      if (noteSaved) await refresh();
    } finally { setBusy(false); }
  }

  async function completeAction(action: Action) {
    await work(async () => {
      const { error: e } = await supabase.from("hp_growth_actions").update({ status: "done", completed_at: new Date().toISOString() }).eq("id", action.id);
      if (e) throw e;
      const { error: logError } = await supabase.from("hp_growth_interactions").insert({ owner_id: user!.id, person_id: action.person_id, kind: "outcome", summary: `Completed next action: ${action.title}`, source_type: "direct" });
      if (logError) throw logError;
    }, "Action completed and logged.");
  }
  async function setTestRecord(opp: Opportunity, isTest: boolean) {
    if (!user) return;

    if (isTest && !window.confirm(
      "Mark this opportunity as a test? Its linked actions will be hidden from your active workload. Nothing will be deleted."
    )) return;

    await work(async () => {
      const { error: updateError } = await supabase
        .from("hp_growth_opportunities")
        .update({ is_test: isTest })
        .eq("id", opp.id)
        .eq("owner_id", user.id);

      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from("hp_growth_interactions")
        .insert({
          owner_id: user.id,
          person_id: opp.person_id,
          kind: "observation",
          source_type: "direct",
          summary: (isTest ? "Marked as TEST: " : "Restored from TEST: ") +
            opp.title + ". Original opportunity and follow-up records preserved."
        });

      if (logError) throw logError;
    }, isTest
      ? "Test opportunity preserved and hidden from active work."
      : "Opportunity restored to active work.");
  }

  async function changeOpp(opp: Opportunity, status: string) {
    if (opp.status === status) return;
    await work(async () => {
      const { error: e } = await supabase.from("hp_growth_opportunities").update({status}).eq("id",opp.id);
      if (e) throw e;
      const { error: logError } = await supabase.from("hp_growth_interactions").insert({ owner_id: user!.id, person_id: opp.person_id, kind: "observation", source_type: "direct", summary: `Opportunity status changed: ${opp.title} (${opp.status} → ${status}).` });
      if (logError) throw logError;
    }, "Opportunity updated and logged.");
  }
  async function importStarter() {
    if (!user || people.length) return setError("Starter import is available only when the People table is empty.");
    if (!window.confirm("Import Randy, Michelle and Lorenzi into your private Growth Board?")) return;
    await work(async () => {
      for (const s of starter) {
        const { data: p, error: e } = await supabase.from("hp_growth_people").insert({ owner_id:user.id, name:s.name, lane:s.lane, source:s.source, status:s.status, notes:s.notes, phone:s.key === "lorenzi" ? "+1 (754) 256-7911" : null }).select("id").single();
        if (e) throw e;
        const [o,a,i] = await Promise.all([
          supabase.from("hp_growth_opportunities").insert(s.opp.map(title => ({ owner_id:user.id, person_id:p.id, title }))),
          supabase.from("hp_growth_actions").insert({ owner_id:user.id, person_id:p.id, title:s.next }),
          supabase.from("hp_growth_interactions").insert({ owner_id:user.id, person_id:p.id, summary:s.summary, kind:s.key === "lorenzi" ? "call" : "message", source_type:s.source_type, occurred_at:s.key === "lorenzi" ? "2026-10-09T12:00:00-04:00" : null }),
        ]);
        for (const r of [o,a,i]) if(r.error) throw r.error;
      }
    }, "Three starter relationships imported into Supabase.");
  }
  if (authLoading) return <main style={base}>Checking HomePlanet sign-in...</main>;
  if (!user) return <main style={base}>Sign in to HomePlanet to view the Growth Board.</main>;
  return <main style={base}>
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{...small,letterSpacing:2,color:"#39ff14"}}>HOMEPLANET / GROWTH</div>
      <h1 style={{margin:"9px 0 4px",fontSize:32}}>Your relationships, made simple.</h1>
      <p style={{...small,marginTop:0}}>Remember what happened. Know what to do next.</p>
      {error && <div role="alert" style={{...panel,borderColor:"#bd5151",color:"#ffbaba",marginBottom:12}}>{error}</div>}
      {message && <div role="status" style={{...panel,borderColor:"#348062",marginBottom:12}}>{message}</div>}

      <section style={{...panel,marginTop:16,borderColor:"#315b4c"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div><h2 style={{margin:"0 0 4px",fontSize:20}}>Who needs your attention?</h2><div style={small}>Your real follow-ups, sorted by due date.</div></div>
          <span style={{color:"#39ff14",fontWeight:700}}>{openActions.length} open</span>
        </div>
        {openActions.length===0 ? <p style={small}>You're caught up. No follow-ups waiting.</p> :
          <div style={{display:"grid",gap:9,marginTop:14}}>{openActions.map(a=><div key={a.id} style={{borderTop:"1px solid #303c50",paddingTop:12,display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:200}}><b>{a.title}</b><div style={small}>{nameOf(a.person_id)} · {actionTiming(a)}</div></div>
            <button style={btn} onClick={()=>choosePerson(a.person_id)}>Open Person</button>
          </div>)}</div>}
      </section>

      <section style={{...panel,marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:12}}>
          <h2 style={{margin:0,fontSize:21}}>Your people</h2>
          <button style={green} onClick={()=>startForm("person")}>+ Add Person</button>
        </div>
        <input style={field} aria-label="Find person" placeholder="Find a person or business..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
          {shown.map(p=><button key={p.id} style={activeId===p.id?green:btn} onClick={()=>choosePerson(p.id)}>{p.name}</button>)}
        </div>
        {shown.length===0 && !loading && <p style={small}>No matches. Add a person to get started.</p>}
      </section>

      {person ? <section style={{...panel,marginTop:16,borderColor:"#345b4b"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
          <div><h2 style={{margin:"0 0 4px",fontSize:24}}>{person.name}</h2><div style={small}>{person.lane || "Relationship"} · {person.source || "HomePlanet"}</div></div>
          <button style={btn} onClick={()=>{setAdvancedOpen(true);setForm(null)}}>More Details</button>
        </div>
        <div style={{marginTop:18}}>
          <label htmlFor="simple-growth-note" style={{display:"block",fontWeight:700,marginBottom:8,fontSize:17}}>What happened?</label>
          <textarea id="simple-growth-note" rows={4} style={field} value={simpleNote} onChange={e=>setSimpleNote(e.target.value)} placeholder="Write what you discussed, agreed on, or want to remember..."/>
          <p style={{...small,margin:"6px 0 16px"}}>Your words are saved to this person's dated history. A note is not automatically a new opportunity.</p>
          <label htmlFor="simple-growth-next" style={{display:"block",fontWeight:700,marginBottom:8}}>What's next? <span style={{...small,fontWeight:400}}>(optional)</span></label>
          <input id="simple-growth-next" style={field} value={simpleNext} onChange={e=>setSimpleNext(e.target.value)} placeholder="e.g. Call Michelle to schedule a meeting"/>
          {simpleNext.trim() && <div style={{marginTop:10}}><label htmlFor="simple-growth-due" style={{...small,display:"block",marginBottom:5}}>Follow-up date (optional)</label><input id="simple-growth-due" type="date" style={{...field,maxWidth:220}} value={simpleDue} onChange={e=>setSimpleDue(e.target.value)}/></div>}
          <button style={{...green,background:"#39ff14",color:"#07100a",fontWeight:800,marginTop:14}} disabled={busy || (!simpleNote.trim() && !simpleNext.trim())} onClick={()=>void saveSimpleUpdate()}>{busy?"Saving...":"Save Update"}</button>
        </div>
        <div style={{marginTop:24}}>
          <h3 style={{fontSize:18,marginBottom:8}}>Next steps</h3>
          {visibleActions.filter(a=>a.person_id===person.id && a.status==="open").length===0 ? <p style={small}>No open follow-ups for this person.</p> :
            visibleActions.filter(a=>a.person_id===person.id && a.status==="open").map(a=><div key={a.id} style={{...panel,marginBottom:8,padding:12}}><b>{a.title}</b><div style={small}>{actionTiming(a)}</div><button disabled={busy} style={{...btn,marginTop:9}} onClick={()=>void completeAction(a)}>Mark Done</button></div>)}
          <h3 style={{fontSize:18,margin:"20px 0 8px"}}>Conversation history</h3>
          {interactions.filter(i=>i.person_id===person.id && !isSystemHistory(i)).length===0 ? <p style={small}>No history yet. Save your first note above.</p> :
            interactions.filter(i=>i.person_id===person.id && !isSystemHistory(i)).slice(0,12).map(i=><div key={i.id} style={{borderLeft:"2px solid #348062",paddingLeft:12,marginBottom:14}}><div style={small}>{new Date(i.created_at).toLocaleString()} · {i.kind}</div><div style={{whiteSpace:"pre-wrap",marginTop:3}}>{i.summary}</div></div>)}
          {(person.notes || person.phone || person.email) && <button style={{...btn,marginTop:8}} onClick={()=>setDetailsOpen(v=>!v)}>{detailsOpen?"Hide":"Show"} saved contact details</button>}
          {detailsOpen && <div style={{...panel,marginTop:9}}><p style={{whiteSpace:"pre-wrap"}}>{person.notes}</p>{person.phone&&<p>Phone: {person.phone}</p>}{person.email&&<p>Email: {person.email}</p>}</div>}
        </div>
      </section> : <section style={{...panel,marginTop:16}}><b>Choose a person above to write a note.</b><p style={small}>No confusing categories. Just a conversation and an optional next step.</p></section>}

      <div style={{margin:"20px 0",display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
        <button style={btn} disabled={loading} onClick={()=>void refresh()}>Refresh</button>
        <label style={{...small,display:"flex",gap:8,alignItems:"center"}}><input type="checkbox" checked={showTestRecords} onChange={e=>setShowTestRecords(e.target.checked)}/> Show Test Records ({opps.filter(o=>o.is_test).length})</label>
        {people.length===0 && !loading && <button style={btn} disabled={busy} onClick={()=>void importStarter()}>Import Starter Relationships</button>}
      </div>
      <p style={small}>Existing leads, opportunities, and Truth Chain records are preserved. Use More Details for advanced editing and test-record classification.</p>
    </div>
    {person && advancedOpen && <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.8)",display:"flex",justifyContent:"flex-end"}} onClick={()=>{setAdvancedOpen(false);setForm(null)}}>
      <section role="dialog" aria-modal="true" aria-label={`${person.name} relationship`} onClick={e=>e.stopPropagation()} style={{background:"#101826",width:"min(100%,520px)",overflowY:"auto",padding:18,boxSizing:"border-box"}}>
        <button style={btn} onClick={()=>{setAdvancedOpen(false);setForm(null)}}>← Close</button>
        <h2>{person.name}</h2><p style={small}>{person.lane} · {person.source}</p>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}><button style={btn} onClick={()=>startForm("edit",person)}>Edit</button><button style={green} onClick={()=>startForm("interaction",person)}>+ Interaction</button><button style={btn} onClick={()=>startForm("opportunity",person)}>+ Opportunity</button><button style={btn} onClick={()=>startForm("action",person)}>+ Action</button></div>
        {form && form!=="person" && <div style={{...panel,marginBottom:14}}><h3 style={{marginTop:0}}>{form==="edit"?"Edit Person":form==="interaction"?"Log what happened":form==="action"?"Set next action":"Add opportunity"}</h3><p style={small}>{form==="interaction"?"Capture the conversation or observation. This becomes a timestamped Truth Chain entry.":form==="action"?"What should happen next? Add a date if one is known.":form==="opportunity"?"What door might this relationship open? Keep possibilities separate from confirmed results.":"Update their contact and relationship details."}</p>{form==="edit" ? <div style={{display:"grid",gap:9}}>
          <input style={field} placeholder="Name" aria-label="Name" value={personName} onChange={e=>setPersonName(e.target.value)}/><input style={field} placeholder="Growth lane" aria-label="Growth lane" value={personLane} onChange={e=>setPersonLane(e.target.value)}/><input style={field} placeholder="Relationship origin" aria-label="Relationship origin" value={personSource} onChange={e=>setPersonSource(e.target.value)}/><input style={field} placeholder="Phone" aria-label="Phone" value={personPhone} onChange={e=>setPersonPhone(e.target.value)}/><input style={field} placeholder="Email" aria-label="Email" value={personEmail} onChange={e=>setPersonEmail(e.target.value)}/><textarea style={field} rows={3} placeholder="Notes" aria-label="Notes" value={personNotes} onChange={e=>setPersonNotes(e.target.value)}/>
        </div> : <div style={{display:"grid",gap:9}}>
          <label htmlFor="growth-entry-text" style={{...small,fontWeight:700,color:"#e8f1fc"}}>{form==="interaction"?"What happened?":form==="opportunity"?"What is the opportunity?":"What needs to happen next?"}</label>
          <textarea id="growth-entry-text" style={field} rows={4} placeholder={form==="interaction"?"Summarize the call, message, meeting, or observation...":form==="opportunity"?"e.g. Restaurant owner introduction":"e.g. Call to confirm Thursday lunch"} value={entryText} onChange={e=>setEntryText(e.target.value)}/>
          {form==="interaction" && <><label style={small}>Interaction type</label><select style={field} value={entryType} onChange={e=>setEntryType(e.target.value)}>{["note","call","meeting","message","introduction","observation","outcome"].map(x=><option key={x} value={x}>{x[0].toUpperCase()+x.slice(1)}</option>)}</select><label style={small}>How do you know this? (Evidence source)</label><select style={field} value={sourceType} onChange={e=>setSourceType(e.target.value)}>{[["memory","Reconstructed from memory"],["direct","Direct observation"],["document","Saved message or document"],["recording","Recorded with consent"]].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></>}
          {form==="action" && <><label style={small}>Due date (optional)</label><input type="date" style={field} value={dueDate} onChange={e=>setDueDate(e.target.value)}/><label style={small}>Related opportunity (optional)</label><select style={field} value={opportunityId} onChange={e=>setOpportunityId(e.target.value)}><option value="">None</option>{opps.filter(o=>o.person_id===person.id).map(o=><option key={o.id} value={o.id}>{o.title}</option>)}</select></>}
        </div>}
        <div style={{display:"flex",gap:8,marginTop:10}}><button style={green} disabled={busy} onClick={()=>void (form==="edit"?savePerson():saveEntry())}>{busy?"Saving...":"Save to Supabase"}</button><button style={btn} onClick={()=>setForm(null)}>Cancel</button></div></div>}
        <h3>Relationship</h3><p style={small}>{person.notes || "No notes yet."}</p>{person.phone && <p style={small}>Phone: {person.phone}</p>}{person.email && <p style={small}>Email: {person.email}</p>}
        <h3>Next Actions</h3><p style={small}>Open actions appear first. Use “Mark Done” only after the work actually happened.</p>{visibleActions.filter(x=>x.person_id===person.id).sort((a,b)=>Number(a.status!=="open")-Number(b.status!=="open")).map(a=><div key={a.id} style={{...panel,marginBottom:8}}><b>{a.title}</b><div style={small}>{a.status === "open" ? actionTiming(a) : a.status}</div>{a.status==="open"&&<button style={{...green,marginTop:8}} disabled={busy} onClick={()=>void completeAction(a)}>Mark Done</button>}</div>)}
        <h3>Opportunities</h3>{visibleOpps.filter(x=>x.person_id===person.id).map(o=><div key={o.id} style={{...panel,marginBottom:8}}><b>{o.title}</b><div style={small}>Current stage: {o.status}</div><label style={{...small,display:"block",marginTop:8}}>Update opportunity stage</label><select aria-label={`Stage for ${o.title}`} style={{...field,marginTop:4}} disabled={busy} value={o.status} onChange={e=>void changeOpp(o,e.target.value)}>{["exploring","contacted","meeting","active","won","lost","on_hold"].map(stage=><option key={stage} value={stage}>{stage}</option>)}</select><button
      style={{...btn,marginTop:8}}
      disabled={busy}
      onClick={()=>void setTestRecord(o,!o.is_test)}
    >{o.is_test?"Restore to Active":"Mark as Test"}</button></div>)}
        <h3>Truth Chain — Interaction History</h3>{interactions.filter(x=>x.person_id===person.id).map(i=><div key={i.id} style={{borderLeft:"2px solid #438f6b",paddingLeft:12,marginBottom:15}}><div style={small}>{i.kind} · {i.source_type} · {new Date(i.created_at).toLocaleString()}</div><div>{i.summary}</div></div>)}
      </section></div>}
    {form==="person" && <div style={{position:"fixed",inset:0,zIndex:1200,background:"rgba(0,0,0,.85)",display:"flex",justifyContent:"center",alignItems:"flex-start",overflowY:"auto",padding:18}}><section role="dialog" aria-modal="true" aria-label="Add person" style={{...panel,width:"min(100%,520px)",marginTop:30}}><h2>New Relationship</h2><div style={{display:"grid",gap:10}}><input style={field} value={personName} onChange={e=>setPersonName(e.target.value)} placeholder="Full name *" aria-label="Full name"/><input style={field} value={personLane} onChange={e=>setPersonLane(e.target.value)} placeholder="Growth lane" aria-label="Growth lane"/><input style={field} value={personSource} onChange={e=>setPersonSource(e.target.value)} placeholder="How we connected" aria-label="How we connected"/><input style={field} value={personPhone} onChange={e=>setPersonPhone(e.target.value)} placeholder="Phone" aria-label="Phone"/><input style={field} value={personEmail} onChange={e=>setPersonEmail(e.target.value)} placeholder="Email" aria-label="Email"/><textarea style={field} value={personNotes} onChange={e=>setPersonNotes(e.target.value)} rows={4} placeholder="Relationship notes" aria-label="Relationship notes"/></div><div style={{display:"flex",gap:8,marginTop:12}}><button style={green} disabled={busy} onClick={()=>void savePerson()}>{busy?"Saving...":"Save Person"}</button><button style={btn} onClick={()=>setForm(null)}>Cancel</button></div>{error && <p style={{color:"#ffaaaa"}} role="alert">{error}</p>}</section></div>}
  </main>;
}
